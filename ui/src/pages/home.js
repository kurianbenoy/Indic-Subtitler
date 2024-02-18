// import axios from "axios";
// import FileUpload from "@components/components/FileUpload";
// import Navbar from "@components/components/Navbar";
// import { fileToBase64 } from "@components/utils";
// import { useState } from "react";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// export default function Home() {
//   const [transcription, setTranscription] = useState("");
//   const handleTranscribe = async (file, sourceLang, targetLang) => {
//     console.log(file, sourceLang, targetLang);

//     const base64Data = await fileToBase64(file);
//     console.log(base64Data);

//     const requestData = {
//       wav_base64: base64Data,
//       source: sourceLang,
//       target: targetLang,
//     };

//     const toastId = toast.info("Transcribing Audio. Hold on...");
//     try {
//       const response = await axios.post(
//         "https://kurianbenoy--seamless-m4t-speech-generate-seamlessm4t-speech.modal.run/",
//         requestData
//       );
//       console.log("Response:", response.data);
//     } catch (error) {
//       console.error("Error:", error);
//       toast.error(
//         "There seems to be some error in uploading file at the moment. Please try again with a different file..."
//       );
//     }
//   };

//   return (
//     <>
//       <Navbar />
//       <div className="container mx-auto">
//         <FileUpload onSubmit={handleTranscribe} />
//       </div>

//       <ToastContainer />
//     </>
//   );
// }
