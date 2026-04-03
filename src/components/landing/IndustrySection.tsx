import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useState, useCallback } from "react";

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
    <div className="relative w-full max-w-[500px] mx-auto">
      <svg viewBox="0 0 400 420" className="w-full h-full">
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
              whileInView={{
                opacity: highlighted ? 0.6 : 0.12,
                pathLength: 1,
              }}
              viewport={{ once: true }}
              transition={{
                pathLength: { duration: 1.5, delay: i * 0.15, ease: "easeInOut" },
                opacity: { duration: 0.3 },
              }}
              strokeDasharray={highlighted ? "none" : "4 4"}
            />
          );
        })}

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
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 3, repeat: Infinity, delay: node.floatDelay, ease: "easeInOut" }}
            >
              <motion.circle
                cx={node.x} cy={node.y} r={node.r + 8}
                fill="none" stroke="hsl(var(--primary))" strokeWidth={1}
                animate={{ opacity: isHovered ? 0.4 : 0, scale: isHovered ? 1.1 : 1 }}
                transition={{ duration: 0.3 }}
              />
              <circle cx={node.x} cy={node.y} r={node.r + 16}
                fill="hsl(var(--primary))" opacity={isHovered ? 0.06 : 0.02}
              />
              <motion.circle
                cx={node.x} cy={node.y} r={node.r}
                fill="hsl(var(--secondary))" stroke="hsl(var(--primary))"
                strokeWidth={isHovered ? 2 : 1}
                animate={{ opacity: dimmed ? 0.3 : 1 }}
                transition={{ duration: 0.3 }}
              />
              <motion.circle
                cx={node.x} cy={node.y} r={3}
                fill="hsl(var(--primary))"
                animate={{ opacity: dimmed ? 0.2 : 0.8 }}
              />
              <motion.text
                x={node.x} y={node.y + node.r + 16}
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

const IndustrySection = () => {
  const { t } = useTranslation();

  return (
    <section id="industries" className="py-20 md:py-32 relative">
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex flex-col items-center">
          <motion.div
            className="text-center space-y-4 mb-12 md:mb-16"
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

          <motion.div
            className="w-full"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <NetworkVisual />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default IndustrySection;
