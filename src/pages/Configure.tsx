import { useState, useEffect, useMemo } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Smartphone, Globe, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import SelectedModules from "@/components/configure/SelectedModules";
import ResourceSliders from "@/components/configure/ResourceSliders";
import OwnerDetailsForm from "@/components/configure/OwnerDetailsForm";
import PricingSidebar from "@/components/configure/PricingSidebar";
import { STORAGE_KEYS } from "@/lib/constants";
import { fetchSystemBySlug, fetchSelectedFeatures } from "@/services/systemService";
import { createPlatform, insertPlatformFeatures, deployToExternalApi } from "@/services/platformService";
import type { FeatureConfig, SystemPricing } from "@/types";

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
  const [globalStorage, setGlobalStorage] = useState(50);
  const [globalCapacity, setGlobalCapacity] = useState(100);
  const [deploying, setDeploying] = useState(false);

  const [ownerName, setOwnerName] = useState("");
  const [ownerEmail, setOwnerEmail] = useState("");
  const [ownerPhone, setOwnerPhone] = useState("");
  const [ownerPassword, setOwnerPassword] = useState("");

  useEffect(() => {
    const loadData = async () => {
      const slugs: string[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.SELECTED_FEATURES) || "[]");
      if (!slugs.length) return;

      const system = await fetchSystemBySlug(businessType);
      if (!system) return;

      setPricing({
        id: system.id,
        unit_storage_price: Number(system.unit_storage_price) || 0,
        unit_capacity_price: Number(system.unit_capacity_price) || 0,
        mobile_app_price: Number(system.mobile_app_price) || 0,
        creation_token_cost: Number(system.creation_token_cost) || 1,
        api_url: system.api_url || null,
      });

      const features = await fetchSelectedFeatures(system.id, slugs);
      setSelectedFeatures(features);
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

    if (!ownerName.trim() || !ownerEmail.trim() || !ownerPhone.trim() || !ownerPassword.trim()) {
      toast({ title: t("configure.fillAllFields"), variant: "destructive" });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(ownerEmail)) {
      toast({ title: t("configure.fillAllFields"), variant: "destructive" });
      return;
    }

    if (ownerPassword.length < 8) {
      toast({ title: t("configure.fillAllFields"), variant: "destructive" });
      return;
    }

    setDeploying(true);
    try {
      const { data: profile } = await supabase
        .from("profiles")
        .select("tokens")
        .eq("id", user.id)
        .single();

      const tokenCost = pricing.creation_token_cost;
      if (!profile || profile.tokens < tokenCost) {
        toast({ title: t("configure.noTokens"), variant: "destructive" });
        setDeploying(false);
        return;
      }

      const { data: platform, error: platErr } = await createPlatform({
        userId: user.id,
        systemId: pricing.id,
        subdomain: subdomain.trim(),
        mobileApp,
        storageGb: globalStorage,
        capacityUsers: globalCapacity,
        monthlyPrice: totalPrice,
      });

      if (platErr) throw platErr;

      if (selectedFeatures.length > 0 && platform) {
        await insertPlatformFeatures(platform.id, selectedFeatures);
      }

      // Note: token deduction should be done server-side via edge function
      // This is a temporary client-side implementation
      if (pricing.api_url && platform) {
        try {
          const { data: apiRes, error: apiErr } = await supabase.functions.invoke("create-platform", {
            body: {
              api_url: pricing.api_url,
              domain: subdomain.trim(),
              storage: globalStorage,
              capacity: globalCapacity,
              mobile_app: mobileApp,
              features: selectedFeatures.map((f) => f.slug),
              name: ownerName.trim(),
              email: ownerEmail.trim(),
              phone: ownerPhone.trim(),
              password: ownerPassword,
            },
          });

          if (apiErr) {
            console.error("External API error:", apiErr);
            toast({ title: t("configure.apiError"), variant: "destructive" });
            return;
          }

          if (apiRes && apiRes.success === false) {
            const errors = apiRes.errors as Record<string, string[]> | undefined;
            const errMessages = errors
              ? Object.values(errors).flat().join(", ")
              : (apiRes.message as string) || t("configure.apiError");
            toast({ title: errMessages, variant: "destructive" });
            return;
          }
        } catch (extErr) {
          console.error("External API call failed:", extErr);
          toast({ title: t("configure.apiError"), variant: "destructive" });
          return;
        }
      }

      toast({ title: t("configure.deploySuccess") });
      navigate("/dashboard");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      if (msg.includes("platforms_subdomain_key")) {
        toast({ title: t("configure.subdomainTaken"), variant: "destructive" });
      } else {
        toast({ title: msg || "Error", variant: "destructive" });
      }
    } finally {
      setDeploying(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
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

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-8 flex flex-col lg:flex-row gap-8">
        <div className="flex-1 space-y-8">
          <SelectedModules features={selectedFeatures} />

          <ResourceSliders
            globalStorage={globalStorage}
            globalCapacity={globalCapacity}
            unitStoragePrice={pricing?.unit_storage_price || 0}
            unitCapacityPrice={pricing?.unit_capacity_price || 0}
            onStorageChange={setGlobalStorage}
            onCapacityChange={setGlobalCapacity}
          />

          {/* Mobile App Toggle */}
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

          {/* Subdomain */}
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

          <OwnerDetailsForm
            ownerName={ownerName}
            ownerEmail={ownerEmail}
            ownerPhone={ownerPhone}
            ownerPassword={ownerPassword}
            onNameChange={setOwnerName}
            onEmailChange={setOwnerEmail}
            onPhoneChange={setOwnerPhone}
            onPasswordChange={setOwnerPassword}
          />
        </div>

        <PricingSidebar
          featuresCost={featuresCost}
          globalStorage={globalStorage}
          globalCapacity={globalCapacity}
          mobileApp={mobileApp}
          unitStoragePrice={pricing?.unit_storage_price || 0}
          unitCapacityPrice={pricing?.unit_capacity_price || 0}
          mobileAppPrice={pricing?.mobile_app_price || 0}
          totalPrice={totalPrice}
          subdomain={subdomain}
          tokenCost={pricing?.creation_token_cost || 1}
          deploying={deploying}
          onDeploy={handleDeploy}
        />
      </div>
    </div>
  );
};

export default Configure;
