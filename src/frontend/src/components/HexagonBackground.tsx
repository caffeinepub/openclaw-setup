import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  dx: number;
  dy: number;
  r: number;
  opacity: number;
}

interface HexCell {
  cx: number;
  cy: number;
  bright: boolean;
  pulseOffset: number;
  flashTimer: number;
  flashDuration: number;
}

/**
 * Animated hexagonal grid background - blockchain/circuit board aesthetic.
 * Flat-top hexagons with neon cyan glow, circuit line interiors, and drifting particles.
 */
export function HexagonBackground({ fixed = false }: { fixed?: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let cells: HexCell[] = [];
    let particles: Particle[] = [];
    let W = 0;
    let H = 0;

    const getHexSize = () => {
      if (window.innerWidth < 640) return 35;
      if (window.innerWidth < 1024) return 45;
      return 55;
    };

    const getParticleCount = () => {
      if (window.innerWidth < 640) return 30;
      if (window.innerWidth < 1024) return 55;
      return 80;
    };

    const buildGrid = () => {
      W = canvas.offsetWidth;
      H = canvas.offsetHeight;
      canvas.width = W;
      canvas.height = H;

      const R = getHexSize();
      // Flat-top hex: width = sqrt(3)*R, height = 2*R
      const hexW = Math.sqrt(3) * R;
      const hexH = 2 * R;
      const colStep = hexW;
      const rowStep = hexH * 0.75;

      cells = [];
      const cols = Math.ceil(W / colStep) + 3;
      const rows = Math.ceil(H / rowStep) + 3;

      for (let row = -2; row < rows; row++) {
        for (let col = -2; col < cols; col++) {
          const offsetY = col % 2 === 0 ? 0 : hexH * 0.375;
          const cx = col * colStep + hexW / 2;
          const cy = row * rowStep + hexH / 2 + offsetY;
          cells.push({
            cx,
            cy,
            bright: Math.random() < 0.15,
            pulseOffset: Math.random() * Math.PI * 2,
            flashTimer: 0,
            flashDuration: 0,
          });
        }
      }

      // Setup particles
      const pc = getParticleCount();
      particles = Array.from({ length: pc }, () => ({
        x: Math.random() * W,
        y: Math.random() * H,
        dx: (Math.random() - 0.5) * 0.3,
        dy: (Math.random() - 0.5) * 0.3,
        r: 0.8 + Math.random() * 1.2,
        opacity: 0.2 + Math.random() * 0.4,
      }));
    };

    const drawFlatTopHex = (cx: number, cy: number, R: number) => {
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const angle = (Math.PI / 3) * i;
        const x = cx + R * Math.cos(angle);
        const y = cy + R * Math.sin(angle);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
    };

    const drawCircuitLines = (cx: number, cy: number, R: number) => {
      const corners: [number, number][] = [];
      for (let i = 0; i < 6; i++) {
        const angle = (Math.PI / 3) * i;
        corners.push([cx + R * Math.cos(angle), cy + R * Math.sin(angle)]);
      }
      ctx.strokeStyle = "rgba(127,217,255,0.18)";
      ctx.lineWidth = 0.6;
      // Draw 2-3 lines from corners to near-center
      for (let i = 0; i < 3; i++) {
        const [x1, y1] = corners[i * 2];
        const midX = cx + (x1 - cx) * 0.55;
        const midY = cy + (y1 - cy) * 0.55;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(midX, midY);
        ctx.stroke();
        // Small dot at junction
        ctx.beginPath();
        ctx.arc(midX, midY, 1, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(127,217,255,0.25)";
        ctx.fill();
      }
    };

    let lastFlash = 0;
    const draw = (timestamp: number) => {
      if (!canvas || !ctx) return;
      const R = getHexSize();
      ctx.clearRect(0, 0, W, H);

      // Occasionally trigger a random flash
      if (timestamp - lastFlash > 800 + Math.random() * 1200) {
        lastFlash = timestamp;
        const idx = Math.floor(Math.random() * cells.length);
        cells[idx].flashTimer = timestamp;
        cells[idx].flashDuration = 600 + Math.random() * 800;
      }

      const t = timestamp * 0.001; // seconds

      for (const cell of cells) {
        const { cx, cy, bright, pulseOffset } = cell;

        // Check if off-screen
        if (cx < -R * 2 || cx > W + R * 2 || cy < -R * 2 || cy > H + R * 2)
          continue;

        const pulse = 0.5 + 0.5 * Math.sin(t * 0.4 + pulseOffset);
        let isFlashing = false;
        let flashProgress = 0;
        if (cell.flashTimer > 0) {
          flashProgress = (timestamp - cell.flashTimer) / cell.flashDuration;
          if (flashProgress < 1) {
            isFlashing = true;
          } else {
            cell.flashTimer = 0;
          }
        }

        const baseAlpha = bright ? 0.55 + pulse * 0.25 : 0.15 + pulse * 0.12;
        const glowAlpha = isFlashing
          ? baseAlpha + (1 - flashProgress) * 0.6
          : baseAlpha;
        const blur = isFlashing
          ? 20 + (1 - flashProgress) * 25
          : bright
            ? 10 + pulse * 8
            : 4 + pulse * 4;

        // Dim outer border
        ctx.save();
        drawFlatTopHex(cx, cy, R);
        ctx.strokeStyle = `rgba(26,58,74,${glowAlpha * 0.8})`;
        ctx.lineWidth = 1.5;
        ctx.stroke();
        ctx.restore();

        // Main cyan glow stroke
        ctx.save();
        ctx.shadowBlur = blur;
        ctx.shadowColor = `rgba(76,206,255,${glowAlpha})`;
        drawFlatTopHex(cx, cy, R * 0.95);
        ctx.strokeStyle = `rgba(76,206,255,${glowAlpha})`;
        ctx.lineWidth = bright || isFlashing ? 1.2 : 0.7;
        ctx.stroke();
        ctx.restore();

        // Inner bright stroke on bright cells
        if (bright || isFlashing) {
          ctx.save();
          ctx.shadowBlur = blur * 1.5;
          ctx.shadowColor = `rgba(95,211,255,${glowAlpha * 0.8})`;
          drawFlatTopHex(cx, cy, R * 0.82);
          ctx.strokeStyle = `rgba(234,247,255,${glowAlpha * 0.5})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
          ctx.restore();
        }

        // Circuit lines inside
        ctx.save();
        ctx.globalAlpha = bright ? 0.35 : 0.18;
        drawCircuitLines(cx, cy, R * 0.7);
        ctx.restore();
      }

      // Draw particles
      for (const p of particles) {
        p.x += p.dx;
        p.y += p.dy;
        if (p.x < 0) p.x = W;
        if (p.x > W) p.x = 0;
        if (p.y < 0) p.y = H;
        if (p.y > H) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(167,238,255,${p.opacity})`;
        ctx.shadowBlur = 4;
        ctx.shadowColor = "rgba(76,206,255,0.6)";
        ctx.fill();
      }

      animId = requestAnimationFrame(draw);
    };

    buildGrid();

    const handleResize = () => {
      buildGrid();
    };
    window.addEventListener("resize", handleResize);

    animId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
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
