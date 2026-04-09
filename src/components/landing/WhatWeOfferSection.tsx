import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Layers, Cpu, MessageSquare, Rocket } from "lucide-react";

const steps = [
  { icon: Layers, titleKey: "onboarding.step1Title", descKey: "onboarding.step1Desc", num: "01" },
  { icon: Cpu, titleKey: "onboarding.step2Title", descKey: "onboarding.step2Desc", num: "02" },
  { icon: MessageSquare, titleKey: "onboarding.step3Title", descKey: "onboarding.step3Desc", num: "03" },
  { icon: Rocket, titleKey: "onboarding.step4Title", descKey: "onboarding.step4Desc", num: "04" },
];

const WhatWeOfferSection = () => {
  const { t } = useTranslation();

  return (
    <section id="why" aria-labelledby="offer-heading" className="py-20 md:py-32 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-primary/[0.02] via-transparent to-transparent" />
      <div className="relative container mx-auto px-4 md:px-8">
        <motion.div
          className="text-center mb-12 md:mb-16 space-y-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-architect text-foreground">
            {t("offer.title")}
          </h2>
          <p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
            {t("offer.subtitle")}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
          {steps.map((step, i) => (
            <motion.div
              key={step.num}
              className="group relative p-6 rounded-2xl bg-card/30 border border-primary/10 backdrop-blur-sm space-y-4 hover:border-primary/25 transition-all duration-300"
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12 }}
            >
              {/* Step number */}
              <span className="absolute top-4 end-4 text-xs font-mono text-primary/30">
                {step.num}
              </span>

              <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/15 flex items-center justify-center group-hover:bg-primary/15 transition-colors">
                <step.icon className="w-6 h-6 text-primary" />
              </div>

              <h3 className="text-base font-semibold text-foreground">
                {t(step.titleKey)}
              </h3>

              <p className="text-sm text-muted-foreground leading-relaxed">
                {t(step.descKey)}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhatWeOfferSection;
