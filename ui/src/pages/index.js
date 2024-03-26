import Footer from "../components/home/Footer";
import HeroSection from "../components/home/HeroSection";
import Information from "../components/home/Information";
import Testimonial from "@components/components/home/Testimonial";

export default function Home() {
  return (
    <main className="bg-white">
      <HeroSection />
      <Testimonial />
      <Information />
      <Footer />
    </main>
  );
}
