import { Crown, Download, Settings, Users } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useTotalMembersCount } from "../../hooks/useMembership";
import {
  useTotalConfigsCount,
  useTotalDownloads,
} from "../../hooks/useQueries";
import { useLanguage } from "../../i18n/LanguageContext";
import { DotsBackground } from "../DotsBackground";
import { InteractiveWorldMap } from "../InteractiveWorldMap";

function useCountUp(target: number, duration = 1500, shouldStart = false) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!shouldStart || target === 0) return;
    const startTime = Date.now();
    const endTime = startTime + duration;

    const tick = () => {
      const now = Date.now();
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - (1 - progress) ** 3;
      setCount(Math.round(eased * target));
      if (now < endTime) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [target, duration, shouldStart]);

  return count;
}

interface StatCardProps {
  icon: React.ReactNode;
  value: number;
  suffix?: string;
  label: string;
  desc: string;
  color: string;
}

function StatCard({
  icon,
  value,
  suffix = "",
  label,
  desc,
  color,
}: StatCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  const count = useCountUp(value, 1500, inView);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 },
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const formatted =
    count >= 1000
      ? `${(count / 1000).toFixed(count >= 100000 ? 0 : 1)}K`
      : count.toString();

  return (
    <div
      ref={ref}
      className="relative rounded-xl border border-border bg-card p-8 text-center hover:border-cyan/40 transition-colors duration-200 overflow-hidden group"
    >
      <div
        className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 ${color}`}
      />

      <div className="relative z-10 flex justify-center mb-4">
        <div className="w-14 h-14 rounded-full bg-cyan/10 border border-cyan/30 flex items-center justify-center">
          {icon}
        </div>
      </div>

      <div className="relative z-10 font-display font-black text-5xl sm:text-6xl mb-1 text-cyan">
        {formatted}
        {suffix}
      </div>

      <p className="relative z-10 font-bold text-lg text-foreground mb-1">
        {label}
      </p>
      <p className="relative z-10 text-sm text-muted-foreground">{desc}</p>
    </div>
  );
}

export function StatsSection() {
  const { data: totalDownloads } = useTotalDownloads();
  const { data: totalConfigs } = useTotalConfigsCount();
  const { data: totalMembers } = useTotalMembersCount();
  const { t } = useLanguage();

  const downloadsNum = totalDownloads ? Number(totalDownloads) : 52000;
  const configsNum = totalConfigs ? Number(totalConfigs) : 8400;
  const membersNum = totalMembers ? Number(totalMembers) : 0;

  return (
    <section className="py-20 relative overflow-hidden">
      <DotsBackground />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan/30 to-transparent" />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="inline-block text-sm font-mono font-semibold text-cyan uppercase tracking-widest mb-4">
            By the Numbers
          </span>
          <h2 className="font-display font-black text-4xl sm:text-5xl mb-4">
            Community & <span className="text-cyan">Impact</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            ClawPro powers thousands of setups worldwide.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <StatCard
            icon={<Download className="w-6 h-6 text-cyan" />}
            value={downloadsNum}
            label={t.stats.totalDownloads}
            desc={t.stats.downloadsDesc}
            color="bg-gradient-to-br from-cyan/10 to-transparent"
          />
          <StatCard
            icon={<Settings className="w-6 h-6 text-purple-400" />}
            value={configsNum}
            label={t.stats.savedConfigs}
            desc={t.stats.configsDesc}
            color="bg-gradient-to-br from-purple-500/10 to-transparent"
          />
          <StatCard
            icon={<Users className="w-6 h-6 text-green-400" />}
            value={100000}
            suffix="+"
            label="Community Members"
            desc="Active users in our ecosystem"
            color="bg-gradient-to-br from-green-500/10 to-transparent"
          />
          <StatCard
            icon={<Crown className="w-6 h-6 text-amber-400" />}
            value={membersNum}
            label="Total Members"
            desc={t.stats.activeSessions}
            color="bg-gradient-to-br from-amber-500/10 to-transparent"
          />
        </div>

        {/* Interactive World Map */}
        <InteractiveWorldMap />
      </div>
    </section>
  );
}
