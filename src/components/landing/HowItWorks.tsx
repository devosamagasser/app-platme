import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

const HowItWorks = () => {
  const { t } = useTranslation();

  const steps = [
    { num: "01", title: t("howItWorks.step1Title"), desc: t("howItWorks.step1Desc") },
    { num: "02", title: t("howItWorks.step2Title"), desc: t("howItWorks.step2Desc") },
    { num: "03", title: t("howItWorks.step3Title"), desc: t("howItWorks.step3Desc") },
    { num: "04", title: t("howItWorks.step4Title"), desc: t("howItWorks.step4Desc") },
  ];

  return (
    <section id="how-it-works" className="py-32 relative">
      <div className="container mx-auto px-8">
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl font-semibold tracking-architect text-foreground mb-4">
            {t("howItWorks.title")}
          </h2>
          <p className="text-muted-foreground text-lg">
            {t("howItWorks.subtitle")}
          </p>
        </motion.div>

        <div className="grid md:grid-cols-4 gap-6 max-w-6xl mx-auto relative">
          <div className="hidden md:block absolute top-12 left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-primary/5 via-primary/30 to-primary/5" />

          {steps.map((step, i) => (
            <motion.div
              key={step.num}
              className="relative text-center"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12 }}
            >
              <div className="w-10 h-10 rounded-full bg-forest border border-primary/30 flex items-center justify-center mx-auto mb-6 relative z-10">
                <span className="font-mono text-xs text-primary font-semibold">{step.num}</span>
              </div>
              <h3 className="text-foreground font-semibold mb-2">{step.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
