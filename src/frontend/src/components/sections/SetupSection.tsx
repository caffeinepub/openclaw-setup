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
  Wifi,
  WifiOff,
} from "lucide-react";
import { motion } from "motion/react";
import type React from "react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useDownloadsByOS, useIncrementDownload } from "../../hooks/useQueries";
import { useLanguage } from "../../i18n/LanguageContext";
import { AnimatedLobsterSVG } from "../LobsterPopupCard";

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

// Android-specific steps
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

// ─────────────────────────────────────────────────────────
// OpenClaw Terminal Component
// ─────────────────────────────────────────────────────────

type OCSubTab = "one-liner" | "npm" | "hackable" | "macos";

const OC_SUBTAB_LABELS: Record<OCSubTab, string> = {
  "one-liner": "One-liner",
  npm: "npm",
  hackable: "Hackable",
  macos: "macOS",
};

interface OCBadge {
  label: string;
  bg: string;
  text: string;
  border?: string;
}

const OC_SUBTAB_BADGES: Record<OCSubTab, OCBadge[]> = {
  "one-liner": [
    { label: "macOS/Linux", bg: "#ff5722", text: "#fff" },
    { label: "Windows", bg: "transparent", text: "#94a3b8", border: "#2a3444" },
    { label: "β BETA", bg: "transparent", text: "#22c55e", border: "#22c55e" },
  ],
  npm: [
    { label: "npm", bg: "#cb3837", text: "#fff" },
    { label: "pnpm", bg: "transparent", text: "#94a3b8", border: "#2a3444" },
    { label: "β BETA", bg: "transparent", text: "#22c55e", border: "#22c55e" },
  ],
  hackable: [
    { label: "installer", bg: "#ff5722", text: "#fff" },
    { label: "pnpm", bg: "transparent", text: "#94a3b8", border: "#2a3444" },
  ],
  macos: [
    {
      label: "Companion",
      bg: "transparent",
      text: "#94a3b8",
      border: "#2a3444",
    },
    { label: "β BETA", bg: "transparent", text: "#22c55e", border: "#22c55e" },
  ],
};

interface TerminalLine {
  type: "comment" | "command";
  text: string;
}

const OC_SUBTAB_CONTENT: Record<OCSubTab, TerminalLine[]> = {
  "one-liner": [
    {
      type: "comment",
      text: "# Living on the edge. Bugs are features you found first. 🦞",
    },
    {
      type: "command",
      text: "curl -fsSL https://openclaw.ai/install.sh | bash -s -- --beta",
    },
  ],
  npm: [
    {
      type: "comment",
      text: "# Install OpenClaw (beta) — Fresh from the lab 🧪",
    },
    { type: "command", text: "npm i -g openclaw@beta" },
    { type: "comment", text: "# Meet your experimental lobster" },
    { type: "command", text: "openclaw onboard" },
  ],
  hackable: [
    { type: "comment", text: "# For those who read source code for fun" },
    {
      type: "command",
      text: "curl -fsSL https://openclaw.ai/install.sh | bash -s -- --install-method git",
    },
  ],
  macos: [],
};

function OpenClawTerminal() {
  const [subTab, setSubTab] = useState<OCSubTab>("one-liner");
  const [copied, setCopied] = useState<string | null>(null);
  const [apiStatus, setApiStatus] = useState<"checking" | "online" | "offline">(
    "checking",
  );

  useEffect(() => {
    let cancelled = false;
    const check = async () => {
      try {
        await fetch("https://openclaw.ai", { method: "HEAD", mode: "no-cors" });
        if (!cancelled) setApiStatus("online");
      } catch {
        if (!cancelled) setApiStatus("offline");
      }
    };
    void check();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleCopy = (text: string) => {
    void navigator.clipboard.writeText(text);
    setCopied(text);
    setTimeout(() => setCopied(null), 2000);
    toast.success("Copied to clipboard!");
  };

  const lines = OC_SUBTAB_CONTENT[subTab];
  const commands = lines.filter((l) => l.type === "command").map((l) => l.text);

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{
        background: "#0d1117",
        border: "1px solid #1e2a3a",
        boxShadow:
          "0 0 40px rgba(255,69,0,0.12), 0 0 80px rgba(0,229,199,0.05)",
      }}
    >
      {/* Window chrome top bar */}
      <div
        className="flex items-center justify-between px-4 py-3"
        style={{
          background: "linear-gradient(180deg, #161b22 0%, #0d1117 100%)",
          borderBottom: "1px solid #1e2a3a",
        }}
      >
        {/* macOS dots */}
        <div className="flex items-center gap-1.5">
          <span
            className="w-3 h-3 rounded-full"
            style={{ background: "#ff5f57" }}
          />
          <span
            className="w-3 h-3 rounded-full"
            style={{ background: "#febc2e" }}
          />
          <span
            className="w-3 h-3 rounded-full"
            style={{ background: "#28c840" }}
          />
        </div>

        {/* Sub-tabs */}
        <div className="flex items-center gap-1">
          {(["one-liner", "npm", "hackable", "macos"] as OCSubTab[]).map(
            (tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setSubTab(tab)}
                className="px-3 py-1 text-xs font-semibold rounded-full transition-all"
                style={{
                  background: subTab === tab ? "#00e5c7" : "transparent",
                  color: subTab === tab ? "#000" : "#6b7a8d",
                  fontWeight: subTab === tab ? 700 : 400,
                }}
              >
                {OC_SUBTAB_LABELS[tab]}
              </button>
            ),
          )}
        </div>

        {/* Right side: API status + badges */}
        <div className="flex items-center gap-1.5">
          {/* API status */}
          {apiStatus === "online" && (
            <span
              className="flex items-center gap-1 text-[10px] mr-1"
              style={{ color: "#00e5c7" }}
            >
              <Wifi className="w-3 h-3" />
              Live
            </span>
          )}
          {apiStatus === "offline" && (
            <span
              className="flex items-center gap-1 text-[10px] mr-1"
              style={{ color: "#94a3b8" }}
            >
              <WifiOff className="w-3 h-3" />
              Offline
            </span>
          )}
          {OC_SUBTAB_BADGES[subTab].map((b) => (
            <span
              key={b.label}
              className="px-2 py-0.5 rounded text-[10px] font-bold"
              style={{
                background: b.bg,
                color: b.text,
                border: b.border ? `1px solid ${b.border}` : undefined,
              }}
            >
              {b.label}
            </span>
          ))}
        </div>
      </div>

      {/* Terminal body */}
      <div
        className="p-6 font-mono relative"
        style={{ background: "#0a0e13", minHeight: 160 }}
      >
        {subTab === "macos" ? (
          /* macOS companion app */
          <div className="flex flex-col items-center justify-center py-6 gap-4">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center"
              style={{
                background:
                  "radial-gradient(circle, rgba(255,69,0,0.15), rgba(0,0,0,0.5))",
                border: "1px solid rgba(255,69,0,0.3)",
                boxShadow: "0 0 20px rgba(255,69,0,0.2)",
              }}
            >
              <AnimatedLobsterSVG width={48} height={44} />
            </div>
            <div className="text-center">
              <h4 className="font-bold text-lg text-white mb-1">
                Companion App{" "}
                <span
                  className="text-xs font-normal px-1.5 py-0.5 rounded"
                  style={{
                    background: "rgba(34,197,94,0.15)",
                    color: "#22c55e",
                    border: "1px solid rgba(34,197,94,0.3)",
                  }}
                >
                  Beta
                </span>
              </h4>
              <p className="text-sm" style={{ color: "#6b7a8d" }}>
                Menubar access to your lobster.
                <br />
                Works great alongside the CLI.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                window.open("https://openclaw.ai/download/macos", "_blank");
                toast.success("Opening OpenClaw macOS download...");
              }}
              className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all"
              style={{
                background: "linear-gradient(135deg, #dc2626, #991b1b)",
                color: "#fff",
                boxShadow: "0 0 20px rgba(220,38,38,0.35)",
              }}
              data-ocid="setup.openclaw.download_button"
            >
              <Download className="w-4 h-4" />
              Download for macOS
            </button>
            <p className="text-[11px]" style={{ color: "#374151" }}>
              Requires macOS 15+ · Universal Binary
            </p>
          </div>
        ) : (
          /* Terminal lines */
          <div className="space-y-1.5">
            {lines.map((line, i) =>
              line.type === "comment" ? (
                <p
                  key={`${line.text}-${i}`}
                  className="text-sm italic"
                  style={{ color: "#6b7a8d" }}
                >
                  {line.text}
                </p>
              ) : (
                <div
                  key={`${line.text}-${i}`}
                  className="flex items-center gap-0 group relative"
                >
                  <span className="text-sm" style={{ color: "#ff7043" }}>
                    ${" "}
                  </span>
                  <code
                    className="text-sm font-bold flex-1"
                    style={{ color: "#00e5c7" }}
                  >
                    {line.text}
                  </code>
                  <button
                    type="button"
                    onClick={() => handleCopy(line.text)}
                    className="ml-3 p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all flex-shrink-0"
                    style={{
                      background: "rgba(255,255,255,0.06)",
                      color:
                        copied === line.text
                          ? "#22c55e"
                          : "rgba(255,255,255,0.4)",
                    }}
                    aria-label="Copy command"
                  >
                    {copied === line.text ? (
                      <Check className="w-3.5 h-3.5" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              ),
            )}
          </div>
        )}

        {/* Copy all button (bottom right) for multi-command tabs */}
        {commands.length > 1 && subTab !== "macos" && (
          <button
            type="button"
            onClick={() => handleCopy(commands.join("\n"))}
            className="absolute bottom-4 right-4 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition-all"
            style={{
              background: "rgba(0,229,199,0.08)",
              border: "1px solid rgba(0,229,199,0.2)",
              color: "#00e5c7",
            }}
          >
            {copied === commands.join("\n") ? (
              <Check className="w-3 h-3" />
            ) : (
              <Copy className="w-3 h-3" />
            )}
            Copy all
          </button>
        )}
      </div>

      {/* Bottom info bar */}
      <div
        className="flex items-center justify-between px-5 py-2.5"
        style={{
          background: "#0d1117",
          borderTop: "1px solid #1e2a3a",
        }}
      >
        <div className="flex items-center gap-2">
          <span className="flex items-center">
            <AnimatedLobsterSVG width={24} height={22} />
          </span>
          <span className="text-xs font-bold" style={{ color: "#ff7043" }}>
            openclaw.ai
          </span>
          <span className="text-[10px]" style={{ color: "#374151" }}>
            /install.sh · verified
          </span>
        </div>
        <a
          href="https://openclaw.ai"
          target="_blank"
          rel="noreferrer"
          className="text-[10px] transition-colors hover:opacity-80"
          style={{ color: "#00e5c7" }}
        >
          docs →
        </a>
      </div>
    </div>
  );
}

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
        [data-ocid="setup.openclaw.tab"][data-state="active"] {
          background: linear-gradient(135deg, #ff4500, #ff7043) !important;
          color: #fff !important;
          box-shadow: 0 0 14px rgba(255,69,0,0.5), 0 3px 10px rgba(255,112,67,0.3) !important;
          border-color: #ff4500 !important;
          transform: translateY(-1px);
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
          <Tabs defaultValue="openclaw">
            {/* Pill-shaped glowing tab row */}
            <TabsList className="flex flex-wrap gap-3 justify-center mb-8 bg-transparent border-0 p-0 h-auto">
              {/* OpenClaw tab - FIRST */}
              <TabsTrigger
                value="openclaw"
                data-ocid="setup.openclaw.tab"
                className="flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold border transition-all duration-200 data-[state=inactive]:bg-muted/30 data-[state=inactive]:text-muted-foreground data-[state=inactive]:border-border data-[state=inactive]:shadow-none"
              >
                <AnimatedLobsterSVG width={20} height={18} /> OpenClaw
              </TabsTrigger>

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

            {/* OpenClaw tab content */}
            <TabsContent value="openclaw">
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35 }}
              >
                {/* Promo header */}
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <h3 className="text-lg font-bold text-white">
                      <span className="flex items-center gap-2">
                        <AnimatedLobsterSVG width={22} height={20} /> OpenClaw
                        CLI
                      </span>
                    </h3>
                    <p className="text-sm" style={{ color: "#6b7a8d" }}>
                      Cross-platform AI claw engine · macOS · Linux · Windows
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      className="text-xs"
                      style={{
                        background: "rgba(255,69,0,0.15)",
                        color: "#ff7043",
                        border: "1px solid rgba(255,69,0,0.3)",
                      }}
                    >
                      β Beta
                    </Badge>
                    <Badge
                      className="text-xs"
                      style={{
                        background: "rgba(0,229,199,0.1)",
                        color: "#00e5c7",
                        border: "1px solid rgba(0,229,199,0.25)",
                      }}
                    >
                      Open Source
                    </Badge>
                  </div>
                </div>
                <OpenClawTerminal />

                {/* Integration callout */}
                <div
                  className="mt-4 rounded-xl p-4 flex flex-wrap gap-3 items-center"
                  style={{
                    background: "rgba(255,69,0,0.06)",
                    border: "1px solid rgba(255,69,0,0.15)",
                  }}
                >
                  <span
                    className="text-sm"
                    style={{ color: "rgba(255,255,255,0.6)" }}
                  >
                    Integrated with:
                  </span>
                  {["Android", "Windows", "macOS", "Linux"].map((p) => (
                    <span
                      key={p}
                      className="flex items-center gap-1 text-xs px-2 py-1 rounded-lg"
                      style={{
                        background: "rgba(0,229,199,0.08)",
                        border: "1px solid rgba(0,229,199,0.15)",
                        color: "#00e5c7",
                      }}
                    >
                      <Check className="w-3 h-3" />
                      {p}
                    </span>
                  ))}
                  <a
                    href="https://openclaw.ai"
                    target="_blank"
                    rel="noreferrer"
                    className="ml-auto text-xs font-semibold transition-opacity hover:opacity-70"
                    style={{ color: "#ff7043" }}
                  >
                    openclaw.ai →
                  </a>
                </div>
              </motion.div>
            </TabsContent>

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
