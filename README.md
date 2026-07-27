# Portfolio Josua Pane

Website personal profile dengan Next.js dan Supabase, dilengkapi halaman admin untuk mengelola konten.

## Fitur

- **Home** — Hero section, ringkasan experience, featured projects, dan skills
- **Experience** — Career timeline, pendidikan, leadership, sertifikasi, publikasi
- **Portfolio** — Daftar proyek dengan tags dan filter featured
- **Skills** — Skill groups dengan kategori
- **Contact** — Form kontak + informasi kontak
- **Admin Panel** — Dashboard CRUD untuk profile, experience, projects, skills, dan messages

## Tech Stack

- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS v4
- Supabase (Database + Auth)
- Lucide React (icons)
- Framer Motion

## Quick Start

```bash
npm install
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000)

Tanpa Supabase, website tetap berjalan dengan data seed dari portofolio asli.

## Setup Supabase

1. Buat project di [supabase.com](https://supabase.com)
2. Jalankan `supabase/schema.sql` di SQL Editor
3. Jalankan `supabase/seed.sql` untuk data awal
4. Buat user admin di Authentication → Users
5. Copy `.env.local.example` ke `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

6. Restart dev server

## Koneksi GitHub, Vercel, dan Supabase

1. Push project ini ke repository GitHub milikmu.
2. Import repository itu ke Vercel dari dashboard Vercel.
3. Tambahkan environment variables berikut di Vercel untuk Production, Preview, dan Development:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_SITE_URL=https://your-domain.vercel.app
```

4. Di Supabase Dashboard, buka Authentication → URL Configuration lalu isi:
    - Site URL: domain produksi Vercel kamu
    - Additional Redirect URLs: `http://localhost:3000`, domain preview Vercel, dan domain produksi Vercel
5. Jalankan `supabase/schema.sql` dan `supabase/seed.sql` setelah project Supabase dibuat.
6. Jika ingin membuat akun admin awal, jalankan `node scripts/create-admin.mjs` setelah `.env.local` terisi.

Catatan: repo ini sudah siap untuk local mode tanpa Supabase. Jika env Supabase belum diisi, website tetap tampil dengan data seed.

## Admin Panel

- URL: [http://localhost:3000/admin/login](http://localhost:3000/admin/login)
- Login dengan akun Supabase Auth yang sudah dibuat
- Kelola konten di `/admin`

## Struktur Project

```
src/
├── app/
│   ├── page.tsx              # Home
│   ├── experience/           # Experience page
│   ├── portfolio/            # Portfolio page
│   ├── skills/               # Skills page
│   ├── contact/              # Contact page
│   └── admin/
│       ├── login/            # Admin login
│       └── (panel)/          # Admin dashboard & CRUD
├── components/               # UI components
└── lib/
    ├── data.ts               # Data fetching layer
    ├── seed-data.ts          # Fallback data
    └── supabase/             # Supabase clients
```

## Deploy

Deploy ke Vercel dari repository GitHub yang sudah terhubung, lalu set environment variables Supabase di project settings.

Pastikan juga URL Supabase Auth sudah menunjuk ke domain Vercel supaya login admin dan cookie session bekerja di production.

```bash
npm run build
```
