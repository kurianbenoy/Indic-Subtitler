import Link from "next/link";
import React from "react";

const Navbar = () => {
  return (
    <div>
      <div className="navbar bg-base-300">
        <Link href="/" className="btn btn-ghost text-xl">
          Indic-Subtitler
        </Link>
      </div>
    </div>
  );
};

export default Navbar;
