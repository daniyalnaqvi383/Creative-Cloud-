import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";
import { ADMIN_COOKIE_NAME } from "./lib/auth";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only protect /admin and /api/admin paths
  const isAdminRoute = pathname.startsWith("/admin");
  const isAdminApiRoute = pathname.startsWith("/api/admin");

  if (!isAdminRoute && !isAdminApiRoute) {
    return NextResponse.next();
  }

  // Allow login endpoints through without auth
  if (pathname === "/admin/login" || pathname === "/api/admin/login") {
    return NextResponse.next();
  }

  const token = request.cookies.get(ADMIN_COOKIE_NAME)?.value;
  let isValid = false;

  if (token) {
    try {
      const secret = process.env.ADMIN_SESSION_SECRET?.trim() || "dev_secret_key_creative_cloud_super_session_32_bytes_min";
      const key = new TextEncoder().encode(secret);
      const { payload } = await jwtVerify(token, key);
      if (payload.role === "admin") {
        isValid = true;
      }
    } catch {
      isValid = false;
    }
  }

  if (!isValid) {
    if (isAdminApiRoute) {
      return NextResponse.json(
        { success: false, error: "Unauthorized. Admin session required." },
        { status: 401 }
      );
    }

    // Redirect browser pages to login
    const loginUrl = new URL("/admin/login", request.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
