import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Gift, Copy, Check, Users, Coins } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { motion } from "framer-motion";

const ReferralSection = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [copied, setCopied] = useState(false);
  const [referralCode, setReferralCode] = useState("");
  const [stats, setStats] = useState({ totalReferred: 0, tokensEarned: 0 });

  useEffect(() => {
    if (!user) return;
    // Generate deterministic referral code from user id
    const code = `PLATME-${user.id.slice(0, 8).toUpperCase()}`;
    setReferralCode(code);

    // Fetch referral stats
    const fetchStats = async () => {
      const { data } = await supabase
        .from("referrals" as any)
        .select("id, tokens_rewarded")
        .eq("referrer_id", user.id);

      if (data && Array.isArray(data)) {
        setStats({
          totalReferred: data.length,
          tokensEarned: data.reduce((sum: number, r: any) => sum + (r.tokens_rewarded || 0), 0),
        });
      }
    };
    fetchStats();
  }, [user]);

  const handleCopy = async () => {
    const link = `${window.location.origin}/auth?ref=${referralCode}`;
    await navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold">{t("dashboard.referralTitle")}</h1>
        <p className="text-sm text-muted-foreground mt-1">{t("dashboard.referralSubtitle")}</p>
      </div>

      {/* Referral Link Card */}
      <div className="panel-glass p-5 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/15 flex items-center justify-center">
            <Gift className="w-5 h-5 text-primary" />
          </div>
          <div>
            <div className="text-sm font-semibold text-foreground">{t("dashboard.referralYourLink")}</div>
            <div className="text-[10px] text-muted-foreground">{t("dashboard.referralShareDesc")}</div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex-1 bg-background/50 border border-primary/10 rounded-lg px-3 py-2.5 text-xs font-mono text-primary/80 truncate">
            {`${window.location.origin}/auth?ref=${referralCode}`}
          </div>
          <button
            onClick={handleCopy}
            className="p-2.5 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition-opacity shrink-0"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="panel-glass p-4"
        >
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-full bg-primary/15 flex items-center justify-center">
              <Users className="w-4 h-4 text-primary" />
            </div>
          </div>
          <div className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
            {t("dashboard.referralTotalReferred")}
          </div>
          <span className="text-2xl font-bold text-foreground">{stats.totalReferred}</span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="panel-glass p-4"
        >
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-full bg-primary/15 flex items-center justify-center">
              <Coins className="w-4 h-4 text-primary" />
            </div>
          </div>
          <div className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
            {t("dashboard.referralTokensEarned")}
          </div>
          <span className="text-2xl font-bold text-primary">{stats.tokensEarned}</span>
        </motion.div>
      </div>

      {/* How it works */}
      <div className="panel-glass p-5">
        <h3 className="text-sm font-semibold text-foreground mb-3">{t("dashboard.referralHowItWorks")}</h3>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-primary/15 flex items-center justify-center text-[10px] font-bold text-primary shrink-0 mt-0.5">
                {i}
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {t(`dashboard.referralStep${i}`)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ReferralSection;
