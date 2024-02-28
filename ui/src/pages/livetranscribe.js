import React, { useState, useRef, useEffect } from "react";
import axios from "axios";

const LiveTranscribe = () => {
  console.log("bro");
  const [isRecording, setIsRecording] = useState(false);
  const [transcription, setTranscription] = useState("");
  const mediaRecorderRef = useRef(null);
  const streamRef = useRef(null);
  const [enableTranscription, setEnableTranscription] = useState(false);

  const toggleRecording = () => {
    if (!streamRef.current || !mediaRecorderRef.current) {
      console.log({ streamRef, mediaRecorderRef });
      console.log("stream or mediarecorder not defined");
      return;
    }
    console.log({ state: mediaRecorderRef.current.state, isRecording });
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
      interval && clearInterval(interval);
      return;
    }

    interval = setInterval(() => {
      toggleRecording();
      setTimeout(() => {
        console.log("toggling back");
        toggleRecording();
      }, 275);
    }, 3500);

    return () => interval && clearInterval(interval);
  }, [enableTranscription]);

  const handleDataAvailable = (event) => {
    const audioBlob = event.data;
    console.log(event.data);
    const formData = new FormData();
    formData.append("file", audioBlob, "audio.wav");
    formData.append("model", "whisper-1");
    formData.append("model", "whisper-1");
    formData.append("language", "en");
    formData.append("response_format", "verbose_json");
    formData.append("prompt", transcription);

    console.log("making transcribe request");
    axios
      .post("https://api.openai.com/v1/audio/transcriptions", formData, {
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_OPENAI_KEY}`,
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        console.log(response.data.text);
        setTranscription(
          (transcription) => `${transcription} ${response.data.text}`
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
      <btn className="btn btn-accent" onClick={handleEnableTranscription}>
        {enableTranscription ? "Disable" : "Enable"} Transcription
      </btn>

      <h1>Transcription</h1>
      <div className="h-80">
        {/* <textarea rows={10} cols={20} className="w-10"> */}
        {transcription}
        {/* </textarea> */}
      </div>
      <br />

      <p>{isRecording ? "Recording in progress...." : "Ready"} </p>

      <button className="btn btn-outline" onClick={toggleRecording}>
        {isRecording ? "Stop Recording" : "Start Recording"}
      </button>

      <button
        className="btn btn-error mx-5"
        onClick={() => setTranscription("")}
      >
        Clear Transcript
      </button>
    </div>
  );
};

export default LiveTranscribe;
