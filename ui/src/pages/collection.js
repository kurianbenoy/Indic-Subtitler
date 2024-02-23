import dynamic from "next/dynamic";
import SecondaryBtn from "@components/components/SecondaryBtn";
import useLocalStorage from "@components/hooks/useLocalStorage";
import { useRouter } from "next/router";
import React from "react";
import CollectionTable from "@components/components/CollectionTable";

const Collection = () => {
  const [storedFiles, setStoredFiles] = useLocalStorage("file", []);
  const router = useRouter();

  return (
    <section className="flex justify-center">
      <main className=" w-full lg:w-[90%] xl:w-[80%] border-2 rounded-md">
        <div className="flex justify-between items-center border-b-[2px] py-2 px-2">
          <p className="text-lg text-gray-500 font-medium">
            {storedFiles.length}
            {storedFiles.length === 1 ? " item" : " items"}
          </p>
          <SecondaryBtn fn={() => router.push("/generate")}>
            Generate New Subtitles
          </SecondaryBtn>
        </div>
        <CollectionTable
          storedFiles={storedFiles}
          setStoredFiles={setStoredFiles}
        />
      </main>
    </section>
  );
};

export default dynamic(() => Promise.resolve(Collection), { ssr: false });
