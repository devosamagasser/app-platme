import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { X, HardDrive, Users, Smartphone, Globe, Check } from "lucide-react";

interface ConfigPanelProps {
  moduleNames: { id: string; label: string; category: string }[];
  onClose: () => void;
  onConfirm: (config: { storage: number; capacity: number; mobileApp: boolean; subdomain: string }) => void;
}

const PRICE_PER_GB = 2;
const PRICE_PER_USER = 0.5;
const MOBILE_APP_PRICE = 99;

const ConfigPanel = ({ moduleNames, onClose, onConfirm }: ConfigPanelProps) => {
  const [storage, setStorage] = useState(10);
  const [capacity, setCapacity] = useState(100);
  const [mobileApp, setMobileApp] = useState(false);
  const [subdomain, setSubdomain] = useState("");

  const totalPrice = useMemo(() => {
    return storage * PRICE_PER_GB + capacity * PRICE_PER_USER + (mobileApp ? MOBILE_APP_PRICE : 0);
  }, [storage, capacity, mobileApp]);

  const categories = [...new Set(moduleNames.map((m) => m.category))];

  return (
    <motion.div
      className="absolute inset-0 z-30 flex"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={onClose} />

      {/* Panel */}
      <motion.div
        className="relative ml-auto h-full w-full max-w-3xl bg-card border-l border-primary/10 overflow-y-auto"
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ duration: 0.4, ease: [0.2, 0.8, 0.2, 1] }}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 bg-card/95 backdrop-blur-sm border-b border-primary/8 px-6 py-4 flex items-center justify-between">
          <div>
            <div className="text-[10px] font-mono uppercase tracking-widest text-primary/50">Configuration</div>
            <h2 className="text-lg font-semibold text-foreground mt-0.5">Configure Your System</h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-md border border-primary/10 flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary/30 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 flex gap-6">
          {/* Main */}
          <div className="flex-1 space-y-6">
            {/* Modules */}
            <section>
              <h3 className="text-sm font-mono uppercase tracking-widest text-primary/70 mb-3">
                Selected Modules ({moduleNames.length})
              </h3>
              <div className="space-y-3">
                {categories.map((cat) => (
                  <div key={cat}>
                    <div className="text-[10px] font-mono uppercase text-muted-foreground tracking-widest mb-1.5">{cat}</div>
                    <div className="grid grid-cols-2 gap-1.5">
                      {moduleNames
                        .filter((m) => m.category === cat)
                        .map((m) => (
                          <div key={m.id} className="p-2.5 rounded-lg border border-primary/20 bg-primary/5 flex items-center gap-2">
                            <div className="w-4 h-4 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                              <Check className="w-2.5 h-2.5 text-primary" />
                            </div>
                            <span className="text-xs font-semibold text-foreground">{m.label}</span>
                          </div>
                        ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Storage */}
            <section className="p-5 rounded-xl border border-primary/10 bg-background/30 space-y-4">
              <div className="flex items-center gap-3">
                <HardDrive className="w-4 h-4 text-primary/70" />
                <span className="text-xs font-mono uppercase tracking-wider text-foreground">Storage</span>
                <span className="ml-auto text-sm font-semibold text-primary">{storage} GB</span>
              </div>
              <Slider value={[storage]} onValueChange={([v]) => setStorage(v)} min={5} max={500} step={5} />
              <div className="flex justify-between text-[10px] font-mono text-muted-foreground">
                <span>5 GB</span>
                <span>${(storage * PRICE_PER_GB).toFixed(0)}/mo</span>
                <span>500 GB</span>
              </div>
            </section>

            {/* Capacity */}
            <section className="p-5 rounded-xl border border-primary/10 bg-background/30 space-y-4">
              <div className="flex items-center gap-3">
                <Users className="w-4 h-4 text-primary/70" />
                <span className="text-xs font-mono uppercase tracking-wider text-foreground">Users Capacity</span>
                <span className="ml-auto text-sm font-semibold text-primary">{capacity} users</span>
              </div>
              <Slider value={[capacity]} onValueChange={([v]) => setCapacity(v)} min={10} max={10000} step={10} />
              <div className="flex justify-between text-[10px] font-mono text-muted-foreground">
                <span>10 users</span>
                <span>${(capacity * PRICE_PER_USER).toFixed(0)}/mo</span>
                <span>10,000 users</span>
              </div>
            </section>

            {/* Mobile */}
            <section className="p-5 rounded-xl border border-primary/10 bg-background/30">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Smartphone className="w-4 h-4 text-primary/70" />
                  <div>
                    <span className="text-xs font-mono uppercase tracking-wider text-foreground">Mobile Application</span>
                    <p className="text-[10px] text-muted-foreground mt-0.5">iOS & Android native app</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono text-primary/60">+${MOBILE_APP_PRICE}/mo</span>
                  <Switch checked={mobileApp} onCheckedChange={setMobileApp} />
                </div>
              </div>
            </section>

            {/* Subdomain */}
            <section className="p-5 rounded-xl border border-primary/10 bg-background/30">
              <div className="flex items-center gap-3 mb-3">
                <Globe className="w-4 h-4 text-primary/70" />
                <span className="text-xs font-mono uppercase tracking-wider text-foreground">Subdomain</span>
              </div>
              <div className="flex items-center rounded-lg border border-primary/15 bg-background/50 overflow-hidden">
                <Input
                  value={subdomain}
                  onChange={(e) => setSubdomain(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
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
          <div className="w-[220px] shrink-0">
            <div className="sticky top-24 p-5 rounded-xl border border-primary/15 bg-background/30 space-y-4">
              <div className="text-[10px] font-mono uppercase tracking-widest text-primary/50">Monthly Estimate</div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between text-muted-foreground">
                  <span>Storage ({storage} GB)</span>
                  <span>${(storage * PRICE_PER_GB).toFixed(0)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Capacity ({capacity})</span>
                  <span>${(capacity * PRICE_PER_USER).toFixed(0)}</span>
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

              <button
                onClick={() => onConfirm({ storage, capacity, mobileApp, subdomain })}
                className="w-full py-3 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity mint-glow"
              >
                Confirm & Deploy
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ConfigPanel;
