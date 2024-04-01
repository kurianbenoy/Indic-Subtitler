import axios from "axios";
import Head from "next/head";
import { useState, useRef, useEffect } from "react";
import { toast } from "react-toastify";

const LiveTranscribe = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [transcription, setTranscription] = useState("");
  const [gptOptimizedTranscription, setGptOptimizedTranscription] =
    useState("");
  const mediaRecorderRef = useRef(null);
  const streamRef = useRef(null);
  const optimisedTranscriptionRef = useRef(null);
  const [enableTranscription, setEnableTranscription] = useState(false);
  const transcriptionTextAreaRef = useRef();

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
        toggleRecording();
      }, 100);
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
          // body: JSON.stringify({ audioData: base64Data, language: "en" }),
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

  const handleOptimizeWithGpt = async () => {
    const toastId = toast.info("Optimizing with LLM...");
    try {
      const response = await axios.post("/api/optimize", {
        transcription: transcription,
      });

      setGptOptimizedTranscription(response.data.corrected_transcription);
      toast.update(toastId, {
        render: "Optimized with LLM",
        type: "success",
        autoClose: 5000,
      });
      optimisedTranscriptionRef?.current?.scrollIntoView({
        behavior: "smooth",
      });
    } catch (error) {
      console.error("Error optimizing transcription:", error);
    }
  };
  useEffect(() => {
    if (!enableTranscription && transcription.length) {
      transcriptionTextAreaRef?.current.focus();
    }
  }, [enableTranscription, transcription.length]);

  return (
    <div className="prose mx-auto pb-5 mb-5 p-2">
      <Head>
        <title>Live Transcribe</title>
      </Head>
      <h1>Live Transcription</h1>

      <p className="text-sm text-gray-600 mb-3">
        Note: This feature is in beta and works best for English at the moment
      </p>
      <div className="h-80">
        <textarea
          value={transcription}
          ref={transcriptionTextAreaRef}
          rows={10}
          placeholder="Enable Transcription and start speaking. Don't mind about grammar or accuracy. Edits can be made later. Let your thoughts flow freely..."
          onChange={(e) => setTranscription(e.target.value)}
          className="w-full border rounded p-4"
        />
      </div>
      <br />

      <p className="m-2">
        {isRecording ? "Recording in progress...." : "Ready"}{" "}
      </p>

      <div className="flex flex-wrap ml-0">
        <button
          className="btn btn-accent m-2"
          onClick={handleEnableTranscription}
        >
          {enableTranscription ? "Disable" : "Enable"} Transcription
        </button>

        <button
          className="btn btn-neutral m-2"
          disabled={!transcription?.length || enableTranscription}
          onClick={handleOptimizeWithGpt}
        >
          Optimize Transcription
        </button>
        <button
          className="btn btn-outline m-2"
          disabled={!transcription?.length}
          onClick={() => setTranscription("")}
        >
          Clear Transcript
        </button>
      </div>

      <div
        ref={optimisedTranscriptionRef}
        className="mt-6 p-2 px-4 mb-4 border border-gray-200 rounded-lg"
      >
        {gptOptimizedTranscription && (
          <div>
            <h2 className="text-xl font-bold mb-1">Optimized Transcription</h2>
            <h6 className="text-lg font-semibold">
              Transcription after processed by an LLM
            </h6>
            <p className="text-base mt-6">{gptOptimizedTranscription}</p>
          </div>
        )}
      </div>

      <div className="prose mt-48">
        {/* <h4>Additional Information</h4> */}

        <h4>Supported Languages</h4>
        <p>
          We use the Whisper model for transcriptions.{" "}
          <a
            rel="noopener noreferrer"
            target="_blank"
            href="https://github.com/openai/whisper#available-models-and-languages"
          >
            Here are the
          </a>{" "}
          supported languages.
        </p>

        <h4>iPhone issues</h4>
        <p>
          We have noticed that there is some accuracy issues with iPhones and
          iPads with transcriptions. We are currently working to find a fix for
          this problem. If you'd like to contribute or provide some suggestions,
          please do{" "}
          <a
            target="_blank"
            href="https://github.com/kurianbenoy/Indic-Subtitler/issues"
          >
            reach out to us on github.
          </a>
        </p>
      </div>
    </div>
  );
};

export default LiveTranscribe;
