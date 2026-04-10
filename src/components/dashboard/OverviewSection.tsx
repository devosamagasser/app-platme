import { useTranslation } from "react-i18next";
import { Coins, Globe, Code2, TrendingUp } from "lucide-react";
import type { Platform, Profile } from "@/types";

interface OverviewSectionProps {
  profile: Profile | null;
  platforms: Platform[];
  onNavigate: (section: string) => void;
}

const OverviewSection = ({ profile, platforms, onNavigate }: OverviewSectionProps) => {
  const { t } = useTranslation();
  const activePlatforms = platforms.filter((p) => p.status === "active");
  const totalRevenue = platforms.reduce((sum, p) => sum + p.monthly_price, 0);
  const commission = profile?.is_developer ? totalRevenue * 0.1 : 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold">{t("dashboard.title")}</h1>
        <p className="text-sm text-muted-foreground mt-1">
          {t("dashboard.overviewSubtitle")}
        </p>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <button onClick={() => onNavigate("tokens")} className="panel-glass p-4 text-start hover:border-primary/20 transition-colors">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-full bg-primary/15 flex items-center justify-center">
              <Coins className="w-4 h-4 text-primary" />
            </div>
          </div>
          <div className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
            {t("dashboard.tokens")}
          </div>
          <span className="text-2xl font-bold text-primary">{profile?.tokens ?? 0}</span>
        </button>

        <button onClick={() => onNavigate("platforms")} className="panel-glass p-4 text-start hover:border-primary/20 transition-colors">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-full bg-primary/15 flex items-center justify-center">
              <Globe className="w-4 h-4 text-primary" />
            </div>
          </div>
          <div className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
            {t("dashboard.platforms")}
          </div>
          <span className="text-2xl font-bold">{platforms.length}</span>
          <span className="text-xs text-muted-foreground ms-1">({activePlatforms.length} {t("dashboard.devActivePlatforms").toLowerCase()})</span>
        </button>

        <button onClick={() => onNavigate("developer")} className="panel-glass p-4 text-start hover:border-primary/20 transition-colors">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-full bg-primary/15 flex items-center justify-center">
              <Code2 className="w-4 h-4 text-primary" />
            </div>
          </div>
          <div className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
            {t("dashboard.sidebarDeveloper")}
          </div>
          <span className="text-sm font-semibold">
            {profile?.is_developer ? t("dashboard.devVerified") : t("dashboard.devNotVerified")}
          </span>
        </button>

        {profile?.is_developer && (
          <div className="panel-glass p-4 text-start">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-full bg-primary/15 flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-primary" />
              </div>
            </div>
            <div className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
              {t("dashboard.devMonthlyCommission")}
            </div>
            <span className="text-2xl font-bold text-primary">${commission.toFixed(2)}</span>
          </div>
        )}
      </div>

      {/* Recent Platforms */}
      {platforms.length > 0 && (
        <div>
          <h2 className="text-sm font-mono uppercase tracking-widest text-primary/70 mb-3">
            {t("dashboard.recentPlatforms")}
          </h2>
          <div className="space-y-2">
            {platforms.slice(0, 3).map((p) => (
              <div key={p.id} className="panel-glass p-3 flex items-center justify-between">
                <div>
                  <span className="text-sm font-semibold">{p.subdomain}.platme.com</span>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded-full ${
                      p.status === "active" ? "bg-primary/15 text-primary" : "bg-muted text-muted-foreground"
                    }`}>
                      {p.status}
                    </span>
                    <span className="text-[10px] text-muted-foreground">${p.monthly_price}/mo</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default OverviewSection;
