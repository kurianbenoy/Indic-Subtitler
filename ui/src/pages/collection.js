import dynamic from "next/dynamic";
import Header from "@components/components/Header";
import SecondaryBtn from "@components/components/SecondaryBtn";
import useLocalStorage from "@components/hooks/useLocalStorage";
import { downloadSRT, formatFileSize, formattedDate } from "@components/utils";
import { IconDownload, IconEdit, IconFileText } from "@tabler/icons-react";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

function TableRows({ storedFiles }) {
  const router = useRouter();

  if (storedFiles?.length) {
    return (
      <div className="overflow-x-auto ">
        <table className="table md:text-lg">
          <thead>
            <tr className="text-lg text-gray-600">
              <th></th>
              <th>Name</th>
              <th>Date</th>
              <th>Size</th>
              <th></th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {storedFiles.map((element, index) => (
              <tr key={index}>
                <th>{index + 1}</th>
                <td>{element.filename}</td>
                <td>{formattedDate(element.uploadDate)}</td>
                <td>{formatFileSize(element?.size)}</td>
                <td>
                  <button
                    onClick={() => router.push(`/generate?id=${index}`)}
                    className="flex items-center gap-2"
                  >
                    <IconEdit />
                    <p className="font-medium">Edit</p>
                  </button>
                </td>
                <td>
                  <button
                    className="flex items-center gap-2"
                    onClick={() =>
                      downloadSRT(element.transcribedData, element.filename)
                    }
                  >
                    <IconDownload />
                    <p className="font-medium">Download</p>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  } else {
    return (
      <div className="flex justify-center items-center min-h-48">
        <h5 className="text-xl font-medium">Upload a file to edit subtitles</h5>
      </div>
    );
  }
}

const Collection = () => {
  const [storedFiles, setStoredFiles] = useLocalStorage("file", []);
  const router = useRouter();

  return (
    <>
      <Header />
      <section className="flex justify-center">
        <div className="md:w-[70%] w-full md:mx-0 mx-8 border-2 rounded-md">
          <div className="flex justify-between items-center border-b-[2px] py-2 px-2">
            <p className="text-lg text-gray-500 font-medium">
              {storedFiles.length}
              {storedFiles.length === 1 ? " item" : " items"}
            </p>
            <SecondaryBtn fn={() => router.push("/generate")}>
              Generate New Subtitles
            </SecondaryBtn>
          </div>
          <TableRows storedFiles={storedFiles} />
        </div>
      </section>
    </>
  );
};

export default dynamic(() => Promise.resolve(Collection), { ssr: false });
