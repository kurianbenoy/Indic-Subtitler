import { transitionToCollection } from "@components/utils";
import { useRouter } from "next/router";
import React from "react";

function PrimaryBtn({ accent, children, fn }) {
  const router = useRouter();
  return (
    <button
      onClick={fn}
      className={` ${
        accent
          ? "border-2 border-primary-900 text-primary-900"
          : "bg-primary-900  text-white"
      } px-4 py-2 font-medium rounded-md md:text-xl`}
    >
      {children}
    </button>
  );
}

export default PrimaryBtn;
