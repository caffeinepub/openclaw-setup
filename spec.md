# ClawPro Dashboard Overhaul v106

## Current State
- MemberDashboard has a Back button (top right) that calls `onClose()` which closes the entire dashboard and returns to main site
- Admin panel logout sets `isLoggedIn=false` but login form may not be visible because left sidebar collapses and flex layout is broken
- DotsBackground component renders stars/dots on canvas
- Dashboard has dark background but lacks HD/elegant premium visual treatment
- Overview sections (Market, Wallet, Installed Apps) each have their own Back button that toggles the section off

## Requested Changes (Diff)

### Add
- Pentagon/paving-block tiled background pattern overlay (SVG or canvas) with glowing gray borders, used in both dashboard and admin panel backgrounds
- Navigation history stack in MemberDashboard so Back button navigates to previous tab instead of closing
- Pentagon background also shown in DotsBackground or as a separate layer in App.tsx

### Modify
- Fix Admin panel: after logout, `isLoggedIn` becomes false but right panel (login form) is not rendered visibly. Fix so when `isLoggedIn=false`, the entire panel shows the centered login form (not the two-column layout)
- Back button in MemberDashboard top bar: instead of calling `onClose()`, navigate back to previous SidebarItem in history stack. Only call `onClose()` if history is empty (user is at root/home)
- Dashboard overall visual: more HD, elegant, luxury feel - richer gradients, stronger glows, sharper card borders, premium color palette (deep navy/indigo, gold accents, neon cyan/violet highlights), subtle shimmer effects on section headers
- Pentagon paving-block pattern added to dashboard sidebar and content area background

### Remove
- Nothing

## Implementation Plan
1. Update `DotsBackground.tsx` to add pentagon/paving block tile layer drawn on canvas alongside stars - pentagons tiled like paving blocks with glowing gray borders
2. Fix `AdminDashboardPanel.tsx`: when `!isLoggedIn`, show a full-screen centered login form (remove the two-column layout, just center the login card). When logged in, show two-column layout.
3. Update `MemberDashboard.tsx`: add `navHistory` state (array of SidebarItem). On `handleNavClick`, push current `active` to history before changing. Back button at top calls `goBack()` which pops history; if empty, call `onClose()`.
4. Upgrade MemberDashboard visual style: premium dark theme with rich gradients, stronger neon glows, sharper card edges, gold/violet/cyan accent palette. Add pentagon SVG background pattern to sidebar and main area.
