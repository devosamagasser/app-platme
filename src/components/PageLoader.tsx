const PageLoader = () => (
  <div className="min-h-screen bg-background flex items-center justify-center">
    <div className="flex flex-col items-center gap-3">
      <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      <span className="text-xs font-mono text-muted-foreground uppercase tracking-widest">Loading…</span>
    </div>
  </div>
);

export default PageLoader;
