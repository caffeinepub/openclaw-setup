import { useEffect, useRef, useState } from "react";

// Flag emoji from ISO 2-letter country code
function countryFlag(code: string): string {
  return String.fromCodePoint(
    ...[...code.toUpperCase()].map((c) => 0x1f1e6 + c.charCodeAt(0) - 65),
  );
}

interface CountryData {
  code: string;
  name: string;
  // Approximate center as percentage of the flat map (0-100, 0-100)
  cx: number; // x % of viewBox width (1008)
  cy: number; // y % of viewBox height (651)
}

// Country centroids mapped to Natural Earth flat projection (approx. 1008x651 viewbox)
const COUNTRIES: CountryData[] = [
  { code: "CA", name: "Canada", cx: 18, cy: 22 },
  { code: "US", name: "United States", cx: 18, cy: 36 },
  { code: "MX", name: "Mexico", cx: 18, cy: 47 },
  { code: "CU", name: "Cuba", cx: 23, cy: 47 },
  { code: "GT", name: "Guatemala", cx: 19, cy: 50 },
  { code: "CO", name: "Colombia", cx: 22, cy: 57 },
  { code: "VE", name: "Venezuela", cx: 25, cy: 55 },
  { code: "BR", name: "Brazil", cx: 28, cy: 64 },
  { code: "PE", name: "Peru", cx: 21, cy: 64 },
  { code: "AR", name: "Argentina", cx: 24, cy: 79 },
  { code: "CL", name: "Chile", cx: 21, cy: 75 },
  { code: "BO", name: "Bolivia", cx: 23, cy: 68 },
  { code: "PY", name: "Paraguay", cx: 25, cy: 72 },
  { code: "UY", name: "Uruguay", cx: 26, cy: 77 },
  { code: "EC", name: "Ecuador", cx: 19, cy: 60 },
  { code: "IS", name: "Iceland", cx: 42, cy: 15 },
  { code: "GB", name: "United Kingdom", cx: 45, cy: 28 },
  { code: "IE", name: "Ireland", cx: 43, cy: 29 },
  { code: "PT", name: "Portugal", cx: 43, cy: 37 },
  { code: "ES", name: "Spain", cx: 45, cy: 37 },
  { code: "FR", name: "France", cx: 47, cy: 34 },
  { code: "BE", name: "Belgium", cx: 47, cy: 30 },
  { code: "NL", name: "Netherlands", cx: 48, cy: 28 },
  { code: "DE", name: "Germany", cx: 49, cy: 30 },
  { code: "CH", name: "Switzerland", cx: 48, cy: 34 },
  { code: "IT", name: "Italy", cx: 50, cy: 36 },
  { code: "AT", name: "Austria", cx: 50, cy: 32 },
  { code: "PL", name: "Poland", cx: 52, cy: 28 },
  { code: "CZ", name: "Czech Republic", cx: 51, cy: 30 },
  { code: "HU", name: "Hungary", cx: 52, cy: 32 },
  { code: "RO", name: "Romania", cx: 54, cy: 32 },
  { code: "BG", name: "Bulgaria", cx: 54, cy: 35 },
  { code: "GR", name: "Greece", cx: 53, cy: 38 },
  { code: "HR", name: "Croatia", cx: 51, cy: 34 },
  { code: "RS", name: "Serbia", cx: 53, cy: 33 },
  { code: "UA", name: "Ukraine", cx: 55, cy: 28 },
  { code: "BY", name: "Belarus", cx: 54, cy: 25 },
  { code: "LT", name: "Lithuania", cx: 53, cy: 24 },
  { code: "LV", name: "Latvia", cx: 53, cy: 22 },
  { code: "EE", name: "Estonia", cx: 53, cy: 20 },
  { code: "FI", name: "Finland", cx: 53, cy: 17 },
  { code: "SE", name: "Sweden", cx: 51, cy: 19 },
  { code: "NO", name: "Norway", cx: 49, cy: 18 },
  { code: "DK", name: "Denmark", cx: 49, cy: 25 },
  { code: "MD", name: "Moldova", cx: 55, cy: 30 },
  { code: "TR", name: "Turkey", cx: 57, cy: 36 },
  { code: "GE", name: "Georgia", cx: 60, cy: 33 },
  { code: "AM", name: "Armenia", cx: 60, cy: 35 },
  { code: "AZ", name: "Azerbaijan", cx: 61, cy: 34 },
  { code: "RU", name: "Russia", cx: 65, cy: 18 },
  { code: "KZ", name: "Kazakhstan", cx: 64, cy: 28 },
  { code: "TM", name: "Turkmenistan", cx: 62, cy: 33 },
  { code: "UZ", name: "Uzbekistan", cx: 64, cy: 33 },
  { code: "KG", name: "Kyrgyzstan", cx: 66, cy: 32 },
  { code: "TJ", name: "Tajikistan", cx: 65, cy: 35 },
  { code: "AF", name: "Afghanistan", cx: 64, cy: 37 },
  { code: "PK", name: "Pakistan", cx: 65, cy: 40 },
  { code: "IN", name: "India", cx: 67, cy: 46 },
  { code: "NP", name: "Nepal", cx: 68, cy: 41 },
  { code: "BD", name: "Bangladesh", cx: 70, cy: 44 },
  { code: "LK", name: "Sri Lanka", cx: 68, cy: 53 },
  { code: "MM", name: "Myanmar", cx: 71, cy: 44 },
  { code: "TH", name: "Thailand", cx: 72, cy: 49 },
  { code: "VN", name: "Vietnam", cx: 74, cy: 48 },
  { code: "KH", name: "Cambodia", cx: 73, cy: 51 },
  { code: "LA", name: "Laos", cx: 72, cy: 47 },
  { code: "MY", name: "Malaysia", cx: 74, cy: 56 },
  { code: "SG", name: "Singapore", cx: 74, cy: 58 },
  { code: "ID", name: "Indonesia", cx: 77, cy: 61 },
  { code: "PH", name: "Philippines", cx: 78, cy: 51 },
  { code: "TW", name: "Taiwan", cx: 78, cy: 44 },
  { code: "CN", name: "China", cx: 73, cy: 36 },
  { code: "MN", name: "Mongolia", cx: 72, cy: 27 },
  { code: "KP", name: "North Korea", cx: 78, cy: 33 },
  { code: "KR", name: "South Korea", cx: 79, cy: 35 },
  { code: "JP", name: "Japan", cx: 81, cy: 34 },
  { code: "IR", name: "Iran", cx: 62, cy: 38 },
  { code: "IQ", name: "Iraq", cx: 60, cy: 39 },
  { code: "SA", name: "Saudi Arabia", cx: 60, cy: 45 },
  { code: "AE", name: "UAE", cx: 63, cy: 46 },
  { code: "OM", name: "Oman", cx: 64, cy: 48 },
  { code: "YE", name: "Yemen", cx: 61, cy: 51 },
  { code: "SY", name: "Syria", cx: 58, cy: 37 },
  { code: "JO", name: "Jordan", cx: 58, cy: 40 },
  { code: "IL", name: "Israel", cx: 57, cy: 40 },
  { code: "LB", name: "Lebanon", cx: 57, cy: 38 },
  { code: "KW", name: "Kuwait", cx: 61, cy: 41 },
  { code: "QA", name: "Qatar", cx: 62, cy: 44 },
  { code: "BH", name: "Bahrain", cx: 62, cy: 43 },
  { code: "MA", name: "Morocco", cx: 44, cy: 41 },
  { code: "DZ", name: "Algeria", cx: 47, cy: 42 },
  { code: "TN", name: "Tunisia", cx: 49, cy: 40 },
  { code: "LY", name: "Libya", cx: 51, cy: 43 },
  { code: "EG", name: "Egypt", cx: 56, cy: 43 },
  { code: "SD", name: "Sudan", cx: 57, cy: 51 },
  { code: "ET", name: "Ethiopia", cx: 59, cy: 55 },
  { code: "SO", name: "Somalia", cx: 62, cy: 57 },
  { code: "KE", name: "Kenya", cx: 59, cy: 60 },
  { code: "TZ", name: "Tanzania", cx: 59, cy: 64 },
  { code: "MZ", name: "Mozambique", cx: 58, cy: 70 },
  { code: "ZA", name: "South Africa", cx: 55, cy: 78 },
  { code: "NA", name: "Namibia", cx: 53, cy: 72 },
  { code: "BW", name: "Botswana", cx: 55, cy: 73 },
  { code: "ZW", name: "Zimbabwe", cx: 57, cy: 70 },
  { code: "ZM", name: "Zambia", cx: 56, cy: 66 },
  { code: "AO", name: "Angola", cx: 53, cy: 66 },
  { code: "CD", name: "DR Congo", cx: 54, cy: 62 },
  { code: "NG", name: "Nigeria", cx: 50, cy: 54 },
  { code: "GH", name: "Ghana", cx: 47, cy: 54 },
  { code: "CI", name: "Ivory Coast", cx: 45, cy: 55 },
  { code: "SN", name: "Senegal", cx: 42, cy: 49 },
  { code: "ML", name: "Mali", cx: 45, cy: 48 },
  { code: "NE", name: "Niger", cx: 49, cy: 48 },
  { code: "TD", name: "Chad", cx: 52, cy: 49 },
  { code: "CM", name: "Cameroon", cx: 51, cy: 56 },
  { code: "CF", name: "Central African Republic", cx: 53, cy: 57 },
  { code: "SS", name: "South Sudan", cx: 57, cy: 55 },
  { code: "UG", name: "Uganda", cx: 58, cy: 59 },
  { code: "RW", name: "Rwanda", cx: 57, cy: 62 },
  { code: "MG", name: "Madagascar", cx: 61, cy: 70 },
  { code: "AU", name: "Australia", cx: 80, cy: 72 },
  { code: "NZ", name: "New Zealand", cx: 88, cy: 80 },
  { code: "PG", name: "Papua New Guinea", cx: 82, cy: 61 },
];

interface ActiveCountry {
  code: string;
  name: string;
  x: number;
  y: number;
}

const VIEWBOX_W = 1008;
const VIEWBOX_H = 651;

export function WorldMapFlat() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeCountry, setActiveCountry] = useState<ActiveCountry | null>(
    null,
  );
  const [glowingCountries, setGlowingCountries] = useState<Set<string>>(
    new Set(),
  );
  const [hoveredCountry, setHoveredCountry] = useState<string | null>(null);
  const popupTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Ambient random glow effect: randomly light up countries
  useEffect(() => {
    const interval = setInterval(() => {
      const count = Math.floor(Math.random() * 3) + 2;
      const selected = new Set<string>();
      while (selected.size < count) {
        const idx = Math.floor(Math.random() * COUNTRIES.length);
        selected.add(COUNTRIES[idx].code);
      }
      setGlowingCountries(selected);
    }, 1800);
    return () => clearInterval(interval);
  }, []);

  const handleCountryClick = (country: CountryData, e: React.MouseEvent) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setActiveCountry({ code: country.code, name: country.name, x, y });

    // Also add to glowing
    setGlowingCountries((prev) => {
      const next = new Set(prev);
      next.add(country.code);
      return next;
    });

    // Auto-dismiss popup after 4s
    if (popupTimerRef.current) clearTimeout(popupTimerRef.current);
    popupTimerRef.current = setTimeout(() => setActiveCountry(null), 4000);
  };

  return (
    <div className="w-full mt-8" ref={containerRef}>
      <style>{`
        @keyframes countryGlow {
          0%, 100% { opacity: 0.55; filter: brightness(1.2) drop-shadow(0 0 3px #00d4ff88); }
          50% { opacity: 1; filter: brightness(1.8) drop-shadow(0 0 10px #00d4ffcc) drop-shadow(0 0 20px #00aaff88); }
        }
        @keyframes countryPulse {
          0%, 100% { opacity: 0.75; }
          50% { opacity: 1; filter: brightness(2) drop-shadow(0 0 14px #ff4444bb) drop-shadow(0 0 28px #ff000066); }
        }
        @keyframes mapScanline {
          0% { transform: translateY(-100%); opacity: 0; }
          10% { opacity: 0.6; }
          90% { opacity: 0.6; }
          100% { transform: translateY(100%); opacity: 0; }
        }
        @keyframes popupFade {
          0% { opacity: 0; transform: translateY(8px) scale(0.92); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes dotPulse {
          0%, 100% { r: 3; opacity: 0.7; }
          50% { r: 5; opacity: 1; }
        }
        @keyframes activeDotPulse {
          0%, 100% { r: 4; opacity: 1; }
          50% { r: 7; opacity: 1; }
        }
        @keyframes borderFlicker {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }
        @keyframes gridLineMove {
          0% { stroke-dashoffset: 0; }
          100% { stroke-dashoffset: 40; }
        }
        .country-dot {
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .country-dot:hover circle {
          fill: #ff6644;
          filter: drop-shadow(0 0 8px #ff4422bb);
        }
        .map-popup {
          animation: popupFade 0.22s ease-out forwards;
        }
      `}</style>

      {/* Header */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-2 mb-2">
          <span
            className="text-xs font-mono font-semibold uppercase tracking-widest"
            style={{ color: "#00d4ff", textShadow: "0 0 8px #00d4ff88" }}
          >
            Global Coverage
          </span>
        </div>
        <h3
          className="font-bold text-xl sm:text-2xl mb-1"
          style={{
            background: "linear-gradient(90deg, #00d4ff, #0099ff, #00ffcc)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          ClawPro Available Worldwide
        </h3>
        <p className="text-xs text-muted-foreground">
          Click any country to confirm availability · {COUNTRIES.length}+
          countries supported
        </p>
      </div>

      {/* Map container */}
      <div
        className="relative rounded-2xl overflow-hidden"
        style={{
          background:
            "linear-gradient(160deg, #020b18 0%, #030d22 50%, #010a15 100%)",
          border: "1px solid rgba(0,180,255,0.18)",
          boxShadow:
            "0 0 40px rgba(0,100,200,0.12), inset 0 0 60px rgba(0,50,100,0.08)",
        }}
      >
        {/* Animated corner accents */}
        {(["tl", "tr", "bl", "br"] as const).map((pos) => {
          const styles: Record<string, React.CSSProperties> = {
            tl: { top: 0, left: 0 },
            tr: { top: 0, right: 0, transform: "scaleX(-1)" },
            bl: { bottom: 0, left: 0, transform: "scaleY(-1)" },
            br: { bottom: 0, right: 0, transform: "scale(-1,-1)" },
          };
          return (
            <div
              key={pos}
              className="absolute pointer-events-none w-10 h-10"
              style={styles[pos]}
            >
              <svg
                width="40"
                height="40"
                viewBox="0 0 40 40"
                fill="none"
                aria-hidden="true"
              >
                <title>corner</title>
                <path
                  d="M2 38 L2 6 Q2 2 6 2 L38 2"
                  stroke="url(#mapCornerGrad)"
                  strokeWidth="2"
                  strokeLinecap="round"
                  style={{
                    animation: "borderFlicker 2.5s ease-in-out infinite",
                    filter: "drop-shadow(0 0 6px #00d4ff88)",
                  }}
                />
                <defs>
                  <linearGradient
                    id="mapCornerGrad"
                    x1="0%"
                    y1="100%"
                    x2="100%"
                    y2="0%"
                  >
                    <stop offset="0%" stopColor="#00d4ff" />
                    <stop offset="100%" stopColor="#0055ff" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
          );
        })}

        {/* Scan line effect */}
        <div
          className="absolute inset-0 pointer-events-none z-10"
          style={{ overflow: "hidden" }}
        >
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              height: "2px",
              background:
                "linear-gradient(90deg, transparent, rgba(0,212,255,0.25), rgba(0,180,255,0.5), rgba(0,212,255,0.25), transparent)",
              animation: "mapScanline 6s linear infinite",
              top: "0%",
            }}
          />
        </div>

        {/* SVG World Map */}
        <svg
          viewBox={`0 0 ${VIEWBOX_W} ${VIEWBOX_H}`}
          className="w-full h-auto block"
          style={{ maxHeight: "420px" }}
          aria-label="Interactive world map"
          role="img"
        >
          <title>World Map - ClawPro Global Coverage</title>
          <defs>
            {/* Ocean gradient */}
            <radialGradient id="oceanGrad" cx="50%" cy="40%" r="70%">
              <stop offset="0%" stopColor="#0a1f3a" />
              <stop offset="60%" stopColor="#061428" />
              <stop offset="100%" stopColor="#020b18" />
            </radialGradient>
            {/* Grid pattern */}
            <pattern
              id="gridPat"
              width="40"
              height="40"
              patternUnits="userSpaceOnUse"
            >
              <line
                x1="0"
                y1="0"
                x2="40"
                y2="0"
                stroke="rgba(0,180,255,0.06)"
                strokeWidth="0.5"
                strokeDasharray="4,8"
                style={{ animation: "gridLineMove 8s linear infinite" }}
              />
              <line
                x1="0"
                y1="0"
                x2="0"
                y2="40"
                stroke="rgba(0,180,255,0.06)"
                strokeWidth="0.5"
                strokeDasharray="4,8"
              />
            </pattern>
            {/* Land glow filter */}
            <filter id="landGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            {/* Active dot glow filter */}
            <filter
              id="activeDotGlow"
              x="-100%"
              y="-100%"
              width="300%"
              height="300%"
            >
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            {/* Glow for active country */}
            <filter id="pulseGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="6" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Ocean background */}
          <rect
            x="0"
            y="0"
            width={VIEWBOX_W}
            height={VIEWBOX_H}
            fill="url(#oceanGrad)"
          />
          {/* Grid overlay */}
          <rect
            x="0"
            y="0"
            width={VIEWBOX_W}
            height={VIEWBOX_H}
            fill="url(#gridPat)"
          />

          {/* Latitude lines */}
          {[-60, -30, 0, 30, 60].map((lat) => {
            const y = ((90 - lat) / 180) * VIEWBOX_H;
            const opacity = lat === 0 ? 0.25 : 0.1;
            return (
              <line
                key={`lat-${lat}`}
                x1="0"
                y1={y}
                x2={VIEWBOX_W}
                y2={y}
                stroke={
                  lat === 0 ? "rgba(0,200,255,0.4)" : "rgba(0,150,200,0.2)"
                }
                strokeWidth={lat === 0 ? 0.8 : 0.4}
                strokeDasharray={lat === 0 ? "none" : "6,12"}
                opacity={opacity * 3}
              />
            );
          })}
          {/* Longitude lines */}
          {[-150, -120, -90, -60, -30, 0, 30, 60, 90, 120, 150].map((lon) => {
            const x = ((lon + 180) / 360) * VIEWBOX_W;
            return (
              <line
                key={`lon-${lon}`}
                x1={x}
                y1="0"
                x2={x}
                y2={VIEWBOX_H}
                stroke="rgba(0,150,200,0.12)"
                strokeWidth="0.4"
                strokeDasharray="6,14"
              />
            );
          })}

          {/* Country dots -- interactive */}
          {COUNTRIES.map((country) => {
            const x = (country.cx / 100) * VIEWBOX_W;
            const y = (country.cy / 100) * VIEWBOX_H;
            const isActive = activeCountry?.code === country.code;
            const isGlowing = glowingCountries.has(country.code);
            const isHovered = hoveredCountry === country.code;

            return (
              <g
                key={country.code}
                className="country-dot"
                aria-label={`${country.name} (${country.code})`}
                onClick={(e) =>
                  handleCountryClick(country, e as unknown as React.MouseEvent)
                }
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    const rect = containerRef.current?.getBoundingClientRect();
                    const svgX = (country.cx / 100) * (rect?.width ?? 600);
                    const svgY =
                      (country.cy / 100) * ((rect?.height ?? 400) * 0.65);
                    setActiveCountry({
                      code: country.code,
                      name: country.name,
                      x: svgX,
                      y: svgY,
                    });
                  }
                }}
                onMouseEnter={() => setHoveredCountry(country.code)}
                onMouseLeave={() => setHoveredCountry(null)}
                onFocus={() => setHoveredCountry(country.code)}
                onBlur={() => setHoveredCountry(null)}
                data-ocid={`worldmap.${country.code.toLowerCase()}.map_marker`}
              >
                {/* Outer pulse ring for active */}
                {isActive && (
                  <circle
                    cx={x}
                    cy={y}
                    r="14"
                    fill="none"
                    stroke="rgba(255,80,60,0.5)"
                    strokeWidth="1.5"
                    style={{
                      animation: "activeDotPulse 1s ease-in-out infinite",
                    }}
                  />
                )}
                {/* Glow halo for glowing/hovered */}
                {(isGlowing || isHovered) && !isActive && (
                  <circle
                    cx={x}
                    cy={y}
                    r="10"
                    fill={
                      isHovered
                        ? "rgba(0,212,255,0.15)"
                        : "rgba(0,180,255,0.08)"
                    }
                    style={
                      isGlowing
                        ? { animation: "countryGlow 1.8s ease-in-out infinite" }
                        : undefined
                    }
                  />
                )}
                {/* Active halo */}
                {isActive && (
                  <circle
                    cx={x}
                    cy={y}
                    r="12"
                    fill="rgba(255,80,60,0.12)"
                    style={{
                      animation: "countryPulse 0.8s ease-in-out infinite",
                    }}
                  />
                )}
                {/* Main dot */}
                <circle
                  cx={x}
                  cy={y}
                  r={isActive ? 6 : isHovered ? 5.5 : 3.5}
                  fill={
                    isActive
                      ? "#ff4444"
                      : isHovered
                        ? "#00ffcc"
                        : isGlowing
                          ? "#00d4ff"
                          : "rgba(0,180,255,0.65)"
                  }
                  filter={
                    isActive
                      ? "url(#activeDotGlow)"
                      : isGlowing
                        ? "url(#landGlow)"
                        : undefined
                  }
                  style={
                    isActive
                      ? {
                          animation: "activeDotPulse 0.8s ease-in-out infinite",
                        }
                      : isGlowing
                        ? { animation: "countryGlow 1.8s ease-in-out infinite" }
                        : undefined
                  }
                />
                {/* Country code label (shown on hover/active) */}
                {(isHovered || isActive) && (
                  <>
                    <rect
                      x={x - 14}
                      y={y - 24}
                      width="28"
                      height="14"
                      rx="3"
                      fill={
                        isActive
                          ? "rgba(255,60,40,0.85)"
                          : "rgba(0,100,180,0.85)"
                      }
                      stroke={
                        isActive
                          ? "rgba(255,100,80,0.9)"
                          : "rgba(0,212,255,0.8)"
                      }
                      strokeWidth="0.8"
                    />
                    <text
                      x={x}
                      y={y - 13.5}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fontSize="7"
                      fontFamily="monospace"
                      fontWeight="bold"
                      fill={isActive ? "#ffcccc" : "#00d4ff"}
                      style={{ userSelect: "none" }}
                    >
                      {country.code}
                    </text>
                  </>
                )}
              </g>
            );
          })}

          {/* Tropic lines label */}
          <text
            x="8"
            y={((90 - 23.5) / 180) * VIEWBOX_H - 3}
            fontSize="7"
            fill="rgba(0,200,255,0.3)"
            fontFamily="monospace"
          >
            Tropic of Cancer
          </text>
          <text
            x="8"
            y={((90 + 23.5) / 180) * VIEWBOX_H - 3}
            fontSize="7"
            fill="rgba(0,200,255,0.3)"
            fontFamily="monospace"
          >
            Tropic of Capricorn
          </text>
          <text
            x="8"
            y={(90 / 180) * VIEWBOX_H - 3}
            fontSize="7"
            fill="rgba(0,200,255,0.4)"
            fontFamily="monospace"
          >
            Equator
          </text>
        </svg>

        {/* Country popup */}
        {activeCountry && (
          <div
            className="map-popup absolute z-30 pointer-events-none"
            style={{
              left: Math.min(
                Math.max(activeCountry.x - 80, 8),
                (containerRef.current?.clientWidth ?? 600) - 170,
              ),
              top: Math.max(activeCountry.y - 110, 8),
            }}
          >
            <div
              className="rounded-xl px-4 py-3 text-center min-w-[160px]"
              style={{
                background:
                  "linear-gradient(135deg, rgba(2,15,35,0.97), rgba(3,20,45,0.97))",
                border: "1px solid rgba(0,212,255,0.7)",
                boxShadow:
                  "0 8px 32px rgba(0,0,0,0.8), 0 0 24px rgba(0,212,255,0.3), 0 0 50px rgba(0,100,200,0.15)",
              }}
            >
              {/* Country code badge */}
              <div
                className="inline-flex items-center gap-1.5 mb-2 px-2.5 py-1 rounded-md"
                style={{
                  background: "rgba(0,212,255,0.12)",
                  border: "1px solid rgba(0,212,255,0.4)",
                }}
              >
                <span
                  className="text-xs font-mono font-black tracking-widest"
                  style={{ color: "#00d4ff", textShadow: "0 0 8px #00d4ff" }}
                >
                  {activeCountry.code}
                </span>
              </div>
              {/* Flag */}
              <div className="text-3xl mb-1 leading-none">
                {countryFlag(activeCountry.code)}
              </div>
              {/* Country name */}
              <p
                className="text-sm font-bold leading-tight mb-1"
                style={{ color: "rgba(200,230,255,0.95)" }}
              >
                {activeCountry.name}
              </p>
              {/* Status */}
              <div
                className="flex items-center justify-center gap-1 text-xs font-semibold"
                style={{ color: "#00ffcc", textShadow: "0 0 6px #00ffcc88" }}
              >
                <span
                  style={{
                    display: "inline-block",
                    width: "6px",
                    height: "6px",
                    borderRadius: "50%",
                    background: "#00ffcc",
                    boxShadow: "0 0 6px #00ffcc",
                    animation: "dotPulse 1s ease-in-out infinite",
                  }}
                />
                ClawPro Available
              </div>
            </div>
            {/* Arrow */}
            <div
              className="absolute left-1/2 -translate-x-1/2 -bottom-2 w-4 h-4 rotate-45"
              style={{
                background: "rgba(3,20,45,0.97)",
                borderRight: "1px solid rgba(0,212,255,0.7)",
                borderBottom: "1px solid rgba(0,212,255,0.7)",
              }}
            />
          </div>
        )}

        {/* Bottom status bar */}
        <div
          className="flex items-center justify-between px-4 py-2.5"
          style={{
            borderTop: "1px solid rgba(0,150,200,0.15)",
            background: "rgba(0,10,25,0.6)",
          }}
        >
          <div className="flex items-center gap-2">
            <span
              style={{
                display: "inline-block",
                width: "6px",
                height: "6px",
                borderRadius: "50%",
                background: "#00ffcc",
                boxShadow: "0 0 8px #00ffcc",
                animation: "dotPulse 1.5s ease-in-out infinite",
              }}
            />
            <span
              className="text-xs"
              style={{ color: "rgba(0,200,200,0.8)", fontFamily: "monospace" }}
            >
              LIVE · {COUNTRIES.length} countries online
            </span>
          </div>
          <span
            className="text-xs"
            style={{ color: "rgba(0,150,200,0.6)", fontFamily: "monospace" }}
          >
            Click dot to explore
          </span>
        </div>
      </div>
    </div>
  );
}
