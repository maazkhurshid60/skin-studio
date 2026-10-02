import Header from "@/components/Header";
import Hero from "@/components/Hero";
import AboutSection from "@/components/AboutSection";
import ServicesSection from "@/components/ServicesSection";
import BeforeAfterSection from "@/components/BeforeAfterSection";
import ImageBreak from "@/components/ImageBreak";
import WhyChooseUs from "@/components/WhyChooseUs";
import TeamSection from "@/components/TeamSection";
import ExperienceSection from "@/components/ExperienceSection";
import Testimonials from "@/components/Testimonials";
import BookingCTA from "@/components/BookingCTA";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <AboutSection />
        <ServicesSection />
        <BeforeAfterSection />
        <ImageBreak />
        <WhyChooseUs />
        <TeamSection />
        <ExperienceSection />
        <Testimonials />
        <BookingCTA />
        <ContactSection />
      </main>
      <Footer />
    </>
  );
}
