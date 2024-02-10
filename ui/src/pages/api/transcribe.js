import formidable from "formidable";
import openai from "openai";

const openaiClient = new openai.OpenAI(process.env.OPENAI_API_KEY);
export const config = {
  api: {
    bodyParser: {
      sizeLimit: "20mb", // Adjust this value as needed
    },
  },
};

export default async function handler(req, res) {
  console.log("Request received");

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }
  // parse a file upload
  const form = formidable({});
  let fields;
  let files;
  console.log(req);
  console.log(req.data);
  console.log(req.body);
  console.log(req.form);
  try {
    [fields, files] = await form.parse(req);
    console.log("ok");
    console.log(fields, files);
    res.send("ok");
  } catch (err) {
    console.log("error", err);
    console.error(err);
    res.writeHead(err.httpCode || 400, { "Content-Type": "text/plain" });
    res.end(String(err));
    return;
  }

  //   const form = new formidable.IncomingForm();
  //   form.uploadDir = "./uploads"; // Directory where files will be uploaded
  //   form.keepExtensions = true;

  //   form.parse(req, async (err, fields, files) => {
  //     if (err) {
  //       console.log("Error uploading file:", err);
  //       return res.status(500).json({ error: "Error uploading file" });
  //     }

  //     // Path to the uploaded file
  //     const filePath = files.file.path;
  //     console.log("Uploaded file path:", filePath);

  //     try {
  //       // Transcribe the audio file
  //       const transcriptionResponse = await openaiClient.Transcription.create({
  //         audio: filePath,
  //       });

  //       // Extract subtitles from the transcription response
  //       const subtitles = transcriptionResponse.data.transcription;

  //       // Return subtitles
  //       res.status(200).json({ subtitles });
  //     } catch (error) {
  //       console.error("Error transcribing file:", error);
  //       res.status(500).json({ error: "Error transcribing file" });
  //     }
  //   });
}
