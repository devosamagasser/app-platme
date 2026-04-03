import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useState, useEffect, useCallback } from "react";

interface SystemNode {
  id: string;
  labelKey: string;
  x: number;
  y: number;
  r: number;
  floatDelay: number;
}

const NODES: SystemNode[] = [
  { id: "lms", labelKey: "hero.nodes.lms", x: 200, y: 70, r: 28, floatDelay: 0 },
  { id: "crm", labelKey: "hero.nodes.crm", x: 90, y: 170, r: 22, floatDelay: 0.4 },
  { id: "ecom", labelKey: "hero.nodes.ecom", x: 320, y: 140, r: 24, floatDelay: 0.8 },
  { id: "gym", labelKey: "hero.nodes.gym", x: 60, y: 290, r: 20, floatDelay: 1.2 },
  { id: "clinic", labelKey: "hero.nodes.clinic", x: 200, y: 230, r: 26, floatDelay: 0.2 },
  { id: "resto", labelKey: "hero.nodes.resto", x: 340, y: 270, r: 20, floatDelay: 0.6 },
  { id: "ai", labelKey: "hero.nodes.ai", x: 150, y: 340, r: 22, floatDelay: 1.0 },
  { id: "pay", labelKey: "hero.nodes.pay", x: 270, y: 350, r: 20, floatDelay: 0.3 },
];

const EDGES: [string, string][] = [
  ["lms", "crm"], ["lms", "ecom"], ["lms", "clinic"],
  ["crm", "clinic"], ["crm", "gym"],
  ["ecom", "resto"], ["ecom", "pay"],
  ["clinic", "ai"], ["clinic", "resto"],
  ["gym", "ai"],
  ["ai", "pay"],
  ["resto", "pay"],
];

const PARTICLES = Array.from({ length: 15 }, (_, i) => ({
  id: i,
  x: Math.random() * 400,
  y: Math.random() * 400,
  r: Math.random() * 1.5 + 0.5,
  duration: Math.random() * 4 + 3,
  delay: Math.random() * 3,
}));

const NetworkVisual = () => {
  const { t } = useTranslation();
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  const nodeMap = Object.fromEntries(NODES.map((n) => [n.id, n]));

  const connectedTo = useCallback(
    (nodeId: string) =>
      EDGES.filter(([a, b]) => a === nodeId || b === nodeId).flatMap(([a, b]) =>
        a === nodeId ? [b] : [a]
      ),
    []
  );

  const isEdgeHighlighted = (a: string, b: string) =>
    hoveredNode !== null && (a === hoveredNode || b === hoveredNode);

  return (
    <div className="relative w-full h-full min-h-[300px] md:min-h-[420px]">
      <svg viewBox="0 0 400 420" className="w-full h-full">
        {/* Particles */}
        {PARTICLES.map((p) => (
          <motion.circle
            key={`p-${p.id}`}
            cx={p.x}
            cy={p.y}
            r={p.r}
            fill="hsl(var(--primary))"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.3, 0], cx: [p.x, p.x + (Math.random() - 0.5) * 60, p.x] }}
            transition={{ duration: p.duration, repeat: Infinity, delay: p.delay, ease: "easeInOut" }}
          />
        ))}

        {/* Edges */}
        {EDGES.map(([a, b], i) => {
          const na = nodeMap[a];
          const nb = nodeMap[b];
          const mx = (na.x + nb.x) / 2 + (Math.random() - 0.5) * 30;
          const my = (na.y + nb.y) / 2 + (Math.random() - 0.5) * 30;
          const highlighted = isEdgeHighlighted(a, b);
          return (
            <motion.path
              key={`e-${i}`}
              d={`M${na.x},${na.y} Q${mx},${my} ${nb.x},${nb.y}`}
              stroke="hsl(var(--primary))"
              strokeWidth={highlighted ? 2 : 1}
              fill="none"
              initial={{ opacity: 0, pathLength: 0 }}
              animate={{
                opacity: highlighted ? 0.6 : 0.12,
                pathLength: 1,
              }}
              transition={{
                pathLength: { duration: 1.5, delay: i * 0.15, ease: "easeInOut" },
                opacity: { duration: 0.3 },
              }}
              strokeDasharray={highlighted ? "none" : "4 4"}
            />
          );
        })}

        {/* Nodes */}
        {NODES.map((node) => {
          const isHovered = hoveredNode === node.id;
          const isConnected = hoveredNode ? connectedTo(hoveredNode).includes(node.id) : false;
          const dimmed = hoveredNode !== null && !isHovered && !isConnected;

          return (
            <motion.g
              key={node.id}
              onMouseEnter={() => setHoveredNode(node.id)}
              onMouseLeave={() => setHoveredNode(null)}
              style={{ cursor: "pointer" }}
              animate={{
                y: [0, -6, 0],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                delay: node.floatDelay,
                ease: "easeInOut",
              }}
            >
              {/* Glow ring */}
              <motion.circle
                cx={node.x}
                cy={node.y}
                r={node.r + 8}
                fill="none"
                stroke="hsl(var(--primary))"
                strokeWidth={1}
                animate={{ opacity: isHovered ? 0.4 : 0, scale: isHovered ? 1.1 : 1 }}
                transition={{ duration: 0.3 }}
              />
              {/* Outer glow */}
              <circle
                cx={node.x}
                cy={node.y}
                r={node.r + 16}
                fill="hsl(var(--primary))"
                opacity={isHovered ? 0.06 : 0.02}
              />
              {/* Main circle */}
              <motion.circle
                cx={node.x}
                cy={node.y}
                r={node.r}
                fill="hsl(var(--secondary))"
                stroke="hsl(var(--primary))"
                strokeWidth={isHovered ? 2 : 1}
                animate={{ opacity: dimmed ? 0.3 : 1 }}
                transition={{ duration: 0.3 }}
              />
              {/* Inner dot */}
              <motion.circle
                cx={node.x}
                cy={node.y}
                r={3}
                fill="hsl(var(--primary))"
                animate={{ opacity: dimmed ? 0.2 : 0.8 }}
              />
              {/* Label */}
              <motion.text
                x={node.x}
                y={node.y + node.r + 16}
                textAnchor="middle"
                fill="hsl(var(--muted-foreground))"
                fontSize="9"
                fontFamily="'IBM Plex Mono', monospace"
                animate={{
                  opacity: dimmed ? 0.15 : isHovered ? 1 : 0.5,
                  fill: isHovered ? "hsl(var(--primary))" : "hsl(var(--muted-foreground))",
                }}
                transition={{ duration: 0.3 }}
              >
                {t(node.labelKey)}
              </motion.text>
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
          <NetworkVisual />
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
