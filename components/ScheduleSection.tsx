"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";

interface SlotItem {
  time: string;
  startUtc: string;
  endUtc: string;
  available: boolean;
  reason?: string;
}

interface DateItem {
  day: string;
  date: string;
  isoDate: string;
}

export default function ScheduleSection() {
  // Generate next 4 business days dynamically
  const dates: DateItem[] = useMemo(() => {
    const list: DateItem[] = [];
    const cursor = new Date();

    while (list.length < 4) {
      const dayOfWeek = cursor.getDay();
      // Skip Saturday (6) and Sunday (0)
      if (dayOfWeek !== 0 && dayOfWeek !== 6) {
        const day = cursor.toLocaleDateString("en-US", { weekday: "short" });
        const date = cursor.toLocaleDateString("en-US", { month: "short", day: "numeric" });
        const year = cursor.getFullYear();
        const month = String(cursor.getMonth() + 1).padStart(2, "0");
        const dayNum = String(cursor.getDate()).padStart(2, "0");
        list.push({
          day,
          date,
          isoDate: `${year}-${month}-${dayNum}`,
        });
      }
      cursor.setDate(cursor.getDate() + 1);
    }
    return list;
  }, []);

  const [meetingType, setMeetingType] = useState<"zoom" | "phone">("zoom");
  const [selectedDate, setSelectedDate] = useState<DateItem>(dates[0]);
  const [slots, setSlots] = useState<SlotItem[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<SlotItem | null>(null);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [slotsError, setSlotsError] = useState<string | null>(null);

  const [submitting, setSubmitting] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    handle: "",
    honeypot: "",
  });

  // Fetch real-time available slots for selected date
  const fetchSlots = useCallback(async (dateIso: string) => {
    setLoadingSlots(true);
    setSlotsError(null);
    setSubmitError(null);
    try {
      const res = await fetch(`/api/slots?date=${dateIso}`);
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to load slots");
      }
      const fetchedSlots: SlotItem[] = data.slots || [];
      setSlots(fetchedSlots);

      // Select first available slot by default
      const firstAvailable = fetchedSlots.find((s) => s.available);
      setSelectedSlot(firstAvailable || null);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Unable to retrieve available times";
      setSlotsError(message);
      setSlots([]);
      setSelectedSlot(null);
    } finally {
      setLoadingSlots(false);
    }
  }, []);

  // Fetch on mount and when date changes
  useEffect(() => {
    if (selectedDate?.isoDate) {
      fetchSlots(selectedDate.isoDate);
    }
  }, [selectedDate, fetchSlots]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSlot) {
      setSubmitError("Please choose an available time slot before confirming.");
      return;
    }

    setSubmitting(true);
    setSubmitError(null);

    try {
      const res = await fetch("/api/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone,
          email: formData.email,
          socialHandle: formData.handle,
          meetingType,
          startUtc: selectedSlot.startUtc,
          clientTimezone: Intl.DateTimeFormat().resolvedOptions().timeZone || "America/New_York",
          honeypot: formData.honeypot,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        // If slot was taken by someone else concurrently
        if (res.status === 409 || data.slotTaken) {
          setSubmitError(
            data.error || "This time slot was just reserved by another client. Please pick another time."
          );
          // Refresh slots to show accurate availability
          fetchSlots(selectedDate.isoDate);
          return;
        }
        throw new Error(data.error || "Failed to schedule appointment");
      }

      // Success
      setConfirmed(true);
      const typeLabel = meetingType === "zoom" ? "📹 1-on-1 Zoom Video Call" : "📞 Direct Phone Call";

      setTimeout(() => {
        alert(
          `🎉 ${typeLabel} Confirmed!\n\nHey ${formData.name || "Friend"}, your 15-minute social media growth audit is scheduled for ${selectedDate.day}, ${selectedDate.date} at ${selectedSlot.time}.\n\n${
            meetingType === "zoom"
              ? "A calendar invite (.ics) has been dispatched to " + (formData.email || "your email") + ". Direct Zoom link will arrive right at start time!"
              : "Our creative director will call you at " + (formData.phone || "+1 (802) 265-0207") + "."
          }`
        );
        setFormData({ name: "", phone: "", email: "", handle: "", honeypot: "" });
        setConfirmed(false);
        // Refresh slots for updated state
        fetchSlots(selectedDate.isoDate);
      }, 700);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Submission error. Please try again.";
      setSubmitError(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="section schedule-section" id="schedule">
      <div className="container">
        <div className="schedule-card-wrapper">
          {/* Left: Call Benefits & Immediate Contact Options */}
          <div className="schedule-info">
            <span className="section-pill-tag">Discovery Session</span>
            <h2>
              Ready to ignite your <span className="gradient-title">social presence</span>?
            </h2>
            <p>
              Book a free 15-minute creative audit. We&apos;ll review your current profiles, reveal 3 viral content opportunities you&apos;re missing, and outline our custom content plan via direct Zoom meeting or phone call.
            </p>

            {/* Direct Instant Call Banner */}
            <div className="instant-call-banner">
              <div>
                <div className="subtext">Need immediate answers? Call our studio director:</div>
                <a href="tel:+18022650207" className="phone-number">
                  📞 +1 (802) 265-0207
                </a>
              </div>
              <a
                href="tel:+18022650207"
                className="magnetic-btn btn-glow-phone"
                style={{ padding: "0.55rem 1.1rem", fontSize: "0.85rem" }}
              >
                Call Now
              </a>
            </div>

            <ul className="booking-checklist">
              <li>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span><strong>Direct Zoom Video Meeting</strong> or phone consultation</span>
              </li>
              <li>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span>Custom viral content blueprint tailored to your brand</span>
              </li>
              <li>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span>Review of your competitors&apos; top-performing video hooks</span>
              </li>
              <li>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span>Direct line to studio directors: <strong>+1 (802) 265-0207</strong></span>
              </li>
            </ul>
          </div>

          {/* Right: Interactive Meeting Scheduler Widget with Zoom & Phone Options */}
          <div className="scheduler-box">
            {/* Step 1: Meeting Format Selector (Zoom vs Phone) */}
            <div style={{ marginBottom: "1.25rem" }}>
              <div className="scheduler-step-label">1. Choose Meeting Platform</div>
              <div className="platform-selector-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))", gap: "0.85rem", width: "100%" }}>
                <button
                  type="button"
                  onClick={() => setMeetingType("zoom")}
                  style={{
                    background: meetingType === "zoom" ? "linear-gradient(135deg, #0284c7, #2563eb)" : "rgba(255, 255, 255, 0.04)",
                    border: `1.5px solid ${meetingType === "zoom" ? "#38bdf8" : "rgba(255, 255, 255, 0.1)"}`,
                    color: "#fff",
                    borderRadius: "var(--radius-sm)",
                    padding: "0.75rem 0.6rem",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "0.5rem",
                    fontWeight: 700,
                    fontSize: "0.85rem",
                    cursor: "pointer",
                    boxShadow: meetingType === "zoom" ? "0 4px 18px rgba(37, 99, 235, 0.45)" : "none",
                    transition: "all 0.2s ease",
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <polygon points="23 7 16 12 23 17 23 7" />
                    <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
                  </svg>
                  <span>Zoom Video Call</span>
                </button>

                <button
                  type="button"
                  onClick={() => setMeetingType("phone")}
                  style={{
                    background: meetingType === "phone" ? "linear-gradient(135deg, #059669, #10b981)" : "rgba(255, 255, 255, 0.04)",
                    border: `1.5px solid ${meetingType === "phone" ? "#34d399" : "rgba(255, 255, 255, 0.1)"}`,
                    color: "#fff",
                    borderRadius: "var(--radius-sm)",
                    padding: "0.75rem 0.6rem",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "0.5rem",
                    fontWeight: 700,
                    fontSize: "0.85rem",
                    cursor: "pointer",
                    boxShadow: meetingType === "phone" ? "0 4px 18px rgba(16, 185, 129, 0.45)" : "none",
                    transition: "all 0.2s ease",
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                  <span>Phone Consultation</span>
                </button>
              </div>

              {meetingType === "zoom" ? (
                <div style={{ fontSize: "0.75rem", color: "#38bdf8", marginTop: "0.5rem", display: "flex", alignItems: "center", gap: "0.35rem" }}>
                  <span>✓ Zoom invite link with calendar invite will be automatically dispatched to your email.</span>
                </div>
              ) : (
                <div style={{ fontSize: "0.75rem", color: "#34d399", marginTop: "0.5rem", display: "flex", alignItems: "center", gap: "0.35rem" }}>
                  <span>✓ We will call you directly at your provided phone number at the selected time.</span>
                </div>
              )}
            </div>

            <form id="meetingScheduleForm" onSubmit={handleSubmit}>
              {/* Anti-bot honeypot field (hidden from real users) */}
              <input
                type="text"
                name="user_note_hp"
                value={formData.honeypot}
                onChange={(e) => setFormData({ ...formData, honeypot: e.target.value })}
                style={{ display: "none" }}
                tabIndex={-1}
                autoComplete="off"
              />

              {/* Step 2: Select Day */}
              <div style={{ marginBottom: "1.25rem" }}>
                <div className="scheduler-step-label">2. Select Preferred Date</div>
                <div className="date-slots-grid">
                  {dates.map((d, idx) => {
                    const isSelected = selectedDate.isoDate === d.isoDate;
                    return (
                      <button
                        key={idx}
                        type="button"
                        className={`date-pill-btn ${isSelected ? "selected" : ""}`}
                        onClick={() => setSelectedDate(d)}
                      >
                        <div className="day-name">{d.day}</div>
                        <div className="day-date">{d.date}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Step 3: Select Time */}
              <div style={{ marginBottom: "1.5rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
                  <div className="scheduler-step-label" style={{ marginBottom: 0 }}>
                    3. Select Time (EST)
                  </div>
                  {loadingSlots && (
                    <span style={{ fontSize: "0.75rem", color: "var(--primary)" }}>
                      Checking slots...
                    </span>
                  )}
                </div>

                {slotsError ? (
                  <div style={{ fontSize: "0.8rem", color: "#fb7185", padding: "0.5rem", background: "rgba(244,63,94,0.1)", borderRadius: "8px" }}>
                    {slotsError}
                  </div>
                ) : slots.length === 0 && !loadingSlots ? (
                  <div style={{ fontSize: "0.8rem", color: "#94a3b8", padding: "0.5rem" }}>
                    No slots available for this date.
                  </div>
                ) : (
                  <div className="time-slots-grid">
                    {slots.map((s, idx) => {
                      const isSelected = selectedSlot?.startUtc === s.startUtc;
                      return (
                        <button
                          key={idx}
                          type="button"
                          disabled={!s.available}
                          className={`time-pill-btn ${isSelected ? "selected" : ""}`}
                          style={{
                            opacity: s.available ? 1 : 0.35,
                            cursor: s.available ? "pointer" : "not-allowed",
                            textDecoration: s.available ? "none" : "line-through",
                          }}
                          onClick={() => {
                            if (s.available) {
                              setSelectedSlot(s);
                              setSubmitError(null);
                            }
                          }}
                          title={!s.available ? (s.reason === "booked" ? "Already reserved" : "Unavailable") : undefined}
                        >
                          {s.time}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Step 4: Contact Inputs */}
              <div className="scheduler-inputs">
                <input
                  type="text"
                  id="schedName"
                  className="scheduler-input"
                  placeholder="Your Name or Brand"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
                <input
                  type="tel"
                  id="schedPhone"
                  className="scheduler-input"
                  placeholder="Phone Number (e.g. +1 802-265-0207)"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
                <input
                  type="email"
                  id="schedEmail"
                  className="scheduler-input"
                  placeholder="Your Email Address (for Zoom invite)"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
                <input
                  type="text"
                  id="schedHandle"
                  className="scheduler-input"
                  placeholder="Your Social Handle (e.g. @brand on IG/TikTok)"
                  value={formData.handle}
                  onChange={(e) => setFormData({ ...formData, handle: e.target.value })}
                />

                {submitError && (
                  <div
                    style={{
                      background: "rgba(244, 63, 94, 0.15)",
                      border: "1px solid rgba(244, 63, 94, 0.4)",
                      color: "#fb7185",
                      padding: "0.65rem 0.9rem",
                      borderRadius: "8px",
                      fontSize: "0.82rem",
                      lineHeight: 1.4,
                    }}
                  >
                    ⚠️ {submitError}
                  </div>
                )}

                <button
                  type="submit"
                  className="magnetic-btn btn-primary"
                  style={{
                    width: "100%",
                    padding: "1rem",
                    marginTop: "0.5rem",
                    background: confirmed
                      ? "#10b981"
                      : meetingType === "zoom"
                      ? "linear-gradient(135deg, #0284c7 0%, #2563eb 50%, #1d4ed8 100%)"
                      : undefined,
                  }}
                  disabled={submitting || confirmed || !selectedSlot}
                >
                  {submitting ? (
                    <>
                      <svg
                        style={{ animation: "spin 1s linear infinite" }}
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <circle cx="12" cy="12" r="10" strokeOpacity="0.25" />
                        <path d="M12 2a10 10 0 0 1 10 10" strokeLinecap="round" />
                      </svg>
                      <span>Reserving Your Slot...</span>
                    </>
                  ) : confirmed ? (
                    <>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      <span>
                        {meetingType === "zoom" ? "Zoom Meeting Confirmed!" : "Phone Call Confirmed!"}
                      </span>
                    </>
                  ) : (
                    <>
                      <span>
                        {meetingType === "zoom"
                          ? "Confirm 1-on-1 Zoom Meeting"
                          : "Confirm Phone Consultation"}
                      </span>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <polyline points="9 18 15 12 9 6" />
                      </svg>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
