import { useRouter } from "next/router";
import SecondaryBtn from "./SecondaryBtn";
import { useEffect, useState } from "react";
import { transitionToCollection } from "@components/utils";
import PrimaryBtn from "./PrimaryBtn";

function Buttons({ isHome }) {
  const router = useRouter();
  if (isHome) {
    return (
      <div className="flex flex-wrap gap-4">
        <PrimaryBtn accent={true} fn={() => router.push("/about")}>
          Team
        </PrimaryBtn>
        <PrimaryBtn accent={true} fn={() => router.push("/livetranscribe")}>
          Live Transcription
        </PrimaryBtn>
        <SecondaryBtn fn={() => transitionToCollection(router)}>
          Generate Subtitles
        </SecondaryBtn>
      </div>
    );
  }
  if (router.pathname !== "/contact") {
    console.log(router);
    return (
      <div className="max-w-fit">
        <PrimaryBtn fn={() => router.push("/contact")}>Contact Us</PrimaryBtn>
      </div>
    );
  }
}
export default function Header() {
  const router = useRouter();
  const isHome = router.pathname === "/";
  function scrollToTop() {
    if (isHome) {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } else {
      router.push("/");
    }
  }

  return (
    <header
      className={`
    ${isHome && "top-0"}
    flex md:flex-row flex-col space-y-4 flex-wrap md:space-y-0 justify-between pt-5 md:items-center sticky  py-5 z-20 bg-white lg:px-20 px-2 md:gap-2 `}
    >
      <div
        onClick={scrollToTop}
        className="flex items-center cursor-pointer gap-3"
      >
        <img src="/logo.png" width={70} alt="Logo of Indic Subtitler" />
        <h1 className="text-3xl font-semibold font-sans text-primary-900 ">
          Indic Subtitler
        </h1>
      </div>
      <Buttons isHome={isHome} />
    </header>
  );
}
