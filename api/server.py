import base64
import tempfile
import logging
from typing import Dict
from modal import Image, Stub, web_endpoint
from fastapi.responses import StreamingResponse
import json

# Define the GPU type to be used for processing
GPU_TYPE = "T4"
SAMPLING_RATE = 16000
MODEL_SIZE = "large-v3"


def download_models():
    """
    Downloads and initializes models required for speech processing, including a translator model and a VAD (Voice Activity Detection) model.
    """
    from seamless_communication.inference import Translator
    from faster_whisper import WhisperModel
    import torch
    import whisperx
    import whisper

    # Define model names for the translator and vocoder
    model_name = "seamlessM4T_v2_large"
    vocoder_name = (
        "vocoder_v2" if model_name == "seamlessM4T_v2_large" else "vocoder_36langs"
    )

    # Initialize the translator model with specified parameters
    Translator(
        model_name,
        vocoder_name,
        device=torch.device("cuda:0"),
        dtype=torch.float16,
    )

    # Load the silero-VAD model from the specified repository
    USE_ONNX = False
    torch.hub.load(repo_or_dir="snakers4/silero-vad", model="silero_vad", onnx=USE_ONNX)

    # Download faster-whisper
    # Run on GPU with FP16
    WhisperModel(MODEL_SIZE, device="cuda", compute_type="float16")

    # Download whisperX model
    whisperx.load_model(MODEL_SIZE, "cuda", compute_type="float16")

    # Download vegam-whisper
    WhisperModel(
        "kurianbenoy/vegam-whisper-medium-ml-fp16",
        device="cuda",
        compute_type="float16",
    )

    whisper.load_model("base")


def base64_to_audio_file(b64_contents: str):
    """
    Converts a base64 encoded string to an audio file and returns the path to the temporary audio file.

    Parameters:
    - b64_contents (str): Base64 encoded string of the audio file.

    Returns:
    - str: Path to the temporary audio file.
    """
    # Decode the base64 string to audio data
    audio_data = base64.b64decode(b64_contents)

    # Create a temporary file to store the audio data
    with tempfile.NamedTemporaryFile(delete=False, suffix=".wav") as tmp_file:
        tmp_file.write(audio_data)
        return tmp_file.name


def convert_to_mono_16k(input_file: str, output_file: str) -> None:
    """
    Converts an audio file to mono channel with a sample rate of 16000 Hz.

    Parameters:
    - input_file (str): Path to the input audio file.
    - output_file (str): Path where the converted audio file will be saved.
    """
    from pydub import AudioSegment

    try:

        print("input file = ", input_file)
        sound = AudioSegment.from_file(input_file)
        sound = sound.set_channels(1).set_frame_rate(16000)
        sound.export(output_file, format="wav")
    except Exception as e:
        print("error in converting...", e)


def whisper_language_detection(fname):
    import whisper

    print("loading whisper")
    model = whisper.load_model("base")

    # load audio and pad/trim it to fit 30 seconds
    print(fname)
    audio = whisper.load_audio(fname)
    audio = whisper.pad_or_trim(audio)

    # make log-Mel spectrogram and move to the same device as the model
    mel = whisper.log_mel_spectrogram(audio).to(model.device)

    # detect the spoken language
    _, probs = model.detect_language(mel)
    print(f"Detected language: {max(probs, key=probs.get)}")
    return {"detected_language": max(probs, key=probs.get)}


# Define the Docker image configuration for the processing environment
image = (
    Image.from_registry(
        "nvidia/cuda:11.8.0-cudnn8-runtime-ubuntu22.04", add_python="3.10"
    )
    .apt_install("git", "ffmpeg")
    .pip_install(
        "fairseq2==0.2.*",
        "sentencepiece",
        "pydub",
        "ffmpeg-python",
        "torch==2.1.1",
        "seamless_communication @ git+https://github.com/facebookresearch/seamless_communication.git",  # torchaudio already included in seamless_communication
    )
    .pip_install(
        "faster-whisper @ https://github.com/guillaumekln/faster-whisper/archive/refs/heads/master.tar.gz"
    )
    .pip_install("whisperx @ git+https://github.com/m-bain/whisperx.git")
    .pip_install("pytube==15.0.0")
    .pip_install("openai-whisper==20231117")
    .run_function(download_models, gpu=GPU_TYPE)
)

# Initialize the processing stub with the defined Docker image
stub = Stub(name="seamless_m4t_speech", image=image)


# Timeout in 20 minutes
@stub.function(gpu=GPU_TYPE, timeout=600)
@web_endpoint(method="POST")
def detect_language(item: Dict):
    print("detecting audio")
    b64 = item["wav_base64"]
    fname = base64_to_audio_file(b64_contents=b64)
    print(fname)
    convert_to_mono_16k(fname, "audio_detct_sample.wav")
    print("converted to mono")
    detcted_lang = whisper_language_detection("audio_detct_sample.wav")
    print(detcted_lang)
    return json.dumps(detcted_lang)


# Timeout in 20 minutes
@stub.function(gpu=GPU_TYPE, timeout=1200)
@web_endpoint(method="POST")
def generate_seamlessm4t_speech(item: Dict):
    """
    Processes the input speech audio, performs voice activity detection, and translates the speech from the source language to the target language.

    Parameters:
    - item (Dict): A dictionary containing the base64 encoded audio data, source language, and target language.

    Returns:
    - Dict: A dictionary containing the status code, message, detected speech chunks, and the translated text.
    """
    # import wave
    import os
    import time

    import torch
    import torchaudio
    from pydub import AudioSegment
    from seamless_communication.inference import Translator

    try:
        # print(f"Payload: {item}")
        USE_ONNX = False
        model, utils = torch.hub.load(
            repo_or_dir="snakers4/silero-vad", model="silero_vad", onnx=USE_ONNX
        )

        (
            get_speech_timestamps,
            save_audio,
            read_audio,
            VADIterator,
            collect_chunks,
        ) = utils

        # Decode the base64 audio and convert it for processing
        b64 = item["wav_base64"]
        # source_lang = item["source"]
        # print(f"Target_lang: {item.get('target')}")
        target_lang = item["target"]

        fname = base64_to_audio_file(b64_contents=b64)
        convert_to_mono_16k(fname, "output.wav")

        # Perform voice activity detection on the processed audio
        wav = read_audio("output.wav", sampling_rate=SAMPLING_RATE)

        # get speech timestamps from full audio file
        speech_timestamps_seconds = get_speech_timestamps(
            wav, model, sampling_rate=SAMPLING_RATE, return_seconds=True
        )
        print(speech_timestamps_seconds)
        # translator = download_models()
        start = time.perf_counter()
        model_name = "seamlessM4T_v2_large"
        vocoder_name = (
            "vocoder_v2" if model_name == "seamlessM4T_v2_large" else "vocoder_36langs"
        )

        translator = Translator(
            model_name,
            vocoder_name,
            device=torch.device("cuda:0"),
            dtype=torch.float16,
        )

        duration = time.perf_counter() - start
        print(f"Duration to load model is: {duration}")

        # Replace t1, t2 with VAD time
        timestamps_start = []
        timestamps_end = []
        text = []

        async def generate():
            # Logic for VAD based filtering
            for item in speech_timestamps_seconds:
                s = item["start"]
                e = item["end"]

                timestamps_start.append(s)
                timestamps_end.append(e)
                newAudio = AudioSegment.from_wav("output.wav")

                # time in seconds should be multiplied by 1000.0 for AudioSegment array. So 20s = 20000
                newAudio = newAudio[s * 1000 : e * 1000]
                new_audio_name = "new_" + str(s) + ".wav"
                newAudio.export(new_audio_name, format="wav")
                waveform, sample_rate = torchaudio.load(new_audio_name)
                resampler = torchaudio.transforms.Resample(
                    sample_rate, SAMPLING_RATE, dtype=waveform.dtype
                )
                resampled_waveform = resampler(waveform)
                torchaudio.save("resampled.wav", resampled_waveform, SAMPLING_RATE)
                translated_text, _ = translator.predict(
                    "resampled.wav", "s2tt", target_lang
                )
                # print(translated_text)
                text.append(str(translated_text[0]))
                os.remove(new_audio_name)
                os.remove("resampled.wav")
                obj = {
                    "start": s,
                    "end": e,
                    "text": str(translated_text[0]),
                }
                print(obj)
                yield json.dumps(obj)

        return StreamingResponse(generate(), media_type="text/event-stream")

    except Exception as e:
        print(e)
        logging.critical(e, exc_info=True)
        return {"message": "Internal server error", "code": 500}


def sliding_window_approch_timestamps(speech_timestamps_seconds):
    """
    Groups speech timestamps into chunks using a sliding window approach.

    Parameters:
    - speech_timestamps_seconds (list): List of speech timestamps in seconds.

    Returns:
    - list: List of grouped speech timestamps.
    """
    chunk_len = 3  # Define the length of each chunk
    length_speech_timestamps = len(
        speech_timestamps_seconds
    )  # Get the total number of timestamps
    group_chunks = []  # Initialize the list to store the grouped chunks

    # Loop over the timestamps with a step size equal to the chunk length
    for i in range(0, length_speech_timestamps, chunk_len):
        # Append the current chunk to the list of grouped chunks
        group_chunks.append(speech_timestamps_seconds[i : i + chunk_len])

    new_group_chunks = []  # Initialize the list to store the new grouped chunks

    # Loop over the grouped chunks
    for item in group_chunks:
        # Append the start and end of each chunk to the list of new grouped chunks
        new_group_chunks.append(
            {"start": item[0]["start"], "end": item[len(item) - 1]["end"]}
        )

    return new_group_chunks  # Return the list of new grouped chunks


@stub.function(gpu=GPU_TYPE, timeout=600)
@web_endpoint(method="POST")
def generate_faster_whisper_speech(item: Dict):
    """
    Processes the input speech audio and translates the speech to the target language using faster-whisper.

    Parameters:
    - item (Dict): A dictionary containing the base64 encoded audio data and target language.

    Returns:
    - Dict: A dictionary containing the status code, message, detected speech chunks, and the translated text.
    """
    import os
    import torch
    import torchaudio
    from pydub import AudioSegment
    from faster_whisper import WhisperModel

    try:
        # Decode the base64 audio and convert it for processing
        b64 = item["wav_base64"]
        target_lang = item["target"]

        # print(torch.cuda.is_available())
        fname = base64_to_audio_file(b64_contents=b64)
        print(fname)
        convert_to_mono_16k(fname, "output.wav")

        USE_ONNX = False
        model, utils = torch.hub.load(
            repo_or_dir="snakers4/silero-vad", model="silero_vad", onnx=USE_ONNX
        )

        (
            get_speech_timestamps,
            save_audio,
            read_audio,
            VADIterator,
            collect_chunks,
        ) = utils

        # Perform voice activity detection on the processed audio
        wav = read_audio("output.wav", sampling_rate=SAMPLING_RATE)

        # get speech timestamps from full audio file
        speech_timestamps_seconds = get_speech_timestamps(
            wav, model, sampling_rate=SAMPLING_RATE, return_seconds=True
        )
        print(speech_timestamps_seconds)

        grouped_timestamps = sliding_window_approch_timestamps(
            speech_timestamps_seconds
        )
        print(grouped_timestamps)

        model = WhisperModel(MODEL_SIZE, device="cuda", compute_type="float16")

        async def generate():
            for segment in grouped_timestamps:
                s = segment["start"]
                e = segment["end"]

                newAudio = AudioSegment.from_wav("output.wav")

                newAudio = newAudio[s * 1000 : e * 1000]
                new_audio_name = "new_" + str(s) + ".wav"
                newAudio.export(new_audio_name, format="wav")
                waveform, sample_rate = torchaudio.load(new_audio_name)
                resampler = torchaudio.transforms.Resample(
                    sample_rate, SAMPLING_RATE, dtype=waveform.dtype
                )
                resampled_waveform = resampler(waveform)
                torchaudio.save("resampled.wav", resampled_waveform, SAMPLING_RATE)

                segments, info = model.transcribe(
                    "resampled.wav",
                    beam_size=5,
                    language=target_lang,
                )

                os.remove(new_audio_name)
                os.remove("resampled.wav")

                for segment in segments:
                    obj = {
                        "start": s + segment.start,
                        "end": s + segment.end,
                        "text": segment.text,
                    }
                    print(obj)
                    yield json.dumps(obj)

        return StreamingResponse(generate(), media_type="text/event-stream")

    except Exception as e:
        print(e)
        logging.critical(e, exc_info=True)
        return {"message": "Internal server error", "code": 500}


# @stub.function(gpu=GPU_TYPE, timeout=1200)
# @web_endpoint(method="POST")
# def generate_vegam_faster_whisper(item: Dict):
#     import os
#     import torch
#     import torchaudio
#     from pydub import AudioSegment
#     from faster_whisper import WhisperModel

#     try:
#         b64 = item["wav_base64"]
#         target_lang = item["target"]

#         # print(torch.cuda.is_available())
#         fname = base64_to_audio_file(b64_contents=b64)
#         convert_to_mono_16k(fname, "output.wav")

#         USE_ONNX = False
#         model, utils = torch.hub.load(
#             repo_or_dir="snakers4/silero-vad", model="silero_vad", onnx=USE_ONNX
#         )

#         (
#             get_speech_timestamps,
#             save_audio,
#             read_audio,
#             VADIterator,
#             collect_chunks,
#         ) = utils

#         # Perform voice activity detection on the processed audio
#         wav = read_audio("output.wav", sampling_rate=SAMPLING_RATE)

#         # get speech timestamps from full audio file
#         speech_timestamps_seconds = get_speech_timestamps(
#             wav, model, sampling_rate=SAMPLING_RATE, return_seconds=True
#         )
#         print(speech_timestamps_seconds)

#         grouped_timestamps = sliding_window_approch_timestamps(
#             speech_timestamps_seconds
#         )
#         print(grouped_timestamps)

#         model = WhisperModel(
#             "kurianbenoy/vegam-whisper-medium-ml-fp16",
#             device="cuda",
#             compute_type="float16",
#         )

#         async def generate():
#             for segment in grouped_timestamps:
#                 s = segment["start"]
#                 e = segment["end"]

#                 newAudio = AudioSegment.from_wav("output.wav")

#                 newAudio = newAudio[s * 1000 : e * 1000]
#                 new_audio_name = "new_" + str(s) + ".wav"
#                 newAudio.export(new_audio_name, format="wav")
#                 waveform, sample_rate = torchaudio.load(new_audio_name)
#                 resampler = torchaudio.transforms.Resample(
#                     sample_rate, SAMPLING_RATE, dtype=waveform.dtype
#                 )
#                 resampled_waveform = resampler(waveform)
#                 torchaudio.save("resampled.wav", resampled_waveform, SAMPLING_RATE)

#                 segments, info = model.transcribe(
#                     "resampled.wav",
#                     beam_size=5,
#                     language=target_lang,
#                 )

#                 os.remove(new_audio_name)
#                 os.remove("resampled.wav")

#                 for segment in segments:
#                     obj = {
#                         "start": s + segment.start,
#                         "end": s + segment.end,
#                         "text": segment.text,
#                     }
#                     print(obj)
#                     yield json.dumps(obj)

#         return StreamingResponse(generate(), media_type="text/event-stream")

#     except Exception as e:
#         print(e)
#         logging.critical(e, exc_info=True)
#         return {"message": "Internal server error", "code": 500}


# @stub.function(gpu=GPU_TYPE, timeout=600)
# @web_endpoint(method="POST")
# def generate_whisperx_speech(item: Dict):
#     """
#     Processes the input speech audio and translates the speech to the target language using faster-whisper.

#     Parameters:
#     - item (Dict): A dictionary containing the base64 encoded audio data and target language.

#     Returns:
#     - Dict: A dictionary containing the status code, message, detected speech chunks, and the translated text.
#     """
#     import torch
#     import torchaudio
#     import whisperx
#     from pydub import AudioSegment

#     try:
#         b64 = item["wav_base64"]
#         target_lang = item["target"]

#         fname = base64_to_audio_file(b64_contents=b64)
#         print(fname)
#         convert_to_mono_16k(fname, "output.wav")

#         USE_ONNX = False
#         model, utils = torch.hub.load(
#             repo_or_dir="snakers4/silero-vad", model="silero_vad", onnx=USE_ONNX
#         )

#         (
#             get_speech_timestamps,
#             save_audio,
#             read_audio,
#             VADIterator,
#             collect_chunks,
#         ) = utils

#         # Perform voice activity detection on the processed audio
#         wav = read_audio("output.wav", sampling_rate=SAMPLING_RATE)

#         # get speech timestamps from full audio file
#         speech_timestamps_seconds = get_speech_timestamps(
#             wav, model, sampling_rate=SAMPLING_RATE, return_seconds=True
#         )
#         print(speech_timestamps_seconds)

#         grouped_timestamps = sliding_window_approch_timestamps(
#             speech_timestamps_seconds
#         )
#         print(grouped_timestamps)

#         model = whisperx.load_model(
#             MODEL_SIZE, "cuda", compute_type="float16", language=target_lang
#         )

#         async def generate():
#             for segment in grouped_timestamps:
#                 s = segment["start"]
#                 e = segment["end"]
#                 newAudio = AudioSegment.from_wav("output.wav")

#                 newAudio = newAudio[s * 1000 : e * 1000]
#                 new_audio_name = "new_" + str(s) + ".wav"
#                 newAudio.export(new_audio_name, format="wav")
#                 waveform, sample_rate = torchaudio.load(new_audio_name)
#                 resampler = torchaudio.transforms.Resample(
#                     sample_rate, SAMPLING_RATE, dtype=waveform.dtype
#                 )
#                 resampled_waveform = resampler(waveform)
#                 torchaudio.save("resampled.wav", resampled_waveform, SAMPLING_RATE)

#                 audio = whisperx.load_audio("resampled.wav")
#                 result = model.transcribe(audio, batch_size=16)
#                 model_a, metadata = whisperx.load_align_model(
#                     language_code=target_lang, device="cuda"
#                 )

#                 result = whisperx.align(
#                     result["segments"],
#                     model_a,
#                     metadata,
#                     audio,
#                     "cuda",
#                     return_char_alignments=False,
#                 )

#                 # print(result["segments"])

#                 for segment in result["segments"]:
#                     obj = {
#                         "start": segment["start"] + s,
#                         "end": segment["end"] + s,
#                         "text": segment["text"],
#                     }
#                     print(obj)
#                     yield json.dumps(obj)

#         return StreamingResponse(generate(), media_type="text/event-stream")

#     except Exception as e:
#         print(e)
#         logging.critical(e, exc_info=True)
#         return {"message": "Internal server error", "code": 500}


# Timeout in 20 minutes
@stub.function(gpu=GPU_TYPE, timeout=1200)
@web_endpoint(method="POST")
def youtube_generate_seamlessm4t_speech(item: Dict):
    """
    Processes the input speech audio, performs voice activity detection, and translates the speech from the source language to the target language.

    Parameters:
    - item (Dict): A dictionary containing the base64 encoded audio data, source language, and target language.

    Returns:
    - Dict: A dictionary containing the status code, message, detected speech chunks, and the translated text.
    """
    # import wave
    import os
    import time

    import torch
    import torchaudio
    from pytube import YouTube
    from pydub import AudioSegment
    from seamless_communication.inference import Translator

    try:
        # print(f"Payload: {item}")
        USE_ONNX = False
        model, utils = torch.hub.load(
            repo_or_dir="snakers4/silero-vad", model="silero_vad", onnx=USE_ONNX
        )

        (
            get_speech_timestamps,
            save_audio,
            read_audio,
            VADIterator,
            collect_chunks,
        ) = utils

        # Decode the base64 audio and convert it for processing
        yt_id = item["yt_id"]
        # source_lang = item["source"]
        # print(f"Target_lang: {item.get('target')}")
        target_lang = item["target"]

        # Download YouTube video
        youtube_url = f"https://www.youtube.com/watch?v={yt_id}"
        youtube = YouTube(youtube_url)
        video = youtube.streams.filter(only_audio=True).first()
        video.download(filename="temp_video.mp4")

        # Convert video to wav
        audio = AudioSegment.from_file("temp_video.mp4", format="mp4")
        audio.export("temp_audio.wav", format="wav")

        # Convert audio to mono channel with 16K frequency
        audio = AudioSegment.from_wav("temp_audio.wav")
        audio = audio.set_channels(1).set_frame_rate(16000)
        audio.export("output.wav", format="wav")

        # fname = base64_to_audio_file(b64_contents=b64)
        # convert_to_mono_16k(fname, "output.wav")

        # Perform voice activity detection on the processed audio
        wav = read_audio("output.wav", sampling_rate=SAMPLING_RATE)

        # get speech timestamps from full audio file
        speech_timestamps_seconds = get_speech_timestamps(
            wav, model, sampling_rate=SAMPLING_RATE, return_seconds=True
        )
        print(speech_timestamps_seconds)
        # translator = download_models()
        start = time.perf_counter()
        model_name = "seamlessM4T_v2_large"
        vocoder_name = (
            "vocoder_v2" if model_name == "seamlessM4T_v2_large" else "vocoder_36langs"
        )

        translator = Translator(
            model_name,
            vocoder_name,
            device=torch.device("cuda:0"),
            dtype=torch.float16,
        )

        duration = time.perf_counter() - start
        print(f"Duration to load model is: {duration}")

        # Replace t1, t2 with VAD time
        timestamps_start = []
        timestamps_end = []
        text = []

        async def generate():
            for item in speech_timestamps_seconds:
                s = item["start"]
                e = item["end"]

                timestamps_start.append(s)
                timestamps_end.append(e)
                newAudio = AudioSegment.from_wav("output.wav")

                # time in seconds should be multiplied by 1000.0 for AudioSegment array. So 20s = 20000
                newAudio = newAudio[s * 1000 : e * 1000]
                new_audio_name = "new_" + str(s) + ".wav"
                newAudio.export(new_audio_name, format="wav")
                waveform, sample_rate = torchaudio.load(new_audio_name)
                resampler = torchaudio.transforms.Resample(
                    sample_rate, SAMPLING_RATE, dtype=waveform.dtype
                )
                resampled_waveform = resampler(waveform)
                torchaudio.save("resampled.wav", resampled_waveform, SAMPLING_RATE)
                translated_text, _ = translator.predict(
                    "resampled.wav", "s2tt", target_lang
                )
                # print(translated_text)
                text.append(str(translated_text[0]))
                os.remove(new_audio_name)
                os.remove("resampled.wav")

                obj = {
                    "start": s,
                    "end": e,
                    "text": str(translated_text[0]),
                }
                print(obj)
                yield json.dumps(obj)

        return StreamingResponse(generate(), media_type="text/event-stream")

    except Exception as e:
        print(e)
        logging.critical(e, exc_info=True)
        return {"message": "Internal server error", "code": 500}


# Timeout in 20 minutes
@stub.function(gpu=GPU_TYPE, timeout=1200)
@web_endpoint(method="POST")
def youtube_generate_faster_whisper_speech(item: Dict):
    """
    Processes the input speech audio, performs voice activity detection, and translates the speech from the source language to the target language.

    Parameters:
    - item (Dict): A dictionary containing the base64 encoded audio data, source language, and target language.

    Returns:
    - Dict: A dictionary containing the status code, message, detected speech chunks, and the translated text.
    """
    import os

    import torch
    import torchaudio

    from faster_whisper import WhisperModel
    from pydub import AudioSegment
    from pytube import YouTube

    try:
        yt_id = item["yt_id"]
        target_lang = item["target"]

        # Download YouTube video
        youtube_url = f"https://www.youtube.com/watch?v={yt_id}"
        youtube = YouTube(youtube_url)
        video = youtube.streams.filter(only_audio=True).first()
        video.download(filename="temp_video.mp4")

        # Convert video to wav
        audio = AudioSegment.from_file("temp_video.mp4", format="mp4")
        audio.export("temp_audio.wav", format="wav")

        # Convert audio to mono channel with 16K frequency
        audio = AudioSegment.from_wav("temp_audio.wav")
        audio = audio.set_channels(1).set_frame_rate(16000)
        audio.export("output.wav", format="wav")

        USE_ONNX = False
        model, utils = torch.hub.load(
            repo_or_dir="snakers4/silero-vad", model="silero_vad", onnx=USE_ONNX
        )

        (
            get_speech_timestamps,
            save_audio,
            read_audio,
            VADIterator,
            collect_chunks,
        ) = utils

        # Perform voice activity detection on the processed audio
        wav = read_audio("output.wav", sampling_rate=SAMPLING_RATE)

        # get speech timestamps from full audio file
        speech_timestamps_seconds = get_speech_timestamps(
            wav, model, sampling_rate=SAMPLING_RATE, return_seconds=True
        )
        print(speech_timestamps_seconds)

        grouped_timestamps = sliding_window_approch_timestamps(
            speech_timestamps_seconds
        )
        print(grouped_timestamps)

        model = WhisperModel(MODEL_SIZE, device="cuda", compute_type="float16")
        print(model)

        async def generate():
            for segment in grouped_timestamps:
                s = segment["start"]
                e = segment["end"]
                # print(s, e)
                newAudio = AudioSegment.from_wav("output.wav")

                newAudio = newAudio[s * 1000 : e * 1000]
                new_audio_name = "new_" + str(s) + ".wav"
                newAudio.export(new_audio_name, format="wav")
                waveform, sample_rate = torchaudio.load(new_audio_name)
                resampler = torchaudio.transforms.Resample(
                    sample_rate, SAMPLING_RATE, dtype=waveform.dtype
                )
                resampled_waveform = resampler(waveform)
                torchaudio.save("resampled.wav", resampled_waveform, SAMPLING_RATE)

                segments, info = model.transcribe(
                    "resampled.wav",
                    beam_size=5,
                    language=target_lang,
                )

                os.remove(new_audio_name)
                os.remove("resampled.wav")

                for segment in segments:
                    obj = {
                        "start": s + segment.start,
                        "end": s + segment.end,
                        "text": segment.text,
                    }
                    print(obj)
                    yield json.dumps(obj)

        return StreamingResponse(generate(), media_type="text/event-stream")

    except Exception as e:
        print(e)
        logging.critical(e, exc_info=True)
        return {"message": "Internal server error", "code": 500}


@stub.function(gpu=GPU_TYPE, timeout=1200)
@web_endpoint(method="POST")
def youtube_generate_vegam_faster_whisper(item: Dict):
    import os
    import torch
    import torchaudio
    from pydub import AudioSegment
    from pytube import YouTube
    from faster_whisper import WhisperModel

    try:
        yt_id = item["yt_id"]
        target_lang = item["target"]

        # Download YouTube video
        youtube_url = f"https://www.youtube.com/watch?v={yt_id}"
        youtube = YouTube(youtube_url)
        video = youtube.streams.filter(only_audio=True).first()
        video.download(filename="temp_video.mp4")

        # Convert video to wav
        audio = AudioSegment.from_file("temp_video.mp4", format="mp4")
        audio.export("temp_audio.wav", format="wav")

        # Convert audio to mono channel with 16K frequency
        audio = AudioSegment.from_wav("temp_audio.wav")
        audio = audio.set_channels(1).set_frame_rate(16000)
        audio.export("output.wav", format="wav")

        USE_ONNX = False
        model, utils = torch.hub.load(
            repo_or_dir="snakers4/silero-vad", model="silero_vad", onnx=USE_ONNX
        )

        (
            get_speech_timestamps,
            save_audio,
            read_audio,
            VADIterator,
            collect_chunks,
        ) = utils

        # Perform voice activity detection on the processed audio
        wav = read_audio("output.wav", sampling_rate=SAMPLING_RATE)

        # get speech timestamps from full audio file
        speech_timestamps_seconds = get_speech_timestamps(
            wav, model, sampling_rate=SAMPLING_RATE, return_seconds=True
        )
        print(speech_timestamps_seconds)

        grouped_timestamps = sliding_window_approch_timestamps(
            speech_timestamps_seconds
        )
        print(grouped_timestamps)

        model = WhisperModel(
            "kurianbenoy/vegam-whisper-medium-ml-fp16",
            device="cuda",
            compute_type="float16",
        )

        async def generate():
            for segment in grouped_timestamps:
                s = segment["start"]
                e = segment["end"]
                # print(s, e)
                # print("ENTER loop")
                newAudio = AudioSegment.from_wav("output.wav")

                newAudio = newAudio[s * 1000 : e * 1000]
                new_audio_name = "new_" + str(s) + ".wav"
                newAudio.export(new_audio_name, format="wav")
                waveform, sample_rate = torchaudio.load(new_audio_name)
                resampler = torchaudio.transforms.Resample(
                    sample_rate, SAMPLING_RATE, dtype=waveform.dtype
                )
                resampled_waveform = resampler(waveform)
                torchaudio.save("resampled.wav", resampled_waveform, SAMPLING_RATE)

                segments, info = model.transcribe(
                    "resampled.wav",
                    beam_size=5,
                    language=target_lang,
                )

                os.remove(new_audio_name)
                os.remove("resampled.wav")

                for segment in segments:
                    obj = {
                        "start": s + segment.start,
                        "end": s + segment.end,
                        "text": segment.text,
                    }
                    print(obj)
                    yield json.dumps(obj)

        return StreamingResponse(generate(), media_type="text/event-stream")

    except Exception as e:
        print(e)
        logging.critical(e, exc_info=True)
        return {"message": "Internal server error", "code": 500}


@stub.function(gpu=GPU_TYPE, timeout=600)
@web_endpoint(method="POST")
def youtube_generate_whisperx_speech(item: Dict):
    """
    Processes the input speech audio and translates the speech to the target language using faster-whisper.

    Parameters:
    - item (Dict): A dictionary containing the base64 encoded audio data and target language.

    Returns:
    - Dict: A dictionary containing the status code, message, detected speech chunks, and the translated text.
    """
    import torch
    import torchaudio
    import whisperx
    from pytube import YouTube
    from pydub import AudioSegment

    try:
        yt_id = item["yt_id"]
        target_lang = item["target"]

        # Download YouTube video
        youtube_url = f"https://www.youtube.com/watch?v={yt_id}"
        youtube = YouTube(youtube_url)
        video = youtube.streams.filter(only_audio=True).first()
        video.download(filename="temp_video.mp4")

        # Convert video to wav
        audio = AudioSegment.from_file("temp_video.mp4", format="mp4")
        audio.export("temp_audio.wav", format="wav")

        # Convert audio to mono channel with 16K frequency
        audio = AudioSegment.from_wav("temp_audio.wav")
        audio = audio.set_channels(1).set_frame_rate(16000)
        audio.export("output.wav", format="wav")

        USE_ONNX = False
        model, utils = torch.hub.load(
            repo_or_dir="snakers4/silero-vad", model="silero_vad", onnx=USE_ONNX
        )

        (
            get_speech_timestamps,
            save_audio,
            read_audio,
            VADIterator,
            collect_chunks,
        ) = utils

        # Perform voice activity detection on the processed audio
        wav = read_audio("output.wav", sampling_rate=SAMPLING_RATE)

        # get speech timestamps from full audio file
        speech_timestamps_seconds = get_speech_timestamps(
            wav, model, sampling_rate=SAMPLING_RATE, return_seconds=True
        )
        print(speech_timestamps_seconds)

        grouped_timestamps = sliding_window_approch_timestamps(
            speech_timestamps_seconds
        )
        print(grouped_timestamps)

        model = whisperx.load_model(
            MODEL_SIZE, "cuda", compute_type="float16", language=target_lang
        )

        async def generate():
            for segment in grouped_timestamps:
                s = segment["start"]
                e = segment["end"]

                newAudio = AudioSegment.from_wav("output.wav")
                newAudio = newAudio[s * 1000 : e * 1000]
                new_audio_name = "new_" + str(s) + ".wav"
                newAudio.export(new_audio_name, format="wav")
                waveform, sample_rate = torchaudio.load(new_audio_name)
                resampler = torchaudio.transforms.Resample(
                    sample_rate, SAMPLING_RATE, dtype=waveform.dtype
                )
                resampled_waveform = resampler(waveform)
                torchaudio.save("resampled.wav", resampled_waveform, SAMPLING_RATE)

                audio = whisperx.load_audio("resampled.wav")
                result = model.transcribe(audio, batch_size=16)
                model_a, metadata = whisperx.load_align_model(
                    language_code=target_lang, device="cuda"
                )

                result = whisperx.align(
                    result["segments"],
                    model_a,
                    metadata,
                    audio,
                    "cuda",
                    return_char_alignments=False,
                )

                for segment in result["segments"]:
                    obj = {
                        "start": segment["start"] + s,
                        "end": segment["end"] + s,
                        "text": segment["text"],
                    }
                    print(obj)
                    yield json.dumps(obj)

        return StreamingResponse(generate(), media_type="text/event-stream")

    except Exception as e:
        print(e)
        logging.critical(e, exc_info=True)
        return {"message": "Internal server error", "code": 500}
