import { useTranslation } from "react-i18next";
import { Check } from "lucide-react";

export interface FeatureConfig {
  slug: string;
  name: string;
  name_ar: string | null;
  category: string;
  price: number;
}

interface Props {
  features: FeatureConfig[];
}

const SelectedModules = ({ features }: Props) => {
  const { t } = useTranslation();
  const categories = [...new Set(features.map((f) => f.category))];

  return (
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
              {features
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
  );
};

export default SelectedModules;
