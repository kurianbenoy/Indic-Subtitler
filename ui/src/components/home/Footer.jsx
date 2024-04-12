import Link from "next/link";
import React from "react";

export default function Footer() {
  return (
    <footer className="md:px-20 lg:px-40 px-8 py-12 bg-[#edf2fa] flex md:flex-row flex-col">
      <section>
        <h1 className="text-3xl font-semibold font-sans text-primary-900">
          Indic Subtitler
        </h1>
        <p className="text-gray-800  lg:w-[45%] md:w-[60%] w-[60%]">
          An open source subtitling platform for transcribing videos/audios in
          Indic languages. Also supports translating subtitles using powerful
          Machine Learning models.
        </p>
      </section>
      <section className="flex md:flex-row flex-col md:gap-60  md:mt-0 mt-10 space-y-4 md:space-y-0">
        <div>
          <h1 className="font-semibold text-primary-900">Product</h1>
          <ul className="text-gray-800 space-y-1">
            <li>
              <Link href="/blog">Blog</Link>
            </li>
            <li>
              <Link href="https://github.com/kurianbenoy/Indic-Subtitler/">
                GitHub
              </Link>
            </li>
            <li>
              <Link href="/terms">Terms and Conditions</Link>
            </li>
            <li>
              <Link href="/about">About us</Link>
            </li>
            <li>
              <Link href="/contact">Contact us</Link>
            </li>
          </ul>
        </div>
      </section>
    </footer>
  );
}
