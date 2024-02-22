import React, { useEffect, useState } from "react";
import Dropzone from "@components/components/Dropzone";
import Dropdown from "@components/components/Dropdown";
import { SOURCE_LANGUAGES } from "@components/constants";
import { getYouTubeVideoId, handleTranscribe } from "@components/utils";
import { ToastContainer, toast } from "react-toastify";
import SubtitleEditor from "@components/components/SubtitleEditor";
import useLocalStorage from "@components/hooks/useLocalStorage";
import { useRouter } from "next/router";
import { IconLink } from "@tabler/icons-react";

export default function dashboard() {
  const [uploadedFile, setUploadedFile] = useState();
  const [targetLanguage, setTargetLanguage] = useState();
  const [youtubeLink, setYoutubeLink] = useState();
  const [disabled, setDisabled] = useState(true);
  const [transcribed, setTranscribed] = useState([]);
  const [requestSentToAPI, setrequestSentToAPI] = useState(false);
  const [isLocalFile, setIsLocalFile] = useState(false);

  const router = useRouter();
  const index = router.query.id;

  const handleInputChange = (event) => {
    const value = event.target.value;
    setYoutubeLink(value);
  };
  useEffect(() => {
    const items = JSON.parse(localStorage.getItem("file"));
    if (index && items) {
      if (items[index]) {
        const item = items[index];
        setDisabled(true);
        setUploadedFile(item.uploadedFile);
        setTargetLanguage(item.targetLanguage);
        setTranscribed(item.transcribedData);
        setUploadedFile({
          path: item.filename,
          size: item.size,
        });
        setIsLocalFile(true);
      }
    }
  }, [index]);

  useEffect(() => {
    if ((uploadedFile || youtubeLink) && targetLanguage && !isLocalFile) {
      setDisabled(false);
    } else setDisabled(true);
  }, [uploadedFile, targetLanguage, youtubeLink]);

  function storeFileToLocalStorage(file) {
    const items = JSON.parse(localStorage.getItem("file"));
    if (!items) {
      localStorage.setItem("file", JSON.stringify([file]));
    } else {
      items.push(file);
      localStorage.setItem("file", JSON.stringify(items));
    }
  }

  function reset(state) {
    setDisabled(state);
    setrequestSentToAPI(state);
  }

  async function handleSubmit() {
    // if (uploadedFile && youtubeLink)
    //   return toast.error("Cannot upload both file and youtube link");
    // const file = uploadedFile ?? youtubeLink;
    // const response = await handleTranscribe(file, targetLanguage);

    reset(true);
    const response = await handleTranscribe(uploadedFile, targetLanguage);
    if (response) {
      reset(false);
      if (response.data.code !== 200) {
        console.log(response);
        toast.error(response.data.message);
      } else {
        setTranscribed(response.data.chunks);
        const file = {
          filename: uploadedFile.path,
          size: uploadedFile.size,
          transcribedData: response.data.chunks,
          uploadDate: new Date(),
          targetLanguage: targetLanguage,
        };
        storeFileToLocalStorage(file);
      }
    }
  }
  return (
    <>
      <ToastContainer />
      <main className="mt-8 flex flex-col md:flex-row md:mb-8 xl:mx-14 mx-4 gap-4">
        <aside className="w-full md:w-[30%] lg:w-[25%] flex flex-col space-y-10 p-2">
          <div>
            <h2 className="text-3xl font-medium">Upload a File</h2>
            <p className="font-xl text-gray-500 font-medium mt-2">
              Upload an audio file to generate subtitles
            </p>
          </div>
          <div className="h-80">
            <Dropzone
              setUploadedFile={setUploadedFile}
              uploadedFile={uploadedFile}
            />
          </div>
          {/* hidden for now, will be changed once API is ready*/}
          <div className="hidden">
            <div className="divider font-medium">OR</div>
            <label className="flex border-2 rounded-lg gap-2 p-2 focus-visible:outline-none focus-visible:ring focus-visible:ring-primary-300 transition-all transition-75">
              <IconLink color="grey" />
              <input
                onChange={handleInputChange}
                type="text"
                className="w-full outline-none"
                placeholder="Paste YouTube Video Link"
              />
            </label>
          </div>
          <div className="space-y-5">
            <Dropdown
              onChange={(item) => setTargetLanguage(item)}
              label="Subtitle Language"
              options={SOURCE_LANGUAGES}
              keyName="target-language"
            />
          </div>
          <button
            disabled={disabled}
            onClick={handleSubmit}
            className={` ${
              disabled
                ? "bg-gray-400 hover:cursor-not-allowed"
                : "bg-primary-900 hover:cursor-pointer"
            } text-white py-2 rounded-md text-lg font-medium transition-all duration-300 flex items-center justify-center`}
          >
            Generate
          </button>
        </aside>
        <SubtitleEditor
          transcribed={transcribed}
          setTranscribed={setTranscribed}
          filename={uploadedFile?.path}
          requestSentToAPI={requestSentToAPI}
        />
      </main>
    </>
  );
}
