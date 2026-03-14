# ClawPro

## Current State
- Login modal has basic "Lupa Password" that shows the password in plaintext after username lookup.
- Install & Integrations panel has Install buttons, but installed apps don't appear dynamically in the left sidebar (sidebar is hardcoded NAV_ITEMS).
- Overview tab shows "Installed Apps" with emoji icons and a "Works With Everything" section.
- Home/HeroSection has no "back to dashboard" button for logged-in users.

## Requested Changes (Diff)

### Add
- Secure reset password flow in LoginModal: Step 1 enter username → Step 2 system generates a 6-digit verification code displayed on screen (simulated email, e.g. "Code sent to your email: XXXXXX") → Step 3 user enters the code → Step 4 user sets a new password with confirmation. Replace the old plaintext password display.
- "Back to Dashboard" button in HeroSection for logged-in users. HeroSection needs a new optional prop `onGoToDashboard?: () => void` and `isLoggedIn?: boolean`; when set, show a prominent glowing button.
- New bonus dashboard feature: "Leaderboard" tab in sidebar showing top members.
- New bonus dashboard feature: "Notifications" tab in sidebar with notification items.

### Modify
- Left sidebar: make installed apps dynamic. After user clicks Install in Install & Integrations panel, the installed integration appears in the sidebar as a new nav entry (read from `clawpro_installed_integrations` localStorage). The `InstallIntegrationsPanel` shares install state up or uses a shared localStorage + event so the sidebar re-renders.
- Overview tab: Replace emoji icons in "Installed Apps" grid with real brand icons (using react-icons SiWhatsapp, SiTelegram, SiOpenai etc.) and their proper brand colors. Remove the entire "Works With Everything" section from the Overview tab.
- App.tsx: Pass `onGoToDashboard` and `isLoggedIn` props to HeroSection.

### Remove
- "Works With Everything" section from Overview tab in MemberDashboard.
- Old plaintext password display in forgot password flow.

## Implementation Plan
1. LoginModal.tsx: Replace forgot password flow with 3-step secure reset (username → code verification → new password). Generate random 6-digit code, store in state, show as "simulated email" on screen, require code entry, then update password in localStorage.
2. MemberDashboard.tsx:
   a. Make sidebar dynamic: add a `useDynamicInstalledItems` that reads/listens to localStorage `clawpro_installed_integrations` and maps installed integration IDs to sidebar items.
   b. In Overview: replace emoji icons with real react-icons brand icons, remove Works With Everything section.
   c. Add Leaderboard and Notifications tabs to NAV_ITEMS and their panel components.
   d. Share installed state between InstallIntegrationsPanel and sidebar via lifted state or localStorage listener.
3. HeroSection.tsx: Accept optional `onGoToDashboard` and `isLoggedIn` props; render a glowing "Go to Dashboard" button near the hero CTAs when logged in.
4. App.tsx: Pass `isLoggedIn={!!localAccount}` and `onGoToDashboard={() => setShowDashboard(true)}` to HeroSection.
