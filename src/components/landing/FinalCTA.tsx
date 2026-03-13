import { motion } from "framer-motion";

const FinalCTA = () => (
  <section className="py-32 relative">
    <div className="absolute inset-0 bg-gradient-to-t from-forest/30 to-transparent" />
    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-primary/5 blur-[120px]" />

    <div className="relative container mx-auto px-8 text-center">
      <motion.div
        className="space-y-8"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <h2 className="text-4xl md:text-5xl font-semibold tracking-architect text-foreground leading-tight">
          This is not automation.<br />
          <span className="text-gradient-mint">This is orchestration.</span>
        </h2>
        <p className="text-muted-foreground text-lg max-w-lg mx-auto">
          Infrastructure for building entire digital businesses. Human-led. AI-orchestrated.
        </p>
        <button className="px-10 py-5 rounded-lg bg-primary text-primary-foreground font-bold text-sm hover:shadow-[0_0_30px_rgba(159,255,208,0.4)] transition-all mint-glow">
          Request Early Access
        </button>
      </motion.div>
    </div>

    {/* Footer */}
    <div className="relative mt-32 border-t border-primary/10 pt-8">
      <div className="container mx-auto px-8 flex items-center justify-between text-xs text-muted-foreground">
        <span>© 2026 PLATME. Guided Intelligence™</span>
        <span className="font-mono">v0.1.0</span>
      </div>
    </div>
  </section>
);

export default FinalCTA;
