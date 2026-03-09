import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import {
  Bell,
  Bot,
  ChevronRight,
  Coins,
  Home,
  Key,
  Loader2,
  Menu,
  Plus,
  Save,
  Send,
  Settings,
  Sparkles,
  Trash2,
  TrendingDown,
  TrendingUp,
  User,
  Wallet,
  X,
  Zap,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { SiTelegram, SiWhatsapp } from "react-icons/si";
import {
  Cell,
  Pie,
  PieChart,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
} from "recharts";
import { toast } from "sonner";
import { MembershipTier } from "../backend.d";
import {
  useChatbotConfig,
  useDeleteChatbotConfig,
  useSaveChatbotConfig,
} from "../hooks/useChatbot";
import {
  useForumNotifications,
  useMyUserAccount,
  useSaveUserAccount,
} from "../hooks/useForumQueries";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  MembershipTier as MembershipTierEnum,
  useMyMembership,
} from "../hooks/useMembership";
import {
  useCallerUserProfile,
  useSaveCallerUserProfile,
} from "../hooks/useQueries";

// ---- Types ----
type SidebarItem =
  | "home"
  | "clawbot"
  | "whatsapp"
  | "telegram"
  | "chatgpt"
  | "pricealerts"
  | "settings";

interface ChatMessage {
  id: string;
  role: "user" | "bot";
  text: string;
  time: string;
}

export interface PriceAlert {
  id: string;
  coin: string;
  coinId: string;
  type: "above" | "below";
  target: number;
  triggered: boolean;
  active: boolean;
}

// ---- Tier Styles ----
const TIER_STYLES: Record<
  MembershipTier,
  { label: string; color: string; badgeCls: string; glow: string }
> = {
  [MembershipTier.silver]: {
    label: "Silver",
    color: "#94a3b8",
    badgeCls: "bg-slate-500/20 text-slate-300 border-slate-500/40",
    glow: "0 0 20px rgba(148,163,184,0.35)",
  },
  [MembershipTier.gold]: {
    label: "Gold",
    color: "#f59e0b",
    badgeCls: "bg-amber-500/20 text-amber-300 border-amber-500/40",
    glow: "0 0 20px rgba(245,158,11,0.5)",
  },
  [MembershipTier.platinum]: {
    label: "Platinum",
    color: "#a78bfa",
    badgeCls: "bg-violet-500/20 text-violet-300 border-violet-500/40",
    glow: "0 0 20px rgba(167,139,250,0.5)",
  },
};

// ---- Sidebar nav items ----
const NAV_ITEMS: {
  id: SidebarItem;
  label: string;
  icon: React.ReactNode;
  color: string;
  glow: string;
}[] = [
  {
    id: "home",
    label: "Overview",
    icon: <Home className="w-4 h-4" />,
    color: "text-cyan-400",
    glow: "border-cyan-500/60",
  },
  {
    id: "clawbot",
    label: "ClawBot AI",
    icon: <Bot className="w-4 h-4" />,
    color: "text-red-400",
    glow: "border-red-500/60",
  },
  {
    id: "whatsapp",
    label: "WhatsApp Bot",
    icon: <SiWhatsapp className="w-4 h-4" />,
    color: "text-green-400",
    glow: "border-green-500/60",
  },
  {
    id: "telegram",
    label: "Telegram Bot",
    icon: <SiTelegram className="w-4 h-4" />,
    color: "text-blue-400",
    glow: "border-blue-500/60",
  },
  {
    id: "chatgpt",
    label: "ChatGPT",
    icon: <Sparkles className="w-4 h-4" />,
    color: "text-emerald-400",
    glow: "border-emerald-500/60",
  },
  {
    id: "pricealerts",
    label: "Price Alerts",
    icon: <Bell className="w-4 h-4" />,
    color: "text-amber-400",
    glow: "border-amber-500/60",
  },
  {
    id: "settings",
    label: "Settings",
    icon: <Settings className="w-4 h-4" />,
    color: "text-violet-400",
    glow: "border-violet-500/60",
  },
];

// ---- Main Dashboard ----
export function MemberDashboard({ onClose }: { onClose: () => void }) {
  const [active, setActive] = useState<SidebarItem>("home");
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const { identity } = useInternetIdentity();
  const { data: membership } = useMyMembership();
  const { data: userAccount } = useMyUserAccount();
  const { data: notifications } = useForumNotifications();

  const principal = identity?.getPrincipal().toString() ?? "";
  const handle = userAccount?.handle ?? principal.slice(0, 8);
  const fullName = userAccount?.fullName ?? "ClawPro User";
  const tier = membership?.tier ?? MembershipTierEnum.silver;
  const tierStyle = TIER_STYLES[tier];
  const unreadCount = notifications?.filter((n) => !n.read).length ?? 0;

  // UserClaw picker state
  const [clawStyle, setClawStyle] = useState<number>(() => {
    const saved = localStorage.getItem("clawpro_avatar_style");
    return saved !== null ? Number.parseInt(saved, 10) : 0;
  });
  const [avatarPhoto, setAvatarPhoto] = useState<string | null>(() =>
    localStorage.getItem("clawpro_avatar_photo"),
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target?.result as string;
      setAvatarPhoto(dataUrl);
      localStorage.setItem("clawpro_avatar_photo", dataUrl);
    };
    reader.readAsDataURL(file);
  };

  const handleRemovePhoto = () => {
    setAvatarPhoto(null);
    localStorage.removeItem("clawpro_avatar_photo");
  };

  const selectClawStyle = (idx: number) => {
    setClawStyle(idx);
    localStorage.setItem("clawpro_avatar_style", String(idx));
  };

  const CLAW_COLORS = ["#ef4444", "#fbbf24", "#06b6d4", "#8b5cf6"];
  const CLAW_LABELS = ["Red Steel", "Gold", "Cyan Cyber", "Purple Crystal"];

  const renderClawSVG = (style: number) => {
    if (style === 0)
      return (
        <svg
          viewBox="0 0 64 64"
          width="56"
          height="56"
          role="img"
          aria-label="Red Steel Claw"
          xmlns="http://www.w3.org/2000/svg"
        >
          <title>Red Steel Claw</title>
          <style>{`
          @keyframes clawSnap0 {
            0%,100%{transform:rotate(-18deg)}
            40%,60%{transform:rotate(18deg)}
          }
          @keyframes clawSnap0b {
            0%,100%{transform:rotate(18deg)}
            40%,60%{transform:rotate(-18deg)}
          }
          .cs0a{transform-origin:32px 48px;animation:clawSnap0 2s infinite}
          .cs0b{transform-origin:32px 48px;animation:clawSnap0b 2s infinite}
        `}</style>
          <defs>
            <linearGradient id="cg0" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ef4444" />
              <stop offset="100%" stopColor="#7f1d1d" />
            </linearGradient>
          </defs>
          <g className="cs0a">
            <path
              d="M28 48 L18 14 Q16 8 22 10 L30 42Z"
              fill="url(#cg0)"
              rx="3"
            />
            <path
              d="M28 48 L16 18 Q12 10 20 12 L30 44Z"
              fill="#ef444480"
              rx="3"
            />
          </g>
          <g className="cs0b">
            <path
              d="M36 48 L46 14 Q48 8 42 10 L34 42Z"
              fill="url(#cg0)"
              rx="3"
            />
            <path
              d="M36 48 L48 18 Q52 10 44 12 L34 44Z"
              fill="#ef444480"
              rx="3"
            />
          </g>
          <ellipse cx="32" cy="50" rx="8" ry="4" fill="#7f1d1d" />
        </svg>
      );
    if (style === 1)
      return (
        <svg
          viewBox="0 0 64 64"
          width="56"
          height="56"
          role="img"
          aria-label="Gold Claw"
          xmlns="http://www.w3.org/2000/svg"
        >
          <title>Gold Claw</title>
          <style>{`
          @keyframes clawSnap1 {
            0%,100%{transform:rotate(-12deg)}
            50%{transform:rotate(12deg)}
          }
          @keyframes clawSnap1b {
            0%,100%{transform:rotate(12deg)}
            50%{transform:rotate(-12deg)}
          }
          .cs1a{transform-origin:32px 48px;animation:clawSnap1 2.5s ease-in-out infinite}
          .cs1b{transform-origin:32px 48px;animation:clawSnap1b 2.5s ease-in-out infinite}
        `}</style>
          <defs>
            <linearGradient id="cg1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fbbf24" />
              <stop offset="100%" stopColor="#92400e" />
            </linearGradient>
          </defs>
          <g className="cs1a">
            <path d="M29 48 L20 16 Q18 8 24 11 L31 44Z" fill="url(#cg1)" />
            <path d="M29 48 L17 20 Q13 11 21 13 L31 46Z" fill="#fbbf2450" />
          </g>
          <g className="cs1b">
            <path d="M35 48 L44 16 Q46 8 40 11 L33 44Z" fill="url(#cg1)" />
            <path d="M35 48 L47 20 Q51 11 43 13 L33 46Z" fill="#fbbf2450" />
          </g>
          <ellipse cx="32" cy="50" rx="8" ry="4" fill="#92400e" />
        </svg>
      );
    if (style === 2)
      return (
        <svg
          viewBox="0 0 64 64"
          width="56"
          height="56"
          role="img"
          aria-label="Cyan Cyber Claw"
          xmlns="http://www.w3.org/2000/svg"
        >
          <title>Cyan Cyber Claw</title>
          <style>{`
          @keyframes clawSnap2a {
            0%,100%{transform:rotate(-14deg)}
            40%{transform:rotate(14deg)}
          }
          @keyframes clawSnap2b {
            0%,100%{transform:rotate(0deg)}
            40%{transform:rotate(-8deg)}
          }
          @keyframes clawSnap2c {
            0%,100%{transform:rotate(14deg)}
            40%{transform:rotate(-14deg)}
          }
          .cs2a{transform-origin:32px 50px;animation:clawSnap2a 1.6s infinite}
          .cs2b{transform-origin:32px 50px;animation:clawSnap2b 1.6s infinite}
          .cs2c{transform-origin:32px 50px;animation:clawSnap2c 1.6s infinite}
        `}</style>
          <defs>
            <linearGradient id="cg2" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#06b6d4" />
              <stop offset="100%" stopColor="#0e7490" />
            </linearGradient>
          </defs>
          <g className="cs2a">
            <path
              d="M30 50 L22 12 Q21 7 25 9 L32 46Z"
              fill="url(#cg2)"
              strokeWidth="1"
              stroke="#22d3ee30"
            />
          </g>
          <g className="cs2b">
            <path
              d="M32 50 L32 10 Q32 6 34 9 L34 47Z"
              fill="url(#cg2)"
              strokeWidth="1"
              stroke="#22d3ee30"
            />
          </g>
          <g className="cs2c">
            <path
              d="M34 50 L42 12 Q43 7 39 9 L32 46Z"
              fill="url(#cg2)"
              strokeWidth="1"
              stroke="#22d3ee30"
            />
          </g>
          <ellipse cx="32" cy="51" rx="7" ry="3" fill="#0e7490" />
        </svg>
      );
    // style === 3
    return (
      <svg
        viewBox="0 0 64 64"
        width="56"
        height="56"
        role="img"
        aria-label="Purple Crystal Claw"
        xmlns="http://www.w3.org/2000/svg"
      >
        <title>Purple Crystal Claw</title>
        <style>{`
          @keyframes clawSnap3a {
            0%,100%{transform:rotate(-20deg);filter:drop-shadow(0 0 4px #8b5cf680)}
            50%{transform:rotate(8deg);filter:drop-shadow(0 0 10px #8b5cf6cc)}
          }
          @keyframes clawSnap3b {
            0%,100%{transform:rotate(20deg);filter:drop-shadow(0 0 4px #8b5cf680)}
            50%{transform:rotate(-8deg);filter:drop-shadow(0 0 10px #8b5cf6cc)}
          }
          .cs3a{transform-origin:32px 48px;animation:clawSnap3a 3s infinite}
          .cs3b{transform-origin:32px 48px;animation:clawSnap3b 3s infinite}
        `}</style>
        <defs>
          <linearGradient id="cg3" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#a78bfa" />
            <stop offset="100%" stopColor="#4c1d95" />
          </linearGradient>
        </defs>
        <g className="cs3a">
          <path d="M28 48 L16 14 Q14 6 22 9 L30 44Z" fill="url(#cg3)" />
          <path d="M27 48 L14 18 Q11 9 19 11 L29 45Z" fill="#8b5cf640" />
        </g>
        <g className="cs3b">
          <path d="M36 48 L48 14 Q50 6 42 9 L34 44Z" fill="url(#cg3)" />
          <path d="M37 48 L50 18 Q53 9 45 11 L35 45Z" fill="#8b5cf640" />
        </g>
        <ellipse cx="32" cy="50" rx="8" ry="4" fill="#4c1d95" />
      </svg>
    );
  };

  return (
    <div
      className="fixed inset-0 z-50 flex"
      style={{ background: "oklch(0.07 0.015 240)" }}
    >
      {/* Mobile overlay */}
      {mobileSidebarOpen && (
        <div
          role="button"
          tabIndex={0}
          className="fixed inset-0 bg-black/60 z-40 md:hidden"
          onClick={() => setMobileSidebarOpen(false)}
          onKeyDown={(e) => e.key === "Escape" && setMobileSidebarOpen(false)}
          aria-label="Close sidebar"
        />
      )}

      {/* Sidebar */}
      <aside
        className={[
          "fixed md:relative z-50 md:z-auto",
          "w-64 h-full flex flex-col",
          "border-r border-white/10",
          "transition-transform duration-300",
          mobileSidebarOpen
            ? "translate-x-0"
            : "-translate-x-full md:translate-x-0",
        ].join(" ")}
        style={{ background: "oklch(0.1 0.015 240)" }}
      >
        {/* Profile Header */}
        <div className="p-5 pb-4">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-semibold text-cyan-400/70 uppercase tracking-wider">
              ClawPro.ai
            </span>
            <button
              type="button"
              onClick={onClose}
              className="p-1 rounded text-muted-foreground hover:text-foreground hover:bg-white/10 transition-colors"
              aria-label="Close dashboard"
              data-ocid="dashboard.close.button"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Avatar + Info - UserClaw Picker */}
          <div className="flex flex-col items-center text-center gap-2">
            <div className="relative">
              {/* Avatar display */}
              <div
                className="w-16 h-16 rounded-full border-2 overflow-hidden flex items-center justify-center relative"
                style={{
                  borderColor: tierStyle.color,
                  boxShadow: tierStyle.glow,
                  background: `${tierStyle.color}20`,
                }}
              >
                {avatarPhoto ? (
                  <img
                    src={avatarPhoto}
                    alt="avatar"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  renderClawSVG(clawStyle)
                )}
              </div>
              {/* Ambient glow ring */}
              <div
                className="absolute -inset-1 rounded-full -z-10 blur-sm"
                style={{ background: `${tierStyle.color}30` }}
              />
              {/* Camera upload button */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-gray-800 border border-white/20 flex items-center justify-center hover:bg-gray-700 transition-colors"
                title="Upload photo"
                data-ocid="dashboard.avatar.upload_button"
              >
                <svg
                  role="img"
                  aria-label="Upload photo"
                  viewBox="0 0 16 16"
                  width="10"
                  height="10"
                  fill="currentColor"
                  className="text-cyan-400"
                >
                  <title>Upload photo</title>
                  <path d="M15 12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h1.172a3 3 0 0 0 2.12-.879l.83-.828A1 1 0 0 1 6.827 3h2.344a1 1 0 0 1 .707.293l.828.828A3 3 0 0 0 12.828 5H14a1 1 0 0 1 1 1v6zM2 4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-1.172a2 2 0 0 1-1.414-.586l-.828-.828A2 2 0 0 0 9.172 2H6.828a2 2 0 0 0-1.414.586l-.828.828A2 2 0 0 1 3.172 4H2z" />
                  <path d="M8 11a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5zm0 1a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z" />
                </svg>
              </button>
              {/* Remove photo button */}
              {avatarPhoto && (
                <button
                  type="button"
                  onClick={handleRemovePhoto}
                  className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-600 border border-white/20 flex items-center justify-center hover:bg-red-500 transition-colors"
                  title="Remove photo"
                  data-ocid="dashboard.avatar.delete_button"
                >
                  <X className="w-2.5 h-2.5 text-white" />
                </button>
              )}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                ref={fileInputRef}
                onChange={handlePhotoUpload}
              />
            </div>
            {/* Claw style selector (hidden when photo uploaded) */}
            {!avatarPhoto && (
              <div className="flex gap-1.5 mt-1">
                {CLAW_COLORS.map((color, idx) => (
                  <button
                    key={CLAW_LABELS[idx]}
                    type="button"
                    onClick={() => selectClawStyle(idx)}
                    title={CLAW_LABELS[idx]}
                    data-ocid="dashboard.claw.toggle"
                    className="w-5 h-5 rounded-full flex items-center justify-center transition-all"
                    style={{
                      background: `${color}30`,
                      border:
                        clawStyle === idx
                          ? `2px solid ${color}`
                          : "2px solid transparent",
                      boxShadow:
                        clawStyle === idx ? `0 0 8px ${color}80` : "none",
                    }}
                  >
                    <span
                      className="w-2 h-2 rounded-full block"
                      style={{ background: color }}
                    />
                  </button>
                ))}
              </div>
            )}
            <div>
              <p className="font-semibold text-sm text-foreground">
                {fullName}
              </p>
              <p className="text-xs text-muted-foreground">@{handle}</p>
            </div>
            <Badge
              className={`border text-[10px] px-2 py-0.5 ${tierStyle.badgeCls}`}
            >
              {tierStyle.label}
            </Badge>
          </div>

          {/* Token balance */}
          <div
            className="mt-4 flex items-center justify-center gap-1.5 rounded-lg px-3 py-2 border border-amber-500/30"
            style={{
              background: "oklch(0.12 0.02 60)",
              boxShadow: "0 0 12px rgba(251,191,36,0.25)",
            }}
          >
            <Coins className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-xs text-amber-300 font-medium">
              2,450 tokens
            </span>
          </div>
        </div>

        <Separator className="mx-4 opacity-20" />

        {/* Navigation */}
        <ScrollArea className="flex-1 px-3 py-3">
          <nav className="space-y-1">
            {NAV_ITEMS.map((item) => {
              const isActive = active === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  data-ocid={`dashboard.${item.id}.tab`}
                  onClick={() => {
                    setActive(item.id);
                    setMobileSidebarOpen(false);
                  }}
                  className={[
                    "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium",
                    "transition-all duration-200 relative border-l-2",
                    isActive
                      ? `${item.color} ${item.glow}`
                      : "text-muted-foreground hover:text-foreground border-transparent",
                  ].join(" ")}
                  style={
                    isActive
                      ? {
                          background: "rgba(255,255,255,0.06)",
                          boxShadow: "inset 0 0 12px rgba(6,182,212,0.08)",
                        }
                      : {}
                  }
                >
                  <span className={isActive ? item.color : ""}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                  {item.id === "settings" && unreadCount > 0 && (
                    <span className="ml-auto flex items-center justify-center w-4 h-4 rounded-full bg-red-500 text-[10px] font-bold text-white">
                      {unreadCount}
                    </span>
                  )}
                  {isActive && (
                    <ChevronRight className="ml-auto w-3 h-3 opacity-60" />
                  )}
                </button>
              );
            })}
          </nav>
        </ScrollArea>

        {/* Footer */}
        <div className="p-4 border-t border-white/10">
          <p className="text-[10px] text-muted-foreground text-center">
            Powered by{" "}
            <a
              href="https://andri.id"
              className="text-cyan-400 hover:underline"
              target="_blank"
              rel="noreferrer"
            >
              andri.id
            </a>
          </p>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 h-full">
        {/* Top bar */}
        <div
          className="flex items-center gap-3 px-4 py-3 border-b border-white/10"
          style={{ background: "oklch(0.09 0.015 240)" }}
        >
          <button
            type="button"
            className="md:hidden p-1.5 rounded text-muted-foreground hover:text-foreground"
            onClick={() => setMobileSidebarOpen(true)}
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <span className={NAV_ITEMS.find((i) => i.id === active)?.color}>
              {NAV_ITEMS.find((i) => i.id === active)?.icon}
            </span>
            <h1 className="font-semibold text-sm">
              {NAV_ITEMS.find((i) => i.id === active)?.label}
            </h1>
          </div>
          <div className="ml-auto flex items-center gap-2">
            {unreadCount > 0 && (
              <button
                type="button"
                className="relative p-1.5 text-muted-foreground hover:text-foreground"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-red-500 rounded-full text-[9px] flex items-center justify-center text-white">
                  {unreadCount}
                </span>
              </button>
            )}
          </div>
        </div>

        {/* Panel content */}
        <div className="flex-1 overflow-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="h-full"
            >
              {active === "home" && (
                <HomePanel
                  handle={handle}
                  fullName={fullName}
                  tier={tier}
                  tierStyle={tierStyle}
                />
              )}
              {active === "clawbot" && <ClawBotPanel handle={handle} />}
              {active === "whatsapp" && <WhatsAppPanel />}
              {active === "telegram" && <TelegramPanel />}
              {active === "chatgpt" && <ChatGPTPanel />}
              {active === "pricealerts" && <PriceAlertsPanel />}
              {active === "settings" && (
                <SettingsPanel
                  handle={handle}
                  fullName={fullName}
                  userAccount={userAccount}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

// ---- Home Panel ----
function HomePanel({
  handle,
  fullName,
  tier,
  tierStyle,
}: {
  handle: string;
  fullName: string;
  tier: MembershipTier;
  tierStyle: { label: string; color: string; badgeCls: string; glow: string };
}) {
  void tier;

  const tokenBalance = 2450;

  // Crypto prices (approximate, updated periodically)
  const COIN_PRICES: Record<string, number> = {
    BTC: 98000,
    ETH: 3300,
    USDT: 1,
    SOL: 180,
    BNB: 420,
    XRP: 0.55,
  };

  const DEFAULT_PORTFOLIO = [
    {
      symbol: "BTC",
      name: "Bitcoin",
      amount: "0.0045",
      color: "#f7931a",
      change: 2.4,
    },
    {
      symbol: "ETH",
      name: "Ethereum",
      amount: "0.85",
      color: "#627eea",
      change: -1.2,
    },
    {
      symbol: "USDT",
      name: "Tether",
      amount: "120",
      color: "#26a17b",
      change: 0.01,
    },
    {
      symbol: "SOL",
      name: "Solana",
      amount: "2.5",
      color: "#9945ff",
      change: 3.8,
    },
    {
      symbol: "BNB",
      name: "BNB",
      amount: "1.2",
      color: "#f0b90b",
      change: 1.5,
    },
    {
      symbol: "XRP",
      name: "XRP",
      amount: "500",
      color: "#00aae4",
      change: -0.8,
    },
  ];

  const [portfolio, setPortfolio] = useState(() => {
    try {
      const saved = localStorage.getItem("clawpro_portfolio");
      return saved ? JSON.parse(saved) : DEFAULT_PORTFOLIO;
    } catch {
      return DEFAULT_PORTFOLIO;
    }
  });
  const [editingPortfolio, setEditingPortfolio] = useState(false);
  const [editAmounts, setEditAmounts] = useState<Record<string, string>>({});
  const [donutRevealed, setDonutRevealed] = useState(false);
  const donutTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const getPortfolioWithValues = () =>
    portfolio.map((c: (typeof DEFAULT_PORTFOLIO)[0]) => ({
      ...c,
      value: Number.parseFloat(c.amount) * (COIN_PRICES[c.symbol] ?? 1),
    }));

  const totalPortfolio = getPortfolioWithValues().reduce(
    (sum: number, c: { value: number }) => sum + c.value,
    0,
  );

  const startEdit = () => {
    const amounts: Record<string, string> = {};
    for (const c of portfolio) amounts[c.symbol] = c.amount;
    setEditAmounts(amounts);
    setEditingPortfolio(true);
  };

  const saveEdit = () => {
    const updated = portfolio.map((c: (typeof DEFAULT_PORTFOLIO)[0]) => ({
      ...c,
      amount: editAmounts[c.symbol] ?? c.amount,
    }));
    setPortfolio(updated);
    localStorage.setItem("clawpro_portfolio", JSON.stringify(updated));
    setEditingPortfolio(false);
  };

  const apps = [
    {
      id: "clawbot",
      label: "ClawBot AI",
      desc: "Personal AI assistant",
      icon: "🤖",
      color: "#ef4444",
    },
    {
      id: "whatsapp",
      label: "WhatsApp Bot",
      desc: "WA automation",
      icon: "💬",
      color: "#22c55e",
    },
    {
      id: "telegram",
      label: "Telegram Bot",
      desc: "Telegram automation",
      icon: "✈️",
      color: "#3b82f6",
    },
    {
      id: "chatgpt",
      label: "ChatGPT",
      desc: "OpenAI integration",
      icon: "✨",
      color: "#10b981",
    },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Welcome */}
      <div
        className="rounded-xl p-5 border border-cyan-500/20"
        style={{
          background:
            "linear-gradient(135deg, oklch(0.12 0.02 240), oklch(0.08 0.015 260))",
          boxShadow: "0 0 20px rgba(6,182,212,0.1)",
        }}
      >
        <h2 className="text-xl font-bold mb-1">
          Welcome back,{" "}
          <span style={{ color: tierStyle.color }}>@{handle}</span> 👋
        </h2>
        <p className="text-sm text-muted-foreground">{fullName}</p>
        <div className="mt-3 flex items-center gap-2">
          <Badge className={`border text-xs ${tierStyle.badgeCls}`}>
            {tierStyle.label} Member
          </Badge>
          <span className="text-xs text-muted-foreground">Active</span>
        </div>
      </div>

      {/* Wallet & Portfolio */}
      <div>
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
          <Wallet className="w-4 h-4 text-amber-400" />
          Wallet & Portfolio
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
          {/* Token Balance Card */}
          <div
            className="sm:col-span-1 rounded-xl p-4 border border-amber-500/30 flex flex-col gap-2"
            style={{
              background: "oklch(0.11 0.02 60)",
              boxShadow: "0 0 20px rgba(251,191,36,0.2)",
            }}
          >
            <div className="flex items-center gap-2">
              <Coins className="w-4 h-4 text-amber-400" />
              <span className="text-xs text-amber-300/70 font-medium uppercase tracking-wider">
                ClawPro Tokens
              </span>
            </div>
            <div className="text-2xl font-bold text-amber-300">
              {tokenBalance.toLocaleString()}
            </div>
            <div className="text-xs text-amber-400/60">
              ≈ ${(tokenBalance / 100).toFixed(2)} USD
            </div>
            <Button
              size="sm"
              className="mt-1 text-xs h-7 bg-amber-600/80 hover:bg-amber-500 text-white border-0"
              style={{ boxShadow: "0 0 12px rgba(251,191,36,0.3)" }}
              data-ocid="wallet.topup.button"
            >
              <Plus className="w-3 h-3 mr-1" />
              Top Up Tokens
            </Button>
          </div>

          {/* Crypto Portfolio */}
          <div
            className="sm:col-span-2 rounded-xl p-4 border border-cyan-500/20"
            style={{
              background: "oklch(0.09 0.015 240)",
              boxShadow: "0 0 20px rgba(6,182,212,0.08)",
            }}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                Crypto Holdings
              </span>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-cyan-300">
                  $
                  {totalPortfolio.toLocaleString(undefined, {
                    maximumFractionDigits: 2,
                  })}
                </span>
                {editingPortfolio ? (
                  <Button
                    size="sm"
                    className="h-6 px-2 text-[10px] bg-green-600/80 hover:bg-green-500 border-0"
                    onClick={saveEdit}
                    data-ocid="portfolio.save_button"
                  >
                    <Save className="w-3 h-3 mr-1" /> Save
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-6 px-2 text-[10px] text-cyan-400 hover:text-cyan-300"
                    onClick={startEdit}
                    data-ocid="portfolio.edit_button"
                  >
                    Edit
                  </Button>
                )}
              </div>
            </div>
            <div className="space-y-2.5">
              {getPortfolioWithValues().map(
                (coin: {
                  symbol: string;
                  name: string;
                  amount: string;
                  value: number;
                  change: number;
                  color: string;
                }) => (
                  <div key={coin.symbol} className="flex items-center gap-3">
                    <div
                      className="w-2 h-2 rounded-full flex-shrink-0"
                      style={{
                        background: coin.color,
                        boxShadow: `0 0 6px ${coin.color}80`,
                      }}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold">
                          {coin.symbol}
                        </span>
                        <span className="text-xs font-bold">
                          $
                          {coin.value.toLocaleString(undefined, {
                            maximumFractionDigits: 2,
                          })}
                        </span>
                      </div>
                      {editingPortfolio ? (
                        <div className="flex items-center gap-1 mt-1">
                          <span className="text-[10px] text-muted-foreground">
                            Amount:
                          </span>
                          <input
                            type="number"
                            min="0"
                            step="any"
                            className="w-full h-5 text-[10px] bg-white/5 border border-cyan-500/30 rounded px-1 text-cyan-300 focus:outline-none focus:border-cyan-400"
                            value={editAmounts[coin.symbol] ?? coin.amount}
                            onChange={(e) =>
                              setEditAmounts((prev) => ({
                                ...prev,
                                [coin.symbol]: e.target.value,
                              }))
                            }
                            data-ocid="portfolio.input"
                          />
                          <span className="text-[10px] text-muted-foreground">
                            {coin.symbol}
                          </span>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] text-muted-foreground">
                            {coin.amount} {coin.symbol}
                          </span>
                          <span
                            className={`text-[10px] font-medium flex items-center gap-0.5 ${
                              coin.change >= 0
                                ? "text-green-400"
                                : "text-red-400"
                            }`}
                          >
                            {coin.change >= 0 ? (
                              <TrendingUp className="w-2.5 h-2.5" />
                            ) : (
                              <TrendingDown className="w-2.5 h-2.5" />
                            )}
                            {coin.change >= 0 ? "+" : ""}
                            {coin.change}%
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                ),
              )}
            </div>
            {/* Donut Chart - Portfolio Distribution */}
            {!editingPortfolio && totalPortfolio > 0 && (
              <div
                className="mt-4 pt-3 border-t border-white/5 transition-all duration-700 ease-out"
                style={{
                  opacity: donutRevealed ? 1 : 0,
                  transform: donutRevealed ? "scale(1)" : "scale(0.9)",
                }}
                ref={(el) => {
                  if (el && !donutTimerRef.current) {
                    donutTimerRef.current = setTimeout(
                      () => setDonutRevealed(true),
                      200,
                    );
                  }
                }}
              >
                <div className="text-[10px] text-muted-foreground uppercase tracking-wider mb-2 text-center">
                  Distribution
                </div>
                <div className="flex items-center gap-3">
                  <div
                    className="relative flex-shrink-0"
                    style={{ width: 90, height: 90 }}
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={getPortfolioWithValues()}
                          cx="50%"
                          cy="50%"
                          innerRadius={28}
                          outerRadius={42}
                          paddingAngle={2}
                          dataKey="value"
                          stroke="none"
                        >
                          {getPortfolioWithValues().map(
                            (coin: { symbol: string; color: string }) => (
                              <Cell key={coin.symbol} fill={coin.color} />
                            ),
                          )}
                        </Pie>
                        <RechartsTooltip
                          formatter={(val: number, name: string) => [
                            `$${(val as number).toLocaleString(undefined, { maximumFractionDigits: 2 })}`,
                            name,
                          ]}
                          contentStyle={{
                            background: "#0a0a0f",
                            border: "1px solid rgba(6,182,212,0.3)",
                            borderRadius: 8,
                            fontSize: 11,
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                      <span className="text-[9px] text-muted-foreground">
                        Total
                      </span>
                      <span className="text-[10px] font-bold text-cyan-300">
                        ${(totalPortfolio / 1000).toFixed(1)}k
                      </span>
                    </div>
                  </div>
                  <div className="flex-1 grid grid-cols-2 gap-1">
                    {getPortfolioWithValues().map(
                      (coin: {
                        symbol: string;
                        value: number;
                        color: string;
                      }) => (
                        <div
                          key={coin.symbol}
                          className="flex items-center gap-1"
                        >
                          <div
                            className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                            style={{ background: coin.color }}
                          />
                          <span className="text-[10px] text-muted-foreground">
                            {coin.symbol}
                          </span>
                          <span
                            className="text-[10px] font-medium ml-auto"
                            style={{ color: coin.color }}
                          >
                            {totalPortfolio > 0
                              ? Math.round((coin.value / totalPortfolio) * 100)
                              : 0}
                            %
                          </span>
                        </div>
                      ),
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <div>
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
          Installed Apps
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {apps.map((app) => (
            <div
              key={app.id}
              className="flex items-center gap-3 p-4 rounded-xl border border-white/10 hover:border-white/20 transition-all cursor-pointer"
              style={{
                background: "oklch(0.09 0.015 240)",
                boxShadow: `0 0 16px ${app.color}10`,
              }}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
                style={{
                  background: `${app.color}20`,
                  boxShadow: `0 0 10px ${app.color}30`,
                }}
              >
                {app.icon}
              </div>
              <div>
                <p className="text-sm font-semibold">{app.label}</p>
                <p className="text-xs text-muted-foreground">{app.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {[
          {
            label: "Tier",
            value: tierStyle.label,
            icon: "🏅",
            glow: "rgba(245,158,11,0.15)",
          },
          {
            label: "Apps",
            value: "4",
            icon: "📦",
            glow: "rgba(6,182,212,0.1)",
          },
          {
            label: "Status",
            value: "Active",
            icon: "✅",
            glow: "rgba(34,197,94,0.1)",
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className="p-4 rounded-xl border border-white/10 text-center"
            style={{
              background: "oklch(0.09 0.015 240)",
              boxShadow: `0 0 16px ${stat.glow}`,
            }}
          >
            <div className="text-2xl mb-1">{stat.icon}</div>
            <div className="text-sm font-bold">{stat.value}</div>
            <div className="text-xs text-muted-foreground">{stat.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ---- Price Alerts Panel ----
const ALERT_COINS = [
  { id: "bitcoin", symbol: "BTC", name: "Bitcoin" },
  { id: "ethereum", symbol: "ETH", name: "Ethereum" },
  { id: "binancecoin", symbol: "BNB", name: "BNB" },
  { id: "solana", symbol: "SOL", name: "Solana" },
  { id: "cardano", symbol: "ADA", name: "Cardano" },
  { id: "dogecoin", symbol: "DOGE", name: "Dogecoin" },
  { id: "ripple", symbol: "XRP", name: "XRP" },
];

const ALERTS_KEY = "clawpro_price_alerts";

function PriceAlertsPanel() {
  const [alerts, setAlerts] = useState<PriceAlert[]>(() => {
    try {
      return JSON.parse(localStorage.getItem(ALERTS_KEY) ?? "[]");
    } catch {
      return [];
    }
  });

  const [prices, setPrices] = useState<Record<string, number>>({});
  const [loadingPrices, setLoadingPrices] = useState(false);

  // Add alert form state
  const [selectedCoin, setSelectedCoin] = useState("bitcoin");
  const [condition, setCondition] = useState<"above" | "below">("above");
  const [targetPrice, setTargetPrice] = useState("");

  // Persist alerts
  const saveAlerts = (updated: PriceAlert[]) => {
    setAlerts(updated);
    localStorage.setItem(ALERTS_KEY, JSON.stringify(updated));
  };

  // Fetch prices from CoinGecko
  const fetchPrices = async () => {
    setLoadingPrices(true);
    try {
      const ids = ALERT_COINS.map((c) => c.id).join(",");
      const res = await fetch(
        `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd`,
      );
      const data = await res.json();
      const mapped: Record<string, number> = {};
      for (const c of ALERT_COINS) {
        if (data[c.id]?.usd) mapped[c.id] = data[c.id].usd;
      }
      setPrices(mapped);

      // Check alerts
      setAlerts((prev) => {
        let changed = false;
        const updated = prev.map((alert) => {
          if (!alert.active || alert.triggered) return alert;
          const price = mapped[alert.coinId];
          if (!price) return alert;
          const triggered =
            alert.type === "above"
              ? price >= alert.target
              : price <= alert.target;
          if (triggered) {
            changed = true;
            toast.error(
              `🚨 ${alert.coin} is now ${alert.type === "above" ? "above" : "below"} $${alert.target.toLocaleString()}! Current: $${price.toLocaleString()}`,
              { duration: 8000 },
            );
            return { ...alert, triggered: true };
          }
          return alert;
        });
        if (changed) {
          localStorage.setItem(ALERTS_KEY, JSON.stringify(updated));
          return updated;
        }
        return prev;
      });
    } catch {
      // silently fail
    } finally {
      setLoadingPrices(false);
    }
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: intentional
  useEffect(() => {
    fetchPrices();
    const interval = setInterval(fetchPrices, 30000);
    return () => clearInterval(interval);
  }, []);

  const addAlert = () => {
    const target = Number.parseFloat(targetPrice);
    if (!targetPrice || Number.isNaN(target) || target <= 0) {
      toast.error("Please enter a valid target price");
      return;
    }
    const coin = ALERT_COINS.find((c) => c.id === selectedCoin);
    if (!coin) return;
    const newAlert: PriceAlert = {
      id: Date.now().toString(),
      coin: `${coin.name} (${coin.symbol})`,
      coinId: coin.id,
      type: condition,
      target,
      triggered: false,
      active: true,
    };
    saveAlerts([...alerts, newAlert]);
    setTargetPrice("");
    toast.success(
      `Alert set: ${coin.symbol} ${condition} $${target.toLocaleString()}`,
    );
  };

  const toggleAlert = (id: string) => {
    saveAlerts(
      alerts.map((a) => (a.id === id ? { ...a, active: !a.active } : a)),
    );
  };

  const deleteAlert = (id: string) => {
    saveAlerts(alerts.filter((a) => a.id !== id));
  };

  const resetAlert = (id: string) => {
    saveAlerts(
      alerts.map((a) => (a.id === id ? { ...a, triggered: false } : a)),
    );
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{
              background: "oklch(0.14 0.03 60)",
              boxShadow: "0 0 16px rgba(251,191,36,0.3)",
            }}
          >
            <Bell className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <h2 className="font-semibold">Price Alerts</h2>
            <p className="text-xs text-muted-foreground">
              Real-time notifications via CoinGecko
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={fetchPrices}
          disabled={loadingPrices}
          className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 transition-colors"
          data-ocid="pricealerts.refresh.button"
        >
          {loadingPrices ? (
            <Loader2 className="w-3 h-3 animate-spin" />
          ) : (
            <Zap className="w-3 h-3" />
          )}
          {loadingPrices ? "Fetching..." : "Refresh"}
        </button>
      </div>

      {/* Current Prices */}
      <div
        className="rounded-xl p-4 border border-cyan-500/20"
        style={{
          background: "oklch(0.09 0.015 240)",
          boxShadow: "0 0 16px rgba(6,182,212,0.08)",
        }}
      >
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
          Live Prices
        </h3>
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
          {ALERT_COINS.map((coin) => (
            <div key={coin.id} className="text-center">
              <div className="text-[10px] text-muted-foreground">
                {coin.symbol}
              </div>
              <div className="text-xs font-bold text-cyan-300">
                {prices[coin.id] ? `$${prices[coin.id].toLocaleString()}` : "—"}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Alert Form */}
      <div
        className="rounded-xl p-4 border border-amber-500/20 space-y-4"
        style={{
          background: "oklch(0.09 0.015 240)",
          boxShadow: "0 0 16px rgba(251,191,36,0.08)",
        }}
      >
        <h3 className="text-sm font-semibold flex items-center gap-2">
          <Plus className="w-4 h-4 text-amber-400" />
          New Alert
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">Coin</Label>
            <select
              value={selectedCoin}
              onChange={(e) => setSelectedCoin(e.target.value)}
              className="w-full h-9 text-sm rounded-lg border border-white/10 px-3"
              style={{ background: "oklch(0.12 0.015 240)", color: "white" }}
              data-ocid="pricealerts.coin.select"
            >
              {ALERT_COINS.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.symbol} —{" "}
                  {prices[c.id] ? `$${prices[c.id].toLocaleString()}` : "..."}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">Condition</Label>
            <select
              value={condition}
              onChange={(e) =>
                setCondition(e.target.value as "above" | "below")
              }
              className="w-full h-9 text-sm rounded-lg border border-white/10 px-3"
              style={{ background: "oklch(0.12 0.015 240)", color: "white" }}
              data-ocid="pricealerts.condition.select"
            >
              <option value="above">Above ↑</option>
              <option value="below">Below ↓</option>
            </select>
          </div>
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">
              Target Price (USD)
            </Label>
            <Input
              type="number"
              placeholder="e.g. 50000"
              value={targetPrice}
              onChange={(e) => setTargetPrice(e.target.value)}
              className="h-9 text-sm border-white/10"
              style={{ background: "oklch(0.12 0.015 240)" }}
              data-ocid="pricealerts.target.input"
            />
          </div>
        </div>
        <Button
          onClick={addAlert}
          className="text-sm"
          style={{
            background: "oklch(0.5 0.15 60)",
            color: "white",
            boxShadow: "0 0 14px rgba(251,191,36,0.35)",
          }}
          data-ocid="pricealerts.add.button"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Alert
        </Button>
      </div>

      {/* Active Alerts List */}
      <div>
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
          Active Alerts ({alerts.length})
        </h3>
        {alerts.length === 0 ? (
          <div
            className="rounded-xl p-8 border border-white/10 text-center"
            style={{ background: "oklch(0.09 0.015 240)" }}
            data-ocid="pricealerts.empty_state"
          >
            <Bell className="w-8 h-8 text-muted-foreground/30 mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">
              No price alerts set.
            </p>
            <p className="text-xs text-muted-foreground/60">
              Create one above to get notified.
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {alerts.map((alert, idx) => {
              const currentPrice = prices[alert.coinId];
              let borderColor = "rgba(255,255,255,0.08)";
              let glowColor = "transparent";
              if (alert.triggered) {
                borderColor = "rgba(239,68,68,0.4)";
                glowColor = "rgba(239,68,68,0.12)";
              } else if (alert.active) {
                borderColor = "rgba(34,197,94,0.35)";
                glowColor = "rgba(34,197,94,0.08)";
              }
              return (
                <div
                  key={alert.id}
                  data-ocid={`pricealerts.item.${idx + 1}`}
                  className="rounded-xl p-3 border flex items-center gap-3"
                  style={{
                    background: "oklch(0.09 0.015 240)",
                    borderColor,
                    boxShadow: `0 0 16px ${glowColor}`,
                    opacity: alert.active ? 1 : 0.5,
                  }}
                >
                  {/* Indicator dot */}
                  <div
                    className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                    style={{
                      background: alert.triggered
                        ? "#ef4444"
                        : alert.active
                          ? "#22c55e"
                          : "#6b7280",
                      boxShadow: alert.triggered
                        ? "0 0 8px rgba(239,68,68,0.8)"
                        : alert.active
                          ? "0 0 8px rgba(34,197,94,0.8)"
                          : "none",
                    }}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold truncate">
                        {alert.coin}
                      </span>
                      <span
                        className={`text-xs px-1.5 py-0.5 rounded font-medium ${
                          alert.type === "above"
                            ? "bg-green-500/20 text-green-300"
                            : "bg-red-500/20 text-red-300"
                        }`}
                      >
                        {alert.type === "above" ? "↑ Above" : "↓ Below"}
                      </span>
                      {alert.triggered && (
                        <span className="text-xs px-1.5 py-0.5 rounded bg-red-500/20 text-red-300 font-medium animate-pulse">
                          🔔 Triggered
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs text-muted-foreground">
                        Target:{" "}
                        <span className="text-foreground font-medium">
                          ${alert.target.toLocaleString()}
                        </span>
                      </span>
                      {currentPrice && (
                        <span className="text-xs text-muted-foreground">
                          Current:{" "}
                          <span className="text-cyan-300">
                            ${currentPrice.toLocaleString()}
                          </span>
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {alert.triggered ? (
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-7 text-xs border-amber-500/40 text-amber-400 hover:bg-amber-500/10"
                        onClick={() => resetAlert(alert.id)}
                        data-ocid={`pricealerts.reset.button.${idx + 1}`}
                      >
                        Reset
                      </Button>
                    ) : (
                      <Switch
                        checked={alert.active}
                        onCheckedChange={() => toggleAlert(alert.id)}
                        data-ocid={`pricealerts.toggle.${idx + 1}`}
                      />
                    )}
                    <button
                      type="button"
                      onClick={() => deleteAlert(alert.id)}
                      className="p-1.5 rounded text-muted-foreground hover:text-red-400 hover:bg-red-500/10 transition-colors"
                      data-ocid={`pricealerts.delete_button.${idx + 1}`}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

// ---- ClawBot Panel ----
function ClawBotPanel({ handle }: { handle: string }) {
  const botName = `${handle}-CLAW`;
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [openclawEnabled, setOpenclawEnabled] = useState(true);
  const [openaiEnabled, setOpenaiEnabled] = useState(false);
  const [openaiKey, setOpenaiKey] = useState("");
  const [geminiEnabled, setGeminiEnabled] = useState(false);
  const [geminiKey, setGeminiKey] = useState("");
  const [showSettings, setShowSettings] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  void openclawEnabled;
  void geminiEnabled;
  void geminiKey;

  const BOT_RESPONSES = [
    `Hi! I'm ${botName}, your personal ClawPro AI assistant. How can I help you today?`,
    "I can assist with configuration, automation, integrations, and more.",
    "Try asking me about your account settings or installed apps.",
    "I'm powered by OpenClaw.ai. Enable ChatGPT or Gemini for smarter responses!",
  ];

  useEffect(() => {
    const t = setTimeout(() => {
      setMessages([
        {
          id: "1",
          role: "bot",
          text: `👋 Hello! I'm ${botName}, your personal ClawPro AI. Type a message to get started.`,
          time: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
      ]);
    }, 500);
    return () => clearTimeout(t);
  }, [botName]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
    // biome-ignore lint/correctness/useExhaustiveDependencies: intentional
  }, []);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      text: input,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    if (openaiEnabled && openaiKey) {
      try {
        const res = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${openaiKey}`,
          },
          body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: [
              {
                role: "system",
                content: `You are ${botName}, a helpful ClawPro AI assistant.`,
              },
              { role: "user", content: input },
            ],
            max_tokens: 200,
          }),
        });
        const data = await res.json();
        setIsTyping(false);
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now().toString(),
            role: "bot",
            text:
              data.choices?.[0]?.message?.content ??
              "Sorry, I couldn't process that.",
            time: new Date().toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
          },
        ]);
        return;
      } catch {
        // fall through
      }
    }

    await new Promise((r) => setTimeout(r, 1000));
    setIsTyping(false);
    const reply =
      BOT_RESPONSES[Math.floor(Math.random() * BOT_RESPONSES.length)];
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        role: "bot",
        text: reply,
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      },
    ]);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center text-xl">
            🤖
          </div>
          <div>
            <p className="font-semibold text-sm">{botName}</p>
            <p className="text-xs text-green-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block" />
              Online
            </p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowSettings(!showSettings)}
          className="text-muted-foreground"
          data-ocid="clawbot.settings.button"
        >
          <Settings className="w-4 h-4 mr-1" />
          AI Settings
        </Button>
      </div>

      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-b border-white/10 overflow-hidden"
          >
            <div
              className="p-4 space-y-4"
              style={{ background: "oklch(0.09 0.015 240)" }}
            >
              <h3 className="text-sm font-semibold flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-400" />
                AI Brain Settings
              </h3>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-cyan-400">
                    OpenClaw.ai
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Default brain (always available)
                  </p>
                </div>
                <Switch
                  checked={openclawEnabled}
                  onCheckedChange={setOpenclawEnabled}
                  data-ocid="clawbot.openclaw.switch"
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-violet-400">
                      OpenAI / ChatGPT
                    </p>
                    <p className="text-xs text-muted-foreground">
                      GPT-3.5 / GPT-4
                    </p>
                  </div>
                  <Switch
                    checked={openaiEnabled}
                    onCheckedChange={setOpenaiEnabled}
                    data-ocid="clawbot.openai.switch"
                  />
                </div>
                {openaiEnabled && (
                  <div className="flex items-center gap-2">
                    <Key className="w-3.5 h-3.5 text-muted-foreground" />
                    <Input
                      type="password"
                      placeholder="sk-..."
                      value={openaiKey}
                      onChange={(e) => setOpenaiKey(e.target.value)}
                      className="h-8 text-xs"
                      data-ocid="clawbot.openai.input"
                    />
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-400">
                      Google Gemini
                    </p>
                    <p className="text-xs text-muted-foreground">Gemini Pro</p>
                  </div>
                  <Switch
                    checked={geminiEnabled}
                    onCheckedChange={setGeminiEnabled}
                    data-ocid="clawbot.gemini.switch"
                  />
                </div>
                {geminiEnabled && (
                  <div className="flex items-center gap-2">
                    <Key className="w-3.5 h-3.5 text-muted-foreground" />
                    <Input
                      type="password"
                      placeholder="AIza..."
                      value={geminiKey}
                      onChange={(e) => setGeminiKey(e.target.value)}
                      className="h-8 text-xs"
                      data-ocid="clawbot.gemini.input"
                    />
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[75%] rounded-2xl px-3.5 py-2.5 text-sm ${
                msg.role === "user"
                  ? "bg-cyan-600/80 text-white rounded-br-sm"
                  : "rounded-bl-sm border border-white/10"
              }`}
              style={
                msg.role === "bot"
                  ? { background: "oklch(0.12 0.015 240)" }
                  : {}
              }
            >
              <p>{msg.text}</p>
              <p className="text-[10px] mt-1 opacity-60 text-right">
                {msg.time}
              </p>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div
              className="border border-white/10 rounded-2xl rounded-bl-sm px-3.5 py-2.5"
              style={{ background: "oklch(0.12 0.015 240)" }}
            >
              <div className="flex gap-1">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    className="w-1.5 h-1.5 rounded-full bg-muted-foreground"
                    animate={{ y: [0, -4, 0] }}
                    transition={{
                      duration: 0.6,
                      delay: i * 0.15,
                      repeat: Number.POSITIVE_INFINITY,
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="p-3 border-t border-white/10">
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage()}
            placeholder={`Message ${botName}...`}
            className="flex-1"
            data-ocid="clawbot.chat.input"
          />
          <Button
            size="sm"
            onClick={sendMessage}
            disabled={!input.trim() || isTyping}
            className="bg-cyan-600 hover:bg-cyan-500 text-white"
            data-ocid="clawbot.chat.button"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

// ---- WhatsApp Panel ----
function WhatsAppPanel() {
  const { data: chatbotConfig } = useChatbotConfig();
  const saveChatbot = useSaveChatbotConfig();
  const deleteChatbot = useDeleteChatbotConfig();
  const [phone, setPhone] = useState("");
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (chatbotConfig) {
      setPhone(chatbotConfig.phoneNumber);
      setEnabled(chatbotConfig.enabled);
    }
  }, [chatbotConfig]);

  const save = () => {
    saveChatbot.mutate(
      { phoneNumber: phone, enabled },
      {
        onSuccess: () => toast.success("WhatsApp bot config saved!"),
        onError: () => toast.error("Failed to save config"),
      },
    );
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-3">
        <div
          className="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center"
          style={{ boxShadow: "0 0 16px rgba(34,197,94,0.2)" }}
        >
          <SiWhatsapp className="w-5 h-5 text-green-400" />
        </div>
        <div>
          <h2 className="font-semibold">WhatsApp Bot</h2>
          <p className="text-xs text-muted-foreground">
            Automate WhatsApp messages
          </p>
        </div>
      </div>

      <div
        className="rounded-xl border border-white/10 p-4 space-y-4"
        style={{
          background: "oklch(0.09 0.015 240)",
          boxShadow: "0 0 20px rgba(34,197,94,0.06)",
        }}
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium">Bot Status</p>
            <p className="text-xs text-muted-foreground">
              Enable or disable the bot
            </p>
          </div>
          <Switch
            checked={enabled}
            onCheckedChange={setEnabled}
            data-ocid="whatsapp.enabled.switch"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-sm">Phone Number</Label>
          <Input
            placeholder="+628123456789"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            data-ocid="whatsapp.phone.input"
          />
        </div>
        <div className="flex gap-2">
          <Button
            onClick={save}
            disabled={saveChatbot.isPending}
            className="bg-green-600 hover:bg-green-500 text-white"
            data-ocid="whatsapp.save.button"
          >
            {saveChatbot.isPending ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            Save Config
          </Button>
          {chatbotConfig && (
            <Button
              variant="outline"
              onClick={() => deleteChatbot.mutate()}
              className="border-red-500/40 text-red-400"
              data-ocid="whatsapp.delete.button"
            >
              Remove
            </Button>
          )}
        </div>
      </div>

      <div
        className="rounded-xl border border-white/10 p-4"
        style={{ background: "oklch(0.09 0.015 240)" }}
      >
        <h3 className="text-sm font-semibold mb-3">Recent Activity</h3>
        <div className="space-y-2">
          {[
            { msg: "Hello, how can I help?", time: "2m ago", from: "Bot" },
            { msg: "Schedule meeting at 3pm", time: "15m ago", from: "User" },
            { msg: "Meeting scheduled!", time: "14m ago", from: "Bot" },
          ].map((log) => (
            <div key={log.msg} className="flex items-start gap-2 text-xs">
              <span
                className={`font-medium ${log.from === "Bot" ? "text-green-400" : "text-cyan-400"}`}
              >
                {log.from}:
              </span>
              <span className="text-muted-foreground">{log.msg}</span>
              <span className="ml-auto text-muted-foreground/60">
                {log.time}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ---- Telegram Panel ----
function TelegramPanel() {
  const [botToken, setBotToken] = useState("");
  const [webhook, setWebhook] = useState("");

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-3">
        <div
          className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center"
          style={{ boxShadow: "0 0 16px rgba(59,130,246,0.2)" }}
        >
          <SiTelegram className="w-5 h-5 text-blue-400" />
        </div>
        <div>
          <h2 className="font-semibold">Telegram Bot</h2>
          <p className="text-xs text-muted-foreground">BotFather integration</p>
        </div>
      </div>

      <div
        className="rounded-xl border border-white/10 p-4 space-y-4"
        style={{
          background: "oklch(0.09 0.015 240)",
          boxShadow: "0 0 20px rgba(59,130,246,0.06)",
        }}
      >
        <div className="space-y-2">
          <Label className="text-sm">BotFather Token</Label>
          <Input
            type="password"
            placeholder="1234567890:AABBCCddEEFF..."
            value={botToken}
            onChange={(e) => setBotToken(e.target.value)}
            data-ocid="telegram.token.input"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-sm">Webhook URL</Label>
          <Input
            placeholder="https://your-domain.com/webhook"
            value={webhook}
            onChange={(e) => setWebhook(e.target.value)}
            data-ocid="telegram.webhook.input"
          />
        </div>
        <Button
          className="bg-blue-600 hover:bg-blue-500 text-white"
          data-ocid="telegram.save.button"
          onClick={() => toast.success("Telegram config saved!")}
        >
          <Save className="w-4 h-4 mr-2" />
          Save Config
        </Button>
      </div>

      <div
        className="rounded-xl border border-white/10 p-4"
        style={{ background: "oklch(0.09 0.015 240)" }}
      >
        <h3 className="text-sm font-semibold mb-3">Recent Commands</h3>
        <div className="space-y-2">
          {[
            { cmd: "/start", user: "@user123", time: "5m ago" },
            { cmd: "/help", user: "@user456", time: "22m ago" },
            { cmd: "/status", user: "@user789", time: "1h ago" },
          ].map((log) => (
            <div key={log.cmd} className="flex items-center gap-2 text-xs">
              <span className="font-mono text-blue-400">{log.cmd}</span>
              <span className="text-muted-foreground">by {log.user}</span>
              <span className="ml-auto text-muted-foreground/60">
                {log.time}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ---- ChatGPT Panel ----
function ChatGPTPanel() {
  const [apiKey, setApiKey] = useState("");
  const [model, setModel] = useState("gpt-3.5-turbo");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
    // biome-ignore lint/correctness/useExhaustiveDependencies: intentional
  }, []);

  const send = async () => {
    if (!input.trim()) return;
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      text: input,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    if (apiKey) {
      try {
        const res = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model,
            messages: [
              { role: "system", content: "You are a helpful assistant." },
              { role: "user", content: input },
            ],
            max_tokens: 300,
          }),
        });
        const data = await res.json();
        setIsTyping(false);
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now().toString(),
            role: "bot",
            text: data.choices?.[0]?.message?.content ?? "No response.",
            time: new Date().toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
          },
        ]);
        return;
      } catch {
        /* ignore */
      }
    }

    await new Promise((r) => setTimeout(r, 800));
    setIsTyping(false);
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        role: "bot",
        text: apiKey
          ? "Error calling OpenAI API. Check your API key."
          : "Enter your OpenAI API key above to enable real responses.",
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      },
    ]);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-white/10 space-y-3">
        <div className="flex items-center gap-3">
          <Sparkles className="w-5 h-5 text-emerald-400" />
          <h2 className="font-semibold text-sm">ChatGPT Integration</h2>
        </div>
        <div className="flex gap-2">
          <Input
            type="password"
            placeholder="sk-... (OpenAI API key)"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            className="flex-1 h-8 text-xs"
            data-ocid="chatgpt.apikey.input"
          />
          <select
            value={model}
            onChange={(e) => setModel(e.target.value)}
            className="h-8 text-xs rounded-md border border-white/10 px-2"
            style={{ background: "oklch(0.12 0.015 240)", color: "white" }}
            data-ocid="chatgpt.model.select"
          >
            <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
            <option value="gpt-4-turbo">GPT-4 Turbo</option>
            <option value="gpt-4o">GPT-4o</option>
          </select>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full gap-3 text-center">
            <Sparkles className="w-8 h-8 text-emerald-400/50" />
            <p className="text-sm text-muted-foreground">
              Enter your API key and start chatting with ChatGPT
            </p>
          </div>
        )}
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[75%] rounded-2xl px-3.5 py-2.5 text-sm ${
                msg.role === "user"
                  ? "bg-emerald-600/80 text-white rounded-br-sm"
                  : "rounded-bl-sm border border-white/10"
              }`}
              style={
                msg.role === "bot"
                  ? { background: "oklch(0.12 0.015 240)" }
                  : {}
              }
            >
              <p>{msg.text}</p>
              <p className="text-[10px] mt-1 opacity-60 text-right">
                {msg.time}
              </p>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div
              className="border border-white/10 rounded-2xl rounded-bl-sm px-3.5 py-2.5"
              style={{ background: "oklch(0.12 0.015 240)" }}
            >
              <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
            </div>
          </div>
        )}
      </div>

      <div className="p-3 border-t border-white/10">
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && send()}
            placeholder="Ask ChatGPT..."
            className="flex-1"
            data-ocid="chatgpt.chat.input"
          />
          <Button
            size="sm"
            onClick={send}
            disabled={!input.trim() || isTyping}
            className="bg-emerald-600 hover:bg-emerald-500 text-white"
            data-ocid="chatgpt.send.button"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

// ---- Settings Panel ----
function SettingsPanel({
  handle,
  fullName,
  userAccount,
}: {
  handle: string;
  fullName: string;
  userAccount: { email?: string; phone?: string } | null | undefined;
}) {
  const saveAccount = useSaveUserAccount();
  const { data: profile } = useCallerUserProfile();
  const saveProfile = useSaveCallerUserProfile();

  const [newHandle, setNewHandle] = useState(handle);
  const [newFullName, setNewFullName] = useState(fullName);
  const [email, setEmail] = useState(userAccount?.email ?? "");
  const [phone, setPhone] = useState(userAccount?.phone ?? "");
  const [notifs, setNotifs] = useState(true);
  const [autoSave, setAutoSave] = useState(true);

  useEffect(() => {
    setNewHandle(handle);
    setNewFullName(fullName);
    setEmail(userAccount?.email ?? "");
    setPhone(userAccount?.phone ?? "");
  }, [handle, fullName, userAccount]);

  const save = () => {
    saveAccount.mutate(
      { handle: newHandle, fullName: newFullName, email, phone },
      {
        onSuccess: () => {
          if (profile) {
            saveProfile.mutate({ ...profile, name: newFullName });
          }
          toast.success("Profile saved!");
        },
        onError: () => toast.error("Failed to save profile"),
      },
    );
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-3">
        <div
          className="w-10 h-10 rounded-xl bg-violet-500/20 flex items-center justify-center"
          style={{ boxShadow: "0 0 16px rgba(167,139,250,0.2)" }}
        >
          <User className="w-5 h-5 text-violet-400" />
        </div>
        <div>
          <h2 className="font-semibold">Profile Settings</h2>
          <p className="text-xs text-muted-foreground">
            Update your account details
          </p>
        </div>
      </div>

      <div
        className="rounded-xl border border-white/10 p-4 space-y-4"
        style={{
          background: "oklch(0.09 0.015 240)",
          boxShadow: "0 0 20px rgba(167,139,250,0.06)",
        }}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-sm">Handle Name</Label>
            <div className="flex items-center gap-1">
              <span className="text-muted-foreground text-sm">@</span>
              <Input
                value={newHandle}
                onChange={(e) => setNewHandle(e.target.value)}
                placeholder="yourhandle"
                data-ocid="settings.handle.input"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label className="text-sm">Full Name</Label>
            <Input
              value={newFullName}
              onChange={(e) => setNewFullName(e.target.value)}
              placeholder="Your Full Name"
              data-ocid="settings.fullname.input"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-sm">Email</Label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              data-ocid="settings.email.input"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-sm">Phone</Label>
            <Input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+628123456789"
              data-ocid="settings.phone.input"
            />
          </div>
        </div>
        <Button
          onClick={save}
          disabled={saveAccount.isPending}
          className="bg-violet-600 hover:bg-violet-500 text-white"
          data-ocid="settings.save.button"
        >
          {saveAccount.isPending ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Save className="w-4 h-4 mr-2" />
          )}
          Save Changes
        </Button>
      </div>

      <div
        className="rounded-xl border border-white/10 p-4 space-y-4"
        style={{ background: "oklch(0.09 0.015 240)" }}
      >
        <h3 className="text-sm font-semibold">Preferences</h3>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium">Notifications</p>
            <p className="text-xs text-muted-foreground">
              Receive app notifications
            </p>
          </div>
          <Switch
            checked={notifs}
            onCheckedChange={setNotifs}
            data-ocid="settings.notifs.switch"
          />
        </div>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium">Auto-save</p>
            <p className="text-xs text-muted-foreground">
              Automatically save configs
            </p>
          </div>
          <Switch
            checked={autoSave}
            onCheckedChange={setAutoSave}
            data-ocid="settings.autosave.switch"
          />
        </div>
      </div>
    </div>
  );
}
