import { useTranslation } from "react-i18next";
import { Coins, Sparkles, Star } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const PACKAGES = [
  { amount: 50, price: 5, badge: null },
  { amount: 100, price: 10, badge: "tokenPopular" },
  { amount: 500, price: 45, badge: null },
  { amount: 1000, price: 80, badge: "tokenBest" },
] as const;

const TokenPackages = () => {
  const { t } = useTranslation();
  const { toast } = useToast();

  const handlePurchase = (amount: number) => {
    toast({
      title: t("dashboard.comingSoon"),
      description: `${amount} tokens — payment integration coming soon.`,
    });
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-mono uppercase tracking-widest text-primary/70">
          {t("dashboard.tokenPackages")}
        </h3>
      </div>
      <p className="text-xs text-muted-foreground">{t("dashboard.tokenPackageDesc")}</p>
      <div className="grid grid-cols-2 gap-3">
        {PACKAGES.map((pkg) => (
          <button
            key={pkg.amount}
            onClick={() => handlePurchase(pkg.amount)}
            className="panel-glass p-4 text-left hover:border-primary/30 transition-all group relative"
          >
            {pkg.badge && (
              <span className="absolute -top-2 right-3 px-2 py-0.5 rounded-full bg-primary text-primary-foreground text-[9px] font-mono uppercase flex items-center gap-1">
                {pkg.badge === "tokenBest" ? <Star className="w-2.5 h-2.5" /> : <Sparkles className="w-2.5 h-2.5" />}
                {t(`dashboard.${pkg.badge}`)}
              </span>
            )}
            <div className="flex items-center gap-2 mb-2">
              <Coins className="w-4 h-4 text-primary/60" />
              <span className="text-lg font-bold text-foreground">{pkg.amount}</span>
            </div>
            <span className="text-xs text-muted-foreground">tokens</span>
            <div className="mt-2 text-primary font-semibold text-sm">
              ${pkg.price}
            </div>
            <div className="text-[10px] text-muted-foreground">
              ${(pkg.price / pkg.amount * 10).toFixed(1)}/100 tokens
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default TokenPackages;
