import base64
import requests

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

b64 = audio_file_to_base64("/home/kurian/git/Indic-Subtitler/api/Sonia1.wav")
print(b64)

x = requests.post(URL, json={"wav_base64": b64, "source": "eng", "target": "mal"})
print(x)
print(x.json())
