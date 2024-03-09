import React from "react";
import PrimaryBtn from "../PrimaryBtn";
import SecondaryBtn from "../SecondaryBtn";
import { IconExternalLink } from "@tabler/icons-react";
import { transitionToCollection } from "@components/utils";
import { useRouter } from "next/router";
import Link from "next/link";
import AudioDemo from "./AudioDemo";

export default function HeroSection() {
  const listOfSupportedModels = [
    "SeamlessM4T",
    "faster-whisper",
    "WhisperX",
    "Vegam-Whisper",
  ];
  const router = useRouter();
  return (
    <section className=" mt-16 flex flex-col items-center md:px-0 px-4">
      <div className="lg:w-[60%]">
        <div className=" space-y-6 mb-12">
          <h1 className="text-5xl font-medium">
            Only Open Source subtitle generator for{" "}
            <span className="text-primary-900">Indic Languages</span>
          </h1>
          <p className="text-gray-500 text-lg">
            Uses powerful ML models like{" "}
            {listOfSupportedModels.map((tech, index) => (
              <React.Fragment key={index}>
                {index === listOfSupportedModels.length - 1 ? " and " : null}
                <span className="font-medium text-gray-700" key={index}>
                  {tech}
                </span>
                {index < listOfSupportedModels.length - 2 ? ", " : null}
              </React.Fragment>
            ))}{" "}
            which altogether supports 12 Indic languages by default.
          </p>
          <div className="flex gap-4 flex-wrap items-end">
            <PrimaryBtn fn={() => transitionToCollection(router)}>
              Try now for free!
            </PrimaryBtn>
            <a
              href="https://github.com/kurianbenoy/Indic-Subtitler"
              target=" _blank"
              className="flex gap-2 bg-secondary-900 text-white  px-4 py-2 font-medium rounded-md md:text-xl"
            >
              Github <IconExternalLink />
            </a>
          </div>
        </div>
        <div className="[box-shadow:rgba(60,_64,_67,_0.3)_0px_1px_2px_0px,_rgba(60,_64,_67,_0.15)_0px_2px_6px_2px] rounded-md  flex flex-row items-center justify-center p-4">
          <AudioDemo />
        </div>
      </div>
    </section>
  );
}
