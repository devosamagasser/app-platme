import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { HardDrive, Users, Puzzle, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const PricingSection = () => {
  const { t } = useTranslation();

  const factors = [
    {
      icon: Puzzle,
      titleKey: "pricing.features",
      descKey: "pricing.featuresDesc",
    },
    {
      icon: HardDrive,
      titleKey: "pricing.storage",
      descKey: "pricing.storageDesc",
    },
    {
      icon: Users,
      titleKey: "pricing.capacity",
      descKey: "pricing.capacityDesc",
    },
  ];

  return (
    <section id="pricing" className="py-20 md:py-32 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/[0.03] to-transparent" />
      <div className="relative container mx-auto px-4 md:px-8">
        <motion.div
          className="text-center mb-12 md:mb-16 space-y-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-architect text-foreground">
            {t("pricing.title")}
          </h2>
          <p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
            {t("pricing.subtitle")}
          </p>
        </motion.div>

        {/* Usage-based model explanation */}
        <motion.div
          className="max-w-3xl mx-auto mb-12 p-6 md:p-8 rounded-2xl bg-card/40 border border-primary/15 backdrop-blur-sm text-center space-y-3"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-mono uppercase tracking-wider">
            {t("pricing.badge")}
          </div>
          <p className="text-muted-foreground text-sm md:text-base leading-relaxed">
            {t("pricing.model")}
          </p>
        </motion.div>

        {/* 3 factors */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-12">
          {factors.map((f, i) => (
            <motion.div
              key={f.titleKey}
              className="p-6 rounded-2xl bg-card/30 border border-primary/10 backdrop-blur-sm space-y-4 text-center hover:border-primary/25 transition-colors"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto">
                <f.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">{t(f.titleKey)}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{t(f.descKey)}</p>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <Link
            to="/select"
            className="group inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-primary text-primary-foreground font-bold text-sm transition-all hover:shadow-[0_0_40px_hsl(var(--primary)/0.35)] hover:scale-[1.02] active:scale-[0.98]"
          >
            {t("pricing.cta")}
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default PricingSection;
