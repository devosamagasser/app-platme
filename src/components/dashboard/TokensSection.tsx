import { useTranslation } from "react-i18next";
import { Coins } from "lucide-react";
import TokenPackages from "./TokenPackages";
import TransactionHistory from "./TransactionHistory";
import type { Profile } from "@/types";

interface TokensSectionProps {
  profile: Profile | null;
}

const TokensSection = ({ profile }: TokensSectionProps) => {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold">{t("dashboard.sidebarTokens")}</h1>
        <p className="text-sm text-muted-foreground mt-1">{t("dashboard.tokensSubtitle")}</p>
      </div>

      {/* Balance Card */}
      <div className="panel-glass p-5 flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-primary/15 flex items-center justify-center">
          <Coins className="w-6 h-6 text-primary" />
        </div>
        <div>
          <div className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
            {t("dashboard.currentBalance")}
          </div>
          <span className="text-3xl font-bold text-primary">{profile?.tokens ?? 0}</span>
          <span className="text-sm text-muted-foreground ms-1">tokens</span>
        </div>
      </div>

      <TokenPackages />
      <TransactionHistory />
    </div>
  );
};

export default TokensSection;
