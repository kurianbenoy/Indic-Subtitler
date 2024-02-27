import {
  formatFileSize,
  formattedDate,
  getFullLanguageName,
  getYouTubeVideoId,
} from "@components/utils";
import {
  IconCalendarMonth,
  IconDatabase,
  IconLanguage,
  IconLink,
  IconMovie,
  IconRobotFace,
} from "@tabler/icons-react";

function FileDetail({ icon, label, value }) {
  return (
    <div className="flex gap-2">
      {icon}
      <p className="break-all">
        {label}: {value}
      </p>
    </div>
  );
}
function Thumbnail({ image }) {
  return <img className="max-h-72  w-full" src={image} alt="Thumbnail" />;
}
export default function FileInformation({ uploadedFileInformation }) {
  return (
    <>
      <h2 className="text-3xl font-medium mb-5">File Information</h2>
      <Thumbnail
        image={
          uploadedFileInformation.link
            ? `https://img.youtube.com/vi/${getYouTubeVideoId(
                uploadedFileInformation.link
              )}/0.jpg`
            : "/audio-file.svg"
        }
      />
      <div className="text-gray-600 space-y-5  mt-4">
        <FileDetail
          icon={<IconMovie />}
          label="File Name"
          value={uploadedFileInformation.filename}
        />
        {uploadedFileInformation.link ? (
          <div className="flex gap-2">
            <IconLink />
            <p>
              Link:{" "}
              <a
                href={uploadedFileInformation.link}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-blue-600"
              >
                {uploadedFileInformation.link}
              </a>
            </p>
          </div>
        ) : null}
        <FileDetail
          icon={<IconLanguage />}
          label="Subtitle Language"
          value={getFullLanguageName(
            uploadedFileInformation.model ?? "seamlessM4t",
            uploadedFileInformation.targetLanguage
          )}
        />

        <FileDetail
          icon={<IconRobotFace />}
          label="Model Used"
          value={uploadedFileInformation.model}
        />
        {uploadedFileInformation.filesize && (
          <FileDetail
            icon={<IconDatabase />}
            label="File Size"
            value={formatFileSize(uploadedFileInformation.filesize)}
          />
        )}
        <FileDetail
          icon={<IconCalendarMonth />}
          label="Upload Date"
          value={formattedDate(uploadedFileInformation.uploadDate)}
        />
      </div>
    </>
  );
}
