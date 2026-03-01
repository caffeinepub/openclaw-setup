import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  ArrowRight,
  AtSign,
  BookOpen,
  CheckCircle2,
  Copy,
  Crown,
  Download,
  ExternalLink,
  Fingerprint,
  Lightbulb,
  Loader2,
  LogIn,
  Search,
  Shield,
  Star,
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

function BlueGlowCorner({
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

  const gradId = `blueCornerGrad-${position}`;

  return (
    <span
      className={`absolute ${posClass} w-7 h-7 pointer-events-none`}
      style={{ zIndex: 2 }}
    >
      <svg
        width="28"
        height="28"
        viewBox="0 0 28 28"
        fill="none"
        aria-label="blue corner decoration"
        role="img"
      >
        <title>blue corner decoration</title>
        <defs>
          <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00c6ff" />
            <stop offset="50%" stopColor="#0072ff" />
            <stop offset="100%" stopColor="#00e5ff" />
          </linearGradient>
        </defs>
        <path
          d="M2 26 L2 5 Q2 2 5 2 L26 2"
          stroke={`url(#${gradId})`}
          strokeWidth="2.5"
          strokeLinecap="round"
          style={{
            filter:
              "drop-shadow(0 0 6px #00c6ff) drop-shadow(0 0 14px #0072ff) drop-shadow(0 0 24px #00e5ff88)",
          }}
        />
      </svg>
    </span>
  );
}

// ─── Platform data (mirrored from WorkWithEverythingSection) ──────────────────

type PlatformCategory =
  | "Messaging"
  | "Social"
  | "AI"
  | "Productivity"
  | "Entertainment"
  | "Developer"
  | "Smart Home";

interface SearchPlatform {
  id: string;
  name: string;
  desc: string;
  icon: string;
  iconBg: string;
  features: string[];
  useCases: string[];
  category: PlatformCategory;
  popular?: boolean;
}

const SEARCH_PLATFORMS: SearchPlatform[] = [
  {
    id: "facebook",
    name: "Facebook",
    desc: "Automate posts and manage pages",
    icon: "fb",
    iconBg: "rgba(24,119,242,0.2)",
    category: "Social" as PlatformCategory,
    popular: true,
    features: [
      "Automate page posts and stories",
      "Manage comments and DMs automatically",
      "Schedule content in advance",
      "Track engagement analytics",
      "Audience targeting automation",
    ],
    useCases: [
      "Brand social media management",
      "Customer support automation",
      "Scheduled marketing campaigns",
    ],
  },
  {
    id: "instagram",
    name: "Instagram",
    desc: "Schedule content and track engagement",
    icon: "ig",
    iconBg: "rgba(193,53,132,0.2)",
    category: "Social" as PlatformCategory,
    popular: true,
    features: [
      "Schedule posts, Reels, and Stories",
      "Auto-respond to comments",
      "Hashtag and trend monitoring",
      "Follower growth tracking",
      "Influencer collaboration workflows",
    ],
    useCases: [
      "E-commerce product promotion",
      "Content creator scheduling",
      "Brand awareness campaigns",
    ],
  },
  {
    id: "tiktok",
    name: "TikTok",
    desc: "Create and publish short-form videos",
    icon: "tt",
    iconBg: "rgba(255,255,255,0.1)",
    category: "Social" as PlatformCategory,
    popular: true,
    features: [
      "Upload and publish short-form videos",
      "Auto-caption and metadata tagging",
      "Trending sound detection",
      "Cross-platform repurposing",
      "Analytics and performance tracking",
    ],
    useCases: [
      "Viral content distribution",
      "Product launch campaigns",
      "Creator content pipelines",
    ],
  },
  {
    id: "youtube",
    name: "YouTube",
    desc: "Manage channels and upload videos",
    icon: "yt",
    iconBg: "rgba(255,0,0,0.2)",
    category: "Social" as PlatformCategory,
    popular: true,
    features: [
      "Upload and publish videos automatically",
      "Auto-generate titles and descriptions",
      "Thumbnail management",
      "Comment moderation bot",
      "Playlist and chapter management",
    ],
    useCases: [
      "Content channel automation",
      "Tutorial series publishing",
      "Live stream scheduling",
    ],
  },
  {
    id: "whatsapp",
    name: "WhatsApp",
    desc: "Chat automation and bot responses",
    icon: "wa",
    iconBg: "rgba(37,211,102,0.2)",
    category: "Messaging" as PlatformCategory,
    popular: true,
    features: [
      "Send automated messages",
      "Bot command routing",
      "Media sharing (images, docs, audio)",
      "Group management automation",
      "Read receipts webhook",
    ],
    useCases: [
      "E-commerce order notifications",
      "Customer support chatbot",
      "Team alert system",
    ],
  },
  {
    id: "telegram",
    name: "Telegram",
    desc: "Bot commands and channel management",
    icon: "tg",
    iconBg: "rgba(0,136,204,0.2)",
    category: "Messaging" as PlatformCategory,
    popular: true,
    features: [
      "Custom bot commands and menus",
      "Channel broadcast automation",
      "Group moderation tools",
      "Inline query responses",
      "File and media delivery",
    ],
    useCases: [
      "Community announcements",
      "News delivery bot",
      "Internal team notifications",
    ],
  },
  {
    id: "discord",
    name: "Discord",
    desc: "Server automation and bot integration",
    icon: "dc",
    iconBg: "rgba(88,101,242,0.2)",
    category: "Messaging" as PlatformCategory,
    popular: true,
    features: [
      "Server role automation",
      "Custom slash commands",
      "Webhook integrations",
      "Voice channel management",
      "Moderation bot actions",
    ],
    useCases: [
      "Gaming community management",
      "Developer team coordination",
      "Event announcement system",
    ],
  },
  {
    id: "slack",
    name: "Slack",
    desc: "Team notifications and workflow automation",
    icon: "sl",
    iconBg: "rgba(224,30,90,0.15)",
    category: "Messaging" as PlatformCategory,
    features: [
      "Channel notification automation",
      "Slash command integration",
      "Workflow builder triggers",
      "File sharing automation",
      "User status management",
    ],
    useCases: [
      "DevOps alert notifications",
      "Sales pipeline updates",
      "HR onboarding workflows",
    ],
  },
  {
    id: "signal",
    name: "Signal",
    desc: "Secure messaging integration",
    icon: "sg",
    iconBg: "rgba(59,138,224,0.2)",
    category: "Messaging" as PlatformCategory,
    features: [
      "End-to-end encrypted messaging",
      "Secure group messaging",
      "Note-to-self automation",
      "Contact sync",
      "Privacy-first delivery",
    ],
    useCases: [
      "Secure internal communications",
      "Confidential client notifications",
      "High-security alert delivery",
    ],
  },
  {
    id: "imessage",
    name: "iMessage",
    desc: "Apple messaging automation",
    icon: "im",
    iconBg: "rgba(0,199,134,0.2)",
    category: "Messaging" as PlatformCategory,
    features: [
      "Apple ecosystem messaging",
      "Automation via macOS Shortcuts",
      "Group message broadcasting",
      "Rich media delivery",
      "iCloud contact integration",
    ],
    useCases: [
      "Apple device user outreach",
      "iOS app push via iMessage",
      "Automated appointment reminders",
    ],
  },
  {
    id: "claude",
    name: "Claude",
    desc: "AI assistant integration (Anthropic)",
    icon: "cl",
    iconBg: "rgba(204,119,68,0.2)",
    category: "AI" as PlatformCategory,
    popular: true,
    features: [
      "Anthropic Claude API integration",
      "Long-context document analysis",
      "Multi-turn conversation management",
      "Custom system prompt templates",
      "Streaming response support",
    ],
    useCases: [
      "AI-powered content generation",
      "Document summarization pipeline",
      "Intelligent customer support",
    ],
  },
  {
    id: "gpt",
    name: "GPT",
    desc: "OpenAI GPT model integration",
    icon: "gp",
    iconBg: "rgba(16,163,127,0.2)",
    category: "AI" as PlatformCategory,
    popular: true,
    features: [
      "OpenAI GPT model integration",
      "GPT-4o and GPT-4 Turbo support",
      "Function calling and tools",
      "Embeddings and semantic search",
      "Fine-tuning workflow support",
    ],
    useCases: [
      "Intelligent chatbot creation",
      "Code generation assistant",
      "Automated content creation",
    ],
  },
  {
    id: "spotify",
    name: "Spotify",
    desc: "Music playback and playlist control",
    icon: "sp",
    iconBg: "rgba(29,185,84,0.2)",
    category: "Entertainment" as PlatformCategory,
    features: [
      "Playback control automation",
      "Playlist creation and management",
      "Now playing webhooks",
      "Track discovery and recommendations",
      "Podcast integration",
    ],
    useCases: [
      "Music-based mood automation",
      "Office/event playlist management",
      "Podcast workflow integration",
    ],
  },
  {
    id: "hue",
    name: "Hue",
    desc: "Smart lighting automation",
    icon: "hue",
    iconBg: "rgba(255,147,0,0.2)",
    category: "Smart Home" as PlatformCategory,
    features: [
      "Smart bulb control automation",
      "Scene and routine triggering",
      "Color and brightness scheduling",
      "Motion-based light responses",
      "Multi-room group management",
    ],
    useCases: [
      "Smart home automation",
      "Office productivity lighting",
      "Event atmosphere control",
    ],
  },
  {
    id: "obsidian",
    name: "Obsidian",
    desc: "Note-taking and knowledge base sync",
    icon: "ob",
    iconBg: "rgba(124,58,237,0.2)",
    category: "Productivity" as PlatformCategory,
    features: [
      "Vault sync and backup automation",
      "Note creation from webhooks",
      "Tag and metadata management",
      "Daily note generation",
      "Graph and backlink analysis",
    ],
    useCases: [
      "Personal knowledge management",
      "Research note automation",
      "Meeting note creation",
    ],
  },
  {
    id: "x",
    name: "X",
    desc: "Post scheduling and analytics",
    icon: "x",
    iconBg: "rgba(255,255,255,0.1)",
    category: "Social" as PlatformCategory,
    features: [
      "Post scheduling and queuing",
      "Thread automation",
      "Reply and engagement monitoring",
      "Analytics and reach tracking",
      "Keyword alert webhooks",
    ],
    useCases: [
      "Brand social media presence",
      "Thought leadership publishing",
      "Real-time trend monitoring",
    ],
  },
  {
    id: "browser",
    name: "Browser",
    desc: "Web automation and scraping",
    icon: "br",
    iconBg: "rgba(0,120,215,0.2)",
    category: "Developer" as PlatformCategory,
    features: [
      "Headless browser automation",
      "Web scraping pipelines",
      "Form filling automation",
      "Screenshot and PDF capture",
      "Multi-page workflow execution",
    ],
    useCases: [
      "Automated testing workflows",
      "Data collection pipelines",
      "Website monitoring bots",
    ],
  },
  {
    id: "google",
    name: "Google",
    desc: "Search, Drive, Calendar integration",
    icon: "go",
    iconBg: "rgba(66,133,244,0.15)",
    category: "Productivity" as PlatformCategory,
    popular: true,
    features: [
      "Google Search API integration",
      "Google Drive file management",
      "Google Calendar automation",
      "Google Sheets data sync",
      "Google Meet scheduling",
    ],
    useCases: [
      "Business productivity automation",
      "Document workflow management",
      "Scheduling and calendar sync",
    ],
  },
  {
    id: "gmail",
    name: "Gmail",
    desc: "Email automation and filtering",
    icon: "gm",
    iconBg: "rgba(234,67,53,0.2)",
    category: "Productivity" as PlatformCategory,
    features: [
      "Email sending automation",
      "Inbox filtering and labeling",
      "Auto-reply and follow-ups",
      "Attachment handling",
      "Thread and label management",
    ],
    useCases: [
      "Customer communication automation",
      "Newsletter and campaign delivery",
      "Internal alert notifications",
    ],
  },
  {
    id: "github",
    name: "GitHub",
    desc: "Code repository and CI/CD automation",
    icon: "gh",
    iconBg: "rgba(255,255,255,0.12)",
    category: "Developer" as PlatformCategory,
    popular: true,
    features: [
      "Repository event webhooks",
      "CI/CD pipeline triggers",
      "Issue and PR automation",
      "Release management",
      "Code review workflows",
    ],
    useCases: [
      "DevOps automation",
      "Release notification pipeline",
      "Issue triage and routing",
    ],
  },
];

// ─── Inline SVG icon renderer ─────────────────────────────────────────────────

function SearchPlatformIcon({
  icon,
  iconBg,
  size = 40,
}: { icon: string; iconBg: string; size?: number }) {
  const svgSize = size * 0.55;
  const svgIcons: Record<string, React.ReactNode> = {
    fb: (
      <svg
        role="img"
        aria-label="Facebook"
        viewBox="0 0 24 24"
        width={svgSize}
        height={svgSize}
        fill="#1877F2"
      >
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
    ig: (
      <svg
        role="img"
        aria-label="Instagram"
        viewBox="0 0 24 24"
        width={svgSize}
        height={svgSize}
      >
        <defs>
          <linearGradient id="ig-s" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#f09433" />
            <stop offset="50%" stopColor="#dc2743" />
            <stop offset="100%" stopColor="#bc1888" />
          </linearGradient>
        </defs>
        <path
          fill="url(#ig-s)"
          d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"
        />
      </svg>
    ),
    tt: (
      <svg
        role="img"
        aria-label="TikTok"
        viewBox="0 0 24 24"
        width={svgSize}
        height={svgSize}
        fill="white"
      >
        <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.65a8.18 8.18 0 004.78 1.52V6.69a4.85 4.85 0 01-1.01-.0z" />
      </svg>
    ),
    yt: (
      <svg
        role="img"
        aria-label="YouTube"
        viewBox="0 0 24 24"
        width={svgSize}
        height={svgSize}
        fill="#FF0000"
      >
        <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    ),
    wa: (
      <svg
        role="img"
        aria-label="WhatsApp"
        viewBox="0 0 24 24"
        width={svgSize}
        height={svgSize}
        fill="#25D366"
      >
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
      </svg>
    ),
    tg: (
      <svg
        role="img"
        aria-label="Telegram"
        viewBox="0 0 24 24"
        width={svgSize}
        height={svgSize}
        fill="#0088cc"
      >
        <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
      </svg>
    ),
    dc: (
      <svg
        role="img"
        aria-label="Discord"
        viewBox="0 0 24 24"
        width={svgSize}
        height={svgSize}
        fill="#5865F2"
      >
        <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057.1 18.08.115 18.102.133 18.116a19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
      </svg>
    ),
    sl: (
      <svg
        role="img"
        aria-label="Slack"
        viewBox="0 0 24 24"
        width={svgSize}
        height={svgSize}
      >
        <path
          fill="#E01E5A"
          d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zM6.313 15.165a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313z"
        />
        <path
          fill="#36C5F0"
          d="M8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zM8.834 6.313a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312z"
        />
        <path
          fill="#2EB67D"
          d="M18.956 8.834a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.522V8.834zM17.688 8.834a2.528 2.528 0 0 1-2.523 2.521 2.527 2.527 0 0 1-2.52-2.521V2.522A2.527 2.527 0 0 1 15.165 0a2.528 2.528 0 0 1 2.523 2.522v6.312z"
        />
        <path
          fill="#ECB22E"
          d="M15.165 18.956a2.528 2.528 0 0 1 2.523 2.522A2.528 2.528 0 0 1 15.165 24a2.527 2.527 0 0 1-2.52-2.522v-2.522h2.52zM15.165 17.688a2.527 2.527 0 0 1-2.52-2.523 2.526 2.526 0 0 1 2.52-2.52h6.313A2.527 2.527 0 0 1 24 15.165a2.528 2.528 0 0 1-2.522 2.523h-6.313z"
        />
      </svg>
    ),
    sg: (
      <svg
        role="img"
        aria-label="Signal"
        viewBox="0 0 24 24"
        width={svgSize}
        height={svgSize}
        fill="#3B8AE0"
      >
        <path d="M12 0C5.372 0 0 5.372 0 12s5.372 12 12 12 12-5.372 12-12S18.628 0 12 0zm.14 3.5c2.463 0 4.69.933 6.37 2.46L5.96 18.51A8.492 8.492 0 0 1 3.5 12c0-4.69 3.81-8.5 8.64-8.5zm0 17c-2.463 0-4.69-.933-6.37-2.46L18.04 5.49A8.492 8.492 0 0 1 20.5 12c0 4.69-3.81 8.5-8.36 8.5z" />
      </svg>
    ),
    im: (
      <svg
        role="img"
        aria-label="iMessage"
        viewBox="0 0 24 24"
        width={svgSize}
        height={svgSize}
        fill="#00C786"
      >
        <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" />
      </svg>
    ),
    cl: (
      <svg
        role="img"
        aria-label="Claude"
        viewBox="0 0 24 24"
        width={svgSize}
        height={svgSize}
        fill="#CC7744"
      >
        <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm0 18c-4.418 0-8-3.582-8-8s3.582-8 8-8 8 3.582 8 8-3.582 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" />
      </svg>
    ),
    gp: (
      <svg
        role="img"
        aria-label="GPT"
        viewBox="0 0 24 24"
        width={svgSize}
        height={svgSize}
        fill="#10A37F"
      >
        <path d="M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7475-7.0729zm-9.022 12.6081a4.4755 4.4755 0 0 1-2.8764-1.0408l.1419-.0804 4.7783-2.7582a.7948.7948 0 0 0 .3927-.6813v-6.7369l2.02 1.1686a.071.071 0 0 1 .038.052v5.5826a4.504 4.504 0 0 1-4.4945 4.4944zm-9.6607-4.1254a4.4708 4.4708 0 0 1-.5346-3.0137l.142.0852 4.783 2.7582a.7712.7712 0 0 0 .7806 0l5.8428-3.3685v2.3324a.0804.0804 0 0 1-.0332.0615L9.74 19.9502a4.4992 4.4992 0 0 1-6.1408-1.6464zM2.3408 7.8956a4.485 4.485 0 0 1 2.3655-1.9728V11.6a.7664.7664 0 0 0 .3879.6765l5.8144 3.3543-2.0201 1.1685a.0757.0757 0 0 1-.071 0l-4.8303-2.7865A4.504 4.504 0 0 1 2.3408 7.872zm16.5963 3.8558L13.1038 8.364 15.1192 7.2a.0757.0757 0 0 1 .071 0l4.8303 2.7913a4.4944 4.4944 0 0 1-.6765 8.1042v-5.6772a.79.79 0 0 0-.407-.667zm2.0107-3.0231l-.142-.0852-4.7735-2.7818a.7759.7759 0 0 0-.7854 0L9.409 9.2297V6.8974a.0662.0662 0 0 1 .0284-.0615l4.8303-2.7866a4.4992 4.4992 0 0 1 6.6802 4.66zM8.3065 12.863l-2.02-1.1638a.0804.0804 0 0 1-.038-.0567V6.0742a4.4992 4.4992 0 0 1 7.379-3.4537l-.142.0805L8.704 5.459a.7948.7948 0 0 0-.3927.6813zm1.0976-2.3654l2.602-1.4998 2.6069 1.4998v2.9994l-2.5974 1.4997-2.6067-1.4997Z" />
      </svg>
    ),
    sp: (
      <svg
        role="img"
        aria-label="Spotify"
        viewBox="0 0 24 24"
        width={svgSize}
        height={svgSize}
        fill="#1DB954"
      >
        <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
      </svg>
    ),
    hue: (
      <svg
        role="img"
        aria-label="Hue"
        viewBox="0 0 24 24"
        width={svgSize}
        height={svgSize}
        fill="#FF9300"
      >
        <circle cx="12" cy="12" r="5" />
        <path
          d="M12 2v2M12 20v2M2 12h2M20 12h2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"
          stroke="#FF9300"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    ),
    ob: (
      <svg
        role="img"
        aria-label="Obsidian"
        viewBox="0 0 24 24"
        width={svgSize}
        height={svgSize}
      >
        <path
          fill="#7C3AED"
          d="M12.003 0C9.592 0 7.434.968 5.874 2.522L2.52 5.876A7.455 7.455 0 0 0 0 11.275c0 1.843.663 3.528 1.756 4.84L.35 19.51C-.16 21.27.955 23.054 2.717 23.56a3.5 3.5 0 0 0 2.965-.482l3.358-2.343A11.944 11.944 0 0 0 12 21.484c2.41 0 4.57-.969 6.13-2.524l3.352-3.35a7.49 7.49 0 0 0 2.518-5.6 7.454 7.454 0 0 0-1.757-4.84l1.405-3.395C24.16 2.73 23.044.945 21.283.44a3.5 3.5 0 0 0-2.965.482l-3.36 2.344A11.905 11.905 0 0 0 12.003 0z"
        />
      </svg>
    ),
    x: (
      <svg
        role="img"
        aria-label="X"
        viewBox="0 0 24 24"
        width={svgSize}
        height={svgSize}
        fill="white"
      >
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.741l7.732-8.85L1.254 2.25H8.08l4.259 5.63L18.245 2.25h-.001zM17.083 19.77h1.833L7.084 4.126H5.117L17.083 19.77z" />
      </svg>
    ),
    br: (
      <svg
        role="img"
        aria-label="Browser"
        viewBox="0 0 24 24"
        width={svgSize}
        height={svgSize}
        fill="#0078D7"
      >
        <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm-1 17.93c-3.94-.494-7-3.858-7-7.93s3.06-7.436 7-7.93V20zm2 0V4.07c3.94.494 7 3.858 7 7.93s-3.06 7.436-7 7.93z" />
      </svg>
    ),
    go: (
      <svg
        role="img"
        aria-label="Google"
        viewBox="0 0 24 24"
        width={svgSize}
        height={svgSize}
      >
        <path
          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          fill="#4285F4"
        />
        <path
          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          fill="#34A853"
        />
        <path
          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
          fill="#FBBC05"
        />
        <path
          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
          fill="#EA4335"
        />
      </svg>
    ),
    gm: (
      <svg
        role="img"
        aria-label="Gmail"
        viewBox="0 0 24 24"
        width={svgSize}
        height={svgSize}
      >
        <path
          d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L5.455 4.64 12 9.548l6.545-4.91 1.528-1.145C21.69 2.28 24 3.434 24 5.457z"
          fill="#EA4335"
        />
      </svg>
    ),
    gh: (
      <svg
        role="img"
        aria-label="GitHub"
        viewBox="0 0 24 24"
        width={svgSize}
        height={svgSize}
        fill="white"
      >
        <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
      </svg>
    ),
  };
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: size * 0.27,
        background: iconBg,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}
    >
      {svgIcons[icon] ?? (
        <span style={{ fontSize: 14, color: "white" }}>?</span>
      )}
    </div>
  );
}

// ─── Integration Detail Modal (hero search version) ───────────────────────────

function SearchIntegrationModal({
  platform,
  onClose,
}: { platform: SearchPlatform | null; onClose: () => void }) {
  return (
    <Dialog open={!!platform} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-lg bg-card border-border max-h-[90vh] overflow-y-auto">
        {platform && (
          <>
            <DialogHeader>
              <div className="flex items-center gap-4 mb-2">
                <SearchPlatformIcon
                  icon={platform.icon}
                  iconBg={platform.iconBg}
                  size={56}
                />
                <div className="flex-1 min-w-0">
                  <DialogTitle className="text-foreground font-bold text-2xl">
                    {platform.name}
                  </DialogTitle>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    {platform.desc}
                  </p>
                  {/* Category + Popular badges */}
                  <div className="flex items-center gap-2 mt-2 flex-wrap">
                    <span
                      className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium"
                      style={getCategoryStyle(platform.category)}
                    >
                      {platform.category}
                    </span>
                    {platform.popular && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-amber-500/15 text-amber-400 border border-amber-500/35">
                        ★ Popular
                      </span>
                    )}
                  </div>
                </div>
                <Badge
                  className="ml-auto shrink-0 self-start text-xs bg-emerald-500/20 text-emerald-400 border-emerald-500/40"
                  variant="outline"
                >
                  <CheckCircle2 className="w-3 h-3 mr-1" />
                  Available
                </Badge>
              </div>
            </DialogHeader>
            <div className="space-y-5 py-2">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Zap className="w-4 h-4 text-cyan-400" />
                  <h3 className="font-semibold text-sm text-foreground uppercase tracking-wider">
                    Key Features
                  </h3>
                </div>
                <ul className="space-y-2">
                  {platform.features.map((f) => (
                    <li
                      key={f}
                      className="flex items-start gap-2.5 text-sm text-foreground/80"
                    >
                      <div
                        className="mt-1 w-1.5 h-1.5 rounded-full shrink-0"
                        style={{ background: platform.iconBg }}
                      />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Lightbulb className="w-4 h-4 text-amber-400" />
                  <h3 className="font-semibold text-sm text-foreground uppercase tracking-wider">
                    Use Cases
                  </h3>
                </div>
                <ul className="space-y-2">
                  {platform.useCases.map((uc) => (
                    <li
                      key={uc}
                      className="flex items-start gap-2.5 text-sm text-foreground/80"
                    >
                      <ExternalLink className="w-3.5 h-3.5 mt-0.5 shrink-0 text-muted-foreground" />
                      {uc}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            {/* Tier selection buttons */}
            <div className="pt-2 space-y-3">
              <p className="text-xs text-muted-foreground text-center font-medium uppercase tracking-wider">
                Choose your plan to get started
              </p>
              <div className="grid grid-cols-3 gap-2">
                {/* Silver */}
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    setTimeout(() => {
                      document
                        .getElementById("pricing-silver")
                        ?.scrollIntoView({
                          behavior: "smooth",
                          block: "center",
                        });
                    }, 150);
                  }}
                  className="flex flex-col items-center gap-1 py-2.5 px-2 rounded-xl border transition-all duration-200 hover:scale-105 active:scale-95"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(148,163,184,0.12), rgba(71,85,105,0.15))",
                    border: "1px solid rgba(148,163,184,0.4)",
                    boxShadow: "0 0 10px rgba(148,163,184,0.15)",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.boxShadow =
                      "0 0 18px rgba(148,163,184,0.4)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.boxShadow =
                      "0 0 10px rgba(148,163,184,0.15)";
                  }}
                >
                  <Shield className="w-4 h-4 text-slate-300" />
                  <span className="text-xs font-bold text-slate-300 tracking-wide">
                    Silver
                  </span>
                  <span className="text-[10px] text-slate-400">$9.99</span>
                </button>

                {/* Gold */}
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    setTimeout(() => {
                      document.getElementById("pricing-gold")?.scrollIntoView({
                        behavior: "smooth",
                        block: "center",
                      });
                    }, 150);
                  }}
                  className="flex flex-col items-center gap-1 py-2.5 px-2 rounded-xl border transition-all duration-200 hover:scale-105 active:scale-95"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(245,158,11,0.15), rgba(217,119,6,0.18))",
                    border: "1px solid rgba(245,158,11,0.5)",
                    boxShadow: "0 0 10px rgba(245,158,11,0.2)",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.boxShadow =
                      "0 0 20px rgba(245,158,11,0.5)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.boxShadow =
                      "0 0 10px rgba(245,158,11,0.2)";
                  }}
                >
                  <Star className="w-4 h-4 text-amber-400" />
                  <span className="text-xs font-bold text-amber-400 tracking-wide">
                    Gold
                  </span>
                  <span className="text-[10px] text-amber-500/70">$29.99</span>
                </button>

                {/* Platinum */}
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    setTimeout(() => {
                      document
                        .getElementById("pricing-platinum")
                        ?.scrollIntoView({
                          behavior: "smooth",
                          block: "center",
                        });
                    }, 150);
                  }}
                  className="flex flex-col items-center gap-1 py-2.5 px-2 rounded-xl border transition-all duration-200 hover:scale-105 active:scale-95"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(168,85,247,0.15), rgba(139,92,246,0.18))",
                    border: "1px solid rgba(168,85,247,0.5)",
                    boxShadow: "0 0 10px rgba(168,85,247,0.2)",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.boxShadow =
                      "0 0 20px rgba(168,85,247,0.5)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.boxShadow =
                      "0 0 10px rgba(168,85,247,0.2)";
                  }}
                >
                  <Crown className="w-4 h-4 text-purple-400" />
                  <span className="text-xs font-bold text-purple-400 tracking-wide">
                    Platinum
                  </span>
                  <span className="text-[10px] text-purple-500/70">$79.99</span>
                </button>
              </div>

              {/* Close button */}
              <Button
                variant="outline"
                onClick={onClose}
                className="w-full border-border text-sm"
              >
                Close
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

function getCategoryStyle(category: PlatformCategory): React.CSSProperties {
  const styles: Record<PlatformCategory, React.CSSProperties> = {
    Messaging: {
      background: "rgba(37,211,102,0.15)",
      color: "#4ade80",
      border: "1px solid rgba(37,211,102,0.35)",
    },
    Social: {
      background: "rgba(193,53,132,0.15)",
      color: "#f472b6",
      border: "1px solid rgba(193,53,132,0.35)",
    },
    AI: {
      background: "rgba(16,163,127,0.15)",
      color: "#34d399",
      border: "1px solid rgba(16,163,127,0.35)",
    },
    Productivity: {
      background: "rgba(66,133,244,0.15)",
      color: "#60a5fa",
      border: "1px solid rgba(66,133,244,0.35)",
    },
    Entertainment: {
      background: "rgba(29,185,84,0.15)",
      color: "#a3e635",
      border: "1px solid rgba(29,185,84,0.35)",
    },
    Developer: {
      background: "rgba(255,255,255,0.1)",
      color: "#d1d5db",
      border: "1px solid rgba(255,255,255,0.2)",
    },
    "Smart Home": {
      background: "rgba(255,147,0,0.15)",
      color: "#fb923c",
      border: "1px solid rgba(255,147,0,0.35)",
    },
  };
  return styles[category] ?? {};
}

function IntegrationSearchBar() {
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);
  const [selectedPlatform, setSelectedPlatform] =
    useState<SearchPlatform | null>(null);

  const filtered =
    query.trim().length > 0
      ? SEARCH_PLATFORMS.filter((p) =>
          p.name.toLowerCase().includes(query.toLowerCase()),
        )
      : [];

  const handleSelect = (platform: SearchPlatform) => {
    setQuery(platform.name);
    setFocused(false);
    setSelectedPlatform(platform);
  };

  const handleSearch = () => {
    if (filtered.length === 1) {
      setSelectedPlatform(filtered[0]);
    } else {
      const el = document.getElementById("integrations");
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      <SearchIntegrationModal
        platform={selectedPlatform}
        onClose={() => setSelectedPlatform(null)}
      />

      <div className="w-full max-w-lg">
        {/* Outer border glow — animated blue gradient */}
        <div className="relative rounded-2xl" style={{ padding: "1px" }}>
          {/* Animated blue border */}
          <div
            className="absolute inset-0 rounded-2xl pointer-events-none"
            style={{
              background:
                "linear-gradient(135deg, #00c6ff, #0072ff, #00e5ff, #0072ff, #00c6ff)",
              backgroundSize: "300% 300%",
              animation: "blueBorderGlow 3s ease infinite",
              opacity: 0.9,
              zIndex: 0,
            }}
          />

          {/* Inner card */}
          <div
            className="relative rounded-2xl bg-black/90 backdrop-blur-md p-4 space-y-3"
            style={{
              zIndex: 1,
              boxShadow:
                "0 0 30px rgba(0,198,255,0.2), 0 0 60px rgba(0,114,255,0.12), 0 4px 20px rgba(0,0,0,0.5)",
            }}
          >
            {/* Blue glow corners */}
            <BlueGlowCorner position="tl" />
            <BlueGlowCorner position="tr" />
            <BlueGlowCorner position="bl" />
            <BlueGlowCorner position="br" />

            {/* Header */}
            <div className="flex items-center gap-2 mb-1">
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center"
                style={{
                  background: "rgba(0,198,255,0.12)",
                  border: "1px solid rgba(0,198,255,0.5)",
                  boxShadow: "0 0 10px rgba(0,198,255,0.5)",
                }}
              >
                <Search className="w-3.5 h-3.5" style={{ color: "#00c6ff" }} />
              </div>
              <span
                className="text-sm font-semibold"
                style={{
                  color: "#e0f7ff",
                  textShadow: "0 0 10px rgba(0,198,255,0.6)",
                }}
              >
                Search Works With Everything
              </span>
            </div>

            {/* Search input */}
            <div className="relative">
              <div
                className="relative rounded-xl p-[1px]"
                style={{
                  background:
                    "linear-gradient(90deg, #00c6ff, #0072ff, #00e5ff, #0072ff, #00c6ff)",
                  backgroundSize: "300% 100%",
                  animation: focused
                    ? "blueBorderGlow 1.5s linear infinite"
                    : "blueBorderGlow 3s linear infinite",
                }}
              >
                <div className="flex items-center rounded-xl bg-black overflow-hidden">
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => setFocused(true)}
                    onBlur={() => setTimeout(() => setFocused(false), 200)}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    placeholder="Search integrations... Facebook, Discord, GPT..."
                    className="flex-1 bg-transparent px-4 py-2.5 text-sm outline-none"
                    style={{ color: "#e0f7ff" }}
                  />
                  <button
                    type="button"
                    onClick={handleSearch}
                    className="px-4 py-2.5 flex items-center gap-1.5 text-xs font-bold transition-all duration-200"
                    style={{
                      background: "linear-gradient(135deg, #00c6ff, #0072ff)",
                      color: "#fff",
                      borderLeft: "1px solid rgba(0,198,255,0.3)",
                      textShadow: "0 0 8px rgba(0,198,255,0.8)",
                      boxShadow: "inset 0 1px 0 rgba(255,255,255,0.1)",
                    }}
                  >
                    <Search className="w-3.5 h-3.5" />
                    Search
                  </button>
                </div>
              </div>

              {/* Logo dropdown */}
              {focused && filtered.length > 0 && (
                <div
                  className="absolute left-0 right-0 mt-1 rounded-xl overflow-hidden z-50"
                  style={{
                    background: "rgba(0,8,20,0.97)",
                    border: "1px solid rgba(0,198,255,0.35)",
                    boxShadow:
                      "0 8px 32px rgba(0,198,255,0.2), 0 4px 16px rgba(0,0,0,0.6)",
                  }}
                >
                  {filtered.map((platform) => (
                    <button
                      key={platform.id}
                      type="button"
                      onMouseDown={() => handleSelect(platform)}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-left transition-colors duration-150"
                      style={{ color: "#b0e8ff" }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLElement).style.background =
                          "rgba(0,198,255,0.12)";
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLElement).style.background =
                          "transparent";
                      }}
                    >
                      <SearchPlatformIcon
                        icon={platform.icon}
                        iconBg={platform.iconBg}
                        size={32}
                      />
                      <div className="flex flex-col min-w-0 flex-1">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span
                            className="font-semibold text-sm leading-tight"
                            style={{ color: "#e0f7ff" }}
                          >
                            {platform.name}
                          </span>
                          {/* Category badge */}
                          <span
                            className="text-[10px] font-bold px-1.5 py-0.5 rounded-full leading-none"
                            style={getCategoryStyle(platform.category)}
                          >
                            {platform.category}
                          </span>
                          {/* Popular badge */}
                          {platform.popular && (
                            <span
                              className="text-[10px] font-bold px-1.5 py-0.5 rounded-full leading-none"
                              style={{
                                background: "rgba(245,158,11,0.2)",
                                color: "#fbbf24",
                                border: "1px solid rgba(245,158,11,0.4)",
                              }}
                            >
                              ★ Popular
                            </span>
                          )}
                        </div>
                        <span className="text-xs text-muted-foreground truncate mt-0.5">
                          {platform.desc}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Hint */}
            <p
              className="text-xs text-center"
              style={{ color: "rgba(0,198,255,0.5)" }}
            >
              20+ integrations available — click a result to see details
            </p>
          </div>
        </div>

        <style>{`
          @keyframes blueBorderGlow {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
        `}</style>
      </div>
    </>
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
        <div className="flex flex-col items-center gap-5 mt-8">
          <HandleClaimCard />
          <IntegrationSearchBar />
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
