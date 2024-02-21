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
      <h1
        onClick={scrollToTop}
        className="text-3xl font-semibold font-sans text-primary-900 cursor-pointer"
      >
        Indic Subtitler
      </h1>
      {isHome && (
        <div className="space-x-4 ">
          <PrimaryBtn accent={true} fn={() => router.push("/about")}>
            Team
          </PrimaryBtn>
          <SecondaryBtn fn={() => transitionToCollection(router)}>
            Dashboard
          </SecondaryBtn>
        </div>
      )}
    </header>
  );
}
