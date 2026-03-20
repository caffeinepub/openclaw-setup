import type React from "react";
import { useCallback, useEffect, useState } from "react";

// Country data with approximate SVG coordinates for a flat map
const COUNTRIES = [
  // Americas
  {
    id: "US",
    name: "United States",
    x: 18,
    y: 36,
    continent: "Americas",
    flag: "🇺🇸",
  },
  { id: "CA", name: "Canada", x: 18, y: 26, continent: "Americas", flag: "🇨🇦" },
  { id: "MX", name: "Mexico", x: 17, y: 44, continent: "Americas", flag: "🇲🇽" },
  { id: "BR", name: "Brazil", x: 28, y: 62, continent: "Americas", flag: "🇧🇷" },
  {
    id: "AR",
    name: "Argentina",
    x: 25,
    y: 76,
    continent: "Americas",
    flag: "🇦🇷",
  },
  {
    id: "CO",
    name: "Colombia",
    x: 23,
    y: 54,
    continent: "Americas",
    flag: "🇨🇴",
  },
  { id: "PE", name: "Peru", x: 22, y: 62, continent: "Americas", flag: "🇵🇪" },
  { id: "CL", name: "Chile", x: 22, y: 72, continent: "Americas", flag: "🇨🇱" },
  {
    id: "VE",
    name: "Venezuela",
    x: 25,
    y: 52,
    continent: "Americas",
    flag: "🇻🇪",
  },
  // Europe
  {
    id: "GB",
    name: "United Kingdom",
    x: 46,
    y: 26,
    continent: "Europe",
    flag: "🇬🇧",
  },
  { id: "FR", name: "France", x: 47, y: 30, continent: "Europe", flag: "🇫🇷" },
  { id: "DE", name: "Germany", x: 50, y: 28, continent: "Europe", flag: "🇩🇪" },
  { id: "IT", name: "Italy", x: 50, y: 35, continent: "Europe", flag: "🇮🇹" },
  { id: "ES", name: "Spain", x: 45, y: 35, continent: "Europe", flag: "🇪🇸" },
  { id: "RU", name: "Russia", x: 62, y: 22, continent: "Europe", flag: "🇷🇺" },
  { id: "PL", name: "Poland", x: 52, y: 28, continent: "Europe", flag: "🇵🇱" },
  {
    id: "NL",
    name: "Netherlands",
    x: 48,
    y: 27,
    continent: "Europe",
    flag: "🇳🇱",
  },
  { id: "SE", name: "Sweden", x: 51, y: 22, continent: "Europe", flag: "🇸🇪" },
  { id: "NO", name: "Norway", x: 49, y: 20, continent: "Europe", flag: "🇳🇴" },
  {
    id: "CH",
    name: "Switzerland",
    x: 49,
    y: 31,
    continent: "Europe",
    flag: "🇨🇭",
  },
  { id: "PT", name: "Portugal", x: 43, y: 35, continent: "Europe", flag: "🇵🇹" },
  { id: "UA", name: "Ukraine", x: 55, y: 29, continent: "Europe", flag: "🇺🇦" },
  // Asia
  { id: "CN", name: "China", x: 76, y: 36, continent: "Asia", flag: "🇨🇳" },
  { id: "IN", name: "India", x: 72, y: 44, continent: "Asia", flag: "🇮🇳" },
  { id: "JP", name: "Japan", x: 84, y: 33, continent: "Asia", flag: "🇯🇵" },
  {
    id: "KR",
    name: "South Korea",
    x: 82,
    y: 33,
    continent: "Asia",
    flag: "🇰🇷",
  },
  { id: "ID", name: "Indonesia", x: 79, y: 57, continent: "Asia", flag: "🇮🇩" },
  { id: "TH", name: "Thailand", x: 77, y: 48, continent: "Asia", flag: "🇹🇭" },
  { id: "VN", name: "Vietnam", x: 79, y: 47, continent: "Asia", flag: "🇻🇳" },
  {
    id: "PH",
    name: "Philippines",
    x: 82,
    y: 50,
    continent: "Asia",
    flag: "🇵🇭",
  },
  { id: "PK", name: "Pakistan", x: 69, y: 40, continent: "Asia", flag: "🇵🇰" },
  { id: "BD", name: "Bangladesh", x: 74, y: 44, continent: "Asia", flag: "🇧🇩" },
  { id: "MY", name: "Malaysia", x: 79, y: 55, continent: "Asia", flag: "🇲🇾" },
  { id: "SG", name: "Singapore", x: 79, y: 57, continent: "Asia", flag: "🇸🇬" },
  { id: "TW", name: "Taiwan", x: 82, y: 40, continent: "Asia", flag: "🇹🇼" },
  { id: "HK", name: "Hong Kong", x: 81, y: 42, continent: "Asia", flag: "🇭🇰" },
  // Middle East
  {
    id: "SA",
    name: "Saudi Arabia",
    x: 61,
    y: 44,
    continent: "Middle East",
    flag: "🇸🇦",
  },
  { id: "AE", name: "UAE", x: 64, y: 45, continent: "Middle East", flag: "🇦🇪" },
  {
    id: "TR",
    name: "Turkey",
    x: 56,
    y: 36,
    continent: "Middle East",
    flag: "🇹🇷",
  },
  {
    id: "IR",
    name: "Iran",
    x: 64,
    y: 38,
    continent: "Middle East",
    flag: "🇮🇷",
  },
  {
    id: "IL",
    name: "Israel",
    x: 57,
    y: 40,
    continent: "Middle East",
    flag: "🇮🇱",
  },
  {
    id: "IQ",
    name: "Iraq",
    x: 61,
    y: 39,
    continent: "Middle East",
    flag: "🇮🇶",
  },
  {
    id: "QA",
    name: "Qatar",
    x: 64,
    y: 45,
    continent: "Middle East",
    flag: "🇶🇦",
  },
  // Africa
  { id: "NG", name: "Nigeria", x: 50, y: 52, continent: "Africa", flag: "🇳🇬" },
  {
    id: "ZA",
    name: "South Africa",
    x: 54,
    y: 70,
    continent: "Africa",
    flag: "🇿🇦",
  },
  { id: "EG", name: "Egypt", x: 56, y: 42, continent: "Africa", flag: "🇪🇬" },
  { id: "ET", name: "Ethiopia", x: 58, y: 52, continent: "Africa", flag: "🇪🇹" },
  { id: "KE", name: "Kenya", x: 58, y: 56, continent: "Africa", flag: "🇰🇪" },
  { id: "GH", name: "Ghana", x: 48, y: 52, continent: "Africa", flag: "🇬🇭" },
  { id: "TZ", name: "Tanzania", x: 58, y: 60, continent: "Africa", flag: "🇹🇿" },
  { id: "MA", name: "Morocco", x: 45, y: 38, continent: "Africa", flag: "🇲🇦" },
  { id: "DZ", name: "Algeria", x: 48, y: 38, continent: "Africa", flag: "🇩🇿" },
  // Oceania
  {
    id: "AU",
    name: "Australia",
    x: 83,
    y: 68,
    continent: "Oceania",
    flag: "🇦🇺",
  },
  {
    id: "NZ",
    name: "New Zealand",
    x: 89,
    y: 75,
    continent: "Oceania",
    flag: "🇳🇿",
  },
];

const CONTINENT_COLORS: Record<
  string,
  { dot: string; glow: string; btn: string; led: string }
> = {
  Americas: {
    dot: "#f97316",
    glow: "rgba(249,115,22,0.6)",
    btn: "bg-orange-500 hover:bg-orange-600",
    led: "#f97316",
  },
  Europe: {
    dot: "#818cf8",
    glow: "rgba(129,140,248,0.6)",
    btn: "bg-indigo-500 hover:bg-indigo-600",
    led: "#818cf8",
  },
  Asia: {
    dot: "#22d3ee",
    glow: "rgba(34,211,238,0.6)",
    btn: "bg-cyan-500 hover:bg-cyan-600",
    led: "#22d3ee",
  },
  "Middle East": {
    dot: "#fbbf24",
    glow: "rgba(251,191,36,0.6)",
    btn: "bg-amber-500 hover:bg-amber-600",
    led: "#fbbf24",
  },
  Africa: {
    dot: "#4ade80",
    glow: "rgba(74,222,128,0.6)",
    btn: "bg-green-500 hover:bg-green-600",
    led: "#4ade80",
  },
  Oceania: {
    dot: "#f472b6",
    glow: "rgba(244,114,182,0.6)",
    btn: "bg-pink-500 hover:bg-pink-600",
    led: "#f472b6",
  },
};

const CONTINENT_COUNTS: Record<string, number> = {};
for (const c of COUNTRIES) {
  CONTINENT_COUNTS[c.continent] = (CONTINENT_COUNTS[c.continent] || 0) + 1;
}

// Mock registration data
const getMockRegistrations = (id: string) => {
  const seed = id.charCodeAt(0) * 17 + (id.charCodeAt(1) || 3) * 7;
  return (seed % 9800) + 200;
};

const BASE_TOP_COUNTRIES = [
  {
    code: "US",
    name: "United States",
    flag: "🇺🇸",
    count: 12453,
    continent: "Americas",
  },
  { code: "ID", name: "Indonesia", flag: "🇮🇩", count: 8901, continent: "Asia" },
  { code: "IN", name: "India", flag: "🇮🇳", count: 7654, continent: "Asia" },
  {
    code: "BR",
    name: "Brazil",
    flag: "🇧🇷",
    count: 5432,
    continent: "Americas",
  },
  {
    code: "PH",
    name: "Philippines",
    flag: "🇵🇭",
    count: 4321,
    continent: "Asia",
  },
  { code: "NG", name: "Nigeria", flag: "🇳🇬", count: 3456, continent: "Africa" },
  {
    code: "MX",
    name: "Mexico",
    flag: "🇲🇽",
    count: 2987,
    continent: "Americas",
  },
  { code: "DE", name: "Germany", flag: "🇩🇪", count: 2456, continent: "Europe" },
  {
    code: "GB",
    name: "United Kingdom",
    flag: "🇬🇧",
    count: 2134,
    continent: "Europe",
  },
  { code: "JP", name: "Japan", flag: "🇯🇵", count: 1876, continent: "Asia" },
];

// Shuffle helper
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function InteractiveWorldMap() {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [hovered, setHovered] = useState<string | null>(null);
  const [activeContinent, setActiveContinent] = useState<string | null>(null);
  const [glowing, setGlowing] = useState<string[]>([]);
  const [popup, setPopup] = useState<{
    id: string;
    x: number;
    y: number;
  } | null>(null);
  const [leaderboard, setLeaderboard] = useState(BASE_TOP_COUNTRIES);

  // Auto-glow 2-3 countries every 1.2 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      const pool = activeContinent
        ? COUNTRIES.filter((c) => c.continent === activeContinent)
        : COUNTRIES;
      const shuffled = [...pool].sort(() => Math.random() - 0.5);
      setGlowing(
        shuffled.slice(0, 2 + Math.floor(Math.random() * 2)).map((c) => c.id),
      );
    }, 1200);
    return () => clearInterval(interval);
  }, [activeContinent]);

  // Shuffle leaderboard order every 10 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      setLeaderboard(shuffle(BASE_TOP_COUNTRIES));
    }, 600000);
    return () => clearInterval(interval);
  }, []);

  const toggleSelect = useCallback((id: string, x: number, y: number) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
    setPopup((prev) => (prev?.id === id ? null : { id, x, y }));
  }, []);

  const visibleCountries = activeContinent
    ? COUNTRIES.filter((c) => c.continent === activeContinent)
    : COUNTRIES;

  const glowingCountries = COUNTRIES.filter((c) => glowing.includes(c.id));

  return (
    <div className="space-y-4">
      {/* Continent filters */}
      <div className="flex flex-wrap gap-2 justify-center">
        {Object.entries(CONTINENT_COLORS).map(([continent, colors]) => (
          <button
            key={continent}
            type="button"
            onClick={() =>
              setActiveContinent(
                activeContinent === continent ? null : continent,
              )
            }
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-white transition-all duration-200 ${
              activeContinent === continent
                ? `${colors.btn} ring-2 ring-white/40`
                : "bg-gray-700 hover:bg-gray-600"
            }`}
            data-ocid="map.tab"
          >
            <span
              className="w-2 h-2 rounded-full inline-block"
              style={{
                background: colors.led,
                boxShadow:
                  activeContinent === continent
                    ? `0 0 6px ${colors.led}`
                    : undefined,
                animation:
                  activeContinent === continent
                    ? "pulse 1.5s ease-in-out infinite"
                    : undefined,
              }}
            />
            {continent}
            <span className="opacity-70">({CONTINENT_COUNTS[continent]})</span>
          </button>
        ))}
        {selected.size > 0 && (
          <button
            type="button"
            onClick={() => {
              setSelected(new Set());
              setPopup(null);
            }}
            className="px-3 py-1.5 rounded-full text-xs font-semibold bg-red-600 hover:bg-red-700 text-white transition-all"
            data-ocid="map.delete_button"
          >
            Reset ({selected.size})
          </button>
        )}
      </div>

      {/* Map container */}
      <div
        className="relative w-full rounded-2xl overflow-hidden border border-gray-700"
        style={{
          background: "#0a0f1e",
          paddingBottom: "50%",
          boxShadow:
            "0 0 0 2px rgba(34,211,238,0.2), 0 0 30px rgba(6,182,212,0.1)",
          animation: "mapRingGlow 3s ease-in-out infinite alternate",
        }}
      >
        <style>{`
          @keyframes mapRingGlow {
            0% { box-shadow: 0 0 0 2px rgba(34,211,238,0.2), 0 0 20px rgba(6,182,212,0.08); }
            100% { box-shadow: 0 0 0 2px rgba(34,211,238,0.5), 0 0 40px rgba(6,182,212,0.18); }
          }
          @keyframes dotPulse {
            0%,100% { r: 3.5; opacity: 0.9; }
            50% { r: 5.5; opacity: 1; }
          }
        `}</style>
        <svg
          viewBox="0 0 100 50"
          className="absolute inset-0 w-full h-full"
          style={{ cursor: "crosshair" }}
          onClick={() => setPopup(null)}
          onKeyDown={undefined}
          role="img"
          aria-label="World map"
        >
          {/* Grid lines */}
          {[10, 20, 30, 40, 50, 60, 70, 80, 90].map((x) => (
            <line
              key={`v${x}`}
              x1={x}
              y1={0}
              x2={x}
              y2={50}
              stroke="rgba(255,255,255,0.04)"
              strokeWidth="0.2"
            />
          ))}
          {[10, 20, 30, 40].map((y) => (
            <line
              key={`h${y}`}
              x1={0}
              y1={y}
              x2={100}
              y2={y}
              stroke="rgba(255,255,255,0.04)"
              strokeWidth="0.2"
            />
          ))}
          {/* Country dots */}
          {visibleCountries.map((country) => {
            const colors = CONTINENT_COLORS[country.continent];
            const isSelected = selected.has(country.id);
            const isGlowing = glowing.includes(country.id);
            const isHovered = hovered === country.id;
            return (
              <g key={country.id}>
                {/* Glow ring when glowing */}
                {(isGlowing || isSelected) && (
                  <circle
                    cx={country.x}
                    cy={country.y}
                    r={isSelected ? 5 : 4}
                    fill="none"
                    stroke={colors.dot}
                    strokeWidth="0.6"
                    opacity="0.5"
                    style={{ animation: "dotPulse 1.2s ease-in-out infinite" }}
                  />
                )}
                <circle
                  cx={country.x}
                  cy={country.y}
                  r={isHovered || isSelected ? 3.5 : 2.5}
                  fill={isSelected ? colors.dot : `${colors.dot}99`}
                  style={{
                    cursor: "pointer",
                    filter:
                      isGlowing || isSelected
                        ? `drop-shadow(0 0 2px ${colors.dot})`
                        : undefined,
                    transition: "r 0.15s ease",
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleSelect(country.id, country.x, country.y);
                  }}
                  onMouseEnter={() => setHovered(country.id)}
                  onMouseLeave={() => setHovered(null)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) =>
                    e.key === "Enter" &&
                    toggleSelect(country.id, country.x, country.y)
                  }
                  aria-label={country.name}
                  data-ocid="map.map_marker"
                />
                {/* Hover tooltip */}
                {isHovered && !popup && (
                  <g>
                    <rect
                      x={country.x + 2}
                      y={country.y - 6}
                      width={country.name.length * 1.2 + 4}
                      height={6}
                      rx={1}
                      fill="rgba(0,0,0,0.85)"
                    />
                    <text
                      x={country.x + 4}
                      y={country.y - 1.5}
                      fontSize="3"
                      fill="#ffffff"
                      fontFamily="sans-serif"
                    >
                      {country.name}
                    </text>
                  </g>
                )}
              </g>
            );
          })}
          {/* Popup */}
          {popup &&
            (() => {
              const country = COUNTRIES.find((c) => c.id === popup.id);
              if (!country) return null;
              const regs = getMockRegistrations(country.id);
              const px = Math.min(popup.x + 3, 70);
              const py = Math.max(popup.y - 14, 2);
              return (
                <g>
                  <rect
                    x={px}
                    y={py}
                    width={28}
                    height={13}
                    rx={1.5}
                    fill="rgba(6,12,30,0.95)"
                    stroke={CONTINENT_COLORS[country.continent].dot}
                    strokeWidth="0.4"
                  />
                  <text
                    x={px + 2}
                    y={py + 4}
                    fontSize="3.5"
                    fill="#ffffff"
                    fontFamily="sans-serif"
                    fontWeight="bold"
                  >
                    {country.flag} {country.name}
                  </text>
                  <text
                    x={px + 2}
                    y={py + 8}
                    fontSize="2.8"
                    fill="#94a3b8"
                    fontFamily="sans-serif"
                  >
                    {country.continent} · {regs.toLocaleString()} members
                  </text>
                  <text
                    x={px + 2}
                    y={py + 11.5}
                    fontSize="2.5"
                    fill="#22d3ee"
                    fontFamily="sans-serif"
                  >
                    ✓ ClawPro Available
                  </text>
                </g>
              );
            })()}
        </svg>
      </div>

      {/* Live indicator & glowing countries */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-1.5">
          <span
            className="w-2 h-2 rounded-full bg-green-400 inline-block"
            style={{
              animation: "pulse 1s ease-in-out infinite",
              boxShadow: "0 0 6px #4ade80",
            }}
          />
          <span className="text-xs text-gray-400">
            LIVE · {visibleCountries.length} countries
          </span>
        </div>
        {glowingCountries.slice(0, 3).map((c) => (
          <span key={c.id} className="flex items-center gap-1 text-xs">
            <span
              className="w-2 h-2 rounded-full"
              style={{
                background: CONTINENT_COLORS[c.continent].dot,
                boxShadow: `0 0 4px ${CONTINENT_COLORS[c.continent].dot}`,
              }}
            />
            <span className="text-gray-300">
              {c.flag} {c.name}
            </span>
          </span>
        ))}
      </div>

      {/* Top Countries Leaderboard - shuffles every 10 minutes */}
      <div className="rounded-xl border border-gray-700 bg-gray-900/50 p-4">
        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
          🏆 Top Countries by Registrations
          <span className="ml-auto text-[10px] font-normal text-gray-500 normal-case">
            Updates every 10 min
          </span>
        </h4>
        <div className="space-y-2">
          {leaderboard.slice(0, 5).map((c, i) => (
            <div
              key={c.code}
              className="flex items-center gap-2"
              data-ocid={`map.item.${i + 1}`}
            >
              <span className="text-xs text-gray-500 w-4">{i + 1}</span>
              <span className="text-sm">{c.flag}</span>
              <span className="text-xs text-gray-300 flex-1">{c.name}</span>
              <span
                className="text-xs font-semibold"
                style={{
                  color: CONTINENT_COLORS[c.continent]?.dot ?? "#22d3ee",
                }}
              >
                {c.count.toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
