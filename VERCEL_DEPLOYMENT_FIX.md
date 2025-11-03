# Vercel Deployment Fix for Prisma

## Problem
Prisma Client could not locate the Query Engine binary (`libquery_engine-rhel-openssl-3.0.x.so.node`) in the Vercel deployment environment.

## Root Cause
1. Custom Prisma output path (`lib/generated/prisma`) wasn't being properly traced by Next.js
2. The `.gitignore` was excluding all generated Prisma files including the binary
3. `outputFileTracingIncludes` was pointing to the wrong path

## Solutions Implemented

### 1. Updated `next.config.ts`
Changed the `outputFileTracingIncludes` to point to the correct custom Prisma path:
```typescript
outputFileTracingIncludes: {
  '/api/**/*': ['./lib/generated/prisma/**/*'],
  '/*': ['./lib/generated/prisma/**/*'],
}
```

### 2. Added `postinstall` Script
Added to `package.json` to ensure Prisma generates after dependency installation:
```json
"postinstall": "prisma generate"
```

### 3. Updated `.gitignore`
Modified to allow `.node` binaries while still ignoring TypeScript files:
```
# Prisma - allow binaries but ignore generated TS files
/lib/generated/prisma/**/*.ts
/lib/generated/prisma/**/*.d.ts
!/lib/generated/prisma/**/*.node
```

### 4. Created `.vercelignore`
Ensures generated Prisma files aren't excluded during deployment.

## Deployment Steps

### For Vercel Dashboard:
1. Commit and push all changes:
   ```bash
   git add .
   git commit -m "fix: Prisma deployment configuration for Vercel"
   git push
   ```

2. In Vercel Dashboard:
   - Go to your project settings
   - Ensure `DATABASE_URL` environment variable is set
   - Redeploy the project

### Environment Variables Required:
- `DATABASE_URL` - Your MySQL database connection string

## Verification

After deployment, check:
1. Build logs show `prisma generate` running successfully
2. No "Query Engine not found" errors
3. Authentication works correctly

## Alternative Solution (If Issues Persist)

If you continue to face issues, consider using the default Prisma output path:

1. Update `prisma/schema.prisma`:
```prisma
generator client {
  provider      = "prisma-client-js"
  binaryTargets = ["native", "rhel-openssl-3.0.x"]
}
```

2. Update imports from:
```typescript
import { PrismaClient } from "./generated/prisma/client"
```
to:
```typescript
import { PrismaClient } from "@prisma/client"
```

3. Update `next.config.ts` to default path:
```typescript
outputFileTracingIncludes: {
  '/api/**/*': ['./node_modules/.prisma/client/**/*'],
  '/*': ['./node_modules/.prisma/client/**/*'],
}
```

## Additional Notes

- The `rhel-openssl-3.0.x` binary target is specifically for Vercel's runtime
- The `postinstall` hook ensures Prisma generates on Vercel's build servers
- Custom output paths require explicit file tracing configuration
