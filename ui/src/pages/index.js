import Footer from "../components/home/Footer";
import HeroSection from "../components/home/HeroSection";
import Information from "../components/home/Information";
import Head from "next/head";
import Testimonial from "@components/components/home/Testimonial";

export default function Home() {
  return (
    <main className="bg-white">
      <Head>
        <title>Indic Subtitler - Home</title>
        <meta name="title" content="Indic Subtitler - Home" />
        <meta
          name="description"
          content="Open Source subtitle generator for Indic-Languages | Use powerful ML models to transcribe and transalte audio and video in multipe languages "
        />

        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://indicsubtitler.in/" />
        <meta property="og:title" content="Indic Subtitler - Home" />
        <meta
          property="og:description"
          content="Open Source subtitle generator for Indic-Languages | Use powerful ML models to transcribe and transalte audio and video in multipe languages "
        />
        <meta
          property="og:image"
          content="https://i.postimg.cc/X7r6J7WM/indicsubtitler.png"
        />

        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://indicsubtitler.in/" />
        <meta property="twitter:title" content="Indic Subtitler - Home" />
        <meta
          property="twitter:description"
          content="Open Source subtitle generator for Indic-Languages | Use powerful ML models to transcribe and transalte audio and video in multipe languages "
        />
        <meta
          property="twitter:image"
          content="https://i.postimg.cc/X7r6J7WM/indicsubtitler.png"
        />
      </Head>
      <HeroSection />
      <Information />
      <Testimonial />
      <Footer />
    </main>
  );
}
