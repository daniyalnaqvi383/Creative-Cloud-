"use client";

import React, { useState } from "react";

export default function Footer() {
  const [email, setEmail] = useState("");

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Subscribed to Social Trends Dispatch!");
    setEmail("");
  };

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-top">
          {/* Brand Info */}
          <div className="footer-brand">
            <a href="#home" className="brand-logo">
              <div className="logo-icon-wrap">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z" />
                </svg>
              </div>
              <div className="logo-text">
                <span className="bold">Creative</span>
                <span className="accent">Cloud</span>
              </div>
            </a>
            <p>
              Premier social media content agency producing high-velocity short-form video, aesthetic brand storytelling, and viral paid social campaigns.
            </p>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                fontSize: "0.78rem",
                color: "#10b981",
                marginTop: "1.25rem",
              }}
            >
              <span className="live-indicator-dot" />
              <span>Available for new brand campaigns &bull; Call +1 (802) 265-0207</span>
            </div>
          </div>

          {/* Services Links */}
          <div className="footer-col">
            <h4>Services</h4>
            <ul className="footer-links">
              <li>
                <a href="#services">TikTok &amp; Reels Production</a>
              </li>
              <li>
                <a href="#services">Viral Hook Scriptwriting</a>
              </li>
              <li>
                <a href="#services">Aesthetic Feed Curation</a>
              </li>
              <li>
                <a href="#services">Paid UGC Video Ads</a>
              </li>
              <li>
                <a href="#services">Podcast Repurposing</a>
              </li>
            </ul>
          </div>

          {/* Studio Links */}
          <div className="footer-col">
            <h4>Studio</h4>
            <ul className="footer-links">
              <li>
                <a href="#work">Campaign Portfolio</a>
              </li>
              <li>
                <a href="#process">The Viral Formula</a>
              </li>
              <li>
                <a href="#schedule">Schedule Zoom Call</a>
              </li>
              <li>
                <a href="#testimonials">Founder Reviews</a>
              </li>
              <li>
                <a href="tel:+18022650207">Direct Call: (802) 265-0207</a>
              </li>
            </ul>
          </div>

          {/* Stay Ahead Newsletter */}
          <div className="footer-col">
            <h4>Stay Ahead</h4>
            <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: "0.75rem" }}>
              Get our bi-weekly breakdown of the newest TikTok &amp; Instagram algorithm shifts.
            </p>
            <form className="newsletter-box" onSubmit={handleNewsletterSubmit} style={{ display: "flex", gap: "0.5rem" }}>
              <input
                type="email"
                className="scheduler-input"
                style={{ padding: "0.6rem 0.85rem", fontSize: "0.85rem" }}
                placeholder="you@brand.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <button type="submit" className="magnetic-btn btn-primary" style={{ padding: "0.6rem 1rem" }}>
                Join
              </button>
            </form>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="footer-bottom">
          <div>&copy; 2026 Creative Cloud Agency, LLC. All rights reserved.</div>
          <div className="footer-socials">
            <a href="#" className="social-link" aria-label="TikTok">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.298-.002.595.042.88.13V9.4a6.33 6.33 0 0 0-1-.08A6.34 6.34 0 0 0 3 15.66a6.34 6.34 0 0 0 10.82 4.48 6.3 6.3 0 0 0 1.93-4.57V8.75a8.16 8.16 0 0 0 4.84 1.58V6.88a4.86 4.86 0 0 1-1-.19z" />
              </svg>
            </a>
            <a href="#" className="social-link" aria-label="Instagram">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
              </svg>
            </a>
            <a href="#" className="social-link" aria-label="YouTube">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
                <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
