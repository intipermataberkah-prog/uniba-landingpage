import AnnouncementBar from "@/components/AnnouncementBar";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import TuitionCalculator from "@/components/TuitionCalculator";
import BentoGrid from "@/components/BentoGrid";
import FacultyExplorer from "@/components/FacultyExplorer";
import ScholarshipsSection from "@/components/ScholarshipsSection";
import TestimonialCarousel from "@/components/TestimonialCarousel";
import EnrollmentSteps from "@/components/EnrollmentSteps";
import FAQSection from "@/components/FAQSection";
import Footer from "@/components/Footer";
import StickyCTA from "@/components/StickyCTA";
import SocialFloatingDock from "@/components/SocialFloatingDock";
import { StructuredData } from "@/components/StructuredData";

export default function Home() {
  return (
    <>
      <StructuredData />
      <AnnouncementBar />
      <Navbar />
      <main className="flex-1">
        <Hero />
        <TuitionCalculator />
        <BentoGrid />
        <FacultyExplorer />
        <ScholarshipsSection />
        <TestimonialCarousel />
        <EnrollmentSteps />
        <FAQSection />
      </main>
      <Footer />
      <StickyCTA />
      <SocialFloatingDock />
    </>
  );
}
