import { createEvent, EventAttributes } from "ics";
import { DateTime } from "luxon";
import { Booking } from "./bookingStore";
import { BUSINESS_CONFIG } from "./config";

export function generateBookingIcs(booking: Booking): string {
  const startDt = DateTime.fromJSDate(booking.startTime, { zone: "utc" });
  const endDt = DateTime.fromJSDate(booking.endTime, { zone: "utc" });

  const event: EventAttributes = {
    start: [
      startDt.year,
      startDt.month,
      startDt.day,
      startDt.hour,
      startDt.minute,
    ],
    end: [
      endDt.year,
      endDt.month,
      endDt.day,
      endDt.hour,
      endDt.minute,
    ],
    title: `${BUSINESS_CONFIG.companyName} — 15-Min Strategy Session`,
    description:
      booking.meetingType === "zoom"
        ? `1-on-1 Creative Audit & Viral Strategy Session with Creative Cloud directors.\n\nMeeting link will be dispatched to your inbox right when the meeting starts.`
        : `1-on-1 Phone Consultation with Creative Cloud directors.\n\nWe will call you directly at ${booking.phone}.`,
    location:
      booking.meetingType === "zoom"
        ? "Zoom Video Call (Link sent at meeting start)"
        : `Phone Call to ${booking.phone}`,
    url: BUSINESS_CONFIG.siteUrl,
    organizer: {
      name: BUSINESS_CONFIG.companyName,
      email: process.env.ADMIN_EMAIL || "daniyalnaqvi383@gmail.com",
    },
    attendees: [
      {
        name: booking.name,
        email: booking.email,
        rsvp: true,
      },
    ],
    status: "CONFIRMED",
    busyStatus: "BUSY",
  };

  const { error, value } = createEvent(event);
  if (error || !value) {
    console.error("Failed to generate .ics file:", error);
    return "";
  }

  return value;
}
