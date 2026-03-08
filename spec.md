# ClawPro

## Current State
- Footer has menu separators with glowing lines per item (cyan, silver, violet, blue, amber)
- PartnerSection shows ClawPro.ai brand title + OpenClaw.ai, OpenAI.ai, ChatGPT.ai, GitHub logos as static SVG
- No live API calls in the partner section -- logos are purely decorative

## Requested Changes (Diff)

### Add
- Live API status badges for OpenAI, GitHub, and OpenClaw (public/reachable endpoints)
  - GitHub: `https://api.github.com` (public, no auth needed -- shows rate limit / user info)
  - OpenAI: `https://status.openai.com/api/v2/status.json` (public status page API)
  - OpenClaw: mock/ping to openclaw.ai (show "Connected" if reachable, else "Checking")
- Real GitHub API call: fetch openclaw/clawpro repo info (stars, forks, watchers) displayed under GitHub logo
- OpenAI status API call: show current OpenAI system status (Operational / Degraded / etc.)
- ChatGPT: show OpenAI models list info (from status API) or ChatGPT status
- Each logo card in PartnerSection gets an API status pill (green/orange/red) with live data
- Partner logos become interactive cards with hover state showing API data

### Modify
- Footer menu separators: replace current single-color per-item approach with more refined design
  - Each separator gets a dual-tone gradient that shifts smoothly (more polished, less repetitive)
  - Add subtle pulse animation that varies per item with staggered delays
  - Bottom bar gets a more prominent gradient separator

### Remove
- Nothing removed

## Implementation Plan
1. Update Footer.tsx: improve separator colors with richer dual-tone gradients, staggered timing, more elegant visual
2. Update PartnerSection.tsx: 
   - Add `useEffect` hooks to call GitHub API (repo stats), OpenAI status API
   - Display live data: GitHub stars/forks, OpenAI system status
   - Each partner logo gets a status card with live badge
   - Add hover expand to show live fetched data
3. Validate and deploy
