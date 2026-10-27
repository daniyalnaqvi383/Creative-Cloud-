import { NextRequest, NextResponse } from "next/server";
import { getSlotsForDate } from "@/lib/slots";
import { getBookingStore } from "@/lib/bookingStore";
import { isDbConfigured, isDev } from "@/lib/env";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const dateStr = searchParams.get("date");

    if (!dateStr) {
      return NextResponse.json(
        { success: false, error: "Missing required query parameter 'date' (YYYY-MM-DD)." },
        { status: 400 }
      );
    }

    // Check production configuration
    if (!isDbConfigured() && !isDev) {
      console.error(
        "❌ [PROD 503] /api/slots: MONGODB_URI is not configured in production."
      );
      return NextResponse.json(
        {
          success: false,
          error: "Booking service temporarily unavailable. Database not configured.",
        },
        { status: 503 }
      );
    }

    const store = getBookingStore();
    const slots = await getSlotsForDate(dateStr, store);

    return NextResponse.json({
      success: true,
      date: dateStr,
      slots,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal Server Error";
    console.error("Error in /api/slots:", err);
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
