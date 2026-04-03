import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { X, ArrowRight, ArrowLeft, Layers, Cpu, MessageSquare, Rocket } from "lucide-react";

const STORAGE_KEY = "platme_onboarding_done";

const steps = [
  { icon: Layers, titleKey: "onboarding.step1Title", descKey: "onboarding.step1Desc" },
  { icon: Cpu, titleKey: "onboarding.step2Title", descKey: "onboarding.step2Desc" },
  { icon: MessageSquare, titleKey: "onboarding.step3Title", descKey: "onboarding.step3Desc" },
  { icon: Rocket, titleKey: "onboarding.step4Title", descKey: "onboarding.step4Desc" },
];

const OnboardingWizard = () => {
  const { t, i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);
  const isRTL = i18n.language === "ar";

  useEffect(() => {
    if (!localStorage.getItem(STORAGE_KEY)) {
      const timer = setTimeout(() => setOpen(true), 800);
      return () => clearTimeout(timer);
    }
  }, []);

  const close = () => {
    setOpen(false);
    localStorage.setItem(STORAGE_KEY, "1");
  };

  const next = () => {
    if (step < steps.length - 1) setStep(step + 1);
    else close();
  };

  const prev = () => {
    if (step > 0) setStep(step - 1);
  };

  if (!open) return null;

  const currentStep = steps[step];
  const Icon = currentStep.icon;
  const isLast = step === steps.length - 1;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[100] flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Backdrop */}
        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={close} />

        {/* Card */}
        <motion.div
          className="relative w-full max-w-md rounded-2xl border border-primary/15 bg-card p-8 shadow-2xl"
          initial={{ scale: 0.9, opacity: 0, y: 30 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 30 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
        >
          {/* Skip */}
          <button
            onClick={close}
            className="absolute top-4 end-4 p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-primary/10 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Step content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: isRTL ? -20 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: isRTL ? 20 : -20 }}
              transition={{ duration: 0.25 }}
              className="flex flex-col items-center text-center"
            >
              <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-6">
                <Icon className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">
                {t(currentStep.titleKey)}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
                {t(currentStep.descKey)}
              </p>
            </motion.div>
          </AnimatePresence>

          {/* Progress dots */}
          <div className="flex justify-center gap-2 mt-8 mb-6">
            {steps.map((_, i) => (
              <button
                key={i}
                onClick={() => setStep(i)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  i === step ? "w-6 bg-primary" : "w-2 bg-muted-foreground/30"
                }`}
              />
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between gap-3">
            <button
              onClick={prev}
              disabled={step === 0}
              className="flex items-center gap-1 px-4 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground disabled:opacity-0 disabled:pointer-events-none transition-all"
            >
              {isRTL ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
              {t("onboarding.prev")}
            </button>

            <button
              onClick={next}
              className="flex items-center gap-1.5 px-6 py-2.5 rounded-lg bg-primary text-primary-foreground font-semibold text-sm hover:shadow-[0_0_20px_hsl(var(--primary)/0.4)] transition-all"
            >
              {isLast ? t("onboarding.start") : t("onboarding.next")}
              {!isLast && (isRTL ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />)}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default OnboardingWizard;
