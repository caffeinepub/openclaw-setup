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
 * Lightweight animated moving dots background.
 * Renders ~35 tiny dots that drift slowly across the canvas.
 * Designed to be layered as an extra visual effect over existing backgrounds.
 */
export function DotsBackground() {
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

    const onResize = () => resize();
    window.addEventListener("resize", onResize);

    const DOT_COUNT = 35;

    // Initialize dots with random positions and slow velocities
    const dots: Dot[] = Array.from({ length: DOT_COUNT }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      dx: (Math.random() - 0.5) * 0.5,
      dy: (Math.random() - 0.5) * 0.5,
      r: 1.5 + Math.random() * 1.5,
      opacity: 0.2 + Math.random() * 0.3,
      isCyan: Math.random() > 0.4,
    }));

    const draw = () => {
      if (!canvas || !ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (const dot of dots) {
        // Move dot
        dot.x += dot.dx;
        dot.y += dot.dy;

        // Wrap around edges
        if (dot.x < -dot.r) dot.x = canvas.width + dot.r;
        if (dot.x > canvas.width + dot.r) dot.x = -dot.r;
        if (dot.y < -dot.r) dot.y = canvas.height + dot.r;
        if (dot.y > canvas.height + dot.r) dot.y = -dot.r;

        // Draw dot
        ctx.beginPath();
        ctx.arc(dot.x, dot.y, dot.r, 0, Math.PI * 2);
        if (dot.isCyan) {
          ctx.fillStyle = `rgba(100, 220, 255, ${dot.opacity})`;
        } else {
          ctx.fillStyle = `rgba(255, 255, 255, ${dot.opacity})`;
        }
        ctx.fill();
      }

      animId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 0 }}
    />
  );
}
