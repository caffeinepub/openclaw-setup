import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Coins,
  Copy,
  ExternalLink,
  Medal,
  RefreshCw,
  Share2,
  Trophy,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { toast } from "sonner";
import type { LeaderboardEntry } from "../backend.d";
import { MembershipTier } from "../backend.d";
import { useLeaderboard, useTopRewards } from "../hooks/useQueries";

// ── Tier styles (mirrored from MemberDashboard) ──

const TIER_STYLES: Record<
  MembershipTier,
  { label: string; badge: string; color: string; icon: string }
> = {
  [MembershipTier.silver]: {
    label: "Silver",
    badge: "bg-slate-500/20 text-slate-200 border-slate-400/40",
    color: "oklch(0.75 0.05 220)",
    icon: "⬥",
  },
  [MembershipTier.gold]: {
    label: "Gold",
    badge: "bg-amber-500/20 text-amber-200 border-amber-400/40",
    color: "oklch(0.80 0.18 60)",
    icon: "★",
  },
  [MembershipTier.platinum]: {
    label: "Platinum",
    badge: "bg-violet-500/20 text-violet-200 border-violet-400/40",
    color: "oklch(0.75 0.20 290)",
    icon: "◆",
  },
};

const PODIUM_RANK_CONFIG = {
  1: {
    emoji: "👑",
    heightClass: "h-24",
    avatarSize: "w-16 h-16",
    nameColor: "text-amber-200",
    tokenColor: "text-amber-300",
    coinColor: "text-amber-400",
    platformBg:
      "linear-gradient(180deg, oklch(0.24 0.08 60 / 50%), oklch(0.18 0.06 58 / 35%))",
    platformBorder: "1px solid oklch(0.80 0.20 60 / 35%)",
    platformGlow: "0 0 24px oklch(0.80 0.20 60 / 30%)",
    avatarBorder: "border-amber-400/60",
    avatarGlow: "0 0 20px oklch(0.80 0.20 60 / 45%)",
    textSize: "text-2xl",
    order: "order-2",
  },
  2: {
    emoji: "🥈",
    heightClass: "h-16",
    avatarSize: "w-12 h-12",
    nameColor: "text-slate-200",
    tokenColor: "text-slate-300",
    coinColor: "text-slate-400",
    platformBg: "oklch(0.20 0.03 220 / 30%)",
    platformBorder: "1px solid oklch(0.75 0.05 220 / 30%)",
    platformGlow: "0 0 16px oklch(0.75 0.05 220 / 20%)",
    avatarBorder: "border-slate-400/40",
    avatarGlow: undefined,
    textSize: "text-xl",
    order: "order-1",
  },
  3: {
    emoji: "🥉",
    heightClass: "h-12",
    avatarSize: "w-11 h-11",
    nameColor: "text-orange-200",
    tokenColor: "text-orange-300",
    coinColor: "text-orange-400",
    platformBg: "oklch(0.20 0.06 40 / 25%)",
    platformBorder: "1px solid oklch(0.70 0.12 40 / 25%)",
    platformGlow: "0 0 14px oklch(0.70 0.12 40 / 18%)",
    avatarBorder: "border-orange-400/40",
    avatarGlow: undefined,
    textSize: "text-lg",
    order: "order-3",
  },
} as const;

function getDisplayName(entry: LeaderboardEntry): string {
  if (entry.handle) return `@${entry.handle}`;
  if (entry.displayName) return entry.displayName;
  const p = entry.principal.toString();
  return `${p.slice(0, 6)}…${p.slice(-4)}`;
}

function getInitials(entry: LeaderboardEntry): string {
  const name = entry.handle || entry.displayName;
  if (!name) return entry.principal.toString().slice(0, 2).toUpperCase();
  return name
    .split(/[\s_-]+/)
    .map((w: string) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

// ── Podium Card ──

interface PodiumCardProps {
  entry: LeaderboardEntry;
  rank: 1 | 2 | 3;
  rewardBadge?: string;
  rewardTitle?: string;
}

function PodiumCard({
  entry,
  rank,
  rewardBadge,
  rewardTitle,
}: PodiumCardProps) {
  const cfg = PODIUM_RANK_CONFIG[rank];
  const tier = TIER_STYLES[entry.tier];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: rank * 0.1, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className={`flex flex-col items-center gap-2 flex-1 max-w-[140px] ${cfg.order}`}
    >
      {/* Badge emoji above avatar */}
      <div className="text-2xl leading-none">{cfg.emoji}</div>

      {/* Avatar */}
      <div
        className={`${cfg.avatarSize} rounded-full flex items-center justify-center font-black text-white border-2 ${cfg.avatarBorder} text-sm`}
        style={{
          background: `radial-gradient(circle at 30% 30%, ${tier.color}, oklch(0.15 0.05 240))`,
          boxShadow: cfg.avatarGlow,
        }}
      >
        {getInitials(entry)}
      </div>

      {/* Name */}
      <p
        className={`text-[11px] font-bold truncate w-full text-center ${cfg.nameColor}`}
      >
        {getDisplayName(entry)}
      </p>

      {/* Tier badge */}
      <Badge className={`border text-[9px] px-1.5 py-0 h-4 ${tier.badge}`}>
        {tier.icon} {tier.label}
      </Badge>

      {/* Tokens */}
      <div className="flex items-center gap-1">
        <Coins className={`w-3 h-3 ${cfg.coinColor}`} />
        <span className={`text-[10px] font-bold ${cfg.tokenColor}`}>
          {Number(entry.tokens).toLocaleString()}
        </span>
      </div>

      {/* Reward title */}
      {rewardTitle && (
        <p className="text-[9px] text-center leading-tight text-[oklch(0.55_0.03_210)] max-w-full truncate px-1">
          {rewardBadge} {rewardTitle}
        </p>
      )}

      {/* Podium block */}
      <div
        className={`w-full rounded-t-lg ${cfg.heightClass} flex items-center justify-center font-black ${cfg.nameColor} ${cfg.textSize}`}
        style={{
          background: cfg.platformBg,
          border: cfg.platformBorder,
          boxShadow: cfg.platformGlow,
        }}
      >
        {rank}
      </div>
    </motion.div>
  );
}

// ── Public Leaderboard Page ──

interface PublicLeaderboardPageProps {
  onClose: () => void;
}

export function PublicLeaderboardPage({ onClose }: PublicLeaderboardPageProps) {
  const leaderboardQuery = useLeaderboard();
  const topRewardsQuery = useTopRewards();

  const leaderboard = leaderboardQuery.data ?? [];
  const topRewards = topRewardsQuery.data ?? [];
  const isLoading = leaderboardQuery.isLoading;
  const isRefetching = leaderboardQuery.isFetching && !isLoading;

  const top3 = leaderboard.filter((e) => Number(e.rank) <= 3);

  const getRewardForRank = (rank: number) =>
    topRewards.find((r) => Number(r.rank) === rank);

  const handleShare = async () => {
    const url = `${window.location.origin}/#/leaderboard`;
    try {
      await navigator.clipboard.writeText(url);
      toast.success("Leaderboard link copied to clipboard!");
    } catch {
      toast.error("Could not copy link.");
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-4"
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        <motion.div
          initial={{ scale: 0.94, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.94, opacity: 0, y: 20 }}
          transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
          className="bg-[oklch(0.09_0.012_240)] border border-[oklch(1_0_0_/_8%)] rounded-2xl w-full max-w-2xl max-h-[92vh] overflow-hidden flex flex-col shadow-[0_40px_100px_rgba(0,0,0,0.7)]"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex-shrink-0 px-5 py-4 border-b border-[oklch(1_0_0_/_7%)] flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/15 border border-amber-500/25 flex items-center justify-center flex-shrink-0">
              <Trophy className="w-5 h-5 text-amber-400" />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="font-bold text-[oklch(0.92_0.04_210)] text-base leading-tight">
                Public Leaderboard
              </h2>
              <p className="text-[11px] text-[oklch(0.50_0.02_210)]">
                Top Members · Real-time blockchain data ·{" "}
                {isLoading ? "Loading…" : `${leaderboard.length} members`}
              </p>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 flex-shrink-0">
              {/* Share button */}
              <button
                type="button"
                onClick={handleShare}
                title="Share leaderboard"
                className="flex items-center gap-1.5 text-[11px] font-medium text-[oklch(0.62_0.15_210)] hover:text-[oklch(0.78_0.15_210)] transition-colors px-2.5 py-1.5 rounded-lg hover:bg-[oklch(0.62_0.15_210)]/10 border border-transparent hover:border-[oklch(0.62_0.15_210)]/20"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Share</span>
              </button>

              {/* Refresh */}
              <button
                type="button"
                onClick={() => leaderboardQuery.refetch()}
                disabled={isRefetching}
                title="Refresh"
                className="flex items-center gap-1.5 text-[11px] text-[oklch(0.50_0.03_210)] hover:text-[oklch(0.70_0.05_210)] transition-colors p-1.5 rounded-lg hover:bg-[oklch(1_0_0_/_5%)] disabled:opacity-40"
              >
                <RefreshCw
                  className={`w-3.5 h-3.5 ${isRefetching ? "animate-spin" : ""}`}
                />
              </button>

              {/* Close */}
              <button
                type="button"
                onClick={onClose}
                className="p-1.5 rounded-xl text-[oklch(0.45_0.02_210)] hover:text-[oklch(0.75_0.04_210)] hover:bg-[oklch(1_0_0_/_6%)] transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Scrollable content */}
          <div className="flex-1 overflow-y-auto overscroll-contain">
            <div className="p-5 space-y-6">
              {/* ── Podium ── */}
              {isLoading ? (
                <div className="flex items-end justify-center gap-4 pt-4">
                  {[2, 1, 3].map((r) => (
                    <div
                      key={r}
                      className="flex flex-col items-center gap-2 flex-1 max-w-[120px]"
                    >
                      <Skeleton className="w-14 h-14 rounded-full bg-[oklch(0.14_0.01_240)]" />
                      <Skeleton className="h-3 w-20 rounded bg-[oklch(0.14_0.01_240)]" />
                      <Skeleton
                        className="w-full rounded-t-lg bg-[oklch(0.14_0.01_240)]"
                        style={{
                          height: r === 1 ? "6rem" : r === 2 ? "4rem" : "3rem",
                        }}
                      />
                    </div>
                  ))}
                </div>
              ) : top3.length >= 1 ? (
                <div className="rounded-xl border border-[oklch(1_0_0_/_7%)] bg-[oklch(0.10_0.012_240)] p-5">
                  <div className="flex items-center gap-2 mb-5">
                    <Trophy className="w-4 h-4 text-amber-400" />
                    <h3 className="text-[11px] font-bold text-[oklch(0.58_0.05_210)] uppercase tracking-wider">
                      🏆 Top 3 Podium
                    </h3>
                  </div>

                  <div className="flex items-end justify-center gap-3">
                    {([2, 1, 3] as const).map((rank) => {
                      const entry = top3.find((e) => Number(e.rank) === rank);
                      if (!entry) return null;
                      const reward = getRewardForRank(rank);
                      return (
                        <PodiumCard
                          key={rank}
                          entry={entry}
                          rank={rank}
                          rewardBadge={reward?.badge}
                          rewardTitle={reward?.title}
                        />
                      );
                    })}
                  </div>
                </div>
              ) : null}

              {/* ── Top Reward Cards ── */}
              {topRewards.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Medal className="w-4 h-4 text-amber-400" />
                    <h3 className="text-[11px] font-bold text-[oklch(0.58_0.05_210)] uppercase tracking-wider">
                      Rank Rewards
                    </h3>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    {topRewards.map((reward) => (
                      <div
                        key={reward.rank.toString()}
                        className="rounded-xl border border-[oklch(1_0_0_/_8%)] bg-[oklch(0.11_0.012_240)] p-3 text-center space-y-1"
                      >
                        <div className="text-xl">{reward.badge}</div>
                        <p className="text-[10px] font-bold text-[oklch(0.75_0.04_210)]">
                          Rank #{reward.rank.toString()}
                        </p>
                        <p className="text-[9px] text-[oklch(0.52_0.03_210)] leading-tight">
                          {reward.title}
                        </p>
                        <div className="flex items-center justify-center gap-0.5">
                          <Coins className="w-3 h-3 text-amber-400" />
                          <span className="text-[10px] font-bold text-amber-300">
                            +{Number(reward.bonusTokens).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ── Full Rankings Table ── */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold text-[oklch(0.58_0.05_210)] uppercase tracking-wider">
                      All Rankings
                    </span>
                  </div>
                  <span className="text-[10px] text-[oklch(0.38_0.02_210)]">
                    No login required
                  </span>
                </div>

                <div className="rounded-xl border border-[oklch(1_0_0_/_8%)] bg-[oklch(0.10_0.012_240)] overflow-hidden">
                  {isLoading ? (
                    <div className="divide-y divide-[oklch(1_0_0_/_5%)]">
                      {["sk1", "sk2", "sk3", "sk4", "sk5", "sk6"].map((key) => (
                        <div
                          key={key}
                          className="flex items-center gap-3 px-4 py-3"
                        >
                          <Skeleton className="w-7 h-7 rounded-full bg-[oklch(0.14_0.01_240)]" />
                          <Skeleton className="w-8 h-8 rounded-full bg-[oklch(0.14_0.01_240)]" />
                          <div className="flex-1 space-y-1.5">
                            <Skeleton className="h-3 w-28 rounded bg-[oklch(0.14_0.01_240)]" />
                            <Skeleton className="h-2 w-16 rounded bg-[oklch(0.13_0.01_240)]" />
                          </div>
                          <Skeleton className="h-4 w-14 rounded-full bg-[oklch(0.14_0.01_240)]" />
                          <Skeleton className="h-3 w-16 rounded bg-[oklch(0.13_0.01_240)]" />
                        </div>
                      ))}
                    </div>
                  ) : leaderboard.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-14 text-center px-6">
                      <Trophy className="w-10 h-10 text-[oklch(0.28_0.02_210)] mb-3" />
                      <p className="text-sm font-medium text-[oklch(0.50_0.02_210)]">
                        No members yet
                      </p>
                      <p className="text-xs text-[oklch(0.38_0.01_210)] mt-1">
                        Be the first to join the leaderboard!
                      </p>
                    </div>
                  ) : (
                    <div className="divide-y divide-[oklch(1_0_0_/_5%)]">
                      {leaderboard.map((entry, i) => {
                        const rankNum = Number(entry.rank);
                        const tierStyle = TIER_STYLES[entry.tier];
                        const isTop3 = rankNum <= 3;

                        return (
                          <motion.div
                            key={entry.principal.toString()}
                            initial={{ opacity: 0, x: -8 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: Math.min(i * 0.025, 0.35) }}
                            className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-[oklch(1_0_0_/_2%)]"
                            style={
                              isTop3
                                ? {
                                    background:
                                      rankNum === 1
                                        ? "linear-gradient(90deg, oklch(0.22 0.07 55 / 18%), transparent)"
                                        : rankNum === 2
                                          ? "linear-gradient(90deg, oklch(0.20 0.03 220 / 14%), transparent)"
                                          : "linear-gradient(90deg, oklch(0.22 0.06 40 / 12%), transparent)",
                                  }
                                : undefined
                            }
                          >
                            {/* Rank number */}
                            <div
                              className={`w-7 h-7 rounded-full border flex items-center justify-center flex-shrink-0 ${
                                rankNum === 1
                                  ? "bg-amber-500/15 border-amber-400/30"
                                  : rankNum === 2
                                    ? "bg-slate-500/15 border-slate-400/30"
                                    : rankNum === 3
                                      ? "bg-orange-500/15 border-orange-400/30"
                                      : "bg-[oklch(0.14_0.01_240)] border-[oklch(1_0_0_/_8%)]"
                              }`}
                            >
                              {rankNum <= 3 ? (
                                <Medal
                                  className={`w-3.5 h-3.5 ${
                                    rankNum === 1
                                      ? "text-amber-300"
                                      : rankNum === 2
                                        ? "text-slate-300"
                                        : "text-orange-400"
                                  }`}
                                />
                              ) : (
                                <span className="text-[10px] font-bold text-[oklch(0.45_0.02_210)]">
                                  {rankNum}
                                </span>
                              )}
                            </div>

                            {/* Avatar */}
                            <div
                              className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                              style={{
                                background: `radial-gradient(circle at 30% 30%, ${tierStyle.color}, oklch(0.15 0.05 240))`,
                              }}
                            >
                              {getInitials(entry)}
                            </div>

                            {/* Name / Handle */}
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-semibold text-[oklch(0.85_0.05_210)] truncate">
                                {getDisplayName(entry)}
                              </p>
                              {entry.handle && entry.displayName && (
                                <p className="text-[10px] text-[oklch(0.42_0.03_210)] font-mono truncate">
                                  {entry.displayName}
                                </p>
                              )}
                            </div>

                            {/* Tier badge */}
                            <Badge
                              className={`border text-[9px] px-1.5 py-0 h-4 flex-shrink-0 ${tierStyle.badge}`}
                            >
                              {tierStyle.icon} {tierStyle.label}
                            </Badge>

                            {/* Tokens */}
                            <div className="flex items-center gap-1 flex-shrink-0">
                              <Coins className="w-3 h-3 text-amber-400/70" />
                              <span
                                className={`text-xs font-bold ${
                                  rankNum === 1
                                    ? "text-amber-300"
                                    : rankNum === 2
                                      ? "text-slate-300"
                                      : rankNum === 3
                                        ? "text-orange-300"
                                        : "text-[oklch(0.75_0.05_210)]"
                                }`}
                              >
                                {Number(entry.tokens).toLocaleString()}
                              </span>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>

              {/* ── Share & Login CTA footer ── */}
              <div className="rounded-xl border border-[oklch(1_0_0_/_7%)] bg-[oklch(0.09_0.01_240)] p-4 flex flex-col sm:flex-row items-center gap-3 justify-between">
                <div className="text-center sm:text-left">
                  <p className="text-xs font-semibold text-[oklch(0.75_0.04_210)]">
                    Want to appear on this leaderboard?
                  </p>
                  <p className="text-[11px] text-[oklch(0.45_0.02_210)] mt-0.5">
                    Login and purchase a membership to earn tokens and rank up.
                  </p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleShare}
                    className="border-[oklch(1_0_0_/_12%)] text-[oklch(0.65_0.05_210)] hover:bg-[oklch(1_0_0_/_6%)] h-8 text-xs gap-1.5"
                  >
                    <Copy className="w-3 h-3" />
                    Copy Link
                  </Button>
                  <Button
                    size="sm"
                    onClick={onClose}
                    className="bg-[oklch(0.58_0.20_230)] hover:bg-[oklch(0.65_0.20_230)] text-white font-semibold h-8 text-xs gap-1.5"
                  >
                    <ExternalLink className="w-3 h-3" />
                    Join Now
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
