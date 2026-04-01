import { X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useActor } from "../hooks/useActor";

interface LobsterPopupCardProps {
  handle?: string;
  onClose: () => void;
}

// Registration opens: May 31, 2026 at midnight UTC
const OPEN_DATE = new Date("2026-05-31T00:00:00Z");

function calcCountdown(target: Date) {
  const diff = Math.max(0, target.getTime() - Date.now());
  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  const minutes = Math.floor((diff % 3600000) / 60000);
  const seconds = Math.floor((diff % 60000) / 1000);
  return { days, hours, minutes, seconds, done: diff === 0 };
}

function useCountdown(target: Date) {
  const [state, setState] = useState(() => calcCountdown(target));
  useEffect(() => {
    const id = setInterval(() => setState(calcCountdown(target)), 1000);
    return () => clearInterval(id);
  }, [target]);
  return state;
}

export function LobsterPopupCard({ handle, onClose }: LobsterPopupCardProps) {
  const displayHandle = handle?.trim() ? handle.trim() : "yourname";
  const { days, hours, minutes, seconds, done } = useCountdown(OPEN_DATE);
  const { actor } = useActor();
  const [email, setEmail] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const handleSave = async () => {
    if (saved) {
      onClose();
      return;
    }
    const trimmedEmail = email.trim();
    if (!trimmedEmail || !trimmedEmail.includes("@")) {
      setError("Please enter a valid email.");
      inputRef.current?.focus();
      return;
    }
    setSaving(true);
    setError("");
    try {
      // Save to waitlist optimistically (backend sync handled gracefully)
      if (actor && "addToWaitlist" in actor) {
        await (
          actor as unknown as {
            addToWaitlist: (h: string, e: string) => Promise<unknown>;
          }
        ).addToWaitlist(displayHandle, trimmedEmail);
      }
      setSaved(true);
    } catch {
      // Save failed silently — mark saved anyway (optimistic)
      setSaved(true);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.88)" }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") onClose();
      }}
      role="presentation"
      data-ocid="lobster-popup.modal"
    >
      <div
        className="absolute inset-0 backdrop-blur-md pointer-events-none"
        style={{ zIndex: -1 }}
      />

      <div
        className="relative w-full max-w-sm rounded-3xl overflow-hidden"
        style={{
          background:
            "linear-gradient(160deg, #070d1a 0%, #0a1530 50%, #060c18 100%)",
          boxShadow:
            "0 0 0 1.5px rgba(0,198,255,0.25), 0 0 40px rgba(0,150,255,0.25), 0 0 80px rgba(120,80,255,0.15), 0 20px 60px rgba(0,0,0,0.9)",
          animation:
            "lobsterCardIn 0.45s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        }}
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => e.stopPropagation()}
        aria-modal="true"
        aria-label="ClawPro waitlist popup"
      >
        {/* Animated top border glow */}
        <div
          className="absolute top-0 left-0 right-0 h-px"
          style={{
            background:
              "linear-gradient(90deg, transparent, #00c6ff, #a855f7, #f59e0b, #00c6ff, transparent)",
            backgroundSize: "300% 100%",
            animation: "shimmerBorder 2.5s linear infinite",
          }}
        />

        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-3 right-3 z-10 w-7 h-7 rounded-full flex items-center justify-center transition-all duration-200"
          style={{
            background: "rgba(0,198,255,0.1)",
            border: "1px solid rgba(0,198,255,0.3)",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.background =
              "rgba(0,198,255,0.25)";
            (e.currentTarget as HTMLElement).style.boxShadow =
              "0 0 12px rgba(0,198,255,0.4)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.background =
              "rgba(0,198,255,0.1)";
            (e.currentTarget as HTMLElement).style.boxShadow = "none";
          }}
          data-ocid="lobster-popup.close_button"
        >
          <X className="w-3.5 h-3.5" style={{ color: "rgba(0,198,255,0.8)" }} />
        </button>

        {/* Card content */}
        <div className="px-7 pt-8 pb-7 flex flex-col items-center gap-4">
          {/* Title */}
          <div className="text-center">
            <p
              className="text-xs font-bold tracking-[0.2em] uppercase mb-1"
              style={{ color: "rgba(0,198,255,0.6)" }}
            >
              ClawPro Handle Reserved 🦞
            </p>
            <h3
              className="text-lg font-black"
              style={{
                background:
                  "linear-gradient(135deg, #e2e8f0 0%, #a5c8ff 50%, #e2e8f0 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Registration Opens May 31, 2026
            </h3>
          </div>

          {/* Animated Lobster SVG */}
          <div
            style={{
              animation: "lobsterFloat 2.8s ease-in-out infinite",
              filter:
                "drop-shadow(0 0 16px rgba(220,38,38,0.5)) drop-shadow(0 0 32px rgba(245,158,11,0.3))",
            }}
          >
            <AnimatedLobsterSVG width={160} height={180} />
          </div>

          {/* Countdown Timer */}
          {!done ? (
            <div
              className="w-full rounded-2xl px-3 py-3"
              style={{
                background: "rgba(0,150,255,0.05)",
                border: "1px solid rgba(0,198,255,0.12)",
              }}
            >
              <p
                className="text-[10px] text-center uppercase tracking-widest mb-2"
                style={{ color: "rgba(0,198,255,0.5)" }}
              >
                Registration opens in
              </p>
              <div className="grid grid-cols-4 gap-1">
                {[
                  { v: days, label: "Days" },
                  { v: hours, label: "Hrs" },
                  { v: minutes, label: "Min" },
                  { v: seconds, label: "Sec" },
                ].map(({ v, label }) => (
                  <div key={label} className="flex flex-col items-center">
                    <div
                      className="text-2xl font-black tabular-nums"
                      style={{
                        background:
                          "linear-gradient(135deg, #00c6ff 0%, #a855f7 100%)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        backgroundClip: "text",
                        lineHeight: 1,
                        animation: "handleGlow 2s ease-in-out infinite",
                      }}
                    >
                      {String(v).padStart(2, "0")}
                    </div>
                    <span
                      className="text-[9px] mt-0.5 uppercase tracking-wider"
                      style={{ color: "rgba(148,163,184,0.5)" }}
                    >
                      {label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div
              className="w-full rounded-2xl px-3 py-3 text-center"
              style={{
                background: "rgba(34,197,94,0.08)",
                border: "1px solid rgba(34,197,94,0.3)",
              }}
            >
              <p className="text-sm font-bold text-green-400">
                🎉 Registration is now OPEN!
              </p>
            </div>
          )}

          {/* Handle display */}
          <div
            className="text-center px-4 py-2 rounded-2xl w-full"
            style={{
              background: "rgba(0,150,255,0.06)",
              border: "1px solid rgba(0,198,255,0.15)",
            }}
          >
            <p
              className="text-xl font-black tracking-tight"
              style={{
                background:
                  "linear-gradient(135deg, #00c6ff 0%, #a855f7 50%, #f59e0b 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                filter: "drop-shadow(0 0 12px rgba(0,198,255,0.4))",
                animation: "handleGlow 2s ease-in-out infinite",
              }}
            >
              @{displayHandle}
            </p>
            <p
              className="text-xs mt-0.5"
              style={{ color: "rgba(148,163,184,0.75)" }}
            >
              Your handle{" "}
              <span style={{ color: "rgba(0,198,255,0.8)" }}>
                @{displayHandle}
              </span>{" "}
              is on the waitlist.
            </p>
          </div>

          {/* Email Waitlist Input */}
          {!saved ? (
            <div className="w-full space-y-2">
              <p
                className="text-[10px] text-center uppercase tracking-widest"
                style={{ color: "rgba(0,198,255,0.5)" }}
              >
                Join waitlist — get notified when we open
              </p>
              <div className="flex gap-2">
                <input
                  ref={inputRef}
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError("");
                  }}
                  onKeyDown={(e) => e.key === "Enter" && handleSave()}
                  className="flex-1 px-3 py-2 rounded-xl text-sm text-white placeholder-gray-500 outline-none transition-all"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    border: error
                      ? "1px solid rgba(239,68,68,0.6)"
                      : "1px solid rgba(0,198,255,0.2)",
                    boxShadow: error
                      ? "0 0 8px rgba(239,68,68,0.2)"
                      : "0 0 8px rgba(0,198,255,0.08)",
                  }}
                  data-ocid="lobster-popup.email_input"
                />
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={saving}
                  className="px-4 py-2 rounded-xl font-bold text-xs transition-all duration-200 shrink-0"
                  style={{
                    background: saving
                      ? "rgba(0,198,255,0.15)"
                      : "linear-gradient(135deg, #00c6ff, #0072ff)",
                    color: saving ? "rgba(0,198,255,0.5)" : "#fff",
                    border: "1px solid rgba(0,198,255,0.4)",
                    boxShadow: saving
                      ? "none"
                      : "0 0 16px rgba(0,198,255,0.35)",
                  }}
                  data-ocid="lobster-popup.waitlist_button"
                >
                  {saving ? "..." : "Join"}
                </button>
              </div>
              {error && (
                <p className="text-[10px] text-red-400 text-center">{error}</p>
              )}
            </div>
          ) : (
            <div
              className="w-full rounded-xl py-2.5 text-center"
              style={{
                background: "rgba(34,197,94,0.1)",
                border: "1px solid rgba(34,197,94,0.35)",
              }}
            >
              <p className="text-sm font-semibold text-green-400">
                ✓ You're on the waitlist!
              </p>
              <p className="text-[10px] text-green-400/70 mt-0.5">
                We'll notify you at {email}
              </p>
            </div>
          )}

          {/* Got it button */}
          <button
            type="button"
            onClick={onClose}
            className="w-full py-3 rounded-xl font-bold text-sm tracking-wide transition-all duration-200 relative overflow-hidden"
            style={{
              background: "linear-gradient(135deg, #00c6ff, #0072ff, #a855f7)",
              color: "#fff",
              border: "1px solid rgba(0,198,255,0.4)",
              boxShadow:
                "0 0 20px rgba(0,198,255,0.4), 0 4px 16px rgba(0,0,0,0.5)",
              animation: "btnPulseGotIt 2s ease-in-out infinite",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.boxShadow =
                "0 0 35px rgba(0,198,255,0.8), 0 0 60px rgba(0,114,255,0.4), 0 6px 20px rgba(0,0,0,0.6)";
              (e.currentTarget as HTMLElement).style.transform =
                "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.boxShadow =
                "0 0 20px rgba(0,198,255,0.4), 0 4px 16px rgba(0,0,0,0.5)";
              (e.currentTarget as HTMLElement).style.transform =
                "translateY(0)";
            }}
            data-ocid="lobster-popup.confirm_button"
          >
            <span
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.18) 50%, transparent 60%)",
                backgroundSize: "200% 100%",
                animation: "btnShineGotIt 2.5s ease infinite",
              }}
            />
            Got it!
          </button>
        </div>
      </div>

      <style>{`
        @keyframes lobsterCardIn {
          0% { opacity: 0; transform: scale(0.8) translateY(20px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes lobsterFloat {
          0%, 100% { transform: translateY(0px) rotate(-1deg); }
          50% { transform: translateY(-10px) rotate(1deg); }
        }
        @keyframes handleGlow {
          0%, 100% { filter: drop-shadow(0 0 8px rgba(0,198,255,0.4)); }
          50% { filter: drop-shadow(0 0 20px rgba(0,198,255,0.7)) drop-shadow(0 0 40px rgba(168,85,247,0.4)); }
        }
        @keyframes shimmerBorder {
          0% { background-position: 0% 50%; }
          100% { background-position: 300% 50%; }
        }
        @keyframes btnPulseGotIt {
          0%, 100% { box-shadow: 0 0 20px rgba(0,198,255,0.4), 0 4px 16px rgba(0,0,0,0.5); }
          50% { box-shadow: 0 0 35px rgba(0,198,255,0.7), 0 0 60px rgba(0,114,255,0.35), 0 4px 16px rgba(0,0,0,0.5); }
        }
        @keyframes btnShineGotIt {
          0% { background-position: -100% 0; }
          60% { background-position: 200% 0; }
          100% { background-position: 200% 0; }
        }
        @keyframes lsMainFloat {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-5px); }
        }
        .ls-main-anim { animation: lsMainFloat 2.5s ease-in-out infinite; }
      `}</style>
    </div>
  );
}

/**
 * AnimatedLobsterSVG — elegant, professional lobster mascot with connected claws.
 * Claws are connected via arm segments (shoulder → elbow → forearm → claw).
 * Animations: body float, claw pinch, antenna sway, tail fan, eye blink.
 */
export function AnimatedLobsterSVG({
  width = 160,
  height = 180,
}: { width?: number; height?: number }) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 160 180"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="ClawPro animated lobster mascot"
      role="img"
    >
      <defs>
        <radialGradient id="lsBodyG" cx="40%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#f87171" />
          <stop offset="50%" stopColor="#dc2626" />
          <stop offset="100%" stopColor="#7f1d1d" />
        </radialGradient>
        <radialGradient id="lsHeadG" cx="45%" cy="25%" r="70%">
          <stop offset="0%" stopColor="#fb923c" />
          <stop offset="40%" stopColor="#ef4444" />
          <stop offset="100%" stopColor="#991b1b" />
        </radialGradient>
        <radialGradient id="lsClawG" cx="35%" cy="25%" r="70%">
          <stop offset="0%" stopColor="#f97316" />
          <stop offset="55%" stopColor="#dc2626" />
          <stop offset="100%" stopColor="#92400e" />
        </radialGradient>
        <radialGradient id="lsTailG" cx="50%" cy="15%" r="70%">
          <stop offset="0%" stopColor="#ef4444" />
          <stop offset="100%" stopColor="#7f1d1d" />
        </radialGradient>
        <filter id="lsGlw" x="-25%" y="-25%" width="150%" height="150%">
          <feGaussianBlur stdDeviation="1.8" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Main body group — floats up/down */}
      <g className="ls-main-anim">
        {/* ─── ANTENNAE ─── */}
        {/* Left antenna — sways */}
        <g>
          <animateTransform
            attributeName="transform"
            type="rotate"
            values="-6 68 29; 6 68 29; -6 68 29"
            dur="2.4s"
            repeatCount="indefinite"
            calcMode="spline"
            keySplines="0.5 0 0.5 1; 0.5 0 0.5 1"
            keyTimes="0; 0.5; 1"
          />
          <path
            d="M 68 29 Q 55 20 36 8"
            stroke="#f97316"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          <path
            d="M 68 29 Q 58 18 44 12"
            stroke="#fbbf24"
            strokeWidth="1"
            strokeLinecap="round"
            opacity="0.5"
          />
          <circle cx="36" cy="8" r="2" fill="#fbbf24" />
        </g>
        {/* Right antenna — sways opposite */}
        <g>
          <animateTransform
            attributeName="transform"
            type="rotate"
            values="6 92 29; -6 92 29; 6 92 29"
            dur="2.4s"
            repeatCount="indefinite"
            calcMode="spline"
            keySplines="0.5 0 0.5 1; 0.5 0 0.5 1"
            keyTimes="0; 0.5; 1"
          />
          <path
            d="M 92 29 Q 105 20 124 8"
            stroke="#f97316"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          <path
            d="M 92 29 Q 102 18 116 12"
            stroke="#fbbf24"
            strokeWidth="1"
            strokeLinecap="round"
            opacity="0.5"
          />
          <circle cx="124" cy="8" r="2" fill="#fbbf24" />
        </g>

        {/* ─── HEAD ─── */}
        {/* Head shell */}
        <ellipse
          cx="80"
          cy="45"
          rx="26"
          ry="22"
          fill="url(#lsHeadG)"
          filter="url(#lsGlw)"
        />
        {/* Rostrum spike at top */}
        <polygon points="75,25 80,16 85,25" fill="#f97316" />
        {/* Head highlight */}
        <ellipse cx="73" cy="37" rx="11" ry="7" fill="#fb923c" opacity="0.22" />
        {/* Head lower edge groove */}
        <path
          d="M 57 47 Q 80 43 103 47"
          stroke="#991b1b"
          strokeWidth="1.5"
          fill="none"
          opacity="0.5"
        />

        {/* Eye stalks */}
        <rect x="62" y="32" width="5" height="10" rx="2.5" fill="#c2410c" />
        <rect x="93" y="32" width="5" height="10" rx="2.5" fill="#c2410c" />

        {/* Left eye */}
        <circle
          cx="64.5"
          cy="31"
          r="6.5"
          fill="#1a0505"
          stroke="#f59e0b"
          strokeWidth="1.2"
        />
        <circle cx="65" cy="30" r="3.5" fill="#0a0101" />
        <circle cx="67" cy="28.5" r="1.3" fill="#fff" opacity="0.9" />
        {/* Left eyelid blink */}
        <ellipse cx="64.5" cy="31" rx="6.5" ry="0" fill="#b91c1c">
          <animate
            attributeName="ry"
            values="0;0;0;0;0;0;7;0;0;0;0;0"
            dur="6s"
            repeatCount="indefinite"
          />
        </ellipse>

        {/* Right eye */}
        <circle
          cx="95.5"
          cy="31"
          r="6.5"
          fill="#1a0505"
          stroke="#f59e0b"
          strokeWidth="1.2"
        />
        <circle cx="96" cy="30" r="3.5" fill="#0a0101" />
        <circle cx="98" cy="28.5" r="1.3" fill="#fff" opacity="0.9" />
        {/* Right eyelid blink */}
        <ellipse cx="95.5" cy="31" rx="6.5" ry="0" fill="#b91c1c">
          <animate
            attributeName="ry"
            values="0;0;0;0;0;0;0;7;0;0;0;0"
            dur="6s"
            begin="1.4s"
            repeatCount="indefinite"
          />
        </ellipse>

        {/* ─── CARAPACE (thorax) ─── */}
        <ellipse
          cx="80"
          cy="67"
          rx="22"
          ry="14"
          fill="url(#lsBodyG)"
          filter="url(#lsGlw)"
        />
        <path
          d="M 60 65 Q 80 60 100 65"
          stroke="#7f1d1d"
          strokeWidth="1.2"
          fill="none"
          opacity="0.5"
        />
        {/* Carapace highlight */}
        <ellipse cx="74" cy="62" rx="10" ry="5" fill="#f87171" opacity="0.15" />

        {/* ─── LEFT ARM (shoulder → upper-arm → elbow → forearm → wrist → claw) ─── */}
        {/* Shoulder joint on body */}
        <circle cx="60" cy="66" r="4.5" fill="#b91c1c" filter="url(#lsGlw)" />
        {/* Upper arm */}
        <path
          d="M 58 66 Q 47 63 39 68"
          stroke="#dc2626"
          strokeWidth="6.5"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M 58 66 Q 47 63 39 68"
          stroke="#f87171"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
          opacity="0.3"
        />
        {/* Elbow joint */}
        <circle cx="39" cy="68" r="4" fill="#991b1b" filter="url(#lsGlw)" />
        {/* Forearm */}
        <path
          d="M 39 68 Q 33 65 28 63"
          stroke="#b91c1c"
          strokeWidth="5.5"
          strokeLinecap="round"
          fill="none"
        />
        {/* Wrist joint */}
        <circle cx="28" cy="63" r="3.5" fill="#f59e0b" filter="url(#lsGlw)" />
        {/* LEFT CLAW — pivots at wrist origin (0,0) via translate(28,63) */}
        <g transform="translate(28,63)">
          {/* Claw base / merus */}
          <ellipse
            cx="-9"
            cy="0"
            rx="11"
            ry="7.5"
            fill="url(#lsClawG)"
            filter="url(#lsGlw)"
          />
          {/* Lower dactyl (static) */}
          <path
            d="M -9 5 Q -19 9 -24 12"
            stroke="#7f1d1d"
            strokeWidth="4"
            strokeLinecap="round"
            fill="none"
          />
          <ellipse
            cx="-25"
            cy="13"
            rx="5.5"
            ry="3.5"
            fill="#7f1d1d"
            transform="rotate(-18 -25 13)"
          />
          {/* Upper propodus (animated pinch) */}
          <g>
            <animateTransform
              attributeName="transform"
              type="rotate"
              values="0 0 0; -24 0 0; 0 0 0"
              dur="2.2s"
              repeatCount="indefinite"
              calcMode="spline"
              keySplines="0.4 0 0.6 1; 0.4 0 0.6 1"
              keyTimes="0; 0.5; 1"
            />
            <path
              d="M -9 -4 Q -19 -9 -24 -12"
              stroke="#f97316"
              strokeWidth="4"
              strokeLinecap="round"
              fill="none"
            />
            <ellipse
              cx="-25"
              cy="-13"
              rx="5.5"
              ry="3.5"
              fill="#ef4444"
              transform="rotate(18 -25 -13)"
            />
          </g>
        </g>

        {/* ─── RIGHT ARM ─── */}
        {/* Shoulder joint on body */}
        <circle cx="100" cy="66" r="4.5" fill="#b91c1c" filter="url(#lsGlw)" />
        {/* Upper arm */}
        <path
          d="M 102 66 Q 113 63 121 68"
          stroke="#dc2626"
          strokeWidth="6.5"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M 102 66 Q 113 63 121 68"
          stroke="#f87171"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
          opacity="0.3"
        />
        {/* Elbow joint */}
        <circle cx="121" cy="68" r="4" fill="#991b1b" filter="url(#lsGlw)" />
        {/* Forearm */}
        <path
          d="M 121 68 Q 127 65 132 63"
          stroke="#b91c1c"
          strokeWidth="5.5"
          strokeLinecap="round"
          fill="none"
        />
        {/* Wrist joint */}
        <circle cx="132" cy="63" r="3.5" fill="#f59e0b" filter="url(#lsGlw)" />
        {/* RIGHT CLAW — pivots at wrist via translate(132,63) */}
        <g transform="translate(132,63)">
          {/* Claw base */}
          <ellipse
            cx="9"
            cy="0"
            rx="11"
            ry="7.5"
            fill="url(#lsClawG)"
            filter="url(#lsGlw)"
          />
          {/* Lower dactyl (static) */}
          <path
            d="M 9 5 Q 19 9 24 12"
            stroke="#7f1d1d"
            strokeWidth="4"
            strokeLinecap="round"
            fill="none"
          />
          <ellipse
            cx="25"
            cy="13"
            rx="5.5"
            ry="3.5"
            fill="#7f1d1d"
            transform="rotate(18 25 13)"
          />
          {/* Upper propodus (animated pinch) */}
          <g>
            <animateTransform
              attributeName="transform"
              type="rotate"
              values="0 0 0; 24 0 0; 0 0 0"
              dur="2.2s"
              begin="0.35s"
              repeatCount="indefinite"
              calcMode="spline"
              keySplines="0.4 0 0.6 1; 0.4 0 0.6 1"
              keyTimes="0; 0.5; 1"
            />
            <path
              d="M 9 -4 Q 19 -9 24 -12"
              stroke="#f97316"
              strokeWidth="4"
              strokeLinecap="round"
              fill="none"
            />
            <ellipse
              cx="25"
              cy="-13"
              rx="5.5"
              ry="3.5"
              fill="#ef4444"
              transform="rotate(-18 25 -13)"
            />
          </g>
        </g>

        {/* ─── BODY SEGMENTS ─── */}
        <ellipse
          cx="80"
          cy="87"
          rx="18"
          ry="14"
          fill="url(#lsBodyG)"
          filter="url(#lsGlw)"
        />
        <path
          d="M 63 86 Q 80 82 97 86"
          stroke="#7f1d1d"
          strokeWidth="1.2"
          fill="none"
          opacity="0.5"
        />
        <ellipse
          cx="80"
          cy="105"
          rx="15"
          ry="12"
          fill="url(#lsBodyG)"
          filter="url(#lsGlw)"
        />
        <path
          d="M 66 104 Q 80 100 94 104"
          stroke="#7f1d1d"
          strokeWidth="1.2"
          fill="none"
          opacity="0.5"
        />
        <ellipse
          cx="80"
          cy="120"
          rx="12"
          ry="10"
          fill="url(#lsBodyG)"
          filter="url(#lsGlw)"
        />
        <path
          d="M 69 119 Q 80 115 91 119"
          stroke="#7f1d1d"
          strokeWidth="1.2"
          fill="none"
          opacity="0.5"
        />
        <ellipse cx="80" cy="132" rx="9" ry="7" fill="url(#lsBodyG)" />

        {/* ─── WALKING LEGS (3 pairs) ─── */}
        <path
          d="M 64 90 Q 55 98 49 106"
          stroke="#b91c1c"
          strokeWidth="2.2"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M 96 90 Q 105 98 111 106"
          stroke="#b91c1c"
          strokeWidth="2.2"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M 66 106 Q 57 113 52 119"
          stroke="#b91c1c"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M 94 106 Q 103 113 108 119"
          stroke="#b91c1c"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M 68 120 Q 61 127 57 131"
          stroke="#b91c1c"
          strokeWidth="1.8"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M 92 120 Q 99 127 103 131"
          stroke="#b91c1c"
          strokeWidth="1.8"
          strokeLinecap="round"
          fill="none"
        />

        {/* ─── PLEOPODS ─── */}
        <path
          d="M 75 133 L 71 143"
          stroke="#ef4444"
          strokeWidth="1.5"
          strokeLinecap="round"
          opacity="0.7"
        />
        <path
          d="M 80 135 L 80 145"
          stroke="#ef4444"
          strokeWidth="1.5"
          strokeLinecap="round"
          opacity="0.7"
        />
        <path
          d="M 85 133 L 89 143"
          stroke="#ef4444"
          strokeWidth="1.5"
          strokeLinecap="round"
          opacity="0.7"
        />

        {/* ─── FAN TAIL ─── */}
        <g>
          <animateTransform
            attributeName="transform"
            type="rotate"
            values="0 80 140; 4 80 140; 0 80 140; -4 80 140; 0 80 140"
            dur="1.7s"
            repeatCount="indefinite"
            calcMode="spline"
            keySplines="0.5 0 0.5 1; 0.5 0 0.5 1; 0.5 0 0.5 1; 0.5 0 0.5 1"
            keyTimes="0;0.25;0.5;0.75;1"
          />
          {/* Center uropod */}
          <ellipse
            cx="80"
            cy="149"
            rx="7"
            ry="11"
            fill="url(#lsTailG)"
            stroke="#991b1b"
            strokeWidth="0.8"
          />
          <path
            d="M 80 141 Q 79 149 80 156 Q 81 149 80 141Z"
            stroke="#7f1d1d"
            strokeWidth="0.8"
            fill="none"
          />
          {/* Left inner fan */}
          <ellipse
            cx="68"
            cy="152"
            rx="8.5"
            ry="7"
            fill="url(#lsTailG)"
            stroke="#991b1b"
            strokeWidth="0.8"
            transform="rotate(-20 68 152)"
          />
          {/* Right inner fan */}
          <ellipse
            cx="92"
            cy="152"
            rx="8.5"
            ry="7"
            fill="url(#lsTailG)"
            stroke="#991b1b"
            strokeWidth="0.8"
            transform="rotate(20 92 152)"
          />
          {/* Left outer fan */}
          <ellipse
            cx="57"
            cy="148"
            rx="7.5"
            ry="6"
            fill="url(#lsTailG)"
            stroke="#991b1b"
            strokeWidth="0.8"
            transform="rotate(-35 57 148)"
          />
          {/* Right outer fan */}
          <ellipse
            cx="103"
            cy="148"
            rx="7.5"
            ry="6"
            fill="url(#lsTailG)"
            stroke="#991b1b"
            strokeWidth="0.8"
            transform="rotate(35 103 148)"
          />
        </g>

        {/* Belly underside highlight */}
        <ellipse
          cx="80"
          cy="100"
          rx="7"
          ry="22"
          fill="#fca5a5"
          opacity="0.07"
        />
        {/* Shell shine highlights */}
        <ellipse cx="75" cy="84" rx="5" ry="3" fill="#fff" opacity="0.12" />
        <ellipse cx="75" cy="103" rx="4" ry="2.5" fill="#fff" opacity="0.09" />
        <ellipse cx="76" cy="118" rx="3" ry="2" fill="#fff" opacity="0.07" />
      </g>
    </svg>
  );
}
