import { useEffect, useRef } from "react";

interface Star {
  x: number;
  y: number;
  r: number;
  baseOpacity: number;
  phase: number;
  speed: number;
  dx: number;
  dy: number;
}

interface StarBackgroundProps {
  fixed?: boolean;
}

export function StarBackground({ fixed = false }: StarBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const starsRef = useRef<Star[]>([]);
  const animRef = useRef<number>(0);

  useEffect(() => {
    function buildStars(width: number, height: number) {
      const count = 150;
      const stars: Star[] = [];
      for (let i = 0; i < count; i++) {
        stars.push({
          x: Math.random() * width,
          y: Math.random() * height,
          r: 0.4 + Math.random() * 1.1,
          baseOpacity: 0.4 + Math.random() * 0.6,
          phase: Math.random() * Math.PI * 2,
          speed: 0.0003 + Math.random() * 0.0008,
          dx: (Math.random() - 0.5) * 0.04,
          dy: (Math.random() - 0.5) * 0.04,
        });
      }
      return stars;
    }
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    function resize() {
      if (!canvas) return;
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      starsRef.current = buildStars(canvas.width, canvas.height);
    }

    resize();
    window.addEventListener("resize", resize);

    function draw(timestamp: number) {
      if (!canvas || !ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Fill dark background
      ctx.fillStyle = "#04040e";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      for (const star of starsRef.current) {
        // Twinkle
        const opacity =
          star.baseOpacity *
          (0.4 + 0.6 * Math.abs(Math.sin(timestamp * star.speed + star.phase)));

        // Drift
        star.x += star.dx;
        star.y += star.dy;
        if (star.x < 0) star.x = canvas.width;
        if (star.x > canvas.width) star.x = 0;
        if (star.y < 0) star.y = canvas.height;
        if (star.y > canvas.height) star.y = 0;

        ctx.beginPath();
        ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(200,220,255,${opacity})`;
        ctx.fill();
      }

      animRef.current = requestAnimationFrame(draw);
    }

    animRef.current = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: fixed ? "fixed" : "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        zIndex: 0,
        pointerEvents: "none",
      }}
    />
  );
}
