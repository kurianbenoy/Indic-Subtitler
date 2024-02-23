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
  function getFullLanguageName(model, languageCode) {
    const modelLanguages = SOURCE_LANGUAGES.find(
      (item) => item.model === model
    );
    if (modelLanguages) {
      const language = modelLanguages.languages.find(
        (item) => item.id === languageCode
      );
      if (language) {
        return language.name;
      }
    }
    return languageCode;
  }
  if (storedFiles?.length) {
    return (
      <div className="overflow-x-auto max-h-[75vh]">
        <table className="table md:text-lg ">
          <thead>
            <tr className="text-lg text-gray-600 ">
              <th></th>
              <th className="w-8">Name</th>
              <th className="">Date of Upload</th>
              <th>Size</th>
              <th>Language</th>
              <th>Model</th>
              <th></th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {storedFiles.map((element, index) => (
              <tr key={index}>
                <th>{index + 1}</th>
                <td>
                  {element.size ? (
                    element.filename
                  ) : (
                    <span className="flex flex-col">
                      <div
                        className="tooltip self-start"
                        data-tip="File imported from Youtube"
                      >
                        <button className="text-sm bg-black text-white w-fit px-2 py-1 rounded-md">
                          Youtube
                        </button>
                      </div>

                      {element.filename}
                    </span>
                  )}
                </td>
                <td className="">{formattedDate(element.uploadDate)}</td>
                <td> {element.size ? formatFileSize(element.size) : "-"}</td>

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
                  />
                </td>
                <td>
                  <button
                    onClick={() => router.push(`/generate?id=${index}`)}
                    className="flex items-center gap-1"
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
