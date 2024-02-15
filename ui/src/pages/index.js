import Footer from "../components/home/Footer";
import Header from "../components/home/Header";
import HeroSection from "../components/home/HeroSection";
import Information from "../components/home/Information";

export default function Home() {
  return (
    <main className="bg-white">
      <Header />
      <HeroSection />
      <Information />
      <Footer />
    </main>
  );
}
