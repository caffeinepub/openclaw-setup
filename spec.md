# ClawPro

## Current State
Dashboard user (MemberDashboard.tsx) dan admin (AdminDashboardPanel.tsx) sudah ada tapi mengalami masalah:
- Panel/card/sidebar tidak terlihat semua (mungkin overflow hidden, z-index issues, atau warna yang menyatu dengan background)
- Background tidak terlihat jelas di belakang konten
- Warna teks tidak kontras dengan background
- Admin panel kurang fitur

## Requested Changes (Diff)

### Add
- Admin panel: fitur Settings (site config, admin profile, security), Analytics (chart user growth, tier distribution, activity heatmap), Notifications panel, User Roles management, Broadcast Message ke semua user, System Logs viewer
- Dashboard user & admin: semua panel/card/sidebar visible penuh, tidak ada clipping/overflow tersembunyi
- Warna premium: deep navy/charcoal base, dengan accent cyan (#00E5FF), gold (#FFD700), violet (#A855F7) - solid tidak transparan

### Modify
- MemberDashboard.tsx: fix semua panel visibility, perbaiki warna kontras text vs background, solid dark backgrounds untuk semua card/sidebar sections, semua tab (Profile, ClawBot, WhatsApp, Telegram, ChatGPT, Price Alert, Settings, Activity, Stats, Tasks, System Status, Leaderboard, Notifications, Services) visible dan accessible
- AdminDashboardPanel.tsx: fix visibility semua panel, dark solid backgrounds, tambah fitur baru (Settings, Analytics, Notifications, Broadcast, System Logs, User Roles), perbaiki layout responsif
- Background: StarBackground tetap ada, konten di atasnya solid (tidak transparan)

### Remove
- Tidak ada

## Implementation Plan
1. Baca isi MemberDashboard.tsx dan AdminDashboardPanel.tsx secara lengkap
2. Perbaiki MemberDashboard: solid backgrounds semua section, semua tab visible, warna kontras, glow effects pada border
3. Perbaiki AdminDashboardPanel: solid backgrounds, tambah 6 fitur baru (Settings, Analytics, Notifications, Broadcast, System Logs, User Roles), layout responsif
4. Pastikan tidak ada transparency yang mengganggu keterbacaan
5. Validate build
