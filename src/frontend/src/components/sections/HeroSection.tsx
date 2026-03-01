import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, BookOpen, Download, Zap } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useRef } from "react";
import { useLatestVersion, useTotalDownloads } from "../../hooks/useQueries";

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
    }> = [];

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();

    // Create particles
    for (let i = 0; i < 60; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        size: Math.random() * 2 + 0.5,
        alpha: Math.random() * 0.6 + 0.1,
        alphaDir: (Math.random() - 0.5) * 0.01,
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        p.alpha += p.alphaDir;
        if (p.alpha <= 0.05 || p.alpha >= 0.7) p.alphaDir *= -1;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 212, 255, ${p.alpha})`;
        ctx.fill();
      }

      // Draw connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 100) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(0, 212, 255, ${0.12 * (1 - dist / 100)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      animId = requestAnimationFrame(draw);
    };
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
      style={{ opacity: 0.7 }}
    />
  );
}

export function HeroSection() {
  const { data: latestVersion } = useLatestVersion();
  const { data: totalDownloads } = useTotalDownloads();

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
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
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
      <div className="absolute inset-0 hex-grid-bg opacity-40" />
      {/* Particles */}
      <ParticleField />

      {/* Glow orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-cyan/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/3 right-1/4 w-64 h-64 rounded-full bg-primary/5 blur-3xl pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 text-center pt-16">
        {/* Version badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex justify-center mb-6"
        >
          <Badge
            variant="outline"
            className="border-cyan/40 text-cyan bg-cyan/10 px-4 py-1.5 text-sm font-mono backdrop-blur-sm"
          >
            <Zap className="w-3.5 h-3.5 mr-1.5 animate-glow-pulse" />v
            {latestVersion ?? "2.4.1"} — Latest Release
          </Badge>
        </motion.div>

        {/* Main Title */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="font-display font-black text-6xl sm:text-7xl md:text-8xl lg:text-9xl mb-4 leading-none tracking-tighter"
        >
          <span className="text-glow-cyan text-cyan">Open</span>
          <span className="text-foreground">Claw</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="text-lg sm:text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto mb-8 leading-relaxed"
        >
          The Ultimate Claw Configuration Tool.{" "}
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
          className="flex justify-center mb-10"
        >
          <div className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-cyan/30 bg-cyan/5 backdrop-blur-sm animate-border-glow">
            <Download className="w-4 h-4 text-cyan" />
            <span className="text-cyan font-bold font-mono text-lg">
              {formattedDownloads}
            </span>
            <span className="text-muted-foreground text-sm">Downloads</span>
          </div>
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.45 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Button
            size="lg"
            onClick={() => scrollTo("#setup")}
            className="bg-cyan text-background hover:bg-cyan-bright font-bold text-base px-8 shadow-glow-md hover:shadow-glow-lg transition-all duration-300 group"
          >
            <Download className="w-5 h-5 mr-2" />
            Download Now
            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
          <Button
            size="lg"
            variant="outline"
            onClick={() => scrollTo("#docs")}
            className="border-cyan/40 text-cyan hover:bg-cyan/10 hover:border-cyan/70 font-semibold text-base px-8 backdrop-blur-sm transition-all duration-300"
          >
            <BookOpen className="w-5 h-5 mr-2" />
            View Docs
          </Button>
        </motion.div>

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
      </div>
    </section>
  );
}
