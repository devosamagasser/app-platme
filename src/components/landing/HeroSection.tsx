import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
import { Brain, Search, Wrench, Rocket } from "lucide-react";

const ORCHESTRATOR_STEPS = [
  { icon: Search, labelKey: "hero.orchestrator.analyze", delay: 0.6 },
  { icon: Wrench, labelKey: "hero.orchestrator.build", delay: 1.2 },
  { icon: Rocket, labelKey: "hero.orchestrator.deploy", delay: 1.8 },
];

const OrchestratorVisual = () => {
  const { t } = useTranslation();

  return (
    <div className="relative w-full h-full min-h-[300px] md:min-h-[420px] flex items-center justify-center">
      {/* Center Gomaa AI hub */}
      <div className="relative">
        {/* Pulse rings */}
        {[1, 2, 3].map((ring) => (
          <motion.div
            key={ring}
            className="absolute inset-0 rounded-full border border-primary/20"
            style={{
              width: 80 + ring * 60,
              height: 80 + ring * 60,
              top: `calc(50% - ${(80 + ring * 60) / 2}px)`,
              left: `calc(50% - ${(80 + ring * 60) / 2}px)`,
            }}
            animate={{
              scale: [1, 1.05, 1],
              opacity: [0.15, 0.3, 0.15],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              delay: ring * 0.5,
              ease: "easeInOut",
            }}
          />
        ))}

        {/* Center brain */}
        <motion.div
          className="relative z-10 w-20 h-20 rounded-full bg-forest border-2 border-primary/40 flex items-center justify-center mint-glow"
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <Brain className="w-8 h-8 text-primary" />
        </motion.div>
        <motion.p
          className="absolute -bottom-7 left-1/2 -translate-x-1/2 text-[10px] font-mono uppercase tracking-widest text-primary/70 whitespace-nowrap"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          Gomaa AI
        </motion.p>

        {/* Steps around */}
        {ORCHESTRATOR_STEPS.map((step, i) => {
          const angle = -90 + i * 120; // distribute at 120° intervals starting from top
          const rad = (angle * Math.PI) / 180;
          const radius = 140;
          const x = Math.cos(rad) * radius;
          const y = Math.sin(rad) * radius;
          const Icon = step.icon;

          return (
            <motion.div
              key={i}
              className="absolute z-10"
              style={{
                left: `calc(50% + ${x}px - 28px)`,
                top: `calc(50% + ${y}px - 28px)`,
              }}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: step.delay, duration: 0.5, ease: "backOut" }}
            >
              {/* Connection line (SVG overlay) */}
              <svg
                className="absolute pointer-events-none"
                style={{
                  width: Math.abs(x) + 60,
                  height: Math.abs(y) + 60,
                  left: x > 0 ? -x : 0,
                  top: y > 0 ? -y : 0,
                }}
                viewBox={`0 0 ${Math.abs(x) + 60} ${Math.abs(y) + 60}`}
              >
                <motion.line
                  x1={x > 0 ? 0 : Math.abs(x)}
                  y1={y > 0 ? 0 : Math.abs(y)}
                  x2={x > 0 ? x : 0}
                  y2={y > 0 ? y : 0}
                  stroke="hsl(var(--primary))"
                  strokeWidth={1.5}
                  strokeDasharray="6 4"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 0.4 }}
                  transition={{ delay: step.delay - 0.3, duration: 0.6 }}
                />
              </svg>

              {/* Step node */}
              <motion.div
                className="w-14 h-14 rounded-xl bg-forest border border-primary/30 flex items-center justify-center"
                animate={{ y: [0, -4, 0] }}
                transition={{ duration: 3, repeat: Infinity, delay: i * 0.4, ease: "easeInOut" }}
              >
                <Icon className="w-6 h-6 text-primary" />
              </motion.div>
              <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground text-center mt-2 whitespace-nowrap">
                {t(step.labelKey)}
              </p>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

/* Typing effect for the badge */
const TypingBadge = ({ text }: { text: string }) => {
  const [displayed, setDisplayed] = useState("");
  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) clearInterval(interval);
    }, 50);
    return () => clearInterval(interval);
  }, [text]);

  return (
    <p className="text-xs font-mono uppercase tracking-widest text-primary/60 mb-4 md:mb-6">
      {displayed}
      <motion.span
        animate={{ opacity: [1, 0] }}
        transition={{ duration: 0.6, repeat: Infinity }}
        className="inline-block w-[2px] h-3 bg-primary/60 ml-0.5 align-middle"
      />
    </p>
  );
};

const HeroSection = () => {
  const { t } = useTranslation();

  return (
    <section className="relative min-h-screen flex items-center pt-16 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-forest to-background" />
      <div className="absolute inset-0 bg-grid opacity-50" />

      <div className="relative z-10 container mx-auto px-4 md:px-8 grid lg:grid-cols-2 gap-8 md:gap-16 items-center">
        <div className="space-y-6 md:space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.2, 0.8, 0.2, 1] }}
          >
            <TypingBadge text={t("hero.badge")} />
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-semibold tracking-architect text-foreground leading-[1.05]" style={{ textWrap: "balance" as any }}>
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                {t("hero.title1")}
              </motion.span>
              <br />
              <motion.span
                className="text-gradient-mint"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                {t("hero.title2")}
              </motion.span>
            </h1>
          </motion.div>

          <motion.p
            className="text-base md:text-lg text-muted-foreground max-w-lg leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8, ease: [0.2, 0.8, 0.2, 1] }}
          >
            {t("hero.subtitle1")}<br />
            {t("hero.subtitle2")}
          </motion.p>

          <motion.div
            className="flex gap-4 pt-2 md:pt-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.0, ease: [0.2, 0.8, 0.2, 1] }}
          >
            <Link
              to="/select"
              className="group relative px-6 md:px-8 py-3 md:py-4 rounded-lg bg-primary text-primary-foreground font-bold text-sm transition-all hover:shadow-[0_0_30px_hsl(var(--primary)/0.4)]"
            >
              <span className="relative z-10">{t("hero.cta")}</span>
            </Link>
          </motion.div>
        </div>

        <motion.div
          className="hidden sm:block"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, delay: 0.4, ease: [0.2, 0.8, 0.2, 1] }}
        >
          <OrchestratorVisual />
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
