import { useState, useCallback, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Package } from "lucide-react";
import ComposerHeader from "@/components/composer/ComposerHeader";
import LeftPanel from "@/components/composer/LeftPanel";
import CenterPanel, { type GraphNode, type GraphEdge } from "@/components/composer/CenterPanel";
import RightPanel, { type FeatureItem } from "@/components/composer/RightPanel";
import { businessVerticals } from "@/lib/businessFeatures";
import { supabase } from "@/integrations/supabase/client";
import { useIsMobile } from "@/hooks/use-mobile";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import type { AddModuleCall } from "@/lib/streamChat";

const Composer = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const isAr = i18n.language?.startsWith("ar");
  const businessType = searchParams.get("business") || "education";
  const vertical = businessVerticals[businessType];
  const isMobile = useIsMobile();

  const graphStorageKey = `platme_graph_${businessType}`;
  const [nodes, setNodes] = useState<GraphNode[]>(() => {
    try {
      const saved = sessionStorage.getItem(graphStorageKey);
      if (saved) { const parsed = JSON.parse(saved); return parsed.nodes || []; }
    } catch { /* ignore parse errors */ }
    return [];
  });
  const [edges, setEdges] = useState<GraphEdge[]>(() => {
    try {
      const saved = sessionStorage.getItem(graphStorageKey);
      if (saved) { const parsed = JSON.parse(saved); return parsed.edges || []; }
    } catch { /* ignore parse errors */ }
    return [];
  });
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [features, setFeatures] = useState<FeatureItem[]>([]);
  const hasRestoredGraph = nodes.length > 0;
  const [defaultsLoaded, setDefaultsLoaded] = useState(hasRestoredGraph);
  const [leftCollapsed, setLeftCollapsed] = useState(false);
  const [rightCollapsed, setRightCollapsed] = useState(false);
  const [mobileTab, setMobileTab] = useState<"chat" | "preview">("chat");
  const [featuresSheetOpen, setFeaturesSheetOpen] = useState(false);

  useEffect(() => {
    const fetchFeatures = async () => {
      const { data: system } = await supabase
        .from("systems")
        .select("id")
        .eq("slug", businessType)
        .single();

      if (!system) return;

      const { data } = await supabase
        .from("system_features")
        .select("slug, name, description, name_ar, description_ar, category, is_default, price, active")
        .eq("system_id", system.id);

      if (data) {
        interface SystemFeatureRow {
          slug: string;
          name: string;
          description: string;
          name_ar: string | null;
          description_ar: string | null;
          category: string;
          is_default: boolean | null;
          price: number | null;
          active: boolean | null;
        }
        const mapped = (data as SystemFeatureRow[]).map((f) => ({
          ...f,
          price: f.price ?? 0,
          active: f.active ?? true,
        }));
        setFeatures(mapped);

        if (!defaultsLoaded) {
          const defaultFeatures = mapped.filter((f) => f.is_default);
          const defaultNodes: GraphNode[] = defaultFeatures.map((f, i: number) => ({
            id: f.slug,
            label: isAr && f.name_ar ? f.name_ar : f.name,
            category: f.category,
            x: 80 + (i % 3) * 220,
            y: 60 + Math.floor(i / 3) * 140,
            status: "active" as const,
          }));
          setNodes(defaultNodes);

          const cols = 3;
          const defaultEdges: GraphEdge[] = [];
          for (let i = 0; i < defaultFeatures.length; i++) {
            const col = i % cols;
            if (col < cols - 1 && i + 1 < defaultFeatures.length) {
              defaultEdges.push({ from: defaultFeatures[i].slug, to: defaultFeatures[i + 1].slug });
            }
            if (i + cols < defaultFeatures.length) {
              defaultEdges.push({ from: defaultFeatures[i].slug, to: defaultFeatures[i + cols].slug });
            }
          }
          setEdges(defaultEdges);
          setDefaultsLoaded(true);
        }
      }
    };
    fetchFeatures();
  }, [businessType, defaultsLoaded, isAr]);

  // Sync graph state to sessionStorage
  useEffect(() => {
    if (nodes.length > 0) {
      sessionStorage.setItem(graphStorageKey, JSON.stringify({ nodes, edges }));
    }
  }, [nodes, edges, graphStorageKey]);

  const handleAddModule = useCallback((module: AddModuleCall) => {
    setNodes((prev) => {
      if (prev.find((n) => n.id === module.id)) return prev;
      const count = prev.length;
      return [...prev, {
        id: module.id,
        label: module.label,
        category: module.category,
        x: 80 + (count % 3) * 220,
        y: 60 + Math.floor(count / 3) * 140,
        status: "active" as const,
      }];
    });

    setNodes((currentNodes) => {
      const count = currentNodes.length;
      const cols = 3;
      const col = count % cols;
      setEdges((prev) => {
        const newEdges: GraphEdge[] = [];
        if (col > 0) {
          const leftNode = currentNodes[count - 1];
          if (leftNode) newEdges.push({ from: leftNode.id, to: module.id });
        }
        const topIdx = count - cols;
        if (topIdx >= 0 && currentNodes[topIdx]) {
          newEdges.push({ from: currentNodes[topIdx].id, to: module.id });
        }
        const filtered = newEdges.filter((e) => !prev.some((pe) => pe.from === e.from && pe.to === e.to));
        return [...prev, ...filtered];
      });
      return currentNodes;
    });
  }, []);

  const handleComplete = useCallback(() => {
    const selectedSlugs = nodes.map((n) => n.id);
    localStorage.setItem("platme_selected_features", JSON.stringify(selectedSlugs));
    localStorage.setItem("platme_business_type", businessType);
    navigate(`/configure?business=${businessType}`);
  }, [nodes, businessType, navigate]);

  const activeModuleIds = nodes.map((n) => n.id);

  // Mobile layout
  if (isMobile) {
    return (
      <div className="h-screen w-screen bg-background flex flex-col overflow-hidden">
        <ComposerHeader businessLabel={vertical?.label || "System"} onComplete={handleComplete} />

        {/* Mobile tabs */}
        <div className="flex border-b border-primary/10 bg-card shrink-0">
          <button
            onClick={() => setMobileTab("chat")}
            className={`flex-1 py-2.5 text-xs font-mono uppercase tracking-widest transition-colors ${
              mobileTab === "chat"
                ? "text-primary border-b-2 border-primary"
                : "text-muted-foreground"
            }`}
          >
            {t("composer.chatTab")}
          </button>
          <button
            onClick={() => setMobileTab("preview")}
            className={`flex-1 py-2.5 text-xs font-mono uppercase tracking-widest transition-colors ${
              mobileTab === "preview"
                ? "text-primary border-b-2 border-primary"
                : "text-muted-foreground"
            }`}
          >
            {t("composer.previewTab")}
          </button>
        </div>

        {/* Tab content */}
        <div className="flex-1 overflow-hidden relative flex flex-col">
          <div className={mobileTab !== "chat" ? "hidden" : "h-full flex flex-col"}>
            <LeftPanel
              businessType={businessType}
              onAddModule={handleAddModule}
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

          {/* FAB */}
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

        {/* Features Sheet */}
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
          onAddModule={handleAddModule}
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
