import { Booking } from "./bookingStore";
import { isDev, isZoomConfigured } from "./env";

export interface MeetingDetails {
  url: string;
  passcode: string;
  isPlaceholder?: boolean;
}

/**
 * Returns the Zoom meeting link and passcode for a booking.
 * Centralized here so unique dynamic Zoom API links can be generated later
 * without touching any email templates or booking controllers.
 */
export function getMeetingLink(_booking?: Booking): MeetingDetails {
  const envLink = process.env.ZOOM_MEETING_LINK?.trim() || "";
  const envPasscode = process.env.ZOOM_PASSCODE?.trim() || "";

  if (isZoomConfigured()) {
    return {
      url: envLink,
      passcode: envPasscode,
      isPlaceholder: false,
    };
  }

  if (isDev) {
    return {
      url: "https://zoom.us/j/00000000000?pwd=dev_zoom_placeholder",
      passcode: "123456",
      isPlaceholder: true,
    };
  }

  return {
    url: "",
    passcode: "",
    isPlaceholder: false,
  };
}
