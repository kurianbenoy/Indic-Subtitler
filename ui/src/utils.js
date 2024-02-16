import axios from "axios";
import { toast } from "react-toastify";

export function formatFileSize(size) {
  const units = ["B", "KB", "MB", "GB", "TB"];
  let i = 0;
  while (size >= 1024 && i < units.length - 1) {
    size /= 1024;
    i++;
  }
  return `${size.toFixed(2)} ${units[i]}`;
}

export const fileToBase64 = async (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const base64String = reader.result.split(",")[1];
      resolve(base64String);
    };
    reader.onerror = (error) => {
      reject(error);
    };
  });
};

export function transitionToDashboard(router) {
  router.push("/dashboard");
}

export const handleTranscribe = async (file, sourceLang, targetLang) => {
  const base64Data = await fileToBase64(file);

  const requestData = {
    wav_base64: base64Data,
    source: sourceLang,
    target: targetLang,
  };

  try {
    const response = await axios.post(
      "https://kurianbenoy--seamless-m4t-speech-generate-seamlessm4t-speech.modal.run/",
      requestData
    );
    return response;
  } catch (error) {
    return error;
  }
};
