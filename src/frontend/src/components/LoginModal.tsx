import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AtSign, Eye, EyeOff, KeyRound, LogIn, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";

interface LocalAccount {
  handle: string;
  password: string;
  email?: string;
  phone?: string;
  fullName: string;
}

interface LoginModalProps {
  open: boolean;
  onClose: () => void;
  onLoginSuccess: (account: LocalAccount) => void;
  onSwitchToRegister: () => void;
}

function GlowCorner({ position }: { position: "tl" | "tr" | "bl" | "br" }) {
  const posClass = {
    tl: "top-0 left-0",
    tr: "top-0 right-0 rotate-90",
    bl: "bottom-0 left-0 -rotate-90",
    br: "bottom-0 right-0 rotate-180",
  }[position];
  const gradId = `loginCorner-${position}`;
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
      }}
      onFocusCapture={() => setFocused(true)}
      onBlurCapture={() => setFocused(false)}
    >
      {children}
    </div>
  );
}

export function LoginModal({
  open,
  onClose,
  onLoginSuccess,
  onSwitchToRegister,
}: LoginModalProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Forgot password state
  const [showForgot, setShowForgot] = useState(false);
  const [forgotUsername, setForgotUsername] = useState("");
  const [forgotResult, setForgotResult] = useState<string | null>(null);

  const handleForgotLookup = () => {
    const trimmed = forgotUsername.trim().replace(/^@/, "");
    if (!trimmed) return;
    const raw = localStorage.getItem("clawpro_local_accounts");
    const accounts: LocalAccount[] = raw ? JSON.parse(raw) : [];
    const found = accounts.find(
      (a) => a.handle.toLowerCase() === trimmed.toLowerCase(),
    );
    if (!found) {
      setForgotResult("not_found");
    } else {
      setForgotResult(found.password);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimHandle = username.trim().replace(/^@/, "");
    if (!trimHandle || !password) {
      toast.error("Please fill in all fields.");
      return;
    }
    setIsSubmitting(true);
    try {
      const raw = localStorage.getItem("clawpro_local_accounts");
      const accounts: LocalAccount[] = raw ? JSON.parse(raw) : [];
      const found = accounts.find(
        (a) => a.handle.toLowerCase() === trimHandle.toLowerCase(),
      );
      if (!found) {
        toast.error("Username atau password salah.");
        return;
      }
      if (found.password !== password) {
        toast.error("Username atau password salah.");
        return;
      }
      toast.success(`Selamat datang, @${found.handle}!`);
      onLoginSuccess(found);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!open) return null;

  return (
    <AnimatePresence>
      {open && (
        <>
          <style>{`
            @keyframes loginBorderSpin {
              0% { background-position: 0% 50%; }
              50% { background-position: 100% 50%; }
              100% { background-position: 0% 50%; }
            }
            @keyframes fieldBorderSpin {
              0% { background-position: 0% 50%; }
              50% { background-position: 100% 50%; }
              100% { background-position: 0% 50%; }
            }
            @keyframes cornerSpin {
              0% { stroke-dashoffset: 0; opacity: 0.7; }
              50% { opacity: 1; }
              100% { stroke-dashoffset: -100; opacity: 0.7; }
            }
          `}</style>

          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-md"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 24 }}
            transition={{ type: "spring", stiffness: 280, damping: 24 }}
            className="fixed inset-0 z-[101] flex items-center justify-center p-4"
            onClick={(e) => {
              if (e.target === e.currentTarget) onClose();
            }}
          >
            <div
              className="relative w-full max-w-md rounded-2xl overflow-hidden"
              style={{
                background:
                  "linear-gradient(135deg, oklch(0.11 0.02 240), oklch(0.08 0.015 260))",
                boxShadow:
                  "0 0 60px rgba(0,198,255,0.12), 0 0 120px rgba(124,58,237,0.08), 0 8px 40px rgba(0,0,0,0.6)",
              }}
            >
              {/* Spinning gradient border */}
              <div
                className="absolute inset-0 rounded-2xl pointer-events-none"
                style={{
                  padding: "1.5px",
                  background:
                    "linear-gradient(135deg, #00c6ff, #0072ff, #7c3aed, #f59e0b, #00c6ff)",
                  backgroundSize: "300% 300%",
                  animation: "loginBorderSpin 4s linear infinite",
                  WebkitMask:
                    "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                  WebkitMaskComposite: "xor",
                  maskComposite: "exclude",
                  zIndex: 0,
                }}
              />

              <GlowCorner position="tl" />
              <GlowCorner position="tr" />
              <GlowCorner position="bl" />
              <GlowCorner position="br" />

              <div className="relative z-10 p-8">
                <AnimatePresence mode="wait">
                  {!showForgot ? (
                    <motion.div
                      key="login"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.2 }}
                    >
                      {/* Header */}
                      <div className="flex items-center justify-between mb-8">
                        <div>
                          <h2
                            className="text-2xl font-black"
                            style={{
                              background:
                                "linear-gradient(90deg, #00c6ff, #ffffff, #7c3aed)",
                              WebkitBackgroundClip: "text",
                              WebkitTextFillColor: "transparent",
                              backgroundClip: "text",
                            }}
                          >
                            Login to ClawPro
                          </h2>
                          <p className="text-sm text-muted-foreground mt-1">
                            Masukkan username dan password Anda
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={onClose}
                          data-ocid="login.close_button"
                          className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-white/5 transition-colors"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>

                      <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Username */}
                        <div className="space-y-2">
                          <Label className="text-sm font-medium text-muted-foreground">
                            Username / Handle
                          </Label>
                          <FieldWrapper>
                            <div className="relative">
                              <AtSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-cyan/60" />
                              <Input
                                data-ocid="login.username.input"
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="username atau @handle"
                                autoComplete="username"
                                className="pl-9 bg-background/80 border-0 focus-visible:ring-0 focus-visible:ring-offset-0 rounded-[calc(0.5rem-1.5px)] text-foreground placeholder:text-muted-foreground/50"
                              />
                            </div>
                          </FieldWrapper>
                        </div>

                        {/* Password */}
                        <div className="space-y-2">
                          <Label className="text-sm font-medium text-muted-foreground">
                            Password
                          </Label>
                          <FieldWrapper>
                            <div className="relative">
                              <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-cyan/60" />
                              <Input
                                data-ocid="login.password.input"
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Masukkan password"
                                autoComplete="current-password"
                                className="pl-9 pr-10 bg-background/80 border-0 focus-visible:ring-0 focus-visible:ring-offset-0 rounded-[calc(0.5rem-1.5px)] text-foreground placeholder:text-muted-foreground/50"
                              />
                              <button
                                type="button"
                                onClick={() => setShowPassword((v) => !v)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-cyan transition-colors"
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
                          {/* Forgot password link */}
                          <div className="flex justify-end">
                            <button
                              type="button"
                              data-ocid="login.forgot_password.button"
                              onClick={() => {
                                setShowForgot(true);
                                setForgotUsername("");
                                setForgotResult(null);
                              }}
                              className="text-xs text-cyan-400/70 hover:text-cyan-400 transition-colors underline underline-offset-2"
                            >
                              Lupa Password?
                            </button>
                          </div>
                        </div>

                        {/* Submit */}
                        <div className="pt-2">
                          <Button
                            type="submit"
                            data-ocid="login.submit_button"
                            disabled={isSubmitting}
                            className="w-full h-11 font-bold text-base relative overflow-hidden"
                            style={{
                              background:
                                "linear-gradient(135deg, #00c6ff, #0072ff, #7c3aed)",
                              backgroundSize: "200% 200%",
                              animation: "loginBorderSpin 3s ease infinite",
                              color: "white",
                              boxShadow:
                                "0 0 20px rgba(0,198,255,0.35), 0 0 40px rgba(124,58,237,0.2)",
                            }}
                          >
                            <LogIn className="w-4 h-4 mr-2" />
                            {isSubmitting ? "Memverifikasi..." : "Login"}
                          </Button>
                        </div>
                      </form>

                      {/* Switch to register */}
                      <p className="text-center text-sm text-muted-foreground mt-6">
                        Belum punya akun?{" "}
                        <button
                          type="button"
                          onClick={onSwitchToRegister}
                          className="text-cyan hover:text-cyan-bright font-semibold underline underline-offset-2 transition-colors"
                        >
                          Daftar sekarang
                        </button>
                      </p>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="forgot"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.2 }}
                    >
                      {/* Forgot password header */}
                      <div className="flex items-center justify-between mb-8">
                        <div>
                          <h2
                            className="text-2xl font-black"
                            style={{
                              background:
                                "linear-gradient(90deg, #f59e0b, #ef4444, #7c3aed)",
                              WebkitBackgroundClip: "text",
                              WebkitTextFillColor: "transparent",
                              backgroundClip: "text",
                            }}
                          >
                            Lupa Password
                          </h2>
                          <p className="text-sm text-muted-foreground mt-1">
                            Masukkan username untuk melihat password Anda
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={onClose}
                          data-ocid="login.forgot.close_button"
                          className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-white/5 transition-colors"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>

                      <div className="space-y-5">
                        {/* Username input */}
                        <div className="space-y-2">
                          <Label className="text-sm font-medium text-muted-foreground">
                            Username / Handle
                          </Label>
                          <FieldWrapper>
                            <div className="relative">
                              <AtSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-400/60" />
                              <Input
                                data-ocid="login.forgot.username.input"
                                type="text"
                                value={forgotUsername}
                                onChange={(e) => {
                                  setForgotUsername(e.target.value);
                                  setForgotResult(null);
                                }}
                                placeholder="username atau @handle"
                                className="pl-9 bg-background/80 border-0 focus-visible:ring-0 focus-visible:ring-offset-0 rounded-[calc(0.5rem-1.5px)] text-foreground placeholder:text-muted-foreground/50"
                              />
                            </div>
                          </FieldWrapper>
                        </div>

                        {/* Lookup button */}
                        <Button
                          type="button"
                          data-ocid="login.forgot.submit_button"
                          onClick={handleForgotLookup}
                          disabled={!forgotUsername.trim()}
                          className="w-full h-10 font-semibold"
                          style={{
                            background:
                              "linear-gradient(135deg, #f59e0b, #ef4444)",
                            color: "white",
                            boxShadow: "0 0 16px rgba(245,158,11,0.3)",
                          }}
                        >
                          Cari Akun
                        </Button>

                        {/* Result */}
                        <AnimatePresence>
                          {forgotResult !== null && (
                            <motion.div
                              initial={{ opacity: 0, y: -8 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -8 }}
                              className="rounded-xl p-4 border"
                              style={{
                                background:
                                  forgotResult === "not_found"
                                    ? "rgba(239,68,68,0.1)"
                                    : "rgba(0,198,255,0.08)",
                                borderColor:
                                  forgotResult === "not_found"
                                    ? "rgba(239,68,68,0.4)"
                                    : "rgba(0,198,255,0.3)",
                              }}
                            >
                              {forgotResult === "not_found" ? (
                                <div className="flex items-center gap-2 text-red-400">
                                  <X className="w-4 h-4 flex-shrink-0" />
                                  <span className="text-sm font-medium">
                                    Akun tidak ditemukan
                                  </span>
                                </div>
                              ) : (
                                <div className="space-y-1">
                                  <p className="text-xs text-muted-foreground">
                                    Password untuk @
                                    {forgotUsername.replace(/^@/, "")}:
                                  </p>
                                  <p
                                    className="text-base font-bold tracking-widest"
                                    style={{
                                      color: "#00c6ff",
                                      textShadow:
                                        "0 0 10px rgba(0,198,255,0.5)",
                                    }}
                                  >
                                    {forgotResult}
                                  </p>
                                </div>
                              )}
                            </motion.div>
                          )}
                        </AnimatePresence>

                        {/* Back to login */}
                        <button
                          type="button"
                          data-ocid="login.forgot.back.button"
                          onClick={() => {
                            setShowForgot(false);
                            setForgotResult(null);
                            setForgotUsername("");
                          }}
                          className="w-full text-center text-sm text-cyan-400/70 hover:text-cyan-400 transition-colors underline underline-offset-2"
                        >
                          ← Kembali ke Login
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
