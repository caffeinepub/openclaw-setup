# ClawPro

## Current State
The `UnifiedClaimSearchCard` in `HeroSection.tsx` uses a white/silver gradient background (`#f0f4f8 → #e8edf2 → #f5f7fa → #ffffff`) with dark text. Both the Save Handle button (in HeroSection) and Create Account button (in CreateAccountModal) proceed directly to login/registration flow.

## Requested Changes (Diff)

### Add
- A `LobsterPopupCard` component: a modal/overlay pop-up card with an animated lobster SVG moving inside the card, and `@handle` text at the bottom (shows `@yourname` as placeholder if handle is empty). This pop-up appears when Save Handle OR Create Account is clicked, acting as a temporary registration blocker (coming soon/waitlist). The card should have an elegant dark background, premium glow, animated lobster claw character, and a close button.

### Modify
- `UnifiedClaimSearchCard` inner card background: change from white/silver (`#f0f4f8 → #ffffff`) to a deep dark navy/midnight tone (NOT pure black — use deep navy like `#0a1628 → #0d1f3c → #0f2040`) to look elegant, professional, modern. Update all text colors from dark to light/white.
- Input fields inside the card: change from white/light background to dark (`#07111f`) with light text.
- The `ClawPro.ai/` prefix and label text colors: update to match dark theme.
- `handleSave` in `UnifiedClaimSearchCard`: intercept the click to show `LobsterPopupCard` instead of proceeding to login/create account.
- `CreateAccountModal` submit button: intercept `handleSubmit` to show `LobsterPopupCard` instead of proceeding.

### Remove
- Nothing removed.

## Implementation Plan
1. Create `LobsterPopupCard` component inline in `HeroSection.tsx` (or as separate file, your choice). It renders as a full-screen overlay with centered card. Inside the card: animated SVG lobster (claw/pincer that moves — opens and closes, bounces, or walks), and at the bottom the text `@handle` (from props, fallback to `@yourname`). Card has elegant dark background with premium cyan/amber glow. Close button (X) to dismiss.
2. Add state `showLobsterPopup` and `lobsterHandle` to `UnifiedClaimSearchCard`. In `handleSave`, before any logic, set `showLobsterPopup = true` and `lobsterHandle = handle`. Don't proceed with save.
3. Export/use `LobsterPopupCard` in `CreateAccountModal.tsx` as well. In `handleSubmit`, before any logic, show the lobster popup with the username handle. Don't proceed with registration.
4. Update the `UnifiedClaimSearchCard` inner card styles: background to dark midnight navy, text to white/light, inputs to dark bg.
