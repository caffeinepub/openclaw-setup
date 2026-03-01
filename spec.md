# ClawPro

## Current State
- ClawPro is a full-stack web app with hero section, membership tiers (Silver/Gold/Platinum), dashboard, multilingual support (EN/ID/AR/RU/ZH), and various sections.
- Users can log in via ICP Identity and claim a ClawPro handle (stored as `name` in `UserProfile`), with full name stored in `bio`.
- Backend `UserProfile` has `name` (handle) and `bio` (full name).
- Currently, profiles can only be looked up by Principal — no public lookup by handle/username.
- Hero section shows `HandleClaimCard` after login for setting handle/full name, but there is no read-only display card showing the user's current profile info.
- No public profile page at `/u/[handle]`.

## Requested Changes (Diff)

### Add
- Backend: `getPublicProfileByHandle(handle: Text)` query that returns only the username/handle (not full name) for public viewing.
- Backend: `UserHandleMap` — a lookup map from handle (Text) to Principal, so handle-based lookup is O(1).
- Frontend: `PublicProfilePage` component — shown when URL is `/u/[handle]`, displays only the username (handle), membership tier badge, and a "Join ClawPro" CTA. Does NOT show full name.
- Frontend: `ProfileDisplayCard` component in HeroSection — shown after the ClawPro logo animation when user is logged in. Displays: handle name (ClawPro.ai/handle), full name, and ICP username (Principal short form). This is a read-only display below the logo.

### Modify
- `main.mo`: Add `userHandleMap` state, update `saveCallerUserProfile` to also register handle → Principal mapping. Add `getPublicProfileByHandle` query (public, no auth required, returns only `{ handle: Text }` or null).
- `App.tsx`: Add URL-based routing so `/u/[handle]` renders `PublicProfilePage` overlay/page.
- `HeroSection.tsx`: Add `ProfileDisplayCard` below the big logo title — renders only when user is logged in and has saved a handle.

### Remove
- Nothing removed.

## Implementation Plan
1. Update `main.mo`: add `userHandleMap` (Map<Text, Principal>), update `saveCallerUserProfile` to register handle, add `getPublicProfileByHandle(handle: Text): async ?{ handle: Text }` public query.
2. Update `backend.d.ts` to include the new `getPublicProfileByHandle` function.
3. Create `PublicProfilePage.tsx` component: reads handle from URL hash (`#/u/handle`), calls `getPublicProfileByHandle`, shows username, tier badge if available (from public lookup), and "Join ClawPro" CTA.
4. Update `HeroSection.tsx`: add `ProfileDisplayCard` that shows the current user's handle, full name, and short Principal username — displayed as a stylish info card below the logo title, only when logged in and handle is set.
5. Update `App.tsx`: add hash-based routing for `#/u/[handle]` to render `PublicProfilePage`.
