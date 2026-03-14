import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Switch } from "@/components/ui/switch";
import { Coins, Plus, LogOut, Code2, Globe, Home } from "lucide-react";
import { Link } from "react-router-dom";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { useToast } from "@/hooks/use-toast";

interface Profile {
  email: string;
  full_name: string | null;
  is_developer: boolean;
  tokens: number;
}

interface Platform {
  id: string;
  subdomain: string;
  monthly_price: number;
  status: string;
  created_at: string;
}

const Dashboard = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { toast } = useToast();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [platforms, setPlatforms] = useState<Platform[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      const { data: prof } = await supabase
        .from("profiles")
        .select("email, full_name, is_developer, tokens")
        .eq("id", user.id)
        .single() as { data: Profile | null };

      const { data: plats } = await supabase
        .from("platforms")
        .select("id, subdomain, monthly_price, status, created_at")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false }) as { data: Platform[] | null };

      if (prof) setProfile(prof);
      if (plats) setPlatforms(plats);
      setLoading(false);
    };
    load();
  }, [user]);

  const toggleDeveloper = async () => {
    if (!user || !profile) return;
    const newVal = !profile.is_developer;
    const { error } = await (supabase
      .from("profiles")
      .update({ is_developer: newVal } as any)
      .eq("id", user.id) as any);
    if (!error) {
      setProfile({ ...profile, is_developer: newVal });
      toast({ title: newVal ? t("dashboard.devEnabled") : t("dashboard.devDisabled") });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background bg-grid text-foreground">
      <div className="border-b border-primary/8 bg-card">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <div className="text-[10px] font-mono uppercase tracking-widest text-primary/50">
              {t("dashboard.label")}
            </div>
            <h1 className="text-lg font-semibold mt-0.5">{t("dashboard.title")}</h1>
          </div>
          <div className="flex items-center gap-3">
            <LanguageSwitcher />
            <button onClick={signOut} className="p-2 rounded-md hover:bg-primary/5 text-muted-foreground hover:text-foreground transition-colors">
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        {/* Tokens Card */}
        <div className="panel-glass p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/15 flex items-center justify-center">
              <Coins className="w-5 h-5 text-primary" />
            </div>
            <div>
              <div className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
                {t("dashboard.tokens")}
              </div>
              <span className="text-2xl font-bold text-primary">{profile?.tokens ?? 0}</span>
            </div>
          </div>
          <button className="px-4 py-2 rounded-lg border border-primary/20 text-xs font-mono uppercase tracking-wider text-primary hover:bg-primary/5 transition-colors">
            {t("dashboard.buyTokens")}
          </button>
        </div>

        {/* Developer Toggle */}
        <div className="panel-glass p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Code2 className="w-5 h-5 text-primary/70" />
            <div>
              <span className="text-sm font-semibold">{t("dashboard.developerAccount")}</span>
              <p className="text-[10px] text-muted-foreground mt-0.5">
                {t("dashboard.developerDesc")}
              </p>
            </div>
          </div>
          <Switch checked={profile?.is_developer ?? false} onCheckedChange={toggleDeveloper} />
        </div>

        {/* Platforms */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-mono uppercase tracking-widest text-primary/70">
              {t("dashboard.platforms")}
            </h2>
            <button
              onClick={() => navigate("/select")}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-semibold hover:opacity-90 transition-opacity"
            >
              <Plus className="w-3.5 h-3.5" />
              {t("dashboard.newPlatform")}
            </button>
          </div>

          {platforms.length === 0 ? (
            <div className="panel-glass p-8 text-center">
              <Globe className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">{t("dashboard.noPlatforms")}</p>
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
                      <span className="text-[10px] text-muted-foreground">
                        ${p.monthly_price}/mo
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
