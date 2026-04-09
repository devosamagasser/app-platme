import { useTranslation } from "react-i18next";

interface Props {
  featuresCost: number;
  globalStorage: number;
  globalCapacity: number;
  mobileApp: boolean;
  unitStoragePrice: number;
  unitCapacityPrice: number;
  mobileAppPrice: number;
  totalPrice: number;
  subdomain: string;
  tokenCost: number;
  deploying: boolean;
  onDeploy: () => void;
}

const PricingSidebar = ({
  featuresCost, globalStorage, globalCapacity, mobileApp,
  unitStoragePrice, unitCapacityPrice, mobileAppPrice,
  totalPrice, subdomain, tokenCost, deploying, onDeploy,
}: Props) => {
  const { t } = useTranslation();

  return (
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
            <span>${(globalStorage * unitStoragePrice).toFixed(0)}</span>
          </div>
          <div className="flex justify-between text-muted-foreground">
            <span>{t("configure.capacity")} ({globalCapacity} {t("configure.users")})</span>
            <span>${(globalCapacity * unitCapacityPrice).toFixed(0)}</span>
          </div>
          {mobileApp && (
            <div className="flex justify-between text-muted-foreground">
              <span>{t("configure.mobileApp")}</span>
              <span>${mobileAppPrice}</span>
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

        <div className="text-[10px] font-mono text-center text-muted-foreground">
          {t("configure.tokenCost")}: {tokenCost} {t("composer.tokens")}
        </div>

        <button
          onClick={onDeploy}
          disabled={deploying}
          className="w-full py-3 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {deploying ? "..." : t("configure.confirmDeploy")}
        </button>
      </div>
    </div>
  );
};

export default PricingSidebar;
