import React from "react";

export default function Footer() {
  return (
    <footer className="md:px-20 lg:px-40 px-2 py-12 bg-[#edf2fa] flex md:flex-row flex-col">
      <section>
        <h1 className="text-3xl font-semibold font-sans text-primary">
          Indic Subtitler
        </h1>
        <p className="text-gray-500 text-xl lg:w-[45%] md:w-[60%] w-[60%]">
          An open source subtitling platform for transcribing videos/audios in
          Indic languages and translating subtitles as well using ML models.
        </p>
      </section>
      <section className="flex md:flex-row flex-col md:gap-60 text-xl md:mt-0 mt-10 space-y-4 md:space-y-0">
        <div className="">
          <h3 className="font-semibold text-primary">Products</h3>
          <ul className="text-gray-500 space-y-1">
            <li>Pricing</li>
            <li>FAQ</li>
          </ul>
        </div>
        <div>
          <h3 className="font-semibold text-primary">Company</h3>
          <ul className="text-gray-500 space-y-1">
            <li>Contact</li>
            <li>Terms</li>
            <li>Privacy</li>
          </ul>
        </div>
      </section>
    </footer>
  );
}
