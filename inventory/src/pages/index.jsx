import Navbar from "@/components/navbar/NavBar";
import HeroSection from "@/components/home/HeroSection";
import WhyChooseUs from "@/components/home/WhyChooseUs";
import Features from "@/components/home/Features";
import CallToAction from "@/components/home/CallToAction";
import ContactUs from "@/components/home/ContactUs";

export default function Home() {
  return (
    <div>
      <Navbar />
      <HeroSection />
      <WhyChooseUs />
      <Features />
      <CallToAction />
      <ContactUs />
    </div>
  );
}
