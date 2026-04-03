import LandingNav from "@/components/landing/LandingNav";
import HeroSection from "@/components/landing/HeroSection";
import IndustrySection from "@/components/landing/IndustrySection";
import ComparisonSection from "@/components/landing/ComparisonSection";
import HowItWorks from "@/components/landing/HowItWorks";
import FinalCTA from "@/components/landing/FinalCTA";
import OnboardingWizard from "@/components/onboarding/OnboardingWizard";

const Landing = () => (
  <div className="min-h-screen bg-background overflow-x-hidden">
    <LandingNav />
    <HeroSection />
    <IndustrySection />
    <ComparisonSection />
    <HowItWorks />
    <FinalCTA />
    <OnboardingWizard />
  </div>
);

export default Landing;
