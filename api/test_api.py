import base64
from datetime import timedelta

import requests


def get_srt_time(sec):
    time_str = ""
    time_delta = timedelta(seconds=float(sec))
    temp_d = str(time_delta).split(".")
    if len(temp_d) == 1:
        time_str = temp_d[0] + ".000"
    else:
        time_str = "0" + str(time_delta)[:-3]

        if len(time_str.split(".")) == 1:
            time_str = time_str + ".000"

    return time_str

def gen_srt_file(input_chunks, output_file_path):

    data = input_chunks

    row = 1
    with open(output_file_path, "a", encoding="utf-8") as srtFile:
        for seg in data:
            startTime = get_srt_time(seg["start"])
            endTime = get_srt_time(seg["end"])
            text = seg["text"]
            print(text)
            segment = (
                f"{row}\n{startTime} --> {endTime}\n{text[1:] if text[0] == ' ' else text}\n\n"
            )
            print(segment)
            srtFile.write(segment)
            row += 1




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

URL = "https://kurianbenoy--seamless-m4t-speech-generate-seamlessm4t-speech.modal.run/"

b64 = audio_file_to_base64("/home/kurian/git/Indic-Subtitler/api/mal_sample1.wav")
# print(b64)

x = requests.post(URL, json={"wav_base64": b64, "source": "mal", "target": "hin"})
print(x)
res = x.json()

print(res["chunks"])

gen_srt_file(res["chunks"], "output_mal_hin_sample1.srt")
