import { useEffect, useMemo, useRef, useState } from "react";
import { useLeaderboard } from "../../hooks/useQueries";

interface CountryDot {
  id: string;
  name: string;
  alpha2: string;
  x: number;
  y: number;
  continent: string;
}

const COUNTRIES: CountryDot[] = [
  {
    id: "US",
    name: "United States",
    alpha2: "US",
    x: 20,
    y: 38,
    continent: "Americas",
  },
  {
    id: "CA",
    name: "Canada",
    alpha2: "CA",
    x: 20,
    y: 28,
    continent: "Americas",
  },
  {
    id: "MX",
    name: "Mexico",
    alpha2: "MX",
    x: 18,
    y: 43,
    continent: "Americas",
  },
  {
    id: "BR",
    name: "Brazil",
    alpha2: "BR",
    x: 28,
    y: 62,
    continent: "Americas",
  },
  {
    id: "AR",
    name: "Argentina",
    alpha2: "AR",
    x: 26,
    y: 75,
    continent: "Americas",
  },
  {
    id: "CO",
    name: "Colombia",
    alpha2: "CO",
    x: 23,
    y: 53,
    continent: "Americas",
  },
  { id: "PE", name: "Peru", alpha2: "PE", x: 22, y: 62, continent: "Americas" },
  {
    id: "CL",
    name: "Chile",
    alpha2: "CL",
    x: 23,
    y: 72,
    continent: "Americas",
  },
  {
    id: "VE",
    name: "Venezuela",
    alpha2: "VE",
    x: 25,
    y: 50,
    continent: "Americas",
  },
  {
    id: "EC",
    name: "Ecuador",
    alpha2: "EC",
    x: 22,
    y: 56,
    continent: "Americas",
  },
  {
    id: "UY",
    name: "Uruguay",
    alpha2: "UY",
    x: 27,
    y: 73,
    continent: "Americas",
  },
  {
    id: "GT",
    name: "Guatemala",
    alpha2: "GT",
    x: 17,
    y: 46,
    continent: "Americas",
  },
  { id: "CU", name: "Cuba", alpha2: "CU", x: 21, y: 43, continent: "Americas" },
  {
    id: "GB",
    name: "United Kingdom",
    alpha2: "GB",
    x: 46,
    y: 28,
    continent: "Europe",
  },
  { id: "FR", name: "France", alpha2: "FR", x: 48, y: 31, continent: "Europe" },
  {
    id: "DE",
    name: "Germany",
    alpha2: "DE",
    x: 50,
    y: 28,
    continent: "Europe",
  },
  { id: "IT", name: "Italy", alpha2: "IT", x: 51, y: 34, continent: "Europe" },
  { id: "ES", name: "Spain", alpha2: "ES", x: 46, y: 34, continent: "Europe" },
  {
    id: "NL",
    name: "Netherlands",
    alpha2: "NL",
    x: 49,
    y: 27,
    continent: "Europe",
  },
  { id: "PL", name: "Poland", alpha2: "PL", x: 53, y: 27, continent: "Europe" },
  { id: "SE", name: "Sweden", alpha2: "SE", x: 51, y: 22, continent: "Europe" },
  { id: "NO", name: "Norway", alpha2: "NO", x: 49, y: 20, continent: "Europe" },
  {
    id: "CH",
    name: "Switzerland",
    alpha2: "CH",
    x: 50,
    y: 30,
    continent: "Europe",
  },
  {
    id: "PT",
    name: "Portugal",
    alpha2: "PT",
    x: 44,
    y: 34,
    continent: "Europe",
  },
  { id: "RU", name: "Russia", alpha2: "RU", x: 65, y: 22, continent: "Europe" },
  {
    id: "UA",
    name: "Ukraine",
    alpha2: "UA",
    x: 56,
    y: 29,
    continent: "Europe",
  },
  { id: "TR", name: "Turkey", alpha2: "TR", x: 58, y: 35, continent: "Europe" },
  {
    id: "RO",
    name: "Romania",
    alpha2: "RO",
    x: 55,
    y: 30,
    continent: "Europe",
  },
  { id: "GR", name: "Greece", alpha2: "GR", x: 54, y: 36, continent: "Europe" },
  {
    id: "BE",
    name: "Belgium",
    alpha2: "BE",
    x: 49,
    y: 28,
    continent: "Europe",
  },
  {
    id: "AT",
    name: "Austria",
    alpha2: "AT",
    x: 51,
    y: 29,
    continent: "Europe",
  },
  {
    id: "HU",
    name: "Hungary",
    alpha2: "HU",
    x: 52,
    y: 30,
    continent: "Europe",
  },
  {
    id: "CZ",
    name: "Czech Republic",
    alpha2: "CZ",
    x: 51,
    y: 28,
    continent: "Europe",
  },
  {
    id: "DK",
    name: "Denmark",
    alpha2: "DK",
    x: 50,
    y: 25,
    continent: "Europe",
  },
  {
    id: "FI",
    name: "Finland",
    alpha2: "FI",
    x: 53,
    y: 20,
    continent: "Europe",
  },
  {
    id: "IE",
    name: "Ireland",
    alpha2: "IE",
    x: 44,
    y: 28,
    continent: "Europe",
  },
  { id: "CN", name: "China", alpha2: "CN", x: 76, y: 36, continent: "Asia" },
  { id: "IN", name: "India", alpha2: "IN", x: 70, y: 44, continent: "Asia" },
  { id: "JP", name: "Japan", alpha2: "JP", x: 84, y: 33, continent: "Asia" },
  {
    id: "KR",
    name: "South Korea",
    alpha2: "KR",
    x: 82,
    y: 34,
    continent: "Asia",
  },
  {
    id: "ID",
    name: "Indonesia",
    alpha2: "ID",
    x: 79,
    y: 57,
    continent: "Asia",
  },
  {
    id: "PH",
    name: "Philippines",
    alpha2: "PH",
    x: 82,
    y: 49,
    continent: "Asia",
  },
  { id: "VN", name: "Vietnam", alpha2: "VN", x: 78, y: 47, continent: "Asia" },
  { id: "TH", name: "Thailand", alpha2: "TH", x: 76, y: 47, continent: "Asia" },
  { id: "MY", name: "Malaysia", alpha2: "MY", x: 78, y: 53, continent: "Asia" },
  {
    id: "SG",
    name: "Singapore",
    alpha2: "SG",
    x: 79,
    y: 55,
    continent: "Asia",
  },
  { id: "PK", name: "Pakistan", alpha2: "PK", x: 68, y: 39, continent: "Asia" },
  {
    id: "BD",
    name: "Bangladesh",
    alpha2: "BD",
    x: 73,
    y: 43,
    continent: "Asia",
  },
  { id: "TW", name: "Taiwan", alpha2: "TW", x: 82, y: 38, continent: "Asia" },
  {
    id: "KZ",
    name: "Kazakhstan",
    alpha2: "KZ",
    x: 66,
    y: 30,
    continent: "Asia",
  },
  {
    id: "UZ",
    name: "Uzbekistan",
    alpha2: "UZ",
    x: 66,
    y: 33,
    continent: "Asia",
  },
  { id: "NP", name: "Nepal", alpha2: "NP", x: 72, y: 40, continent: "Asia" },
  {
    id: "LK",
    name: "Sri Lanka",
    alpha2: "LK",
    x: 71,
    y: 51,
    continent: "Asia",
  },
  { id: "MN", name: "Mongolia", alpha2: "MN", x: 75, y: 28, continent: "Asia" },
  { id: "KH", name: "Cambodia", alpha2: "KH", x: 78, y: 49, continent: "Asia" },
  { id: "MM", name: "Myanmar", alpha2: "MM", x: 75, y: 44, continent: "Asia" },
  {
    id: "SA",
    name: "Saudi Arabia",
    alpha2: "SA",
    x: 61,
    y: 41,
    continent: "Asia",
  },
  { id: "AE", name: "UAE", alpha2: "AE", x: 63, y: 43, continent: "Asia" },
  { id: "IL", name: "Israel", alpha2: "IL", x: 58, y: 38, continent: "Asia" },
  { id: "IR", name: "Iran", alpha2: "IR", x: 64, y: 38, continent: "Asia" },
  { id: "IQ", name: "Iraq", alpha2: "IQ", x: 61, y: 37, continent: "Asia" },
  { id: "JO", name: "Jordan", alpha2: "JO", x: 59, y: 39, continent: "Asia" },
  { id: "KW", name: "Kuwait", alpha2: "KW", x: 62, y: 40, continent: "Asia" },
  { id: "QA", name: "Qatar", alpha2: "QA", x: 63, y: 42, continent: "Asia" },
  { id: "LB", name: "Lebanon", alpha2: "LB", x: 58, y: 37, continent: "Asia" },
  { id: "SY", name: "Syria", alpha2: "SY", x: 59, y: 36, continent: "Asia" },
  { id: "YE", name: "Yemen", alpha2: "YE", x: 62, y: 46, continent: "Asia" },
  {
    id: "NG",
    name: "Nigeria",
    alpha2: "NG",
    x: 50,
    y: 52,
    continent: "Africa",
  },
  {
    id: "ZA",
    name: "South Africa",
    alpha2: "ZA",
    x: 55,
    y: 72,
    continent: "Africa",
  },
  { id: "KE", name: "Kenya", alpha2: "KE", x: 59, y: 56, continent: "Africa" },
  {
    id: "ET",
    name: "Ethiopia",
    alpha2: "ET",
    x: 59,
    y: 52,
    continent: "Africa",
  },
  { id: "GH", name: "Ghana", alpha2: "GH", x: 47, y: 52, continent: "Africa" },
  {
    id: "TZ",
    name: "Tanzania",
    alpha2: "TZ",
    x: 58,
    y: 59,
    continent: "Africa",
  },
  {
    id: "DZ",
    name: "Algeria",
    alpha2: "DZ",
    x: 49,
    y: 38,
    continent: "Africa",
  },
  {
    id: "MA",
    name: "Morocco",
    alpha2: "MA",
    x: 46,
    y: 37,
    continent: "Africa",
  },
  {
    id: "SN",
    name: "Senegal",
    alpha2: "SN",
    x: 43,
    y: 49,
    continent: "Africa",
  },
  { id: "EG", name: "Egypt", alpha2: "EG", x: 56, y: 40, continent: "Africa" },
  {
    id: "CD",
    name: "DR Congo",
    alpha2: "CD",
    x: 54,
    y: 58,
    continent: "Africa",
  },
  {
    id: "CM",
    name: "Cameroon",
    alpha2: "CM",
    x: 51,
    y: 53,
    continent: "Africa",
  },
  { id: "ZM", name: "Zambia", alpha2: "ZM", x: 56, y: 63, continent: "Africa" },
  {
    id: "ZW",
    name: "Zimbabwe",
    alpha2: "ZW",
    x: 57,
    y: 66,
    continent: "Africa",
  },
  { id: "UG", name: "Uganda", alpha2: "UG", x: 57, y: 55, continent: "Africa" },
  { id: "SD", name: "Sudan", alpha2: "SD", x: 57, y: 48, continent: "Africa" },
  {
    id: "SO",
    name: "Somalia",
    alpha2: "SO",
    x: 62,
    y: 53,
    continent: "Africa",
  },
  { id: "LY", name: "Libya", alpha2: "LY", x: 51, y: 38, continent: "Africa" },
  {
    id: "TN",
    name: "Tunisia",
    alpha2: "TN",
    x: 50,
    y: 36,
    continent: "Africa",
  },
  {
    id: "AU",
    name: "Australia",
    alpha2: "AU",
    x: 82,
    y: 68,
    continent: "Oceania",
  },
  {
    id: "NZ",
    name: "New Zealand",
    alpha2: "NZ",
    x: 90,
    y: 74,
    continent: "Oceania",
  },
];

const CONTINENT_COLORS: Record<string, string> = {
  Americas: "#ff6b35",
  Europe: "#a78bfa",
  Asia: "#22d3ee",
  Africa: "#4ade80",
  Oceania: "#f472b6",
};

const CONTINENTS = ["All", "Americas", "Europe", "Asia", "Africa", "Oceania"];

function getFlag(alpha2: string) {
  try {
    return alpha2
      .toUpperCase()
      .replace(/./g, (c) => String.fromCodePoint(127397 + c.charCodeAt(0)));
  } catch {
    return "";
  }
}

export function AvailableWorldwideSection() {
  const [selectedCountries, setSelectedCountries] = useState<Set<string>>(
    new Set(),
  );
  const [hoveredCountry, setHoveredCountry] = useState<string | null>(null);
  const [activeContinent, setActiveContinent] = useState("All");
  const [glowingCountries, setGlowingCountries] = useState<Set<string>>(
    new Set(),
  );
  const [clickedCountry, setClickedCountry] = useState<CountryDot | null>(null);
  const [clickPos, setClickPos] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const { data: leaderboardData } = useLeaderboard();

  // 2-3 countries auto-glow every 1.2 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      const pool =
        activeContinent === "All"
          ? COUNTRIES
          : COUNTRIES.filter((c) => c.continent === activeContinent);
      const picks = [...pool]
        .sort(() => Math.random() - 0.5)
        .slice(0, 2 + Math.floor(Math.random() * 2));
      setGlowingCountries(new Set(picks.map((c) => c.id)));
    }, 1200);
    return () => clearInterval(interval);
  }, [activeContinent]);

  const registrationsByAlpha2 = useMemo(() => {
    const map: Record<string, number> = {
      US: 2840,
      IN: 1920,
      GB: 1540,
      DE: 1210,
      BR: 1080,
      ID: 980,
      PH: 870,
      NG: 760,
      JP: 650,
      AU: 540,
      FR: 490,
      TR: 430,
      SA: 380,
      ZA: 320,
      KE: 290,
    };
    if (leaderboardData) {
      for (const entry of leaderboardData) {
        const country = (entry as { country?: string }).country ?? "US";
        map[country] = (map[country] ?? 0) + 1;
      }
    }
    return map;
  }, [leaderboardData]);

  const topCountries = useMemo(() => {
    return [...COUNTRIES]
      .map((c) => ({ ...c, members: registrationsByAlpha2[c.alpha2] ?? 0 }))
      .filter((c) => c.members > 0)
      .sort((a, b) => b.members - a.members)
      .slice(0, 10);
  }, [registrationsByAlpha2]);

  const filteredCountries =
    activeContinent === "All"
      ? COUNTRIES
      : COUNTRIES.filter((c) => c.continent === activeContinent);
  const glowingMeta = [...glowingCountries]
    .map((id) => COUNTRIES.find((c) => c.id === id))
    .filter(Boolean) as CountryDot[];

  const handleDotClick = (country: CountryDot, e: React.MouseEvent) => {
    e.stopPropagation();
    const rect = containerRef.current?.getBoundingClientRect();
    if (rect) {
      setClickPos({
        x: ((e.clientX - rect.left) / rect.width) * 100,
        y: ((e.clientY - rect.top) / rect.height) * 100,
      });
    }
    setSelectedCountries((prev) => {
      const next = new Set(prev);
      if (next.has(country.id)) next.delete(country.id);
      else next.add(country.id);
      return next;
    });
    setClickedCountry(country);
  };

  return (
    <section className="py-16 px-4 relative overflow-hidden">
      <style>{`
        @keyframes dot-ring {
          0% { transform: translate(-50%, -50%) scale(1); opacity: 0.9; }
          60% { transform: translate(-50%, -50%) scale(3); opacity: 0; }
          100% { transform: translate(-50%, -50%) scale(1); opacity: 0; }
        }
        @keyframes map-glow-pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>

      <div className="max-w-6xl mx-auto">
        {/* Title */}
        <div className="text-center mb-8">
          <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-violet-400 bg-clip-text text-transparent mb-2">
            ClawPro Available Worldwide
          </h2>
          <div className="flex items-center justify-center gap-2 mt-2">
            <span
              className="w-2 h-2 rounded-full bg-green-400"
              style={{
                boxShadow: "0 0 8px #22c55e",
                animation: "map-glow-pulse 1.5s infinite",
              }}
            />
            <span className="text-xs text-muted-foreground">
              <span className="text-green-400 font-semibold">LIVE</span>
              {" · "}
              {filteredCountries.length} countries available
              {selectedCountries.size > 0 &&
                ` · ${selectedCountries.size} selected`}
            </span>
          </div>
        </div>

        {/* Continent filter buttons */}
        <div className="flex flex-wrap justify-center gap-2 mb-6">
          {CONTINENTS.map((c) => {
            const active = activeContinent === c;
            const color = CONTINENT_COLORS[c] ?? "#22d3ee";
            const count =
              c === "All"
                ? COUNTRIES.length
                : COUNTRIES.filter((cc) => cc.continent === c).length;
            return (
              <button
                type="button"
                key={c}
                onClick={() => setActiveContinent(c)}
                data-ocid="map.continent.button"
                className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-all border"
                style={{
                  borderColor: active ? color : `${color}40`,
                  background: active ? `${color}25` : "transparent",
                  color: active ? color : "#888",
                  boxShadow: active ? `0 0 12px ${color}50` : "none",
                }}
              >
                <span
                  className="w-2 h-2 rounded-full"
                  style={{
                    background: active ? color : `${color}60`,
                    boxShadow: active ? `0 0 6px ${color}` : "none",
                    animation: active ? "map-glow-pulse 1.5s infinite" : "none",
                  }}
                />
                {c}
                {c !== "All" && <span className="opacity-60">({count})</span>}
              </button>
            );
          })}
          {selectedCountries.size > 0 && (
            <button
              type="button"
              onClick={() => {
                setSelectedCountries(new Set());
                setClickedCountry(null);
              }}
              data-ocid="map.reset.button"
              className="px-3 py-1.5 rounded-full text-xs font-medium border border-red-500/40 text-red-400 hover:bg-red-500/10 transition-all"
            >
              ✕ Reset ({selectedCountries.size})
            </button>
          )}
        </div>

        {/* Map */}
        <div
          ref={containerRef}
          className="relative w-full rounded-2xl border border-border/30 overflow-hidden cursor-crosshair"
          style={{
            paddingBottom: "52%",
            background: "oklch(0.07 0.015 240)",
            boxShadow:
              "0 0 0 2px rgba(34,211,238,0.12), 0 0 50px rgba(34,211,238,0.06)",
            userSelect: "none",
            touchAction: "none",
          }}
          onClick={() => setClickedCountry(null)}
          onKeyDown={(e) => {
            if (e.key === "Escape") setClickedCountry(null);
          }}
          aria-label="Interactive world map — click a country to highlight"
        >
          {/* Grid lines */}
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage:
                "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)",
              backgroundSize: "10% 10%",
            }}
          />

          {/* Country dots */}
          {filteredCountries.map((country) => {
            const isGlowing = glowingCountries.has(country.id);
            const isSelected = selectedCountries.has(country.id);
            const isHovered = hoveredCountry === country.id;
            const color = CONTINENT_COLORS[country.continent] ?? "#94a3b8";
            const highlight = isGlowing || isSelected || isHovered;

            return (
              <div
                key={country.id}
                style={{
                  position: "absolute",
                  left: `${country.x}%`,
                  top: `${country.y}%`,
                  zIndex: highlight ? 10 : 1,
                }}
              >
                {/* Ring expand animation for glowing countries */}
                {isGlowing && (
                  <span
                    style={{
                      position: "absolute",
                      width: "16px",
                      height: "16px",
                      borderRadius: "50%",
                      border: `1.5px solid ${color}`,
                      transform: "translate(-50%, -50%)",
                      animation: "dot-ring 1.4s ease-out infinite",
                      pointerEvents: "none",
                    }}
                  />
                )}
                <button
                  type="button"
                  className="absolute rounded-full transition-all duration-200 focus:outline-none"
                  style={{
                    width: highlight ? "8px" : "5px",
                    height: highlight ? "8px" : "5px",
                    transform: `translate(-50%, -50%) scale(${isHovered ? 1.8 : 1})`,
                    background: color,
                    opacity: highlight ? 1 : 0.35,
                    boxShadow: isGlowing
                      ? `0 0 14px 4px ${color}, 0 0 6px ${color}`
                      : isSelected
                        ? `0 0 10px 3px ${color}`
                        : isHovered
                          ? `0 0 10px 2px ${color}`
                          : "none",
                  }}
                  onClick={(e) => handleDotClick(country, e)}
                  onMouseEnter={() => setHoveredCountry(country.id)}
                  onMouseLeave={() => setHoveredCountry(null)}
                  aria-label={country.name}
                />
                {/* Hover tooltip */}
                {isHovered && (
                  <div
                    className="absolute pointer-events-none z-30"
                    style={{ left: "12px", top: "-22px", whiteSpace: "nowrap" }}
                  >
                    <div
                      className="px-2 py-0.5 rounded text-[10px] font-semibold"
                      style={{
                        background: `${color}22`,
                        border: `1px solid ${color}60`,
                        color,
                        backdropFilter: "blur(4px)",
                      }}
                    >
                      {getFlag(country.alpha2)} {country.name}
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          {/* Click popup */}
          {clickedCountry && (
            <div
              className="absolute z-20 pointer-events-none"
              style={{
                left: `${Math.min(clickPos.x, 78)}%`,
                top: `${Math.max(clickPos.y - 18, 5)}%`,
              }}
            >
              <div className="bg-[oklch(0.14_0.02_240)] border border-border/50 rounded-xl px-3 py-2.5 shadow-xl min-w-[160px]">
                <div className="flex items-center gap-2 mb-1">
                  <img
                    src={`https://flagcdn.com/24x18/${clickedCountry.alpha2.toLowerCase()}.png`}
                    alt=""
                    className="w-5 h-3.5 rounded-sm object-cover flex-shrink-0"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                  />
                  <span className="text-xs font-bold text-foreground/90">
                    {clickedCountry.name}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <span className="text-[9px] text-muted-foreground/50 uppercase">
                    {clickedCountry.continent}
                  </span>
                  <span
                    className="text-[10px] font-bold"
                    style={{
                      color:
                        CONTINENT_COLORS[clickedCountry.continent] ?? "#22d3ee",
                    }}
                  >
                    {(
                      registrationsByAlpha2[clickedCountry.alpha2] ?? 0
                    ).toLocaleString()}{" "}
                    users
                  </span>
                </div>
                <div className="mt-1.5 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-[9px] text-emerald-400 font-medium">
                    ClawPro Available Here
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Live indicator + glowing countries */}
        <div className="flex items-center gap-3 mt-4 flex-wrap">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[10px] text-muted-foreground/50 font-mono">
              LIVE — {filteredCountries.length} countries
            </span>
          </div>
          <div className="flex gap-1.5 flex-wrap">
            {glowingMeta.map((c) => {
              const color = CONTINENT_COLORS[c.continent] ?? "#94a3b8";
              return (
                <span
                  key={c.id}
                  className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-medium border"
                  style={{
                    borderColor: `${color}50`,
                    color,
                    background: `${color}15`,
                  }}
                >
                  <span
                    className="w-1.5 h-1.5 rounded-full animate-pulse"
                    style={{ background: color }}
                  />
                  {getFlag(c.alpha2)} {c.name}
                </span>
              );
            })}
          </div>
        </div>

        {/* Top Countries Leaderboard */}
        {topCountries.length > 0 && (
          <div className="mt-8">
            <h3 className="text-center text-sm font-semibold text-muted-foreground/60 uppercase tracking-widest mb-4">
              Top Countries by Registrations
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {topCountries.map((c, idx) => {
                const color = CONTINENT_COLORS[c.continent] ?? "#22d3ee";
                const medals = ["🥇", "🥈", "🥉"];
                return (
                  <div
                    key={c.id}
                    data-ocid={`map.leaderboard.item.${idx + 1}`}
                    className="flex items-center gap-2 p-2 rounded-lg border transition-all hover:scale-[1.02]"
                    style={{
                      background: `${color}10`,
                      borderColor: `${color}30`,
                    }}
                  >
                    <span className="text-base">{getFlag(c.alpha2)}</span>
                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-medium truncate text-foreground/80">
                        {c.name}
                      </div>
                      <div className="text-[10px] font-bold" style={{ color }}>
                        {c.members.toLocaleString()} users
                      </div>
                    </div>
                    {idx < 3 && <span className="text-sm">{medals[idx]}</span>}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Region summary stats */}
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 mt-4">
          {CONTINENTS.filter((c) => c !== "All").map((continent) => {
            const color = CONTINENT_COLORS[continent] ?? "#94a3b8";
            const count = COUNTRIES.filter(
              (c) => c.continent === continent,
            ).length;
            return (
              <div
                key={continent}
                className="flex flex-col items-center gap-0.5 px-2 py-2 rounded-lg border text-center"
                style={{ borderColor: `${color}30`, background: `${color}10` }}
              >
                <span className="text-sm font-bold" style={{ color }}>
                  {count}
                </span>
                <span className="text-[9px] text-muted-foreground/40 leading-none">
                  {continent}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
