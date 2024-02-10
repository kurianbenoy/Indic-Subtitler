import { useCallback, useEffect, useMemo, useState } from "react";

import { FaTrash } from "react-icons/fa";
import { useDropzone } from "react-dropzone";
import { formatFileSize } from "@components/utils";
import { toast } from "react-toastify";

const FileUpload = () => {
  const [uploadedFiles, setUploadedFiles] = useState([]);

  const onDrop = useCallback(async (acceptedFiles) => {
    //   console.log(acceptedFiles);
    //   const uniqueFiles = [...new Set([...uploadedFiles, ...acceptedFiles])];
    //   setUploadedFiles(uniqueFiles);
    setUploadedFiles(acceptedFiles);
  }, []);

  const handleRemoveFile = (index) => {
    setUploadedFiles((prevFiles) => prevFiles.filter((file, i) => i !== index));
  };

  const {
    getRootProps,
    getInputProps,
    isFocused,
    isDragAccept,
    isDragActive,
    isDragReject,
  } = useDropzone({
    onDrop,
    accept: {
      "audio/mpeg": [".mp3", ".mpeg", ".mpga"],
      "audio/mp4": [".m4a"],
      "audio/wav": [".wav"],
      "video/mp4": [".mp4"],
      "video/webm": [".webm"],
    },
  });

  const style = useMemo(
    () => ({
      ...baseStyle,
      ...(isFocused ? focusedStyle : {}),
      ...(isDragAccept ? acceptStyle : {}),
      ...(isDragReject ? rejectStyle : {}),
    }),
    [isFocused, isDragAccept, isDragReject]
  );

  const handleTranscribe = () => {
    toast.info("Transcribing Audio. Hold on...");
  };

  return (
    <div className="m-4 p-4 prose">
      <h3>Add an Audio or Video File</h3>
      <div className="flex justify-center items-center w-100">
        <div {...getRootProps({ style })}>
          <input {...getInputProps()} />
          {isDragActive ? (
            <p>Drop the files here ...</p>
          ) : (
            <p>
              Drag and drop some audio or video files; or click here to select
              files
            </p>
          )}
        </div>
      </div>

      {uploadedFiles.length > 0 && (
        <div>
          <h3>Uploaded File:</h3>
          <ul>
            {uploadedFiles.map((file, index) => (
              <li key={index}>
                {file.name}
                {file.size && (
                  <span className="text-gray-900">
                    {" "}
                    ( {formatFileSize(file.size)} )
                  </span>
                )}
                <button
                  className="btn-icon"
                  onClick={() => handleRemoveFile(index)}
                >
                  <FaTrash />
                </button>
              </li>
            ))}
          </ul>

          <button className="btn btn-primary" onClick={handleTranscribe}>
            Get Subtitles
          </button>
        </div>
      )}
    </div>
  );
};

export default FileUpload;

const baseStyle = {
  flex: 1,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  padding: "20px",
  borderWidth: 2,
  borderRadius: 2,
  borderColor: "#eeeeee",
  borderStyle: "dashed",
  backgroundColor: "#fafafa",
  color: "#bdbdbd",
  outline: "none",
  transition: "border .24s ease-in-out",
};

const focusedStyle = {
  borderColor: "#2196f3",
};

const acceptStyle = {
  borderColor: "#00e676",
};

const rejectStyle = {
  borderColor: "#ff1744",
};
