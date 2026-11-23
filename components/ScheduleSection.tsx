"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";

interface SlotItem {
  time: string;
  startUtc: string;
  endUtc: string;
  available: boolean;
  reason?: string;
}

interface SelectedDateInfo {
  isoDate: string;
  day: string;
  date: string;
  fullFormatted: string;
}

// Helper: Calculate today's date in America/New_York (EST) timezone
function getNyToday() {
  const now = new Date();
  const iso = now.toLocaleDateString("en-CA", { timeZone: "America/New_York" });
  const [y, m, d] = iso.split("-").map(Number);
  return {
    year: y,
    month: m - 1, // 0-indexed month
    day: d,
    iso,
    midnight: new Date(y, m - 1, d),
  };
}

// Helper: Get initial default selectable working day (today if weekday, or next Monday)
function getInitialSelectableDate(): SelectedDateInfo {
  const today = getNyToday();
  const cursor = new Date(today.year, today.month, today.day);
  // Advance to next working day if currently on weekend (0 = Sun, 6 = Sat)
  while (cursor.getDay() === 0 || cursor.getDay() === 6) {
    cursor.setDate(cursor.getDate() + 1);
  }
  const y = cursor.getFullYear();
  const m = String(cursor.getMonth() + 1).padStart(2, "0");
  const d = String(cursor.getDate()).padStart(2, "0");
  return {
    isoDate: `${y}-${m}-${d}`,
    day: cursor.toLocaleDateString("en-US", { weekday: "short" }),
    date: cursor.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    fullFormatted: cursor.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    }),
  };
}

export default function ScheduleSection() {
  const initialDate = useMemo(() => getInitialSelectableDate(), []);
  const todayInfo = useMemo(() => getNyToday(), []);

  const [viewYear, setViewYear] = useState(todayInfo.year);
  const [viewMonth, setViewMonth] = useState(todayInfo.month);
  const [showCalendar, setShowCalendar] = useState(false);

  // Generate 5 upcoming business days (Mon-Fri) for default quick selection
  const quickDates: SelectedDateInfo[] = useMemo(() => {
    const list: SelectedDateInfo[] = [];
    const today = getNyToday();
    const cursor = new Date(today.year, today.month, today.day);

    while (list.length < 5) {
      const dayOfWeek = cursor.getDay();
      if (dayOfWeek !== 0 && dayOfWeek !== 6) {
        const y = cursor.getFullYear();
        const m = String(cursor.getMonth() + 1).padStart(2, "0");
        const d = String(cursor.getDate()).padStart(2, "0");
        list.push({
          isoDate: `${y}-${m}-${d}`,
          day: cursor.toLocaleDateString("en-US", { weekday: "short" }),
          date: cursor.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
          fullFormatted: cursor.toLocaleDateString("en-US", {
            weekday: "long",
            month: "long",
            day: "numeric",
            year: "numeric",
          }),
        });
      }
      cursor.setDate(cursor.getDate() + 1);
    }
    return list;
  }, []);

  const [meetingType, setMeetingType] = useState<"zoom" | "phone">("zoom");
  const [selectedDate, setSelectedDate] = useState<SelectedDateInfo>(initialDate);
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

  // Navigation bounds: Cannot navigate to past months
  const canGoPrev =
    viewYear > todayInfo.year || (viewYear === todayInfo.year && viewMonth > todayInfo.month);
  const canGoNext =
    viewYear < todayInfo.year || (viewYear === todayInfo.year && viewMonth < todayInfo.month + 2);

  const handlePrevMonth = () => {
    if (canGoPrev) {
      if (viewMonth === 0) {
        setViewYear((y) => y - 1);
        setViewMonth(11);
      } else {
        setViewMonth((m) => m - 1);
      }
    }
  };

  const handleNextMonth = () => {
    if (canGoNext) {
      if (viewMonth === 11) {
        setViewYear((y) => y + 1);
        setViewMonth(0);
      } else {
        setViewMonth((m) => m + 1);
      }
    }
  };

  const handleJumpToday = () => {
    const today = getNyToday();
    setViewYear(today.year);
    setViewMonth(today.month);
    setSelectedDate(getInitialSelectableDate());
  };

  // Calendar days generation for the currently viewed month
  const calendarData = useMemo(() => {
    const today = getNyToday();
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
    const firstDayWeekday = new Date(viewYear, viewMonth, 1).getDay(); // 0=Sun .. 6=Sat
    const leadingBlanks = firstDayWeekday; // Sunday start: 0 blanks for Sunday

    const days: Array<{
      dayNum: number;
      isoDate: string;
      isPast: boolean;
      isToday: boolean;
      isWeekend: boolean;
      isOutsideWindow: boolean;
      isDisabled: boolean;
      dateObj: Date;
    }> = [];

    for (let d = 1; d <= daysInMonth; d++) {
      const dateObj = new Date(viewYear, viewMonth, d);
      const isPast = dateObj < today.midnight; // GUZRI HUI DATES -> DISABLED
      const isToday =
        viewYear === today.year && viewMonth === today.month && d === today.day;
      const weekday = dateObj.getDay();
      const isWeekend = weekday === 0 || weekday === 6;
      const diffDays = Math.round(
        (dateObj.getTime() - today.midnight.getTime()) / (1000 * 60 * 60 * 24)
      );
      const isOutsideWindow = diffDays > 14;
      const isDisabled = isPast || isWeekend || isOutsideWindow;

      const mStr = String(viewMonth + 1).padStart(2, "0");
      const dStr = String(d).padStart(2, "0");
      const isoDate = `${viewYear}-${mStr}-${dStr}`;

      days.push({
        dayNum: d,
        isoDate,
        isPast,
        isToday,
        isWeekend,
        isOutsideWindow,
        isDisabled,
        dateObj,
      });
    }

    const monthLabel = new Date(viewYear, viewMonth, 1).toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    });

    return { leadingBlanks, days, monthLabel };
  }, [viewYear, viewMonth]);

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

  const handleSelectDay = (item: (typeof calendarData.days)[0]) => {
    if (item.isDisabled) return;
    setSelectedDate({
      isoDate: item.isoDate,
      day: item.dateObj.toLocaleDateString("en-US", { weekday: "short" }),
      date: item.dateObj.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      fullFormatted: item.dateObj.toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
      }),
    });
    setSelectedSlot(null);
    setSubmitError(null);
  };

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
        if (res.status === 409 || data.slotTaken) {
          setSubmitError(
            data.error || "This time slot was just reserved by another client. Please pick another time."
          );
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
          `🎉 ${typeLabel} Confirmed!\n\nHey ${formData.name || "Friend"}, your 15-minute social media growth audit is scheduled for ${selectedDate.fullFormatted} at ${selectedSlot.time}.\n\n${
            meetingType === "zoom"
              ? "A calendar invite (.ics) has been dispatched to " + (formData.email || "your email") + ". Direct Zoom link will arrive right at start time!"
              : "Our creative director will call you at " + (formData.phone || "+1 (802) 265-0207") + "."
          }`
        );
        setFormData({ name: "", phone: "", email: "", handle: "", honeypot: "" });
        setConfirmed(false);
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
              <div className="platform-selector-grid">
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

              {/* Step 2: Date Selector (5 Quick Date Pills + Expandable Calendar) */}
              <div style={{ marginBottom: "1.5rem" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "0.75rem",
                    flexWrap: "wrap",
                    gap: "0.5rem",
                  }}
                >
                  <div className="scheduler-step-label" style={{ marginBottom: 0 }}>
                    2. Select Preferred Date
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowCalendar((prev) => !prev)}
                    className={`btn-toggle-calendar ${showCalendar ? "active" : ""}`}
                    aria-expanded={showCalendar}
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                      <line x1="16" y1="2" x2="16" y2="6" />
                      <line x1="8" y1="2" x2="8" y2="6" />
                      <line x1="3" y1="10" x2="21" y2="10" />
                    </svg>
                    <span>{showCalendar ? "✕ Close Calendar" : "📅 Pick From Calendar"}</span>
                  </button>
                </div>

                {/* 5 Quick Upcoming Dates (Always visible by default: "pehle wese hi 5 dates or slots") */}
                <div className="date-slots-grid">
                  {quickDates.map((item) => {
                    const isSelected = selectedDate.isoDate === item.isoDate;
                    return (
                      <button
                        key={item.isoDate}
                        type="button"
                        onClick={() => {
                          setSelectedDate(item);
                          setSelectedSlot(null);
                        }}
                        className={`date-pill-btn ${isSelected ? "selected" : ""}`}
                      >
                        <span className="day-name">{item.day}</span>
                        <span className="day-date">{item.date}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Custom Date Notice (if user picked a date beyond the 5 quick pills) */}
                {!quickDates.some((q) => q.isoDate === selectedDate.isoDate) && (
                  <div
                    style={{
                      marginTop: "0.6rem",
                      padding: "0.45rem 0.8rem",
                      background: "rgba(16, 185, 129, 0.12)",
                      border: "1px solid rgba(16, 185, 129, 0.35)",
                      borderRadius: "8px",
                      fontSize: "0.82rem",
                      color: "#34d399",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: "0.5rem",
                    }}
                  >
                    <span>
                      📅 Custom Date Selected: <strong>{selectedDate.fullFormatted}</strong>
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedDate(quickDates[0]);
                        setSelectedSlot(null);
                      }}
                      style={{
                        background: "none",
                        border: "none",
                        color: "#94a3b8",
                        cursor: "pointer",
                        fontSize: "0.75rem",
                        textDecoration: "underline",
                      }}
                    >
                      Reset to Quick Dates
                    </button>
                  </div>
                )}

                {/* Interactive Month Calendar Widget (toggled via button) */}
                {showCalendar && (
                  <div className="calendar-widget" style={{ marginTop: "0.85rem" }}>
                    {/* Calendar Month & Navigation Controls */}
                    <div className="calendar-header">
                      <div className="calendar-month-title">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                          <line x1="16" y1="2" x2="16" y2="6" />
                          <line x1="8" y1="2" x2="8" y2="6" />
                          <line x1="3" y1="10" x2="21" y2="10" />
                        </svg>
                        <span>{calendarData.monthLabel}</span>
                      </div>

                      <div className="calendar-nav-controls">
                        {canGoPrev && (
                          <button
                            type="button"
                            className="calendar-today-btn"
                            onClick={handleJumpToday}
                            title="Return to current month"
                          >
                            Today
                          </button>
                        )}
                        <button
                          type="button"
                          className="calendar-nav-btn"
                          onClick={handlePrevMonth}
                          disabled={!canGoPrev}
                          title={canGoPrev ? "Previous Month" : "Cannot navigate to past months"}
                          aria-label="Previous Month"
                        >
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <polyline points="15 18 9 12 15 6" />
                          </svg>
                        </button>
                        <button
                          type="button"
                          className="calendar-nav-btn"
                          onClick={handleNextMonth}
                          disabled={!canGoNext}
                          title={canGoNext ? "Next Month" : "Booking window limit"}
                          aria-label="Next Month"
                        >
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <polyline points="9 18 15 12 9 6" />
                          </svg>
                        </button>
                      </div>
                    </div>

                    {/* Weekday Row */}
                    <div className="calendar-weekdays">
                      {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((dayName, idx) => (
                        <div
                          key={dayName}
                          className={`calendar-weekday-col ${idx === 0 || idx === 6 ? "weekend" : ""}`}
                        >
                          {dayName}
                        </div>
                      ))}
                    </div>

                    {/* Days Grid */}
                    <div className="calendar-days-grid">
                      {/* Empty placeholder cells for month starting weekday */}
                      {Array.from({ length: calendarData.leadingBlanks }).map((_, idx) => (
                        <div key={`blank-${idx}`} className="calendar-day-empty" aria-hidden="true" />
                      ))}

                      {/* Day Cells */}
                      {calendarData.days.map((item) => {
                        const isSelected = selectedDate.isoDate === item.isoDate;
                        return (
                          <button
                            key={item.isoDate}
                            type="button"
                            disabled={item.isDisabled}
                            onClick={() => handleSelectDay(item)}
                            className={`calendar-day-btn ${isSelected ? "selected" : ""} ${
                              item.isToday ? "today" : ""
                            } ${item.isDisabled ? "disabled" : ""} ${
                              item.isWeekend ? "weekend" : ""
                            }`}
                            title={
                              item.isPast
                                ? "Past date cannot be selected"
                                : item.isWeekend
                                ? "Agency closed on weekends"
                                : item.isOutsideWindow
                                ? "Booking window is up to 14 days in advance"
                                : item.isToday
                                ? "Today — Available for booking"
                                : `Select ${item.dateObj.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}`
                            }
                            aria-label={item.dateObj.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
                          >
                            <span>{item.dayNum}</span>
                          </button>
                        );
                      })}
                    </div>

                    {/* Selected Date Summary Banner */}
                    <div className="calendar-selected-summary">
                      <div className="date-text">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                        <span>Selected: <strong>{selectedDate.fullFormatted}</strong></span>
                      </div>
                      <span className="status-badge">Available • 15-Min Slot</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Step 3: Select Time */}
              <div style={{ marginBottom: "1.5rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem", flexWrap: "wrap", gap: "0.4rem" }}>
                  <div className="scheduler-step-label" style={{ marginBottom: 0 }}>
                    3. Select Time for {selectedDate.day}, {selectedDate.date} (EST)
                  </div>
                  {loadingSlots && (
                    <span style={{ fontSize: "0.75rem", color: "var(--primary)", display: "flex", alignItems: "center", gap: "0.3rem" }}>
                      <svg style={{ animation: "spin 1s linear infinite" }} width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <circle cx="12" cy="12" r="10" strokeOpacity="0.25" />
                        <path d="M12 2a10 10 0 0 1 10 10" strokeLinecap="round" />
                      </svg>
                      <span>Checking slots...</span>
                    </span>
                  )}
                </div>

                {slotsError ? (
                  <div style={{ fontSize: "0.82rem", color: "#fca5a5", padding: "0.65rem 0.9rem", background: "rgba(239, 68, 68, 0.12)", border: "1px solid rgba(239, 68, 68, 0.3)", borderRadius: "8px" }}>
                    ⚠️ {slotsError}
                  </div>
                ) : slots.length === 0 && !loadingSlots ? (
                  <div style={{ fontSize: "0.84rem", color: "#94a3b8", padding: "0.75rem 1rem", background: "rgba(255, 255, 255, 0.03)", borderRadius: "8px", border: "1px dashed rgba(255, 255, 255, 0.1)" }}>
                    No slots remaining for this date. Please choose another business day on the calendar above.
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
                            opacity: s.available ? 1 : 0.3,
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
                      background: "rgba(239, 68, 68, 0.15)",
                      border: "1px solid rgba(239, 68, 68, 0.4)",
                      color: "#fca5a5",
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
                    color: "#ffffff",
                    background: confirmed
                      ? "#10b981"
                      : meetingType === "zoom"
                      ? "linear-gradient(135deg, #0284c7 0%, #2563eb 50%, #1d4ed8 100%)"
                      : "linear-gradient(135deg, #059669 0%, #10b981 50%, #00f59b 100%)",
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
