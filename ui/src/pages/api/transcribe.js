import axios from "axios";

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const { audioData, language } = req.body;
      const audioBuffer = Buffer.from(audioData, "base64");
      const audioBlob = new Blob([audioBuffer], { type: "audio/wav" });

      const formData = new FormData();
      formData.append("file", audioBlob, "audio.wav");
      formData.append("model", "whisper-1");
      formData.append("response_format", "text");
      // formData.append("language", language);

      const response = await axios.post(
        "https://api.openai.com/v1/audio/transcriptions",
        formData,
        {
          headers: {
            Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      res.status(200).json({ transcription: response.data });
    } catch (error) {
      res.status(500).json({ error: "Error transcribing audio" });
    }
  } else {
    res.status(405).json({ error: "Method Not Allowed" });
  }
}
