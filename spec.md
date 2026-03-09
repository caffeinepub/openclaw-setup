# ClawPro

## Current State
- CryptoTickerSection exists: horizontal marquee sliding right-to-left with 15 top coins from CoinGecko API (with fallback data). Shows rank, logo, name, symbol, price, 24h change.
- Multi-language support (EN/ID/AR/RU/ZH) exists via LanguageContext + translations.ts, but many sections still have untranslated strings hardcoded in English.
- Overall site performance has accumulated many CSS animations, glow effects, and blob effects that slow rendering.

## Requested Changes (Diff)

### Add
- **CryptoPriceNotifications**: Real-time price alert notification system below the crypto ticker marquee. Shows popup/toast-style notifications when price changes are significant (>2% in 30s interval). Translatable labels.
- **CryptoChart Panel**: Below ticker marquee, add a bar/sparkline chart showing all 15 top cryptos by marketcap ranked visually — logo, name, rank, 24h bar chart, market cap. Uses CoinGecko public API. Elegant, smooth, lightweight.
- **Translation keys for crypto section**: `cryptoTicker.notifications`, `cryptoTicker.priceAlert`, `cryptoTicker.chart`, `cryptoTicker.marketCap`, `cryptoTicker.volume`, `cryptoTicker.change24h` for all 5 languages.
- **Full translation audit**: Fix any remaining hardcoded English strings across all sections so all 5 languages work seamlessly.

### Modify
- **CryptoTickerSection**: Refactor to include chart panel (collapsible/expanded view) and notification system. Add refresh interval (30s auto-refresh). Performance optimized — no heavy rerenders.
- **translations.ts**: Extend `cryptoTicker` type and all 5 language objects with new keys.
- **Animations & performance**: Replace heavy CSS keyframe animations with simpler CSS transitions where possible. Reduce simultaneous animation count. Use `will-change: transform` sparingly.

### Remove
- No features removed.

## Implementation Plan
1. Extend `TranslationKey.cryptoTicker` type with new keys in `translations.ts`
2. Add all 5 language translations for new keys (EN, ID, AR, RU, ZH)
3. Fix remaining hardcoded English strings in major sections (Hero, Features, Pricing, Setup, Docs, Footer, Community, WorldMap, Partner, Changelog, Blog, Forum, Dashboard)
4. Rewrite `CryptoTickerSection` with: live ticker marquee + collapsible chart panel + notification badge system
5. Chart panel: responsive bar chart (CSS-only or Recharts if available) showing top 15 coins — rank, logo, name, 24h%, market cap bar
6. Notification system: state-based price alert panel below ticker, shows colored alerts for coins with >2% move in last refresh cycle
7. Optimize animation performance: audit and reduce CSS keyframes, ensure smooth 60fps
