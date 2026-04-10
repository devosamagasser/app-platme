import { useTranslation } from "react-i18next";
import { LayoutDashboard, Globe, Coins, Code2, LogOut, Home } from "lucide-react";
import { Link } from "react-router-dom";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";

interface DashboardSidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  isDeveloper: boolean;
  onSignOut: () => void;
}

const DashboardSidebar = ({ activeSection, onSectionChange, isDeveloper, onSignOut }: DashboardSidebarProps) => {
  const { t } = useTranslation();
  const { state } = useSidebar();
  const collapsed = state === "collapsed";

  const menuItems = [
    { id: "overview", icon: LayoutDashboard, label: t("dashboard.sidebarOverview") },
    { id: "platforms", icon: Globe, label: t("dashboard.sidebarPlatforms") },
    { id: "tokens", icon: Coins, label: t("dashboard.sidebarTokens") },
    { id: "developer", icon: Code2, label: t("dashboard.sidebarDeveloper"), badge: isDeveloper },
  ];

  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-[10px] font-mono uppercase tracking-widest">
            {!collapsed && "PLATME"}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    onClick={() => onSectionChange(item.id)}
                    isActive={activeSection === item.id}
                    tooltip={item.label}
                  >
                    <item.icon className="h-4 w-4" />
                    {!collapsed && <span>{item.label}</span>}
                    {!collapsed && item.id === "developer" && isDeveloper && (
                      <span className="ms-auto text-[9px] font-mono uppercase px-1.5 py-0.5 rounded-full bg-primary/15 text-primary">
                        ✓
                      </span>
                    )}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip={t("nav.dashboard")}>
              <Link to="/">
                <Home className="h-4 w-4" />
                {!collapsed && <span>{t("nav.getStarted")}</span>}
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <div className="px-2 py-1">
              <LanguageSwitcher />
            </div>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={onSignOut} tooltip="Sign out">
              <LogOut className="h-4 w-4" />
              {!collapsed && <span>{t("dashboard.signOut") || "Sign Out"}</span>}
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
};

export default DashboardSidebar;
