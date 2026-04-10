import { useState, useCallback, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Package } from "lucide-react";
import ComposerHeader from "@/components/composer/ComposerHeader";
import LeftPanel from "@/components/composer/LeftPanel";
import CenterPanel from "@/components/composer/CenterPanel";
import RightPanel from "@/components/composer/RightPanel";
import ComposerSkeleton from "@/components/composer/ComposerSkeleton";
import { businessVerticals } from "@/lib/businessFeatures";
import { useIsMobile } from "@/hooks/use-mobile";
import { useSystemFeatures } from "@/hooks/useSystemFeatures";
import { useGraphState } from "@/hooks/useGraphState";
import { STORAGE_KEYS } from "@/lib/constants";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";

const Composer = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const businessType = searchParams.get("business") || "education";
  const vertical = businessVerticals[businessType];
  const isMobile = useIsMobile();

  const { data, isLoading } = useSystemFeatures(businessType);
  const features = data?.features ?? [];

  const {
    nodes, edges, selectedNodeId, setSelectedNodeId,
    activeModuleIds, loadDefaults, addModule,
  } = useGraphState(businessType);

  const [leftCollapsed, setLeftCollapsed] = useState(false);
  const [rightCollapsed, setRightCollapsed] = useState(false);
  const [mobileTab, setMobileTab] = useState<"chat" | "preview">("chat");
  const [featuresSheetOpen, setFeaturesSheetOpen] = useState(false);

  // Load defaults when features arrive
  useEffect(() => {
    if (features.length > 0) {
      loadDefaults(features);
    }
  }, [features, loadDefaults]);

  const handleComplete = useCallback(() => {
    const selectedSlugs = nodes.map((n) => n.id);
    localStorage.setItem(STORAGE_KEYS.SELECTED_FEATURES, JSON.stringify(selectedSlugs));
    localStorage.setItem(STORAGE_KEYS.BUSINESS_TYPE, businessType);
    navigate(`/configure?business=${businessType}`);
  }, [nodes, businessType, navigate]);

  // Show skeleton while loading
  if (isLoading) {
    return <ComposerSkeleton />;
  }

  // Mobile layout
  if (isMobile) {
    return (
      <div className="h-screen w-screen bg-background flex flex-col overflow-hidden">
        <ComposerHeader businessLabel={vertical?.label || "System"} onComplete={handleComplete} />

        <div className="flex border-b border-primary/10 bg-card shrink-0">
          <button
            onClick={() => setMobileTab("chat")}
            className={`flex-1 py-2.5 text-xs font-mono uppercase tracking-widest transition-colors ${
              mobileTab === "chat" ? "text-primary border-b-2 border-primary" : "text-muted-foreground"
            }`}
          >
            {t("composer.chatTab")}
          </button>
          <button
            onClick={() => setMobileTab("preview")}
            className={`flex-1 py-2.5 text-xs font-mono uppercase tracking-widest transition-colors ${
              mobileTab === "preview" ? "text-primary border-b-2 border-primary" : "text-muted-foreground"
            }`}
          >
            {t("composer.previewTab")}
          </button>
        </div>

        <div className="flex-1 overflow-hidden relative flex flex-col">
          <div className={mobileTab !== "chat" ? "hidden" : "h-full flex flex-col"}>
            <LeftPanel
              businessType={businessType}
              onAddModule={addModule}
              onComplete={handleComplete}
              collapsed={false}
              onToggle={() => {}}
              fullWidth
            />
          </div>
          <div className={mobileTab !== "preview" ? "hidden" : "h-full"}>
            <CenterPanel
              nodes={nodes}
              edges={edges}
              selectedNodeId={selectedNodeId}
              onSelectNode={setSelectedNodeId}
              features={features}
            />
          </div>

          <button
            onClick={() => setFeaturesSheetOpen(true)}
            className="absolute bottom-20 end-4 z-20 w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg hover:shadow-[0_0_20px_rgba(159,255,208,0.4)] transition-all"
          >
            <Package className="w-5 h-5" />
            {activeModuleIds.length > 0 && (
              <span className="absolute -top-1 -end-1 w-5 h-5 rounded-full bg-foreground text-background text-[10px] font-bold flex items-center justify-center">
                {activeModuleIds.length}
              </span>
            )}
          </button>
        </div>

        <Sheet open={featuresSheetOpen} onOpenChange={setFeaturesSheetOpen}>
          <SheetContent side="bottom" className="h-[70vh] bg-card border-t border-primary/10 p-0">
            <SheetHeader className="p-4 pe-12 border-b border-primary/8">
              <SheetTitle className="text-xs font-mono uppercase tracking-widest text-primary/70 flex items-center gap-2">
                <Package className="w-4 h-4" />
                {t("composer.featureCatalog")}
                <span className="text-muted-foreground ms-auto">{activeModuleIds.length}/{features.length}</span>
              </SheetTitle>
            </SheetHeader>
            <div className="overflow-y-auto p-4 flex-1" style={{ maxHeight: "calc(70vh - 60px)" }}>
              <RightPanel
                features={features}
                activeModuleIds={activeModuleIds}
                collapsed={false}
                onToggle={() => {}}
                embedded
              />
            </div>
          </SheetContent>
        </Sheet>
      </div>
    );
  }

  // Desktop layout
  return (
    <div className="h-screen w-screen bg-background flex flex-col overflow-hidden">
      <ComposerHeader businessLabel={vertical?.label || "System"} onComplete={handleComplete} />
      <div className="flex flex-1 overflow-hidden">
        <LeftPanel
          businessType={businessType}
          onAddModule={addModule}
          onComplete={handleComplete}
          collapsed={leftCollapsed}
          onToggle={() => setLeftCollapsed((p) => !p)}
        />
        <CenterPanel
          nodes={nodes}
          edges={edges}
          selectedNodeId={selectedNodeId}
          onSelectNode={setSelectedNodeId}
          features={features}
        />
        <RightPanel
          features={features}
          activeModuleIds={activeModuleIds}
          collapsed={rightCollapsed}
          onToggle={() => setRightCollapsed((p) => !p)}
        />
      </div>
    </div>
  );
};

export default Composer;
