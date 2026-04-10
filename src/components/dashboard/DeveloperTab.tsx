import { useTranslation } from "react-i18next";
import { Shield, ShieldCheck, TrendingUp, Users, Globe, BarChart3 } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import type { Platform } from "@/types";

interface DeveloperTabProps {
  isDeveloper: boolean;
  platforms: Platform[];
}

const REQUIRED_PLATFORMS = 3;

const DeveloperTab = ({ isDeveloper, platforms }: DeveloperTabProps) => {
  const { t } = useTranslation();

  const activePlatforms = platforms.filter((p) => p.status === "active");
  const totalRevenue = platforms.reduce((sum, p) => sum + p.monthly_price, 0);
  const commission = totalRevenue * 0.1;
  const progress = Math.min((platforms.length / REQUIRED_PLATFORMS) * 100, 100);
  const remaining = Math.max(REQUIRED_PLATFORMS - platforms.length, 0);

  return (
    <div className="space-y-4">
      {/* Verification Status */}
      <div className="panel-glass p-5">
        <div className="flex items-center gap-3 mb-3">
          {isDeveloper ? (
            <div className="w-10 h-10 rounded-full bg-primary/15 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-primary" />
            </div>
          ) : (
            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
              <Shield className="w-5 h-5 text-muted-foreground" />
            </div>
          )}
          <div>
            <span className="text-sm font-semibold">
              {isDeveloper ? t("dashboard.devVerified") : t("dashboard.devNotVerified")}
            </span>
            <p className="text-[10px] text-muted-foreground mt-0.5">
              {t("dashboard.devRequirement")}
            </p>
          </div>
        </div>
        <Progress value={progress} className="h-2 mb-2" />
        <p className="text-xs text-muted-foreground">
          {remaining > 0
            ? t("dashboard.devProgress", { count: remaining })
            : t("dashboard.devProgressDone")}
        </p>
      </div>

      {isDeveloper && (
        <>
          {/* Earnings */}
          <div className="panel-glass p-5">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-4 h-4 text-primary/70" />
              <h3 className="text-sm font-mono uppercase tracking-widest text-primary/70">
                {t("dashboard.devEarnings")}
              </h3>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-[10px] text-muted-foreground uppercase font-mono">
                  {t("dashboard.devTotalRevenue")}
                </div>
                <span className="text-xl font-bold text-foreground">${totalRevenue.toFixed(2)}</span>
              </div>
              <div>
                <div className="text-[10px] text-muted-foreground uppercase font-mono">
                  {t("dashboard.devMonthlyCommission")}
                </div>
                <span className="text-xl font-bold text-primary">${commission.toFixed(2)}</span>
                <span className="text-[10px] text-muted-foreground ms-1">
                  ({t("dashboard.devCommission")})
                </span>
              </div>
            </div>
          </div>

          {/* Platform Stats */}
          <div className="panel-glass p-5">
            <div className="flex items-center gap-2 mb-4">
              <BarChart3 className="w-4 h-4 text-primary/70" />
              <h3 className="text-sm font-mono uppercase tracking-widest text-primary/70">
                {t("dashboard.devPlatformStats")}
              </h3>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <Globe className="w-5 h-5 text-primary/50" />
                <div>
                  <div className="text-[10px] text-muted-foreground uppercase font-mono">
                    {t("dashboard.devActivePlatforms")}
                  </div>
                  <span className="text-lg font-bold">{activePlatforms.length}</span>
                  <span className="text-xs text-muted-foreground"> / {platforms.length}</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Users className="w-5 h-5 text-primary/50" />
                <div>
                  <div className="text-[10px] text-muted-foreground uppercase font-mono">
                    {t("dashboard.devTotalUsers")}
                  </div>
                  <span className="text-lg font-bold">—</span>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default DeveloperTab;
