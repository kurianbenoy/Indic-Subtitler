import { useRef } from "react";
import SecondaryBtn from "../SecondaryBtn";

export default function Header() {
  function scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }
  return (
    <header className="flex justify-between pt-5 items-center sticky top-0 py-5 z-20 bg-white md:px-20 px-2">
      <h1
        onClick={scrollToTop}
        className="text-3xl font-semibold font-sans text-primary cursor-pointer"
      >
        Indic Subtitler
      </h1>
      <SecondaryBtn />
    </header>
  );
}
