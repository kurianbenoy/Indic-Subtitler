import React from "react";

export default function SecondaryBtn({ fn, children }) {
  return (
    <button
      onClick={() => fn()}
      className="bg-secondary-900 text-white font-medium md:px-8 md:py-2 px-4 py-2 rounded-md"
    >
      {children}
    </button>
  );
}
