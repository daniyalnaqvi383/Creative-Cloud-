import { NextRequest, NextResponse } from "next/server";
import { isAuthenticatedAdmin } from "@/lib/adminGuard";
import { getBookingStore } from "@/lib/bookingStore";
import { isDbConfigured, isEmailConfigured, isZoomConfigured, isDev, getMissingVars } from "@/lib/env";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const isAuthed = await isAuthenticatedAdmin(request);
    if (!isAuthed) {
      return NextResponse.json({ success: false, error: "Unauthorized access." }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const tabParam = (searchParams.get("tab") || "upcoming") as "upcoming" | "completed" | "cancelled";
    const tab = ["upcoming", "completed", "cancelled"].includes(tabParam) ? tabParam : "upcoming";

    const store = getBookingStore();
    const bookings = await store.getBookingsByTab(tab);

    const diagnostics = {
      isDbConfigured: isDbConfigured(),
      isEmailConfigured: isEmailConfigured(),
      isZoomConfigured: isZoomConfigured(),
      isDev,
      missingVars: getMissingVars(),
    };

    return NextResponse.json({
      success: true,
      tab,
      bookings,
      diagnostics,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal Server Error";
    console.error("Error in GET /api/admin/bookings:", err);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
