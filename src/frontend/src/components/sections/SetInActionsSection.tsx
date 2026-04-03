import { useEffect, useRef, useState } from "react";

const LINES = [
  {
    label: "ClawPro",
    color: "#FF5722",
    texts: [
      "ClawPro is your all-in-one AI management hub — deploy personal bots, connect to 30+ platforms, and track your crypto portfolio from a single elegant dashboard. No switching between apps, no API headaches. Just pure, unified control.",
      "Designed for developers and power users alike, ClawPro puts every digital tool you own into one beautifully organized command center. From WhatsApp automation to real-time crypto alerts — it's all here, all connected, all yours.",
      "With Silver, Gold, and Platinum tiers, ClawPro scales with your ambitions. Whether you're a solo creator or running a full enterprise, your AI ecosystem grows as you do. Start small, scale infinitely.",
      "Your ClawPro handle is your single identity across the entire ecosystem. One username unlocks your bots, your integrations, your portfolio, and your global community profile. Claim yours before someone else does.",
      "ClawPro's dashboard updates in real time — live crypto prices, bot activity logs, API usage stats, and community events all on one screen. Stop checking ten different apps. Stay in the flow with ClawPro.",
      "Built on the Internet Computer, ClawPro is fully decentralized and always online. No single point of failure, no privacy compromises, and no downtime. Your data stays yours, and your bots stay running.",
    ],
  },
  {
    label: "OpenClaw",
    color: "#06b6d4",
    texts: [
      "OpenClaw is the intelligence layer that powers your entire ClawPro ecosystem — one API key connects your AI brain to every platform, every bot, and every workflow. Think of it as your personal AI engine, running 24/7.",
      "With OpenClaw, switching between AI models is instant. Prefer GPT-4 for reasoning? Gemini for creativity? Hermes for speed? Toggle between them in the dashboard with a single click, no code changes required.",
      "OpenClaw powers WhatsApp bots, Telegram channels, ChatGPT integrations, and Discord servers simultaneously. One configuration, unlimited reach. Your AI assistant is everywhere your customers are.",
      "Deploy your personal AI assistant in under 60 seconds with OpenClaw. Enter your handle, connect your API key, select your platforms — and your intelligent bot goes live immediately. Zero setup friction.",
      "OpenClaw's API is fully OpenAI-compatible, so any existing workflow or tool that works with GPT will work with OpenClaw out of the box. Migration is seamless, and the performance is significantly faster.",
      "The OpenClaw SDK is available for Android, iOS, Windows, macOS, and Linux. Build native integrations in Kotlin, Swift, Python, or JavaScript. Every platform, every language, every use case — covered.",
    ],
  },
  {
    label: "AI Infra",
    color: "#818cf8",
    texts: [
      "ClawPro's AI infrastructure runs at enterprise scale — distributed across Internet Computer nodes worldwide, with sub-100ms response times and 99.99% uptime SLA. Your bots never sleep, and your data never leaves your control.",
      "Hermes, GPT-4, Gemini, and Claude are all natively integrated. Switch providers on the fly through the dashboard while your bots keep running seamlessly. No downtime, no reconfiguration, no interruption.",
      "Real-time crypto markets are powered by live CoinGecko and Marketcap APIs — 15 coins tracked simultaneously with instant price alerts, portfolio visualization, and one-tap swap simulation.",
      "The Internet Computer backend ensures every account, bot setting, and API key is stored on-chain — immutable, private, and accessible from any device without a password manager or central server.",
      "ClawPro's performance metrics are second to none: under 2-second API cold starts, real-time WebSocket feeds for market data, and concurrent bot processing for unlimited parallel conversations.",
      "Zero compromise on security: end-to-end encryption for all API keys, biometric login support, and hardware-level isolation on Internet Computer nodes. Your AI infrastructure is as secure as it is powerful.",
    ],
  },
];

const TYPING_SPEED = 22; // ms per char
const PAUSE_AFTER = 2400; // ms pause when fully typed
const ERASE_SPEED = 10; // ms per char erase

function TypewriterLine({
  texts,
  color,
}: {
  texts: string[];
  color: string;
}) {
  const [display, setDisplay] = useState("");
  const [textIdx, setTextIdx] = useState(0);
  const [phase, setPhase] = useState<"typing" | "pause" | "erasing">("typing");
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const current = texts[textIdx];

    if (phase === "typing") {
      if (display.length < current.length) {
        timerRef.current = setTimeout(() => {
          setDisplay(current.slice(0, display.length + 1));
        }, TYPING_SPEED);
      } else {
        timerRef.current = setTimeout(() => setPhase("pause"), PAUSE_AFTER);
      }
    } else if (phase === "pause") {
      timerRef.current = setTimeout(() => setPhase("erasing"), 0);
    } else if (phase === "erasing") {
      if (display.length > 0) {
        timerRef.current = setTimeout(() => {
          setDisplay((d) => d.slice(0, -1));
        }, ERASE_SPEED);
      } else {
        setTextIdx((i) => (i + 1) % texts.length);
        setPhase("typing");
      }
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [display, phase, textIdx, texts]);

  return (
    <span
      style={{
        color,
        textShadow: `0 0 12px ${color}99, 0 0 24px ${color}44`,
        fontFamily: "'Courier New', Courier, monospace",
        letterSpacing: "0.01em",
      }}
    >
      {display}
      <span
        style={{
          display: "inline-block",
          width: 2,
          height: "1.1em",
          background: color,
          boxShadow: `0 0 8px ${color}`,
          verticalAlign: "text-bottom",
          marginLeft: 2,
          animation: "setActionBlink 0.75s step-end infinite",
        }}
      />
    </span>
  );
}

// ── Step-by-step flow data ────────────────────────────────────────────────

const STEPS = [
  {
    number: 1,
    icon: "🎯",
    title: "Claim Your Handle",
    desc: "Choose your unique @handle that identifies you across all ClawPro integrations and platforms. Reserve it before someone else does.",
    color: "#0ea5e9",
    glow: "rgba(14,165,233,0.5)",
  },
  {
    number: 2,
    icon: "📝",
    title: "Create Account",
    desc: "Register with your handle, set up your profile, and unlock your personalized AI dashboard with full access to every feature.",
    color: "#22d3ee",
    glow: "rgba(34,211,238,0.5)",
  },
  {
    number: 3,
    icon: "⚙️",
    title: "Install & Connect",
    desc: "Install ClawPro on Android, Windows, macOS, or Linux. Connect your bots and AI providers with a single click — no code required.",
    color: "#818cf8",
    glow: "rgba(129,140,248,0.5)",
  },
  {
    number: 4,
    icon: "🚀",
    title: "Integrate & Go Live",
    desc: "Link WhatsApp, Telegram, ChatGPT, and more. Your complete AI ecosystem is live, running, and ready for the world in minutes.",
    color: "#06b6d4",
    glow: "rgba(6,182,212,0.5)",
  },
];

function StepFlow() {
  return (
    <div
      style={{
        marginTop: 80,
        position: "relative",
      }}
    >
      <style>{`
        @keyframes travelRight {
          0% { left: 0%; opacity: 0; }
          8% { opacity: 1; }
          92% { opacity: 1; }
          100% { left: 100%; opacity: 0; }
        }
        @keyframes travelDown {
          0% { top: 0%; opacity: 0; }
          8% { opacity: 1; }
          92% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
        @keyframes stepPulse {
          0%, 100% { transform: scale(1); box-shadow: 0 0 0 0 currentColor; }
          50% { transform: scale(1.06); }
        }
        @keyframes stepFadeIn {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes connectorGlow {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.7; }
        }
      `}</style>

      {/* Section title */}
      <div style={{ textAlign: "center", marginBottom: 48 }}>
        <p
          style={{
            fontSize: "0.6rem",
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            color: "rgba(14,165,233,0.7)",
            marginBottom: 10,
            fontFamily: "system-ui, sans-serif",
          }}
        >
          Get Started
        </p>
        <h3
          style={{
            fontSize: "clamp(1.4rem, 3vw, 2.2rem)",
            fontWeight: 800,
            background:
              "linear-gradient(135deg, #e2e8f0 0%, #7dd3fc 40%, #c4b5fd 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            marginBottom: 10,
            fontFamily: "system-ui, sans-serif",
            lineHeight: 1.2,
          }}
        >
          How It Works — From Zero to Live in Minutes
        </h3>
        <p
          style={{
            fontSize: "0.9rem",
            color: "rgba(148,185,230,0.55)",
            fontFamily: "system-ui, sans-serif",
            maxWidth: 500,
            margin: "0 auto",
          }}
        >
          Follow these steps to get started with ClawPro
        </p>
      </div>

      {/* Steps row (horizontal on md+, vertical on mobile via flex-wrap) */}
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          flexWrap: "wrap",
          alignItems: "flex-start",
          justifyContent: "center",
          gap: 0,
          maxWidth: 960,
          margin: "0 auto",
          position: "relative",
        }}
      >
        {STEPS.map((step, idx) => (
          <div
            key={step.number}
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "flex-start",
              flex: "1 1 200px",
              minWidth: 0,
              maxWidth: 240,
              animation: `stepFadeIn 0.6s ease ${idx * 0.18}s both`,
            }}
          >
            {/* Step card */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                padding: "24px 16px",
                flex: 1,
                minWidth: 0,
              }}
            >
              {/* Glowing number circle */}
              <div
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: "50%",
                  background: `radial-gradient(circle, ${step.glow.replace("0.5", "0.15")} 0%, rgba(0,0,0,0.4) 100%)`,
                  border: `2px solid ${step.color}`,
                  boxShadow: `0 0 18px ${step.glow}, 0 0 36px ${step.glow.replace("0.5", "0.2")}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  marginBottom: 14,
                  position: "relative",
                  animation: `stepPulse 3s ease-in-out ${idx * 0.4}s infinite`,
                }}
              >
                <span
                  style={{
                    fontSize: "1.35rem",
                    fontWeight: 900,
                    color: step.color,
                    textShadow: `0 0 12px ${step.glow}`,
                    lineHeight: 1,
                    fontFamily: "system-ui, sans-serif",
                  }}
                >
                  {step.number}
                </span>
                {/* Icon overlay */}
                <span
                  style={{
                    position: "absolute",
                    bottom: -6,
                    right: -6,
                    fontSize: "1rem",
                    background: "rgba(5,13,30,0.9)",
                    borderRadius: "50%",
                    width: 22,
                    height: 22,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    border: `1px solid ${step.color}50`,
                  }}
                >
                  {step.icon}
                </span>
              </div>

              {/* Title */}
              <p
                style={{
                  fontWeight: 700,
                  fontSize: "0.95rem",
                  color: "rgba(255,255,255,0.92)",
                  marginBottom: 8,
                  textAlign: "center",
                  fontFamily: "system-ui, sans-serif",
                }}
              >
                {step.title}
              </p>

              {/* Description */}
              <p
                style={{
                  fontSize: "0.78rem",
                  color: "rgba(148,185,230,0.6)",
                  textAlign: "center",
                  lineHeight: 1.55,
                  fontFamily: "system-ui, sans-serif",
                }}
              >
                {step.desc}
              </p>
            </div>

            {/* Connector (between steps, not after last) */}
            {idx < STEPS.length - 1 && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  paddingTop: 26,
                  flexShrink: 0,
                  width: 40,
                  position: "relative",
                }}
              >
                {/* Base line */}
                <div
                  style={{
                    position: "absolute",
                    left: "50%",
                    top: 26,
                    transform: "translateX(-50%)",
                    width: 2,
                    height: 52,
                    background: `linear-gradient(180deg, ${step.color}40 0%, ${STEPS[idx + 1].color}40 100%)`,
                    borderRadius: 2,
                    animation: `connectorGlow 2s ease-in-out ${idx * 0.6}s infinite`,
                  }}
                />
                {/* Traveling dot */}
                <div
                  style={{
                    position: "absolute",
                    left: "50%",
                    top: 26,
                    transform: "translateX(-50%)",
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: "#0ea5e9",
                    boxShadow: "0 0 8px #0ea5e9, 0 0 16px rgba(14,165,233,0.6)",
                    animation: `travelDown 1.6s linear ${idx * 1.2}s infinite`,
                  }}
                />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Large-screen horizontal connectors (hidden on small) */}
      <style>{`
        @media (min-width: 640px) {
          .step-v-connector { display: none !important; }
          .step-h-connector { display: flex !important; }
        }
        @media (max-width: 639px) {
          .step-v-connector { display: flex !important; }
          .step-h-connector { display: none !important; }
        }
      `}</style>
    </div>
  );
}

export function SetInActionsSection() {
  return (
    <section
      style={{
        background:
          "linear-gradient(180deg, #050d1f 0%, #070f1d 50%, #040a18 100%)",
        padding: "80px 20px 100px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <style>{`
        @keyframes setActionBlink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        @keyframes setActionLineGlow {
          0%, 100% { opacity: 0.6; box-shadow: 0 0 8px currentColor; }
          50% { opacity: 1; box-shadow: 0 0 20px currentColor, 0 0 40px currentColor; }
        }
        @keyframes setActionFadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {/* Subtle ambient glows */}
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
        <div
          style={{
            position: "absolute",
            left: "15%",
            top: "20%",
            width: 320,
            height: 320,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(255,87,34,0.06) 0%, transparent 70%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            right: "15%",
            bottom: "30%",
            width: 280,
            height: 280,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(6,182,212,0.06) 0%, transparent 70%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            left: "50%",
            bottom: "10%",
            transform: "translateX(-50%)",
            width: 400,
            height: 200,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(14,165,233,0.05) 0%, transparent 70%)",
          }}
        />
      </div>

      {/* ── HEADER / DESCRIPTION BLOCK ── */}
      <div
        style={{
          maxWidth: 800,
          margin: "0 auto 64px",
          position: "relative",
          animation: "setActionFadeIn 0.7s ease both",
        }}
      >
        {/* Badge */}
        <div style={{ textAlign: "center", marginBottom: 16 }}>
          <span
            style={{
              display: "inline-block",
              padding: "5px 16px",
              borderRadius: 99,
              background: "rgba(14,165,233,0.12)",
              border: "1px solid rgba(14,165,233,0.35)",
              fontSize: "0.65rem",
              fontWeight: 700,
              letterSpacing: "0.25em",
              textTransform: "uppercase",
              color: "#0ea5e9",
              fontFamily: "system-ui, sans-serif",
              boxShadow: "0 0 16px rgba(14,165,233,0.15)",
            }}
          >
            See It In Action
          </span>
        </div>

        {/* Main title */}
        <h2
          style={{
            fontSize: "clamp(1.8rem, 4vw, 3rem)",
            fontWeight: 900,
            textAlign: "center",
            background:
              "linear-gradient(135deg, #e2e8f0 0%, #7dd3fc 35%, #c4b5fd 70%, #f0abfc 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            marginBottom: 20,
            fontFamily: "system-ui, sans-serif",
            lineHeight: 1.1,
          }}
        >
          ClawPro — The Complete AI Management Platform
        </h2>

        {/* Accent divider */}
        <div
          style={{
            width: 80,
            height: 3,
            background:
              "linear-gradient(90deg, transparent, #0ea5e9, #8b5cf6, transparent)",
            margin: "0 auto 32px",
            borderRadius: 2,
          }}
        />

        {/* Description paragraphs */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 16,
          }}
        >
          <div
            style={{
              borderLeft: "3px solid rgba(14,165,233,0.6)",
              paddingLeft: 20,
              boxShadow: "-4px 0 16px rgba(14,165,233,0.12)",
            }}
          >
            <p
              style={{
                fontSize: "clamp(0.9rem, 1.8vw, 1.05rem)",
                color: "rgba(226,232,240,0.8)",
                lineHeight: 1.75,
                fontFamily: "system-ui, sans-serif",
              }}
            >
              <strong style={{ color: "#7dd3fc" }}>ClawPro</strong> is the
              AI-powered platform that connects all your bots, integrations, and
              crypto holdings in one elegant, dark-mode dashboard. Whether
              you're automating WhatsApp replies, monitoring Bitcoin prices, or
              deploying a GPT-4 assistant — it all lives in one place, unified
              under your personal ClawPro handle.
            </p>
          </div>

          <div
            style={{
              borderLeft: "3px solid rgba(129,140,248,0.6)",
              paddingLeft: 20,
              boxShadow: "-4px 0 16px rgba(129,140,248,0.12)",
            }}
          >
            <p
              style={{
                fontSize: "clamp(0.9rem, 1.8vw, 1.05rem)",
                color: "rgba(226,232,240,0.75)",
                lineHeight: 1.75,
                fontFamily: "system-ui, sans-serif",
              }}
            >
              <strong style={{ color: "#c4b5fd" }}>Our goal</strong> is to
              empower developers, entrepreneurs, and digital creators with
              seamless AI integration, multi-platform bot management, and
              real-time crypto portfolio tracking — without the complexity.
              ClawPro's tiered membership (Silver, Gold, Platinum) ensures every
              user gets precisely the tools they need at a price that scales
              with their ambitions.
            </p>
          </div>

          <div
            style={{
              borderLeft: "3px solid rgba(6,182,212,0.6)",
              paddingLeft: 20,
              boxShadow: "-4px 0 16px rgba(6,182,212,0.12)",
            }}
          >
            <p
              style={{
                fontSize: "clamp(0.9rem, 1.8vw, 1.05rem)",
                color: "rgba(226,232,240,0.7)",
                lineHeight: 1.75,
                fontFamily: "system-ui, sans-serif",
              }}
            >
              <strong style={{ color: "#22d3ee" }}>OpenClaw</strong> — our
              native AI engine — serves as the intelligence backbone, connecting
              to OpenAI, Google Gemini, Hermes, Claude, WhatsApp, Telegram, and
              30+ more platforms through a single, elegant API. Deploy your
              personal AI assistant with one API key and watch it come alive
              across every channel your customers use.
            </p>
          </div>
        </div>
      </div>

      {/* ── LIVE FEED BADGE ── */}
      <div
        style={{
          textAlign: "center",
          marginBottom: 40,
          position: "relative",
          animation: "setActionFadeIn 0.7s ease 0.2s both",
        }}
      >
        <p
          style={{
            fontSize: "0.63rem",
            letterSpacing: "0.32em",
            textTransform: "uppercase",
            color: "rgba(6,182,212,0.6)",
            marginBottom: 10,
            fontFamily: "system-ui, sans-serif",
          }}
        >
          Live Feed
        </p>
        <div
          style={{
            width: 60,
            height: 2,
            background:
              "linear-gradient(90deg, transparent, #06b6d4, transparent)",
            margin: "0 auto",
            borderRadius: 2,
          }}
        />
      </div>

      {/* ── TYPEWRITER LINES ── */}
      <div
        style={{
          maxWidth: 860,
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          gap: 28,
        }}
      >
        {LINES.map((line, idx) => (
          <div
            key={line.label}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 0,
              animation: `setActionFadeIn 0.6s ease ${idx * 0.15}s both`,
            }}
          >
            {/* Left glowing vertical bar */}
            <div
              style={{
                width: 3,
                alignSelf: "stretch",
                minHeight: 54,
                borderRadius: 99,
                background: line.color,
                flexShrink: 0,
                boxShadow: `0 0 10px ${line.color}, 0 0 24px ${line.color}88`,
                animation: `setActionLineGlow 2s ease-in-out ${idx * 0.4}s infinite`,
                marginRight: 20,
              }}
            />

            {/* Card */}
            <div
              style={{
                flex: 1,
                background: "rgba(255,255,255,0.025)",
                border: `1px solid ${line.color}28`,
                borderRadius: 14,
                padding: "16px 22px",
                position: "relative",
                overflow: "hidden",
              }}
            >
              {/* Subtle top glow line */}
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  height: 1,
                  background: `linear-gradient(90deg, transparent, ${line.color}66, transparent)`,
                }}
              />

              {/* Label badge */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  marginBottom: 8,
                }}
              >
                <span
                  style={{
                    fontSize: "0.6rem",
                    fontWeight: 700,
                    letterSpacing: "0.25em",
                    textTransform: "uppercase",
                    color: line.color,
                    fontFamily: "system-ui, sans-serif",
                    opacity: 0.85,
                  }}
                >
                  {line.label}
                </span>
                <div
                  style={{
                    flex: 1,
                    height: 1,
                    background: `linear-gradient(90deg, ${line.color}44, transparent)`,
                  }}
                />
                {/* Status dot */}
                <span
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: line.color,
                    boxShadow: `0 0 6px ${line.color}`,
                    flexShrink: 0,
                    animation: `setActionLineGlow 1.5s ease-in-out ${idx * 0.3}s infinite`,
                  }}
                />
              </div>

              {/* Typewriter text */}
              <div
                style={{
                  fontSize: "clamp(0.82rem, 1.7vw, 1rem)",
                  fontWeight: 500,
                  lineHeight: 1.6,
                  minHeight: "3.2em",
                }}
              >
                <TypewriterLine texts={line.texts} color={line.color} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── STEP-BY-STEP FLOW ── */}
      <div style={{ maxWidth: 1000, margin: "0 auto" }}>
        <StepFlow />
      </div>

      {/* Bottom label */}
      <p
        style={{
          textAlign: "center",
          marginTop: 64,
          fontSize: "0.75rem",
          color: "rgba(148,185,230,0.4)",
          fontFamily: "system-ui, sans-serif",
          letterSpacing: "0.05em",
        }}
      >
        Powered by ClawPro · OpenClaw · Next-Gen AI
      </p>
    </section>
  );
}
