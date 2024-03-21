import axios from "axios";
import { LANGUAGES_PER_MODEL } from "./constants";

export function formatFileSize(size) {
  if (!size) return null;
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

export const getRequestParamsForModel = async (
  uploadedFile,
  youtubeLink,
  targetLang,
  selectedModel
) => {
  const modelEndPoints = {
    seamlessM4t: {
      fileBased:
        "https://indic-subtitler--seamless-m4t-speech-generate-seamlessm4-d11af9.modal.run",
      youtubeLinkedBased:
        "https://indic-subtitler--seamless-m4t-speech-youtube-generate-se-7b7455.modal.run",
    },

    fasterWhisper: {
      fileBased:
        "https://indic-subtitler--seamless-m4t-speech-generate-faster-whi-29f8e4.modal.run",
      youtubeLinkedBased:
        "https://indic-subtitler--seamless-m4t-speech-youtube-generate-fa-826932.modal.run",
    },
    whisperX: {
      fileBased:
        "https://indic-subtitler--seamless-m4t-speech-generate-whisperx-speech.modal.run",
      youtubeLinkedBased:
        "https://indic-subtitler--seamless-m4t-speech-youtube-generate-wh-42397f.modal.run",
    },
    vegamFasterWhisper: {
      fileBased:
        "https://indic-subtitler--seamless-m4t-speech-generate-vegam-fast-2d5a10.modal.run",
      youtubeLinkedBased:
        "https://indic-subtitler--seamless-m4t-speech-youtube-generate-ve-db96f4.modal.run",
    },
  };
  let requestData;
  if (youtubeLink) {
    requestData = {
      yt_id: getYouTubeVideoId(youtubeLink),
      target: targetLang,
    };
  } else if (uploadedFile) {
    const base64Data = await fileToBase64(uploadedFile);
    requestData = {
      wav_base64: base64Data,
      target: targetLang,
    };
  }

  const url =
    modelEndPoints[selectedModel][
      uploadedFile ? "fileBased" : "youtubeLinkedBased"
    ];

  return { url, requestData };
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

export function triggerDownload(filename, modelName, blob, fileExtension) {
  const formattedFileName = removeFileExtension(filename);
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute(
    "download",
    `${formattedFileName}_${modelName}.${fileExtension}`
  );
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
export function downloadSRT(transcribed, filename, modelName) {
  const srtContent = transcribed
    .map((entry, index) => {
      const { start, end, text } = entry;
      const startTime = formatTime(start);
      const endTime = formatTime(end);
      return `${index + 1}\n${startTime} --> ${endTime}\n${text}\n\n`;
    })
    .join("");
  const blob = new Blob([srtContent], { type: "text/plain" });
  triggerDownload(filename, modelName, blob, "srt");
}
export function downloadJSON(data, filename, modelName) {
  const jsonData = JSON.stringify(data, null, 4);
  const blob = new Blob([jsonData], { type: "application/json" });
  triggerDownload(filename, modelName, blob, "json");
}

export function downloadVTT(data, filename, modelName) {
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
  triggerDownload(filename, modelName, blob, "vtt");
}

export function downloadTXT(data, filename, modelName) {
  let plainTextContent = "";
  data?.forEach((subtitle) => {
    plainTextContent += `${subtitle.text}\n`;
  });
  const blob = new Blob([plainTextContent], { type: "text/plain" });
  triggerDownload(filename, modelName, blob, "txt");
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

export function getYouTubeVideoId(url) {
  var regExp = /^.*(?:youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=)([^#\&\?]*).*/;
  var match = url.match(regExp);
  if (match && match[1].length === 11) {
    return match[1];
  } else {
    return false;
  }
}
export function getFullLanguageName(model, languageCode) {
  const modelLanguages = LANGUAGES_PER_MODEL.find(
    (item) => item.model === model
  );
  if (modelLanguages) {
    const language = modelLanguages.languages.find(
      (item) => item.id === languageCode
    );
    if (language) {
      return language.name;
    }
  }
  return languageCode;
}

export function formatSubtitleData(jsonData) {
  return jsonData.map(({ start, end, text }) => ({
    start,
    end,
    text,
  }));
}
