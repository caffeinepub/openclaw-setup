import { useEffect, useRef, useState } from "react";

const LINES = [
  {
    label: "ClawPro",
    color: "#FF5722",
    texts: [
      "ClawPro is your all-in-one AI-powered platform",
      "Manage bots, integrations, and crypto in one dashboard",
      "Silver, Gold, and Platinum tiers built for every team",
      "Your ClawPro handle is your identity across the ecosystem",
      "Claim your handle and unlock the full ClawPro experience",
    ],
  },
  {
    label: "OpenClaw",
    color: "#06b6d4",
    texts: [
      "OpenClaw connects your AI brain to every platform",
      "One API key — unlimited integrations via OpenClaw",
      "OpenClaw powers WhatsApp, Telegram, and ChatGPT bots",
      "Deploy your personal AI assistant in seconds",
      "OpenClaw: the intelligence layer of the ClawPro ecosystem",
    ],
  },
  {
    label: "AI Infra",
    color: "#818cf8",
    texts: [
      "Next-gen AI infrastructure running at enterprise scale",
      "Hermes, GPT-4, Gemini — switch providers on the fly",
      "Real-time crypto markets powered by live APIs",
      "Backend on Internet Computer — fully decentralized",
      "Zero downtime, zero compromise, infinite possibilities",
    ],
  },
];

const TYPING_SPEED = 38; // ms per char
const PAUSE_AFTER = 1800; // ms pause when fully typed
const ERASE_SPEED = 18; // ms per char erase

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

export function SetInActionsSection() {
  return (
    <section
      style={{
        background: "linear-gradient(180deg, #050d1f 0%, #070f1d 100%)",
        padding: "80px 20px",
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
            bottom: "20%",
            width: 280,
            height: 280,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(6,182,212,0.06) 0%, transparent 70%)",
          }}
        />
      </div>

      {/* Section header */}
      <div
        style={{
          textAlign: "center",
          marginBottom: 56,
          position: "relative",
          animation: "setActionFadeIn 0.7s ease both",
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
        <h2
          style={{
            fontSize: "clamp(1.6rem, 3.5vw, 2.6rem)",
            fontWeight: 800,
            background:
              "linear-gradient(135deg, #e2e8f0 0%, #93c5fd 40%, #f0abfc 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            marginBottom: 12,
            fontFamily: "system-ui, sans-serif",
            lineHeight: 1.15,
          }}
        >
          See It in Action
        </h2>
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

      {/* Typewriter lines */}
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
                  fontSize: "clamp(0.85rem, 1.8vw, 1.05rem)",
                  fontWeight: 500,
                  lineHeight: 1.5,
                  minHeight: "1.6em",
                }}
              >
                <TypewriterLine texts={line.texts} color={line.color} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom label */}
      <p
        style={{
          textAlign: "center",
          marginTop: 48,
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
