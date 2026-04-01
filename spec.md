# ClawPro

## Current State
- CreateAccountModal uses `flex items-center justify-center` which clips the form on laptop screens with shorter viewport heights
- AnimatedLobsterSVG in LobsterPopupCard.tsx has claws that visually appear disconnected from the body (separate groups with no arm/segment connecting them to torso)
- AnimatedLobsterSVG is used in: LobsterPopupCard (popup), RoadmapSection (ecosystem center), WorkWithEverythingSection, IntegrationLogoSlider, MemberDashboard (install & integrations section), and any other section referencing it
- RoadmapSection.tsx has a dark background with circuit board PCB lines; user wants it replaced with an ecosystem chip visualization where each company logo appears as a chip node connected by elegant glowing lines to the central OpenClaw chip

## Requested Changes (Diff)

### Add
- Scroll behavior to CreateAccountModal so it scrolls up/down on laptop screens instead of clipping
- Ecosystem chip background in RoadmapSection showing all company logos as stylized chip nodes interconnected with soft glowing SVG lines

### Modify
- CreateAccountModal: change outer wrapper from `items-center` to `items-start` with `overflow-y-auto py-8` so the modal scrolls vertically on small viewports
- AnimatedLobsterSVG: full redesign — larger, more elegant, professional, cute lobster with claws visually connected to body via arm segments, smoother animations, richer detail, unified silhouette
- RoadmapSection: replace dark solid/PCB background with interconnected chip ecosystem background; each ecosystem logo (OpenClaw, Facebook, WhatsApp, Telegram, Instagram, TikTok, YouTube, Discord, Slack, GitHub, GPT, Google, Spotify) rendered as a rounded chip card; center chip is the OpenClaw lobster; soft animated SVG lines pulse between center and each chip

### Remove
- Nothing removed

## Implementation Plan
1. In `CreateAccountModal.tsx`: change outer motion div container class from `flex items-center justify-center p-4` to `flex items-start justify-center p-4 overflow-y-auto min-h-screen` so form is scrollable on laptop
2. Redesign `AnimatedLobsterSVG` in `LobsterPopupCard.tsx` — create a beautiful lobster SVG where:
   - Arms/segments explicitly connect claws to the body (no floating claws)
   - Body is more detailed with gradient segments
   - Smoother, richer animation (breathing, claw pinch, tail fan, antenna sway)
   - Elegant color palette: deep red (#dc2626), orange-red (#f97316), amber highlights
   - Proportions: larger head, prominent claws, fan tail
3. In `RoadmapSection.tsx`: replace background/PCB canvas with a React SVG-based chip ecosystem:
   - Background: soft dark navy (#050d1f)
   - Center: large OpenClaw chip with animated lobster SVG and pulsing glow ring
   - Surrounding chips: 12 company logo chips arranged in a circle/orbit
   - Animated SVG lines from center to each chip with traveling light-dot animation
   - Each chip: rounded rect with brand color border glow, logo, brand name label
   - Animation: lines pulse simultaneously every 3s (same behavior as before)
4. Validate build passes
