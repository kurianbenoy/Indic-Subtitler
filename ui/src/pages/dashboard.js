import Header from "@components/components/Header";
import React, { useEffect, useRef, useState } from "react";
import Dropzone from "@components/components/Dropzone";
import Dropdown from "@components/components/Dropdown";
import { SOURCE_LANGUAGES, translation } from "@components/constants";
import { handleTranscribe } from "@components/utils";
import ReactLoading from "react-loading";
import { toast } from "react-toastify";
import SubtitleEditor from "@components/components/SubtitleEditor";

export default function dashboard() {
  const [uploadedFile, setUploadedFile] = useState();
  const [sourceLanguage, setSourceLanguage] = useState();
  const [outputLanguage, setOutputLanguage] = useState();
  const [disabled, setDisabled] = useState(true);
  const [loading, setLoading] = useState(false);
  const [transcribed, setTranscribed] = useState();

  useEffect(() => {
    if (uploadedFile && sourceLanguage && outputLanguage) {
      setDisabled(false);
    }
  }, [uploadedFile, sourceLanguage, outputLanguage]);

  async function handleSubmit() {
    setLoading(true);
    const response = await handleTranscribe(
      uploadedFile,
      sourceLanguage,
      outputLanguage
    );

    if (response) {
      setLoading(false);
      if (response.status !== 200) {
        return toast.error("An error occured");
      } else {
        setTranscribed(response.data.chunks);
      }
    }
  }
  return (
    <>
      <Header />
      <main className="mt-8 flex flex-col md:flex-row md:mb-8 xl:mx-14 mx-4 gap-4">
        <aside className="w-full md:w-[40%] lg:w-[25%] flex flex-col space-y-10 p-2">
          <div>
            <h2 className="text-3xl font-medium">Upload a File</h2>
            <p className="font-xl text-gray-500 font-medium mt-2">
              Upload an audio file to generate subtitle
            </p>
          </div>
          <div className="h-80">
            <Dropzone
              setUploadedFile={setUploadedFile}
              uploadedFile={uploadedFile}
            />
          </div>
          <div className="space-y-5">
            <Dropdown
              onChange={(item) => setSourceLanguage(item)}
              label="Source"
              options={SOURCE_LANGUAGES}
            />
            <Dropdown
              onChange={(item) => setOutputLanguage(item)}
              label="Output"
              options={SOURCE_LANGUAGES}
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
            {loading ? (
              <ReactLoading type="spin" height={30} width={30} />
            ) : (
              "Generate"
            )}
          </button>
        </aside>
        {transcribed ? (
          <SubtitleEditor
            transcribed={transcribed}
            setTranscribed={setTranscribed}
            filename={uploadedFile?.path}
          />
        ) : null}
      </main>
    </>
  );
}
