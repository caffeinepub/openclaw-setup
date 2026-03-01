# ClawPro

## Current State
App is a full-featured ClawPro.ai website with membership tiers (Silver/Gold/Platinum). The `WorkWithEverythingSection` has an `IntegrationDetailModal` that shows tier buttons (Silver, Gold, Platinum) under "Get Started". These buttons always appear identical regardless of whether the user already owns that tier. The user's membership tier is tracked via `useMyMembership()` hook.

## Requested Changes (Diff)

### Add
- In `IntegrationDetailModal`, read the user's current membership tier from `useMyMembership()`.
- For the tier button matching the user's active tier: show an "Active" badge/label, change the button style to indicate it's already owned (e.g. muted/disabled appearance with a checkmark), and disable the click action.
- For tiers lower than the user's current tier (already included): also show as "Active" or "Owned" since higher tiers typically include lower tier benefits.
- For tiers the user doesn't own: keep the existing clickable "Get Started" style.
- If user is not logged in, all tier buttons remain clickable as before.

### Modify
- `IntegrationDetailModal` in `WorkWithEverythingSection.tsx`: accept or read current user tier, apply conditional styles and disabled state to tier buttons.

### Remove
- Nothing removed.

## Implementation Plan
1. In `IntegrationDetailModal`, call `useMyMembership()` to get the user's current tier.
2. Define tier rank: silver=1, gold=2, platinum=3.
3. For each tier button, if `userTierRank >= buttonTierRank`, render it as "Active" (disabled, green checkmark badge, muted style, no onClick).
4. If user has no tier or is not logged in, all buttons are clickable as before.
5. Validate and build.
