# ClawPro

## Current State
- Full-stack ICP app with React frontend + Motoko backend
- Backend has `UserProfile` type with `name: Text` and `bio: ?Text` fields, plus `saveCallerUserProfile` / `getCallerUserProfile` APIs
- `MemberDashboard` is a modal (full-screen overlay) with 6 tabs: Profile, Configs, Bot, AI, API, Transactions
- Dashboard header shows user avatar, name, membership badge, and principal
- Hero section (`HeroSection.tsx`) has colorful animated background, robot mascot, version badge, download counter, CTA buttons
- App.tsx shows `MemberDashboard` as a modal, only visible when `identity` is truthy (logged in)

## Requested Changes (Diff)

### Add
1. **Handle Name input in Hero Section** (after logo area, visible only when logged in):
   - Input styled as `ClawPro.ai/ [username handle]` — prefix text "ClawPro.ai/" shown as static label, input for the handle
   - Second input below for "Full Name / Real Name"
   - Saves to backend `saveCallerUserProfile` (handle stored in `name` field as the username handle, full name stored in `bio` field — or better: store handle in `name` and real name as separate key in `bio` with JSON format)
   - Only visible after login; shows current handle if already set
   - Compact, elegant design — does not break hero layout

2. **Redesigned professional two-column Dashboard**:
   - Change from modal overlay to full-page dashboard layout (or very wide modal max-w-6xl)
   - **LEFT COLUMN** (sidebar, ~280px fixed):
     - Top: User avatar (large), below it Full Name (large), below it `@username` handle, below it membership tier badge (Silver/Gold/Platinum with styled badge)
     - Token balance display
     - **Installed Integration Products** section: grid of integration logos with names (WhatsApp, OpenAI, ChatGPT, Claude, etc.) — shown as "installed/active" cards based on user's configured chatbot and API settings
     - Default settings toggle section
     - User preference settings (language preference, notification preferences)
   - **RIGHT COLUMN** (main content area, flex-1):
     - Large content area showing current active tab content
     - Tab navigation at the top of the right column (Profile, Configs, Bot, AI, API, Transactions)
     - Each tab's content renders in the large right column
   - Overall: dark professional look, consistent with ClawPro design system

### Modify
- `MemberDashboard.tsx`: complete redesign to two-column layout
- `HeroSection.tsx`: add handle/name input section after the hero content, only visible when logged in
- Profile tab: show handle name field (`ClawPro.ai/handle`) and full name field separately
- The profile save now stores `name` = handle, `bio` = real full name (or vice versa — use `name` = display handle, `bio` = real name)

### Remove
- Nothing removed, only restructured

## Implementation Plan
1. Modify `HeroSection.tsx` to add a compact handle-name claim section below the CTA buttons, only shown when user is logged in (use `useInternetIdentity` hook). It should show `ClawPro.ai/` prefix + input for handle + input for real name + save button. Uses `useSaveCallerUserProfile` and `useCallerUserProfile` hooks.
2. Completely redesign `MemberDashboard.tsx` into a wide two-column layout:
   - Left sidebar: avatar, full name, @handle, tier badge, token balance, installed integrations list, settings toggles
   - Right panel: tab navigation + tab content (reuse existing tab content panels)
3. Update profile tab to separate handle vs real name fields clearly
4. Update field semantics: `name` field = handle/username, `bio` field = real full name
