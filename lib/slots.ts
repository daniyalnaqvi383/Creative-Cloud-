import { DateTime } from "luxon";
import { BUSINESS_CONFIG } from "./config";
import { BookingStore } from "./bookingStore";

export interface SlotResult {
  time: string;       // Formatted in clientTimezone, e.g. "10:00 AM"
  startUtc: string;   // ISO 8601 string
  endUtc: string;     // ISO 8601 string
  available: boolean; // Whether the slot can be booked
  reason?: string;    // "past", "min_notice", "booked", "outside_hours", "non_working_day"
}

/**
 * Generates all slots for a given date (YYYY-MM-DD) in client timezone (America/New_York).
 * Checks database for already booked slots and compares with current UTC time for notice/past checks.
 */
export async function getSlotsForDate(
  dateStr: string,
  store: BookingStore,
  nowUtc: Date = new Date()
): Promise<SlotResult[]> {
  const tz = BUSINESS_CONFIG.clientTimezone;

  // Parse requested date at midnight in client timezone
  const requestedDay = DateTime.fromFormat(dateStr, "yyyy-MM-dd", { zone: tz });
  if (!requestedDay.isValid) {
    throw new Error(`Invalid date format '${dateStr}', expected YYYY-MM-DD.`);
  }

  // Check if date is within booking window (today through today + bookingWindowDays)
  const currentNowClient = DateTime.fromJSDate(nowUtc, { zone: tz });
  const startOfTodayClient = currentNowClient.startOf("day");
  const maxBookingDateClient = startOfTodayClient.plus({
    days: BUSINESS_CONFIG.bookingWindowDays,
  });

  const isWorkingDay = BUSINESS_CONFIG.workingDays.includes(requestedDay.weekday);

  // Generate slots for the work day
  let slotPointer = requestedDay.set({
    hour: BUSINESS_CONFIG.dayStartHour,
    minute: BUSINESS_CONFIG.dayStartMinute,
    second: 0,
    millisecond: 0,
  });

  const dayEndTime = requestedDay.set({
    hour: BUSINESS_CONFIG.dayEndHour,
    minute: BUSINESS_CONFIG.dayEndMinute,
    second: 0,
    millisecond: 0,
  });

  // Calculate UTC boundary for the entire day to query bookings in a single query
  const dayStartUtc = requestedDay.startOf("day").toJSDate();
  const dayEndUtc = requestedDay.endOf("day").toJSDate();

  const existingBookings = await store.getBookingsForRange(dayStartUtc, dayEndUtc);
  const bookedStartTimestamps = new Set(
    existingBookings.map((b) => b.startTime.getTime())
  );

  const slots: SlotResult[] = [];
  const minNoticeMs = BUSINESS_CONFIG.minimumNoticeMinutes * 60 * 1000;
  const nowMs = nowUtc.getTime();

  while (
    slotPointer.plus({ minutes: BUSINESS_CONFIG.slotDurationMinutes }) <= dayEndTime
  ) {
    const slotEndPointer = slotPointer.plus({
      minutes: BUSINESS_CONFIG.slotDurationMinutes,
    });

    const startUtcDate = slotPointer.toJSDate();
    const endUtcDate = slotEndPointer.toJSDate();
    const startUtcMs = startUtcDate.getTime();

    const formattedTime = slotPointer.toFormat("h:mm a");

    let available = true;
    let reason: string | undefined;

    if (!isWorkingDay) {
      available = false;
      reason = "non_working_day";
    } else if (startOfTodayClient > requestedDay) {
      // Date in past
      available = false;
      reason = "past";
    } else if (requestedDay > maxBookingDateClient) {
      available = false;
      reason = "outside_window";
    } else if (startUtcMs < nowMs) {
      available = false;
      reason = "past";
    } else if (startUtcMs - nowMs < minNoticeMs) {
      available = false;
      reason = "min_notice";
    } else if (bookedStartTimestamps.has(startUtcMs)) {
      available = false;
      reason = "booked";
    }

    slots.push({
      time: formattedTime,
      startUtc: startUtcDate.toISOString(),
      endUtc: endUtcDate.toISOString(),
      available,
      reason,
    });

    // Advance by slotDuration + buffer (e.g. 15 min + 5 min buffer = 20 min)
    slotPointer = slotPointer.plus({ minutes: BUSINESS_CONFIG.totalSlotStepMinutes });
  }

  return slots;
}
