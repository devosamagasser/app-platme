import { useState, useCallback, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import ComposerHeader from "@/components/composer/ComposerHeader";
import LeftPanel from "@/components/composer/LeftPanel";
import CenterPanel, { type GraphNode, type GraphEdge } from "@/components/composer/CenterPanel";
import RightPanel, { type FeatureItem } from "@/components/composer/RightPanel";
import { businessVerticals } from "@/lib/businessFeatures";
import { supabase } from "@/integrations/supabase/client";
import type { AddModuleCall } from "@/lib/streamChat";

const Composer = () => {
  const [searchParams] = useSearchParams();
  const businessType = searchParams.get("business") || "education";
  const vertical = businessVerticals[businessType];

  const [nodes, setNodes] = useState<GraphNode[]>([]);
  const [edges, setEdges] = useState<GraphEdge[]>([]);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [features, setFeatures] = useState<FeatureItem[]>([]);

  // Fetch features from DB
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
        .select("slug, name, description, name_ar, description_ar, category, is_default, storage, capacity, config")
        .eq("system_id", system.id);

      if (data) {
        setFeatures(
          data.map((f: any) => ({
            ...f,
            config: Array.isArray(f.config) ? f.config : [],
          }))
        );
      }
    };
    fetchFeatures();
  }, [businessType]);

  const handleAddModule = useCallback((module: AddModuleCall) => {
    setNodes((prev) => {
      if (prev.find((n) => n.id === module.id)) return prev;
      const count = prev.length;
      const col = count % 3;
      const row = Math.floor(count / 3);
      const newNode: GraphNode = {
        id: module.id,
        label: module.label,
        category: module.category,
        x: 80 + col * 220,
        y: 60 + row * 140,
        status: "active",
      };
      return [...prev, newNode];
    });

    setEdges((prev) => {
      const newEdges: GraphEdge[] = module.dependencies
        .map((dep) => ({ from: dep, to: module.id }))
        .filter((e) => !prev.some((pe) => pe.from === e.from && pe.to === e.to));
      return [...prev, ...newEdges];
    });
  }, []);

  const activeModuleIds = nodes.map((n) => n.id);
  const suggestions = vertical?.suggestions || [];

  return (
    <div className="h-screen w-screen bg-background flex flex-col overflow-hidden">
      <ComposerHeader businessLabel={vertical?.label || "System"} />
      <div className="flex flex-1 overflow-hidden">
        <LeftPanel
          businessType={businessType}
          suggestions={suggestions}
          onAddModule={handleAddModule}
        />
        <CenterPanel
          nodes={nodes}
          edges={edges}
          selectedNodeId={selectedNodeId}
          onSelectNode={setSelectedNodeId}
        />
        <RightPanel features={features} activeModuleIds={activeModuleIds} />
      </div>
    </div>
  );
};

export default Composer;
