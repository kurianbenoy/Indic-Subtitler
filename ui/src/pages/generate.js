import React, { useEffect, useRef, useState } from "react";
import SubtitleEditor from "@components/components/SubtitleEditor";
import { useRouter } from "next/router";
import FileInformation from "@components/components/generate/FileInformation";
import UploadFile from "@components/components/generate/UploadFile";
import useLocalStorage from "@components/hooks/useLocalStorage";

export default function dashboard() {
  const [uploadedFile, setUploadedFile] = useState();
  const [youtubeLink, setYoutubeLink] = useState();
  const [transcribed, setTranscribed] = useState([]);
  const [requestSentToAPI, setrequestSentToAPI] = useState(false);
  const [isLocalFile, setIsLocalFile] = useState(false);
  const [uploadedFileInformation, setuploadedFileInformation] = useState();
  const [isSubtitleBeingGenerated, setIsSubtitleBeingGenerated] =
    useState(false);
  const [youtubeTitle, setYoutubeTitle] = useState();
  const [selectedModel, setSelectedModel] = useState("fasterWhisper");
  const [isSubtitleGenerated, setIsSubtitleGenerated] = useState(false);
  const router = useRouter();
  const index = router.query.id;
  useEffect(() => {
    const items = JSON.parse(localStorage.getItem("file"));
    if (index && items) {
      if (items[index]) {
        setIsLocalFile(true);
        setIsSubtitleGenerated(true);
        const item = items[index];
        setTranscribed(item.transcribedData);
        setSelectedModel(item.model);
        setYoutubeTitle(item.filename);
        setuploadedFileInformation({
          filename: item.filename,
          filesize: item.size,
          targetLanguage: item.targetLanguage ?? item.outputLanguage,
          uploadDate: item.uploadDate,
          model: item.model,
          link: item.link,
        });
      }
    }
  }, [index]);

  return (
    <>
      <main className="flex flex-col md:flex-row   xl:mx-14 mx-4 gap-4">
        <aside className="w-full md:w-[50%] lg:w-[25%] flex flex-col space-y-10  md:h-[85vh]">
          {isLocalFile ? (
            <div className="h-full ">
              <FileInformation
                uploadedFileInformation={uploadedFileInformation}
              />
            </div>
          ) : (
            <UploadFile
              uploadedFile={uploadedFile}
              setUploadedFile={setUploadedFile}
              setYoutubeLink={setYoutubeLink}
              youtubeLink={youtubeLink}
              setIsBeingGenerated={setIsSubtitleBeingGenerated}
              setTranscribed={setTranscribed}
              setrequestSentToAPI={setrequestSentToAPI}
              isLocalFile={isLocalFile}
              setYoutubeTitle={setYoutubeTitle}
              youtubeTitle={youtubeTitle}
              selectedModel={selectedModel}
              setSelectedModel={setSelectedModel}
              setIsSubtitleGenerated={setIsSubtitleGenerated}
            />
          )}
        </aside>

        <SubtitleEditor
          isBeingGenerated={isSubtitleBeingGenerated}
          transcribed={transcribed}
          setTranscribed={setTranscribed}
          filename={uploadedFile?.path ?? youtubeTitle}
          requestSentToAPI={requestSentToAPI}
          selectedModel={selectedModel}
          isSubtitleGenerated={isSubtitleGenerated}
        />
      </main>
    </>
  );
}
