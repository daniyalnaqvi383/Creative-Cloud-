"use client";

import React from "react";
import HeroCanvas from "./HeroCanvas";
import AnimatedScenesPlayer from "./AnimatedScenesPlayer";

export default function HeroSection() {
  return (
    <section className="hero-section" id="home">
      <HeroCanvas />

      <div className="container hero-layout">
        {/* Left Content */}
        <div className="hero-content-col">
          <div className="hero-badge-pill reveal">
            <span className="fire-icon">⚡</span>
            <span>CREATIVE CLOUD &bull; AI, SOFTWARE &amp; VIRAL MEDIA POWERHOUSE</span>
          </div>

          <h1 className="hero-headline reveal">
            We engineer <span className="gradient-title">viral media</span> &amp;{" "}
            <span className="gradient-title-alt">autonomous AI engines</span> that scale revenue.
          </h1>

          <p className="hero-description reveal">
            From high-retention short-form video production and performance ad creatives to custom full-stack SaaS,
            Web3 smart contracts, WhatsApp CRM bots, and Agentic AI swarms — we engineer high-converting digital powerhouses.
          </p>

          <div className="hero-cta-group reveal">
            <a href="#schedule" className="magnetic-btn btn-primary" title="Book a 1-on-1 Zoom Strategy Call">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polygon points="23 7 16 12 23 17 23 7" />
                <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
              </svg>
              <span>Schedule 15-Min Strategy Call</span>
            </a>
            <a
              href="tel:+18022650207"
              className="magnetic-btn btn-secondary"
              title="Call directly at +1 (802) 265-0207"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
              <span>Direct Call: (802) 265-0207</span>
            </a>
          </div>

          {/* Impact KPIs with Animated Counters */}
          <div className="hero-kpis reveal">
            <div className="kpi-item">
              <h3>
                <span data-counter-target="150" data-counter-suffix="M+">
                  150M+
                </span>
              </h3>
              <p>Organic Media Views</p>
            </div>
            <div className="kpi-item">
              <h3>
                <span data-counter-target="3.8" data-counter-suffix="x">
                  3.8x
                </span>
              </h3>
              <p>Avg ROAS &amp; Engagement</p>
            </div>
            <div className="kpi-item">
              <h3>
                <span data-counter-target="99.9" data-counter-suffix="%">
                  99.9%
                </span>
              </h3>
              <p>AI &amp; System Uptime</p>
            </div>
            <div className="kpi-item">
              <h3>
                <span data-counter-target="24" data-counter-suffix="/7">
                  24/7
                </span>
              </h3>
              <p>Autonomous Operations</p>
            </div>
          </div>
        </div>

        {/* Right Content: Interactive 3D Animated Video Scenes Studio */}
        <div className="hero-visual reveal" data-tilt data-tilt-max="10">
          {/* Floating Satellite Badge 1 (Parallax Float) */}
          <div className="floating-social-pill pill-float-1 parallax-float" data-speed="0.08">
            <div style={{ fontSize: "1.4rem" }}>🔥</div>
            <div>
              <div style={{ fontSize: "0.82rem", fontWeight: 800, color: "#fff" }}>
                Viral Hook: +84% Retention
              </div>
              <div style={{ fontSize: "0.7rem", color: "#94a3b8" }}>
                Average 3-Second Hold Rate
              </div>
            </div>
          </div>

          {/* Floating Satellite Badge 2 (Parallax Float) */}
          <div className="floating-social-pill pill-float-2 parallax-float" data-speed="0.06">
            <div style={{ fontSize: "1.4rem" }}>📈</div>
            <div>
              <div style={{ fontSize: "0.82rem", fontWeight: 800, color: "#fff" }}>
                +340% Follower Surge
              </div>
              <div style={{ fontSize: "0.7rem", color: "#34d399" }}>
                TikTok Shop &amp; Instagram Reels
              </div>
            </div>
          </div>

          {/* Interactive Multi-Scene Animated Player */}
          <AnimatedScenesPlayer />
        </div>
      </div>
    </section>
  );
}
