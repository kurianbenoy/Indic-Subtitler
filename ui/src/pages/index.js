import Footer from "../components/home/Footer";
import Header from "../components/Header";
import HeroSection from "../components/home/HeroSection";
import Information from "../components/home/Information";
import Head from "next/head";

export default function Home() {
  return (
    <main className="bg-white">
      <Head>
        <title>Indic Subtitler - Home</title>
      </Head>
      <HeroSection />
      <Information />
      <Footer />
    </main>
  );
}
