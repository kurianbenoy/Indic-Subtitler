import { transitionToDashboard } from "@components/utils";
import { useRouter } from "next/router";
import React from "react";

export default function SecondaryBtn() {
  const router = useRouter();

  return (
    <button
      onClick={() => transitionToDashboard(router)}
      className="bg-secondary text-white font-medium md:px-8 md:py-2 px-4 py-2 rounded-md"
    >
      Dashboard
    </button>
  );
}
