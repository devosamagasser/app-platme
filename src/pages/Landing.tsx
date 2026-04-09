import { lazy, Suspense } from "react";
import LandingNav from "@/components/landing/LandingNav";
import HeroSection from "@/components/landing/HeroSection";

const WhatWeOfferSection = lazy(() => import("@/components/landing/WhatWeOfferSection"));
const IndustrySection = lazy(() => import("@/components/landing/IndustrySection"));
const StatsSection = lazy(() => import("@/components/landing/StatsSection"));
const ComparisonSection = lazy(() => import("@/components/landing/ComparisonSection"));
const PricingSection = lazy(() => import("@/components/landing/PricingSection"));
const HowItWorks = lazy(() => import("@/components/landing/HowItWorks"));
const TestimonialsSection = lazy(() => import("@/components/landing/TestimonialsSection"));
const FAQSection = lazy(() => import("@/components/landing/FAQSection"));
const FinalCTA = lazy(() => import("@/components/landing/FinalCTA"));
const OnboardingWizard = lazy(() => import("@/components/onboarding/OnboardingWizard"));

const SectionFallback = () => <div className="py-20" aria-hidden="true" />;

const Landing = () => (
  <div className="min-h-screen bg-background overflow-x-hidden">
    <LandingNav />
    <main>
      <HeroSection />
      <Suspense fallback={<SectionFallback />}>
        <WhatWeOfferSection />
      </Suspense>
      <Suspense fallback={<SectionFallback />}>
        <IndustrySection />
      </Suspense>
      <Suspense fallback={<SectionFallback />}>
        <StatsSection />
      </Suspense>
      <Suspense fallback={<SectionFallback />}>
        <ComparisonSection />
      </Suspense>
      <Suspense fallback={<SectionFallback />}>
        <PricingSection />
      </Suspense>
      <Suspense fallback={<SectionFallback />}>
        <HowItWorks />
      </Suspense>
      <Suspense fallback={<SectionFallback />}>
        <TestimonialsSection />
      </Suspense>
      <Suspense fallback={<SectionFallback />}>
        <FAQSection />
      </Suspense>
    </main>
    <Suspense fallback={<SectionFallback />}>
      <FinalCTA />
    </Suspense>
    <Suspense fallback={null}>
      <OnboardingWizard />
    </Suspense>
  </div>
);

export default Landing;
