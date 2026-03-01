import { Cloud, Cpu, Monitor, Puzzle, Sliders, Users } from "lucide-react";
import { motion } from "motion/react";

const FEATURES = [
  {
    icon: Cpu,
    title: "Auto-Detection",
    description:
      "Automatically identifies and configures connected hardware on startup. Zero manual setup required.",
    color: "from-cyan/20 to-cyan/5",
    iconColor: "text-cyan",
  },
  {
    icon: Monitor,
    title: "Multi-Platform",
    description:
      "Seamless support for Windows, macOS, and Linux. One tool, every platform.",
    color: "from-blue-500/20 to-blue-500/5",
    iconColor: "text-blue-400",
  },
  {
    icon: Sliders,
    title: "Real-time Config",
    description:
      "Live preview of your configuration changes as you make them. No restarts needed.",
    color: "from-purple-500/20 to-purple-500/5",
    iconColor: "text-purple-400",
  },
  {
    icon: Puzzle,
    title: "Plugin System",
    description:
      "Extend OpenClaw with a rich plugin ecosystem. Audio, visual, haptic, and more.",
    color: "from-amber-500/20 to-amber-500/5",
    iconColor: "text-amber-400",
  },
  {
    icon: Cloud,
    title: "Cloud Sync",
    description:
      "Store and sync your configurations across all devices via ICP blockchain storage.",
    color: "from-green-500/20 to-green-500/5",
    iconColor: "text-green-400",
  },
  {
    icon: Users,
    title: "Community",
    description:
      "Join 100,000+ active users sharing configurations, plugins, and tips.",
    color: "from-rose-500/20 to-rose-500/5",
    iconColor: "text-rose-400",
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number],
    },
  },
};

export function FeaturesSection() {
  return (
    <section id="features" className="py-24 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 hex-grid-bg opacity-20" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-cyan/30 to-transparent" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block text-sm font-mono font-semibold text-cyan uppercase tracking-widest mb-4">
            Why OpenClaw
          </span>
          <h2 className="font-display font-black text-4xl sm:text-5xl lg:text-6xl mb-4">
            Powerful <span className="text-cyan text-glow-cyan">Features</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Everything you need to configure, deploy, and manage your claw
            hardware at scale.
          </p>
        </motion.div>

        {/* Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {FEATURES.map((feature) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                variants={cardVariants}
                className="group relative rounded-xl border border-border bg-card p-6 hover:border-cyan/40 transition-all duration-300 hover:shadow-glow-sm overflow-hidden cursor-default"
              >
                {/* Gradient fill on hover */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
                />

                {/* Content */}
                <div className="relative z-10">
                  {/* Icon */}
                  <div className="w-12 h-12 rounded-lg bg-background/50 border border-border flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Icon className={`w-6 h-6 ${feature.iconColor}`} />
                  </div>

                  <h3 className="font-display font-bold text-xl mb-2 text-foreground">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </div>

                {/* Corner accent */}
                <div className="absolute top-0 right-0 w-16 h-16 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div
                    className={`absolute top-0 right-0 w-full h-full ${feature.iconColor.replace("text-", "bg-").replace("400", "500")} opacity-10 rounded-bl-3xl`}
                  />
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
