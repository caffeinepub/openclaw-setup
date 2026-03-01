import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ExternalLink, Shield, Star, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef } from "react";

interface PublicProfilePageProps {
  handle: string;
  onClose: () => void;
}

const ORB_CONFIGS = [
  { color: "#00f5ff", r: 200, vx: 0.3, vy: 0.2, opacity: 0.12 },
  { color: "#ff3b5c", r: 160, vx: -0.25, vy: 0.35, opacity: 0.1 },
  { color: "#a855f7", r: 220, vx: 0.2, vy: -0.28, opacity: 0.11 },
  { color: "#10b981", r: 140, vx: -0.35, vy: -0.2, opacity: 0.09 },
  { color: "#3b82f6", r: 180, vx: 0.28, vy: 0.22, opacity: 0.1 },
  { color: "#f59e0b", r: 130, vx: -0.2, vy: 0.3, opacity: 0.08 },
];

function ProfileBackground() {
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

    const orbs = ORB_CONFIGS.map((orb) => ({
      ...orb,
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
    }));

    const draw = () => {
      if (!canvas || !ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const orb of orbs) {
        orb.x += orb.vx;
        orb.y += orb.vy;
        if (orb.x < -orb.r) orb.x = canvas.width + orb.r;
        if (orb.x > canvas.width + orb.r) orb.x = -orb.r;
        if (orb.y < -orb.r) orb.y = canvas.height + orb.r;
        if (orb.y > canvas.height + orb.r) orb.y = -orb.r;
        const grad = ctx.createRadialGradient(
          orb.x,
          orb.y,
          0,
          orb.x,
          orb.y,
          orb.r,
        );
        const hex = Math.round(orb.opacity * 255)
          .toString(16)
          .padStart(2, "0");
        grad.addColorStop(0, `${orb.color}${hex}`);
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

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />;
}

export function PublicProfilePage({ handle, onClose }: PublicProfilePageProps) {
  // Close on Escape key
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const scrollToPricing = () => {
    onClose();
    setTimeout(() => {
      document
        .querySelector("#pricing")
        ?.scrollIntoView({ behavior: "smooth" });
    }, 200);
  };

  const profileUrl = `${window.location.origin}${window.location.pathname}#/u/${handle}`;

  return (
    <AnimatePresence>
      <motion.div
        key="public-profile-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="fixed inset-0 z-[200] flex items-center justify-center"
        style={{ backgroundColor: "oklch(0.06 0.015 240 / 0.95)" }}
      >
        {/* Background orbs */}
        <div className="absolute inset-0 overflow-hidden">
          <ProfileBackground />
        </div>

        {/* Dark overlay gradient */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at center, oklch(0.1 0.03 240 / 0.6) 0%, oklch(0.04 0.01 240 / 0.92) 100%)",
          }}
        />

        {/* Close button */}
        <motion.button
          type="button"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.15 }}
          onClick={onClose}
          className="absolute top-5 right-5 z-10 w-10 h-10 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5 text-white/70" />
        </motion.button>

        {/* Back button */}
        <motion.button
          type="button"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.15 }}
          onClick={onClose}
          className="absolute top-5 left-5 z-10 flex items-center gap-2 text-sm text-white/50 hover:text-white/80 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </motion.button>

        {/* Main profile card */}
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.97 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10 w-full max-w-sm mx-4"
        >
          <div
            className="rounded-3xl border border-white/10 overflow-hidden"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.12 0.025 240 / 0.9) 0%, oklch(0.09 0.02 220 / 0.9) 100%)",
              boxShadow:
                "0 0 60px oklch(0.75 0.18 210 / 0.15), 0 20px 60px oklch(0 0 0 / 0.5)",
              backdropFilter: "blur(20px)",
            }}
          >
            {/* Top accent line */}
            <div
              className="h-0.5 w-full"
              style={{
                background:
                  "linear-gradient(90deg, transparent, oklch(0.75 0.18 210), oklch(0.65 0.2 15), transparent)",
              }}
            />

            <div className="px-8 py-10 flex flex-col items-center text-center gap-6">
              {/* ClawPro logo */}
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="flex items-center gap-1"
              >
                <span className="font-display font-black text-2xl leading-none tracking-tighter text-white">
                  Claw
                </span>
                <span
                  className="font-display font-black text-2xl leading-none tracking-tighter"
                  style={{ color: "oklch(0.75 0.18 210)" }}
                >
                  Pro
                </span>
              </motion.div>

              {/* Avatar / Handle Icon */}
              <motion.div
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.25, type: "spring", stiffness: 180 }}
                className="relative"
              >
                <div
                  className="w-24 h-24 rounded-full flex items-center justify-center text-3xl font-black font-display border-2"
                  style={{
                    background:
                      "radial-gradient(circle, oklch(0.18 0.04 210) 0%, oklch(0.12 0.025 230) 100%)",
                    borderColor: "oklch(0.75 0.18 210 / 0.4)",
                    color: "oklch(0.75 0.18 210)",
                    boxShadow: "0 0 30px oklch(0.75 0.18 210 / 0.2)",
                  }}
                >
                  {handle.charAt(0).toUpperCase()}
                </div>
                {/* Badge indicator */}
                <div
                  className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full flex items-center justify-center border-2"
                  style={{
                    background: "oklch(0.12 0.025 240)",
                    borderColor: "oklch(0.75 0.18 210 / 0.5)",
                  }}
                >
                  <Star
                    className="w-3.5 h-3.5"
                    style={{ color: "oklch(0.75 0.18 210)" }}
                  />
                </div>
              </motion.div>

              {/* Handle display */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="space-y-2"
              >
                <h1
                  className="text-4xl font-black font-display tracking-tight leading-none"
                  style={{ color: "oklch(0.94 0.02 210)" }}
                >
                  @{handle}
                </h1>

                {/* ClawPro.ai/handle badge */}
                <div
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono border"
                  style={{
                    borderColor: "oklch(0.75 0.18 210 / 0.3)",
                    background: "oklch(0.75 0.18 210 / 0.1)",
                    color: "oklch(0.75 0.18 210)",
                  }}
                >
                  <ExternalLink className="w-3 h-3" />
                  ClawPro.ai/{handle}
                </div>
              </motion.div>

              {/* Member badge */}
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
              >
                <Badge
                  className="flex items-center gap-1.5 px-4 py-1.5 text-sm font-semibold border"
                  style={{
                    background: "oklch(0.75 0.18 210 / 0.1)",
                    borderColor: "oklch(0.75 0.18 210 / 0.3)",
                    color: "oklch(0.75 0.18 210)",
                  }}
                >
                  <Shield className="w-3.5 h-3.5" />
                  ClawPro Member
                </Badge>
              </motion.div>

              {/* Profile URL */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="w-full"
              >
                <div
                  className="rounded-xl p-3 text-xs font-mono text-center break-all border"
                  style={{
                    background: "oklch(0.08 0.015 240 / 0.8)",
                    borderColor: "oklch(1 0 0 / 0.06)",
                    color: "oklch(0.65 0.05 210)",
                  }}
                >
                  {profileUrl}
                </div>
              </motion.div>

              {/* Divider */}
              <div
                className="w-full h-px"
                style={{ background: "oklch(1 0 0 / 0.06)" }}
              />

              {/* CTA */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45 }}
                className="w-full space-y-3"
              >
                <p className="text-sm" style={{ color: "oklch(0.6 0.03 210)" }}>
                  Get your own ClawPro handle and join the community
                </p>
                <Button
                  onClick={scrollToPricing}
                  className="w-full font-bold text-sm h-11"
                  style={{
                    background: "oklch(0.75 0.18 210)",
                    color: "oklch(0.08 0.015 240)",
                  }}
                >
                  Join ClawPro
                </Button>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
