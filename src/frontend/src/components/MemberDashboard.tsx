import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  AtSign,
  Bell,
  Bell as BellIcon,
  Bot,
  CheckCircle2,
  ChevronRight,
  Code2,
  Coins,
  Crown,
  ExternalLink,
  Eye,
  EyeOff,
  Gift,
  Globe2,
  Loader2,
  Lock,
  Medal,
  Plug,
  Plus,
  Receipt,
  RefreshCw,
  Save,
  Send,
  Settings,
  Sparkles,
  Terminal,
  Trash2,
  Trophy,
  User,
  X,
  XCircle,
  Zap,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { SiTelegram, SiWhatsapp } from "react-icons/si";
import { toast } from "sonner";
import {
  type ClaimedReward,
  type LeaderboardEntry,
  MembershipTier,
  type TopReward,
} from "../backend.d";
import {
  useChatbotConfig,
  useDeleteChatbotConfig,
  useSaveChatbotConfig,
} from "../hooks/useChatbot";
import {
  useForumNotifications,
  useMarkForumNotificationRead,
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
  useClaimTopReward,
  useDeleteConfig,
  useLeaderboard,
  useMyClaimedRewards,
  useMyConfigs,
  useMyLeaderboardRank,
  useSaveCallerUserProfile,
  useTopRewards,
} from "../hooks/useQueries";
import { useLanguage } from "../i18n/LanguageContext";

// ---- Constants ----

const TIER_STYLES: Record<
  MembershipTier,
  { label: string; badge: string; glow: string; icon: string; color: string }
> = {
  [MembershipTier.silver]: {
    label: "Silver",
    badge: "bg-slate-500/20 text-slate-200 border-slate-400/40",
    glow: "shadow-[0_0_30px_rgba(148,163,184,0.12)]",
    icon: "⬥",
    color: "oklch(0.75 0.05 220)",
  },
  [MembershipTier.gold]: {
    label: "Gold",
    badge: "bg-amber-500/20 text-amber-200 border-amber-400/40",
    glow: "shadow-[0_0_30px_rgba(251,191,36,0.15)]",
    icon: "★",
    color: "oklch(0.80 0.18 60)",
  },
  [MembershipTier.platinum]: {
    label: "Platinum",
    badge: "bg-violet-500/20 text-violet-200 border-violet-400/40",
    glow: "shadow-[0_0_30px_rgba(167,139,250,0.2)]",
    icon: "◆",
    color: "oklch(0.75 0.20 290)",
  },
};

const TIER_PRICES: Record<MembershipTier, number> = {
  [MembershipTier.silver]: 9.99,
  [MembershipTier.gold]: 29.99,
  [MembershipTier.platinum]: 79.99,
};

const TIER_TOKENS: Record<MembershipTier, number> = {
  [MembershipTier.silver]: Math.round(9.99 * 100),
  [MembershipTier.gold]: Math.round(29.99 * 100),
  [MembershipTier.platinum]: Math.round(79.99 * 100),
};

const PAYMENT_METHODS = ["Card", "PayPal", "Bitcoin", "QRIS"] as const;
type PaymentMethod = (typeof PAYMENT_METHODS)[number];

interface Transaction {
  id: string;
  date: string;
  tier: MembershipTier;
  amount: number;
  tokens: number;
  paymentMethod: PaymentMethod;
  status: "completed" | "pending" | "failed";
}

const STORAGE_KEY = "clawpro_transactions";

function loadTransactions(): Transaction[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Transaction[]) : [];
  } catch {
    return [];
  }
}

function saveTransactions(txs: Transaction[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(txs));
}

// ---- Main Dashboard ----

interface MemberDashboardProps {
  onClose: () => void;
}

export function MemberDashboard({ onClose }: MemberDashboardProps) {
  const { t, language } = useLanguage();
  const { identity } = useInternetIdentity();
  const { data: membership } = useMyMembership();
  const { data: profile } = useCallerUserProfile();
  const { data: chatbotConfig } = useChatbotConfig();
  const { data: configs } = useMyConfigs();
  const { data: forumNotifications } = useForumNotifications();
  const markForumNotifRead = useMarkForumNotificationRead();
  const saveProfile = useSaveCallerUserProfile();
  const deleteConfig = useDeleteConfig();
  const { data: userAccount } = useMyUserAccount();
  const saveUserAccount = useSaveUserAccount();

  // Profile form state
  const [handle, setHandle] = useState("");
  const [fullName, setFullName] = useState("");
  const [activeTab, setActiveTab] = useState("profile");
  const [userIsTop3, setUserIsTop3] = useState(false);

  // Unread count from forum notifications
  const unreadCount = forumNotifications?.filter((n) => !n.read).length ?? 0;

  // Avatar upload state
  type AvatarPhase = "idle" | "hover" | "dragging" | "uploading" | "success";
  const [avatarPhase, setAvatarPhase] = useState<AvatarPhase>("idle");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Settings toggles (localStorage)
  const [notificationsOn, setNotificationsOn] = useState(
    () => localStorage.getItem("clawpro_notifications") !== "false",
  );
  const [autoSave, setAutoSave] = useState(
    () => localStorage.getItem("clawpro_autosave") !== "false",
  );

  // Sync profile data — userAccount is the primary source, profile is fallback
  useEffect(() => {
    if (userAccount) {
      setHandle(userAccount.handle ?? "");
      setFullName(userAccount.fullName ?? "");
    } else if (profile) {
      setHandle(profile.name ?? "");
      setFullName(profile.bio ?? "");
    }
  }, [userAccount, profile]);

  // Auto-save pending account after login
  const PENDING_ACCOUNT_KEY = "clawpro_pending_account";
  // biome-ignore lint/correctness/useExhaustiveDependencies: intentionally only runs on identity change; saveUserAccount ref is stable
  useEffect(() => {
    if (!identity) return;
    const pending = localStorage.getItem(PENDING_ACCOUNT_KEY);
    if (!pending) return;
    try {
      const data = JSON.parse(pending) as {
        email: string;
        phone: string;
        fullName: string;
        handle: string;
      };
      localStorage.removeItem(PENDING_ACCOUNT_KEY);
      saveUserAccount
        .mutateAsync(data)
        .then(() =>
          toast.success("Account created successfully! Welcome to ClawPro."),
        )
        .catch(() =>
          toast.error("Failed to save account. Please update from Dashboard."),
        );
    } catch {
      localStorage.removeItem(PENDING_ACCOUNT_KEY);
    }
  }, [identity]);

  const handleSaveProfile = async () => {
    const trimmedHandle = handle.trim().replace(/[^a-zA-Z0-9_-]/g, "");
    if (!trimmedHandle) {
      toast.error("Please enter a valid handle.");
      return;
    }
    try {
      // Save UserProfile (handle = name, fullName = bio)
      await saveProfile.mutateAsync({
        name: trimmedHandle,
        bio: fullName.trim() || undefined,
      });
      // Also save UserAccount to keep them in sync
      if (userAccount?.email) {
        await saveUserAccount.mutateAsync({
          email: userAccount.email,
          phone: userAccount.phone ?? "",
          fullName: fullName.trim(),
          handle: trimmedHandle,
        });
      }
      toast.success(t.dashboard.profileSaved);
    } catch {
      toast.error(t.dashboard.profileError);
    }
  };

  const handleDeleteConfig = async (id: bigint) => {
    try {
      await deleteConfig.mutateAsync(id);
      toast.success("Config deleted.");
    } catch {
      toast.error("Failed to delete config.");
    }
  };

  const goToPricing = () => {
    onClose();
    setTimeout(() => {
      document
        .querySelector("#pricing")
        ?.scrollIntoView({ behavior: "smooth" });
    }, 300);
  };

  const principalStr = identity?.getPrincipal().toString() ?? "";
  const tierStyle = membership ? TIER_STYLES[membership.tier] : null;

  const formatDate = (nanoseconds: bigint) => {
    const ms = Number(nanoseconds) / 1_000_000;
    return new Date(ms).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Avatar initials
  const initials = fullName
    ? fullName
        .split(" ")
        .map((w) => w[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : handle
      ? handle.slice(0, 2).toUpperCase()
      : "CP";

  // Integration status
  const hasWhatsapp = !!chatbotConfig?.phoneNumber;
  const hasOpenAI = !!localStorage.getItem("openclaw_openai_key");

  const LANG_NAMES: Record<string, string> = {
    en: "English",
    id: "Bahasa Indonesia",
    ar: "العربية",
    ru: "Русский",
    zh: "中文",
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4"
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        <motion.div
          initial={{ scale: 0.94, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.94, opacity: 0, y: 20 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="bg-[oklch(0.09_0.012_240)] border border-[oklch(0.65_0.15_210)/20%] rounded-2xl w-full max-w-6xl max-h-[92vh] overflow-hidden flex flex-col"
          style={{
            boxShadow:
              "0 40px 100px rgba(0,0,0,0.7), 0 0 60px oklch(0.65 0.15 210 / 8%)",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Two-column layout */}
          <div className="flex flex-1 overflow-hidden min-h-0">
            {/* ─── LEFT SIDEBAR ─── */}
            <aside className="w-[260px] flex-shrink-0 border-r border-[oklch(1_0_0_/_7%)] bg-[oklch(0.08_0.012_240)] flex flex-col overflow-hidden hidden md:flex">
              {/* Gradient header stripe based on tier */}
              <div
                className="h-1.5 w-full flex-shrink-0"
                style={{
                  background: tierStyle
                    ? `linear-gradient(90deg, transparent, ${tierStyle.color}, oklch(0.65 0.15 210), ${tierStyle.color}, transparent)`
                    : "linear-gradient(90deg, transparent, oklch(0.65 0.15 210), oklch(0.55 0.18 290), transparent)",
                }}
              />
              <ScrollArea className="flex-1">
                <div className="p-5 space-y-5">
                  {/* User Identity Card */}
                  <div className="space-y-3">
                    {/* Avatar Upload Area */}
                    <div className="flex flex-col items-center text-center pt-2">
                      {/* Hidden file input */}
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          setAvatarPhase("uploading");
                          const reader = new FileReader();
                          reader.onload = (ev) => {
                            setTimeout(() => {
                              setAvatarUrl(ev.target?.result as string);
                              setAvatarPhase("success");
                              toast.success("Profile photo updated!");
                              setTimeout(() => setAvatarPhase("idle"), 2000);
                            }, 800);
                          };
                          reader.readAsDataURL(file);
                        }}
                      />

                      {/* Avatar circle with animations */}
                      <motion.div
                        className="relative mb-3 cursor-pointer select-none"
                        onHoverStart={() =>
                          avatarPhase === "idle" && setAvatarPhase("hover")
                        }
                        onHoverEnd={() =>
                          avatarPhase === "hover" && setAvatarPhase("idle")
                        }
                        onTapStart={() => {
                          if (
                            avatarPhase === "idle" ||
                            avatarPhase === "hover"
                          ) {
                            fileInputRef.current?.click();
                          }
                        }}
                        onDragOver={(e) => {
                          e.preventDefault();
                          setAvatarPhase("dragging");
                        }}
                        onDragLeave={() => setAvatarPhase("idle")}
                        onDrop={(e) => {
                          e.preventDefault();
                          const file = e.dataTransfer.files?.[0];
                          if (!file) return;
                          setAvatarPhase("uploading");
                          const reader = new FileReader();
                          reader.onload = (ev) => {
                            setTimeout(() => {
                              setAvatarUrl(ev.target?.result as string);
                              setAvatarPhase("success");
                              toast.success("Profile photo updated!");
                              setTimeout(() => setAvatarPhase("idle"), 2000);
                            }, 800);
                          };
                          reader.readAsDataURL(file);
                        }}
                        data-ocid="dashboard.upload_button"
                      >
                        {/* Idle pulsing ring */}
                        {avatarPhase === "idle" && (
                          <motion.div
                            className="absolute inset-[-4px] rounded-full pointer-events-none"
                            animate={{
                              opacity: [0.3, 0.7, 0.3],
                              scale: [1, 1.06, 1],
                            }}
                            transition={{
                              duration: 2.5,
                              repeat: Number.POSITIVE_INFINITY,
                              ease: "easeInOut",
                            }}
                            style={{
                              border: `2px solid ${tierStyle ? tierStyle.color : "oklch(0.65 0.15 210)"}`,
                              boxShadow: `0 0 12px ${tierStyle ? tierStyle.color : "oklch(0.65 0.15 210)"}40`,
                            }}
                          />
                        )}

                        {/* Drag-over glowing ring */}
                        {avatarPhase === "dragging" && (
                          <motion.div
                            className="absolute inset-[-6px] rounded-full pointer-events-none"
                            animate={{
                              borderColor: ["#00c6ff", "#7c3aed", "#00c6ff"],
                            }}
                            transition={{
                              duration: 1,
                              repeat: Number.POSITIVE_INFINITY,
                            }}
                            style={{
                              border: "3px solid #00c6ff",
                              boxShadow: "0 0 24px #00c6ff80",
                            }}
                          />
                        )}

                        {/* Hover sparkles */}
                        {avatarPhase === "hover" &&
                          [0, 60, 120, 180, 240, 300].map((deg, idx) => (
                            <motion.div
                              key={deg}
                              className="absolute w-1.5 h-1.5 rounded-full pointer-events-none"
                              style={{
                                background: [
                                  "#00c6ff",
                                  "#f59e0b",
                                  "#a78bfa",
                                  "#34d399",
                                  "#f472b6",
                                  "#60a5fa",
                                ][idx],
                                top: "50%",
                                left: "50%",
                              }}
                              animate={{
                                x: [0, Math.cos((deg * Math.PI) / 180) * 42],
                                y: [0, Math.sin((deg * Math.PI) / 180) * 42],
                                opacity: [0, 1, 0],
                                scale: [0, 1.5, 0],
                              }}
                              transition={{
                                duration: 1,
                                repeat: Number.POSITIVE_INFINITY,
                                delay: idx * 0.08,
                                ease: "easeOut",
                              }}
                            />
                          ))}

                        {/* Uploading: SVG circular progress */}
                        {avatarPhase === "uploading" && (
                          <motion.div
                            className="absolute inset-[-4px] rounded-full pointer-events-none"
                            animate={{ rotate: 360 }}
                            transition={{
                              duration: 1,
                              repeat: Number.POSITIVE_INFINITY,
                              ease: "linear",
                            }}
                          >
                            <svg
                              width="96"
                              height="96"
                              viewBox="0 0 96 96"
                              className="absolute inset-0"
                              aria-hidden="true"
                              role="presentation"
                            >
                              <circle
                                cx="48"
                                cy="48"
                                r="44"
                                fill="none"
                                stroke="url(#uploadGrad)"
                                strokeWidth="3"
                                strokeDasharray="138 138"
                                strokeLinecap="round"
                                strokeDashoffset="34"
                              />
                              <defs>
                                <linearGradient
                                  id="uploadGrad"
                                  x1="0%"
                                  y1="0%"
                                  x2="100%"
                                  y2="0%"
                                >
                                  <stop offset="0%" stopColor="#00c6ff" />
                                  <stop offset="100%" stopColor="#7c3aed" />
                                </linearGradient>
                              </defs>
                            </svg>
                          </motion.div>
                        )}

                        {/* Success: green burst */}
                        {avatarPhase === "success" && (
                          <motion.div
                            className="absolute inset-0 rounded-full pointer-events-none flex items-center justify-center"
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: [1.4, 1], opacity: [1, 0] }}
                            transition={{ duration: 1.2, ease: "easeOut" }}
                            style={{
                              background:
                                "radial-gradient(circle, rgba(52,211,153,0.6) 0%, transparent 70%)",
                            }}
                          />
                        )}

                        {/* Avatar circle */}
                        <motion.div
                          className="w-20 h-20 rounded-full flex items-center justify-center text-2xl font-black text-white relative z-10 overflow-hidden"
                          whileHover={{ scale: 1.05 }}
                          style={{
                            background: avatarUrl
                              ? "transparent"
                              : tierStyle
                                ? `radial-gradient(circle at 30% 30%, ${tierStyle.color}, oklch(0.15 0.05 240))`
                                : "linear-gradient(135deg, oklch(0.65 0.15 210), oklch(0.45 0.12 240))",
                            boxShadow: tierStyle
                              ? `0 0 0 2px oklch(0.15 0.02 240), 0 0 20px ${tierStyle.color}60`
                              : "0 0 0 2px oklch(0.15 0.02 240)",
                          }}
                        >
                          {avatarUrl ? (
                            <img
                              src={avatarUrl}
                              alt="Profile"
                              className="w-full h-full object-cover"
                            />
                          ) : avatarPhase === "uploading" ? (
                            <Loader2 className="w-7 h-7 animate-spin text-white/70" />
                          ) : avatarPhase === "success" ? (
                            <CheckCircle2 className="w-7 h-7 text-emerald-400" />
                          ) : (
                            <span>{initials}</span>
                          )}

                          {/* Hover overlay */}
                          {(avatarPhase === "hover" ||
                            avatarPhase === "dragging") && (
                            <motion.div
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center gap-1"
                            >
                              <User className="w-5 h-5 text-white" />
                              <span className="text-[9px] text-white font-medium">
                                {avatarPhase === "dragging"
                                  ? "Drop here"
                                  : "Upload"}
                              </span>
                            </motion.div>
                          )}
                        </motion.div>
                      </motion.div>

                      {/* Full Name */}
                      <p className="font-bold text-base text-[oklch(0.95_0.02_210)] leading-tight truncate w-full px-2">
                        {fullName || (
                          <span className="text-[oklch(0.45_0.02_210)] font-normal italic text-sm">
                            Set your name
                          </span>
                        )}
                      </p>

                      {/* Handle */}
                      <p className="text-sm text-[oklch(0.55_0.12_210)] mt-0.5 font-mono truncate w-full px-2">
                        {handle ? (
                          <span>
                            <span className="text-[oklch(0.45_0.06_210)]">
                              @
                            </span>
                            {handle}
                          </span>
                        ) : (
                          <span className="text-[oklch(0.35_0.02_210)] italic text-xs">
                            set-handle
                          </span>
                        )}
                      </p>

                      {/* Tier badge */}
                      <div className="mt-2">
                        {membership && tierStyle ? (
                          <Badge
                            className={`border text-xs px-2.5 py-1 ${tierStyle.badge}`}
                          >
                            {tierStyle.icon} {tierStyle.label}
                          </Badge>
                        ) : (
                          <Badge
                            variant="outline"
                            className="text-xs text-[oklch(0.40_0.02_210)] border-[oklch(1_0_0_/_12%)] px-2.5 py-1"
                          >
                            No membership
                          </Badge>
                        )}
                      </div>

                      {/* Token balance */}
                      {membership && (
                        <div className="mt-2.5 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20">
                          <Coins className="w-3.5 h-3.5 text-amber-400" />
                          <span className="text-xs font-bold text-amber-300">
                            {TIER_TOKENS[membership.tier].toLocaleString()}
                          </span>
                          <span className="text-[10px] text-amber-400/60">
                            tokens
                          </span>
                        </div>
                      )}
                    </div>

                    <Separator className="bg-[oklch(1_0_0_/_6%)]" />
                  </div>

                  {/* Integrations — Rich API Panels */}
                  <div className="space-y-2.5">
                    <div className="flex items-center gap-1.5">
                      <Plug className="w-3.5 h-3.5 text-[oklch(0.55_0.08_210)]" />
                      <span className="text-[11px] font-semibold text-[oklch(0.50_0.04_210)] uppercase tracking-wider">
                        API Integrations
                      </span>
                    </div>

                    <div className="flex flex-col gap-2">
                      {/* WhatsApp Bot API */}
                      <button
                        type="button"
                        onClick={() => setActiveTab("chatbot")}
                        className="group relative rounded-xl border overflow-hidden text-left transition-all hover:scale-[1.01] hover:brightness-110 active:scale-[0.99]"
                        style={{
                          background: hasWhatsapp
                            ? "linear-gradient(135deg, oklch(0.12 0.04 150), oklch(0.10 0.02 240))"
                            : "oklch(0.10 0.01 240)",
                          borderColor: hasWhatsapp
                            ? "oklch(0.55 0.18 150 / 35%)"
                            : "oklch(1 0 0 / 8%)",
                          borderLeftColor: "oklch(0.55 0.18 150)",
                          borderLeftWidth: "3px",
                          boxShadow: hasWhatsapp
                            ? "0 2px 12px oklch(0.55 0.18 150 / 15%)"
                            : "none",
                        }}
                      >
                        <div className="flex items-center gap-2.5 p-2.5">
                          <div
                            className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                            style={{
                              background: "oklch(0.55 0.18 150 / 15%)",
                              border: "1px solid oklch(0.55 0.18 150 / 30%)",
                            }}
                          >
                            <SiWhatsapp
                              className="w-4 h-4"
                              style={{ color: "oklch(0.65 0.18 150)" }}
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1.5">
                              <span className="text-[11px] font-semibold text-[oklch(0.80_0.04_210)]">
                                WhatsApp Bot
                              </span>
                              {hasWhatsapp && (
                                <span className="flex items-center gap-0.5">
                                  <span
                                    className="w-1.5 h-1.5 rounded-full"
                                    style={{
                                      background: "oklch(0.65 0.18 150)",
                                      boxShadow: "0 0 4px oklch(0.65 0.18 150)",
                                    }}
                                  />
                                  <span className="text-[9px] text-[oklch(0.62_0.18_150)] font-bold">
                                    ON
                                  </span>
                                </span>
                              )}
                            </div>
                            <span className="text-[9px] text-[oklch(0.45_0.03_210)] font-mono truncate block">
                              {chatbotConfig?.phoneNumber
                                ? chatbotConfig.phoneNumber
                                : "BotFather API · Not set"}
                            </span>
                          </div>
                          <Badge
                            className="text-[8px] px-1 py-0 h-3.5 flex-shrink-0 border"
                            style={{
                              background: "oklch(0.55 0.18 150 / 10%)",
                              color: "oklch(0.62 0.18 150)",
                              borderColor: "oklch(0.55 0.18 150 / 25%)",
                            }}
                          >
                            {hasWhatsapp ? "Connected" : "Setup"}
                          </Badge>
                        </div>
                      </button>

                      {/* BotFather / Telegram Bot API */}
                      <button
                        type="button"
                        onClick={() => setActiveTab("chatbot")}
                        className="group relative rounded-xl border overflow-hidden text-left transition-all hover:scale-[1.01] hover:brightness-110 active:scale-[0.99]"
                        style={{
                          background:
                            "linear-gradient(135deg, oklch(0.11 0.04 230), oklch(0.10 0.02 240))",
                          borderColor: "oklch(0.55 0.15 230 / 25%)",
                          borderLeftColor: "oklch(0.58 0.18 230)",
                          borderLeftWidth: "3px",
                        }}
                      >
                        <div className="flex items-center gap-2.5 p-2.5">
                          <div
                            className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                            style={{
                              background: "oklch(0.55 0.15 230 / 15%)",
                              border: "1px solid oklch(0.55 0.15 230 / 30%)",
                            }}
                          >
                            <SiTelegram
                              className="w-4 h-4"
                              style={{ color: "oklch(0.68 0.18 230)" }}
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1.5">
                              <span className="text-[11px] font-semibold text-[oklch(0.80_0.04_210)]">
                                Telegram Bot
                              </span>
                            </div>
                            <span className="text-[9px] text-[oklch(0.45_0.03_210)] truncate block">
                              BotFather API · Available
                            </span>
                          </div>
                          <Badge
                            className="text-[8px] px-1 py-0 h-3.5 flex-shrink-0 border"
                            style={{
                              background: "oklch(0.55 0.15 230 / 10%)",
                              color: "oklch(0.65 0.18 230)",
                              borderColor: "oklch(0.55 0.15 230 / 25%)",
                            }}
                          >
                            Bot API
                          </Badge>
                        </div>
                      </button>

                      {/* OpenAI AI Assistant */}
                      <button
                        type="button"
                        onClick={() => setActiveTab("ai")}
                        className="group relative rounded-xl border overflow-hidden text-left transition-all hover:scale-[1.01] hover:brightness-110 active:scale-[0.99]"
                        style={{
                          background: hasOpenAI
                            ? "linear-gradient(135deg, oklch(0.12 0.05 290), oklch(0.10 0.02 240))"
                            : "oklch(0.10 0.01 240)",
                          borderColor: hasOpenAI
                            ? "oklch(0.60 0.20 290 / 35%)"
                            : "oklch(1 0 0 / 8%)",
                          borderLeftColor: "oklch(0.65 0.20 290)",
                          borderLeftWidth: "3px",
                          boxShadow: hasOpenAI
                            ? "0 2px 12px oklch(0.60 0.20 290 / 15%)"
                            : "none",
                        }}
                      >
                        <div className="flex items-center gap-2.5 p-2.5">
                          <div
                            className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                            style={{
                              background: "oklch(0.60 0.20 290 / 15%)",
                              border: "1px solid oklch(0.60 0.20 290 / 30%)",
                            }}
                          >
                            <Sparkles
                              className="w-4 h-4"
                              style={{ color: "oklch(0.75 0.22 290)" }}
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1.5">
                              <span className="text-[11px] font-semibold text-[oklch(0.80_0.04_210)]">
                                AI Assistant
                              </span>
                              {hasOpenAI && (
                                <span className="flex items-center gap-0.5">
                                  <span
                                    className="w-1.5 h-1.5 rounded-full"
                                    style={{
                                      background: "oklch(0.75 0.22 290)",
                                      boxShadow: "0 0 4px oklch(0.75 0.22 290)",
                                    }}
                                  />
                                  <span className="text-[9px] text-[oklch(0.72_0.22_290)] font-bold">
                                    ON
                                  </span>
                                </span>
                              )}
                            </div>
                            <span className="text-[9px] text-[oklch(0.45_0.03_210)] font-mono truncate block">
                              {hasOpenAI ? "sk-••••••••••" : "OpenAI · Not set"}
                            </span>
                          </div>
                          <Badge
                            className="text-[8px] px-1 py-0 h-3.5 flex-shrink-0 border"
                            style={{
                              background: "oklch(0.60 0.20 290 / 10%)",
                              color: "oklch(0.72 0.22 290)",
                              borderColor: "oklch(0.60 0.20 290 / 25%)",
                            }}
                          >
                            AI API
                          </Badge>
                        </div>
                      </button>

                      {/* OpenClaw REST API */}
                      <button
                        type="button"
                        onClick={() => setActiveTab("api")}
                        className="group relative rounded-xl border overflow-hidden text-left transition-all hover:scale-[1.01] hover:brightness-110 active:scale-[0.99]"
                        style={{
                          background:
                            "linear-gradient(135deg, oklch(0.11 0.04 190), oklch(0.10 0.02 240))",
                          borderColor: "oklch(0.62 0.18 190 / 25%)",
                          borderLeftColor: "oklch(0.65 0.18 190)",
                          borderLeftWidth: "3px",
                        }}
                      >
                        <div className="flex items-center gap-2.5 p-2.5">
                          <div
                            className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                            style={{
                              background: "oklch(0.62 0.18 190 / 15%)",
                              border: "1px solid oklch(0.62 0.18 190 / 30%)",
                            }}
                          >
                            <Terminal
                              className="w-4 h-4"
                              style={{ color: "oklch(0.72 0.18 190)" }}
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <span className="text-[11px] font-semibold text-[oklch(0.80_0.04_210)] block">
                              OpenClaw API
                            </span>
                            <span className="text-[9px] text-[oklch(0.45_0.03_210)] truncate block">
                              REST API · Explorer Ready
                            </span>
                          </div>
                          <Badge
                            className="text-[8px] px-1 py-0 h-3.5 flex-shrink-0 border"
                            style={{
                              background: "oklch(0.62 0.18 190 / 10%)",
                              color: "oklch(0.70 0.18 190)",
                              borderColor: "oklch(0.62 0.18 190 / 25%)",
                            }}
                          >
                            REST
                          </Badge>
                        </div>
                      </button>

                      {/* Add Integration */}
                      <button
                        type="button"
                        onClick={() => setActiveTab("profile")}
                        className="flex items-center gap-2 p-2.5 rounded-xl border border-dashed border-[oklch(1_0_0_/_12%)] bg-transparent transition-all hover:border-[oklch(0.65_0.12_210)]/40 hover:bg-[oklch(0.65_0.12_210)]/5"
                      >
                        <Plus className="w-4 h-4 flex-shrink-0 text-[oklch(0.38_0.02_210)]" />
                        <span className="text-[10px] text-[oklch(0.38_0.02_210)]">
                          Add integration
                        </span>
                      </button>
                    </div>
                  </div>

                  <Separator className="bg-[oklch(1_0_0_/_6%)]" />

                  {/* Settings */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-1.5">
                      <Settings className="w-3.5 h-3.5 text-[oklch(0.55_0.08_210)]" />
                      <span className="text-[11px] font-semibold text-[oklch(0.50_0.04_210)] uppercase tracking-wider">
                        Settings
                      </span>
                    </div>

                    {/* Notifications toggle */}
                    <div className="flex items-center justify-between py-1.5">
                      <div className="flex items-center gap-2">
                        <Bell className="w-3.5 h-3.5 text-[oklch(0.45_0.03_210)]" />
                        <span className="text-xs text-[oklch(0.65_0.03_210)]">
                          Notifications
                        </span>
                      </div>
                      <Switch
                        checked={notificationsOn}
                        onCheckedChange={(v) => {
                          setNotificationsOn(v);
                          localStorage.setItem(
                            "clawpro_notifications",
                            v ? "true" : "false",
                          );
                        }}
                        className="scale-75 data-[state=checked]:bg-[oklch(0.65_0.15_210)]"
                      />
                    </div>

                    {/* Auto-save toggle */}
                    <div className="flex items-center justify-between py-1.5">
                      <div className="flex items-center gap-2">
                        <Save className="w-3.5 h-3.5 text-[oklch(0.45_0.03_210)]" />
                        <span className="text-xs text-[oklch(0.65_0.03_210)]">
                          Auto-save
                        </span>
                      </div>
                      <Switch
                        checked={autoSave}
                        onCheckedChange={(v) => {
                          setAutoSave(v);
                          localStorage.setItem(
                            "clawpro_autosave",
                            v ? "true" : "false",
                          );
                        }}
                        className="scale-75 data-[state=checked]:bg-[oklch(0.65_0.15_210)]"
                      />
                    </div>

                    {/* Language display */}
                    <div className="flex items-center gap-2 py-1.5">
                      <Globe2 className="w-3.5 h-3.5 text-[oklch(0.45_0.03_210)]" />
                      <span className="text-xs text-[oklch(0.65_0.03_210)]">
                        Language
                      </span>
                      <span className="ml-auto text-[10px] text-[oklch(0.55_0.08_210)] font-medium">
                        {LANG_NAMES[language] ?? language}
                      </span>
                    </div>
                  </div>

                  {/* Principal */}
                  <div className="pt-1">
                    <p className="text-[9px] font-mono text-[oklch(0.32_0.02_210)] truncate leading-relaxed">
                      <span className="text-[oklch(0.38_0.04_210)]">ID: </span>
                      {principalStr || "—"}
                    </p>
                  </div>
                </div>
              </ScrollArea>
            </aside>

            {/* ─── RIGHT MAIN PANEL ─── */}
            <div
              className="flex-1 flex flex-col min-w-0 overflow-hidden"
              style={{
                background: "oklch(0.095 0.015 240)",
                boxShadow: "inset 0 1px 0 oklch(1 0 0 / 10%)",
              }}
            >
              {/* Colorful gradient accent bar at top */}
              <div
                className="h-0.5 w-full flex-shrink-0"
                style={{
                  background:
                    "linear-gradient(90deg, oklch(0.65 0.20 210), oklch(0.65 0.22 145), oklch(0.70 0.22 290), oklch(0.68 0.18 190), oklch(0.72 0.18 60), oklch(0.68 0.20 15))",
                }}
              />
              {/* Top bar with close button */}
              <div className="flex items-center justify-between px-5 py-3.5 border-b border-[oklch(1_0_0_/_7%)] bg-[oklch(0.10_0.012_240)] flex-shrink-0">
                <div className="flex items-center gap-3">
                  {/* Mobile: avatar + name inline */}
                  <div
                    className="md:hidden w-8 h-8 rounded-full flex items-center justify-center text-xs font-black text-white flex-shrink-0"
                    style={{
                      background: tierStyle
                        ? `radial-gradient(circle at 30% 30%, ${tierStyle.color}, oklch(0.15 0.05 240))`
                        : "linear-gradient(135deg, oklch(0.65 0.15 210), oklch(0.45 0.12 240))",
                    }}
                  >
                    {initials}
                  </div>
                  <div>
                    <h2 className="font-bold text-sm text-[oklch(0.92_0.03_210)] leading-tight">
                      {fullName || handle || t.dashboard.title}
                    </h2>
                    <div className="flex items-center gap-2">
                      {handle && (
                        <span className="text-[10px] font-mono text-[oklch(0.50_0.10_210)]">
                          @{handle}
                        </span>
                      )}
                      {membership && tierStyle && (
                        <Badge
                          className={`border text-[9px] px-1.5 py-0 h-4 ${tierStyle.badge}`}
                        >
                          {tierStyle.icon} {tierStyle.label}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={onClose}
                  className="p-2 rounded-lg hover:bg-[oklch(1_0_0_/_8%)] text-[oklch(0.45_0.02_210)] hover:text-[oklch(0.88_0.02_210)] transition-colors flex-shrink-0"
                  aria-label="Close dashboard"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Tabs */}
              <Tabs
                value={activeTab}
                onValueChange={setActiveTab}
                className="flex-1 flex flex-col overflow-hidden"
              >
                {/* Colorful Card Tabs */}
                <TabsList
                  className="flex mx-4 mt-3 mb-0 bg-transparent border-none flex-shrink-0 h-auto p-0 gap-1.5 overflow-x-auto rounded-none"
                  asChild={false}
                >
                  {[
                    {
                      value: "profile",
                      icon: <User className="w-4 h-4" />,
                      label: "Profile",
                      activeColor: "oklch(0.65 0.20 210)",
                      activeBg:
                        "linear-gradient(135deg, oklch(0.30 0.12 210), oklch(0.22 0.08 220))",
                      activeShadow: "0 4px 16px oklch(0.65 0.20 210 / 40%)",
                      inactiveBorder: "oklch(0.65 0.20 210 / 30%)",
                      inactiveBg: "oklch(0.10 0.02 210)",
                    },
                    {
                      value: "configs",
                      icon: <Settings className="w-4 h-4" />,
                      label: "Configs",
                      activeColor: "oklch(0.65 0.20 280)",
                      activeBg:
                        "linear-gradient(135deg, oklch(0.30 0.12 280), oklch(0.22 0.08 285))",
                      activeShadow: "0 4px 16px oklch(0.65 0.20 280 / 40%)",
                      inactiveBorder: "oklch(0.65 0.20 280 / 30%)",
                      inactiveBg: "oklch(0.10 0.02 280)",
                    },
                    {
                      value: "chatbot",
                      icon: <Bot className="w-4 h-4" />,
                      label: "Bot",
                      activeColor: "oklch(0.65 0.22 145)",
                      activeBg:
                        "linear-gradient(135deg, oklch(0.28 0.12 145), oklch(0.20 0.08 150))",
                      activeShadow: "0 4px 16px oklch(0.65 0.22 145 / 40%)",
                      inactiveBorder: "oklch(0.65 0.22 145 / 30%)",
                      inactiveBg: "oklch(0.10 0.02 145)",
                    },
                    {
                      value: "ai",
                      icon: <Sparkles className="w-4 h-4" />,
                      label: "AI",
                      activeColor: "oklch(0.70 0.22 290)",
                      activeBg:
                        "linear-gradient(135deg, oklch(0.30 0.14 290), oklch(0.22 0.10 295))",
                      activeShadow: "0 4px 16px oklch(0.70 0.22 290 / 40%)",
                      inactiveBorder: "oklch(0.70 0.22 290 / 30%)",
                      inactiveBg: "oklch(0.10 0.02 290)",
                    },
                    {
                      value: "api",
                      icon: <Terminal className="w-4 h-4" />,
                      label: "API",
                      activeColor: "oklch(0.68 0.18 190)",
                      activeBg:
                        "linear-gradient(135deg, oklch(0.28 0.10 190), oklch(0.20 0.07 195))",
                      activeShadow: "0 4px 16px oklch(0.68 0.18 190 / 40%)",
                      inactiveBorder: "oklch(0.68 0.18 190 / 30%)",
                      inactiveBg: "oklch(0.10 0.02 190)",
                    },
                    {
                      value: "transactions",
                      icon: <Receipt className="w-4 h-4" />,
                      label: "Txns",
                      activeColor: "oklch(0.72 0.18 60)",
                      activeBg:
                        "linear-gradient(135deg, oklch(0.30 0.12 60), oklch(0.22 0.08 55))",
                      activeShadow: "0 4px 16px oklch(0.72 0.18 60 / 40%)",
                      inactiveBorder: "oklch(0.72 0.18 60 / 30%)",
                      inactiveBg: "oklch(0.10 0.02 60)",
                    },
                    {
                      value: "leaderboard",
                      icon: <Trophy className="w-4 h-4" />,
                      label: "Rank",
                      activeColor: "oklch(0.72 0.20 45)",
                      activeBg:
                        "linear-gradient(135deg, oklch(0.30 0.13 45), oklch(0.22 0.09 42))",
                      activeShadow: "0 4px 16px oklch(0.72 0.20 45 / 40%)",
                      inactiveBorder: "oklch(0.72 0.20 45 / 30%)",
                      inactiveBg: "oklch(0.10 0.02 45)",
                    },
                    {
                      value: "notifications",
                      icon: <BellIcon className="w-4 h-4" />,
                      label: "Alerts",
                      activeColor: "oklch(0.68 0.20 15)",
                      activeBg:
                        "linear-gradient(135deg, oklch(0.28 0.12 15), oklch(0.20 0.08 10))",
                      activeShadow: "0 4px 16px oklch(0.68 0.20 15 / 40%)",
                      inactiveBorder: "oklch(0.68 0.20 15 / 30%)",
                      inactiveBg: "oklch(0.10 0.02 15)",
                    },
                  ].map((tab) => {
                    const isActive = activeTab === tab.value;
                    return (
                      <TabsTrigger
                        key={tab.value}
                        value={tab.value}
                        className="relative flex-1 flex flex-col items-center justify-center gap-1 rounded-xl border transition-all duration-200 min-w-0 p-0"
                        style={{
                          background: isActive ? tab.activeBg : tab.inactiveBg,
                          borderColor: isActive
                            ? tab.activeColor
                            : tab.inactiveBorder,
                          boxShadow: isActive ? tab.activeShadow : "none",
                          color: isActive ? "white" : tab.activeColor,
                          height: "52px",
                          transform: isActive ? "scale(1.03)" : "scale(1)",
                        }}
                      >
                        <div
                          className="flex flex-col items-center gap-0.5 py-2 px-1"
                          style={{ color: "inherit" }}
                        >
                          <span
                            style={{
                              color: isActive ? "white" : tab.activeColor,
                              filter: isActive
                                ? `drop-shadow(0 0 4px ${tab.activeColor})`
                                : "none",
                            }}
                          >
                            {tab.icon}
                          </span>
                          <span
                            className="text-[9px] font-bold leading-none hidden sm:block"
                            style={{
                              color: isActive ? "white" : tab.activeColor,
                            }}
                          >
                            {tab.label}
                          </span>
                        </div>
                        {tab.value === "notifications" && unreadCount > 0 && (
                          <span
                            className="absolute -top-1 -right-1 w-4 h-4 rounded-full text-[8px] font-bold text-white flex items-center justify-center z-10"
                            style={{
                              background: "oklch(0.60 0.25 15)",
                              boxShadow: "0 0 8px oklch(0.60 0.25 15)",
                            }}
                          >
                            {unreadCount}
                          </span>
                        )}
                      </TabsTrigger>
                    );
                  })}
                </TabsList>

                <ScrollArea className="flex-1 mt-3">
                  {/* ── Profile Tab ── */}
                  <TabsContent value="profile" className="px-6 pb-6 mt-0">
                    <div className="space-y-5 max-w-lg">
                      {/* Handle card */}
                      <div className="rounded-xl border border-[oklch(1_0_0_/_8%)] bg-[oklch(0.11_0.012_240)] p-5 space-y-4">
                        <div className="flex items-center gap-2">
                          <AtSign className="w-4 h-4 text-[oklch(0.65_0.15_210)]" />
                          <h3 className="text-sm font-semibold text-[oklch(0.88_0.04_210)]">
                            Your ClawPro Handle
                          </h3>
                        </div>

                        <div className="space-y-1.5">
                          <Label className="text-xs text-[oklch(0.55_0.03_210)]">
                            Username
                          </Label>
                          <div className="flex items-center rounded-lg border border-[oklch(1_0_0_/_10%)] bg-[oklch(0.09_0.01_240)] overflow-hidden focus-within:border-[oklch(0.65_0.15_210)]/50 transition-colors">
                            <span className="px-3 py-2.5 text-xs font-mono text-[oklch(0.55_0.12_210)] bg-[oklch(0.65_0.15_210)]/8 border-r border-[oklch(1_0_0_/_8%)] whitespace-nowrap flex-shrink-0 select-none">
                              ClawPro.ai/
                            </span>
                            <input
                              type="text"
                              value={handle}
                              onChange={(e) =>
                                setHandle(
                                  e.target.value.replace(/[^a-zA-Z0-9_-]/g, ""),
                                )
                              }
                              placeholder="your-handle"
                              className="flex-1 bg-transparent px-3 py-2.5 text-sm text-[oklch(0.90_0.04_210)] placeholder:text-[oklch(0.35_0.02_210)] outline-none font-mono"
                              autoComplete="username"
                            />
                          </div>
                          <p className="text-[10px] text-[oklch(0.38_0.02_210)]">
                            Letters, numbers, hyphens and underscores only.
                          </p>
                        </div>

                        <div className="space-y-1.5">
                          <Label className="text-xs text-[oklch(0.55_0.03_210)]">
                            Full Name
                          </Label>
                          <Input
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            placeholder="Your real name (optional)"
                            className="bg-[oklch(0.09_0.01_240)] border-[oklch(1_0_0_/_10%)] text-sm h-10 focus:border-[oklch(0.65_0.15_210)]/50"
                          />
                          <p className="text-[10px] text-[oklch(0.38_0.02_210)]">
                            Shown on your profile card.
                          </p>
                        </div>

                        {userAccount?.email && (
                          <div className="space-y-1.5">
                            <Label className="text-xs text-[oklch(0.55_0.03_210)]">
                              Email
                            </Label>
                            <div className="flex items-center px-3 py-2.5 rounded-lg border border-[oklch(1_0_0_/_8%)] bg-[oklch(0.09_0.01_240)] text-sm text-[oklch(0.55_0.05_210)] font-mono">
                              {userAccount.email}
                            </div>
                          </div>
                        )}

                        {userAccount?.phone && (
                          <div className="space-y-1.5">
                            <Label className="text-xs text-[oklch(0.55_0.03_210)]">
                              Phone
                            </Label>
                            <div className="flex items-center px-3 py-2.5 rounded-lg border border-[oklch(1_0_0_/_8%)] bg-[oklch(0.09_0.01_240)] text-sm text-[oklch(0.55_0.05_210)] font-mono">
                              {userAccount.phone}
                            </div>
                          </div>
                        )}

                        <Button
                          onClick={handleSaveProfile}
                          disabled={saveProfile.isPending || !handle.trim()}
                          className="bg-[oklch(0.62_0.15_210)] hover:bg-[oklch(0.70_0.15_210)] text-white font-semibold h-9 text-sm w-full"
                        >
                          {saveProfile.isPending ? (
                            <>
                              <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                              {t.dashboard.savingProfile}
                            </>
                          ) : (
                            t.dashboard.saveProfile
                          )}
                        </Button>
                      </div>

                      {/* Membership card */}
                      <div className="rounded-xl border border-[oklch(1_0_0_/_8%)] bg-[oklch(0.11_0.012_240)] p-5">
                        <div className="flex items-center gap-2 mb-4">
                          <Crown className="w-4 h-4 text-amber-400" />
                          <h3 className="text-sm font-semibold text-[oklch(0.88_0.04_210)]">
                            {t.dashboard.membershipTier}
                          </h3>
                        </div>

                        {membership && tierStyle ? (
                          <div className="space-y-3">
                            <div className="flex items-center gap-4">
                              <div
                                className={`w-12 h-12 rounded-full flex items-center justify-center text-xl border ${tierStyle.badge}`}
                              >
                                {tierStyle.icon}
                              </div>
                              <div>
                                <p className="font-bold text-base text-[oklch(0.90_0.04_210)]">
                                  {tierStyle.label}
                                </p>
                                <p className="text-xs text-[oklch(0.45_0.02_210)]">
                                  {t.dashboard.memberSince}{" "}
                                  {formatDate(membership.purchasedAt)}
                                </p>
                              </div>
                              <Badge
                                className={`ml-auto border text-xs px-2 py-1 ${tierStyle.badge}`}
                              >
                                Active
                              </Badge>
                            </div>

                            {/* Token Balance */}
                            <div
                              className="flex items-center justify-between px-4 py-3 rounded-xl border"
                              style={{
                                background:
                                  "linear-gradient(135deg, oklch(0.22 0.07 60 / 40%), oklch(0.16 0.04 55 / 30%))",
                                borderColor: "oklch(0.7 0.15 60 / 20%)",
                              }}
                            >
                              <div className="flex items-center gap-2">
                                <Coins className="w-4 h-4 text-amber-400" />
                                <span className="text-xs font-medium text-[oklch(0.70_0.04_210)]">
                                  Token Balance
                                </span>
                              </div>
                              <div className="flex items-center gap-1.5">
                                <span className="font-black text-xl text-amber-200">
                                  {TIER_TOKENS[
                                    membership.tier
                                  ].toLocaleString()}
                                </span>
                                <span className="text-xs text-amber-400/60">
                                  tokens
                                </span>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center gap-4 py-2">
                            <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[oklch(0.14_0.01_240)] border border-[oklch(1_0_0_/_8%)] text-[oklch(0.40_0.02_210)] text-lg">
                              —
                            </div>
                            <div>
                              <p className="text-sm text-[oklch(0.50_0.02_210)]">
                                {t.dashboard.noMembership}
                              </p>
                              <button
                                type="button"
                                onClick={goToPricing}
                                className="text-xs text-[oklch(0.62_0.15_210)] hover:text-[oklch(0.75_0.15_210)] transition-colors flex items-center gap-1 mt-1 font-medium"
                              >
                                View plans <ChevronRight className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </TabsContent>

                  {/* ── Configs Tab ── */}
                  <TabsContent
                    value="configs"
                    className="px-5 pb-6 mt-0 space-y-2"
                  >
                    {configs && configs.length > 0 ? (
                      configs.map((cfg) => (
                        <motion.div
                          key={cfg.id.toString()}
                          initial={{ opacity: 0, x: -8 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="flex items-center gap-3 p-3 rounded-xl border border-[oklch(1_0_0_/_8%)] bg-[oklch(0.11_0.012_240)] group hover:border-[oklch(1_0_0_/_14%)] transition-all"
                        >
                          <div className="w-8 h-8 rounded-lg bg-[oklch(0.65_0.12_210)]/12 flex items-center justify-center flex-shrink-0">
                            <Settings className="w-4 h-4 text-[oklch(0.62_0.12_210)]" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-[oklch(0.88_0.04_210)] truncate">
                              {cfg.name}
                            </p>
                            <div className="flex items-center gap-2 mt-0.5">
                              <Badge
                                variant="outline"
                                className="text-[10px] border-[oklch(1_0_0_/_12%)] text-[oklch(0.50_0.03_210)] px-1.5 py-0 h-4"
                              >
                                {cfg.os}
                              </Badge>
                              <span className="text-[10px] text-[oklch(0.40_0.02_210)]">
                                {formatDate(cfg.createdAt)}
                              </span>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleDeleteConfig(cfg.id)}
                            disabled={deleteConfig.isPending}
                            className="p-1.5 rounded-lg text-[oklch(0.40_0.02_210)] hover:text-destructive hover:bg-destructive/10 transition-colors opacity-0 group-hover:opacity-100 flex-shrink-0"
                            aria-label="Delete config"
                          >
                            {deleteConfig.isPending ? (
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                              <Trash2 className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </motion.div>
                      ))
                    ) : (
                      <div className="flex flex-col items-center justify-center py-16 text-center">
                        <Settings className="w-10 h-10 text-[oklch(0.28_0.02_210)] mb-3" />
                        <p className="text-sm text-[oklch(0.45_0.02_210)]">
                          {t.dashboard.noConfigs}
                        </p>
                      </div>
                    )}
                  </TabsContent>

                  {/* ── Chatbot Tab ── */}
                  <TabsContent value="chatbot" className="px-5 pb-6 mt-0">
                    <ChatbotSetupTab
                      membership={membership ?? null}
                      onGoToPricing={goToPricing}
                    />
                  </TabsContent>

                  {/* ── AI Tab ── */}
                  <TabsContent value="ai" className="px-5 pb-6 mt-0">
                    <AIAssistantTab
                      membership={membership ?? null}
                      onGoToPricing={goToPricing}
                    />
                  </TabsContent>

                  {/* ── API Tab ── */}
                  <TabsContent value="api" className="px-5 pb-6 mt-0">
                    <APIExplorerTab
                      membership={membership ?? null}
                      onGoToPricing={goToPricing}
                    />
                  </TabsContent>

                  {/* ── Transactions Tab ── */}
                  <TabsContent value="transactions" className="px-5 pb-6 mt-0">
                    <TransactionsTab membership={membership ?? null} />
                  </TabsContent>

                  {/* ── Leaderboard Tab ── */}
                  <TabsContent value="leaderboard" className="px-5 pb-6 mt-0">
                    <LeaderboardTab
                      membership={membership ?? null}
                      currentHandle={handle}
                      currentTokens={
                        membership ? TIER_TOKENS[membership.tier] : 0
                      }
                      onTop3Change={setUserIsTop3}
                    />
                  </TabsContent>

                  {/* ── Notifications Tab ── */}
                  <TabsContent value="notifications" className="px-5 pb-6 mt-0">
                    <NotificationsTab
                      membership={membership ?? null}
                      onRead={async () => {
                        if (forumNotifications) {
                          await Promise.all(
                            forumNotifications
                              .filter((n) => !n.read)
                              .map((n) => markForumNotifRead.mutateAsync(n.id)),
                          );
                        }
                      }}
                      isInTop3={userIsTop3}
                      forumNotifications={forumNotifications ?? []}
                    />
                  </TabsContent>
                </ScrollArea>
              </Tabs>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// ── Transactions Sub-component ──

interface TransactionsTabProps {
  membership: { tier: MembershipTier; purchasedAt: bigint } | null;
}

const PAYMENT_METHOD_STYLES: Record<
  PaymentMethod,
  { bg: string; text: string; label: string }
> = {
  Card: { bg: "bg-blue-500/15", text: "text-blue-300", label: "💳 Card" },
  PayPal: { bg: "bg-sky-500/15", text: "text-sky-300", label: "🅿️ PayPal" },
  Bitcoin: { bg: "bg-orange-500/15", text: "text-orange-300", label: "₿ BTC" },
  QRIS: { bg: "bg-emerald-500/15", text: "text-emerald-300", label: "⊞ QRIS" },
};

const TIER_BADGE_STYLES: Record<MembershipTier, string> = {
  [MembershipTier.silver]: "bg-slate-500/20 text-slate-200 border-slate-400/40",
  [MembershipTier.gold]: "bg-amber-500/20 text-amber-200 border-amber-400/40",
  [MembershipTier.platinum]:
    "bg-violet-500/20 text-violet-200 border-violet-400/40",
};

const TIER_NAMES: Record<MembershipTier, string> = {
  [MembershipTier.silver]: "Silver",
  [MembershipTier.gold]: "Gold",
  [MembershipTier.platinum]: "Platinum",
};

function TransactionsTab({ membership }: TransactionsTabProps) {
  const [transactions] = useState<Transaction[]>(() => {
    const existing = loadTransactions();
    if (existing.length === 0 && membership) {
      const purchasedAtMs = Number(membership.purchasedAt) / 1_000_000;
      const seedTx: Transaction = {
        id: `tx-seed-${membership.tier}`,
        date: new Date(purchasedAtMs || Date.now()).toISOString(),
        tier: membership.tier,
        amount: TIER_PRICES[membership.tier],
        tokens: TIER_TOKENS[membership.tier],
        paymentMethod: "Card",
        status: "completed",
      };
      saveTransactions([seedTx]);
      return [seedTx];
    }
    return existing;
  });

  const totalTokens = transactions
    .filter((tx) => tx.status === "completed")
    .reduce((sum, tx) => sum + tx.tokens, 0);

  const totalSpent = transactions
    .filter((tx) => tx.status === "completed")
    .reduce((sum, tx) => sum + tx.amount, 0);

  const formatTxDate = (iso: string) => {
    try {
      return new Date(iso).toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return iso;
    }
  };

  return (
    <div className="space-y-4 max-w-2xl">
      {/* Token Balance Summary */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative rounded-xl overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, oklch(0.22 0.08 60) 0%, oklch(0.18 0.06 50) 50%, oklch(0.14 0.04 45) 100%)",
          boxShadow:
            "0 4px 24px oklch(0.7 0.18 60 / 20%), inset 0 1px 0 oklch(1 0 0 / 15%)",
        }}
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,oklch(0.8_0.20_60_/_12%),transparent_60%)]" />
        <div className="relative p-5">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-400/20 border border-amber-400/30 flex items-center justify-center">
                <Coins className="w-5 h-5 text-amber-300" />
              </div>
              <div>
                <p className="text-[11px] font-bold text-amber-300/70 uppercase tracking-wider">
                  Token Balance
                </p>
                <p className="text-[10px] text-amber-200/50">$1 = 100 tokens</p>
              </div>
            </div>
            <div className="text-right">
              <p
                className="font-black text-3xl text-amber-200 leading-none"
                style={{ textShadow: "0 0 20px oklch(0.8 0.18 60 / 60%)" }}
              >
                {totalTokens.toLocaleString()}
              </p>
              <p className="text-[11px] text-amber-300/60 mt-0.5">
                total tokens
              </p>
            </div>
          </div>
          <div className="flex items-center justify-between pt-3 border-t border-amber-400/15">
            <span className="text-xs text-amber-200/60">Total spent</span>
            <span className="text-sm font-bold text-amber-200">
              ${totalSpent.toFixed(2)}
            </span>
          </div>
        </div>
      </motion.div>

      {/* Transaction History */}
      <div className="rounded-xl border border-[oklch(1_0_0_/_8%)] bg-[oklch(0.11_0.012_240)] overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-[oklch(1_0_0_/_6%)]">
          <h3 className="text-xs font-semibold text-[oklch(0.68_0.05_210)] flex items-center gap-2">
            <Receipt className="w-3.5 h-3.5 text-[oklch(0.62_0.12_60)]" />
            Transaction History
          </h3>
          <span className="text-[10px] text-[oklch(0.40_0.02_210)]">
            {transactions.length} record{transactions.length !== 1 ? "s" : ""}
          </span>
        </div>

        {transactions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center px-6">
            <Receipt className="w-10 h-10 text-[oklch(0.28_0.02_210)] mb-3" />
            <p className="text-sm text-[oklch(0.45_0.02_210)] font-medium">
              No transactions yet
            </p>
            <p className="text-xs text-[oklch(0.35_0.01_210)] mt-1">
              {membership
                ? "Your payment history will appear here."
                : "Purchase a plan to start tracking transactions"}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-[oklch(1_0_0_/_5%)]">
            {transactions.map((tx, i) => {
              const pmStyle = PAYMENT_METHOD_STYLES[tx.paymentMethod];
              const tierBadge = TIER_BADGE_STYLES[tx.tier];
              const tierName = TIER_NAMES[tx.tier];
              return (
                <motion.div
                  key={tx.id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2, delay: i * 0.05 }}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-[oklch(1_0_0_/_2%)] transition-colors"
                >
                  <div className="w-16 flex-shrink-0">
                    <p className="text-[10px] text-[oklch(0.45_0.02_210)] leading-tight">
                      {formatTxDate(tx.date)}
                    </p>
                  </div>
                  <Badge
                    className={`border text-[10px] px-1.5 py-0 h-4 flex-shrink-0 ${tierBadge}`}
                  >
                    {tierName}
                  </Badge>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-[oklch(0.85_0.05_210)]">
                      ${tx.amount.toFixed(2)}
                    </p>
                    <div className="flex items-center gap-1 mt-0.5">
                      <Coins className="w-2.5 h-2.5 text-amber-400" />
                      <span className="text-[10px] text-amber-300/80">
                        +{tx.tokens.toLocaleString()} tokens
                      </span>
                    </div>
                  </div>
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded-md font-medium flex-shrink-0 ${pmStyle.bg} ${pmStyle.text}`}
                  >
                    {pmStyle.label}
                  </span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-emerald-500/15 text-emerald-300 flex-shrink-0">
                    ✓ Done
                  </span>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* Conversion Info */}
      <div className="rounded-xl border border-[oklch(1_0_0_/_6%)] bg-[oklch(0.09_0.01_240)] p-3">
        <p className="text-[10px] text-[oklch(0.45_0.03_210)] text-center">
          <Coins className="w-3 h-3 inline mr-1 text-amber-400/70" />
          Token conversion:{" "}
          <span className="text-amber-300/80 font-semibold">
            $1.00 = 100 tokens
          </span>
          {" · "}Silver: 999 · Gold: 2,999 · Platinum: 7,999
        </p>
      </div>
    </div>
  );
}

// ── Chatbot Setup Sub-component ──

interface ChatbotSetupTabProps {
  membership: { tier: MembershipTier } | null;
  onGoToPricing: () => void;
}

function ChatbotSetupTab({ membership, onGoToPricing }: ChatbotSetupTabProps) {
  const { t } = useLanguage();
  const { data: chatbotConfig } = useChatbotConfig();
  const saveChatbot = useSaveChatbotConfig();
  const deleteChatbot = useDeleteChatbotConfig();

  const [phoneNumber, setPhoneNumber] = useState("");
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (chatbotConfig) {
      setPhoneNumber(chatbotConfig.phoneNumber);
      setEnabled(chatbotConfig.enabled);
    }
  }, [chatbotConfig]);

  const hasMembership = !!membership;

  const handleSave = async () => {
    if (!phoneNumber.trim()) {
      toast.error("Please enter a phone number.");
      return;
    }
    try {
      await saveChatbot.mutateAsync({
        phoneNumber: phoneNumber.trim(),
        enabled,
      });
      toast.success(t.chatbot.savedSuccess);
    } catch {
      toast.error(t.chatbot.error);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteChatbot.mutateAsync();
      toast.success(t.chatbot.deletedSuccess);
      setPhoneNumber("");
      setEnabled(false);
    } catch {
      toast.error(t.chatbot.error);
    }
  };

  if (!hasMembership) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-[oklch(0.55_0.18_150)]/10 border border-[oklch(0.55_0.18_150)]/20 flex items-center justify-center">
          <SiWhatsapp className="w-8 h-8 text-[oklch(0.62_0.18_150)]" />
        </div>
        <div>
          <h3 className="font-bold text-[oklch(0.85_0.05_210)] mb-1">
            {t.chatbot.lockedTitle}
          </h3>
          <p className="text-sm text-[oklch(0.50_0.02_210)] max-w-xs mx-auto">
            {t.chatbot.lockedDesc}
          </p>
        </div>
        <Button
          onClick={onGoToPricing}
          size="sm"
          className="bg-[oklch(0.55_0.18_150)] hover:bg-[oklch(0.62_0.18_150)] text-white font-semibold"
        >
          {t.chatbot.upgradeCta}
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4 max-w-lg">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 rounded-xl border border-[oklch(0.55_0.18_150)]/20 bg-[oklch(0.55_0.18_150)]/5">
        <div className="w-10 h-10 rounded-xl bg-[oklch(0.55_0.18_150)]/15 border border-[oklch(0.55_0.18_150)]/25 flex items-center justify-center flex-shrink-0">
          <SiWhatsapp className="w-5 h-5 text-[oklch(0.65_0.18_150)]" />
        </div>
        <div>
          <h3 className="font-bold text-sm text-[oklch(0.88_0.04_210)]">
            {t.chatbot.title}
          </h3>
          <p className="text-xs text-[oklch(0.50_0.02_210)] leading-relaxed">
            {t.chatbot.description}
          </p>
        </div>
      </div>

      {/* Current Status */}
      {chatbotConfig && (
        <div className="flex items-center justify-between px-4 py-3 rounded-lg bg-[oklch(0.10_0.01_240)] border border-[oklch(1_0_0_/_8%)]">
          <div className="flex items-center gap-2 text-xs text-[oklch(0.55_0.03_210)]">
            <span>{t.chatbot.currentNumber}</span>
            <span className="font-mono text-[oklch(0.75_0.05_210)]">
              {chatbotConfig.phoneNumber}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            {chatbotConfig.enabled ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-[oklch(0.62_0.18_150)]" />
                <span className="text-[11px] text-[oklch(0.62_0.18_150)]">
                  {t.chatbot.active}
                </span>
              </>
            ) : (
              <>
                <XCircle className="w-3.5 h-3.5 text-[oklch(0.50_0.02_210)]" />
                <span className="text-[11px] text-[oklch(0.50_0.02_210)]">
                  {t.chatbot.inactive}
                </span>
              </>
            )}
          </div>
        </div>
      )}

      {/* Config Form */}
      <div className="rounded-xl border border-[oklch(1_0_0_/_8%)] bg-[oklch(0.11_0.012_240)] p-4 space-y-4">
        <div className="space-y-1.5">
          <Label className="text-xs text-[oklch(0.55_0.03_210)]">
            {t.chatbot.phoneLabel}
          </Label>
          <Input
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder={t.chatbot.phonePlaceholder}
            type="tel"
            className="bg-[oklch(0.09_0.01_240)] border-[oklch(1_0_0_/_10%)] text-sm h-10 font-mono focus:border-[oklch(0.55_0.18_150)]/50"
          />
          <p className="text-[10px] text-[oklch(0.40_0.02_210)]">
            Include country code, e.g. +62 for Indonesia, +1 for US
          </p>
        </div>

        <div className="flex items-center justify-between py-2 border-t border-[oklch(1_0_0_/_6%)]">
          <div>
            <p className="text-sm font-medium text-[oklch(0.82_0.04_210)]">
              {t.chatbot.enableToggle}
            </p>
            <p className="text-[11px] text-[oklch(0.45_0.02_210)]">
              {enabled ? t.chatbot.active : t.chatbot.inactive}
            </p>
          </div>
          <Switch
            checked={enabled}
            onCheckedChange={setEnabled}
            className="data-[state=checked]:bg-[oklch(0.55_0.18_150)]"
          />
        </div>

        <Button
          onClick={handleSave}
          disabled={saveChatbot.isPending}
          className="w-full bg-[oklch(0.50_0.18_150)] hover:bg-[oklch(0.58_0.18_150)] text-white font-semibold h-9 text-sm"
        >
          {saveChatbot.isPending ? (
            <>
              <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
              {t.chatbot.saving}
            </>
          ) : (
            <>
              <SiWhatsapp className="w-3.5 h-3.5 mr-1.5" />
              {t.chatbot.saveConfig}
            </>
          )}
        </Button>

        {chatbotConfig && (
          <Button
            onClick={handleDelete}
            disabled={deleteChatbot.isPending}
            variant="outline"
            size="sm"
            className="w-full border-destructive/30 text-destructive hover:bg-destructive/10 hover:border-destructive/50 h-8 text-xs"
          >
            {deleteChatbot.isPending ? (
              <>
                <Loader2 className="w-3 h-3 mr-1.5 animate-spin" />
                {t.chatbot.deleting}
              </>
            ) : (
              <>
                <Trash2 className="w-3 h-3 mr-1.5" />
                {t.chatbot.deleteConfig}
              </>
            )}
          </Button>
        )}
      </div>

      {/* How It Works */}
      <div className="rounded-xl border border-[oklch(1_0_0_/_8%)] bg-[oklch(0.10_0.01_240)] p-4 space-y-3">
        <h4 className="text-xs font-semibold text-[oklch(0.58_0.05_210)] uppercase tracking-wider">
          {t.chatbot.howItWorks}
        </h4>
        <div className="space-y-2">
          {[
            t.chatbot.step1,
            t.chatbot.step2,
            t.chatbot.step3,
            t.chatbot.step4,
          ].map((step, i) => (
            <div key={`step-${i + 1}`} className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-full bg-[oklch(0.55_0.18_150)]/15 border border-[oklch(0.55_0.18_150)]/25 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-[10px] font-bold text-[oklch(0.62_0.18_150)]">
                  {i + 1}
                </span>
              </div>
              <p className="text-xs text-[oklch(0.55_0.03_210)] leading-relaxed">
                {step}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Chat di WhatsApp CTA */}
      <a
        href="https://wa.me/+6285781237934"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-3 w-full py-3.5 px-5 rounded-xl font-bold text-sm text-white transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
        style={{
          background:
            "linear-gradient(135deg, oklch(0.48 0.18 150) 0%, oklch(0.42 0.20 145) 100%)",
          boxShadow:
            "0 4px 20px oklch(0.50 0.18 150 / 40%), 0 2px 8px oklch(0.50 0.18 150 / 25%)",
        }}
      >
        <SiWhatsapp className="w-5 h-5 flex-shrink-0" />
        <span>Chat di WhatsApp</span>
        <span className="text-white/70 text-xs font-normal">
          +62 857-8123-7934
        </span>
      </a>
    </div>
  );
}

// ── AI Assistant Sub-component ──

interface AIMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
}

const PLATINUM_PRESETS = [
  {
    name: "Config Optimizer",
    prompt:
      "You are an OpenClaw config optimization specialist. Analyze the user's hardware specs and suggest the optimal configuration parameters for maximum performance and precision.",
  },
  {
    name: "Troubleshooter",
    prompt:
      "You are an OpenClaw hardware troubleshooting expert. Help diagnose and fix issues with claw mechanisms, servo calibration, and electronic components.",
  },
  {
    name: "Advanced Setup",
    prompt:
      "You are an OpenClaw advanced setup assistant. Walk users through complex multi-axis configurations, PID tuning, and custom firmware integration step by step.",
  },
];

interface AIAssistantTabProps {
  membership: { tier: MembershipTier } | null;
  onGoToPricing: () => void;
}

function AIAssistantTab({ membership, onGoToPricing }: AIAssistantTabProps) {
  const hasMembership = !!membership;
  const isPlatinum = membership?.tier === MembershipTier.platinum;

  const [apiKey, setApiKey] = useState(
    () => localStorage.getItem("openclaw_openai_key") ?? "",
  );
  const [showKey, setShowKey] = useState(false);
  const [model, setModel] = useState("gpt-4o");
  const [systemPrompt, setSystemPrompt] = useState(
    "You are an OpenClaw expert assistant. Help users configure their claw hardware and optimize their setups.",
  );
  const [messages, setMessages] = useState<AIMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // biome-ignore lint/correctness/useExhaustiveDependencies: intentional scroll trigger on messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const saveApiKey = (key: string) => {
    setApiKey(key);
    localStorage.setItem("openclaw_openai_key", key);
  };

  const applyPreset = (preset: (typeof PLATINUM_PRESETS)[0]) => {
    setSystemPrompt(preset.prompt);
    toast.success(`Applied preset: ${preset.name}`);
  };

  const sendMessage = async () => {
    const trimmedInput = input.trim();
    if (!trimmedInput || isLoading) return;
    if (!apiKey.trim()) {
      toast.error("Please enter your OpenAI API key first.");
      return;
    }

    const userMessage: AIMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: trimmedInput,
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch(
        "https://api.openai.com/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model,
            messages: [
              { role: "system", content: systemPrompt },
              ...messages.map((m) => ({ role: m.role, content: m.content })),
              { role: "user", content: trimmedInput },
            ],
            max_tokens: 1024,
            temperature: 0.7,
          }),
        },
      );

      if (!response.ok) {
        const errData = (await response.json().catch(() => ({}))) as {
          error?: { message?: string };
        };
        const errMsg =
          errData?.error?.message ?? `API error ${response.status}`;
        if (response.status === 401) {
          toast.error("Invalid API key. Please check your OpenAI key.");
        } else if (response.status === 429) {
          toast.error("Rate limit reached. Please wait a moment.");
        } else {
          toast.error(errMsg);
        }
        setIsLoading(false);
        return;
      }

      const data = (await response.json()) as {
        choices: Array<{ message: { content: string } }>;
      };
      const assistantMsg = data.choices?.[0]?.message?.content ?? "";
      setMessages((prev) => [
        ...prev,
        {
          id: `assistant-${Date.now()}`,
          role: "assistant",
          content: assistantMsg,
        },
      ]);
    } catch {
      toast.error("Network error. Please check your connection.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void sendMessage();
    }
  };

  if (!hasMembership) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-[oklch(0.60_0.22_290)]/10 border border-[oklch(0.60_0.22_290)]/20 flex items-center justify-center">
          <Sparkles className="w-8 h-8 text-[oklch(0.72_0.22_290)]" />
        </div>
        <div>
          <h3 className="font-bold text-[oklch(0.85_0.05_210)] mb-1">
            AI Assistant
          </h3>
          <p className="text-sm text-[oklch(0.50_0.02_210)] max-w-xs mx-auto">
            Upgrade to Silver or higher to access the GPT-4o powered AI
            assistant for OpenClaw configuration help.
          </p>
        </div>
        <Button
          onClick={onGoToPricing}
          size="sm"
          className="bg-[oklch(0.58_0.20_290)] hover:bg-[oklch(0.65_0.20_290)] text-white font-semibold"
        >
          <Lock className="w-3.5 h-3.5 mr-1.5" />
          Upgrade to Silver+
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4 max-w-2xl">
      {/* Header */}
      <div className="flex items-center gap-3 p-3 rounded-xl border border-[oklch(0.60_0.22_290)]/20 bg-[oklch(0.60_0.22_290)]/5">
        <div className="w-9 h-9 rounded-xl bg-[oklch(0.60_0.22_290)]/15 border border-[oklch(0.60_0.22_290)]/25 flex items-center justify-center flex-shrink-0">
          <Sparkles className="w-4 h-4 text-[oklch(0.75_0.18_290)]" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-sm text-[oklch(0.88_0.04_210)]">
            AI Assistant
          </h3>
          <p className="text-xs text-[oklch(0.50_0.02_210)]">
            Powered by OpenAI · GPT-4o ready
          </p>
        </div>
        <Badge className="border text-[10px] px-1.5 py-0.5 bg-[oklch(0.60_0.22_290)]/15 text-[oklch(0.75_0.18_290)] border-[oklch(0.60_0.22_290)]/30 flex-shrink-0">
          Beta
        </Badge>
      </div>

      {/* API Key & Config */}
      <div className="rounded-xl border border-[oklch(1_0_0_/_8%)] bg-[oklch(0.11_0.012_240)] p-4 space-y-3">
        <div className="space-y-1.5">
          <Label className="text-xs text-[oklch(0.55_0.03_210)]">
            OpenAI API Key
          </Label>
          <div className="relative">
            <Input
              type={showKey ? "text" : "password"}
              value={apiKey}
              onChange={(e) => saveApiKey(e.target.value)}
              placeholder="sk-..."
              className="bg-[oklch(0.09_0.01_240)] border-[oklch(1_0_0_/_10%)] text-sm h-10 font-mono pr-10 focus:border-[oklch(0.60_0.22_290)]/50"
            />
            <button
              type="button"
              onClick={() => setShowKey(!showKey)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[oklch(0.45_0.02_210)] hover:text-[oklch(0.65_0.03_210)] transition-colors"
            >
              {showKey ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>
          <p className="text-[10px] text-[oklch(0.38_0.02_210)]">
            Your key is stored locally and never sent to our servers.
          </p>
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs text-[oklch(0.55_0.03_210)]">Model</Label>
          <Select value={model} onValueChange={setModel}>
            <SelectTrigger className="bg-[oklch(0.09_0.01_240)] border-[oklch(1_0_0_/_10%)] text-sm h-10">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="gpt-4o">GPT-4o (Recommended)</SelectItem>
              <SelectItem value="gpt-4-turbo">GPT-4 Turbo</SelectItem>
              <SelectItem value="gpt-3.5-turbo">
                GPT-3.5 Turbo (Fast)
              </SelectItem>
              <SelectItem value="claude-3-5-sonnet">
                Claude 3.5 Sonnet
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs text-[oklch(0.55_0.03_210)]">
            System Prompt
          </Label>
          <Textarea
            value={systemPrompt}
            onChange={(e) => setSystemPrompt(e.target.value)}
            className="bg-[oklch(0.09_0.01_240)] border-[oklch(1_0_0_/_10%)] text-xs min-h-14 resize-none focus:border-[oklch(0.60_0.22_290)]/50 font-mono"
            rows={2}
          />
        </div>
      </div>

      {/* Platinum Presets */}
      {isPlatinum && (
        <div className="rounded-xl border border-[oklch(0.55_0.22_290)]/25 bg-[oklch(0.55_0.22_290)]/5 p-4 space-y-2">
          <div className="flex items-center gap-2 mb-2">
            <Crown className="w-3.5 h-3.5 text-[oklch(0.72_0.22_290)]" />
            <span className="text-xs font-semibold text-[oklch(0.72_0.22_290)]">
              Platinum: Custom AI Presets
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {PLATINUM_PRESETS.map((preset) => (
              <button
                key={preset.name}
                type="button"
                onClick={() => applyPreset(preset)}
                className="text-[10px] px-2.5 py-1.5 rounded-lg border border-[oklch(0.55_0.22_290)]/30 text-[oklch(0.72_0.22_290)] hover:bg-[oklch(0.55_0.22_290)]/15 transition-colors"
              >
                {preset.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Chat Messages */}
      <div className="rounded-xl border border-[oklch(1_0_0_/_8%)] bg-[oklch(0.09_0.01_240)] overflow-hidden">
        <div className="h-56 overflow-y-auto p-3 space-y-3">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-4">
              <Sparkles className="w-8 h-8 text-[oklch(0.32_0.05_290)] mb-2" />
              <p className="text-xs text-[oklch(0.40_0.02_210)]">
                Ask anything about OpenClaw configuration
              </p>
            </div>
          ) : (
            messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
              >
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-[10px] font-bold ${
                    msg.role === "user"
                      ? "bg-[oklch(0.62_0.12_210)]/20 text-[oklch(0.72_0.12_210)]"
                      : "bg-[oklch(0.60_0.22_290)]/20 text-[oklch(0.72_0.22_290)]"
                  }`}
                >
                  {msg.role === "user" ? "U" : "AI"}
                </div>
                <div
                  className={`max-w-[80%] rounded-xl px-3 py-2 text-xs leading-relaxed ${
                    msg.role === "user"
                      ? "bg-[oklch(0.62_0.12_210)]/15 text-[oklch(0.85_0.05_210)]"
                      : "bg-[oklch(0.14_0.015_240)] text-[oklch(0.78_0.04_210)] border border-[oklch(1_0_0_/_6%)]"
                  }`}
                >
                  <pre className="whitespace-pre-wrap font-sans">
                    {msg.content}
                  </pre>
                </div>
              </div>
            ))
          )}
          {isLoading && (
            <div className="flex gap-2">
              <div className="w-6 h-6 rounded-full bg-[oklch(0.60_0.22_290)]/20 text-[oklch(0.72_0.22_290)] flex items-center justify-center text-[10px] font-bold flex-shrink-0">
                AI
              </div>
              <div className="bg-[oklch(0.14_0.015_240)] border border-[oklch(1_0_0_/_6%)] rounded-xl px-3 py-2 flex items-center gap-2">
                <Loader2 className="w-3.5 h-3.5 animate-spin text-[oklch(0.72_0.22_290)]" />
                <span className="text-xs text-[oklch(0.45_0.02_210)]">
                  Thinking...
                </span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="border-t border-[oklch(1_0_0_/_8%)] p-3 flex gap-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about OpenClaw... (Enter to send)"
            className="bg-[oklch(0.12_0.015_240)] border-[oklch(1_0_0_/_10%)] text-xs min-h-8 max-h-24 resize-none focus:border-[oklch(0.60_0.22_290)]/50 flex-1"
            rows={1}
          />
          <Button
            onClick={sendMessage}
            disabled={isLoading || !input.trim()}
            size="sm"
            className="bg-[oklch(0.55_0.20_290)] hover:bg-[oklch(0.62_0.20_290)] text-white h-8 w-8 p-0 flex-shrink-0"
          >
            {isLoading ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Send className="w-3.5 h-3.5" />
            )}
          </Button>
        </div>
      </div>

      {messages.length > 0 && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setMessages([])}
          className="w-full text-xs text-[oklch(0.40_0.02_210)] hover:text-[oklch(0.60_0.03_210)] h-7"
        >
          <Trash2 className="w-3 h-3 mr-1.5" />
          Clear conversation
        </Button>
      )}
    </div>
  );
}

// ── Leaderboard Sub-component ──

interface LeaderboardTabProps {
  membership: { tier: MembershipTier; purchasedAt: bigint } | null;
  currentHandle: string;
  currentTokens: number;
  onTop3Change?: (isTop3: boolean) => void;
}

const MEDAL_STYLES: Record<
  number,
  { color: string; bg: string; icon: React.ReactNode }
> = {
  1: {
    color: "text-amber-300",
    bg: "bg-amber-500/15 border-amber-400/30",
    icon: <Medal className="w-4 h-4 text-amber-300" />,
  },
  2: {
    color: "text-slate-300",
    bg: "bg-slate-500/15 border-slate-400/30",
    icon: <Medal className="w-4 h-4 text-slate-300" />,
  },
  3: {
    color: "text-orange-400",
    bg: "bg-orange-500/15 border-orange-400/30",
    icon: <Medal className="w-4 h-4 text-orange-400" />,
  },
};

// Top 3 Reward colors mapped from reward.color field
function getRewardGlow(color: string): string {
  const colorMap: Record<string, string> = {
    gold: "0 0 24px oklch(0.80 0.20 60 / 50%)",
    silver: "0 0 24px oklch(0.75 0.05 220 / 40%)",
    bronze: "0 0 24px oklch(0.70 0.12 40 / 45%)",
    platinum: "0 0 24px oklch(0.80 0.18 290 / 45%)",
  };
  return colorMap[color.toLowerCase()] ?? "0 0 24px oklch(0.70 0.15 210 / 40%)";
}

function getRewardBorder(color: string): string {
  const colorMap: Record<string, string> = {
    gold: "oklch(0.80 0.20 60 / 45%)",
    silver: "oklch(0.75 0.05 220 / 35%)",
    bronze: "oklch(0.70 0.12 40 / 40%)",
    platinum: "oklch(0.80 0.18 290 / 40%)",
  };
  return colorMap[color.toLowerCase()] ?? "oklch(0.65 0.12 210 / 35%)";
}

function getRewardBg(color: string): string {
  const colorMap: Record<string, string> = {
    gold: "linear-gradient(135deg, oklch(0.22 0.08 60 / 40%), oklch(0.15 0.04 55 / 30%))",
    silver:
      "linear-gradient(135deg, oklch(0.18 0.03 220 / 35%), oklch(0.14 0.02 210 / 25%))",
    bronze:
      "linear-gradient(135deg, oklch(0.20 0.06 40 / 35%), oklch(0.15 0.04 38 / 25%))",
    platinum:
      "linear-gradient(135deg, oklch(0.20 0.08 290 / 35%), oklch(0.15 0.04 285 / 25%))",
  };
  return (
    colorMap[color.toLowerCase()] ??
    "linear-gradient(135deg, oklch(0.18 0.04 210 / 30%), oklch(0.14 0.02 210 / 20%))"
  );
}

function getEntryDisplayName(entry: LeaderboardEntry): string {
  if (entry.displayName) return entry.displayName;
  if (entry.handle) return entry.handle;
  const principalStr = entry.principal.toString();
  return `${principalStr.slice(0, 8)}...`;
}

function getEntryInitials(entry: LeaderboardEntry): string {
  const name = entry.displayName || entry.handle;
  if (!name) {
    const principalStr = entry.principal.toString();
    return principalStr.slice(0, 2).toUpperCase();
  }
  return name
    .split(/[\s_-]+/)
    .map((w: string) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function LeaderboardTab({
  membership,
  currentHandle,
  currentTokens,
  onTop3Change,
}: LeaderboardTabProps) {
  const { identity } = useInternetIdentity();
  const leaderboardQuery = useLeaderboard();
  const topRewardsQuery = useTopRewards();
  const myRankQuery = useMyLeaderboardRank();
  const claimedRewardsQuery = useMyClaimedRewards();
  const claimTopReward = useClaimTopReward();

  const leaderboard = leaderboardQuery.data ?? [];
  const topRewards = topRewardsQuery.data ?? [];
  const claimedRewards: ClaimedReward[] = claimedRewardsQuery.data ?? [];
  const myRank = myRankQuery.data;
  const isLoading = leaderboardQuery.isLoading || leaderboardQuery.isFetching;
  const isRefetching =
    leaderboardQuery.isFetching && !leaderboardQuery.isLoading;

  // Top 3 entries for the podium
  const top3 = leaderboard.filter((e) => Number(e.rank) <= 3);

  // Check if current user is on leaderboard
  const currentUserEntry = leaderboard.find((e) => e.handle === currentHandle);
  const isOnLeaderboard = !!currentUserEntry;

  // Determine if user is in top 3 (use myRank from blockchain if available)
  const userRankNum = myRank
    ? Number(myRank.rank)
    : currentUserEntry
      ? Number(currentUserEntry.rank)
      : null;
  const isInTop3 = userRankNum !== null && userRankNum >= 1 && userRankNum <= 3;

  // Browser push notification when user enters top 3
  useEffect(() => {
    onTop3Change?.(isInTop3);

    if (!isInTop3 || !currentHandle) return;
    const storageKey = `clawpro_top3_notified_${currentHandle}`;
    if (localStorage.getItem(storageKey)) return;

    const fireNotification = () => {
      if ("Notification" in window && Notification.permission === "granted") {
        new Notification("🏆 ClawPro Top 3!", {
          body: "Congratulations! You've entered the Top 3 leaderboard!",
          icon: "/favicon.ico",
        });
        localStorage.setItem(storageKey, "true");
        toast.success("🏆 You're in Top 3! Check your notifications.");
      }
    };

    if (!("Notification" in window)) return;

    if (Notification.permission === "granted") {
      fireNotification();
    } else if (Notification.permission === "default") {
      Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
          fireNotification();
        }
      });
    }
  }, [isInTop3, currentHandle, onTop3Change]);

  const hasClaimedRank = (rank: number): boolean =>
    claimedRewards.some((r) => Number(r.rank) === rank);

  const getTopRewardForRank = (rank: number) =>
    topRewards.find((r) => Number(r.rank) === rank);

  const handleClaim = async (rank: number) => {
    try {
      const result = await claimTopReward.mutateAsync(BigInt(rank));
      toast.success(
        `🎉 Claimed ${Number(result.bonusTokens).toLocaleString()} bonus tokens! ${result.badge}`,
      );
      void claimedRewardsQuery.refetch();
    } catch {
      toast.error("Failed to claim reward. Please try again.");
    }
  };

  const rankEmoji: Record<number, string> = { 1: "👑", 2: "🥈", 3: "🥉" };

  return (
    <div className="space-y-5 max-w-2xl">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 rounded-xl border border-amber-500/20 bg-amber-500/5">
        <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/25 flex items-center justify-center flex-shrink-0">
          <Trophy className="w-5 h-5 text-amber-400" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-sm text-[oklch(0.88_0.04_210)]">
            Token Leaderboard
          </h3>
          <p className="text-xs text-[oklch(0.50_0.02_210)]">
            Real-time rankings from blockchain · {leaderboard.length} members
          </p>
        </div>
      </div>

      {/* ── Top 3 Reward Claim Banner ── */}
      {identity && membership && isInTop3 && userRankNum !== null && (
        <AnimatePresence>
          {hasClaimedRank(userRankNum) ? (
            /* Already claimed – subtle badge */
            <motion.div
              key="claimed"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-3 px-4 py-3 rounded-xl border border-[oklch(0.62_0.18_150)]/30 bg-[oklch(0.62_0.18_150)]/5"
            >
              <CheckCircle2 className="w-5 h-5 text-[oklch(0.62_0.18_150)] flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-[oklch(0.75_0.12_150)]">
                  ✓ Rank #{userRankNum} Reward Claimed
                </p>
                {(() => {
                  const claimed = claimedRewards.find(
                    (r) => Number(r.rank) === userRankNum,
                  );
                  return claimed ? (
                    <p className="text-[11px] text-[oklch(0.50_0.04_150)]">
                      {claimed.badge} {claimed.title} ·{" "}
                      <span className="font-bold text-amber-300">
                        +{Number(claimed.bonusTokens).toLocaleString()} tokens
                      </span>
                    </p>
                  ) : null;
                })()}
              </div>
            </motion.div>
          ) : (
            /* Not yet claimed – animated claim banner */
            <motion.div
              key="unclaimed"
              initial={{ opacity: 0, y: -8, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="relative overflow-hidden rounded-xl border"
              style={{
                background:
                  userRankNum === 1
                    ? "linear-gradient(135deg, oklch(0.22 0.08 60 / 50%), oklch(0.18 0.06 58 / 35%))"
                    : userRankNum === 2
                      ? "linear-gradient(135deg, oklch(0.18 0.03 220 / 45%), oklch(0.14 0.02 215 / 30%))"
                      : "linear-gradient(135deg, oklch(0.20 0.06 40 / 45%), oklch(0.16 0.04 38 / 30%))",
                borderColor:
                  userRankNum === 1
                    ? "oklch(0.80 0.20 60 / 40%)"
                    : userRankNum === 2
                      ? "oklch(0.75 0.05 220 / 35%)"
                      : "oklch(0.70 0.12 40 / 35%)",
                boxShadow:
                  userRankNum === 1
                    ? "0 0 30px oklch(0.80 0.20 60 / 20%)"
                    : userRankNum === 2
                      ? "0 0 24px oklch(0.75 0.05 220 / 15%)"
                      : "0 0 22px oklch(0.70 0.12 40 / 15%)",
              }}
            >
              {/* Pulse ring */}
              <motion.div
                className="absolute inset-0 rounded-xl pointer-events-none"
                animate={{ opacity: [0, 0.3, 0] }}
                transition={{
                  duration: 2.5,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                }}
                style={{
                  boxShadow:
                    userRankNum === 1
                      ? "inset 0 0 30px oklch(0.80 0.20 60 / 25%)"
                      : "inset 0 0 24px oklch(0.75 0.08 50 / 20%)",
                }}
              />

              <div className="relative flex items-center gap-4 px-4 py-4">
                {/* Rank emoji */}
                <div className="text-4xl leading-none flex-shrink-0">
                  {rankEmoji[userRankNum] ?? "🏅"}
                </div>

                {/* Text */}
                <div className="flex-1 min-w-0">
                  <p
                    className={`text-sm font-black leading-tight ${
                      userRankNum === 1
                        ? "text-amber-200"
                        : userRankNum === 2
                          ? "text-slate-200"
                          : "text-orange-200"
                    }`}
                  >
                    You&apos;re #{userRankNum} on the Leaderboard!
                  </p>
                  {getTopRewardForRank(userRankNum) && (
                    <p className="text-[11px] mt-0.5 text-[oklch(0.65_0.04_210)]">
                      Claim your reward:{" "}
                      <span className="font-bold text-amber-300">
                        +
                        {Number(
                          getTopRewardForRank(userRankNum)?.bonusTokens ?? 0,
                        ).toLocaleString()}{" "}
                        bonus tokens
                      </span>
                    </p>
                  )}
                </div>

                {/* Claim button */}
                <Button
                  onClick={() => handleClaim(userRankNum)}
                  disabled={claimTopReward.isPending}
                  size="sm"
                  className="flex-shrink-0 font-bold text-xs h-9 px-4 shadow-lg"
                  style={{
                    background:
                      userRankNum === 1
                        ? "linear-gradient(135deg, oklch(0.75 0.18 55), oklch(0.65 0.20 48))"
                        : "linear-gradient(135deg, oklch(0.62 0.12 210), oklch(0.50 0.16 230))",
                    color: "white",
                    boxShadow:
                      userRankNum === 1
                        ? "0 4px 16px oklch(0.75 0.18 55 / 40%)"
                        : "0 4px 16px oklch(0.62 0.12 210 / 35%)",
                  }}
                >
                  {claimTopReward.isPending ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                      Claiming…
                    </>
                  ) : (
                    <>
                      <Gift className="w-3.5 h-3.5 mr-1.5" />
                      Claim{" "}
                      {Number(
                        getTopRewardForRank(userRankNum)?.bonusTokens ?? 0,
                      ).toLocaleString()}{" "}
                      Tokens
                    </>
                  )}
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      )}

      {/* ── Claimed Rewards Display ── */}
      {identity && claimedRewards.length > 0 && (
        <div className="rounded-xl border border-[oklch(1_0_0_/_7%)] bg-[oklch(0.10_0.012_240)] p-4 space-y-2.5">
          <div className="flex items-center gap-2">
            <Gift className="w-3.5 h-3.5 text-amber-400" />
            <h4 className="text-[11px] font-bold text-[oklch(0.58_0.05_210)] uppercase tracking-wider">
              My Claimed Rewards
            </h4>
          </div>
          <div className="space-y-2">
            {claimedRewards.map((reward) => (
              <div
                key={reward.rank.toString()}
                className="flex items-center gap-3 px-3 py-2 rounded-lg bg-[oklch(0.12_0.01_240)] border border-[oklch(1_0_0_/_7%)]"
              >
                <span className="text-lg leading-none flex-shrink-0">
                  {reward.badge}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] font-semibold text-[oklch(0.82_0.04_210)] truncate">
                    {reward.title}
                  </p>
                  <p className="text-[10px] text-[oklch(0.45_0.02_210)]">
                    Rank #{reward.rank.toString()}
                  </p>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <Coins className="w-3 h-3 text-amber-400" />
                  <span className="text-[11px] font-bold text-amber-300">
                    +{Number(reward.bonusTokens).toLocaleString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Top 3 Rewards Section ── */}
      {(topRewardsQuery.isLoading || topRewards.length > 0) && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4 text-amber-400" />
            <h4 className="text-sm font-bold text-[oklch(0.88_0.04_210)]">
              Top 3 Rewards
            </h4>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {topRewardsQuery.isLoading
              ? [1, 2, 3].map((i) => (
                  <Skeleton
                    key={i}
                    className="h-32 rounded-xl bg-[oklch(0.13_0.01_240)]"
                  />
                ))
              : topRewards.map((reward: TopReward) => (
                  <motion.div
                    key={reward.rank.toString()}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: Number(reward.rank) * 0.08 }}
                    className="relative rounded-xl p-4 border text-center overflow-hidden"
                    style={{
                      background: getRewardBg(reward.color),
                      borderColor: getRewardBorder(reward.color),
                      boxShadow: getRewardGlow(reward.color),
                    }}
                  >
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,oklch(1_0_0_/_4%),transparent_70%)]" />
                    <div className="relative space-y-2">
                      {/* Badge emoji */}
                      <div className="text-3xl leading-none">
                        {reward.badge}
                      </div>
                      {/* Rank */}
                      <div
                        className="text-[10px] font-bold uppercase tracking-widest"
                        style={{ color: getRewardBorder(reward.color) }}
                      >
                        Rank #{reward.rank.toString()}
                      </div>
                      {/* Title */}
                      <p className="text-xs font-bold text-[oklch(0.90_0.04_210)] leading-tight">
                        {reward.title}
                      </p>
                      {/* Bonus tokens */}
                      <div className="flex items-center justify-center gap-1">
                        <Coins className="w-3 h-3 text-amber-400" />
                        <span className="text-[11px] font-bold text-amber-300">
                          +{Number(reward.bonusTokens).toLocaleString()} bonus
                        </span>
                      </div>
                      {/* Description */}
                      <p className="text-[10px] text-[oklch(0.52_0.02_210)] leading-relaxed">
                        {reward.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
          </div>
        </div>
      )}

      {/* ── Podium (top 3) ── */}
      {!isLoading && top3.length >= 3 && (
        <div className="rounded-xl border border-[oklch(1_0_0_/_8%)] bg-[oklch(0.10_0.012_240)] p-5">
          <h4 className="text-[11px] font-semibold text-[oklch(0.55_0.05_210)] uppercase tracking-wider mb-4 text-center">
            🏆 Podium
          </h4>
          {/* Arrange: 2nd left, 1st center, 3rd right */}
          <div className="flex items-end justify-center gap-3">
            {/* 2nd place */}
            {top3.find((e) => Number(e.rank) === 2) &&
              (() => {
                const e = top3.find((e) => Number(e.rank) === 2)!;
                const tierStyle = TIER_STYLES[e.tier];
                return (
                  <div className="flex flex-col items-center gap-1.5 flex-1 max-w-[100px]">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white border-2 border-slate-400/40"
                      style={{
                        background: `radial-gradient(circle at 30% 30%, ${tierStyle.color}, oklch(0.15 0.05 240))`,
                      }}
                    >
                      {getEntryInitials(e)}
                    </div>
                    <p className="text-[10px] font-semibold text-[oklch(0.80_0.03_210)] truncate w-full text-center">
                      {e.handle ? `@${e.handle}` : getEntryDisplayName(e)}
                    </p>
                    <div className="flex items-center gap-0.5">
                      <Coins className="w-2.5 h-2.5 text-slate-400" />
                      <span className="text-[9px] text-slate-300 font-bold">
                        {Number(e.tokens).toLocaleString()}
                      </span>
                    </div>
                    <div
                      className="w-full rounded-t-lg flex items-center justify-center font-black text-slate-300 text-sm bg-slate-500/20 border border-slate-400/20"
                      style={{ height: "4rem" }}
                    >
                      2
                    </div>
                  </div>
                );
              })()}

            {/* 1st place (center, tallest) */}
            {top3.find((e) => Number(e.rank) === 1) &&
              (() => {
                const e = top3.find((e) => Number(e.rank) === 1)!;
                const tierStyle = TIER_STYLES[e.tier];
                return (
                  <div className="flex flex-col items-center gap-1.5 flex-1 max-w-[110px]">
                    <div className="text-lg">👑</div>
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold text-white border-2 border-amber-400/60"
                      style={{
                        background: `radial-gradient(circle at 30% 30%, ${tierStyle.color}, oklch(0.15 0.05 240))`,
                        boxShadow: "0 0 16px oklch(0.80 0.20 60 / 40%)",
                      }}
                    >
                      {getEntryInitials(e)}
                    </div>
                    <p className="text-[10px] font-bold text-amber-200 truncate w-full text-center">
                      {e.handle ? `@${e.handle}` : getEntryDisplayName(e)}
                    </p>
                    <div className="flex items-center gap-0.5">
                      <Coins className="w-2.5 h-2.5 text-amber-400" />
                      <span className="text-[9px] text-amber-300 font-bold">
                        {Number(e.tokens).toLocaleString()}
                      </span>
                    </div>
                    <div
                      className="w-full rounded-t-lg flex items-center justify-center font-black text-amber-300 text-lg"
                      style={{
                        height: "5rem",
                        background:
                          "linear-gradient(180deg, oklch(0.24 0.08 60 / 40%), oklch(0.18 0.06 58 / 30%))",
                        border: "1px solid oklch(0.80 0.20 60 / 30%)",
                        boxShadow: "0 0 20px oklch(0.80 0.20 60 / 25%)",
                      }}
                    >
                      1
                    </div>
                  </div>
                );
              })()}

            {/* 3rd place */}
            {top3.find((e) => Number(e.rank) === 3) &&
              (() => {
                const e = top3.find((e) => Number(e.rank) === 3)!;
                const tierStyle = TIER_STYLES[e.tier];
                return (
                  <div className="flex flex-col items-center gap-1.5 flex-1 max-w-[100px]">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white border-2 border-orange-400/40"
                      style={{
                        background: `radial-gradient(circle at 30% 30%, ${tierStyle.color}, oklch(0.15 0.05 240))`,
                      }}
                    >
                      {getEntryInitials(e)}
                    </div>
                    <p className="text-[10px] font-semibold text-[oklch(0.80_0.03_210)] truncate w-full text-center">
                      {e.handle ? `@${e.handle}` : getEntryDisplayName(e)}
                    </p>
                    <div className="flex items-center gap-0.5">
                      <Coins className="w-2.5 h-2.5 text-orange-400" />
                      <span className="text-[9px] text-orange-300 font-bold">
                        {Number(e.tokens).toLocaleString()}
                      </span>
                    </div>
                    <div
                      className="w-full rounded-t-lg flex items-center justify-center font-black text-orange-400 text-sm bg-orange-500/15 border border-orange-400/20"
                      style={{ height: "3.5rem" }}
                    >
                      3
                    </div>
                  </div>
                );
              })()}
          </div>
        </div>
      )}

      {/* ── Your Rank Card (from blockchain) ── */}
      {identity && membership && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative rounded-xl overflow-hidden"
          style={{
            background:
              "linear-gradient(135deg, oklch(0.20 0.06 55) 0%, oklch(0.16 0.04 50) 100%)",
            boxShadow:
              "0 4px 20px oklch(0.7 0.18 60 / 15%), inset 0 1px 0 oklch(1 0 0 / 12%)",
          }}
        >
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,oklch(0.8_0.20_60_/_8%),transparent_60%)]" />
          <div className="relative flex items-center gap-4 px-5 py-4">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-amber-500/20 border border-amber-400/30 flex-shrink-0">
              {myRankQuery.isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin text-amber-400" />
              ) : myRank ? (
                <span className="font-black text-base text-amber-300">
                  #{myRank.rank.toString()}
                </span>
              ) : (
                <Trophy className="w-4 h-4 text-amber-400/50" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-sm text-amber-100">Your Rank</p>
              {myRank ? (
                <p className="text-[11px] text-amber-300/60">
                  @{myRank.handle || currentHandle || "set-handle"}
                </p>
              ) : myRankQuery.isLoading ? (
                <p className="text-[11px] text-amber-300/40">Loading...</p>
              ) : (
                <p className="text-[11px] text-amber-300/40">
                  {isOnLeaderboard
                    ? `Rank #${currentUserEntry?.rank.toString()}`
                    : "Your rank is being calculated"}
                </p>
              )}
            </div>
            <div className="text-right flex-shrink-0">
              <div className="flex items-center gap-1.5 justify-end">
                <Coins className="w-4 h-4 text-amber-400" />
                <span className="font-black text-xl text-amber-200">
                  {myRank
                    ? Number(myRank.tokens).toLocaleString()
                    : currentTokens.toLocaleString()}
                </span>
              </div>
              <p className="text-[10px] text-amber-300/50">tokens</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* ── Full Leaderboard Table ── */}
      <div className="rounded-xl border border-[oklch(1_0_0_/_8%)] bg-[oklch(0.10_0.012_240)] overflow-hidden">
        <div className="px-4 py-3 border-b border-[oklch(1_0_0_/_6%)] flex items-center justify-between">
          <h4 className="text-[11px] font-semibold text-[oklch(0.58_0.05_210)] uppercase tracking-wider">
            All Members
          </h4>
          <button
            type="button"
            onClick={() => leaderboardQuery.refetch()}
            disabled={isRefetching}
            className="flex items-center gap-1.5 text-[10px] text-[oklch(0.55_0.08_210)] hover:text-[oklch(0.72_0.12_210)] transition-colors px-2 py-1 rounded-lg hover:bg-[oklch(0.65_0.12_210)]/8 disabled:opacity-50"
            title="Refresh leaderboard"
          >
            <RefreshCw
              className={`w-3 h-3 ${isRefetching ? "animate-spin" : ""}`}
            />
            <span>Refresh</span>
          </button>
        </div>

        {isLoading ? (
          <div className="divide-y divide-[oklch(1_0_0_/_5%)]">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center gap-3 px-4 py-3">
                <Skeleton className="w-7 h-7 rounded-full bg-[oklch(0.14_0.01_240)]" />
                <Skeleton className="w-8 h-8 rounded-full bg-[oklch(0.14_0.01_240)]" />
                <div className="flex-1 space-y-1.5">
                  <Skeleton className="h-3 w-28 rounded bg-[oklch(0.14_0.01_240)]" />
                  <Skeleton className="h-2.5 w-20 rounded bg-[oklch(0.13_0.01_240)]" />
                </div>
                <Skeleton className="h-4 w-14 rounded-full bg-[oklch(0.14_0.01_240)]" />
                <Skeleton className="h-3 w-16 rounded bg-[oklch(0.13_0.01_240)]" />
              </div>
            ))}
          </div>
        ) : leaderboard.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-14 text-center px-6">
            <Trophy className="w-10 h-10 text-[oklch(0.28_0.02_210)] mb-3" />
            <p className="text-sm font-medium text-[oklch(0.50_0.02_210)]">
              No members yet
            </p>
            <p className="text-xs text-[oklch(0.38_0.01_210)] mt-1">
              Be the first to join the leaderboard!
            </p>
          </div>
        ) : (
          <div className="divide-y divide-[oklch(1_0_0_/_5%)]">
            {leaderboard.map((entry: LeaderboardEntry, i: number) => {
              const rankNum = Number(entry.rank);
              const isCurrentUser = entry.handle
                ? entry.handle === currentHandle
                : false;
              const medal = MEDAL_STYLES[rankNum];
              const tierStyle = TIER_STYLES[entry.tier];
              const displayName = getEntryDisplayName(entry);
              const initials = getEntryInitials(entry);

              return (
                <motion.div
                  key={entry.principal.toString()}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: Math.min(i * 0.03, 0.3) }}
                  className={`flex items-center gap-3 px-4 py-3 transition-colors ${
                    isCurrentUser
                      ? "bg-[oklch(0.65_0.15_210)]/8 border-l-2 border-[oklch(0.65_0.15_210)]/50"
                      : "hover:bg-[oklch(1_0_0_/_2%)]"
                  }`}
                  style={
                    rankNum <= 3
                      ? {
                          background: isCurrentUser
                            ? undefined
                            : rankNum === 1
                              ? "linear-gradient(90deg, oklch(0.22 0.07 55 / 20%), transparent)"
                              : rankNum === 2
                                ? "linear-gradient(90deg, oklch(0.20 0.03 220 / 15%), transparent)"
                                : "linear-gradient(90deg, oklch(0.22 0.06 40 / 15%), transparent)",
                        }
                      : undefined
                  }
                >
                  {/* Rank */}
                  <div
                    className={`w-7 h-7 rounded-full border flex items-center justify-center flex-shrink-0 ${
                      medal
                        ? medal.bg
                        : "bg-[oklch(0.14_0.01_240)] border-[oklch(1_0_0_/_8%)]"
                    }`}
                  >
                    {medal ? (
                      medal.icon
                    ) : (
                      <span className="text-[10px] font-bold text-[oklch(0.45_0.02_210)]">
                        {rankNum}
                      </span>
                    )}
                  </div>

                  {/* Avatar */}
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                    style={{
                      background: `radial-gradient(circle at 30% 30%, ${tierStyle.color}, oklch(0.15 0.05 240))`,
                    }}
                  >
                    {initials}
                  </div>

                  {/* Name & Handle */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-xs font-semibold text-[oklch(0.85_0.05_210)] truncate">
                        {isCurrentUser ? "You" : displayName}
                      </p>
                      {isCurrentUser && (
                        <Badge className="text-[9px] px-1 py-0 h-3.5 bg-[oklch(0.62_0.15_210)]/20 text-[oklch(0.72_0.15_210)] border-[oklch(0.62_0.15_210)]/30 border flex-shrink-0">
                          You
                        </Badge>
                      )}
                    </div>
                    {entry.handle && (
                      <p className="text-[10px] text-[oklch(0.42_0.03_210)] font-mono truncate">
                        @{entry.handle}
                      </p>
                    )}
                  </div>

                  {/* Tier Badge */}
                  <Badge
                    className={`border text-[9px] px-1.5 py-0 h-4 flex-shrink-0 ${tierStyle.badge}`}
                  >
                    {tierStyle.icon} {tierStyle.label}
                  </Badge>

                  {/* Tokens */}
                  <div className="text-right flex-shrink-0">
                    <div className="flex items-center gap-1 justify-end">
                      <Coins className="w-3 h-3 text-amber-400/70" />
                      <span
                        className={`text-xs font-bold ${
                          medal ? medal.color : "text-[oklch(0.75_0.05_210)]"
                        }`}
                      >
                        {Number(entry.tokens).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* Info note */}
      <div className="rounded-xl border border-[oklch(1_0_0_/_6%)] bg-[oklch(0.09_0.01_240)] p-3">
        <p className="text-[10px] text-[oklch(0.42_0.03_210)] text-center">
          <Trophy className="w-3 h-3 inline mr-1 text-amber-400/70" />
          Live data from blockchain · Rankings update based on token balance.
          Top 3 earn special rewards!
        </p>
      </div>

      {/* ── View Public Leaderboard ── */}
      <a
        href="/#/leaderboard"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl border border-[oklch(0.62_0.15_210)]/30 text-[oklch(0.68_0.15_210)] hover:text-[oklch(0.82_0.15_210)] hover:bg-[oklch(0.62_0.15_210)]/8 hover:border-[oklch(0.62_0.15_210)]/50 transition-all text-sm font-semibold group"
      >
        <ExternalLink className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
        View Public Leaderboard
        <span className="text-[10px] text-[oklch(0.45_0.03_210)] font-normal">
          (no login required)
        </span>
      </a>
    </div>
  );
}

// ── Notifications Sub-component ──

interface NotificationsTabProps {
  membership: { tier: MembershipTier } | null;
  onRead: () => void | Promise<void>;
  isInTop3?: boolean;
  forumNotifications?: import("../backend.d").ForumNotification[];
}

type NotificationType =
  | "welcome"
  | "token_earned"
  | "tier_upgrade"
  | "feature_update"
  | "reminder";

interface NotificationItem {
  id: number;
  type: NotificationType;
  title: string;
  message: string;
  time: string;
  read: boolean;
}

const NOTIFICATION_STYLES: Record<
  NotificationType,
  { color: string; bg: string; border: string }
> = {
  welcome: {
    color: "text-cyan-300",
    bg: "bg-cyan-500/10",
    border: "border-cyan-500/25",
  },
  token_earned: {
    color: "text-amber-300",
    bg: "bg-amber-500/10",
    border: "border-amber-500/25",
  },
  tier_upgrade: {
    color: "text-violet-300",
    bg: "bg-violet-500/10",
    border: "border-violet-500/25",
  },
  feature_update: {
    color: "text-blue-300",
    bg: "bg-blue-500/10",
    border: "border-blue-500/25",
  },
  reminder: {
    color: "text-slate-300",
    bg: "bg-slate-500/10",
    border: "border-slate-500/25",
  },
};

const NOTIFICATION_ICONS: Record<NotificationType, React.ReactNode> = {
  welcome: <Sparkles className="w-4 h-4" />,
  token_earned: <Coins className="w-4 h-4" />,
  tier_upgrade: <Crown className="w-4 h-4" />,
  feature_update: <Zap className="w-4 h-4" />,
  reminder: <Bell className="w-4 h-4" />,
};

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 1,
    type: "welcome",
    title: "Welcome to ClawPro!",
    message: "Your account is ready. Start exploring your member benefits.",
    time: "2 days ago",
    read: true,
  },
  {
    id: 2,
    type: "token_earned",
    title: "Tokens Added!",
    message: "You received 999 tokens from Silver membership purchase.",
    time: "1 day ago",
    read: false,
  },
  {
    id: 3,
    type: "feature_update",
    title: "New: API Explorer",
    message: "API Explorer is now available for Gold and Platinum members.",
    time: "12 hours ago",
    read: false,
  },
  {
    id: 4,
    type: "reminder",
    title: "Complete Your Profile",
    message: "Add your ClawPro handle to appear on the leaderboard.",
    time: "6 hours ago",
    read: false,
  },
  {
    id: 5,
    type: "tier_upgrade",
    title: "Upgrade Available",
    message: "Unlock 2,999 tokens by upgrading to Gold membership today.",
    time: "1 hour ago",
    read: true,
  },
];

function NotificationsTab({
  membership: _membership,
  onRead,
  isInTop3 = false,
  forumNotifications = [],
}: NotificationsTabProps) {
  const top3Notification: NotificationItem | null = isInTop3
    ? {
        id: 9999,
        type: "token_earned" as NotificationType,
        title: "🏆 Top 3 Achievement!",
        message:
          "You're currently in the Top 3 leaderboard! Your bonus tokens have been unlocked.",
        time: "Just now",
        read: false,
      }
    : null;

  const [notifications, setNotifications] = useState<NotificationItem[]>(
    INITIAL_NOTIFICATIONS,
  );

  // Merge top3 notification at the top if applicable
  const allNotifications = top3Notification
    ? [top3Notification, ...notifications.filter((n) => n.id !== 9999)]
    : notifications;

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    onRead();
  };

  const forumUnread = forumNotifications.filter((n) => !n.read).length;
  const unread = allNotifications.filter((n) => !n.read).length + forumUnread;

  return (
    <div className="space-y-4 max-w-2xl">
      {/* Forum Reply Notifications */}
      {forumNotifications.length > 0 && (
        <div className="rounded-xl border border-cyan-500/20 bg-[oklch(0.10_0.012_240)] overflow-hidden">
          <div className="flex items-center gap-2 px-4 py-2.5 border-b border-white/6">
            <BellIcon className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-xs font-semibold text-cyan-300">
              Forum Replies
            </span>
            {forumUnread > 0 && (
              <span className="ml-auto text-[9px] bg-red-500 text-white rounded-full px-1.5 py-0.5 font-bold">
                {forumUnread} new
              </span>
            )}
          </div>
          <div className="divide-y divide-white/5">
            {forumNotifications.slice(0, 5).map((notif, i) => (
              <motion.div
                key={notif.id.toString()}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.04 }}
                className={`flex items-start gap-3 px-4 py-3 ${!notif.read ? "bg-cyan-500/5" : ""}`}
              >
                <div className="w-7 h-7 rounded-full bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-xs font-bold text-white flex-shrink-0 mt-0.5">
                  {notif.fromHandle.slice(0, 1).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-slate-300">
                    <span className="font-semibold text-white">
                      @{notif.fromHandle}
                    </span>{" "}
                    replied to{" "}
                    <span className="text-cyan-400">{notif.threadTitle}</span>
                  </p>
                  <p className="text-[10px] text-slate-600 mt-0.5">
                    {(() => {
                      const ms = Number(notif.createdAt) / 1_000_000;
                      const diff = Date.now() - ms;
                      const m = Math.floor(diff / 60000);
                      if (m < 1) return "Just now";
                      if (m < 60) return `${m}m ago`;
                      const h = Math.floor(m / 60);
                      if (h < 24) return `${h}h ago`;
                      return `${Math.floor(h / 24)}d ago`;
                    })()}
                  </p>
                </div>
                {!notif.read && (
                  <div className="w-2 h-2 rounded-full bg-cyan-400 flex-shrink-0 mt-2" />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 py-1">
          <div className="w-8 h-8 rounded-xl bg-[oklch(0.62_0.15_30)]/15 border border-[oklch(0.62_0.15_30)]/25 flex items-center justify-center">
            <BellIcon className="w-4 h-4 text-[oklch(0.72_0.15_30)]" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-[oklch(0.88_0.04_210)]">
              Notifications
            </h3>
            {unread > 0 && (
              <p className="text-[11px] text-[oklch(0.55_0.03_210)]">
                {unread} unread
              </p>
            )}
          </div>
        </div>
        {unread > 0 && (
          <button
            type="button"
            onClick={markAllRead}
            className="text-[11px] text-[oklch(0.62_0.15_210)] hover:text-[oklch(0.75_0.15_210)] transition-colors font-medium"
          >
            Mark all as read
          </button>
        )}
      </div>

      {/* Notifications List */}
      <div className="rounded-xl border border-[oklch(1_0_0_/_8%)] bg-[oklch(0.10_0.012_240)] overflow-hidden">
        {allNotifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center px-6">
            <BellIcon className="w-10 h-10 text-[oklch(0.28_0.02_210)] mb-3" />
            <p className="text-sm text-[oklch(0.45_0.02_210)]">
              No notifications yet
            </p>
          </div>
        ) : (
          <div className="divide-y divide-[oklch(1_0_0_/_5%)]">
            {allNotifications.map((notif, i) => {
              const style = NOTIFICATION_STYLES[notif.type];
              const icon = NOTIFICATION_ICONS[notif.type];

              return (
                <motion.div
                  key={notif.id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className={`flex items-start gap-3 px-4 py-4 transition-colors ${
                    !notif.read
                      ? "bg-[oklch(0.65_0.15_210)]/5"
                      : "hover:bg-[oklch(1_0_0_/_2%)]"
                  }`}
                >
                  {/* Icon */}
                  <div
                    className={`w-8 h-8 rounded-xl border flex items-center justify-center flex-shrink-0 mt-0.5 ${style.bg} ${style.border} ${style.color}`}
                  >
                    {icon}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p
                        className={`text-xs font-semibold leading-tight ${
                          !notif.read
                            ? "text-[oklch(0.90_0.04_210)]"
                            : "text-[oklch(0.72_0.03_210)]"
                        }`}
                      >
                        {notif.title}
                      </p>
                      {!notif.read && (
                        <span className="w-1.5 h-1.5 rounded-full bg-[oklch(0.62_0.15_210)] flex-shrink-0 mt-1.5" />
                      )}
                    </div>
                    <p className="text-[11px] text-[oklch(0.52_0.02_210)] leading-relaxed mt-0.5">
                      {notif.message}
                    </p>
                    <p className="text-[10px] text-[oklch(0.38_0.02_210)] mt-1">
                      {notif.time}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* All read state */}
      {unread === 0 && (
        <p className="text-center text-[11px] text-[oklch(0.40_0.02_210)]">
          All caught up! No unread notifications.
        </p>
      )}
    </div>
  );
}

// ── API Explorer Sub-component ──

interface RequestHistoryEntry {
  method: string;
  endpoint: string;
  status: number | null;
  timestamp: string;
  response: string;
}

const OPENCLAW_ENDPOINTS = [
  { method: "GET", path: "/status", hasBody: false, label: "GET /status" },
  { method: "GET", path: "/devices", hasBody: false, label: "GET /devices" },
  {
    method: "POST",
    path: "/devices/{id}/configure",
    hasBody: true,
    label: "POST /devices/{id}/configure",
  },
  { method: "GET", path: "/configs", hasBody: false, label: "GET /configs" },
  { method: "POST", path: "/configs", hasBody: true, label: "POST /configs" },
  {
    method: "GET",
    path: "/analytics",
    hasBody: false,
    label: "GET /analytics",
  },
];

interface APIExplorerTabProps {
  membership: { tier: MembershipTier } | null;
  onGoToPricing: () => void;
}

function APIExplorerTab({ membership, onGoToPricing }: APIExplorerTabProps) {
  const isSilver = membership?.tier === MembershipTier.silver;
  const hasGoldOrHigher =
    membership?.tier === MembershipTier.gold ||
    membership?.tier === MembershipTier.platinum;

  const [baseUrl, setBaseUrl] = useState("https://api.openclaw.ai/v1");
  const [apiKey, setApiKey] = useState(
    () => localStorage.getItem("openclaw_api_key") ?? "",
  );
  const [showKey, setShowKey] = useState(false);
  const [selectedEndpointIdx, setSelectedEndpointIdx] = useState(0);
  const [requestBody, setRequestBody] = useState(
    '{\n  "id": "device_001",\n  "config": {}\n}',
  );
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<string>("");
  const [responseStatus, setResponseStatus] = useState<number | null>(null);
  const [history, setHistory] = useState<RequestHistoryEntry[]>(() => {
    try {
      const raw = localStorage.getItem("openclaw_api_history");
      return raw ? (JSON.parse(raw) as RequestHistoryEntry[]) : [];
    } catch {
      return [];
    }
  });

  const selectedEndpoint = OPENCLAW_ENDPOINTS[selectedEndpointIdx];

  const saveApiKey = (key: string) => {
    setApiKey(key);
    localStorage.setItem("openclaw_api_key", key);
  };

  const sendRequest = async () => {
    if (!baseUrl.trim()) {
      toast.error("Please enter a base URL.");
      return;
    }

    const url = `${baseUrl}${selectedEndpoint.path}`;
    setIsLoading(true);
    setResponse("");
    setResponseStatus(null);

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (apiKey.trim()) {
      headers.Authorization = `Bearer ${apiKey}`;
    }

    try {
      const res = await fetch(url, {
        method: selectedEndpoint.method,
        headers,
        mode: "cors",
        ...(selectedEndpoint.hasBody && requestBody.trim()
          ? { body: requestBody }
          : {}),
      });

      setResponseStatus(res.status);
      const text = await res.text();
      let formatted = text;
      try {
        formatted = JSON.stringify(JSON.parse(text), null, 2);
      } catch {
        // keep raw text
      }
      setResponse(formatted);

      const entry: RequestHistoryEntry = {
        method: selectedEndpoint.method,
        endpoint: selectedEndpoint.path,
        status: res.status,
        timestamp: new Date().toLocaleTimeString(),
        response: formatted.slice(0, 200),
      };
      const newHistory = [entry, ...history].slice(0, 5);
      setHistory(newHistory);
      localStorage.setItem("openclaw_api_history", JSON.stringify(newHistory));
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : "Network error";
      setResponse(
        `Error: ${errMsg}\n\nNote: The OpenClaw API may not be publicly accessible. This explorer is for testing purposes.`,
      );
      setResponseStatus(null);
      toast.error(`Request failed: ${errMsg}`);
    } finally {
      setIsLoading(false);
    }
  };

  if (!membership) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-[oklch(0.62_0.18_200)]/10 border border-[oklch(0.62_0.18_200)]/20 flex items-center justify-center">
          <Terminal className="w-8 h-8 text-[oklch(0.70_0.18_200)]" />
        </div>
        <div>
          <h3 className="font-bold text-[oklch(0.85_0.05_210)] mb-1">
            API Explorer
          </h3>
          <p className="text-sm text-[oklch(0.50_0.02_210)] max-w-xs mx-auto">
            Upgrade to Gold or higher to access the interactive OpenClaw API
            Explorer.
          </p>
        </div>
        <Button
          onClick={onGoToPricing}
          size="sm"
          className="bg-amber-500 hover:bg-amber-400 text-black font-semibold"
        >
          <Lock className="w-3.5 h-3.5 mr-1.5" />
          Upgrade to Gold+
        </Button>
      </div>
    );
  }

  if (isSilver) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-[oklch(0.62_0.18_200)]/10 border border-[oklch(0.62_0.18_200)]/20 flex items-center justify-center">
          <Lock className="w-8 h-8 text-[oklch(0.70_0.18_200)]" />
        </div>
        <div>
          <h3 className="font-bold text-[oklch(0.85_0.05_210)] mb-1">
            Gold+ Feature
          </h3>
          <p className="text-sm text-[oklch(0.50_0.02_210)] max-w-xs mx-auto">
            The API Explorer is available for Gold and Platinum members.
          </p>
        </div>
        <Button
          onClick={onGoToPricing}
          size="sm"
          className="bg-amber-500 hover:bg-amber-400 text-black font-semibold"
        >
          <Code2 className="w-3.5 h-3.5 mr-1.5" />
          Upgrade to Gold+
        </Button>
      </div>
    );
  }

  if (!hasGoldOrHigher) return null;

  return (
    <div className="space-y-4 max-w-2xl">
      {/* Header */}
      <div className="flex items-center gap-3 p-3 rounded-xl border border-[oklch(0.62_0.18_200)]/20 bg-[oklch(0.62_0.18_200)]/5">
        <div className="w-9 h-9 rounded-xl bg-[oklch(0.62_0.18_200)]/15 border border-[oklch(0.62_0.18_200)]/25 flex items-center justify-center flex-shrink-0">
          <Terminal className="w-4 h-4 text-[oklch(0.72_0.15_200)]" />
        </div>
        <div>
          <h3 className="font-bold text-sm text-[oklch(0.88_0.04_210)]">
            API Explorer
          </h3>
          <p className="text-xs text-[oklch(0.50_0.02_210)]">
            OpenClaw REST API · Interactive tester
          </p>
        </div>
      </div>

      {/* Config */}
      <div className="rounded-xl border border-[oklch(1_0_0_/_8%)] bg-[oklch(0.11_0.012_240)] p-4 space-y-3">
        <div className="space-y-1.5">
          <Label className="text-xs text-[oklch(0.55_0.03_210)]">
            Base URL
          </Label>
          <Input
            value={baseUrl}
            onChange={(e) => setBaseUrl(e.target.value)}
            placeholder="https://api.openclaw.ai/v1"
            className="bg-[oklch(0.09_0.01_240)] border-[oklch(1_0_0_/_10%)] text-xs h-10 font-mono focus:border-[oklch(0.62_0.18_200)]/50"
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs text-[oklch(0.55_0.03_210)]">API Key</Label>
          <div className="relative">
            <Input
              type={showKey ? "text" : "password"}
              value={apiKey}
              onChange={(e) => saveApiKey(e.target.value)}
              placeholder="your-api-key"
              className="bg-[oklch(0.09_0.01_240)] border-[oklch(1_0_0_/_10%)] text-xs h-10 font-mono pr-10 focus:border-[oklch(0.62_0.18_200)]/50"
            />
            <button
              type="button"
              onClick={() => setShowKey(!showKey)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[oklch(0.45_0.02_210)] hover:text-[oklch(0.65_0.03_210)] transition-colors"
            >
              {showKey ? (
                <EyeOff className="w-3.5 h-3.5" />
              ) : (
                <Eye className="w-3.5 h-3.5" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Endpoint Selector */}
      <div className="space-y-1.5">
        <Label className="text-xs text-[oklch(0.55_0.03_210)]">Endpoint</Label>
        <Select
          value={selectedEndpointIdx.toString()}
          onValueChange={(v) => setSelectedEndpointIdx(Number(v))}
        >
          <SelectTrigger className="bg-[oklch(0.11_0.012_240)] border-[oklch(1_0_0_/_10%)] text-xs h-10">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {OPENCLAW_ENDPOINTS.map((ep, i) => (
              <SelectItem key={ep.label} value={i.toString()}>
                <span
                  className={`font-mono font-bold mr-2 ${ep.method === "GET" ? "text-emerald-400" : "text-amber-400"}`}
                >
                  {ep.method}
                </span>
                {ep.path}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Request Body */}
      {selectedEndpoint.hasBody && (
        <div className="space-y-1.5">
          <Label className="text-xs text-[oklch(0.55_0.03_210)]">
            Request Body (JSON)
          </Label>
          <Textarea
            value={requestBody}
            onChange={(e) => setRequestBody(e.target.value)}
            className="bg-[oklch(0.09_0.01_240)] border-[oklch(1_0_0_/_10%)] text-xs min-h-20 resize-none focus:border-[oklch(0.62_0.18_200)]/50 font-mono"
            rows={4}
          />
        </div>
      )}

      {/* Send Button */}
      <Button
        onClick={sendRequest}
        disabled={isLoading}
        className="w-full bg-[oklch(0.50_0.18_200)] hover:bg-[oklch(0.58_0.18_200)] text-white font-semibold h-10 text-sm"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
            Sending...
          </>
        ) : (
          <>
            <Send className="w-3.5 h-3.5 mr-1.5" />
            Send Request
          </>
        )}
      </Button>

      {/* Response */}
      {(response || isLoading) && (
        <div className="rounded-xl border border-[oklch(1_0_0_/_8%)] bg-[oklch(0.09_0.01_240)] overflow-hidden">
          <div className="flex items-center justify-between px-3 py-2 border-b border-[oklch(1_0_0_/_6%)]">
            <span className="text-[10px] font-semibold text-[oklch(0.55_0.03_210)] uppercase tracking-wider">
              Response
            </span>
            {responseStatus !== null && (
              <Badge
                className={`text-[10px] px-1.5 py-0 h-4 border ${
                  responseStatus >= 200 && responseStatus < 300
                    ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
                    : "bg-red-500/15 text-red-400 border-red-500/30"
                }`}
              >
                {responseStatus}
              </Badge>
            )}
          </div>
          <pre className="p-3 text-[10px] font-mono text-[oklch(0.70_0.04_210)] overflow-x-auto max-h-40 leading-relaxed whitespace-pre-wrap">
            {isLoading ? "Loading..." : response}
          </pre>
        </div>
      )}

      {/* Request History */}
      {history.length > 0 && (
        <div className="rounded-xl border border-[oklch(1_0_0_/_8%)] bg-[oklch(0.10_0.01_240)] p-4 space-y-2">
          <div className="flex items-center justify-between mb-1">
            <h4 className="text-[10px] font-semibold text-[oklch(0.55_0.03_210)] uppercase tracking-wider">
              Recent Requests
            </h4>
            <button
              type="button"
              onClick={() => {
                setHistory([]);
                localStorage.removeItem("openclaw_api_history");
              }}
              className="text-[10px] text-[oklch(0.40_0.02_210)] hover:text-destructive transition-colors"
            >
              Clear
            </button>
          </div>
          {history.map((entry) => (
            <div
              key={`${entry.timestamp}-${entry.endpoint}`}
              className="flex items-center gap-2 text-[10px] py-1.5 border-b border-[oklch(1_0_0_/_5%)] last:border-0"
            >
              <span
                className={`font-mono font-bold ${entry.method === "GET" ? "text-emerald-400" : "text-amber-400"}`}
              >
                {entry.method}
              </span>
              <span className="text-[oklch(0.55_0.03_210)] font-mono flex-1 truncate">
                {entry.endpoint}
              </span>
              {entry.status && (
                <Badge
                  className={`text-[10px] px-1 py-0 h-3.5 border ${
                    entry.status >= 200 && entry.status < 300
                      ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/25"
                      : "bg-red-500/10 text-red-400 border-red-500/25"
                  }`}
                >
                  {entry.status}
                </Badge>
              )}
              <span className="text-[oklch(0.38_0.02_210)]">
                {entry.timestamp}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
