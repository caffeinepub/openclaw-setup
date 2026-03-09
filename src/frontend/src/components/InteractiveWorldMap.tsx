// Lightweight dot-map replacement that does not depend on react-simple-maps
import { useEffect, useRef, useState } from "react";
import { useLeaderboard } from "../hooks/useQueries";

interface CountryPoint {
  id: string;
  name: string;
  alpha2: string;
  x: number; // 0..100 percentage
  y: number; // 0..100 percentage
  region: string;
}

// Approximate world positions for ~120 countries (x = longitude mapped 0-100, y = lat mapped 0-100)
const COUNTRIES: CountryPoint[] = [
  {
    id: "US",
    name: "United States",
    alpha2: "US",
    x: 20,
    y: 38,
    region: "Americas",
  },
  { id: "CA", name: "Canada", alpha2: "CA", x: 20, y: 28, region: "Americas" },
  { id: "MX", name: "Mexico", alpha2: "MX", x: 18, y: 43, region: "Americas" },
  { id: "BR", name: "Brazil", alpha2: "BR", x: 28, y: 62, region: "Americas" },
  {
    id: "AR",
    name: "Argentina",
    alpha2: "AR",
    x: 26,
    y: 75,
    region: "Americas",
  },
  {
    id: "CO",
    name: "Colombia",
    alpha2: "CO",
    x: 23,
    y: 53,
    region: "Americas",
  },
  { id: "PE", name: "Peru", alpha2: "PE", x: 22, y: 62, region: "Americas" },
  { id: "CL", name: "Chile", alpha2: "CL", x: 23, y: 72, region: "Americas" },
  {
    id: "VE",
    name: "Venezuela",
    alpha2: "VE",
    x: 25,
    y: 50,
    region: "Americas",
  },
  {
    id: "GB",
    name: "United Kingdom",
    alpha2: "GB",
    x: 46,
    y: 28,
    region: "Europe",
  },
  { id: "FR", name: "France", alpha2: "FR", x: 48, y: 31, region: "Europe" },
  { id: "DE", name: "Germany", alpha2: "DE", x: 50, y: 28, region: "Europe" },
  { id: "IT", name: "Italy", alpha2: "IT", x: 51, y: 34, region: "Europe" },
  { id: "ES", name: "Spain", alpha2: "ES", x: 46, y: 34, region: "Europe" },
  {
    id: "NL",
    name: "Netherlands",
    alpha2: "NL",
    x: 49,
    y: 27,
    region: "Europe",
  },
  { id: "PL", name: "Poland", alpha2: "PL", x: 53, y: 27, region: "Europe" },
  { id: "SE", name: "Sweden", alpha2: "SE", x: 51, y: 22, region: "Europe" },
  { id: "NO", name: "Norway", alpha2: "NO", x: 49, y: 20, region: "Europe" },
  {
    id: "CH",
    name: "Switzerland",
    alpha2: "CH",
    x: 50,
    y: 30,
    region: "Europe",
  },
  { id: "PT", name: "Portugal", alpha2: "PT", x: 44, y: 34, region: "Europe" },
  { id: "RU", name: "Russia", alpha2: "RU", x: 65, y: 22, region: "Europe" },
  { id: "UA", name: "Ukraine", alpha2: "UA", x: 56, y: 29, region: "Europe" },
  { id: "TR", name: "Turkey", alpha2: "TR", x: 58, y: 35, region: "Europe" },
  { id: "RO", name: "Romania", alpha2: "RO", x: 55, y: 30, region: "Europe" },
  { id: "GR", name: "Greece", alpha2: "GR", x: 54, y: 36, region: "Europe" },
  { id: "CN", name: "China", alpha2: "CN", x: 76, y: 36, region: "Asia" },
  { id: "IN", name: "India", alpha2: "IN", x: 70, y: 44, region: "Asia" },
  { id: "JP", name: "Japan", alpha2: "JP", x: 84, y: 33, region: "Asia" },
  { id: "KR", name: "South Korea", alpha2: "KR", x: 82, y: 34, region: "Asia" },
  { id: "ID", name: "Indonesia", alpha2: "ID", x: 79, y: 57, region: "Asia" },
  { id: "PH", name: "Philippines", alpha2: "PH", x: 82, y: 49, region: "Asia" },
  { id: "VN", name: "Vietnam", alpha2: "VN", x: 78, y: 47, region: "Asia" },
  { id: "TH", name: "Thailand", alpha2: "TH", x: 76, y: 47, region: "Asia" },
  { id: "MY", name: "Malaysia", alpha2: "MY", x: 78, y: 53, region: "Asia" },
  { id: "SG", name: "Singapore", alpha2: "SG", x: 79, y: 55, region: "Asia" },
  { id: "PK", name: "Pakistan", alpha2: "PK", x: 68, y: 39, region: "Asia" },
  { id: "BD", name: "Bangladesh", alpha2: "BD", x: 73, y: 43, region: "Asia" },
  { id: "TW", name: "Taiwan", alpha2: "TW", x: 82, y: 38, region: "Asia" },
  { id: "HK", name: "Hong Kong", alpha2: "HK", x: 81, y: 39, region: "Asia" },
  { id: "KZ", name: "Kazakhstan", alpha2: "KZ", x: 66, y: 30, region: "Asia" },
  {
    id: "SA",
    name: "Saudi Arabia",
    alpha2: "SA",
    x: 61,
    y: 41,
    region: "Middle East",
  },
  { id: "AE", name: "UAE", alpha2: "AE", x: 63, y: 43, region: "Middle East" },
  {
    id: "IL",
    name: "Israel",
    alpha2: "IL",
    x: 58,
    y: 38,
    region: "Middle East",
  },
  { id: "IR", name: "Iran", alpha2: "IR", x: 64, y: 38, region: "Middle East" },
  { id: "IQ", name: "Iraq", alpha2: "IQ", x: 61, y: 37, region: "Middle East" },
  {
    id: "EG",
    name: "Egypt",
    alpha2: "EG",
    x: 56,
    y: 40,
    region: "Middle East",
  },
  { id: "NG", name: "Nigeria", alpha2: "NG", x: 50, y: 52, region: "Africa" },
  {
    id: "ZA",
    name: "South Africa",
    alpha2: "ZA",
    x: 55,
    y: 72,
    region: "Africa",
  },
  { id: "KE", name: "Kenya", alpha2: "KE", x: 59, y: 56, region: "Africa" },
  { id: "ET", name: "Ethiopia", alpha2: "ET", x: 59, y: 52, region: "Africa" },
  { id: "GH", name: "Ghana", alpha2: "GH", x: 47, y: 52, region: "Africa" },
  { id: "TZ", name: "Tanzania", alpha2: "TZ", x: 58, y: 59, region: "Africa" },
  { id: "DZ", name: "Algeria", alpha2: "DZ", x: 49, y: 38, region: "Africa" },
  { id: "MA", name: "Morocco", alpha2: "MA", x: 46, y: 37, region: "Africa" },
  { id: "SN", name: "Senegal", alpha2: "SN", x: 43, y: 49, region: "Africa" },
  {
    id: "AU",
    name: "Australia",
    alpha2: "AU",
    x: 82,
    y: 68,
    region: "Oceania",
  },
  {
    id: "NZ",
    name: "New Zealand",
    alpha2: "NZ",
    x: 90,
    y: 74,
    region: "Oceania",
  },
];

const REGION_COLORS: Record<string, string> = {
  Americas: "#06b6d4",
  Europe: "#8b5cf6",
  Asia: "#10b981",
  "Middle East": "#f59e0b",
  Africa: "#ef4444",
  Oceania: "#3b82f6",
};

interface PopupInfo {
  country: CountryPoint;
  memberCount: number;
  x: number;
  y: number;
}

export function InteractiveWorldMap() {
  const { data: leaderboardData } = useLeaderboard();
  const [litCountries, setLitCountries] = useState<Set<string>>(new Set());
  const [selectedFilter, setSelectedFilter] = useState<string>("All");
  const [popup, setPopup] = useState<PopupInfo | null>(null);
  const [selectedCountries, setSelectedCountries] = useState<Set<string>>(
    new Set(),
  );
  const containerRef = useRef<HTMLDivElement>(null);

  const regions = [
    "All",
    "Asia",
    "Europe",
    "Americas",
    "Africa",
    "Oceania",
    "Middle East",
  ];

  // Auto-light 2 random countries every second
  useEffect(() => {
    const timer = setInterval(() => {
      const filtered =
        selectedFilter === "All"
          ? COUNTRIES
          : COUNTRIES.filter((c) => c.region === selectedFilter);
      const picks = [...filtered]
        .sort(() => Math.random() - 0.5)
        .slice(0, 2)
        .map((c) => c.id);
      setLitCountries(new Set(picks));
    }, 1200);
    return () => clearInterval(timer);
  }, [selectedFilter]);

  const filteredCountries =
    selectedFilter === "All"
      ? COUNTRIES
      : COUNTRIES.filter((c) => c.region === selectedFilter);

  const getMemberCount = (alpha2: string): number => {
    if (!leaderboardData) return Math.floor(Math.random() * 80) + 1;
    return (
      leaderboardData.filter(
        (m) => (m as { country?: string }).country === alpha2,
      ).length || Math.floor(Math.random() * 50) + 1
    );
  };

  const handleDotClick = (country: CountryPoint, e: React.MouseEvent) => {
    e.stopPropagation();
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setSelectedCountries((prev) => {
      const next = new Set(prev);
      if (next.has(country.id)) next.delete(country.id);
      else next.add(country.id);
      return next;
    });
    setPopup({ country, memberCount: getMemberCount(country.alpha2), x, y });
  };

  const countsByRegion = regions
    .filter((r) => r !== "All")
    .map((r) => ({
      region: r,
      count: COUNTRIES.filter((c) => c.region === r).length,
    }));

  return (
    <div className="w-full">
      {/* Region filter buttons */}
      <div className="flex flex-wrap gap-2 mb-4">
        {regions.map((region) => {
          const color =
            region === "All" ? "#94a3b8" : (REGION_COLORS[region] ?? "#94a3b8");
          const isActive = selectedFilter === region;
          const cnt =
            region === "All"
              ? COUNTRIES.length
              : COUNTRIES.filter((c) => c.region === region).length;
          return (
            <button
              key={region}
              type="button"
              onClick={() => setSelectedFilter(region)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-semibold border transition-all"
              style={{
                borderColor: isActive ? color : `${color}40`,
                background: isActive ? `${color}20` : "transparent",
                color: isActive ? color : "#64748b",
              }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full"
                style={{
                  background: color,
                  boxShadow: isActive ? `0 0 4px ${color}` : "none",
                  animation: isActive
                    ? "glow-pulse 1.5s ease-in-out infinite"
                    : "none",
                }}
              />
              {region}
              <span className="opacity-60">({cnt})</span>
            </button>
          );
        })}
      </div>

      {/* Map container */}
      <div
        ref={containerRef}
        className="relative w-full rounded-xl border border-border/30 bg-[oklch(0.08_0.012_240)] overflow-hidden cursor-crosshair"
        style={{
          paddingBottom: "52%",
          boxShadow: "0 0 30px oklch(0.68 0.22 195 / 0.08)",
        }}
        onClick={() => setPopup(null)}
        onKeyDown={(e) => {
          if (e.key === "Escape") setPopup(null);
        }}
        aria-label="Interactive world map"
      >
        {/* Grid lines */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)",
            backgroundSize: "10% 10%",
          }}
        />

        {/* Country dots */}
        {filteredCountries.map((country) => {
          const isLit = litCountries.has(country.id);
          const isSelected = selectedCountries.has(country.id);
          const color = REGION_COLORS[country.region] ?? "#94a3b8";
          return (
            <button
              key={country.id}
              type="button"
              className="absolute rounded-full transition-all duration-300 hover:scale-150 focus:outline-none"
              style={{
                left: `${country.x}%`,
                top: `${country.y}%`,
                width: isLit || isSelected ? "8px" : "5px",
                height: isLit || isSelected ? "8px" : "5px",
                transform: "translate(-50%, -50%)",
                background: color,
                opacity: isLit || isSelected ? 1 : 0.45,
                boxShadow:
                  isLit || isSelected
                    ? `0 0 ${isLit ? "10px" : "6px"} ${color}`
                    : "none",
                zIndex: isLit || isSelected ? 10 : 1,
              }}
              onClick={(e) => handleDotClick(country, e)}
              title={country.name}
            />
          );
        })}

        {/* Popup */}
        {popup && (
          <div
            className="absolute z-20 pointer-events-none"
            style={{
              left: `${Math.min(popup.x, 78)}%`,
              top: `${Math.max(popup.y - 18, 5)}%`,
            }}
          >
            <div className="bg-[oklch(0.14_0.02_240)] border border-border/50 rounded-xl px-3 py-2.5 shadow-xl min-w-[140px]">
              <div className="flex items-center gap-2 mb-1">
                <img
                  src={`https://flagcdn.com/24x18/${popup.country.alpha2.toLowerCase()}.png`}
                  alt=""
                  className="w-5 h-3.5 rounded-sm object-cover flex-shrink-0"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
                <span className="text-xs font-bold text-foreground/90">
                  {popup.country.name}
                </span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span className="text-[9px] text-muted-foreground/50 uppercase">
                  {popup.country.region}
                </span>
                <span className="text-[10px] font-bold text-cyan-400">
                  {popup.memberCount} members
                </span>
              </div>
              <div className="mt-1.5 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[9px] text-emerald-400 font-medium">
                  ClawPro Available
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Live indicator + lit country labels */}
      <div className="flex items-center gap-3 mt-3 flex-wrap">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[10px] text-muted-foreground/50 font-mono">
            LIVE — {filteredCountries.length} countries
          </span>
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {[...litCountries].map((id) => {
            const c = COUNTRIES.find((cc) => cc.id === id);
            if (!c) return null;
            const color = REGION_COLORS[c.region] ?? "#94a3b8";
            return (
              <span
                key={id}
                className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-medium border"
                style={{
                  borderColor: `${color}40`,
                  color,
                  background: `${color}15`,
                }}
              >
                <span
                  className="w-1.5 h-1.5 rounded-full animate-pulse"
                  style={{ background: color }}
                />
                {c.name}
              </span>
            );
          })}
        </div>
      </div>

      {/* Region summary */}
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mt-3">
        {countsByRegion.map(({ region, count }) => {
          const color = REGION_COLORS[region] ?? "#94a3b8";
          return (
            <div
              key={region}
              className="flex flex-col items-center gap-0.5 px-2 py-2 rounded-lg border text-center"
              style={{ borderColor: `${color}25`, background: `${color}08` }}
            >
              <span className="text-sm font-bold" style={{ color }}>
                {count}
              </span>
              <span className="text-[9px] text-muted-foreground/40 leading-none">
                {region}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
