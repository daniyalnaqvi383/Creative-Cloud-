import { DateTime } from "luxon";
import { Booking } from "../bookingStore";
import { BUSINESS_CONFIG } from "../config";
import { renderEmailBase } from "./baseLayout";

export function getClientCancellationEmail(booking: Booking) {
  const clientDt = DateTime.fromJSDate(booking.startTime, {
    zone: booking.clientTimezone || "America/New_York",
  });

  const formattedDate = clientDt.toFormat("EEEE, MMMM d, yyyy");
  const formattedTime = clientDt.toFormat("h:mm a");

  const subject = `Your Session with Creative Cloud Has Been Cancelled`;

  const html = renderEmailBase(
    `
    <h1 style="margin: 0 0 12px 0; font-size: 22px; font-weight: 800; color: #ffffff;">
      Session Cancelled
    </h1>
    <p style="margin: 0 0 20px 0; font-size: 14px; color: #94a3b8; line-height: 1.6;">
      Hi ${booking.name.split(" ")[0]}, your scheduled strategy session on <strong>${formattedDate} at ${formattedTime}</strong> has been cancelled.
    </p>

    <div style="background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 12px; padding: 20px; margin-bottom: 24px;">
      <p style="margin: 0 0 10px 0; font-size: 13px; color: #cbd5e1; line-height: 1.5;">
        This time slot has been released. If this was a mistake or you wish to choose another convenient time, feel free to book a new appointment at your convenience:
      </p>
      <div style="text-align: center; margin-top: 16px;">
        <a href="${BUSINESS_CONFIG.siteUrl}/#schedule" style="display: inline-block; background: #f43f5e; color: #ffffff; text-decoration: none; font-weight: 700; font-size: 14px; padding: 12px 28px; border-radius: 999px;">
          Reschedule New Session
        </a>
      </div>
    </div>

    <p style="margin: 0; font-size: 12px; color: #64748b;">
      Direct Studio Line: ${BUSINESS_CONFIG.directPhone}
    </p>
  `,
    `Your session on ${formattedDate} at ${formattedTime} has been cancelled.`
  );

  const text = `Hi ${booking.name},

Your strategy session on ${formattedDate} at ${formattedTime} has been cancelled.

To reschedule a new time, visit: ${BUSINESS_CONFIG.siteUrl}/#schedule

Best regards,
Creative Cloud Agency
`;

  return { subject, html, text };
}
