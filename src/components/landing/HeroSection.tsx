import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const NetworkVisual = () => (
  <div className="relative w-full h-full min-h-[400px]">
    <svg viewBox="0 0 400 400" className="w-full h-full opacity-80">
      {[
        { x: 200, y: 80, r: 6, delay: 0 },
        { x: 120, y: 160, r: 4, delay: 0.3 },
        { x: 280, y: 140, r: 5, delay: 0.6 },
        { x: 80, y: 260, r: 3, delay: 0.9 },
        { x: 200, y: 220, r: 7, delay: 0.2 },
        { x: 320, y: 240, r: 4, delay: 0.5 },
        { x: 150, y: 320, r: 5, delay: 0.8 },
        { x: 260, y: 330, r: 3, delay: 1.1 },
        { x: 340, y: 340, r: 4, delay: 0.4 },
        { x: 60, y: 160, r: 3, delay: 0.7 },
      ].map((node, i) => (
        <g key={i}>
          <motion.circle
            cx={node.x} cy={node.y} r={node.r}
            fill="#9FFFD0"
            initial={{ opacity: 0.2 }}
            animate={{ opacity: [0.2, 0.8, 0.2] }}
            transition={{ duration: 2, repeat: Infinity, delay: node.delay }}
          />
          <circle cx={node.x} cy={node.y} r={node.r * 3} fill="#9FFFD0" opacity="0.05" />
        </g>
      ))}
      {[
        "M200,80 L120,160", "M200,80 L280,140", "M120,160 L200,220",
        "M280,140 L200,220", "M280,140 L320,240", "M200,220 L150,320",
        "M200,220 L260,330", "M80,260 L150,320", "M320,240 L340,340",
        "M120,160 L80,260", "M260,330 L340,340",
      ].map((d, i) => (
        <motion.path
          key={i} d={d} stroke="#9FFFD0" strokeWidth="1" fill="none" opacity="0.15"
          strokeDasharray="4" strokeDashoffset="100"
          animate={{ strokeDashoffset: 0 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear", delay: i * 0.5 }}
        />
      ))}
    </svg>
  </div>
);

const HeroSection = () => {
  const { t } = useTranslation();

  return (
    <section className="relative min-h-screen flex items-center pt-16 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-forest to-background" />
      <div className="absolute inset-0 bg-grid opacity-50" />

      <div className="relative z-10 container mx-auto px-8 grid lg:grid-cols-2 gap-16 items-center">
        <div className="space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.2, 0.8, 0.2, 1] }}
          >
            <p className="text-xs font-mono uppercase tracking-widest text-primary/60 mb-6">
              {t("hero.badge")}
            </p>
            <h1 className="text-5xl md:text-7xl font-semibold tracking-architect text-foreground leading-[1.05]" style={{ textWrap: "balance" }}>
              {t("hero.title1")}<br />
              <span className="text-gradient-mint">{t("hero.title2")}</span>
            </h1>
          </motion.div>

          <motion.p
            className="text-lg text-muted-foreground max-w-lg leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.2, 0.8, 0.2, 1] }}
          >
            {t("hero.subtitle1")}<br />
            {t("hero.subtitle2")}
          </motion.p>

          <motion.div
            className="flex gap-4 pt-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: [0.2, 0.8, 0.2, 1] }}
          >
            <Link
              to="/select"
              className="px-8 py-4 rounded-lg bg-primary text-primary-foreground font-bold text-sm hover:shadow-[0_0_20px_rgba(159,255,208,0.4)] transition-all"
            >
              {t("hero.cta")}
            </Link>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.3, ease: [0.2, 0.8, 0.2, 1] }}
        >
          <NetworkVisual />
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
