import { X } from "lucide-react";
import { useEffect } from "react";

interface LobsterPopupCardProps {
  handle?: string;
  onClose: () => void;
}

export function LobsterPopupCard({ handle, onClose }: LobsterPopupCardProps) {
  const displayHandle = handle?.trim() ? handle.trim() : "yourname";

  // Close on Escape key
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

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
      {/* Backdrop blur layer */}
      <div
        className="absolute inset-0 backdrop-blur-md pointer-events-none"
        style={{ zIndex: -1 }}
      />

      {/* Card */}
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
        <div className="px-7 pt-8 pb-7 flex flex-col items-center gap-5">
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
                textShadow: "none",
              }}
            >
              Registration Opening Soon
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
            <AnimatedLobsterSVG />
          </div>

          {/* Handle display */}
          <div
            className="text-center px-4 py-3 rounded-2xl w-full"
            style={{
              background: "rgba(0,150,255,0.06)",
              border: "1px solid rgba(0,198,255,0.15)",
            }}
          >
            <p
              className="text-2xl font-black tracking-tight"
              style={{
                background:
                  "linear-gradient(135deg, #00c6ff 0%, #a855f7 50%, #f59e0b 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                filter: "drop-shadow(0 0 12px rgba(0,198,255,0.4))",
                animation: "handleGlow 2s ease-in-out infinite",
                textShadow: "none",
              }}
            >
              @{displayHandle}
            </p>
            <p
              className="text-xs mt-1"
              style={{ color: "rgba(148,163,184,0.75)" }}
            >
              Your handle{" "}
              <span style={{ color: "rgba(0,198,255,0.8)" }}>
                @{displayHandle}
              </span>{" "}
              is on the waitlist.
            </p>
          </div>

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
            {/* Shine effect */}
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
          0%, 100% { opacity: 1; r: 3; }
          50% { opacity: 0.6; r: 2.5; }
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
        @keyframes antennaWave {
          0%, 100% { transform: rotate(-8deg); }
          50% { transform: rotate(8deg); }
        }
        @keyframes tailWiggle {
          0%, 100% { transform: rotate(0deg); }
          33% { transform: rotate(5deg); }
          66% { transform: rotate(-5deg); }
        }
      `}</style>
    </div>
  );
}

function AnimatedLobsterSVG() {
  return (
    <svg
      width="140"
      height="120"
      viewBox="0 0 140 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Animated lobster"
      role="img"
    >
      <defs>
        <radialGradient id="bodyGrad" cx="50%" cy="40%" r="55%">
          <stop offset="0%" stopColor="#ef4444" />
          <stop offset="60%" stopColor="#dc2626" />
          <stop offset="100%" stopColor="#991b1b" />
        </radialGradient>
        <radialGradient id="clawGrad" cx="50%" cy="30%" r="60%">
          <stop offset="0%" stopColor="#f87171" />
          <stop offset="100%" stopColor="#b91c1c" />
        </radialGradient>
        <radialGradient id="headGrad" cx="50%" cy="30%" r="60%">
          <stop offset="0%" stopColor="#f97316" />
          <stop offset="100%" stopColor="#dc2626" />
        </radialGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="2" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* ─── Left claw arm ─── */}
      <g
        style={{
          transformOrigin: "35px 55px",
          animation: "clawOpenCloseL 1.5s ease-in-out infinite",
        }}
      >
        {/* Arm */}
        <rect
          x="14"
          y="51"
          width="24"
          height="8"
          rx="4"
          fill="#dc2626"
          filter="url(#glow)"
        />
        {/* Claw upper jaw */}
        <ellipse
          cx="10"
          cy="50"
          rx="10"
          ry="6"
          fill="url(#clawGrad)"
          filter="url(#glow)"
        />
        {/* Claw lower jaw */}
        <ellipse
          cx="10"
          cy="60"
          rx="8"
          ry="4"
          fill="#b91c1c"
          filter="url(#glow)"
        />
        {/* Gold accent tip */}
        <circle cx="2" cy="50" r="2.5" fill="#f59e0b" />
      </g>

      {/* ─── Right claw arm ─── */}
      <g
        style={{
          transformOrigin: "105px 55px",
          animation: "clawOpenClose 1.5s ease-in-out infinite",
        }}
      >
        {/* Arm */}
        <rect
          x="102"
          y="51"
          width="24"
          height="8"
          rx="4"
          fill="#dc2626"
          filter="url(#glow)"
        />
        {/* Claw upper jaw */}
        <ellipse
          cx="130"
          cy="50"
          rx="10"
          ry="6"
          fill="url(#clawGrad)"
          filter="url(#glow)"
        />
        {/* Claw lower jaw */}
        <ellipse
          cx="130"
          cy="60"
          rx="8"
          ry="4"
          fill="#b91c1c"
          filter="url(#glow)"
        />
        {/* Gold accent tip */}
        <circle cx="138" cy="50" r="2.5" fill="#f59e0b" />
      </g>

      {/* ─── Body ─── */}
      <ellipse
        cx="70"
        cy="72"
        rx="22"
        ry="28"
        fill="url(#bodyGrad)"
        filter="url(#glow)"
      />

      {/* Body segments */}
      <path
        d="M48 68 Q70 64 92 68"
        stroke="#991b1b"
        strokeWidth="1.5"
        fill="none"
        opacity="0.7"
      />
      <path
        d="M48 75 Q70 71 92 75"
        stroke="#991b1b"
        strokeWidth="1.5"
        fill="none"
        opacity="0.7"
      />
      <path
        d="M50 82 Q70 78 90 82"
        stroke="#991b1b"
        strokeWidth="1.5"
        fill="none"
        opacity="0.7"
      />
      <path
        d="M53 89 Q70 85 87 89"
        stroke="#991b1b"
        strokeWidth="1.5"
        fill="none"
        opacity="0.7"
      />

      {/* Gold belly stripe */}
      <ellipse cx="70" cy="74" rx="10" ry="14" fill="#f59e0b" opacity="0.18" />

      {/* ─── Head ─── */}
      <ellipse
        cx="70"
        cy="48"
        rx="19"
        ry="16"
        fill="url(#headGrad)"
        filter="url(#glow)"
      />

      {/* Head ridge */}
      <path
        d="M56 44 Q70 38 84 44"
        stroke="#fbbf24"
        strokeWidth="1.5"
        fill="none"
        opacity="0.6"
      />

      {/* ─── Left small leg ─── */}
      <line
        x1="55"
        y1="75"
        x2="44"
        y2="90"
        stroke="#dc2626"
        strokeWidth="3"
        strokeLinecap="round"
      />
      {/* ─── Right small leg ─── */}
      <line
        x1="85"
        y1="75"
        x2="96"
        y2="90"
        stroke="#dc2626"
        strokeWidth="3"
        strokeLinecap="round"
      />
      {/* ─── Left mid leg ─── */}
      <line
        x1="53"
        y1="82"
        x2="40"
        y2="96"
        stroke="#dc2626"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      {/* ─── Right mid leg ─── */}
      <line
        x1="87"
        y1="82"
        x2="100"
        y2="96"
        stroke="#dc2626"
        strokeWidth="2.5"
        strokeLinecap="round"
      />

      {/* ─── Tail ─── */}
      <g
        style={{
          transformOrigin: "70px 98px",
          animation: "tailWiggle 2s ease-in-out infinite",
        }}
      >
        <ellipse
          cx="70"
          cy="104"
          rx="14"
          ry="8"
          fill="#dc2626"
          filter="url(#glow)"
        />
        {/* Tail fan left */}
        <ellipse
          cx="58"
          cy="110"
          rx="7"
          ry="5"
          fill="#b91c1c"
          transform="rotate(-25 58 110)"
        />
        {/* Tail fan right */}
        <ellipse
          cx="82"
          cy="110"
          rx="7"
          ry="5"
          fill="#b91c1c"
          transform="rotate(25 82 110)"
        />
        {/* Tail center */}
        <ellipse cx="70" cy="112" rx="5" ry="7" fill="#dc2626" />
      </g>

      {/* ─── Eyes ─── */}
      <circle cx="62" cy="40" r="5" fill="#1a0000" />
      <circle
        cx="62"
        cy="40"
        r="3"
        fill="#fbbf24"
        style={{ animation: "eyePulse 1.8s ease-in-out infinite" }}
      />
      <circle cx="62" cy="40" r="1.5" fill="#fff" opacity="0.9" />

      <circle cx="78" cy="40" r="5" fill="#1a0000" />
      <circle
        cx="78"
        cy="40"
        r="3"
        fill="#fbbf24"
        style={{
          animation: "eyePulse 1.8s ease-in-out infinite",
          animationDelay: "0.4s",
        }}
      />
      <circle cx="78" cy="40" r="1.5" fill="#fff" opacity="0.9" />

      {/* ─── Left antenna ─── */}
      <g
        style={{
          transformOrigin: "62px 36px",
          animation: "antennaWave 1.8s ease-in-out infinite",
        }}
      >
        <line
          x1="62"
          y1="36"
          x2="48"
          y2="14"
          stroke="#f59e0b"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <circle cx="48" cy="14" r="2" fill="#fbbf24" />
      </g>

      {/* ─── Right antenna ─── */}
      <g
        style={{
          transformOrigin: "78px 36px",
          animation: "antennaWave 1.8s ease-in-out infinite",
          animationDelay: "0.5s",
        }}
      >
        <line
          x1="78"
          y1="36"
          x2="92"
          y2="14"
          stroke="#f59e0b"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <circle cx="92" cy="14" r="2" fill="#fbbf24" />
      </g>

      {/* ─── Short antennae ─── */}
      <line
        x1="64"
        y1="35"
        x2="56"
        y2="22"
        stroke="#fbbf24"
        strokeWidth="1"
        strokeLinecap="round"
        opacity="0.7"
      />
      <line
        x1="76"
        y1="35"
        x2="84"
        y2="22"
        stroke="#fbbf24"
        strokeWidth="1"
        strokeLinecap="round"
        opacity="0.7"
      />
    </svg>
  );
}
