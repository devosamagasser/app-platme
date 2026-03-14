import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const FinalCTA = () => {
  const { t } = useTranslation();

  return (
    <section className="py-32 relative">
      <div className="absolute inset-0 bg-gradient-to-t from-forest/30 to-transparent" />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-primary/5 blur-[120px]" />

      <div className="relative container mx-auto px-8 text-center">
        <motion.div
          className="space-y-8"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-semibold tracking-architect text-foreground leading-tight">
            {t("cta.title1")}<br />
            <span className="text-gradient-mint">{t("cta.title2")}</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-lg mx-auto">
            {t("cta.subtitle")}
          </p>
          <Link to="/select" className="inline-block px-10 py-5 rounded-lg bg-primary text-primary-foreground font-bold text-sm hover:shadow-[0_0_30px_rgba(159,255,208,0.4)] transition-all mint-glow">
            {t("cta.button")}
          </Link>
        </motion.div>
      </div>

      <div className="relative mt-32 border-t border-primary/10 pt-8">
        <div className="container mx-auto px-8 flex items-center justify-between text-xs text-muted-foreground">
          <span>{t("cta.footer")}</span>
          <span className="font-mono">v0.1.0</span>
        </div>
      </div>
    </section>
  );
};

export default FinalCTA;
