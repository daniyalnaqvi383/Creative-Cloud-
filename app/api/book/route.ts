import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { DateTime } from "luxon";
import { getBookingStore, SlotAlreadyBookedError } from "@/lib/bookingStore";
import { isDbConfigured, isDev } from "@/lib/env";
import { BUSINESS_CONFIG } from "@/lib/config";
import { checkRateLimit } from "@/lib/rateLimit";
import { generateBookingIcs } from "@/lib/ics";
import { sendEmail } from "@/lib/email";
import { getClientConfirmationEmail } from "@/lib/emails/clientConfirmation";
import { getAdminNewBookingEmail } from "@/lib/emails/adminNewBooking";

export const dynamic = "force-dynamic";

const bookingSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(80),
  email: z.string().trim().email("Please provide a valid email address"),
  phone: z.string().trim().min(6, "Please provide a valid phone number").max(30),
  socialHandle: z.string().trim().max(50).optional().default(""),
  meetingType: z.enum(["zoom", "phone"]),
  startUtc: z.string().datetime({ message: "Invalid startUtc ISO timestamp" }),
  clientTimezone: z.string().optional().default(BUSINESS_CONFIG.clientTimezone),
  honeypot: z.string().optional().default(""),
});

export async function POST(request: NextRequest) {
  try {
    // 1. Check production database availability
    if (!isDbConfigured() && !isDev) {
      console.error(
        "❌ [PROD 503] /api/book: MONGODB_URI is not configured in production."
      );
      return NextResponse.json(
        {
          success: false,
          error: "Booking service temporarily unavailable. Database not configured.",
        },
        { status: 503 }
      );
    }

    // 2. IP Rate Limiting (5 requests per 10 minutes)
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      "127.0.0.1";

    const { allowed } = checkRateLimit(ip, 5, 10 * 60 * 1000);
    if (!allowed) {
      return NextResponse.json(
        {
          success: false,
          error: "Too many booking attempts. Please wait a few minutes before trying again.",
        },
        { status: 429 }
      );
    }

    // 3. Body Parsing & Validation
    const body = await request.json();
    const parseResult = bookingSchema.safeParse(body);

    if (!parseResult.success) {
      const firstIssue = parseResult.error.issues[0];
      return NextResponse.json(
        { success: false, error: firstIssue.message },
        { status: 400 }
      );
    }

    const data = parseResult.data;

    // Honeypot check (anti-bot)
    if (data.honeypot && data.honeypot.trim() !== "") {
      console.warn(`[BOT DETECTED] Honeypot filled by IP ${ip}: ${data.honeypot}`);
      return NextResponse.json(
        { success: false, error: "Invalid request submission." },
        { status: 400 }
      );
    }

    // 4. Server-Side Slot Validation & Time Bounds
    const startUtcDate = new Date(data.startUtc);
    const now = new Date();
    const minNoticeMs = BUSINESS_CONFIG.minimumNoticeMinutes * 60 * 1000;

    if (startUtcDate.getTime() < now.getTime()) {
      return NextResponse.json(
        { success: false, error: "This time slot is in the past. Please choose an upcoming time." },
        { status: 400 }
      );
    }

    if (startUtcDate.getTime() - now.getTime() < minNoticeMs) {
      return NextResponse.json(
        {
          success: false,
          error: `Appointments must be scheduled at least ${BUSINESS_CONFIG.minimumNoticeMinutes} minutes in advance.`,
        },
        { status: 400 }
      );
    }

    // Check maximum booking window (14 days)
    const maxDate = new Date(now.getTime() + BUSINESS_CONFIG.bookingWindowDays * 24 * 60 * 60 * 1000);
    if (startUtcDate.getTime() > maxDate.getTime()) {
      return NextResponse.json(
        {
          success: false,
          error: `Appointments can only be scheduled up to ${BUSINESS_CONFIG.bookingWindowDays} days in advance.`,
        },
        { status: 400 }
      );
    }

    // Calculate end time
    const endUtcDate = new Date(
      startUtcDate.getTime() + BUSINESS_CONFIG.slotDurationMinutes * 60 * 1000
    );

    const store = getBookingStore();

    // 5. Block the same email from booking multiple sessions at the exact same time
    const hasConflict = await store.checkEmailConflict(data.email, startUtcDate);
    if (hasConflict) {
      return NextResponse.json(
        {
          success: false,
          error: "You already have a confirmed meeting at this exact time slot.",
        },
        { status: 409 }
      );
    }

    // 6. Insert Booking (protected by atomic unique index or in-memory check)
    let booking;
    try {
      booking = await store.createBooking({
        name: data.name,
        email: data.email,
        phone: data.phone,
        socialHandle: data.socialHandle,
        meetingType: data.meetingType,
        startTime: startUtcDate,
        endTime: endUtcDate,
        clientTimezone: data.clientTimezone,
      });
    } catch (err: unknown) {
      if (err instanceof SlotAlreadyBookedError) {
        return NextResponse.json(
          {
            success: false,
            error: "This time slot was just reserved by another client. Please select another time.",
            slotTaken: true,
          },
          { status: 409 }
        );
      }
      throw err;
    }

    // 7. Dispatch Emails Asynchronously
    // Note: Booking remains saved even if email delivery encounters an error
    (async () => {
      try {
        const icsContent = generateBookingIcs(booking);
        const { subject: clientSub, html: clientHtml, text: clientText } =
          getClientConfirmationEmail(booking);

        const clientSendRes = await sendEmail({
          to: booking.email,
          subject: clientSub,
          html: clientHtml,
          text: clientText,
          attachments: icsContent
            ? [
                {
                  filename: "meeting.ics",
                  content: icsContent,
                  contentType: "text/calendar; charset=utf-8; method=REQUEST",
                },
              ]
            : undefined,
        });

        if (clientSendRes.success) {
          await store.updateBookingFlags(booking._id, { confirmationEmailSent: true });
        }
      } catch (clientEmailErr) {
        console.error("Failed to send client confirmation email:", clientEmailErr);
      }

      try {
        const adminEmail = process.env.ADMIN_EMAIL || "daniyalnaqvi383@gmail.com";
        const upcomingBookings = await store.getBookingsByTab("upcoming");
        const { subject: adminSub, html: adminHtml, text: adminText } =
          getAdminNewBookingEmail(booking, upcomingBookings);

        const adminSendRes = await sendEmail({
          to: adminEmail,
          subject: adminSub,
          html: adminHtml,
          text: adminText,
        });

        if (adminSendRes.success) {
          await store.updateBookingFlags(booking._id, { adminEmailSent: true });
        }
      } catch (adminEmailErr) {
        console.error("Failed to send admin notification email:", adminEmailErr);
      }
    })().catch((bgErr) => console.error("Background email process error:", bgErr));

    return NextResponse.json(
      {
        success: true,
        message: "Meeting confirmed successfully!",
        booking: {
          id: booking._id,
          name: booking.name,
          email: booking.email,
          meetingType: booking.meetingType,
          startTime: booking.startTime.toISOString(),
          endTime: booking.endTime.toISOString(),
        },
      },
      { status: 201 }
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal Server Error";
    console.error("Error in /api/book:", err);
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
