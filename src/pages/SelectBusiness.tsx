import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { GraduationCap, ShoppingCart, Dumbbell, Stethoscope, UtensilsCrossed } from "lucide-react";
import { businessVerticals } from "@/lib/businessFeatures";

const iconMap: Record<string, React.ElementType> = {
  GraduationCap,
  ShoppingCart,
  Dumbbell,
  Stethoscope,
  UtensilsCrossed,
};

const SelectBusiness = () => {
  const navigate = useNavigate();
  const verticals = Object.values(businessVerticals);

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-forest to-background" />
      <div className="absolute inset-0 bg-grid opacity-40" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-primary/3 blur-[150px]" />

      {/* Header */}
      <nav className="relative z-10 h-16 flex items-center justify-between px-8 border-b border-primary/10 backdrop-blur-xl bg-background/60">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
            <div className="w-3 h-3 rounded-sm bg-primary" />
          </div>
          <span className="text-lg font-bold tracking-architect text-foreground">PLATME</span>
        </Link>
        <span className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
          Select Your Vertical
        </span>
      </nav>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-8 py-20">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-xs font-mono uppercase tracking-widest text-primary/60 mb-4">
            Guided Intelligence™
          </p>
          <h1 className="text-4xl md:text-5xl font-semibold tracking-architect text-foreground mb-4">
            What are you <span className="text-gradient-mint">building?</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-lg mx-auto">
            Select your industry vertical. Gomaa will architect the optimal infrastructure for your system.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {verticals.map((v, i) => {
            const Icon = iconMap[v.icon] || GraduationCap;
            return (
              <motion.div
                key={v.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08, duration: 0.5 }}
              >
                <button
                  onClick={() => v.active && navigate(`/composer?business=${v.id}`)}
                  disabled={!v.active}
                  className={`w-full text-left p-6 rounded-xl border transition-all group ${
                    v.active
                      ? "panel-glass hover:border-primary/40 hover:mint-glow cursor-pointer"
                      : "bg-secondary/20 border-primary/5 opacity-40 cursor-not-allowed"
                  }`}
                >
                  <Icon className={`w-6 h-6 mb-4 transition-all ${
                    v.active
                      ? "text-primary group-hover:drop-shadow-[0_0_8px_rgba(159,255,208,0.5)]"
                      : "text-muted-foreground"
                  }`} />
                  <h3 className="text-foreground font-semibold mb-1">{v.label}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                    {v.description}
                  </p>
                  {!v.active && (
                    <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground/60">
                      Coming Soon
                    </span>
                  )}
                  {v.active && (
                    <span className="text-[10px] font-mono uppercase tracking-widest text-primary/60">
                      Available →
                    </span>
                  )}
                </button>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SelectBusiness;
