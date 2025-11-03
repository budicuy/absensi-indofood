# Sistem Absensi Indofood

Sistem absensi karyawan menggunakan Next.js 16, NextAuth.js v5, Prisma, dan MySQL.

## 🚀 Fitur

- ✅ Autentikasi menggunakan JWT (NextAuth.js v5)
- ✅ Login dengan username dan password
- ✅ Server Actions (tanpa API routes)
- ✅ UI modern dengan gradient dan animasi
- ✅ Toast notifications
- ✅ Protected routes dengan middleware
- ✅ Type-safe dengan TypeScript dan Prisma

## 📋 Prasyarat

- Node.js 20+
- pnpm
- MySQL database

## 🛠️ Instalasi

1. Clone repository

2. Install dependencies:
```bash
pnpm install
```

3. Setup environment variables:
```bash
cp .env.example .env
```

4. Edit `.env` file dengan konfigurasi database dan auth Anda:
```env
DATABASE_URL="mysql://user:password@localhost:3306/absensi_indofood"
AUTH_SECRET="your-secret-key-here"
AUTH_URL="http://localhost:3000"
```

Generate AUTH_SECRET dengan command:
```bash
openssl rand -base64 32
```

5. Generate Prisma Client:
```bash
pnpm prisma generate
```

6. Jalankan migrasi database:
```bash
pnpm prisma migrate dev --name init
```

7. Seed database dengan user dummy:
```bash
pnpm db:seed
```

## 🏃 Menjalankan Aplikasi

Development:
```bash
pnpm dev
```

Production:
```bash
pnpm build
pnpm start
```

## 👤 Login Credentials (Default)

Setelah menjalankan seed:
- **Username**: `admin`
- **Password**: `admin123`

## 📁 Struktur Project

```
├── app/
│   ├── actions/           # Server Actions
│   │   └── auth.ts       # Login/Logout actions
│   ├── api/
│   │   └── auth/         # NextAuth API routes
│   ├── dashboard/        # Dashboard page (protected)
│   ├── login/            # Login page
│   └── layout.tsx        # Root layout
├── lib/
│   ├── auth.ts           # NextAuth configuration
│   ├── prisma.ts         # Prisma client
│   └── generated/        # Generated Prisma types
├── prisma/
│   ├── schema.prisma     # Database schema
│   └── seed.ts          # Database seeder
├── types/
│   └── next-auth.d.ts   # NextAuth type extensions
└── proxy.ts             # Route protection (Next.js 16)
```

## 🔐 Keamanan

- Password di-hash menggunakan bcryptjs (10 rounds)
- JWT session dengan expiry 30 hari
- Protected routes menggunakan proxy.ts (Next.js 16)
- CSRF protection built-in NextAuth

## 🎨 Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Auth**: NextAuth.js v5 (Auth.js)
- **Database**: MySQL + Prisma ORM
- **UI**: Tailwind CSS v4
- **Icons**: Lucide React
- **Notifications**: React Hot Toast
- **Linter**: Biome.js
- **TypeScript**: Full type safety

## 📝 Scripts

- `pnpm dev` - Jalankan development server
- `pnpm build` - Build untuk production
- `pnpm start` - Jalankan production server
- `pnpm lint` - Check code quality
- `pnpm format` - Format code
- `pnpm db:seed` - Seed database

## 🔄 Cara Menambah User Baru

1. Buat password hash:
```typescript
import bcrypt from 'bcryptjs'
const hashedPassword = await bcrypt.hash('yourpassword', 10)
```

2. Insert ke database melalui Prisma Studio:
```bash
pnpm prisma studio
```

Atau via seed script di `prisma/seed.ts`

## 📄 License

MIT
