import { useEffect, useMemo, useRef, useState } from "react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import { useLeaderboard } from "../../hooks/useQueries";

const GEO_URL =
  "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

const COUNTRY_META: Record<
  string,
  { name: string; alpha2: string; continent: string }
> = {
  "004": { name: "Afghanistan", alpha2: "AF", continent: "Asia" },
  "008": { name: "Albania", alpha2: "AL", continent: "Europe" },
  "012": { name: "Algeria", alpha2: "DZ", continent: "Africa" },
  "024": { name: "Angola", alpha2: "AO", continent: "Africa" },
  "032": { name: "Argentina", alpha2: "AR", continent: "Americas" },
  "036": { name: "Australia", alpha2: "AU", continent: "Oceania" },
  "040": { name: "Austria", alpha2: "AT", continent: "Europe" },
  "050": { name: "Bangladesh", alpha2: "BD", continent: "Asia" },
  "056": { name: "Belgium", alpha2: "BE", continent: "Europe" },
  "076": { name: "Brazil", alpha2: "BR", continent: "Americas" },
  "100": { name: "Bulgaria", alpha2: "BG", continent: "Europe" },
  "104": { name: "Myanmar", alpha2: "MM", continent: "Asia" },
  "116": { name: "Cambodia", alpha2: "KH", continent: "Asia" },
  "120": { name: "Cameroon", alpha2: "CM", continent: "Africa" },
  "124": { name: "Canada", alpha2: "CA", continent: "Americas" },
  "152": { name: "Chile", alpha2: "CL", continent: "Americas" },
  "156": { name: "China", alpha2: "CN", continent: "Asia" },
  "170": { name: "Colombia", alpha2: "CO", continent: "Americas" },
  "180": { name: "DR Congo", alpha2: "CD", continent: "Africa" },
  "188": { name: "Costa Rica", alpha2: "CR", continent: "Americas" },
  "192": { name: "Cuba", alpha2: "CU", continent: "Americas" },
  "203": { name: "Czech Republic", alpha2: "CZ", continent: "Europe" },
  "208": { name: "Denmark", alpha2: "DK", continent: "Europe" },
  "218": { name: "Ecuador", alpha2: "EC", continent: "Americas" },
  "818": { name: "Egypt", alpha2: "EG", continent: "Africa" },
  "231": { name: "Ethiopia", alpha2: "ET", continent: "Africa" },
  "246": { name: "Finland", alpha2: "FI", continent: "Europe" },
  "250": { name: "France", alpha2: "FR", continent: "Europe" },
  "276": { name: "Germany", alpha2: "DE", continent: "Europe" },
  "288": { name: "Ghana", alpha2: "GH", continent: "Africa" },
  "300": { name: "Greece", alpha2: "GR", continent: "Europe" },
  "320": { name: "Guatemala", alpha2: "GT", continent: "Americas" },
  "332": { name: "Haiti", alpha2: "HT", continent: "Americas" },
  "340": { name: "Honduras", alpha2: "HN", continent: "Americas" },
  "348": { name: "Hungary", alpha2: "HU", continent: "Europe" },
  "356": { name: "India", alpha2: "IN", continent: "Asia" },
  "360": { name: "Indonesia", alpha2: "ID", continent: "Asia" },
  "364": { name: "Iran", alpha2: "IR", continent: "Asia" },
  "368": { name: "Iraq", alpha2: "IQ", continent: "Asia" },
  "372": { name: "Ireland", alpha2: "IE", continent: "Europe" },
  "376": { name: "Israel", alpha2: "IL", continent: "Asia" },
  "380": { name: "Italy", alpha2: "IT", continent: "Europe" },
  "388": { name: "Jamaica", alpha2: "JM", continent: "Americas" },
  "392": { name: "Japan", alpha2: "JP", continent: "Asia" },
  "400": { name: "Jordan", alpha2: "JO", continent: "Asia" },
  "398": { name: "Kazakhstan", alpha2: "KZ", continent: "Asia" },
  "404": { name: "Kenya", alpha2: "KE", continent: "Africa" },
  "410": { name: "South Korea", alpha2: "KR", continent: "Asia" },
  "414": { name: "Kuwait", alpha2: "KW", continent: "Asia" },
  "422": { name: "Lebanon", alpha2: "LB", continent: "Asia" },
  "434": { name: "Libya", alpha2: "LY", continent: "Africa" },
  "484": { name: "Mexico", alpha2: "MX", continent: "Americas" },
  "496": { name: "Mongolia", alpha2: "MN", continent: "Asia" },
  "504": { name: "Morocco", alpha2: "MA", continent: "Africa" },
  "508": { name: "Mozambique", alpha2: "MZ", continent: "Africa" },
  "524": { name: "Nepal", alpha2: "NP", continent: "Asia" },
  "528": { name: "Netherlands", alpha2: "NL", continent: "Europe" },
  "554": { name: "New Zealand", alpha2: "NZ", continent: "Oceania" },
  "562": { name: "Niger", alpha2: "NE", continent: "Africa" },
  "566": { name: "Nigeria", alpha2: "NG", continent: "Africa" },
  "578": { name: "Norway", alpha2: "NO", continent: "Europe" },
  "586": { name: "Pakistan", alpha2: "PK", continent: "Asia" },
  "604": { name: "Peru", alpha2: "PE", continent: "Americas" },
  "608": { name: "Philippines", alpha2: "PH", continent: "Asia" },
  "616": { name: "Poland", alpha2: "PL", continent: "Europe" },
  "620": { name: "Portugal", alpha2: "PT", continent: "Europe" },
  "634": { name: "Qatar", alpha2: "QA", continent: "Asia" },
  "642": { name: "Romania", alpha2: "RO", continent: "Europe" },
  "643": { name: "Russia", alpha2: "RU", continent: "Europe" },
  "682": { name: "Saudi Arabia", alpha2: "SA", continent: "Asia" },
  "686": { name: "Senegal", alpha2: "SN", continent: "Africa" },
  "706": { name: "Somalia", alpha2: "SO", continent: "Africa" },
  "710": { name: "South Africa", alpha2: "ZA", continent: "Africa" },
  "724": { name: "Spain", alpha2: "ES", continent: "Europe" },
  "144": { name: "Sri Lanka", alpha2: "LK", continent: "Asia" },
  "729": { name: "Sudan", alpha2: "SD", continent: "Africa" },
  "752": { name: "Sweden", alpha2: "SE", continent: "Europe" },
  "756": { name: "Switzerland", alpha2: "CH", continent: "Europe" },
  "760": { name: "Syria", alpha2: "SY", continent: "Asia" },
  "158": { name: "Taiwan", alpha2: "TW", continent: "Asia" },
  "764": { name: "Thailand", alpha2: "TH", continent: "Asia" },
  "788": { name: "Tunisia", alpha2: "TN", continent: "Africa" },
  "792": { name: "Turkey", alpha2: "TR", continent: "Europe" },
  "800": { name: "Uganda", alpha2: "UG", continent: "Africa" },
  "804": { name: "Ukraine", alpha2: "UA", continent: "Europe" },
  "784": { name: "UAE", alpha2: "AE", continent: "Asia" },
  "826": { name: "United Kingdom", alpha2: "GB", continent: "Europe" },
  "840": { name: "United States", alpha2: "US", continent: "Americas" },
  "858": { name: "Uruguay", alpha2: "UY", continent: "Americas" },
  "860": { name: "Uzbekistan", alpha2: "UZ", continent: "Asia" },
  "862": { name: "Venezuela", alpha2: "VE", continent: "Americas" },
  "704": { name: "Vietnam", alpha2: "VN", continent: "Asia" },
  "887": { name: "Yemen", alpha2: "YE", continent: "Asia" },
  "894": { name: "Zambia", alpha2: "ZM", continent: "Africa" },
  "716": { name: "Zimbabwe", alpha2: "ZW", continent: "Africa" },
};

const CONTINENT_COLORS: Record<string, string> = {
  Americas: "#fb923c",
  Europe: "#818cf8",
  Asia: "#22d3ee",
  Africa: "#4ade80",
  Oceania: "#f472b6",
};

const CONTINENTS = ["All", "Americas", "Europe", "Asia", "Africa", "Oceania"];

const CONTINENT_COUNTRY_COUNT: Record<string, number> = {
  Americas: 35,
  Europe: 44,
  Asia: 48,
  Africa: 54,
  Oceania: 14,
};

function getFlag(alpha2: string) {
  return alpha2
    .toUpperCase()
    .replace(/./g, (c) => String.fromCodePoint(127397 + c.charCodeAt(0)));
}

export function AvailableWorldwideSection() {
  const [selectedCountries, setSelectedCountries] = useState<Set<string>>(
    new Set(),
  );
  const [hoveredCountry, setHoveredCountry] = useState<string | null>(null);
  const [activeContinent, setActiveContinent] = useState("All");
  const [glowingCountries, setGlowingCountries] = useState<string[]>([]);
  const [tooltip, setTooltip] = useState<{
    text: string;
    flag: string;
    count: number;
    x: number;
    y: number;
  } | null>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const { data: leaderboardData } = useLeaderboard();

  // 2-3 countries auto-glow every second
  useEffect(() => {
    const countryIds = Object.keys(COUNTRY_META);
    const interval = setInterval(() => {
      const count = 2 + Math.floor(Math.random() * 2);
      const picked: string[] = [];
      for (let i = 0; i < count; i++) {
        picked.push(countryIds[Math.floor(Math.random() * countryIds.length)]);
      }
      setGlowingCountries(picked);
    }, 1200);
    return () => clearInterval(interval);
  }, []);

  const registrationsByCountry = useMemo(() => {
    const map: Record<string, number> = {};
    if (leaderboardData) {
      for (const entry of leaderboardData) {
        const country = (entry as { country?: string }).country ?? "US";
        map[country] = (map[country] ?? 0) + 1;
      }
    }
    const seeds: Record<string, number> = {
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
    };
    for (const [k, v] of Object.entries(seeds)) map[k] = (map[k] ?? 0) + v;
    return map;
  }, [leaderboardData]);

  const topCountries = useMemo(() => {
    const alpha2Map: Record<string, string> = {};
    for (const [id, meta] of Object.entries(COUNTRY_META))
      alpha2Map[meta.alpha2] = id;
    return Object.entries(registrationsByCountry)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([alpha2, count]) => ({
        ...COUNTRY_META[alpha2Map[alpha2] ?? ""],
        alpha2,
        count,
      }));
  }, [registrationsByCountry]);

  const glowingMeta = glowingCountries
    .map((id) => COUNTRY_META[id])
    .filter(Boolean);

  const totalCountries =
    activeContinent === "All"
      ? Object.keys(COUNTRY_META).length
      : (CONTINENT_COUNTRY_COUNT[activeContinent] ?? 0);

  const getGeoFill = (geoId: string) => {
    const meta = COUNTRY_META[geoId];
    const continent = meta?.continent ?? "Asia";
    const contColor = CONTINENT_COLORS[continent] ?? "#818cf8";
    const isSelected = selectedCountries.has(geoId);
    const isHovered = hoveredCountry === geoId;
    const isGlowing = glowingCountries.includes(geoId);

    if (isSelected || isHovered) return contColor;
    if (isGlowing) return contColor;
    if (activeContinent !== "All" && continent !== activeContinent)
      return "#0f172a";
    return "#1e293b";
  };

  const getGeoOpacity = (geoId: string) => {
    const meta = COUNTRY_META[geoId];
    const continent = meta?.continent ?? "Asia";
    const isSelected = selectedCountries.has(geoId);
    const isHovered = hoveredCountry === geoId;
    const isGlowing = glowingCountries.includes(geoId);
    if (isSelected || isHovered) return 1;
    if (isGlowing) return 0.9;
    if (activeContinent !== "All" && continent !== activeContinent) return 0.2;
    return 0.6;
  };

  const handleGeoClick = (geoId: string) => {
    setSelectedCountries((prev) => {
      const next = new Set(prev);
      if (next.has(geoId)) next.delete(geoId);
      else next.add(geoId);
      return next;
    });
  };

  const handleMouseEnter = (
    geoId: string,
    evt: React.MouseEvent<SVGPathElement>,
  ) => {
    setHoveredCountry(geoId);
    const meta = COUNTRY_META[geoId];
    if (!meta) return;
    const rect = mapRef.current?.getBoundingClientRect();
    if (rect) {
      setTooltip({
        text: meta.name,
        flag: getFlag(meta.alpha2),
        count: registrationsByCountry[meta.alpha2] ?? 0,
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top,
      });
    }
  };

  const handleMouseMove = (
    geoId: string,
    evt: React.MouseEvent<SVGPathElement>,
  ) => {
    const meta = COUNTRY_META[geoId];
    if (!meta) return;
    const rect = mapRef.current?.getBoundingClientRect();
    if (rect) {
      setTooltip((prev) =>
        prev
          ? { ...prev, x: evt.clientX - rect.left, y: evt.clientY - rect.top }
          : null,
      );
    }
  };

  return (
    <section className="py-16 px-4 relative overflow-hidden">
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
                animation: "pulse 1.5s infinite",
              }}
            />
            <span className="text-xs text-muted-foreground">
              <span className="text-green-400 font-semibold">LIVE</span> ·{" "}
              {totalCountries} countries available
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
                ? Object.keys(COUNTRY_META).length
                : CONTINENT_COUNTRY_COUNT[c];
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
                    animation: active ? "pulse 1.5s infinite" : "none",
                  }}
                />
                {c}{" "}
                {c !== "All" && <span className="opacity-60">({count})</span>}
              </button>
            );
          })}
          {selectedCountries.size > 0 && (
            <button
              type="button"
              onClick={() => setSelectedCountries(new Set())}
              data-ocid="map.reset.button"
              className="px-3 py-1.5 rounded-full text-xs font-medium border border-red-500/40 text-red-400 hover:bg-red-500/10 transition-all"
            >
              Reset ({selectedCountries.size})
            </button>
          )}
        </div>

        {/* Map */}
        <div
          ref={mapRef}
          className="relative rounded-2xl overflow-hidden"
          style={{
            background: "oklch(0.07 0.015 240)",
            boxShadow:
              "0 0 0 2px rgba(6,182,212,0.15), 0 0 40px rgba(6,182,212,0.08)",
          }}
          onMouseLeave={() => {
            setHoveredCountry(null);
            setTooltip(null);
          }}
        >
          <style>{`
            @keyframes pulse {
              0%, 100% { opacity: 1; transform: scale(1); }
              50% { opacity: 0.6; transform: scale(0.85); }
            }
            @keyframes geoGlow {
              0%, 100% { opacity: 0.85; }
              50% { opacity: 1; }
            }
          `}</style>

          <ComposableMap
            projection="geoNaturalEarth1"
            projectionConfig={{ scale: 147 }}
            style={{ width: "100%", height: "auto" }}
            width={800}
            height={400}
          >
            <Geographies geography={GEO_URL}>
              {({ geographies }) =>
                geographies.map((geo) => {
                  const geoId = String(geo.id).padStart(3, "0");
                  const meta = COUNTRY_META[geoId];
                  const continent = meta?.continent ?? "";
                  const contColor = CONTINENT_COLORS[continent] ?? "#818cf8";
                  const isSelected = selectedCountries.has(geoId);
                  const isGlowing = glowingCountries.includes(geoId);
                  const fill = getGeoFill(geoId);
                  const opacity = getGeoOpacity(geoId);

                  return (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      onClick={() => handleGeoClick(geoId)}
                      onMouseEnter={(evt) => handleMouseEnter(geoId, evt)}
                      onMouseMove={(evt) => handleMouseMove(geoId, evt)}
                      onMouseLeave={() => setHoveredCountry(null)}
                      data-ocid="map.map_marker"
                      style={{
                        default: {
                          fill,
                          opacity,
                          stroke: "#0f172a",
                          strokeWidth: 0.4,
                          outline: "none",
                          cursor: meta ? "pointer" : "default",
                          filter:
                            isGlowing && meta
                              ? `drop-shadow(0 0 4px ${contColor})`
                              : isSelected
                                ? `drop-shadow(0 0 6px ${contColor})`
                                : "none",
                          transition: "fill 0.3s, opacity 0.3s",
                        },
                        hover: {
                          fill: meta ? contColor : "#1e293b",
                          opacity: meta ? 1 : 0.2,
                          stroke: "#0f172a",
                          strokeWidth: 0.4,
                          outline: "none",
                          cursor: meta ? "pointer" : "default",
                          filter: meta
                            ? `drop-shadow(0 0 6px ${contColor})`
                            : "none",
                        },
                        pressed: {
                          fill: meta ? contColor : "#1e293b",
                          opacity: 1,
                          stroke: "#0f172a",
                          strokeWidth: 0.4,
                          outline: "none",
                        },
                      }}
                    />
                  );
                })
              }
            </Geographies>
          </ComposableMap>

          {/* Hover tooltip */}
          {tooltip && (
            <div
              className="absolute pointer-events-none px-3 py-1.5 rounded-lg text-xs font-medium text-white z-20"
              style={{
                left: tooltip.x,
                top: tooltip.y - 60,
                transform: "translateX(-50%)",
                background: "rgba(6,18,42,0.95)",
                border: "1px solid rgba(6,182,212,0.4)",
                backdropFilter: "blur(4px)",
                whiteSpace: "nowrap",
              }}
            >
              <div className="flex items-center gap-1.5">
                <span>{tooltip.flag}</span>
                <span>{tooltip.text}</span>
                {tooltip.count > 0 && (
                  <span className="text-cyan-400 ml-1">
                    {tooltip.count.toLocaleString()} users
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Glowing countries indicator */}
        {glowingMeta.length > 0 && (
          <div className="flex flex-wrap justify-center gap-3 mt-4">
            {glowingMeta.map((meta, idx) => {
              const color = CONTINENT_COLORS[meta.continent] ?? "#22d3ee";
              return (
                <div
                  key={meta.alpha2 ?? idx}
                  className="flex items-center gap-2 px-3 py-1 rounded-full text-xs"
                  style={{
                    background: `${color}15`,
                    border: `1px solid ${color}40`,
                  }}
                >
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{
                      background: color,
                      boxShadow: `0 0 8px ${color}`,
                      animation: "pulse 1s infinite",
                    }}
                  />
                  <span className="text-white/80">{getFlag(meta.alpha2)}</span>
                  <span style={{ color }}>{meta.name}</span>
                </div>
              );
            })}
          </div>
        )}

        {/* Top Countries Leaderboard */}
        {topCountries.length > 0 && (
          <div className="mt-8">
            <h3 className="text-center text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
              Top Countries by Registrations
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {topCountries.slice(0, 10).map((c, idx) => {
                const color =
                  CONTINENT_COLORS[c?.continent ?? "Asia"] ?? "#22d3ee";
                return (
                  <div
                    key={c?.alpha2 ?? idx}
                    className="flex items-center gap-2 p-2 rounded-lg"
                    style={{
                      background: `${color}10`,
                      border: `1px solid ${color}30`,
                    }}
                  >
                    <span className="text-base">
                      {c?.alpha2 ? getFlag(c.alpha2) : ""}
                    </span>
                    <div className="min-w-0">
                      <div className="text-xs font-medium truncate">
                        {c?.name ?? ""}
                      </div>
                      <div className="text-[10px]" style={{ color }}>
                        {c.count.toLocaleString()} users
                      </div>
                    </div>
                    {idx < 3 && (
                      <span className="text-xs ml-auto">
                        {["🥇", "🥈", "🥉"][idx]}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
