import axios from "axios";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { transcription } = req.body;

    try {
      const response = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "system",
              content:
                "You will be provided with an audio transcription, and your task is to correct any mistakes like grammar and make improvements to the audio. The transcription will be provided in side 3 backticks in the format: Transcription : ```transcription``` ",
            },
            {
              role: "user",
              content: "Transcription : ```" + transcription + "```",
            },
          ],
          temperature: 0.3,
          // max_tokens: 64,
          top_p: 1,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          },
        }
      );

      res.status(200).json({
        corrected_transcription: response.data.choices[0].message.content,
      });
    } catch (error) {
      console.error("Error optimizing transcription:", error);
      res.status(500).json({ error: "Error optimizing transcription" });
    }
  } else {
    res.status(405).json({ error: "Method Not Allowed" });
  }
}
