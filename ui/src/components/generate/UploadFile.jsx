import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import Dropzone from "@components/components/Dropzone";
import { IconLink } from "@tabler/icons-react";
import Dropdown from "@components/components/Dropdown";
import { AVAILABLE_MODELS, SOURCE_LANGUAGES } from "@components/constants";
import { getRequestParamsForModel } from "@components/utils";

export default function UploadFile({
  uploadedFile,
  setUploadedFile,
  setYoutubeLink,
  youtubeLink,
  setIsBeingGenerated,
  setTranscribed,
  setrequestSentToAPI,
  isLocalFile,
  setYoutubeTitle,
}) {
  const [turnOnAdvanceOptions, setTurnOnAdvanceOptions] = useState(false);
  const [targetLanguage, setTargetLanguage] = useState();
  const [selectedModel, setSelectedModel] = useState("seamlessM4t");
  const [disabled, setDisabled] = useState(true);

  function storeFileToLocalStorage(file) {
    const items = JSON.parse(localStorage.getItem("file"));
    if (!items) {
      localStorage.setItem("file", JSON.stringify([file]));
    } else {
      items.push(file);
      localStorage.setItem("file", JSON.stringify(items));
    }
  }
  useEffect(() => {
    if ((uploadedFile || youtubeLink) && targetLanguage && !isLocalFile) {
      setDisabled(false);
    } else setDisabled(true);
  }, [uploadedFile, targetLanguage, youtubeLink]);

  useEffect(() => {
    uploadContainerRef?.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
      inline: "nearest",
    });
  }, [turnOnAdvanceOptions]);

  function reset(state) {
    setDisabled(state);
    setrequestSentToAPI(state);
  }
  const handleInputChange = (event) => {
    const value = event.target.value;
    setYoutubeLink(value);
  };

  async function youtubeVideoTitle() {
    const data = await fetch(
      `https://noembed.com/embed?dataType=json&url=${youtubeLink}`
    );
    const jsonData = await data.json();
    const title = jsonData.title;
    setYoutubeTitle(title);
    return title;
  }

  async function handleSubmit() {
    if (uploadedFile && youtubeLink)
      return toast.error("Cannot upload both file and youtube link");
    reset(true);

    const { url, requestData } = await getRequestParamsForModel(
      uploadedFile,
      youtubeLink,
      targetLanguage,
      selectedModel
    );

    const toastId = toast.info("Uploading..");
    fetch(url, {
      method: "POST",
      body: JSON.stringify(requestData),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then(async (res) => {
        if (res?.code === 500) throw new Error("Internal Server Error");

        let transcription = [];

        toast.update(toastId, { render: "Transcribing..", type: "info" });
        const decoder = new TextDecoder();
        const reader = res.body.getReader();
        setrequestSentToAPI(false);

        while (true) {
          const { done, value } = await reader.read();
          setIsBeingGenerated(!done);
          if (done) break;
          try {
            const decodedValue = decoder.decode(value);
            const jsonData = JSON.parse(decodedValue);
            console.log(jsonData);
            setTranscribed((transcribed) => [...transcribed, jsonData]);
            transcription.push(jsonData);
          } catch (error) {
            console.log("error in transcribing: ", error);
            const jsonString = decoder.decode(value);
            const jsonObjects = jsonString.match(/({[^{}]+})/g);
            const parsedObjects = jsonObjects.map((objString) =>
              JSON.parse(objString)
            );
            console.log("error handled");
            setTranscribed((transcribed) => [...transcribed, ...parsedObjects]);
            transcription.push(...parsedObjects);
          }
        }
        return transcription;
      })
      .then(async (transcription) => {
        toast.update(toastId, {
          render: "Succesfully transcribed",
          type: "success",
        });
        const title = await youtubeVideoTitle();
        console.log(title);
        const file = {
          filename: uploadedFile?.path ?? title,
          link: youtubeLink,
          size: uploadedFile?.size,
          transcribedData: transcription,
          uploadDate: new Date(),
          model: selectedModel,
          targetLanguage: targetLanguage,
        };
        storeFileToLocalStorage(file);
      })
      .catch((err) => {
        console.log("error: ", err);
        toast.update(toastId, {
          type: "error",
          render:
            "There seems to be some error in transcribing. Please try again later with a different file or Youtube Link.",
        });
      })
      .finally(() => {
        reset(false);
      });
  }

  function toggleAdvanceMode() {
    if (turnOnAdvanceOptions) {
      setSelectedModel("seamlessM4t");
      localStorage.setItem("llm-model", JSON.stringify("seamlessM4t"));
      console.log("advance turned off");
    }
    setTurnOnAdvanceOptions(!turnOnAdvanceOptions);
  }

  const uploadContainerRef = useRef();
  return (
    <div ref={uploadContainerRef} className=" pb-4">
      <div>
        <h2 className="text-3xl font-medium">Upload a File</h2>
        <p className="font-xl text-gray-500 font-medium mt-2">
          Upload an audio file to generate subtitles
        </p>
      </div>
      <div className="h-48">
        <Dropzone
          setUploadedFile={setUploadedFile}
          uploadedFile={uploadedFile}
        />
      </div>

      <div className="divider font-medium">OR</div>
      <label className="flex border-2 rounded-lg gap-2 p-2">
        <IconLink color="grey" />
        <input
          onChange={handleInputChange}
          type="text"
          className="w-full outline-none "
          placeholder="Paste YouTube Video Link"
        />
      </label>
      <div className="flex justify-end items-center">
        <div className="form-control mt-5">
          <label className="label cursor-pointer">
            <span className="label-text mx-2 font-medium">Advance Options</span>
            <input
              type="checkbox"
              className="toggle toggle-primary"
              defaultValue={turnOnAdvanceOptions}
              onClick={toggleAdvanceMode}
            />
          </label>
        </div>
      </div>
      {turnOnAdvanceOptions ? (
        <div className="space-y-5">
          <Dropdown
            onChange={(item) => setSelectedModel(item)}
            label="Generation Model"
            options={AVAILABLE_MODELS}
            keyName="llm-model"
            defaultOption="Select Model"
            isForModelDropdown={true}
            selectedModel={selectedModel}
          />
          <Dropdown
            onChange={(item) => setTargetLanguage(item)}
            label="Subtitle Language"
            options={SOURCE_LANGUAGES}
            keyName="target-language"
            defaultOption="Select Language"
            selectedModel={selectedModel}
          />
          <div className="hidden">
            <p className="font-medium text-wrap">Prompt:</p>
            <p className="font-medium text-xs text-gray-500 mt-[-5px]">
              Optional
            </p>

            <textarea
              name=""
              id=""
              className="resize-none p-2 w-full border-2 rounded-md outline-none"
              rows="10"
              placeholder="enter your prompt here......"
            ></textarea>
          </div>
        </div>
      ) : (
        <Dropdown
          onChange={(item) => setTargetLanguage(item)}
          label="Subtitle Language"
          options={SOURCE_LANGUAGES}
          keyName="target-language"
          defaultOption="Select Language"
          selectedModel={selectedModel}
        />
      )}
      <button
        disabled={disabled}
        onClick={handleSubmit}
        className={` ${
          disabled
            ? "bg-gray-400 hover:cursor-not-allowed"
            : "bg-primary-900 hover:cursor-pointer"
        } w-full mt-5 text-white py-2 rounded-md text-lg font-medium transition-all duration-300 flex items-center justify-center`}
      >
        Generate
      </button>
    </div>
  );
}
