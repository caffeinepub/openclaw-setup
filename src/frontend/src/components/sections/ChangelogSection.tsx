import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronDown, Star } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import type { Changelog } from "../../backend.d";
import { useAllChangelog } from "../../hooks/useQueries";
import { useLanguage } from "../../i18n/LanguageContext";
import { DotsBackground } from "../DotsBackground";

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

  return (
    <div className="flex gap-4 sm:gap-6">
      {/* Timeline */}
      <div className="flex flex-col items-center">
        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 border-2 ${
            isLatest
              ? "border-cyan bg-cyan/20 shadow-glow-sm"
              : "border-border bg-card"
          }`}
        >
          {isLatest ? (
            <Star className="w-4 h-4 text-cyan" />
          ) : (
            <div className="w-2 h-2 rounded-full bg-muted-foreground" />
          )}
        </div>
        <div className="flex-1 w-px bg-gradient-to-b from-border to-transparent mt-2" />
      </div>

      {/* Content */}
      <div className="pb-10 flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-2 mb-2">
          <span
            className={`font-mono font-bold text-lg ${isLatest ? "text-cyan text-glow-cyan" : "text-foreground"}`}
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

        <div className="rounded-xl border border-border bg-card p-4 hover:border-cyan/30 transition-colors">
          <h3 className="font-bold text-base mb-1">{entry.title}</h3>
          <p className="text-sm text-muted-foreground mb-3">
            {entry.description}
          </p>
          <ul className="space-y-1.5">
            {entry.changesList.map((change) => (
              <li key={change} className="flex items-start gap-2 text-sm">
                <span className="text-cyan mt-0.5 flex-shrink-0">›</span>
                <span className="text-muted-foreground">{change}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
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
      <DotsBackground />
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
