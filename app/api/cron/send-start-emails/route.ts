import { NextRequest, NextResponse } from "next/server";
import { getBookingStore } from "@/lib/bookingStore";
import { getCronSecret, isCronConfigured, isDev, isZoomConfigured } from "@/lib/env";
import { sendEmail } from "@/lib/email";
import { getClientStartEmail } from "@/lib/emails/clientStart";
import { getAdminReminderEmail } from "@/lib/emails/adminReminder";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    // 1. Authorize Cron Runner (Bearer CRON_SECRET)
    if (!isCronConfigured() && !isDev) {
      console.error("❌ [CRON 401] CRON_SECRET is not configured in production.");
      return NextResponse.json(
        { success: false, error: "Cron secret not configured." },
        { status: 401 }
      );
    }

    const authHeader = request.headers.get("authorization") || "";
    const token = authHeader.replace(/^Bearer\s+/i, "").trim();
    const expectedSecret = getCronSecret();

    if (token !== expectedSecret) {
      return NextResponse.json(
        { success: false, error: "Unauthorized cron execution." },
        { status: 401 }
      );
    }

    const store = getBookingStore();
    const now = new Date();

    // 2. Process Meeting Start Emails (Meetings that have reached or just passed their startTime)
    const pendingStarts = await store.findPendingStartEmails(now);
    let startEmailsSent = 0;
    let startEmailsSkipped = 0;

    for (const booking of pendingStarts) {
      // If it's a Zoom meeting and Zoom link is not configured in production, skip and do not mark as sent
      if (booking.meetingType === "zoom" && !isZoomConfigured() && !isDev) {
        console.warn(
          `⚠️ [CRON] Skipping start email for Zoom booking ${booking._id}: ZOOM_MEETING_LINK not configured.`
        );
        startEmailsSkipped++;
        continue;
      }

      // Atomic lock / claim
      const claimed = await store.claimStartEmail(booking._id, now);
      if (!claimed) {
        continue; // Already being processed by another worker
      }

      try {
        const { subject, html, text } = getClientStartEmail(booking);
        const result = await sendEmail({
          to: booking.email,
          subject,
          html,
          text,
        });

        if (result.success) {
          await store.updateBookingFlags(booking._id, { startEmailSent: true });
          startEmailsSent++;
        } else {
          // Release claim for retry on next minute's run
          await store.releaseStartEmailClaim(booking._id);
        }
      } catch (sendErr) {
        console.error(`Failed to dispatch start email for ${booking._id}:`, sendErr);
        await store.releaseStartEmailClaim(booking._id);
      }
    }

    // 3. Process 10-Minute Admin Reminders
    const pendingReminders = await store.findPendingAdminReminders(now);
    let remindersSent = 0;

    for (const booking of pendingReminders) {
      try {
        const adminEmail = process.env.ADMIN_EMAIL || "daniyalnaqvi383@gmail.com";
        const { subject, html, text } = getAdminReminderEmail(booking);

        const result = await sendEmail({
          to: adminEmail,
          subject,
          html,
          text,
        });

        if (result.success) {
          await store.updateBookingFlags(booking._id, { adminReminderSent: true });
          remindersSent++;
        }
      } catch (reminderErr) {
        console.error(`Failed to send admin reminder for ${booking._id}:`, reminderErr);
      }
    }

    return NextResponse.json({
      success: true,
      timestamp: now.toISOString(),
      results: {
        pendingStartsFound: pendingStarts.length,
        startEmailsSent,
        startEmailsSkipped,
        pendingRemindersFound: pendingReminders.length,
        remindersSent,
      },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal Cron Error";
    console.error("Cron execution error:", err);
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
