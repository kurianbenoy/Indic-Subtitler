import Header from "@components/components/Header";
import React, { useEffect, useRef, useState } from "react";
import Dropzone from "@components/components/Dropzone";
import Dropdown from "@components/components/Dropdown";
import { SOURCE_LANGUAGES, translation } from "@components/constants";
import { handleTranscribe } from "@components/utils";
import ReactLoading from "react-loading";
import { toast } from "react-toastify";
import { IconDownload } from "@tabler/icons-react";

export default function dashboard() {
  const [uploadedFile, setUploadedFile] = useState();
  const [sourceLanguage, setSourceLanguage] = useState();
  const [outputLanguage, setOutputLanguage] = useState();
  const [disabled, setDisabled] = useState(true);
  const [loading, setLoading] = useState(false);
  const [transcribe, setTranscribe] = useState(translation);
  const textRef = useRef();

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
        setTranscribe(response.data.chunks);
      }
    }
  }
  function handleInputChange(index, newText, type) {
    const updateTranscribe = [...transcribe];
    transcribe[index][type] = newText;
    setTranscribe(updateTranscribe);
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
        {transcribe ? (
          <aside className="w-full lg:w-[75%] mt-14 md:mt-0 md:border-l-2 ">
            <div className="flex md:flex-row flex-col md:justify-end md:text-lg text-white gap-4 md:px-4 md:p-2 md:py-4">
              <button
                onClick={() => console.log(transcribe)}
                className="bg-secondary-900 p-2 rounded-md flex gap-4 w-fit"
              >
                <IconDownload />
                Download
              </button>
            </div>
            <div>
              <div className="overflow-x-auto h-[680px]">
                <table className="table text-lg">
                  <thead className="text-lg">
                    <tr>
                      <th>Timestamp</th>
                      <th>Text</th>
                    </tr>
                  </thead>
                  <tbody className="">
                    {transcribe?.map((element, index) => (
                      <tr key={index}>
                        <td>
                          <p>
                            {element.start} - {element.end}
                          </p>
                        </td>
                        <td>
                          <textarea
                            ref={index === 0 ? textRef : null}
                            className="w-full resize-none "
                            rows={element.text.length < 100 ? 1 : undefined}
                            type="text"
                            value={element.text}
                            onChange={(e) =>
                              handleInputChange(index, e.target.value, "text")
                            }
                          />

                          {/* texting with inputfield */}
                          {/* <input
                            ref={index === 0 ? textRef : null}
                            className="w-full resize-none min-h-fit  max-h-full"
                            type="text"
                            value={element.text}
                            onChange={(e) =>
                              handleInputChange(index, e.target.value, "text")
                            }
                          /> */}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </aside>
        ) : null}
      </main>
    </>
  );
}
