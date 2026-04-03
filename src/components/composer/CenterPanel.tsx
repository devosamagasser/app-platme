import { useState, useRef, useCallback, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { ZoomIn, ZoomOut, Maximize2, BookOpen, MessageSquare, Users, Shield, CreditCard, BarChart3, Globe, Settings } from "lucide-react";

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

// Unified color — all categories use primary (mint)
const UNIFIED_STYLE = { border: "border-primary/40", bg: "bg-primary/5", text: "text-primary", bar: "bg-primary" };

const DEFAULT_COLOR = UNIFIED_STYLE;

const CATEGORY_ICONS: Record<string, React.ElementType> = {
  LMS: BookOpen,
  Content: Globe,
  Communication: MessageSquare,
  Users: Users,
  Commerce: CreditCard,
  Analytics: BarChart3,
  Core: Settings,
};

function getCategoryStyle(category: string) {
  const key = Object.keys(CATEGORY_COLORS).find((k) => category.toLowerCase().includes(k.toLowerCase()));
  return key ? CATEGORY_COLORS[key] : DEFAULT_COLOR;
}

function getCategoryIcon(category: string) {
  const key = Object.keys(CATEGORY_ICONS).find((k) => category.toLowerCase().includes(k.toLowerCase()));
  return key ? CATEGORY_ICONS[key] : Shield;
}



const CenterPanel = ({
  nodes,
  edges,
  selectedNodeId,
  onSelectNode,
  onFitToView,
}: {
  nodes: GraphNode[];
  edges: GraphEdge[];
  selectedNodeId: string | null;
  onSelectNode: (id: string) => void;
  onFitToView?: () => void;
}) => {
  const { t } = useTranslation();
  const containerRef = useRef<HTMLDivElement>(null);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [isPanning, setIsPanning] = useState(false);
  const [containerSize, setContainerSize] = useState({ w: 800, h: 600 });
  const panStart = useRef({ x: 0, y: 0, panX: 0, panY: 0 });
  const pinchStart = useRef({ dist: 0, zoom: 1 });

  // Track container size
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect;
      setContainerSize({ w: width, h: height });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const getNode = (id: string) => nodes.find((n) => n.id === id);

  const handleFitToView = useCallback(() => {
    if (nodes.length === 0) return;
    const el = containerRef.current;
    if (!el) return;
    const minX = Math.min(...nodes.map((n) => n.x));
    const maxX = Math.max(...nodes.map((n) => n.x + 180));
    const minY = Math.min(...nodes.map((n) => n.y));
    const maxY = Math.max(...nodes.map((n) => n.y + 60));
    const graphW = maxX - minX + 80;
    const graphH = maxY - minY + 80;
    const scaleX = containerSize.w / graphW;
    const scaleY = containerSize.h / graphH;
    const newZoom = Math.min(Math.max(Math.min(scaleX, scaleY) * 0.85, 0.3), 2);
    const centerX = (minX + maxX) / 2;
    const centerY = (minY + maxY) / 2;
    setPan({
      x: containerSize.w / 2 - centerX * newZoom,
      y: containerSize.h / 2 - centerY * newZoom,
    });
    setZoom(newZoom);
  }, [nodes, containerSize]);

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

  const handleMouseUp = useCallback(() => setIsPanning(false), []);

  useEffect(() => {
    const handleGlobalUp = () => setIsPanning(false);
    window.addEventListener("mouseup", handleGlobalUp);
    window.addEventListener("touchend", handleGlobalUp);
    return () => {
      window.removeEventListener("mouseup", handleGlobalUp);
      window.removeEventListener("touchend", handleGlobalUp);
    };
  }, []);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if ((e.target as HTMLElement).closest("[data-node]")) return;
    if (e.touches.length === 1) {
      setIsPanning(true);
      const touch = e.touches[0];
      panStart.current = { x: touch.clientX, y: touch.clientY, panX: pan.x, panY: pan.y };
    } else if (e.touches.length === 2) {
      const dist = Math.hypot(e.touches[0].clientX - e.touches[1].clientX, e.touches[0].clientY - e.touches[1].clientY);
      pinchStart.current = { dist, zoom };
    }
  }, [pan, zoom]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 1 && isPanning) {
      const touch = e.touches[0];
      setPan({ x: panStart.current.panX + touch.clientX - panStart.current.x, y: panStart.current.panY + touch.clientY - panStart.current.y });
    } else if (e.touches.length === 2) {
      e.preventDefault();
      const dist = Math.hypot(e.touches[0].clientX - e.touches[1].clientX, e.touches[0].clientY - e.touches[1].clientY);
      setZoom(Math.min(2, Math.max(0.3, pinchStart.current.zoom * (dist / pinchStart.current.dist))));
    }
  }, [isPanning]);

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    setZoom((z) => Math.min(2, Math.max(0.3, z + (e.deltaY > 0 ? -0.08 : 0.08))));
  }, []);

  // Build bezier paths for edges
  const edgePaths = useMemo(() => {
    return edges.map((edge) => {
      const from = getNode(edge.from);
      const to = getNode(edge.to);
      if (!from || !to) return null;
      const x1 = from.x + 90, y1 = from.y + 30;
      const x2 = to.x + 90, y2 = to.y + 30;
      const mx = (x1 + x2) / 2;
      const isProposed = from.status === "proposed" || to.status === "proposed";
      // Vertical curve bias
      const cy1 = y1 + (y2 - y1) * 0.25;
      const cy2 = y1 + (y2 - y1) * 0.75;
      const d = `M ${x1} ${y1} C ${mx} ${cy1}, ${mx} ${cy2}, ${x2} ${y2}`;
      return { d, isProposed, key: `${edge.from}-${edge.to}` };
    }).filter(Boolean);
  }, [edges, nodes]);

  return (
    <div
      ref={containerRef}
      className={`flex-1 h-full relative bg-grid overflow-hidden ${isPanning ? "cursor-grabbing" : "cursor-grab"}`}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={() => setIsPanning(false)}
      onWheel={handleWheel}
    >
      {/* Blueprint label */}
      <div className="absolute top-4 start-4 text-[10px] font-mono text-muted-foreground/30 uppercase tracking-widest pointer-events-none z-10">
        {t("composer.systemBlueprint")}
      </div>


      {/* Zoom controls */}
      <div className="absolute bottom-4 end-4 flex items-center gap-1.5 z-10">
        <button
          onClick={() => setZoom((z) => Math.max(0.3, z - 0.15))}
          className="w-8 h-8 rounded-lg bg-card border border-primary/10 text-muted-foreground hover:text-foreground hover:border-primary/30 transition-colors flex items-center justify-center"
          title="Zoom Out"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <span className="text-[10px] font-mono text-muted-foreground/50 w-10 text-center">
          {Math.round(zoom * 100)}%
        </span>
        <button
          onClick={() => setZoom((z) => Math.min(2, z + 0.15))}
          className="w-8 h-8 rounded-lg bg-card border border-primary/10 text-muted-foreground hover:text-foreground hover:border-primary/30 transition-colors flex items-center justify-center"
          title="Zoom In"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          onClick={handleFitToView}
          className="w-8 h-8 rounded-lg bg-card border border-primary/10 text-muted-foreground hover:text-foreground hover:border-primary/30 transition-colors flex items-center justify-center ms-1"
          title={t("composer.fitToView")}
        >
          <Maximize2 className="w-4 h-4" />
        </button>
      </div>

      {/* Empty state */}
      {nodes.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <span className="text-xs font-mono text-muted-foreground/30">{t("composer.loadingModules")}</span>
        </div>
      )}

      {/* Graph canvas */}
      <div style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`, transformOrigin: "0 0" }} className="absolute inset-0">
        {/* SVG edges */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ overflow: "visible" }}>
          <defs>
            <linearGradient id="edge-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.6" />
              <stop offset="50%" stopColor="hsl(var(--primary))" stopOpacity="0.3" />
              <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.6" />
            </linearGradient>
          </defs>
          {edgePaths.map((ep) => {
            if (!ep) return null;
            return (
              <path
                key={ep.key}
                d={ep.d}
                fill="none"
                stroke={ep.isProposed ? "hsl(var(--primary))" : "url(#edge-gradient)"}
                strokeWidth="1.5"
                opacity={ep.isProposed ? 0.25 : 0.7}
                strokeDasharray={ep.isProposed ? "6 4" : "none"}
              />
            );
          })}
        </svg>

        {/* Nodes */}
        {nodes.map((node) => {
          const catStyle = getCategoryStyle(node.category);
          const IconComp = getCategoryIcon(node.category);
          const isSelected = selectedNodeId === node.id;

          return (
            <motion.div
              key={node.id}
              data-node
              className={`absolute min-w-[180px] rounded-lg cursor-pointer transition-all border overflow-hidden ${
                node.status === "proposed"
                  ? "border-dashed border-primary/30 bg-forest/50"
                  : isSelected
                  ? `${catStyle.border} bg-forest mint-glow scale-[1.02]`
                  : `${catStyle.border.replace("/50", "/20")} bg-forest shadow-xl hover:shadow-2xl hover:${catStyle.border}`
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
              {/* Category color bar */}
              <div className={`h-1 w-full ${catStyle.bar} opacity-60`} />

              <div className="p-4">
                <div className="flex items-center gap-1.5">
                  <IconComp className={`w-3 h-3 ${catStyle.text} opacity-70`} />
                  <span className={`text-[10px] font-mono uppercase tracking-wider ${catStyle.text}`}>
                    {node.category}
                  </span>
                </div>
                <div className="text-sm text-foreground font-medium mt-1.5">
                  {node.label}
                </div>
                {node.status === "proposed" && (
                  <div className="text-[9px] font-mono text-primary/40 mt-2 uppercase">
                    {t("composer.proposed")}
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default CenterPanel;
