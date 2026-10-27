"use client";

import React, { useState } from "react";

export default function ContactSection() {
  const [sent, setSent] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    alert("🎉 Message sent! A Creative Cloud director will reach back to you shortly.");
    setFormData({ name: "", email: "", message: "" });
    setTimeout(() => setSent(false), 3000);
  };

  return (
    <section className="section" id="contact">
      <div className="container">
        <div className="schedule-card-wrapper contact-card-wrapper">
          <div>
            <span className="section-pill-tag">Direct Line</span>
            <h2>
              Let&apos;s talk about your <span className="gradient-title">next viral hit</span>.
            </h2>
            <p>
              Reach out directly by phone, email, or drop our team a message. We answer every inquiry within 24 hours.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem", marginTop: "2rem" }}>
              <a
                href="tel:+18022650207"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "1rem",
                  color: "#fff",
                  textDecoration: "none",
                  fontSize: "1.05rem",
                  fontWeight: 700,
                }}
              >
                <div
                  style={{
                    width: "44px",
                    height: "44px",
                    borderRadius: "12px",
                    background: "rgba(244, 63, 94, 0.15)",
                    border: "1px solid rgba(244, 63, 94, 0.4)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "var(--primary)",
                  }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                </div>
                <div>
                  <div style={{ fontSize: "0.76rem", color: "var(--text-dim)", textTransform: "uppercase" }}>
                    Direct Studio Phone
                  </div>
                  <div>+1 (802) 265-0207</div>
                </div>
              </a>

              <a
                href="mailto:hello@creativecloud.agency"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "1rem",
                  color: "#fff",
                  textDecoration: "none",
                  fontSize: "1.05rem",
                  fontWeight: 700,
                }}
              >
                <div
                  style={{
                    width: "44px",
                    height: "44px",
                    borderRadius: "12px",
                    background: "rgba(168, 85, 247, 0.15)",
                    border: "1px solid rgba(168, 85, 247, 0.4)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "var(--accent-purple)",
                  }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                </div>
                <div>
                  <div style={{ fontSize: "0.76rem", color: "var(--text-dim)", textTransform: "uppercase" }}>
                    General &amp; Press Inquiries
                  </div>
                  <div>hello@creativecloud.agency</div>
                </div>
              </a>
            </div>
          </div>

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <input
              type="text"
              className="scheduler-input"
              placeholder="Your Name"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
            <input
              type="email"
              className="scheduler-input"
              placeholder="Email Address"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
            <textarea
              className="scheduler-input"
              style={{ height: "120px", resize: "vertical" }}
              placeholder="Tell us about your brand and what goals you want to hit on social media..."
              required
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            />
            <button type="submit" className="magnetic-btn btn-primary" style={{ padding: "0.9rem" }}>
              <span>{sent ? "Message Dispatched! ✓" : "Send Direct Message"}</span>
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
