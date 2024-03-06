import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import WaveSurfer from "wavesurfer.js";
import {
  IconPlayerPauseFilled,
  IconPlayerPlayFilled,
} from "@tabler/icons-react";
import { useWavesurfer } from "@wavesurfer/react";
import { formatSubtitleData } from "@components/utils";
import { ENGLISH_SUBTITLE, HINDI_SUBTITLE } from "@components/constants";
export default function AudioDemo() {
  const [currentSubtitle, setCurrentSubtitle] = useState([]);
  const formatTime = (seconds) =>
    [seconds / 60, seconds % 60]
      .map((v) => `0${Math.floor(v)}`.slice(-2))
      .join(":");

  const containerRef = useRef(null);
  const [selectedSubtitle, setSelectedSubtitle] = useState("english"); // default english
  const { wavesurfer, isPlaying, currentTime } = useWavesurfer({
    container: containerRef,
    height: 80,
    waveColor: "#ffff",
    progressColor: "#9DC0FA",
    url: "/sample.mp3",
  });
  const onPlayPause = useCallback(() => {
    wavesurfer && wavesurfer.playPause();
  }, [wavesurfer]);

  const subtitlesObject = {
    english: ENGLISH_SUBTITLE,
    hindi: HINDI_SUBTITLE,
  };
  const subtitleData = formatSubtitleData(subtitlesObject[selectedSubtitle]);

  useEffect(() => {
    const newCurrentSubtitle = subtitleData.find(
      (subtitle) => currentTime >= subtitle.start && currentTime <= subtitle.end
    );
    if (newCurrentSubtitle?.text !== currentSubtitle?.text) {
      setCurrentSubtitle(newCurrentSubtitle);
    }
  }, [currentTime]);

  return (
    <section className="md:w-[60%] w-full flex flex-col space-y-4">
      <div className="flex self-end items-center gap-2 ">
        <label className="">Subtitle Language:</label>
        <select
          onChange={(event) => setSelectedSubtitle(event.target.value)}
          aria-label="Subtitle Langugae"
          className="border-2   px-2 py-2 rounded-md cursor-pointer focus-visible:outline-none focus-visible:ring focus-visible:ring-primary-300 transition-all transition-75"
        >
          <option value="english">English</option>
          <option value="hindi">Hindi</option>
          {/* <option value="kannada">Kannada</option>
          <option value="malayalam">Malayalam</option>
          <option value="bengali">bengali</option> */}
        </select>
      </div>
      <div className="bg-[#27272A] rounded-md flex gap-4  p-2 w-full items-center">
        <button
          className="bg-white p-4  rounded-full h-max "
          onClick={onPlayPause}
        >
          {isPlaying ? <IconPlayerPauseFilled /> : <IconPlayerPlayFilled />}
        </button>
        <div className="w-full " ref={containerRef} />
      </div>

      <div className="bg-[#27272A] min-h-20 px-4 py-2 flex items-center text-white rounded-md gap-8">
        <p>{formatTime(currentTime)}</p>
        <p className="p-2 rounded-md bg-[#3F3F46]">{currentSubtitle?.text}</p>
      </div>
    </section>
  );
}
