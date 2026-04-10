import { Users, Globe, Coins, TrendingUp } from "lucide-react";
import type { AdminProfile, AdminPlatform, AdminTransaction } from "@/services/adminService";

interface StatsCardsProps {
  profiles: AdminProfile[];
  platforms: AdminPlatform[];
  transactions: AdminTransaction[];
}

const StatsCards = ({ profiles, platforms, transactions }: StatsCardsProps) => {
  const totalUsers = profiles.length;
  const activePlatforms = platforms.filter((p) => p.status === "active").length;
  const totalTokens = profiles.reduce((sum, p) => sum + p.tokens, 0);
  const totalRevenue = platforms.reduce((sum, p) => sum + p.monthly_price, 0);

  const stats = [
    { icon: Users, label: "Total Users", value: totalUsers, color: "text-primary" },
    { icon: Globe, label: "Active Platforms", value: activePlatforms, color: "text-emerald-400" },
    { icon: Coins, label: "Total Tokens", value: totalTokens.toLocaleString(), color: "text-amber-400" },
    { icon: TrendingUp, label: "Monthly Revenue", value: `$${totalRevenue.toFixed(0)}`, color: "text-cyan-400" },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((s) => (
        <div key={s.label} className="bg-card border border-primary/10 rounded-xl p-5 space-y-2">
          <div className="flex items-center gap-2">
            <s.icon className={`h-5 w-5 ${s.color}`} />
            <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground">{s.label}</span>
          </div>
          <div className="text-2xl font-bold">{s.value}</div>
        </div>
      ))}
    </div>
  );
};

export default StatsCards;
