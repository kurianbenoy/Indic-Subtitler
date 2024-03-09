import Header from "@components/components/Header";
import "@components/styles/globals.css";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import Head from "next/head";
import { Analytics } from "@vercel/analytics/react";

export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>
          Indic Subtitler - Open Source Subtitling tool for Indic Languages!
        </title>
      </Head>
      <Header />
      <Component {...pageProps} />
      <Analytics />
      <ToastContainer />
    </>
  );
}
