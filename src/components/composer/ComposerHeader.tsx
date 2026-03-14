import { Link } from "react-router-dom";

const ComposerHeader = ({ businessLabel, onComplete }: { businessLabel: string; onComplete: () => void }) => (
  <header className="h-14 border-b border-primary/8 px-6 flex items-center justify-between bg-background shrink-0">
    <Link to="/" className="flex items-center gap-2">
      <div className="w-7 h-7 rounded-md bg-primary/20 flex items-center justify-center">
        <div className="w-2.5 h-2.5 rounded-sm bg-primary" />
      </div>
      <span className="text-sm font-bold tracking-architect text-foreground">PLATME</span>
    </Link>

    <div className="text-xs text-muted-foreground font-mono tracking-wider uppercase">
      Guided Intelligence™ Composer — <span className="text-primary">{businessLabel}</span>
    </div>

    <div className="flex items-center gap-3">
      <button
        onClick={onComplete}
        className="px-4 py-1.5 rounded-md text-xs font-semibold bg-primary text-primary-foreground hover:shadow-[0_0_15px_rgba(159,255,208,0.3)] transition-all"
      >
        Proceed →
      </button>
    </div>
  </header>
);

export default ComposerHeader;
