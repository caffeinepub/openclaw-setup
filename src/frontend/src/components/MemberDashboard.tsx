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
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  Bot,
  CheckCircle2,
  ChevronRight,
  Code2,
  Coins,
  Crown,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Receipt,
  Send,
  Settings,
  Sparkles,
  Terminal,
  Trash2,
  User,
  X,
  XCircle,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { SiWhatsapp } from "react-icons/si";
import { toast } from "sonner";
import { MembershipTier } from "../backend.d";
import {
  useChatbotConfig,
  useDeleteChatbotConfig,
  useSaveChatbotConfig,
} from "../hooks/useChatbot";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  MembershipTier as MembershipTierEnum,
  useMyMembership,
} from "../hooks/useMembership";
import {
  useCallerUserProfile,
  useDeleteConfig,
  useMyConfigs,
  useSaveCallerUserProfile,
} from "../hooks/useQueries";
import { useLanguage } from "../i18n/LanguageContext";

const TIER_STYLES: Record<
  MembershipTier,
  { label: string; badge: string; glow: string; icon: string }
> = {
  [MembershipTier.silver]: {
    label: "Silver",
    badge: "bg-slate-500/20 text-slate-200 border-slate-400/40",
    glow: "shadow-[0_0_20px_rgba(148,163,184,0.15)]",
    icon: "⬥",
  },
  [MembershipTier.gold]: {
    label: "Gold",
    badge: "bg-amber-500/20 text-amber-200 border-amber-400/40",
    glow: "shadow-[0_0_20px_rgba(251,191,36,0.15)]",
    icon: "★",
  },
  [MembershipTier.platinum]: {
    label: "Platinum",
    badge: "bg-violet-500/20 text-violet-200 border-violet-400/40",
    glow: "shadow-[0_0_20px_rgba(167,139,250,0.2)]",
    icon: "◆",
  },
};

// Token constants: $1 = 100 tokens
const TIER_PRICES: Record<MembershipTier, number> = {
  [MembershipTier.silver]: 9.99,
  [MembershipTier.gold]: 29.99,
  [MembershipTier.platinum]: 79.99,
};

const TIER_TOKENS: Record<MembershipTier, number> = {
  [MembershipTier.silver]: Math.round(9.99 * 100), // 999
  [MembershipTier.gold]: Math.round(29.99 * 100), // 2999
  [MembershipTier.platinum]: Math.round(79.99 * 100), // 7999
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

interface MemberDashboardProps {
  onClose: () => void;
}

export function MemberDashboard({ onClose }: MemberDashboardProps) {
  const { t } = useLanguage();
  const { identity } = useInternetIdentity();
  const { data: membership } = useMyMembership();
  const { data: profile } = useCallerUserProfile();
  const { data: configs } = useMyConfigs();
  const saveProfile = useSaveCallerUserProfile();
  const deleteConfig = useDeleteConfig();

  // Profile form state
  const [profileName, setProfileName] = useState("");
  const [profileBio, setProfileBio] = useState("");

  // Sync profile data when loaded
  useEffect(() => {
    if (profile) {
      setProfileName(profile.name ?? "");
      setProfileBio(profile.bio ?? "");
    }
  }, [profile]);

  const handleSaveProfile = async () => {
    try {
      await saveProfile.mutateAsync({ name: profileName, bio: profileBio });
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

  const principalStr = identity?.getPrincipal().toString() ?? "";
  const tierStyle = membership ? TIER_STYLES[membership.tier] : null;

  const formatDate = (nanoseconds: bigint) => {
    const ms = Number(nanoseconds) / 1_000_000;
    return new Date(ms).toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        <motion.div
          initial={{ scale: 0.92, opacity: 0, y: 24 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.92, opacity: 0, y: 24 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="bg-[oklch(0.10_0.015_240)] border border-[oklch(1_0_0_/_10%)] rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col shadow-[0_30px_80px_rgba(0,0,0,0.6)]"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div
            className={`flex items-center justify-between px-6 py-4 border-b border-[oklch(1_0_0_/_8%)] ${tierStyle ? tierStyle.glow : ""}`}
            style={{
              background: membership
                ? membership.tier === MembershipTierEnum.silver
                  ? "linear-gradient(135deg, oklch(0.13 0.018 240) 0%, oklch(0.15 0.02 210) 100%)"
                  : membership.tier === MembershipTierEnum.gold
                    ? "linear-gradient(135deg, oklch(0.13 0.018 240) 0%, oklch(0.16 0.04 60) 100%)"
                    : "linear-gradient(135deg, oklch(0.13 0.018 240) 0%, oklch(0.16 0.04 290) 100%)"
                : "oklch(0.11 0.015 240)",
            }}
          >
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10 rounded-full bg-[oklch(0.18_0.02_240)] border border-[oklch(1_0_0_/_12%)] flex items-center justify-center">
                <User className="w-5 h-5 text-[oklch(0.75_0.12_210)]" />
              </div>
              <div>
                <h2 className="font-bold text-base text-[oklch(0.95_0.02_210)] leading-tight">
                  {profile?.name || t.dashboard.title}
                </h2>
                {membership && tierStyle ? (
                  <Badge
                    className={`border text-[10px] px-1.5 py-0 h-4 mt-0.5 ${tierStyle.badge}`}
                  >
                    {tierStyle.icon} {tierStyle.label}
                  </Badge>
                ) : (
                  <span className="text-xs text-[oklch(0.5_0.02_210)]">
                    {t.dashboard.noMembership}
                  </span>
                )}
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-[oklch(1_0_0_/_8%)] text-[oklch(0.5_0.02_210)] hover:text-[oklch(0.9_0.02_210)] transition-colors"
              aria-label="Close dashboard"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Principal */}
          <div className="px-6 py-2 bg-[oklch(0.09_0.01_240)] border-b border-[oklch(1_0_0_/_6%)]">
            <p className="text-[10px] font-mono text-[oklch(0.4_0.02_210)] truncate">
              <span className="text-[oklch(0.45_0.04_210)] mr-1">
                {t.dashboard.principal}:
              </span>
              {principalStr}
            </p>
          </div>

          {/* Tabs Content */}
          <div className="flex-1 overflow-hidden">
            <Tabs defaultValue="overview" className="h-full flex flex-col">
              {/* Tab list — 6 tabs with compact sizing */}
              <TabsList className="flex mx-4 mt-3 mb-0 bg-[oklch(0.08_0.01_240)] border border-[oklch(1_0_0_/_8%)] flex-shrink-0 h-auto p-0.5 gap-0.5 overflow-x-auto">
                <TabsTrigger
                  value="overview"
                  className="flex-1 text-[9px] py-1.5 px-1 data-[state=active]:bg-[oklch(0.75_0.12_210)]/20 data-[state=active]:text-[oklch(0.75_0.12_210)] flex items-center justify-center gap-1 rounded-md whitespace-nowrap"
                >
                  <User className="w-3 h-3 flex-shrink-0" />
                  <span className="text-[9px]">Profile</span>
                </TabsTrigger>
                <TabsTrigger
                  value="configs"
                  className="flex-1 text-[9px] py-1.5 px-1 data-[state=active]:bg-[oklch(0.75_0.12_210)]/20 data-[state=active]:text-[oklch(0.75_0.12_210)] flex items-center justify-center gap-1 rounded-md whitespace-nowrap"
                >
                  <Settings className="w-3 h-3 flex-shrink-0" />
                  <span className="text-[9px]">Configs</span>
                </TabsTrigger>
                <TabsTrigger
                  value="chatbot"
                  className="flex-1 text-[9px] py-1.5 px-1 data-[state=active]:bg-[oklch(0.65_0.18_150)]/20 data-[state=active]:text-[oklch(0.75_0.15_150)] flex items-center justify-center gap-1 rounded-md whitespace-nowrap"
                >
                  <Bot className="w-3 h-3 flex-shrink-0" />
                  <span className="text-[9px]">Bot</span>
                </TabsTrigger>
                <TabsTrigger
                  value="ai"
                  className="flex-1 text-[9px] py-1.5 px-1 data-[state=active]:bg-[oklch(0.75_0.22_290)]/20 data-[state=active]:text-[oklch(0.80_0.18_290)] flex items-center justify-center gap-1 rounded-md whitespace-nowrap"
                >
                  <Sparkles className="w-3 h-3 flex-shrink-0" />
                  <span className="text-[9px]">AI</span>
                </TabsTrigger>
                <TabsTrigger
                  value="api"
                  className="flex-1 text-[9px] py-1.5 px-1 data-[state=active]:bg-[oklch(0.75_0.18_200)]/20 data-[state=active]:text-[oklch(0.78_0.15_200)] flex items-center justify-center gap-1 rounded-md whitespace-nowrap"
                >
                  <Terminal className="w-3 h-3 flex-shrink-0" />
                  <span className="text-[9px]">API</span>
                </TabsTrigger>
                <TabsTrigger
                  value="transactions"
                  className="flex-1 text-[9px] py-1.5 px-1 data-[state=active]:bg-[oklch(0.75_0.18_60)]/20 data-[state=active]:text-[oklch(0.80_0.15_60)] flex items-center justify-center gap-1 rounded-md whitespace-nowrap"
                >
                  <Receipt className="w-3 h-3 flex-shrink-0" />
                  <span className="text-[9px]">Txns</span>
                </TabsTrigger>
              </TabsList>

              <ScrollArea className="flex-1 mt-3">
                {/* Overview Tab */}
                <TabsContent
                  value="overview"
                  className="px-6 pb-6 mt-0 space-y-4"
                >
                  {/* Profile Edit Card */}
                  <div className="rounded-xl border border-[oklch(1_0_0_/_8%)] bg-[oklch(0.12_0.015_240)] p-4 space-y-4">
                    <h3 className="text-sm font-semibold text-[oklch(0.85_0.05_210)] flex items-center gap-2">
                      <User className="w-4 h-4 text-[oklch(0.65_0.12_210)]" />
                      Profile
                    </h3>
                    <div className="space-y-3">
                      <div className="space-y-1.5">
                        <Label className="text-xs text-[oklch(0.55_0.03_210)]">
                          {t.dashboard.profileName}
                        </Label>
                        <Input
                          value={profileName}
                          onChange={(e) => setProfileName(e.target.value)}
                          placeholder="Your display name..."
                          className="bg-[oklch(0.09_0.01_240)] border-[oklch(1_0_0_/_10%)] text-sm h-9 focus:border-[oklch(0.65_0.12_210)]/50"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs text-[oklch(0.55_0.03_210)]">
                          {t.dashboard.profileBio}
                        </Label>
                        <Textarea
                          value={profileBio}
                          onChange={(e) => setProfileBio(e.target.value)}
                          placeholder="Tell us about yourself..."
                          className="bg-[oklch(0.09_0.01_240)] border-[oklch(1_0_0_/_10%)] text-sm min-h-16 resize-none focus:border-[oklch(0.65_0.12_210)]/50"
                          rows={2}
                        />
                      </div>
                      <Button
                        onClick={handleSaveProfile}
                        disabled={saveProfile.isPending}
                        size="sm"
                        className="bg-[oklch(0.65_0.15_210)] hover:bg-[oklch(0.72_0.15_210)] text-white font-semibold h-8"
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
                  </div>

                  {/* Membership Card */}
                  <div className="rounded-xl border border-[oklch(1_0_0_/_8%)] bg-[oklch(0.12_0.015_240)] p-4">
                    <h3 className="text-sm font-semibold text-[oklch(0.85_0.05_210)] flex items-center gap-2 mb-3">
                      <Crown className="w-4 h-4 text-amber-400" />
                      {t.dashboard.membershipTier}
                    </h3>
                    {membership && tierStyle ? (
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-10 h-10 rounded-full flex items-center justify-center text-lg border ${tierStyle.badge}`}
                            >
                              {tierStyle.icon}
                            </div>
                            <div>
                              <p
                                className={`font-bold text-base ${tierStyle.badge.includes("slate") ? "text-slate-300" : tierStyle.badge.includes("amber") ? "text-amber-300" : "text-violet-300"}`}
                              >
                                {tierStyle.label}
                              </p>
                              <p className="text-[11px] text-[oklch(0.45_0.02_210)]">
                                {t.dashboard.memberSince}{" "}
                                {formatDate(membership.purchasedAt)}
                              </p>
                            </div>
                          </div>
                          <Badge
                            className={`border text-xs px-2 py-1 ${tierStyle.badge}`}
                          >
                            Active
                          </Badge>
                        </div>
                        {/* Token Balance Row */}
                        <div className="flex items-center justify-between px-3 py-2.5 rounded-lg bg-gradient-to-r from-amber-500/10 to-yellow-500/5 border border-amber-500/20">
                          <div className="flex items-center gap-2">
                            <Coins className="w-4 h-4 text-amber-400" />
                            <span className="text-xs font-medium text-[oklch(0.70_0.04_210)]">
                              Token Balance
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-sm text-amber-300">
                              {TIER_TOKENS[membership.tier].toLocaleString()}
                            </span>
                            <span className="text-[10px] text-amber-400/60">
                              tokens
                            </span>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-3 py-2">
                        <div className="w-10 h-10 rounded-full flex items-center justify-center bg-[oklch(0.15_0.01_240)] border border-[oklch(1_0_0_/_8%)] text-[oklch(0.4_0.02_210)]">
                          —
                        </div>
                        <div>
                          <p className="text-sm text-[oklch(0.5_0.02_210)]">
                            {t.dashboard.noMembership}
                          </p>
                          <button
                            type="button"
                            onClick={() => {
                              onClose();
                              setTimeout(() => {
                                document
                                  .querySelector("#pricing")
                                  ?.scrollIntoView({ behavior: "smooth" });
                              }, 300);
                            }}
                            className="text-xs text-[oklch(0.65_0.15_210)] hover:text-[oklch(0.75_0.15_210)] transition-colors flex items-center gap-1 mt-0.5"
                          >
                            View plans <ChevronRight className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </TabsContent>

                {/* Saved Configs Tab */}
                <TabsContent
                  value="configs"
                  className="px-6 pb-6 mt-0 space-y-2"
                >
                  {configs && configs.length > 0 ? (
                    configs.map((cfg) => (
                      <motion.div
                        key={cfg.id.toString()}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center gap-3 p-3 rounded-xl border border-[oklch(1_0_0_/_8%)] bg-[oklch(0.12_0.015_240)] group hover:border-[oklch(1_0_0_/_14%)] transition-all"
                      >
                        <div className="w-8 h-8 rounded-lg bg-[oklch(0.75_0.12_210)]/15 flex items-center justify-center flex-shrink-0">
                          <Settings className="w-4 h-4 text-[oklch(0.65_0.12_210)]" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-[oklch(0.88_0.04_210)] truncate">
                            {cfg.name}
                          </p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <Badge
                              variant="outline"
                              className="text-[10px] border-[oklch(1_0_0_/_12%)] text-[oklch(0.5_0.03_210)] px-1.5 py-0 h-4"
                            >
                              {cfg.os}
                            </Badge>
                            <span className="text-[10px] text-[oklch(0.4_0.02_210)]">
                              {formatDate(cfg.createdAt)}
                            </span>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleDeleteConfig(cfg.id)}
                          disabled={deleteConfig.isPending}
                          className="p-1.5 rounded-lg text-[oklch(0.4_0.02_210)] hover:text-destructive hover:bg-destructive/10 transition-colors opacity-0 group-hover:opacity-100 flex-shrink-0"
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
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <Settings className="w-10 h-10 text-[oklch(0.3_0.02_210)] mb-3" />
                      <p className="text-sm text-[oklch(0.45_0.02_210)]">
                        {t.dashboard.noConfigs}
                      </p>
                    </div>
                  )}
                </TabsContent>

                {/* Chatbot Setup Tab */}
                <TabsContent value="chatbot" className="px-6 pb-6 mt-0">
                  <ChatbotSetupTab
                    membership={membership ?? null}
                    onGoToPricing={() => {
                      onClose();
                      setTimeout(() => {
                        document
                          .querySelector("#pricing")
                          ?.scrollIntoView({ behavior: "smooth" });
                      }, 300);
                    }}
                  />
                </TabsContent>

                {/* AI Assistant Tab */}
                <TabsContent value="ai" className="px-6 pb-6 mt-0">
                  <AIAssistantTab
                    membership={membership ?? null}
                    onGoToPricing={() => {
                      onClose();
                      setTimeout(() => {
                        document
                          .querySelector("#pricing")
                          ?.scrollIntoView({ behavior: "smooth" });
                      }, 300);
                    }}
                  />
                </TabsContent>

                {/* API Explorer Tab */}
                <TabsContent value="api" className="px-6 pb-6 mt-0">
                  <APIExplorerTab
                    membership={membership ?? null}
                    onGoToPricing={() => {
                      onClose();
                      setTimeout(() => {
                        document
                          .querySelector("#pricing")
                          ?.scrollIntoView({ behavior: "smooth" });
                      }, 300);
                    }}
                  />
                </TabsContent>

                {/* Transactions Tab */}
                <TabsContent value="transactions" className="px-6 pb-6 mt-0">
                  <TransactionsTab membership={membership ?? null} />
                </TabsContent>
              </ScrollArea>
            </Tabs>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// ---- Transactions Sub-component ----

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
      // Auto-populate with current membership purchase
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
    <div className="space-y-4">
      {/* Token Balance Summary Card */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="relative rounded-xl overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, oklch(0.22 0.08 60) 0%, oklch(0.18 0.06 50) 50%, oklch(0.14 0.04 45) 100%)",
          boxShadow:
            "0 4px 24px oklch(0.7 0.18 60 / 20%), inset 0 1px 0 oklch(1 0 0 / 15%)",
        }}
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,oklch(0.8_0.20_60_/_12%),transparent_60%)]" />
        <div className="relative p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-amber-400/20 border border-amber-400/30 flex items-center justify-center">
                <Coins className="w-4 h-4 text-amber-300" />
              </div>
              <div>
                <p className="text-[10px] font-semibold text-amber-300/70 uppercase tracking-wider">
                  Token Balance
                </p>
                <p className="text-[9px] text-amber-200/50">$1 = 100 tokens</p>
              </div>
            </div>
            <div className="text-right">
              <p
                className="font-black text-2xl text-amber-200 leading-none"
                style={{ textShadow: "0 0 20px oklch(0.8 0.18 60 / 60%)" }}
              >
                {totalTokens.toLocaleString()}
              </p>
              <p className="text-[10px] text-amber-300/60 mt-0.5">
                total tokens
              </p>
            </div>
          </div>
          <div className="flex items-center justify-between pt-2 border-t border-amber-400/15">
            <span className="text-[11px] text-amber-200/60">Total spent</span>
            <span className="text-xs font-semibold text-amber-200">
              ${totalSpent.toFixed(2)}
            </span>
          </div>
        </div>
      </motion.div>

      {/* Transaction History */}
      <div className="rounded-xl border border-[oklch(1_0_0_/_8%)] bg-[oklch(0.12_0.015_240)] overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-[oklch(1_0_0_/_6%)]">
          <h3 className="text-xs font-semibold text-[oklch(0.70_0.05_210)] flex items-center gap-2">
            <Receipt className="w-3.5 h-3.5 text-[oklch(0.65_0.12_60)]" />
            Transaction History
          </h3>
          <span className="text-[10px] text-[oklch(0.4_0.02_210)]">
            {transactions.length} record{transactions.length !== 1 ? "s" : ""}
          </span>
        </div>

        {transactions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-center px-6">
            <Receipt className="w-10 h-10 text-[oklch(0.3_0.02_210)] mb-3" />
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
                  {/* Date */}
                  <div className="w-16 flex-shrink-0">
                    <p className="text-[10px] text-[oklch(0.45_0.02_210)] leading-tight">
                      {formatTxDate(tx.date)}
                    </p>
                  </div>
                  {/* Tier Badge */}
                  <Badge
                    className={`border text-[10px] px-1.5 py-0 h-4 flex-shrink-0 ${tierBadge}`}
                  >
                    {tierName}
                  </Badge>
                  {/* Amount */}
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
                  {/* Payment Method */}
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded-md font-medium flex-shrink-0 ${pmStyle.bg} ${pmStyle.text}`}
                  >
                    {pmStyle.label}
                  </span>
                  {/* Status */}
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
      <div className="rounded-xl border border-[oklch(1_0_0_/_6%)] bg-[oklch(0.10_0.01_240)] p-3">
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

// ---- Chatbot Setup Sub-component ----

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

  // Sync config into form
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
      <div className="flex flex-col items-center justify-center py-10 text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-[oklch(0.65_0.18_150)]/10 border border-[oklch(0.65_0.18_150)]/20 flex items-center justify-center">
          <SiWhatsapp className="w-8 h-8 text-[oklch(0.65_0.18_150)]" />
        </div>
        <div>
          <h3 className="font-bold text-[oklch(0.85_0.05_210)] mb-1">
            {t.chatbot.lockedTitle}
          </h3>
          <p className="text-sm text-[oklch(0.5_0.02_210)] max-w-xs mx-auto">
            {t.chatbot.lockedDesc}
          </p>
        </div>
        <Button
          onClick={onGoToPricing}
          size="sm"
          className="bg-[oklch(0.65_0.18_150)] hover:bg-[oklch(0.72_0.18_150)] text-white font-semibold"
        >
          {t.chatbot.upgradeCta}
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 rounded-xl border border-[oklch(0.65_0.18_150)]/20 bg-[oklch(0.65_0.18_150)]/5">
        <div className="w-10 h-10 rounded-xl bg-[oklch(0.65_0.18_150)]/15 border border-[oklch(0.65_0.18_150)]/25 flex items-center justify-center flex-shrink-0">
          <SiWhatsapp className="w-5 h-5 text-[oklch(0.70_0.18_150)]" />
        </div>
        <div>
          <h3 className="font-bold text-sm text-[oklch(0.88_0.04_210)]">
            {t.chatbot.title}
          </h3>
          <p className="text-xs text-[oklch(0.5_0.02_210)] leading-relaxed">
            {t.chatbot.description}
          </p>
        </div>
      </div>

      {/* Current Status (if config exists) */}
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
                <CheckCircle2 className="w-3.5 h-3.5 text-[oklch(0.65_0.18_150)]" />
                <span className="text-[11px] text-[oklch(0.65_0.18_150)]">
                  {t.chatbot.active}
                </span>
              </>
            ) : (
              <>
                <XCircle className="w-3.5 h-3.5 text-[oklch(0.5_0.02_210)]" />
                <span className="text-[11px] text-[oklch(0.5_0.02_210)]">
                  {t.chatbot.inactive}
                </span>
              </>
            )}
          </div>
        </div>
      )}

      {/* Configuration Form */}
      <div className="rounded-xl border border-[oklch(1_0_0_/_8%)] bg-[oklch(0.12_0.015_240)] p-4 space-y-4">
        {/* Phone Number */}
        <div className="space-y-1.5">
          <Label className="text-xs text-[oklch(0.55_0.03_210)]">
            {t.chatbot.phoneLabel}
          </Label>
          <div className="flex gap-2">
            <Input
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder={t.chatbot.phonePlaceholder}
              type="tel"
              className="bg-[oklch(0.09_0.01_240)] border-[oklch(1_0_0_/_10%)] text-sm h-9 font-mono focus:border-[oklch(0.65_0.18_150)]/50"
            />
          </div>
          <p className="text-[10px] text-[oklch(0.4_0.02_210)]">
            Include country code, e.g. +62 for Indonesia, +1 for US
          </p>
        </div>

        {/* Enable Toggle */}
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
            className="data-[state=checked]:bg-[oklch(0.65_0.18_150)]"
          />
        </div>

        {/* Save Button */}
        <Button
          onClick={handleSave}
          disabled={saveChatbot.isPending}
          className="w-full bg-[oklch(0.55_0.18_150)] hover:bg-[oklch(0.62_0.18_150)] text-white font-semibold h-9 text-sm"
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

        {/* Delete Button */}
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
        <h4 className="text-xs font-semibold text-[oklch(0.60_0.05_210)] uppercase tracking-wider">
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
              <div className="w-5 h-5 rounded-full bg-[oklch(0.65_0.18_150)]/15 border border-[oklch(0.65_0.18_150)]/25 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-[10px] font-bold text-[oklch(0.65_0.18_150)]">
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
            "linear-gradient(135deg, oklch(0.52 0.18 150) 0%, oklch(0.45 0.20 145) 100%)",
          boxShadow:
            "0 4px 20px oklch(0.52 0.18 150 / 40%), 0 2px 8px oklch(0.52 0.18 150 / 25%)",
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

// ---- AI Assistant Sub-component ----

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
      "You are an OpenClaw hardware troubleshooting expert. Help diagnose and fix issues with claw mechanisms, servo calibration, and electronic components. Ask targeted diagnostic questions.",
  },
  {
    name: "Advanced Setup Guide",
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
      <div className="flex flex-col items-center justify-center py-10 text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-[oklch(0.75_0.22_290)]/10 border border-[oklch(0.75_0.22_290)]/20 flex items-center justify-center">
          <Sparkles className="w-8 h-8 text-[oklch(0.75_0.22_290)]" />
        </div>
        <div>
          <h3 className="font-bold text-[oklch(0.85_0.05_210)] mb-1">
            AI Assistant
          </h3>
          <p className="text-sm text-[oklch(0.5_0.02_210)] max-w-xs mx-auto">
            Upgrade to Silver or higher to access the GPT-4o powered AI
            assistant for OpenClaw configuration help.
          </p>
        </div>
        <Button
          onClick={onGoToPricing}
          size="sm"
          className="bg-[oklch(0.60_0.20_290)] hover:bg-[oklch(0.68_0.20_290)] text-white font-semibold"
        >
          <Lock className="w-3.5 h-3.5 mr-1.5" />
          Upgrade to Silver+
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3 p-3 rounded-xl border border-[oklch(0.75_0.22_290)]/20 bg-[oklch(0.75_0.22_290)]/5">
        <div className="w-9 h-9 rounded-xl bg-[oklch(0.75_0.22_290)]/15 border border-[oklch(0.75_0.22_290)]/25 flex items-center justify-center flex-shrink-0">
          <Sparkles className="w-4.5 h-4.5 text-[oklch(0.80_0.18_290)]" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-sm text-[oklch(0.88_0.04_210)]">
            AI Assistant
          </h3>
          <p className="text-xs text-[oklch(0.5_0.02_210)]">
            Powered by OpenAI · GPT-4o ready
          </p>
        </div>
        <Badge className="border text-[10px] px-1.5 py-0.5 bg-[oklch(0.75_0.22_290)]/15 text-[oklch(0.80_0.18_290)] border-[oklch(0.75_0.22_290)]/30 flex-shrink-0">
          Beta
        </Badge>
      </div>

      {/* API Key */}
      <div className="rounded-xl border border-[oklch(1_0_0_/_8%)] bg-[oklch(0.12_0.015_240)] p-4 space-y-3">
        <div className="space-y-1.5">
          <Label className="text-xs text-[oklch(0.55_0.03_210)]">
            OpenAI API Key
          </Label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Input
                type={showKey ? "text" : "password"}
                value={apiKey}
                onChange={(e) => saveApiKey(e.target.value)}
                placeholder="sk-..."
                className="bg-[oklch(0.09_0.01_240)] border-[oklch(1_0_0_/_10%)] text-sm h-9 font-mono pr-10 focus:border-[oklch(0.75_0.22_290)]/50"
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
          </div>
          <p className="text-[10px] text-[oklch(0.38_0.02_210)]">
            Your key is stored locally and never sent to our servers.
          </p>
        </div>

        {/* Model selector */}
        <div className="space-y-1.5">
          <Label className="text-xs text-[oklch(0.55_0.03_210)]">Model</Label>
          <Select value={model} onValueChange={setModel}>
            <SelectTrigger className="bg-[oklch(0.09_0.01_240)] border-[oklch(1_0_0_/_10%)] text-sm h-9">
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

        {/* System prompt */}
        <div className="space-y-1.5">
          <Label className="text-xs text-[oklch(0.55_0.03_210)]">
            System Prompt
          </Label>
          <Textarea
            value={systemPrompt}
            onChange={(e) => setSystemPrompt(e.target.value)}
            className="bg-[oklch(0.09_0.01_240)] border-[oklch(1_0_0_/_10%)] text-xs min-h-14 resize-none focus:border-[oklch(0.75_0.22_290)]/50 font-mono"
            rows={2}
          />
        </div>
      </div>

      {/* Platinum Presets */}
      {isPlatinum && (
        <div className="rounded-xl border border-[oklch(0.6_0.22_290)]/25 bg-[oklch(0.6_0.22_290)]/5 p-4 space-y-2">
          <div className="flex items-center gap-2 mb-2">
            <Crown className="w-3.5 h-3.5 text-[oklch(0.75_0.22_290)]" />
            <span className="text-xs font-semibold text-[oklch(0.75_0.22_290)]">
              Platinum: Custom AI Presets
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {PLATINUM_PRESETS.map((preset) => (
              <button
                key={preset.name}
                type="button"
                onClick={() => applyPreset(preset)}
                className="text-[10px] px-2.5 py-1.5 rounded-lg border border-[oklch(0.6_0.22_290)]/30 text-[oklch(0.75_0.22_290)] hover:bg-[oklch(0.6_0.22_290)]/15 transition-colors"
              >
                {preset.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Chat Messages */}
      <div className="rounded-xl border border-[oklch(1_0_0_/_8%)] bg-[oklch(0.09_0.01_240)] overflow-hidden">
        <div className="h-52 overflow-y-auto p-3 space-y-3">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-4">
              <Sparkles className="w-8 h-8 text-[oklch(0.35_0.05_290)] mb-2" />
              <p className="text-xs text-[oklch(0.4_0.02_210)]">
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
                      ? "bg-[oklch(0.65_0.12_210)]/20 text-[oklch(0.75_0.12_210)]"
                      : "bg-[oklch(0.75_0.22_290)]/20 text-[oklch(0.75_0.22_290)]"
                  }`}
                >
                  {msg.role === "user" ? "U" : "AI"}
                </div>
                <div
                  className={`max-w-[80%] rounded-xl px-3 py-2 text-xs leading-relaxed ${
                    msg.role === "user"
                      ? "bg-[oklch(0.65_0.12_210)]/15 text-[oklch(0.85_0.05_210)]"
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
              <div className="w-6 h-6 rounded-full bg-[oklch(0.75_0.22_290)]/20 text-[oklch(0.75_0.22_290)] flex items-center justify-center text-[10px] font-bold flex-shrink-0">
                AI
              </div>
              <div className="bg-[oklch(0.14_0.015_240)] border border-[oklch(1_0_0_/_6%)] rounded-xl px-3 py-2 flex items-center gap-2">
                <Loader2 className="w-3.5 h-3.5 animate-spin text-[oklch(0.75_0.22_290)]" />
                <span className="text-xs text-[oklch(0.45_0.02_210)]">
                  Thinking...
                </span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="border-t border-[oklch(1_0_0_/_8%)] p-3 flex gap-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about OpenClaw... (Enter to send)"
            className="bg-[oklch(0.12_0.015_240)] border-[oklch(1_0_0_/_10%)] text-xs min-h-8 max-h-24 resize-none focus:border-[oklch(0.75_0.22_290)]/50 flex-1"
            rows={1}
          />
          <Button
            onClick={sendMessage}
            disabled={isLoading || !input.trim()}
            size="sm"
            className="bg-[oklch(0.60_0.20_290)] hover:bg-[oklch(0.68_0.20_290)] text-white h-8 w-8 p-0 flex-shrink-0"
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
          className="w-full text-xs text-[oklch(0.4_0.02_210)] hover:text-[oklch(0.6_0.03_210)] h-7"
        >
          <Trash2 className="w-3 h-3 mr-1.5" />
          Clear conversation
        </Button>
      )}
    </div>
  );
}

// ---- API Explorer Sub-component ----

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

  // Locked state for non-members
  if (!membership) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-[oklch(0.75_0.18_200)]/10 border border-[oklch(0.75_0.18_200)]/20 flex items-center justify-center">
          <Terminal className="w-8 h-8 text-[oklch(0.75_0.18_200)]" />
        </div>
        <div>
          <h3 className="font-bold text-[oklch(0.85_0.05_210)] mb-1">
            API Explorer
          </h3>
          <p className="text-sm text-[oklch(0.5_0.02_210)] max-w-xs mx-auto">
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

  // Silver locked state
  if (isSilver) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-[oklch(0.75_0.18_200)]/10 border border-[oklch(0.75_0.18_200)]/20 flex items-center justify-center">
          <Lock className="w-8 h-8 text-[oklch(0.75_0.18_200)]" />
        </div>
        <div>
          <h3 className="font-bold text-[oklch(0.85_0.05_210)] mb-1">
            Gold+ Feature
          </h3>
          <p className="text-sm text-[oklch(0.5_0.02_210)] max-w-xs mx-auto">
            The API Explorer is available for Gold and Platinum members. Upgrade
            to unlock interactive REST API testing.
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
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3 p-3 rounded-xl border border-[oklch(0.75_0.18_200)]/20 bg-[oklch(0.75_0.18_200)]/5">
        <div className="w-9 h-9 rounded-xl bg-[oklch(0.75_0.18_200)]/15 border border-[oklch(0.75_0.18_200)]/25 flex items-center justify-center flex-shrink-0">
          <Terminal className="w-4.5 h-4.5 text-[oklch(0.78_0.15_200)]" />
        </div>
        <div>
          <h3 className="font-bold text-sm text-[oklch(0.88_0.04_210)]">
            API Explorer
          </h3>
          <p className="text-xs text-[oklch(0.5_0.02_210)]">
            OpenClaw REST API · Interactive tester
          </p>
        </div>
      </div>

      {/* Config */}
      <div className="rounded-xl border border-[oklch(1_0_0_/_8%)] bg-[oklch(0.12_0.015_240)] p-4 space-y-3">
        <div className="space-y-1.5">
          <Label className="text-xs text-[oklch(0.55_0.03_210)]">
            Base URL
          </Label>
          <Input
            value={baseUrl}
            onChange={(e) => setBaseUrl(e.target.value)}
            placeholder="https://api.openclaw.ai/v1"
            className="bg-[oklch(0.09_0.01_240)] border-[oklch(1_0_0_/_10%)] text-xs h-9 font-mono focus:border-[oklch(0.75_0.18_200)]/50"
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
              className="bg-[oklch(0.09_0.01_240)] border-[oklch(1_0_0_/_10%)] text-xs h-9 font-mono pr-10 focus:border-[oklch(0.75_0.18_200)]/50"
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
          <SelectTrigger className="bg-[oklch(0.12_0.015_240)] border-[oklch(1_0_0_/_10%)] text-xs h-9">
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
            className="bg-[oklch(0.09_0.01_240)] border-[oklch(1_0_0_/_10%)] text-xs min-h-20 resize-none focus:border-[oklch(0.75_0.18_200)]/50 font-mono"
            rows={4}
          />
        </div>
      )}

      {/* Send Button */}
      <Button
        onClick={sendRequest}
        disabled={isLoading}
        className="w-full bg-[oklch(0.55_0.18_200)] hover:bg-[oklch(0.62_0.18_200)] text-white font-semibold h-9 text-sm"
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
              className="text-[10px] text-[oklch(0.4_0.02_210)] hover:text-destructive transition-colors"
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
