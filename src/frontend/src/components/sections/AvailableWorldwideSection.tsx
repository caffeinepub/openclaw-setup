import { useEffect, useMemo, useRef, useState } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup,
} from "react-simple-maps";
import { useLeaderboard } from "../../hooks/useQueries";

const GEO_URL =
  "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

// Country name + ISO-3166-1 numeric -> alpha2 map (partial)
const COUNTRY_META: Record<
  string,
  { name: string; alpha2: string; continent: string }
> = {
  "840": { name: "United States", alpha2: "US", continent: "Americas" },
  "124": { name: "Canada", alpha2: "CA", continent: "Americas" },
  "484": { name: "Mexico", alpha2: "MX", continent: "Americas" },
  "076": { name: "Brazil", alpha2: "BR", continent: "Americas" },
  "032": { name: "Argentina", alpha2: "AR", continent: "Americas" },
  "152": { name: "Chile", alpha2: "CL", continent: "Americas" },
  "170": { name: "Colombia", alpha2: "CO", continent: "Americas" },
  "604": { name: "Peru", alpha2: "PE", continent: "Americas" },
  "858": { name: "Uruguay", alpha2: "UY", continent: "Americas" },
  "068": { name: "Bolivia", alpha2: "BO", continent: "Americas" },
  "218": { name: "Ecuador", alpha2: "EC", continent: "Americas" },
  "862": { name: "Venezuela", alpha2: "VE", continent: "Americas" },
  "320": { name: "Guatemala", alpha2: "GT", continent: "Americas" },
  "192": { name: "Cuba", alpha2: "CU", continent: "Americas" },
  "826": { name: "United Kingdom", alpha2: "GB", continent: "Europe" },
  "250": { name: "France", alpha2: "FR", continent: "Europe" },
  "276": { name: "Germany", alpha2: "DE", continent: "Europe" },
  "724": { name: "Spain", alpha2: "ES", continent: "Europe" },
  "380": { name: "Italy", alpha2: "IT", continent: "Europe" },
  "528": { name: "Netherlands", alpha2: "NL", continent: "Europe" },
  "056": { name: "Belgium", alpha2: "BE", continent: "Europe" },
  "040": { name: "Austria", alpha2: "AT", continent: "Europe" },
  "756": { name: "Switzerland", alpha2: "CH", continent: "Europe" },
  "752": { name: "Sweden", alpha2: "SE", continent: "Europe" },
  "578": { name: "Norway", alpha2: "NO", continent: "Europe" },
  "208": { name: "Denmark", alpha2: "DK", continent: "Europe" },
  "246": { name: "Finland", alpha2: "FI", continent: "Europe" },
  "616": { name: "Poland", alpha2: "PL", continent: "Europe" },
  "203": { name: "Czech Republic", alpha2: "CZ", continent: "Europe" },
  "348": { name: "Hungary", alpha2: "HU", continent: "Europe" },
  "620": { name: "Portugal", alpha2: "PT", continent: "Europe" },
  "300": { name: "Greece", alpha2: "GR", continent: "Europe" },
  "642": { name: "Romania", alpha2: "RO", continent: "Europe" },
  "100": { name: "Bulgaria", alpha2: "BG", continent: "Europe" },
  "191": { name: "Croatia", alpha2: "HR", continent: "Europe" },
  "688": { name: "Serbia", alpha2: "RS", continent: "Europe" },
  "804": { name: "Ukraine", alpha2: "UA", continent: "Europe" },
  "643": { name: "Russia", alpha2: "RU", continent: "Europe" },
  "792": { name: "Turkey", alpha2: "TR", continent: "Middle East" },
  "364": { name: "Iran", alpha2: "IR", continent: "Middle East" },
  "682": { name: "Saudi Arabia", alpha2: "SA", continent: "Middle East" },
  "784": { name: "UAE", alpha2: "AE", continent: "Middle East" },
  "368": { name: "Iraq", alpha2: "IQ", continent: "Middle East" },
  "400": { name: "Jordan", alpha2: "JO", continent: "Middle East" },
  "376": { name: "Israel", alpha2: "IL", continent: "Middle East" },
  "422": { name: "Lebanon", alpha2: "LB", continent: "Middle East" },
  "512": { name: "Oman", alpha2: "OM", continent: "Middle East" },
  "634": { name: "Qatar", alpha2: "QA", continent: "Middle East" },
  "887": { name: "Yemen", alpha2: "YE", continent: "Middle East" },
  "760": { name: "Syria", alpha2: "SY", continent: "Middle East" },
  "050": { name: "Bangladesh", alpha2: "BD", continent: "Asia" },
  "356": { name: "India", alpha2: "IN", continent: "Asia" },
  "586": { name: "Pakistan", alpha2: "PK", continent: "Asia" },
  "156": { name: "China", alpha2: "CN", continent: "Asia" },
  "392": { name: "Japan", alpha2: "JP", continent: "Asia" },
  "410": { name: "South Korea", alpha2: "KR", continent: "Asia" },
  "360": { name: "Indonesia", alpha2: "ID", continent: "Asia" },
  "458": { name: "Malaysia", alpha2: "MY", continent: "Asia" },
  "764": { name: "Thailand", alpha2: "TH", continent: "Asia" },
  "704": { name: "Vietnam", alpha2: "VN", continent: "Asia" },
  "608": { name: "Philippines", alpha2: "PH", continent: "Asia" },
  "702": { name: "Singapore", alpha2: "SG", continent: "Asia" },
  "144": { name: "Sri Lanka", alpha2: "LK", continent: "Asia" },
  "524": { name: "Nepal", alpha2: "NP", continent: "Asia" },
  "104": { name: "Myanmar", alpha2: "MM", continent: "Asia" },
  "116": { name: "Cambodia", alpha2: "KH", continent: "Asia" },
  "418": { name: "Laos", alpha2: "LA", continent: "Asia" },
  "496": { name: "Mongolia", alpha2: "MN", continent: "Asia" },
  "398": { name: "Kazakhstan", alpha2: "KZ", continent: "Asia" },
  "860": { name: "Uzbekistan", alpha2: "UZ", continent: "Asia" },
  "004": { name: "Afghanistan", alpha2: "AF", continent: "Asia" },
  "012": { name: "Algeria", alpha2: "DZ", continent: "Africa" },
  "818": { name: "Egypt", alpha2: "EG", continent: "Africa" },
  "504": { name: "Morocco", alpha2: "MA", continent: "Africa" },
  "788": { name: "Tunisia", alpha2: "TN", continent: "Africa" },
  "434": { name: "Libya", alpha2: "LY", continent: "Africa" },
  "706": { name: "Somalia", alpha2: "SO", continent: "Africa" },
  "231": { name: "Ethiopia", alpha2: "ET", continent: "Africa" },
  "404": { name: "Kenya", alpha2: "KE", continent: "Africa" },
  "800": { name: "Uganda", alpha2: "UG", continent: "Africa" },
  "834": { name: "Tanzania", alpha2: "TZ", continent: "Africa" },
  "710": { name: "South Africa", alpha2: "ZA", continent: "Africa" },
  "566": { name: "Nigeria", alpha2: "NG", continent: "Africa" },
  "288": { name: "Ghana", alpha2: "GH", continent: "Africa" },
  "384": { name: "Ivory Coast", alpha2: "CI", continent: "Africa" },
  "430": { name: "Liberia", alpha2: "LR", continent: "Africa" },
  "180": { name: "Dem. Rep. Congo", alpha2: "CD", continent: "Africa" },
  "024": { name: "Angola", alpha2: "AO", continent: "Africa" },
  "508": { name: "Mozambique", alpha2: "MZ", continent: "Africa" },
  "716": { name: "Zimbabwe", alpha2: "ZW", continent: "Africa" },
  "516": { name: "Namibia", alpha2: "NA", continent: "Africa" },
  "036": { name: "Australia", alpha2: "AU", continent: "Oceania" },
  "554": { name: "New Zealand", alpha2: "NZ", continent: "Oceania" },
  "598": { name: "Papua New Guinea", alpha2: "PG", continent: "Oceania" },
  "242": { name: "Fiji", alpha2: "FJ", continent: "Oceania" },
};

const CONTINENT_CONFIG: Array<{
  name: string;
  color: string;
  glowColor: string;
  label: string;
}> = [
  {
    name: "All",
    color: "#06b6d4",
    glowColor: "rgba(6,182,212,0.6)",
    label: "🌍 All",
  },
  {
    name: "Asia",
    color: "#f59e0b",
    glowColor: "rgba(245,158,11,0.6)",
    label: "🌏 Asia",
  },
  {
    name: "Europe",
    color: "#3b82f6",
    glowColor: "rgba(59,130,246,0.6)",
    label: "🌍 Europe",
  },
  {
    name: "Americas",
    color: "#22c55e",
    glowColor: "rgba(34,197,94,0.6)",
    label: "🌎 Americas",
  },
  {
    name: "Africa",
    color: "#f97316",
    glowColor: "rgba(249,115,22,0.6)",
    label: "🌍 Africa",
  },
  {
    name: "Oceania",
    color: "#a855f7",
    glowColor: "rgba(168,85,247,0.6)",
    label: "🌏 Oceania",
  },
  {
    name: "Middle East",
    color: "#ec4899",
    glowColor: "rgba(236,72,153,0.6)",
    label: "🕌 Middle East",
  },
];

const CONTINENT_COUNTRY_COUNTS: Record<string, number> = {
  Asia: 48,
  Europe: 44,
  Americas: 35,
  Africa: 54,
  Oceania: 14,
  "Middle East": 18,
};

function getCountryColor(
  numericId: string,
  selected: Set<string>,
  glowing: Set<string>,
  activeContinent: string,
) {
  const meta = COUNTRY_META[numericId];
  const continent = meta?.continent ?? "Other";
  if (selected.has(numericId)) return "#facc15";
  if (glowing.has(numericId)) {
    const cfg = CONTINENT_CONFIG.find((c) => c.name === continent);
    return cfg?.color ?? "#06b6d4";
  }
  if (activeContinent !== "All" && continent !== activeContinent)
    return "#1e293b";
  const cfg = CONTINENT_CONFIG.find((c) => c.name === continent);
  return cfg ? `${cfg.color}55` : "#1e3a5f";
}

interface CountryPopup {
  numericId: string;
  name: string;
  alpha2: string;
  continent: string;
  registrations: number;
}

export function AvailableWorldwideSection() {
  const [selectedCountries, setSelectedCountries] = useState<Set<string>>(
    new Set(),
  );
  const [glowingCountries, setGlowingCountries] = useState<Set<string>>(
    new Set(),
  );
  const [glowingMeta, setGlowingMeta] = useState<
    Array<{ id: string; name: string; continent: string }>
  >([]);
  const [activeContinent, setActiveContinent] = useState("All");
  const [tooltip, setTooltip] = useState<{
    x: number;
    y: number;
    name: string;
  } | null>(null);
  const [popup, setPopup] = useState<CountryPopup | null>(null);
  const [totalLive] = useState(195);
  const { data: leaderboardData } = useLeaderboard();
  const glowingRef = useRef<Set<string>>(new Set());
  const glowingMetaRef = useRef<
    Array<{ id: string; name: string; continent: string }>
  >([]);

  // Build registration map from leaderboard
  const registrationMap = useMemo(() => {
    const map: Record<string, number> = {};
    if (leaderboardData) {
      for (const m of leaderboardData) {
        const alpha2 = (m as { country?: string }).country ?? "";
        if (alpha2) {
          map[alpha2] = (map[alpha2] ?? 0) + 1;
        }
      }
    }
    // fallback demo data
    const demo: Record<string, number> = {
      US: 1420,
      ID: 980,
      IN: 870,
      BR: 650,
      DE: 540,
      GB: 510,
      JP: 480,
      KR: 430,
      FR: 390,
      AU: 310,
      CA: 290,
      MY: 260,
      SG: 240,
      PH: 220,
      NG: 190,
    };
    return { ...demo, ...map };
  }, [leaderboardData]);

  // Top countries for leaderboard display
  const topCountries = useMemo(() => {
    return Object.entries(registrationMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([alpha2, count]) => {
        const meta = Object.values(COUNTRY_META).find(
          (m) => m.alpha2 === alpha2,
        );
        return { alpha2, name: meta?.name ?? alpha2, count };
      });
  }, [registrationMap]);

  // Animate 2-3 random countries glowing every second
  useEffect(() => {
    const numericIds = Object.keys(COUNTRY_META);
    const interval = setInterval(() => {
      const count = 2 + Math.floor(Math.random() * 2);
      const chosen: string[] = [];
      const shuffled = [...numericIds].sort(() => Math.random() - 0.5);
      for (let i = 0; i < count && i < shuffled.length; i++) {
        chosen.push(shuffled[i]);
      }
      const meta = chosen.map((id) => ({
        id,
        name: COUNTRY_META[id]?.name ?? id,
        continent: COUNTRY_META[id]?.continent ?? "Other",
      }));
      const newSet = new Set(chosen);
      glowingRef.current = newSet;
      glowingMetaRef.current = meta;
      setGlowingCountries(newSet);
      setGlowingMeta(meta);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleCountryClick = (numericId: string) => {
    const meta = COUNTRY_META[numericId];
    if (!meta) return;
    const alpha2 = meta.alpha2;
    const regs = registrationMap[alpha2] ?? 0;
    setPopup({
      numericId,
      name: meta.name,
      alpha2,
      continent: meta.continent,
      registrations: regs,
    });
    setSelectedCountries((prev) => {
      const next = new Set(prev);
      if (next.has(numericId)) next.delete(numericId);
      else next.add(numericId);
      return next;
    });
  };

  const displayedCount =
    activeContinent === "All"
      ? totalLive
      : (CONTINENT_COUNTRY_COUNTS[activeContinent] ?? 0);

  const activeCfg = CONTINENT_CONFIG.find((c) => c.name === activeContinent)!;

  return (
    <section id="worldwide" className="relative py-16 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Title */}
        <div className="text-center mb-8">
          <h2
            className="text-3xl sm:text-4xl font-extrabold mb-2"
            style={{
              background: "linear-gradient(90deg, #06b6d4, #a855f7, #f59e0b)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            ClawPro Available Worldwide
          </h2>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            Click any country to see details. Hover to see the name.
          </p>
        </div>

        {/* Continent filter buttons */}
        <div className="flex flex-wrap justify-center gap-2 mb-6">
          {CONTINENT_CONFIG.map((cfg) => {
            const count =
              cfg.name === "All"
                ? totalLive
                : (CONTINENT_COUNTRY_COUNTS[cfg.name] ?? 0);
            const isActive = activeContinent === cfg.name;
            return (
              <button
                key={cfg.name}
                type="button"
                onClick={() => setActiveContinent(cfg.name)}
                className="relative flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all"
                style={{
                  background: isActive ? cfg.color : `${cfg.color}22`,
                  border: `1.5px solid ${cfg.color}`,
                  color: isActive ? "#fff" : cfg.color,
                  boxShadow: isActive ? `0 0 14px ${cfg.glowColor}` : "none",
                }}
                data-ocid="worldwide.continent.button"
              >
                {/* LED indicator */}
                <span
                  className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{
                    background: cfg.color,
                    boxShadow: isActive ? `0 0 8px ${cfg.glowColor}` : "none",
                    animation: isActive ? "pulse 1.2s infinite" : "none",
                  }}
                />
                {cfg.label}
                <span
                  className="ml-0.5 text-[10px] font-bold opacity-80"
                  style={{ color: isActive ? "#fff" : cfg.color }}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Map container */}
        <div
          className="relative rounded-2xl overflow-hidden"
          style={{
            background: "oklch(0.06 0.015 240)",
            border: `1.5px solid ${activeCfg.color}55`,
            boxShadow: `0 0 40px ${activeCfg.glowColor}40, inset 0 0 80px rgba(0,0,0,0.5)`,
            animation: "borderGlowRotate 3s linear infinite",
          }}
        >
          <ComposableMap
            projectionConfig={{ scale: 147 }}
            style={{ width: "100%", height: "auto" }}
          >
            <ZoomableGroup>
              <Geographies geography={GEO_URL}>
                {({ geographies }) =>
                  geographies.map((geo) => {
                    const numId = geo.id?.toString().padStart(3, "0") ?? "";
                    const isGlowing = glowingCountries.has(numId);
                    const isSelected = selectedCountries.has(numId);
                    const fill = getCountryColor(
                      numId,
                      selectedCountries,
                      glowingCountries,
                      activeContinent,
                    );
                    return (
                      <Geography
                        key={geo.rsmKey}
                        geography={geo}
                        fill={fill}
                        stroke="#0f172a"
                        strokeWidth={0.3}
                        style={{
                          default: {
                            outline: "none",
                            filter: isGlowing
                              ? `drop-shadow(0 0 6px ${fill})`
                              : "none",
                            transition: "fill 0.3s",
                          },
                          hover: {
                            outline: "none",
                            fill: isSelected ? "#facc15" : activeCfg.color,
                            filter: `drop-shadow(0 0 8px ${activeCfg.glowColor})`,
                            cursor: "pointer",
                          },
                          pressed: { outline: "none" },
                        }}
                        onMouseEnter={(e) => {
                          const meta = COUNTRY_META[numId];
                          if (meta) {
                            setTooltip({
                              x: e.clientX,
                              y: e.clientY,
                              name: meta.name,
                            });
                          }
                        }}
                        onMouseLeave={() => setTooltip(null)}
                        onClick={() => handleCountryClick(numId)}
                        data-ocid="worldwide.map_marker"
                      />
                    );
                  })
                }
              </Geographies>
            </ZoomableGroup>
          </ComposableMap>

          {/* Tooltip */}
          {tooltip && (
            <div
              className="fixed z-50 pointer-events-none px-2.5 py-1.5 rounded-lg text-xs font-semibold"
              style={{
                left: tooltip.x + 12,
                top: tooltip.y - 36,
                background: "oklch(0.12 0.03 250)",
                border: `1px solid ${activeCfg.color}`,
                color: activeCfg.color,
                boxShadow: `0 0 12px ${activeCfg.glowColor}`,
              }}
            >
              {tooltip.name}
            </div>
          )}
        </div>

        {/* Glowing country indicators */}
        <div className="mt-4 flex flex-wrap gap-2 justify-center">
          {glowingMeta.map((m) => {
            const cfg = CONTINENT_CONFIG.find((c) => c.name === m.continent);
            return (
              <div
                key={m.id}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium"
                style={{
                  background: `${cfg?.color ?? "#06b6d4"}18`,
                  border: `1px solid ${cfg?.color ?? "#06b6d4"}60`,
                  color: cfg?.color ?? "#06b6d4",
                }}
              >
                <span
                  className="w-1.5 h-1.5 rounded-full animate-pulse"
                  style={{
                    background: cfg?.color ?? "#06b6d4",
                    boxShadow: `0 0 8px ${cfg?.glowColor ?? "rgba(6,182,212,0.6)"}`,
                  }}
                />
                {m.name}
              </div>
            );
          })}
        </div>

        {/* LIVE indicator */}
        <div className="mt-4 flex items-center justify-center gap-3">
          <div className="flex items-center gap-1.5">
            <span
              className="w-2.5 h-2.5 rounded-full animate-pulse"
              style={{
                background: "#22c55e",
                boxShadow: "0 0 10px rgba(34,197,94,0.8)",
              }}
            />
            <span className="text-xs font-bold text-green-400 uppercase tracking-wider">
              LIVE
            </span>
          </div>
          <span className="text-xs text-muted-foreground">
            Available in{" "}
            <span className="font-bold" style={{ color: activeCfg.color }}>
              {displayedCount}
            </span>{" "}
            countries
          </span>
          {selectedCountries.size > 0 && (
            <>
              <span className="text-muted-foreground/40">·</span>
              <span className="text-xs text-yellow-400">
                {selectedCountries.size} selected
              </span>
              <button
                type="button"
                onClick={() => setSelectedCountries(new Set())}
                className="text-xs text-red-400 hover:text-red-300 underline"
                data-ocid="worldwide.reset.button"
              >
                Reset
              </button>
            </>
          )}
        </div>

        {/* Top Countries by Registrations */}
        <div className="mt-8">
          <h3 className="text-sm font-semibold text-center text-muted-foreground uppercase tracking-wider mb-4">
            Top Countries by Registrations
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {topCountries.map((c, i) => (
              <div
                key={c.alpha2}
                className="flex items-center gap-2 p-2.5 rounded-xl"
                style={{
                  background: "oklch(0.09 0.015 240)",
                  border: "1px solid rgba(255,255,255,0.06)",
                }}
              >
                <span className="text-base">#{i + 1}</span>
                <img
                  src={`https://flagcdn.com/24x18/${c.alpha2.toLowerCase()}.png`}
                  alt={c.name}
                  className="rounded"
                  width={24}
                  height={18}
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
                <div className="min-w-0">
                  <p className="text-xs font-semibold truncate">{c.name}</p>
                  <p className="text-[10px] text-cyan-400">
                    {c.count.toLocaleString()} users
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Country popup */}
        {popup && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{
              background: "rgba(0,0,0,0.6)",
              backdropFilter: "blur(6px)",
            }}
            onClick={() => setPopup(null)}
            onKeyDown={(e) => e.key === "Escape" && setPopup(null)}
          >
            <div
              className="rounded-2xl p-6 max-w-xs w-full"
              style={{
                background: "oklch(0.1 0.025 250)",
                border: `1.5px solid ${activeCfg.color}`,
                boxShadow: `0 0 40px ${activeCfg.glowColor}`,
              }}
              onClick={(e) => e.stopPropagation()}
              onKeyDown={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-3 mb-4">
                <img
                  src={`https://flagcdn.com/48x36/${popup.alpha2.toLowerCase()}.png`}
                  alt={popup.name}
                  className="rounded shadow-lg"
                  width={48}
                  height={36}
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
                <div>
                  <h3
                    className="text-lg font-bold"
                    style={{ color: activeCfg.color }}
                  >
                    {popup.name}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    {popup.continent}
                  </p>
                </div>
              </div>
              <div className="space-y-2">
                <div
                  className="flex items-center justify-between p-2 rounded-lg"
                  style={{ background: "rgba(255,255,255,0.05)" }}
                >
                  <span className="text-xs text-muted-foreground">
                    ClawPro Status
                  </span>
                  <span className="text-xs font-semibold text-green-400 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                    Available
                  </span>
                </div>
                <div
                  className="flex items-center justify-between p-2 rounded-lg"
                  style={{ background: "rgba(255,255,255,0.05)" }}
                >
                  <span className="text-xs text-muted-foreground">
                    Registered Users
                  </span>
                  <span className="text-xs font-bold text-cyan-300">
                    {popup.registrations.toLocaleString()}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setPopup(null)}
                className="mt-4 w-full py-2 rounded-lg text-sm font-semibold transition-all"
                style={{
                  background: `${activeCfg.color}22`,
                  border: `1px solid ${activeCfg.color}`,
                  color: activeCfg.color,
                }}
                data-ocid="worldwide.popup.close_button"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
