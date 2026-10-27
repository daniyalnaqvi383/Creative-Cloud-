import { DateTime } from "luxon";
import { Booking } from "../bookingStore";
import { BUSINESS_CONFIG } from "../config";
import { getMeetingLink } from "../zoom";
import { renderEmailBase } from "./baseLayout";

export function getAdminReminderEmail(booking: Booking) {
  const pktDt = DateTime.fromJSDate(booking.startTime, {
    zone: BUSINESS_CONFIG.adminTimezone,
  });
  const estDt = DateTime.fromJSDate(booking.startTime, {
    zone: "America/New_York",
  });

  const subject = `⏰ Reminder: Meeting with ${booking.name} starts in 10 minutes (${pktDt.toFormat("h:mm a")} PKT)`;
  const { url: zoomUrl, passcode } = getMeetingLink(booking);

  const html = renderEmailBase(
    `
    <div style="display: inline-block; padding: 4px 12px; background: rgba(245, 158, 11, 0.2); border: 1px solid rgba(245, 158, 11, 0.4); border-radius: 999px; font-size: 12px; font-weight: 800; color: #f59e0b; margin-bottom: 12px; text-transform: uppercase;">
      ⚡ 10-Minute Call Warning
    </div>

    <h1 style="margin: 0 0 16px 0; font-size: 22px; font-weight: 800; color: #ffffff;">
      Session with ${booking.name} is starting in 10 minutes!
    </h1>

    <div style="background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 12px; padding: 20px; margin-bottom: 24px;">
      <table width="100%" border="0" cellpadding="0" cellspacing="0">
        <tr>
          <td style="padding-bottom: 10px; font-size: 13px; color: #64748b; font-weight: 700;">Client</td>
          <td style="padding-bottom: 10px; font-size: 14px; color: #ffffff; font-weight: 800;">${booking.name}</td>
        </tr>
        <tr>
          <td style="padding-bottom: 10px; font-size: 13px; color: #64748b; font-weight: 700;">Phone</td>
          <td style="padding-bottom: 10px; font-size: 14px; color: #34d399; font-weight: 800;">
            <a href="tel:${booking.phone}" style="color: #34d399; text-decoration: none;">${booking.phone}</a>
          </td>
        </tr>
        <tr>
          <td style="padding-bottom: 10px; font-size: 13px; color: #64748b; font-weight: 700;">Email</td>
          <td style="padding-bottom: 10px; font-size: 14px; color: #38bdf8;">${booking.email}</td>
        </tr>
        <tr>
          <td style="padding-bottom: 10px; font-size: 13px; color: #64748b; font-weight: 700;">Format</td>
          <td style="padding-bottom: 10px; font-size: 14px; color: #ffffff; font-weight: 800; text-transform: uppercase;">
            ${booking.meetingType === "zoom" ? "📹 Zoom Video" : "📞 Phone Call"}
          </td>
        </tr>
        <tr>
          <td style="font-size: 13px; color: #64748b; font-weight: 700;">Time</td>
          <td style="font-size: 14px; color: #f59e0b; font-weight: 800;">
            ${pktDt.toFormat("h:mm a")} PKT <span style="font-size: 12px; color: #94a3b8;">(${estDt.toFormat("h:mm a")} EST)</span>
          </td>
        </tr>
      </table>
    </div>

    ${
      booking.meetingType === "zoom"
        ? `
      <div style="text-align: center; margin: 28px 0;">
        <a href="${zoomUrl}" style="display: inline-block; background: linear-gradient(135deg, #0284c7 0%, #2563eb 100%); color: #ffffff; text-decoration: none; font-weight: 800; font-size: 15px; padding: 14px 32px; border-radius: 999px;">
          Open Zoom Room
        </a>
        <div style="margin-top: 10px; font-size: 12px; color: #94a3b8;">
          Passcode: <strong>${passcode || "None"}</strong>
        </div>
      </div>
    `
        : `
      <div style="text-align: center; margin: 28px 0;">
        <a href="tel:${booking.phone}" style="display: inline-block; background: linear-gradient(135deg, #059669 0%, #10b981 100%); color: #ffffff; text-decoration: none; font-weight: 800; font-size: 15px; padding: 14px 32px; border-radius: 999px;">
          Call ${booking.phone} Now
        </a>
      </div>
    `
    }
  `,
    `Meeting with ${booking.name} starts in 10 minutes at ${pktDt.toFormat("h:mm a")} PKT.`
  );

  const text = `REMINDER: Meeting with ${booking.name} starts in 10 minutes!

Time: ${pktDt.toFormat("h:mm a")} PKT (${estDt.toFormat("h:mm a")} EST)
Platform: ${booking.meetingType}
Phone: ${booking.phone}
${booking.meetingType === "zoom" ? `Zoom: ${zoomUrl} (Passcode: ${passcode})` : ""}
`;

  return { subject, html, text };
}
