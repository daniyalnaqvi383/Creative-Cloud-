import { DateTime } from "luxon";
import { Booking } from "../bookingStore";
import { BUSINESS_CONFIG } from "../config";
import { renderEmailBase } from "./baseLayout";

export function getClientConfirmationEmail(booking: Booking) {
  const estDt = DateTime.fromJSDate(booking.startTime, {
    zone: "America/New_York",
  });
  const clientDt = DateTime.fromJSDate(booking.startTime, {
    zone: booking.clientTimezone || "America/New_York",
  });

  const formattedDate = clientDt.toFormat("EEEE, MMMM d, yyyy");
  const formattedTimeClient = clientDt.toFormat("h:mm a");
  const formattedTimeEst = estDt.toFormat("h:mm a ZZZZ");

  const isZoom = booking.meetingType === "zoom";
  const platformTitle = isZoom ? "Zoom Video Call" : "Phone Consultation";

  const subject = `Your ${platformTitle} is Confirmed: ${formattedDate} at ${formattedTimeClient}`;

  const platformInstructions = isZoom
    ? `<div style="background: rgba(2, 132, 199, 0.12); border: 1px solid rgba(56, 189, 248, 0.3); border-radius: 12px; padding: 18px 20px; margin-bottom: 24px;">
        <div style="font-size: 14px; font-weight: 700; color: #38bdf8; margin-bottom: 6px;">
          📹 Zoom Security Notice
        </div>
        <p style="margin: 0; font-size: 13px; color: #cbd5e1; line-height: 1.5;">
          For maximum privacy, your <strong>direct Zoom meeting join link and passcode</strong> will be automatically dispatched to this email address <strong>right when your meeting begins</strong>.
        </p>
      </div>`
    : `<div style="background: rgba(16, 185, 129, 0.12); border: 1px solid rgba(52, 211, 153, 0.3); border-radius: 12px; padding: 18px 20px; margin-bottom: 24px;">
        <div style="font-size: 14px; font-weight: 700; color: #34d399; margin-bottom: 6px;">
          📞 Direct Phone Consultation
        </div>
        <p style="margin: 0; font-size: 13px; color: #cbd5e1; line-height: 1.5;">
          Our creative director will call you directly at <strong>${booking.phone}</strong> promptly at your scheduled time. Please keep your phone nearby.
        </p>
      </div>`;

  const html = renderEmailBase(
    `
    <h1 style="margin: 0 0 12px 0; font-size: 24px; font-weight: 800; color: #ffffff; letter-spacing: -0.02em;">
      You're booked, ${booking.name.split(" ")[0]}! 🎉
    </h1>
    <p style="margin: 0 0 24px 0; font-size: 14px; color: #94a3b8; line-height: 1.6;">
      Thank you for scheduling a strategy session with Creative Cloud. We're looking forward to reviewing your social channels and mapping out 3 viral content opportunities you can capitalize on immediately.
    </p>

    <!-- Meeting Details Box -->
    <div style="background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 12px; padding: 20px; margin-bottom: 24px;">
      <table width="100%" border="0" cellpadding="0" cellspacing="0">
        <tr>
          <td style="padding-bottom: 12px; font-size: 13px; color: #64748b; text-transform: uppercase; font-weight: 700; letter-spacing: 0.05em;">
            Date
          </td>
          <td align="right" style="padding-bottom: 12px; font-size: 14px; font-weight: 700; color: #ffffff;">
            ${formattedDate}
          </td>
        </tr>
        <tr>
          <td style="padding-bottom: 12px; font-size: 13px; color: #64748b; text-transform: uppercase; font-weight: 700; letter-spacing: 0.05em;">
            Time
          </td>
          <td align="right" style="padding-bottom: 12px; font-size: 14px; font-weight: 700; color: #f43f5e;">
            ${formattedTimeClient} <span style="font-size: 12px; color: #94a3b8;">(${formattedTimeEst})</span>
          </td>
        </tr>
        <tr>
          <td style="padding-bottom: 12px; font-size: 13px; color: #64748b; text-transform: uppercase; font-weight: 700; letter-spacing: 0.05em;">
            Duration
          </td>
          <td align="right" style="padding-bottom: 12px; font-size: 14px; font-weight: 700; color: #ffffff;">
            ${BUSINESS_CONFIG.slotDurationMinutes} Minutes
          </td>
        </tr>
        <tr>
          <td style="font-size: 13px; color: #64748b; text-transform: uppercase; font-weight: 700; letter-spacing: 0.05em;">
            Platform
          </td>
          <td align="right" style="font-size: 14px; font-weight: 700; color: #ffffff;">
            ${platformTitle}
          </td>
        </tr>
      </table>
    </div>

    ${platformInstructions}

    <!-- Preparation Checklist -->
    <div style="margin-bottom: 24px;">
      <div style="font-size: 13px; font-weight: 700; color: #ffffff; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 10px;">
        How to Prepare for the Call:
      </div>
      <ul style="margin: 0; padding-left: 18px; color: #94a3b8; font-size: 13px; line-height: 1.7;">
        <li>Have your brand's active Instagram, TikTok, or YouTube handles ready.</li>
        <li>Think about your top 1-2 competitor accounts whose pacing or viral reach you admire.</li>
        <li>Be ready to discuss your primary 90-day goal (e.g. brand awareness vs paid UGC ROAS).</li>
      </ul>
    </div>

    <p style="margin: 0; font-size: 13px; color: #64748b; line-height: 1.5;">
      📅 A calendar invitation (.ics) is attached to this email so you can add it directly to Apple Calendar, Google Calendar, or Outlook.
    </p>
  `,
    `Your session with Creative Cloud is confirmed for ${formattedDate} at ${formattedTimeClient}.`
  );

  const text = `Hi ${booking.name},

Your ${platformTitle} with Creative Cloud is confirmed!

Date: ${formattedDate}
Time: ${formattedTimeClient} (${formattedTimeEst})
Duration: ${BUSINESS_CONFIG.slotDurationMinutes} Minutes
Platform: ${platformTitle}

${
  isZoom
    ? "NOTE: Your direct Zoom join link and passcode will be dispatched to this email address right when the meeting starts."
    : `NOTE: We will call you directly at ${booking.phone} at your scheduled time.`
}

Calendar invite (.ics) is attached.

Best regards,
Creative Cloud Agency
${BUSINESS_CONFIG.directPhone}
`;

  return { subject, html, text };
}
