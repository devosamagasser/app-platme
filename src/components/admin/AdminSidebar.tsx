import { useTranslation } from "react-i18next";
import { LayoutDashboard, Users, Globe, Coins, LogOut, Home } from "lucide-react";
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
  SidebarHeader,
  useSidebar,
} from "@/components/ui/sidebar";
import logo from "@/assets/logo.png";

interface AdminSidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  onSignOut: () => void;
}

const AdminSidebar = ({ activeSection, onSectionChange, onSignOut }: AdminSidebarProps) => {
  const { t } = useTranslation();
  const { state } = useSidebar();
  const collapsed = state === "collapsed";

  const menuItems = [
    { id: "overview", icon: LayoutDashboard, label: "Overview" },
    { id: "users", icon: Users, label: "Users" },
    { id: "platforms", icon: Globe, label: "Platforms" },
    { id: "transactions", icon: Coins, label: "Transactions" },
  ];

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="flex items-center justify-center py-4">
        <img src={logo} alt="PlatMe" className={`${collapsed ? "w-10 h-10" : "w-36"} object-contain transition-all`} />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-[10px] font-mono uppercase tracking-widest">
            {!collapsed && "ADMIN PANEL"}
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
            <SidebarMenuButton onClick={() => window.location.href = "/dashboard"} tooltip="Dashboard">
              <Home className="h-4 w-4" />
              {!collapsed && <span>Back to Dashboard</span>}
            </SidebarMenuButton>
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

export default AdminSidebar;
