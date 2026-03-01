import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  AlertTriangle,
  BarChart3,
  Bot,
  Check,
  Code2,
  Crown,
  Download,
  Globe,
  Infinity as InfinityIcon,
  MessageSquare,
  Shield,
  Sparkles,
  Star,
  Terminal,
  Users,
  Webhook,
  X,
  Zap,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { MembershipTier } from "../backend.d";
import { useMyMembership } from "../hooks/useMembership";

interface TierLandingPageProps {
  tier: MembershipTier;
  onClose: () => void;
  onPurchase: () => void;
}

interface BenefitItem {
  icon: React.ReactNode;
  title: string;
  description: string;
}

interface ComparisonFeature {
  name: string;
  silver: boolean | string;
  gold: boolean | string;
  platinum: boolean | string;
}

interface Testimonial {
  name: string;
  role: string;
  avatar: string;
  quote: string;
  tier: MembershipTier;
}

const TIER_TOKENS: Record<MembershipTier, number> = {
  [MembershipTier.silver]: Math.round(9.99 * 100),
  [MembershipTier.gold]: Math.round(29.99 * 100),
  [MembershipTier.platinum]: Math.round(79.99 * 100),
};

const TIER_CONFIG = {
  [MembershipTier.silver]: {
    name: "Silver",
    price: 9.99,
    tagline: "Perfect for hobbyists and enthusiasts getting started.",
    icon: <Shield className="w-8 h-8" />,
    accentClass: "text-slate-300",
    bgGradient: "from-slate-900 via-slate-800 to-slate-900",
    glowColor: "oklch(0.72 0.05 240 / 0.35)",
    glowColor2: "oklch(0.72 0.05 240 / 0.15)",
    orb1: "bg-slate-500/20",
    orb2: "bg-slate-400/10",
    badgeClass: "bg-slate-500/20 text-slate-300 border-slate-500/40",
    buttonClass: "bg-slate-600 hover:bg-slate-500 text-white",
    borderClass: "border-slate-500/40",
    lineColor: "from-transparent via-slate-400/60 to-transparent",
    hexClass: "slate",
  },
  [MembershipTier.gold]: {
    name: "Gold",
    price: 29.99,
    tagline: "Power tools for serious builders and professionals.",
    icon: <Star className="w-8 h-8" />,
    accentClass: "text-amber-400",
    bgGradient: "from-amber-950 via-stone-900 to-amber-950",
    glowColor: "oklch(0.78 0.18 85 / 0.45)",
    glowColor2: "oklch(0.78 0.18 85 / 0.2)",
    orb1: "bg-amber-500/25",
    orb2: "bg-amber-400/12",
    badgeClass: "bg-amber-500/20 text-amber-300 border-amber-500/40",
    buttonClass:
      "bg-amber-500 hover:bg-amber-400 text-black font-bold shadow-[0_0_20px_oklch(0.78_0.18_85/0.4)]",
    borderClass: "border-amber-500/50",
    lineColor: "from-transparent via-amber-400/60 to-transparent",
    hexClass: "gold",
  },
  [MembershipTier.platinum]: {
    name: "Platinum",
    price: 79.99,
    tagline: "Elite access for those who demand the absolute best.",
    icon: <Crown className="w-8 h-8" />,
    accentClass: "text-violet-400",
    bgGradient: "from-violet-950 via-purple-900 to-violet-950",
    glowColor: "oklch(0.6 0.22 290 / 0.5)",
    glowColor2: "oklch(0.6 0.22 290 / 0.2)",
    orb1: "bg-violet-500/25",
    orb2: "bg-violet-400/12",
    badgeClass: "bg-violet-500/20 text-violet-300 border-violet-500/40",
    buttonClass:
      "bg-violet-600 hover:bg-violet-500 text-white shadow-[0_0_20px_oklch(0.6_0.22_290/0.4)]",
    borderClass: "border-violet-500/50",
    lineColor: "from-transparent via-violet-400/60 to-transparent",
    hexClass: "platinum",
  },
};

const BENEFITS: Record<MembershipTier, BenefitItem[]> = {
  [MembershipTier.silver]: [
    {
      icon: <Code2 className="w-5 h-5" />,
      title: "Config Builder",
      description:
        "Intuitive visual config builder to craft your perfect OpenClaw setup.",
    },
    {
      icon: <Users className="w-5 h-5" />,
      title: "Community Support",
      description:
        "Access our vibrant Discord community with thousands of active members.",
    },
    {
      icon: <Download className="w-5 h-5" />,
      title: "5 Saved Configs",
      description:
        "Store up to 5 configurations in the cloud, sync across devices.",
    },
    {
      icon: <Zap className="w-5 h-5" />,
      title: "Full Download Access",
      description: "Download OpenClaw for Windows, macOS, and Linux instantly.",
    },
    {
      icon: <Globe className="w-5 h-5" />,
      title: "Basic Documentation",
      description:
        "Complete setup guides, configuration reference, and tutorials.",
    },
    {
      icon: <Bot className="w-5 h-5" />,
      title: "Chatbot Setup",
      description:
        "Configure your personal OpenClaw chatbot with WhatsApp integration.",
    },
    {
      icon: <MessageSquare className="w-5 h-5" />,
      title: "WhatsApp Integration",
      description:
        "Route support queries directly to your WhatsApp business number.",
    },
    {
      icon: <Shield className="w-5 h-5" />,
      title: "Community Discord",
      description:
        "Exclusive Silver member channel with hardware tips and tricks.",
    },
  ],
  [MembershipTier.gold]: [
    {
      icon: <Shield className="w-5 h-5" />,
      title: "All Silver Features",
      description: "Everything in Silver, plus powerful upgrades for pros.",
    },
    {
      icon: <Zap className="w-5 h-5" />,
      title: "Priority Support",
      description: "Skip the queue — guaranteed 12-hour response SLA.",
    },
    {
      icon: <Download className="w-5 h-5" />,
      title: "50 Saved Configs",
      description: "Store and organize up to 50 configurations with folders.",
    },
    {
      icon: <Star className="w-5 h-5" />,
      title: "Early Access Updates",
      description:
        "Be first to test new features before public release, with beta builds.",
    },
    {
      icon: <Code2 className="w-5 h-5" />,
      title: "Advanced Templates",
      description:
        "30+ professionally curated config templates for every use case.",
    },
    {
      icon: <Sparkles className="w-5 h-5" />,
      title: "AI Assistant",
      description:
        "GPT-4o powered AI to help optimize configs and troubleshoot issues.",
    },
    {
      icon: <Terminal className="w-5 h-5" />,
      title: "API Explorer",
      description:
        "Interactive REST API explorer to integrate OpenClaw into your workflow.",
    },
    {
      icon: <Webhook className="w-5 h-5" />,
      title: "Custom Webhooks",
      description:
        "Trigger external services on claw events — Slack, Discord, n8n, Zapier.",
    },
  ],
  [MembershipTier.platinum]: [
    {
      icon: <Crown className="w-5 h-5" />,
      title: "All Gold Features",
      description: "The complete Gold toolkit, amplified to the maximum.",
    },
    {
      icon: <InfinityIcon className="w-5 h-5" />,
      title: "Lifetime Updates",
      description: "Never pay again — all future versions included forever.",
    },
    {
      icon: <BarChart3 className="w-5 h-5" />,
      title: "Unlimited Configs",
      description:
        "No limits on saved configurations. Store everything, forever.",
    },
    {
      icon: <MessageSquare className="w-5 h-5" />,
      title: "Developer Direct Line",
      description: "Private Slack channel with the core dev team. Real humans.",
    },
    {
      icon: <Zap className="w-5 h-5" />,
      title: "Exclusive Beta Features",
      description:
        "Access experimental features months before anyone else sees them.",
    },
    {
      icon: <Sparkles className="w-5 h-5" />,
      title: "Custom AI Presets",
      description:
        "Pre-trained AI models fine-tuned specifically for your hardware profile.",
    },
    {
      icon: <Terminal className="w-5 h-5" />,
      title: "Dedicated API Limits",
      description:
        "10× higher rate limits with guaranteed uptime SLA for API access.",
    },
    {
      icon: <Globe className="w-5 h-5" />,
      title: "White-label Export",
      description:
        "Export configs branded with your own company logo and metadata.",
    },
  ],
};

const COMPARISON_FEATURES: ComparisonFeature[] = [
  { name: "Config Builder", silver: true, gold: true, platinum: true },
  { name: "Download Access", silver: true, gold: true, platinum: true },
  { name: "Saved Configs", silver: "5", gold: "50", platinum: "Unlimited" },
  { name: "Community Discord", silver: true, gold: true, platinum: true },
  { name: "Priority Support", silver: false, gold: true, platinum: true },
  { name: "Early Access Updates", silver: false, gold: true, platinum: true },
  {
    name: "AI Assistant (GPT-4o)",
    silver: false,
    gold: true,
    platinum: true,
  },
  { name: "API Explorer", silver: false, gold: true, platinum: true },
  { name: "Custom Webhooks", silver: false, gold: true, platinum: true },
  { name: "Lifetime Updates", silver: false, gold: false, platinum: true },
  { name: "Developer Direct Line", silver: false, gold: false, platinum: true },
  { name: "Custom AI Presets", silver: false, gold: false, platinum: true },
  {
    name: "Dedicated API Rate Limits",
    silver: false,
    gold: false,
    platinum: true,
  },
  { name: "White-label Export", silver: false, gold: false, platinum: true },
];

const TESTIMONIALS: Testimonial[] = [
  {
    name: "Marcus Chen",
    role: "Robotics Engineer",
    avatar: "MC",
    quote:
      "OpenClaw Silver gave me exactly what I needed to get started. The config builder saved me hours of trial and error.",
    tier: MembershipTier.silver,
  },
  {
    name: "Priya Sharma",
    role: "Hardware Lab Director",
    avatar: "PS",
    quote:
      "The AI Assistant alone justifies Gold. It diagnosed my servo calibration issue in 30 seconds — would have taken me a day.",
    tier: MembershipTier.gold,
  },
  {
    name: "Aleksei Volkov",
    role: "CTO, RoboTech Industries",
    avatar: "AV",
    quote:
      "Platinum's white-label export and dedicated API limits transformed how we deploy configs to 200+ client installations.",
    tier: MembershipTier.platinum,
  },
  {
    name: "Fatima Al-Rashid",
    role: "Automation Consultant",
    avatar: "FA",
    quote:
      "Custom AI presets for each client profile is a game-changer. Platinum pays for itself every single month.",
    tier: MembershipTier.platinum,
  },
];

function FeatureValue({
  value,
  accentClass,
}: {
  value: boolean | string;
  accentClass: string;
}) {
  if (value === false)
    return (
      <X className="w-4 h-4 text-muted-foreground/40 mx-auto flex-shrink-0" />
    );
  if (value === true)
    return <Check className={`w-4 h-4 ${accentClass} mx-auto flex-shrink-0`} />;
  return (
    <span className={`text-xs font-semibold ${accentClass}`}>{value}</span>
  );
}

export function TierLandingPage({
  tier,
  onClose,
  onPurchase,
}: TierLandingPageProps) {
  const config = TIER_CONFIG[tier];
  const benefits = BENEFITS[tier];
  const { data: myMembership } = useMyMembership();
  const isActive = myMembership?.tier === tier;

  const tierTestimonials = TESTIMONIALS.filter((t) => t.tier === tier);
  const otherTestimonials = TESTIMONIALS.filter((t) => t.tier !== tier).slice(
    0,
    2 - tierTestimonials.length,
  );
  const displayTestimonials = [...tierTestimonials, ...otherTestimonials].slice(
    0,
    2,
  );

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="fixed inset-0 z-[60] overflow-y-auto"
        style={{
          background:
            "linear-gradient(135deg, oklch(0.07 0.02 240) 0%, oklch(0.05 0.01 250) 100%)",
        }}
      >
        {/* Animated glow orbs */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <motion.div
            className={`absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full ${config.orb1} blur-[120px]`}
            animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.7, 0.5] }}
            transition={{
              duration: 6,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className={`absolute -bottom-40 -right-40 w-[500px] h-[500px] rounded-full ${config.orb2} blur-[100px]`}
            animate={{ scale: [1.1, 1, 1.1], opacity: [0.4, 0.6, 0.4] }}
            transition={{
              duration: 7,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
              delay: 1,
            }}
          />
          {/* Hex grid overlay */}
          <div className="absolute inset-0 hex-grid-bg opacity-10" />
        </div>

        {/* Close button */}
        <motion.button
          type="button"
          onClick={onClose}
          className="fixed top-4 right-4 z-[70] p-3 rounded-xl bg-white/5 backdrop-blur-md border border-white/10 text-white/60 hover:text-white hover:bg-white/10 transition-all"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </motion.button>

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 py-16 pb-24">
          {/* Hero */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="text-center mb-16"
          >
            {/* Tier shimmer line */}
            <div
              className={`w-px h-16 mx-auto mb-8 bg-gradient-to-b ${config.lineColor}`}
            />

            {/* Icon */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{
                duration: 0.7,
                delay: 0.2,
                type: "spring",
                stiffness: 200,
              }}
              className={`w-24 h-24 rounded-3xl border ${config.borderClass} mx-auto mb-6 flex items-center justify-center ${config.accentClass}`}
              style={{
                background: `radial-gradient(circle, ${config.glowColor} 0%, transparent 70%)`,
                boxShadow: `0 0 40px ${config.glowColor}, 0 0 80px ${config.glowColor2}`,
              }}
            >
              {config.icon}
            </motion.div>

            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Badge
                className={`border text-sm px-4 py-1.5 mb-4 font-semibold ${config.badgeClass}`}
              >
                {config.name} Membership
              </Badge>
            </motion.div>

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
              className="font-display font-black text-5xl sm:text-7xl text-white mb-4"
            >
              Go{" "}
              <span
                className={config.accentClass}
                style={{
                  textShadow: `0 0 30px ${config.glowColor}, 0 0 60px ${config.glowColor2}`,
                }}
              >
                {config.name}
              </span>
            </motion.h1>

            {/* Tagline */}
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-white/60 text-xl max-w-lg mx-auto mb-8"
            >
              {config.tagline}
            </motion.p>

            {/* Price */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.45 }}
              className="flex flex-col items-center gap-1 mb-10"
            >
              <div className="flex items-baseline gap-2">
                <span
                  className={`font-display font-black text-8xl ${config.accentClass}`}
                >
                  {TIER_TOKENS[tier].toLocaleString()}
                </span>
                <div className="text-left">
                  <div className="text-2xl font-bold text-white">tokens</div>
                </div>
              </div>
              <div className="text-sm text-white/40">
                ${config.price.toFixed(2)} / month &middot; $1 = 100 tokens
              </div>
            </motion.div>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-3 justify-center"
            >
              {isActive ? (
                <Button
                  disabled
                  size="lg"
                  className="px-10 h-14 text-base font-bold opacity-60 cursor-not-allowed border border-white/20"
                  variant="outline"
                >
                  <Check className="w-5 h-5 mr-2" />
                  Already Active
                </Button>
              ) : (
                <Button
                  onClick={onPurchase}
                  size="lg"
                  className={`px-10 h-14 text-base font-bold ${config.buttonClass}`}
                >
                  <Zap className="w-5 h-5 mr-2" />
                  Get {config.name} — {TIER_TOKENS[tier].toLocaleString()}{" "}
                  Tokens
                </Button>
              )}
              <Button
                onClick={onClose}
                size="lg"
                variant="outline"
                className="px-8 h-14 text-base border-white/15 text-white/70 hover:text-white hover:border-white/30"
              >
                Compare All Plans
              </Button>
            </motion.div>
          </motion.div>

          {/* Benefits Grid */}
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55, duration: 0.6 }}
            className="mb-16"
          >
            <div className="flex items-center gap-4 mb-8">
              <div
                className={`h-px flex-1 bg-gradient-to-r from-transparent ${config.borderClass}`}
              />
              <h2
                className={`font-display font-bold text-2xl ${config.accentClass} uppercase tracking-wider`}
              >
                {config.name} Benefits
              </h2>
              <div
                className={`h-px flex-1 bg-gradient-to-l from-transparent ${config.borderClass}`}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {benefits.map((benefit, i) => (
                <motion.div
                  key={benefit.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 + i * 0.05 }}
                  className="group relative rounded-2xl border border-white/8 bg-white/4 backdrop-blur-sm p-5 hover:border-white/15 hover:bg-white/6 transition-all duration-300"
                >
                  <div
                    className={`w-10 h-10 rounded-xl border ${config.borderClass} flex items-center justify-center mb-3 ${config.accentClass}`}
                    style={{
                      background: `radial-gradient(circle, ${config.glowColor2} 0%, transparent 70%)`,
                    }}
                  >
                    {benefit.icon}
                  </div>
                  <h3 className="font-bold text-white/90 text-sm mb-1.5">
                    {benefit.title}
                  </h3>
                  <p className="text-xs text-white/45 leading-relaxed">
                    {benefit.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* Feature Comparison */}
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.65, duration: 0.6 }}
            className="mb-16"
          >
            <div className="flex items-center gap-4 mb-8">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
              <h2 className="font-display font-bold text-2xl text-white/80 uppercase tracking-wider">
                What&apos;s Included
              </h2>
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            </div>

            <div className="rounded-2xl border border-white/8 bg-white/3 backdrop-blur-sm overflow-hidden">
              {/* Table header */}
              <div className="grid grid-cols-[1fr_auto_auto_auto] gap-0 border-b border-white/8">
                <div className="px-5 py-4 text-xs font-semibold text-white/40 uppercase tracking-wider">
                  Feature
                </div>
                {(
                  [
                    MembershipTier.silver,
                    MembershipTier.gold,
                    MembershipTier.platinum,
                  ] as const
                ).map((t) => (
                  <div
                    key={t}
                    className={`px-4 py-4 text-center text-xs font-bold uppercase tracking-wider ${
                      t === tier ? config.accentClass : "text-white/40"
                    } ${t === tier ? "bg-white/5" : ""} w-[80px] sm:w-[100px]`}
                  >
                    {TIER_CONFIG[t].name}
                  </div>
                ))}
              </div>

              {/* Rows */}
              {COMPARISON_FEATURES.map((feat, i) => (
                <div
                  key={feat.name}
                  className={`grid grid-cols-[1fr_auto_auto_auto] gap-0 ${
                    i % 2 === 0 ? "bg-white/[0.02]" : ""
                  } border-b border-white/5 last:border-0`}
                >
                  <div className="px-5 py-3 text-sm text-white/70 flex items-center">
                    {feat.name}
                  </div>
                  {(
                    [
                      MembershipTier.silver,
                      MembershipTier.gold,
                      MembershipTier.platinum,
                    ] as const
                  ).map((t) => (
                    <div
                      key={t}
                      className={`px-4 py-3 flex items-center justify-center ${
                        t === tier ? "bg-white/4" : ""
                      } w-[80px] sm:w-[100px]`}
                    >
                      <FeatureValue
                        value={feat[t]}
                        accentClass={TIER_CONFIG[t].accentClass}
                      />
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </motion.section>

          {/* Testimonials */}
          {displayTestimonials.length > 0 && (
            <motion.section
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.6 }}
              className="mb-16"
            >
              <div className="flex items-center gap-4 mb-8">
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                <h2 className="font-display font-bold text-2xl text-white/80 uppercase tracking-wider">
                  Community Love
                </h2>
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {displayTestimonials.map((testimonial, i) => (
                  <motion.div
                    key={testimonial.name}
                    initial={{ opacity: 0, x: i === 0 ? -20 : 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.75 + i * 0.1 }}
                    className="rounded-2xl border border-white/8 bg-white/4 backdrop-blur-sm p-6"
                  >
                    <div className="flex items-start gap-4 mb-4">
                      <div
                        className={`w-12 h-12 rounded-xl border ${TIER_CONFIG[testimonial.tier].borderClass} flex items-center justify-center font-bold text-sm ${TIER_CONFIG[testimonial.tier].accentClass} flex-shrink-0`}
                        style={{
                          background: `radial-gradient(circle, ${TIER_CONFIG[testimonial.tier].glowColor2} 0%, transparent 70%)`,
                        }}
                      >
                        {testimonial.avatar}
                      </div>
                      <div>
                        <p className="font-bold text-white/90 text-sm">
                          {testimonial.name}
                        </p>
                        <p className="text-xs text-white/45">
                          {testimonial.role}
                        </p>
                        <Badge
                          className={`border text-[10px] px-1.5 py-0 h-4 mt-1 ${TIER_CONFIG[testimonial.tier].badgeClass}`}
                        >
                          {TIER_CONFIG[testimonial.tier].name}
                        </Badge>
                      </div>
                    </div>
                    <p className="text-sm text-white/60 leading-relaxed italic">
                      &ldquo;{testimonial.quote}&rdquo;
                    </p>
                  </motion.div>
                ))}
              </div>
            </motion.section>
          )}

          {/* Warning / Note */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="flex items-start gap-3 rounded-xl border border-white/8 bg-white/3 px-5 py-4 mb-10"
          >
            <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-white/50 leading-relaxed">
              Membership pricing uses token conversion: $1 = 100 tokens. Silver
              = 999 tokens, Gold = 2,999 tokens, Platinum = 7,999 tokens. All
              transactions are processed securely. You can upgrade to a higher
              tier at any time. Downgrades take effect at the end of the current
              period.
            </p>
          </motion.div>

          {/* Bottom CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.85 }}
            className="text-center"
          >
            {isActive ? (
              <div className="space-y-3">
                <div
                  className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl border ${config.borderClass} ${config.accentClass} font-bold`}
                >
                  <Check className="w-5 h-5" />
                  {config.name} is Active on Your Account
                </div>
                <p className="text-sm text-white/40">
                  You already have access to all {config.name} features.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                <Button
                  onClick={onPurchase}
                  size="lg"
                  className={`px-14 h-16 text-lg font-bold ${config.buttonClass}`}
                >
                  <Zap className="w-5 h-5 mr-2" />
                  Unlock {config.name} for {TIER_TOKENS[tier].toLocaleString()}{" "}
                  Tokens
                </Button>
                <p className="text-sm text-white/35">
                  One-time charge · Cancel anytime · On-chain transaction
                </p>
              </div>
            )}
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
