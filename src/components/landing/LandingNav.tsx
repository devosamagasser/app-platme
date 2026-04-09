import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { useAuth } from "@/hooks/useAuth";
import logo from "@/assets/logo.png";

const LandingNav = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const navLinks = [
    { href: "#industries", label: t("nav.industries") },
    { href: "#why", label: t("nav.why") },
    { href: "#pricing", label: t("nav.pricing") },
    { href: "#how-it-works", label: t("nav.howItWorks") },
    { href: "#faq", label: t("nav.faq") },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "h-14 bg-background/90 backdrop-blur-xl border-b border-primary/10 shadow-[0_1px_20px_hsl(var(--primary)/0.05)]"
          : "h-16 bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4 md:px-8 h-full flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <img
            src={logo}
            alt="PLATME"
            className="w-9 h-9 md:w-10 md:h-10 object-contain transition-transform group-hover:scale-105"
          />
          <span className="text-lg font-bold tracking-architect text-foreground">
            PLAT<span className="text-primary">ME</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="relative px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-primary/5"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Desktop actions */}
        <div className="hidden md:flex items-center gap-3">
          <LanguageSwitcher />
          {user ? (
            <Link
              to="/dashboard"
              className="px-5 py-2 rounded-lg bg-primary text-primary-foreground font-semibold text-sm transition-all hover:shadow-[0_0_24px_hsl(var(--primary)/0.35)] hover:scale-[1.02] active:scale-[0.98]"
            >
              {t("nav.dashboard")}
            </Link>
          ) : (
            <Link
              to="/select"
              className="px-5 py-2 rounded-lg bg-primary text-primary-foreground font-semibold text-sm transition-all hover:shadow-[0_0_24px_hsl(var(--primary)/0.35)] hover:scale-[1.02] active:scale-[0.98]"
            >
              {t("nav.getStarted")}
            </Link>
          )}
        </div>

        {/* Mobile: language + toggle */}
        <div className="flex md:hidden items-center gap-2">
          <LanguageSwitcher />
          <button
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            className="p-2 rounded-lg text-foreground hover:bg-primary/10 transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="w-5 h-5" aria-hidden="true" /> : <Menu className="w-5 h-5" aria-hidden="true" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden overflow-hidden bg-background/95 backdrop-blur-xl border-b border-primary/10"
          >
            <div className="container mx-auto px-4 py-4 flex flex-col gap-2">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="px-4 py-3 text-sm text-muted-foreground hover:text-foreground hover:bg-primary/5 rounded-lg transition-colors"
                >
                  {link.label}
                </a>
              ))}
              <div className="mt-2">
                {user ? (
                  <Link
                    to="/dashboard"
                    onClick={() => setMobileOpen(false)}
                    className="block px-5 py-3 rounded-lg bg-primary text-primary-foreground font-semibold text-sm text-center transition-all"
                  >
                    {t("nav.dashboard")}
                  </Link>
                ) : (
                  <Link
                    to="/select"
                    onClick={() => setMobileOpen(false)}
                    className="block px-5 py-3 rounded-lg bg-primary text-primary-foreground font-semibold text-sm text-center transition-all"
                  >
                    {t("nav.getStarted")}
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default LandingNav;
