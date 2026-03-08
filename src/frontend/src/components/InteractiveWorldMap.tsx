import type React from "react";
import { useCallback, useEffect, useRef, useState } from "react";

// ─── Country data: approximate dot positions on a Mercator-style world map
// Each entry: [lon, lat, numericId, alpha2, name]
const COUNTRIES: Array<{
  lon: number;
  lat: number;
  id: string;
  alpha2: string;
  name: string;
  region: string;
}> = [
  {
    lon: 69,
    lat: 34,
    id: "AF",
    alpha2: "AF",
    name: "Afghanistan",
    region: "Asia",
  },
  {
    lon: 20,
    lat: 41,
    id: "AL",
    alpha2: "AL",
    name: "Albania",
    region: "Europe",
  },
  {
    lon: 3,
    lat: 28,
    id: "DZ",
    alpha2: "DZ",
    name: "Algeria",
    region: "Africa",
  },
  {
    lon: -64,
    lat: -34,
    id: "AR",
    alpha2: "AR",
    name: "Argentina",
    region: "Americas",
  },
  {
    lon: 133,
    lat: -27,
    id: "AU",
    alpha2: "AU",
    name: "Australia",
    region: "Oceania",
  },
  {
    lon: 15,
    lat: 47,
    id: "AT",
    alpha2: "AT",
    name: "Austria",
    region: "Europe",
  },
  {
    lon: 90,
    lat: 24,
    id: "BD",
    alpha2: "BD",
    name: "Bangladesh",
    region: "Asia",
  },
  {
    lon: 4,
    lat: 51,
    id: "BE",
    alpha2: "BE",
    name: "Belgium",
    region: "Europe",
  },
  {
    lon: -63,
    lat: -17,
    id: "BO",
    alpha2: "BO",
    name: "Bolivia",
    region: "Americas",
  },
  {
    lon: -53,
    lat: -10,
    id: "BR",
    alpha2: "BR",
    name: "Brazil",
    region: "Americas",
  },
  {
    lon: 25,
    lat: 43,
    id: "BG",
    alpha2: "BG",
    name: "Bulgaria",
    region: "Europe",
  },
  {
    lon: 105,
    lat: 12,
    id: "KH",
    alpha2: "KH",
    name: "Cambodia",
    region: "Asia",
  },
  {
    lon: -98,
    lat: 57,
    id: "CA",
    alpha2: "CA",
    name: "Canada",
    region: "Americas",
  },
  {
    lon: -71,
    lat: -30,
    id: "CL",
    alpha2: "CL",
    name: "Chile",
    region: "Americas",
  },
  { lon: 105, lat: 35, id: "CN", alpha2: "CN", name: "China", region: "Asia" },
  {
    lon: -74,
    lat: 4,
    id: "CO",
    alpha2: "CO",
    name: "Colombia",
    region: "Americas",
  },
  {
    lon: -84,
    lat: 10,
    id: "CR",
    alpha2: "CR",
    name: "Costa Rica",
    region: "Americas",
  },
  {
    lon: 16,
    lat: 45,
    id: "HR",
    alpha2: "HR",
    name: "Croatia",
    region: "Europe",
  },
  {
    lon: 33,
    lat: 35,
    id: "CY",
    alpha2: "CY",
    name: "Cyprus",
    region: "Europe",
  },
  {
    lon: 16,
    lat: 50,
    id: "CZ",
    alpha2: "CZ",
    name: "Czech Republic",
    region: "Europe",
  },
  {
    lon: 10,
    lat: 56,
    id: "DK",
    alpha2: "DK",
    name: "Denmark",
    region: "Europe",
  },
  {
    lon: 25,
    lat: 59,
    id: "EE",
    alpha2: "EE",
    name: "Estonia",
    region: "Europe",
  },
  {
    lon: 26,
    lat: 9,
    id: "ET",
    alpha2: "ET",
    name: "Ethiopia",
    region: "Africa",
  },
  {
    lon: 25,
    lat: 64,
    id: "FI",
    alpha2: "FI",
    name: "Finland",
    region: "Europe",
  },
  { lon: 2, lat: 46, id: "FR", alpha2: "FR", name: "France", region: "Europe" },
  {
    lon: 10,
    lat: 51,
    id: "DE",
    alpha2: "DE",
    name: "Germany",
    region: "Europe",
  },
  { lon: -1, lat: 8, id: "GH", alpha2: "GH", name: "Ghana", region: "Africa" },
  {
    lon: 22,
    lat: 39,
    id: "GR",
    alpha2: "GR",
    name: "Greece",
    region: "Europe",
  },
  {
    lon: -90,
    lat: 15,
    id: "GT",
    alpha2: "GT",
    name: "Guatemala",
    region: "Americas",
  },
  {
    lon: -72,
    lat: 19,
    id: "HT",
    alpha2: "HT",
    name: "Haiti",
    region: "Americas",
  },
  {
    lon: 19,
    lat: 47,
    id: "HU",
    alpha2: "HU",
    name: "Hungary",
    region: "Europe",
  },
  { lon: 79, lat: 22, id: "IN", alpha2: "IN", name: "India", region: "Asia" },
  {
    lon: 120,
    lat: -5,
    id: "ID",
    alpha2: "ID",
    name: "Indonesia",
    region: "Asia",
  },
  {
    lon: 53,
    lat: 32,
    id: "IR",
    alpha2: "IR",
    name: "Iran",
    region: "Middle East",
  },
  {
    lon: 44,
    lat: 33,
    id: "IQ",
    alpha2: "IQ",
    name: "Iraq",
    region: "Middle East",
  },
  {
    lon: -8,
    lat: 53,
    id: "IE",
    alpha2: "IE",
    name: "Ireland",
    region: "Europe",
  },
  {
    lon: 35,
    lat: 31,
    id: "IL",
    alpha2: "IL",
    name: "Israel",
    region: "Middle East",
  },
  { lon: 12, lat: 42, id: "IT", alpha2: "IT", name: "Italy", region: "Europe" },
  { lon: 138, lat: 36, id: "JP", alpha2: "JP", name: "Japan", region: "Asia" },
  {
    lon: 36,
    lat: 31,
    id: "JO",
    alpha2: "JO",
    name: "Jordan",
    region: "Middle East",
  },
  {
    lon: 68,
    lat: 48,
    id: "KZ",
    alpha2: "KZ",
    name: "Kazakhstan",
    region: "Asia",
  },
  { lon: 38, lat: 1, id: "KE", alpha2: "KE", name: "Kenya", region: "Africa" },
  {
    lon: 47,
    lat: 29,
    id: "KW",
    alpha2: "KW",
    name: "Kuwait",
    region: "Middle East",
  },
  { lon: 103, lat: 18, id: "LA", alpha2: "LA", name: "Laos", region: "Asia" },
  {
    lon: 35,
    lat: 33,
    id: "LB",
    alpha2: "LB",
    name: "Lebanon",
    region: "Middle East",
  },
  { lon: 17, lat: 7, id: "LY", alpha2: "LY", name: "Libya", region: "Africa" },
  {
    lon: 109,
    lat: 4,
    id: "MY",
    alpha2: "MY",
    name: "Malaysia",
    region: "Asia",
  },
  {
    lon: -102,
    lat: 24,
    id: "MX",
    alpha2: "MX",
    name: "Mexico",
    region: "Americas",
  },
  {
    lon: -7,
    lat: 32,
    id: "MA",
    alpha2: "MA",
    name: "Morocco",
    region: "Africa",
  },
  {
    lon: 35,
    lat: -18,
    id: "MZ",
    alpha2: "MZ",
    name: "Mozambique",
    region: "Africa",
  },
  { lon: 85, lat: 28, id: "NP", alpha2: "NP", name: "Nepal", region: "Asia" },
  {
    lon: 5,
    lat: 52,
    id: "NL",
    alpha2: "NL",
    name: "Netherlands",
    region: "Europe",
  },
  {
    lon: 170,
    lat: -41,
    id: "NZ",
    alpha2: "NZ",
    name: "New Zealand",
    region: "Oceania",
  },
  {
    lon: 8,
    lat: 10,
    id: "NG",
    alpha2: "NG",
    name: "Nigeria",
    region: "Africa",
  },
  {
    lon: 10,
    lat: 62,
    id: "NO",
    alpha2: "NO",
    name: "Norway",
    region: "Europe",
  },
  {
    lon: 70,
    lat: 30,
    id: "PK",
    alpha2: "PK",
    name: "Pakistan",
    region: "Asia",
  },
  {
    lon: -79,
    lat: 9,
    id: "PA",
    alpha2: "PA",
    name: "Panama",
    region: "Americas",
  },
  {
    lon: -76,
    lat: -10,
    id: "PE",
    alpha2: "PE",
    name: "Peru",
    region: "Americas",
  },
  {
    lon: 122,
    lat: 13,
    id: "PH",
    alpha2: "PH",
    name: "Philippines",
    region: "Asia",
  },
  {
    lon: 20,
    lat: 52,
    id: "PL",
    alpha2: "PL",
    name: "Poland",
    region: "Europe",
  },
  {
    lon: -8,
    lat: 39,
    id: "PT",
    alpha2: "PT",
    name: "Portugal",
    region: "Europe",
  },
  {
    lon: 51,
    lat: 25,
    id: "QA",
    alpha2: "QA",
    name: "Qatar",
    region: "Middle East",
  },
  {
    lon: 25,
    lat: 46,
    id: "RO",
    alpha2: "RO",
    name: "Romania",
    region: "Europe",
  },
  {
    lon: 100,
    lat: 60,
    id: "RU",
    alpha2: "RU",
    name: "Russia",
    region: "Europe",
  },
  {
    lon: 45,
    lat: 24,
    id: "SA",
    alpha2: "SA",
    name: "Saudi Arabia",
    region: "Middle East",
  },
  {
    lon: -14,
    lat: 14,
    id: "SN",
    alpha2: "SN",
    name: "Senegal",
    region: "Africa",
  },
  { lon: 30, lat: 15, id: "SD", alpha2: "SD", name: "Sudan", region: "Africa" },
  {
    lon: 18,
    lat: 63,
    id: "SE",
    alpha2: "SE",
    name: "Sweden",
    region: "Europe",
  },
  {
    lon: 8,
    lat: 47,
    id: "CH",
    alpha2: "CH",
    name: "Switzerland",
    region: "Europe",
  },
  {
    lon: 38,
    lat: 35,
    id: "SY",
    alpha2: "SY",
    name: "Syria",
    region: "Middle East",
  },
  { lon: 121, lat: 24, id: "TW", alpha2: "TW", name: "Taiwan", region: "Asia" },
  {
    lon: 101,
    lat: 13,
    id: "TH",
    alpha2: "TH",
    name: "Thailand",
    region: "Asia",
  },
  {
    lon: 36,
    lat: 39,
    id: "TR",
    alpha2: "TR",
    name: "Turkey",
    region: "Middle East",
  },
  { lon: 32, lat: 2, id: "UG", alpha2: "UG", name: "Uganda", region: "Africa" },
  {
    lon: 32,
    lat: 49,
    id: "UA",
    alpha2: "UA",
    name: "Ukraine",
    region: "Europe",
  },
  {
    lon: 54,
    lat: 24,
    id: "AE",
    alpha2: "AE",
    name: "United Arab Emirates",
    region: "Middle East",
  },
  {
    lon: -2,
    lat: 54,
    id: "GB",
    alpha2: "GB",
    name: "United Kingdom",
    region: "Europe",
  },
  {
    lon: -98,
    lat: 38,
    id: "US",
    alpha2: "US",
    name: "United States",
    region: "Americas",
  },
  {
    lon: -56,
    lat: -33,
    id: "UY",
    alpha2: "UY",
    name: "Uruguay",
    region: "Americas",
  },
  {
    lon: -66,
    lat: 8,
    id: "VE",
    alpha2: "VE",
    name: "Venezuela",
    region: "Americas",
  },
  {
    lon: 108,
    lat: 16,
    id: "VN",
    alpha2: "VN",
    name: "Vietnam",
    region: "Asia",
  },
  {
    lon: 48,
    lat: 16,
    id: "YE",
    alpha2: "YE",
    name: "Yemen",
    region: "Middle East",
  },
  {
    lon: 30,
    lat: -14,
    id: "ZM",
    alpha2: "ZM",
    name: "Zambia",
    region: "Africa",
  },
  {
    lon: 30,
    lat: -20,
    id: "ZW",
    alpha2: "ZW",
    name: "Zimbabwe",
    region: "Africa",
  },
  {
    lon: 25,
    lat: -30,
    id: "ZA",
    alpha2: "ZA",
    name: "South Africa",
    region: "Africa",
  },
  {
    lon: -1,
    lat: 14,
    id: "BF",
    alpha2: "BF",
    name: "Burkina Faso",
    region: "Africa",
  },
  {
    lon: 12,
    lat: 15,
    id: "CM",
    alpha2: "CM",
    name: "Cameroon",
    region: "Africa",
  },
  {
    lon: -7,
    lat: 8,
    id: "CI",
    alpha2: "CI",
    name: "Ivory Coast",
    region: "Africa",
  },
  {
    lon: 23,
    lat: 3,
    id: "CD",
    alpha2: "CD",
    name: "DR Congo",
    region: "Africa",
  },
  {
    lon: -78,
    lat: -2,
    id: "EC",
    alpha2: "EC",
    name: "Ecuador",
    region: "Americas",
  },
  {
    lon: -89,
    lat: 14,
    id: "SV",
    alpha2: "SV",
    name: "El Salvador",
    region: "Americas",
  },
  {
    lon: 39,
    lat: 14,
    id: "ER",
    alpha2: "ER",
    name: "Eritrea",
    region: "Africa",
  },
  {
    lon: 145,
    lat: -6,
    id: "PG",
    alpha2: "PG",
    name: "Papua New Guinea",
    region: "Oceania",
  },
  {
    lon: 41,
    lat: 2,
    id: "SO",
    alpha2: "SO",
    name: "Somalia",
    region: "Africa",
  },
  { lon: 30, lat: 31, id: "EG", alpha2: "EG", name: "Egypt", region: "Africa" },
  {
    lon: 45,
    lat: 40,
    id: "GE",
    alpha2: "GE",
    name: "Georgia",
    region: "Middle East",
  },
  {
    lon: 127,
    lat: 36,
    id: "KR",
    alpha2: "KR",
    name: "South Korea",
    region: "Asia",
  },
  {
    lon: 127,
    lat: 40,
    id: "KP",
    alpha2: "KP",
    name: "North Korea",
    region: "Asia",
  },
  {
    lon: 47,
    lat: 40,
    id: "AZ",
    alpha2: "AZ",
    name: "Azerbaijan",
    region: "Middle East",
  },
];

const REGION_COLORS: Record<string, string> = {
  Asia: "#22c55e",
  Europe: "#818cf8",
  Americas: "#f97316",
  Africa: "#eab308",
  Oceania: "#06b6d4",
  "Middle East": "#f59e0b",
  Other: "#94a3b8",
};

const REGIONS = [
  { id: "all", label: "All", color: "#00c6ff" },
  { id: "Asia", label: "Asia", color: "#22c55e" },
  { id: "Europe", label: "Europe", color: "#818cf8" },
  { id: "Americas", label: "Americas", color: "#f97316" },
  { id: "Africa", label: "Africa", color: "#eab308" },
  { id: "Oceania", label: "Oceania", color: "#06b6d4" },
  { id: "Middle East", label: "Middle East", color: "#f59e0b" },
];

function getFlag(alpha2: string): string {
  const upper = alpha2.toUpperCase();
  if (upper.length !== 2) return "🌍";
  const pts = [...upper].map((c) => 0x1f1e6 + c.charCodeAt(0) - 65);
  return String.fromCodePoint(...pts);
}

// Mercator-style projection: lon/lat → [x%, y%]
function project(lon: number, lat: number): [number, number] {
  const x = ((lon + 180) / 360) * 100;
  // Mercator: clamp lat to ±85
  const latR = Math.max(-85, Math.min(85, lat));
  const sinLat = Math.sin((latR * Math.PI) / 180);
  const y = (0.5 - Math.log((1 + sinLat) / (1 - sinLat)) / (4 * Math.PI)) * 100;
  return [x, y];
}

interface PopupInfo {
  name: string;
  alpha2: string;
  flag: string;
  region: string;
  x: number;
  y: number;
}

export function InteractiveWorldMap() {
  const [activeRegion, setActiveRegion] = useState("all");
  const [glowingId, setGlowingId] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [popup, setPopup] = useState<PopupInfo | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);

  // Randomly glow a country every second
  useEffect(() => {
    const interval = setInterval(() => {
      const idx = Math.floor(Math.random() * COUNTRIES.length);
      setGlowingId(COUNTRIES[idx].id);
      setTimeout(() => setGlowingId(null), 900);
    }, 1100);
    return () => clearInterval(interval);
  }, []);

  // Close popup on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(e.target as Node)) {
        setPopup(null);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleDotClick = useCallback(
    (country: (typeof COUNTRIES)[0], evt: React.MouseEvent) => {
      const rect = containerRef.current?.getBoundingClientRect();
      const x = rect ? evt.clientX - rect.left : evt.clientX;
      const y = rect ? evt.clientY - rect.top : evt.clientY;
      setPopup({
        name: country.name,
        alpha2: country.alpha2,
        flag: getFlag(country.alpha2),
        region: country.region,
        x,
        y,
      });
    },
    [],
  );

  const visibleCountries =
    activeRegion === "all"
      ? COUNTRIES
      : COUNTRIES.filter((c) => c.region === activeRegion);

  return (
    <div className="w-full">
      {/* Header */}
      <div className="text-center mb-6">
        <span
          className="inline-block text-xs font-mono font-semibold uppercase tracking-widest mb-2"
          style={{ color: "#00c6ff" }}
        >
          Global Availability
        </span>
        <h3 className="font-display font-black text-2xl sm:text-3xl mb-2">
          <span
            style={{
              background: "linear-gradient(135deg, #00c6ff, #0072ff, #a855f7)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            ClawPro Available Worldwide
          </span>
        </h3>
        <p className="text-muted-foreground text-sm max-w-lg mx-auto">
          Click any country dot to see details. ClawPro works in every country
          shown.
        </p>
      </div>

      {/* Region filter buttons */}
      <div className="flex flex-wrap justify-center gap-2 mb-4">
        {REGIONS.map((r) => {
          const isActive = activeRegion === r.id;
          return (
            <button
              key={r.id}
              type="button"
              onClick={() => setActiveRegion(r.id)}
              className="relative px-3 py-1.5 rounded-full text-xs font-bold transition-all duration-300"
              style={{
                background: isActive ? `${r.color}22` : "rgba(0,0,0,0.35)",
                border: `1.5px solid ${isActive ? r.color : `${r.color}55`}`,
                color: isActive ? r.color : `${r.color}99`,
                boxShadow: isActive
                  ? `0 0 10px ${r.color}66, 0 0 20px ${r.color}33`
                  : "none",
                transform: isActive ? "scale(1.06)" : "scale(1)",
              }}
            >
              {r.label}
            </button>
          );
        })}
      </div>

      {/* Map container */}
      <div
        ref={containerRef}
        className="relative w-full rounded-2xl overflow-hidden"
        style={{
          background:
            "linear-gradient(180deg, #050a18 0%, #07101f 60%, #050c1a 100%)",
          border: "1.5px solid rgba(0,198,255,0.25)",
          boxShadow:
            "0 0 30px rgba(0,114,255,0.12), 0 0 60px rgba(168,85,247,0.06)",
          minHeight: 320,
        }}
      >
        {/* Grid lines */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none"
          style={{ opacity: 0.06 }}
          aria-hidden="true"
        >
          <title>grid</title>
          {[10, 20, 30, 40, 50, 60, 70, 80, 90].map((p) => (
            <g key={p}>
              <line
                x1="0"
                y1={`${p}%`}
                x2="100%"
                y2={`${p}%`}
                stroke="#00c6ff"
                strokeWidth="0.5"
              />
              <line
                x1={`${p}%`}
                y1="0"
                x2={`${p}%`}
                y2="100%"
                stroke="#00c6ff"
                strokeWidth="0.5"
              />
            </g>
          ))}
        </svg>

        {/* SVG map dots */}
        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="xMidYMid meet"
          className="w-full"
          style={{ display: "block" }}
          aria-label="World map"
          role="img"
        >
          <title>World map - ClawPro Global Availability</title>
          {COUNTRIES.map((country) => {
            const [x, y] = project(country.lon, country.lat);
            const isVisible =
              activeRegion === "all" || country.region === activeRegion;
            const isGlowing = glowingId === country.id;
            const isHovered = hoveredId === country.id;
            const regionColor = REGION_COLORS[country.region] ?? "#94a3b8";

            let fill = isVisible ? regionColor : "#1a2540";
            let opacity = isVisible ? 0.75 : 0.2;
            let r = 0.7;

            if (isGlowing && isVisible) {
              fill = "#ffffff";
              opacity = 1;
              r = 1.1;
            } else if (isHovered && isVisible) {
              fill = "#ffffff";
              opacity = 0.95;
              r = 1.0;
            }

            return (
              <circle
                key={country.id}
                cx={x}
                cy={y}
                r={r}
                fill={fill}
                opacity={opacity}
                style={{
                  cursor: isVisible ? "pointer" : "default",
                  transition: "r 0.2s ease, opacity 0.2s ease, fill 0.2s ease",
                  filter:
                    isGlowing && isVisible
                      ? `drop-shadow(0 0 1.5px ${regionColor}) drop-shadow(0 0 3px #00c6ff)`
                      : isHovered && isVisible
                        ? `drop-shadow(0 0 1px ${regionColor})`
                        : "none",
                }}
                onMouseEnter={() => isVisible && setHoveredId(country.id)}
                onMouseLeave={() => setHoveredId(null)}
                onClick={(e) => isVisible && handleDotClick(country, e)}
                onKeyDown={(e) => {
                  if (isVisible && (e.key === "Enter" || e.key === " ")) {
                    handleDotClick(
                      country,
                      e as unknown as React.MouseEvent<SVGCircleElement>,
                    );
                  }
                }}
                tabIndex={isVisible ? 0 : -1}
                role="button"
                aria-label={country.name}
              />
            );
          })}
        </svg>

        {/* Popup */}
        {popup && (
          <div
            ref={popupRef}
            className="absolute pointer-events-auto"
            style={{
              left: Math.min(
                popup.x + 14,
                (containerRef.current?.offsetWidth ?? 400) - 220,
              ),
              top: Math.max(popup.y - 100, 8),
              zIndex: 50,
            }}
          >
            <div
              className="rounded-xl p-3 min-w-[200px]"
              style={{
                background:
                  "linear-gradient(135deg, rgba(0,8,24,0.97), rgba(0,20,50,0.97))",
                border: "1.5px solid rgba(0,198,255,0.5)",
                boxShadow:
                  "0 0 18px rgba(0,198,255,0.3), 0 8px 24px rgba(0,0,0,0.7)",
              }}
            >
              {/* Close */}
              <button
                type="button"
                onClick={() => setPopup(null)}
                className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full flex items-center justify-center text-xs transition-colors"
                style={{
                  color: "rgba(0,198,255,0.7)",
                  background: "rgba(0,198,255,0.08)",
                }}
              >
                ×
              </button>

              {/* Flag + name */}
              <div className="flex items-center gap-2.5 mb-2">
                <span className="text-3xl leading-none">{popup.flag}</span>
                <div>
                  <div className="font-bold text-sm text-white leading-tight">
                    {popup.name}
                  </div>
                  <div className="text-xs mt-0.5" style={{ color: "#7dd3fc" }}>
                    {popup.alpha2} · {popup.region}
                  </div>
                </div>
              </div>

              {/* Status badge */}
              <div
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold"
                style={{
                  background: "rgba(0,198,255,0.1)",
                  border: "1px solid rgba(0,198,255,0.35)",
                  color: "#00e5ff",
                }}
              >
                <span
                  className="w-2 h-2 rounded-full inline-block"
                  style={{
                    background: "#00e5ff",
                    boxShadow: "0 0 5px #00e5ff",
                    animation: "dotPulse 1.5s ease-in-out infinite",
                  }}
                />
                ClawPro Available Here
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Region legend */}
      <div className="flex flex-wrap justify-center gap-3 mt-4">
        {REGIONS.filter((r) => r.id !== "all").map((r) => (
          <div key={r.id} className="flex items-center gap-1.5">
            <span
              className="w-2 h-2 rounded-full"
              style={{ background: r.color, boxShadow: `0 0 4px ${r.color}88` }}
            />
            <span className="text-xs" style={{ color: `${r.color}cc` }}>
              {r.label}
            </span>
          </div>
        ))}
      </div>

      {/* Hint */}
      <p
        className="text-center mt-2 text-xs"
        style={{ color: "rgba(0,198,255,0.35)" }}
      >
        Click a dot to see country details · Use filters to focus on a region
      </p>

      {/* Visible countries count when filtered */}
      {activeRegion !== "all" && (
        <p
          className="text-center mt-1 text-xs font-medium"
          style={{ color: REGION_COLORS[activeRegion] ?? "#94a3b8" }}
        >
          Showing {visibleCountries.length} countries in {activeRegion}
        </p>
      )}

      <style>{`
        @keyframes dotPulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.4); }
        }
      `}</style>
    </div>
  );
}
