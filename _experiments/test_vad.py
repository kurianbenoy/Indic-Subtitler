import torch
import torchaudio
from pydub import AudioSegment

USE_ONNX = False
model, utils = torch.hub.load("snakers4/silero-vad", model="silero_vad")

(get_speech_timestamps, save_audio, read_audio, VADIterator, collect_chunks) = utils

SAMPLING_RATE = 16000
wav = read_audio("mal_sample1.wav", sampling_rate=SAMPLING_RATE)

speech_timestamps = get_speech_timestamps(wav, model, sampling_rate=SAMPLING_RATE)
print(speech_timestamps)

speech_timestamps_seconds = get_speech_timestamps(
    wav, model, sampling_rate=SAMPLING_RATE, return_seconds=True
)
print(speech_timestamps_seconds)


cnt = 0
for item in speech_timestamps_seconds:
    cnt += 1
    s = item["start"]
    e = item["end"]
    newAudio = AudioSegment.from_wav("mal_sample1.wav")
    newAudio = newAudio[s * 1000 : e * 1000]
    new_audio_name = "new_" + str(cnt) + ".wav"
    print(new_audio_name)
    newAudio.export(new_audio_name, format="wav")
    waveform, sample_rate = torchaudio.load(new_audio_name)
    resample_rate = 16000
    resampler = torchaudio.transforms.Resample(
        sample_rate, resample_rate, dtype=waveform.dtype
    )
    resampled_waveform = resampler(waveform)
    torchaudio.save("resampled.wav", resampled_waveform, resample_rate)

    # t1 = 0
    # t2 = 20000
