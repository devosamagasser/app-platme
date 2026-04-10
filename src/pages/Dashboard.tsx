import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Home } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { usePlatforms } from "@/hooks/usePlatforms";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import OverviewSection from "@/components/dashboard/OverviewSection";
import PlatformsSection from "@/components/dashboard/PlatformsSection";
import TokensSection from "@/components/dashboard/TokensSection";
import DeveloperTab from "@/components/dashboard/DeveloperTab";
import { useToast } from "@/hooks/use-toast";

const LOW_BALANCE_THRESHOLD = 10;

const Dashboard = () => {
  const { signOut } = useAuth();
  const { t } = useTranslation();
  const { toast } = useToast();
  const { data: profile, isLoading: profileLoading } = useProfile();
  const { data: platforms = [], isLoading: platformsLoading } = usePlatforms();
  const [activeSection, setActiveSection] = useState("overview");

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

  const renderSection = () => {
    switch (activeSection) {
      case "overview":
        return <OverviewSection profile={profile ?? null} platforms={platforms} onNavigate={setActiveSection} />;
      case "platforms":
        return <PlatformsSection platforms={platforms} />;
      case "tokens":
        return <TokensSection profile={profile ?? null} />;
      case "developer":
        return <DeveloperTab isDeveloper={profile?.is_developer ?? false} platforms={platforms} />;
      default:
        return <OverviewSection profile={profile ?? null} platforms={platforms} onNavigate={setActiveSection} />;
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background bg-grid text-foreground">
        <DashboardSidebar
          activeSection={activeSection}
          onSectionChange={setActiveSection}
          isDeveloper={profile?.is_developer ?? false}
          onSignOut={signOut}
        />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-12 flex items-center justify-between border-b border-primary/8 bg-card px-4">
            <div className="flex items-center">
              <SidebarTrigger />
              <div className="ms-3 text-[10px] font-mono uppercase tracking-widest text-primary/50">
                {t("dashboard.label")}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <LanguageSwitcher />
              <Link to="/" className="p-2 rounded-md hover:bg-primary/5 text-muted-foreground hover:text-foreground transition-colors">
                <Home className="w-4 h-4" />
              </Link>
            </div>
          </header>
          <main className="flex-1 p-6 max-w-4xl w-full">
            {renderSection()}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Dashboard;
