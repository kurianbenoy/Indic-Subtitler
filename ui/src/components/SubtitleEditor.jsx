import React, { useEffect, useRef } from "react";
import { formatTime } from "@components/utils";
import DownloadFileDropdown from "./DownloadFileDropdown";

export default function SubtitleEditor({
  isBeingGenerated,
  transcribed = [],
  setTranscribed,
  filename,
  requestSentToAPI,
}) {
  function handleInputChange(index, newText, type) {
    const updateTranscribe = [...transcribed];
    updateTranscribe[index][type] = newText;
    setTranscribed(updateTranscribe);
  }
  const endDivRef = useRef();

  useEffect(() => {
    endDivRef?.current?.scrollIntoView({ behavior: "smooth" });
  }, [transcribed]);

  if (!transcribed?.length && !requestSentToAPI) {
    return (
      <>
        <aside className="w-full lg:w-[75%]  md:mt-0 md:border-l-2 ">
          <div className="flex md:flex-row flex-col md:justify-end md:text-lg text-white gap-4 md:px-4 md:p-2 md:py-4"></div>

          <div className="flex justify-center items-center h-[70vh]">
            <h5 className="text-xl font-medium">
              Upload a file or link a youtube video to start editing subtitles
            </h5>
          </div>
        </aside>
      </>
    );
  }
  if (requestSentToAPI) {
    return (
      <div className="w-full lg:w-[75%] flex justify-center items-center flex-col">
        <span className="loading loading-spinner loading-lg"></span>
        <h1>Loading Subtitles....</h1>
      </div>
    );
  }
  return (
    <aside className="w-full lg:w-[75%] md:mt-0 md:border-l-2 ">
      <div className="flex md:flex-row flex-col md:justify-end md:text-lg text-white gap-4 md:px-4 md:p-2 md:py-4">
        {isBeingGenerated ? (
          <div className="btn m-1 bg-secondary-100 disabled">
            Generating ...
          </div>
        ) : (
          <DownloadFileDropdown file={transcribed} filename={filename} />
        )}
      </div>
      <div>
        <div className="overflow-x-auto h-[680px]">
          <p className="text-gray-500 font-semibold mx-2">
            Click on subtitle to start editing
          </p>
          <table className="table text-lg">
            <thead className="text-lg text-gray-600">
              <tr>
                <th>Timestamp</th>
                <th>Text</th>
              </tr>
            </thead>
            <tbody className="">
              {transcribed?.map((element, index) => (
                <tr key={index}>
                  <td width="25%">
                    <p>
                      {formatTime(element.start).replace(",", ".")} -{" "}
                      {formatTime(element.end).replace(",", ".")}
                    </p>
                  </td>
                  <td>
                    <textarea
                      className="w-full resize-none"
                      rows={Math.ceil(element.text?.length / 100) || 2}
                      type="text"
                      value={element.text}
                      onChange={(e) =>
                        handleInputChange(index, e.target.value, "text")
                      }
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div ref={endDivRef}></div>
        </div>
      </div>
    </aside>
  );
}
