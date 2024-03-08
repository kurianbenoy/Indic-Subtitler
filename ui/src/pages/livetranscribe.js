import React, { useState, useRef, useEffect } from "react";

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

  const handleDataAvailable = async (event) => {
    const audioBlob = event.data;
    const reader = new FileReader();
    reader.readAsDataURL(audioBlob);
    reader.onloadend = async function () {
      const base64Data = reader.result.split(",")[1];
      try {
        const response = await fetch("/api/transcribe", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ audioData: base64Data }),
        });

        if (!response.ok) {
          throw new Error("Failed to transcribe audio");
        }

        const data = await response.json();

        setTranscription(
          (transcription) => `${transcription} ${data.transcription}`
        );
      } catch (error) {
        console.error("Error transcribing audio:", error);
      }
    };
  };

  const handleEnableTranscription = () => {
    setEnableTranscription((currState) => !currState);
  };

  return (
    <div className="prose mx-auto">
      <h1>Live Transcription</h1>
      <div className="h-80" ref={transcriptionContainerRef}>
        {/* {!enableTranscription ? ( */}
        <textarea
          value={transcription}
          rows={10}
          placeholder="Enable Transcription and start speaking..."
          onChange={(e) => setTranscription(e.target.value)}
          className="w-full border rounded p-4"
        />
        {/* ) : (
          <div
            className=""
            style={{
              whiteSpace: "pre-wrap",
            }}
          >
            {transcription}
          </div>
        )} */}
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
