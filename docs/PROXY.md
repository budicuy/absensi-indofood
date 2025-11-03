# Proxy.ts - Route Protection di Next.js 16

## Overview

Di Next.js 16, konvensi file `middleware.ts` sudah deprecated dan digantikan dengan `proxy.ts`. File ini berfungsi untuk melakukan route protection dan redirect logic sebelum request sampai ke page component.

## Konfigurasi

File: `/proxy.ts` (di root project)

```typescript
import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
  const session = await auth();
  const isAuthenticated = !!session?.user;
  const isLoginPage = request.nextUrl.pathname === "/login";
  const isDashboard = request.nextUrl.pathname.startsWith("/dashboard");

  // Redirect ke dashboard jika sudah login dan akses halaman login
  if (isLoginPage && isAuthenticated) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Redirect ke login jika belum login dan akses dashboard
  if (isDashboard && !isAuthenticated) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
```

## Cara Kerja

1. **Session Check**: Menggunakan `auth()` dari NextAuth untuk mendapatkan session
2. **Route Matching**: Matcher regex mengeksekusi proxy untuk semua routes kecuali:
   - `/api/*` - API routes
   - `/_next/static/*` - Static assets
   - `/_next/image/*` - Next.js image optimization
   - `/favicon.ico` - Favicon

3. **Redirect Logic**:
   - User **sudah login** akses `/login` → redirect ke `/dashboard`
   - User **belum login** akses `/dashboard/*` → redirect ke `/login`
   - Route lainnya → continue normal

## Perbedaan dengan Middleware.ts

| Aspek | middleware.ts (Deprecated) | proxy.ts (Next.js 16) |
|-------|---------------------------|----------------------|
| Nama File | `middleware.ts` | `proxy.ts` |
| Export Function | `middleware()` | `proxy()` |
| Status | ⚠️ Deprecated | ✅ Recommended |
| Edge Runtime | Compatible | Compatible |
| Session Access | Via callback | Direct via `auth()` |

## Edge Runtime Compatibility

Proxy.ts berjalan di Edge Runtime yang **tidak mendukung**:
- Prisma Client (database queries)
- Node.js modules (fs, path, crypto, dll)
- bcrypt (gunakan bcryptjs)

✅ Yang **didukung**:
- NextAuth `auth()` function
- Fetch API
- Web APIs
- JWT operations

## Debugging

Untuk debug proxy execution:

```typescript
export async function proxy(request: NextRequest) {
  console.log('[Proxy]', {
    path: request.nextUrl.pathname,
    method: request.method,
    authenticated: !!session?.user
  });
  
  // ... rest of code
}
```

Check output di terminal saat development server running.

## Best Practices

1. **Keep it Lightweight**: Proxy runs on every request, jangan tambahkan heavy logic
2. **No Database Queries**: Edge Runtime tidak support Prisma
3. **Cache Session**: NextAuth sudah handle session caching
4. **Specific Matchers**: Gunakan matcher yang spesifik untuk avoid overhead

## Testing

Test scenarios:
- ✅ Unauthenticated user akses `/dashboard` → redirect ke `/login`
- ✅ Authenticated user akses `/login` → redirect ke `/dashboard`
- ✅ Authenticated user akses `/dashboard` → show dashboard
- ✅ Static assets tidak terblok proxy

## Migration dari middleware.ts

Jika upgrade dari middleware.ts:

1. Rename file: `middleware.ts` → `proxy.ts`
2. Rename function: `export default middleware()` → `export async function proxy()`
3. Update logic jika ada yang incompatible dengan Edge Runtime
4. Test thoroughly

## Troubleshooting

### Error: "Native module not found"
❌ Menggunakan Prisma atau Node.js module di proxy.ts
✅ Gunakan hanya NextAuth `auth()` untuk session check

### Warning: "middleware deprecated"
❌ Masih ada file `middleware.ts`
✅ Hapus `middleware.ts`, gunakan `proxy.ts`

### Routes tidak protected
❌ Matcher config salah
✅ Check config matcher dan path matching logic

## Resources

- [Next.js 16 Proxy Documentation](https://nextjs.org/docs)
- [NextAuth.js v5 Guide](https://authjs.dev/)
- [Edge Runtime](https://nextjs.org/docs/app/building-your-application/rendering/edge-and-nodejs-runtimes)
