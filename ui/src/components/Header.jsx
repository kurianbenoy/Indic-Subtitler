import { useRouter } from "next/router";
import SecondaryBtn from "./SecondaryBtn";
import { useEffect, useState } from "react";
import { transitionToCollection } from "@components/utils";
import PrimaryBtn from "./PrimaryBtn";

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
    flex md:flex-row flex-col space-y-4 flex-wrap md:space-y-0 justify-between pt-5 md:items-center sticky  py-5 z-20 bg-white md:px-20 px-2 `}
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

      {isHome && (
        <div className="flex flex-wrap gap-4 ">
          <PrimaryBtn accent={true} fn={() => router.push("/about")}>
            Team
          </PrimaryBtn>
          <PrimaryBtn accent={true} fn={() => router.push("/livetranscribe")}>
            Live Transcription
          </PrimaryBtn>
          <PrimaryBtn
            accent={true}
            fn={() => router.push("/blog/terms-and-licenses")}
          >
            Terms & Licenses
          </PrimaryBtn>
          <SecondaryBtn fn={() => transitionToCollection(router)}>
            Dashboard
          </SecondaryBtn>
        </div>
      )}
    </header>
  );
}
