import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
import { Brain, Search, Hammer, Rocket } from "lucide-react";

const ORCHESTRATOR_STEPS = [
  { id: "analyze", icon: Search, angle: -90 },
  { id: "build", icon: Hammer, angle: 210 },
  { id: "deploy", icon: Rocket, angle: 330 },
];

const PARTICLES = Array.from({ length: 6 }, (_, i) => ({
  id: i,
  x: Math.random() * 400,
  y: Math.random() * 400,
  r: Math.random() * 1.5 + 0.5,
  duration: Math.random() * 4 + 3,
  delay: Math.random() * 3,
}));

const OrchestratorVisual = () => {
  const { t } = useTranslation();
  const cx = 200;
  const cy = 200;
  const radius = 130;

  const steps = ORCHESTRATOR_STEPS.map((s) => {
    const rad = (s.angle * Math.PI) / 180;
    return { ...s, x: cx + Math.cos(rad) * radius, y: cy + Math.sin(rad) * radius };
  });

  return (
    <div className="relative w-full h-full min-h-[300px] md:min-h-[420px] flex items-center justify-center">
      <svg viewBox="0 0 400 400" className="w-full h-full max-w-[420px]">
        {/* Background particles */}
        {PARTICLES.map((p) => (
          <motion.circle
            key={`p-${p.id}`}
            cx={p.x}
            cy={p.y}
            r={p.r}
            fill="hsl(var(--primary))"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.25, 0], cx: [p.x, p.x + (Math.random() - 0.5) * 40, p.x] }}
            transition={{ duration: p.duration, repeat: Infinity, delay: p.delay, ease: "easeInOut" }}
          />
        ))}

        {/* Animated connection lines */}
        {steps.map((step, i) => (
          <motion.line
            key={`line-${step.id}`}
            x1={cx}
            y1={cy}
            x2={step.x}
            y2={step.y}
            stroke="hsl(var(--primary))"
            strokeWidth={1.5}
            strokeDasharray="6 4"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.35 }}
            transition={{ duration: 1, delay: 0.8 + i * 0.3, ease: "easeOut" }}
          />
        ))}

        {/* Pulse rings on center */}
        {[0, 1, 2].map((i) => (
          <motion.circle
            key={`ring-${i}`}
            cx={cx}
            cy={cy}
            r={44}
            fill="none"
            stroke="hsl(var(--primary))"
            strokeWidth={1}
            initial={{ opacity: 0.4, scale: 1 }}
            animate={{ opacity: 0, scale: 2.2 }}
            transition={{ duration: 3, repeat: Infinity, delay: i * 1, ease: "easeOut" }}
            style={{ transformOrigin: `${cx}px ${cy}px` }}
          />
        ))}

        {/* Center circle glow */}
        <circle cx={cx} cy={cy} r={54} fill="hsl(var(--primary))" opacity={0.06} />
        <circle cx={cx} cy={cy} r={46} fill="hsl(var(--primary))" opacity={0.08} />

        {/* Center main circle */}
        <motion.circle
          cx={cx}
          cy={cy}
          r={40}
          fill="hsl(var(--secondary))"
          stroke="hsl(var(--primary))"
          strokeWidth={2}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.6, ease: "backOut" }}
          style={{ transformOrigin: `${cx}px ${cy}px` }}
        />

        {/* Center icon placeholder — rendered via foreignObject */}
        <foreignObject x={cx - 16} y={cy - 22} width={32} height={32}>
          <div className="flex items-center justify-center w-full h-full">
            <Brain className="w-6 h-6 text-primary" />
          </div>
        </foreignObject>
        <text
          x={cx}
          y={cy + 24}
          textAnchor="middle"
          fill="hsl(var(--primary))"
          fontSize="8"
          fontFamily="'IBM Plex Mono', monospace"
          fontWeight="600"
          opacity={0.8}
        >
          {t("hero.orchestrator.core")}
        </text>

        {/* Step nodes */}
        {steps.map((step, i) => {
          const Icon = step.icon;
          return (
            <motion.g
              key={step.id}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 1.0 + i * 0.3, ease: "backOut" }}
              style={{ transformOrigin: `${step.x}px ${step.y}px` }}
            >
              {/* Floating animation */}
              <motion.g
                animate={{ y: [0, -4, 0] }}
                transition={{ duration: 3, repeat: Infinity, delay: i * 0.5, ease: "easeInOut" }}
              >
                {/* Outer glow */}
                <circle cx={step.x} cy={step.y} r={34} fill="hsl(var(--primary))" opacity={0.04} />
                {/* Node circle */}
                <circle
                  cx={step.x}
                  cy={step.y}
                  r={26}
                  fill="hsl(var(--secondary))"
                  stroke="hsl(var(--primary))"
                  strokeWidth={1.5}
                />
                {/* Icon */}
                <foreignObject x={step.x - 10} y={step.y - 10} width={20} height={20}>
                  <div className="flex items-center justify-center w-full h-full">
                    <Icon className="w-4 h-4 text-primary" />
                  </div>
                </foreignObject>
                {/* Label */}
                <text
                  x={step.x}
                  y={step.y + 40}
                  textAnchor="middle"
                  fill="hsl(var(--muted-foreground))"
                  fontSize="10"
                  fontFamily="'IBM Plex Mono', monospace"
                  fontWeight="500"
                >
                  {t(`hero.orchestrator.${step.id}`)}
                </text>
              </motion.g>
            </motion.g>
          );
        })}
      </svg>
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
