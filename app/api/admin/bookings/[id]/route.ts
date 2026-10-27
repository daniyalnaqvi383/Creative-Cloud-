import { NextRequest, NextResponse } from "next/server";
import { isAuthenticatedAdmin } from "@/lib/adminGuard";
import { getBookingStore } from "@/lib/bookingStore";
import { sendEmail } from "@/lib/email";
import { getClientCancellationEmail } from "@/lib/emails/clientCancellation";

export const dynamic = "force-dynamic";

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const isAuthed = await isAuthenticatedAdmin(request);
    if (!isAuthed) {
      return NextResponse.json({ success: false, error: "Unauthorized access." }, { status: 401 });
    }

    const { id } = await context.params;
    const body = await request.json();
    const { action } = body;

    if (!["cancel", "complete"].includes(action)) {
      return NextResponse.json(
        { success: false, error: "Invalid action. Must be 'cancel' or 'complete'." },
        { status: 400 }
      );
    }

    const store = getBookingStore();
    const existing = await store.getBookingById(id);

    if (!existing) {
      return NextResponse.json({ success: false, error: "Booking not found." }, { status: 404 });
    }

    const targetStatus = action === "cancel" ? "cancelled" : "completed";
    const updated = await store.updateBookingStatus(id, targetStatus);

    // If cancelled, send cancellation email to client
    if (action === "cancel" && updated) {
      try {
        const { subject, html, text } = getClientCancellationEmail(updated);
        await sendEmail({
          to: updated.email,
          subject,
          html,
          text,
        });
      } catch (cancelEmailErr) {
        console.error("Failed to send cancellation email to client:", cancelEmailErr);
      }
    }

    return NextResponse.json({
      success: true,
      message: `Booking has been marked as ${targetStatus}.`,
      booking: updated,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal Server Error";
    console.error("Error updating booking status:", err);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
