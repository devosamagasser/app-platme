import { motion } from "framer-motion";
import { X, Check, Zap } from "lucide-react";

const columns = [
  {
    title: "AI-Only Systems",
    highlight: false,
    items: [
      { text: "Unpredictable outputs", ok: false },
      { text: "No architectural awareness", ok: false },
      { text: "Black-box decisions", ok: false },
      { text: "Fragile at scale", ok: false },
    ],
  },
  {
    title: "Manual Software Dev",
    highlight: false,
    items: [
      { text: "Months of development", ok: false },
      { text: "High engineering cost", ok: false },
      { text: "Rigid architecture", ok: false },
      { text: "Slow iteration cycles", ok: false },
    ],
  },
  {
    title: "Guided Intelligence™",
    highlight: true,
    items: [
      { text: "Deterministic AI orchestration", ok: true },
      { text: "Human-guided architecture", ok: true },
      { text: "Zero-drift infrastructure", ok: true },
      { text: "Modular & scalable", ok: true },
    ],
  },
];

const ComparisonSection = () => (
  <section className="py-32 relative">
    <div className="container mx-auto px-8">
      <motion.div
        className="text-center mb-16"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <h2 className="text-4xl font-semibold tracking-architect text-foreground mb-4">
          Why Guided Intelligence?
        </h2>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          PLATME combines human intent with AI orchestration for deterministic, enterprise-grade infrastructure.
        </p>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        {columns.map((col, i) => (
          <motion.div
            key={col.title}
            className={`rounded-xl p-8 border ${
              col.highlight
                ? "bg-accent/10 border-primary/30 mint-glow"
                : "bg-secondary/20 border-primary/10"
            }`}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.15 }}
          >
            <div className="flex items-center gap-2 mb-6">
              {col.highlight && <Zap className="w-4 h-4 text-primary" />}
              <h3 className={`text-sm font-bold uppercase tracking-widest ${
                col.highlight ? "text-primary" : "text-muted-foreground"
              }`}>
                {col.title}
              </h3>
            </div>
            <div className="space-y-4">
              {col.items.map((item) => (
                <div key={item.text} className="flex items-start gap-3">
                  {item.ok ? (
                    <Check className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                  ) : (
                    <X className="w-4 h-4 text-destructive/60 mt-0.5 shrink-0" />
                  )}
                  <span className={`text-sm ${item.ok ? "text-foreground" : "text-muted-foreground"}`}>
                    {item.text}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default ComparisonSection;
