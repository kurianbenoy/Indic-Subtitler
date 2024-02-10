import time
from typing import Dict
from modal import Image,Stub, web_endpoint, gpu

GPU_TYPE = "a10g"

def download_models():
    from seamless_communication.inference import Translator
    import torch

    model_name = "seamlessM4T_v2_large"
    vocoder_name = "vocoder_v2" if model_name == "seamlessM4T_v2_large" else "vocoder_36langs"

    translator = Translator(
        model_name,
        vocoder_name,
        device=torch.device("cuda:0"),
        dtype=torch.float16,
    )

image = (
        Image.from_registry("nvidia/cuda:12.2.0-devel-ubuntu20.04", add_python="3.10")
        .apt_install("git", "ffmpeg")
        .pip_install("fairseq2==0.2.*",
        "sentencepiece",
        "pydub",
        "ffmpeg-python",
        "torch==2.1.1",
        "seamless_communication @  git+https://github.com/facebookresearch/seamless_communication.git",
         )
        .run_function(download_models, gpu=GPU_TYPE)
    )
# torchaudio already included in seamless_communication


stub = Stub(name="seamless_m4t_speech",image=image)

@stub.function(gpu=GPU_TYPE)
@web_endpoint(method="POST")
def generate_seamlessm4t_speech(item: Dict):
    """Input speech """
    import torch
    import wave
    import base64
    import math
    import os
    from pydub import AudioSegment
    from seamless_communication.inference import Translator


    audio_name = "audios/sample1.wav"
    target_lang = "eng"

    def audio_file_to_base64(file_path):
        """
        Converts an audio file to a base64 encoded string.

        Parameters:
        - file_path: Path to the audio file.

        Returns:
        - A base64 encoded string of the audio file.
        """
        with open(file_path, "rb") as audio_file:
            audio_data = audio_file.read()
        base64_encoded_str = base64.b64encode(audio_data).decode('utf-8')
        return base64_encoded_str

    # function to calculate the duration of the input audio clip
    def get_duration_wave(file_path):
        with wave.open(file_path, 'r') as audio_file:
            frame_rate = audio_file.getframerate()
            n_frames = audio_file.getnframes()
            duration = n_frames / float(frame_rate)
            return duration

    print("Initialized")
    model_name = "seamlessM4T_v2_large"
    vocoder_name = "vocoder_v2" if model_name == "seamlessM4T_v2_large" else "vocoder_36langs"

    translator = Translator(
        model_name,
        vocoder_name,
        device=torch.device("cuda:0"),
        dtype=torch.float16,
    )

    text_contents = item["text"]
    print(f"text: {text_contents}")

    b64_contents = item["wav_base64"]

    duration = get_duration_wave(audio_name)
    print(f"Duration: {duration:.2f} seconds")

    resample_rate = 16000
    t1 = 0
    t2 = 20000


