import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, BookOpen, Download, Zap } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useRef } from "react";
import { useLatestVersion, useTotalDownloads } from "../../hooks/useQueries";
import { useLanguage } from "../../i18n/LanguageContext";

function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      alpha: number;
      alphaDir: number;
      rotation: number;
      rotationSpeed: number;
    }> = [];

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();

    for (let i = 0; i < 25; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        size: Math.random() * 4 + 6, // 6–10px draw size
        alpha: Math.random() * 0.4 + 0.1,
        alphaDir: (Math.random() - 0.5) * 0.01,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.04,
      });
    }

    // Load claw image once
    const clawImg = new Image();
    clawImg.src = "/assets/generated/claw-particle-transparent.dim_40x40.png";

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        p.alpha += p.alphaDir;
        p.rotation += p.rotationSpeed;
        if (p.alpha <= 0.05 || p.alpha >= 0.5) p.alphaDir *= -1;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        if (clawImg.complete && clawImg.naturalWidth > 0) {
          ctx.drawImage(clawImg, -p.size / 2, -p.size / 2, p.size, p.size);
        } else {
          // fallback dot while image loads
          ctx.beginPath();
          ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
          ctx.fillStyle = "rgba(0, 212, 255, 1)";
          ctx.fill();
        }
        ctx.globalAlpha = 1;
        ctx.restore();
      }

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 80) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(0, 212, 255, ${0.07 * (1 - dist / 80)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      animId = requestAnimationFrame(draw);
    };

    // Start drawing immediately; image will render once loaded
    clawImg.onload = () => {}; // image loaded, next frame will use it
    draw();

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);

    return () => {
      cancelAnimationFrame(animId);
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ opacity: 0.5 }}
    />
  );
}

function RobotMascot() {
  return (
    <div className="relative flex items-center justify-center">
      {/* Glow halo behind robot */}
      <div
        className="absolute inset-0 rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(0,212,255,0.18) 0%, rgba(0,212,255,0.08) 40%, transparent 70%)",
          filter: "blur(24px)",
        }}
      />
      {/* Pulsing outer ring */}
      <motion.div
        animate={{ scale: [1, 1.08, 1], opacity: [0.2, 0.4, 0.2] }}
        transition={{
          repeat: Number.POSITIVE_INFINITY,
          duration: 3,
          ease: "easeInOut",
        }}
        className="absolute w-[420px] h-[420px] rounded-full border border-cyan/10 pointer-events-none"
      />
      <motion.div
        animate={{ scale: [1, 1.12, 1], opacity: [0.1, 0.2, 0.1] }}
        transition={{
          repeat: Number.POSITIVE_INFINITY,
          duration: 3.5,
          ease: "easeInOut",
          delay: 0.5,
        }}
        className="absolute w-[500px] h-[500px] rounded-full border border-cyan/5 pointer-events-none"
      />
      {/* Robot image with float + rotate animation */}
      <motion.img
        src="/assets/generated/clawpro-robot-mascot-transparent.dim_600x700.png"
        alt="ClawPro Robot Mascot"
        className="relative z-10 w-auto"
        style={{ height: "460px", maxHeight: "460px", objectFit: "contain" }}
        animate={{
          y: [0, -18, 0],
          rotate: [-2, 2, -2],
        }}
        transition={{
          y: {
            repeat: Number.POSITIVE_INFINITY,
            duration: 3,
            ease: "easeInOut",
          },
          rotate: {
            repeat: Number.POSITIVE_INFINITY,
            duration: 3,
            ease: "easeInOut",
          },
        }}
        initial={{ opacity: 0, scale: 0.85, x: 40 }}
        whileInView={{ opacity: 1, scale: 1, x: 0 }}
        viewport={{ once: true }}
        whileHover={{ scale: 1.04 }}
      />
    </div>
  );
}

export function HeroSection() {
  const { data: latestVersion } = useLatestVersion();
  const { data: totalDownloads } = useTotalDownloads();
  const { t } = useLanguage();

  const scrollTo = (id: string) => {
    document.querySelector(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const formattedDownloads = totalDownloads
    ? Number(totalDownloads) > 1000
      ? `${(Number(totalDownloads) / 1000).toFixed(1)}K`
      : totalDownloads.toString()
    : "50K+";

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center overflow-hidden"
    >
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            "url('/assets/generated/openclaw-hero-banner.dim_1200x400.jpg')",
        }}
      />
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/50 to-background" />
      {/* Hex grid */}
      <div className="absolute inset-0 hex-grid-bg opacity-10" />
      {/* Particles */}
      <ParticleField />

      {/* Content: two-column on lg+, stacked on mobile */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-0">
          {/* Left: Text content */}
          <div className="flex-1 flex flex-col items-center lg:items-start text-center lg:text-left">
            {/* Version badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex mb-6"
            >
              <Badge
                variant="outline"
                className="border-cyan/40 text-cyan bg-cyan/10 px-4 py-1.5 text-sm font-mono backdrop-blur-sm"
              >
                <Zap className="w-3.5 h-3.5 mr-1.5 animate-glow-pulse" />v
                {latestVersion ?? "2.4.1"} — {t.hero.badge}
              </Badge>
            </motion.div>

            {/* Main Title */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="font-display font-black text-6xl sm:text-7xl md:text-8xl lg:text-9xl mb-4 leading-none tracking-tighter"
            >
              <span className="text-foreground">Claw</span>
              <span className="text-glow-cyan text-cyan">Pro</span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.25 }}
              className="text-lg sm:text-xl md:text-2xl text-muted-foreground max-w-2xl mb-8 leading-relaxed"
            >
              {t.hero.subtitle}{" "}
              <span className="text-cyan font-semibold">
                v{latestVersion ?? "2.4.1"}
              </span>{" "}
              — Multi-platform. Real-time. Extensible.
            </motion.p>

            {/* Download counter */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.35 }}
              className="flex mb-10"
            >
              <div className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-cyan/30 bg-cyan/5 backdrop-blur-sm animate-border-glow">
                <Download className="w-4 h-4 text-cyan" />
                <span className="text-cyan font-bold font-mono text-lg">
                  {formattedDownloads}
                </span>
                <span className="text-muted-foreground text-sm">
                  {t.hero.downloads}
                </span>
              </div>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.45 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Button
                size="lg"
                onClick={() => scrollTo("#setup")}
                className="bg-cyan text-background hover:bg-cyan-bright font-bold text-base px-8 shadow-glow-md hover:shadow-glow-lg transition-all duration-300 group"
              >
                <Download className="w-5 h-5 mr-2" />
                {t.hero.downloadNow}
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => scrollTo("#docs")}
                className="border-cyan/40 text-cyan hover:bg-cyan/10 hover:border-cyan/70 font-semibold text-base px-8 backdrop-blur-sm transition-all duration-300"
              >
                <BookOpen className="w-5 h-5 mr-2" />
                {t.hero.viewDocs}
              </Button>
            </motion.div>
          </div>

          {/* Right: Robot mascot (desktop) */}
          <motion.div
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
            className="hidden lg:flex flex-1 items-center justify-center"
          >
            <RobotMascot />
          </motion.div>

          {/* Mobile: Robot below CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="flex lg:hidden items-center justify-center w-full"
          >
            <div className="relative flex items-center justify-center">
              <div
                className="absolute inset-0 rounded-full pointer-events-none"
                style={{
                  background:
                    "radial-gradient(ellipse at center, rgba(0,212,255,0.15) 0%, transparent 70%)",
                  filter: "blur(20px)",
                }}
              />
              <motion.img
                src="/assets/generated/clawpro-robot-mascot-transparent.dim_600x700.png"
                alt="ClawPro Robot Mascot"
                className="relative z-10 w-auto"
                style={{ height: "260px", objectFit: "contain" }}
                animate={{ y: [0, -12, 0] }}
                transition={{
                  repeat: Number.POSITIVE_INFINITY,
                  duration: 3,
                  ease: "easeInOut",
                }}
              />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{
            repeat: Number.POSITIVE_INFINITY,
            duration: 1.5,
            ease: "easeInOut",
          }}
          className="w-6 h-10 rounded-full border-2 border-cyan/40 flex items-start justify-center pt-2"
        >
          <div className="w-1.5 h-1.5 rounded-full bg-cyan animate-glow-pulse" />
        </motion.div>
      </motion.div>
    </section>
  );
}
