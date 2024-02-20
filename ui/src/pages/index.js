import Footer from "../components/home/Footer";
import Header from "../components/Header";
import HeroSection from "../components/home/HeroSection";
import Information from "../components/home/Information";

export default function Home() {
  return (
    <main className="bg-white">
      <HeroSection />
      <Information />
      <Footer />
    </main>
  );
}
