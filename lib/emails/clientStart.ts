import { Booking } from "../bookingStore";
import { getMeetingLink } from "../zoom";
import { renderEmailBase } from "./baseLayout";

export function getClientStartEmail(booking: Booking) {
  const isZoom = booking.meetingType === "zoom";
  const { url: zoomUrl, passcode } = getMeetingLink(booking);

  const subject = isZoom
    ? `Your Meeting is Starting Now: Join Here 🚀`
    : `We Are Calling You Now: Creative Cloud Discovery Call 📞`;

  const zoomContent = `
    <h1 style="margin: 0 0 12px 0; font-size: 24px; font-weight: 800; color: #ffffff; letter-spacing: -0.02em;">
      Your Zoom session is live, ${booking.name.split(" ")[0]}! 🎥
    </h1>
    <p style="margin: 0 0 24px 0; font-size: 14px; color: #94a3b8; line-height: 1.6;">
      Our creative directors are in the room waiting for you. Click the button below to join immediately.
    </p>

    <!-- Big CTA Button -->
    <div style="text-align: center; margin: 32px 0;">
      <a href="${zoomUrl}" style="display: inline-block; background: linear-gradient(135deg, #0284c7 0%, #2563eb 100%); color: #ffffff; text-decoration: none; font-weight: 800; font-size: 16px; padding: 16px 36px; border-radius: 999px; box-shadow: 0 8px 24px rgba(37, 99, 235, 0.45); letter-spacing: 0.02em;">
        👉 Join Zoom Meeting Now
      </a>
    </div>

    <!-- Passcode & Link Box -->
    <div style="background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 12px; padding: 18px; margin-bottom: 24px;">
      <div style="font-size: 13px; color: #64748b; margin-bottom: 6px;">Passcode (if prompted):</div>
      <div style="font-size: 18px; font-weight: 800; color: #f43f5e; font-family: monospace; letter-spacing: 0.1em;">
        ${passcode || "No passcode required"}
      </div>
      <div style="margin-top: 12px; font-size: 12px; color: #64748b; word-break: break-all;">
        Direct Link: <a href="${zoomUrl}" style="color: #38bdf8; text-decoration: underline;">${zoomUrl}</a>
      </div>
    </div>
  `;

  const phoneContent = `
    <h1 style="margin: 0 0 12px 0; font-size: 24px; font-weight: 800; color: #ffffff; letter-spacing: -0.02em;">
      We're calling you right now, ${booking.name.split(" ")[0]}! 📞
    </h1>
    <p style="margin: 0 0 24px 0; font-size: 14px; color: #94a3b8; line-height: 1.6;">
      Our studio director is dialing your phone number: <strong style="color: #34d399;">${booking.phone}</strong>.
    </p>

    <div style="background: rgba(16, 185, 129, 0.1); border: 1px solid rgba(52, 211, 153, 0.3); border-radius: 12px; padding: 20px; text-align: center; margin: 24px 0;">
      <div style="font-size: 16px; font-weight: 700; color: #34d399; margin-bottom: 6px;">
        Incoming Call Expected
      </div>
      <div style="font-size: 13px; color: #cbd5e1;">
        Please answer when your phone rings. If you miss our call, you can dial our studio line directly at +1 (802) 265-0207.
      </div>
    </div>
  `;

  const html = renderEmailBase(
    isZoom ? zoomContent : phoneContent,
    isZoom ? "Your meeting has started. Join now!" : "Your phone call has started."
  );

  const text = isZoom
    ? `Hi ${booking.name},

Your Zoom session with Creative Cloud is starting right now!

Join Link: ${zoomUrl}
Passcode: ${passcode || "None"}

See you inside!
Creative Cloud Agency
`
    : `Hi ${booking.name},

We are calling you right now at ${booking.phone} for your scheduled consultation!

See you on the call!
Creative Cloud Agency
`;

  return { subject, html, text };
}
