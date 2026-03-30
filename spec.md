# ClawPro

## Current State
- LobsterPopupCard shows animated lobster, handle text, and a "Got it!" button. No countdown and no waitlist save.
- RoadmapSection center logo is a small static SVG lobster with text "ClawPro.ai" below it.
- PartnerSection "Powered by the world's best" shows an OpenClawLogo SVG card (static icon).
- MemberDashboard Install & Integrations: OpenClaw card uses an emoji 🦾, all integration cards share one uniform dark background color.

## Requested Changes (Diff)

### Add
- Countdown timer in LobsterPopupCard counting down to May 31, 2026 (days / hours / minutes / seconds)
- Email input field in LobsterPopupCard to save to backend waitlist (registerLocalAccount-style save)
- Backend `addToWaitlist(handle, email)` function in main.mo + frontend binding
- Animated lobster (full AnimatedLobsterSVG, claws opening/closing) in the center of RoadmapSection replacing static mini-lobster
- Animated lobster beside/above "Powered by the world's best" title in PartnerSection
- Animated lobster icon for OpenClaw card in InstallIntegrationsPanel in MemberDashboard

### Modify
- RoadmapSection center logo text: change from "ClawPro.ai" to "ClawPro" only
- PartnerSection OpenClaw API card name: "OpenClaw" (no .ai)
- MemberDashboard OpenClaw integration item: name = "OpenClaw" (no .ai), icon = animated lobster
- InstallIntegrationsPanel card backgrounds: change from uniform `oklch(0.09 0.015 250)` to brand-color tinted backgrounds matching each item's `color` (e.g., `${item.color}14` with hover glow)

### Remove
- Nothing removed

## Implementation Plan
1. Add `addToWaitlist` / `getWaitlistEntries` to backend (main.mo) and update backend.d.ts
2. Update LobsterPopupCard.tsx: add live countdown to May 31 2026 + email input + backend waitlist save on submit
3. Update RoadmapSection.tsx: replace ClawProCenterLogo with AnimatedLobsterSVG (inline, scaled to 80×80), change label to "ClawPro"
4. Update PartnerSection.tsx: add floating animated lobster SVG above the ClawPro.ai heading + update OpenClaw card name
5. Update MemberDashboard.tsx: replace openclaw emoji with inline animated lobster SVG + change name to "OpenClaw" + update card backgrounds to brand-color tinted
