import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronDown, Star } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import type React from "react";
import { useState } from "react";
import type { Changelog } from "../../backend.d";
import { useAllChangelog } from "../../hooks/useQueries";
import { useLanguage } from "../../i18n/LanguageContext";

// ── Changelog Glow Styles ───────────────────────────────────────────────────
const CHANGELOG_STYLES = `
  @keyframes clGlowPulse {
    0%, 100% { opacity: 0.45; transform: scale(1); }
    50%       { opacity: 0.8;  transform: scale(1.08); }
  }
  @keyframes clCardGlow {
    0%, 100% { box-shadow: 0 0 6px var(--cl-color), 0 0 0 1px var(--cl-color-dim); }
    50%       { box-shadow: 0 0 12px var(--cl-color), 0 0 0 1px var(--cl-color-mid), 0 0 22px var(--cl-color-faint); }
  }
`;

// ── Corner Glow Component (borrowed from PartnerSection pattern) ─────────────
type CornerPos = "tl" | "tr" | "bl" | "br";

interface CornerGlowProps {
  position: CornerPos;
  colors: [string, string];
  animDelay?: string;
  animName: string;
}

function CornerGlow({
  position,
  colors,
  animDelay = "0s",
  animName,
}: CornerGlowProps) {
  const posStyles: Record<CornerPos, React.CSSProperties> = {
    tl: { top: -2, left: -2 },
    tr: { top: -2, right: -2, transform: "rotate(90deg)" },
    br: { bottom: -2, right: -2, transform: "rotate(180deg)" },
    bl: { bottom: -2, left: -2, transform: "rotate(270deg)" },
  };

  return (
    <span
      style={{
        position: "absolute",
        width: 24,
        height: 24,
        pointerEvents: "none",
        zIndex: 10,
        animation: `${animName} 3s ease-in-out infinite`,
        animationDelay: animDelay,
        ...posStyles[position],
      }}
    >
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        overflow="visible"
        aria-hidden="true"
      >
        <defs>
          <linearGradient
            id={`cl-cg-${animName}-${position}`}
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop offset="0%" stopColor={colors[0]} />
            <stop offset="100%" stopColor={colors[1]} />
          </linearGradient>
        </defs>
        <path
          d="M2 22 L2 4 Q2 2 4 2 L22 2"
          stroke={`url(#cl-cg-${animName}-${position})`}
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
        />
      </svg>
    </span>
  );
}

// ── Type → glow config mapping ───────────────────────────────────────────────
const TYPE_GLOW: Record<
  string,
  { circleGlow: string; c1: string; c2: string; animName: string }
> = {
  major: {
    circleGlow: "0 0 7px #ef4444, 0 0 14px #ef444430",
    c1: "#ef4444",
    c2: "#f87171",
    animName: "clGlowMajor",
  },
  minor: {
    circleGlow: "0 0 7px #3b82f6, 0 0 14px #3b82f630",
    c1: "#3b82f6",
    c2: "#60a5fa",
    animName: "clGlowMinor",
  },
  patch: {
    circleGlow: "0 0 7px #22c55e, 0 0 14px #22c55e30",
    c1: "#22c55e",
    c2: "#4ade80",
    animName: "clGlowPatch",
  },
  latest: {
    circleGlow: "0 0 9px #22d3ee, 0 0 18px #22d3ee40",
    c1: "#22d3ee",
    c2: "#67e8f9",
    animName: "clGlowLatest",
  },
};

const FALLBACK_CHANGELOG: Changelog[] = [
  {
    id: BigInt(1),
    version: "2.4.1",
    releaseDate: "2026-02-28",
    title: "Performance Optimization & Bug Fixes",
    description:
      "Critical performance improvements and stability fixes for all platforms.",
    changeType: "patch",
    changesList: [
      "Fixed memory leak in hardware polling loop",
      "Improved startup time by 40%",
      "Fixed crash on Linux with USB3 controllers",
      "Updated plugin API stability guarantees",
    ],
  },
  {
    id: BigInt(2),
    version: "2.4.0",
    releaseDate: "2026-02-10",
    title: "ICP Cloud Sync & Plugin v2",
    description:
      "Full Internet Computer Protocol integration for decentralized config storage.",
    changeType: "minor",
    changesList: [
      "Added ICP blockchain config sync",
      "Plugin API v2 with async hooks",
      "New Network Sync plugin",
      "Redesigned web configuration UI",
      "Added config import/export (JSON/TOML)",
    ],
  },
  {
    id: BigInt(3),
    version: "2.3.0",
    releaseDate: "2026-01-15",
    title: "Multi-platform Support & Auto-Detection",
    description: "Full Windows, macOS, and Linux support with auto-detection.",
    changeType: "minor",
    changesList: [
      "Added Windows arm64 support",
      "Hardware auto-detection engine v2",
      "macOS Sonoma compatibility",
      "Linux kernel 6.x driver support",
    ],
  },
  {
    id: BigInt(4),
    version: "2.0.0",
    releaseDate: "2025-11-01",
    title: "OpenClaw 2.0 — Complete Rewrite",
    description:
      "Complete architectural rewrite for performance, extensibility, and reliability.",
    changeType: "major",
    changesList: [
      "Complete core rewrite in Rust",
      "New plugin system architecture",
      "Real-time configuration engine",
      "Cloud sync foundation",
      "Breaking: New config file format",
    ],
  },
];

function ChangelogCard({
  entry,
  isLatest,
}: {
  entry: Changelog;
  isLatest: boolean;
}) {
  const { t } = useLanguage();

  const TYPE_STYLES: Record<string, { label: string; className: string }> = {
    major: {
      label: t.changelog.typeMajor,
      className: "border-red-500/50 text-red-400 bg-red-500/10",
    },
    minor: {
      label: t.changelog.typeMinor,
      className: "border-blue-500/50 text-blue-400 bg-blue-500/10",
    },
    patch: {
      label: t.changelog.typePatch,
      className: "border-green-500/50 text-green-400 bg-green-500/10",
    },
  };

  const typeStyle = TYPE_STYLES[entry.changeType] ?? TYPE_STYLES.patch;

  const glowKey = isLatest ? "latest" : entry.changeType;
  const glowCfg = TYPE_GLOW[glowKey] ?? TYPE_GLOW.patch;

  return (
    <>
      <style>{`
        ${CHANGELOG_STYLES}
        @keyframes ${glowCfg.animName} {
          0%, 100% { box-shadow: ${glowCfg.circleGlow}; opacity: 0.6; }
          50%       { opacity: 0.9; }
        }
        @keyframes clCard${entry.changeType}${isLatest ? "L" : ""} {
          0%, 100% { box-shadow: 0 0 5px ${glowCfg.c1}22, 0 0 0 1px ${glowCfg.c1}15; }
          50%       { box-shadow: 0 0 10px ${glowCfg.c1}38, 0 0 0 1px ${glowCfg.c1}28, 0 0 20px ${glowCfg.c1}12; }
        }
      `}</style>
      <div className="flex gap-4 sm:gap-6">
        {/* Timeline */}
        <div className="flex flex-col items-center">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 border-2"
            style={{
              borderColor: glowCfg.c1,
              background: `${glowCfg.c1}20`,
              boxShadow: glowCfg.circleGlow,
              animation: `${glowCfg.animName} 2.5s ease-in-out infinite`,
            }}
          >
            {isLatest ? (
              <Star className="w-4 h-4" style={{ color: glowCfg.c1 }} />
            ) : (
              <div
                className="w-2 h-2 rounded-full"
                style={{ background: glowCfg.c1 }}
              />
            )}
          </div>
          <div className="flex-1 w-px bg-gradient-to-b from-border to-transparent mt-2" />
        </div>

        {/* Content */}
        <div className="pb-10 flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span
              className="font-mono font-bold text-lg"
              style={{
                color: glowCfg.c1,
                textShadow: `0 0 10px ${glowCfg.c1}80`,
              }}
            >
              v{entry.version}
            </span>
            <Badge
              variant="outline"
              className={`text-xs font-mono ${typeStyle.className}`}
            >
              {typeStyle.label}
            </Badge>
            {isLatest && (
              <Badge className="bg-cyan/20 text-cyan border-cyan/40 text-xs">
                {t.changelog.latest}
              </Badge>
            )}
            <span className="text-xs text-muted-foreground ml-auto font-mono">
              {entry.releaseDate}
            </span>
          </div>

          {/* Card with glowing corners */}
          <div
            className="relative rounded-xl border bg-card p-4 transition-all"
            style={{
              borderColor: `${glowCfg.c1}30`,
              animation: `clCard${entry.changeType}${isLatest ? "L" : ""} 3s ease-in-out infinite`,
            }}
          >
            {/* Corner glows */}
            <CornerGlow
              position="tl"
              colors={[glowCfg.c1, glowCfg.c2]}
              animDelay="0s"
              animName={`${glowCfg.animName}Corner`}
            />
            <CornerGlow
              position="tr"
              colors={[glowCfg.c2, glowCfg.c1]}
              animDelay="0.75s"
              animName={`${glowCfg.animName}Corner`}
            />
            <CornerGlow
              position="br"
              colors={[glowCfg.c1, glowCfg.c2]}
              animDelay="1.5s"
              animName={`${glowCfg.animName}Corner`}
            />
            <CornerGlow
              position="bl"
              colors={[glowCfg.c2, glowCfg.c1]}
              animDelay="2.25s"
              animName={`${glowCfg.animName}Corner`}
            />
            <h3 className="font-bold text-base mb-1">{entry.title}</h3>
            <p className="text-sm text-muted-foreground mb-3">
              {entry.description}
            </p>
            <ul className="space-y-1.5">
              {entry.changesList.map((change) => (
                <li key={change} className="flex items-start gap-2 text-sm">
                  <span
                    className="mt-0.5 flex-shrink-0"
                    style={{ color: glowCfg.c1 }}
                  >
                    ›
                  </span>
                  <span className="text-muted-foreground">{change}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}

export function ChangelogSection() {
  const { data: changelog, isLoading } = useAllChangelog();
  const [showAll, setShowAll] = useState(false);
  const { t } = useLanguage();

  const entries = (
    changelog && changelog.length > 0 ? changelog : FALLBACK_CHANGELOG
  ).sort((a, b) => b.version.localeCompare(a.version));

  const visibleEntries = showAll ? entries : entries.slice(0, 3);

  return (
    <section id="changelog" className="py-24 relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan/30 to-transparent" />
      <div className="absolute inset-0 hex-grid-bg opacity-15" />

      <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <span className="inline-block text-sm font-mono font-semibold text-cyan uppercase tracking-widest mb-4">
            {t.changelog.sectionLabel}
          </span>
          <h2 className="font-display font-black text-4xl sm:text-5xl mb-4">
            <span className="text-cyan text-glow-cyan">
              {t.changelog.sectionTitle}
            </span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            {t.changelog.sectionDesc}
          </p>
        </motion.div>

        {/* Timeline */}
        {isLoading ? (
          <div className="space-y-4">
            {["skel-0", "skel-1", "skel-2"].map((k) => (
              <Skeleton key={k} className="h-32 w-full rounded-xl" />
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            {visibleEntries.map((entry, idx) => (
              <motion.div
                key={entry.id.toString()}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
              >
                <ChangelogCard entry={entry} isLatest={idx === 0} />
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Show All Toggle */}
        {entries.length > 3 && (
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center mt-4"
            >
              <Button
                variant="outline"
                onClick={() => setShowAll(!showAll)}
                className="border-cyan/30 text-cyan hover:bg-cyan/10 hover:border-cyan/60"
              >
                {showAll
                  ? t.changelog.showLess
                  : `${t.changelog.viewAll} ${entries.length} ${t.changelog.releases}`}
                <ChevronDown
                  className={`w-4 h-4 ml-2 transition-transform ${showAll ? "rotate-180" : ""}`}
                />
              </Button>
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </section>
  );
}
