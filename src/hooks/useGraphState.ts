import { useState, useCallback, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { STORAGE_KEYS, GRAPH_LAYOUT } from "@/lib/constants";
import type { GraphNode, GraphEdge, FeatureItem, AddModuleCall } from "@/types";

export function useGraphState(businessType: string) {
  const { i18n } = useTranslation();
  const isAr = i18n.language?.startsWith("ar");
  const graphStorageKey = `${STORAGE_KEYS.GRAPH_PREFIX}${businessType}`;

  const [nodes, setNodes] = useState<GraphNode[]>(() => {
    try {
      const saved = sessionStorage.getItem(graphStorageKey);
      if (saved) return JSON.parse(saved).nodes || [];
    } catch { /* ignore */ }
    return [];
  });

  const [edges, setEdges] = useState<GraphEdge[]>(() => {
    try {
      const saved = sessionStorage.getItem(graphStorageKey);
      if (saved) return JSON.parse(saved).edges || [];
    } catch { /* ignore */ }
    return [];
  });

  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const hasRestoredGraph = nodes.length > 0;
  const [defaultsLoaded, setDefaultsLoaded] = useState(hasRestoredGraph);

  // Persist graph to sessionStorage
  useEffect(() => {
    if (nodes.length > 0) {
      sessionStorage.setItem(graphStorageKey, JSON.stringify({ nodes, edges }));
    }
  }, [nodes, edges, graphStorageKey]);

  const loadDefaults = useCallback((features: FeatureItem[]) => {
    if (defaultsLoaded) return;

    const defaultFeatures = features.filter((f) => f.is_default);
    const { COLS, X_START, X_GAP, Y_START, Y_GAP } = GRAPH_LAYOUT;

    const defaultNodes: GraphNode[] = defaultFeatures.map((f, i) => ({
      id: f.slug,
      label: isAr && f.name_ar ? f.name_ar : f.name,
      category: f.category,
      x: X_START + (i % COLS) * X_GAP,
      y: Y_START + Math.floor(i / COLS) * Y_GAP,
      status: "active" as const,
    }));
    setNodes(defaultNodes);

    const defaultEdges: GraphEdge[] = [];
    for (let i = 0; i < defaultFeatures.length; i++) {
      const col = i % COLS;
      if (col < COLS - 1 && i + 1 < defaultFeatures.length) {
        defaultEdges.push({ from: defaultFeatures[i].slug, to: defaultFeatures[i + 1].slug });
      }
      if (i + COLS < defaultFeatures.length) {
        defaultEdges.push({ from: defaultFeatures[i].slug, to: defaultFeatures[i + COLS].slug });
      }
    }
    setEdges(defaultEdges);
    setDefaultsLoaded(true);
  }, [defaultsLoaded, isAr]);

  const addModule = useCallback((module: AddModuleCall) => {
    const { COLS, X_START, X_GAP, Y_START, Y_GAP } = GRAPH_LAYOUT;

    setNodes((prev) => {
      if (prev.find((n) => n.id === module.id)) return prev;
      const count = prev.length;
      return [...prev, {
        id: module.id,
        label: module.label,
        category: module.category,
        x: X_START + (count % COLS) * X_GAP,
        y: Y_START + Math.floor(count / COLS) * Y_GAP,
        status: "active" as const,
      }];
    });

    setNodes((currentNodes) => {
      const count = currentNodes.length;
      const col = count % COLS;
      setEdges((prev) => {
        const newEdges: GraphEdge[] = [];
        if (col > 0) {
          const leftNode = currentNodes[count - 1];
          if (leftNode) newEdges.push({ from: leftNode.id, to: module.id });
        }
        const topIdx = count - COLS;
        if (topIdx >= 0 && currentNodes[topIdx]) {
          newEdges.push({ from: currentNodes[topIdx].id, to: module.id });
        }
        const filtered = newEdges.filter((e) => !prev.some((pe) => pe.from === e.from && pe.to === e.to));
        return [...prev, ...filtered];
      });
      return currentNodes;
    });
  }, []);

  const activeModuleIds = nodes.map((n) => n.id);

  return {
    nodes,
    edges,
    selectedNodeId,
    setSelectedNodeId,
    activeModuleIds,
    loadDefaults,
    addModule,
  };
}
