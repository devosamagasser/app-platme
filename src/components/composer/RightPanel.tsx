import type { GraphNode } from "./CenterPanel";

const moduleDetails: Record<string, { deps: string[]; storage: string; capacity: string; config: string[] }> = {
  auth: { deps: [], storage: "2 MB", capacity: "10K users", config: ["OAuth 2.0", "JWT Tokens", "MFA Support"] },
  roles: { deps: ["auth"], storage: "1 MB", capacity: "100 roles", config: ["RBAC", "Permission Matrix", "Inheritance"] },
  content: { deps: ["auth", "storage"], storage: "50 GB", capacity: "10K objects", config: ["Versioning", "CDN", "Access Gating"] },
  storage: { deps: [], storage: "100 GB", capacity: "Elastic", config: ["S3 Compatible", "Encryption", "Lifecycle Rules"] },
  analytics: { deps: ["auth", "content"], storage: "5 GB", capacity: "1M events/mo", config: ["Real-time", "Dashboards", "Exports"] },
  billing: { deps: ["auth"], storage: "500 MB", capacity: "50K transactions", config: ["Stripe Integration", "Invoicing", "Webhooks"] },
  recurring: { deps: ["billing"], storage: "100 MB", capacity: "10K subscriptions", config: ["Auto-retry", "Grace Period", "Proration"] },
  access_update: { deps: ["roles", "billing"], storage: "50 MB", capacity: "Dynamic", config: ["Tier Gating", "Feature Flags", "Rollback"] },
};

const RightPanel = ({ node }: { node: GraphNode | null }) => {
  if (!node) {
    return (
      <div className="w-[320px] border-l border-primary/8 bg-card p-6 flex items-center justify-center shrink-0">
        <p className="text-xs text-muted-foreground font-mono text-center">
          Select a module to inspect
        </p>
      </div>
    );
  }

  const details = moduleDetails[node.id] || {
    deps: [], storage: "N/A", capacity: "N/A", config: ["Default Configuration"],
  };

  return (
    <div className="w-[320px] border-l border-primary/8 bg-card p-6 shrink-0 overflow-y-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="text-[10px] font-mono uppercase text-primary/50 tracking-widest mb-1">
          Module Inspector
        </div>
        <h3 className="text-lg font-semibold text-foreground">{node.label}</h3>
        <span className="text-[10px] font-mono uppercase text-primary/60 tracking-wider">
          {node.category}
        </span>
      </div>

      {/* Integrity */}
      <div className="flex items-center gap-2 py-2 px-3 rounded-md bg-primary/10 mb-6">
        <div className="w-2 h-2 rounded-full bg-primary" />
        <span className="text-xs font-bold text-primary">Architecture Valid</span>
      </div>

      {/* Dependencies */}
      <div className="mb-6">
        <div className="text-[10px] font-mono uppercase text-muted-foreground tracking-widest mb-3">
          Dependencies
        </div>
        {details.deps.length === 0 ? (
          <p className="text-xs text-muted-foreground">No dependencies (root module)</p>
        ) : (
          <div className="space-y-2">
            {details.deps.map((dep) => (
              <div key={dep} className="text-xs text-foreground/80 font-mono bg-secondary/40 px-3 py-2 rounded-md">
                → {dep}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Configuration */}
      <div className="mb-6">
        <div className="text-[10px] font-mono uppercase text-muted-foreground tracking-widest mb-3">
          Configuration
        </div>
        <div className="space-y-2">
          {details.config.map((c) => (
            <div key={c} className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-primary/40" />
              <span className="text-xs text-foreground/80">{c}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Capacity */}
      <div className="space-y-4">
        <div>
          <div className="text-[10px] font-mono uppercase text-muted-foreground tracking-widest mb-1">Storage</div>
          <div className="text-sm font-mono text-foreground">{details.storage}</div>
        </div>
        <div>
          <div className="text-[10px] font-mono uppercase text-muted-foreground tracking-widest mb-1">Capacity</div>
          <div className="text-sm font-mono text-foreground">{details.capacity}</div>
        </div>
      </div>

      {/* Status */}
      <div className="mt-6 pt-6 border-t border-primary/8">
        <div className="text-[10px] font-mono uppercase text-muted-foreground tracking-widest mb-2">
          Service Status
        </div>
        <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-mono ${
          node.status === "proposed"
            ? "bg-accent/20 text-accent-foreground"
            : "bg-primary/10 text-primary"
        }`}>
          <div className={`w-1.5 h-1.5 rounded-full ${
            node.status === "proposed" ? "bg-accent-foreground/60" : "bg-primary"
          }`} />
          {node.status === "proposed" ? "Pending Confirmation" : "Provisioned"}
        </div>
      </div>
    </div>
  );
};

export default RightPanel;
