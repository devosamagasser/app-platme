import { useTranslation } from "react-i18next";
import { useEffect } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Globe } from "lucide-react";

const languages = [
  { code: "en", label: "English" },
  { code: "ar", label: "العربية" },
];

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  useEffect(() => {
    document.documentElement.dir = i18n.language === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = i18n.language;
  }, [i18n.language]);

  const changeLang = (code: string) => {
    i18n.changeLanguage(code);
  };

  const current = languages.find((l) => l.code === i18n.language) || languages[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-mono text-muted-foreground hover:text-foreground hover:bg-primary/5 border border-primary/10 transition-all">
        <Globe className="w-3.5 h-3.5" />
        {current.label}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-card border-primary/15">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => changeLang(lang.code)}
            className={`text-xs font-mono cursor-pointer ${
              i18n.language === lang.code ? "text-primary" : "text-muted-foreground"
            }`}
          >
            {lang.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSwitcher;
