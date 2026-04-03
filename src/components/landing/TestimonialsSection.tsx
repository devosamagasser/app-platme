import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Quote } from "lucide-react";

const TestimonialsSection = () => {
  const { t } = useTranslation();

  const testimonials = [
    { nameKey: "testimonials.name1", roleKey: "testimonials.role1", quoteKey: "testimonials.quote1" },
    { nameKey: "testimonials.name2", roleKey: "testimonials.role2", quoteKey: "testimonials.quote2" },
    { nameKey: "testimonials.name3", roleKey: "testimonials.role3", quoteKey: "testimonials.quote3" },
  ];

  return (
    <section className="py-20 md:py-32 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/[0.02] to-transparent" />
      <div className="relative container mx-auto px-4 md:px-8">
        <motion.div
          className="text-center mb-12 md:mb-16 space-y-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-architect text-foreground">
            {t("testimonials.title")}
          </h2>
          <p className="text-muted-foreground text-base md:text-lg max-w-xl mx-auto">
            {t("testimonials.subtitle")}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {testimonials.map((item, i) => (
            <motion.div
              key={item.nameKey}
              className="p-6 md:p-8 rounded-2xl bg-card/30 border border-primary/10 backdrop-blur-sm space-y-4 hover:border-primary/20 transition-colors"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <Quote className="w-5 h-5 text-primary/40" />
              <p className="text-sm text-muted-foreground leading-relaxed italic">
                "{t(item.quoteKey)}"
              </p>
              <div className="pt-2 border-t border-primary/10">
                <p className="text-sm font-semibold text-foreground">{t(item.nameKey)}</p>
                <p className="text-xs text-muted-foreground">{t(item.roleKey)}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
