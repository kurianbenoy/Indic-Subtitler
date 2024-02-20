import base64
import tempfile
import logging
from typing import Dict
from modal import Image, Stub, web_endpoint

# Define the GPU type to be used for processing
GPU_TYPE = "T4"


def download_models():
    """
    Downloads and initializes models required for speech processing, including a translator model and a VAD (Voice Activity Detection) model.
    """
    from seamless_communication.inference import Translator
    import torch

    # Define model names for the translator and vocoder
    model_name = "seamlessM4T_v2_large"
    vocoder_name = "vocoder_v2" if model_name == "seamlessM4T_v2_large" else "vocoder_36langs"

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

    sound = AudioSegment.from_file(input_file)
    sound = sound.set_channels(1).set_frame_rate(16000)
    sound.export(output_file, format="wav")


# Define the Docker image configuration for the processing environment
image = (
    Image.from_registry("nvidia/cuda:12.2.0-devel-ubuntu20.04", add_python="3.10")
    .apt_install("git", "ffmpeg")
    .pip_install(
        "fairseq2==0.2.*",
        "sentencepiece",
        "pydub",
        "ffmpeg-python",
        "torch==2.1.1",
        "seamless_communication @ git+https://github.com/facebookresearch/seamless_communication.git",  # torchaudio already included in seamless_communication
        "faster-whisper",
    )
    .run_function(download_models, gpu=GPU_TYPE)
)

# Initialize the processing stub with the defined Docker image
stub = Stub(name="seamless_m4t_speech", image=image)


@stub.function(gpu=GPU_TYPE, timeout=600)
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

    import torch
    import torchaudio
    from pydub import AudioSegment
    from seamless_communication.inference import Translator

    # removed because of error in mp4 & mp3 files because of wave
    # # function to calculate the duration of the input audio clip
    # def get_duration_wave(file_path):
    #     with wave.open(file_path, "r") as audio_file:
    #         frame_rate = audio_file.getframerate()
    #         n_frames = audio_file.getnframes()
    #         duration = n_frames / float(frame_rate)
    #         return duration

    try:
        print(f"Payload: {item}")
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
        print(f"Target_lang: {item.get('target')}")
        target_lang = item["target"]

        fname = base64_to_audio_file(b64_contents=b64)
        print(fname)
        convert_to_mono_16k(fname, "output.wav")

        # Perform voice activity detection on the processed audio
        SAMPLING_RATE = 16000
        wav = read_audio("output.wav", sampling_rate=SAMPLING_RATE)

        # get speech timestamps from full audio file
        speech_timestamps_seconds = get_speech_timestamps(
            wav, model, sampling_rate=SAMPLING_RATE, return_seconds=True
        )
        print(speech_timestamps_seconds)
        # translator = download_models()
        model_name = "seamlessM4T_v2_large"
        vocoder_name = "vocoder_v2" if model_name == "seamlessM4T_v2_large" else "vocoder_36langs"

        translator = Translator(
            model_name,
            vocoder_name,
            device=torch.device("cuda:0"),
            dtype=torch.float16,
        )

        # duration = get_duration_wave(fname)
        # print(f"Duration: {duration:.2f} seconds")

        resample_rate = 16000

        # Replace t1, t2 with VAD time
        timestamps_start = []
        timestamps_end = []
        text = []

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
                sample_rate, resample_rate, dtype=waveform.dtype
            )
            resampled_waveform = resampler(waveform)
            torchaudio.save("resampled.wav", resampled_waveform, resample_rate)
            translated_text, _ = translator.predict("resampled.wav", "s2tt", target_lang)
            print(translated_text)
            text.append(str(translated_text[0]))
            os.remove(new_audio_name)
            os.remove("resampled.wav")

        chunks = []
        for i in range(len(text)):
            chunks.append(
                {
                    "start": timestamps_start[i],
                    "end": timestamps_end[i],
                    "text": text[i],
                }
            )

        full_text = " ".join([x["text"] for x in chunks])
        return {
            "code": 200,
            "message": "Speech generated successfully.",
            "chunks": chunks,
            "text": full_text,
        }

    except Exception as e:
        print(e)
        logging.critical(e, exc_info=True)
        return {"message": "Internal server error", "code": 500}
