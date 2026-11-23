import { NextRequest, NextResponse } from "next/server";
import { getAdminPassword, isAdminConfigured, isDev } from "@/lib/env";
import { createAdminToken, ADMIN_COOKIE_NAME } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    if (!isAdminConfigured() && !isDev) {
      console.error("❌ [ADMIN LOGIN 500] ADMIN_PASSWORD or ADMIN_SESSION_SECRET not configured.");
      return NextResponse.json(
        { success: false, error: "Admin authentication is not configured in production." },
        { status: 500 }
      );
    }

    const { email, password } = await request.json();

    if (!password) {
      return NextResponse.json(
        { success: false, error: "Password is required." },
        { status: 400 }
      );
    }

    const expectedPassword = getAdminPassword();
    const expectedEmail = (process.env.ADMIN_EMAIL || "admin@creativecloud.agency").toLowerCase().trim();

    // If an email was provided in the login form, verify it matches
    if (email && typeof email === "string" && email.trim() !== "") {
      const inputEmail = email.toLowerCase().trim();
      if (inputEmail !== expectedEmail && inputEmail !== "admin@creativecloud.agency") {
        return NextResponse.json(
          { success: false, error: "Invalid admin email address." },
          { status: 401 }
        );
      }
    }

    if (password.trim() !== expectedPassword) {
      return NextResponse.json(
        { success: false, error: "Invalid admin password." },
        { status: 401 }
      );
    }

    const token = await createAdminToken();

    const response = NextResponse.json({
      success: true,
      message: "Admin authenticated successfully.",
    });

    response.cookies.set({
      name: ADMIN_COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    return response;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Authentication error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
