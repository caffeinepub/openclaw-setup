# ClawPro

## Current State
- Main page uses `HexagonBackground` (cyan hexagonal grid canvas animation)
- MemberDashboard uses `HexagonBackground` inside `<div style={{ background: '#04040e' }}>` 
- AdminDashboardPanel uses `HexagonBackground` inside its main container
- CryptoMarketPage uses `BatikBackground` (teal ornamental SVG pattern)
- Many card/section backgrounds use `rgba(..., 0.x)` transparent styles
- `handleBack` in MemberDashboard falls back to `onClose()` when navHistory is empty
- Back button in AdminDashboardPanel calls `onClose` directly

## Requested Changes (Diff)

### Add
- `StarBackground` component: simple dark background with small scattered twinkling white stars (canvas-based, subtle, lightweight)

### Modify
1. App.tsx: Replace `<HexagonBackground fixed />` with `<StarBackground fixed />`
2. MemberDashboard.tsx: Replace `<HexagonBackground />` with `<StarBackground />`. Remove the import of HexagonBackground.
3. AdminDashboardPanel.tsx: Replace `<HexagonBackground />` with `<StarBackground />`. Remove the import of HexagonBackground.
4. CryptoMarketPage.tsx: Remove `<BatikBackground />` and its import. Add `<StarBackground />` instead for consistent dark+stars background.
5. All panels/cards/sections in MemberDashboard, AdminDashboardPanel, CryptoMarketPage, and main App sections: Change transparent/semi-transparent backgrounds (`rgba(...)` with low alpha, `bg-.../20`, `backdrop-blur`, `bg-white/10`, etc.) to solid dark backgrounds. Use solid dark colors: `#0d0d1a`, `#0a0a0f`, `#10101e`, `#111827`, `#0f0f1a` etc. Text should contrast well - white, cyan-300, gray-200 on dark backgrounds.
6. MemberDashboard `handleBack()`: When navHistory is empty, navigate to 'home' (overview) instead of calling `onClose()`. Only call `onClose()` from Home/Back button or logout.
7. AdminDashboardPanel back button (in the logged-in dashboard view, line ~901): This back button currently calls `onClose`. Since admin panel has no sub-navigation, rename it to something like "Close" and keep `onClose`, OR if there are sub-views tracked, navigate back within admin. Currently admin panel doesn't have sub-view state, so this back button should stay as close/exit. BUT: if there's a separate Back button visible in admin that shouldn't go to main site, just ensure it's labelled correctly and only closeable via explicit X or logout. Per user request: back should go to 'overview/dashboard' not main home. In admin this means the Back button on the login view and the one in main view should stay as onClose (since admin is a separate panel). The key point is within MemberDashboard sub-menus, Back should return to 'home' tab (overview).

### Remove
- `HexagonBackground` usage from App.tsx, MemberDashboard.tsx, AdminDashboardPanel.tsx
- `BatikBackground` usage from CryptoMarketPage.tsx

## Implementation Plan
1. Create `src/frontend/src/components/StarBackground.tsx` - canvas with small randomly placed stars that slowly twinkle (fade in/out, random positions, ~100-150 stars, white/light-blue colors, 0.5-1.5px radius)
2. Update `App.tsx`: swap HexagonBackground import → StarBackground
3. Update `MemberDashboard.tsx`: swap HexagonBackground → StarBackground; fix handleBack to go to 'home' instead of onClose when no history
4. Update `AdminDashboardPanel.tsx`: swap HexagonBackground → StarBackground
5. Update `CryptoMarketPage.tsx`: remove BatikBackground import+usage, add StarBackground
6. In MemberDashboard, AdminDashboardPanel, CryptoMarketPage: audit and replace transparent card/panel backgrounds with solid dark equivalents. Specifically: `background: 'rgba(...)'` patterns with alpha < 0.8 should become solid. Sidebar aside backgrounds, card backgrounds, modal content backgrounds. Keep glowing borders (they're fine). Use solid backgrounds like `#0d0d1a`, `#0f0f1a`, `#111827`, `#13131e`.
