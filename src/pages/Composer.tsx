import { useState, useCallback } from "react";
import ComposerHeader from "@/components/composer/ComposerHeader";
import LeftPanel from "@/components/composer/LeftPanel";
import CenterPanel, { type GraphNode, type GraphEdge } from "@/components/composer/CenterPanel";
import RightPanel from "@/components/composer/RightPanel";

const initialNodes: GraphNode[] = [
  { id: "auth", label: "Authentication", category: "Security", x: 300, y: 60, status: "active" },
  { id: "roles", label: "User Roles", category: "Access Control", x: 120, y: 180, status: "active" },
  { id: "content", label: "Content Engine", category: "Core", x: 480, y: 180, status: "active" },
  { id: "storage", label: "Storage Layer", category: "Infrastructure", x: 300, y: 300, status: "active" },
  { id: "analytics", label: "Analytics Base", category: "Telemetry", x: 550, y: 350, status: "active" },
];

const initialEdges: GraphEdge[] = [
  { from: "auth", to: "roles" },
  { from: "auth", to: "content" },
  { from: "content", to: "storage" },
  { from: "content", to: "analytics" },
  { from: "roles", to: "storage" },
];

const Composer = () => {
  const [nodes, setNodes] = useState<GraphNode[]>(initialNodes);
  const [edges, setEdges] = useState<GraphEdge[]>(initialEdges);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  const handleUserMessage = useCallback((msg: string) => {
    const lower = msg.toLowerCase();
    if (lower.includes("subscription") || lower.includes("billing") || lower.includes("payment")) {
      // Add billing modules
      const newNodes: GraphNode[] = [
        { id: "billing", label: "Billing Engine", category: "Payments", x: 100, y: 420, status: "proposed" },
        { id: "recurring", label: "Recurring Logic", category: "Payments", x: 300, y: 480, status: "proposed" },
        { id: "access_update", label: "Access Control Update", category: "Access Control", x: 500, y: 450, status: "proposed" },
      ];
      const newEdges: GraphEdge[] = [
        { from: "auth", to: "billing" },
        { from: "billing", to: "recurring" },
        { from: "billing", to: "access_update" },
        { from: "access_update", to: "roles" },
      ];
      setNodes((prev) => {
        const ids = prev.map((n) => n.id);
        return [...prev, ...newNodes.filter((n) => !ids.includes(n.id))];
      });
      setEdges((prev) => [...prev, ...newEdges]);
    }
  }, []);

  const selectedNode = nodes.find((n) => n.id === selectedNodeId) || null;

  return (
    <div className="h-screen w-screen bg-background flex flex-col overflow-hidden">
      <ComposerHeader />
      <div className="flex flex-1 overflow-hidden">
        <LeftPanel onUserMessage={handleUserMessage} />
        <CenterPanel
          nodes={nodes}
          edges={edges}
          selectedNodeId={selectedNodeId}
          onSelectNode={setSelectedNodeId}
        />
        <RightPanel node={selectedNode} />
      </div>
    </div>
  );
};

export default Composer;
