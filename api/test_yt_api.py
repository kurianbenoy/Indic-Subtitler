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


URL = "https://kurianbenoy--seamless-m4t-speech-youtube-generate-faster-c295b9.modal.run"

# print(b64)
print({"yt_id": "uLQ-yIm-gvI", "target": "eng"})
x = requests.post(URL, json={"yt_id": "uLQ-yIm-gvI", "target": "eng"})
print(x)
