import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  Bell,
  BellOff,
  RefreshCw,
  TrendingDown,
  TrendingUp,
  X,
} from "lucide-react";
import { motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import { toast } from "sonner";

// ---- Types ----
interface CoinData {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  total_volume: number;
  price_change_percentage_24h: number;
  price_change_percentage_7d_in_currency?: number;
}

interface PriceAlertRule {
  id: string;
  coinId: string;
  coinName: string;
  symbol: string;
  threshold: number;
  direction: "above" | "below";
  triggered: boolean;
}

type SortKey = "rank" | "price" | "change24h" | "marketcap" | "volume";
type SortDir = "asc" | "desc";
type ChartMode = "marketcap" | "change24h";

// ---- Constants ----
const COIN_COLORS: Record<string, string> = {
  btc: "#F7931A",
  eth: "#627EEA",
  usdt: "#26A17B",
  bnb: "#F3BA2F",
  sol: "#9945FF",
  usdc: "#2775CA",
  xrp: "#00AAE4",
  doge: "#C2A633",
  ada: "#0033AD",
  avax: "#E84142",
  trx: "#FF0013",
  link: "#2A5ADA",
  dot: "#E6007A",
  matic: "#8247E5",
  icp: "#3B00B9",
};

const FALLBACK_COINS: CoinData[] = [
  {
    id: "bitcoin",
    symbol: "btc",
    name: "Bitcoin",
    image: "",
    current_price: 67420,
    market_cap: 1320000000000,
    market_cap_rank: 1,
    total_volume: 28000000000,
    price_change_percentage_24h: 2.34,
  },
  {
    id: "ethereum",
    symbol: "eth",
    name: "Ethereum",
    image: "",
    current_price: 3540,
    market_cap: 425000000000,
    market_cap_rank: 2,
    total_volume: 15000000000,
    price_change_percentage_24h: 1.87,
  },
  {
    id: "tether",
    symbol: "usdt",
    name: "Tether",
    image: "",
    current_price: 1.0,
    market_cap: 112000000000,
    market_cap_rank: 3,
    total_volume: 60000000000,
    price_change_percentage_24h: 0.02,
  },
  {
    id: "bnb",
    symbol: "bnb",
    name: "BNB",
    image: "",
    current_price: 582,
    market_cap: 84000000000,
    market_cap_rank: 4,
    total_volume: 1700000000,
    price_change_percentage_24h: -0.45,
  },
  {
    id: "solana",
    symbol: "sol",
    name: "Solana",
    image: "",
    current_price: 172,
    market_cap: 79000000000,
    market_cap_rank: 5,
    total_volume: 3200000000,
    price_change_percentage_24h: 3.21,
  },
  {
    id: "usdc",
    symbol: "usdc",
    name: "USD Coin",
    image: "",
    current_price: 1.0,
    market_cap: 41000000000,
    market_cap_rank: 6,
    total_volume: 7000000000,
    price_change_percentage_24h: 0.01,
  },
  {
    id: "xrp",
    symbol: "xrp",
    name: "XRP",
    image: "",
    current_price: 0.52,
    market_cap: 29000000000,
    market_cap_rank: 7,
    total_volume: 1400000000,
    price_change_percentage_24h: -1.12,
  },
  {
    id: "dogecoin",
    symbol: "doge",
    name: "Dogecoin",
    image: "",
    current_price: 0.165,
    market_cap: 23000000000,
    market_cap_rank: 8,
    total_volume: 1100000000,
    price_change_percentage_24h: 4.56,
  },
  {
    id: "cardano",
    symbol: "ada",
    name: "Cardano",
    image: "",
    current_price: 0.44,
    market_cap: 15000000000,
    market_cap_rank: 9,
    total_volume: 420000000,
    price_change_percentage_24h: -0.78,
  },
  {
    id: "avalanche-2",
    symbol: "avax",
    name: "Avalanche",
    image: "",
    current_price: 38.2,
    market_cap: 15600000000,
    market_cap_rank: 10,
    total_volume: 680000000,
    price_change_percentage_24h: 2.04,
  },
  {
    id: "tron",
    symbol: "trx",
    name: "TRON",
    image: "",
    current_price: 0.114,
    market_cap: 10000000000,
    market_cap_rank: 11,
    total_volume: 320000000,
    price_change_percentage_24h: 0.65,
  },
  {
    id: "chainlink",
    symbol: "link",
    name: "Chainlink",
    image: "",
    current_price: 18.7,
    market_cap: 10900000000,
    market_cap_rank: 12,
    total_volume: 680000000,
    price_change_percentage_24h: 1.33,
  },
  {
    id: "polkadot",
    symbol: "dot",
    name: "Polkadot",
    image: "",
    current_price: 7.82,
    market_cap: 10200000000,
    market_cap_rank: 13,
    total_volume: 380000000,
    price_change_percentage_24h: -0.92,
  },
  {
    id: "polygon",
    symbol: "matic",
    name: "Polygon",
    image: "",
    current_price: 0.875,
    market_cap: 8100000000,
    market_cap_rank: 14,
    total_volume: 310000000,
    price_change_percentage_24h: 1.67,
  },
  {
    id: "internet-computer",
    symbol: "icp",
    name: "Internet Computer",
    image: "",
    current_price: 12.4,
    market_cap: 5800000000,
    market_cap_rank: 15,
    total_volume: 145000000,
    price_change_percentage_24h: 5.23,
  },
];

// ---- Formatters ----
function formatPrice(price: number): string {
  if (price >= 1000)
    return `$${price.toLocaleString("en-US", { maximumFractionDigits: 0 })}`;
  if (price >= 1)
    return `$${price.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  return `$${price.toLocaleString("en-US", { minimumFractionDigits: 4, maximumFractionDigits: 4 })}`;
}

function formatLarge(val: number): string {
  if (val >= 1e12) return `$${(val / 1e12).toFixed(2)}T`;
  if (val >= 1e9) return `$${(val / 1e9).toFixed(1)}B`;
  if (val >= 1e6) return `$${(val / 1e6).toFixed(0)}M`;
  return `$${val.toLocaleString()}`;
}

// ---- CoinIcon ----
function CoinIcon({
  symbol,
  image,
  size = 28,
}: { symbol: string; image: string; size?: number }) {
  const [err, setErr] = useState(false);
  if (image && !err) {
    return (
      <img
        src={image}
        alt={symbol}
        style={{ width: size, height: size }}
        className="rounded-full object-cover flex-shrink-0"
        onError={() => setErr(true)}
      />
    );
  }
  const bg = COIN_COLORS[symbol.toLowerCase()] ?? "#4B5563";
  return (
    <div
      className="rounded-full flex items-center justify-center text-white font-black flex-shrink-0"
      style={{
        width: size,
        height: size,
        background: bg,
        fontSize: size * 0.32,
      }}
    >
      {symbol.toUpperCase().slice(0, 3)}
    </div>
  );
}

// ---- Main Component ----
export function CryptoMarketPage({ onClose }: { onClose: () => void }) {
  const [coins, setCoins] = useState<CoinData[]>(FALLBACK_COINS);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [sortKey, setSortKey] = useState<SortKey>("rank");
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const [chartMode, setChartMode] = useState<ChartMode>("marketcap");
  const [activeTab, setActiveTab] = useState<
    "market" | "charts" | "alerts" | "swap"
  >("market");

  // Alerts
  const [alerts, setAlerts] = useState<PriceAlertRule[]>(() => {
    try {
      return JSON.parse(localStorage.getItem("clawpro_price_alerts") ?? "[]");
    } catch {
      return [];
    }
  });
  const [alertCoin, setAlertCoin] = useState("");
  const [alertPrice, setAlertPrice] = useState("");
  const [alertDir, setAlertDir] = useState<"above" | "below">("above");

  // Swap
  const [swapFrom, setSwapFrom] = useState("bitcoin");
  const [swapTo, setSwapTo] = useState("ethereum");
  const [swapAmount, setSwapAmount] = useState("1");
  const [swapResult, setSwapResult] = useState<number | null>(null);
  const [swapConfirm, setSwapConfirm] = useState(false);

  const coinsRef = useRef<CoinData[]>(FALLBACK_COINS);
  const alertsRef = useRef<PriceAlertRule[]>(alerts);

  useEffect(() => {
    alertsRef.current = alerts;
  }, [alerts]);
  useEffect(() => {
    localStorage.setItem("clawpro_price_alerts", JSON.stringify(alerts));
  }, [alerts]);

  const fetchCoins = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    try {
      const res = await fetch(
        "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=15&page=1&sparkline=false&price_change_percentage=24h%2C7d",
      );
      if (!res.ok) throw new Error("API error");
      const data = (await res.json()) as CoinData[];

      // Check alerts
      const currentAlerts = alertsRef.current;
      const updatedAlerts = currentAlerts.map((alert) => {
        const coin = data.find((c) => c.id === alert.coinId);
        if (!coin || alert.triggered) return alert;
        const triggered =
          alert.direction === "above"
            ? coin.current_price >= alert.threshold
            : coin.current_price <= alert.threshold;
        if (triggered) {
          toast(`🔔 ${coin.name} is ${alert.direction} $${alert.threshold}!`, {
            description: `Current price: ${formatPrice(coin.current_price)}`,
            className:
              alert.direction === "above"
                ? "border-emerald-500"
                : "border-rose-500",
          });
        }
        return triggered ? { ...alert, triggered: true } : alert;
      });
      setAlerts(updatedAlerts);

      coinsRef.current = data;
      setCoins(data);
      setLastUpdated(new Date());
    } catch {
      if (coinsRef.current.length === 0) {
        setCoins(FALLBACK_COINS);
        coinsRef.current = FALLBACK_COINS;
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchCoins(false);
  }, [fetchCoins]);
  useEffect(() => {
    const id = setInterval(() => fetchCoins(true), 60000);
    return () => clearInterval(id);
  }, [fetchCoins]);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  // ---- Sort logic ----
  const sortedCoins = [...coins].sort((a, b) => {
    let va = 0;
    let vb = 0;
    if (sortKey === "rank") {
      va = a.market_cap_rank;
      vb = b.market_cap_rank;
    } else if (sortKey === "price") {
      va = a.current_price;
      vb = b.current_price;
    } else if (sortKey === "change24h") {
      va = a.price_change_percentage_24h;
      vb = b.price_change_percentage_24h;
    } else if (sortKey === "marketcap") {
      va = a.market_cap;
      vb = b.market_cap;
    } else if (sortKey === "volume") {
      va = a.total_volume;
      vb = b.total_volume;
    }
    return sortDir === "asc" ? va - vb : vb - va;
  });

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  const SortIcon = ({ k }: { k: SortKey }) => {
    if (sortKey !== k) return <ArrowUpDown className="w-3 h-3 opacity-40" />;
    return sortDir === "asc" ? (
      <ArrowUp className="w-3 h-3 text-cyan-400" />
    ) : (
      <ArrowDown className="w-3 h-3 text-cyan-400" />
    );
  };

  // ---- Chart data ----
  const chartData = coins.map((c) => ({
    name: c.symbol.toUpperCase(),
    value:
      chartMode === "marketcap"
        ? c.market_cap / 1e9
        : c.price_change_percentage_24h,
    color: COIN_COLORS[c.symbol.toLowerCase()] ?? "#4B5563",
    positive: c.price_change_percentage_24h >= 0,
  }));

  // ---- Add alert ----
  const addAlert = () => {
    const coin = coins.find((c) => c.id === alertCoin);
    if (!coin || !alertPrice) return;
    const newAlert: PriceAlertRule = {
      id: `${alertCoin}-${Date.now()}`,
      coinId: alertCoin,
      coinName: coin.name,
      symbol: coin.symbol.toUpperCase(),
      threshold: Number.parseFloat(alertPrice),
      direction: alertDir,
      triggered: false,
    };
    setAlerts((prev) => [newAlert, ...prev].slice(0, 10));
    setAlertCoin("");
    setAlertPrice("");
    toast.success(
      `Alert set: ${coin.name} ${alertDir} ${formatPrice(Number.parseFloat(alertPrice))}`,
    );
  };

  const removeAlert = (id: string) =>
    setAlerts((prev) => prev.filter((a) => a.id !== id));

  // ---- Swap calculation ----
  const calcSwap = () => {
    const fromCoin = coins.find((c) => c.id === swapFrom);
    const toCoin = coins.find((c) => c.id === swapTo);
    if (!fromCoin || !toCoin || !swapAmount) return;
    const fromUSD = fromCoin.current_price * Number.parseFloat(swapAmount);
    const toAmount = fromUSD / toCoin.current_price;
    setSwapResult(toAmount);
    setSwapConfirm(true);
  };

  // ---- Ticker for top bar ----
  const loopCoins = [...coins, ...coins];

  const TABS = [
    { id: "market" as const, label: "Live Market", icon: "📊" },
    { id: "charts" as const, label: "Charts", icon: "📈" },
    { id: "alerts" as const, label: "Alerts", icon: "🔔" },
    { id: "swap" as const, label: "Swap", icon: "🔄" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[oklch(0.06_0.012_240)] text-foreground overflow-hidden">
      {/* Dot pattern overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage:
            "radial-gradient(circle, oklch(0.7 0.15 200 / 0.5) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />

      {/* Glow accents */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[200px] bg-emerald-500/5 blur-[80px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[200px] bg-cyan-500/5 blur-[80px] pointer-events-none" />

      {/* Header */}
      <div className="relative z-10 flex items-center justify-between px-6 py-4 border-b border-white/8 bg-black/20 backdrop-blur-sm flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center">
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <div>
            <h1
              className="text-lg font-black leading-none"
              style={{
                background:
                  "linear-gradient(90deg, #00c6ff 0%, #10b981 40%, #a78bfa 80%, #00c6ff 100%)",
                backgroundSize: "200% auto",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                animation: "navLogoShimmer 3s linear infinite",
              }}
            >
              Live Crypto Markets
            </h1>
            <p className="text-[11px] text-muted-foreground/60">
              {loading
                ? "Loading..."
                : `Top 15 by Market Cap${lastUpdated ? ` · ${lastUpdated.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}` : ""}`}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => fetchCoins(true)}
            disabled={refreshing}
            className="text-muted-foreground hover:text-emerald-400 h-8"
            data-ocid="crypto.refresh.button"
          >
            <RefreshCw
              className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`}
            />
          </Button>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-white/8 transition-colors"
            aria-label="Close"
            data-ocid="crypto.close.button"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Live Ticker Strip */}
      <div
        className="relative z-10 bg-black/30 border-b border-white/5 overflow-hidden flex-shrink-0"
        style={{
          maskImage:
            "linear-gradient(90deg, transparent, black 3%, black 97%, transparent)",
          WebkitMaskImage:
            "linear-gradient(90deg, transparent, black 3%, black 97%, transparent)",
        }}
      >
        <div
          className="flex gap-0 w-max marquee-left"
          style={{ animationDuration: `${coins.length * 3}s` }}
        >
          {loopCoins.map((coin, i) => {
            const pos = coin.price_change_percentage_24h >= 0;
            return (
              <div
                key={`${coin.id}-${i}`}
                className="flex items-center gap-2 px-4 py-2 border-r border-white/5 shrink-0"
              >
                <CoinIcon symbol={coin.symbol} image={coin.image} size={18} />
                <span className="text-[11px] font-bold text-foreground/80 uppercase font-mono">
                  {coin.symbol}
                </span>
                <span className="text-[11px] font-mono text-foreground/70">
                  {formatPrice(coin.current_price)}
                </span>
                <span
                  className={`text-[10px] font-bold ${
                    pos ? "text-emerald-400" : "text-rose-400"
                  }`}
                >
                  {pos ? "+" : ""}
                  {coin.price_change_percentage_24h.toFixed(2)}%
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Tab nav */}
      <div className="relative z-10 flex items-center gap-1 px-6 pt-4 pb-0 flex-shrink-0">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            data-ocid={`crypto.${tab.id}.tab`}
            onClick={() => setActiveTab(tab.id)}
            className={[
              "flex items-center gap-1.5 px-4 py-2 rounded-t-lg text-sm font-medium transition-all border-b-2",
              activeTab === tab.id
                ? "bg-white/8 text-emerald-400 border-emerald-500"
                : "text-muted-foreground hover:text-foreground border-transparent hover:bg-white/5",
            ].join(" ")}
          >
            <span>{tab.icon}</span>
            <span>{tab.label}</span>
            {tab.id === "alerts" &&
              alerts.filter((a) => !a.triggered).length > 0 && (
                <span className="w-4 h-4 rounded-full bg-amber-500 text-[9px] text-white flex items-center justify-center">
                  {alerts.filter((a) => !a.triggered).length}
                </span>
              )}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="relative z-10 flex-1 overflow-auto">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.18 }}
          className="h-full"
        >
          {activeTab === "market" && (
            <MarketTab
              coins={sortedCoins}
              loading={loading}
              sortKey={sortKey}
              sortDir={sortDir}
              toggleSort={toggleSort}
              SortIcon={SortIcon}
            />
          )}
          {activeTab === "charts" && (
            <ChartsTab
              coins={coins}
              chartData={chartData}
              chartMode={chartMode}
              setChartMode={setChartMode}
            />
          )}
          {activeTab === "alerts" && (
            <AlertsTab
              coins={coins}
              alerts={alerts}
              alertCoin={alertCoin}
              setAlertCoin={setAlertCoin}
              alertPrice={alertPrice}
              setAlertPrice={setAlertPrice}
              alertDir={alertDir}
              setAlertDir={setAlertDir}
              addAlert={addAlert}
              removeAlert={removeAlert}
            />
          )}
          {activeTab === "swap" && (
            <SwapTab
              coins={coins}
              swapFrom={swapFrom}
              setSwapFrom={setSwapFrom}
              swapTo={swapTo}
              setSwapTo={setSwapTo}
              swapAmount={swapAmount}
              setSwapAmount={setSwapAmount}
              swapResult={swapResult}
              swapConfirm={swapConfirm}
              setSwapConfirm={setSwapConfirm}
              calcSwap={calcSwap}
            />
          )}
        </motion.div>
      </div>
    </div>
  );
}

// ---- Market Tab ----
function MarketTab({
  coins,
  loading,
  sortKey,
  sortDir,
  toggleSort,
  SortIcon,
}: {
  coins: CoinData[];
  loading: boolean;
  sortKey: SortKey;
  sortDir: SortDir;
  toggleSort: (k: SortKey) => void;
  SortIcon: ({ k }: { k: SortKey }) => React.ReactElement;
}) {
  void sortDir;
  void sortKey;
  return (
    <div className="p-6">
      <Table>
        <TableHeader>
          <TableRow className="border-white/8 hover:bg-transparent">
            <TableHead className="w-12 text-muted-foreground/50 text-xs">
              <button
                type="button"
                onClick={() => toggleSort("rank")}
                className="flex items-center gap-1 hover:text-foreground"
              >
                # <SortIcon k="rank" />
              </button>
            </TableHead>
            <TableHead className="text-muted-foreground/50 text-xs">
              Coin
            </TableHead>
            <TableHead className="text-right text-muted-foreground/50 text-xs">
              <button
                type="button"
                onClick={() => toggleSort("price")}
                className="flex items-center gap-1 ml-auto hover:text-foreground"
              >
                Price <SortIcon k="price" />
              </button>
            </TableHead>
            <TableHead className="text-right text-muted-foreground/50 text-xs">
              <button
                type="button"
                onClick={() => toggleSort("change24h")}
                className="flex items-center gap-1 ml-auto hover:text-foreground"
              >
                24h% <SortIcon k="change24h" />
              </button>
            </TableHead>
            <TableHead className="text-right text-muted-foreground/50 text-xs hidden md:table-cell">
              <button
                type="button"
                onClick={() => toggleSort("marketcap")}
                className="flex items-center gap-1 ml-auto hover:text-foreground"
              >
                Market Cap <SortIcon k="marketcap" />
              </button>
            </TableHead>
            <TableHead className="text-right text-muted-foreground/50 text-xs hidden lg:table-cell">
              <button
                type="button"
                onClick={() => toggleSort("volume")}
                className="flex items-center gap-1 ml-auto hover:text-foreground"
              >
                Volume 24h <SortIcon k="volume" />
              </button>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading
            ? [
                "s1",
                "s2",
                "s3",
                "s4",
                "s5",
                "s6",
                "s7",
                "s8",
                "s9",
                "s10",
                "s11",
                "s12",
                "s13",
                "s14",
                "s15",
              ].map((sk) => (
                <TableRow key={sk} className="border-white/5">
                  <TableCell colSpan={6}>
                    <div
                      data-ocid="crypto.market.loading_state"
                      className="h-10 rounded-lg bg-white/5 animate-pulse"
                    />
                  </TableCell>
                </TableRow>
              ))
            : coins.map((coin, idx) => {
                const pos = coin.price_change_percentage_24h >= 0;
                return (
                  <TableRow
                    key={coin.id}
                    data-ocid={`crypto.coin.item.${idx + 1}`}
                    className="border-white/5 hover:bg-white/3 transition-colors"
                  >
                    <TableCell className="text-muted-foreground/40 text-xs font-mono w-12">
                      {coin.market_cap_rank}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2.5">
                        <CoinIcon
                          symbol={coin.symbol}
                          image={coin.image}
                          size={28}
                        />
                        <div>
                          <p className="text-sm font-semibold text-foreground/90">
                            {coin.name}
                          </p>
                          <p className="text-xs text-muted-foreground/50 font-mono uppercase">
                            {coin.symbol}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <span className="text-sm font-mono font-semibold text-foreground/85">
                        {formatPrice(coin.current_price)}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <span
                        className={`inline-flex items-center gap-0.5 text-xs font-bold px-2 py-0.5 rounded-full ${
                          pos
                            ? "bg-emerald-500/10 text-emerald-400"
                            : "bg-rose-500/10 text-rose-400"
                        }`}
                      >
                        {pos ? (
                          <TrendingUp className="w-3 h-3" />
                        ) : (
                          <TrendingDown className="w-3 h-3" />
                        )}
                        {pos ? "+" : ""}
                        {coin.price_change_percentage_24h.toFixed(2)}%
                      </span>
                    </TableCell>
                    <TableCell className="text-right text-xs text-muted-foreground/60 font-mono hidden md:table-cell">
                      {formatLarge(coin.market_cap)}
                    </TableCell>
                    <TableCell className="text-right text-xs text-muted-foreground/60 font-mono hidden lg:table-cell">
                      {formatLarge(coin.total_volume)}
                    </TableCell>
                  </TableRow>
                );
              })}
        </TableBody>
      </Table>
    </div>
  );
}

// ---- Charts Tab ----
function ChartsTab({
  coins,
  chartData,
  chartMode,
  setChartMode,
}: {
  coins: CoinData[];
  chartData: {
    name: string;
    value: number;
    color: string;
    positive: boolean;
  }[];
  chartMode: ChartMode;
  setChartMode: (m: ChartMode) => void;
}) {
  void coins;
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-2">
        <button
          type="button"
          data-ocid="crypto.chart_marketcap.toggle"
          onClick={() => setChartMode("marketcap")}
          className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
            chartMode === "marketcap"
              ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
              : "text-muted-foreground hover:text-foreground hover:bg-white/5"
          }`}
        >
          Market Cap
        </button>
        <button
          type="button"
          data-ocid="crypto.chart_change.toggle"
          onClick={() => setChartMode("change24h")}
          className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
            chartMode === "change24h"
              ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/40"
              : "text-muted-foreground hover:text-foreground hover:bg-white/5"
          }`}
        >
          24h Change %
        </button>
      </div>

      <div className="rounded-xl border border-white/8 bg-black/20 p-4">
        <h3 className="text-sm font-semibold mb-4 text-muted-foreground">
          {chartMode === "marketcap"
            ? "Market Cap (Billions USD)"
            : "24h Price Change (%)"}
        </h3>
        <ResponsiveContainer width="100%" height={360}>
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{ top: 0, right: 16, left: 8, bottom: 0 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              horizontal={false}
              stroke="rgba(255,255,255,0.05)"
            />
            <XAxis
              type="number"
              tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 10 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              type="category"
              dataKey="name"
              tick={{
                fill: "rgba(255,255,255,0.6)",
                fontSize: 11,
                fontWeight: 700,
              }}
              axisLine={false}
              tickLine={false}
              width={44}
            />
            <RechartsTooltip
              contentStyle={{
                background: "oklch(0.1 0.015 240)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: 8,
                fontSize: 12,
              }}
              formatter={(value: number) =>
                chartMode === "marketcap"
                  ? [`$${value.toFixed(1)}B`, "Market Cap"]
                  : [`${value.toFixed(2)}%`, "24h Change"]
              }
            />
            <Bar dataKey="value" radius={[0, 4, 4, 0]}>
              {chartData.map((entry) => (
                <Cell
                  key={entry.name}
                  fill={
                    chartMode === "change24h"
                      ? entry.positive
                        ? "#10b981"
                        : "#f43f5e"
                      : entry.color
                  }
                  fillOpacity={0.85}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

// ---- Alerts Tab ----
function AlertsTab({
  coins,
  alerts,
  alertCoin,
  setAlertCoin,
  alertPrice,
  setAlertPrice,
  alertDir,
  setAlertDir,
  addAlert,
  removeAlert,
}: {
  coins: CoinData[];
  alerts: PriceAlertRule[];
  alertCoin: string;
  setAlertCoin: (v: string) => void;
  alertPrice: string;
  setAlertPrice: (v: string) => void;
  alertDir: "above" | "below";
  setAlertDir: (v: "above" | "below") => void;
  addAlert: () => void;
  removeAlert: (id: string) => void;
}) {
  return (
    <div className="p-6 space-y-6">
      {/* Add Alert Form */}
      <div className="rounded-xl border border-white/8 bg-black/20 p-5">
        <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
          <Bell className="w-4 h-4 text-amber-400" />
          Create Price Alert
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Coin</Label>
            <Select value={alertCoin} onValueChange={setAlertCoin}>
              <SelectTrigger
                data-ocid="crypto.alert_coin.select"
                className="bg-black/30 border-white/10"
              >
                <SelectValue placeholder="Select coin..." />
              </SelectTrigger>
              <SelectContent>
                {coins.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.name} ({c.symbol.toUpperCase()})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Direction</Label>
            <Select
              value={alertDir}
              onValueChange={(v) => setAlertDir(v as "above" | "below")}
            >
              <SelectTrigger
                data-ocid="crypto.alert_dir.select"
                className="bg-black/30 border-white/10"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="above">Price goes above</SelectItem>
                <SelectItem value="below">Price goes below</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">
              Threshold (USD)
            </Label>
            <Input
              type="number"
              placeholder="e.g. 50000"
              value={alertPrice}
              onChange={(e) => setAlertPrice(e.target.value)}
              className="bg-black/30 border-white/10"
              data-ocid="crypto.alert_price.input"
            />
          </div>
        </div>
        <Button
          onClick={addAlert}
          disabled={!alertCoin || !alertPrice}
          className="mt-4 bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 border border-amber-500/30"
          data-ocid="crypto.add_alert.button"
        >
          <Bell className="w-4 h-4 mr-2" />
          Set Alert
        </Button>
      </div>

      {/* Alert List */}
      <div>
        <h3 className="text-sm font-semibold mb-3 text-muted-foreground">
          Active Alerts ({alerts.length})
        </h3>
        {alerts.length === 0 ? (
          <div
            data-ocid="crypto.alerts.empty_state"
            className="flex flex-col items-center justify-center py-12 gap-3 rounded-xl border border-white/5 bg-black/10"
          >
            <BellOff className="w-8 h-8 text-muted-foreground/30" />
            <p className="text-sm text-muted-foreground/50">
              No alerts set yet
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {alerts.map((alert, i) => (
              <div
                key={alert.id}
                data-ocid={`crypto.alert.item.${i + 1}`}
                className={[
                  "flex items-center gap-3 p-3.5 rounded-xl border transition-colors",
                  alert.triggered
                    ? "bg-emerald-500/5 border-emerald-500/20"
                    : "bg-black/20 border-white/8 hover:border-amber-500/20",
                ].join(" ")}
              >
                <Bell
                  className={`w-4 h-4 flex-shrink-0 ${alert.triggered ? "text-emerald-400" : "text-amber-400"}`}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">
                    {alert.coinName}{" "}
                    <span
                      className={
                        alert.direction === "above"
                          ? "text-emerald-400"
                          : "text-rose-400"
                      }
                    >
                      {alert.direction === "above" ? "above" : "below"}
                    </span>{" "}
                    {formatPrice(alert.threshold)}
                  </p>
                  {alert.triggered && (
                    <p className="text-xs text-emerald-400">✓ Triggered</p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => removeAlert(alert.id)}
                  className="p-1.5 rounded text-muted-foreground hover:text-rose-400 hover:bg-rose-500/10 transition-colors flex-shrink-0"
                  data-ocid={`crypto.alert.delete_button.${i + 1}`}
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ---- Swap Tab ----
function SwapTab({
  coins,
  swapFrom,
  setSwapFrom,
  swapTo,
  setSwapTo,
  swapAmount,
  setSwapAmount,
  swapResult,
  swapConfirm,
  setSwapConfirm,
  calcSwap,
}: {
  coins: CoinData[];
  swapFrom: string;
  setSwapFrom: (v: string) => void;
  swapTo: string;
  setSwapTo: (v: string) => void;
  swapAmount: string;
  setSwapAmount: (v: string) => void;
  swapResult: number | null;
  swapConfirm: boolean;
  setSwapConfirm: (v: boolean) => void;
  calcSwap: () => void;
}) {
  const fromCoin = coins.find((c) => c.id === swapFrom);
  const toCoin = coins.find((c) => c.id === swapTo);

  return (
    <div className="p-6 flex justify-center">
      <div className="w-full max-w-md space-y-4">
        <div className="text-center mb-2">
          <h2 className="text-lg font-bold">Crypto Swap</h2>
          <p className="text-xs text-muted-foreground/60">
            Real-time exchange rates via CoinGecko
          </p>
        </div>

        {/* From */}
        <div className="rounded-xl border border-white/10 bg-black/30 p-4 space-y-2">
          <Label className="text-xs text-muted-foreground">From</Label>
          <div className="flex items-center gap-3">
            <Select
              value={swapFrom}
              onValueChange={(v) => {
                setSwapFrom(v);
                setSwapConfirm(false);
                setSwapAmount("1");
              }}
            >
              <SelectTrigger
                className="flex-1 bg-transparent border-white/8"
                data-ocid="crypto.swap_from.select"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {coins.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.symbol.toUpperCase()} — {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              type="number"
              value={swapAmount}
              onChange={(e) => {
                setSwapAmount(e.target.value);
                setSwapConfirm(false);
              }}
              className="w-28 bg-transparent border-white/8 text-right font-mono"
              min="0"
              data-ocid="crypto.swap_amount.input"
            />
          </div>
          {fromCoin && (
            <p className="text-xs text-muted-foreground/50">
              ≈{" "}
              {formatPrice(
                fromCoin.current_price * Number.parseFloat(swapAmount || "0"),
              )}
            </p>
          )}
        </div>

        {/* Arrow */}
        <div className="flex justify-center">
          <div className="w-8 h-8 rounded-full bg-white/5 border border-white/8 flex items-center justify-center text-muted-foreground">
            ↕
          </div>
        </div>

        {/* To */}
        <div className="rounded-xl border border-white/10 bg-black/30 p-4 space-y-2">
          <Label className="text-xs text-muted-foreground">To</Label>
          <div className="flex items-center gap-3">
            <Select
              value={swapTo}
              onValueChange={(v) => {
                setSwapTo(v);
                setSwapConfirm(false);
              }}
            >
              <SelectTrigger
                className="flex-1 bg-transparent border-white/8"
                data-ocid="crypto.swap_to.select"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {coins.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.symbol.toUpperCase()} — {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {swapConfirm && swapResult !== null && (
              <div className="w-28 text-right font-mono text-sm font-bold text-emerald-400">
                ≈{" "}
                {swapResult < 0.001
                  ? swapResult.toExponential(4)
                  : swapResult.toFixed(6)}
              </div>
            )}
          </div>
          {toCoin && (
            <p className="text-xs text-muted-foreground/50">
              1 {toCoin.symbol.toUpperCase()} ={" "}
              {formatPrice(toCoin.current_price)}
            </p>
          )}
        </div>

        {/* Swap Button */}
        {!swapConfirm ? (
          <Button
            onClick={calcSwap}
            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold"
            data-ocid="crypto.swap.primary_button"
          >
            Get Quote
          </Button>
        ) : (
          <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-4 space-y-3">
            <div className="text-sm font-semibold text-center">
              Swap {swapAmount} {fromCoin?.symbol.toUpperCase()} →{" "}
              <span className="text-emerald-400">
                {swapResult !== null &&
                  (swapResult < 0.001
                    ? swapResult.toExponential(4)
                    : swapResult.toFixed(6))}{" "}
                {toCoin?.symbol.toUpperCase()}
              </span>
            </div>
            <p className="text-[11px] text-muted-foreground/60 text-center">
              ⚠️ This is a simulation only. No real transaction will be executed.
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1 border-white/10 text-muted-foreground"
                onClick={() => setSwapConfirm(false)}
                data-ocid="crypto.swap_cancel.button"
              >
                Cancel
              </Button>
              <Button
                className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white"
                onClick={() => {
                  setSwapConfirm(false);
                  toast.success("Swap simulated successfully!", {
                    description: "This is a simulation only.",
                  });
                }}
                data-ocid="crypto.swap_confirm.button"
              >
                Confirm (Simulation)
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
