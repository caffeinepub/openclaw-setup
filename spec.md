# ClawPro

## Current State
- Website ClawPro dengan fitur lengkap: hero, setup section (Windows/macOS/Linux tabs), pricing, leaderboard, dashboard member, email subscribe di PartnerSection
- SetupSection memiliki tab panel Windows, macOS, Linux dalam card dengan border biasa
- PartnerSection punya EmailSubscribeForm dengan input email dan button Subscribe biasa
- NotificationsTab di dashboard sudah ada dengan notifikasi mock
- Leaderboard dengan podium top 3 dan claim reward

## Requested Changes (Diff)

### Add
1. **Notifikasi push (browser) saat user masuk top 3** -- menggunakan Notification API browser. Ketika leaderboard dimuat dan user terdeteksi masuk top 3 untuk pertama kali (atau rank berubah masuk top 3), tampilkan browser push notification "🏆 You're in Top 3!" beserta toast success. Karena email disabled, gunakan browser notification saja. Simpan state di localStorage agar tidak spam.
2. **Banner top 3 notifikasi di NotificationsTab** -- tambahkan notifikasi dinamis di tab Alerts: ketika user isInTop3, tambahkan item notifikasi khusus "🏆 Top 3 Achievement" ke list.

### Modify
3. **Subscribe button & email input di PartnerSection** -- setiap sudut pada input "Enter your email" dan button Subscribe diberi efek glow menyala berputar melingkari sudut. Rekomendasi warna terbaik: input menggunakan gradasi cyan-biru-violet (#00c6ff → #0072ff → #7c3aed) berputar, button Subscribe menggunakan gradasi magenta-cyan (#f0abfc → #22d3ee → #818cf8) berputar. Corner glow animasi rotate 360deg infinite.

4. **Setup Section OS panel corners (Windows, macOS, Linux)** -- setiap card panel OS (`.rounded-xl border border-border bg-card`) di SetupSection diberi corner glow SVG berputar di 4 sudut, masing-masing OS warna berbeda:
   - Windows: biru neon (#0078FF → #00BFFF) rotating corners
   - macOS: silver-white (#E0E8F0 → #FFFFFF → #C0CCD8) rotating corners  
   - Linux: oranye-kuning (#FF6A00 → #FFD700) rotating corners
   Efek: animasi rotasi corner yang sama seperti existing GlowCorner/BlueGlowCorner tapi dengan warna per OS.

### Remove
- Tidak ada yang dihapus

## Implementation Plan
1. **PartnerSection.tsx** -- Buat komponen `SpinningGlowCorner` dengan props `position` dan `colors[]`. Pasang di 4 sudut input email (wrapper relative) dan 4 sudut button Subscribe. Gunakan CSS `@keyframes cornerSpin` atau `animation: spin 3s linear infinite` pada gradient border. Rekomendasi: gunakan `conic-gradient` atau border gradient animasi yang berputar melingkari sudut.

2. **SetupSection.tsx** -- Buat `OSGlowCorner` component dengan prop `os: 'windows'|'macos'|'linux'` dan `position`. Pasang di 4 sudut setiap TabsContent card panel. Gunakan warna Windows=biru, macOS=silver, Linux=oranye.

3. **MemberDashboard.tsx (LeaderboardTab)** -- Di dalam `LeaderboardTab`, tambahkan `useEffect` yang mendeteksi `isInTop3` dan meminta permission browser Notification, lalu fire `new Notification(...)` hanya sekali per session (cek localStorage key `clawpro_top3_notified_${handle}`).

4. **MemberDashboard.tsx (NotificationsTab)** -- Di `NotificationsTab`, terima prop `isInTop3` dan `handle`. Jika isInTop3, inject notifikasi dinamis "🏆 Top 3!" ke daftar notifikasi di atas.
