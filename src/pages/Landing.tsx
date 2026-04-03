import LandingNav from "@/components/landing/LandingNav";
import HeroSection from "@/components/landing/HeroSection";
import WhatWeOfferSection from "@/components/landing/WhatWeOfferSection";
import IndustrySection from "@/components/landing/IndustrySection";
import StatsSection from "@/components/landing/StatsSection";
import ComparisonSection from "@/components/landing/ComparisonSection";
import PricingSection from "@/components/landing/PricingSection";
import HowItWorks from "@/components/landing/HowItWorks";
import TestimonialsSection from "@/components/landing/TestimonialsSection";
import FAQSection from "@/components/landing/FAQSection";
import FinalCTA from "@/components/landing/FinalCTA";
import OnboardingWizard from "@/components/onboarding/OnboardingWizard";

const Landing = () => (
  <div className="min-h-screen bg-background overflow-x-hidden">
    <LandingNav />
    <HeroSection />
    <WhatWeOfferSection />
    <IndustrySection />
    <StatsSection />
    <ComparisonSection />
    <PricingSection />
    <HowItWorks />
    <TestimonialsSection />
    <FAQSection />
    <FinalCTA />
    <OnboardingWizard />
  </div>
);

export default Landing;
