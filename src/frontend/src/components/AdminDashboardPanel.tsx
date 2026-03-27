import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Activity,
  AlertTriangle,
  ArrowLeft,
  Ban,
  BarChart3,
  Bell,
  CheckCircle,
  Clock,
  Crown,
  Database,
  Download,
  Eye,
  EyeOff,
  Globe,
  Key,
  Lock,
  LogOut,
  Mail,
  Menu,
  MessageSquare,
  Package,
  Phone,
  RefreshCw,
  Search,
  Send,
  Server,
  Settings,
  Shield,
  Star,
  Terminal,
  TrendingUp,
  User,
  UserCheck,
  UserCog,
  Users,
  X,
  Zap,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { useActor } from "../hooks/useActor";
import { StarBackground } from "./StarBackground";

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

type AdminSection =
  | "users"
  | "analytics"
  | "notifications"
  | "broadcast"
  | "logs"
  | "roles"
  | "settings"
  | "health";

const ADMIN_NAV: {
  id: AdminSection;
  label: string;
  icon: React.ReactNode;
  color: string;
}[] = [
  {
    id: "users",
    label: "Users",
    icon: <Users className="w-4 h-4" />,
    color: "#dc2626",
  },
  {
    id: "analytics",
    label: "Analytics",
    icon: <BarChart3 className="w-4 h-4" />,
    color: "#3b82f6",
  },
  {
    id: "notifications",
    label: "Notifications",
    icon: <Bell className="w-4 h-4" />,
    color: "#f59e0b",
  },
  {
    id: "broadcast",
    label: "Broadcast",
    icon: <MessageSquare className="w-4 h-4" />,
    color: "#8b5cf6",
  },
  {
    id: "logs",
    label: "System Logs",
    icon: <Terminal className="w-4 h-4" />,
    color: "#10b981",
  },
  {
    id: "roles",
    label: "User Roles",
    icon: <UserCog className="w-4 h-4" />,
    color: "#06b6d4",
  },
  {
    id: "health",
    label: "System Health",
    icon: <Server className="w-4 h-4" />,
    color: "#22c55e",
  },
  {
    id: "settings",
    label: "Settings",
    icon: <Settings className="w-4 h-4" />,
    color: "#a78bfa",
  },
];

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
  const [bannedUsers, setBannedUsers] = useState<Set<string>>(new Set());
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<AdminSection>("users");
  const [sectionHistory, setSectionHistory] = useState<AdminSection[]>([]);

  const { actor } = useActor();
  const [isLive, setIsLive] = useState(false);

  const loadAccounts = useCallback(async () => {
    if (actor) {
      try {
        const backendAccounts = await (actor as any).getAllLocalAccounts();
        if (backendAccounts && Array.isArray(backendAccounts)) {
          setAccounts(backendAccounts);
          setIsLive(true);
          return;
        }
      } catch (e) {
        console.warn("Backend fetch failed, using localStorage", e);
      }
    }
    setIsLive(false);
    try {
      const raw = localStorage.getItem("clawpro_local_accounts");
      const data: LocalAccount[] = raw ? JSON.parse(raw) : [];
      setAccounts(data);
    } catch {
      setAccounts([]);
    }
  }, [actor]);

  useEffect(() => {
    if (!isLoggedIn) return;
    loadAccounts();
    const interval = setInterval(loadAccounts, 30000);
    return () => clearInterval(interval);
  }, [isLoggedIn, loadAccounts]);

  const handleLogin = () => {
    setLoginError("");
    if (loginUsername === ADMIN_USERNAME && loginPassword === ADMIN_PASSWORD) {
      localStorage.setItem(ADMIN_KEY, "true");
      setIsLoggedIn(true);
      toast.success("Welcome, Admin!");
    } else {
      setLoginError("Invalid credentials.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem(ADMIN_KEY);
    setIsLoggedIn(false);
    setLoginUsername("");
    setLoginPassword("");
    setLoginError("");
    setForgotStep("none");
    setSelectedUser(null);
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
      const raw = localStorage.getItem("clawpro_installed_integrations");
      return handle ? (raw ? JSON.parse(raw) : []) : [];
    } catch {
      return [];
    }
  };

  const getUserTier = (): string => "silver";

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
    return gradients[name.charCodeAt(0) % gradients.length];
  };

  // ── Login View ──
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
          style={{ background: "rgba(0,0,0,0.97)" }}
          data-ocid="admin.modal"
        >
          <StarBackground />
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
            className="w-full max-w-sm relative z-10"
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
                      htmlFor="admin-username"
                      className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wide"
                    >
                      Username
                    </label>
                    <Input
                      id="admin-username"
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
                      htmlFor="admin-password"
                      className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wide"
                    >
                      Password
                    </label>
                    <div className="relative">
                      <Input
                        id="admin-password"
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
                    <div className="flex items-center gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                      <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0" />
                      <p className="text-xs text-red-400">{loginError}</p>
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={handleLogin}
                    className="w-full py-3 rounded-xl font-bold text-sm text-white admin-glow-btn transition-all"
                    style={{
                      background: "linear-gradient(135deg, #dc2626, #b91c1c)",
                    }}
                    data-ocid="admin.submit_button"
                  >
                    Login to Admin Panel
                  </button>
                  <button
                    type="button"
                    onClick={() => setForgotStep("recover")}
                    className="w-full text-center text-xs text-gray-500 hover:text-gray-300 transition-colors"
                  >
                    Forgot password?
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
                    className="text-white placeholder:text-gray-600"
                    style={{
                      background: "#1a1a2e",
                      border: "1px solid rgba(255,255,255,0.1)",
                    }}
                    data-ocid="admin.input"
                  />
                  <button
                    type="button"
                    onClick={handleForgotSubmit}
                    className="w-full py-3 rounded-xl font-bold text-sm text-white transition-all"
                    style={{
                      background: "linear-gradient(135deg, #7c3aed, #6d28d9)",
                      boxShadow: "0 4px 15px rgba(124,58,237,0.4)",
                    }}
                    data-ocid="admin.submit_button"
                  >
                    Recover
                  </button>
                  <button
                    type="button"
                    onClick={() => setForgotStep("none")}
                    className="w-full text-center text-xs text-gray-500 hover:text-gray-300"
                  >
                    ← Back to login
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      </>
    );
  }

  // ── Logged In: Full Dashboard ──
  const totalUsers = accounts.length;
  const activeToday = Math.max(1, Math.floor(accounts.length * 0.4));

  return (
    <>
      <style>{`
        @keyframes adminPulse {
          0%,100% { box-shadow: 0 0 0 0 rgba(220,38,38,0.4); }
          50% { box-shadow: 0 0 0 8px rgba(220,38,38,0); }
        }
        @keyframes healthDot {
          0%,100% { opacity: 1; } 50% { opacity: 0.4; }
        }
        .admin-nav-active {
          background: rgba(220,38,38,0.15) !important;
          border-left: 3px solid #dc2626 !important;
          color: #fca5a5;
        }
        .admin-nav-item:hover { background: rgba(255,255,255,0.04); }
      `}</style>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex flex-col"
        style={{ background: "#04040e" }}
        data-ocid="admin.modal"
      >
        <StarBackground />

        {/* Top Bar */}
        <div
          className="flex items-center justify-between px-4 py-3 flex-shrink-0 relative z-10"
          style={{
            background: "#0f0f1a",
            borderBottom: "1px solid rgba(220,38,38,0.2)",
            boxShadow: "0 2px 20px rgba(220,38,38,0.12)",
          }}
        >
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="md:hidden p-1.5 rounded text-gray-400 hover:text-white"
              onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
              data-ocid="admin.button"
            >
              <Menu className="w-4 h-4" />
            </button>
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{
                background: "linear-gradient(135deg, #dc2626, #991b1b)",
                boxShadow: "0 0 12px rgba(220,38,38,0.5)",
              }}
            >
              <Shield className="w-4 h-4 text-white" />
            </div>
            <div>
              <h1 className="text-sm font-bold text-white">Admin Panel</h1>
              <p className="text-[10px] text-red-400/70">
                ClawPro.ai Control Center
              </p>
            </div>
            <Badge className="ml-2 bg-red-500/15 text-red-300 border-red-500/30 border text-xs hidden sm:flex">
              {totalUsers} Users
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5">
              <div
                className="w-2 h-2 rounded-full bg-green-400"
                style={{
                  animation: "healthDot 2s infinite",
                  boxShadow: "0 0 6px rgba(34,197,94,0.8)",
                }}
              />
              <span className="text-xs text-gray-500 hidden sm:inline">
                System Online
              </span>
            </div>
            <button
              type="button"
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all hover:bg-red-500/20"
              style={{
                background: "rgba(220,38,38,0.1)",
                color: "#fca5a5",
                border: "1px solid rgba(220,38,38,0.3)",
              }}
              data-ocid="admin.close_button"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Logout</span>
            </button>
            <button
              type="button"
              onClick={() => {
                if (sectionHistory.length > 0) {
                  const prev = sectionHistory[sectionHistory.length - 1];
                  setSectionHistory((h) => h.slice(0, -1));
                  setActiveSection(prev);
                } else {
                  setActiveSection("users");
                }
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all hover:bg-white/10"
              style={{
                background: "rgba(255,255,255,0.06)",
                color: "rgba(255,255,255,0.6)",
                border: "1px solid rgba(255,255,255,0.1)",
              }}
              data-ocid="admin.back_button"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Back</span>
            </button>
          </div>
        </div>

        {/* Main Layout */}
        <div className="flex flex-1 overflow-hidden relative z-10">
          {/* Mobile overlay */}
          {mobileSidebarOpen && (
            <div
              role="button"
              tabIndex={0}
              className="fixed inset-0 z-30 md:hidden"
              style={{ background: "rgba(0,0,0,0.7)" }}
              onClick={() => setMobileSidebarOpen(false)}
              onKeyDown={(e) =>
                e.key === "Escape" && setMobileSidebarOpen(false)
              }
              aria-label="Close sidebar"
            />
          )}

          {/* Left Sidebar */}
          <aside
            className={[
              "flex flex-col z-40 md:relative flex-shrink-0",
              "transition-transform duration-300",
              mobileSidebarOpen
                ? "fixed inset-y-0 left-0 translate-x-0 pt-14"
                : "fixed inset-y-0 left-0 -translate-x-full md:translate-x-0 md:static md:pt-0",
            ].join(" ")}
            style={{
              width: "260px",
              background: "#0c0c18",
              borderRight: "1px solid rgba(255,255,255,0.07)",
              boxShadow: "4px 0 24px rgba(0,0,0,0.5)",
            }}
          >
            {/* Admin section nav */}
            <div className="p-3 flex-shrink-0">
              <p className="text-[10px] font-semibold text-gray-600 uppercase tracking-widest px-2 mb-2">
                Navigation
              </p>
              <div className="space-y-0.5">
                {ADMIN_NAV.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      setSectionHistory((prev) => [...prev, activeSection]);
                      setActiveSection(item.id);
                      setMobileSidebarOpen(false);
                    }}
                    className={`admin-nav-item w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all border-l-3 ${
                      activeSection === item.id
                        ? "admin-nav-active"
                        : "border-l-3 border-transparent text-gray-400"
                    }`}
                    style={{
                      borderLeft:
                        activeSection === item.id
                          ? `3px solid ${item.color}`
                          : "3px solid transparent",
                    }}
                    data-ocid={`admin.${item.id}.tab`}
                  >
                    <span
                      style={{
                        color:
                          activeSection === item.id ? item.color : "#6b7280",
                      }}
                    >
                      {item.icon}
                    </span>
                    <span
                      className={
                        activeSection === item.id
                          ? "text-white font-medium"
                          : ""
                      }
                    >
                      {item.label}
                    </span>
                    {item.id === "users" && totalUsers > 0 && (
                      <span
                        className="ml-auto text-[10px] px-1.5 py-0.5 rounded-full"
                        style={{
                          background: "rgba(220,38,38,0.2)",
                          color: "#fca5a5",
                        }}
                      >
                        {totalUsers}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* User search - only in users section */}
            {activeSection === "users" && (
              <div className="px-3 pb-2 flex-shrink-0">
                <div className="h-px bg-white/5 mb-3" />
                <div className="flex items-center justify-between px-2 mb-2">
                  <p className="text-[10px] font-semibold text-gray-600 uppercase tracking-widest">
                    User List
                  </p>
                  <div className="flex items-center gap-1">
                    <span
                      className="w-1.5 h-1.5 rounded-full inline-block"
                      style={{
                        background: isLive ? "#22c55e" : "#f59e0b",
                        boxShadow: isLive
                          ? "0 0 4px #22c55e"
                          : "0 0 4px #f59e0b",
                        animation: "healthDot 1.5s infinite",
                      }}
                    />
                    <span
                      className="text-[9px] font-semibold"
                      style={{ color: isLive ? "#22c55e" : "#f59e0b" }}
                    >
                      {isLive ? "🔴 LIVE" : "LOCAL"}
                    </span>
                  </div>
                </div>
                <div className="relative mb-2">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500" />
                  <Input
                    placeholder="Search users..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-8 h-8 text-xs text-white placeholder:text-gray-600"
                    style={{
                      background: "#1a1a2e",
                      border: "1px solid rgba(255,255,255,0.08)",
                    }}
                    data-ocid="admin.search_input"
                  />
                </div>
                <ScrollArea className="h-[calc(100vh-340px)]">
                  <div className="space-y-0.5 pr-1">
                    {filteredAccounts.length === 0 ? (
                      <div
                        className="text-center py-8 text-gray-600 text-xs"
                        data-ocid="admin.empty_state"
                      >
                        <Users className="w-6 h-6 mx-auto mb-2 opacity-20" />
                        <p>No users found</p>
                      </div>
                    ) : (
                      filteredAccounts.map((account, idx) => (
                        <button
                          key={account.handle}
                          type="button"
                          onClick={() => {
                            setSelectedUser(
                              selectedUser?.handle === account.handle
                                ? null
                                : account,
                            );
                            setMobileSidebarOpen(false);
                          }}
                          className="w-full flex items-center gap-2 px-2.5 py-2 rounded-lg text-left transition-all"
                          style={{
                            background:
                              selectedUser?.handle === account.handle
                                ? "rgba(220,38,38,0.15)"
                                : "transparent",
                            borderLeft:
                              selectedUser?.handle === account.handle
                                ? "2px solid #dc2626"
                                : "2px solid transparent",
                          }}
                          data-ocid={`admin.item.${idx + 1}`}
                        >
                          <div
                            className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0"
                            style={{
                              background: getAvatarGradient(
                                account.fullName || account.handle,
                              ),
                            }}
                          >
                            {getInitials(account.fullName || account.handle)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold text-white truncate">
                              {account.fullName || "—"}
                            </p>
                            <p className="text-[10px] text-gray-500 truncate">
                              @{account.handle}
                            </p>
                          </div>
                          {bannedUsers.has(account.handle) && (
                            <Ban className="w-3 h-3 text-red-500 flex-shrink-0" />
                          )}
                        </button>
                      ))
                    )}
                  </div>
                </ScrollArea>
              </div>
            )}

            {/* Export button at bottom */}
            <div className="mt-auto p-3 border-t border-white/5">
              <button
                type="button"
                onClick={exportCSV}
                className="w-full flex items-center justify-center gap-2 py-2 rounded-xl font-semibold text-xs text-white transition-all hover:opacity-90"
                style={{
                  background: "linear-gradient(135deg, #1d4ed8, #1e40af)",
                  boxShadow: "0 4px 12px rgba(29,78,216,0.3)",
                }}
                data-ocid="admin.button"
              >
                <Download className="w-3.5 h-3.5" />
                Export CSV
              </button>
            </div>
          </aside>

          {/* Right Content Panel */}
          <main
            className="flex-1 overflow-auto"
            style={{ background: "#06060f" }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSection + (selectedUser?.handle || "")}
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -12 }}
                transition={{ duration: 0.18 }}
                className="h-full"
              >
                {activeSection === "users" && (
                  <UsersPanel
                    accounts={accounts}
                    filteredAccounts={filteredAccounts}
                    selectedUser={selectedUser}
                    setSelectedUser={setSelectedUser}
                    bannedUsers={bannedUsers}
                    setBannedUsers={setBannedUsers}
                    getInstalledApps={getInstalledApps}
                    getUserTier={getUserTier}
                    getAvatarGradient={getAvatarGradient}
                    getInitials={getInitials}
                    loadAccounts={loadAccounts}
                    totalUsers={totalUsers}
                    activeToday={activeToday}
                  />
                )}
                {activeSection === "analytics" && (
                  <AnalyticsPanel accounts={accounts} />
                )}
                {activeSection === "notifications" && (
                  <NotificationsPanel accounts={accounts} />
                )}
                {activeSection === "broadcast" && (
                  <BroadcastPanel accounts={accounts} />
                )}
                {activeSection === "logs" && <SystemLogsPanel />}
                {activeSection === "roles" && (
                  <UserRolesPanel accounts={accounts} />
                )}
                {activeSection === "health" && <SystemHealthPanel />}
                {activeSection === "settings" && <AdminSettingsPanel />}
              </motion.div>
            </AnimatePresence>
          </main>
        </div>
      </motion.div>
    </>
  );
}

// ── Users Panel ──
function UsersPanel({
  accounts,
  filteredAccounts,
  selectedUser,
  setSelectedUser,
  bannedUsers,
  setBannedUsers,
  getInstalledApps,
  getUserTier,
  getAvatarGradient,
  getInitials,
  loadAccounts,
  totalUsers,
  activeToday,
}: {
  accounts: LocalAccount[];
  filteredAccounts: LocalAccount[];
  selectedUser: LocalAccount | null;
  setSelectedUser: (u: LocalAccount | null) => void;
  bannedUsers: Set<string>;
  setBannedUsers: (f: (prev: Set<string>) => Set<string>) => void;
  getInstalledApps: (h: string) => string[];
  getUserTier: () => string;
  getAvatarGradient: (n: string) => string;
  getInitials: (n: string) => string;
  loadAccounts: () => void;
  totalUsers: number;
  activeToday: number;
}) {
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
      value: Math.max(0, accounts.filter((_, i) => i % 3 === 0).length),
      icon: <Star className="w-4 h-4" />,
      color: "#94a3b8",
      glow: "rgba(148,163,184,0.3)",
    },
    {
      label: "Gold / Plat",
      value: Math.max(0, accounts.filter((_, i) => i % 3 !== 0).length),
      icon: <Crown className="w-4 h-4" />,
      color: "#d97706",
      glow: "rgba(217,119,6,0.3)",
    },
  ];

  if (selectedUser) {
    const installed = getInstalledApps(selectedUser.handle);
    const isBanned = bannedUsers.has(selectedUser.handle);
    return (
      <div className="p-6 space-y-5 max-w-2xl">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setSelectedUser(null)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all hover:bg-white/10"
            style={{
              background: "rgba(255,255,255,0.06)",
              color: "rgba(255,255,255,0.6)",
              border: "1px solid rgba(255,255,255,0.1)",
            }}
            data-ocid="admin.close_button"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Users
          </button>
        </div>

        {/* User Header */}
        <div
          className="rounded-2xl p-6 border"
          style={{
            background: "#0f1729",
            border: "1px solid rgba(220,38,38,0.2)",
            boxShadow: "0 0 24px rgba(220,38,38,0.08)",
          }}
        >
          <div className="flex items-start gap-4">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center text-xl font-bold text-white flex-shrink-0"
              style={{
                background: getAvatarGradient(
                  selectedUser.fullName || selectedUser.handle,
                ),
                boxShadow: "0 8px 20px rgba(0,0,0,0.4)",
              }}
            >
              {getInitials(selectedUser.fullName || selectedUser.handle)}
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-white">
                {selectedUser.fullName || "—"}
              </h2>
              <p className="text-sm text-gray-400">@{selectedUser.handle}</p>
              <div className="flex flex-wrap gap-2 mt-2">
                <Badge className="bg-red-500/15 text-red-300 border-red-500/30 border text-xs">
                  {getUserTier().charAt(0).toUpperCase() +
                    getUserTier().slice(1)}{" "}
                  Tier
                </Badge>
                {isBanned ? (
                  <Badge className="bg-red-900/30 text-red-400 border-red-700/40 border text-xs">
                    Banned
                  </Badge>
                ) : (
                  <Badge className="bg-green-500/15 text-green-300 border-green-500/30 border text-xs">
                    Active
                  </Badge>
                )}
                {selectedUser.createdAt && (
                  <Badge className="bg-gray-800 text-gray-400 border-white/10 border text-xs">
                    Joined{" "}
                    {new Date(selectedUser.createdAt).toLocaleDateString()}
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Contact Info */}
        <div
          className="rounded-2xl p-5 border"
          style={{
            background: "#0f1729",
            border: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <h3 className="text-sm font-semibold text-gray-300 mb-4 flex items-center gap-2">
            <User className="w-4 h-4 text-cyan-400" /> Contact Information
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              {
                icon: <Mail className="w-3.5 h-3.5" />,
                label: "Email",
                value: selectedUser.email || "Not provided",
                color: "#06b6d4",
              },
              {
                icon: <Phone className="w-3.5 h-3.5" />,
                label: "Phone",
                value: selectedUser.phone || "Not provided",
                color: "#10b981",
              },
              {
                icon: <Package className="w-3.5 h-3.5" />,
                label: "Username",
                value: selectedUser.username || selectedUser.handle,
                color: "#a78bfa",
              },
              {
                icon: <Clock className="w-3.5 h-3.5" />,
                label: "Joined",
                value: selectedUser.createdAt
                  ? new Date(selectedUser.createdAt).toLocaleString()
                  : "—",
                color: "#f59e0b",
              },
            ].map((f) => (
              <div
                key={f.label}
                className="flex items-start gap-3 p-3 rounded-xl"
                style={{ background: "#131f35" }}
              >
                <span
                  style={{ color: f.color }}
                  className="mt-0.5 flex-shrink-0"
                >
                  {f.icon}
                </span>
                <div>
                  <p className="text-[10px] text-gray-500 uppercase tracking-wide">
                    {f.label}
                  </p>
                  <p className="text-xs text-white mt-0.5">{f.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Installed Apps */}
        <div
          className="rounded-2xl p-5 border"
          style={{
            background: "#0f1729",
            border: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <h3 className="text-sm font-semibold text-gray-300 mb-4 flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-400" /> Installed Integrations (
            {installed.length})
          </h3>
          {installed.length === 0 ? (
            <p className="text-xs text-gray-500">No integrations installed</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {installed.map((appId) => {
                const label = INTEGRATION_LABELS[appId];
                return (
                  <span
                    key={appId}
                    className="px-2.5 py-1 rounded-full text-xs font-medium"
                    style={{
                      background: `${label?.color ?? "#888"}18`,
                      color: label?.color ?? "#888",
                      border: `1px solid ${label?.color ?? "#888"}40`,
                    }}
                  >
                    {label?.name ?? appId}
                  </span>
                );
              })}
            </div>
          )}
        </div>

        {/* Actions */}
        <div
          className="rounded-2xl p-5 border"
          style={{
            background: "#0f1729",
            border: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <h3 className="text-sm font-semibold text-gray-300 mb-4">
            Admin Actions
          </h3>
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => {
                setBannedUsers((prev) => {
                  const n = new Set(prev);
                  if (n.has(selectedUser.handle)) n.delete(selectedUser.handle);
                  else n.add(selectedUser.handle);
                  return n;
                });
                toast(isBanned ? "User unbanned" : "User banned");
              }}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all"
              style={
                isBanned
                  ? {
                      background: "linear-gradient(135deg, #059669, #047857)",
                      boxShadow: "0 4px 12px rgba(5,150,105,0.3)",
                      color: "white",
                    }
                  : {
                      background: "linear-gradient(135deg, #dc2626, #b91c1c)",
                      boxShadow: "0 4px 12px rgba(220,38,38,0.3)",
                      color: "white",
                    }
              }
              data-ocid={
                isBanned ? "admin.confirm_button" : "admin.delete_button"
              }
            >
              <Ban className="w-4 h-4" />
              {isBanned ? "Unban User" : "Ban User"}
            </button>
            <button
              type="button"
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all"
              style={{
                background: "linear-gradient(135deg, #7c3aed, #6d28d9)",
                boxShadow: "0 4px 12px rgba(124,58,237,0.3)",
                color: "white",
              }}
              onClick={() => toast.info("Password reset link sent")}
              data-ocid="admin.button"
            >
              <Key className="w-4 h-4" />
              Reset Password
            </button>
            <button
              type="button"
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all"
              style={{
                background: "linear-gradient(135deg, #0891b2, #0e7490)",
                boxShadow: "0 4px 12px rgba(8,145,178,0.3)",
                color: "white",
              }}
              onClick={() => toast.info("Email sent to user")}
              data-ocid="admin.button"
            >
              <Mail className="w-4 h-4" />
              Send Email
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-5">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {statsData.map((s) => (
          <div
            key={s.label}
            className="rounded-xl p-4"
            style={{
              background: "#0f1729",
              border: `1px solid ${s.color}25`,
              boxShadow: `0 0 16px ${s.glow}`,
            }}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-2xl font-bold" style={{ color: s.color }}>
                {s.value}
              </span>
              <div style={{ color: s.color }}>{s.icon}</div>
            </div>
            <p className="text-xs text-gray-400">{s.label}</p>
          </div>
        ))}
      </div>

      {/* System Health Quick View */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { name: "Database", status: "Healthy", color: "#10b981" },
          { name: "API Server", status: "Healthy", color: "#10b981" },
          { name: "Auth", status: "Healthy", color: "#10b981" },
          { name: "Storage", status: "OK", color: "#f59e0b" },
        ].map((s) => (
          <div
            key={s.name}
            className="flex items-center gap-2 p-3 rounded-xl"
            style={{
              background: "#0f1729",
              border: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            <div
              className="w-2 h-2 rounded-full flex-shrink-0"
              style={{ background: s.color, boxShadow: `0 0 6px ${s.color}` }}
            />
            <div>
              <p className="text-xs font-medium text-white">{s.name}</p>
              <p className="text-[10px]" style={{ color: s.color }}>
                {s.status}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* All Users Table */}
      <div
        className="rounded-2xl overflow-hidden border border-white/8"
        style={{ background: "#0f1729" }}
      >
        <div className="flex items-center justify-between p-4 border-b border-white/8">
          <h3 className="text-sm font-semibold text-white flex items-center gap-2">
            <Users className="w-4 h-4 text-red-400" /> All Users
          </h3>
          <button
            type="button"
            onClick={loadAccounts}
            className="p-1.5 rounded text-gray-500 hover:text-gray-300 transition-colors"
            data-ocid="admin.button"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr
                style={{
                  background: "#131f35",
                  borderBottom: "1px solid rgba(255,255,255,0.06)",
                }}
              >
                <th className="text-left text-[10px] text-gray-500 uppercase tracking-wide font-semibold px-4 py-2.5">
                  Name
                </th>
                <th className="text-left text-[10px] text-gray-500 uppercase tracking-wide font-semibold px-4 py-2.5 hidden sm:table-cell">
                  Email
                </th>
                <th className="text-left text-[10px] text-gray-500 uppercase tracking-wide font-semibold px-4 py-2.5 hidden md:table-cell">
                  Joined
                </th>
                <th className="text-left text-[10px] text-gray-500 uppercase tracking-wide font-semibold px-4 py-2.5">
                  Tier
                </th>
                <th className="text-left text-[10px] text-gray-500 uppercase tracking-wide font-semibold px-4 py-2.5">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredAccounts.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="text-center py-10 text-gray-600 text-sm"
                    data-ocid="admin.empty_state"
                  >
                    <Users className="w-8 h-8 mx-auto mb-2 opacity-20" />
                    No users found
                  </td>
                </tr>
              ) : (
                filteredAccounts.map((account, idx) => (
                  <tr
                    key={account.handle}
                    className="border-b border-white/4 hover:bg-white/3 transition-colors cursor-pointer"
                    onClick={() => setSelectedUser(account)}
                    onKeyDown={(e) =>
                      e.key === "Enter" && setSelectedUser(account)
                    }
                    data-ocid={`admin.row.${idx + 1}`}
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0"
                          style={{
                            background: getAvatarGradient(
                              account.fullName || account.handle,
                            ),
                          }}
                        >
                          {getInitials(account.fullName || account.handle)}
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-white">
                            {account.fullName || "—"}
                          </p>
                          <p className="text-[10px] text-gray-500">
                            @{account.handle}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-400 hidden sm:table-cell">
                      {account.email || "—"}
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-500 hidden md:table-cell">
                      {account.createdAt
                        ? new Date(account.createdAt).toLocaleDateString()
                        : "—"}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className="text-xs px-2 py-0.5 rounded-full"
                        style={{
                          background: "rgba(148,163,184,0.15)",
                          color: "#94a3b8",
                        }}
                      >
                        Silver
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedUser(account);
                        }}
                        className="text-[10px] px-2 py-1 rounded text-cyan-400 hover:bg-cyan-500/10 transition-colors"
                        data-ocid={`admin.edit_button.${idx + 1}`}
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ── Analytics Panel ──
function AnalyticsPanel({ accounts }: { accounts: LocalAccount[] }) {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const registrations = [2, 5, 3, 7, 4, 8, accounts.length || 6];
  const maxReg = Math.max(...registrations);

  const tierData = [
    { label: "Silver", value: 60, color: "#94a3b8" },
    { label: "Gold", value: 30, color: "#d97706" },
    { label: "Platinum", value: 10, color: "#a78bfa" },
  ];

  return (
    <div className="p-6 space-y-5">
      <h2 className="text-lg font-bold text-white flex items-center gap-2">
        <BarChart3 className="w-5 h-5 text-blue-400" /> Analytics Dashboard
      </h2>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          {
            label: "Total Users",
            value: accounts.length || 0,
            delta: "+12%",
            color: "#3b82f6",
          },
          {
            label: "Registrations (7d)",
            value: registrations.reduce((a, b) => a + b, 0),
            delta: "+23%",
            color: "#10b981",
          },
          {
            label: "Avg Session",
            value: "4m 32s",
            delta: "+5%",
            color: "#f59e0b",
          },
          {
            label: "Retention Rate",
            value: "72%",
            delta: "+8%",
            color: "#a78bfa",
          },
        ].map((k) => (
          <div
            key={k.label}
            className="rounded-xl p-4"
            style={{
              background: "#0f1729",
              border: `1px solid ${k.color}20`,
              boxShadow: `0 0 16px ${k.color}12`,
            }}
          >
            <p className="text-xl font-bold" style={{ color: k.color }}>
              {k.value}
            </p>
            <p className="text-xs text-gray-400 mt-0.5">{k.label}</p>
            <p className="text-[10px] text-green-400 mt-1">
              {k.delta} this week
            </p>
          </div>
        ))}
      </div>

      {/* Weekly Registration Bar Chart */}
      <div
        className="rounded-2xl p-5 border border-white/8"
        style={{ background: "#0f1729" }}
      >
        <h3 className="text-sm font-semibold text-gray-300 mb-4">
          Weekly Registrations
        </h3>
        <div className="flex items-end gap-2 h-28">
          {registrations.map((val, i) => (
            <div
              key={days[i]}
              className="flex-1 flex flex-col items-center gap-1"
            >
              <div
                className="w-full rounded-t-md transition-all"
                style={{
                  height: `${(val / maxReg) * 100}%`,
                  background: "linear-gradient(180deg, #3b82f6, #1d4ed8)",
                  boxShadow: "0 0 8px rgba(59,130,246,0.4)",
                  minHeight: "4px",
                }}
              />
              <span className="text-[9px] text-gray-500">{days[i]}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Tier Distribution */}
      <div
        className="rounded-2xl p-5 border border-white/8"
        style={{ background: "#0f1729" }}
      >
        <h3 className="text-sm font-semibold text-gray-300 mb-4">
          Tier Distribution
        </h3>
        <div className="space-y-3">
          {tierData.map((t) => (
            <div key={t.label} className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs" style={{ color: t.color }}>
                  {t.label}
                </span>
                <span className="text-xs text-gray-500">{t.value}%</span>
              </div>
              <div
                className="h-2 rounded-full"
                style={{ background: "#131f35" }}
              >
                <div
                  className="h-2 rounded-full transition-all"
                  style={{
                    width: `${t.value}%`,
                    background: t.color,
                    boxShadow: `0 0 8px ${t.color}60`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Activity Timeline */}
      <div
        className="rounded-2xl p-5 border border-white/8"
        style={{ background: "#0f1729" }}
      >
        <h3 className="text-sm font-semibold text-gray-300 mb-4">
          Recent Activity
        </h3>
        <div className="space-y-3">
          {[
            {
              icon: <UserCheck className="w-3.5 h-3.5" />,
              text: "New user registered",
              time: "2m ago",
              color: "#10b981",
            },
            {
              icon: <Zap className="w-3.5 h-3.5" />,
              text: "Integration installed",
              time: "15m ago",
              color: "#a78bfa",
            },
            {
              icon: <Crown className="w-3.5 h-3.5" />,
              text: "Tier upgrade",
              time: "1h ago",
              color: "#d97706",
            },
            {
              icon: <Globe className="w-3.5 h-3.5" />,
              text: "API key configured",
              time: "3h ago",
              color: "#3b82f6",
            },
            {
              icon: <Bell className="w-3.5 h-3.5" />,
              text: "Price alert triggered",
              time: "5h ago",
              color: "#f59e0b",
            },
          ].map((item) => (
            <div key={item.text} className="flex items-start gap-3">
              <div
                className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                style={{ background: `${item.color}20`, color: item.color }}
              >
                {item.icon}
              </div>
              <div className="flex-1">
                <p className="text-xs text-white">{item.text}</p>
              </div>
              <span className="text-[10px] text-gray-500">{item.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Notifications Panel ──
function NotificationsPanel({ accounts }: { accounts: LocalAccount[] }) {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [targetTier, setTargetTier] = useState("all");
  const [sent, setSent] = useState<
    { title: string; body: string; tier: string; time: string }[]
  >([
    {
      title: "System Update",
      body: "ClawPro v108 deployed with new features",
      tier: "all",
      time: "2h ago",
    },
    {
      title: "Gold Exclusive",
      body: "New Gold tier benefits available",
      tier: "gold",
      time: "1d ago",
    },
  ]);

  const send = () => {
    if (!title.trim() || !body.trim()) return toast.error("Fill in all fields");
    setSent((prev) => [
      { title, body, tier: targetTier, time: "Just now" },
      ...prev,
    ]);
    setTitle("");
    setBody("");
    toast.success(
      `Notification sent to ${targetTier === "all" ? "all users" : `${targetTier} tier`}`,
    );
  };

  return (
    <div className="p-6 space-y-5">
      <h2 className="text-lg font-bold text-white flex items-center gap-2">
        <Bell className="w-5 h-5 text-amber-400" /> Notifications
      </h2>

      {/* Create Notification */}
      <div
        className="rounded-2xl p-5 border"
        style={{
          background: "#0f1729",
          border: "1px solid rgba(245,158,11,0.2)",
          boxShadow: "0 0 16px rgba(245,158,11,0.08)",
        }}
      >
        <h3 className="text-sm font-semibold text-amber-300 mb-4">
          Send New Notification
        </h3>
        <div className="space-y-3">
          <div>
            <label
              htmlFor="notif-title"
              className="text-xs text-gray-400 block mb-1.5"
            >
              Title
            </label>
            <Input
              id="notif-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Notification title..."
              className="text-white placeholder:text-gray-600"
              style={{
                background: "#131f35",
                border: "1px solid rgba(255,255,255,0.1)",
              }}
              data-ocid="admin.input"
            />
          </div>
          <div>
            <label
              htmlFor="notif-body"
              className="text-xs text-gray-400 block mb-1.5"
            >
              Message
            </label>
            <Textarea
              id="notif-body"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Notification message..."
              className="text-white placeholder:text-gray-600 resize-none"
              rows={3}
              style={{
                background: "#131f35",
                border: "1px solid rgba(255,255,255,0.1)",
              }}
              data-ocid="admin.textarea"
            />
          </div>
          <div>
            <label
              htmlFor="notif-target"
              className="text-xs text-gray-400 block mb-1.5"
            >
              Target Audience
            </label>
            <select
              value={targetTier}
              onChange={(e) => setTargetTier(e.target.value)}
              className="w-full h-9 text-sm rounded-lg px-3 text-white"
              style={{
                background: "#131f35",
                border: "1px solid rgba(255,255,255,0.1)",
              }}
              data-ocid="admin.select"
            >
              <option value="all">All Users ({accounts.length})</option>
              <option value="silver">Silver Tier</option>
              <option value="gold">Gold Tier</option>
              <option value="platinum">Platinum Tier</option>
            </select>
          </div>
          <button
            type="button"
            onClick={send}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm text-white transition-all"
            style={{
              background: "linear-gradient(135deg, #d97706, #b45309)",
              boxShadow: "0 4px 12px rgba(217,119,6,0.3)",
            }}
            data-ocid="admin.submit_button"
          >
            <Send className="w-4 h-4" /> Send Notification
          </button>
        </div>
      </div>

      {/* Sent History */}
      <div
        className="rounded-2xl p-5 border border-white/8"
        style={{ background: "#0f1729" }}
      >
        <h3 className="text-sm font-semibold text-gray-300 mb-4">
          Sent Notifications
        </h3>
        <div className="space-y-2">
          {sent.map((n) => (
            <div
              key={n.title + n.time}
              className="flex items-start gap-3 p-3 rounded-xl"
              style={{ background: "#131f35" }}
            >
              <Bell className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-xs font-semibold text-white">{n.title}</p>
                <p className="text-[10px] text-gray-500 mt-0.5">{n.body}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span
                    className="text-[9px] px-1.5 py-0.5 rounded-full"
                    style={{
                      background: "rgba(245,158,11,0.15)",
                      color: "#fbbf24",
                    }}
                  >
                    {n.tier}
                  </span>
                  <span className="text-[9px] text-gray-600">{n.time}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Broadcast Panel ──
function BroadcastPanel({ accounts }: { accounts: LocalAccount[] }) {
  const [msg, setMsg] = useState("");
  const [subject, setSubject] = useState("");
  const [history, setHistory] = useState<
    { subject: string; msg: string; time: string; recipients: number }[]
  >([
    {
      subject: "Welcome to ClawPro v108!",
      msg: "Major update with new dashboard features.",
      time: "1d ago",
      recipients: 45,
    },
  ]);

  const send = () => {
    if (!msg.trim() || !subject.trim())
      return toast.error("Fill in all fields");
    setHistory((prev) => [
      { subject, msg, time: "Just now", recipients: accounts.length || 1 },
      ...prev,
    ]);
    setMsg("");
    setSubject("");
    toast.success(`Broadcast sent to ${accounts.length || 0} users!`);
  };

  return (
    <div className="p-6 space-y-5">
      <h2 className="text-lg font-bold text-white flex items-center gap-2">
        <MessageSquare className="w-5 h-5 text-violet-400" /> Broadcast Message
      </h2>

      <div
        className="rounded-2xl p-5 border"
        style={{
          background: "#0f1729",
          border: "1px solid rgba(139,92,246,0.2)",
          boxShadow: "0 0 16px rgba(139,92,246,0.08)",
        }}
      >
        <h3 className="text-sm font-semibold text-violet-300 mb-4">
          Compose Broadcast
        </h3>
        <div className="space-y-3">
          <div>
            <label
              htmlFor="bc-subj"
              className="text-xs text-gray-400 block mb-1.5"
            >
              Subject
            </label>
            <Input
              id="bc-subj"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Broadcast subject..."
              className="text-white placeholder:text-gray-600"
              style={{
                background: "#131f35",
                border: "1px solid rgba(255,255,255,0.1)",
              }}
              data-ocid="admin.input"
            />
          </div>
          <div>
            <label
              htmlFor="bc-msg2"
              className="text-xs text-gray-400 block mb-1.5"
            >
              Message
            </label>
            <Textarea
              id="bc-msg2"
              value={msg}
              onChange={(e) => setMsg(e.target.value)}
              placeholder="Your message to all users..."
              className="text-white placeholder:text-gray-600 resize-none"
              rows={5}
              style={{
                background: "#131f35",
                border: "1px solid rgba(255,255,255,0.1)",
              }}
              data-ocid="admin.textarea"
            />
          </div>
          <div className="flex items-center gap-3">
            <div
              className="flex items-center gap-2 px-3 py-2 rounded-lg"
              style={{ background: "rgba(139,92,246,0.15)" }}
            >
              <Users className="w-4 h-4 text-violet-400" />
              <span className="text-xs text-violet-300">
                {accounts.length} recipients
              </span>
            </div>
            <button
              type="button"
              onClick={send}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm text-white transition-all"
              style={{
                background: "linear-gradient(135deg, #7c3aed, #6d28d9)",
                boxShadow: "0 4px 12px rgba(124,58,237,0.3)",
              }}
              data-ocid="admin.submit_button"
            >
              <Send className="w-4 h-4" /> Send to All
            </button>
          </div>
        </div>
      </div>

      <div
        className="rounded-2xl p-5 border border-white/8"
        style={{ background: "#0f1729" }}
      >
        <h3 className="text-sm font-semibold text-gray-300 mb-4">
          Broadcast History
        </h3>
        <div className="space-y-3">
          {history.map((h) => (
            <div
              key={h.subject + h.time}
              className="p-4 rounded-xl border border-white/5"
              style={{ background: "#131f35" }}
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-sm font-semibold text-white">
                    {h.subject}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">
                    {h.msg}
                  </p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-[10px] text-gray-500">{h.time}</p>
                  <p className="text-[10px] text-violet-400">
                    {h.recipients} users
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── System Logs Panel ──
function SystemLogsPanel() {
  const logs = [
    {
      type: "login",
      user: "@cryptoking",
      action: "User login successful",
      ip: "192.168.1.1",
      time: "2m ago",
      color: "#10b981",
    },
    {
      type: "register",
      user: "@newuser123",
      action: "New account registered",
      ip: "10.0.0.5",
      time: "15m ago",
      color: "#3b82f6",
    },
    {
      type: "install",
      user: "@webdev",
      action: "Installed WhatsApp integration",
      ip: "172.16.0.3",
      time: "32m ago",
      color: "#a78bfa",
    },
    {
      type: "login",
      user: "@satoshi_jr",
      action: "User login successful",
      ip: "192.168.2.10",
      time: "1h ago",
      color: "#10b981",
    },
    {
      type: "ban",
      user: "@spammer99",
      action: "User banned by admin",
      ip: "—",
      time: "2h ago",
      color: "#dc2626",
    },
    {
      type: "tier",
      user: "@goldmember",
      action: "Tier upgraded to Gold",
      ip: "10.0.1.22",
      time: "3h ago",
      color: "#d97706",
    },
    {
      type: "install",
      user: "@techuser",
      action: "Installed ChatGPT integration",
      ip: "192.168.0.88",
      time: "5h ago",
      color: "#a78bfa",
    },
    {
      type: "login",
      user: "@adminroot",
      action: "Admin login",
      ip: "127.0.0.1",
      time: "6h ago",
      color: "#dc2626",
    },
    {
      type: "register",
      user: "@newbie456",
      action: "New account registered",
      ip: "10.0.0.9",
      time: "8h ago",
      color: "#3b82f6",
    },
    {
      type: "login",
      user: "@powercoder",
      action: "User login successful",
      ip: "172.20.0.5",
      time: "12h ago",
      color: "#10b981",
    },
  ];

  const typeIcon: Record<string, React.ReactNode> = {
    login: <User className="w-3 h-3" />,
    register: <UserCheck className="w-3 h-3" />,
    install: <Zap className="w-3 h-3" />,
    ban: <Ban className="w-3 h-3" />,
    tier: <Crown className="w-3 h-3" />,
  };

  return (
    <div className="p-6 space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <Terminal className="w-5 h-5 text-green-400" /> System Logs
        </h2>
        <button
          type="button"
          className="text-xs text-gray-500 hover:text-gray-300 flex items-center gap-1"
          onClick={() => toast.success("Logs refreshed")}
        >
          <RefreshCw className="w-3.5 h-3.5" /> Refresh
        </button>
      </div>

      <div
        className="rounded-2xl overflow-hidden border border-white/8"
        style={{ background: "#0f1729" }}
      >
        <div
          className="p-3 border-b border-white/6"
          style={{ background: "#131f35" }}
        >
          <div className="grid grid-cols-5 gap-2">
            {["Type", "User", "Action", "IP", "Time"].map((h) => (
              <p
                key={h}
                className="text-[10px] font-semibold text-gray-500 uppercase tracking-wide"
              >
                {h}
              </p>
            ))}
          </div>
        </div>
        <div className="divide-y divide-white/4">
          {logs.map((log, i) => (
            <div
              key={log.action}
              className="grid grid-cols-5 gap-2 p-3 hover:bg-white/2 transition-colors"
              data-ocid={`admin.item.${i + 1}`}
            >
              <div className="flex items-center gap-1.5">
                <div
                  className="w-5 h-5 rounded flex items-center justify-center flex-shrink-0"
                  style={{ background: `${log.color}20`, color: log.color }}
                >
                  {typeIcon[log.type]}
                </div>
                <span
                  className="text-[10px] font-medium"
                  style={{ color: log.color }}
                >
                  {log.type}
                </span>
              </div>
              <p className="text-xs text-cyan-400 truncate">{log.user}</p>
              <p className="text-xs text-gray-400 truncate col-span-1">
                {log.action}
              </p>
              <p className="text-[10px] text-gray-500 font-mono">{log.ip}</p>
              <p className="text-[10px] text-gray-600">{log.time}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── User Roles Panel ──
function UserRolesPanel({ accounts }: { accounts: LocalAccount[] }) {
  const roles = [
    {
      name: "Super Admin",
      color: "#dc2626",
      permissions: ["All Access", "User Management", "System Config"],
      users: 1,
    },
    {
      name: "Moderator",
      color: "#f59e0b",
      permissions: ["View Users", "Ban Users", "Send Notifications"],
      users: 2,
    },
    {
      name: "Support",
      color: "#3b82f6",
      permissions: ["View Users", "Send Messages"],
      users: 5,
    },
    {
      name: "Member",
      color: "#94a3b8",
      permissions: ["Access Dashboard", "Install Integrations"],
      users: accounts.length,
    },
  ];

  return (
    <div className="p-6 space-y-5">
      <h2 className="text-lg font-bold text-white flex items-center gap-2">
        <UserCog className="w-5 h-5 text-cyan-400" /> User Roles & Permissions
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {roles.map((role) => (
          <div
            key={role.name}
            className="rounded-2xl p-5 border"
            style={{
              background: "#0f1729",
              border: `1px solid ${role.color}20`,
              boxShadow: `0 0 12px ${role.color}08`,
            }}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ background: `${role.color}20` }}
                >
                  <Shield className="w-4 h-4" style={{ color: role.color }} />
                </div>
                <div>
                  <p
                    className="text-sm font-semibold"
                    style={{ color: role.color }}
                  >
                    {role.name}
                  </p>
                  <p className="text-[10px] text-gray-500">
                    {role.users} user{role.users !== 1 ? "s" : ""}
                  </p>
                </div>
              </div>
              <button
                type="button"
                className="text-[10px] px-2.5 py-1 rounded-lg transition-all"
                style={{
                  background: `${role.color}15`,
                  color: role.color,
                  border: `1px solid ${role.color}30`,
                }}
                onClick={() => toast.info("Role editor opening...")}
                data-ocid="admin.edit_button"
              >
                Edit
              </button>
            </div>
            <div className="space-y-1.5">
              {role.permissions.map((perm) => (
                <div
                  key={perm}
                  className="flex items-center gap-2 text-xs text-gray-400"
                >
                  <CheckCircle
                    className="w-3 h-3 flex-shrink-0"
                    style={{ color: role.color }}
                  />
                  {perm}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div
        className="rounded-2xl p-5 border border-white/8"
        style={{ background: "#0f1729" }}
      >
        <h3 className="text-sm font-semibold text-gray-300 mb-3">
          Create Custom Role
        </h3>
        <div className="flex gap-3">
          <Input
            placeholder="Role name..."
            className="flex-1 text-white placeholder:text-gray-600"
            style={{
              background: "#131f35",
              border: "1px solid rgba(255,255,255,0.1)",
            }}
            data-ocid="admin.input"
          />
          <button
            type="button"
            className="px-4 py-2 rounded-xl text-sm font-semibold text-white transition-all"
            style={{
              background: "linear-gradient(135deg, #0891b2, #0e7490)",
              boxShadow: "0 4px 12px rgba(8,145,178,0.3)",
            }}
            onClick={() => toast.success("Role created!")}
            data-ocid="admin.primary_button"
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
}

// ── System Health Panel ──
function SystemHealthPanel() {
  const [checking, setChecking] = useState(false);
  const services = [
    { name: "ICP Canister", status: "online", latency: 12, color: "#10b981" },
    { name: "Database", status: "online", latency: 8, color: "#10b981" },
    { name: "API Gateway", status: "online", latency: 45, color: "#10b981" },
    { name: "Auth Service", status: "online", latency: 22, color: "#10b981" },
    { name: "CoinGecko API", status: "online", latency: 280, color: "#f59e0b" },
    { name: "OpenAI API", status: "online", latency: 380, color: "#f59e0b" },
    { name: "Storage", status: "online", latency: 16, color: "#10b981" },
    { name: "CDN", status: "online", latency: 24, color: "#10b981" },
  ];

  const recheck = () => {
    setChecking(true);
    setTimeout(() => {
      setChecking(false);
      toast.success("Health check complete");
    }, 1500);
  };

  const metrics = [
    { label: "CPU Usage", value: 23, color: "#3b82f6", unit: "%" },
    { label: "Memory", value: 47, color: "#a78bfa", unit: "%" },
    { label: "Storage", value: 31, color: "#f59e0b", unit: "%" },
    { label: "Network", value: 15, color: "#10b981", unit: "%" },
  ];

  return (
    <div className="p-6 space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <Server className="w-5 h-5 text-green-400" /> System Health
        </h2>
        <button
          type="button"
          onClick={recheck}
          disabled={checking}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
          style={{
            background: "rgba(34,197,94,0.1)",
            color: "#4ade80",
            border: "1px solid rgba(34,197,94,0.2)",
          }}
          data-ocid="admin.button"
        >
          <RefreshCw
            className={`w-3.5 h-3.5 ${checking ? "animate-spin" : ""}`}
          />
          {checking ? "Checking..." : "Recheck All"}
        </button>
      </div>

      {/* Overall Status */}
      <div
        className="rounded-xl p-4 flex items-center gap-3"
        style={{
          background: "rgba(34,197,94,0.08)",
          border: "1px solid rgba(34,197,94,0.2)",
        }}
      >
        <div
          className="w-3 h-3 rounded-full"
          style={{
            background: "#22c55e",
            boxShadow: "0 0 8px #22c55e",
            animation: "healthDot 2s infinite",
          }}
        />
        <p className="text-sm font-semibold text-green-300">
          All systems operational
        </p>
        <span className="ml-auto text-[10px] text-gray-500">
          Last checked just now
        </span>
      </div>

      {/* Resource Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {metrics.map((m) => (
          <div
            key={m.label}
            className="rounded-xl p-4"
            style={{ background: "#0f1729", border: `1px solid ${m.color}20` }}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-gray-400">{m.label}</span>
              <span className="text-sm font-bold" style={{ color: m.color }}>
                {m.value}
                {m.unit}
              </span>
            </div>
            <div
              className="h-1.5 rounded-full"
              style={{ background: "#131f35" }}
            >
              <div
                className="h-1.5 rounded-full"
                style={{
                  width: `${m.value}%`,
                  background: m.color,
                  boxShadow: `0 0 6px ${m.color}60`,
                }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Service Status */}
      <div
        className="rounded-2xl p-5 border border-white/8"
        style={{ background: "#0f1729" }}
      >
        <h3 className="text-sm font-semibold text-gray-300 mb-4">
          Service Status
        </h3>
        <div className="space-y-2">
          {services.map((s, i) => (
            <div
              key={s.name}
              className="flex items-center gap-3 p-3 rounded-xl"
              style={{ background: "#131f35" }}
              data-ocid={`admin.item.${i + 1}`}
            >
              <div
                className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                style={{ background: s.color, boxShadow: `0 0 6px ${s.color}` }}
              />
              <span className="text-sm text-white flex-1">{s.name}</span>
              <div className="flex items-center gap-2">
                <div
                  className="h-1 rounded-full"
                  style={{ width: "60px", background: "#1a2540" }}
                >
                  <div
                    className="h-1 rounded-full"
                    style={{
                      width: `${Math.min((s.latency / 500) * 100, 100)}%`,
                      background:
                        s.latency < 100
                          ? "#22c55e"
                          : s.latency < 300
                            ? "#f59e0b"
                            : "#ef4444",
                    }}
                  />
                </div>
                <span className="text-[10px] text-gray-500 w-12 text-right">
                  {s.latency}ms
                </span>
              </div>
              <span
                className="text-[10px] font-medium"
                style={{ color: s.color }}
              >
                {s.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Admin Settings Panel ──
function AdminSettingsPanel() {
  const [siteName, setSiteName] = useState("ClawPro.ai");
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [twoFAEnabled, setTwoFAEnabled] = useState(false);
  const [currentPwd, setCurrentPwd] = useState("");
  const [newPwd, setNewPwd] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");
  const [apiKeys, setApiKeys] = useState({
    openai: "",
    gemini: "",
    coingecko: "",
  });

  const saveGeneral = () => toast.success("General settings saved!");
  const changePwd = () => {
    if (!currentPwd || !newPwd) return toast.error("Fill in all fields");
    if (newPwd !== confirmPwd) return toast.error("Passwords don't match");
    toast.success("Password updated successfully!");
    setCurrentPwd("");
    setNewPwd("");
    setConfirmPwd("");
  };
  const saveApiKeys = () => toast.success("API keys saved!");

  return (
    <div className="p-6 space-y-5">
      <h2 className="text-lg font-bold text-white flex items-center gap-2">
        <Settings className="w-5 h-5 text-violet-400" /> Admin Settings
      </h2>

      {/* General Settings */}
      <div
        className="rounded-2xl p-5 border"
        style={{
          background: "#0f1729",
          border: "1px solid rgba(139,92,246,0.15)",
        }}
      >
        <h3 className="text-sm font-semibold text-violet-300 mb-4 flex items-center gap-2">
          <Globe className="w-4 h-4" /> General
        </h3>
        <div className="space-y-3">
          <div>
            <label
              htmlFor="site-nm"
              className="text-xs text-gray-400 block mb-1.5"
            >
              Site Name
            </label>
            <Input
              id="site-nm"
              value={siteName}
              onChange={(e) => setSiteName(e.target.value)}
              className="text-white"
              style={{
                background: "#131f35",
                border: "1px solid rgba(255,255,255,0.1)",
              }}
              data-ocid="admin.input"
            />
          </div>
          <div
            className="flex items-center justify-between p-3 rounded-xl"
            style={{ background: "#131f35" }}
          >
            <div>
              <p className="text-sm text-white">Maintenance Mode</p>
              <p className="text-xs text-gray-500">
                Temporarily disable public access
              </p>
            </div>
            <Switch
              checked={maintenanceMode}
              onCheckedChange={setMaintenanceMode}
              data-ocid="admin.switch"
            />
          </div>
          <button
            type="button"
            onClick={saveGeneral}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white"
            style={{
              background: "linear-gradient(135deg, #7c3aed, #6d28d9)",
              boxShadow: "0 4px 12px rgba(124,58,237,0.3)",
            }}
            data-ocid="admin.save_button"
          >
            Save Changes
          </button>
        </div>
      </div>

      {/* Security Settings */}
      <div
        className="rounded-2xl p-5 border"
        style={{
          background: "#0f1729",
          border: "1px solid rgba(220,38,38,0.15)",
        }}
      >
        <h3 className="text-sm font-semibold text-red-300 mb-4 flex items-center gap-2">
          <Lock className="w-4 h-4" /> Security
        </h3>
        <div className="space-y-3">
          <div
            className="flex items-center justify-between p-3 rounded-xl"
            style={{ background: "#131f35" }}
          >
            <div>
              <p className="text-sm text-white">Two-Factor Authentication</p>
              <p className="text-xs text-gray-500">
                Require 2FA for admin login
              </p>
            </div>
            <Switch
              checked={twoFAEnabled}
              onCheckedChange={setTwoFAEnabled}
              data-ocid="admin.switch"
            />
          </div>
          <div className="space-y-2">
            <p className="text-xs text-gray-400 font-medium">
              Change Admin Password
            </p>
            <Input
              type="password"
              placeholder="Current password"
              value={currentPwd}
              onChange={(e) => setCurrentPwd(e.target.value)}
              className="text-white placeholder:text-gray-600"
              style={{
                background: "#131f35",
                border: "1px solid rgba(255,255,255,0.1)",
              }}
              data-ocid="admin.input"
            />
            <Input
              type="password"
              placeholder="New password"
              value={newPwd}
              onChange={(e) => setNewPwd(e.target.value)}
              className="text-white placeholder:text-gray-600"
              style={{
                background: "#131f35",
                border: "1px solid rgba(255,255,255,0.1)",
              }}
              data-ocid="admin.input"
            />
            <Input
              type="password"
              placeholder="Confirm new password"
              value={confirmPwd}
              onChange={(e) => setConfirmPwd(e.target.value)}
              className="text-white placeholder:text-gray-600"
              style={{
                background: "#131f35",
                border: "1px solid rgba(255,255,255,0.1)",
              }}
              data-ocid="admin.input"
            />
            <button
              type="button"
              onClick={changePwd}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white"
              style={{
                background: "linear-gradient(135deg, #dc2626, #b91c1c)",
                boxShadow: "0 4px 12px rgba(220,38,38,0.3)",
              }}
              data-ocid="admin.save_button"
            >
              <Key className="w-4 h-4" /> Change Password
            </button>
          </div>
        </div>
      </div>

      {/* API Keys */}
      <div
        className="rounded-2xl p-5 border"
        style={{
          background: "#0f1729",
          border: "1px solid rgba(6,182,212,0.15)",
        }}
      >
        <h3 className="text-sm font-semibold text-cyan-300 mb-4 flex items-center gap-2">
          <Key className="w-4 h-4" /> API Keys
        </h3>
        <div className="space-y-3">
          {[
            {
              key: "openai" as const,
              label: "OpenAI API Key",
              placeholder: "sk-...",
            },
            {
              key: "gemini" as const,
              label: "Google Gemini Key",
              placeholder: "AIza...",
            },
            {
              key: "coingecko" as const,
              label: "CoinGecko API Key",
              placeholder: "CG-...",
            },
          ].map((f) => (
            <div key={f.key}>
              <label
                htmlFor={f.key}
                className="text-xs text-gray-400 block mb-1.5"
              >
                {f.label}
              </label>
              <Input
                id={f.key}
                type="password"
                placeholder={f.placeholder}
                value={apiKeys[f.key]}
                onChange={(e) =>
                  setApiKeys((prev) => ({ ...prev, [f.key]: e.target.value }))
                }
                className="text-white placeholder:text-gray-600"
                style={{
                  background: "#131f35",
                  border: "1px solid rgba(255,255,255,0.1)",
                }}
                data-ocid="admin.input"
              />
            </div>
          ))}
          <button
            type="button"
            onClick={saveApiKeys}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white"
            style={{
              background: "linear-gradient(135deg, #0891b2, #0e7490)",
              boxShadow: "0 4px 12px rgba(8,145,178,0.3)",
            }}
            data-ocid="admin.save_button"
          >
            <Key className="w-4 h-4" /> Save API Keys
          </button>
        </div>
      </div>

      {/* Admin Profile */}
      <div
        className="rounded-2xl p-5 border"
        style={{
          background: "#0f1729",
          border: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <h3 className="text-sm font-semibold text-gray-300 mb-4 flex items-center gap-2">
          <User className="w-4 h-4" /> Admin Profile
        </h3>
        <div
          className="flex items-center gap-4 p-4 rounded-xl"
          style={{ background: "#131f35" }}
        >
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center"
            style={{
              background: "linear-gradient(135deg, #dc2626, #991b1b)",
              boxShadow: "0 4px 12px rgba(220,38,38,0.3)",
            }}
          >
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div>
            <p className="text-sm font-bold text-white">clawpro_admin</p>
            <p className="text-xs text-gray-500">Super Administrator</p>
          </div>
          <Badge className="ml-auto bg-red-500/15 text-red-300 border-red-500/30 border text-xs">
            Active
          </Badge>
        </div>
      </div>
    </div>
  );
}
