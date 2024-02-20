import React from "react";

export default function SecondaryBtn({ fn, children, accent }) {
  return (
    <button
      onClick={() => fn()}
      className={` ${
        accent
          ? "border-2 border-secondary-900 text-secondary-900"
          : "bg-secondary-900 text-white"
      }   px-4 py-2 font-medium rounded-md md:text-xl`}
    >
      {children}
    </button>
  );
}
