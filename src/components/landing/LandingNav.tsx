import { Link } from "react-router-dom";

const LandingNav = () => (
  <nav className="fixed top-0 left-0 right-0 z-50 h-16 flex items-center justify-between px-8 border-b border-primary/10 backdrop-blur-xl bg-background/80">
    <div className="flex items-center gap-2">
      <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
        <div className="w-3 h-3 rounded-sm bg-primary" />
      </div>
      <span className="text-lg font-bold tracking-architect text-foreground">PLATME</span>
    </div>
    <div className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
      <a href="#industries" className="hover:text-foreground transition-colors">Industries</a>
      <a href="#how-it-works" className="hover:text-foreground transition-colors">How It Works</a>
      <Link to="/select" className="px-5 py-2 rounded-lg bg-primary text-primary-foreground font-semibold text-sm hover:shadow-[0_0_20px_rgba(159,255,208,0.4)] transition-all">
        Launch Composer
      </Link>
    </div>
  </nav>
);

export default LandingNav;
