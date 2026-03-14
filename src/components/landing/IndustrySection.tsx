import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

const IndustrySection = () => {
  const { t } = useTranslation();

  const industries = [
    { name: t("industries.education"), active: true, angle: -90 },
    { name: t("industries.ecommerce"), active: false, angle: -18 },
    { name: t("industries.gym"), active: false, angle: 54 },
    { name: t("industries.clinic"), active: false, angle: 126 },
    { name: t("industries.restaurant"), active: false, angle: 198 },
  ];

  return (
    <section id="industries" className="py-20 md:py-32 relative">
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex flex-col items-center">
          {/* Desktop: radial layout */}
          <div className="hidden md:block relative w-[500px] h-[500px] mb-16">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
              <div className="w-24 h-24 rounded-2xl bg-forest border border-primary/30 flex items-center justify-center mint-glow">
                <div className="text-center">
                  <div className="text-[10px] font-mono uppercase text-primary/60 tracking-widest">PLATME</div>
                  <div className="text-xs font-semibold text-foreground mt-1">{t("industries.core")}</div>
                </div>
              </div>
            </div>

            {industries.map((ind, i) => {
              const rad = (ind.angle * Math.PI) / 180;
              const x = 250 + Math.cos(rad) * 180;
              const y = 250 + Math.sin(rad) * 180;

              return (
                <g key={ind.name}>
                  <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 500 500">
                    <line
                      x1="250" y1="250" x2={x} y2={y}
                      stroke="#9FFFD0"
                      strokeWidth={ind.active ? 2 : 1}
                      opacity={ind.active ? 0.8 : 0.15}
                      strokeDasharray={ind.active ? "none" : "4 4"}
                    />
                  </svg>

                  <motion.div
                    className="absolute"
                    style={{ left: x - 55, top: y - 30 }}
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <div className={`w-[110px] px-3 py-3 rounded-lg border text-center transition-all ${
                      ind.active
                        ? "bg-forest border-primary/40 mint-glow"
                        : "bg-secondary/30 border-primary/10 opacity-40"
                    }`}>
                      <div className={`text-xs font-bold uppercase tracking-wider ${
                        ind.active ? "text-primary" : "text-muted-foreground"
                      }`}>
                        {ind.name}
                      </div>
                      {!ind.active && (
                        <div className="text-[9px] text-muted-foreground mt-1 font-mono">{t("industries.comingSoon")}</div>
                      )}
                    </div>
                  </motion.div>
                </g>
              );
            })}
          </div>

          {/* Mobile: simple grid */}
          <div className="md:hidden w-full mb-12">
            <div className="w-16 h-16 rounded-xl bg-forest border border-primary/30 flex items-center justify-center mint-glow mx-auto mb-8">
              <div className="text-center">
                <div className="text-[9px] font-mono uppercase text-primary/60 tracking-widest">PLATME</div>
                <div className="text-[10px] font-semibold text-foreground mt-0.5">{t("industries.core")}</div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {industries.map((ind, i) => (
                <motion.div
                  key={ind.name}
                  className={`px-3 py-3 rounded-lg border text-center transition-all ${
                    ind.active
                      ? "bg-forest border-primary/40 mint-glow"
                      : "bg-secondary/30 border-primary/10 opacity-40"
                  }`}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                >
                  <div className={`text-xs font-bold uppercase tracking-wider ${
                    ind.active ? "text-primary" : "text-muted-foreground"
                  }`}>
                    {ind.name}
                  </div>
                  {!ind.active && (
                    <div className="text-[9px] text-muted-foreground mt-1 font-mono">{t("industries.comingSoon")}</div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>

          <motion.div
            className="text-center space-y-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-semibold tracking-architect text-foreground">
              {t("industries.title")}
            </h2>
            <p className="text-muted-foreground text-base md:text-lg">
              {t("industries.subtitle")}
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default IndustrySection;
