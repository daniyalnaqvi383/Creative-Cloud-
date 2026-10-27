import { DateTime } from "luxon";
import { Booking } from "../bookingStore";
import { BUSINESS_CONFIG } from "../config";
import { renderEmailBase } from "./baseLayout";

export function getAdminNewBookingEmail(
  booking: Booking,
  upcomingBookings: Booking[]
) {
  const pktDt = DateTime.fromJSDate(booking.startTime, {
    zone: BUSINESS_CONFIG.adminTimezone,
  });
  const estDt = DateTime.fromJSDate(booking.startTime, {
    zone: "America/New_York",
  });

  const formattedDatePkt = pktDt.toFormat("EEEE, MMMM d, yyyy");
  const formattedTimePkt = pktDt.toFormat("h:mm a ZZZZ");
  const formattedTimeEst = estDt.toFormat("h:mm a ZZZZ");

  const subject = `New Booking: ${booking.name} on ${pktDt.toFormat("MMM d")} at ${pktDt.toFormat("h:mm a")} PKT`;

  // Filter only upcoming meetings starting >= now
  const now = new Date();
  const filteredUpcoming = upcomingBookings
    .filter((b) => b.status === "confirmed" && b.startTime >= now)
    .sort((a, b) => a.startTime.getTime() - b.startTime.getTime());

  const upcomingRowsHtml =
    filteredUpcoming.length === 0
      ? `<tr><td colspan="6" style="padding: 16px; text-align: center; color: #64748b; font-size: 13px;">No other upcoming sessions scheduled.</td></tr>`
      : filteredUpcoming
          .map((b, idx) => {
            const bPkt = DateTime.fromJSDate(b.startTime, {
              zone: BUSINESS_CONFIG.adminTimezone,
            });
            const bEst = DateTime.fromJSDate(b.startTime, {
              zone: "America/New_York",
            });
            const isCurrent = b._id === booking._id;

            return `
        <tr style="border-bottom: 1px solid rgba(255, 255, 255, 0.05); ${
          isCurrent ? "background: rgba(244, 63, 94, 0.08);" : ""
        }">
          <td style="padding: 10px 8px; font-size: 12px; color: ${isCurrent ? "#f43f5e" : "#94a3b8"}; font-weight: 700;">
            #${idx + 1}
          </td>
          <td style="padding: 10px 8px; font-size: 12px; color: #ffffff; white-space: nowrap;">
            ${bPkt.toFormat("MMM d, yyyy")}
          </td>
          <td style="padding: 10px 8px; font-size: 12px; color: #ffffff; white-space: nowrap;">
            <strong>${bPkt.toFormat("h:mm a")}</strong> <span style="font-size: 10px; color: #94a3b8;">(${bEst.toFormat("h:mm a")} EST)</span>
          </td>
          <td style="padding: 10px 8px; font-size: 12px; color: #ffffff;">
            ${b.name}<br/>
            <span style="font-size: 11px; color: #38bdf8;">${b.email}</span>
          </td>
          <td style="padding: 10px 8px; font-size: 12px; color: #cbd5e1; white-space: nowrap;">
            ${b.phone}<br/>
            <span style="font-size: 11px; color: #a855f7;">${b.socialHandle || "—"}</span>
          </td>
          <td style="padding: 10px 8px; font-size: 11px; font-weight: 700; text-transform: uppercase; color: ${
            b.meetingType === "zoom" ? "#38bdf8" : "#34d399"
          };">
            ${b.meetingType}
          </td>
        </tr>`;
          })
          .join("");

  const html = renderEmailBase(
    `
    <div style="display: inline-block; padding: 4px 12px; background: rgba(16, 185, 129, 0.2); border: 1px solid rgba(16, 185, 129, 0.4); border-radius: 999px; font-size: 12px; font-weight: 800; color: #34d399; margin-bottom: 12px; text-transform: uppercase;">
      ✦ Direct Lead Captured
    </div>

    <h1 style="margin: 0 0 16px 0; font-size: 22px; font-weight: 800; color: #ffffff;">
      New Strategy Session Booked!
    </h1>

    <!-- Client Details Card -->
    <div style="background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 12px; padding: 20px; margin-bottom: 28px;">
      <table width="100%" border="0" cellpadding="0" cellspacing="0">
        <tr>
          <td style="padding-bottom: 10px; font-size: 13px; color: #64748b; font-weight: 700; width: 140px;">Client Name</td>
          <td style="padding-bottom: 10px; font-size: 14px; color: #ffffff; font-weight: 800;">${booking.name}</td>
        </tr>
        <tr>
          <td style="padding-bottom: 10px; font-size: 13px; color: #64748b; font-weight: 700;">Email Address</td>
          <td style="padding-bottom: 10px; font-size: 14px; color: #38bdf8;">
            <a href="mailto:${booking.email}" style="color: #38bdf8; text-decoration: none;">${booking.email}</a>
          </td>
        </tr>
        <tr>
          <td style="padding-bottom: 10px; font-size: 13px; color: #64748b; font-weight: 700;">Phone Number</td>
          <td style="padding-bottom: 10px; font-size: 14px; color: #34d399;">
            <a href="tel:${booking.phone}" style="color: #34d399; text-decoration: none;">${booking.phone}</a>
          </td>
        </tr>
        <tr>
          <td style="padding-bottom: 10px; font-size: 13px; color: #64748b; font-weight: 700;">Social Handle</td>
          <td style="padding-bottom: 10px; font-size: 14px; color: #f43f5e; font-weight: 700;">
            ${booking.socialHandle || "Not provided"}
          </td>
        </tr>
        <tr>
          <td style="padding-bottom: 10px; font-size: 13px; color: #64748b; font-weight: 700;">Meeting Platform</td>
          <td style="padding-bottom: 10px; font-size: 14px; color: #ffffff; font-weight: 800; text-transform: uppercase;">
            ${booking.meetingType === "zoom" ? "📹 Zoom Video Call" : "📞 Direct Phone Call"}
          </td>
        </tr>
        <tr>
          <td style="padding-bottom: 10px; font-size: 13px; color: #64748b; font-weight: 700;">Pakistan Time</td>
          <td style="padding-bottom: 10px; font-size: 14px; color: #f59e0b; font-weight: 800;">
            ${formattedDatePkt} at ${formattedTimePkt}
          </td>
        </tr>
        <tr>
          <td style="font-size: 13px; color: #64748b; font-weight: 700;">New York (EST)</td>
          <td style="font-size: 13px; color: #cbd5e1;">${formattedTimeEst}</td>
        </tr>
      </table>
    </div>

    <!-- Upcoming Meetings Table -->
    <div style="margin-top: 28px;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
        <span style="font-size: 14px; font-weight: 800; color: #ffffff; text-transform: uppercase; letter-spacing: 0.05em;">
          📅 Upcoming Confirmed Schedule (${filteredUpcoming.length})
        </span>
      </div>

      <div style="background: rgba(0, 0, 0, 0.4); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 12px; overflow-x: auto;">
        <table width="100%" border="0" cellpadding="0" cellspacing="0" style="text-align: left; border-collapse: collapse;">
          <thead>
            <tr style="border-bottom: 1px solid rgba(255, 255, 255, 0.1); background: rgba(255, 255, 255, 0.02);">
              <th style="padding: 10px 8px; font-size: 11px; color: #64748b; text-transform: uppercase;">#</th>
              <th style="padding: 10px 8px; font-size: 11px; color: #64748b; text-transform: uppercase;">Date</th>
              <th style="padding: 10px 8px; font-size: 11px; color: #64748b; text-transform: uppercase;">Time</th>
              <th style="padding: 10px 8px; font-size: 11px; color: #64748b; text-transform: uppercase;">Client</th>
              <th style="padding: 10px 8px; font-size: 11px; color: #64748b; text-transform: uppercase;">Contact</th>
              <th style="padding: 10px 8px; font-size: 11px; color: #64748b; text-transform: uppercase;">Type</th>
            </tr>
          </thead>
          <tbody>
            ${upcomingRowsHtml}
          </tbody>
        </table>
      </div>
    </div>
  `,
    `New booking from ${booking.name} on ${pktDt.toFormat("MMM d")} at ${pktDt.toFormat("h:mm a")} PKT.`
  );

  const text = `NEW BOOKING RECEIVED:

Client: ${booking.name}
Email: ${booking.email}
Phone: ${booking.phone}
Handle: ${booking.socialHandle || "None"}
Platform: ${booking.meetingType}
Pakistan Time: ${formattedDatePkt} at ${formattedTimePkt}
EST Time: ${formattedTimeEst}

Upcoming Confirmed Meetings (${filteredUpcoming.length}):
${filteredUpcoming
  .map((b, i) => {
    const p = DateTime.fromJSDate(b.startTime, {
      zone: BUSINESS_CONFIG.adminTimezone,
    });
    return `${i + 1}. ${p.toFormat("MMM d, h:mm a")} PKT - ${b.name} (${b.meetingType})`;
  })
  .join("\n")}
`;

  return { subject, html, text };
}
