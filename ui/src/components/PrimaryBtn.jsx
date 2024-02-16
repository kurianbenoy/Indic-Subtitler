import { transitionToDashboard } from "@components/utils";
import { useRouter } from "next/router";
import React from "react";

function PrimaryBtn() {
  const router = useRouter();
  return (
    <button
      onClick={() => transitionToDashboard(router)}
      className="px-4 py-2 bg-primary-900  text-white font-medium rounded-md text-xl"
    >
      Try now for free!
    </button>
  );
}

export default PrimaryBtn;
