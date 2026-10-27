/**
 * Business Configuration for Meeting Scheduler
 * Easily editable by developer or client.
 */

export const BUSINESS_CONFIG = {
  // Brand & Company
  companyName: "Creative Cloud Agency",
  siteUrl: process.env.SITE_URL || "https://creativecloud.agency",
  supportEmail: "hello@creativecloud.agency",
  directPhone: "+1 (802) 265-0207",

  // Timezones (Luxon IANA names, DST-safe)
  clientTimezone: "America/New_York", // Displayed to clients booking calls
  adminTimezone: "Asia/Karachi",       // Displayed in admin dashboard & admin alerts

  // Working Hours (in clientTimezone)
  // 1 = Monday, 2 = Tuesday, 3 = Wednesday, 4 = Thursday, 5 = Friday, 6 = Saturday, 7 = Sunday
  workingDays: [1, 2, 3, 4, 5],
  dayStartHour: 9,   // 09:00 AM New York time
  dayStartMinute: 0,
  dayEndHour: 18,    // 06:00 PM New York time
  dayEndMinute: 0,

  // Meeting Durations & Spacing
  slotDurationMinutes: 15,
  slotBufferMinutes: 5, // Gap after each meeting
  totalSlotStepMinutes: 20, // 15 min meeting + 5 min buffer = 20 min step

  // Booking Constraints
  bookingWindowDays: 14,       // Client can book up to 14 days in advance
  minimumNoticeMinutes: 60,    // Cannot book a slot less than 60 minutes from now

  // Meeting Defaults
  meetingTitle: "Creative Cloud — Discovery & Strategy Session",
  meetingDescription:
    "15-minute creative audit and viral content blueprint review with Creative Cloud directors.",
};
