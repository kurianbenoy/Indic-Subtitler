import Header from "@components/components/Header";
import SecondaryBtn from "@components/components/SecondaryBtn";
import { downloadSRT, formatFileSize, formattedDate } from "@components/utils";
import { IconDownload, IconEdit, IconFileText } from "@tabler/icons-react";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

export default function collection() {
  const [storedFile, setStoredFile] = useState([]);
  useEffect(() => {
    const file = JSON.parse(localStorage.getItem("file"));
    if (file) setStoredFile(file);
    console.log(file);
  }, []);

  const router = useRouter();
  function TableRows() {
    if (storedFile.length > 0) {
      return (
        <div className="overflow-x-auto ">
          <table className="table text-lg">
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
              {storedFile.map((element, index) => (
                <tr key={index}>
                  <th>{index + 1}</th>
                  <td>{element.filename}</td>
                  <td>{formattedDate(element.uploadDate)}</td>
                  {/* <td>{formatFileSize(element?.size)}</td> */}
                  <td>
                    <button
                      onClick={() => router.push(`/dashboard?id=${index}`)}
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
          <h5 className="text-xl font-medium">
            Upload a file to edit subtitles
          </h5>
        </div>
      );
    }
  }
  return (
    <>
      <Header />
      <section className="flex justify-center">
        <div className="md:w-[70%]  border-2 rounded-md">
          <div className="flex justify-between items-center border-b-[2px] py-2 px-2">
            <p className="text-lg text-gray-500 font-medium">
              {storedFile.length}
              {storedFile.length > 1 ? " items" : " item"}
            </p>
            <SecondaryBtn fn={() => router.push("/dashboard")}>
              Upload new file
            </SecondaryBtn>
          </div>
          <TableRows />
        </div>
      </section>
    </>
  );
}
