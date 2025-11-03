import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

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
