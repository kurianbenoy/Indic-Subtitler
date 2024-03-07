import axios from "axios";

// Function to convert blob to base64
const blobToBase64 = (blob) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const base64String = reader.result.split(",")[1];
      resolve(base64String);
    };
    reader.onerror = () => {
      reject(new Error("Unable to read the blob as base64"));
    };
    reader.readAsDataURL(blob);
  });
};

export const getAudioDetails = (file) => {
  // Read the audio file
  const reader = new FileReader();
  reader.readAsArrayBuffer(file);

  reader.onload = async () => {
    // Create an AudioContext
    const audioContext = new (window.AudioContext ||
      window.webkitAudioContext)();
    const audioBuffer = await audioContext.decodeAudioData(reader.result);

    console.log(audioBuffer);
    console.log(audioBuffer.duration);
    // Slice the first 10 seconds
    const duration = Math.min(audioBuffer.duration, 10);
    const startOffset = 0;
    const endOffset = audioBuffer.sampleRate * duration;
    const slicedBuffer = audioBuffer
      .getChannelData(0)
      .slice(startOffset, endOffset);

    // Convert to Data URL
    const audioBlob = new Blob([slicedBuffer], { type: "audio/wav" });

    const base64Data = await blobToBase64(audioBlob);
    console.log(base64Data);

    // Send data to API
    try {
      const response = await axios.post("YOUR_API_ENDPOINT", {
        audio: base64Data,
      });
      console.log("API Response:", response.data);
    } catch (error) {
      console.error("Error sending data to API:", error);
    }
  };
};
