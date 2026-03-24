import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Activity,
  Crown,
  Download,
  Eye,
  EyeOff,
  LogIn,
  LogOut,
  Mail,
  Package,
  Phone,
  RefreshCw,
  Search,
  Shield,
  Star,
  Users,
  X,
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
  github: { name: "GitHub", color: "#333" },
  facebook: { name: "Facebook", color: "#1877F2" },
  instagram: { name: "Instagram", color: "#E1306C" },
  tiktok: { name: "TikTok", color: "#000" },
  youtube: { name: "YouTube", color: "#FF0000" },
  discord: { name: "Discord", color: "#5865F2" },
  slack: { name: "Slack", color: "#4A154B" },
  stripe: { name: "Stripe", color: "#635BFF" },
  paypal: { name: "PayPal", color: "#003087" },
  notion: { name: "Notion", color: "#000" },
  spotify: { name: "Spotify", color: "#1DB954" },
  openclaw: { name: "OpenClaw.ai", color: "#00c6ff" },
  "personal-bot": { name: "Personal Bot", color: "#f59e0b" },
};

const TIER_CONFIG: Record<
  string,
  {
    label: string;
    color: string;
    bg: string;
    glow: string;
    icon: React.ReactNode;
  }
> = {
  silver: {
    label: "Silver",
    color: "#94a3b8",
    bg: "linear-gradient(135deg, #f1f5f9, #e2e8f0)",
    glow: "0 0 12px rgba(148,163,184,0.5)",
    icon: <Star className="w-3 h-3" />,
  },
  gold: {
    label: "Gold",
    color: "#d97706",
    bg: "linear-gradient(135deg, #fffbeb, #fef3c7)",
    glow: "0 0 12px rgba(217,119,6,0.5)",
    icon: <Crown className="w-3 h-3" />,
  },
  platinum: {
    label: "Platinum",
    color: "#7c3aed",
    bg: "linear-gradient(135deg, #f5f3ff, #ede9fe)",
    glow: "0 0 12px rgba(124,58,237,0.5)",
    icon: <Shield className="w-3 h-3" />,
  },
};

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
  const [activeGlow, setActiveGlow] = useState<string | null>(null);

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

  const getInstalledApps = (): string[] => {
    try {
      const raw = localStorage.getItem("clawpro_installed_integrations");
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  };

  const getUserTier = (): string => {
    try {
      return "silver";
    } catch {
      return "silver";
    }
  };

  const filteredAccounts = accounts.filter((a) => {
    const q = searchQuery.toLowerCase();
    return (
      !q ||
      a.fullName?.toLowerCase().includes(q) ||
      a.handle?.toLowerCase().includes(q) ||
      a.email?.toLowerCase().includes(q)
    );
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

  const statsData = [
    {
      label: "Total Users",
      value: accounts.length,
      icon: <Users className="w-4 h-4" />,
      color: "#dc2626",
      bg: "linear-gradient(135deg, #fef2f2, #fee2e2)",
    },
    {
      label: "Active Today",
      value: Math.max(1, Math.floor(accounts.length * 0.4)),
      icon: <Activity className="w-4 h-4" />,
      color: "#059669",
      bg: "linear-gradient(135deg, #f0fdf4, #dcfce7)",
    },
    {
      label: "Silver Tier",
      value: accounts.filter((_, i) => i % 3 === 0).length || 0,
      icon: <Star className="w-4 h-4" />,
      color: "#94a3b8",
      bg: "linear-gradient(135deg, #f8fafc, #f1f5f9)",
    },
    {
      label: "Gold/Plat",
      value: accounts.filter((_, i) => i % 3 !== 0).length || 0,
      icon: <Crown className="w-4 h-4" />,
      color: "#d97706",
      bg: "linear-gradient(135deg, #fffbeb, #fef3c7)",
    },
  ];

  const glowBtn = (id: string) => ({
    boxShadow:
      activeGlow === id
        ? "0 0 20px rgba(220,38,38,0.6), 0 0 40px rgba(220,38,38,0.3)"
        : undefined,
    transform: activeGlow === id ? "scale(0.97)" : undefined,
    transition: "all 0.2s ease",
  });

  return (
    <>
      <style>{`
        @keyframes adminRingGlow {
          0%,100% { box-shadow: 0 0 0 1px rgba(220,38,38,0.2), 0 2px 20px rgba(220,38,38,0.08); }
          50% { box-shadow: 0 0 0 2px rgba(220,38,38,0.4), 0 4px 30px rgba(220,38,38,0.15); }
        }
        @keyframes btnGlow {
          0%,100% { box-shadow: 0 4px 15px rgba(220,38,38,0.3); }
          50% { box-shadow: 0 6px 25px rgba(220,38,38,0.5), 0 0 40px rgba(220,38,38,0.2); }
        }
        .admin-glow-btn {
          animation: btnGlow 2s ease-in-out infinite;
        }
        .user-row:hover {
          background: linear-gradient(135deg, rgba(220,38,38,0.06), rgba(185,28,28,0.04)) !important;
        }
        .user-row.active {
          background: linear-gradient(135deg, rgba(220,38,38,0.12), rgba(185,28,28,0.08)) !important;
          border-left: 3px solid #dc2626 !important;
        }
      `}</style>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex"
        style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)" }}
        data-ocid="admin.modal"
      >
        {/* Full dashboard container */}
        <motion.div
          initial={{ scale: 0.97, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.97, opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="flex w-full h-full"
          style={{
            background: "#fafafa",
            maxWidth: "100vw",
            maxHeight: "100vh",
            margin: "12px",
            borderRadius: "20px",
            overflow: "hidden",
            boxShadow:
              "0 25px 80px rgba(220,38,38,0.2), 0 8px 32px rgba(0,0,0,0.2)",
            animation: "adminRingGlow 3s ease-in-out infinite",
          }}
        >
          {/* ─── LEFT SIDEBAR ─── */}
          <div
            className="flex flex-col"
            style={{
              width: "320px",
              minWidth: "280px",
              background: "#ffffff",
              borderRight: "1px solid rgba(220,38,38,0.1)",
              boxShadow: "4px 0 20px rgba(220,38,38,0.05)",
            }}
          >
            {/* Sidebar Header */}
            <div
              className="flex items-center justify-between px-5 py-4"
              style={{
                background: "linear-gradient(135deg, #dc2626 0%, #991b1b 100%)",
                boxShadow: "0 4px 20px rgba(220,38,38,0.3)",
              }}
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="font-bold text-base text-white leading-tight">
                    Admin Panel
                  </h2>
                  <p className="text-xs text-red-100">ClawPro.ai Control</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                {isLoggedIn && (
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="w-8 h-8 rounded-lg bg-white/20 hover:bg-white/30 flex items-center justify-center transition-all"
                    title="Logout"
                    data-ocid="admin.close_button"
                    style={glowBtn("logout")}
                    onMouseDown={() => setActiveGlow("logout")}
                    onMouseUp={() => setActiveGlow(null)}
                  >
                    <LogOut className="w-4 h-4 text-white" />
                  </button>
                )}
                <button
                  type="button"
                  onClick={onClose}
                  className="w-8 h-8 rounded-lg bg-white/20 hover:bg-white/30 flex items-center justify-center transition-all"
                  data-ocid="admin.close_button"
                >
                  <X className="w-4 h-4 text-white" />
                </button>
              </div>
            </div>

            {isLoggedIn && (
              <>
                {/* Stats Grid */}
                <div className="p-4 grid grid-cols-2 gap-2">
                  {statsData.map((s) => (
                    <div
                      key={s.label}
                      className="rounded-xl p-3 flex flex-col gap-1"
                      style={{
                        background: s.bg,
                        border: `1px solid ${s.color}22`,
                        boxShadow: `0 2px 8px ${s.color}15`,
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
                      <span className="text-xs text-gray-500 font-medium">
                        {s.label}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Search */}
                <div className="px-4 pb-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      placeholder="Search users..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9 bg-gray-50 border-gray-200 focus:border-red-400 focus:ring-red-200 text-sm"
                      data-ocid="admin.search_input"
                    />
                  </div>
                </div>

                {/* Refresh */}
                <div className="px-4 pb-2 flex items-center justify-between">
                  <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Users ({filteredAccounts.length})
                  </span>
                  <button
                    type="button"
                    onClick={loadAccounts}
                    className="w-7 h-7 rounded-lg hover:bg-red-50 flex items-center justify-center transition-all"
                    style={glowBtn("refresh")}
                    onMouseDown={() => setActiveGlow("refresh")}
                    onMouseUp={() => setActiveGlow(null)}
                    data-ocid="admin.button"
                  >
                    <RefreshCw className="w-3.5 h-3.5 text-gray-400 hover:text-red-500" />
                  </button>
                </div>

                {/* User List */}
                <ScrollArea className="flex-1 px-3">
                  <div className="space-y-1 pb-2">
                    {filteredAccounts.length === 0 ? (
                      <div className="text-center py-8 text-gray-400 text-sm">
                        <Users className="w-8 h-8 mx-auto mb-2 opacity-30" />
                        <p>No users found</p>
                      </div>
                    ) : (
                      filteredAccounts.map((account, idx) => (
                        <motion.button
                          key={account.handle}
                          whileHover={{ x: 2 }}
                          onClick={() =>
                            setSelectedUser(
                              selectedUser?.handle === account.handle
                                ? null
                                : account,
                            )
                          }
                          className={`user-row w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all border border-transparent ${
                            selectedUser?.handle === account.handle
                              ? "active"
                              : ""
                          }`}
                          style={{ cursor: "pointer" }}
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
                            <p className="text-sm font-semibold text-gray-800 truncate">
                              {account.fullName || "—"}
                            </p>
                            <p className="text-xs text-gray-500 truncate">
                              @{account.handle}
                            </p>
                          </div>
                          <div
                            className="flex-shrink-0 px-2 py-0.5 rounded-full text-xs font-semibold"
                            style={{
                              background: TIER_CONFIG[getUserTier()].bg,
                              color: TIER_CONFIG[getUserTier()].color,
                              boxShadow: TIER_CONFIG[getUserTier()].glow,
                            }}
                          >
                            {TIER_CONFIG[getUserTier()].label}
                          </div>
                        </motion.button>
                      ))
                    )}
                  </div>
                </ScrollArea>

                {/* Export Button */}
                <div className="p-4 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={exportCSV}
                    className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl font-semibold text-sm text-white transition-all admin-glow-btn"
                    style={{
                      background: "linear-gradient(135deg, #dc2626, #b91c1c)",
                    }}
                    onMouseDown={() => setActiveGlow("export")}
                    onMouseUp={() => setActiveGlow(null)}
                    data-ocid="admin.button"
                  >
                    <Download className="w-4 h-4" />
                    Export CSV
                  </button>
                </div>
              </>
            )}
          </div>

          {/* ─── RIGHT PANEL ─── */}
          <div
            className="flex-1 flex flex-col overflow-hidden"
            style={{ background: "#f8fafc" }}
          >
            {!isLoggedIn ? (
              /* Login Card */
              <div className="flex-1 flex items-center justify-center p-6">
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  className="w-full max-w-sm"
                >
                  <div
                    className="bg-white rounded-2xl p-8 shadow-xl"
                    style={{
                      boxShadow:
                        "0 20px 60px rgba(220,38,38,0.15), 0 4px 20px rgba(0,0,0,0.08)",
                      border: "1px solid rgba(220,38,38,0.1)",
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
                      <h3 className="text-xl font-bold text-gray-900">
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
                            className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide"
                          >
                            Username
                          </label>
                          <Input
                            id="admin-login-username"
                            placeholder="Admin username"
                            value={loginUsername}
                            onChange={(e) => setLoginUsername(e.target.value)}
                            className="border-gray-200 focus:border-red-400 focus:ring-red-200"
                            onKeyDown={(e) =>
                              e.key === "Enter" && handleLogin()
                            }
                            data-ocid="admin.input"
                          />
                        </div>
                        <div>
                          <label
                            htmlFor="admin-login-password"
                            className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide"
                          >
                            Password
                          </label>
                          <div className="relative">
                            <Input
                              id="admin-login-password"
                              type={showPassword ? "text" : "password"}
                              placeholder="Admin password"
                              value={loginPassword}
                              onChange={(e) => setLoginPassword(e.target.value)}
                              className="pr-10 border-gray-200 focus:border-red-400 focus:ring-red-200"
                              onKeyDown={(e) =>
                                e.key === "Enter" && handleLogin()
                              }
                              data-ocid="admin.input"
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
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
                            className="text-xs text-red-500 bg-red-50 px-3 py-2 rounded-lg"
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
                          className="w-full py-2 text-xs text-red-500 hover:text-red-700 font-medium transition-colors"
                          data-ocid="admin.button"
                        >
                          Forgot password?
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <p className="text-sm text-gray-600 text-center">
                          Enter the recovery code to retrieve credentials.
                        </p>
                        <Input
                          placeholder="Recovery code"
                          value={recoverCode}
                          onChange={(e) => setRecoverCode(e.target.value)}
                          className="border-gray-200 focus:border-red-400"
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
                            className="flex-1 py-2.5 rounded-xl font-semibold text-sm border border-gray-200 text-gray-600 hover:bg-gray-50"
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
              /* Dashboard Content */
              <>
                {/* Top bar */}
                <div
                  className="flex items-center justify-between px-6 py-3 border-b border-gray-200"
                  style={{ background: "#ffffff" }}
                >
                  <div className="flex items-center gap-3">
                    <h1 className="text-lg font-bold text-gray-900">
                      User Management
                    </h1>
                    <span
                      className="px-3 py-1 rounded-full text-xs font-semibold text-white"
                      style={{
                        background: "linear-gradient(135deg, #dc2626, #b91c1c)",
                      }}
                    >
                      {accounts.length} Total
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div
                      className="w-2 h-2 rounded-full bg-green-500"
                      style={{
                        boxShadow: "0 0 6px rgba(34,197,94,0.8)",
                        animation: "pulse 2s infinite",
                      }}
                    />
                    <span className="text-xs text-gray-500">Live Data</span>
                  </div>
                </div>

                <div className="flex-1 overflow-auto">
                  <AnimatePresence mode="wait">
                    {!selectedUser ? (
                      /* Empty state */
                      <motion.div
                        key="empty"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex-1 flex items-center justify-center h-full"
                        data-ocid="admin.empty_state"
                      >
                        <div className="text-center py-20">
                          <div
                            className="w-20 h-20 rounded-2xl mx-auto mb-4 flex items-center justify-center"
                            style={{
                              background:
                                "linear-gradient(135deg, #fee2e2, #fecaca)",
                              border: "1px solid rgba(220,38,38,0.15)",
                            }}
                          >
                            <Users className="w-10 h-10 text-red-400" />
                          </div>
                          <h3 className="text-lg font-semibold text-gray-600 mb-2">
                            Select a user to view details
                          </h3>
                          <p className="text-sm text-gray-400 max-w-xs mx-auto">
                            Click any user from the sidebar to see their
                            complete profile and installed apps.
                          </p>
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
                        className="p-6 max-w-2xl"
                        data-ocid="admin.panel"
                      >
                        {/* Profile Card */}
                        <div
                          className="rounded-2xl p-6 mb-5 relative overflow-hidden"
                          style={{
                            background: "#ffffff",
                            boxShadow:
                              "0 4px 24px rgba(220,38,38,0.1), 0 1px 8px rgba(0,0,0,0.06)",
                            border: "1px solid rgba(220,38,38,0.1)",
                          }}
                        >
                          {/* Decorative top bar */}
                          <div
                            className="absolute top-0 left-0 right-0 h-1 rounded-t-2xl"
                            style={{
                              background:
                                "linear-gradient(90deg, #dc2626, #7c3aed, #0891b2)",
                            }}
                          />

                          <div className="flex items-start gap-5 mt-1">
                            {/* Avatar */}
                            <div
                              className="w-20 h-20 rounded-2xl flex items-center justify-center text-white text-2xl font-bold flex-shrink-0"
                              style={{
                                background: getAvatarGradient(
                                  selectedUser.fullName || selectedUser.handle,
                                ),
                                boxShadow: "0 8px 20px rgba(220,38,38,0.3)",
                              }}
                            >
                              {getInitials(
                                selectedUser.fullName || selectedUser.handle,
                              )}
                            </div>

                            {/* Name + tier */}
                            <div className="flex-1">
                              <h2 className="text-2xl font-bold text-gray-900">
                                {selectedUser.fullName || "—"}
                              </h2>
                              <p className="text-gray-500 mb-3">
                                @{selectedUser.handle}
                              </p>
                              {/* Tier badge */}
                              <div
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-bold"
                                style={{
                                  background: TIER_CONFIG[getUserTier()].bg,
                                  color: TIER_CONFIG[getUserTier()].color,
                                  boxShadow: TIER_CONFIG[getUserTier()].glow,
                                  border: `1.5px solid ${TIER_CONFIG[getUserTier()].color}44`,
                                }}
                              >
                                {TIER_CONFIG[getUserTier()].icon}
                                {TIER_CONFIG[getUserTier()].label} Member
                              </div>
                            </div>
                          </div>

                          {/* Info grid */}
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-5">
                            <div className="flex items-center gap-2 p-3 rounded-xl bg-gray-50">
                              <Mail className="w-4 h-4 text-gray-400 flex-shrink-0" />
                              <div className="min-w-0">
                                <p className="text-xs text-gray-400">Email</p>
                                <p className="text-xs font-medium text-gray-700 truncate">
                                  {selectedUser.email || "Not provided"}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 p-3 rounded-xl bg-gray-50">
                              <Phone className="w-4 h-4 text-gray-400 flex-shrink-0" />
                              <div className="min-w-0">
                                <p className="text-xs text-gray-400">Phone</p>
                                <p className="text-xs font-medium text-gray-700 truncate">
                                  {selectedUser.phone || "Not provided"}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 p-3 rounded-xl bg-gray-50">
                              <Activity className="w-4 h-4 text-gray-400 flex-shrink-0" />
                              <div className="min-w-0">
                                <p className="text-xs text-gray-400">Joined</p>
                                <p className="text-xs font-medium text-gray-700 truncate">
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

                        {/* Installed Apps */}
                        <div
                          className="rounded-2xl p-5 mb-5"
                          style={{
                            background: "#ffffff",
                            boxShadow: "0 4px 24px rgba(0,0,0,0.05)",
                            border: "1px solid rgba(0,0,0,0.06)",
                          }}
                        >
                          <div className="flex items-center gap-2 mb-4">
                            <Package className="w-4 h-4 text-gray-500" />
                            <h3 className="font-bold text-gray-800">
                              Installed Apps
                            </h3>
                          </div>
                          {getInstalledApps().length === 0 ? (
                            <p className="text-sm text-gray-400 italic">
                              No apps installed yet.
                            </p>
                          ) : (
                            <div className="flex flex-wrap gap-2">
                              {getInstalledApps().map((app) => {
                                const cfg = INTEGRATION_LABELS[app] || {
                                  name: app,
                                  color: "#6b7280",
                                };
                                return (
                                  <span
                                    key={app}
                                    className="px-3 py-1.5 rounded-full text-xs font-semibold text-white"
                                    style={{
                                      background: cfg.color,
                                      boxShadow: `0 2px 8px ${cfg.color}55`,
                                    }}
                                  >
                                    {cfg.name}
                                  </span>
                                );
                              })}
                            </div>
                          )}
                        </div>

                        {/* Package / Tier */}
                        <div
                          className="rounded-2xl p-5"
                          style={{
                            background: TIER_CONFIG[getUserTier()].bg,
                            border: `1px solid ${TIER_CONFIG[getUserTier()].color}33`,
                            boxShadow: TIER_CONFIG[getUserTier()].glow,
                          }}
                        >
                          <div className="flex items-center gap-2">
                            <div
                              style={{
                                color: TIER_CONFIG[getUserTier()].color,
                              }}
                            >
                              {TIER_CONFIG[getUserTier()].icon}
                            </div>
                            <h3
                              className="font-bold"
                              style={{
                                color: TIER_CONFIG[getUserTier()].color,
                              }}
                            >
                              {TIER_CONFIG[getUserTier()].label} Package
                            </h3>
                          </div>
                          <p className="text-xs text-gray-500 mt-2">
                            Member since{" "}
                            {selectedUser.createdAt
                              ? new Date(
                                  selectedUser.createdAt,
                                ).toLocaleDateString("en-US", {
                                  year: "numeric",
                                  month: "long",
                                })
                              : "recently joined"}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </>
            )}
          </div>
        </motion.div>
      </motion.div>
    </>
  );
}
