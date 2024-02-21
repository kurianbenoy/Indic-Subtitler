import { TEAM } from "@components/constants";
import {
  IconBrandGithub,
  IconBrandLinkedin,
  IconBrandTwitter,
} from "@tabler/icons-react";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";

export default function Gallery() {
  return (
    <section className=" space-y-16 md:space-y-32 my-14">
      {TEAM.map((element, index) => (
        <div
          className={`flex flex-col justify-evenly ${
            index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
          }`}
          key={index}
        >
          <img
            src={element.img}
            className="lg:w-[20%] md:w-[30%] aspect-w-4 aspect-h-3 rounded-2xl self-center"
            alt={`Picture of ${element.name}`}
          />
          <div className="md:w-[40%] mt-2 md:mt-0">
            <h2 className="text-4xl mb-4 font-medium">{element.name}</h2>
            <p className="mb-4   text-gray-600 md:leading-9 md:text-lg">
              {element.description}
            </p>
            <div className="flex self-end gap-4">
              <a
                target="_blank"
                href={element.github}
                className="hover:text-primary-900 transition-all duration-300"
              >
                <IconBrandGithub />
              </a>
              <a
                target="_blank"
                href={element.linkedin}
                className="hover:text-primary-900 transition-all duration-300"
              >
                <IconBrandLinkedin />
              </a>
              <a
                target="_blank"
                href={element.twitter}
                className="hover:text-primary-900 transition-all duration-300"
              >
                <IconBrandTwitter />
              </a>
            </div>
          </div>
        </div>
      ))}
    </section>
  );
}
