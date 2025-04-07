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
      <section id="home">
        <HeroSection />
      </section>

      <section id="why-choose-us">
        <WhyChooseUs />
      </section>

      <section id="powerful-features">
        <Features />
      </section>

      <section id="contact-us">
        <ContactUs />
      </section>
    </div>
  );
}
