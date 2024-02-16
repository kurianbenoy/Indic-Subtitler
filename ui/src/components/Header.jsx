import { useRouter } from "next/router";
import SecondaryBtn from "./SecondaryBtn";
import { useState } from "react";

export default function Header() {
  const router = useRouter();
  const [isHome, setIsHome] = useState(router.pathname === "/");

  function scrollToTop() {
    if (isHome) {
      console.log("hey");
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
    flex justify-between pt-5 items-center sticky  py-5 z-20 bg-white md:px-20 px-2`}
    >
      <h1
        onClick={scrollToTop}
        className="text-3xl font-semibold font-sans text-primary cursor-pointer"
      >
        Indic Subtitler
      </h1>
      {isHome && <SecondaryBtn />}
    </header>
  );
}
