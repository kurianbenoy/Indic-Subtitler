import PrimaryBtn from "@components/components/PrimaryBtn";
import { ValidationError, useForm } from "@formspree/react";
import Head from "next/head";
import Image from "next/image";
import React from "react";

function FeebackForm() {
  const [state, handleSubmit] = useForm("xvoeqldl");
  if (state.succeeded) {
    return (
      <div className="h-[400px] flex items-center ">
        <h1 className="md:text-2xl text-xl text-center w-full font-medium mt-[-50px]">
          Form Submitted Successfully!
        </h1>
      </div>
    );
  }
  return (
    <div>
      <h1 className="text-xl">Submit a form </h1>
      <form onSubmit={handleSubmit} className="flex flex-col space-y-5 my-4">
        <div className="flex w-full  justify-between md:flex-row flex-col">
          <span>
            <label className="" htmlFor="name">
              Full Name
            </label>
            <p className=" text-gray-500 font-medium text-xs">Optional</p>
          </span>
          <input
            // required
            type="text"
            id="name"
            name="name"
            placeholder="Enter your full name"
            className="border-2 rounded-md md:w-[60%] px-2 py-1"
          />
        </div>
        <div className="flex md:flex-row flex-col w-full  justify-between">
          <span>
            <label htmlFor="email">Email Address</label>{" "}
            <p className=" text-gray-500 font-medium text-xs ">Optional</p>
          </span>
          <input
            // required
            id="email"
            type="email"
            name="email"
            placeholder="Enter your Email Id"
            className="border-2 rounded-md md:w-[60%] px-2 py-1"
          />
        </div>
        <ValidationError prefix="Email" field="email" errors={state.errors} />
        <div className="flex w-full  justify-between md:flex-row flex-col">
          <span>
            <label htmlFor="message">Message</label>{" "}
            <p className=" text-[#f04b4b] font-semibold text-xs ">Required</p>
          </span>

          <textarea
            id="message"
            name="message"
            required
            className="border-2 rounded-md md:w-[60%] h-36 px-2 py-1 resize-none"
            placeholder="Enter your valuable message"
          />
        </div>
        <ValidationError
          prefix="Message"
          field="message"
          errors={state.errors}
        />
        <button
          type="submit"
          className="w-max bg-primary-900  text-white px-6 py-1 font-medium rounded-md md:text-lg self-end "
          disabled={state.submitting}
        >
          Submit
        </button>
      </form>
    </div>
  );
}

export default function contact() {
  return (
    <section
      className=" lg:w-[50%] md:w-[70%] md:mx-auto mx-4 flex flex-col justify-center  px-4
      shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px] mt-14
    "
    >
      <Head>
        <title>Contact Us</title>
      </Head>
      <p className="text-center mt-6">
        Faced a bug? Raise an issue now on{" "}
        <a
          href="https://github.com/kurianbenoy/Indic-Subtitler/issues"
          className="font-medium underline underline-offset-4"
          target="_blank"
        >
          GitHub
        </a>
      </p>
      <div className="divider">OR</div>
      <FeebackForm />
    </section>
  );
}
