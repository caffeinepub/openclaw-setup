# ClawPro

## Current State
- App memiliki tab Leaderboard di MemberDashboard dengan data MOCK statis (hardcoded)
- Token dihitung berdasarkan tier membership: Silver=999, Gold=2999, Platinum=7999
- Backend menyimpan: userProfiles (name/bio), userMemberships, userChatbotConfigs
- Tidak ada API backend untuk leaderboard atau reward

## Requested Changes (Diff)

### Add
- Backend: tipe `LeaderboardEntry` dengan field principal, handle, tier, tokens, joinedAt
- Backend: fungsi `getLeaderboard()` -- publik, query, mengembalikan top 50 member diurutkan berdasarkan token descending (tokens dihitung dari tier: Silver=999, Gold=2999, Platinum=7999)
- Backend: fungsi `getMyLeaderboardRank()` -- query, mengembalikan rank dan entry milik caller
- Backend: reward khusus top 3: tipe `TopReward` dengan field rank, badge, title, bonusTokens
- Backend: fungsi `getTopRewards()` -- publik, query, mengembalikan daftar reward top 3
- Frontend: LeaderboardTab mengambil data dari backend via `getLeaderboard()` bukan MOCK
- Frontend: Tampilkan reward khusus top 3 di header leaderboard (crown animasi, badge eksklusif, bonus token)
- Frontend: Podium visual untuk rank 1, 2, 3 dengan efek glow sesuai tier medal
- Frontend: Tombol refresh leaderboard

### Modify
- LeaderboardTab: ganti `MOCK_LEADERBOARD` dengan data real dari backend
- LeaderboardTab: current user rank diambil dari `getMyLeaderboardRank()` bukan dihitung manual
- Backend: `saveCallerUserProfile` tetap, tapi saat save profile juga sync ke leaderboard data

### Remove
- `MOCK_LEADERBOARD` constant dari MemberDashboard.tsx

## Implementation Plan
1. Update `main.mo`: tambah fungsi `getLeaderboard()` yang join userMemberships + userProfiles, hitung token per tier, sort descending, return top 50
2. Update `main.mo`: tambah fungsi `getMyLeaderboardRank()` yang return rank + entry milik caller
3. Update `main.mo`: tambah fungsi `getTopRewards()` yang return reward metadata untuk top 3
4. Regenerate backend.d.ts
5. Update `LeaderboardTab` di MemberDashboard.tsx: fetch dari backend, tampilkan podium top 3 dengan reward badge, refresh button
