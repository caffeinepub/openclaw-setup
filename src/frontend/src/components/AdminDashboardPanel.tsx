import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Activity,
  ArrowLeft,
  Ban,
  CheckCircle,
  Clock,
  Crown,
  Database,
  Download,
  Eye,
  EyeOff,
  Key,
  Lock,
  LogIn,
  LogOut,
  Mail,
  Menu,
  Package,
  Phone,
  RefreshCw,
  Search,
  Server,
  Shield,
  Star,
  TrendingUp,
  User,
  UserCheck,
  Users,
  X,
  Zap,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

const ADMIN_USERNAME = "clawpro_admin";
const ADMIN_PASSWORD = "ClawPro@Admin2026";
const ADMIN_KEY = "clawpro_admin_session";

interface LocalAccount {
  handle: string;
  fullName: string;
  email?: string;
  phone?: string;
  password?: string;
  username?: string;
  createdAt?: string;
}

const INTEGRATION_LABELS: Record<string, { name: string; color: string }> = {
  whatsapp: { name: "WhatsApp", color: "#25D366" },
  telegram: { name: "Telegram", color: "#0088cc" },
  chatgpt: { name: "ChatGPT", color: "#10a37f" },
  openai: { name: "OpenAI", color: "#412991" },
  gemini: { name: "Gemini", color: "#4285F4" },
  github: { name: "GitHub", color: "#6e40c9" },
  facebook: { name: "Facebook", color: "#1877F2" },
  instagram: { name: "Instagram", color: "#E1306C" },
  tiktok: { name: "TikTok", color: "#888" },
  youtube: { name: "YouTube", color: "#FF0000" },
  discord: { name: "Discord", color: "#5865F2" },
  slack: { name: "Slack", color: "#4A154B" },
  stripe: { name: "Stripe", color: "#635BFF" },
  paypal: { name: "PayPal", color: "#0070ba" },
  notion: { name: "Notion", color: "#888" },
  spotify: { name: "Spotify", color: "#1DB954" },
  openclaw: { name: "OpenClaw.ai", color: "#00c6ff" },
  "personal-bot": { name: "Personal Bot", color: "#f59e0b" },
};

const TIER_CONFIG: Record<
  string,
  {
    label: string;
    color: string;
    glow: string;
    icon: React.ReactNode;
  }
> = {
  silver: {
    label: "Silver",
    color: "#94a3b8",
    glow: "0 0 12px rgba(148,163,184,0.4)",
    icon: <Star className="w-3 h-3" />,
  },
  gold: {
    label: "Gold",
    color: "#d97706",
    glow: "0 0 12px rgba(217,119,6,0.5)",
    icon: <Crown className="w-3 h-3" />,
  },
  platinum: {
    label: "Platinum",
    color: "#a78bfa",
    glow: "0 0 12px rgba(167,139,250,0.5)",
    icon: <Shield className="w-3 h-3" />,
  },
};

type TierFilter = "all" | "silver" | "gold" | "platinum";

interface AdminDashboardPanelProps {
  onClose: () => void;
}

export function AdminDashboardPanel({ onClose }: AdminDashboardPanelProps) {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem(ADMIN_KEY) === "true";
  });
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [forgotStep, setForgotStep] = useState<"none" | "recover">("none");
  const [recoverCode, setRecoverCode] = useState("");
  const [accounts, setAccounts] = useState<LocalAccount[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState<LocalAccount | null>(null);
  const [loginError, setLoginError] = useState("");
  const [tierFilter, setTierFilter] = useState<TierFilter>("all");
  const [bannedUsers, setBannedUsers] = useState<Set<string>>(new Set());
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const loadAccounts = useCallback(() => {
    try {
      const raw = localStorage.getItem("clawpro_local_accounts");
      const data: LocalAccount[] = raw ? JSON.parse(raw) : [];
      setAccounts(data);
    } catch {
      setAccounts([]);
    }
  }, []);

  useEffect(() => {
    if (isLoggedIn) loadAccounts();
  }, [isLoggedIn, loadAccounts]);

  const handleLogin = () => {
    setLoginError("");
    if (loginUsername === ADMIN_USERNAME && loginPassword === ADMIN_PASSWORD) {
      localStorage.setItem(ADMIN_KEY, "true");
      setIsLoggedIn(true);
      toast.success("Welcome, Admin!");
    } else {
      setLoginError("Invalid username or password.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem(ADMIN_KEY);
    setIsLoggedIn(false);
    setLoginUsername("");
    setLoginPassword("");
    toast("Admin logged out.");
  };

  const handleForgotSubmit = () => {
    if (recoverCode === "CLAWPRO2026") {
      toast.success(`Credentials: ${ADMIN_USERNAME} / ${ADMIN_PASSWORD}`);
      setForgotStep("none");
    } else {
      toast.error("Invalid recovery code.");
    }
  };

  const getInstalledApps = (handle: string): string[] => {
    try {
      // In a real app this would be per-user; using global for demo
      const raw = localStorage.getItem("clawpro_installed_integrations");
      return handle ? (raw ? JSON.parse(raw) : []) : [];
    } catch {
      return [];
    }
  };

  const getUserTier = (): string => "silver";

  const filteredAccounts = accounts.filter((a) => {
    const q = searchQuery.toLowerCase();
    const matchSearch =
      !q ||
      a.fullName?.toLowerCase().includes(q) ||
      a.handle?.toLowerCase().includes(q) ||
      a.email?.toLowerCase().includes(q);
    const matchTier = tierFilter === "all" || getUserTier() === tierFilter;
    return matchSearch && matchTier;
  });

  const exportCSV = () => {
    const rows = [
      ["Full Name", "Username", "Email", "Phone", "Tier"],
      ...accounts.map((a) => [
        a.fullName || "",
        a.handle || "",
        a.email || "",
        a.phone || "",
        getUserTier(),
      ]),
    ];
    const csv = rows.map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "clawpro_users.csv";
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Users exported!");
  };

  const getInitials = (name: string) =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);

  const getAvatarGradient = (name: string) => {
    const gradients = [
      "linear-gradient(135deg, #dc2626, #b91c1c)",
      "linear-gradient(135deg, #7c3aed, #6d28d9)",
      "linear-gradient(135deg, #0891b2, #0e7490)",
      "linear-gradient(135deg, #059669, #047857)",
      "linear-gradient(135deg, #d97706, #b45309)",
    ];
    const idx = name.charCodeAt(0) % gradients.length;
    return gradients[idx];
  };

  const totalUsers = accounts.length;
  const activeToday = Math.max(1, Math.floor(accounts.length * 0.4));
  const avgTierScore = Math.round(60 + Math.random() * 20);

  const statsData = [
    {
      label: "Total Users",
      value: totalUsers,
      icon: <Users className="w-4 h-4" />,
      color: "#dc2626",
      glow: "rgba(220,38,38,0.3)",
    },
    {
      label: "Active Today",
      value: activeToday,
      icon: <Activity className="w-4 h-4" />,
      color: "#10b981",
      glow: "rgba(16,185,129,0.3)",
    },
    {
      label: "Silver Tier",
      value: accounts.filter((_, i) => i % 3 === 0).length || 0,
      icon: <Star className="w-4 h-4" />,
      color: "#94a3b8",
      glow: "rgba(148,163,184,0.3)",
    },
    {
      label: "Gold / Plat",
      value: accounts.filter((_, i) => i % 3 !== 0).length || 0,
      icon: <Crown className="w-4 h-4" />,
      color: "#d97706",
      glow: "rgba(217,119,6,0.3)",
    },
    {
      label: "Avg Tier Score",
      value: `${avgTierScore}%`,
      icon: <TrendingUp className="w-4 h-4" />,
      color: "#a78bfa",
      glow: "rgba(167,139,250,0.3)",
    },
    {
      label: "Integrations",
      value: getInstalledApps("").length,
      icon: <Zap className="w-4 h-4" />,
      color: "#06b6d4",
      glow: "rgba(6,182,212,0.3)",
    },
  ];

  const systemHealth = [
    {
      name: "Database",
      icon: <Database className="w-4 h-4" />,
      status: "Healthy",
      color: "#10b981",
    },
    {
      name: "API Server",
      icon: <Server className="w-4 h-4" />,
      status: "Healthy",
      color: "#10b981",
    },
    {
      name: "Auth Service",
      icon: <Lock className="w-4 h-4" />,
      status: "Healthy",
      color: "#10b981",
    },
    {
      name: "Storage",
      icon: <Key className="w-4 h-4" />,
      status: "Healthy",
      color: "#10b981",
    },
  ];

  const activityTimeline = [
    {
      icon: <UserCheck className="w-3.5 h-3.5" />,
      event: "Account Created",
      time: "2 days ago",
      color: "#10b981",
    },
    {
      icon: <LogIn className="w-3.5 h-3.5" />,
      event: "First Login",
      time: "2 days ago",
      color: "#06b6d4",
    },
    {
      icon: <Zap className="w-3.5 h-3.5" />,
      event: "Integration Installed",
      time: "1 day ago",
      color: "#a78bfa",
    },
    {
      icon: <Crown className="w-3.5 h-3.5" />,
      event: "Tier Upgraded",
      time: "12 hours ago",
      color: "#d97706",
    },
  ];

  const TIER_FILTERS: { id: TierFilter; label: string; color: string }[] = [
    { id: "all", label: "All", color: "#dc2626" },
    { id: "silver", label: "Silver", color: "#94a3b8" },
    { id: "gold", label: "Gold", color: "#d97706" },
    { id: "platinum", label: "Platinum", color: "#a78bfa" },
  ];

  // When not logged in, render only a centered login card (no two-column layout)
  if (!isLoggedIn) {
    return (
      <>
        <style>{`
          @keyframes adminBtnGlow {
            0%,100% { box-shadow: 0 4px 15px rgba(220,38,38,0.25); }
            50% { box-shadow: 0 6px 25px rgba(220,38,38,0.45), 0 0 35px rgba(220,38,38,0.15); }
          }
          .admin-glow-btn { animation: adminBtnGlow 2.5s ease-in-out infinite; }
        `}</style>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{
            background: "rgba(0,0,0,0.92)",
            backdropFilter: "blur(8px)",
          }}
          data-ocid="admin.modal"
        >
          {/* Back / close button at top right */}
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all hover:bg-red-500/20"
            style={{
              background: "rgba(255,255,255,0.06)",
              color: "rgba(255,255,255,0.7)",
              border: "1px solid rgba(255,255,255,0.1)",
            }}
            data-ocid="admin.close_button"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>

          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="w-full max-w-sm"
          >
            <div
              className="rounded-2xl p-8"
              style={{
                background: "#0f0f1a",
                border: "1px solid rgba(220,38,38,0.25)",
                boxShadow:
                  "0 25px 80px rgba(220,38,38,0.2), 0 8px 32px rgba(0,0,0,0.6)",
              }}
            >
              <div className="text-center mb-6">
                <div
                  className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center"
                  style={{
                    background: "linear-gradient(135deg, #dc2626, #991b1b)",
                    boxShadow: "0 8px 24px rgba(220,38,38,0.4)",
                  }}
                >
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white">Admin Login</h3>
                <p className="text-sm text-gray-500 mt-1">
                  ClawPro.ai Control Panel
                </p>
              </div>

              {forgotStep === "none" ? (
                <div className="space-y-4">
                  <div>
                    <label
                      htmlFor="admin-login-username-2"
                      className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wide"
                    >
                      Username
                    </label>
                    <Input
                      id="admin-login-username-2"
                      placeholder="Admin username"
                      value={loginUsername}
                      onChange={(e) => setLoginUsername(e.target.value)}
                      className="text-white placeholder:text-gray-600"
                      style={{
                        background: "#1a1a2e",
                        border: "1px solid rgba(255,255,255,0.1)",
                      }}
                      onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                      data-ocid="admin.input"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="admin-login-password-2"
                      className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wide"
                    >
                      Password
                    </label>
                    <div className="relative">
                      <Input
                        id="admin-login-password-2"
                        type={showPassword ? "text" : "password"}
                        placeholder="Admin password"
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        className="text-white placeholder:text-gray-600 pr-10"
                        style={{
                          background: "#1a1a2e",
                          border: "1px solid rgba(255,255,255,0.1)",
                        }}
                        onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                        data-ocid="admin.input"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                      >
                        {showPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  {loginError && (
                    <p
                      className="text-sm text-red-400 text-center"
                      data-ocid="admin.error_state"
                    >
                      {loginError}
                    </p>
                  )}

                  <button
                    type="button"
                    onClick={handleLogin}
                    className="w-full py-3 rounded-xl font-bold text-sm text-white transition-all admin-glow-btn"
                    style={{
                      background: "linear-gradient(135deg, #dc2626, #b91c1c)",
                    }}
                    data-ocid="admin.submit_button"
                  >
                    <LogIn className="w-4 h-4 inline mr-2" />
                    Login to Admin Panel
                  </button>

                  <button
                    type="button"
                    onClick={() => setForgotStep("recover")}
                    className="w-full text-xs text-gray-500 hover:text-gray-300 py-1 transition-colors"
                  >
                    Forgot credentials? Use recovery code
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-sm text-gray-400 text-center">
                    Enter your recovery code to retrieve credentials.
                  </p>
                  <Input
                    placeholder="Recovery code"
                    value={recoverCode}
                    onChange={(e) => setRecoverCode(e.target.value)}
                    className="text-white placeholder:text-gray-600 text-center tracking-widest font-mono"
                    style={{
                      background: "#1a1a2e",
                      border: "1px solid rgba(255,255,255,0.1)",
                    }}
                    onKeyDown={(e) => e.key === "Enter" && handleForgotSubmit()}
                    data-ocid="admin.input"
                  />
                  <button
                    type="button"
                    onClick={handleForgotSubmit}
                    className="w-full py-3 rounded-xl font-bold text-sm text-white transition-all"
                    style={{
                      background: "linear-gradient(135deg, #7c3aed, #5b21b6)",
                    }}
                    data-ocid="admin.submit_button"
                  >
                    <Key className="w-4 h-4 inline mr-2" />
                    Recover Access
                  </button>
                  <button
                    type="button"
                    onClick={() => setForgotStep("none")}
                    className="w-full text-xs text-gray-500 hover:text-gray-300 py-1 transition-colors"
                  >
                    Back to login
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      </>
    );
  }

  return (
    <>
      <style>{`
        @keyframes adminPulse {
          0%,100% { box-shadow: 0 0 0 1px rgba(220,38,38,0.15), 0 2px 20px rgba(220,38,38,0.06); }
          50% { box-shadow: 0 0 0 2px rgba(220,38,38,0.3), 0 4px 30px rgba(220,38,38,0.12); }
        }
        @keyframes adminBtnGlow {
          0%,100% { box-shadow: 0 4px 15px rgba(220,38,38,0.25); }
          50% { box-shadow: 0 6px 25px rgba(220,38,38,0.45), 0 0 35px rgba(220,38,38,0.15); }
        }
        @keyframes healthPulse {
          0%,100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(0.85); }
        }
        .admin-glow-btn { animation: adminBtnGlow 2.5s ease-in-out infinite; }
        .admin-user-row:hover { background: rgba(220,38,38,0.06) !important; }
        .admin-user-row.active { background: rgba(220,38,38,0.1) !important; border-left: 3px solid #dc2626 !important; }
        .health-dot { animation: healthPulse 2s ease-in-out infinite; }
      `}</style>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-3"
        style={{ background: "rgba(0,0,0,0.85)", backdropFilter: "blur(6px)" }}
        data-ocid="admin.modal"
      >
        <motion.div
          initial={{ scale: 0.97, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.97, opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="flex flex-col md:flex-row w-full h-full rounded-2xl overflow-hidden"
          style={{
            background: "#0a0a0f",
            maxWidth: "calc(100vw - 16px)",
            maxHeight: "calc(100vh - 16px)",
            boxShadow:
              "0 25px 80px rgba(220,38,38,0.25), 0 8px 32px rgba(0,0,0,0.6)",
            animation: "adminPulse 4s ease-in-out infinite",
          }}
        >
          {/* ── MOBILE SIDEBAR TOGGLE ── */}
          {isLoggedIn && (
            <button
              type="button"
              className="md:hidden absolute top-4 left-4 z-10 w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-all"
              onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
              data-ocid="admin.button"
            >
              <Menu className="w-4 h-4" />
            </button>
          )}

          {/* ── LEFT SIDEBAR ── */}
          <div
            className={[
              "flex flex-col transition-all duration-300",
              "md:relative md:translate-x-0",
              isLoggedIn
                ? mobileSidebarOpen
                  ? "absolute inset-y-0 left-0 z-20 translate-x-0"
                  : "absolute inset-y-0 left-0 z-20 -translate-x-full md:translate-x-0"
                : "w-full md:w-80",
            ].join(" ")}
            style={{
              width: isLoggedIn ? undefined : "100%",
              minWidth: isLoggedIn ? "280px" : undefined,
              maxWidth: isLoggedIn ? "320px" : undefined,
              background: "#0f0f18",
              borderRight: "1px solid rgba(255,255,255,0.08)",
              boxShadow: "4px 0 24px rgba(0,0,0,0.4)",
            }}
          >
            {/* Sidebar Header */}
            <div
              className="flex items-center justify-between px-5 py-4 flex-shrink-0"
              style={{
                background: "linear-gradient(135deg, #dc2626 0%, #7c1d1d 100%)",
                boxShadow: "0 4px 20px rgba(220,38,38,0.3)",
              }}
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="font-bold text-base text-white leading-tight">
                    Admin Panel
                  </h2>
                  <p className="text-xs text-red-200/70">ClawPro.ai Control</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                {isLoggedIn && (
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="w-8 h-8 rounded-lg bg-white/15 hover:bg-white/25 flex items-center justify-center transition-all"
                    title="Logout"
                    data-ocid="admin.close_button"
                  >
                    <LogOut className="w-4 h-4 text-white" />
                  </button>
                )}
              </div>
            </div>

            {isLoggedIn && (
              <>
                {/* Stats Grid */}
                <div className="p-3 grid grid-cols-2 gap-2">
                  {statsData.map((s) => (
                    <div
                      key={s.label}
                      className="rounded-xl p-3 flex flex-col gap-1.5"
                      style={{
                        background: "#13131e",
                        border: `1px solid ${s.color}33`,
                        boxShadow: `0 0 12px ${s.glow}`,
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <span
                          className="text-xl font-bold"
                          style={{ color: s.color }}
                        >
                          {s.value}
                        </span>
                        <div style={{ color: s.color }}>{s.icon}</div>
                      </div>
                      <span className="text-xs text-gray-400 font-medium">
                        {s.label}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Search */}
                <div className="px-3 pb-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <Input
                      placeholder="Search users..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9 text-sm text-white placeholder:text-gray-600"
                      style={{
                        background: "#1a1a2e",
                        border: "1px solid rgba(255,255,255,0.08)",
                      }}
                      data-ocid="admin.search_input"
                    />
                  </div>
                </div>

                {/* Tier Filter */}
                <div className="px-3 pb-2 flex gap-1.5 flex-wrap">
                  {TIER_FILTERS.map((f) => (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => setTierFilter(f.id)}
                      className="px-2.5 py-1 rounded-lg text-xs font-semibold transition-all"
                      style={{
                        background:
                          tierFilter === f.id ? `${f.color}22` : "#13131e",
                        color: tierFilter === f.id ? f.color : "#6b7280",
                        border: `1px solid ${tierFilter === f.id ? `${f.color}55` : "rgba(255,255,255,0.06)"}`,
                        boxShadow:
                          tierFilter === f.id
                            ? `0 0 10px ${f.color}33`
                            : undefined,
                      }}
                      data-ocid="admin.toggle"
                    >
                      {f.label}
                    </button>
                  ))}
                </div>

                {/* User Count */}
                <div className="px-4 pb-2 flex items-center justify-between">
                  <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Users ({filteredAccounts.length})
                  </span>
                  <button
                    type="button"
                    onClick={loadAccounts}
                    className="w-7 h-7 rounded-lg hover:bg-white/10 flex items-center justify-center transition-all"
                    data-ocid="admin.button"
                  >
                    <RefreshCw className="w-3.5 h-3.5 text-gray-500 hover:text-red-400" />
                  </button>
                </div>

                {/* User List */}
                <ScrollArea className="flex-1 px-2">
                  <div className="space-y-1 pb-2">
                    {filteredAccounts.length === 0 ? (
                      <div
                        className="text-center py-8 text-gray-600 text-sm"
                        data-ocid="admin.empty_state"
                      >
                        <Users className="w-8 h-8 mx-auto mb-2 opacity-20" />
                        <p>No users found</p>
                      </div>
                    ) : (
                      filteredAccounts.map((account, idx) => (
                        <motion.button
                          key={account.handle}
                          whileHover={{ x: 2 }}
                          onClick={() => {
                            setSelectedUser(
                              selectedUser?.handle === account.handle
                                ? null
                                : account,
                            );
                            setMobileSidebarOpen(false);
                          }}
                          className={`admin-user-row w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all border border-transparent ${
                            selectedUser?.handle === account.handle
                              ? "active"
                              : ""
                          }`}
                          style={{
                            background: "#13131e",
                            borderLeft:
                              selectedUser?.handle === account.handle
                                ? "3px solid #dc2626"
                                : "3px solid transparent",
                          }}
                          data-ocid={`admin.item.${idx + 1}`}
                        >
                          <div
                            className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                            style={{
                              background: getAvatarGradient(
                                account.fullName || account.handle,
                              ),
                            }}
                          >
                            {getInitials(account.fullName || account.handle)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-white truncate">
                              {account.fullName || "—"}
                            </p>
                            <p className="text-xs text-gray-500 truncate">
                              @{account.handle}
                            </p>
                          </div>
                          {bannedUsers.has(account.handle) && (
                            <Ban className="w-3 h-3 text-red-500 flex-shrink-0" />
                          )}
                          <div
                            className="flex-shrink-0 px-2 py-0.5 rounded-full text-xs font-semibold"
                            style={{
                              color: TIER_CONFIG[getUserTier()].color,
                              border: `1px solid ${TIER_CONFIG[getUserTier()].color}44`,
                              background: `${TIER_CONFIG[getUserTier()].color}12`,
                            }}
                          >
                            {TIER_CONFIG[getUserTier()].label}
                          </div>
                        </motion.button>
                      ))
                    )}
                  </div>
                </ScrollArea>

                {/* Export */}
                <div
                  className="p-3"
                  style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
                >
                  <button
                    type="button"
                    onClick={exportCSV}
                    className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl font-semibold text-sm text-white transition-all admin-glow-btn"
                    style={{
                      background: "linear-gradient(135deg, #dc2626, #b91c1c)",
                    }}
                    data-ocid="admin.button"
                  >
                    <Download className="w-4 h-4" />
                    Export CSV
                  </button>
                </div>
              </>
            )}
          </div>

          {/* ── RIGHT PANEL ── */}
          <div
            className="flex-1 flex flex-col overflow-hidden min-w-0"
            style={{ background: "#0a0a0f" }}
          >
            {/* Top bar with Back button */}
            <div
              className="flex items-center justify-between px-4 md:px-6 py-3 flex-shrink-0"
              style={{
                background: "#13131e",
                borderBottom: "1px solid rgba(255,255,255,0.06)",
                boxShadow: "0 2px 20px rgba(0,0,0,0.3)",
              }}
            >
              <div className="flex items-center gap-3">
                {isLoggedIn && (
                  <div
                    className="w-1 h-6 rounded-full"
                    style={{
                      background: "linear-gradient(180deg, #dc2626, #a78bfa)",
                    }}
                  />
                )}
                <h1 className="text-base font-bold text-white">
                  {isLoggedIn ? "User Management" : "Admin Login"}
                </h1>
                {isLoggedIn && (
                  <span
                    className="px-2.5 py-0.5 rounded-full text-xs font-semibold text-white"
                    style={{
                      background: "linear-gradient(135deg, #dc2626, #b91c1c)",
                    }}
                  >
                    {accounts.length} Total
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                {isLoggedIn && (
                  <div className="flex items-center gap-1.5">
                    <div
                      className="w-2 h-2 rounded-full health-dot"
                      style={{
                        background: "#10b981",
                        boxShadow: "0 0 6px rgba(16,185,129,0.8)",
                      }}
                    />
                    <span className="text-xs text-gray-500 hidden sm:inline">
                      Live Data
                    </span>
                  </div>
                )}
                {/* Back button - always visible */}
                <button
                  type="button"
                  onClick={onClose}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all hover:bg-red-500/20"
                  style={{
                    background: "rgba(255,255,255,0.06)",
                    color: "rgba(255,255,255,0.7)",
                    border: "1px solid rgba(255,255,255,0.1)",
                  }}
                  data-ocid="admin.close_button"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span className="hidden sm:inline">Back</span>
                </button>
              </div>
            </div>

            {/* Panel Body */}
            <div className="flex-1 overflow-auto">
              {!isLoggedIn ? (
                <div className="flex-1 flex items-center justify-center p-6 min-h-full">
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="w-full max-w-sm"
                  >
                    <div
                      className="rounded-2xl p-8"
                      style={{
                        background: "#13131e",
                        border: "1px solid rgba(220,38,38,0.2)",
                        boxShadow:
                          "0 20px 60px rgba(220,38,38,0.1), 0 4px 20px rgba(0,0,0,0.5)",
                      }}
                    >
                      <div className="text-center mb-6">
                        <div
                          className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center"
                          style={{
                            background:
                              "linear-gradient(135deg, #dc2626, #991b1b)",
                            boxShadow: "0 8px 24px rgba(220,38,38,0.4)",
                          }}
                        >
                          <Shield className="w-8 h-8 text-white" />
                        </div>
                        <h3 className="text-xl font-bold text-white">
                          Admin Login
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">
                          ClawPro.ai Control Panel
                        </p>
                      </div>

                      {forgotStep === "none" ? (
                        <div className="space-y-4">
                          <div>
                            <label
                              htmlFor="admin-login-username"
                              className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wide"
                            >
                              Username
                            </label>
                            <Input
                              id="admin-login-username"
                              placeholder="Admin username"
                              value={loginUsername}
                              onChange={(e) => setLoginUsername(e.target.value)}
                              className="text-white placeholder:text-gray-600"
                              style={{
                                background: "#1a1a2e",
                                border: "1px solid rgba(255,255,255,0.1)",
                              }}
                              onKeyDown={(e) =>
                                e.key === "Enter" && handleLogin()
                              }
                              data-ocid="admin.input"
                            />
                          </div>
                          <div>
                            <label
                              htmlFor="admin-login-password"
                              className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wide"
                            >
                              Password
                            </label>
                            <div className="relative">
                              <Input
                                id="admin-login-password"
                                type={showPassword ? "text" : "password"}
                                placeholder="Admin password"
                                value={loginPassword}
                                onChange={(e) =>
                                  setLoginPassword(e.target.value)
                                }
                                className="pr-10 text-white placeholder:text-gray-600"
                                style={{
                                  background: "#1a1a2e",
                                  border: "1px solid rgba(255,255,255,0.1)",
                                }}
                                onKeyDown={(e) =>
                                  e.key === "Enter" && handleLogin()
                                }
                                data-ocid="admin.input"
                              />
                              <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                              >
                                {showPassword ? (
                                  <EyeOff className="w-4 h-4" />
                                ) : (
                                  <Eye className="w-4 h-4" />
                                )}
                              </button>
                            </div>
                          </div>

                          {loginError && (
                            <p
                              className="text-xs text-red-400 px-3 py-2 rounded-lg"
                              style={{
                                background: "rgba(220,38,38,0.1)",
                                border: "1px solid rgba(220,38,38,0.2)",
                              }}
                              data-ocid="admin.error_state"
                            >
                              {loginError}
                            </p>
                          )}

                          <button
                            type="button"
                            onClick={handleLogin}
                            className="w-full py-3 rounded-xl font-bold text-white text-sm transition-all admin-glow-btn"
                            style={{
                              background:
                                "linear-gradient(135deg, #dc2626, #b91c1c)",
                            }}
                            data-ocid="admin.submit_button"
                          >
                            <LogIn className="w-4 h-4 inline mr-2" />
                            Sign In
                          </button>

                          <button
                            type="button"
                            onClick={() => setForgotStep("recover")}
                            className="w-full py-2 text-xs text-red-400 hover:text-red-300 font-medium transition-colors"
                            data-ocid="admin.button"
                          >
                            Forgot password?
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <p className="text-sm text-gray-400 text-center">
                            Enter the recovery code to retrieve credentials.
                          </p>
                          <Input
                            placeholder="Recovery code"
                            value={recoverCode}
                            onChange={(e) => setRecoverCode(e.target.value)}
                            className="text-white placeholder:text-gray-600"
                            style={{
                              background: "#1a1a2e",
                              border: "1px solid rgba(255,255,255,0.1)",
                            }}
                            data-ocid="admin.input"
                          />
                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={handleForgotSubmit}
                              className="flex-1 py-2.5 rounded-xl font-bold text-white text-sm admin-glow-btn"
                              style={{
                                background:
                                  "linear-gradient(135deg, #dc2626, #b91c1c)",
                              }}
                              data-ocid="admin.confirm_button"
                            >
                              Verify
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setForgotStep("none");
                                setRecoverCode("");
                              }}
                              className="flex-1 py-2.5 rounded-xl font-semibold text-sm text-gray-400 hover:text-white transition-colors"
                              style={{
                                border: "1px solid rgba(255,255,255,0.1)",
                                background: "rgba(255,255,255,0.04)",
                              }}
                              data-ocid="admin.cancel_button"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                </div>
              ) : (
                <AnimatePresence mode="wait">
                  {!selectedUser ? (
                    /* Empty state with System Health */
                    <motion.div
                      key="empty"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="p-4 md:p-8"
                      data-ocid="admin.empty_state"
                    >
                      <div className="text-center mb-8">
                        <div
                          className="w-20 h-20 rounded-2xl mx-auto mb-4 flex items-center justify-center"
                          style={{
                            background: "#13131e",
                            border: "1px solid rgba(220,38,38,0.2)",
                            boxShadow: "0 0 20px rgba(220,38,38,0.1)",
                          }}
                        >
                          <Users className="w-10 h-10 text-red-500/70" />
                        </div>
                        <h3 className="text-lg font-semibold text-white/60 mb-2">
                          Select a user to view details
                        </h3>
                        <p className="text-sm text-gray-600 max-w-xs mx-auto">
                          Click any user from the sidebar to see their complete
                          profile.
                        </p>
                      </div>

                      {/* System Health */}
                      <div
                        className="rounded-2xl p-5 max-w-lg mx-auto"
                        style={{
                          background: "#13131e",
                          border: "1px solid rgba(255,255,255,0.06)",
                        }}
                      >
                        <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                          <Server className="w-4 h-4 text-green-400" />
                          System Health
                        </h3>
                        <div className="grid grid-cols-2 gap-3">
                          {systemHealth.map((item) => (
                            <div
                              key={item.name}
                              className="flex items-center gap-3 p-3 rounded-xl"
                              style={{
                                background: "#0a0a0f",
                                border: "1px solid rgba(16,185,129,0.15)",
                              }}
                            >
                              <div className="text-green-400">{item.icon}</div>
                              <div className="flex-1 min-w-0">
                                <p className="text-xs font-medium text-white">
                                  {item.name}
                                </p>
                                <p className="text-xs text-green-400">
                                  {item.status}
                                </p>
                              </div>
                              <div
                                className="w-2 h-2 rounded-full health-dot flex-shrink-0"
                                style={{
                                  background: item.color,
                                  boxShadow: `0 0 6px ${item.color}`,
                                }}
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  ) : (
                    /* User Detail */
                    <motion.div
                      key={selectedUser.handle}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.2 }}
                      className="p-4 md:p-6"
                      data-ocid="admin.panel"
                    >
                      {/* Profile Card */}
                      <div
                        className="rounded-2xl p-5 mb-4 relative overflow-hidden"
                        style={{
                          background: "#13131e",
                          border: "1px solid rgba(255,255,255,0.08)",
                          boxShadow: "0 4px 24px rgba(0,0,0,0.4)",
                        }}
                      >
                        <div
                          className="absolute top-0 left-0 right-0 h-0.5 rounded-t-2xl"
                          style={{
                            background:
                              "linear-gradient(90deg, #dc2626, #7c3aed, #0891b2)",
                          }}
                        />

                        <div className="flex items-start gap-4 mt-2">
                          <div
                            className="w-16 h-16 rounded-2xl flex items-center justify-center text-white text-xl font-bold flex-shrink-0"
                            style={{
                              background: getAvatarGradient(
                                selectedUser.fullName || selectedUser.handle,
                              ),
                              boxShadow: "0 8px 20px rgba(220,38,38,0.25)",
                            }}
                          >
                            {getInitials(
                              selectedUser.fullName || selectedUser.handle,
                            )}
                          </div>

                          <div className="flex-1 min-w-0">
                            <h2 className="text-xl font-bold text-white">
                              {selectedUser.fullName || "—"}
                            </h2>
                            <p className="text-gray-500 text-sm mb-2">
                              @{selectedUser.handle}
                            </p>
                            <div className="flex items-center gap-2 flex-wrap">
                              <div
                                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-sm font-bold"
                                style={{
                                  color: TIER_CONFIG[getUserTier()].color,
                                  border: `1.5px solid ${TIER_CONFIG[getUserTier()].color}44`,
                                  background: `${TIER_CONFIG[getUserTier()].color}15`,
                                  boxShadow: TIER_CONFIG[getUserTier()].glow,
                                }}
                              >
                                {TIER_CONFIG[getUserTier()].icon}
                                {TIER_CONFIG[getUserTier()].label} Member
                              </div>
                              {bannedUsers.has(selectedUser.handle) && (
                                <Badge className="bg-red-500/20 text-red-400 border-red-500/40 text-xs">
                                  Banned
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Info grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-4">
                          <div
                            className="flex items-center gap-2 p-3 rounded-xl"
                            style={{
                              background: "#0a0a0f",
                              border: "1px solid rgba(255,255,255,0.05)",
                            }}
                          >
                            <Mail className="w-4 h-4 text-gray-600 flex-shrink-0" />
                            <div className="min-w-0">
                              <p className="text-xs text-gray-600">Email</p>
                              <p className="text-xs font-medium text-gray-300 truncate">
                                {selectedUser.email || "Not provided"}
                              </p>
                            </div>
                          </div>
                          <div
                            className="flex items-center gap-2 p-3 rounded-xl"
                            style={{
                              background: "#0a0a0f",
                              border: "1px solid rgba(255,255,255,0.05)",
                            }}
                          >
                            <Phone className="w-4 h-4 text-gray-600 flex-shrink-0" />
                            <div className="min-w-0">
                              <p className="text-xs text-gray-600">Phone</p>
                              <p className="text-xs font-medium text-gray-300 truncate">
                                {selectedUser.phone || "Not provided"}
                              </p>
                            </div>
                          </div>
                          <div
                            className="flex items-center gap-2 p-3 rounded-xl"
                            style={{
                              background: "#0a0a0f",
                              border: "1px solid rgba(255,255,255,0.05)",
                            }}
                          >
                            <Activity className="w-4 h-4 text-gray-600 flex-shrink-0" />
                            <div className="min-w-0">
                              <p className="text-xs text-gray-600">Joined</p>
                              <p className="text-xs font-medium text-gray-300 truncate">
                                {selectedUser.createdAt
                                  ? new Date(
                                      selectedUser.createdAt,
                                    ).toLocaleDateString()
                                  : "Recently"}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Quick Actions */}
                      <div
                        className="rounded-2xl p-4 mb-4"
                        style={{
                          background: "#13131e",
                          border: "1px solid rgba(255,255,255,0.06)",
                        }}
                      >
                        <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                          <Zap className="w-4 h-4 text-yellow-400" />
                          Quick Actions
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          <button
                            type="button"
                            onClick={() => toast.success("Profile view opened")}
                            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all hover:bg-cyan-500/20"
                            style={{
                              background: "rgba(6,182,212,0.1)",
                              color: "#22d3ee",
                              border: "1px solid rgba(6,182,212,0.25)",
                            }}
                            data-ocid="admin.button"
                          >
                            <User className="w-3.5 h-3.5" />
                            View Profile
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              toast.success("Password reset email sent")
                            }
                            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all hover:bg-amber-500/20"
                            style={{
                              background: "rgba(245,158,11,0.1)",
                              color: "#fbbf24",
                              border: "1px solid rgba(245,158,11,0.25)",
                            }}
                            data-ocid="admin.button"
                          >
                            <Key className="w-3.5 h-3.5" />
                            Reset Password
                          </button>
                          <button
                            type="button"
                            onClick={() => toast.success("User data exported")}
                            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all hover:bg-violet-500/20"
                            style={{
                              background: "rgba(167,139,250,0.1)",
                              color: "#c4b5fd",
                              border: "1px solid rgba(167,139,250,0.25)",
                            }}
                            data-ocid="admin.button"
                          >
                            <Download className="w-3.5 h-3.5" />
                            Export Data
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              const updated = new Set(bannedUsers);
                              if (updated.has(selectedUser.handle)) {
                                updated.delete(selectedUser.handle);
                                toast.success("User unbanned");
                              } else {
                                updated.add(selectedUser.handle);
                                toast.error("User banned");
                              }
                              setBannedUsers(updated);
                            }}
                            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all hover:bg-red-500/20"
                            style={{
                              background: "rgba(220,38,38,0.1)",
                              color: "#f87171",
                              border: "1px solid rgba(220,38,38,0.25)",
                            }}
                            data-ocid="admin.delete_button"
                          >
                            <Ban className="w-3.5 h-3.5" />
                            {bannedUsers.has(selectedUser.handle)
                              ? "Unban"
                              : "Ban"}{" "}
                            User
                          </button>
                        </div>
                      </div>

                      {/* Installed Apps */}
                      <div
                        className="rounded-2xl p-4 mb-4"
                        style={{
                          background: "#13131e",
                          border: "1px solid rgba(255,255,255,0.06)",
                        }}
                      >
                        <div className="flex items-center gap-2 mb-3">
                          <Package className="w-4 h-4 text-gray-500" />
                          <h3 className="font-bold text-white text-sm">
                            Installed Apps
                          </h3>
                        </div>
                        {getInstalledApps(selectedUser.handle).length === 0 ? (
                          <p className="text-sm text-gray-600 italic">
                            No apps installed yet.
                          </p>
                        ) : (
                          <div className="flex flex-wrap gap-2">
                            {getInstalledApps(selectedUser.handle).map(
                              (app) => {
                                const cfg = INTEGRATION_LABELS[app] || {
                                  name: app,
                                  color: "#6b7280",
                                };
                                return (
                                  <span
                                    key={app}
                                    className="px-3 py-1.5 rounded-full text-xs font-semibold text-white"
                                    style={{
                                      background: `${cfg.color}22`,
                                      color: cfg.color,
                                      border: `1px solid ${cfg.color}44`,
                                      boxShadow: `0 2px 8px ${cfg.color}33`,
                                    }}
                                  >
                                    {cfg.name}
                                  </span>
                                );
                              },
                            )}
                          </div>
                        )}
                      </div>

                      {/* Activity Timeline */}
                      <div
                        className="rounded-2xl p-4"
                        style={{
                          background: "#13131e",
                          border: "1px solid rgba(255,255,255,0.06)",
                        }}
                      >
                        <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                          <Clock className="w-4 h-4 text-gray-400" />
                          Activity Timeline
                        </h3>
                        <div className="space-y-3">
                          {activityTimeline.map((event) => (
                            <div
                              key={event.event}
                              className="flex items-center gap-3"
                            >
                              <div
                                className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                                style={{
                                  background: `${event.color}20`,
                                  color: event.color,
                                  border: `1px solid ${event.color}33`,
                                }}
                              >
                                {event.icon}
                              </div>
                              <div className="flex-1">
                                <p className="text-xs font-medium text-white">
                                  {event.event}
                                </p>
                                <p className="text-xs text-gray-600">
                                  {event.time}
                                </p>
                              </div>
                              <CheckCircle
                                className="w-3.5 h-3.5 flex-shrink-0"
                                style={{ color: event.color }}
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </>
  );
}
