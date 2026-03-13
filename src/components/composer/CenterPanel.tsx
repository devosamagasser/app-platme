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
}: {
  nodes: GraphNode[];
  edges: GraphEdge[];
  selectedNodeId: string | null;
  onSelectNode: (id: string) => void;
}) => {
  const getNode = (id: string) => nodes.find((n) => n.id === id);

  return (
    <div className="flex-1 relative bg-grid overflow-hidden">
      {/* Watermark */}
      <div className="absolute top-4 left-4 text-[10px] font-mono text-muted-foreground/30 uppercase tracking-widest">
        Architecture Canvas
      </div>

      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        {edges.map((edge, i) => {
          const from = getNode(edge.from);
          const to = getNode(edge.to);
          if (!from || !to) return null;
          const isProposed =
            from.status === "proposed" || to.status === "proposed";
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
          className={`absolute min-w-[180px] rounded-lg p-4 cursor-pointer transition-all border ${
            node.status === "proposed"
              ? "border-dashed border-primary/30 bg-forest/50"
              : selectedNodeId === node.id
              ? "border-primary bg-forest mint-glow scale-[1.02]"
              : "border-primary/20 bg-forest shadow-xl hover:border-primary/40"
          }`}
          style={{ left: node.x, top: node.y }}
          onClick={() => onSelectNode(node.id)}
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
  );
};

export default CenterPanel;
