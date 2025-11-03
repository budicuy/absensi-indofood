# Quick Start Guide

## Setup Database

1. Buat file `.env` dari template:
```bash
cp .env.example .env
```

2. Edit `.env` dan isi dengan kredensial database MySQL Anda:
```env
DATABASE_URL="mysql://user:password@localhost:3306/absensi_indofood"
AUTH_SECRET="generate-with-command-below"
AUTH_URL="http://localhost:3000"
```

3. Generate AUTH_SECRET:
```bash
openssl rand -base64 32
```
Salin hasilnya ke AUTH_SECRET di file `.env`

## Generate Prisma & Migrate

```bash
# Generate Prisma Client
pnpm prisma generate

# Jalankan migrasi database
pnpm prisma migrate dev --name init

# Seed database dengan user admin
pnpm db:seed
```

## Jalankan Development Server

```bash
pnpm dev
```

Buka browser ke: http://localhost:3000

## Login

- Username: `admin`
- Password: `admin123`

## Struktur File Penting

- `app/actions/auth.ts` - Server actions untuk login/logout
- `app/login/page.tsx` - Halaman login dengan UI modern
- `app/dashboard/page.tsx` - Halaman dashboard (protected)
- `lib/auth.ts` - Konfigurasi NextAuth dengan JWT
- `middleware.ts` - Route protection
- `prisma/schema.prisma` - Database schema
- `prisma/seed.ts` - Script untuk seed data

## Fitur

✅ JWT Authentication dengan NextAuth.js v5
✅ Server Actions (no API routes needed for auth)
✅ Protected routes dengan middleware
✅ Password hashing dengan bcryptjs
✅ Modern UI dengan Tailwind CSS v4
✅ Toast notifications dengan react-hot-toast
✅ Smooth animations dan gradients
✅ Type-safe dengan TypeScript + Prisma
✅ Code quality dengan Biome.js

## Troubleshooting

### Database connection error
- Pastikan MySQL server sudah running
- Periksa kredensial di `.env`
- Pastikan database sudah dibuat

### Prisma generate error
- Jalankan: `pnpm prisma generate`
- Jika masih error, hapus folder `node_modules` dan `pnpm install` ulang

### Login gagal
- Pastikan sudah menjalankan `pnpm db:seed`
- Periksa console untuk error
- Pastikan AUTH_SECRET sudah diisi di `.env`

## Update: Next.js 16 Compatibility

> **Note**: Di Next.js 16, middleware file convention sudah deprecated. Aplikasi ini menggunakan **`proxy.ts`** sebagai pengganti middleware untuk route protection.

### Page Protection dengan Proxy.ts
- **File**: `proxy.ts` di root project
- **Dashboard**: Protected - redirect ke `/login` jika belum login
- **Login**: Redirect ke `/dashboard` jika sudah login
- Session check menggunakan NextAuth `auth()` function

### Cara Kerja Authentication:
1. User akses aplikasi
2. `proxy.ts` check session via NextAuth
3. Redirect otomatis berdasarkan authentication status:
   - Belum login + akses dashboard → redirect ke `/login`
   - Sudah login + akses login page → redirect ke `/dashboard`
4. User login via form di `/login`
5. Server action `loginAction` memvalidasi credentials
6. NextAuth creates JWT session
7. Redirect ke `/dashboard` jika sukses
8. Dashboard page menampilkan data user

