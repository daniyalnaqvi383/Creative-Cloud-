"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { DateTime } from "luxon";

interface BookingItem {
  _id: string;
  name: string;
  email: string;
  phone: string;
  socialHandle?: string;
  meetingType: "zoom" | "phone";
  startTime: string;
  endTime: string;
  status: "confirmed" | "completed" | "cancelled";
  confirmationEmailSent: boolean;
  adminEmailSent: boolean;
  startEmailSent: boolean;
  adminReminderSent: boolean;
  createdAt: string;
}

interface Diagnostics {
  isDbConfigured: boolean;
  isEmailConfigured: boolean;
  isZoomConfigured: boolean;
  isDev: boolean;
  missingVars: { key: string; requiredFor: string }[];
}

export default function AdminDashboardPage() {
  const [tab, setTab] = useState<"upcoming" | "completed" | "cancelled">("upcoming");
  const [bookings, setBookings] = useState<BookingItem[]>([]);
  const [diagnostics, setDiagnostics] = useState<Diagnostics | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const router = useRouter();

  const fetchBookings = useCallback(async (selectedTab: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/bookings?tab=${selectedTab}`);
      if (res.status === 401) {
        router.push("/admin/login");
        return;
      }
      const data = await res.json();
      if (data.success) {
        setBookings(data.bookings || []);
        setDiagnostics(data.diagnostics || null);
      }
    } catch (err) {
      console.error("Failed to load admin bookings:", err);
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    fetchBookings(tab);
  }, [tab, fetchBookings]);

  const handleStatusChange = async (id: string, action: "cancel" | "complete") => {
    if (action === "cancel") {
      const ok = confirm("Are you sure you want to cancel this booking? This will release the slot and notify the client.");
      if (!ok) return;
    }

    setActionLoadingId(id);
    try {
      const res = await fetch(`/api/admin/bookings/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });
      const data = await res.json();
      if (data.success) {
        fetchBookings(tab);
      } else {
        alert(data.error || "Action failed");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to update booking status");
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#07090e",
        color: "#f8fafc",
        padding: "2rem 1.5rem",
        fontFamily: "var(--font-sans, sans-serif)",
      }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        {/* Top Navbar */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            paddingBottom: "1.5rem",
            borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
            marginBottom: "2rem",
            flexWrap: "wrap",
            gap: "1rem",
          }}
        >
          <div>
            <div style={{ fontSize: "1.4rem", fontWeight: 800 }}>
              Creative<span style={{ color: "#f43f5e" }}>Cloud</span> &bull; <span style={{ color: "#94a3b8", fontSize: "1.1rem" }}>Booking Admin</span>
            </div>
            <div style={{ fontSize: "0.8rem", color: "#64748b" }}>
              Times shown in Pakistan Standard Time (PKT) with New York (EST) in brackets.
            </div>
          </div>

          <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
            <button
              onClick={() => fetchBookings(tab)}
              style={{
                background: "rgba(255, 255, 255, 0.06)",
                border: "1px solid rgba(255, 255, 255, 0.12)",
                color: "#cbd5e1",
                padding: "0.55rem 1rem",
                borderRadius: "8px",
                fontSize: "0.82rem",
                cursor: "pointer",
                fontWeight: 600,
              }}
            >
              ↻ Refresh
            </button>
            <button
              onClick={handleLogout}
              style={{
                background: "rgba(244, 63, 94, 0.15)",
                border: "1px solid rgba(244, 63, 94, 0.35)",
                color: "#fb7185",
                padding: "0.55rem 1rem",
                borderRadius: "8px",
                fontSize: "0.82rem",
                cursor: "pointer",
                fontWeight: 700,
              }}
            >
              Sign Out
            </button>
          </div>
        </div>

        {/* Configuration Notice Banners */}
        {diagnostics && diagnostics.missingVars.length > 0 && (
          <div
            style={{
              background: "rgba(245, 158, 11, 0.1)",
              border: "1px solid rgba(245, 158, 11, 0.35)",
              borderRadius: "14px",
              padding: "1.25rem 1.5rem",
              marginBottom: "2rem",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
              <span style={{ fontSize: "1.1rem" }}>⚠️</span>
              <strong style={{ color: "#fbbf24", fontSize: "0.95rem" }}>
                Client Setup Notice: Pending Environment Variables ({diagnostics.missingVars.length})
              </strong>
            </div>
            <p style={{ margin: "0 0 0.75rem 0", fontSize: "0.84rem", color: "#cbd5e1", lineHeight: 1.5 }}>
              {diagnostics.isDev
                ? "The application is currently running in local development mode using temporary fallbacks (in-memory database, simulated console emails). When deploying for the client, provide these keys in .env.local or Vercel Environment Variables:"
                : "The following production environment variables are currently missing. Some automated actions may be paused until configured:"}
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
              {diagnostics.missingVars.map((v) => (
                <span
                  key={v.key}
                  style={{
                    background: "rgba(0, 0, 0, 0.4)",
                    border: "1px solid rgba(245, 158, 11, 0.4)",
                    padding: "0.25rem 0.6rem",
                    borderRadius: "6px",
                    fontSize: "0.75rem",
                    color: "#fde68a",
                    fontFamily: "monospace",
                  }}
                  title={v.requiredFor}
                >
                  {v.key}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Tabs Row */}
        <div
          style={{
            display: "flex",
            gap: "0.6rem",
            marginBottom: "1.5rem",
            borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
            paddingBottom: "0.75rem",
          }}
        >
          <button
            onClick={() => setTab("upcoming")}
            style={{
              background: tab === "upcoming" ? "#ffffff" : "transparent",
              color: tab === "upcoming" ? "#07090e" : "#94a3b8",
              border: "none",
              padding: "0.5rem 1.25rem",
              borderRadius: "999px",
              fontWeight: 800,
              fontSize: "0.85rem",
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
          >
            Upcoming
          </button>
          <button
            onClick={() => setTab("completed")}
            style={{
              background: tab === "completed" ? "#ffffff" : "transparent",
              color: tab === "completed" ? "#07090e" : "#94a3b8",
              border: "none",
              padding: "0.5rem 1.25rem",
              borderRadius: "999px",
              fontWeight: 800,
              fontSize: "0.85rem",
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
          >
            Completed
          </button>
          <button
            onClick={() => setTab("cancelled")}
            style={{
              background: tab === "cancelled" ? "#ffffff" : "transparent",
              color: tab === "cancelled" ? "#07090e" : "#94a3b8",
              border: "none",
              padding: "0.5rem 1.25rem",
              borderRadius: "999px",
              fontWeight: 800,
              fontSize: "0.85rem",
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
          >
            Cancelled
          </button>
        </div>

        {/* Bookings Table Container */}
        <div
          style={{
            background: "rgba(15, 23, 42, 0.75)",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            borderRadius: "16px",
            overflow: "hidden",
            boxShadow: "0 20px 40px rgba(0, 0, 0, 0.6)",
          }}
        >
          {loading ? (
            <div style={{ padding: "3rem", textAlign: "center", color: "#94a3b8" }}>
              Loading bookings...
            </div>
          ) : bookings.length === 0 ? (
            <div style={{ padding: "3.5rem", textAlign: "center", color: "#64748b" }}>
              <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>📅</div>
              <div style={{ fontSize: "1rem", fontWeight: 700, color: "#cbd5e1" }}>
                No {tab} meetings found.
              </div>
              <div style={{ fontSize: "0.85rem", marginTop: "0.25rem" }}>
                {tab === "upcoming" ? "New bookings from the website will appear here automatically." : ""}
              </div>
            </div>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  textAlign: "left",
                  fontSize: "0.88rem",
                }}
              >
                <thead>
                  <tr
                    style={{
                      borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
                      background: "rgba(255, 255, 255, 0.02)",
                    }}
                  >
                    <th style={{ padding: "14px 16px", color: "#64748b", fontWeight: 700, textTransform: "uppercase", fontSize: "0.75rem" }}>Time</th>
                    <th style={{ padding: "14px 16px", color: "#64748b", fontWeight: 700, textTransform: "uppercase", fontSize: "0.75rem" }}>Client</th>
                    <th style={{ padding: "14px 16px", color: "#64748b", fontWeight: 700, textTransform: "uppercase", fontSize: "0.75rem" }}>Contact</th>
                    <th style={{ padding: "14px 16px", color: "#64748b", fontWeight: 700, textTransform: "uppercase", fontSize: "0.75rem" }}>Format</th>
                    <th style={{ padding: "14px 16px", color: "#64748b", fontWeight: 700, textTransform: "uppercase", fontSize: "0.75rem" }}>Status</th>
                    <th style={{ padding: "14px 16px", color: "#64748b", fontWeight: 700, textTransform: "uppercase", fontSize: "0.75rem", textAlign: "right" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((b) => {
                    const startUtc = new Date(b.startTime);
                    const pkt = DateTime.fromJSDate(startUtc, { zone: "Asia/Karachi" });
                    const est = DateTime.fromJSDate(startUtc, { zone: "America/New_York" });

                    return (
                      <tr
                        key={b._id}
                        style={{
                          borderBottom: "1px solid rgba(255, 255, 255, 0.05)",
                          transition: "background 0.15s ease",
                        }}
                      >
                        <td style={{ padding: "14px 16px", whiteSpace: "nowrap" }}>
                          <div style={{ fontWeight: 800, color: "#fff" }}>
                            {pkt.toFormat("MMM d, yyyy")}
                          </div>
                          <div style={{ color: "#f59e0b", fontWeight: 700 }}>
                            {pkt.toFormat("h:mm a")} PKT
                          </div>
                          <div style={{ fontSize: "0.75rem", color: "#94a3b8" }}>
                            ({est.toFormat("h:mm a")} EST)
                          </div>
                        </td>

                        <td style={{ padding: "14px 16px" }}>
                          <div style={{ fontWeight: 800, color: "#fff" }}>{b.name}</div>
                          {b.socialHandle && (
                            <div style={{ fontSize: "0.75rem", color: "#f43f5e" }}>
                              @{b.socialHandle.replace(/^@/, "")}
                            </div>
                          )}
                        </td>

                        <td style={{ padding: "14px 16px", whiteSpace: "nowrap" }}>
                          <div>
                            <a href={`mailto:${b.email}`} style={{ color: "#38bdf8", textDecoration: "none" }}>
                              {b.email}
                            </a>
                          </div>
                          <div style={{ fontSize: "0.8rem", color: "#34d399", marginTop: "2px" }}>
                            <a href={`tel:${b.phone}`} style={{ color: "#34d399", textDecoration: "none" }}>
                              {b.phone}
                            </a>
                          </div>
                        </td>

                        <td style={{ padding: "14px 16px", whiteSpace: "nowrap" }}>
                          <span
                            style={{
                              display: "inline-block",
                              padding: "4px 8px",
                              borderRadius: "6px",
                              fontSize: "0.75rem",
                              fontWeight: 800,
                              textTransform: "uppercase",
                              background: b.meetingType === "zoom" ? "rgba(2, 132, 199, 0.15)" : "rgba(16, 185, 129, 0.15)",
                              color: b.meetingType === "zoom" ? "#38bdf8" : "#34d399",
                              border: `1px solid ${b.meetingType === "zoom" ? "rgba(56, 189, 248, 0.3)" : "rgba(52, 211, 153, 0.3)"}`,
                            }}
                          >
                            {b.meetingType === "zoom" ? "📹 Zoom" : "📞 Phone"}
                          </span>
                        </td>

                        <td style={{ padding: "14px 16px", whiteSpace: "nowrap" }}>
                          <span
                            style={{
                              display: "inline-block",
                              padding: "3px 8px",
                              borderRadius: "6px",
                              fontSize: "0.72rem",
                              fontWeight: 700,
                              textTransform: "uppercase",
                              background:
                                b.status === "confirmed"
                                  ? "rgba(16, 185, 129, 0.2)"
                                  : b.status === "completed"
                                  ? "rgba(59, 130, 246, 0.2)"
                                  : "rgba(244, 63, 94, 0.2)",
                              color:
                                b.status === "confirmed"
                                  ? "#34d399"
                                  : b.status === "completed"
                                  ? "#60a5fa"
                                  : "#fb7185",
                            }}
                          >
                            {b.status}
                          </span>
                        </td>

                        <td style={{ padding: "14px 16px", textAlign: "right", whiteSpace: "nowrap" }}>
                          {b.status === "confirmed" ? (
                            <div style={{ display: "flex", gap: "0.5rem", justifyContent: "flex-end" }}>
                              <button
                                disabled={actionLoadingId === b._id}
                                onClick={() => handleStatusChange(b._id, "complete")}
                                style={{
                                  background: "rgba(59, 130, 246, 0.15)",
                                  border: "1px solid rgba(59, 130, 246, 0.35)",
                                  color: "#60a5fa",
                                  padding: "0.35rem 0.65rem",
                                  borderRadius: "6px",
                                  fontSize: "0.75rem",
                                  cursor: "pointer",
                                  fontWeight: 600,
                                }}
                              >
                                ✓ Done
                              </button>
                              <button
                                disabled={actionLoadingId === b._id}
                                onClick={() => handleStatusChange(b._id, "cancel")}
                                style={{
                                  background: "rgba(244, 63, 94, 0.15)",
                                  border: "1px solid rgba(244, 63, 94, 0.35)",
                                  color: "#fb7185",
                                  padding: "0.35rem 0.65rem",
                                  borderRadius: "6px",
                                  fontSize: "0.75rem",
                                  cursor: "pointer",
                                  fontWeight: 600,
                                }}
                              >
                                ✕ Cancel
                              </button>
                            </div>
                          ) : (
                            <span style={{ fontSize: "0.75rem", color: "#64748b" }}>—</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
