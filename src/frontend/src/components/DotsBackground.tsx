import { useEffect, useRef } from "react";

interface Dot {
  x: number;
  y: number;
  dx: number;
  dy: number;
  r: number;
  opacity: number;
  isCyan: boolean;
}

/**
 * Lightweight single global animated moving dots background.
 * Renders 25 tiny dots that drift slowly + pentagon paving block tiles.
 * Use once in App layout.
 */
export function DotsBackground({ fixed = false }: { fixed?: boolean }) {
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

    const DOT_COUNT = 25;
    const dots: Dot[] = Array.from({ length: DOT_COUNT }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      dx: (Math.random() - 0.5) * 0.4,
      dy: (Math.random() - 0.5) * 0.4,
      r: 1 + Math.random() * 1.5,
      opacity: 0.15 + Math.random() * 0.25,
      isCyan: Math.random() > 0.4,
    }));

    // Draw pentagon at (cx, cy) with outer radius r
    const drawPentagon = (cx: number, cy: number, r: number) => {
      ctx.beginPath();
      for (let i = 0; i < 5; i++) {
        const angle = (i * (2 * Math.PI)) / 5 - Math.PI / 2;
        const x = cx + r * Math.cos(angle);
        const y = cy + r * Math.sin(angle);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
    };

    const drawPentagons = () => {
      const R = 44; // pentagon circumradius
      // For a tiling pattern, use a grid with offset rows
      // Pentagon tiling: horizontal spacing ~= 2*R*cos(18°) ≈ 1.902*R
      // vertical spacing uses sin values
      const hSpacing = R * 1.55;
      const vSpacing = R * 1.52;

      ctx.save();
      ctx.strokeStyle = "rgba(180,180,210,0.13)";
      ctx.lineWidth = 1;
      // subtle glow via shadow
      ctx.shadowColor = "rgba(180,180,255,0.2)";
      ctx.shadowBlur = 3;

      const cols = Math.ceil(canvas.width / hSpacing) + 3;
      const rows = Math.ceil(canvas.height / vSpacing) + 3;

      for (let row = -2; row < rows; row++) {
        for (let col = -2; col < cols; col++) {
          const offsetX = row % 2 === 0 ? 0 : hSpacing * 0.5;
          const cx = col * hSpacing + offsetX;
          const cy = row * vSpacing;
          drawPentagon(cx, cy, R);
          ctx.stroke();
        }
      }
      ctx.restore();
    };

    const draw = () => {
      if (!canvas || !ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw pentagons first (below dots)
      drawPentagons();

      // Draw dots on top
      for (const dot of dots) {
        dot.x += dot.dx;
        dot.y += dot.dy;

        if (dot.x < -dot.r) dot.x = canvas.width + dot.r;
        if (dot.x > canvas.width + dot.r) dot.x = -dot.r;
        if (dot.y < -dot.r) dot.y = canvas.height + dot.r;
        if (dot.y > canvas.height + dot.r) dot.y = -dot.r;

        ctx.beginPath();
        ctx.arc(dot.x, dot.y, dot.r, 0, Math.PI * 2);
        ctx.fillStyle = dot.isCyan
          ? `rgba(100, 220, 255, ${dot.opacity})`
          : `rgba(255, 255, 255, ${dot.opacity})`;
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
    <canvas
      ref={canvasRef}
      className={`${fixed ? "fixed" : "absolute"} inset-0 w-full h-full pointer-events-none`}
      style={{ zIndex: 0 }}
    />
  );
}
