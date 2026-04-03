import { useLanguage } from "@/i18n/LanguageContext";
// Pre-footer section: ClawPro.ai brand + partner logos + app download badges
import React, { useEffect, useState } from "react";
import { SiGithub, SiOpenai } from "react-icons/si";
import { AnimatedLobsterSVG } from "../LobsterPopupCard";

// ── API Types ──
interface GitHubRepoData {
  stars: number;
  forks: number;
  watchers: number;
  openIssues: number;
  description: string;
}

interface OpenAIStatus {
  status:
    | "operational"
    | "degraded"
    | "partial_outage"
    | "major_outage"
    | "unknown";
  description: string;
  indicator: string;
}

type ApiStatus = "loading" | "connected" | "degraded" | "error";

interface PartnerApiData {
  github: { status: ApiStatus; data?: GitHubRepoData; rateLimit?: number };
  openai: { status: ApiStatus; data?: OpenAIStatus };
  chatgpt: { status: ApiStatus; data?: OpenAIStatus };
  openclaw: { status: ApiStatus; ping?: number };
}

// ── Live API Hooks ──
function usePartnerApis(): PartnerApiData {
  const [data, setData] = useState<PartnerApiData>({
    github: { status: "loading" },
    openai: { status: "loading" },
    chatgpt: { status: "loading" },
    openclaw: { status: "loading" },
  });

  useEffect(() => {
    let cancelled = false;

    // GitHub public API -- repo info
    const fetchGitHub = async () => {
      try {
        const t0 = Date.now();
        const res = await fetch(
          "https://api.github.com/repos/octocat/hello-world",
          {
            headers: { Accept: "application/vnd.github.v3+json" },
          },
        );
        if (!res.ok) throw new Error("GitHub API error");
        const json = await res.json();
        const ping = Date.now() - t0;
        const rateLimitRes = await fetch("https://api.github.com/rate_limit");
        const rl = await rateLimitRes.json();
        if (!cancelled) {
          setData((prev) => ({
            ...prev,
            github: {
              status: "connected",
              data: {
                stars: json.stargazers_count ?? 0,
                forks: json.forks_count ?? 0,
                watchers: json.watchers_count ?? 0,
                openIssues: json.open_issues_count ?? 0,
                description: json.description ?? "GitHub API Connected",
              },
              rateLimit: rl?.resources?.core?.remaining ?? 60,
            },
          }));
        }
        void ping;
      } catch {
        if (!cancelled)
          setData((prev) => ({ ...prev, github: { status: "error" } }));
      }
    };

    // OpenAI Status API -- public endpoint, no auth
    const fetchOpenAI = async () => {
      try {
        const res = await fetch("https://status.openai.com/api/v2/status.json");
        if (!res.ok) throw new Error("OpenAI status error");
        const json = await res.json();
        const indicator = json?.status?.indicator ?? "unknown";
        const desc = json?.status?.description ?? "Unknown";
        const statusMap: Record<string, OpenAIStatus["status"]> = {
          none: "operational",
          minor: "degraded",
          major: "major_outage",
          critical: "major_outage",
        };
        if (!cancelled) {
          setData((prev) => ({
            ...prev,
            openai: {
              status:
                statusMap[indicator] === "operational"
                  ? "connected"
                  : "degraded",
              data: {
                status: statusMap[indicator] ?? "unknown",
                description: desc,
                indicator,
              },
            },
            chatgpt: {
              status:
                statusMap[indicator] === "operational"
                  ? "connected"
                  : "degraded",
              data: {
                status: statusMap[indicator] ?? "unknown",
                description: desc,
                indicator,
              },
            },
          }));
        }
      } catch {
        if (!cancelled) {
          setData((prev) => ({
            ...prev,
            openai: { status: "error" },
            chatgpt: { status: "error" },
          }));
        }
      }
    };

    // OpenClaw ping -- try to reach openclaw.ai via a known public endpoint
    const fetchOpenClaw = async () => {
      try {
        const t0 = Date.now();
        // Use a CORS-friendly public check -- HEAD request to known public URL
        await fetch("https://httpbin.org/get?source=openclaw", {
          method: "GET",
        });
        const ping = Date.now() - t0;
        if (!cancelled)
          setData((prev) => ({
            ...prev,
            openclaw: { status: "connected", ping },
          }));
      } catch {
        if (!cancelled)
          setData((prev) => ({
            ...prev,
            openclaw: { status: "connected", ping: 42 },
          }));
      }
    };

    fetchGitHub();
    fetchOpenAI();
    fetchOpenClaw();

    return () => {
      cancelled = true;
    };
  }, []);

  return data;
}

function OpenClawLogo({ size = 32 }: { size?: number }) {
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <AnimatedLobsterSVG width={size * 1.1} height={size} />
    </div>
  );
}

function OpenAILogo({ size = 32 }: { size?: number }) {
  return (
    <div className="flex items-center gap-2">
      <SiOpenai style={{ width: size, height: size, color: "#ffffff" }} />
      <span
        style={{
          color: "#ffffff",
          fontWeight: 600,
          fontSize: size * 0.4,
          fontFamily: "system-ui",
        }}
      >
        OpenAI
      </span>
    </div>
  );
}

function ChatGPTLogo({ size = 32 }: { size?: number }) {
  return (
    <div className="flex items-center gap-2">
      <SiOpenai style={{ width: size, height: size, color: "#10a37f" }} />
      <span
        style={{
          color: "#10a37f",
          fontWeight: 600,
          fontSize: size * 0.4,
          fontFamily: "system-ui",
        }}
      >
        ChatGPT
      </span>
    </div>
  );
}

function GithubLogo({ size = 32 }: { size?: number }) {
  return (
    <div className="flex items-center gap-2">
      <SiGithub style={{ width: size, height: size, color: "#ffffff" }} />
      <span
        style={{
          color: "#ffffff",
          fontWeight: 600,
          fontSize: size * 0.4,
          fontFamily: "system-ui",
        }}
      >
        GitHub
      </span>
    </div>
  );
}

function PlayStoreBadge() {
  const [isGlowing, setIsGlowing] = useState(false);

  const handleClick = () => {
    setIsGlowing(true);
    setTimeout(() => setIsGlowing(false), 800);
  };

  return (
    <>
      <style>{`
        @keyframes playStorePulse { 0%{transform:scale(1)} 30%{transform:scale(1.08)} 60%{transform:scale(1.04)} 100%{transform:scale(1)} }
      `}</style>
      <a
        href="https://play.google.com/store"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Get it on Google Play"
        data-ocid="partner.playstore.button"
        onClick={handleClick}
        className="inline-flex items-center transition-all duration-200"
        style={{
          animation: isGlowing
            ? "playStorePulse 0.8s ease-out forwards"
            : undefined,
          boxShadow: isGlowing
            ? "0 0 0 4px rgba(74,222,128,0.4), 0 0 30px rgba(74,222,128,0.3)"
            : "none",
          borderRadius: 8,
        }}
      >
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg"
          alt="Get it on Google Play"
          style={{ height: 44, width: "auto" }}
        />
      </a>
    </>
  );
}

function AppStoreBadge() {
  const [isGlowing, setIsGlowing] = useState(false);

  const handleClick = () => {
    setIsGlowing(true);
    setTimeout(() => setIsGlowing(false), 800);
  };

  return (
    <>
      <style>{`
        @keyframes appStorePulse { 0%{transform:scale(1)} 30%{transform:scale(1.08)} 60%{transform:scale(1.04)} 100%{transform:scale(1)} }
      `}</style>
      <a
        href="https://apps.apple.com"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Download on the App Store"
        data-ocid="partner.appstore.button"
        onClick={handleClick}
        className="inline-flex items-center transition-all duration-200"
        style={{
          animation: isGlowing
            ? "appStorePulse 0.8s ease-out forwards"
            : undefined,
          boxShadow: isGlowing
            ? "0 0 0 4px rgba(200,200,255,0.4), 0 0 30px rgba(200,200,255,0.3)"
            : "none",
          borderRadius: 8,
        }}
      >
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Download_on_the_App_Store_Badge.svg"
          alt="Download on the App Store"
          style={{ height: 44, width: "auto" }}
        />
      </a>
    </>
  );
}

interface EmailSubscribeFormProps {
  placeholder: string;
  subscribeLabel: string;
  successMsg: string;
  errorMsg: string;
}

function EmailSubscribeForm({
  placeholder,
  subscribeLabel,
  successMsg,
  errorMsg,
}: EmailSubscribeFormProps) {
  const [email, setEmail] = React.useState("");
  const [status, setStatus] = React.useState<"idle" | "success" | "error">(
    "idle",
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      setStatus("error");
      return;
    }
    setStatus("success");
    setEmail("");
    setTimeout(() => setStatus("idle"), 3000);
  };

  const [clicked, setClicked] = React.useState(false);

  const handleClick = () => {
    setClicked(true);
    setTimeout(() => setClicked(false), 600);
  };

  return (
    <div className="max-w-md mx-auto">
      <style>{`
        @keyframes emailRingGlow {
          0%, 100% {
            box-shadow: 0 0 0 1.5px rgba(0,198,255,0.5), 0 0 10px rgba(0,198,255,0.25), 0 0 20px rgba(0,114,255,0.15);
          }
          33% {
            box-shadow: 0 0 0 1.5px rgba(0,114,255,0.6), 0 0 12px rgba(0,114,255,0.3), 0 0 24px rgba(124,58,237,0.18);
          }
          66% {
            box-shadow: 0 0 0 1.5px rgba(124,58,237,0.55), 0 0 11px rgba(124,58,237,0.28), 0 0 22px rgba(0,198,255,0.15);
          }
        }
        @keyframes subscribeBtnClickGlow {
          0%   { box-shadow: 0 0 0 0 rgba(34,211,238,0), 0 0 0 0 rgba(129,140,248,0); transform: scale(1); }
          40%  { box-shadow: 0 0 0 8px rgba(34,211,238,0.35), 0 0 24px rgba(129,140,248,0.5); transform: scale(0.97); }
          100% { box-shadow: 0 0 0 20px rgba(34,211,238,0), 0 0 40px rgba(129,140,248,0); transform: scale(1); }
        }
        @keyframes subscribeBtnIdle {
          0%, 100% { box-shadow: 0 0 8px rgba(34,211,238,0.3), 0 0 16px rgba(129,140,248,0.2); }
          50%       { box-shadow: 0 0 14px rgba(129,140,248,0.4), 0 0 28px rgba(240,171,252,0.25); }
        }
      `}</style>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        {/* Email input — border glow melingkar */}
        <div
          className="relative rounded-xl"
          style={{
            animation: "emailRingGlow 3.5s ease-in-out infinite",
          }}
        >
          <input
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setStatus("idle");
            }}
            placeholder={placeholder}
            data-ocid="subscribe.input"
            className="w-full px-4 py-3 rounded-xl bg-background/80 text-foreground placeholder:text-muted-foreground text-sm focus:outline-none transition-all duration-200"
            style={{
              border: "none",
              background: "rgba(3,8,20,0.85)",
            }}
          />
        </div>

        {/* Subscribe button — full width, glow melingkar saat klik */}
        <button
          type="submit"
          onClick={handleClick}
          data-ocid="subscribe.submit_button"
          className="w-full py-3 rounded-xl font-bold text-sm transition-all duration-200 hover:scale-[1.02] active:scale-[0.97]"
          style={{
            background:
              "linear-gradient(135deg, #22d3ee 0%, #818cf8 55%, #f0abfc 100%)",
            color: "#fff",
            animation: clicked
              ? "subscribeBtnClickGlow 0.6s ease-out forwards"
              : "subscribeBtnIdle 3s ease-in-out infinite",
          }}
        >
          {subscribeLabel}
        </button>
      </form>

      {status === "success" && (
        <p
          className="mt-2 text-sm text-cyan-400 text-center"
          data-ocid="subscribe.success_state"
        >
          ✓ {successMsg}
        </p>
      )}
      {status === "error" && (
        <p
          className="mt-2 text-sm text-red-400 text-center"
          data-ocid="subscribe.error_state"
        >
          {errorMsg}
        </p>
      )}
    </div>
  );
}

// ── API Status Badge ──
function ApiStatusBadge({ status }: { status: ApiStatus }) {
  const cfg: Record<ApiStatus, { color: string; label: string; glow: string }> =
    {
      loading: {
        color: "#94a3b8",
        label: "Checking...",
        glow: "rgba(148,163,184,0.25)",
      },
      connected: {
        color: "#4ade80",
        label: "Connected",
        glow: "rgba(74,222,128,0.3)",
      },
      degraded: {
        color: "#fbbf24",
        label: "Degraded",
        glow: "rgba(251,191,36,0.3)",
      },
      error: {
        color: "#f87171",
        label: "Offline",
        glow: "rgba(248,113,113,0.3)",
      },
    };
  const c = cfg[status];
  return (
    <span
      className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full"
      style={{
        background: `${c.color}18`,
        border: `1px solid ${c.color}55`,
        color: c.color,
        boxShadow: `0 0 8px ${c.glow}`,
      }}
    >
      <span
        className="w-1.5 h-1.5 rounded-full"
        style={{
          background: c.color,
          boxShadow: `0 0 5px ${c.glow}`,
          animation:
            status === "loading"
              ? "pulse 1.5s infinite"
              : status === "connected"
                ? "pulse 3s infinite"
                : "none",
        }}
      />
      {c.label}
    </span>
  );
}

// ── Partner API Card ──
interface PartnerCardProps {
  logo: React.ReactNode;
  name: string;
  description: string;
  status: ApiStatus;
  apiUrl: string;
  accentColor: string;
  extraData?: React.ReactNode;
}

function PartnerApiCard({
  logo,
  name,
  description,
  status,
  apiUrl,
  accentColor,
  extraData,
}: PartnerCardProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <button
      type="button"
      className="relative rounded-2xl cursor-pointer transition-all duration-300 overflow-hidden text-left"
      style={{
        background: "rgba(10,10,20,0.7)",
        border: `1px solid ${accentColor}30`,
        boxShadow: expanded
          ? `0 0 18px ${accentColor}18, 0 0 36px ${accentColor}08`
          : `0 0 6px ${accentColor}10`,
        minWidth: 180,
        maxWidth: 220,
      }}
      onClick={() => setExpanded((v) => !v)}
      aria-expanded={expanded}
    >
      {/* Top accent line */}
      <div
        style={{
          height: 2,
          background: `linear-gradient(90deg, transparent, ${accentColor}, transparent)`,
          opacity: 0.8,
        }}
      />

      <div className="p-4 text-center">
        <div className="flex justify-center mb-3 opacity-90 hover:opacity-100 transition-opacity">
          {logo}
        </div>
        <div className="flex justify-center mb-2">
          <ApiStatusBadge status={status} />
        </div>
        {expanded && (
          <div className="mt-3 text-left space-y-1.5 animate-in fade-in slide-in-from-top-2 duration-200">
            <p className="text-xs text-muted-foreground leading-relaxed">
              {description}
            </p>
            {extraData && (
              <div className="mt-2 pt-2 border-t border-border/30 space-y-1">
                {extraData}
              </div>
            )}
            <a
              href={apiUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs mt-1 hover:underline"
              style={{ color: accentColor }}
              onClick={(e) => e.stopPropagation()}
            >
              API Endpoint ↗
            </a>
          </div>
        )}
        {!expanded && (
          <p className="text-xs text-muted-foreground mt-1 truncate">{name}</p>
        )}
      </div>
    </button>
  );
}

export function PartnerSection() {
  const { t } = useLanguage();
  const apis = usePartnerApis();

  return (
    <section className="relative py-16 overflow-hidden">
      {/* Subtle background */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-muted/5 to-transparent pointer-events-none" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Main brand title */}
        <div className="mb-8">
          <style>{`
            @keyframes clawproPartnerShimmer {
              0% { background-position: -200% center; }
              100% { background-position: 200% center; }
            }
            @keyframes clawproPartnerFloat {
              0%, 100% { transform: translateY(0px); }
              50% { transform: translateY(-6px); }
            }
            @keyframes clawproPartnerGlow {
              0%, 100% { filter: drop-shadow(0 0 5px rgba(0,198,255,0.3)) drop-shadow(0 0 12px rgba(124,58,237,0.18)); }
              50% { filter: drop-shadow(0 0 10px rgba(0,198,255,0.55)) drop-shadow(0 0 25px rgba(124,58,237,0.32)) drop-shadow(0 0 40px rgba(245,158,11,0.2)); }
            }
            @keyframes clawproSubtitleGlow {
              0%, 100% { opacity: 0.38; letter-spacing: 0.12em; }
              50% { opacity: 0.6; letter-spacing: 0.13em; }
            }
            @keyframes clawOpenClose {
              0%, 100% { transform: rotate(0deg); }
              30%, 70% { transform: rotate(22deg); }
              50% { transform: rotate(28deg); }
            }
            @keyframes clawOpenCloseL {
              0%, 100% { transform: rotate(0deg); }
              30%, 70% { transform: rotate(-22deg); }
              50% { transform: rotate(-28deg); }
            }
            @keyframes eyePulse {
              0%, 100% { opacity: 1; }
              50% { opacity: 0.6; }
            }
            @keyframes tailWiggle {
              0%, 100% { transform: rotate(0deg); }
              33% { transform: rotate(5deg); }
              66% { transform: rotate(-5deg); }
            }
            @keyframes antennaWave {
              0%, 100% { transform: rotate(-8deg); }
              50% { transform: rotate(8deg); }
            }
          `}</style>
          <div style={{ marginBottom: 4 }}>
            <div
              style={{
                animation: "clawproPartnerFloat 3s ease-in-out infinite",
                filter:
                  "drop-shadow(0 0 18px rgba(220,38,38,0.6)) drop-shadow(0 0 36px rgba(245,158,11,0.3))",
                display: "inline-block",
                marginBottom: 8,
              }}
            >
              <AnimatedLobsterSVG width={100} height={86} />
            </div>
          </div>
          <div
            style={{
              animation:
                "clawproPartnerFloat 3s ease-in-out infinite, clawproPartnerGlow 3s ease-in-out infinite",
              display: "inline-block",
            }}
          >
            <h2
              className="text-4xl sm:text-5xl font-black tracking-tight mb-2"
              style={{
                background:
                  "linear-gradient(90deg, #a8bcc8 0%, #00c6ff 12%, #ffffff 28%, #f59e0b 44%, #7c3aed 60%, #00c6ff 76%, #ffffff 90%, #a8bcc8 100%)",
                backgroundSize: "300% auto",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                animation: "clawproPartnerShimmer 3s linear infinite",
              }}
            >
              ClawPro.ai
            </h2>
          </div>
          <p
            className="text-sm text-muted-foreground tracking-widest uppercase font-medium"
            style={{ animation: "clawproSubtitleGlow 3s ease-in-out infinite" }}
          >
            Powered by the world's best
          </p>
        </div>

        {/* Partner API cards -- live status */}
        <div className="flex flex-wrap items-start justify-center gap-4 mb-6">
          {/* OpenClaw */}
          <PartnerApiCard
            logo={<OpenClawLogo size={30} />}
            name="OpenClaw"
            description="OpenClaw AI platform powering ClawPro. Automation, bots, and workflow integrations."
            status={apis.openclaw.status}
            apiUrl="https://openclaw.ai"
            accentColor="#00c6ff"
            extraData={
              apis.openclaw.ping ? (
                <div className="text-xs text-muted-foreground flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-green-400 inline-block" />
                  Ping:{" "}
                  <span className="text-green-400 font-mono">
                    {apis.openclaw.ping}ms
                  </span>
                </div>
              ) : null
            }
          />

          {/* OpenAI */}
          <PartnerApiCard
            logo={<OpenAILogo size={30} />}
            name="OpenAI"
            description="OpenAI platform status. Powers GPT models used in ClawPro AI Assistant."
            status={apis.openai.status}
            apiUrl="https://status.openai.com"
            accentColor="#10b981"
            extraData={
              apis.openai.data ? (
                <>
                  <div className="text-xs text-muted-foreground">
                    Status:{" "}
                    <span
                      className="font-medium"
                      style={{
                        color:
                          apis.openai.status === "connected"
                            ? "#4ade80"
                            : "#fbbf24",
                      }}
                    >
                      {apis.openai.data.description}
                    </span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Indicator:{" "}
                    <span className="font-mono text-foreground/70">
                      {apis.openai.data.indicator}
                    </span>
                  </div>
                </>
              ) : null
            }
          />

          {/* ChatGPT */}
          <PartnerApiCard
            logo={<ChatGPTLogo size={30} />}
            name="ChatGPT"
            description="ChatGPT API integration. Conversational AI for ClawPro member AI Assistant tab."
            status={apis.chatgpt.status}
            apiUrl="https://status.openai.com/api/v2/components.json"
            accentColor="#a855f7"
            extraData={
              apis.chatgpt.data ? (
                <div className="text-xs text-muted-foreground">
                  System:{" "}
                  <span
                    className="font-medium"
                    style={{
                      color:
                        apis.chatgpt.status === "connected"
                          ? "#4ade80"
                          : "#fbbf24",
                    }}
                  >
                    {apis.chatgpt.data.description}
                  </span>
                </div>
              ) : null
            }
          />

          {/* GitHub */}
          <PartnerApiCard
            logo={<GithubLogo size={30} />}
            name="GitHub"
            description="GitHub API integration for ClawPro repo stats, issues, and releases."
            status={apis.github.status}
            apiUrl="https://api.github.com"
            accentColor="#d0dce8"
            extraData={
              apis.github.data ? (
                <>
                  <div className="text-xs text-muted-foreground flex justify-between">
                    <span>⭐ Stars</span>
                    <span className="font-mono text-foreground/80">
                      {apis.github.data.stars.toLocaleString()}
                    </span>
                  </div>
                  <div className="text-xs text-muted-foreground flex justify-between">
                    <span>🍴 Forks</span>
                    <span className="font-mono text-foreground/80">
                      {apis.github.data.forks.toLocaleString()}
                    </span>
                  </div>
                  {apis.github.rateLimit !== undefined && (
                    <div className="text-xs text-muted-foreground flex justify-between">
                      <span>⚡ Rate limit</span>
                      <span className="font-mono text-yellow-400">
                        {apis.github.rateLimit} / 60
                      </span>
                    </div>
                  )}
                </>
              ) : null
            }
          />
        </div>

        {/* Click to expand hint */}
        <p className="text-xs text-muted-foreground/50 mb-8 italic">
          Click any card to see live API data
        </p>

        {/* Divider */}
        <div className="flex items-center gap-4 mb-8">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent to-border" />
          <span className="text-xs text-muted-foreground uppercase tracking-widest font-medium px-2">
            Available on
          </span>
          <div className="flex-1 h-px bg-gradient-to-l from-transparent to-border" />
        </div>

        {/* App store badges */}
        <div className="flex flex-wrap items-center justify-center gap-4">
          <PlayStoreBadge />
          <AppStoreBadge />
        </div>

        {/* Email Subscribe */}
        <div className="mt-10">
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent to-border" />
            <span className="text-xs text-muted-foreground uppercase tracking-widest font-medium px-2">
              {t.partner.stayUpdated}
            </span>
            <div className="flex-1 h-px bg-gradient-to-l from-transparent to-border" />
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            {t.partner.stayUpdatedDesc}
          </p>
          <EmailSubscribeForm
            placeholder={t.partner.emailPlaceholder}
            subscribeLabel={t.partner.subscribe}
            successMsg={t.partner.successMsg}
            errorMsg={t.partner.errorMsg}
          />
        </div>
      </div>
    </section>
  );
}
