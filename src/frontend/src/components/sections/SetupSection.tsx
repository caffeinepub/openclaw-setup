import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Apple,
  Check,
  Copy,
  Download,
  Monitor,
  Smartphone,
  Terminal,
} from "lucide-react";
import { motion } from "motion/react";
import type React from "react";
import { useState } from "react";
import { toast } from "sonner";
import { useDownloadsByOS, useIncrementDownload } from "../../hooks/useQueries";
import { useLanguage } from "../../i18n/LanguageContext";

// ── OS Corner Glow ──
type OSCornerPos = "tl" | "tr" | "bl" | "br";
type OSType = "android" | "windows" | "macos" | "linux";

const OS_CORNER_COLORS: Record<OSType, { c1: string; c2: string }> = {
  android: { c1: "#00FF88", c2: "#00CC44" },
  windows: { c1: "#0078FF", c2: "#00BFFF" },
  macos: { c1: "#E8E8E8", c2: "#FFFFFF" },
  linux: { c1: "#FF6A00", c2: "#FFD700" },
};

interface OSCornerGlowProps {
  os: OSType;
  position: OSCornerPos;
  animDelay?: string;
}

function OSCornerGlow({ os, position, animDelay = "0s" }: OSCornerGlowProps) {
  const { c1, c2 } = OS_CORNER_COLORS[os];
  const animName = `osCorner_${os}`;
  const gradId = `osg-${os}-${position}`;

  const posStyles: Record<OSCornerPos, React.CSSProperties> = {
    tl: { top: -1, left: -1 },
    tr: { top: -1, right: -1, transform: "rotate(90deg)" },
    br: { bottom: -1, right: -1, transform: "rotate(180deg)" },
    bl: { bottom: -1, left: -1, transform: "rotate(270deg)" },
  };

  return (
    <span
      style={{
        position: "absolute",
        width: 28,
        height: 28,
        pointerEvents: "none",
        zIndex: 10,
        animation: `${animName} 2.5s ease-in-out infinite`,
        animationDelay: animDelay,
        ...posStyles[position],
      }}
    >
      <svg
        width="28"
        height="28"
        viewBox="0 0 28 28"
        fill="none"
        overflow="visible"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={c1} />
            <stop offset="100%" stopColor={c2} />
          </linearGradient>
        </defs>
        <path
          d="M2 26 L2 5 Q2 2 5 2 L26 2"
          stroke={`url(#${gradId})`}
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
        />
      </svg>
    </span>
  );
}

interface StepProps {
  number: number;
  title: string;
  commands?: string[];
  note?: string;
  copiedLabel: string;
}

function InstallStep({
  number,
  title,
  commands,
  note,
  copiedLabel,
}: StepProps) {
  const [copiedCmd, setCopiedCmd] = useState<string | null>(null);

  const handleCopy = (cmd: string) => {
    void navigator.clipboard.writeText(cmd);
    setCopiedCmd(cmd);
    setTimeout(() => setCopiedCmd(null), 2000);
    toast.success(copiedLabel);
  };

  return (
    <div className="flex gap-4">
      <div className="flex-shrink-0 flex flex-col items-center">
        <div className="w-8 h-8 rounded-full bg-cyan text-background font-bold text-sm flex items-center justify-center shadow-glow-sm">
          {number}
        </div>
        <div className="flex-1 w-px bg-gradient-to-b from-cyan/40 to-transparent mt-2" />
      </div>
      <div className="pb-8 flex-1 min-w-0">
        <p className="font-semibold text-foreground mb-2">{title}</p>
        {commands?.map((cmd) => (
          <div
            key={cmd}
            className="flex items-center gap-2 mb-2 rounded-lg bg-background/80 border border-border px-4 py-3 font-mono text-sm group"
          >
            <Terminal className="w-3.5 h-3.5 text-cyan flex-shrink-0" />
            <code className="flex-1 text-cyan/90 overflow-x-auto whitespace-nowrap">
              {cmd}
            </code>
            <button
              type="button"
              onClick={() => handleCopy(cmd)}
              className="ml-2 p-1 rounded text-muted-foreground hover:text-cyan transition-colors flex-shrink-0"
              aria-label="Copy command"
            >
              {copiedCmd === cmd ? (
                <Check className="w-3.5 h-3.5 text-green-400" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
            </button>
          </div>
        ))}
        {note && <p className="text-sm text-muted-foreground mt-1">{note}</p>}
      </div>
    </div>
  );
}

const STEP_COMMANDS: Record<OSType, { commands: string[] }[]> = {
  android: [
    { commands: [] },
    { commands: ["adb install clawpro-latest.apk"] },
    { commands: [] },
    { commands: [] },
  ],
  windows: [
    { commands: ["winget install OpenClaw.OpenClaw"] },
    { commands: [] },
    { commands: ['setx PATH "%PATH%;C:\\Program Files\\OpenClaw\\bin"'] },
    { commands: ["openclaw --version", "openclaw init"] },
  ],
  macos: [
    { commands: ["brew tap openclaw/openclaw", "brew install openclaw"] },
    { commands: [] },
    { commands: ["openclaw setup", "openclaw --version"] },
    { commands: [] },
  ],
  linux: [
    {
      commands: [
        "curl -fsSL https://openclaw.io/install.sh | sudo bash",
        "sudo apt install openclaw",
      ],
    },
    { commands: ["sudo snap install openclaw --classic"] },
    { commands: ["sudo chmod +x /usr/local/bin/openclaw"] },
    { commands: ["openclaw --version", "openclaw init", "openclaw start"] },
  ],
};

const OS_ICONS: Record<OSType, React.ElementType> = {
  android: Smartphone,
  windows: Monitor,
  macos: Apple,
  linux: Terminal,
};

const OS_LABELS: Record<OSType, string> = {
  android: "Android",
  windows: "Windows",
  macos: "macOS",
  linux: "Linux",
};

// Android-specific steps (not in translation system)
const ANDROID_STEPS = [
  {
    title: "Download from Google Play Store",
    note: 'Search "ClawPro" on Google Play Store',
  },
  {
    title: "Install APK (manual method)",
    note: "Enable Unknown Sources in Settings → Security first",
  },
  {
    title: "Open ClawPro and Sign In",
    note: "Use your ClawPro account or ICP identity",
  },
  { title: "Configure and Start Automating", note: undefined },
];

export function SetupSection() {
  const { data: downloadStats } = useDownloadsByOS();
  const incrementDownload = useIncrementDownload();
  const { t } = useLanguage();

  const handleDownload = (os: string) => {
    incrementDownload.mutate(os);
    toast.success(`Initiating ${OS_LABELS[os as OSType] ?? os} download...`);
  };

  const getDownloadCount = (os: string) => {
    if (!downloadStats) return "—";
    const key = `${os}Downloads` as keyof typeof downloadStats;
    const val = downloadStats[key];
    const num = Number(val);
    return num > 1000 ? `${(num / 1000).toFixed(1)}K` : String(num);
  };

  return (
    <section id="setup" className="py-24 relative overflow-hidden">
      <style>{`
        @keyframes osCorner_android {
          0%, 100% { filter: drop-shadow(0 0 3px #00FF88) drop-shadow(0 0 6px #00CC44); opacity: 0.55; }
          50% { filter: drop-shadow(0 0 6px #00CC44) drop-shadow(0 0 12px #00FF88); opacity: 0.85; }
        }
        @keyframes osCorner_windows {
          0%, 100% { filter: drop-shadow(0 0 3px #0078FF) drop-shadow(0 0 6px #00BFFF); opacity: 0.55; }
          50% { filter: drop-shadow(0 0 6px #00BFFF) drop-shadow(0 0 12px #0078FF); opacity: 0.85; }
        }
        @keyframes osCorner_macos {
          0%, 100% { filter: drop-shadow(0 0 3px #B0C0D0) drop-shadow(0 0 6px #CCCCCC); opacity: 0.5; }
          50% { filter: drop-shadow(0 0 6px #DDDDDD) drop-shadow(0 0 12px #E8E8E8); opacity: 0.8; }
        }
        @keyframes osCorner_linux {
          0%, 100% { filter: drop-shadow(0 0 3px #FF6A00) drop-shadow(0 0 6px #FFD700); opacity: 0.55; }
          50% { filter: drop-shadow(0 0 6px #FFD700) drop-shadow(0 0 12px #FF6A00); opacity: 0.85; }
        }
        [data-ocid="setup.android.tab"][data-state="active"] {
          background: linear-gradient(135deg, #00FF88, #00CC44) !important;
          color: #000 !important;
          box-shadow: 0 0 14px rgba(0,255,136,0.4), 0 3px 10px rgba(0,204,68,0.25) !important;
          border-color: #00FF88 !important;
          transform: translateY(-1px);
        }
        [data-ocid="setup.windows.tab"][data-state="active"] {
          background: linear-gradient(135deg, #0078FF, #00BFFF) !important;
          color: #fff !important;
          box-shadow: 0 0 14px rgba(0,120,255,0.4), 0 3px 10px rgba(0,191,255,0.25) !important;
          border-color: #0078FF !important;
          transform: translateY(-1px);
        }
        [data-ocid="setup.macos.tab"][data-state="active"] {
          background: linear-gradient(135deg, #C8C8C8, #FFFFFF) !important;
          color: #000 !important;
          box-shadow: 0 0 14px rgba(220,220,220,0.35), 0 3px 10px rgba(200,200,200,0.25) !important;
          border-color: #E0E0E0 !important;
          transform: translateY(-1px);
        }
        [data-ocid="setup.linux.tab"][data-state="active"] {
          background: linear-gradient(135deg, #FF6A00, #FFD700) !important;
          color: #000 !important;
          box-shadow: 0 0 14px rgba(255,106,0,0.4), 0 3px 10px rgba(255,215,0,0.25) !important;
          border-color: #FF6A00 !important;
          transform: translateY(-1px);
        }
      `}</style>
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan/30 to-transparent" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <span className="inline-block text-sm font-mono font-semibold text-cyan uppercase tracking-widest mb-4">
            {t.setup.sectionLabel}
          </span>
          <h2 className="font-display font-black text-4xl sm:text-5xl mb-4">
            {t.setup.sectionTitle1}
            <span className="text-cyan text-glow-cyan">
              {t.setup.sectionTitle2}
            </span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            {t.setup.sectionDesc}
          </p>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Tabs defaultValue="android">
            {/* Pill-shaped glowing tab row */}
            <TabsList className="flex flex-wrap gap-3 justify-center mb-8 bg-transparent border-0 p-0 h-auto">
              {(["android", "windows", "macos", "linux"] as const).map((os) => {
                const Icon = OS_ICONS[os];
                return (
                  <TabsTrigger
                    key={os}
                    value={os}
                    data-ocid={`setup.${os}.tab`}
                    className="flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold border transition-all duration-200 data-[state=inactive]:bg-muted/30 data-[state=inactive]:text-muted-foreground data-[state=inactive]:border-border data-[state=inactive]:shadow-none"
                  >
                    <Icon className="w-4 h-4" />
                    {OS_LABELS[os]}
                  </TabsTrigger>
                );
              })}
            </TabsList>

            {(["android", "windows", "macos", "linux"] as const).map((os) => {
              const Icon = OS_ICONS[os];
              const stepsData =
                os === "android"
                  ? ANDROID_STEPS
                  : t.setup[os as "windows" | "macos" | "linux"].steps;
              const cmdsData = STEP_COMMANDS[os];
              return (
                <TabsContent key={os} value={os}>
                  <div className="relative">
                    {/* OS-specific spinning corner glows */}
                    <OSCornerGlow os={os} position="tl" animDelay="0s" />
                    <OSCornerGlow os={os} position="tr" animDelay="0.8s" />
                    <OSCornerGlow os={os} position="br" animDelay="1.6s" />
                    <OSCornerGlow os={os} position="bl" animDelay="2.4s" />
                    <div className="rounded-xl border border-border bg-card overflow-hidden">
                      {/* OS Header */}
                      <div className="flex items-center justify-between p-5 border-b border-border bg-accent/30">
                        <div className="flex items-center gap-3">
                          <Icon className="w-5 h-5 text-cyan" />
                          <div>
                            <h3 className="font-bold text-foreground">
                              {OS_LABELS[os]} Installation
                            </h3>
                            <p className="text-xs text-muted-foreground">
                              <span className="font-mono text-cyan">
                                {getDownloadCount(os)}
                              </span>{" "}
                              {t.setup.downloads}
                            </p>
                          </div>
                        </div>
                        <Button
                          onClick={() => handleDownload(os)}
                          disabled={incrementDownload.isPending}
                          className="bg-cyan text-background hover:bg-cyan-bright shadow-glow-sm font-semibold"
                          size="sm"
                        >
                          <Download className="w-4 h-4 mr-2" />
                          {t.setup.download}
                          <Badge
                            variant="secondary"
                            className="ml-2 bg-background/30 text-background text-xs"
                          >
                            {t.setup.free}
                          </Badge>
                        </Button>
                      </div>

                      {/* Steps */}
                      <div className="p-6">
                        {stepsData.map((step, idx) => (
                          <InstallStep
                            key={step.title}
                            number={idx + 1}
                            title={step.title}
                            commands={
                              cmdsData[idx]?.commands?.length
                                ? cmdsData[idx].commands
                                : undefined
                            }
                            note={step.note ?? undefined}
                            copiedLabel={t.setup.copiedToClipboard}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </TabsContent>
              );
            })}
          </Tabs>
        </motion.div>
      </div>
    </section>
  );
}
