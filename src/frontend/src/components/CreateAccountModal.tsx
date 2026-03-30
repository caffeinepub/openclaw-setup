import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  AtSign,
  CheckCircle2,
  Eye,
  EyeOff,
  KeyRound,
  Loader2,
  LogIn,
  Mail,
  Phone,
  ShieldCheck,
  User,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { SiGoogle } from "react-icons/si";
import { toast } from "sonner";
import { useActor } from "../hooks/useActor";
import { useSaveUserAccount } from "../hooks/useForumQueries";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { LobsterPopupCard } from "./LobsterPopupCard";

async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(`${password}clawpro_salt_2026`);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

interface CreateAccountModalProps {
  open: boolean;
  onClose: () => void;
  prefillHandle?: string;
  prefillFullName?: string;
}

function GlowCorner({ position }: { position: "tl" | "tr" | "bl" | "br" }) {
  const posClass = {
    tl: "top-0 left-0",
    tr: "top-0 right-0 rotate-90",
    bl: "bottom-0 left-0 -rotate-90",
    br: "bottom-0 right-0 rotate-180",
  }[position];

  const gradId = `createAccCorner-${position}`;
  return (
    <span
      className={`absolute ${posClass} w-8 h-8 pointer-events-none`}
      style={{ zIndex: 2 }}
    >
      <svg
        width="32"
        height="32"
        viewBox="0 0 32 32"
        fill="none"
        aria-hidden="true"
        role="presentation"
      >
        <defs>
          <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00c6ff" />
            <stop offset="40%" stopColor="#0072ff" />
            <stop offset="100%" stopColor="#7c3aed" />
          </linearGradient>
        </defs>
        <path
          d="M2 30 L2 6 Q2 2 6 2 L30 2"
          stroke={`url(#${gradId})`}
          strokeWidth="2.5"
          strokeLinecap="round"
          style={{
            filter:
              "drop-shadow(0 0 6px #00c6ff) drop-shadow(0 0 14px #7c3aed)",
            animation: "cornerSpin 3s linear infinite",
          }}
        />
      </svg>
    </span>
  );
}

// Pre-computed confetti particle data - stable keys, no array index
const CONFETTI_PARTICLES = [
  { id: "cp-a", color: "#00c6ff", angle: 0, dist: 80, big: true },
  { id: "cp-b", color: "#7c3aed", angle: 15, dist: 100, big: false },
  { id: "cp-c", color: "#f59e0b", angle: 30, dist: 120, big: false },
  { id: "cp-d", color: "#10b981", angle: 45, dist: 80, big: true },
  { id: "cp-e", color: "#f43f5e", angle: 60, dist: 100, big: false },
  { id: "cp-f", color: "#818cf8", angle: 75, dist: 100, big: false },
  { id: "cp-g", color: "#22d3ee", angle: 90, dist: 80, big: true },
  { id: "cp-h", color: "#fbbf24", angle: 105, dist: 120, big: false },
  { id: "cp-i", color: "#00c6ff", angle: 120, dist: 100, big: false },
  { id: "cp-j", color: "#7c3aed", angle: 135, dist: 80, big: true },
  { id: "cp-k", color: "#f59e0b", angle: 150, dist: 100, big: false },
  { id: "cp-l", color: "#10b981", angle: 165, dist: 120, big: false },
  { id: "cp-m", color: "#f43f5e", angle: 180, dist: 80, big: true },
  { id: "cp-n", color: "#818cf8", angle: 195, dist: 100, big: false },
  { id: "cp-o", color: "#22d3ee", angle: 210, dist: 100, big: false },
  { id: "cp-p", color: "#fbbf24", angle: 225, dist: 80, big: true },
  { id: "cp-q", color: "#00c6ff", angle: 240, dist: 120, big: false },
  { id: "cp-r", color: "#7c3aed", angle: 255, dist: 100, big: false },
  { id: "cp-s", color: "#f59e0b", angle: 270, dist: 80, big: true },
  { id: "cp-t", color: "#10b981", angle: 285, dist: 100, big: false },
  { id: "cp-u", color: "#f43f5e", angle: 300, dist: 120, big: false },
  { id: "cp-v", color: "#818cf8", angle: 315, dist: 80, big: true },
  { id: "cp-w", color: "#22d3ee", angle: 330, dist: 100, big: false },
  { id: "cp-x", color: "#fbbf24", angle: 345, dist: 100, big: false },
] as const;

const CONFETTI_KEYFRAMES = CONFETTI_PARTICLES.map((p, idx) => {
  const rad = (p.angle * Math.PI) / 180;
  const tx = Math.cos(rad) * p.dist;
  const ty = Math.sin(rad) * p.dist;
  return `@keyframes confettiP${idx} { 0%{transform:translate(-50%,-50%) scale(1.2);opacity:1} 100%{transform:translate(calc(-50% + ${tx}px), calc(-50% + ${ty}px)) scale(0.2) rotate(${idx * 45}deg);opacity:0} }`;
}).join("\n");

function ConfettiBurst() {
  return (
    <div
      className="absolute inset-0 pointer-events-none rounded-2xl"
      style={{ zIndex: 50, overflow: "hidden" }}
    >
      {CONFETTI_PARTICLES.map((p, idx) => (
        <div
          key={p.id}
          style={{
            position: "absolute",
            left: "50%",
            top: "42%",
            width: p.big ? 10 : 7,
            height: p.big ? 10 : 7,
            borderRadius: p.big ? "50%" : 2,
            background: p.color,
            transform: "translate(-50%, -50%)",
            animation: `confettiP${idx} 1.2s ease-out forwards`,
            boxShadow: `0 0 6px ${p.color}`,
          }}
        />
      ))}
      <style>{CONFETTI_KEYFRAMES}</style>
    </div>
  );
}

function FieldWrapper({ children }: { children: React.ReactNode }) {
  const [focused, setFocused] = useState(false);
  return (
    <div
      className="relative rounded-lg p-[1.5px] transition-all duration-300"
      style={{
        background: focused
          ? "linear-gradient(135deg, #00c6ff, #0072ff, #7c3aed, #00c6ff)"
          : "linear-gradient(135deg, rgba(0,198,255,0.25), rgba(124,58,237,0.2))",
        backgroundSize: "300% 300%",
        animation: focused ? "fieldBorderSpin 2s linear infinite" : "none",
        boxShadow: focused ? "0 0 16px rgba(0,114,255,0.4)" : "none",
      }}
      onFocusCapture={() => setFocused(true)}
      onBlurCapture={() => setFocused(false)}
    >
      {children}
    </div>
  );
}

export function CreateAccountModal({
  open,
  onClose,
  prefillHandle = "",
  prefillFullName = "",
}: CreateAccountModalProps) {
  const { login, isLoggingIn, identity } = useInternetIdentity();
  const { actor } = useActor();
  const saveAccount = useSaveUserAccount();

  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [fullName, setFullName] = useState(prefillFullName);
  const [handle, setHandle] = useState(prefillHandle);
  const [handleTaken, setHandleTaken] = useState<"taken" | "available" | null>(
    null,
  );
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [showLobsterPopup, setShowLobsterPopup] = useState(false);
  const [confettiBurst, setConfettiBurst] = useState(false);
  const prevMatchRef = useRef(false);

  // Confetti burst when passwords match
  useEffect(() => {
    const nowMatch =
      password === confirmPassword &&
      confirmPassword.length >= 8 &&
      password.length >= 8;
    if (nowMatch && !prevMatchRef.current) {
      setConfettiBurst(true);
      const timer = setTimeout(() => setConfettiBurst(false), 1200);
      prevMatchRef.current = true;
      return () => clearTimeout(timer);
    }
    if (!nowMatch) {
      prevMatchRef.current = false;
    }
  }, [password, confirmPassword]);

  // Sync prefill when modal opens or prefills change
  useEffect(() => {
    if (open) {
      setFullName(prefillFullName);
      setHandle(prefillHandle);
    }
  }, [open, prefillHandle, prefillFullName]);

  const PENDING_ACCOUNT_KEY = "clawpro_pending_account";

  const checkHandleAvailability = async (val: string) => {
    if (val.length < 3) {
      setHandleTaken(null);
      return;
    }
    // Try backend first
    if (actor) {
      try {
        // @ts-ignore
        const available = await (actor as any).isHandleAvailable(val);
        setHandleTaken(available ? "available" : "taken");
        return;
      } catch {
        // fall through to localStorage
      }
    }
    // Fallback: localStorage
    try {
      const accounts: Array<{ handle?: string; username?: string }> =
        JSON.parse(localStorage.getItem("clawpro_accounts") || "[]");
      const localAccounts: Array<{ handle?: string }> = JSON.parse(
        localStorage.getItem("clawpro_local_accounts") || "[]",
      );
      const allAccounts = [...accounts, ...localAccounts];
      const taken = allAccounts.some(
        (a) => a.handle?.toLowerCase() === val.toLowerCase(),
      );
      setHandleTaken(taken ? "taken" : "available");
    } catch {
      setHandleTaken(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Registration temporarily disabled — show waitlist popup
    setShowLobsterPopup(true);
    if (true as boolean) return; // biome-ignore: temporary registration blocker — remove when open
    const trimHandle = handle.trim().replace(/[^a-zA-Z0-9_-]/g, "");
    if (!email.trim() || !phone.trim() || !fullName.trim() || !trimHandle) {
      toast.error("Please fill in all required fields.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error("Please enter a valid email address.");
      return;
    }
    if (password.length < 8) {
      toast.error("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    // Check handle availability one more time before submitting
    if (actor) {
      try {
        // @ts-ignore
        const isAvail = await (actor as any).isHandleAvailable(trimHandle);
        if (!isAvail) {
          toast.error("Username sudah digunakan, pilih yang lain.");
          setHandleTaken("taken");
          return;
        }
      } catch {
        // fallback check localStorage
        const localAccRaw = localStorage.getItem("clawpro_local_accounts");
        const localAcc: Array<{ handle: string }> = localAccRaw
          ? JSON.parse(localAccRaw)
          : [];
        const taken = localAcc.some(
          (a) => a.handle.toLowerCase() === trimHandle.toLowerCase(),
        );
        if (taken) {
          toast.error("Username sudah digunakan, pilih yang lain.");
          setHandleTaken("taken");
          return;
        }
      }
    }

    const hashedPwd = await hashPassword(password);

    // Try backend registration first
    if (actor) {
      try {
        // @ts-ignore
        const regResult = await (actor as any).registerLocalAccount(
          trimHandle,
          hashedPwd,
          email.trim(),
          phone.trim(),
          fullName.trim(),
        );
        if (
          regResult &&
          ("handleTaken" in regResult || "alreadyExists" in regResult)
        ) {
          toast.error("Username sudah digunakan, pilih yang lain.");
          setHandleTaken("taken");
          return;
        }
        // Success from backend - also save to localStorage as backup
        const existingRaw = localStorage.getItem("clawpro_local_accounts");
        const existing = existingRaw ? JSON.parse(existingRaw) : [];
        const filtered = existing.filter(
          (a: { handle: string }) =>
            a.handle.toLowerCase() !== trimHandle.toLowerCase(),
        );
        filtered.push({
          handle: trimHandle,
          password,
          email: email.trim(),
          phone: phone.trim(),
          fullName: fullName.trim(),
          createdAt: new Date().toISOString(),
        });
        localStorage.setItem(
          "clawpro_local_accounts",
          JSON.stringify(filtered),
        );
        // Also update handle list
        const accRaw = localStorage.getItem("clawpro_accounts");
        const acc: Array<{ handle: string }> = accRaw ? JSON.parse(accRaw) : [];
        if (
          !acc.some((a) => a.handle.toLowerCase() === trimHandle.toLowerCase())
        ) {
          acc.push({ handle: trimHandle });
          localStorage.setItem("clawpro_accounts", JSON.stringify(acc));
        }
        setSubmitted(true);
        toast.success("Account created successfully! Welcome to ClawPro.");
        setTimeout(onClose, 1500);
        return;
      } catch {
        // Fall through to ICP identity flow
      }
    }

    if (!identity) {
      // User not logged in — store data and trigger login
      localStorage.setItem(
        PENDING_ACCOUNT_KEY,
        JSON.stringify({
          email: email.trim(),
          phone: phone.trim(),
          fullName: fullName.trim(),
          handle: trimHandle,
        }),
      );
      // Save credentials for local login
      const existingRaw1 = localStorage.getItem("clawpro_local_accounts");
      const existing1 = existingRaw1 ? JSON.parse(existingRaw1) : [];
      const newAccounts1 = existing1.filter(
        (a: { handle: string }) =>
          a.handle.toLowerCase() !== trimHandle.toLowerCase(),
      );
      newAccounts1.push({
        handle: trimHandle,
        password,
        email: email.trim(),
        phone: phone.trim(),
        fullName: fullName.trim(),
        createdAt: new Date().toISOString(),
      });
      localStorage.setItem(
        "clawpro_local_accounts",
        JSON.stringify(newAccounts1),
      );
      toast.info("Please complete ICP login to create your account");
      login();
      onClose();
      return;
    }

    try {
      await saveAccount.mutateAsync({
        email: email.trim(),
        phone: phone.trim(),
        fullName: fullName.trim(),
        handle: trimHandle,
      });
      // Save credentials for local login
      const existingRaw2 = localStorage.getItem("clawpro_local_accounts");
      const existing2 = existingRaw2 ? JSON.parse(existingRaw2) : [];
      const newAccounts2 = existing2.filter(
        (a: { handle: string }) =>
          a.handle.toLowerCase() !== trimHandle.toLowerCase(),
      );
      newAccounts2.push({
        handle: trimHandle,
        password,
        email: email.trim(),
        phone: phone.trim(),
        fullName: fullName.trim(),
      });
      localStorage.setItem(
        "clawpro_local_accounts",
        JSON.stringify(newAccounts2),
      );
      setSubmitted(true);
      toast.success("Account created successfully! Welcome to ClawPro.");
      setTimeout(onClose, 1500);
    } catch {
      toast.error("Failed to create account. Please try again.");
    }
  };

  const handleGoogleLogin = () => {
    toast.info("Google login coming soon!");
  };

  if (showLobsterPopup) {
    return (
      <LobsterPopupCard
        handle={handle}
        onClose={() => setShowLobsterPopup(false)}
      />
    );
  }

  if (!open) return null;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) onClose();
          }}
          data-ocid="create-account.modal"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
            style={{
              boxShadow:
                "0 0 60px rgba(0,114,255,0.35), 0 0 120px rgba(124,58,237,0.2), 0 30px 80px rgba(0,0,0,0.7)",
            }}
          >
            {/* Spinning gradient border */}
            <div
              className="absolute inset-0 rounded-2xl pointer-events-none"
              style={{
                background:
                  "linear-gradient(135deg, #00c6ff, #0072ff, #7c3aed, #f59e0b, #00c6ff)",
                backgroundSize: "300% 300%",
                animation: "borderSpinAcc 3s ease infinite",
                padding: "2px",
                zIndex: -1,
              }}
            />

            {/* Modal card */}
            <div
              className="relative rounded-2xl bg-[#030508] p-6 space-y-5 overflow-hidden"
              style={{
                boxShadow:
                  "0 0 40px rgba(0,114,255,0.2), 0 0 80px rgba(124,58,237,0.12), 0 20px 60px rgba(0,0,0,0.6)",
                border: "1.5px solid rgba(0,198,255,0.18)",
              }}
            >
              {/* Corner glows */}
              <GlowCorner position="tl" />
              <GlowCorner position="tr" />
              <GlowCorner position="bl" />
              <GlowCorner position="br" />

              {/* Confetti burst overlay */}
              {confettiBurst && <ConfettiBurst />}

              {/* Header */}
              <div className="flex items-center justify-between relative z-10">
                <div>
                  {/* ClawPro.ai glowing brand text */}
                  <div className="flex items-center mb-1">
                    <span
                      style={{
                        fontSize: "0.95rem",
                        fontWeight: 900,
                        letterSpacing: "0.06em",
                        background:
                          "linear-gradient(90deg, #00c6ff 0%, #0072ff 20%, #7c3aed 45%, #f59e0b 70%, #00c6ff 100%)",
                        backgroundSize: "200% auto",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        animation: "clawproHeaderShimmer 2.5s linear infinite",
                        display: "inline-block",
                      }}
                    >
                      ClawPro.ai
                    </span>
                  </div>
                  <h2
                    className="text-xl font-black text-white"
                    style={{
                      textShadow: "0 0 20px rgba(0,198,255,0.5)",
                    }}
                  >
                    Create Account
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Join ClawPro — your automation powerhouse
                  </p>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-white hover:bg-white/8 transition-colors"
                  data-ocid="create-account.close_button"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {submitted ? (
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="flex flex-col items-center gap-3 py-8"
                >
                  <div
                    className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center"
                    style={{ boxShadow: "0 0 30px rgba(52,211,153,0.4)" }}
                  >
                    <CheckCircle2 className="w-8 h-8 text-emerald-400" />
                  </div>
                  <p className="text-emerald-300 font-semibold text-lg">
                    Account Created!
                  </p>
                  <p className="text-slate-400 text-sm text-center">
                    Welcome to ClawPro, {fullName}! Redirecting...
                  </p>
                </motion.div>
              ) : (
                <form
                  onSubmit={handleSubmit}
                  className="space-y-4 relative z-10"
                >
                  {/* Full Name */}
                  <div className="space-y-1.5">
                    <Label className="text-xs text-slate-400 flex items-center gap-1.5">
                      <User className="w-3 h-3" />
                      Full Name <span className="text-cyan-400">*</span>
                    </Label>
                    <FieldWrapper>
                      <Input
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Your full name"
                        required
                        className="bg-[#0a0f1a] border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-white placeholder:text-slate-600 h-10"
                        data-ocid="create-account.input"
                        autoComplete="name"
                      />
                    </FieldWrapper>
                  </div>

                  {/* Username / Handle */}
                  <div className="space-y-1.5">
                    <Label className="text-xs text-slate-400 flex items-center gap-1.5">
                      <AtSign className="w-3 h-3" />
                      Username / Handle <span className="text-cyan-400">*</span>
                    </Label>
                    <FieldWrapper>
                      <div className="flex items-center rounded-lg bg-[#0a0f1a] overflow-hidden">
                        <span className="px-3 py-2 text-xs font-mono text-cyan-400/70 bg-cyan-500/8 border-r border-cyan-500/15 whitespace-nowrap flex-shrink-0">
                          ClawPro.ai/
                        </span>
                        <input
                          type="text"
                          value={handle}
                          onChange={(e) => {
                            const v = e.target.value.replace(
                              /[^a-zA-Z0-9_-]/g,
                              "",
                            );
                            setHandle(v);
                            void checkHandleAvailability(v);
                          }}
                          placeholder="your-handle"
                          required
                          className="flex-1 bg-transparent px-3 py-2.5 text-sm text-white placeholder:text-slate-600 outline-none font-mono"
                          data-ocid="create-account.input"
                          autoComplete="username"
                        />
                      </div>
                    </FieldWrapper>
                    <p className="text-[10px] text-slate-600">
                      Letters, numbers, hyphens and underscores only.
                    </p>
                    {handleTaken === "taken" && (
                      <p
                        className="text-[11px] text-red-500 flex items-center gap-1 font-medium"
                        data-ocid="create-account.error_state"
                      >
                        ⚠ Already taken — please choose another handle
                      </p>
                    )}
                    {handleTaken === "available" && (
                      <p
                        className="text-[11px] text-green-500 flex items-center gap-1 font-medium"
                        data-ocid="create-account.success_state"
                      >
                        ✓ Available!
                      </p>
                    )}
                  </div>

                  {/* Email */}
                  <div className="space-y-1.5">
                    <Label className="text-xs text-slate-400 flex items-center gap-1.5">
                      <Mail className="w-3 h-3" />
                      Email Address <span className="text-cyan-400">*</span>
                    </Label>
                    <FieldWrapper>
                      <Input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        required
                        className="bg-[#0a0f1a] border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-white placeholder:text-slate-600 h-10"
                        data-ocid="create-account.input"
                        autoComplete="email"
                      />
                    </FieldWrapper>
                  </div>

                  {/* Phone */}
                  <div className="space-y-1.5">
                    <Label className="text-xs text-slate-400 flex items-center gap-1.5">
                      <Phone className="w-3 h-3" />
                      Phone Number <span className="text-cyan-400">*</span>
                    </Label>
                    <FieldWrapper>
                      <Input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+62 xxx xxxx xxxx"
                        required
                        className="bg-[#0a0f1a] border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-white placeholder:text-slate-600 h-10"
                        data-ocid="create-account.input"
                        autoComplete="tel"
                      />
                    </FieldWrapper>
                  </div>

                  {/* Password */}
                  <div className="space-y-1.5">
                    <Label className="text-xs text-slate-400 flex items-center gap-1.5">
                      <KeyRound className="w-3 h-3" />
                      Password <span className="text-cyan-400">*</span>
                    </Label>
                    <FieldWrapper>
                      <div className="flex items-center rounded-lg bg-[#0a0f1a] overflow-hidden">
                        <Input
                          type={showPassword ? "text" : "password"}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="Min. 8 characters"
                          required
                          className="flex-1 bg-transparent border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-white placeholder:text-slate-600 h-10"
                          data-ocid="create-account.input"
                          autoComplete="new-password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="px-3 text-slate-500 hover:text-slate-300 transition-colors flex-shrink-0"
                          tabIndex={-1}
                        >
                          {showPassword ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </FieldWrapper>
                    {password.length > 0 && (
                      <div className="flex gap-1 mt-1">
                        {([1, 2, 3, 4] as const).map((bar) => {
                          const strength =
                            password.length >= 12
                              ? 4
                              : password.length >= 10
                                ? 3
                                : password.length >= 8
                                  ? 2
                                  : 1;
                          const i = bar - 1;
                          return (
                            <div
                              key={bar}
                              className="flex-1 h-1 rounded-full transition-all duration-300"
                              style={{
                                background:
                                  i < strength
                                    ? strength >= 4
                                      ? "#10b981"
                                      : strength >= 3
                                        ? "#22c55e"
                                        : strength >= 2
                                          ? "#f59e0b"
                                          : "#ef4444"
                                    : "rgba(255,255,255,0.1)",
                              }}
                            />
                          );
                        })}
                        <span className="text-[10px] text-slate-500 ml-1 whitespace-nowrap">
                          {password.length >= 12
                            ? "Strong"
                            : password.length >= 10
                              ? "Good"
                              : password.length >= 8
                                ? "Fair"
                                : "Weak"}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Confirm Password */}
                  <div className="space-y-1.5">
                    <Label className="text-xs text-slate-400 flex items-center gap-1.5">
                      <ShieldCheck className="w-3 h-3" />
                      Confirm Password <span className="text-cyan-400">*</span>
                    </Label>
                    <FieldWrapper>
                      <div className="flex items-center rounded-lg bg-[#0a0f1a] overflow-hidden">
                        <Input
                          type={showConfirmPassword ? "text" : "password"}
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="Re-enter your password"
                          required
                          className="flex-1 bg-transparent border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-white placeholder:text-slate-600 h-10"
                          data-ocid="create-account.input"
                          autoComplete="new-password"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                          className="px-3 text-slate-500 hover:text-slate-300 transition-colors flex-shrink-0"
                          tabIndex={-1}
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </FieldWrapper>
                    {confirmPassword.length > 0 && (
                      <p
                        className={`text-[10px] flex items-center gap-1 transition-all duration-300 ${password === confirmPassword ? "text-emerald-400" : "text-red-400"}`}
                      >
                        {password === confirmPassword ? (
                          <>
                            <CheckCircle2 className="w-3 h-3" /> Passwords match
                            ✨
                          </>
                        ) : (
                          <>
                            <X className="w-3 h-3" /> Passwords do not match
                          </>
                        )}
                      </p>
                    )}
                  </div>

                  {/* Submit */}
                  <Button
                    type="submit"
                    disabled={
                      saveAccount.isPending ||
                      isLoggingIn ||
                      handleTaken === "taken"
                    }
                    className="w-full h-11 font-bold relative overflow-hidden transition-all"
                    data-ocid="create-account.submit_button"
                    style={{
                      background:
                        "linear-gradient(135deg, #00c6ff, #0072ff, #7c3aed)",
                      color: "#fff",
                      border: "1px solid rgba(0,198,255,0.4)",
                      boxShadow:
                        "0 0 20px rgba(0,114,255,0.5), 0 0 40px rgba(124,58,237,0.3)",
                      animation: "btnPulseAcc 2s ease-in-out infinite",
                    }}
                  >
                    {saveAccount.isPending ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Creating account...
                      </>
                    ) : !identity ? (
                      <>
                        <LogIn className="w-4 h-4 mr-2" />
                        Create Account & Login
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4 mr-2" />
                        Create Account
                      </>
                    )}
                  </Button>

                  {/* Divider */}
                  <div className="relative flex items-center gap-3 py-1">
                    <div className="flex-1 h-px bg-white/8" />
                    <span className="text-xs text-slate-500 font-medium px-2">
                      OR
                    </span>
                    <div className="flex-1 h-px bg-white/8" />
                  </div>

                  {/* Google Login */}
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleGoogleLogin}
                    className="w-full h-11 border-white/12 bg-white/4 hover:bg-white/8 text-slate-300 hover:text-white font-semibold gap-2 transition-all"
                    data-ocid="create-account.secondary_button"
                  >
                    <SiGoogle className="w-4 h-4 text-[#4285F4]" />
                    Login with Google
                  </Button>
                </form>
              )}
            </div>
          </motion.div>

          <style>{`
            @keyframes clawproHeaderShimmer {
              0% { background-position: 0% center; }
              100% { background-position: 200% center; }
            }
            @keyframes borderSpinAcc {
              0% { background-position: 0% 50%; }
              50% { background-position: 100% 50%; }
              100% { background-position: 0% 50%; }
            }
            @keyframes fieldBorderSpin {
              0% { background-position: 0% 50%; }
              100% { background-position: 300% 50%; }
            }
            @keyframes btnPulseAcc {
              0%, 100% { box-shadow: 0 0 20px rgba(0,114,255,0.5), 0 0 40px rgba(124,58,237,0.3); }
              50% { box-shadow: 0 0 35px rgba(0,198,255,0.7), 0 0 60px rgba(124,58,237,0.5); }
            }
          `}</style>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
