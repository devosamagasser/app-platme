import { motion } from "framer-motion";

const industries = [
  { name: "Education", active: true, angle: -90 },
  { name: "E-commerce", active: false, angle: -18 },
  { name: "Gym Systems", active: false, angle: 54 },
  { name: "Clinic Systems", active: false, angle: 126 },
  { name: "Restaurant Systems", active: false, angle: 198 },
];

const IndustrySection = () => (
  <section id="industries" className="py-32 relative">
    <div className="container mx-auto px-8">
      <div className="flex flex-col items-center">
        {/* Orchestration visual */}
        <div className="relative w-[500px] h-[500px] mb-16">
          {/* Core node */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
            <div className="w-24 h-24 rounded-2xl bg-forest border border-primary/30 flex items-center justify-center mint-glow">
              <div className="text-center">
                <div className="text-[10px] font-mono uppercase text-primary/60 tracking-widest">PLATME</div>
                <div className="text-xs font-semibold text-foreground mt-1">Core</div>
              </div>
            </div>
          </div>

          {/* Industry nodes + connections */}
          {industries.map((ind, i) => {
            const rad = (ind.angle * Math.PI) / 180;
            const x = 250 + Math.cos(rad) * 180;
            const y = 250 + Math.sin(rad) * 180;

            return (
              <g key={ind.name}>
                {/* SVG connection line */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 500 500">
                  <line
                    x1="250" y1="250" x2={x} y2={y}
                    stroke="#9FFFD0"
                    strokeWidth={ind.active ? 2 : 1}
                    opacity={ind.active ? 0.8 : 0.15}
                    strokeDasharray={ind.active ? "none" : "4 4"}
                  />
                </svg>

                {/* Industry node */}
                <motion.div
                  className="absolute"
                  style={{ left: x - 55, top: y - 30 }}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <div className={`w-[110px] px-3 py-3 rounded-lg border text-center transition-all ${
                    ind.active
                      ? "bg-forest border-primary/40 mint-glow"
                      : "bg-secondary/30 border-primary/10 opacity-40"
                  }`}>
                    <div className={`text-xs font-bold uppercase tracking-wider ${
                      ind.active ? "text-primary" : "text-muted-foreground"
                    }`}>
                      {ind.name}
                    </div>
                    {!ind.active && (
                      <div className="text-[9px] text-muted-foreground mt-1 font-mono">Coming Soon</div>
                    )}
                  </div>
                </motion.div>
              </g>
            );
          })}
        </div>

        <motion.div
          className="text-center space-y-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl font-semibold tracking-architect text-foreground">
            Orchestrate Your Industry
          </h2>
          <p className="text-muted-foreground text-lg">
            One Infrastructure. Multiple Verticals.
          </p>
        </motion.div>
      </div>
    </div>
  </section>
);

export default IndustrySection;
