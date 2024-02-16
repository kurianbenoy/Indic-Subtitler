import React from "react";
import PrimaryBtn from "../PrimaryBtn";
import Image from "next/image";

export default function HeroSection() {
  return (
    <section className="md:mt-44 mt-16 flex  justify-between lg:justify-center lg:gap-56 items-center md:px-0 px-4">
      <div className="md:w-[40%] space-y-6 md:px-20 px-2 ">
        <h1 className="text-5xl font-medium">
          Only Open Source subtitle generator for{" "}
          <span className="text-primary-900">Indic Languages</span>
        </h1>
        <p className="text-gray-500 text-lg">
          Supported by SeamlessM4T-v2 large model, which supports almost 12
          Indic languages by default.
        </p>
        <PrimaryBtn />
      </div>
      <img
        className="hidden md:block lg:w-[550px] md:w-[460px] "
        src="/text-files.svg"
        alt="illustration"
      />
    </section>
  );
}
