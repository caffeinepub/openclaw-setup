# ClawPro

## Current State
- Dashboard member memiliki tab: Profile, Configs, Bot, AI, API, Transactions
- TierLandingPage menampilkan harga dalam ICP (e.g. "5 ICP", "15 ICP", "35 ICP") di bagian price dan tombol CTA
- Explore Benefits button ada di PricingSection yang membuka TierLandingPage

## Requested Changes (Diff)

### Add
- Tab **Leaderboard** baru di MemberDashboard: menampilkan peringkat member berdasarkan token (data mock/lokal), tampilkan posisi user saat ini, top 10 member, badge medali (#1 emas, #2 perak, #3 bronze)
- Tab **Notifications** baru di MemberDashboard: daftar notifikasi sistem untuk member (welcome, token earned, tier upgrade, dll) dengan badge unread count di tab
- Sidebar kiri dashboard: tambahkan link/icon untuk Leaderboard dan Notifications

### Modify
- TierLandingPage: ganti semua referensi "ICP" di bagian price display menjadi jumlah token (Silver = 999 token, Gold = 2,999 token, Platinum = 7,999 token) berdasarkan konversi $1 = 100 token
- TierLandingPage: tombol CTA "Get Silver — X ICP" dan "Unlock Silver for X ICP" ganti ke token display
- TierLandingPage: disclaimer/note tentang "billed in ICP tokens" perlu disesuaikan
- TabsList di MemberDashboard: tambah tab Leaderboard dan Notifications

### Remove
- Tidak ada yang dihapus

## Implementation Plan
1. Update TierLandingPage: ganti ICP display menjadi token display (hitung dari price * 100)
2. Tambah komponen LeaderboardTab di MemberDashboard
3. Tambah komponen NotificationsTab di MemberDashboard
4. Update TabsList untuk include kedua tab baru
5. Update sidebar kiri dengan integrasi link ke kedua tab baru
