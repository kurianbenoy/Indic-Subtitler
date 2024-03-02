import React, { useState, useRef, useEffect } from "react";
import axios from "axios";

const LiveTranscribe = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [transcription, setTranscription] = useState("");
  const mediaRecorderRef = useRef(null);
  const streamRef = useRef(null);
  const [enableTranscription, setEnableTranscription] = useState(false);
  const transcriptionContainerRef = useRef();

  const toggleRecording = () => {
    if (!streamRef.current || !mediaRecorderRef.current) {
      console.log("stream or mediarecorder not defined");
      return;
    }
    if (mediaRecorderRef.current.state === "recording") {
      mediaRecorderRef.current.stop();
    } else {
      mediaRecorderRef.current.ondataavailable = handleDataAvailable;
      mediaRecorderRef.current.start();
    }
    setIsRecording(mediaRecorderRef.current.state === "recording");
  };

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        console.log("stream set");
        streamRef.current = stream;
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;
      })
      .catch((error) => {
        console.error("Error accessing microphone:", error);
      });
  }, []);

  useEffect(() => {
    let interval = null;
    if (!enableTranscription) {
      if (interval) {
        clearInterval(interval);
        toggleRecording();
      }
      return;
    }

    toggleRecording();
    interval = setInterval(() => {
      toggleRecording();
      setTimeout(() => {
        console.log("toggling back");
        toggleRecording();
      }, 175);
    }, 3500);

    return () => {
      interval && clearInterval(interval);
      toggleRecording();
    };
  }, [enableTranscription]);

  const handleDataAvailable = (event) => {
    // prompt field can contain only 244 chars at max
    const currentTranscription =
      transcriptionContainerRef.current.innerText?.slice(-200);
    const audioBlob = event.data;

    const formData = new FormData();
    formData.append("file", audioBlob, "audio.wav");
    formData.append("model", "whisper-1");
    // formData.append("language", "hi");
    // formData.append("response_format", "verbose_json");
    formData.append("response_format", "text");
    formData.append("prompt", currentTranscription);

    console.log("making transcribe request");
    axios
      .post("https://api.openai.com/v1/audio/transcriptions", formData, {
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_OPENAI_KEY}`,
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        setTranscription(
          // (transcription) => `${transcription} ${response.data.text}`
          (transcription) => `${transcription} ${response.data}`
        );
      })
      .catch((error) => {
        console.error("Error transcribing audio:" + error);
      });
  };

  const handleEnableTranscription = () => {
    setEnableTranscription((currState) => !currState);
  };

  return (
    <div className="prose mx-auto">
      <h1>Transcription</h1>
      <div className="h-80" ref={transcriptionContainerRef}>
        {/* <textarea rows={10} cols={20} className="w-10"> */}
        {transcription}
        {/* </textarea> */}
      </div>
      <br />

      <p>{isRecording ? "Recording in progress...." : "Ready"} </p>

      <btn className="btn btn-accent mr-5" onClick={handleEnableTranscription}>
        {enableTranscription ? "Disable" : "Enable"} Transcription
      </btn>

      <button className="btn btn-outline" onClick={() => setTranscription("")}>
        Clear Transcript
      </button>
    </div>
  );
};

export default LiveTranscribe;
