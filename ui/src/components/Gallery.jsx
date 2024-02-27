import { TEAM, MENTORS } from "@components/constants"; // Assuming you add MENTORS to your constants
import {
  IconBrandGithub,
  IconBrandLinkedin,
  IconBrandTwitter,
} from "@tabler/icons-react";
import Image from "next/image";
import React from "react";

export default function Gallery() {
  return (
    <>
      <section className="space-y-16 md:space-y-32 my-14">
        {TEAM.map((element, index) => (
          <div
            className={`flex flex-col justify-evenly ${
              index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
            }`}
            key={index}
          >
            <Image
              className="lg:w-[20%] md:w-[30%] w-[60%] aspect-w-4 aspect-h-3 rounded-2xl self-center"
              src={element.img}
              width={500}
              height={300}
              alt={`Picture of ${element.name}`}
            />
            <div className="md:w-[40%] mt-2 md:mt-0">
              <h2 className="text-4xl mb-4 font-medium">{element.name}</h2>
              <p className="mb-4 text-gray-600 md:leading-9 md:text-lg">
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
      {/* Mentor Section */}
      <section className="space-y-16 md:space-y-32 my-14">
        <h1 className="text-5xl font-bold text-center mb-12">Our Mentors</h1>
        {MENTORS.map((mentor, index) => (
          <div
            className={`flex flex-col justify-evenly ${
              index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
            }`}
            key={index}
          >
            <div className="md:w-[40%] mt-2 md:mt-0">
              <h2 className="text-4xl mb-4 font-medium">{mentor.name}</h2>
              <p className="mb-4 text-gray-600 md:leading-9 md:text-lg">
                {/* {mentor.description} */}
              </p>
              {/* Assuming mentors also have social links, adjust if not */}
              <div className="flex self-end gap-4">
                <a
                  target="_blank"
                  href={mentor.github}
                  className="hover:text-primary-900 transition-all duration-300"
                >
                  <IconBrandGithub />
                </a>
                <a
                  target="_blank"
                  href={mentor.linkedin}
                  className="hover:text-primary-900 transition-all duration-300"
                >
                  <IconBrandLinkedin />
                </a>
                <a
                  target="_blank"
                  href={mentor.twitter}
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