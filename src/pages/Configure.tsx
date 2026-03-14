import { useState, useEffect, useMemo } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Check, Smartphone, HardDrive, Users, Globe, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import LanguageSwitcher from "@/components/LanguageSwitcher";

interface FeatureConfig {
  slug: string;
  name: string;
  name_ar: string | null;
  category: string;
  price: number;
}

interface SystemPricing {
  id: string;
  unit_storage_price: number;
  unit_capacity_price: number;
  mobile_app_price: number;
  creation_token_cost: number;
}

const Configure = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { toast } = useToast();
  const { user } = useAuth();
  const businessType = searchParams.get("business") || "education";

  const [selectedFeatures, setSelectedFeatures] = useState<FeatureConfig[]>([]);
  const [pricing, setPricing] = useState<SystemPricing | null>(null);
  const [mobileApp, setMobileApp] = useState(false);
  const [subdomain, setSubdomain] = useState("");
  const [globalStorage, setGlobalStorage] = useState(10);
  const [globalCapacity, setGlobalCapacity] = useState(100);
  const [deploying, setDeploying] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      const slugs = JSON.parse(localStorage.getItem("platme_selected_features") || "[]");
      if (!slugs.length) return;

      const { data: system } = await supabase
        .from("systems")
        .select("id, name, unit_storage_price, unit_capacity_price, mobile_app_price, creation_token_cost")
        .eq("slug", businessType)
        .single() as { data: any };

      if (!system) return;

      setPricing({
        id: system.id,
        unit_storage_price: Number(system.unit_storage_price) || 0,
        unit_capacity_price: Number(system.unit_capacity_price) || 0,
        mobile_app_price: Number(system.mobile_app_price) || 0,
      });

      const { data } = await supabase
        .from("system_features")
        .select("slug, name, name_ar, category, price")
        .eq("system_id", system.id)
        .in("slug", slugs);

      if (data) {
        setSelectedFeatures(
          data.map((f: any) => ({
            slug: f.slug,
            name: f.name,
            name_ar: f.name_ar,
            category: f.category,
            price: Number(f.price) || 0,
          }))
        );
      }
    };
    loadData();
  }, [businessType]);

  const featuresCost = useMemo(
    () => selectedFeatures.reduce((sum, f) => sum + f.price, 0),
    [selectedFeatures]
  );

  const totalPrice = useMemo(() => {
    if (!pricing) return 0;
    const storageCost = globalStorage * pricing.unit_storage_price;
    const capacityCost = globalCapacity * pricing.unit_capacity_price;
    const mobileCost = mobileApp ? pricing.mobile_app_price : 0;
    return featuresCost + storageCost + capacityCost + mobileCost;
  }, [globalStorage, globalCapacity, mobileApp, pricing, featuresCost]);

  const handleDeploy = async () => {
    if (!user || !pricing || !subdomain.trim()) {
      toast({ title: t("configure.fillSubdomain"), variant: "destructive" });
      return;
    }

    setDeploying(true);
    try {
      // Check tokens
      const { data: profile } = await supabase
        .from("profiles")
        .select("tokens")
        .eq("id", user.id)
        .single() as { data: { tokens: number } | null };

      if (!profile || profile.tokens < 1) {
        toast({ title: t("configure.noTokens"), variant: "destructive" });
        setDeploying(false);
        return;
      }

      // Create platform
      const { data: platform, error: platErr } = await (supabase
        .from("platforms")
        .insert({
          user_id: user.id,
          system_id: pricing.id,
          subdomain: subdomain.trim(),
          mobile_app: mobileApp,
          storage_gb: globalStorage,
          capacity_users: globalCapacity,
          monthly_price: totalPrice,
          status: "active",
        } as any)
        .select("id")
        .single() as any);

      if (platErr) throw platErr;

      // Insert platform features
      if (selectedFeatures.length > 0) {
        await (supabase.from("platform_features").insert(
          selectedFeatures.map((f) => ({
            platform_id: platform.id,
            feature_slug: f.slug,
            feature_price: f.price,
          })) as any
        ) as any);
      }

      // Deduct token
      await (supabase.from("profiles").update({ tokens: profile.tokens - 1 } as any).eq("id", user.id) as any);
      await (supabase.from("token_transactions").insert({
        user_id: user.id,
        amount: -1,
        reason: "platform_creation",
      } as any) as any);

      toast({ title: t("configure.deploySuccess") });
      navigate("/dashboard");
    } catch (err: any) {
      toast({ title: err.message || "Error", variant: "destructive" });
    } finally {
      setDeploying(false);
    }
  };

  const categories = [...new Set(selectedFeatures.map((f) => f.category))];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="border-b border-primary/8 bg-card">
        <div className="max-w-6xl mx-auto px-4 md:px-6 py-4 flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(`/composer?business=${businessType}`)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-mono text-muted-foreground hover:text-foreground hover:bg-primary/5 border border-primary/10 transition-all"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              {t("configure.backToDesigner")}
            </button>
            <div>
              <div className="text-[10px] font-mono uppercase tracking-widest text-primary/50">
                {t("configure.configLabel")}
              </div>
              <h1 className="text-lg font-semibold text-foreground mt-0.5">
                {t("configure.title")}
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <LanguageSwitcher />
            <div className="text-[10px] font-mono uppercase tracking-widest text-primary/50">
              {selectedFeatures.length} {t("configure.modulesSelected")}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 md:px-6 py-8 flex flex-col lg:flex-row gap-8">
        <div className="flex-1 space-y-8">
          <section>
            <h2 className="text-sm font-mono uppercase tracking-widest text-primary/70 mb-4">
              {t("configure.selectedModules")}
            </h2>
            <div className="space-y-4">
              {categories.map((cat) => (
                <div key={cat}>
                  <div className="text-[10px] font-mono uppercase text-muted-foreground tracking-widest mb-2">
                    {cat}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {selectedFeatures
                      .filter((f) => f.category === cat)
                      .map((f) => (
                        <div
                          key={f.slug}
                          className="p-3 rounded-lg border border-primary/20 bg-primary/5 flex items-center justify-between"
                        >
                          <div className="flex items-center gap-2">
                            <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                              <Check className="w-3 h-3 text-primary" />
                            </div>
                            <div>
                              <span className="text-xs font-semibold text-foreground">{f.name}</span>
                              {f.name_ar && (
                                <span className="text-[10px] text-muted-foreground ms-1.5">
                                  ({f.name_ar})
                                </span>
                              )}
                            </div>
                          </div>
                          {f.price > 0 && (
                            <span className="text-[10px] font-mono text-primary/60">${f.price}/mo</span>
                          )}
                        </div>
                      ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="space-y-6">
            <h2 className="text-sm font-mono uppercase tracking-widest text-primary/70">
              {t("configure.resources")}
            </h2>

            <div className="p-5 rounded-xl border border-primary/10 bg-card space-y-4">
              <div className="flex items-center gap-3 mb-2">
                <HardDrive className="w-4 h-4 text-primary/70" />
                <span className="text-xs font-mono uppercase tracking-wider text-foreground">
                  {t("configure.storage")}
                </span>
                <span className="ms-auto text-sm font-semibold text-primary">
                  {globalStorage} GB
                </span>
              </div>
              <Slider
                value={[globalStorage]}
                onValueChange={([v]) => setGlobalStorage(v)}
                min={5}
                max={500}
                step={5}
              />
              <div className="flex justify-between text-[10px] font-mono text-muted-foreground">
                <span>5 GB</span>
                <span>${(globalStorage * (pricing?.unit_storage_price || 0)).toFixed(0)}/mo</span>
                <span>500 GB</span>
              </div>
            </div>

            <div className="p-5 rounded-xl border border-primary/10 bg-card space-y-4">
              <div className="flex items-center gap-3 mb-2">
                <Users className="w-4 h-4 text-primary/70" />
                <span className="text-xs font-mono uppercase tracking-wider text-foreground">
                  {t("configure.usersCapacity")}
                </span>
                <span className="ms-auto text-sm font-semibold text-primary">
                  {globalCapacity} {t("configure.users")}
                </span>
              </div>
              <Slider
                value={[globalCapacity]}
                onValueChange={([v]) => setGlobalCapacity(v)}
                min={10}
                max={10000}
                step={10}
              />
              <div className="flex justify-between text-[10px] font-mono text-muted-foreground">
                <span>10 {t("configure.users")}</span>
                <span>${(globalCapacity * (pricing?.unit_capacity_price || 0)).toFixed(0)}/mo</span>
                <span>10,000 {t("configure.users")}</span>
              </div>
            </div>
          </section>

          <section className="p-5 rounded-xl border border-primary/10 bg-card">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Smartphone className="w-4 h-4 text-primary/70" />
                <div>
                  <span className="text-xs font-mono uppercase tracking-wider text-foreground">
                    {t("configure.mobileApp")}
                  </span>
                  <p className="text-[10px] text-muted-foreground mt-0.5">
                    {t("configure.mobileAppDesc")}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono text-primary/60">
                  +${pricing?.mobile_app_price || 0}/mo
                </span>
                <Switch checked={mobileApp} onCheckedChange={setMobileApp} />
              </div>
            </div>
          </section>

          <section className="p-5 rounded-xl border border-primary/10 bg-card">
            <div className="flex items-center gap-3 mb-3">
              <Globe className="w-4 h-4 text-primary/70" />
              <span className="text-xs font-mono uppercase tracking-wider text-foreground">
                {t("configure.subdomain")}
              </span>
            </div>
            <div className="flex items-center gap-0 rounded-lg border border-primary/15 bg-background/50 overflow-hidden">
              <Input
                value={subdomain}
                onChange={(e) =>
                  setSubdomain(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))
                }
                placeholder={t("configure.subdomainPlaceholder")}
                className="border-0 rounded-none focus-visible:ring-0 text-sm"
              />
              <span className="px-3 text-xs font-mono text-muted-foreground bg-secondary/30 h-10 flex items-center whitespace-nowrap">
                .platme.com
              </span>
            </div>
          </section>
        </div>

        <div className="w-full lg:w-[280px] shrink-0">
          <div className="sticky top-8 p-5 rounded-xl border border-primary/15 bg-card space-y-4">
            <div className="text-[10px] font-mono uppercase tracking-widest text-primary/50">
              {t("configure.monthlyEstimate")}
            </div>

            <div className="space-y-2 text-xs">
              {featuresCost > 0 && (
                <div className="flex justify-between text-muted-foreground">
                  <span>{t("configure.selectedModules")}</span>
                  <span>${featuresCost.toFixed(0)}</span>
                </div>
              )}
              <div className="flex justify-between text-muted-foreground">
                <span>{t("configure.storage")} ({globalStorage} GB)</span>
                <span>${(globalStorage * (pricing?.unit_storage_price || 0)).toFixed(0)}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>{t("configure.capacity")} ({globalCapacity} {t("configure.users")})</span>
                <span>${(globalCapacity * (pricing?.unit_capacity_price || 0)).toFixed(0)}</span>
              </div>
              {mobileApp && (
                <div className="flex justify-between text-muted-foreground">
                  <span>{t("configure.mobileApp")}</span>
                  <span>${pricing?.mobile_app_price || 0}</span>
                </div>
              )}
            </div>

            <div className="border-t border-primary/10 pt-3">
              <div className="flex justify-between items-baseline">
                <span className="text-xs font-mono uppercase text-muted-foreground">{t("configure.total")}</span>
                <div>
                  <span className="text-2xl font-bold text-primary">${totalPrice.toFixed(0)}</span>
                  <span className="text-xs text-muted-foreground">/mo</span>
                </div>
              </div>
            </div>

            {subdomain && (
              <div className="text-[10px] font-mono text-primary/50 text-center pt-1">
                {subdomain}.platme.com
              </div>
            )}

            <button
              onClick={handleDeploy}
              disabled={deploying}
              className="w-full py-3 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {deploying ? "..." : t("configure.confirmDeploy")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Configure;
