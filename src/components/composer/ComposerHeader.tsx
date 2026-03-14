import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import logo from "@/assets/logo.png";

const ComposerHeader = ({ businessLabel, onComplete }: { businessLabel: string; onComplete: () => void }) => {
  const { t } = useTranslation();

  return (
    <header className="h-14 border-b border-primary/8 px-6 flex items-center justify-between bg-background shrink-0">
      <Link to="/" className="flex items-center gap-2">
        <img src={logo} alt="PLATME" className="w-12 h-12 object-contain" />
        <span className="text-sm font-bold tracking-architect text-foreground">PLATME</span>
      </Link>

      <div className="text-xs text-muted-foreground font-mono tracking-wider uppercase">
        {t("composer.headerLabel")} — <span className="text-primary">{businessLabel}</span>
      </div>

      <div className="flex items-center gap-3">
        <LanguageSwitcher />
        <button
          onClick={onComplete}
          className="px-4 py-1.5 rounded-md text-xs font-semibold bg-primary text-primary-foreground hover:shadow-[0_0_15px_rgba(159,255,208,0.3)] transition-all"
        >
          {t("composer.proceed")}
        </button>
      </div>
    </header>
  );
};

export default ComposerHeader;
