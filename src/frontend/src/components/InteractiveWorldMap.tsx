import { useEffect, useMemo, useState } from "react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";

// World topology from CDN (110m resolution — lightweight + accurate)
const GEO_URL =
  "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

// ISO numeric -> alpha2 + region mapping (covers ~175 countries)
const ISO_MAP: Record<string, { alpha2: string; region: string }> = {
  "004": { alpha2: "af", region: "Asia" },
  "008": { alpha2: "al", region: "Europe" },
  "012": { alpha2: "dz", region: "Africa" },
  "024": { alpha2: "ao", region: "Africa" },
  "032": { alpha2: "ar", region: "Americas" },
  "036": { alpha2: "au", region: "Oceania" },
  "040": { alpha2: "at", region: "Europe" },
  "050": { alpha2: "bd", region: "Asia" },
  "056": { alpha2: "be", region: "Europe" },
  "064": { alpha2: "bt", region: "Asia" },
  "068": { alpha2: "bo", region: "Americas" },
  "076": { alpha2: "br", region: "Americas" },
  "100": { alpha2: "bg", region: "Europe" },
  "104": { alpha2: "mm", region: "Asia" },
  "116": { alpha2: "kh", region: "Asia" },
  "120": { alpha2: "cm", region: "Africa" },
  "124": { alpha2: "ca", region: "Americas" },
  "140": { alpha2: "cf", region: "Africa" },
  "144": { alpha2: "lk", region: "Asia" },
  "152": { alpha2: "cl", region: "Americas" },
  "156": { alpha2: "cn", region: "Asia" },
  "170": { alpha2: "co", region: "Americas" },
  "178": { alpha2: "cg", region: "Africa" },
  "180": { alpha2: "cd", region: "Africa" },
  "188": { alpha2: "cr", region: "Americas" },
  "191": { alpha2: "hr", region: "Europe" },
  "192": { alpha2: "cu", region: "Americas" },
  "196": { alpha2: "cy", region: "Europe" },
  "203": { alpha2: "cz", region: "Europe" },
  "208": { alpha2: "dk", region: "Europe" },
  "218": { alpha2: "ec", region: "Americas" },
  "818": { alpha2: "eg", region: "Africa" },
  "222": { alpha2: "sv", region: "Americas" },
  "231": { alpha2: "et", region: "Africa" },
  "246": { alpha2: "fi", region: "Europe" },
  "250": { alpha2: "fr", region: "Europe" },
  "266": { alpha2: "ga", region: "Africa" },
  "276": { alpha2: "de", region: "Europe" },
  "288": { alpha2: "gh", region: "Africa" },
  "300": { alpha2: "gr", region: "Europe" },
  "320": { alpha2: "gt", region: "Americas" },
  "324": { alpha2: "gn", region: "Africa" },
  "332": { alpha2: "ht", region: "Americas" },
  "340": { alpha2: "hn", region: "Americas" },
  "348": { alpha2: "hu", region: "Europe" },
  "356": { alpha2: "in", region: "Asia" },
  "360": { alpha2: "id", region: "Asia" },
  "364": { alpha2: "ir", region: "Middle East" },
  "368": { alpha2: "iq", region: "Middle East" },
  "372": { alpha2: "ie", region: "Europe" },
  "376": { alpha2: "il", region: "Middle East" },
  "380": { alpha2: "it", region: "Europe" },
  "388": { alpha2: "jm", region: "Americas" },
  "392": { alpha2: "jp", region: "Asia" },
  "400": { alpha2: "jo", region: "Middle East" },
  "398": { alpha2: "kz", region: "Asia" },
  "404": { alpha2: "ke", region: "Africa" },
  "408": { alpha2: "kp", region: "Asia" },
  "410": { alpha2: "kr", region: "Asia" },
  "414": { alpha2: "kw", region: "Middle East" },
  "418": { alpha2: "la", region: "Asia" },
  "422": { alpha2: "lb", region: "Middle East" },
  "434": { alpha2: "ly", region: "Africa" },
  "458": { alpha2: "my", region: "Asia" },
  "466": { alpha2: "ml", region: "Africa" },
  "478": { alpha2: "mr", region: "Africa" },
  "484": { alpha2: "mx", region: "Americas" },
  "504": { alpha2: "ma", region: "Africa" },
  "508": { alpha2: "mz", region: "Africa" },
  "516": { alpha2: "na", region: "Africa" },
  "524": { alpha2: "np", region: "Asia" },
  "528": { alpha2: "nl", region: "Europe" },
  "554": { alpha2: "nz", region: "Oceania" },
  "558": { alpha2: "ni", region: "Americas" },
  "562": { alpha2: "ne", region: "Africa" },
  "566": { alpha2: "ng", region: "Africa" },
  "578": { alpha2: "no", region: "Europe" },
  "586": { alpha2: "pk", region: "Asia" },
  "591": { alpha2: "pa", region: "Americas" },
  "598": { alpha2: "pg", region: "Oceania" },
  "600": { alpha2: "py", region: "Americas" },
  "604": { alpha2: "pe", region: "Americas" },
  "608": { alpha2: "ph", region: "Asia" },
  "616": { alpha2: "pl", region: "Europe" },
  "620": { alpha2: "pt", region: "Europe" },
  "630": { alpha2: "pr", region: "Americas" },
  "634": { alpha2: "qa", region: "Middle East" },
  "642": { alpha2: "ro", region: "Europe" },
  "643": { alpha2: "ru", region: "Europe" },
  "646": { alpha2: "rw", region: "Africa" },
  "682": { alpha2: "sa", region: "Middle East" },
  "686": { alpha2: "sn", region: "Africa" },
  "694": { alpha2: "sl", region: "Africa" },
  "706": { alpha2: "so", region: "Africa" },
  "710": { alpha2: "za", region: "Africa" },
  "724": { alpha2: "es", region: "Europe" },
  "729": { alpha2: "sd", region: "Africa" },
  "752": { alpha2: "se", region: "Europe" },
  "756": { alpha2: "ch", region: "Europe" },
  "760": { alpha2: "sy", region: "Middle East" },
  "764": { alpha2: "th", region: "Asia" },
  "788": { alpha2: "tn", region: "Africa" },
  "792": { alpha2: "tr", region: "Europe" },
  "800": { alpha2: "ug", region: "Africa" },
  "804": { alpha2: "ua", region: "Europe" },
  "784": { alpha2: "ae", region: "Middle East" },
  "826": { alpha2: "gb", region: "Europe" },
  "840": { alpha2: "us", region: "Americas" },
  "858": { alpha2: "uy", region: "Americas" },
  "860": { alpha2: "uz", region: "Asia" },
  "862": { alpha2: "ve", region: "Americas" },
  "704": { alpha2: "vn", region: "Asia" },
  "887": { alpha2: "ye", region: "Middle East" },
  "894": { alpha2: "zm", region: "Africa" },
  "716": { alpha2: "zw", region: "Africa" },
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
  // Deterministic pseudo-count based on ISO code characters
  const n = Number(isoNum);
  return ((n * 37 + 13) % 190) + 5;
}

function getRegion(isoNum: string): string {
  return ISO_MAP[isoNum]?.region ?? "Other";
}

function getAlpha2(isoNum: string): string {
  return ISO_MAP[isoNum]?.alpha2 ?? "";
}

interface GeoProps {
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
  mouseX: number;
  mouseY: number;
}

export function InteractiveWorldMap() {
  const [selectedCountries, setSelectedCountries] = useState<Set<string>>(
    new Set(),
  );
  const [hoveredCountry, setHoveredCountry] = useState<string | null>(null);
  const [litCountries, setLitCountries] = useState<
    { id: string; name: string; region: string }[]
  >([]);
  const [popup, setPopup] = useState<PopupInfo | null>(null);
  const [selectedFilter, setSelectedFilter] = useState<string>("All");
  // Keep a stable list of all known geo names for auto-glow
  const [allGeos, setAllGeos] = useState<
    { id: string; name: string; region: string }[]
  >([]);

  // Auto-light 2-3 countries every 1.2s
  useEffect(() => {
    if (allGeos.length === 0) return;
    const timer = setInterval(() => {
      const pool =
        selectedFilter === "All"
          ? allGeos
          : allGeos.filter((g) => g.region === selectedFilter);
      if (pool.length === 0) return;
      const count = 2 + Math.floor(Math.random() * 2); // 2 or 3
      const picks = [...pool].sort(() => Math.random() - 0.5).slice(0, count);
      setLitCountries(picks);
    }, 1200);
    return () => clearInterval(timer);
  }, [allGeos, selectedFilter]);

  const litSet = useMemo(
    () => new Set(litCountries.map((c) => c.id)),
    [litCountries],
  );

  const handleGeoClick = (geo: GeoProps, e: React.MouseEvent) => {
    const isoNum = String(geo.id).padStart(3, "0");
    const name = geo.properties.name ?? isoNum;
    const alpha2 = getAlpha2(isoNum);
    const region = getRegion(isoNum);
    const members = getMemberCount(isoNum);
    const rect = (e.currentTarget as SVGElement)
      .closest(".map-container")
      ?.getBoundingClientRect();
    const mouseX = rect ? ((e.clientX - rect.left) / rect.width) * 100 : 50;
    const mouseY = rect ? ((e.clientY - rect.top) / rect.height) * 100 : 50;
    setSelectedCountries((prev) => {
      const next = new Set(prev);
      if (next.has(isoNum)) next.delete(isoNum);
      else next.add(isoNum);
      return next;
    });
    setPopup({ name, isoNum, alpha2, region, members, mouseX, mouseY });
  };

  const topCountries = useMemo(() => {
    return Object.entries(ISO_MAP)
      .map(([isoNum, { alpha2, region }]) => ({
        isoNum,
        alpha2,
        region,
        members: getMemberCount(isoNum),
      }))
      .sort((a, b) => b.members - a.members)
      .slice(0, 5);
  }, []);

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
                boxShadow: isActive ? `0 0 8px ${color}50` : "none",
              }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full"
                style={{
                  background: color,
                  boxShadow: isActive ? `0 0 6px ${color}` : "none",
                  animation: isActive
                    ? "glow-pulse 1.5s ease-in-out infinite"
                    : "none",
                }}
              />
              {region} <span className="opacity-60">({cnt})</span>
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
            }}
          >
            ✕ Reset ({selectedCountries.size})
          </button>
        )}
      </div>

      {/* Map */}
      <div
        className="map-container relative w-full rounded-xl border border-border/30 bg-[oklch(0.08_0.012_240)] overflow-hidden"
        style={{
          boxShadow:
            "0 0 40px oklch(0.68 0.22 195 / 0.10), inset 0 0 60px oklch(0.05 0.01 240)",
          userSelect: "none",
          touchAction: "none",
        }}
        onClick={() => setPopup(null)}
        onKeyDown={(e) => e.key === "Escape" && setPopup(null)}
      >
        <style>{`
          @keyframes glow-pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
        `}</style>

        <ComposableMap
          projection="geoMercator"
          projectionConfig={{ scale: 120, center: [10, 15] }}
          style={{ width: "100%", height: "auto" }}
        >
          <Geographies geography={GEO_URL}>
            {({ geographies }) => {
              // Register geos once
              if (allGeos.length === 0 && geographies.length > 0) {
                const geoList = geographies
                  .map((geo) => {
                    const isoNum = String(geo.id).padStart(3, "0");
                    const region = getRegion(isoNum);
                    return {
                      id: isoNum,
                      name:
                        (geo.properties as { name?: string }).name ?? isoNum,
                      region,
                    };
                  })
                  .filter((g) => g.region !== "Other");
                // Use setTimeout to avoid setState during render
                setTimeout(() => setAllGeos(geoList), 0);
              }

              return geographies.map((geo) => {
                const isoNum = String(geo.id).padStart(3, "0");
                const region = getRegion(isoNum);
                if (region === "Other") return null;

                // Apply continent filter
                if (selectedFilter !== "All" && region !== selectedFilter) {
                  // Show dimmed but don't hide
                }

                const isFiltered =
                  selectedFilter !== "All" && region !== selectedFilter;
                const isSelected = selectedCountries.has(isoNum);
                const isLit = litSet.has(isoNum);
                const isHovered = hoveredCountry === isoNum;
                const baseColor = REGION_COLORS[region] ?? "#94a3b8";

                let fillColor: string;
                if (isFiltered) {
                  fillColor = "#1e293b40";
                } else if (isSelected) {
                  fillColor = baseColor;
                } else if (isLit) {
                  fillColor = `${baseColor}cc`;
                } else if (isHovered) {
                  fillColor = `${baseColor}90`;
                } else {
                  fillColor = `${baseColor}35`;
                }

                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    data-ocid="map.country.map_marker"
                    fill={fillColor}
                    stroke={isSelected || isLit ? baseColor : "#0f172a"}
                    strokeWidth={isSelected || isLit ? 0.8 : 0.3}
                    style={{
                      default: {
                        outline: "none",
                        filter: isLit
                          ? `drop-shadow(0 0 6px ${baseColor})`
                          : "none",
                        transition: "fill 0.4s, filter 0.4s",
                      },
                      hover: { outline: "none", cursor: "pointer" },
                      pressed: { outline: "none" },
                    }}
                    onClick={(e) =>
                      handleGeoClick(geo as unknown as GeoProps, e)
                    }
                    onMouseEnter={() => setHoveredCountry(isoNum)}
                    onMouseLeave={() => setHoveredCountry(null)}
                  />
                );
              });
            }}
          </Geographies>
        </ComposableMap>

        {/* Click popup */}
        {popup && (
          <div
            className="absolute z-20 pointer-events-none"
            style={{
              left: `${Math.min(popup.mouseX, 75)}%`,
              top: `${Math.max(popup.mouseY - 18, 4)}%`,
            }}
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => e.stopPropagation()}
          >
            <div className="bg-[oklch(0.14_0.02_240)] border border-border/50 rounded-xl px-3 py-2.5 shadow-xl min-w-[150px]">
              <div className="flex items-center gap-2 mb-1">
                {popup.alpha2 && (
                  <img
                    src={`https://flagcdn.com/24x18/${popup.alpha2}.png`}
                    alt=""
                    className="w-5 h-3.5 rounded-sm object-cover flex-shrink-0"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                  />
                )}
                <span className="text-xs font-bold text-foreground/90">
                  {popup.name}
                </span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span className="text-[9px] text-muted-foreground/50 uppercase">
                  {popup.region}
                </span>
                <span
                  className="text-[10px] font-bold"
                  style={{ color: REGION_COLORS[popup.region] ?? "#22d3ee" }}
                >
                  {popup.members} members
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

        {/* Hover tooltip */}
        {hoveredCountry &&
          !popup &&
          (() => {
            const geoEntry = allGeos.find((g) => g.id === hoveredCountry);
            if (!geoEntry) return null;
            const color = REGION_COLORS[geoEntry.region] ?? "#94a3b8";
            return (
              <div className="absolute bottom-3 left-3 pointer-events-none z-10">
                <div
                  className="px-2.5 py-1 rounded-lg text-xs font-semibold"
                  style={{
                    background: `${color}22`,
                    border: `1px solid ${color}50`,
                    color,
                    backdropFilter: "blur(4px)",
                  }}
                >
                  {geoEntry.name}
                </div>
              </div>
            );
          })()}
      </div>

      {/* LIVE indicator + auto-lit country indicator labels */}
      <div className="flex items-center gap-3 mt-3 flex-wrap">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[10px] text-muted-foreground/50 font-mono">
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

      {/* Top Countries leaderboard */}
      <div className="mt-4">
        <div className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest mb-2">
          Top Countries by Registrations
        </div>
        <div className="flex flex-col gap-1.5">
          {topCountries.map((c, i) => {
            const color = REGION_COLORS[c.region] ?? "#94a3b8";
            const medals = ["🥇", "🥈", "🥉", "4.", "5."];
            return (
              <div
                key={c.isoNum}
                data-ocid={`map.leaderboard.item.${i + 1}`}
                className="flex items-center gap-2.5 px-3 py-2 rounded-lg border"
                style={{ borderColor: `${color}25`, background: `${color}08` }}
              >
                <span className="text-xs w-5 text-center">{medals[i]}</span>
                <img
                  src={`https://flagcdn.com/24x18/${c.alpha2}.png`}
                  alt=""
                  className="w-5 h-3.5 rounded-sm object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
                <span className="text-xs font-semibold text-foreground/80 flex-1">
                  {c.alpha2.toUpperCase()}
                </span>
                <span className="text-[10px] font-bold" style={{ color }}>
                  {c.members.toLocaleString()} members
                </span>
              </div>
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
              style={{ borderColor: `${color}30`, background: `${color}10` }}
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
