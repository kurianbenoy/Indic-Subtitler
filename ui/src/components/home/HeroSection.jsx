import React from "react";
import PrimaryBtn from "../PrimaryBtn";
import SecondaryBtn from "../SecondaryBtn";
import { IconExternalLink } from "@tabler/icons-react";
import { transitionToCollection } from "@components/utils";
import { useRouter } from "next/router";

export default function HeroSection() {
  const listOfSupportedModels = ["SeamlessM4T", "faster-whisper", "WhisperX", "Vegam-Whisper"];
  const router = useRouter();
  return (
    <section className="md:mt-44 mt-16 flex  justify-between lg:justify-center lg:gap-56 items-center md:px-0 px-4">
      <div className="lg:w-[40%] space-y-6 md:px-20 px-2">
        <h1 className="text-5xl font-medium">
          Only Open Source subtitle generator for{" "}
          <span className="text-primary-900">Indic Languages</span>
        </h1>
        <p className="text-gray-500 text-lg">
          Supported by{" "}
          {listOfSupportedModels.map((tech, index) => (
            <React.Fragment key={index}>
              {index === listOfSupportedModels.length - 1 ? " and " : null}
              <span className="font-medium text-gray-700" key={index}>
                {tech}
              </span>
              {index < listOfSupportedModels.length - 2 ? ", " : null}
            </React.Fragment>
          ))}{" "}
          which support almost 12 Indic languages by default.
        </p>
        <div className="flex gap-4 flex-wrap">
          <PrimaryBtn fn={() => transitionToCollection(router)}>
            Try now for free!
          </PrimaryBtn>
          <SecondaryBtn fn={() => null}>
            <a
              href="https://github.com/kurianbenoy/Indic-Subtitler"
              target=" _blank"
              className="flex gap-2"
            >
              Github <IconExternalLink />
            </a>
          </SecondaryBtn>
        </div>
      </div>
      <img
        className="hidden md:block lg:w-[550px] md:w-[460px] "
        src="/text-files.svg"
        alt="illustration"
      />
    </section>
  );
}
