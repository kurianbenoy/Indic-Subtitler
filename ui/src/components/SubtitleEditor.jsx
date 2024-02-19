import React from "react";
import { IconDownload } from "@tabler/icons-react";
import { formatTime, removeFileExtension } from "@components/utils";
import SecondaryBtn from "./SecondaryBtn";
import { downloadSRT } from "../utils";

export default function SubtitleEditor({
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

  if (!transcribed?.length && !requestSentToAPI) {
    return (
      <>
        <aside className="w-full lg:w-[75%] mt-14 md:mt-0 md:border-l-2 ">
          <div className="flex md:flex-row flex-col md:justify-end md:text-lg text-white gap-4 md:px-4 md:p-2 md:py-4"></div>

          <div className="flex justify-center items-center h-[70vh]">
            <h5 className="text-xl font-medium">
              Upload a file to edit subtitles
            </h5>
          </div>
        </aside>
      </>
    );
  }
  if (requestSentToAPI) {
    return <h1>Loading....</h1>;
  }
  return (
    <aside className="w-full lg:w-[75%] mt-14 md:mt-0 md:border-l-2 ">
      <div className="flex md:flex-row flex-col md:justify-end md:text-lg text-white gap-4 md:px-4 md:p-2 md:py-4">
        <SecondaryBtn fn={() => downloadSRT(transcribed, filename)}>
          Download
        </SecondaryBtn>
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
                      rows={Math.ceil(element.text.length / 100)}
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
        </div>
      </div>
    </aside>
  );
}
