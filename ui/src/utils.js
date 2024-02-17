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

export function formatTime(seconds) {
  let hours = Math.floor(seconds / 3600);
  let minutes = Math.floor((seconds % 3600) / 60);
  let remainingSeconds = Math.floor(seconds % 60);

  // Add leading zeros if needed
  hours = hours < 10 ? "0" + hours : hours;
  minutes = minutes < 10 ? "0" + minutes : minutes;
  remainingSeconds =
    remainingSeconds < 10 ? "0" + remainingSeconds : remainingSeconds;

  return hours + ":" + minutes + ":" + remainingSeconds;
}

export function removeFileExtension(filename) {
  const lastDotIndex = filename.lastIndexOf(".");
  if (lastDotIndex !== -1 && lastDotIndex !== 0) {
    return filename.substring(0, lastDotIndex);
  } else {
    return filename;
  }
}
