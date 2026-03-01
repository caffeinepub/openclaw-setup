import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Check,
  Crown,
  Gem,
  Loader2,
  LogIn,
  Shield,
  Sparkles,
  Star,
  Zap,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { toast } from "sonner";
import { useInternetIdentity } from "../../hooks/useInternetIdentity";
import {
  MembershipTier,
  useMyMembership,
  usePurchaseMembership,
} from "../../hooks/useMembership";

interface TierConfig {
  tier: MembershipTier;
  name: string;
  price: number;
  icon: React.ReactNode;
  tagline: string;
  features: string[];
  accentColor: string;
  glowColor: string;
  borderColor: string;
  bgGradient: string;
  badgeClass: string;
  buttonClass: string;
  popular?: boolean;
}

const TIERS: TierConfig[] = [
  {
    tier: MembershipTier.silver,
    name: "Silver",
    price: 5,
    icon: <Shield className="w-6 h-6" />,
    tagline: "Mulai perjalananmu",
    features: [
      "Download OpenClaw",
      "Basic config builder",
      "Community support",
      "5 saved configs",
    ],
    accentColor: "text-slate-300",
    glowColor: "shadow-[0_0_20px_oklch(0.72_0.03_240/0.4)]",
    borderColor: "border-slate-500/40",
    bgGradient: "from-slate-500/15 via-slate-400/5 to-transparent",
    badgeClass: "bg-slate-500/20 text-slate-300 border-slate-500/40",
    buttonClass:
      "bg-slate-600/80 hover:bg-slate-500 text-white border-slate-500/50 hover:shadow-[0_0_15px_oklch(0.55_0.03_240/0.5)]",
    popular: false,
  },
  {
    tier: MembershipTier.gold,
    name: "Gold",
    price: 15,
    icon: <Star className="w-6 h-6" />,
    tagline: "Paling populer",
    features: [
      "Semua fitur Silver",
      "Priority support",
      "50 saved configs",
      "Early access updates",
      "Advanced config templates",
    ],
    accentColor: "text-amber-400",
    glowColor: "shadow-[0_0_30px_oklch(0.78_0.18_85/0.5)]",
    borderColor: "border-amber-500/50",
    bgGradient: "from-amber-500/20 via-amber-400/8 to-transparent",
    badgeClass: "bg-amber-500/20 text-amber-300 border-amber-500/40",
    buttonClass:
      "bg-amber-500 hover:bg-amber-400 text-black font-bold shadow-[0_0_20px_oklch(0.78_0.18_85/0.4)] hover:shadow-[0_0_30px_oklch(0.78_0.18_85/0.6)]",
    popular: true,
  },
  {
    tier: MembershipTier.platinum,
    name: "Platinum",
    price: 35,
    icon: <Crown className="w-6 h-6" />,
    tagline: "Akses penuh & eksklusif",
    features: [
      "Semua fitur Gold",
      "Lifetime updates",
      "Unlimited saved configs",
      "Direct developer support",
      "Exclusive beta features",
      "Custom config presets",
    ],
    accentColor: "text-violet-400",
    glowColor: "shadow-[0_0_30px_oklch(0.6_0.22_290/0.5)]",
    borderColor: "border-violet-500/50",
    bgGradient: "from-violet-500/20 via-violet-400/8 to-transparent",
    badgeClass: "bg-violet-500/20 text-violet-300 border-violet-500/40",
    buttonClass:
      "bg-violet-600 hover:bg-violet-500 text-white shadow-[0_0_20px_oklch(0.6_0.22_290/0.4)] hover:shadow-[0_0_30px_oklch(0.6_0.22_290/0.6)]",
    popular: false,
  },
];

const TIER_ORDER = [
  MembershipTier.silver,
  MembershipTier.gold,
  MembershipTier.platinum,
];

function getTierRank(tier: MembershipTier): number {
  return TIER_ORDER.indexOf(tier);
}

function formatPurchaseDate(nanoseconds: bigint): string {
  const ms = Number(nanoseconds / BigInt(1_000_000));
  return new Date(ms).toLocaleDateString("id-ID", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function PricingCard({ config }: { config: TierConfig }) {
  const { identity } = useInternetIdentity();
  const { data: myMembership, isLoading: membershipLoading } =
    useMyMembership();
  const { mutate: purchase, isPending } = usePurchaseMembership();

  const isActive = myMembership && myMembership.tier === config.tier;
  const currentTierRank = myMembership ? getTierRank(myMembership.tier) : -1;
  const thisTierRank = getTierRank(config.tier);
  const isUpgrade = myMembership && thisTierRank > currentTierRank;
  const isDowngrade = myMembership && thisTierRank < currentTierRank;

  const handleBuy = () => {
    if (!identity) {
      toast.error("Silakan login terlebih dahulu untuk membeli membership.");
      return;
    }
    purchase(config.tier, {
      onSuccess: () => {
        toast.success(`Membership ${config.name} berhasil diaktifkan! 🎉`);
      },
      onError: () => {
        toast.error(`Gagal mengaktifkan membership ${config.name}. Coba lagi.`);
      },
    });
  };

  const getButtonLabel = () => {
    if (membershipLoading) return "Memuat...";
    if (isActive) return null;
    if (!identity) return "Login untuk Membeli";
    if (isUpgrade) return `Upgrade ke ${config.name}`;
    if (isDowngrade) return `Downgrade ke ${config.name}`;
    return "Beli Sekarang";
  };

  const buttonLabel = getButtonLabel();

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className={`relative flex flex-col rounded-2xl border bg-card overflow-hidden transition-all duration-300 ${
        config.popular
          ? `${config.borderColor} ${config.glowColor}`
          : `border-border hover:${config.borderColor}`
      }`}
    >
      {/* Popular badge */}
      {config.popular && (
        <div className="absolute top-0 left-0 right-0 flex justify-center">
          <div className="bg-amber-500 text-black text-xs font-bold px-4 py-1 rounded-b-lg tracking-widest uppercase">
            <Sparkles className="w-3 h-3 inline mr-1" />
            Paling Populer
          </div>
        </div>
      )}

      {/* Background gradient */}
      <div
        className={`absolute inset-0 bg-gradient-to-br ${config.bgGradient} pointer-events-none`}
      />

      {/* Shimmer line */}
      {config.popular && (
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-400/60 to-transparent" />
      )}

      <div
        className={`relative z-10 p-8 flex flex-col h-full ${config.popular ? "pt-10" : ""}`}
      >
        {/* Tier header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <div
              className={`flex items-center gap-2 mb-1 ${config.accentColor}`}
            >
              {config.icon}
              <span className="font-display font-black text-2xl">
                {config.name}
              </span>
            </div>
            <p className="text-sm text-muted-foreground">{config.tagline}</p>
          </div>

          {/* Active badge */}
          <AnimatePresence>
            {isActive && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
              >
                <Badge
                  className={`${config.badgeClass} border font-semibold text-xs`}
                >
                  <Zap className="w-3 h-3 mr-1" />
                  Aktif
                </Badge>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Price */}
        <div className="mb-6">
          <div className="flex items-baseline gap-1">
            <span
              className={`font-display font-black text-5xl ${config.accentColor}`}
            >
              {config.price}
            </span>
            <span className="text-lg font-semibold text-muted-foreground">
              ICP
            </span>
            <span className="text-sm text-muted-foreground">/bulan</span>
          </div>
        </div>

        {/* Features */}
        <ul className="space-y-3 mb-8 flex-1">
          {config.features.map((feature) => (
            <li key={feature} className="flex items-start gap-3">
              <div
                className={`mt-0.5 w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${config.badgeClass} border`}
              >
                <Check className="w-3 h-3" />
              </div>
              <span className="text-sm text-foreground/80 leading-snug">
                {feature}
              </span>
            </li>
          ))}
        </ul>

        {/* Active info */}
        <AnimatePresence>
          {isActive && myMembership && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-4 overflow-hidden"
            >
              <div
                className={`rounded-lg border ${config.borderColor} px-3 py-2 text-xs text-muted-foreground`}
              >
                <Gem className="w-3 h-3 inline mr-1" />
                Aktif sejak {formatPurchaseDate(myMembership.purchasedAt)}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* CTA Button */}
        {isActive ? (
          <Button
            disabled
            className="w-full border opacity-60 cursor-not-allowed"
            variant="outline"
          >
            <Zap className="w-4 h-4 mr-2" />
            Membership Aktif
          </Button>
        ) : (
          <Button
            onClick={handleBuy}
            disabled={isPending || membershipLoading}
            className={`w-full transition-all duration-300 ${config.buttonClass}`}
          >
            {isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Memproses...
              </>
            ) : (
              <>
                {!identity && <LogIn className="w-4 h-4 mr-2" />}
                {buttonLabel}
              </>
            )}
          </Button>
        )}
      </div>
    </motion.div>
  );
}

export function PricingSection() {
  return (
    <section id="pricing" className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 hex-grid-bg opacity-20" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-500/30 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-amber-500/3 to-transparent pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block text-sm font-mono font-semibold text-amber-400 uppercase tracking-widest mb-4">
            Membership
          </span>
          <h2 className="font-display font-black text-4xl sm:text-5xl lg:text-6xl mb-4">
            Pilih{" "}
            <span
              className="text-amber-400"
              style={{
                textShadow:
                  "0 0 20px oklch(0.78 0.18 85 / 0.7), 0 0 40px oklch(0.78 0.18 85 / 0.3)",
              }}
            >
              Paket
            </span>{" "}
            Kamu
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Dapatkan akses penuh ke OpenClaw dengan paket membership yang sesuai
            kebutuhanmu. Bayar dengan ICP, simpan di blockchain.
          </p>
        </motion.div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-start">
          {TIERS.map((config, index) => (
            <motion.div
              key={config.tier}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={config.popular ? "md:-mt-4 md:mb-4" : ""}
            >
              <PricingCard config={config} />
            </motion.div>
          ))}
        </div>

        {/* Bottom note */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center text-sm text-muted-foreground mt-10"
        >
          Semua pembayaran diproses secara on-chain melalui ICP.{" "}
          <span className="text-foreground/60">
            Tidak ada biaya tersembunyi.
          </span>
        </motion.p>
      </div>
    </section>
  );
}
