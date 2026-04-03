import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowRight, Zap } from "lucide-react";
import logo from "@/assets/logo.png";

const FinalCTA = () => {
  const { t } = useTranslation();

  return (
    <section className="relative">
      {/* CTA Block */}
      <div className="py-20 md:py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-forest/40 to-transparent" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-primary/5 blur-[120px]" />

        <div className="relative container mx-auto px-4 md:px-8 text-center">
          <motion.div
            className="max-w-2xl mx-auto space-y-8"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-architect text-foreground leading-tight">
              {t("cta.title1")}
              <br />
              <span className="text-gradient-mint">{t("cta.title2")}</span>
            </h2>
            <p className="text-muted-foreground text-base md:text-lg max-w-lg mx-auto leading-relaxed">
              {t("cta.subtitle")}
            </p>
            <Link
              to="/select"
              className="group inline-flex items-center gap-2 px-8 md:px-10 py-4 md:py-5 rounded-xl bg-primary text-primary-foreground font-bold text-sm transition-all hover:shadow-[0_0_40px_hsl(var(--primary)/0.35)] hover:scale-[1.02] active:scale-[0.98] mint-glow"
            >
              {t("cta.button")}
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1" />
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-primary/10 bg-background/60 backdrop-blur-sm">
        <div className="container mx-auto px-4 md:px-8 py-8 md:py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            {/* Brand */}
            <div className="space-y-4">
              <div className="flex items-center gap-2.5">
                <img src={logo} alt="PLATME" className="w-8 h-8 object-contain" />
                <span className="text-base font-bold tracking-architect text-foreground">
                  PLAT<span className="text-primary">ME</span>
                </span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
                {t("cta.subtitle")}
              </p>
            </div>

            {/* Quick links */}
            <div className="space-y-4">
              <h4 className="text-xs font-mono uppercase tracking-widest text-primary/50">
                Links
              </h4>
              <div className="flex flex-col gap-2.5">
                <a href="#industries" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  {t("nav.industries")}
                </a>
                <a href="#how-it-works" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  {t("nav.howItWorks")}
                </a>
                <Link to="/select" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  {t("nav.getStarted")}
                </Link>
              </div>
            </div>

            {/* Status */}
            <div className="space-y-4">
              <h4 className="text-xs font-mono uppercase tracking-widest text-primary/50">
                Platform
              </h4>
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
                </span>
                <span className="text-sm text-muted-foreground">Guided Intelligence™</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground/50 font-mono">
                <Zap className="w-3 h-3" />
                <span>v0.1.0</span>
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="mt-8 md:mt-12 pt-6 border-t border-primary/8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground/50">
            <span>{t("cta.footer")}</span>
            <span className="font-mono">Built with Guided Intelligence™</span>
          </div>
        </div>
      </footer>
    </section>
  );
};

export default FinalCTA;
