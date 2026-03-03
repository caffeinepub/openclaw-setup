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
import { useEffect, useState } from "react";
import { SiGoogle } from "react-icons/si";
import { toast } from "sonner";
import { useSaveUserAccount } from "../hooks/useForumQueries";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

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
  const saveAccount = useSaveUserAccount();

  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [fullName, setFullName] = useState(prefillFullName);
  const [handle, setHandle] = useState(prefillHandle);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Sync prefill when modal opens or prefills change
  useEffect(() => {
    if (open) {
      setFullName(prefillFullName);
      setHandle(prefillHandle);
    }
  }, [open, prefillHandle, prefillFullName]);

  const PENDING_ACCOUNT_KEY = "clawpro_pending_account";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
          >
            {/* Spinning gradient border */}
            <div
              className="absolute inset-0 rounded-2xl pointer-events-none"
              style={{
                background:
                  "linear-gradient(135deg, #00c6ff, #0072ff, #7c3aed, #00c6ff)",
                backgroundSize: "300% 300%",
                animation: "borderSpinAcc 3s ease infinite",
                padding: "1.5px",
                zIndex: -1,
              }}
            />

            {/* Modal card */}
            <div
              className="relative rounded-2xl bg-[#030508] p-6 space-y-5"
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

              {/* Header */}
              <div className="flex items-center justify-between relative z-10">
                <div>
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
                          onChange={(e) =>
                            setHandle(
                              e.target.value.replace(/[^a-zA-Z0-9_-]/g, ""),
                            )
                          }
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
                        className={`text-[10px] flex items-center gap-1 ${password === confirmPassword ? "text-emerald-400" : "text-red-400"}`}
                      >
                        {password === confirmPassword ? (
                          <>
                            <CheckCircle2 className="w-3 h-3" /> Passwords match
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
                    disabled={saveAccount.isPending || isLoggingIn}
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
