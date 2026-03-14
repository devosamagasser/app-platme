import { Check, Package, PanelRightClose, PanelRightOpen } from "lucide-react";
import { useTranslation } from "react-i18next";

export interface FeatureItem {
  slug: string;
  name: string;
  description: string;
  name_ar: string | null;
  description_ar: string | null;
  category: string;
  is_default: boolean;
  storage: string | null;
  capacity: string | null;
  config: string[];
}

interface RightPanelProps {
  features: FeatureItem[];
  activeModuleIds: string[];
  collapsed: boolean;
  onToggle: () => void;
}

const RightPanel = ({ features, activeModuleIds, collapsed, onToggle }: RightPanelProps) => {
  const { t } = useTranslation();
  const categories = [...new Set(features.map((f) => f.category))];

  if (collapsed) {
    return (
      <div className="w-12 border-s border-primary/8 bg-card flex flex-col items-center py-3 shrink-0">
        <button onClick={onToggle} className="p-2 rounded-md hover:bg-primary/10 text-primary/60 hover:text-primary transition-colors">
          <PanelRightOpen className="w-4 h-4" />
        </button>
        <Package className="w-4 h-4 text-primary/40 mt-3" />
      </div>
    );
  }

  return (
    <div className="w-[320px] border-s border-primary/8 bg-card flex flex-col shrink-0">
      <div className="p-4 border-b border-primary/8 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Package className="w-4 h-4 text-primary/70" />
          <span className="text-xs font-mono uppercase tracking-widest text-primary/70">
            {t("composer.featureCatalog")}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <p className="text-[10px] text-muted-foreground">
            {activeModuleIds.length}/{features.length}
          </p>
          <button onClick={onToggle} className="p-1.5 rounded-md hover:bg-primary/10 text-primary/40 hover:text-primary transition-colors">
            <PanelRightClose className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-5">
        {categories.map((cat) => (
          <div key={cat}>
            <div className="text-[10px] font-mono uppercase text-muted-foreground tracking-widest mb-2">
              {cat}
            </div>
            <div className="space-y-2">
              {features
                .filter((f) => f.category === cat)
                .map((f) => {
                  const isActive = activeModuleIds.includes(f.slug);
                  return (
                    <div
                      key={f.slug}
                      className={`p-3 rounded-lg border transition-colors ${
                        isActive
                          ? "border-primary/30 bg-primary/5"
                          : "border-primary/8 bg-secondary/20"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <div>
                          <span className="text-xs font-semibold text-foreground">{f.name}</span>
                          {f.name_ar && (
                            <span className="text-[10px] text-muted-foreground ms-1.5">({f.name_ar})</span>
                          )}
                        </div>
                        <div className="flex items-center gap-1.5">
                          {f.is_default && (
                            <span className="text-[8px] font-mono uppercase text-primary/50 bg-primary/10 px-1.5 py-0.5 rounded">
                              {t("composer.default")}
                            </span>
                          )}
                          {isActive && (
                            <div className="w-4 h-4 rounded-full bg-primary/20 flex items-center justify-center">
                              <Check className="w-2.5 h-2.5 text-primary" />
                            </div>
                          )}
                        </div>
                      </div>
                      <p className="text-[10px] text-muted-foreground leading-relaxed">
                        {f.description}
                      </p>
                    </div>
                  );
                })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RightPanel;
