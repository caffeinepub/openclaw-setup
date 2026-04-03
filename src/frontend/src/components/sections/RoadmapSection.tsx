import { useEffect, useRef, useState } from "react";
import { AnimatedLobsterSVG } from "../LobsterPopupCard";

const ECOSYSTEM_LOGOS = [
  { id: "openclaw", name: "OpenClaw", color: "#FF5722" },
  { id: "facebook", name: "Facebook", color: "#1877F2" },
  { id: "whatsapp", name: "WhatsApp", color: "#25D366" },
  { id: "telegram", name: "Telegram", color: "#0088cc" },
  { id: "instagram", name: "Instagram", color: "#E1306C" },
  { id: "tiktok", name: "TikTok", color: "#aaaaaa" },
  { id: "youtube", name: "YouTube", color: "#FF0000" },
  { id: "discord", name: "Discord", color: "#5865F2" },
  { id: "slack", name: "Slack", color: "#E01E5A" },
  { id: "github", name: "GitHub", color: "#cccccc" },
  { id: "gpt", name: "GPT", color: "#10A37F" },
  { id: "google", name: "Google", color: "#4285F4" },
  { id: "spotify", name: "Spotify", color: "#1DB954" },
];

function EcoIcon({
  id,
  color,
  size = 22,
}: { id: string; color: string; size?: number }) {
  const p = {
    viewBox: "0 0 24 24",
    width: size,
    height: size,
    role: "img" as const,
    "aria-label": id,
  };
  switch (id) {
    case "openclaw":
      return (
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            width: size,
            height: size,
          }}
        >
          <AnimatedLobsterSVG width={size} height={size * 0.9} />
        </div>
      );
    case "facebook":
      return (
        <svg {...p} fill={color}>
          <title>{id}</title>
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
      );
    case "whatsapp":
      return (
        <svg {...p} fill={color}>
          <title>{id}</title>
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
        </svg>
      );
    case "telegram":
      return (
        <svg {...p} fill={color}>
          <title>{id}</title>
          <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
        </svg>
      );
    case "instagram":
      return (
        <svg {...p}>
          <title>{id}</title>
          <defs>
            <linearGradient id="ig-grad" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#f09433" />
              <stop offset="25%" stopColor="#e6683c" />
              <stop offset="50%" stopColor="#dc2743" />
              <stop offset="75%" stopColor="#cc2366" />
              <stop offset="100%" stopColor="#bc1888" />
            </linearGradient>
          </defs>
          <path
            fill="url(#ig-grad)"
            d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"
          />
        </svg>
      );
    case "tiktok":
      return (
        <svg {...p} fill={color}>
          <title>{id}</title>
          <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
        </svg>
      );
    case "youtube":
      return (
        <svg {...p} fill={color}>
          <title>{id}</title>
          <path d="M23.495 6.205a3.007 3.007 0 0 0-2.088-2.088c-1.87-.501-9.396-.501-9.396-.501s-7.507-.01-9.396.501A3.007 3.007 0 0 0 .527 6.205a31.247 31.247 0 0 0-.522 5.805 31.247 31.247 0 0 0 .522 5.783 3.007 3.007 0 0 0 2.088 2.088c1.868.502 9.396.502 9.396.502s7.506 0 9.396-.502a3.007 3.007 0 0 0 2.088-2.088 31.247 31.247 0 0 0 .5-5.783 31.247 31.247 0 0 0-.5-5.805zM9.609 15.601V8.408l6.264 3.602z" />
        </svg>
      );
    case "discord":
      return (
        <svg {...p} fill={color}>
          <title>{id}</title>
          <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057.1 18.08.114 18.1.132 18.11a19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
        </svg>
      );
    case "slack":
      return (
        <svg {...p}>
          <title>{id}</title>
          <path
            fill="#E01E5A"
            d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52z"
          />
          <path
            fill="#E01E5A"
            d="M6.313 15.165a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313z"
          />
          <path
            fill="#36C5F0"
            d="M8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834z"
          />
          <path
            fill="#36C5F0"
            d="M8.834 6.313a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312z"
          />
          <path
            fill="#2EB67D"
            d="M18.956 8.834a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.522V8.834z"
          />
          <path
            fill="#2EB67D"
            d="M17.688 8.834a2.528 2.528 0 0 1-2.523 2.521 2.527 2.527 0 0 1-2.52-2.521V2.522A2.527 2.527 0 0 1 15.165 0a2.528 2.528 0 0 1 2.523 2.522v6.312z"
          />
          <path
            fill="#ECB22E"
            d="M15.165 18.956a2.528 2.528 0 0 1 2.523 2.522A2.528 2.528 0 0 1 15.165 24a2.527 2.527 0 0 1-2.52-2.522v-2.522h2.52z"
          />
          <path
            fill="#ECB22E"
            d="M15.165 17.688a2.527 2.527 0 0 1-2.52-2.523 2.526 2.526 0 0 1 2.52-2.52h6.313A2.527 2.527 0 0 1 24 15.165a2.528 2.528 0 0 1-2.522 2.523h-6.313z"
          />
        </svg>
      );
    case "github":
      return (
        <svg {...p} fill={color}>
          <title>{id}</title>
          <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
        </svg>
      );
    case "gpt":
      return (
        <svg {...p} fill={color}>
          <title>{id}</title>
          <path d="M22.282 9.821a5.985 5.985 0 0 0-.516-4.91 6.046 6.046 0 0 0-6.51-2.9A6.065 6.065 0 0 0 4.981 4.18a5.985 5.985 0 0 0-3.998 2.9 6.046 6.046 0 0 0 .743 7.097 5.98 5.98 0 0 0 .51 4.911 6.051 6.051 0 0 0 6.515 2.9A5.985 5.985 0 0 0 13.26 24a6.056 6.056 0 0 0 5.772-4.206 5.99 5.99 0 0 0 3.997-2.9 6.056 6.056 0 0 0-.747-7.073zM13.26 22.43a4.476 4.476 0 0 1-2.876-1.04l.141-.081 4.779-2.758a.795.795 0 0 0 .392-.681v-6.737l2.02 1.168a.071.071 0 0 1 .038.052v5.583a4.504 4.504 0 0 1-4.494 4.494zM3.6 18.304a4.47 4.47 0 0 1-.535-3.014l.142.085 4.783 2.759a.771.771 0 0 0 .78 0l5.843-3.369v2.332a.08.08 0 0 1-.033.062L9.74 19.95a4.5 4.5 0 0 1-6.14-1.646zM2.34 7.896a4.485 4.485 0 0 1 2.366-1.973V11.6a.766.766 0 0 0 .388.676l5.815 3.355-2.02 1.168a.076.076 0 0 1-.071 0l-4.83-2.786A4.504 4.504 0 0 1 2.34 7.872zm16.597 3.855l-5.843-3.371 2.019-1.168a.076.076 0 0 1 .071 0l4.83 2.786a4.494 4.494 0 0 1-.676 8.105v-5.678a.79.79 0 0 0-.4-.674zm2.01-3.023l-.141-.085-4.774-2.782a.776.776 0 0 0-.785 0L9.409 9.23V6.897a.066.066 0 0 1 .028-.061l4.83-2.787a4.5 4.5 0 0 1 6.68 4.66zm-12.64 4.135l-2.02-1.164a.08.08 0 0 1-.038-.057V6.075a4.5 4.5 0 0 1 7.375-3.453l-.142.08L8.704 5.46a.795.795 0 0 0-.393.681zm1.097-2.365l2.602-1.5 2.607 1.5v2.999l-2.597 1.5-2.607-1.5z" />
        </svg>
      );
    case "google":
      return (
        <svg {...p}>
          <title>{id}</title>
          <path
            fill="#4285F4"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            fill="#34A853"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="#FBBC05"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
          />
          <path
            fill="#EA4335"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
          />
        </svg>
      );
    case "spotify":
      return (
        <svg {...p} fill={color}>
          <title>{id}</title>
          <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
        </svg>
      );
    default:
      return (
        <svg {...p} fill={color}>
          <title>{id}</title>
          <circle cx="12" cy="12" r="10" />
        </svg>
      );
  }
}

// HD glowing dot grid canvas background
function GlowingDotGrid() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let t = 0;

    const SPACING = 28;
    const BASE_R = 1.4;
    const GLOW_R = 3.5;

    function resize() {
      if (!canvas) return;
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx?.scale(window.devicePixelRatio, window.devicePixelRatio);
    }
    resize();
    window.addEventListener("resize", resize);

    function draw() {
      if (!canvas || !ctx) return;
      const W = canvas.offsetWidth;
      const H = canvas.offsetHeight;
      ctx.clearRect(0, 0, W, H);

      const cols = Math.ceil(W / SPACING) + 1;
      const rows = Math.ceil(H / SPACING) + 1;

      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const x = col * SPACING;
          const y = row * SPACING;

          // Wave pulse: distance from center influences brightness
          const cx = W / 2;
          const cy = H / 2;
          const dist = Math.sqrt((x - cx) ** 2 + (y - cy) ** 2);
          const maxDist = Math.sqrt(cx ** 2 + cy ** 2);
          const normDist = dist / maxDist;

          // Each dot has a slightly offset phase based on position
          const phase = (col * 0.18 + row * 0.14 + t * 0.8) % (Math.PI * 2);
          const pulse = 0.35 + 0.65 * (0.5 + 0.5 * Math.sin(phase));
          // Dots near center glow more
          const centerBoost = 1 - normDist * 0.55;
          const alpha = pulse * centerBoost;

          // Randomly bright "star" dots
          const isBright =
            (col * 7 + row * 13) % 17 === 0 ||
            ((col * 3 + row * 5) % 11 === 0 &&
              Math.sin(t * 1.1 + col + row) > 0.7);

          if (isBright) {
            // Outer glow halo
            const grad = ctx.createRadialGradient(x, y, 0, x, y, GLOW_R * 2.5);
            grad.addColorStop(0, `rgba(100,210,255,${alpha * 0.7})`);
            grad.addColorStop(0.4, `rgba(80,180,255,${alpha * 0.25})`);
            grad.addColorStop(1, "rgba(80,180,255,0)");
            ctx.beginPath();
            ctx.arc(x, y, GLOW_R * 2.5, 0, Math.PI * 2);
            ctx.fillStyle = grad;
            ctx.fill();

            // Core
            ctx.beginPath();
            ctx.arc(x, y, GLOW_R, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(180,230,255,${alpha})`;
            ctx.fill();
          } else {
            // Normal dot with soft glow
            const grad = ctx.createRadialGradient(x, y, 0, x, y, GLOW_R);
            grad.addColorStop(0, `rgba(100,180,255,${alpha * 0.55})`);
            grad.addColorStop(1, "rgba(100,180,255,0)");
            ctx.beginPath();
            ctx.arc(x, y, GLOW_R, 0, Math.PI * 2);
            ctx.fillStyle = grad;
            ctx.fill();

            // Solid core dot
            ctx.beginPath();
            ctx.arc(x, y, BASE_R, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(120,190,255,${alpha * 0.7})`;
            ctx.fill();
          }
        }
      }

      t += 0.012;
      animId = requestAnimationFrame(draw);
    }

    draw();
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        opacity: 0.85,
      }}
    />
  );
}

function CenterChip() {
  return (
    <div
      style={{
        width: 128,
        height: 128,
        borderRadius: 20,
        background: "linear-gradient(145deg, #0d1825, #091320, #060f1a)",
        border: "2px solid rgba(255, 112, 50, 0.55)",
        boxShadow:
          "0 0 24px rgba(255,90,30,0.3), 0 0 50px rgba(255,90,30,0.12), inset 0 0 16px rgba(255,90,30,0.06)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        position: "relative" as const,
        animation: "ecoCenterPulse 2.5s ease-in-out infinite",
      }}
    >
      {[
        { top: 7, left: 7, corner: "tl" },
        { top: 7, right: 7, corner: "tr" },
        { bottom: 7, left: 7, corner: "bl" },
        { bottom: 7, right: 7, corner: "br" },
      ].map((pos) => (
        <div
          key={pos.corner}
          style={{
            position: "absolute" as const,
            width: 9,
            height: 9,
            ...pos,
            borderTop:
              pos.top !== undefined
                ? "1.5px solid rgba(255,130,60,0.65)"
                : undefined,
            borderBottom:
              pos.bottom !== undefined
                ? "1.5px solid rgba(255,130,60,0.65)"
                : undefined,
            borderLeft:
              pos.left !== undefined
                ? "1.5px solid rgba(255,130,60,0.65)"
                : undefined,
            borderRight:
              pos.right !== undefined
                ? "1.5px solid rgba(255,130,60,0.65)"
                : undefined,
          }}
        />
      ))}
      <div
        style={{
          position: "absolute",
          top: 16,
          left: 12,
          right: 12,
          height: 1,
          background: "rgba(255,130,60,0.14)",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: 16,
          left: 12,
          right: 12,
          height: 1,
          background: "rgba(255,130,60,0.14)",
        }}
      />
      <AnimatedLobsterSVG width={72} height={82} />
      <span
        style={{
          fontSize: "0.44rem",
          fontWeight: 800,
          color: "rgba(255, 150, 80, 0.95)",
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          marginTop: 1,
          fontFamily: "system-ui, sans-serif",
        }}
      >
        ClawPro
      </span>
      <div
        style={{
          position: "absolute",
          inset: -14,
          borderRadius: 34,
          border: "1px solid rgba(255,112,50,0.2)",
          animation: "ecoPulseRing 2.5s ease-in-out infinite",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: -26,
          borderRadius: 46,
          border: "1px solid rgba(255,112,50,0.1)",
          animation: "ecoPulseRing 2.5s ease-in-out infinite 0.6s",
          pointerEvents: "none",
        }}
      />
    </div>
  );
}

export function RoadmapSection() {
  const [dotCycle, setDotCycle] = useState(0);
  const styleRef = useRef<HTMLStyleElement | null>(null);

  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `
      @keyframes ecoCenterPulse {
        0%, 100% { box-shadow: 0 0 24px rgba(255,90,30,0.3), 0 0 50px rgba(255,90,30,0.12); border-color: rgba(255,112,50,0.55); }
        50% { box-shadow: 0 0 36px rgba(255,90,30,0.5), 0 0 70px rgba(255,90,30,0.2); border-color: rgba(255,130,60,0.8); }
      }
      @keyframes ecoPulseRing {
        0%, 100% { opacity: 0.25; transform: scale(1); }
        50% { opacity: 0.65; transform: scale(1.06); }
      }
      @keyframes lsMainFloat {
        0%, 100% { transform: translateY(0px); }
        50% { transform: translateY(-5px); }
      }
      .ls-main-anim { animation: lsMainFloat 2.5s ease-in-out infinite; }
    `;
    document.head.appendChild(style);
    styleRef.current = style;
    return () => {
      styleRef.current?.remove();
    };
  }, []);

  useEffect(() => {
    const id = setInterval(() => setDotCycle((c) => c + 1), 3000);
    return () => clearInterval(id);
  }, []);

  const SVG_W = 560;
  const SVG_H = 520;
  const CCX = SVG_W / 2;
  const CCY = SVG_H / 2;
  const RING_R = 186;
  const count = ECOSYSTEM_LOGOS.length;

  const positions = ECOSYSTEM_LOGOS.map((_, i) => {
    const angle = (2 * Math.PI * i) / count - Math.PI / 2;
    return {
      x: CCX + RING_R * Math.cos(angle),
      y: CCY + RING_R * Math.sin(angle),
    };
  });

  return (
    <section
      style={{
        background:
          "linear-gradient(180deg, #050d1f 0%, #0a1528 50%, #050d1f 100%)",
        padding: "80px 20px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* HD animated glowing dot grid canvas */}
      <GlowingDotGrid />

      {/* Ambient center glow */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%,-50%)",
          width: 520,
          height: 520,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(255,90,30,0.07) 0%, rgba(255,90,30,0.02) 45%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      {/* Section header */}
      <div
        style={{ textAlign: "center", marginBottom: 52, position: "relative" }}
      >
        <p
          style={{
            fontSize: "0.63rem",
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            color: "rgba(100,180,255,0.55)",
            marginBottom: 12,
            fontFamily: "system-ui, sans-serif",
          }}
        >
          ClawPro Ecosystem
        </p>
        <h2
          style={{
            fontSize: "clamp(1.5rem, 3vw, 2.3rem)",
            fontWeight: 800,
            background:
              "linear-gradient(135deg, #e2e8f0 0%, #93c5fd 50%, #e2e8f0 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            marginBottom: 16,
            fontFamily: "system-ui, sans-serif",
          }}
        >
          Powered by Next-Gen AI Infrastructure
        </h2>
        <div
          style={{
            width: 64,
            height: 2,
            background:
              "linear-gradient(90deg, transparent, #3b82f6, transparent)",
            margin: "0 auto 14px",
            borderRadius: 2,
          }}
        />
        <p
          style={{
            fontSize: "0.9rem",
            color: "rgba(148,185,230,0.55)",
            fontFamily: "system-ui, sans-serif",
          }}
        >
          Unified platform powering every integration
        </p>
      </div>

      {/* Ecosystem chip board visualization */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          position: "relative",
        }}
      >
        <div style={{ position: "relative", width: "100%", maxWidth: 580 }}>
          <svg
            viewBox={`0 0 ${SVG_W} ${SVG_H}`}
            style={{ width: "100%", overflow: "visible" }}
            aria-label="ClawPro ecosystem chip board"
            role="img"
          >
            <defs>
              <filter
                id="dotGlowEco"
                x="-120%"
                y="-120%"
                width="340%"
                height="340%"
              >
                <feGaussianBlur stdDeviation="2.5" result="b" />
                <feMerge>
                  <feMergeNode in="b" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              <filter
                id="chipGlowEco"
                x="-30%"
                y="-30%"
                width="160%"
                height="160%"
              >
                <feGaussianBlur stdDeviation="3" result="b" />
                <feMerge>
                  <feMergeNode in="b" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            <circle
              cx={CCX}
              cy={CCY}
              r={RING_R + 26}
              fill="none"
              stroke="rgba(100,180,255,0.06)"
              strokeWidth="1"
              strokeDasharray="6 12"
            />

            {ECOSYSTEM_LOGOS.map((logo, i) => {
              const pos = positions[i];
              return (
                <line
                  key={`trace-${logo.id}`}
                  x1={CCX}
                  y1={CCY}
                  x2={pos.x}
                  y2={pos.y}
                  stroke="rgba(100,180,255,0.12)"
                  strokeWidth="1"
                />
              );
            })}

            {ECOSYSTEM_LOGOS.map((logo, i) => {
              const pos = positions[i];
              const pathData = `M ${CCX} ${CCY} L ${pos.x} ${pos.y}`;
              return (
                <circle
                  key={`travdot-${dotCycle}-${logo.id}`}
                  r="3"
                  fill={logo.color}
                  opacity="0.9"
                  filter="url(#dotGlowEco)"
                >
                  <animateMotion
                    dur="1.6s"
                    begin={`${i * 0.08}s`}
                    repeatCount="indefinite"
                    path={pathData}
                  />
                </circle>
              );
            })}

            {ECOSYSTEM_LOGOS.map((logo, i) => {
              const { x, y } = positions[i];
              const cw = 66;
              const ch = 62;
              return (
                <g key={logo.id}>
                  <rect
                    x={x - cw / 2 - 5}
                    y={y - ch / 2 - 5}
                    width={cw + 10}
                    height={ch + 10}
                    rx={16}
                    fill="none"
                    stroke={logo.color}
                    strokeWidth="1"
                    opacity="0.15"
                    filter="url(#chipGlowEco)"
                  />
                  <rect
                    x={x - cw / 2}
                    y={y - ch / 2}
                    width={cw}
                    height={ch}
                    rx={10}
                    fill="#060d18"
                    stroke={logo.color}
                    strokeWidth="1"
                    opacity={0.75}
                  />
                  <line
                    x1={x - cw / 2 + 7}
                    y1={y - ch / 2 + 16}
                    x2={x + cw / 2 - 7}
                    y2={y - ch / 2 + 16}
                    stroke={logo.color}
                    strokeWidth="0.5"
                    opacity="0.18"
                  />
                  <line
                    x1={x - cw / 2 + 7}
                    y1={y + ch / 2 - 16}
                    x2={x + cw / 2 - 7}
                    y2={y + ch / 2 - 16}
                    stroke={logo.color}
                    strokeWidth="0.5"
                    opacity="0.18"
                  />
                  <line
                    x1={x - cw / 2 - 6}
                    y1={y - 6}
                    x2={x - cw / 2}
                    y2={y - 6}
                    stroke={logo.color}
                    strokeWidth="1.2"
                    opacity="0.35"
                  />
                  <line
                    x1={x - cw / 2 - 6}
                    y1={y + 6}
                    x2={x - cw / 2}
                    y2={y + 6}
                    stroke={logo.color}
                    strokeWidth="1.2"
                    opacity="0.35"
                  />
                  <line
                    x1={x + cw / 2}
                    y1={y - 6}
                    x2={x + cw / 2 + 6}
                    y2={y - 6}
                    stroke={logo.color}
                    strokeWidth="1.2"
                    opacity="0.35"
                  />
                  <line
                    x1={x + cw / 2}
                    y1={y + 6}
                    x2={x + cw / 2 + 6}
                    y2={y + 6}
                    stroke={logo.color}
                    strokeWidth="1.2"
                    opacity="0.35"
                  />
                  <foreignObject
                    x={x - 13}
                    y={y - ch / 2 + 14}
                    width={26}
                    height={26}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: 26,
                        height: 26,
                      }}
                    >
                      <EcoIcon id={logo.id} color={logo.color} size={22} />
                    </div>
                  </foreignObject>
                  <text
                    x={x}
                    y={y + ch / 2 - 8}
                    textAnchor="middle"
                    fill={logo.color}
                    fontSize="7.5"
                    fontFamily="system-ui, sans-serif"
                    fontWeight="600"
                    opacity="0.9"
                  >
                    {logo.name}
                  </text>
                </g>
              );
            })}
          </svg>

          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              zIndex: 10,
            }}
          >
            <CenterChip />
          </div>
        </div>
      </div>

      {/* Legend pill row */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: "8px 10px",
          maxWidth: 640,
          margin: "48px auto 0",
        }}
      >
        {ECOSYSTEM_LOGOS.map((logo) => (
          <div
            key={logo.id}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "4px 12px",
              borderRadius: 99,
              background: "rgba(100,180,255,0.04)",
              border: "1px solid rgba(100,180,255,0.1)",
            }}
          >
            <div
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: logo.color,
                opacity: 0.65,
              }}
            />
            <span
              style={{
                fontSize: "0.66rem",
                color: "rgba(148,185,230,0.55)",
                fontFamily: "system-ui, sans-serif",
              }}
            >
              {logo.name}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
