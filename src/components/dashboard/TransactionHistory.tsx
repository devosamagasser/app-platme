import { useTranslation } from "react-i18next";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { History } from "lucide-react";

const TransactionHistory = () => {
  const { t } = useTranslation();
  const { user } = useAuth();

  const { data: transactions = [] } = useQuery({
    queryKey: ["token_transactions", user?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from("token_transactions")
        .select("id, amount, reason, created_at")
        .eq("user_id", user!.id)
        .order("created_at", { ascending: false })
        .limit(20);
      return data ?? [];
    },
    enabled: !!user,
  });

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <History className="w-4 h-4 text-primary/70" />
        <h3 className="text-sm font-mono uppercase tracking-widest text-primary/70">
          {t("dashboard.transactionHistory")}
        </h3>
      </div>
      {transactions.length === 0 ? (
        <p className="text-xs text-muted-foreground panel-glass p-4 text-center">
          {t("dashboard.noTransactions")}
        </p>
      ) : (
        <div className="space-y-1.5">
          {transactions.map((tx) => (
            <div key={tx.id} className="panel-glass p-3 flex items-center justify-between">
              <div>
                <span className="text-xs font-medium">{tx.reason}</span>
                <div className="text-[10px] text-muted-foreground">
                  {new Date(tx.created_at).toLocaleDateString()}
                </div>
              </div>
              <span className={`text-sm font-bold ${tx.amount > 0 ? "text-primary" : "text-destructive"}`}>
                {tx.amount > 0 ? "+" : ""}{tx.amount}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TransactionHistory;
