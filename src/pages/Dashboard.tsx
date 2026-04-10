import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import { usePlatforms } from "@/hooks/usePlatforms";
import { Coins, Plus, LogOut, Globe, Home } from "lucide-react";
import { Link } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import TokenPackages from "@/components/dashboard/TokenPackages";
import DeveloperTab from "@/components/dashboard/DeveloperTab";
import TransactionHistory from "@/components/dashboard/TransactionHistory";
import { useToast } from "@/hooks/use-toast";

const LOW_BALANCE_THRESHOLD = 10;

const Dashboard = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { toast } = useToast();
  const { data: profile, isLoading: profileLoading } = useProfile();
  const { data: platforms = [], isLoading: platformsLoading } = usePlatforms();

  const loading = profileLoading || platformsLoading;

  // Low balance notification
  useEffect(() => {
    if (profile && profile.tokens <= LOW_BALANCE_THRESHOLD) {
      toast({
        title: t("dashboard.lowBalanceTitle"),
        description: t("dashboard.lowBalanceDesc", { count: profile.tokens }),
        variant: "destructive",
      });
    }
  }, [profile?.tokens]); // eslint-disable-line react-hooks/exhaustive-deps

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
            <Link to="/" className="p-2 rounded-md hover:bg-primary/5 text-muted-foreground hover:text-foreground transition-colors">
              <Home className="w-4 h-4" />
            </Link>
            <LanguageSwitcher />
            <button onClick={signOut} className="p-2 rounded-md hover:bg-primary/5 text-muted-foreground hover:text-foreground transition-colors">
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <Tabs defaultValue="general" className="space-y-6">
          <TabsList className="bg-card border border-primary/10">
            <TabsTrigger value="general">{t("dashboard.tabGeneral")}</TabsTrigger>
            <TabsTrigger value="developer">{t("dashboard.tabDeveloper")}</TabsTrigger>
          </TabsList>

          {/* General Tab */}
          <TabsContent value="general" className="space-y-6">
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
            </div>

            {/* Token Packages */}
            <TokenPackages />

            {/* Transaction History */}
            <TransactionHistory />

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
          </TabsContent>

          {/* Developer Tab */}
          <TabsContent value="developer" className="space-y-6">
            <DeveloperTab
              isDeveloper={profile?.is_developer ?? false}
              platforms={platforms}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;
