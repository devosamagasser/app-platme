import { useState, useEffect, useMemo } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Check, Smartphone, HardDrive, Users, Globe, ArrowLeft } from "lucide-react";

interface FeatureConfig {
  slug: string;
  name: string;
  name_ar: string | null;
  category: string;
  storage: number; // GB
  capacity: number; // users
}

const PRICE_PER_GB = 2; // $/month per GB
const PRICE_PER_USER = 0.5; // $/month per user
const MOBILE_APP_PRICE = 99; // $/month

const Configure = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const businessType = searchParams.get("business") || "education";

  const [selectedFeatures, setSelectedFeatures] = useState<FeatureConfig[]>([]);
  const [mobileApp, setMobileApp] = useState(false);
  const [subdomain, setSubdomain] = useState("");
  const [globalStorage, setGlobalStorage] = useState(10);
  const [globalCapacity, setGlobalCapacity] = useState(100);

  useEffect(() => {
    const loadFeatures = async () => {
      const slugs = JSON.parse(localStorage.getItem("platme_selected_features") || "[]");
      if (!slugs.length) return;

      const { data: system } = await supabase
        .from("systems")
        .select("id, name")
        .eq("slug", businessType)
        .single();

      if (!system) return;

      const { data } = await supabase
        .from("system_features")
        .select("slug, name, name_ar, category")
        .eq("system_id", system.id)
        .in("slug", slugs);

      if (data) {
        setSelectedFeatures(
          data.map((f: any) => ({
            slug: f.slug,
            name: f.name,
            name_ar: f.name_ar,
            category: f.category,
            storage: 5,
            capacity: 50,
          }))
        );
      }
    };
    loadFeatures();
  }, [businessType]);

  const totalPrice = useMemo(() => {
    const storageCost = globalStorage * PRICE_PER_GB;
    const capacityCost = globalCapacity * PRICE_PER_USER;
    const mobileCost = mobileApp ? MOBILE_APP_PRICE : 0;
    return storageCost + capacityCost + mobileCost;
  }, [globalStorage, globalCapacity, mobileApp]);

  const categories = [...new Set(selectedFeatures.map((f) => f.category))];

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <div className="border-b border-primary/8 bg-card">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(`/composer?business=${businessType}`)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-mono text-muted-foreground hover:text-foreground hover:bg-primary/5 border border-primary/10 transition-all"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Back to Composer
            </button>
            <div>
              <div className="text-[10px] font-mono uppercase tracking-widest text-primary/50">
                Configuration
              </div>
              <h1 className="text-lg font-semibold text-foreground mt-0.5">
                Configure Your System
              </h1>
            </div>
          </div>
          <div className="text-right">
            <div className="text-[10px] font-mono uppercase tracking-widest text-primary/50">
              {selectedFeatures.length} modules selected
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8 flex gap-8">
        {/* Main Content */}
        <div className="flex-1 space-y-8">
          {/* Selected Features */}
          <section>
            <h2 className="text-sm font-mono uppercase tracking-widest text-primary/70 mb-4">
              Selected Modules
            </h2>
            <div className="space-y-4">
              {categories.map((cat) => (
                <div key={cat}>
                  <div className="text-[10px] font-mono uppercase text-muted-foreground tracking-widest mb-2">
                    {cat}
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {selectedFeatures
                      .filter((f) => f.category === cat)
                      .map((f) => (
                        <div
                          key={f.slug}
                          className="p-3 rounded-lg border border-primary/20 bg-primary/5 flex items-center gap-2"
                        >
                          <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                            <Check className="w-3 h-3 text-primary" />
                          </div>
                          <div>
                            <span className="text-xs font-semibold text-foreground">{f.name}</span>
                            {f.name_ar && (
                              <span className="text-[10px] text-muted-foreground ml-1.5">
                                ({f.name_ar})
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Storage & Capacity */}
          <section className="space-y-6">
            <h2 className="text-sm font-mono uppercase tracking-widest text-primary/70">
              Resources
            </h2>

            <div className="p-5 rounded-xl border border-primary/10 bg-card space-y-4">
              <div className="flex items-center gap-3 mb-2">
                <HardDrive className="w-4 h-4 text-primary/70" />
                <span className="text-xs font-mono uppercase tracking-wider text-foreground">
                  Storage
                </span>
                <span className="ml-auto text-sm font-semibold text-primary">
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
                <span>${(globalStorage * PRICE_PER_GB).toFixed(0)}/mo</span>
                <span>500 GB</span>
              </div>
            </div>

            <div className="p-5 rounded-xl border border-primary/10 bg-card space-y-4">
              <div className="flex items-center gap-3 mb-2">
                <Users className="w-4 h-4 text-primary/70" />
                <span className="text-xs font-mono uppercase tracking-wider text-foreground">
                  Users Capacity
                </span>
                <span className="ml-auto text-sm font-semibold text-primary">
                  {globalCapacity} users
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
                <span>10 users</span>
                <span>${(globalCapacity * PRICE_PER_USER).toFixed(0)}/mo</span>
                <span>10,000 users</span>
              </div>
            </div>
          </section>

          {/* Mobile App */}
          <section className="p-5 rounded-xl border border-primary/10 bg-card">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Smartphone className="w-4 h-4 text-primary/70" />
                <div>
                  <span className="text-xs font-mono uppercase tracking-wider text-foreground">
                    Mobile Application
                  </span>
                  <p className="text-[10px] text-muted-foreground mt-0.5">
                    iOS & Android native app for your platform
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono text-primary/60">
                  +${MOBILE_APP_PRICE}/mo
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
                Subdomain
              </span>
            </div>
            <div className="flex items-center gap-0 rounded-lg border border-primary/15 bg-background/50 overflow-hidden">
              <Input
                value={subdomain}
                onChange={(e) =>
                  setSubdomain(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))
                }
                placeholder="my-school"
                className="border-0 rounded-none focus-visible:ring-0 text-sm"
              />
              <span className="px-3 text-xs font-mono text-muted-foreground bg-secondary/30 h-10 flex items-center whitespace-nowrap">
                .platme.com
              </span>
            </div>
          </section>
        </div>

        {/* Pricing Sidebar */}
        <div className="w-[280px] shrink-0">
          <div className="sticky top-8 p-5 rounded-xl border border-primary/15 bg-card space-y-4">
            <div className="text-[10px] font-mono uppercase tracking-widest text-primary/50">
              Monthly Estimate
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-muted-foreground">
                <span>Storage ({globalStorage} GB)</span>
                <span>${(globalStorage * PRICE_PER_GB).toFixed(0)}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Capacity ({globalCapacity} users)</span>
                <span>${(globalCapacity * PRICE_PER_USER).toFixed(0)}</span>
              </div>
              {mobileApp && (
                <div className="flex justify-between text-muted-foreground">
                  <span>Mobile App</span>
                  <span>${MOBILE_APP_PRICE}</span>
                </div>
              )}
            </div>

            <div className="border-t border-primary/10 pt-3">
              <div className="flex justify-between items-baseline">
                <span className="text-xs font-mono uppercase text-muted-foreground">Total</span>
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

            <button className="w-full py-3 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity">
              Confirm & Deploy
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Configure;
