import SecondaryBtn from "../SecondaryBtn";

export default function Header() {
  return (
    <header className="flex justify-between pt-5 items-center sticky top-0 py-5 z-20 bg-white md:px-20 px-2  ">
      <h1 className="text-3xl font-semibold font-sans text-primary">
        Indic Subtitler
      </h1>
      <SecondaryBtn />
    </header>
  );
}
