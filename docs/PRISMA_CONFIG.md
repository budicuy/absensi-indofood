# Prisma Configuration - Migrasi ke prisma.config.ts

## Overview

Sejak Prisma 6, konfigurasi di `package.json#prisma` sudah deprecated dan akan dihapus di Prisma 7. Proyek ini sudah menggunakan `prisma.config.ts` sebagai gantinya.

## Struktur File

### prisma.config.ts
```typescript
import * as dotenv from "dotenv";
import { defineConfig, env } from "prisma/config";

dotenv.config();

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  engine: "classic",
  datasource: {
    url: env("DATABASE_URL"),
  },
});
```

### Seed Configuration

Karena `seed` belum tersedia di type definition prisma.config.ts, konfigurasi seed tetap menggunakan npm script di `package.json`:

```json
{
  "scripts": {
    "db:seed": "tsx prisma/seed.ts"
  }
}
```

### prisma/seed.ts

File seed sudah diupdate untuk load environment variables:

```typescript
import "dotenv/config";  // ✅ Load .env file
import bcrypt from "bcryptjs";
import { PrismaClient } from "../lib/generated/prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");
  
  const hashedPassword = await bcrypt.hash("admin123", 10);
  
  const user = await prisma.user.upsert({
    where: { username: "admin" },
    update: {},
    create: {
      username: "admin",
      password: hashedPassword,
      name: "Administrator",
    },
  });
  
  console.log("✅ User created:", user);
  console.log("📝 Login credentials:");
  console.log("   Username: admin");
  console.log("   Password: admin123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

## Commands

### Generate Prisma Client
```bash
pnpm prisma generate
```

### Run Migrations
```bash
pnpm prisma migrate dev --name migration_name
```

### Seed Database
```bash
# Recommended - menggunakan npm script
pnpm db:seed

# Alternatif - prisma native command (akan ada warning)
pnpm prisma db seed
```

## Perubahan dari Package.json

### ❌ Before (Deprecated)
```json
{
  "prisma": {
    "seed": "tsx prisma/seed.ts"
  }
}
```

### ✅ After (Current)
```typescript
// prisma.config.ts
export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  engine: "classic",
  datasource: {
    url: env("DATABASE_URL"),
  },
});

// package.json
{
  "scripts": {
    "db:seed": "tsx prisma/seed.ts"
  }
}
```

## Benefits

1. **✅ No Deprecation Warnings**: Warning `package.json#prisma` deprecated sudah hilang
2. **✅ Better Type Safety**: Full TypeScript support di config
3. **✅ Centralized Config**: Semua konfigurasi Prisma di satu file
4. **✅ Environment Variables**: Direct access via `env()` helper
5. **✅ Future-proof**: Siap untuk Prisma 7

## Troubleshooting

### Warning: "package.json#prisma is deprecated"
✅ **Fixed** - Sudah dihapus dari package.json

### Error: "Environment variable not found: DATABASE_URL"
✅ **Fixed** - Tambahkan `import "dotenv/config"` di seed.ts

### Seed tidak berjalan
```bash
# Pastikan file .env ada dan berisi DATABASE_URL
# Gunakan npm script:
pnpm db:seed
```

## Migration Checklist

- [x] Buat `prisma.config.ts` dengan defineConfig
- [x] Hapus `prisma` property dari `package.json`
- [x] Update `prisma/seed.ts` dengan dotenv import
- [x] Test generate: `pnpm prisma generate`
- [x] Test migrate: `pnpm prisma migrate dev`
- [x] Test seed: `pnpm db:seed`
- [x] No deprecation warnings

## Resources

- [Prisma Config Documentation](https://pris.ly/prisma-config)
- [Prisma 6 Migration Guide](https://www.prisma.io/docs/guides/upgrade-guides/upgrading-versions/upgrading-to-prisma-6)
