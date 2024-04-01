import { useRouter } from "next/router";
import SecondaryBtn from "./SecondaryBtn";
import PrimaryBtn from "./PrimaryBtn";
import { transitionToCollection } from "@components/utils";

function Buttons({ isHome }) {
  const router = useRouter();

  if (isHome) {
    return (
      <div className="flex flex-wrap gap-4">
        <PrimaryBtn accent={true} fn={() => router.push("/about")}>
          Team
        </PrimaryBtn>
        <PrimaryBtn accent={true} fn={() => router.push("/livetranscribe")}>
          Live Transcribe
        </PrimaryBtn>
        <PrimaryBtn accent={true} fn={() => transitionToCollection(router)}>
          Generate Subtitles
        </PrimaryBtn>
      </div>
    );
  }

  if (router.pathname !== "/contact") {
    return (
      <div className="max-w-fit">
        <PrimaryBtn fn={() => router.push("/contact")}>Contact Us</PrimaryBtn>
      </div>
    );
  }

  return null;
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
        ${isHome ? "top-0" : ""}
        flex flex-col md:flex-row space-y-4 md:space-y-0 flex-wrap justify-between
        pt-5 md:items-center sticky py-5 z-20 bg-white px-2 lg:px-20 md:gap-2
      `}
    >
      <div
        onClick={scrollToTop}
        className="flex items-center cursor-pointer gap-3"
      >
        <img src="/logo.png" width={70} alt="Logo of Indic Subtitler" />
        <h1 className="text-3xl font-semibold font-sans text-primary-900">
          Indic Subtitler
        </h1>
      </div>
      <Buttons isHome={isHome} />
    </header>
  );
}
