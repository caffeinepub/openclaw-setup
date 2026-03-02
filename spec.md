# ClawPro

## Current State
Full-stack ClawPro app with Motoko backend and React frontend. Features include: membership tiers (Silver/Gold/Platinum), leaderboard connected to blockchain data (`getLeaderboard`, `getMyLeaderboardRank`, `getTopRewards`), token system, dashboard member with tabs (Profile, Configs, Bot, AI, API, Transactions, Rank, Alerts), multi-language (EN/ID/AR/RU/ZH), public profile page via `/#/u/[handle]`.

Backend already has `getLeaderboard`, `getMyLeaderboardRank`, `getTopRewards` functions. No claim reward function exists yet.

## Requested Changes (Diff)

### Add
- Backend: `claimTopReward(rank: Nat)` function that validates the caller is currently in top 3, marks the reward as claimed (store claimed rewards per principal), returns bonus tokens
- Backend: `hasClaimedReward(rank: Nat)` query to check if a user already claimed a reward
- Backend: `getClaimedRewards()` query to get all claimed rewards for caller
- Frontend: `PublicLeaderboardPage` component - standalone leaderboard page accessible via `/#/leaderboard` without login, showing top 50 members with podium top 3 display, tier badges, tokens, share button
- Frontend: Auto-claim reward system in MemberDashboard `LeaderboardTab` - when user is top 3, show animated banner + "Claim Reward" button; after claiming, show success state with bonus tokens
- Frontend: Hash routing in App.tsx for `/#/leaderboard`
- Frontend: Link/button in navbar or leaderboard tab to share/open public leaderboard

### Modify
- MemberDashboard LeaderboardTab: add top-3 detected banner, claim button, claimed state display
- App.tsx: add hash routing for `/#/leaderboard` → render PublicLeaderboardPage overlay

### Remove
- Nothing removed

## Implementation Plan
1. Update `main.mo` to add `claimTopReward`, `hasClaimedReward`, `getClaimedRewards` functions
2. Regenerate `backend.d.ts` types
3. Create `PublicLeaderboardPage.tsx` - full leaderboard view without auth, podium for top 3, table for rest
4. Update `MemberDashboard.tsx` LeaderboardTab: detect if user is top 3, show claim banner, handle claim action, show claimed badge
5. Update `App.tsx`: add `/#/leaderboard` hash routing to show PublicLeaderboardPage
6. Add "View Public Leaderboard" link button in LeaderboardTab
