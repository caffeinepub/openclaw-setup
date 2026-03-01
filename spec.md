# OpenClaw Setup

## Current State
Website setup OpenClaw dengan fitur: hero animasi, features grid, setup guide per OS, config builder interaktif, dokumentasi bertab, changelog timeline, stats counter, dan admin panel. Backend sudah memiliki FAQ, Changelog, DownloadStats, SavedConfig, dan UserProfile. Frontend dibangun dengan React + Tailwind (dark mode).

## Requested Changes (Diff)

### Add
- Tipe data `MembershipTier` (`silver`, `gold`, `platinum`) dan `MembershipPlan` di backend
- State `userMemberships` (Map Principal -> MembershipTier) di backend
- Backend functions: `purchaseMembership(tier)`, `getMyMembership()`, `getMembershipStats()` (admin)
- Halaman / section `PricingSection` di frontend yang menampilkan 3 kartu harga: Silver, Gold, Platinum
- Tombol "Beli Sekarang" per tier -- jika user sudah login, langsung panggil `purchaseMembership`; jika belum login, tampilkan pesan "Login dulu"
- Badge tier membership di Navbar setelah user login
- Total member counts di StatsSection

### Modify
- `App.tsx` -- tambahkan `<PricingSection />` setelah `<FeaturesSection />`
- `StatsSection` -- tampilkan statistik total member
- `Navbar` -- tampilkan badge tier jika user punya membership aktif

### Remove
- Tidak ada yang dihapus

## Implementation Plan
1. Tambah tipe `MembershipTier` dan `MembershipPlan` di backend Motoko
2. Tambah state `userMemberships` dan `nextMembershipId`
3. Tambah fungsi `purchaseMembership`, `getMyMembership`, `getMembershipStats` di backend
4. Regenerasi `backend.d.ts` via `generate_motoko_code`
5. Buat komponen `PricingSection.tsx` dengan 3 kartu tier (Silver / Gold / Platinum), masing-masing dengan daftar fitur, harga simbolik (ICP), dan tombol beli
6. Update `App.tsx` untuk menyertakan `PricingSection`
7. Update `Navbar.tsx` untuk menampilkan badge tier
8. Update `StatsSection.tsx` untuk menampilkan total member
