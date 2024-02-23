import {
  downloadJSON,
  downloadSRT,
  downloadTXT,
  downloadVTT,
} from "@components/utils";
import React from "react";

export default function DownloadFileDropdown({ file, filename }) {
  return (
    <div className="dropdown dropdown-left">
      <div
        tabIndex={0}
        role="button"
        className="btn m-1 bg-secondary-900 hover:bg-secondary-900 text-white"
      >
        Download Subtitle
      </div>
      <ul
        tabIndex={0}
        className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52 text-black "
      >
        <li onClick={() => downloadSRT(file, filename)}>
          <a>.SRT</a>
        </li>
        <li onClick={() => downloadVTT(file, filename)}>
          <a>.VTT</a>
        </li>
        <li onClick={() => downloadJSON(file, filename)}>
          <a>.JSON</a>
        </li>
        <li onClick={() => downloadTXT(file, filename)}>
          <a>.TXT</a>
        </li>
      </ul>
    </div>
  );
}
