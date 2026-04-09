import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { useAuth } from "@/hooks/useAuth";
import { Navigate } from "react-router-dom";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { toast } = useToast();
  const { user, loading: authLoading } = useAuth();

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (user) return <Navigate to="/dashboard" replace />;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        navigate("/dashboard");
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: window.location.origin,
            data: { full_name: fullName },
          },
        });
        if (error) throw error;
        toast({
          title: t("auth.checkEmail"),
          description: t("auth.confirmEmail"),
        });
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      toast({
        title: t("auth.error"),
        description: message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background bg-grid flex items-center justify-center px-4">
      <div className="absolute top-4 end-4">
        <LanguageSwitcher />
      </div>

      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="text-[10px] font-mono uppercase tracking-widest text-primary/50 mb-2">
            {t("auth.platform")}
          </div>
          <h1 className="text-2xl font-bold text-foreground tracking-architect">
            {isLogin ? t("auth.loginTitle") : t("auth.signupTitle")}
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="panel-glass p-6 space-y-4">
          {!isLogin && (
            <div>
              <label className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-1.5 block">
                {t("auth.fullName")}
              </label>
              <Input
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder={t("auth.fullNamePlaceholder")}
                className="bg-background/50"
              />
            </div>
          )}

          <div>
            <label className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-1.5 block">
              {t("auth.email")}
            </label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              className="bg-background/50"
            />
          </div>

          <div>
            <label className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-1.5 block">
              {t("auth.password")}
            </label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              minLength={6}
              className="bg-background/50"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {loading ? "..." : isLogin ? t("auth.login") : t("auth.signup")}
          </button>
        </form>

        <p className="text-center text-xs text-muted-foreground mt-4">
          {isLogin ? t("auth.noAccount") : t("auth.hasAccount")}{" "}
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-primary hover:underline"
          >
            {isLogin ? t("auth.signup") : t("auth.login")}
          </button>
        </p>
      </div>
    </div>
  );
};

export default Auth;
