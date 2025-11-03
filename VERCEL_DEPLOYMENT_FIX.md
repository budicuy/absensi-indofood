# Vercel Deployment Fix for Prisma

## Problem
Prisma Client could not locate the Query Engine binary (`libquery_engine-rhel-openssl-3.0.x.so.node`) in the Vercel deployment environment, causing authentication errors.

## Root Cause
1. **CRITICAL:** Wrong generator provider in `schema.prisma` - was using `"prisma-client"` instead of `"prisma-client-js"`
2. Custom Prisma output path (`lib/generated/prisma`) wasn't being properly traced by Next.js
3. The `.gitignore` was excluding all generated Prisma files including the binary
4. `outputFileTracingIncludes` was pointing to the wrong path

## Solutions Implemented

### 1. **Fixed Prisma Schema Generator** (CRITICAL FIX)
Changed the generator provider from `"prisma-client"` to `"prisma-client-js"`:
```prisma
generator client {
  provider      = "prisma-client-js"  // ← Changed from "prisma-client"
  output        = "../lib/generated/prisma"
  binaryTargets = ["native", "rhel-openssl-3.0.x"]
}
```

### 2. Updated `next.config.ts`
Changed the `outputFileTracingIncludes` to point to the correct custom Prisma path:
```typescript
outputFileTracingIncludes: {
  '/api/**/*': ['./lib/generated/prisma/**/*'],
  '/*': ['./lib/generated/prisma/**/*'],
}
```

### 3. Added `postinstall` Script
Added to `package.json` to ensure Prisma generates after dependency installation:
```json
"postinstall": "prisma generate"
```

### 4. Updated `.gitignore`
Modified to allow `.node` binaries while still ignoring TypeScript files:
```
# Prisma - allow binaries but ignore generated TS files
/lib/generated/prisma/**/*.ts
/lib/generated/prisma/**/*.d.ts
!/lib/generated/prisma/**/*.node
```

### 5. Created `.vercelignore`
Ensures generated Prisma files aren't excluded during deployment.

## Deployment Steps

### 1. Regenerate Prisma Client
```bash
pnpm prisma generate
```

### 2. Commit and Push Changes
```bash
git add .
git commit -m "fix: Prisma deployment configuration for Vercel"
git push
```

### 3. Deploy to Vercel
- In Vercel Dashboard, go to your project settings
- Ensure `DATABASE_URL` environment variable is set
- Redeploy the project

## Environment Variables Required
- `DATABASE_URL` - Your MySQL database connection string

## Verification

After deployment, check:
1. ✅ Build logs show `prisma generate` running successfully
2. ✅ No "Query Engine not found" errors
3. ✅ Authentication works correctly
4. ✅ Database queries execute properly

## Local Testing

Test Prisma connection locally:
```bash
pnpm tsx -e "import 'dotenv/config'; import {prisma} from './lib/prisma'; prisma.user.count().then(c => console.log('Users:', c))"
```

## Why This Fix Works

1. **`prisma-client-js` is the correct provider**: The `"prisma-client"` provider doesn't exist and causes Prisma to generate incomplete client code without binaries
2. **Binary targets include Vercel's runtime**: `rhel-openssl-3.0.x` is specifically for Vercel's deployment environment  
3. **File tracing ensures binaries are deployed**: Next.js needs explicit configuration to include custom Prisma paths
4. **Postinstall ensures generation**: Vercel runs `pnpm install` which triggers Prisma generation automatically

## Troubleshooting

If issues persist:

1. **Check Prisma generation output**:
   ```bash
   pnpm prisma generate
   # Should show: ✔ Generated Prisma Client to ./lib/generated/prisma
   ```

2. **Verify binary exists**:
   ```bash
   ls -lh lib/generated/prisma/*.node
   # Should show: libquery_engine-rhel-openssl-3.0.x.so.node
   ```

3. **Check Vercel build logs** for:
   - `prisma generate` command execution
   - No "file not found" errors for `.node` files

4. **Verify environment variables** in Vercel dashboard
