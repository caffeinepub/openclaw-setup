# ClawPro

## Current State
- Footer has WalkingClawRobot that sometimes drifts off the border path
- InteractiveWorldMap uses a dot-based system (not react-simple-maps)
- LanguageSwitcher and LanguageContext/translations exist but LanguageProvider is NOT wrapped in App.tsx, so language switching does nothing

## Requested Changes (Diff)

### Add
- LanguageProvider wrapping App in main.tsx or App.tsx root
- react-simple-maps-based interactive world map in AvailableWorldwideSection (v81 style)

### Modify
- Footer WalkingClawRobot: fix border path animation so robot always strictly follows the border. Use a dedicated overlay div positioned over the footer for the robot track, measuring the footer dimensions precisely with ResizeObserver. Ensure SPEED is slow (0.0003 fraction/ms). Keep robot strictly on all 4 edges.
- AvailableWorldwideSection: replace dot-map with react-simple-maps ComposableMap+Geographies using world-110m topojson URL (https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json). Keep all existing features: continent filters with colors, LED indicators, 2-3 countries glowing every second, LIVE indicator, click to highlight, hover tooltip showing flag+name+registrations, Top Countries leaderboard below map. No zoom/drag.
- App.tsx: wrap root with LanguageProvider from i18n/LanguageContext

### Remove
- Old dot-map logic in AvailableWorldwideSection or InteractiveWorldMap that conflicts with react-simple-maps version

## Implementation Plan
1. Fix Footer.tsx: use ResizeObserver to get precise footer dimensions, compute strict perimeter path, keep robot slow and always on border
2. Rewrite AvailableWorldwideSection.tsx to use react-simple-maps with all v81 features
3. Add LanguageProvider to App.tsx wrapping the return
