import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useAllProfiles, useAllPlatforms, useAllTransactions } from "@/hooks/useAdminData";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import AdminSidebar from "@/components/admin/AdminSidebar";
import StatsCards from "@/components/admin/StatsCards";
import UsersTable from "@/components/admin/UsersTable";
import PlatformsTable from "@/components/admin/PlatformsTable";
import TransactionsTable from "@/components/admin/TransactionsTable";
import DashboardSkeleton from "@/components/dashboard/DashboardSkeleton";
import LanguageSwitcher from "@/components/LanguageSwitcher";

const AdminDashboard = () => {
  const { signOut } = useAuth();
  const [activeSection, setActiveSection] = useState("overview");
  const { data: profiles = [], isLoading: pLoading } = useAllProfiles();
  const { data: platforms = [], isLoading: plLoading } = useAllPlatforms();
  const { data: transactions = [], isLoading: tLoading } = useAllTransactions();

  const loading = pLoading || plLoading || tLoading;

  if (loading) return <DashboardSkeleton />;

  const renderSection = () => {
    switch (activeSection) {
      case "overview":
        return (
          <div className="space-y-6">
            <StatsCards profiles={profiles} platforms={platforms} transactions={transactions} />
            <UsersTable profiles={profiles} />
            <PlatformsTable platforms={platforms} profiles={profiles} />
          </div>
        );
      case "users":
        return <UsersTable profiles={profiles} />;
      case "platforms":
        return <PlatformsTable platforms={platforms} profiles={profiles} />;
      case "transactions":
        return <TransactionsTable transactions={transactions} profiles={profiles} />;
      default:
        return null;
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background bg-grid text-foreground">
        <AdminSidebar
          activeSection={activeSection}
          onSectionChange={setActiveSection}
          onSignOut={signOut}
        />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-12 flex items-center justify-between border-b border-primary/8 bg-card px-4">
            <div className="flex items-center">
              <SidebarTrigger />
              <div className="ms-3 text-[10px] font-mono uppercase tracking-widest text-destructive/70">
                ADMIN PANEL
              </div>
            </div>
            <LanguageSwitcher />
          </header>
          <main className="flex-1 p-4 md:p-6 max-w-6xl w-full overflow-y-auto">
            {renderSection()}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default AdminDashboard;
