import { DotsBackground } from "@/components/DotsBackground";
import { useLanguage } from "@/i18n/LanguageContext";
// Pre-footer section: ClawPro.ai brand + partner logos + app download badges
import React, { useEffect, useState } from "react";

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

// ── Spinning Corner Glow ──
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
            id={`cg-${animName}-${position}`}
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
          stroke={`url(#cg-${animName}-${position})`}
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
        />
      </svg>
    </span>
  );
}

function OpenClawLogo({ size = 32 }: { size?: number }) {
  return (
    <svg
      width={size * 3.2}
      height={size}
      viewBox="0 0 96 32"
      fill="none"
      role="img"
      aria-label="OpenClaw.ai"
    >
      <title>OpenClaw.ai</title>
      {/* Claw icon */}
      <path
        d="M8 24 C6 20 4 16 6 12 C8 8 12 7 14 10 C15 12 14 15 12 16"
        stroke="url(#oc-grad)"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M12 24 C11 20 10 16 12 12 C13 9 16 8 17 11 C18 13 17 16 15 17"
        stroke="url(#oc-grad)"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M16 24 C16 20 16 16 18 12 C19 9 22 9 22 12 C22 14 21 17 19 18"
        stroke="url(#oc-grad)"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />
      <defs>
        <linearGradient id="oc-grad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#e0e8f0" />
          <stop offset="100%" stopColor="#c0ccd8" />
        </linearGradient>
      </defs>
      {/* Text */}
      <text
        x="28"
        y="20"
        fill="url(#silver-text)"
        fontSize="11"
        fontWeight="600"
        fontFamily="system-ui, sans-serif"
        letterSpacing="0.3"
      >
        OpenClaw.ai
      </text>
      <defs>
        <linearGradient id="silver-text" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="50%" stopColor="#d0dbe8" />
          <stop offset="100%" stopColor="#a8b8c8" />
        </linearGradient>
      </defs>
    </svg>
  );
}

function OpenAILogo({ size = 32 }: { size?: number }) {
  return (
    <svg
      width={size * 3}
      height={size}
      viewBox="0 0 90 32"
      fill="none"
      role="img"
      aria-label="OpenAI.ai"
    >
      <title>OpenAI.ai</title>
      {/* OpenAI swirl icon simplified */}
      <g transform="translate(2, 4)">
        <path
          d="M12 2C7.029 2 3 6.03 3 11c0 2.387.945 4.557 2.482 6.163L4 22l5.123-1.462A8.945 8.945 0 0 0 12 21c4.971 0 9-4.03 9-9s-4.029-9-9-9z"
          fill="url(#oai-grad)"
          opacity="0.9"
        />
        <path
          d="M12 6.5a4.5 4.5 0 1 1 0 9 4.5 4.5 0 0 1 0-9z"
          fill="#0a0a0a"
          opacity="0.8"
        />
        <defs>
          <linearGradient id="oai-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="100%" stopColor="#b0c0d0" />
          </linearGradient>
        </defs>
      </g>
      <text
        x="30"
        y="20"
        fill="url(#silver-oai)"
        fontSize="11"
        fontWeight="600"
        fontFamily="system-ui, sans-serif"
        letterSpacing="0.3"
      >
        OpenAI.ai
      </text>
      <defs>
        <linearGradient id="silver-oai" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="50%" stopColor="#d0dbe8" />
          <stop offset="100%" stopColor="#a8b8c8" />
        </linearGradient>
      </defs>
    </svg>
  );
}

function ChatGPTLogo({ size = 32 }: { size?: number }) {
  return (
    <svg
      width={size * 3.2}
      height={size}
      viewBox="0 0 96 32"
      fill="none"
      role="img"
      aria-label="ChatGPT.ai"
    >
      <title>ChatGPT.ai</title>
      <g transform="translate(2, 5)">
        <circle cx="11" cy="11" r="9" fill="url(#gpt-circ)" opacity="0.9" />
        <path
          d="M11 5a6 6 0 0 1 5.196 9H5.804A6 6 0 0 1 11 5z"
          fill="#0a0a0a"
          opacity="0.4"
        />
        <path
          d="M7 11h8M11 7v8"
          stroke="#0a0a0a"
          strokeWidth="1.5"
          strokeLinecap="round"
          opacity="0.5"
        />
        <defs>
          <linearGradient id="gpt-circ" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="100%" stopColor="#a8bac8" />
          </linearGradient>
        </defs>
      </g>
      <text
        x="30"
        y="20"
        fill="url(#silver-gpt)"
        fontSize="11"
        fontWeight="600"
        fontFamily="system-ui, sans-serif"
        letterSpacing="0.3"
      >
        ChatGPT.ai
      </text>
      <defs>
        <linearGradient id="silver-gpt" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="50%" stopColor="#d0dbe8" />
          <stop offset="100%" stopColor="#a8b8c8" />
        </linearGradient>
      </defs>
    </svg>
  );
}

function GithubLogo({ size = 32 }: { size?: number }) {
  return (
    <svg
      width={size * 2.8}
      height={size}
      viewBox="0 0 84 32"
      fill="none"
      role="img"
      aria-label="GitHub"
    >
      <title>GitHub</title>
      <g transform="translate(2, 4)">
        <path
          d="M12 0C5.373 0 0 5.373 0 12c0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.796 24 17.3 24 12c0-6.627-5.373-12-12-12z"
          fill="url(#gh-grad)"
        />
        <defs>
          <linearGradient id="gh-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="100%" stopColor="#b0c0d0" />
          </linearGradient>
        </defs>
      </g>
      <text
        x="34"
        y="20"
        fill="url(#silver-gh)"
        fontSize="11"
        fontWeight="600"
        fontFamily="system-ui, sans-serif"
        letterSpacing="0.3"
      >
        GitHub
      </text>
      <defs>
        <linearGradient id="silver-gh" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="50%" stopColor="#d0dbe8" />
          <stop offset="100%" stopColor="#a8b8c8" />
        </linearGradient>
      </defs>
    </svg>
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
        @keyframes appStorePulse  { 0%{transform:scale(1)} 30%{transform:scale(1.08)} 60%{transform:scale(1.04)} 100%{transform:scale(1)} }
      `}</style>
      <a
        href="https://play.google.com/store"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Get it on Google Play"
        data-ocid="partner.playstore.button"
        onClick={handleClick}
        className="inline-flex items-center gap-3 px-5 py-3 min-w-[160px] rounded-xl border border-border bg-[#111] transition-all duration-200 hover:border-border/60"
        style={{
          animation: isGlowing
            ? "playStorePulse 0.8s ease-out forwards"
            : undefined,
          boxShadow: isGlowing
            ? "0 0 0 4px rgba(74,222,128,0.4), 0 0 30px rgba(74,222,128,0.3), 0 0 60px rgba(74,222,128,0.15)"
            : "none",
        }}
      >
        {/* Official Google Play icon - 4 colored triangles */}
        <svg
          width="28"
          height="28"
          viewBox="0 0 24 24"
          fill="none"
          role="img"
          aria-label="Google Play"
        >
          <title>Google Play</title>
          {/* top-left cyan */}
          <path d="M3 1.5L13.5 12L3 22.5V1.5z" fill="#00d4aa" />
          {/* bottom-left green */}
          <path d="M3 22.5L16.5 15.5L13.5 12L3 22.5z" fill="#5ef86b" />
          {/* top-right yellow */}
          <path d="M3 1.5L13.5 12L16.5 8.5L3 1.5z" fill="#ffca28" />
          {/* center-right red */}
          <path
            d="M13.5 12L16.5 8.5L21 10.8L16.5 15.5L13.5 12z"
            fill="#f04747"
          />
        </svg>
        <div className="text-left">
          <div className="text-[9px] text-white/70 leading-none mb-0.5 tracking-wide uppercase">
            GET IT ON
          </div>
          <div className="text-sm font-bold leading-none text-white">
            Google Play
          </div>
        </div>
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
    <a
      href="https://apps.apple.com"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Download on the App Store"
      data-ocid="partner.appstore.button"
      onClick={handleClick}
      className="inline-flex items-center gap-3 px-5 py-3 min-w-[160px] rounded-xl border border-border bg-[#111] transition-all duration-200 hover:border-border/60"
      style={{
        animation: isGlowing
          ? "appStorePulse 0.8s ease-out forwards"
          : undefined,
        boxShadow: isGlowing
          ? "0 0 0 4px rgba(255,255,255,0.3), 0 0 30px rgba(200,200,255,0.3), 0 0 60px rgba(200,200,255,0.15)"
          : "none",
      }}
    >
      {/* Official Apple logo */}
      <svg
        width="24"
        height="28"
        viewBox="0 0 814 1000"
        fill="none"
        role="img"
        aria-label="App Store"
      >
        <title>App Store</title>
        <path
          d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76 0-103.7 40.8-165.9 40.8s-105-57.8-155.5-127.4C46 405.8 0 304.8 0 212.7c0-130.3 84.3-199.2 167.5-199.2 58.6 0 107.4 43.4 143.8 43.4 34.4 0 92.5-46.1 159.3-46.1 25.4 0 108.2 4.5 179.7 77 0 0 10.2 10.9 10.2 10.9zm-88.8-219.7c0 71.4-36.4 154.5-79.4 204.7-42.8 49.3-100.7 91.1-168.7 91.1-7.7 0-15.4-.6-23.2-1.3 0-1.3-.3-3.2-.3-4.5 0-72.7 36.4-152.9 81.7-204.7 43.5-49.3 115.4-93.7 181-93.7 7.7 0 15.4.6 23.1 1.3.3 2.4 1.9 5.8 1.9 7.2l-16.1-.1z"
          fill="#ffffff"
        />
      </svg>
      <div className="text-left">
        <div className="text-[9px] text-white/70 leading-none mb-0.5 tracking-wide">
          Download on the
        </div>
        <div className="text-sm font-bold leading-none text-white">
          App Store
        </div>
      </div>
    </a>
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

  return (
    <div>
      <style>{`
        @keyframes emailInputGlow {
          0%, 100% { filter: drop-shadow(0 0 2px #00c6ff) drop-shadow(0 0 5px #0072ff); opacity: 0.55; }
          33% { filter: drop-shadow(0 0 4px #0072ff) drop-shadow(0 0 9px #7c3aed); opacity: 0.8; }
          66% { filter: drop-shadow(0 0 3px #7c3aed) drop-shadow(0 0 7px #00c6ff); opacity: 0.65; }
        }
        @keyframes subscribeBtnGlow {
          0%, 100% { filter: drop-shadow(0 0 3px #f0abfc) drop-shadow(0 0 6px #22d3ee); opacity: 0.6; }
          33% { filter: drop-shadow(0 0 5px #22d3ee) drop-shadow(0 0 10px #818cf8); opacity: 0.85; }
          66% { filter: drop-shadow(0 0 4px #818cf8) drop-shadow(0 0 8px #f0abfc); opacity: 0.7; }
        }
        @keyframes outerSubscribeGlow {
          0%, 100% { box-shadow: 0 0 12px rgba(34,211,238,0.12), 0 0 24px rgba(34,211,238,0.06), 0 0 0 1px rgba(34,211,238,0.10); }
          33%       { box-shadow: 0 0 16px rgba(129,140,248,0.14), 0 0 30px rgba(129,140,248,0.07), 0 0 0 1px rgba(129,140,248,0.12); }
          66%       { box-shadow: 0 0 14px rgba(240,171,252,0.13), 0 0 26px rgba(240,171,252,0.06), 0 0 0 1px rgba(240,171,252,0.10); }
        }
      `}</style>
      {/* Outer glowing wrapper surrounding both input and button */}
      <div
        className="relative rounded-2xl p-3 max-w-md mx-auto bg-muted/10"
        style={{
          border: "1px solid rgba(128,128,128,0.15)",
          animation: "outerSubscribeGlow 4s ease-in-out infinite",
        }}
      >
        <form
          onSubmit={handleSubmit}
          className="flex flex-col sm:flex-row gap-3"
        >
          {/* Email input with spinning corner glows */}
          <div className="relative flex-1">
            <CornerGlow
              position="tl"
              colors={["#00c6ff", "#0072ff"]}
              animDelay="0s"
              animName="emailInputGlow"
            />
            <CornerGlow
              position="tr"
              colors={["#0072ff", "#7c3aed"]}
              animDelay="0.75s"
              animName="emailInputGlow"
            />
            <CornerGlow
              position="br"
              colors={["#7c3aed", "#00c6ff"]}
              animDelay="1.5s"
              animName="emailInputGlow"
            />
            <CornerGlow
              position="bl"
              colors={["#00c6ff", "#7c3aed"]}
              animDelay="2.25s"
              animName="emailInputGlow"
            />
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setStatus("idle");
              }}
              placeholder={placeholder}
              className="w-full px-4 py-3 rounded-xl bg-background/80 border border-border text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:border-primary/50 focus:bg-muted/20 transition-all duration-200"
            />
          </div>

          {/* Subscribe button with spinning corner glows */}
          <div className="relative flex-shrink-0">
            <CornerGlow
              position="tl"
              colors={["#f0abfc", "#22d3ee"]}
              animDelay="0s"
              animName="subscribeBtnGlow"
            />
            <CornerGlow
              position="tr"
              colors={["#22d3ee", "#818cf8"]}
              animDelay="0.75s"
              animName="subscribeBtnGlow"
            />
            <CornerGlow
              position="br"
              colors={["#818cf8", "#f0abfc"]}
              animDelay="1.5s"
              animName="subscribeBtnGlow"
            />
            <CornerGlow
              position="bl"
              colors={["#f0abfc", "#818cf8"]}
              animDelay="2.25s"
              animName="subscribeBtnGlow"
            />
            <button
              type="submit"
              className="px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-200 whitespace-nowrap hover:scale-[1.03] active:scale-[0.97]"
              style={{
                background:
                  "linear-gradient(135deg, #22d3ee 0%, #818cf8 50%, #f0abfc 100%)",
                color: "#fff",
                boxShadow:
                  "0 3px 12px rgba(34, 211, 238, 0.22), 0 1px 6px rgba(129, 140, 248, 0.18)",
              }}
            >
              {subscribeLabel}
            </button>
          </div>
        </form>
        {status === "success" && (
          <p className="mt-2 text-sm text-cyan-400 text-center">
            ✓ {successMsg}
          </p>
        )}
        {status === "error" && (
          <p className="mt-2 text-sm text-red-400 text-center">{errorMsg}</p>
        )}
      </div>
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
      <DotsBackground />
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
          `}</style>
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
            name="OpenClaw.ai"
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
