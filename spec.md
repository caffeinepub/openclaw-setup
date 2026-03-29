# ClawPro

## Current State
Full-stack dark-mode web app. AdminDashboardPanel.tsx and MemberDashboard.tsx have Home/Logout/Back buttons with basic hover styles but no click-light effects. HeroSection has UnifiedClaimSearchCard with black inner background and cyan-purple gradient border. App.tsx renders sections in order with AvailableWorldwideSection. PartnerSection has an SVG-drawn OpenClaw.ai logo (gradient text). No logo slider for Works With Everything before the worldwide section. No roadmap/lightning section.

## Requested Changes (Diff)

### Add
- Click-flash glow animation on Home, Logout, Back buttons in AdminDashboardPanel and MemberDashboard
- Works With Everything logo slide (left-to-right marquee) before AvailableWorldwideSection in App.tsx
- New OpenClaw baby lobster colored SVG logo in PartnerSection
- New RoadmapSection component: ClawPro logo at center, all Works With Everything logos around it in a ring, animated lightning bolts from center to each logo, glow ring around each logo when bolt arrives. Added to App.tsx after PartnerSection or before AvailableWorldwideSection.

### Modify
- UnifiedClaimSearchCard inner card: change from bg-black to dark silver combination (dark charcoal #111318 background, silver/steel accent colors for text and labels)
- Home, Logout, Back buttons in both dashboards: add onClick ripple/flash glow effect

### Remove
- Nothing

## Implementation Plan
1. AdminDashboardPanel.tsx: Add `clickFlash` state per button, render a brief radial glow pulse on click for Home (cyan flash), Logout (red flash), Back (white flash)
2. MemberDashboard.tsx: Same click-flash treatment for Home, Logout, Back buttons
3. HeroSection.tsx UnifiedClaimSearchCard: change inner card background to dark silver (`#0e0f14` with silver text accents, silver border tint on labels/inputs)
4. PartnerSection.tsx: Replace OpenClawLogo SVG with a baby lobster colored SVG (lobster/crayfish shape in orange-red with colorful accents)
5. Create new WorksWithLogoSlide component (or add to IntegrationLogoSlider) - left to right marquee of Works With Everything logos, insert before AvailableWorldwideSection
6. Create new RoadmapSection.tsx: canvas or CSS animation with ClawPro at center, logos in orbit ring, animated SVG lightning paths from center, glow ring keyframe when bolt hits each logo. Insert in App.tsx.
