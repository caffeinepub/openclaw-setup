import { useEffect, useRef, useState } from "react";
import { useLanguage } from "../../i18n/LanguageContext";

interface CoinData {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap_rank: number;
  price_change_percentage_24h: number;
}

const FALLBACK_COINS: CoinData[] = [
  {
    id: "bitcoin",
    symbol: "btc",
    name: "Bitcoin",
    image: "",
    current_price: 67420,
    market_cap_rank: 1,
    price_change_percentage_24h: 2.34,
  },
  {
    id: "ethereum",
    symbol: "eth",
    name: "Ethereum",
    image: "",
    current_price: 3540,
    market_cap_rank: 2,
    price_change_percentage_24h: 1.87,
  },
  {
    id: "tether",
    symbol: "usdt",
    name: "Tether",
    image: "",
    current_price: 1.0,
    market_cap_rank: 3,
    price_change_percentage_24h: 0.02,
  },
  {
    id: "binancecoin",
    symbol: "bnb",
    name: "BNB",
    image: "",
    current_price: 582,
    market_cap_rank: 4,
    price_change_percentage_24h: -0.45,
  },
  {
    id: "solana",
    symbol: "sol",
    name: "Solana",
    image: "",
    current_price: 172,
    market_cap_rank: 5,
    price_change_percentage_24h: 3.21,
  },
  {
    id: "usd-coin",
    symbol: "usdc",
    name: "USD Coin",
    image: "",
    current_price: 1.0,
    market_cap_rank: 6,
    price_change_percentage_24h: 0.01,
  },
  {
    id: "xrp",
    symbol: "xrp",
    name: "XRP",
    image: "",
    current_price: 0.52,
    market_cap_rank: 7,
    price_change_percentage_24h: -1.12,
  },
  {
    id: "dogecoin",
    symbol: "doge",
    name: "Dogecoin",
    image: "",
    current_price: 0.165,
    market_cap_rank: 8,
    price_change_percentage_24h: 4.56,
  },
  {
    id: "cardano",
    symbol: "ada",
    name: "Cardano",
    image: "",
    current_price: 0.44,
    market_cap_rank: 9,
    price_change_percentage_24h: -0.78,
  },
  {
    id: "avalanche-2",
    symbol: "avax",
    name: "Avalanche",
    image: "",
    current_price: 38.2,
    market_cap_rank: 10,
    price_change_percentage_24h: 2.04,
  },
  {
    id: "tron",
    symbol: "trx",
    name: "TRON",
    image: "",
    current_price: 0.114,
    market_cap_rank: 11,
    price_change_percentage_24h: 0.65,
  },
  {
    id: "chainlink",
    symbol: "link",
    name: "Chainlink",
    image: "",
    current_price: 18.7,
    market_cap_rank: 12,
    price_change_percentage_24h: 1.33,
  },
  {
    id: "polkadot",
    symbol: "dot",
    name: "Polkadot",
    image: "",
    current_price: 7.82,
    market_cap_rank: 13,
    price_change_percentage_24h: -0.92,
  },
  {
    id: "polygon",
    symbol: "matic",
    name: "Polygon",
    image: "",
    current_price: 0.875,
    market_cap_rank: 14,
    price_change_percentage_24h: 1.67,
  },
  {
    id: "internet-computer",
    symbol: "icp",
    name: "Internet Computer",
    image: "",
    current_price: 12.4,
    market_cap_rank: 15,
    price_change_percentage_24h: 5.23,
  },
];

// Coin SVG logos (symbol-based fallback icons)
function CoinIcon({ symbol, image }: { symbol: string; image: string }) {
  const [imgError, setImgError] = useState(false);

  if (image && !imgError) {
    return (
      <img
        src={image}
        alt={symbol}
        className="w-7 h-7 rounded-full object-cover"
        onError={() => setImgError(true)}
      />
    );
  }

  // Coin-specific colors
  const colors: Record<string, string> = {
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

  const bg = colors[symbol.toLowerCase()] ?? "#4B5563";

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
  const changeColor = isPositive ? "text-emerald-400" : "text-rose-400";
  const changeBg = isPositive ? "bg-emerald-500/10" : "bg-rose-500/10";

  const formatPrice = (price: number) => {
    if (price >= 1000)
      return `$${price.toLocaleString("en-US", { maximumFractionDigits: 0 })}`;
    if (price >= 1)
      return `$${price.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    return `$${price.toLocaleString("en-US", { minimumFractionDigits: 4, maximumFractionDigits: 4 })}`;
  };

  return (
    <div
      className="flex items-center gap-3 px-4 py-2.5 rounded-xl border border-white/8 bg-[oklch(0.10_0.012_240)] hover:border-white/14 hover:bg-[oklch(0.12_0.015_240)] transition-all shrink-0 min-w-[200px]"
      style={{
        boxShadow: isPositive
          ? "0 2px 12px rgba(52,211,153,0.06)"
          : "0 2px 12px rgba(251,113,133,0.06)",
      }}
    >
      {/* Rank */}
      <span className="text-[10px] font-bold text-[oklch(0.38_0.02_210)] w-5 text-right flex-shrink-0">
        {coin.market_cap_rank}
      </span>

      {/* Coin logo */}
      <CoinIcon symbol={coin.symbol} image={coin.image} />

      {/* Name + symbol */}
      <div className="flex-1 min-w-0">
        <div className="font-bold text-[11px] text-[oklch(0.90_0.03_210)] truncate">
          {coin.name}
        </div>
        <div className="text-[9px] text-[oklch(0.45_0.05_210)] uppercase font-mono">
          {coin.symbol}
        </div>
      </div>

      {/* Price + change */}
      <div className="text-right flex-shrink-0">
        <div className="font-black text-xs text-[oklch(0.92_0.04_210)]">
          {formatPrice(coin.current_price)}
        </div>
        <div
          className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${changeBg} ${changeColor}`}
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
  const tickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchCoins = async () => {
      try {
        const res = await fetch(
          "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=15&page=1&sparkline=false",
        );
        if (!res.ok) throw new Error("API error");
        const data = (await res.json()) as CoinData[];
        setCoins(data);
      } catch {
        setCoins(FALLBACK_COINS);
      } finally {
        setLoading(false);
      }
    };
    fetchCoins();
  }, []);

  const displayCoins = coins.length > 0 ? coins : FALLBACK_COINS;
  // Triple the list for seamless loop
  const loopCoins = [...displayCoins, ...displayCoins, ...displayCoins];

  return (
    <section className="relative py-5 bg-background/60 border-y border-border overflow-hidden">
      {/* Header row */}
      <div className="flex items-center gap-4 px-6 mb-3">
        <div className="flex items-center gap-2">
          <span
            className="w-2 h-2 rounded-full animate-pulse"
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
        </div>
        <div
          className="h-px flex-1"
          style={{
            background:
              "linear-gradient(90deg, oklch(0.68 0.22 145 / 40%), transparent)",
          }}
        />
        <span className="text-[10px] text-[oklch(0.38_0.02_210)] font-mono">
          Top 15 by Market Cap
        </span>
      </div>

      {/* Ticker marquee — right to left */}
      <div
        className="overflow-hidden"
        ref={tickerRef}
        style={{
          maskImage:
            "linear-gradient(90deg, transparent, black 5%, black 95%, transparent)",
          WebkitMaskImage:
            "linear-gradient(90deg, transparent, black 5%, black 95%, transparent)",
        }}
      >
        <div
          className="flex gap-3 w-max marquee-left"
          style={{ animationDuration: `${loopCoins.length * 3}s` }}
        >
          {loopCoins.map((coin, i) => (
            <CoinCard key={`${coin.id}-${i}`} coin={coin} />
          ))}
        </div>
      </div>

      {/* Subtle background glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 50% 100%, oklch(0.68 0.22 145 / 3%), transparent 70%)",
        }}
      />
    </section>
  );
}
