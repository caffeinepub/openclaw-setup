import type React from "react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";

const GEO_URL =
  "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

const ISO_MAP: Record<
  string,
  { alpha2: string; region: string; name: string }
> = {
  "004": { alpha2: "af", region: "Asia", name: "Afghanistan" },
  "008": { alpha2: "al", region: "Europe", name: "Albania" },
  "012": { alpha2: "dz", region: "Africa", name: "Algeria" },
  "024": { alpha2: "ao", region: "Africa", name: "Angola" },
  "032": { alpha2: "ar", region: "Americas", name: "Argentina" },
  "036": { alpha2: "au", region: "Oceania", name: "Australia" },
  "040": { alpha2: "at", region: "Europe", name: "Austria" },
  "050": { alpha2: "bd", region: "Asia", name: "Bangladesh" },
  "056": { alpha2: "be", region: "Europe", name: "Belgium" },
  "064": { alpha2: "bt", region: "Asia", name: "Bhutan" },
  "068": { alpha2: "bo", region: "Americas", name: "Bolivia" },
  "076": { alpha2: "br", region: "Americas", name: "Brazil" },
  "100": { alpha2: "bg", region: "Europe", name: "Bulgaria" },
  "104": { alpha2: "mm", region: "Asia", name: "Myanmar" },
  "116": { alpha2: "kh", region: "Asia", name: "Cambodia" },
  "120": { alpha2: "cm", region: "Africa", name: "Cameroon" },
  "124": { alpha2: "ca", region: "Americas", name: "Canada" },
  "140": { alpha2: "cf", region: "Africa", name: "Central African Republic" },
  "144": { alpha2: "lk", region: "Asia", name: "Sri Lanka" },
  "152": { alpha2: "cl", region: "Americas", name: "Chile" },
  "156": { alpha2: "cn", region: "Asia", name: "China" },
  "170": { alpha2: "co", region: "Americas", name: "Colombia" },
  "178": { alpha2: "cg", region: "Africa", name: "Republic of the Congo" },
  "180": { alpha2: "cd", region: "Africa", name: "DR Congo" },
  "188": { alpha2: "cr", region: "Americas", name: "Costa Rica" },
  "191": { alpha2: "hr", region: "Europe", name: "Croatia" },
  "192": { alpha2: "cu", region: "Americas", name: "Cuba" },
  "196": { alpha2: "cy", region: "Europe", name: "Cyprus" },
  "203": { alpha2: "cz", region: "Europe", name: "Czech Republic" },
  "208": { alpha2: "dk", region: "Europe", name: "Denmark" },
  "218": { alpha2: "ec", region: "Americas", name: "Ecuador" },
  "818": { alpha2: "eg", region: "Africa", name: "Egypt" },
  "222": { alpha2: "sv", region: "Americas", name: "El Salvador" },
  "231": { alpha2: "et", region: "Africa", name: "Ethiopia" },
  "246": { alpha2: "fi", region: "Europe", name: "Finland" },
  "250": { alpha2: "fr", region: "Europe", name: "France" },
  "266": { alpha2: "ga", region: "Africa", name: "Gabon" },
  "276": { alpha2: "de", region: "Europe", name: "Germany" },
  "288": { alpha2: "gh", region: "Africa", name: "Ghana" },
  "300": { alpha2: "gr", region: "Europe", name: "Greece" },
  "320": { alpha2: "gt", region: "Americas", name: "Guatemala" },
  "324": { alpha2: "gn", region: "Africa", name: "Guinea" },
  "332": { alpha2: "ht", region: "Americas", name: "Haiti" },
  "340": { alpha2: "hn", region: "Americas", name: "Honduras" },
  "348": { alpha2: "hu", region: "Europe", name: "Hungary" },
  "356": { alpha2: "in", region: "Asia", name: "India" },
  "360": { alpha2: "id", region: "Asia", name: "Indonesia" },
  "364": { alpha2: "ir", region: "Middle East", name: "Iran" },
  "368": { alpha2: "iq", region: "Middle East", name: "Iraq" },
  "372": { alpha2: "ie", region: "Europe", name: "Ireland" },
  "376": { alpha2: "il", region: "Middle East", name: "Israel" },
  "380": { alpha2: "it", region: "Europe", name: "Italy" },
  "388": { alpha2: "jm", region: "Americas", name: "Jamaica" },
  "392": { alpha2: "jp", region: "Asia", name: "Japan" },
  "400": { alpha2: "jo", region: "Middle East", name: "Jordan" },
  "398": { alpha2: "kz", region: "Asia", name: "Kazakhstan" },
  "404": { alpha2: "ke", region: "Africa", name: "Kenya" },
  "408": { alpha2: "kp", region: "Asia", name: "North Korea" },
  "410": { alpha2: "kr", region: "Asia", name: "South Korea" },
  "414": { alpha2: "kw", region: "Middle East", name: "Kuwait" },
  "418": { alpha2: "la", region: "Asia", name: "Laos" },
  "422": { alpha2: "lb", region: "Middle East", name: "Lebanon" },
  "434": { alpha2: "ly", region: "Africa", name: "Libya" },
  "458": { alpha2: "my", region: "Asia", name: "Malaysia" },
  "466": { alpha2: "ml", region: "Africa", name: "Mali" },
  "478": { alpha2: "mr", region: "Africa", name: "Mauritania" },
  "484": { alpha2: "mx", region: "Americas", name: "Mexico" },
  "504": { alpha2: "ma", region: "Africa", name: "Morocco" },
  "508": { alpha2: "mz", region: "Africa", name: "Mozambique" },
  "516": { alpha2: "na", region: "Africa", name: "Namibia" },
  "524": { alpha2: "np", region: "Asia", name: "Nepal" },
  "528": { alpha2: "nl", region: "Europe", name: "Netherlands" },
  "554": { alpha2: "nz", region: "Oceania", name: "New Zealand" },
  "558": { alpha2: "ni", region: "Americas", name: "Nicaragua" },
  "562": { alpha2: "ne", region: "Africa", name: "Niger" },
  "566": { alpha2: "ng", region: "Africa", name: "Nigeria" },
  "578": { alpha2: "no", region: "Europe", name: "Norway" },
  "586": { alpha2: "pk", region: "Asia", name: "Pakistan" },
  "591": { alpha2: "pa", region: "Americas", name: "Panama" },
  "598": { alpha2: "pg", region: "Oceania", name: "Papua New Guinea" },
  "600": { alpha2: "py", region: "Americas", name: "Paraguay" },
  "604": { alpha2: "pe", region: "Americas", name: "Peru" },
  "608": { alpha2: "ph", region: "Asia", name: "Philippines" },
  "616": { alpha2: "pl", region: "Europe", name: "Poland" },
  "620": { alpha2: "pt", region: "Europe", name: "Portugal" },
  "630": { alpha2: "pr", region: "Americas", name: "Puerto Rico" },
  "634": { alpha2: "qa", region: "Middle East", name: "Qatar" },
  "642": { alpha2: "ro", region: "Europe", name: "Romania" },
  "643": { alpha2: "ru", region: "Europe", name: "Russia" },
  "646": { alpha2: "rw", region: "Africa", name: "Rwanda" },
  "682": { alpha2: "sa", region: "Middle East", name: "Saudi Arabia" },
  "686": { alpha2: "sn", region: "Africa", name: "Senegal" },
  "694": { alpha2: "sl", region: "Africa", name: "Sierra Leone" },
  "706": { alpha2: "so", region: "Africa", name: "Somalia" },
  "710": { alpha2: "za", region: "Africa", name: "South Africa" },
  "724": { alpha2: "es", region: "Europe", name: "Spain" },
  "729": { alpha2: "sd", region: "Africa", name: "Sudan" },
  "752": { alpha2: "se", region: "Europe", name: "Sweden" },
  "756": { alpha2: "ch", region: "Europe", name: "Switzerland" },
  "760": { alpha2: "sy", region: "Middle East", name: "Syria" },
  "764": { alpha2: "th", region: "Asia", name: "Thailand" },
  "788": { alpha2: "tn", region: "Africa", name: "Tunisia" },
  "792": { alpha2: "tr", region: "Europe", name: "Turkey" },
  "800": { alpha2: "ug", region: "Africa", name: "Uganda" },
  "804": { alpha2: "ua", region: "Europe", name: "Ukraine" },
  "784": { alpha2: "ae", region: "Middle East", name: "UAE" },
  "826": { alpha2: "gb", region: "Europe", name: "United Kingdom" },
  "840": { alpha2: "us", region: "Americas", name: "United States" },
  "858": { alpha2: "uy", region: "Americas", name: "Uruguay" },
  "860": { alpha2: "uz", region: "Asia", name: "Uzbekistan" },
  "862": { alpha2: "ve", region: "Americas", name: "Venezuela" },
  "704": { alpha2: "vn", region: "Asia", name: "Vietnam" },
  "887": { alpha2: "ye", region: "Middle East", name: "Yemen" },
  "894": { alpha2: "zm", region: "Africa", name: "Zambia" },
  "716": { alpha2: "zw", region: "Africa", name: "Zimbabwe" },
};

const REGION_COLORS: Record<string, string> = {
  Americas: "#ff6b35",
  Europe: "#a78bfa",
  Asia: "#22d3ee",
  "Middle East": "#fbbf24",
  Africa: "#4ade80",
  Oceania: "#f472b6",
};

const REGIONS = [
  "All",
  "Asia",
  "Europe",
  "Americas",
  "Africa",
  "Oceania",
  "Middle East",
];

function getMemberCount(isoNum: string): number {
  const n = Number(isoNum);
  return ((n * 37 + 13) % 190) + 5;
}

interface GeoItem {
  rsmKey: string;
  id: string | number;
  properties: { name?: string };
}

interface PopupInfo {
  name: string;
  isoNum: string;
  alpha2: string;
  region: string;
  members: number;
  xPct: number;
  yPct: number;
}

interface LitCountry {
  id: string;
  name: string;
  region: string;
}

export function InteractiveWorldMap() {
  const [selectedCountries, setSelectedCountries] = useState<Set<string>>(
    new Set(),
  );
  const [hoveredCountry, setHoveredCountry] = useState<string | null>(null);
  const [litCountries, setLitCountries] = useState<LitCountry[]>([]);
  const [popup, setPopup] = useState<PopupInfo | null>(null);
  const [selectedFilter, setSelectedFilter] = useState<string>("All");
  const [leaderboardSeed, setLeaderboardSeed] = useState(0);

  // Stable ref to all geo IDs so the interval doesn't re-register
  const allGeosRef = useRef<LitCountry[]>([]);
  const geosRegistered = useRef(false);

  // Auto-glow: 2-3 random countries every 1.2s
  useEffect(() => {
    const timer = setInterval(() => {
      const pool = allGeosRef.current.filter(
        (g) => selectedFilter === "All" || g.region === selectedFilter,
      );
      if (pool.length < 2) return;
      const count = 2 + Math.floor(Math.random() * 2);
      const picks = [...pool].sort(() => Math.random() - 0.5).slice(0, count);
      setLitCountries(picks);
    }, 1200);
    return () => clearInterval(timer);
  }, [selectedFilter]);

  // Shuffle leaderboard every 10 minutes
  useEffect(() => {
    const timer = setInterval(
      () => {
        setLeaderboardSeed((s) => s + 1);
      },
      10 * 60 * 1000,
    );
    return () => clearInterval(timer);
  }, []);

  const litSet = useMemo(
    () => new Set(litCountries.map((c) => c.id)),
    [litCountries],
  );

  const handleGeoClick = useCallback((geo: GeoItem, e: React.MouseEvent) => {
    e.stopPropagation();
    const isoNum = String(geo.id).padStart(3, "0");
    const isoEntry = ISO_MAP[isoNum];
    const name =
      isoEntry?.name ?? (geo.properties.name as string | undefined) ?? isoNum;
    const alpha2 = isoEntry?.alpha2 ?? "";
    const region = isoEntry?.region ?? "Other";
    const members = getMemberCount(isoNum);

    // Calculate position relative to map container
    const container = (e.currentTarget as Element).closest(".map-container");
    const rect = container?.getBoundingClientRect();
    const xPct = rect ? ((e.clientX - rect.left) / rect.width) * 100 : 50;
    const yPct = rect ? ((e.clientY - rect.top) / rect.height) * 100 : 50;

    setSelectedCountries((prev) => {
      const next = new Set(prev);
      if (next.has(isoNum)) next.delete(isoNum);
      else next.add(isoNum);
      return next;
    });

    setPopup({ name, isoNum, alpha2, region, members, xPct, yPct });
  }, []);

  const topCountries = useMemo(() => {
    const rng = (idx: number) => Math.sin(leaderboardSeed * 9999 + idx) * 10000;
    return Object.entries(ISO_MAP)
      .map(([isoNum, { alpha2, region, name }], idx) => ({
        isoNum,
        alpha2,
        region,
        name,
        members: getMemberCount(isoNum),
        sortKey: getMemberCount(isoNum) + rng(idx) * 0.01,
      }))
      .sort((a, b) => b.sortKey - a.sortKey)
      .slice(0, 5);
  }, [leaderboardSeed]);

  const countsByRegion = useMemo(
    () =>
      REGIONS.filter((r) => r !== "All").map((r) => ({
        region: r,
        count: Object.values(ISO_MAP).filter((v) => v.region === r).length,
      })),
    [],
  );

  return (
    <div className="w-full">
      {/* Region filter buttons */}
      <div className="flex flex-wrap gap-2 mb-4">
        {REGIONS.map((region) => {
          const color =
            region === "All" ? "#94a3b8" : (REGION_COLORS[region] ?? "#94a3b8");
          const isActive = selectedFilter === region;
          const cnt =
            region === "All"
              ? Object.keys(ISO_MAP).length
              : Object.values(ISO_MAP).filter((v) => v.region === region)
                  .length;
          return (
            <button
              key={region}
              type="button"
              onClick={() => setSelectedFilter(region)}
              data-ocid={`map.${region.toLowerCase().replace(" ", "-")}.tab`}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-semibold border transition-all"
              style={{
                borderColor: isActive ? color : `${color}40`,
                background: isActive ? `${color}20` : "transparent",
                color: isActive ? color : "#64748b",
                boxShadow: isActive ? `0 0 10px ${color}50` : "none",
              }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                style={{
                  background: color,
                  boxShadow: isActive ? `0 0 6px ${color}` : "none",
                  animation: isActive
                    ? "pulse 1.5s ease-in-out infinite"
                    : "none",
                }}
              />
              {region} <span style={{ opacity: 0.6 }}>({cnt})</span>
            </button>
          );
        })}
        {selectedCountries.size > 0 && (
          <button
            type="button"
            onClick={() => {
              setSelectedCountries(new Set());
              setPopup(null);
            }}
            data-ocid="map.reset.button"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-semibold border transition-all"
            style={{
              borderColor: "#f43f5e60",
              background: "#f43f5e15",
              color: "#f43f5e",
              boxShadow: "0 0 8px #f43f5e30",
            }}
          >
            ✕ Reset ({selectedCountries.size})
          </button>
        )}
      </div>

      {/* Map container */}
      <div
        className="map-container relative w-full rounded-xl overflow-hidden"
        style={{
          background: "#050d1a",
          border: "1px solid rgba(34,211,238,0.15)",
          boxShadow:
            "0 0 40px rgba(34,211,238,0.06), 0 0 80px rgba(34,211,238,0.03), inset 0 0 60px rgba(0,0,0,0.8)",
          userSelect: "none",
          touchAction: "none",
        }}
        role="presentation"
        onClick={() => setPopup(null)}
        onKeyDown={(e) => {
          if (e.key === "Escape") setPopup(null);
        }}
      >
        <ComposableMap
          projection="geoMercator"
          projectionConfig={{ scale: 120, center: [10, 15] }}
          style={{ width: "100%", height: "auto" }}
        >
          <Geographies geography={GEO_URL}>
            {({ geographies }) => {
              // Register geo list once into the ref (no setState during render)
              if (!geosRegistered.current && geographies.length > 0) {
                geosRegistered.current = true;
                const list: LitCountry[] = [];
                for (const geo of geographies) {
                  const isoNum = String(geo.id).padStart(3, "0");
                  const entry = ISO_MAP[isoNum];
                  if (!entry) continue;
                  list.push({
                    id: isoNum,
                    name: entry.name,
                    region: entry.region,
                  });
                }
                allGeosRef.current = list;
              }

              return geographies.map((geo) => {
                const isoNum = String(geo.id).padStart(3, "0");
                const entry = ISO_MAP[isoNum];
                if (!entry) return null;

                const { region } = entry;
                const isFiltered =
                  selectedFilter !== "All" && region !== selectedFilter;
                const isSelected = selectedCountries.has(isoNum);
                const isLit = litSet.has(isoNum);
                const isHovered = hoveredCountry === isoNum;
                const baseColor = REGION_COLORS[region] ?? "#94a3b8";

                let fill: string;
                if (isFiltered) {
                  fill = "rgba(15,23,42,0.5)";
                } else if (isSelected) {
                  fill = baseColor;
                } else if (isLit) {
                  fill = `${baseColor}cc`;
                } else if (isHovered) {
                  fill = `${baseColor}99`;
                } else {
                  fill = `${baseColor}38`;
                }

                const stroke = isSelected || isLit ? baseColor : "#0a1628";
                const strokeWidth = isSelected ? 1 : isLit ? 0.7 : 0.3;

                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill={fill}
                    stroke={stroke}
                    strokeWidth={strokeWidth}
                    style={{
                      default: {
                        outline: "none",
                        filter:
                          isLit || isSelected
                            ? `drop-shadow(0 0 5px ${baseColor})`
                            : "none",
                        transition: "fill 0.35s ease, filter 0.35s ease",
                      },
                      hover: {
                        outline: "none",
                        cursor: "pointer",
                      },
                      pressed: { outline: "none" },
                    }}
                    onClick={(e) =>
                      handleGeoClick(geo as unknown as GeoItem, e)
                    }
                    onMouseEnter={() => setHoveredCountry(isoNum)}
                    onMouseLeave={() => setHoveredCountry(null)}
                  />
                );
              });
            }}
          </Geographies>
        </ComposableMap>

        {/* Hover tooltip — bottom-left */}
        {hoveredCountry &&
          (() => {
            const entry = ISO_MAP[hoveredCountry];
            if (!entry) return null;
            const color = REGION_COLORS[entry.region] ?? "#94a3b8";
            return (
              <div className="absolute bottom-3 left-3 pointer-events-none z-10">
                <div
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold"
                  style={{
                    background: `${color}18`,
                    border: `1px solid ${color}50`,
                    color,
                    backdropFilter: "blur(8px)",
                    boxShadow: `0 0 12px ${color}30`,
                  }}
                >
                  {entry.name}
                </div>
              </div>
            );
          })()}

        {/* Click popup */}
        {popup && (
          <div
            className="absolute z-20"
            style={{
              left: `${Math.min(Math.max(popup.xPct, 5), 70)}%`,
              top: `${Math.max(popup.yPct - 20, 3)}%`,
              pointerEvents: "none",
            }}
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => e.stopPropagation()}
          >
            <div
              className="rounded-xl px-3 py-2.5 min-w-[160px]"
              style={{
                background: "rgba(8,15,30,0.95)",
                border: `1px solid ${REGION_COLORS[popup.region] ?? "#22d3ee"}50`,
                boxShadow: `0 0 20px ${REGION_COLORS[popup.region] ?? "#22d3ee"}30, 0 8px 32px rgba(0,0,0,0.6)`,
                backdropFilter: "blur(12px)",
              }}
            >
              <div className="flex items-center gap-2 mb-1.5">
                {popup.alpha2 && (
                  <img
                    src={`https://flagcdn.com/24x18/${popup.alpha2}.png`}
                    alt={popup.name}
                    width={24}
                    height={18}
                    className="rounded-sm object-cover flex-shrink-0"
                    style={{ width: 22, height: 16 }}
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).style.display =
                        "none";
                    }}
                  />
                )}
                <span className="text-xs font-bold text-white/90">
                  {popup.name}
                </span>
              </div>
              <div className="flex items-center justify-between gap-3 mb-1.5">
                <span
                  className="text-[9px] uppercase tracking-wider"
                  style={{
                    color: REGION_COLORS[popup.region] ?? "#22d3ee",
                    opacity: 0.7,
                  }}
                >
                  {popup.region}
                </span>
                <span
                  className="text-[10px] font-bold"
                  style={{ color: REGION_COLORS[popup.region] ?? "#22d3ee" }}
                >
                  {popup.members.toLocaleString()} members
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <span
                  className="w-1.5 h-1.5 rounded-full animate-pulse"
                  style={{ background: "#4ade80" }}
                />
                <span
                  className="text-[9px] font-medium"
                  style={{ color: "#4ade80" }}
                >
                  ClawPro Available
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* LIVE indicator + auto-glow labels */}
      <div className="flex items-center gap-3 mt-3 flex-wrap">
        <div className="flex items-center gap-1.5">
          <span
            className="w-2 h-2 rounded-full animate-pulse"
            style={{ background: "#4ade80", boxShadow: "0 0 6px #4ade80" }}
          />
          <span className="text-[10px] text-white/40 font-mono tracking-wider">
            LIVE — {Object.keys(ISO_MAP).length} countries
          </span>
        </div>
        {litCountries.map((c) => {
          const color = REGION_COLORS[c.region] ?? "#94a3b8";
          return (
            <span
              key={c.id}
              className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-medium border"
              style={{
                borderColor: `${color}50`,
                color,
                background: `${color}18`,
                boxShadow: `0 0 6px ${color}20`,
              }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full animate-pulse flex-shrink-0"
                style={{ background: color }}
              />
              {c.name}
            </span>
          );
        })}
      </div>

      {/* Top 5 Countries leaderboard */}
      <div className="mt-4">
        <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-2">
          Top Countries by Registrations
        </p>
        <div className="flex flex-col gap-1.5">
          {topCountries.map((c, i) => {
            const color = REGION_COLORS[c.region] ?? "#94a3b8";
            const medals = ["🥇", "🥈", "🥉", "4.", "5."];
            return (
              <div
                key={c.isoNum}
                data-ocid={`map.leaderboard.item.${i + 1}`}
                className="flex items-center gap-2.5 px-3 py-2 rounded-lg border"
                style={{
                  borderColor: `${color}25`,
                  background: `${color}08`,
                }}
              >
                <span className="text-xs w-5 text-center flex-shrink-0">
                  {medals[i]}
                </span>
                <img
                  src={`https://flagcdn.com/24x18/${c.alpha2}.png`}
                  alt={c.name}
                  width={24}
                  height={18}
                  className="rounded-sm object-cover flex-shrink-0"
                  style={{ width: 20, height: 14 }}
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).style.display =
                      "none";
                  }}
                />
                <span className="text-xs font-semibold text-white/80 flex-1">
                  {c.name}
                </span>
                <span className="text-[10px] font-bold" style={{ color }}>
                  {c.members.toLocaleString()}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Region summary grid */}
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mt-3">
        {countsByRegion.map(({ region, count }) => {
          const color = REGION_COLORS[region] ?? "#94a3b8";
          return (
            <div
              key={region}
              className="flex flex-col items-center gap-0.5 px-2 py-2 rounded-lg border text-center"
              style={{
                borderColor: `${color}30`,
                background: `${color}10`,
              }}
            >
              <span className="text-sm font-bold" style={{ color }}>
                {count}
              </span>
              <span className="text-[9px] text-white/40 leading-none">
                {region}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
