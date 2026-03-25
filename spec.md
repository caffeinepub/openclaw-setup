# ClawPro.ai - v104 Update

## Current State
- App has dark/light mode toggle and language switcher in navbar
- Dashboard button only shows when user is logged in
- Admin dashboard has white/light background
- Admin panel is light-themed
- Responsive issues on some devices
- Back buttons missing from some views

## Requested Changes (Diff)

### Add
- Dashboard button always visible in navbar (4 items: Admin, Dashboard, Create Account, Login)
- Back button (top-right or prominent) on every overlay/panel/dashboard view
- Admin dashboard: dark background (`#0a0a0f`), all sections/menus with dark card backgrounds (`#111118`, `#1a1a24`)
- Admin panel: additional features - user analytics charts, activity timeline, system health, ban/unban user, export per user, filter by tier
- Admin back button in top-right corner

### Modify
- **Navbar**: Remove theme toggle (Sun/Moon) and language switcher entirely. Always show 4 action buttons: Admin (red), Dashboard (cyan), Create Account (outline), Login (solid). Dashboard button always visible regardless of login state (when not logged in it opens Login modal first).
- **AdminDashboardPanel**: Change entire background to dark (`bg-[#0a0a0f]`). Left sidebar dark cards. Right panel dark. All text light. Stats cards dark with glowing borders. Login card dark-themed. Buttons glow on click.
- **MemberDashboard**: Add `Back` button top-right. All sidebar menu items on dark card bg. All tabs/panels have dark background. More elegant layout.
- **App.tsx**: Dashboard button always calls `setShowDashboard(true)` regardless of login; if not logged in, show login modal first.
- Remove `isDark`/`toggleTheme` state and props from App.tsx and Navbar (always dark)
- Remove `LanguageSwitcher` from Navbar
- Lock `document.documentElement.classList.add('dark')` permanently

### Remove
- `toggleTheme` function and `isDark` state
- `LanguageSwitcher` component from Navbar
- `Sun`/`Moon` theme toggle button from both desktop and mobile navbar
- Conditional rendering of Dashboard button (always show it)

## Implementation Plan
1. Modify `App.tsx`: remove isDark state/toggleTheme, always dark mode, remove toggleTheme/LanguageSwitcher props, Dashboard button always visible (if not logged in opens login first)
2. Modify `Navbar.tsx`: remove isDark/toggleTheme props, remove LanguageSwitcher import/usage, remove theme toggle button from desktop and mobile menus, always show Admin+Dashboard+CreateAccount+Login buttons
3. Modify `AdminDashboardPanel.tsx`: full dark theme - bg-[#0a0a0f], dark cards, glowing red accents, add Back button top-right, add more admin features (user analytics, activity timeline, tier filter, ban action, system health stats)
4. Modify `MemberDashboard.tsx`: add Back button top-right, ensure all sidebar items have dark card backgrounds, all panels/sections dark bg, responsive layout polish for mobile/tablet/laptop
5. Ensure responsive layouts work on all screen sizes: use proper Tailwind responsive classes (sm: md: lg:)
