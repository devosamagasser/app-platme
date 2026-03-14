import { useState, useRef, useCallback, useEffect } from "react";
import { motion } from "framer-motion";

export interface GraphNode {
  id: string;
  label: string;
  category: string;
  x: number;
  y: number;
  status: "active" | "proposed";
}

export interface GraphEdge {
  from: string;
  to: string;
}

const CenterPanel = ({
  nodes,
  edges,
  selectedNodeId,
  onSelectNode,
  deploying = false,
}: {
  nodes: GraphNode[];
  edges: GraphEdge[];
  selectedNodeId: string | null;
  onSelectNode: (id: string) => void;
  deploying?: boolean;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [isPanning, setIsPanning] = useState(false);
  const panStart = useRef({ x: 0, y: 0, panX: 0, panY: 0 });

  // Calculate center point for deploy animation
  const centerX = nodes.length > 0
    ? nodes.reduce((sum, n) => sum + n.x + 90, 0) / nodes.length - 90
    : 300;
  const centerY = nodes.length > 0
    ? nodes.reduce((sum, n) => sum + n.y + 30, 0) / nodes.length - 30
    : 200;

  const getNode = (id: string) => nodes.find((n) => n.id === id);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest("[data-node]")) return;
    e.preventDefault();
    setIsPanning(true);
    panStart.current = { x: e.clientX, y: e.clientY, panX: pan.x, panY: pan.y };
  }, [pan]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isPanning) return;
    const dx = e.clientX - panStart.current.x;
    const dy = e.clientY - panStart.current.y;
    setPan({ x: panStart.current.panX + dx, y: panStart.current.panY + dy });
  }, [isPanning]);

  const handleMouseUp = useCallback(() => {
    setIsPanning(false);
  }, []);

  // Also stop panning if mouse leaves
  useEffect(() => {
    const handleGlobalUp = () => setIsPanning(false);
    window.addEventListener("mouseup", handleGlobalUp);
    return () => window.removeEventListener("mouseup", handleGlobalUp);
  }, []);

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.08 : 0.08;
    setZoom((z) => Math.min(2, Math.max(0.3, z + delta)));
  }, []);

  return (
    <div
      ref={containerRef}
      className={`flex-1 relative bg-grid overflow-hidden ${isPanning ? "cursor-grabbing" : "cursor-grab"}`}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onWheel={handleWheel}
    >
      {/* Watermark */}
      <div className="absolute top-4 left-4 text-[10px] font-mono text-muted-foreground/30 uppercase tracking-widest pointer-events-none z-10">
        Architecture Canvas
      </div>

      {/* Zoom controls */}
      <div className="absolute bottom-4 right-4 flex items-center gap-1 z-10">
        <button onClick={() => setZoom((z) => Math.max(0.3, z - 0.15))} className="w-7 h-7 rounded-md bg-card border border-primary/10 text-muted-foreground hover:text-foreground hover:border-primary/30 transition-colors flex items-center justify-center text-sm font-mono">−</button>
        <span className="text-[10px] font-mono text-muted-foreground/50 w-10 text-center">{Math.round(zoom * 100)}%</span>
        <button onClick={() => setZoom((z) => Math.min(2, z + 0.15))} className="w-7 h-7 rounded-md bg-card border border-primary/10 text-muted-foreground hover:text-foreground hover:border-primary/30 transition-colors flex items-center justify-center text-sm font-mono">+</button>
      </div>

      {/* Pan hint */}
      {nodes.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <span className="text-xs font-mono text-muted-foreground/30">Loading modules…</span>
        </div>
      )}

      <div style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`, transformOrigin: "0 0" }} className="absolute inset-0">
        <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ overflow: "visible" }}>
          {edges.map((edge, i) => {
            const from = getNode(edge.from);
            const to = getNode(edge.to);
            if (!from || !to) return null;
            const isProposed = from.status === "proposed" || to.status === "proposed";
            return (
              <line
                key={i}
                x1={from.x + 90}
                y1={from.y + 30}
                x2={to.x + 90}
                y2={to.y + 30}
                stroke="#9FFFD0"
                strokeWidth="1.5"
                opacity={isProposed ? 0.3 : 0.5}
                strokeDasharray={isProposed ? "6 4" : "none"}
                style={
                  isProposed
                    ? {}
                    : {
                        strokeDasharray: "4",
                        animation: "flow 20s linear infinite",
                      }
                }
              />
            );
          })}
        </svg>

        {nodes.map((node) => (
          <motion.div
            key={node.id}
            data-node
            className={`absolute min-w-[180px] rounded-lg p-4 cursor-pointer transition-all border ${
              node.status === "proposed"
                ? "border-dashed border-primary/30 bg-forest/50"
                : selectedNodeId === node.id
                ? "border-primary bg-forest mint-glow scale-[1.02]"
                : "border-primary/20 bg-forest shadow-xl hover:border-primary/40"
            }`}
            style={{ left: node.x, top: node.y }}
            onClick={(e) => {
              e.stopPropagation();
              onSelectNode(node.id);
            }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, ease: [0.2, 0.8, 0.2, 1] }}
          >
            <div className="text-[10px] font-mono uppercase text-primary/60 tracking-wider">
              {node.category}
            </div>
            <div className="text-sm text-foreground font-medium mt-1">
              {node.label}
            </div>
            {node.status === "proposed" && (
              <div className="text-[9px] font-mono text-primary/40 mt-2 uppercase">
                Proposed
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default CenterPanel;
