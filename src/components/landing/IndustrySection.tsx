import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { GraduationCap, ShoppingCart, Dumbbell, Stethoscope, UtensilsCrossed, Zap } from "lucide-react";

const INDUSTRIES = [
  { key: "education", icon: GraduationCap, active: true },
  { key: "ecommerce", icon: ShoppingCart, active: false },
  { key: "gym", icon: Dumbbell, active: false },
  { key: "clinic", icon: Stethoscope, active: false },
  { key: "restaurant", icon: UtensilsCrossed, active: false },
];

const IndustrySection = () => {
  const { t } = useTranslation();

  return (
    <section id="industries" className="py-20 md:py-32 relative overflow-hidden">
      {/* Subtle background grid */}
      <div className="absolute inset-0 bg-grid opacity-30" />

      <div className="container mx-auto px-4 md:px-8 relative z-10">
        {/* Header */}
        <motion.div
          className="text-center space-y-4 mb-16 md:mb-20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/20 bg-primary/5 mb-4">
            <Zap className="w-3.5 h-3.5 text-primary" />
            <span className="text-xs font-mono uppercase tracking-widest text-primary/70">
              {t("industries.subtitle")}
            </span>
          </div>
          <h2 className="text-3xl md:text-5xl font-semibold tracking-architect text-foreground">
            {t("industries.title")}
          </h2>
        </motion.div>

        {/* Industry cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 max-w-5xl mx-auto">
          {INDUSTRIES.map((ind, i) => {
            const Icon = ind.icon;
            return (
              <motion.div
                key={ind.key}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.5 }}
                className={`group relative rounded-xl border p-6 transition-all duration-300 ${
                  ind.active
                    ? "bg-secondary/80 border-primary/30 hover:border-primary/50 hover:shadow-[0_0_40px_hsl(var(--primary)/0.1)]"
                    : "bg-secondary/30 border-primary/8 opacity-60 hover:opacity-80"
                }`}
              >
                {/* Active indicator */}
                {ind.active && (
                  <div className="absolute top-4 right-4 rtl:right-auto rtl:left-4">
                    <span className="flex items-center gap-1.5">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
                      </span>
                      <span className="text-[10px] font-mono uppercase text-primary/70 tracking-wider">Live</span>
                    </span>
                  </div>
                )}

                {/* Coming soon badge */}
                {!ind.active && (
                  <div className="absolute top-4 right-4 rtl:right-auto rtl:left-4">
                    <span className="text-[10px] font-mono uppercase text-muted-foreground/60 tracking-wider">
                      {t("industries.comingSoon")}
                    </span>
                  </div>
                )}

                {/* Icon */}
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 transition-colors ${
                  ind.active
                    ? "bg-primary/10 group-hover:bg-primary/15"
                    : "bg-muted/50"
                }`}>
                  <Icon className={`w-5 h-5 ${ind.active ? "text-primary" : "text-muted-foreground/60"}`} />
                </div>

                {/* Text */}
                <h3 className={`text-base font-semibold mb-2 ${
                  ind.active ? "text-foreground" : "text-muted-foreground"
                }`}>
                  {t(`industries.${ind.key}`)}
                </h3>
                <p className={`text-sm leading-relaxed ${
                  ind.active ? "text-muted-foreground" : "text-muted-foreground/50"
                }`}>
                  {t(`industries.${ind.key}Desc`)}
                </p>

                {/* Bottom accent line for active */}
                {ind.active && (
                  <motion.div
                    className="absolute bottom-0 left-4 right-4 h-[2px] rounded-full bg-gradient-to-r from-transparent via-primary/40 to-transparent"
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                  />
                )}
              </motion.div>
            );
          })}

          {/* PLATME Core card — spans full width on last row */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="relative rounded-xl border border-primary/20 bg-gradient-to-br from-primary/8 to-secondary/60 p-6 sm:col-span-2 lg:col-span-3 flex flex-col sm:flex-row items-center gap-6"
          >
            {/* Core icon */}
            <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0 mint-glow">
              <Zap className="w-7 h-7 text-primary" />
            </div>
            <div className="text-center sm:text-start">
              <div className="text-[10px] font-mono uppercase text-primary/50 tracking-widest mb-1">PLATME</div>
              <h3 className="text-lg font-semibold text-foreground mb-1">{t("industries.core")}</h3>
              <p className="text-sm text-muted-foreground">{t("industries.subtitle")}</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default IndustrySection;
