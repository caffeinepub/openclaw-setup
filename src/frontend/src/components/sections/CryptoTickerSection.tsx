import {
  Bell,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useLanguage } from "../../i18n/LanguageContext";

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
}

interface PriceAlert {
  id: string;
  coin: string;
  symbol: string;
  price: number;
  change: number;
  timestamp: number;
}

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

function formatPrice(price: number): string {
  if (price >= 1000)
    return `$${price.toLocaleString("en-US", { maximumFractionDigits: 0 })}`;
  if (price >= 1)
    return `$${price.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  return `$${price.toLocaleString("en-US", { minimumFractionDigits: 4, maximumFractionDigits: 4 })}`;
}

function formatMarketCap(val: number): string {
  if (val >= 1e12) return `$${(val / 1e12).toFixed(2)}T`;
  if (val >= 1e9) return `$${(val / 1e9).toFixed(1)}B`;
  if (val >= 1e6) return `$${(val / 1e6).toFixed(0)}M`;
  return `$${val.toLocaleString()}`;
}

function CoinIcon({ symbol, image }: { symbol: string; image: string }) {
  const [imgError, setImgError] = useState(false);
  if (image && !imgError) {
    return (
      <img
        src={image}
        alt={symbol}
        className="w-7 h-7 rounded-full object-cover flex-shrink-0"
        onError={() => setImgError(true)}
      />
    );
  }
  const bg = COIN_COLORS[symbol.toLowerCase()] ?? "#4B5563";
  return (
    <div
      className="w-7 h-7 rounded-full flex items-center justify-center text-white font-black text-[9px] flex-shrink-0"
      style={{ background: bg }}
    >
      {symbol.toUpperCase().slice(0, 3)}
    </div>
  );
}

function CoinCard({ coin }: { coin: CoinData }) {
  const isPositive = coin.price_change_percentage_24h >= 0;
  return (
    <div
      className={`flex items-center gap-3 px-4 py-2.5 rounded-xl border bg-[oklch(0.10_0.012_240)] hover:bg-[oklch(0.12_0.015_240)] transition-colors shrink-0 min-w-[200px] ${
        isPositive ? "border-emerald-500/10" : "border-rose-500/10"
      }`}
    >
      <span className="text-[10px] font-bold text-muted-foreground/40 w-5 text-right flex-shrink-0">
        {coin.market_cap_rank}
      </span>
      <CoinIcon symbol={coin.symbol} image={coin.image} />
      <div className="flex-1 min-w-0">
        <div className="font-bold text-[11px] text-foreground/85 truncate">
          {coin.name}
        </div>
        <div className="text-[9px] text-muted-foreground/50 uppercase font-mono">
          {coin.symbol}
        </div>
      </div>
      <div className="text-right flex-shrink-0">
        <div className="font-black text-xs text-foreground/80">
          {formatPrice(coin.current_price)}
        </div>
        <div
          className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${
            isPositive
              ? "bg-emerald-500/10 text-emerald-400"
              : "bg-rose-500/10 text-rose-400"
          }`}
        >
          {isPositive ? "+" : ""}
          {coin.price_change_percentage_24h.toFixed(2)}%
        </div>
      </div>
    </div>
  );
}

export function CryptoTickerSection() {
  const { t } = useLanguage();
  const [coins, setCoins] = useState<CoinData[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [alerts, setAlerts] = useState<PriceAlert[]>([]);
  const [showChart, setShowChart] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  // Refs to hold latest state for use inside interval without stale closure
  const prevCoinsRef = useRef<CoinData[]>([]);
  const coinsRef = useRef<CoinData[]>([]);
  const alertsRef = useRef<PriceAlert[]>([]);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Keep refs in sync
  useEffect(() => {
    alertsRef.current = alerts;
  }, [alerts]);

  const fetchCoins = useCallback(async (isRefresh: boolean) => {
    if (isRefresh) setRefreshing(true);
    try {
      const res = await fetch(
        "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=15&page=1&sparkline=false",
      );
      if (!res.ok) throw new Error("API error");
      const data = (await res.json()) as CoinData[];

      const currentPrev = prevCoinsRef.current;
      const currentAlerts = alertsRef.current;

      if (currentPrev.length > 0) {
        const newAlerts: PriceAlert[] = [];
        for (const coin of data) {
          const prev = currentPrev.find((p) => p.id === coin.id);
          if (prev && Math.abs(coin.price_change_percentage_24h) >= 2) {
            const alreadyExists = currentAlerts.find(
              (a) => a.coin === coin.name,
            );
            if (!alreadyExists) {
              newAlerts.push({
                id: `${coin.id}-${Date.now()}`,
                coin: coin.name,
                symbol: coin.symbol.toUpperCase(),
                price: coin.current_price,
                change: coin.price_change_percentage_24h,
                timestamp: Date.now(),
              });
            }
          }
        }
        if (newAlerts.length > 0) {
          setAlerts((prev) => [...newAlerts, ...prev].slice(0, 5));
        }
      } else {
        // First load: show top movers
        const topMovers = [...data]
          .filter((c) => Math.abs(c.price_change_percentage_24h) >= 2)
          .sort(
            (a, b) =>
              Math.abs(b.price_change_percentage_24h) -
              Math.abs(a.price_change_percentage_24h),
          )
          .slice(0, 3)
          .map((coin) => ({
            id: `${coin.id}-init`,
            coin: coin.name,
            symbol: coin.symbol.toUpperCase(),
            price: coin.current_price,
            change: coin.price_change_percentage_24h,
            timestamp: Date.now(),
          }));
        if (topMovers.length > 0) setAlerts(topMovers);
      }

      prevCoinsRef.current = data;
      coinsRef.current = data;
      setCoins(data);
      setLastUpdated(new Date());
    } catch {
      if (coinsRef.current.length === 0) {
        setCoins(FALLBACK_COINS);
        coinsRef.current = FALLBACK_COINS;
        const topMovers = [...FALLBACK_COINS]
          .filter((c) => Math.abs(c.price_change_percentage_24h) >= 2)
          .sort(
            (a, b) =>
              Math.abs(b.price_change_percentage_24h) -
              Math.abs(a.price_change_percentage_24h),
          )
          .slice(0, 3)
          .map((coin) => ({
            id: `${coin.id}-fallback`,
            coin: coin.name,
            symbol: coin.symbol.toUpperCase(),
            price: coin.current_price,
            change: coin.price_change_percentage_24h,
            timestamp: Date.now(),
          }));
        setAlerts(topMovers);
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
    intervalRef.current = setInterval(() => {
      fetchCoins(true);
    }, 30000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [fetchCoins]);

  // Auto-dismiss alerts after 60s
  useEffect(() => {
    if (alerts.length === 0) return;
    const timer = setInterval(() => {
      const now = Date.now();
      setAlerts((prev) => prev.filter((a) => now - a.timestamp < 60000));
    }, 5000);
    return () => clearInterval(timer);
  }, [alerts.length]);

  const displayCoins = coins.length > 0 ? coins : FALLBACK_COINS;
  const loopCoins = [...displayCoins, ...displayCoins, ...displayCoins];
  const maxMarketCap = displayCoins[0]?.market_cap ?? 1;

  return (
    <section className="relative py-4 bg-background/60 border-y border-border/50 overflow-hidden">
      {/* Header row */}
      <div className="flex items-center gap-3 px-5 mb-3 flex-wrap">
        <span
          className="w-2 h-2 rounded-full flex-shrink-0 animate-glow-pulse"
          style={{
            background: "oklch(0.68 0.22 145)",
            boxShadow: "0 0 6px oklch(0.68 0.22 145)",
          }}
        />
        <span
          className="text-xs font-bold uppercase tracking-widest"
          style={{ color: "oklch(0.68 0.22 145)" }}
        >
          {loading ? t.cryptoTicker.loading : t.cryptoTicker.sectionLabel}
        </span>
        {refreshing && (
          <RefreshCw className="w-3 h-3 text-emerald-400 animate-spin" />
        )}
        {lastUpdated && !refreshing && (
          <span className="text-[10px] text-muted-foreground/40 font-mono">
            {t.cryptoTicker.lastUpdated}{" "}
            {lastUpdated.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        )}
        <div
          className="h-px flex-1"
          style={{
            background:
              "linear-gradient(90deg, oklch(0.68 0.22 145 / 30%), transparent)",
          }}
        />
        <span className="text-[10px] text-muted-foreground/40 font-mono hidden sm:block">
          Top 15
        </span>
      </div>

      {/* Ticker marquee — right to left */}
      <div
        className="overflow-hidden"
        style={{
          maskImage:
            "linear-gradient(90deg, transparent, black 4%, black 96%, transparent)",
          WebkitMaskImage:
            "linear-gradient(90deg, transparent, black 4%, black 96%, transparent)",
        }}
      >
        <div
          className="flex gap-3 w-max marquee-left"
          style={{ animationDuration: `${displayCoins.length * 4}s` }}
        >
          {loopCoins.map((coin, i) => (
            <CoinCard key={`${coin.id}-${i}`} coin={coin} />
          ))}
        </div>
      </div>

      {/* Price Alerts Panel */}
      <div className="px-5 mt-3">
        <div className="flex items-center gap-2 mb-2">
          <div className="relative flex-shrink-0">
            <Bell className="w-3.5 h-3.5 text-amber-400" />
            {alerts.length > 0 && (
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-rose-500 rounded-full text-[8px] text-white flex items-center justify-center font-bold leading-none">
                {alerts.length}
              </span>
            )}
          </div>
          <span className="text-[10px] font-semibold text-muted-foreground/60 uppercase tracking-wider">
            {t.cryptoTicker.priceAlerts}
          </span>
        </div>

        {alerts.length === 0 ? (
          <p className="text-[10px] text-muted-foreground/30 italic pl-5">
            {t.cryptoTicker.noAlerts}
          </p>
        ) : (
          <div className="flex flex-wrap gap-1.5">
            {alerts.map((alert) => {
              const isPos = alert.change >= 0;
              return (
                <div
                  key={alert.id}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                    isPos
                      ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                      : "bg-rose-500/10 border-rose-500/20 text-rose-400"
                  }`}
                >
                  {isPos ? (
                    <TrendingUp className="w-2.5 h-2.5" />
                  ) : (
                    <TrendingDown className="w-2.5 h-2.5" />
                  )}
                  <span className="font-mono">{alert.symbol}</span>
                  <span>{formatPrice(alert.price)}</span>
                  <span>
                    {isPos ? "+" : ""}
                    {alert.change.toFixed(2)}%
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Top 15 Market Cap Chart Toggle */}
      <div className="px-5 mt-3">
        <button
          type="button"
          data-ocid="crypto.chart_toggle.button"
          onClick={() => setShowChart((v) => !v)}
          className="flex items-center gap-1.5 text-[10px] font-semibold text-muted-foreground/50 hover:text-foreground/70 transition-colors group"
        >
          {showChart ? (
            <>
              <ChevronUp className="w-3 h-3 group-hover:text-cyan-400 transition-colors" />
              <span>{t.cryptoTicker.hideChart}</span>
            </>
          ) : (
            <>
              <ChevronDown className="w-3 h-3 group-hover:text-cyan-400 transition-colors" />
              <span>{t.cryptoTicker.topCoins}</span>
            </>
          )}
        </button>

        {/* Collapsible chart panel */}
        <div
          className="overflow-hidden transition-all duration-300 ease-in-out"
          style={{
            maxHeight: showChart ? "700px" : "0px",
            opacity: showChart ? 1 : 0,
          }}
        >
          <div className="mt-3 border border-border/30 rounded-xl bg-background/30 overflow-hidden">
            {/* Table header */}
            <div className="grid grid-cols-[28px_1fr_auto_auto_auto] gap-2 px-3 py-2 border-b border-border/20 text-[9px] font-bold text-muted-foreground/40 uppercase tracking-wider">
              <span>{t.cryptoTicker.rank}</span>
              <span>Coin</span>
              <span className="text-right hidden sm:block">
                {t.cryptoTicker.marketCap}
              </span>
              <span className="text-right">{t.cryptoTicker.change24h}</span>
              <span className="text-right">{t.cryptoTicker.price}</span>
            </div>

            {/* Rows */}
            {displayCoins.map((coin) => {
              const isPos = coin.price_change_percentage_24h >= 0;
              const barWidth =
                maxMarketCap > 0 ? (coin.market_cap / maxMarketCap) * 100 : 0;
              const coinColor =
                COIN_COLORS[coin.symbol.toLowerCase()] ?? "#4B5563";

              return (
                <div
                  key={coin.id}
                  data-ocid={`crypto.coin.item.${coin.market_cap_rank}`}
                  className="relative grid grid-cols-[28px_1fr_auto_auto_auto] gap-2 px-3 py-2 items-center border-b border-border/15 last:border-0 hover:bg-white/[0.02] transition-colors group"
                >
                  <div
                    className="absolute left-0 top-0 h-full opacity-[0.035] group-hover:opacity-[0.06] transition-opacity pointer-events-none"
                    style={{ width: `${barWidth}%`, background: coinColor }}
                  />
                  <span className="text-[10px] font-bold text-muted-foreground/35 text-center relative z-10">
                    {coin.market_cap_rank}
                  </span>
                  <div className="flex items-center gap-2 min-w-0 relative z-10">
                    <CoinIcon symbol={coin.symbol} image={coin.image} />
                    <div className="min-w-0">
                      <div className="text-xs font-semibold text-foreground/75 truncate">
                        {coin.name}
                      </div>
                      <div className="text-[9px] text-muted-foreground/35 font-mono uppercase">
                        {coin.symbol}
                      </div>
                    </div>
                  </div>
                  <div className="text-right hidden sm:block relative z-10">
                    <div className="text-[10px] text-muted-foreground/55 font-mono">
                      {formatMarketCap(coin.market_cap)}
                    </div>
                    <div
                      className="h-0.5 rounded-full mt-1 ml-auto"
                      style={{
                        width: `${Math.max(barWidth * 0.5, 6)}px`,
                        background: coinColor,
                        opacity: 0.5,
                      }}
                    />
                  </div>
                  <span
                    className={`text-[10px] font-bold text-right relative z-10 ${isPos ? "text-emerald-400" : "text-rose-400"}`}
                  >
                    {isPos ? "+" : ""}
                    {coin.price_change_percentage_24h.toFixed(2)}%
                  </span>
                  <span className="text-[11px] font-bold text-foreground/75 text-right font-mono relative z-10">
                    {formatPrice(coin.current_price)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Subtle glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 50% 100%, oklch(0.68 0.22 145 / 2%), transparent 70%)",
        }}
      />
    </section>
  );
}
