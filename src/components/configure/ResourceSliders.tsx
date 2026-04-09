import { useTranslation } from "react-i18next";
import { Slider } from "@/components/ui/slider";
import { HardDrive, Users } from "lucide-react";

interface Props {
  globalStorage: number;
  globalCapacity: number;
  unitStoragePrice: number;
  unitCapacityPrice: number;
  onStorageChange: (val: number) => void;
  onCapacityChange: (val: number) => void;
}

const ResourceSliders = ({
  globalStorage,
  globalCapacity,
  unitStoragePrice,
  unitCapacityPrice,
  onStorageChange,
  onCapacityChange,
}: Props) => {
  const { t } = useTranslation();

  return (
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
          onValueChange={([v]) => onStorageChange(v)}
          min={50}
          max={500}
          step={5}
        />
        <div className="flex justify-between text-[10px] font-mono text-muted-foreground">
          <span>50 GB</span>
          <span>${(globalStorage * unitStoragePrice).toFixed(0)}/mo</span>
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
          onValueChange={([v]) => onCapacityChange(v)}
          min={10}
          max={10000}
          step={10}
        />
        <div className="flex justify-between text-[10px] font-mono text-muted-foreground">
          <span>10 {t("configure.users")}</span>
          <span>${(globalCapacity * unitCapacityPrice).toFixed(0)}/mo</span>
          <span>10,000 {t("configure.users")}</span>
        </div>
      </div>
    </section>
  );
};

export default ResourceSliders;
