import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { X, ChevronRight, ChevronLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface TourStep {
  target: string; // CSS selector or section id
  title: string;
  description: string;
  position: "top" | "bottom" | "left" | "right";
}

interface OnboardingTourProps {
  onComplete: () => void;
}

const TOUR_STORAGE_KEY = "platme_tour_completed";

export function useOnboardingTour() {
  const [showTour, setShowTour] = useState(false);

  useEffect(() => {
    const completed = localStorage.getItem(TOUR_STORAGE_KEY);
    if (!completed) {
      // Delay to allow page to render
      const timer = setTimeout(() => setShowTour(true), 800);
      return () => clearTimeout(timer);
    }
  }, []);

  const completeTour = useCallback(() => {
    localStorage.setItem(TOUR_STORAGE_KEY, "true");
    setShowTour(false);
  }, []);

  return { showTour, completeTour };
}

const OnboardingTour = ({ onComplete }: OnboardingTourProps) => {
  const { t } = useTranslation();
  const [step, setStep] = useState(0);

  const steps: TourStep[] = [
    {
      target: "overview",
      title: t("tour.step1Title"),
      description: t("tour.step1Desc"),
      position: "bottom",
    },
    {
      target: "platforms",
      title: t("tour.step2Title"),
      description: t("tour.step2Desc"),
      position: "bottom",
    },
    {
      target: "tokens",
      title: t("tour.step3Title"),
      description: t("tour.step3Desc"),
      position: "bottom",
    },
    {
      target: "developer",
      title: t("tour.step4Title"),
      description: t("tour.step4Desc"),
      position: "bottom",
    },
  ];

  const currentStep = steps[step];
  const isLast = step === steps.length - 1;

  const next = () => {
    if (isLast) {
      onComplete();
    } else {
      setStep((s) => s + 1);
    }
  };

  const prev = () => {
    if (step > 0) setStep((s) => s - 1);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100]">
        {/* Overlay */}
        <div className="absolute inset-0 bg-background/60 backdrop-blur-sm" onClick={onComplete} />

        {/* Tooltip */}
        <motion.div
          key={step}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] max-w-[90vw]"
        >
          <div className="bg-card border border-primary/20 rounded-2xl p-5 shadow-2xl shadow-primary/5">
            {/* Close */}
            <button
              onClick={onComplete}
              className="absolute top-3 end-3 p-1 rounded-md hover:bg-primary/10 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Step indicator */}
            <div className="flex items-center gap-1.5 mb-4">
              {steps.map((_, i) => (
                <div
                  key={i}
                  className={`h-1 rounded-full transition-all ${
                    i === step ? "w-6 bg-primary" : i < step ? "w-3 bg-primary/40" : "w-3 bg-primary/15"
                  }`}
                />
              ))}
            </div>

            <h3 className="text-base font-semibold text-foreground mb-1.5">
              {currentStep.title}
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed mb-5">
              {currentStep.description}
            </p>

            <div className="flex items-center justify-between">
              <button
                onClick={prev}
                disabled={step === 0}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs text-muted-foreground hover:text-foreground disabled:opacity-0 transition-all"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                {t("tour.prev")}
              </button>

              <button
                onClick={next}
                className="flex items-center gap-1 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-semibold hover:opacity-90 transition-opacity"
              >
                {isLast ? t("tour.finish") : t("tour.next")}
                {!isLast && <ChevronRight className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default OnboardingTour;
