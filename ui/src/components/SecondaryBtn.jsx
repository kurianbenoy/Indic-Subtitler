import { transitionToDashboard } from "@components/utils";
import { useRouter } from "next/router";
import React from "react";

export default function SecondaryBtn({ fn, children }) {
  return (
    <button
      onClick={() => fn()}
      className="bg-secondary-900 text-white font-medium md:px-8 md:py-2 px-4 py-2 rounded-md"
      // className=" text-black border-2 border-black font-medium p-[2px] rounded-md"
    >
      {children}
    </button>
  );
}
