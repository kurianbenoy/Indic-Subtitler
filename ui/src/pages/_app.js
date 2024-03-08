import Header from "@components/components/Header";
import "@components/styles/globals.css";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import Head from "next/head";

export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>Indic Subtitle - Generate Subtitle</title>
      </Head>
      <Header />
      <Component {...pageProps} />
      <ToastContainer />
    </>
  );
}
