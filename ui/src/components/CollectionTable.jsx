import {
  formatFileSize,
  formattedDate,
  getFullLanguageName,
} from "@components/utils";
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
  function getClassNames(model) {
    let classNames = "rounded-lg text-center p-1 ";

    switch (model) {
      case "fasterWhisper":
        classNames += "bg-blue-50 text-blue-900";
        break;
      case "whisperX":
        classNames += "bg-pink-50 text-pink-900";
        break;
      case "seamlessM4t":
        classNames += "bg-green-50 text-green-900";
        break;
      default:
        classNames += "bg-green-50 text-green-900"; // Default to "seamless"
    }

    return classNames;
  }
  if (storedFiles?.length) {
    return (
      <div className="overflow-x-auto h-[75vh]">
        <table className="table md:text-lg ">
          <thead>
            <tr className="text-lg text-gray-600 ">
              <th className=""></th>
              <th className=" ">Name</th>
              <th className="">Date of Upload</th>
              <th>Size</th>
              <th>Language</th>
              <th>Model</th>
              <th></th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {storedFiles
              .slice()
              .reverse()
              .map((element, index) => {
                const localStorageIndex = storedFiles.length - 1 - index;

                return (
                  <tr key={index}>
                    <th>{index + 1}</th>
                    <td className="break-all max-w-48 max-h-32 py-2 px-0">
                      {element.size ? (
                        <p className="truncate-custom">{element.filename}</p>
                      ) : (
                        <span className="flex flex-col break-all  max-w-48 max-h-32 py-2 px-0">
                          <div
                            className="tooltip self-start"
                            data-tip="File imported from Youtube"
                          >
                            <button className="text-sm bg-black text-white w-fit px-2 py-1 rounded-md">
                              Youtube
                            </button>
                          </div>
                          <p className="truncate-custom">{element.filename}</p>

                          {/* {element.filename} */}
                        </span>
                      )}
                    </td>
                    <td className="">{formattedDate(element.uploadDate)}</td>
                    <td> {formatFileSize(element.size) || "-"}</td>

                    <td>
                      {getFullLanguageName(
                        element.model ?? "seamlessM4t",
                        element.targetLanguage ?? element.outputLanguage
                      )}
                    </td>
                    <td className="">
                      <p className={getClassNames(element.model)}>
                        {element.model ?? "seamlessM4t"}
                      </p>
                    </td>
                    <td>
                      <DownloadFileDropdown
                        file={element.transcribedData}
                        filename={element.filename}
                        modelName={element.model}
                      />
                    </td>
                    <td>
                      <button
                        onClick={() =>
                          router.push(`/generate?id=${localStorageIndex}`)
                        }
                        className="flex items-center gap-1"
                      >
                        <IconEdit />
                        <p className="font-medium">Edit</p>
                      </button>
                    </td>
                    <td>
                      <button onClick={() => handleDelete(localStorageIndex)}>
                        <IconTrash />
                      </button>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
    );
  } else {
    return (
      <div className="flex justify-center items-center h-[75vh]">
        <h5 className="text-xl font-medium">Upload a file to edit subtitles</h5>
      </div>
    );
  }
}
