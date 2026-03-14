import { useState, useCallback, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import ComposerHeader from "@/components/composer/ComposerHeader";
import LeftPanel from "@/components/composer/LeftPanel";
import CenterPanel, { type GraphNode, type GraphEdge } from "@/components/composer/CenterPanel";
import RightPanel, { type FeatureItem } from "@/components/composer/RightPanel";
import { businessVerticals } from "@/lib/businessFeatures";
import { supabase } from "@/integrations/supabase/client";
import type { AddModuleCall } from "@/lib/streamChat";

const Composer = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const businessType = searchParams.get("business") || "education";
  const vertical = businessVerticals[businessType];

  const [nodes, setNodes] = useState<GraphNode[]>([]);
  const [edges, setEdges] = useState<GraphEdge[]>([]);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [features, setFeatures] = useState<FeatureItem[]>([]);
  const [defaultsLoaded, setDefaultsLoaded] = useState(false);
  const [leftCollapsed, setLeftCollapsed] = useState(false);
  const [rightCollapsed, setRightCollapsed] = useState(false);

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
        .select("slug, name, description, name_ar, description_ar, category, is_default, storage, capacity, config, dependencies")
        .eq("system_id", system.id);

      if (data) {
        const mapped = data.map((f: any) => ({
          ...f,
          config: Array.isArray(f.config) ? f.config : [],
          dependencies: Array.isArray(f.dependencies) ? f.dependencies : [],
        }));
        setFeatures(mapped);

        if (!defaultsLoaded) {
          const defaultFeatures = mapped.filter((f: any) => f.is_default);
          const defaultNodes: GraphNode[] = defaultFeatures.map((f: any, i: number) => ({
            id: f.slug,
            label: f.name,
            category: f.category,
            x: 80 + (i % 3) * 220,
            y: 60 + Math.floor(i / 3) * 140,
            status: "active" as const,
          }));
          setNodes(defaultNodes);

          // Connect nodes only to horizontal and vertical neighbors in the grid
          const cols = 3;
          const defaultEdges: GraphEdge[] = [];
          for (let i = 0; i < defaultFeatures.length; i++) {
            const row = Math.floor(i / cols);
            const col = i % cols;
            // Right neighbor
            if (col < cols - 1 && i + 1 < defaultFeatures.length) {
              defaultEdges.push({ from: defaultFeatures[i].slug, to: defaultFeatures[i + 1].slug });
            }
            // Bottom neighbor
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
  }, [businessType, defaultsLoaded]);

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

    // Connect new module to its grid neighbors (right and bottom)
    setNodes((currentNodes) => {
      const count = currentNodes.length; // index of new node
      const cols = 3;
      const row = Math.floor(count / cols);
      const col = count % cols;
      setEdges((prev) => {
        const newEdges: GraphEdge[] = [];
        // Left neighbor
        if (col > 0) {
          const leftNode = currentNodes[count - 1];
          if (leftNode) newEdges.push({ from: leftNode.id, to: module.id });
        }
        // Top neighbor
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
