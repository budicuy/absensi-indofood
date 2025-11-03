# Deployment Guide - Vercel

## Prisma Configuration for Vercel

### Changes Made

1. **Binary Targets** - Added `rhel-openssl-3.0.x` for Vercel runtime
   ```prisma
   generator client {
     provider      = "prisma-client"
     output        = "../lib/generated/prisma"
     binaryTargets = ["native", "rhel-openssl-3.0.x"]
   }
   ```

2. **Build Scripts** - Updated package.json
   ```json
   {
     "scripts": {
       "build": "prisma generate && next build",
       "postinstall": "prisma generate"
     }
   }
   ```

3. **Vercel Config** - Created vercel.json
   ```json
   {
     "buildCommand": "prisma generate && next build",
     "installCommand": "pnpm install && prisma generate"
   }
   ```

## Environment Variables

Make sure to set these in Vercel Dashboard:

```env
DATABASE_URL="your_mysql_connection_string"
NEXTAUTH_SECRET="your_secret_key"
NEXTAUTH_URL="https://your-domain.vercel.app"
```

## Deployment Steps

1. Push code to GitHub
2. Connect repository to Vercel
3. Set environment variables in Vercel Dashboard
4. Deploy!

## Troubleshooting

If you get Prisma engine errors:
- Make sure `postinstall` script runs in Vercel build logs
- Check that `binaryTargets` includes `rhel-openssl-3.0.x`
- Verify environment variables are set correctly
