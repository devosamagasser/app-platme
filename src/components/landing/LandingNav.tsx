import { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Menu, X } from "lucide-react";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { useAuth } from "@/hooks/useAuth";
import logo from "@/assets/logo.png";

const LandingNav = () => {
  const { t } = useTranslation();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 h-16 flex items-center justify-between px-4 md:px-8 border-b border-primary/10 backdrop-blur-xl bg-background/80">
      <div className="flex items-center gap-2">
        <img src={logo} alt="PLATME" className="w-10 h-10 md:w-14 md:h-14 object-contain" />
        <span className="text-lg font-bold tracking-architect text-foreground">PLATME</span>
      </div>

      {/* Desktop */}
      <div className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
        <a href="#industries" className="hover:text-foreground transition-colors">{t("nav.industries")}</a>
        <a href="#how-it-works" className="hover:text-foreground transition-colors">{t("nav.howItWorks")}</a>
        <LanguageSwitcher />
        <Link to="/select" className="px-5 py-2 rounded-lg bg-primary text-primary-foreground font-semibold text-sm hover:shadow-[0_0_20px_rgba(159,255,208,0.4)] transition-all">
          {t("nav.getStarted")}
        </Link>
      </div>

      {/* Mobile toggle */}
      <button
        className="md:hidden p-2 text-foreground"
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="absolute top-16 left-0 right-0 bg-background/95 backdrop-blur-xl border-b border-primary/10 p-6 flex flex-col gap-4 md:hidden">
          <a href="#industries" onClick={() => setMobileOpen(false)} className="text-sm text-muted-foreground hover:text-foreground transition-colors">{t("nav.industries")}</a>
          <a href="#how-it-works" onClick={() => setMobileOpen(false)} className="text-sm text-muted-foreground hover:text-foreground transition-colors">{t("nav.howItWorks")}</a>
          <LanguageSwitcher />
          <Link to="/select" onClick={() => setMobileOpen(false)} className="px-5 py-2 rounded-lg bg-primary text-primary-foreground font-semibold text-sm text-center hover:shadow-[0_0_20px_rgba(159,255,208,0.4)] transition-all">
            {t("nav.getStarted")}
          </Link>
        </div>
      )}
    </nav>
  );
};

export default LandingNav;
