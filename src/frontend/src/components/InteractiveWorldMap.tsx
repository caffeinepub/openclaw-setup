import { useEffect, useMemo, useRef, useState } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup,
} from "react-simple-maps";
import { useLeaderboard } from "../hooks/useQueries";

const GEO_URL =
  "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

// Country code mapping: numeric ISO → alpha-2
const NUM_TO_ALPHA2: Record<string, string> = {
  "004": "AF",
  "008": "AL",
  "012": "DZ",
  "032": "AR",
  "036": "AU",
  "040": "AT",
  "050": "BD",
  "056": "BE",
  "068": "BO",
  "076": "BR",
  "100": "BG",
  "116": "KH",
  "124": "CA",
  "152": "CL",
  "156": "CN",
  "170": "CO",
  "188": "CR",
  "191": "HR",
  "196": "CY",
  "203": "CZ",
  "208": "DK",
  "818": "EG",
  "231": "ET",
  "233": "EE",
  "246": "FI",
  "250": "FR",
  "276": "DE",
  "288": "GH",
  "300": "GR",
  "320": "GT",
  "332": "HT",
  "348": "HU",
  "356": "IN",
  "360": "ID",
  "364": "IR",
  "368": "IQ",
  "372": "IE",
  "376": "IL",
  "380": "IT",
  "392": "JP",
  "400": "JO",
  "398": "KZ",
  "404": "KE",
  "414": "KW",
  "418": "LA",
  "422": "LB",
  "434": "LY",
  "458": "MY",
  "484": "MX",
  "504": "MA",
  "508": "MZ",
  "524": "NP",
  "528": "NL",
  "554": "NZ",
  "566": "NG",
  "578": "NO",
  "586": "PK",
  "591": "PA",
  "604": "PE",
  "608": "PH",
  "616": "PL",
  "620": "PT",
  "634": "QA",
  "642": "RO",
  "643": "RU",
  "682": "SA",
  "686": "SN",
  "729": "SD",
  "752": "SE",
  "756": "CH",
  "760": "SY",
  "158": "TW",
  "764": "TH",
  "792": "TR",
  "800": "UG",
  "804": "UA",
  "784": "AE",
  "826": "GB",
  "840": "US",
  "858": "UY",
  "862": "VE",
  "704": "VN",
  "887": "YE",
  "894": "ZM",
  "716": "ZW",
  "710": "ZA",
  "854": "BF",
  "120": "CM",
  "384": "CI",
  "180": "CD",
  "218": "EC",
  "222": "SV",
  "232": "ER",
  "598": "PG",
  "706": "SO",
  "268": "GE",
  "410": "KR",
  "408": "KP",
  "031": "AZ",
  "724": "ES",
};

// Alpha-2 → country name
const COUNTRY_NAMES: Record<string, string> = {
  AF: "Afghanistan",
  AL: "Albania",
  DZ: "Algeria",
  AR: "Argentina",
  AU: "Australia",
  AT: "Austria",
  BD: "Bangladesh",
  BE: "Belgium",
  BO: "Bolivia",
  BR: "Brazil",
  BG: "Bulgaria",
  KH: "Cambodia",
  CA: "Canada",
  CL: "Chile",
  CN: "China",
  CO: "Colombia",
  CR: "Costa Rica",
  HR: "Croatia",
  CY: "Cyprus",
  CZ: "Czech Republic",
  DK: "Denmark",
  EG: "Egypt",
  ET: "Ethiopia",
  EE: "Estonia",
  FI: "Finland",
  FR: "France",
  DE: "Germany",
  GH: "Ghana",
  GR: "Greece",
  GT: "Guatemala",
  HT: "Haiti",
  HU: "Hungary",
  IN: "India",
  ID: "Indonesia",
  IR: "Iran",
  IQ: "Iraq",
  IE: "Ireland",
  IL: "Israel",
  IT: "Italy",
  JP: "Japan",
  JO: "Jordan",
  KZ: "Kazakhstan",
  KE: "Kenya",
  KW: "Kuwait",
  LA: "Laos",
  LB: "Lebanon",
  LY: "Libya",
  MY: "Malaysia",
  MX: "Mexico",
  MA: "Morocco",
  MZ: "Mozambique",
  NP: "Nepal",
  NL: "Netherlands",
  NZ: "New Zealand",
  NG: "Nigeria",
  NO: "Norway",
  PK: "Pakistan",
  PA: "Panama",
  PE: "Peru",
  PH: "Philippines",
  PL: "Poland",
  PT: "Portugal",
  QA: "Qatar",
  RO: "Romania",
  RU: "Russia",
  SA: "Saudi Arabia",
  SN: "Senegal",
  SD: "Sudan",
  SE: "Sweden",
  CH: "Switzerland",
  SY: "Syria",
  TW: "Taiwan",
  TH: "Thailand",
  TR: "Turkey",
  UG: "Uganda",
  UA: "Ukraine",
  AE: "UAE",
  GB: "United Kingdom",
  US: "United States",
  UY: "Uruguay",
  VE: "Venezuela",
  VN: "Vietnam",
  YE: "Yemen",
  ZM: "Zambia",
  ZW: "Zimbabwe",
  ZA: "South Africa",
  BF: "Burkina Faso",
  CM: "Cameroon",
  CI: "Ivory Coast",
  CD: "DR Congo",
  EC: "Ecuador",
  SV: "El Salvador",
  ER: "Eritrea",
  PG: "Papua New Guinea",
  SO: "Somalia",
  GE: "Georgia",
  KR: "South Korea",
  KP: "North Korea",
  AZ: "Azerbaijan",
  ES: "Spain",
  MG: "Madagascar",
  BO2: "Bolivia",
  CG: "Republic of Congo",
  AO: "Angola",
  ZB: "Zambia",
  MR: "Mauritania",
  ML: "Mali",
  NE: "Niger",
  TD: "Chad",
  LY2: "Libya",
  TN: "Tunisia",
  DZ2: "Algeria",
};

// Alpha-2 → region
const COUNTRY_REGIONS: Record<string, string> = {
  AF: "Asia",
  AL: "Europe",
  DZ: "Africa",
  AR: "Americas",
  AU: "Oceania",
  AT: "Europe",
  BD: "Asia",
  BE: "Europe",
  BO: "Americas",
  BR: "Americas",
  BG: "Europe",
  KH: "Asia",
  CA: "Americas",
  CL: "Americas",
  CN: "Asia",
  CO: "Americas",
  CR: "Americas",
  HR: "Europe",
  CY: "Europe",
  CZ: "Europe",
  DK: "Europe",
  EG: "Africa",
  ET: "Africa",
  EE: "Europe",
  FI: "Europe",
  FR: "Europe",
  DE: "Europe",
  GH: "Africa",
  GR: "Europe",
  GT: "Americas",
  HT: "Americas",
  HU: "Europe",
  IN: "Asia",
  ID: "Asia",
  IR: "Middle East",
  IQ: "Middle East",
  IE: "Europe",
  IL: "Middle East",
  IT: "Europe",
  JP: "Asia",
  JO: "Middle East",
  KZ: "Asia",
  KE: "Africa",
  KW: "Middle East",
  LA: "Asia",
  LB: "Middle East",
  LY: "Africa",
  MY: "Asia",
  MX: "Americas",
  MA: "Africa",
  MZ: "Africa",
  NP: "Asia",
  NL: "Europe",
  NZ: "Oceania",
  NG: "Africa",
  NO: "Europe",
  PK: "Asia",
  PA: "Americas",
  PE: "Americas",
  PH: "Asia",
  PL: "Europe",
  PT: "Europe",
  QA: "Middle East",
  RO: "Europe",
  RU: "Europe",
  SA: "Middle East",
  SN: "Africa",
  SD: "Africa",
  SE: "Europe",
  CH: "Europe",
  SY: "Middle East",
  TW: "Asia",
  TH: "Asia",
  TR: "Middle East",
  UG: "Africa",
  UA: "Europe",
  AE: "Middle East",
  GB: "Europe",
  US: "Americas",
  UY: "Americas",
  VE: "Americas",
  VN: "Asia",
  YE: "Middle East",
  ZM: "Africa",
  ZW: "Africa",
  ZA: "Africa",
  BF: "Africa",
  CM: "Africa",
  CI: "Africa",
  CD: "Africa",
  EC: "Americas",
  SV: "Americas",
  ER: "Africa",
  PG: "Oceania",
  SO: "Africa",
  GE: "Middle East",
  KR: "Asia",
  KP: "Asia",
  AZ: "Middle East",
  ES: "Europe",
  MG: "Africa",
  CG: "Africa",
  AO: "Africa",
  MR: "Africa",
  ML: "Africa",
  NE: "Africa",
  TD: "Africa",
  TN: "Africa",
};

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
  { id: "all", label: "All", color: "#00c6ff", count: 0 },
  { id: "Asia", label: "Asia", color: "#22c55e", count: 0 },
  { id: "Europe", label: "Europe", color: "#818cf8", count: 0 },
  { id: "Americas", label: "Americas", color: "#f97316", count: 0 },
  { id: "Africa", label: "Africa", color: "#eab308", count: 0 },
  { id: "Oceania", label: "Oceania", color: "#06b6d4", count: 0 },
  { id: "Middle East", label: "Middle East", color: "#f59e0b", count: 0 },
];

// Simulated member counts per country
const COUNTRY_MEMBERS: Record<string, number> = {
  US: 12840,
  ID: 9320,
  IN: 8760,
  BR: 6540,
  DE: 5210,
  GB: 4890,
  JP: 4620,
  CN: 4120,
  RU: 3870,
  FR: 3650,
  KR: 3480,
  AU: 3120,
  CA: 2980,
  MX: 2760,
  PH: 2540,
  TR: 2310,
  SA: 2180,
  NG: 1980,
  PK: 1870,
  TH: 1760,
  VN: 1650,
  MY: 1540,
  IT: 1480,
  ES: 1390,
  UA: 1280,
  EG: 1180,
  AR: 1120,
  ZA: 1060,
  PL: 980,
  NL: 920,
};

function getFlag(alpha2: string): string {
  const upper = alpha2.toUpperCase();
  if (upper.length !== 2) return "🌍";
  const pts = [...upper].map((c) => 0x1f1e6 + c.charCodeAt(0) - 65);
  return String.fromCodePoint(...pts);
}

// All alpha-2 codes we want to animate
const ALL_ALPHA2_CODES = Object.keys(COUNTRY_NAMES);

export function InteractiveWorldMap() {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [glowingIds, setGlowingIds] = useState<string[]>([]);
  const [activeRegion, setActiveRegion] = useState("all");
  const [popup, setPopup] = useState<{
    alpha2: string;
    name: string;
    flag: string;
    region: string;
    members: number;
    x: number;
    y: number;
  } | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [totalVisible, setTotalVisible] = useState(0);
  const sectionRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const { data: leaderboardData } = useLeaderboard();

  // IntersectionObserver reveal
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && !revealed) {
          setRevealed(true);
        }
      },
      { threshold: 0.1 },
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, [revealed]);

  // Randomly glow 2-3 countries every second
  useEffect(() => {
    const interval = setInterval(() => {
      const count = 2 + Math.floor(Math.random() * 2);
      const shuffled = [...ALL_ALPHA2_CODES].sort(() => Math.random() - 0.5);
      const picked = shuffled.slice(0, count);
      setGlowingIds(picked);
      setTimeout(() => setGlowingIds([]), 900);
    }, 1200);
    return () => clearInterval(interval);
  }, []);

  const handleGeoClick = (
    alpha2: string,
    evt: React.MouseEvent<SVGPathElement>,
  ) => {
    // Toggle selection
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(alpha2)) {
        next.delete(alpha2);
      } else {
        next.add(alpha2);
      }
      return next;
    });

    const rect = mapRef.current?.getBoundingClientRect();
    const x = rect ? evt.clientX - rect.left : evt.clientX;
    const y = rect ? evt.clientY - rect.top : evt.clientY;

    const name = COUNTRY_NAMES[alpha2] ?? alpha2;
    const region = COUNTRY_REGIONS[alpha2] ?? "Other";
    const members = COUNTRY_MEMBERS[alpha2] ?? 0;

    setPopup({
      alpha2,
      name,
      flag: getFlag(alpha2),
      region,
      members,
      x,
      y,
    });
  };

  const getGeoFill = (alpha2: string) => {
    const region = COUNTRY_REGIONS[alpha2] ?? "Other";
    const isSelected = selectedIds.has(alpha2);
    const isGlowing = glowingIds.includes(alpha2);
    const isHovered = hoveredId === alpha2;

    const isVisible =
      activeRegion === "all" || COUNTRY_REGIONS[alpha2] === activeRegion;

    if (!isVisible) return "rgba(20,28,50,0.6)";

    if (isSelected) {
      return "#ffffff";
    }
    if (isGlowing) {
      return "#ffffff";
    }
    if (isHovered) {
      return "#e2e8f0";
    }

    const base = REGION_COLORS[region] ?? "#94a3b8";
    return base;
  };

  const getGeoStroke = (alpha2: string) => {
    const isSelected = selectedIds.has(alpha2);
    const isGlowing = glowingIds.includes(alpha2);
    if (isSelected) return "#00e5ff";
    if (isGlowing) return "#ffffff";
    return "rgba(0,20,50,0.7)";
  };

  const getGeoOpacity = (alpha2: string) => {
    const isVisible =
      activeRegion === "all" || COUNTRY_REGIONS[alpha2] === activeRegion;
    if (!isVisible) return 0.2;
    const isSelected = selectedIds.has(alpha2);
    const isGlowing = glowingIds.includes(alpha2);
    if (isSelected || isGlowing) return 1;
    return 0.82;
  };

  const getGeoFilter = (alpha2: string) => {
    const isGlowing = glowingIds.includes(alpha2);
    const isSelected = selectedIds.has(alpha2);
    const region = COUNTRY_REGIONS[alpha2] ?? "Other";
    const regionColor = REGION_COLORS[region] ?? "#94a3b8";
    if (isGlowing)
      return `drop-shadow(0 0 4px #fff) drop-shadow(0 0 8px ${regionColor})`;
    if (isSelected) return "drop-shadow(0 0 3px #00e5ff)";
    return "none";
  };

  // Region count calculation
  const regionCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const [, region] of Object.entries(COUNTRY_REGIONS)) {
      counts[region] = (counts[region] ?? 0) + 1;
    }
    return counts;
  }, []);

  // Country leaderboard
  const countryLeaderboard = Object.entries(COUNTRY_MEMBERS)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10)
    .map(([alpha2, count], idx) => ({
      rank: idx + 1,
      alpha2,
      name: COUNTRY_NAMES[alpha2] ?? alpha2,
      flag: getFlag(alpha2),
      count: leaderboardData ? count + Math.floor(Math.random() * 30) : count,
    }));

  // Update total visible
  useEffect(() => {
    if (activeRegion === "all") {
      setTotalVisible(Object.keys(COUNTRY_REGIONS).length);
    } else {
      setTotalVisible(
        Object.values(COUNTRY_REGIONS).filter((r) => r === activeRegion).length,
      );
    }
  }, [activeRegion]);

  // Close popup on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (mapRef.current && !mapRef.current.contains(e.target as Node)) {
        setPopup(null);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div
      ref={sectionRef}
      className="w-full"
      style={{
        opacity: revealed ? 1 : 0,
        transform: revealed ? "translateY(0)" : "translateY(30px)",
        transition: "opacity 0.7s ease, transform 0.7s ease",
      }}
    >
      {/* Header */}
      <div className="text-center mb-5">
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
          Click any country to highlight it. Hover for name. Select multiple
          countries. Real geographic borders.
        </p>
      </div>

      {/* Region filter buttons */}
      <div className="flex flex-wrap justify-center gap-2 mb-4">
        {REGIONS.map((r, idx) => {
          const isActive = activeRegion === r.id;
          const count =
            r.id === "all"
              ? Object.keys(COUNTRY_REGIONS).length
              : (regionCounts[r.id] ?? 0);
          return (
            <button
              key={r.id}
              type="button"
              onClick={() => setActiveRegion(r.id)}
              className="relative flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all duration-300"
              style={{
                background: isActive ? `${r.color}22` : "rgba(0,0,0,0.35)",
                border: `1.5px solid ${isActive ? r.color : `${r.color}55`}`,
                color: isActive ? r.color : `${r.color}99`,
                boxShadow: isActive
                  ? `0 0 10px ${r.color}66, 0 0 20px ${r.color}33`
                  : "none",
                transform: isActive ? "scale(1.06)" : "scale(1)",
                opacity: revealed ? 1 : 0,
                transition: `opacity 0.4s ease ${idx * 60}ms, transform 0.3s ease, background 0.3s, box-shadow 0.3s, border-color 0.3s`,
              }}
              data-ocid="map.tab"
            >
              {/* Dot indicator */}
              {isActive && (
                <span
                  className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                  style={{
                    background: r.color,
                    boxShadow: `0 0 5px ${r.color}`,
                    animation: "dotPulse 1.5s ease-in-out infinite",
                  }}
                />
              )}
              {r.label}
              <span
                className="text-[9px] opacity-60"
                style={{ color: r.color }}
              >
                {count}
              </span>
            </button>
          );
        })}
        {selectedIds.size > 0 && (
          <button
            type="button"
            onClick={() => setSelectedIds(new Set())}
            className="px-3 py-1.5 rounded-full text-xs font-bold transition-all duration-200 hover:scale-105"
            style={{
              background: "rgba(239,68,68,0.15)",
              border: "1.5px solid rgba(239,68,68,0.5)",
              color: "#f87171",
              boxShadow: "0 0 8px rgba(239,68,68,0.2)",
            }}
            data-ocid="map.reset_button"
          >
            Reset ({selectedIds.size})
          </button>
        )}
      </div>

      {/* Map container with ring glow border */}
      <div
        ref={mapRef}
        className="relative rounded-2xl overflow-visible"
        style={{
          padding: "2px",
          background:
            "linear-gradient(135deg, rgba(0,198,255,0.6), rgba(99,91,255,0.4), rgba(168,85,247,0.5), rgba(0,114,255,0.5))",
          boxShadow:
            "0 0 30px rgba(0,114,255,0.15), 0 0 60px rgba(168,85,247,0.08)",
          animation: "ringGlow 4s ease-in-out infinite",
        }}
      >
        <div
          className="relative w-full rounded-[14px] overflow-hidden"
          style={{
            background:
              "linear-gradient(180deg, #050a18 0%, #07101f 60%, #050c1a 100%)",
          }}
        >
          <ComposableMap
            projection="geoMercator"
            projectionConfig={{ scale: 130, center: [10, 20] }}
            width={800}
            height={400}
            style={{ width: "100%", height: "auto", display: "block" }}
            aria-label="ClawPro World Map"
          >
            <ZoomableGroup zoom={1}>
              <Geographies geography={GEO_URL}>
                {({ geographies }) =>
                  geographies.map((geo) => {
                    const numId = geo.id ?? geo.properties?.iso_n3 ?? "";
                    const alpha2 =
                      NUM_TO_ALPHA2[String(numId).padStart(3, "0")] ?? "";
                    const fill = alpha2
                      ? getGeoFill(alpha2)
                      : "rgba(20,28,50,0.6)";
                    const stroke = alpha2
                      ? getGeoStroke(alpha2)
                      : "rgba(0,20,50,0.7)";
                    const opacity = alpha2 ? getGeoOpacity(alpha2) : 0.3;
                    const filter = alpha2 ? getGeoFilter(alpha2) : "none";
                    const isVisible = alpha2
                      ? activeRegion === "all" ||
                        COUNTRY_REGIONS[alpha2] === activeRegion
                      : false;

                    return (
                      <Geography
                        key={geo.rsmKey}
                        geography={geo}
                        fill={fill}
                        stroke={stroke}
                        strokeWidth={0.4}
                        style={{
                          default: {
                            outline: "none",
                            opacity,
                            filter,
                            transition: "fill 0.25s ease, opacity 0.25s ease",
                          },
                          hover: {
                            outline: "none",
                            fill: alpha2 && isVisible ? "#e2e8f0" : fill,
                            opacity: isVisible ? 1 : opacity,
                            cursor: isVisible ? "pointer" : "default",
                          },
                          pressed: { outline: "none" },
                        }}
                        onMouseEnter={() =>
                          alpha2 && isVisible && setHoveredId(alpha2)
                        }
                        onMouseLeave={() => setHoveredId(null)}
                        onClick={(evt) =>
                          alpha2 && isVisible && handleGeoClick(alpha2, evt)
                        }
                        tabIndex={isVisible ? 0 : -1}
                        role="button"
                        aria-label={COUNTRY_NAMES[alpha2] ?? alpha2}
                        data-ocid="map.map_marker"
                      />
                    );
                  })
                }
              </Geographies>
            </ZoomableGroup>
          </ComposableMap>

          {/* Tooltip on hover */}
          {hoveredId && !popup && (
            <div
              className="absolute pointer-events-none z-40"
              style={{
                bottom: 12,
                left: "50%",
                transform: "translateX(-50%)",
              }}
            >
              <div
                className="rounded-lg px-3 py-1.5 text-xs font-semibold"
                style={{
                  background: "rgba(0,8,30,0.92)",
                  border: "1px solid rgba(0,198,255,0.4)",
                  color: "#e2e8f0",
                  boxShadow: "0 2px 12px rgba(0,0,0,0.5)",
                }}
              >
                <span className="mr-1.5">{getFlag(hoveredId)}</span>
                {COUNTRY_NAMES[hoveredId] ?? hoveredId}
              </div>
            </div>
          )}

          {/* Click Popup */}
          {popup && (
            <div
              className="absolute z-50"
              style={{
                left: Math.min(
                  popup.x + 12,
                  (mapRef.current?.offsetWidth ?? 400) - 230,
                ),
                top: Math.max(popup.y - 110, 8),
              }}
            >
              <div
                className="rounded-xl p-3 min-w-[210px]"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(0,8,24,0.97), rgba(0,20,50,0.97))",
                  border: "1.5px solid rgba(0,198,255,0.5)",
                  boxShadow:
                    "0 0 18px rgba(0,198,255,0.3), 0 8px 24px rgba(0,0,0,0.7)",
                }}
              >
                <button
                  type="button"
                  onClick={() => setPopup(null)}
                  className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full flex items-center justify-center text-xs"
                  style={{
                    color: "rgba(0,198,255,0.7)",
                    background: "rgba(0,198,255,0.08)",
                  }}
                  data-ocid="map.close_button"
                >
                  ×
                </button>
                <div className="flex items-center gap-2.5 mb-2">
                  <span className="text-3xl leading-none">{popup.flag}</span>
                  <div>
                    <div className="font-bold text-sm text-white leading-tight">
                      {popup.name}
                    </div>
                    <div
                      className="text-xs mt-0.5"
                      style={{ color: "#7dd3fc" }}
                    >
                      {popup.alpha2} · {popup.region}
                    </div>
                  </div>
                </div>

                {popup.members > 0 && (
                  <div
                    className="flex items-center gap-2 mb-2 px-2.5 py-1.5 rounded-lg"
                    style={{
                      background: "rgba(0,198,255,0.07)",
                      border: "1px solid rgba(0,198,255,0.2)",
                    }}
                  >
                    <span
                      className="text-xs"
                      style={{ color: "rgba(0,198,255,0.6)" }}
                    >
                      Registered members:
                    </span>
                    <span
                      className="font-black text-sm"
                      style={{ color: "#00e5ff" }}
                    >
                      {popup.members.toLocaleString()}
                    </span>
                  </div>
                )}

                <div
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold"
                  style={{
                    background: "rgba(0,198,255,0.1)",
                    border: "1px solid rgba(0,198,255,0.35)",
                    color: "#00e5ff",
                  }}
                >
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{
                      background: "#00e5ff",
                      boxShadow: "0 0 5px #00e5ff",
                      animation: "dotPulse 1.5s ease-in-out infinite",
                      display: "inline-block",
                    }}
                  />
                  ClawPro Available Here
                </div>

                <div
                  className="mt-2 text-[10px]"
                  style={{ color: "rgba(255,255,255,0.4)" }}
                >
                  {selectedIds.has(popup.alpha2)
                    ? "✓ Selected (click to deselect)"
                    : "Click country to select"}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Glowing country indicators below map */}
      <div className="mt-3 min-h-[28px] flex flex-wrap justify-center gap-2">
        {glowingIds.map((alpha2) => {
          const region = COUNTRY_REGIONS[alpha2] ?? "Other";
          const color = REGION_COLORS[region] ?? "#94a3b8";
          const name = COUNTRY_NAMES[alpha2] ?? alpha2;
          return (
            <div
              key={alpha2}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold"
              style={{
                background: `${color}18`,
                border: `1px solid ${color}55`,
                color,
                boxShadow: `0 0 8px ${color}40`,
                animation: "fadeInOut 0.9s ease-in-out",
              }}
            >
              <span
                className="w-2 h-2 rounded-full flex-shrink-0"
                style={{
                  background: color,
                  boxShadow: `0 0 6px ${color}`,
                  animation: "dotPulse 0.9s ease-in-out",
                }}
              />
              {getFlag(alpha2)} {name}
            </div>
          );
        })}
      </div>

      {/* Live indicator + count + selected count */}
      <div className="flex items-center justify-center gap-4 mt-2">
        <div className="flex items-center gap-1.5">
          <span
            className="w-2 h-2 rounded-full"
            style={{
              background: "#00e5ff",
              boxShadow: "0 0 6px #00e5ff",
              animation: "dotPulse 1.5s ease-in-out infinite",
            }}
          />
          <span className="text-[10px] font-bold" style={{ color: "#00e5ff" }}>
            LIVE
          </span>
        </div>
        <span className="text-[10px] text-muted-foreground">
          {totalVisible} countries available
          {activeRegion !== "all" && ` in ${activeRegion}`}
        </span>
        {selectedIds.size > 0 && (
          <span className="text-[10px] font-bold" style={{ color: "#a78bfa" }}>
            {selectedIds.size} selected
          </span>
        )}
      </div>

      {/* Region legend */}
      <div className="flex flex-wrap justify-center gap-3 mt-3">
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

      {/* Country Leaderboard */}
      <div
        className="mt-8"
        style={{
          opacity: revealed ? 1 : 0,
          transform: revealed ? "translateY(0)" : "translateY(16px)",
          transition: "opacity 0.5s ease 0.5s, transform 0.5s ease 0.5s",
        }}
      >
        <div className="flex items-center gap-3 mb-4">
          <div
            className="h-px flex-1"
            style={{
              background:
                "linear-gradient(90deg, transparent, rgba(0,198,255,0.3))",
            }}
          />
          <h4 className="text-sm font-bold" style={{ color: "#00c6ff" }}>
            🏆 Top Countries by Registrations
          </h4>
          <div
            className="h-px flex-1"
            style={{
              background:
                "linear-gradient(90deg, rgba(0,198,255,0.3), transparent)",
            }}
          />
        </div>

        <div
          className="rounded-2xl overflow-hidden border"
          style={{
            background:
              "linear-gradient(135deg, rgba(0,8,24,0.85), rgba(0,20,50,0.7))",
            borderColor: "rgba(0,198,255,0.2)",
            boxShadow: "0 4px 24px rgba(0,114,255,0.08)",
          }}
        >
          <div
            className="grid grid-cols-[2rem_3rem_1fr_auto] gap-3 px-4 py-2.5 border-b"
            style={{ borderColor: "rgba(0,198,255,0.12)" }}
          >
            {["Rank", "Flag", "Country", "Members"].map((h, i) => (
              <span
                key={h}
                className={`text-[10px] font-bold uppercase tracking-wider ${i === 3 ? "text-right" : ""}`}
                style={{ color: "rgba(0,198,255,0.5)" }}
              >
                {h}
              </span>
            ))}
          </div>

          {countryLeaderboard.map(({ rank, flag, name, count }) => {
            const medalColors: Record<number, string> = {
              1: "#FFD700",
              2: "#C0C0C0",
              3: "#CD7F32",
            };
            const mc = medalColors[rank];
            return (
              <div
                key={`lb-${rank}`}
                className="grid grid-cols-[2rem_3rem_1fr_auto] gap-3 px-4 py-3 transition-all cursor-default"
                style={{
                  borderBottom: "1px solid rgba(0,198,255,0.06)",
                  background: mc ? `${mc}08` : "transparent",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(0,198,255,0.06)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = mc
                    ? `${mc}08`
                    : "transparent";
                }}
              >
                <div className="flex items-center">
                  {mc ? (
                    <span
                      className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black"
                      style={{
                        background: `${mc}30`,
                        color: mc,
                        border: `1px solid ${mc}60`,
                      }}
                    >
                      {rank}
                    </span>
                  ) : (
                    <span
                      className="text-xs font-bold"
                      style={{ color: "rgba(255,255,255,0.3)" }}
                    >
                      {rank}
                    </span>
                  )}
                </div>
                <span className="text-xl leading-none flex items-center">
                  {flag}
                </span>
                <span
                  className="text-sm font-semibold flex items-center"
                  style={{ color: mc ?? "rgba(255,255,255,0.8)" }}
                >
                  {name}
                </span>
                <div className="flex items-center gap-1.5">
                  <span
                    className="text-sm font-black tabular-nums"
                    style={{ color: mc ?? "#00c6ff" }}
                  >
                    {count.toLocaleString()}
                  </span>
                  <span
                    className="text-[9px]"
                    style={{ color: "rgba(0,198,255,0.4)" }}
                  >
                    members
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <style>{`
        @keyframes dotPulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(1.5); }
        }
        @keyframes ringGlow {
          0%, 100% { box-shadow: 0 0 30px rgba(0,114,255,0.15), 0 0 60px rgba(168,85,247,0.08); }
          50% { box-shadow: 0 0 50px rgba(0,198,255,0.25), 0 0 80px rgba(168,85,247,0.14); }
        }
        @keyframes fadeInOut {
          0% { opacity: 0; transform: scale(0.85); }
          20% { opacity: 1; transform: scale(1); }
          80% { opacity: 1; }
          100% { opacity: 0; }
        }
      `}</style>
    </div>
  );
}
