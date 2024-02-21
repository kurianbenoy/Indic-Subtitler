import { TEAM } from "@components/constants";
import {
  IconBrandGithub,
  IconBrandLinkedin,
  IconBrandTwitter,
} from "@tabler/icons-react";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";

export default function Gallery() {
  const carouselRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const carousel = carouselRef.current;
      const scrollPosition = carousel.scrollTop;
      const itemHeight = carousel.clientHeight;
      const newIndex = Math.round(scrollPosition / itemHeight);
      setActiveIndex(newIndex);
    };
    const carousel = carouselRef.current;
    carousel.addEventListener("scroll", handleScroll);

    return () => {
      carousel.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <>
      <section className="hidden md:flex">
        <div className="flex flex-col py-2 gap-2 self-center ">
          {[1, 2, 3].map((index) => (
            <button
              key={index}
              className={`btn btn-xs ${
                activeIndex === index - 1 ? "bg-blue-500" : ""
              }`}
            >
              {index}
            </button>
          ))}
        </div>

        <div
          className="max-h-min md:h-[540px] carousel carousel-vertical "
          ref={carouselRef}
        >
          {TEAM.map((element, index) => (
            <div
              key={index}
              className="carousel-item h-full flex items-center md:justify-around flex-col md:flex-row"
            >
              <div className="w-[40%] flex items-center justify-center">
                <Image
                  src={element.img}
                  className="rounded-2xl"
                  height={350}
                  width={350}
                />
              </div>
              <aside className="w-[40%] flex flex-col justify-between lg:py-16 py-4">
                <div>
                  <h2 className="text-4xl mb-4 font-medium">{element.name}</h2>
                  <p className="mb-4   text-gray-600 md:leading-9 text-lg">
                    {element.description}
                  </p>
                </div>
                <div className="flex self-end gap-4 ">
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
              </aside>
            </div>
          ))}
        </div>
      </section>
      <section className="flex flex-col items-center justify-center md:hidden">
        {TEAM.map((element, index) => (
          <div
            key={index}
            className="card card-compact w-96 bg-base-100 shadow-xl my-14"
          >
            <figure>
              <img src={element.img} alt={`Picture of ${element.name}`} />
            </figure>
            <div className="card-body">
              <h2 className="card-title">{element.name}</h2>
              <p>{element.description}</p>
              <div className="card-actions justify-end">
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
    </>
  );
}
