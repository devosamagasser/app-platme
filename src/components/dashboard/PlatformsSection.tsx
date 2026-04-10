import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Globe, Plus } from "lucide-react";
import type { Platform } from "@/types";

interface PlatformsSectionProps {
  platforms: Platform[];
}

const PlatformsSection = ({ platforms }: PlatformsSectionProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">{t("dashboard.platforms")}</h1>
          <p className="text-sm text-muted-foreground mt-1">{t("dashboard.platformsSubtitle")}</p>
        </div>
        <button
          onClick={() => navigate("/select")}
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-semibold hover:opacity-90 transition-opacity"
        >
          <Plus className="w-3.5 h-3.5" />
          {t("dashboard.newPlatform")}
        </button>
      </div>

      {platforms.length === 0 ? (
        <div className="panel-glass p-12 text-center">
          <Globe className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">{t("dashboard.noPlatforms")}</p>
          <button
            onClick={() => navigate("/select")}
            className="mt-4 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-semibold hover:opacity-90 transition-opacity"
          >
            {t("dashboard.newPlatform")}
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          {platforms.map((p) => (
            <div key={p.id} className="panel-glass p-4 flex items-center justify-between">
              <div>
                <span className="text-sm font-semibold">{p.subdomain}.platme.com</span>
                <div className="flex items-center gap-2 mt-1">
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
      )}
    </div>
  );
};

export default PlatformsSection;
