import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, BookOpen, Download, Zap } from "lucide-react";
import { useEffect, useRef } from "react";
import { useLatestVersion, useTotalDownloads } from "../../hooks/useQueries";
import { useLanguage } from "../../i18n/LanguageContext";

const ORBS = [
  { color: "#00f5ff", r: 160 },
  { color: "#ff3b5c", r: 140 },
  { color: "#a855f7", r: 180 },
  { color: "#3b82f6", r: 130 },
  { color: "#10b981", r: 150 },
  { color: "#f59e0b", r: 120 },
  { color: "#ec4899", r: 170 },
  { color: "#00f5ff", r: 110 },
  { color: "#a855f7", r: 145 },
  { color: "#ff3b5c", r: 135 },
  { color: "#10b981", r: 125 },
  { color: "#3b82f6", r: 155 },
];

function ColorfulBackground() {
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

    // Initialize orb positions and velocities
    const orbs = ORBS.map((orb) => ({
      ...orb,
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      opacity: 0.15 + Math.random() * 0.2,
    }));

    const draw = () => {
      if (!canvas || !ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (const orb of orbs) {
        // Move
        orb.x += orb.vx;
        orb.y += orb.vy;

        // Bounce off edges softly
        if (orb.x < -orb.r) orb.x = canvas.width + orb.r;
        if (orb.x > canvas.width + orb.r) orb.x = -orb.r;
        if (orb.y < -orb.r) orb.y = canvas.height + orb.r;
        if (orb.y > canvas.height + orb.r) orb.y = -orb.r;

        // Draw soft radial gradient blob
        const grad = ctx.createRadialGradient(
          orb.x,
          orb.y,
          0,
          orb.x,
          orb.y,
          orb.r,
        );
        grad.addColorStop(
          0,
          `${orb.color}${Math.round(orb.opacity * 255)
            .toString(16)
            .padStart(2, "0")}`,
        );
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

  return (
    <canvas ref={canvasRef} className="absolute inset-0 w-full h-full z-0" />
  );
}

function RobotMascot() {
  return (
    <div className="relative flex items-center justify-center">
      <img
        src="/assets/generated/clawpro-robot-mascot-transparent.dim_600x700.png"
        alt="ClawPro Robot Mascot"
        className="relative z-10 w-auto animate-float"
        style={{ height: "420px", maxHeight: "420px", objectFit: "contain" }}
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
      {/* Colorful animated background */}
      <ColorfulBackground />

      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat z-[1]"
        style={{
          backgroundImage:
            "url('/assets/generated/openclaw-hero-banner.dim_1200x400.jpg')",
          opacity: 0.25,
        }}
      />
      {/* Dark overlay — slightly transparent to let colors through */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/50 to-background z-[2]" />

      {/* Content: two-column on lg+, stacked on mobile */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-0">
          {/* Left: Text content */}
          <div className="flex-1 flex flex-col items-center lg:items-start text-center lg:text-left">
            {/* Version badge */}
            <div className="flex mb-6">
              <Badge
                variant="outline"
                className="border-cyan/40 text-cyan bg-cyan/10 px-4 py-1.5 text-sm font-mono"
              >
                <Zap className="w-3.5 h-3.5 mr-1.5" />v
                {latestVersion ?? "2.4.1"} — {t.hero.badge}
              </Badge>
            </div>

            {/* Main Title */}
            <h1 className="font-display font-black text-6xl sm:text-7xl md:text-8xl lg:text-9xl mb-4 leading-none tracking-tighter">
              <span className="text-foreground">Claw</span>
              <span className="text-cyan">Pro</span>
            </h1>

            {/* Subtitle */}
            <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground max-w-2xl mb-8 leading-relaxed">
              {t.hero.subtitle}{" "}
              <span className="text-cyan font-semibold">
                v{latestVersion ?? "2.4.1"}
              </span>{" "}
              — Multi-platform. Real-time. Extensible.
            </p>

            {/* Download counter */}
            <div className="flex mb-10">
              <div className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-cyan/30 bg-cyan/5">
                <Download className="w-4 h-4 text-cyan" />
                <span className="text-cyan font-bold font-mono text-lg">
                  {formattedDownloads}
                </span>
                <span className="text-muted-foreground text-sm">
                  {t.hero.downloads}
                </span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                onClick={() => scrollTo("#setup")}
                className="bg-cyan text-background hover:bg-cyan-bright font-bold text-base px-8 transition-colors duration-200 group"
              >
                <Download className="w-5 h-5 mr-2" />
                {t.hero.downloadNow}
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => scrollTo("#docs")}
                className="border-cyan/40 text-cyan hover:bg-cyan/10 hover:border-cyan/70 font-semibold text-base px-8 transition-colors duration-200"
              >
                <BookOpen className="w-5 h-5 mr-2" />
                {t.hero.viewDocs}
              </Button>
            </div>
          </div>

          {/* Right: Robot mascot (desktop) */}
          <div className="hidden lg:flex flex-1 items-center justify-center">
            <RobotMascot />
          </div>

          {/* Mobile: Robot below CTAs */}
          <div className="flex lg:hidden items-center justify-center w-full">
            <img
              src="/assets/generated/clawpro-robot-mascot-transparent.dim_600x700.png"
              alt="ClawPro Robot Mascot"
              className="w-auto animate-float"
              style={{ height: "240px", objectFit: "contain" }}
            />
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
        <div className="w-6 h-10 rounded-full border-2 border-cyan/40 flex items-start justify-center pt-2 animate-float">
          <div className="w-1.5 h-1.5 rounded-full bg-cyan" />
        </div>
      </div>
    </section>
  );
}
