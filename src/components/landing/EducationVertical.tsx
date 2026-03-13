import { motion } from "framer-motion";
import { BookOpen, Users, Layers, Award, BarChart3, FileText } from "lucide-react";

const features = [
  { icon: BookOpen, title: "Courses", desc: "Structured curriculum engine with versioned content." },
  { icon: Users, title: "Membership", desc: "Multi-tier access control and subscription management." },
  { icon: Layers, title: "Cohorts", desc: "Group-based learning with enrollment workflows." },
  { icon: Award, title: "Certification", desc: "Automated credential issuance and verification." },
  { icon: BarChart3, title: "Analytics", desc: "Real-time telemetry on engagement and progress." },
  { icon: FileText, title: "Content Delivery", desc: "CDN-backed media distribution with access gating." },
];

const EducationVertical = () => (
  <section id="education" className="py-32 relative">
    <div className="absolute inset-0 bg-gradient-to-b from-background via-forest/20 to-background" />
    <div className="relative container mx-auto px-8">
      <motion.div
        className="text-center mb-16"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          <span className="text-xs font-mono uppercase tracking-widest text-primary">Live Vertical</span>
        </div>
        <h2 className="text-4xl font-semibold tracking-architect text-foreground mb-4">
          Education Infrastructure
        </h2>
        <p className="text-muted-foreground text-lg max-w-xl mx-auto">
          The first production vertical. Modular blocks for building complete learning platforms.
        </p>
      </motion.div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {features.map((f, i) => (
          <motion.div
            key={f.title}
            className="panel-glass p-6 hover:border-primary/30 transition-all group"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
          >
            <f.icon className="w-5 h-5 text-primary mb-4 group-hover:drop-shadow-[0_0_8px_rgba(159,255,208,0.5)] transition-all" />
            <h3 className="text-foreground font-semibold mb-2">{f.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default EducationVertical;
