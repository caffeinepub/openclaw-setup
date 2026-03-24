# ClawPro

## Current State
AdminDashboardPanel is a modal overlay (fixed inset-0) with a single scrollable panel showing login + user list with expandable rows. InteractiveWorldMap exists but needs to be the permanent locked implementation.

## Requested Changes (Diff)

### Add
- Admin panel full dashboard layout: left sidebar (stats, user list with search/filter, click to select user) + right panel (selected user detail: avatar, username, full name, tier badge, installed apps, contact info, join date). Elegant glowing buttons that animate on click.
- InteractiveWorldMap: complete react-simple-maps implementation with: accurate GeoJSON country borders, click to highlight/toggle (multi-select), hover tooltip with country name, continent filter buttons with colored LED indicators, 2-3 countries auto-glow every second with animated pulse ring, popup on click showing flag emoji + country name + registration count, leaderboard Top Countries below map, no zoom/drag.

### Modify
- AdminDashboardPanel: change from narrow modal to full-screen (or near full-screen) dashboard panel with two-column layout. Left side: search bar + user list (scrollable). Right side: detailed view of selected user. Keep login/forgot password flow.
- InteractiveWorldMap: rebuild as fixed canonical implementation using react-simple-maps.

### Remove
- Old single-column expandable user list in AdminDashboardPanel.

## Implementation Plan
1. Rewrite AdminDashboardPanel with two-column layout: left sidebar with search + stats + scrollable user list; right panel with rich user detail view. Glowing/active button styles throughout.
2. Rewrite InteractiveWorldMap using react-simple-maps (ComposableMap, Geographies, Geography) with all required features. Lock this as permanent implementation.
