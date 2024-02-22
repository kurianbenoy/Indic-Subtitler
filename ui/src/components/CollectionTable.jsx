import { formatFileSize, formattedDate } from "@components/utils";
import { useRouter } from "next/router";
import DownloadFileDropdown from "./DownloadFileDropdown";
import { IconEdit, IconTrash } from "@tabler/icons-react";
import { SOURCE_LANGUAGES } from "@components/constants";

export default function CollectionTable({ storedFiles, setStoredFiles }) {
  const router = useRouter();
  function handleDelete(index) {
    const copyOfStoredFiles = [...storedFiles];
    copyOfStoredFiles.splice(index, 1);
    setStoredFiles(copyOfStoredFiles);
  }
  if (storedFiles?.length) {
    return (
      <div className="overflow-x-auto min-h-[75vh]">
        <table className="table md:text-lg ">
          <thead>
            <tr className="text-lg text-gray-600">
              <th></th>
              <th>Name</th>
              <th>Date</th>
              <th>Size</th>
              <th>Subtitle Language</th>
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
                  {
                    SOURCE_LANGUAGES.find(
                      (lang) =>
                        lang.id ===
                        (element.targetLanguage ?? element.outputLanguage)
                    )?.name
                  }
                </td>
                <td>
                  <DownloadFileDropdown
                    file={element.transcribedData}
                    filename={element.filename}
                  />
                </td>
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
                  <button onClick={() => handleDelete(index)}>
                    <IconTrash />
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
