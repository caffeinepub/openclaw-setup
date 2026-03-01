import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  ArrowRight,
  AtSign,
  BookOpen,
  CheckCircle2,
  Copy,
  Download,
  ExternalLink,
  Fingerprint,
  Loader2,
  LogIn,
  User,
  Zap,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { useInternetIdentity } from "../../hooks/useInternetIdentity";
import {
  useCallerUserProfile,
  useLatestVersion,
  useSaveCallerUserProfile,
  useTotalDownloads,
} from "../../hooks/useQueries";
import { useLanguage } from "../../i18n/LanguageContext";
import { DotsBackground } from "../DotsBackground";

const ORBS = [
  { color: "#f59e0b", r: 190 },
  { color: "#dc2626", r: 160 },
  { color: "#10b981", r: 200 },
  { color: "#ffd700", r: 140 },
  { color: "#10b981", r: 175 },
  { color: "#f59e0b", r: 165 },
  { color: "#dc2626", r: 145 },
  { color: "#ffd700", r: 130 },
  { color: "#10b981", r: 155 },
  { color: "#f59e0b", r: 185 },
  { color: "#dc2626", r: 135 },
  { color: "#10b981", r: 125 },
];

function ColorfulBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    // Initialize orb positions and velocities
    const orbs = ORBS.map((orb) => ({
      ...orb,
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      opacity: 0.15 + Math.random() * 0.2,
    }));

    const draw = () => {
      if (!canvas || !ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (const orb of orbs) {
        // Move
        orb.x += orb.vx;
        orb.y += orb.vy;

        // Bounce off edges softly
        if (orb.x < -orb.r) orb.x = canvas.width + orb.r;
        if (orb.x > canvas.width + orb.r) orb.x = -orb.r;
        if (orb.y < -orb.r) orb.y = canvas.height + orb.r;
        if (orb.y > canvas.height + orb.r) orb.y = -orb.r;

        // Draw soft radial gradient blob
        const grad = ctx.createRadialGradient(
          orb.x,
          orb.y,
          0,
          orb.x,
          orb.y,
          orb.r,
        );
        grad.addColorStop(
          0,
          `${orb.color}${Math.round(orb.opacity * 255)
            .toString(16)
            .padStart(2, "0")}`,
        );
        grad.addColorStop(1, `${orb.color}00`);
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(orb.x, orb.y, orb.r, 0, Math.PI * 2);
        ctx.fill();
      }

      animId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas ref={canvasRef} className="absolute inset-0 w-full h-full z-0" />
  );
}

function RobotMascot() {
  return (
    <div className="relative flex items-center justify-center">
      <img
        src="/assets/generated/clawpro-robot-mascot-transparent.dim_600x700.png"
        alt="ClawPro Robot Mascot"
        className="relative z-10 w-auto animate-float"
        style={{ height: "420px", maxHeight: "420px", objectFit: "contain" }}
      />
    </div>
  );
}

function GlowCorner({
  position,
}: {
  position: "tl" | "tr" | "bl" | "br";
}) {
  const posClass = {
    tl: "top-0 left-0",
    tr: "top-0 right-0 rotate-90",
    bl: "bottom-0 left-0 -rotate-90",
    br: "bottom-0 right-0 rotate-180",
  }[position];

  const gradId = `cornerGrad-${position}`;

  return (
    <span
      className={`absolute ${posClass} w-6 h-6 pointer-events-none`}
      style={{ zIndex: 2 }}
    >
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        aria-label="corner decoration"
        role="img"
      >
        <title>corner decoration</title>
        <defs>
          <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#dc2626" />
            <stop offset="50%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#ffd700" />
          </linearGradient>
        </defs>
        <path
          d="M2 22 L2 4 Q2 2 4 2 L22 2"
          stroke={`url(#${gradId})`}
          strokeWidth="2"
          strokeLinecap="round"
          style={{
            filter:
              "drop-shadow(0 0 6px #f59e0b) drop-shadow(0 0 12px #dc2626)",
          }}
        />
      </svg>
    </span>
  );
}

function HandleClaimCard() {
  const { identity, login } = useInternetIdentity();
  const { data: profile } = useCallerUserProfile();
  const saveProfile = useSaveCallerUserProfile();

  const [handle, setHandle] = useState("");
  const [fullName, setFullName] = useState("");
  const [saved, setSaved] = useState(false);
  const [pendingSave, setPendingSave] = useState(false);

  useEffect(() => {
    if (profile) {
      setHandle(profile.name ?? "");
      setFullName(profile.bio ?? "");
    }
  }, [profile]);

  // After login with pending save, auto-save
  useEffect(() => {
    if (identity && pendingSave && handle.trim()) {
      setPendingSave(false);
      void (async () => {
        const trimmedHandle = handle.trim().replace(/[^a-zA-Z0-9_-]/g, "");
        try {
          await saveProfile.mutateAsync({
            name: trimmedHandle,
            bio: fullName.trim() || undefined,
          });
          setSaved(true);
          toast.success("Handle saved! Your ClawPro.ai profile is set.");
          setTimeout(() => setSaved(false), 3000);
        } catch {
          toast.error("Failed to save profile. Please try again.");
        }
      })();
    }
  }, [identity, pendingSave, handle, fullName, saveProfile]);

  const handleSave = async () => {
    const trimmedHandle = handle.trim().replace(/[^a-zA-Z0-9_-]/g, "");
    if (!trimmedHandle) {
      toast.error("Please enter a valid handle (letters, numbers, _ or -).");
      return;
    }

    if (!identity) {
      // Not logged in: store intent and trigger login
      setPendingSave(true);
      toast.info("Please login to save your handle.");
      login();
      return;
    }

    try {
      await saveProfile.mutateAsync({
        name: trimmedHandle,
        bio: fullName.trim() || undefined,
      });
      setSaved(true);
      toast.success("Handle saved! Your ClawPro.ai profile is set.");
      setTimeout(() => setSaved(false), 3000);
    } catch {
      toast.error("Failed to save profile. Please try again.");
    }
  };

  return (
    <div className="w-full max-w-lg">
      {/* Outer glow pulse ring */}
      <div
        className="relative rounded-2xl"
        style={{
          background: "transparent",
          padding: "1px",
        }}
      >
        {/* Animated border gradient */}
        <div
          className="absolute inset-0 rounded-2xl pointer-events-none"
          style={{
            background:
              "linear-gradient(135deg, #dc2626, #f59e0b, #ffd700, #dc2626)",
            backgroundSize: "300% 300%",
            animation: "borderGlow 3s ease infinite",
            opacity: 0.85,
            zIndex: 0,
          }}
        />
        {/* Inner card */}
        <div
          className="relative rounded-2xl bg-black backdrop-blur-md p-5 space-y-4"
          style={{
            zIndex: 1,
            boxShadow:
              "0 0 30px rgba(220,38,38,0.2), 0 0 60px rgba(245,158,11,0.1), 0 4px 20px rgba(0,0,0,0.4)",
          }}
        >
          {/* Glowing corners */}
          <GlowCorner position="tl" />
          <GlowCorner position="tr" />
          <GlowCorner position="bl" />
          <GlowCorner position="br" />

          {/* Header */}
          <div className="flex items-center gap-2 mb-1">
            <div
              className="w-7 h-7 rounded-full bg-amber-500/15 border border-amber-500/50 flex items-center justify-center"
              style={{
                boxShadow: "0 0 10px rgba(245,158,11,0.5)",
              }}
            >
              <AtSign className="w-3.5 h-3.5 text-amber-400" />
            </div>
            <span
              className="text-sm font-semibold text-foreground/90"
              style={{
                textShadow: "0 0 10px rgba(245,158,11,0.4)",
              }}
            >
              Claim your ClawPro handle
            </span>
            {saved && (
              <CheckCircle2
                className="w-4 h-4 text-emerald-400 ml-auto"
                style={{ filter: "drop-shadow(0 0 6px #34d399)" }}
              />
            )}
            {!identity && (
              <span className="ml-auto text-xs text-amber-500/70 flex items-center gap-1">
                <LogIn className="w-3 h-3" />
                Login to save
              </span>
            )}
          </div>

          {/* Handle field */}
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Username</Label>
            <div
              className="relative rounded-lg p-[1px]"
              style={{
                background:
                  "linear-gradient(90deg, #dc2626, #f59e0b, #ffd700, #f59e0b, #dc2626)",
                backgroundSize: "300% 100%",
                animation: "fieldBorderGlow 2s linear infinite",
              }}
            >
              <div className="flex items-center rounded-lg bg-black overflow-hidden">
                <span
                  className="px-3 py-2 text-xs font-mono text-amber-400 bg-amber-500/10 border-r border-amber-500/20 whitespace-nowrap flex-shrink-0"
                  style={{ textShadow: "0 0 8px rgba(245,158,11,0.6)" }}
                >
                  ClawPro.ai/
                </span>
                <input
                  type="text"
                  value={handle}
                  onChange={(e) =>
                    setHandle(e.target.value.replace(/[^a-zA-Z0-9_-]/g, ""))
                  }
                  placeholder="your-handle"
                  className="flex-1 bg-transparent px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/50 outline-none font-mono"
                  autoComplete="username"
                />
              </div>
            </div>
          </div>

          {/* Full name field */}
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground flex items-center gap-1.5">
              <User className="w-3 h-3" />
              Full Name
            </Label>
            <div
              className="relative rounded-lg p-[1px]"
              style={{
                background:
                  "linear-gradient(90deg, #dc2626, #f59e0b, #ffd700, #f59e0b, #dc2626)",
                backgroundSize: "300% 100%",
                animation: "fieldBorderGlow 2s linear infinite",
              }}
            >
              <div className="rounded-lg bg-black overflow-hidden">
                <Input
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Your real name"
                  className="bg-transparent border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-sm h-9"
                />
              </div>
            </div>
          </div>

          {/* Glowing Save Button */}
          <Button
            onClick={handleSave}
            disabled={saveProfile.isPending || !handle.trim()}
            size="sm"
            className="w-full font-semibold h-10 text-sm relative overflow-hidden transition-all duration-300"
            style={{
              background: "linear-gradient(135deg, #dc2626, #f59e0b, #ffd700)",
              color: "#fff",
              border: "1px solid rgba(245,158,11,0.5)",
              boxShadow:
                "0 0 25px rgba(245,158,11,0.7), 0 0 50px rgba(220,38,38,0.4), 0 6px 20px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.15)",
              animation: "btnPulse 1.5s ease-in-out infinite",
              transform: "translateY(0)",
              opacity: saveProfile.isPending || !handle.trim() ? 0.6 : 1,
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLElement;
              el.style.boxShadow =
                "0 0 40px rgba(245,158,11,0.9), 0 0 80px rgba(220,38,38,0.6), 0 8px 25px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.2)";
              el.style.transform = "translateY(-3px)";
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLElement;
              el.style.boxShadow =
                "0 0 25px rgba(245,158,11,0.7), 0 0 50px rgba(220,38,38,0.4), 0 6px 20px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.15)";
              el.style.transform = "translateY(0)";
            }}
          >
            {/* Button shine sweep */}
            <span
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.25) 50%, transparent 60%)",
                backgroundSize: "200% 100%",
                animation: "btnShine 2.5s ease infinite",
              }}
            />
            {saveProfile.isPending ? (
              <>
                <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                Saving...
              </>
            ) : saved ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" />
                Saved!
              </>
            ) : !identity ? (
              <>
                <LogIn className="w-3.5 h-3.5 mr-1.5" />
                Login & Save Handle
              </>
            ) : (
              "Save Handle"
            )}
          </Button>
        </div>
      </div>

      {/* CSS keyframes injected inline via style tag */}
      <style>{`
        @keyframes borderGlow {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes btnShine {
          0% { background-position: -100% 0; }
          60% { background-position: 200% 0; }
          100% { background-position: 200% 0; }
        }
        @keyframes goldGreenPulse {
          0% { opacity: 0.5; transform: scale(1); }
          100% { opacity: 1; transform: scale(1.05); }
        }
        @keyframes fieldBorderGlow {
          0% { background-position: 0% 50%; }
          100% { background-position: 300% 50%; }
        }
        @keyframes btnPulse {
          0%, 100% { box-shadow: 0 0 25px rgba(245,158,11,0.7), 0 0 50px rgba(220,38,38,0.4), 0 6px 20px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.15); }
          50% { box-shadow: 0 0 40px rgba(245,158,11,0.9), 0 0 80px rgba(220,38,38,0.6), 0 6px 20px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.2); }
        }
      `}</style>
    </div>
  );
}

function ProfileDisplayCard() {
  const { identity } = useInternetIdentity();
  const { data: profile } = useCallerUserProfile();
  const [copied, setCopied] = useState(false);

  if (!identity || !profile?.name) return null;

  const handle = profile.name;
  const fullName = profile.bio || "—";
  const principalStr = identity.getPrincipal().toString();
  const shortPrincipal =
    principalStr.length > 12 ? `${principalStr.slice(0, 12)}...` : principalStr;
  const profileUrl = `${window.location.origin}${window.location.pathname}#/u/${handle}`;

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(profileUrl);
      setCopied(true);
      toast.success("Profile link copied!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy link.");
    }
  };

  const openPublicProfile = () => {
    window.location.hash = `#/u/${handle}`;
  };

  return (
    <div className="mt-4 w-full max-w-md">
      <div
        className="rounded-2xl border border-cyan/15 bg-background/40 backdrop-blur-md p-4 space-y-3"
        style={{
          boxShadow:
            "0 0 30px oklch(0.75 0.18 210 / 6%), 0 4px 16px rgba(0,0,0,0.25)",
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full bg-cyan/10 border border-cyan/25 flex items-center justify-center">
              <AtSign className="w-3 h-3 text-cyan" />
            </div>
            <span className="text-xs font-semibold text-foreground/70">
              Your ClawPro Profile
            </span>
          </div>
          <button
            type="button"
            onClick={openPublicProfile}
            className="flex items-center gap-1 text-xs text-cyan/70 hover:text-cyan transition-colors"
            title="View public profile"
          >
            <ExternalLink className="w-3 h-3" />
            View
          </button>
        </div>

        {/* Handle name row */}
        <div className="flex items-center justify-between rounded-lg border border-border/50 bg-background/60 px-3 py-2">
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-xs font-mono text-cyan/60 flex-shrink-0">
              ClawPro.ai/
            </span>
            <span className="text-sm font-mono font-bold text-foreground truncate">
              {handle}
            </span>
          </div>
          <button
            type="button"
            onClick={copyLink}
            className="flex-shrink-0 ml-2 w-6 h-6 flex items-center justify-center rounded border border-border/50 hover:border-cyan/40 hover:bg-cyan/5 transition-colors"
            title="Copy profile link"
          >
            {copied ? (
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
              <Copy className="w-3 h-3 text-muted-foreground" />
            )}
          </button>
        </div>

        {/* Full name row */}
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border/30 bg-background/40">
          <User className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
          <span className="text-xs text-muted-foreground flex-shrink-0">
            Full Name
          </span>
          <span className="text-xs font-medium text-foreground/80 truncate ml-auto">
            {fullName}
          </span>
        </div>

        {/* Username (ICP principal) row */}
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border/30 bg-background/40">
          <Fingerprint className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
          <span className="text-xs text-muted-foreground flex-shrink-0">
            Username
          </span>
          <span
            className="text-xs font-mono text-foreground/60 truncate ml-auto"
            title={principalStr}
          >
            {shortPrincipal}
          </span>
        </div>
      </div>
    </div>
  );
}

export function HeroSection() {
  const { data: latestVersion } = useLatestVersion();
  const { data: totalDownloads } = useTotalDownloads();
  const { t } = useLanguage();

  const scrollTo = (id: string) => {
    document.querySelector(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const formattedDownloads = totalDownloads
    ? Number(totalDownloads) > 1000
      ? `${(Number(totalDownloads) / 1000).toFixed(1)}K`
      : totalDownloads.toString()
    : "50K+";

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center overflow-hidden"
    >
      {/* Colorful animated background */}
      <ColorfulBackground />

      {/* Gold-green pulsing ambient layer */}
      <div
        className="absolute inset-0 pointer-events-none z-[1]"
        style={{
          background: `
            radial-gradient(ellipse at 20% 50%, rgba(245,158,11,0.08) 0%, transparent 50%),
            radial-gradient(ellipse at 80% 50%, rgba(16,185,129,0.07) 0%, transparent 50%),
            radial-gradient(ellipse at 50% 20%, rgba(220,38,38,0.05) 0%, transparent 40%)
          `,
          animation: "goldGreenPulse 4s ease-in-out infinite alternate",
        }}
      />

      {/* Moving dots overlay */}
      <DotsBackground />

      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat z-[1]"
        style={{
          backgroundImage:
            "url('/assets/generated/openclaw-hero-banner.dim_1200x400.jpg')",
          opacity: 0.25,
        }}
      />
      {/* Dark overlay — slightly transparent to let colors through */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/50 to-background z-[2]" />

      {/* Content: two-column on lg+, stacked on mobile */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-0">
          {/* Left: Text content */}
          <div className="flex-1 flex flex-col items-center lg:items-start text-center lg:text-left">
            {/* Version badge */}
            <div className="flex mb-6">
              <Badge
                variant="outline"
                className="border-cyan/40 text-cyan bg-cyan/10 px-4 py-1.5 text-sm font-mono"
              >
                <Zap className="w-3.5 h-3.5 mr-1.5" />v
                {latestVersion ?? "2.4.1"} — {t.hero.badge}
              </Badge>
            </div>

            {/* Main Title */}
            <div className="mb-4">
              <h1 className="font-display font-black leading-none tracking-tighter flex items-baseline gap-0">
                <span className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl text-foreground">
                  Claw
                </span>
                <span
                  className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl"
                  style={{
                    background: "linear-gradient(135deg, #dc2626, #f59e0b)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  Pro
                </span>
                <span
                  className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black tracking-widest"
                  style={{
                    background: "linear-gradient(135deg, #f59e0b, #ffd700)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                    marginLeft: "0.1em",
                  }}
                >
                  .ai
                </span>
              </h1>
            </div>

            {/* Subtitle */}
            <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground max-w-2xl mb-8 leading-relaxed">
              {t.hero.subtitle}{" "}
              <span className="text-cyan font-semibold">
                v{latestVersion ?? "2.4.1"}
              </span>{" "}
              — Multi-platform. Real-time. Extensible.
            </p>

            {/* Download counter */}
            <div className="flex mb-10">
              <div className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-cyan/30 bg-cyan/5">
                <Download className="w-4 h-4 text-cyan" />
                <span className="text-cyan font-bold font-mono text-lg">
                  {formattedDownloads}
                </span>
                <span className="text-muted-foreground text-sm">
                  {t.hero.downloads}
                </span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                onClick={() => scrollTo("#setup")}
                className="bg-cyan text-background hover:bg-cyan-bright font-bold text-base px-8 transition-colors duration-200 group"
              >
                <Download className="w-5 h-5 mr-2" />
                {t.hero.downloadNow}
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => scrollTo("#docs")}
                className="border-cyan/40 text-cyan hover:bg-cyan/10 hover:border-cyan/70 font-semibold text-base px-8 transition-colors duration-200"
              >
                <BookOpen className="w-5 h-5 mr-2" />
                {t.hero.viewDocs}
              </Button>
            </div>

            {/* Profile display card — shown when handle is saved */}
            <ProfileDisplayCard />
          </div>

          {/* Right: Robot mascot (desktop) */}
          <div className="hidden lg:flex flex-1 items-center justify-center">
            <RobotMascot />
          </div>

          {/* Mobile: Robot below CTAs */}
          <div className="flex lg:hidden items-center justify-center w-full">
            <img
              src="/assets/generated/clawpro-robot-mascot-transparent.dim_600x700.png"
              alt="ClawPro Robot Mascot"
              className="w-auto animate-float"
              style={{ height: "240px", objectFit: "contain" }}
            />
          </div>
        </div>

        {/* Handle Claim — full-width row below main columns */}
        <div className="flex justify-center mt-8">
          <HandleClaimCard />
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10">
        <div className="w-6 h-10 rounded-full border-2 border-cyan/40 flex items-start justify-center pt-2 animate-float">
          <div className="w-1.5 h-1.5 rounded-full bg-cyan" />
        </div>
      </div>
    </section>
  );
}
