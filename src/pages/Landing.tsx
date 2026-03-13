import LandingNav from "@/components/landing/LandingNav";
import HeroSection from "@/components/landing/HeroSection";
import IndustrySection from "@/components/landing/IndustrySection";
import ComparisonSection from "@/components/landing/ComparisonSection";
import HowItWorks from "@/components/landing/HowItWorks";
import EducationVertical from "@/components/landing/EducationVertical";
import FinalCTA from "@/components/landing/FinalCTA";

const Landing = () => (
  <div className="min-h-screen bg-background">
    <LandingNav />
    <HeroSection />
    <IndustrySection />
    <ComparisonSection />
    <HowItWorks />
    <EducationVertical />
    <FinalCTA />
  </div>
);

export default Landing;
