import { motion } from "framer-motion";
import { X, Check, Zap } from "lucide-react";
import { useTranslation } from "react-i18next";

const ComparisonSection = () => {
  const { t } = useTranslation();

  const columns = [
    {
      title: t("comparison.aiOnly"),
      highlight: false,
      items: [
        { text: t("comparison.aiOnly1"), ok: false },
        { text: t("comparison.aiOnly2"), ok: false },
        { text: t("comparison.aiOnly3"), ok: false },
        { text: t("comparison.aiOnly4"), ok: false },
      ],
    },
    {
      title: t("comparison.manual"),
      highlight: false,
      items: [
        { text: t("comparison.manual1"), ok: false },
        { text: t("comparison.manual2"), ok: false },
        { text: t("comparison.manual3"), ok: false },
        { text: t("comparison.manual4"), ok: false },
      ],
    },
    {
      title: t("comparison.guided"),
      highlight: true,
      items: [
        { text: t("comparison.guided1"), ok: true },
        { text: t("comparison.guided2"), ok: true },
        { text: t("comparison.guided3"), ok: true },
        { text: t("comparison.guided4"), ok: true },
      ],
    },
  ];

  return (
    <section className="py-20 md:py-32 relative">
      <div className="container mx-auto px-4 md:px-8">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl font-semibold tracking-architect text-foreground mb-4">
            {t("comparison.title")}
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            {t("comparison.subtitle")}
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-8 max-w-5xl mx-auto px-2">
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
};

export default ComparisonSection;
