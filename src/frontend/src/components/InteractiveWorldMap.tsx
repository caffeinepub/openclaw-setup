import { useEffect, useRef, useState } from "react";

// ─── Types ───────────────────────────────────────────────────────────────────
interface GeoFeature {
  type: string;
  properties: { name: string; ISO_A2?: string; iso_a2?: string };
  geometry: {
    type: string;
    coordinates: number[][][] | number[][][][];
  };
}

interface GeoJSON {
  type: string;
  features: GeoFeature[];
}

interface CountryInfo {
  name: string;
  code: string;
  continent: string;
  registrations: number;
  path: string;
  centroid: [number, number];
}

// ─── Constants ───────────────────────────────────────────────────────────────
const W = 800;
const H = 400;

const CONTINENT_COLORS: Record<string, string> = {
  Asia: "#06b6d4",
  Europe: "#818cf8",
  Americas: "#f97316",
  Africa: "#22c55e",
  Oceania: "#ec4899",
  "Middle East": "#eab308",
};

const CONTINENT_COUNTRY_MAP: Record<string, string> = {
  Afghanistan: "Asia",
  Armenia: "Asia",
  Azerbaijan: "Asia",
  Bangladesh: "Asia",
  Bhutan: "Asia",
  Brunei: "Asia",
  Cambodia: "Asia",
  China: "Asia",
  "East Timor": "Asia",
  Georgia: "Asia",
  India: "Asia",
  Indonesia: "Asia",
  Japan: "Asia",
  Kazakhstan: "Asia",
  Kyrgyzstan: "Asia",
  Laos: "Asia",
  Malaysia: "Asia",
  Maldives: "Asia",
  Mongolia: "Asia",
  Myanmar: "Asia",
  Nepal: "Asia",
  "North Korea": "Asia",
  Pakistan: "Asia",
  Philippines: "Asia",
  Russia: "Europe",
  Singapore: "Asia",
  "South Korea": "Asia",
  "Sri Lanka": "Asia",
  Taiwan: "Asia",
  Tajikistan: "Asia",
  Thailand: "Asia",
  Turkmenistan: "Asia",
  Uzbekistan: "Asia",
  Vietnam: "Asia",
  Albania: "Europe",
  Andorra: "Europe",
  Austria: "Europe",
  Belarus: "Europe",
  Belgium: "Europe",
  "Bosnia and Herzegovina": "Europe",
  Bulgaria: "Europe",
  Croatia: "Europe",
  Cyprus: "Europe",
  "Czech Republic": "Europe",
  Czechia: "Europe",
  Denmark: "Europe",
  Estonia: "Europe",
  Finland: "Europe",
  France: "Europe",
  Germany: "Europe",
  Greece: "Europe",
  Hungary: "Europe",
  Iceland: "Europe",
  Ireland: "Europe",
  Italy: "Europe",
  Kosovo: "Europe",
  Latvia: "Europe",
  Liechtenstein: "Europe",
  Lithuania: "Europe",
  Luxembourg: "Europe",
  Malta: "Europe",
  Moldova: "Europe",
  Monaco: "Europe",
  Montenegro: "Europe",
  Netherlands: "Europe",
  "North Macedonia": "Europe",
  Norway: "Europe",
  Poland: "Europe",
  Portugal: "Europe",
  Romania: "Europe",
  "San Marino": "Europe",
  Serbia: "Europe",
  Slovakia: "Europe",
  Slovenia: "Europe",
  Spain: "Europe",
  Sweden: "Europe",
  Switzerland: "Europe",
  Ukraine: "Europe",
  "United Kingdom": "Europe",
  "Vatican City": "Europe",
  Canada: "Americas",
  "United States of America": "Americas",
  Mexico: "Americas",
  "United States": "Americas",
  Argentina: "Americas",
  Bolivia: "Americas",
  Brazil: "Americas",
  Chile: "Americas",
  Colombia: "Americas",
  Ecuador: "Americas",
  Guyana: "Americas",
  Paraguay: "Americas",
  Peru: "Americas",
  Suriname: "Americas",
  Uruguay: "Americas",
  Venezuela: "Americas",
  Belize: "Americas",
  "Costa Rica": "Americas",
  "El Salvador": "Americas",
  Guatemala: "Americas",
  Honduras: "Americas",
  Nicaragua: "Americas",
  Panama: "Americas",
  Cuba: "Americas",
  "Dominican Republic": "Americas",
  Haiti: "Americas",
  Jamaica: "Americas",
  Algeria: "Africa",
  Angola: "Africa",
  Benin: "Africa",
  Botswana: "Africa",
  Burkina: "Africa",
  "Burkina Faso": "Africa",
  Burundi: "Africa",
  Cameroon: "Africa",
  "Cape Verde": "Africa",
  "Central African Republic": "Africa",
  Chad: "Africa",
  Comoros: "Africa",
  Congo: "Africa",
  "Democratic Republic of the Congo": "Africa",
  "Ivory Coast": "Africa",
  "Côte d'Ivoire": "Africa",
  Djibouti: "Africa",
  Egypt: "Africa",
  "Equatorial Guinea": "Africa",
  Eritrea: "Africa",
  Eswatini: "Africa",
  Ethiopia: "Africa",
  Gabon: "Africa",
  Gambia: "Africa",
  Ghana: "Africa",
  Guinea: "Africa",
  "Guinea-Bissau": "Africa",
  Kenya: "Africa",
  Lesotho: "Africa",
  Liberia: "Africa",
  Libya: "Africa",
  Madagascar: "Africa",
  Malawi: "Africa",
  Mali: "Africa",
  Mauritania: "Africa",
  Mauritius: "Africa",
  Morocco: "Africa",
  Mozambique: "Africa",
  Namibia: "Africa",
  Niger: "Africa",
  Nigeria: "Africa",
  Rwanda: "Africa",
  "São Tomé and Príncipe": "Africa",
  Senegal: "Africa",
  Seychelles: "Africa",
  "Sierra Leone": "Africa",
  Somalia: "Africa",
  "South Africa": "Africa",
  "South Sudan": "Africa",
  Sudan: "Africa",
  Tanzania: "Africa",
  Togo: "Africa",
  Tunisia: "Africa",
  Uganda: "Africa",
  Zambia: "Africa",
  Zimbabwe: "Africa",
  Australia: "Oceania",
  "New Zealand": "Oceania",
  Fiji: "Oceania",
  "Papua New Guinea": "Oceania",
  "Solomon Islands": "Oceania",
  Vanuatu: "Oceania",
  Samoa: "Oceania",
  Kiribati: "Oceania",
  Tonga: "Oceania",
  Tuvalu: "Oceania",
  Nauru: "Oceania",
  Bahrain: "Middle East",
  Iran: "Middle East",
  Iraq: "Middle East",
  Israel: "Middle East",
  Jordan: "Middle East",
  Kuwait: "Middle East",
  Lebanon: "Middle East",
  Oman: "Middle East",
  Palestine: "Middle East",
  Qatar: "Middle East",
  "Saudi Arabia": "Middle East",
  Syria: "Middle East",
  Turkey: "Middle East",
  "United Arab Emirates": "Middle East",
  Yemen: "Middle East",
};

const FLAG_EMOJI: Record<string, string> = {
  "United States of America": "🇺🇸",
  "United States": "🇺🇸",
  Canada: "🇨🇦",
  Brazil: "🇧🇷",
  Argentina: "🇦🇷",
  Colombia: "🇨🇴",
  Mexico: "🇲🇽",
  "United Kingdom": "🇬🇧",
  France: "🇫🇷",
  Germany: "🇩🇪",
  Italy: "🇮🇹",
  Spain: "🇪🇸",
  Portugal: "🇵🇹",
  Netherlands: "🇳🇱",
  Russia: "🇷🇺",
  Poland: "🇵🇱",
  Sweden: "🇸🇪",
  Norway: "🇳🇴",
  Finland: "🇫🇮",
  Ukraine: "🇺🇦",
  Turkey: "🇹🇷",
  China: "🇨🇳",
  Japan: "🇯🇵",
  India: "🇮🇳",
  Indonesia: "🇮🇩",
  "South Korea": "🇰🇷",
  Thailand: "🇹🇭",
  Vietnam: "🇻🇳",
  Malaysia: "🇲🇾",
  Philippines: "🇵🇭",
  Australia: "🇦🇺",
  "New Zealand": "🇳🇿",
  "South Africa": "🇿🇦",
  Nigeria: "🇳🇬",
  Kenya: "🇰🇪",
  Egypt: "🇪🇬",
  Morocco: "🇲🇦",
  Ethiopia: "🇪🇹",
  "Saudi Arabia": "🇸🇦",
  "United Arab Emirates": "🇦🇪",
  Israel: "🇮🇱",
  Iran: "🇮🇷",
  Pakistan: "🇵🇰",
  Bangladesh: "🇧🇩",
};

const CONTINENT_FILTERS = [
  { label: "All", color: "#64748b" },
  { label: "Asia", color: CONTINENT_COLORS.Asia },
  { label: "Europe", color: CONTINENT_COLORS.Europe },
  { label: "Americas", color: CONTINENT_COLORS.Americas },
  { label: "Africa", color: CONTINENT_COLORS.Africa },
  { label: "Oceania", color: CONTINENT_COLORS.Oceania },
  { label: "Middle East", color: CONTINENT_COLORS["Middle East"] },
];

// Seed-based random for consistent registrations per country
function seededRandom(seed: string): number {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    const char = seed.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return Math.abs(hash % 49901) + 100;
}

// Equirectangular projection
function projectLon(lon: number): number {
  return ((lon + 180) / 360) * W;
}
function projectLat(lat: number): number {
  return ((90 - lat) / 180) * H;
}

function ringToPath(ring: number[][]): string {
  return `${ring
    .map((coord, i) => {
      const x = projectLon(coord[0]).toFixed(2);
      const y = projectLat(coord[1]).toFixed(2);
      return `${i === 0 ? "M" : "L"}${x} ${y}`;
    })
    .join(" ")} Z`;
}

function featureToPath(geometry: GeoFeature["geometry"]): string {
  if (geometry.type === "Polygon") {
    const coords = geometry.coordinates as number[][][];
    return coords.map(ringToPath).join(" ");
  }
  if (geometry.type === "MultiPolygon") {
    const coords = geometry.coordinates as number[][][][];
    return coords.flatMap((poly) => poly.map(ringToPath)).join(" ");
  }
  return "";
}

function computeCentroid(geometry: GeoFeature["geometry"]): [number, number] {
  let rings: number[][][] = [];
  if (geometry.type === "Polygon") {
    rings = [geometry.coordinates[0]] as number[][][];
  } else if (geometry.type === "MultiPolygon") {
    const mp = geometry.coordinates as number[][][][];
    // Use the largest polygon's first ring
    let best = mp[0][0];
    for (const poly of mp) {
      if (poly[0].length > best.length) best = poly[0];
    }
    rings = [best];
  }
  if (rings[0] && rings[0].length > 0) {
    const lons = rings[0].map((c) => c[0]);
    const lats = rings[0].map((c) => c[1]);
    const midLon = (Math.min(...lons) + Math.max(...lons)) / 2;
    const midLat = (Math.min(...lats) + Math.max(...lats)) / 2;
    return [projectLon(midLon), projectLat(midLat)];
  }
  return [W / 2, H / 2];
}

// ─── Component ───────────────────────────────────────────────────────────────
export function InteractiveWorldMap() {
  const [countries, setCountries] = useState<CountryInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCountries, setSelectedCountries] = useState<Set<string>>(
    new Set(),
  );
  const [hoveredCountry, setHoveredCountry] = useState<string | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number } | null>(
    null,
  );
  const [activeContinent, setActiveContinent] = useState("All");
  const [glowingCountries, setGlowingCountries] = useState<string[]>([]);
  const [popup, setPopup] = useState<{
    name: string;
    x: number;
    y: number;
  } | null>(null);
  const [leaderboard, setLeaderboard] = useState<CountryInfo[]>([]);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  // Load GeoJSON
  useEffect(() => {
    fetch(
      "https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson",
    )
      .then((r) => r.json())
      .then((data: GeoJSON) => {
        const parsed: CountryInfo[] = data.features
          .filter((f) => f.geometry?.coordinates)
          .map((f) => {
            const name = f.properties.name;
            const code = f.properties.ISO_A2 || f.properties.iso_a2 || "";
            const continent = CONTINENT_COUNTRY_MAP[name] || "Asia";
            const path = featureToPath(f.geometry);
            const centroid = computeCentroid(f.geometry);
            const registrations = seededRandom(name);
            return { name, code, continent, path, centroid, registrations };
          })
          .filter((c) => c.path.length > 0);
        setCountries(parsed);
        // Init leaderboard
        const sorted = [...parsed]
          .sort((a, b) => b.registrations - a.registrations)
          .slice(0, 10);
        setLeaderboard(sorted);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // Auto-glow: 2-3 random countries every second
  useEffect(() => {
    if (countries.length === 0) return;
    const interval = setInterval(() => {
      const pool = countries.filter(
        (c) => activeContinent === "All" || c.continent === activeContinent,
      );
      const count = 2 + Math.floor(Math.random() * 2);
      const selected: string[] = [];
      const copy = [...pool];
      for (let i = 0; i < count && copy.length > 0; i++) {
        const idx = Math.floor(Math.random() * copy.length);
        selected.push(copy[idx].name);
        copy.splice(idx, 1);
      }
      setGlowingCountries(selected);
    }, 1000);
    return () => clearInterval(interval);
  }, [countries, activeContinent]);

  // Leaderboard shuffle every 10 minutes
  useEffect(() => {
    if (countries.length === 0) return;
    const interval = setInterval(
      () => {
        const shuffled = [...countries]
          .map((c) => ({
            ...c,
            registrations: seededRandom(
              c.name + Date.now().toString().slice(-3),
            ),
          }))
          .sort((a, b) => b.registrations - a.registrations)
          .slice(0, 10);
        setLeaderboard(shuffled);
      },
      10 * 60 * 1000,
    );
    return () => clearInterval(interval);
  }, [countries]);

  const toggleSelect = (name: string) => {
    setSelectedCountries((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });
  };

  const visibleCountries =
    activeContinent === "All"
      ? countries
      : countries.filter((c) => c.continent === activeContinent);

  const getCountryColor = (country: CountryInfo): string => {
    const base = CONTINENT_COLORS[country.continent] || "#6b7280";
    if (selectedCountries.has(country.name)) return base;
    if (hoveredCountry === country.name) return base;
    if (glowingCountries.includes(country.name)) return base;
    // Dim non-active continents
    if (activeContinent !== "All" && country.continent !== activeContinent)
      return "#1e293b";
    return `${base}66`;
  };

  const getCountryStroke = (country: CountryInfo): string => {
    if (selectedCountries.has(country.name))
      return CONTINENT_COLORS[country.continent] || "#06b6d4";
    if (glowingCountries.includes(country.name))
      return CONTINENT_COLORS[country.continent] || "#06b6d4";
    if (hoveredCountry === country.name) return "#fff";
    return "rgba(255,255,255,0.1)";
  };

  const getStrokeWidth = (country: CountryInfo): string => {
    if (
      selectedCountries.has(country.name) ||
      glowingCountries.includes(country.name)
    )
      return "1.5";
    if (hoveredCountry === country.name) return "1";
    return "0.3";
  };

  const getFilter = (country: CountryInfo): string | undefined => {
    const c = CONTINENT_COLORS[country.continent] || "#06b6d4";
    if (selectedCountries.has(country.name)) return `drop-shadow(0 0 4px ${c})`;
    if (glowingCountries.includes(country.name))
      return `drop-shadow(0 0 6px ${c})`;
    if (hoveredCountry === country.name) return "drop-shadow(0 0 3px #fff)";
    return undefined;
  };

  const selectedCount = selectedCountries.size || countries.length;

  return (
    <div className="w-full">
      <style>{`
        @keyframes mapRingGlow {
          0% { box-shadow: 0 0 0 2px rgba(6,182,212,0.3), 0 0 30px rgba(6,182,212,0.1); }
          33% { box-shadow: 0 0 0 2px rgba(129,140,248,0.4), 0 0 40px rgba(129,140,248,0.12); }
          66% { box-shadow: 0 0 0 2px rgba(249,115,22,0.3), 0 0 35px rgba(249,115,22,0.1); }
          100% { box-shadow: 0 0 0 2px rgba(6,182,212,0.3), 0 0 30px rgba(6,182,212,0.1); }
        }
        @keyframes ledPulse {
          0%,100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(0.7); }
        }
        @keyframes countryGlow {
          0%,100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
      `}</style>

      {/* Continent Filters */}
      <div className="flex flex-wrap gap-2 justify-center mb-4">
        {CONTINENT_FILTERS.map((f) => {
          const isActive = activeContinent === f.label;
          const count =
            f.label === "All"
              ? countries.length
              : countries.filter((c) => c.continent === f.label).length;
          return (
            <button
              type="button"
              key={f.label}
              onClick={() => {
                setActiveContinent(f.label);
                setActiveFilter(f.label);
                setTimeout(() => setActiveFilter(null), 300);
              }}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold transition-all"
              style={{
                background: isActive ? f.color : "rgba(255,255,255,0.05)",
                color: isActive ? "#fff" : f.color,
                border: `1.5px solid ${f.color}`,
                boxShadow: isActive
                  ? `0 0 12px ${f.color}80, 0 0 24px ${f.color}40`
                  : activeFilter === f.label
                    ? `0 0 20px ${f.color}99`
                    : "none",
                transform: isActive ? "scale(1.05)" : "scale(1)",
              }}
              data-ocid="map.tab"
            >
              <span
                className="w-2 h-2 rounded-full"
                style={{
                  background: f.color,
                  boxShadow: isActive ? `0 0 6px ${f.color}` : "none",
                  animation: isActive
                    ? "ledPulse 1.5s ease-in-out infinite"
                    : "none",
                }}
              />
              {f.label}
              <span
                className="opacity-60 text-xs"
                style={{ color: isActive ? "rgba(255,255,255,0.8)" : f.color }}
              >
                {count}
              </span>
            </button>
          );
        })}
        {selectedCountries.size > 0 && (
          <button
            type="button"
            onClick={() => setSelectedCountries(new Set())}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all"
            style={{
              background: "rgba(239,68,68,0.15)",
              color: "#ef4444",
              border: "1.5px solid #ef4444",
            }}
            data-ocid="map.button"
          >
            ✕ Reset ({selectedCountries.size})
          </button>
        )}
      </div>

      {/* Map Container */}
      <div
        className="relative w-full rounded-2xl overflow-hidden border-2"
        style={{
          background: "#060e1e",
          animation: "mapRingGlow 4s ease-in-out infinite",
          borderColor: "transparent",
        }}
      >
        {loading ? (
          <div
            className="flex items-center justify-center"
            style={{ height: "400px" }}
          >
            <div className="text-center">
              <div
                className="w-12 h-12 border-2 border-cyan-400 border-t-transparent rounded-full mx-auto mb-3"
                style={{ animation: "spin 1s linear infinite" }}
              />
              <p className="text-cyan-400 text-sm">Loading world map...</p>
            </div>
          </div>
        ) : (
          <div className="relative">
            <svg
              ref={svgRef}
              viewBox={`0 0 ${W} ${H}`}
              className="w-full"
              style={{
                display: "block",
                cursor: "crosshair",
                maxHeight: "500px",
              }}
              onClick={() => {
                setPopup(null);
              }}
              onKeyDown={(e) => e.key === "Escape" && setPopup(null)}
              role="img"
              aria-label="Interactive world map"
            >
              {/* Background grid */}
              {[0, 45, 90, 135, 180, 225, 270, 315, 360].map((lon) => (
                <line
                  key={`v${lon}`}
                  x1={projectLon(lon - 180)}
                  y1={0}
                  x2={projectLon(lon - 180)}
                  y2={H}
                  stroke="rgba(255,255,255,0.04)"
                  strokeWidth="0.5"
                />
              ))}
              {[-60, -30, 0, 30, 60].map((lat) => (
                <line
                  key={`h${lat}`}
                  x1={0}
                  y1={projectLat(lat)}
                  x2={W}
                  y2={projectLat(lat)}
                  stroke="rgba(255,255,255,0.04)"
                  strokeWidth="0.5"
                />
              ))}

              {/* Countries */}
              {countries.map((country) => {
                const visible =
                  activeContinent === "All" ||
                  country.continent === activeContinent;
                return (
                  <path
                    key={country.name}
                    d={country.path}
                    fill={getCountryColor(country)}
                    stroke={getCountryStroke(country)}
                    strokeWidth={getStrokeWidth(country)}
                    style={{
                      cursor: visible ? "pointer" : "default",
                      filter: getFilter(country),
                      transition: "fill 0.3s ease, stroke 0.3s ease",
                      animation: glowingCountries.includes(country.name)
                        ? "countryGlow 1s ease-in-out infinite"
                        : "none",
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (!visible) return;
                      toggleSelect(country.name);
                      const svgRect = svgRef.current?.getBoundingClientRect();
                      if (svgRect) {
                        const scaleX = W / svgRect.width;
                        const scaleY = H / svgRect.height;
                        setPopup({
                          name: country.name,
                          x: country.centroid[0] / scaleX,
                          y: country.centroid[1] / scaleY,
                        });
                      }
                    }}
                    onMouseEnter={(e) => {
                      if (!visible) return;
                      setHoveredCountry(country.name);
                      const svgRect = svgRef.current?.getBoundingClientRect();
                      if (svgRect) {
                        setTooltipPos({
                          x: e.clientX - svgRect.left,
                          y: e.clientY - svgRect.top,
                        });
                      }
                    }}
                    onMouseMove={(e) => {
                      const svgRect = svgRef.current?.getBoundingClientRect();
                      if (svgRect) {
                        setTooltipPos({
                          x: e.clientX - svgRect.left,
                          y: e.clientY - svgRect.top,
                        });
                      }
                    }}
                    onMouseLeave={() => {
                      setHoveredCountry(null);
                      setTooltipPos(null);
                    }}
                    role="button"
                    tabIndex={visible ? 0 : -1}
                    aria-label={country.name}
                    onKeyDown={(e) =>
                      e.key === "Enter" && visible && toggleSelect(country.name)
                    }
                  />
                );
              })}
            </svg>

            {/* Hover Tooltip */}
            {hoveredCountry &&
              tooltipPos &&
              (() => {
                const country = countries.find(
                  (c) => c.name === hoveredCountry,
                );
                if (!country) return null;
                const color = CONTINENT_COLORS[country.continent] || "#06b6d4";
                return (
                  <div
                    className="absolute pointer-events-none px-3 py-1.5 rounded-lg text-xs font-semibold text-white z-10"
                    style={{
                      left: tooltipPos.x + 12,
                      top: tooltipPos.y - 10,
                      background: `${color}dd`,
                      boxShadow: `0 4px 12px ${color}66`,
                      backdropFilter: "blur(4px)",
                      border: `1px solid ${color}88`,
                      transform:
                        tooltipPos.x > 650 ? "translateX(-110%)" : undefined,
                    }}
                  >
                    {FLAG_EMOJI[country.name] || "🌍"} {country.name}
                  </div>
                );
              })()}

            {/* Click Popup */}
            {popup &&
              (() => {
                const country = countries.find((c) => c.name === popup.name);
                if (!country) return null;
                const color = CONTINENT_COLORS[country.continent] || "#06b6d4";
                return (
                  <div
                    className="absolute z-20 pointer-events-none"
                    style={{
                      left: Math.min(
                        popup.x,
                        (svgRef.current?.clientWidth || 700) - 200,
                      ),
                      top: Math.max(popup.y - 100, 8),
                    }}
                  >
                    <div
                      className="rounded-xl p-3 text-white text-sm"
                      style={{
                        background: "linear-gradient(135deg, #0f172a, #1e293b)",
                        border: `1.5px solid ${color}88`,
                        boxShadow: `0 8px 24px ${color}44`,
                        minWidth: "180px",
                      }}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-2xl">
                          {FLAG_EMOJI[country.name] || "🌍"}
                        </span>
                        <div>
                          <p className="font-bold text-sm">{country.name}</p>
                          <p className="text-xs opacity-60">
                            {country.continent}
                          </p>
                        </div>
                      </div>
                      <div
                        className="flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs font-semibold mb-2"
                        style={{ background: `${color}22`, color }}
                      >
                        <span>👥</span>
                        {country.registrations.toLocaleString()} registered
                      </div>
                      <div
                        className="text-center text-xs font-bold py-1 rounded-lg"
                        style={{
                          background: `linear-gradient(135deg, ${color}44, ${color}22)`,
                          color,
                          border: `1px solid ${color}44`,
                        }}
                      >
                        ✓ ClawPro Available Here
                      </div>
                    </div>
                  </div>
                );
              })()}
          </div>
        )}
      </div>

      {/* LIVE indicator */}
      <div className="flex items-center justify-between mt-3 px-1">
        <div className="flex items-center gap-2">
          <span
            className="w-2.5 h-2.5 rounded-full bg-red-500"
            style={{
              boxShadow: "0 0 8px rgba(239,68,68,0.9)",
              animation: "pulse 1s ease-in-out infinite",
            }}
          />
          <span className="text-xs font-bold text-red-400">LIVE</span>
          <span className="text-xs text-gray-400">
            {selectedCount} countr{selectedCount === 1 ? "y" : "ies"} active
          </span>
        </div>
        <div className="text-xs text-gray-500">
          {visibleCountries.length} shown
        </div>
      </div>

      {/* Glowing Country Indicators */}
      {glowingCountries.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2 px-1">
          {glowingCountries.map((name) => {
            const country = countries.find((c) => c.name === name);
            if (!country) return null;
            const color = CONTINENT_COLORS[country.continent] || "#06b6d4";
            return (
              <div
                key={name}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium"
                style={{
                  background: `${color}18`,
                  border: `1px solid ${color}55`,
                  color,
                }}
              >
                <span
                  className="w-1.5 h-1.5 rounded-full"
                  style={{
                    background: color,
                    boxShadow: `0 0 6px ${color}`,
                    animation: "ledPulse 0.8s ease-in-out infinite",
                  }}
                />
                {FLAG_EMOJI[name] || "🌍"} {name}
              </div>
            );
          })}
        </div>
      )}

      {/* Leaderboard */}
      <div
        className="mt-8 rounded-2xl overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #0d0d1f 0%, #0a0a18 100%)",
          border: "1px solid rgba(6,182,212,0.2)",
          boxShadow:
            "0 0 40px rgba(6,182,212,0.06), inset 0 0 60px rgba(0,0,0,0.4)",
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-5 py-4"
          style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
        >
          <div className="flex items-center gap-3">
            <span className="text-lg">🏆</span>
            <h3 className="text-sm font-bold text-white tracking-wide">
              Top Countries by Registrations
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span className="text-[10px] font-semibold text-emerald-400 uppercase tracking-widest">
              Live Data
            </span>
          </div>
        </div>

        {/* Country rows */}
        <div className="p-4 space-y-2">
          {leaderboard.slice(0, 10).map((country, idx) => {
            const color = CONTINENT_COLORS[country.continent] || "#06b6d4";
            const maxReg = leaderboard[0]?.registrations || 1;
            const pct = Math.max(4, (country.registrations / maxReg) * 100);
            const barColor =
              idx === 0
                ? "linear-gradient(90deg, #f59e0b, #fbbf24)"
                : idx === 1
                  ? "linear-gradient(90deg, #94a3b8, #cbd5e1)"
                  : idx === 2
                    ? "linear-gradient(90deg, #b45309, #d97706)"
                    : `linear-gradient(90deg, ${color}88, ${color})`;
            const rankLabel =
              idx === 0
                ? "👑"
                : idx === 1
                  ? "🥈"
                  : idx === 2
                    ? "🥉"
                    : String(idx + 1);
            const rowGlow =
              idx === 0
                ? "rgba(245,158,11,0.1)"
                : idx === 1
                  ? "rgba(148,163,184,0.08)"
                  : idx === 2
                    ? "rgba(180,83,9,0.1)"
                    : "transparent";
            return (
              <div
                key={country.name}
                className="group flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 cursor-default hover:bg-white/5"
                style={{
                  background: idx < 3 ? rowGlow : "transparent",
                  border:
                    idx < 3 ? `1px solid ${color}18` : "1px solid transparent",
                }}
                data-ocid={`map.item.${idx + 1}`}
              >
                <span
                  className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{
                    background:
                      idx < 3
                        ? "rgba(255,255,255,0.06)"
                        : "rgba(255,255,255,0.04)",
                    border:
                      idx < 3
                        ? `1px solid ${color}40`
                        : "1px solid rgba(255,255,255,0.06)",
                    fontSize: idx < 3 ? "14px" : "11px",
                    color: idx < 3 ? "#fff" : "rgba(255,255,255,0.4)",
                  }}
                >
                  {rankLabel}
                </span>
                <span className="text-base flex-shrink-0">
                  {FLAG_EMOJI[country.name] || "🌍"}
                </span>
                <span className="text-xs font-medium text-gray-200 flex-shrink-0 w-28 truncate group-hover:text-white transition-colors">
                  {country.name}
                </span>
                <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-1000"
                    style={{
                      width: `${pct}%`,
                      background: barColor,
                      boxShadow: `0 0 8px ${color}60`,
                    }}
                  />
                </div>
                <span
                  className="text-xs font-bold flex-shrink-0 w-12 text-right"
                  style={{ color: idx < 3 ? color : "rgba(255,255,255,0.5)" }}
                >
                  {country.registrations.toLocaleString()}
                </span>
              </div>
            );
          })}
          {leaderboard.length === 0 && (
            <div className="py-8 text-center" data-ocid="map.empty_state">
              <span className="text-3xl mb-2 block">🌐</span>
              <p className="text-xs text-gray-500">
                No registrations yet. Be the first!
              </p>
            </div>
          )}
        </div>
        <div
          className="px-5 py-3"
          style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}
        >
          <p className="text-[10px] text-gray-600 text-center">
            Updated every 10 minutes · Based on member registrations
          </p>
        </div>
      </div>
    </div>
  );
}
