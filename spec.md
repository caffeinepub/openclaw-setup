# ClawPro

## Current State
- Admin Dashboard: full dark-themed panel with left/right split, user list search, expandable user details, Analytics, System Logs, Notifications, Broadcast, User Roles, System Health, Settings. Logout button exists but no Home button.
- User Dashboard: dark background, sidebar with navigation menus, Overview with Market/Wallet/Installed Apps toggles, Community Forum menu (currently shows 'launching soon' placeholder instead of real forum).
- Home (App.tsx): hero, features, pricing, stats (Community & Impact section), world map, integrations. Stats section uses `useTotalMembersCount` from backend. Community Members stat is hardcoded to 100,000.
- Community & Impact: StatsSection.tsx shows 4 stat cards. 'Total Members' uses `membersNum` from `useTotalMembersCount()` hook. 'Community Members' is static 100000.
- ForumPage.tsx: fully built with topic list, thread list, thread detail, notifications. But in MemberDashboard Community Forum section, it shows a 'launching soon' message instead of rendering `<ForumPage />`.

## Requested Changes (Diff)

### Add
- **Admin Dashboard**: Home button next to Logout button that navigates to main site (`/` or `#/`)
- **Admin Dashboard**: New features: Activity Feed, Quick Stats summary cards at top, Recent Registrants widget (last 5 new signups), improved visual KPIs
- **Admin Dashboard**: More modern luxury look — gradient card headers, glowing stat cards, premium typography, animated highlights
- **User Dashboard**: Community Forum sidebar item should open the actual `ForumPage` component (not the placeholder)
- **User Dashboard**: More modern premium look — improved stat cards in Overview, better typography, gradient accents
- **User Dashboard**: New features: Achievements/Badges tab, Quick Actions panel in Overview
- **Home**: More modern hero section — glowing gradient text, animated particles or glow orbs, premium button styles
- **Home**: Visual polish on all sections — pricing cards with gradient borders, features section with icon glow, integration logos with hover effects
- **Community & Impact**: Total Members stat value should come from the actual registered user count (use `getAllLocalAccounts` count from backend or same source admin panel uses)

### Modify
- `AdminDashboardPanel.tsx`: Add Home button in topbar, redesign overall layout to be more premium (gradient sidebar, glowing cards, animated stat numbers)
- `MemberDashboard.tsx`: Wire Community Forum menu to render `<ForumPage />`, redesign overview cards, add new sidebar menu items
- `StatsSection.tsx`: Update Community Members count to use real backend data (same as Total Members from `useTotalMembersCount`)
- `HeroSection.tsx`: Enhanced visual design — glowing headline, animated gradient orbs, premium CTA buttons
- `FeaturesSection.tsx` and `PricingSection.tsx`: More visual polish and premium feel

### Remove
- The 'Community Forum launching soon' placeholder text in MemberDashboard

## Implementation Plan
1. Update `AdminDashboardPanel.tsx`:
   - Add Home button (house icon) left of Logout in topbar, styled cyan/teal, onClick navigates to `/#`
   - Add 4 KPI stat cards at top of Users view: Total Registered, Active Today, Banned, Pending
   - Add Recent Registrants widget showing last 5 new users
   - Redesign sidebar with gradient background `from-slate-900 to-slate-950`, active item with cyan left border
   - Redesign cards with gradient borders and glow effects
   - Add animated number counters for stats

2. Update `MemberDashboard.tsx`:
   - Replace Community Forum 'launching soon' content with actual `<ForumPage identity={identity} onClose={() => setActiveMenu('overview')} />`
   - Add Achievements menu item in sidebar Community section
   - Redesign Overview stat cards with gradient colors and glow borders
   - Add Quick Actions panel to Overview (shortcuts to Install, Wallet, Forum, Settings)

3. Update `StatsSection.tsx`:
   - Change Community Members card to use `membersNum` from `useTotalMembersCount()` instead of hardcoded 100000
   - Update label to 'Registered Members' and desc to 'Users joined on any device'

4. Update `HeroSection.tsx`:
   - Add glowing gradient title text effect
   - Add animated glow orbs/blobs in background
   - Premium CTA button with shimmer animation

5. Update `FeaturesSection.tsx` and `PricingSection.tsx`:
   - Icon containers with colored glow
   - Pricing cards with gradient borders and hover lift effect
