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

export function transitionToCollection(router) {
  router.push("/collection");
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

export function formatTime(time) {
  const hours = Math.floor(time / 3600);
  const minutes = Math.floor((time % 3600) / 60);
  const seconds = Math.floor(time % 60);
  const milliseconds = Math.floor((time % 1) * 1000);
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
    2,
    "0"
  )}:${String(seconds).padStart(2, "0")},${String(milliseconds).padStart(
    3,
    "0"
  )}`;
}

export function removeFileExtension(filename) {
  const lastDotIndex = filename.lastIndexOf(".");
  if (lastDotIndex !== -1 && lastDotIndex !== 0) {
    return filename.substring(0, lastDotIndex);
  } else {
    return filename;
  }
}

export function triggerDownload(filename, blob, fileExtension) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", `${filename}.${fileExtension}`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
export function downloadSRT(transcribed, filename) {
  const srtContent = transcribed
    .map((entry, index) => {
      const { start, end, text } = entry;
      const startTime = formatTime(start);
      const endTime = formatTime(end);
      return `${index + 1}\n${startTime} --> ${endTime}\n${text}\n\n`;
    })
    .join("");
  const blob = new Blob([srtContent], { type: "text/plain" });
  triggerDownload(filename, blob, "srt");
}
export function downloadJSON(data, filename) {
  const jsonData = JSON.stringify(data, null, 4);
  const blob = new Blob([jsonData], { type: "application/json" });
  triggerDownload(filename, blob, "json");
}

export function downloadVTT(data, filename) {
  const vttHeader = "WEBVTT\n\n";
  let vttContent = "";

  data.forEach((subtitle, index) => {
    const startTime = formatTime(subtitle.start);
    const endTime = formatTime(subtitle.end);
    vttContent += `${index + 1}\n${startTime} --> ${endTime}\n${
      subtitle.text
    }\n\n`;
  });
  const blob = new Blob([vttHeader, vttContent], { type: "text/vtt" });
  triggerDownload(filename, blob, "vtt");
}

export function downloadTXT(data, filename) {
  let plainTextContent = "";
  data?.forEach((subtitle) => {
    plainTextContent += `${subtitle.text}\n`;
  });
  const blob = new Blob([plainTextContent], { type: "text/plain" });
  triggerDownload(filename, blob, "txt");
}

export function formattedDate(date) {
  const processedDate = new Date(date);
  const options = {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  };
  const formatDate = new Intl.DateTimeFormat("en-US", options).format(
    processedDate
  );
  return formatDate;
}
