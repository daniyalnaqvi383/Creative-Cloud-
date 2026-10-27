"use client";

import React, { useState, useEffect } from "react";

interface Scene {
  id: number;
  label: string;
  tag: string;
  title: string;
  subtitle: string;
  badge: string;
  badgeColor: string;
  image: string;
  metric1Label: string;
  metric1Val: string;
  metric2Label: string;
  metric2Val: string;
  soundText: string;
}

export default function AnimatedScenesPlayer() {
  const scenes: Scene[] = [
    {
      id: 1,
      label: "01. Viral Hook",
      tag: "THE 3-SECOND SCROLL STOPPER",
      title: "“Stop scrolling ✋ 90% of brands make this TikTok mistake…”",
      subtitle: "Psychological pattern interrupt designed to destroy scroll inertia.",
      badge: "🔥 #1 ON FOR YOU PAGE",
      badgeColor: "#f43f5e",
      image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&auto=format&fit=crop&q=80",
      metric1Label: "3-Sec Hold Rate",
      metric1Val: "84.6%",
      metric2Label: "Algorithm Score",
      metric2Val: "98/100",
      soundText: "Trending Audio • 1.4M Uses",
    },
    {
      id: 2,
      label: "02. Kinetic Edit",
      tag: "HIGH-RETENTION PACING",
      title: "“From 2,000 views to 3.4M in 14 days — full breakdown”",
      subtitle: "Cinematic 4K cuts, dynamic zoom transitions, and kinetic subtitles.",
      badge: "⚡ 3.8x RETENTION SURGE",
      badgeColor: "#a855f7",
      image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&auto=format&fit=crop&q=80",
      metric1Label: "Avg Watch Time",
      metric1Val: "142%",
      metric2Label: "Re-shares",
      metric2Val: "82.1k",
      soundText: "Custom Sound FX • Pop & Bass",
    },
    {
      id: 3,
      label: "03. ROAS Conversion",
      tag: "DIRECT-RESPONSE UGC",
      title: "“Sold out 3 production batches in under 3 weeks!”",
      subtitle: "Native TikTok Shop & Reels creatives engineered to convert followers into buyers.",
      badge: "📈 8.4x TRACKED ROAS",
      badgeColor: "#10b981",
      image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&auto=format&fit=crop&q=80",
      metric1Label: "Direct Revenue",
      metric1Val: "$320,000",
      metric2Label: "Customer CAC",
      metric2Val: "-54%",
      soundText: "Creator Seeding • 45 Variants",
    },
  ];

  const [activeIdx, setActiveIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  // Auto-cycle through scenes every 4.5 seconds
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % scenes.length);
    }, 4500);

    return () => clearInterval(interval);
  }, [isPlaying, scenes.length]);

  const currentScene = scenes[activeIdx];

  return (
    <div className="social-mockup-main spotlight-card" style={{ width: "100%", maxWidth: "100%", boxSizing: "border-box" }}>
      {/* Top Header: Scene Tabs & Live Pulse */}
      <div className="mockup-header-row" style={{ flexWrap: "wrap", gap: "0.75rem" }}>
        <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
          {scenes.map((s, idx) => (
            <button
              key={s.id}
              type="button"
              onClick={() => {
                setActiveIdx(idx);
                setIsPlaying(false);
              }}
              style={{
                background: activeIdx === idx ? "var(--primary)" : "rgba(255, 255, 255, 0.06)",
                color: "#fff",
                border: "1px solid",
                borderColor: activeIdx === idx ? "var(--primary)" : "rgba(255, 255, 255, 0.12)",
                borderRadius: "var(--radius-full)",
                padding: "0.3rem 0.75rem",
                fontSize: "0.75rem",
                fontWeight: 700,
                cursor: "pointer",
                transition: "all 0.25s ease",
                boxShadow: activeIdx === idx ? "0 0 15px rgba(244, 63, 94, 0.5)" : "none",
              }}
            >
              {s.label}
            </button>
          ))}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
          <button
            type="button"
            onClick={() => setIsPlaying(!isPlaying)}
            title={isPlaying ? "Pause scene auto-play" : "Resume scene auto-play"}
            style={{
              background: "rgba(255, 255, 255, 0.08)",
              border: "1px solid rgba(255, 255, 255, 0.15)",
              color: "#cbd5e1",
              borderRadius: "6px",
              padding: "0.2rem 0.5rem",
              fontSize: "0.7rem",
              cursor: "pointer",
            }}
          >
            {isPlaying ? "❚❚ Auto" : "▶ Play"}
          </button>

          <div className="live-broadcasting">
            <span className="live-indicator-dot" />
            <span>Scene Active</span>
          </div>
        </div>
      </div>

      {/* Animated Video Preview Frame */}
      <div
        className="reel-preview-card"
        style={{
          height: "230px",
          position: "relative",
          overflow: "hidden",
          borderRadius: "var(--radius-md)",
          border: "1px solid rgba(255, 255, 255, 0.15)",
          width: "100%",
          boxSizing: "border-box",
        }}
      >
        <img
          key={currentScene.id}
          src={currentScene.image}
          alt={currentScene.title}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            filter: "brightness(0.78)",
            animation: "sceneZoom 4.5s ease-out forwards",
          }}
        />

        {/* Animated Audio Equalizer Bars in Corner */}
        <div
          style={{
            position: "absolute",
            top: "0.75rem",
            right: "0.75rem",
            maxWidth: "calc(100% - 1.5rem)",
            background: "rgba(0, 0, 0, 0.65)",
            backdropFilter: "blur(8px)",
            padding: "0.25rem 0.55rem",
            borderRadius: "var(--radius-full)",
            display: "flex",
            alignItems: "center",
            gap: "0.35rem",
            fontSize: "0.7rem",
            color: "#fff",
            zIndex: 3,
            border: "1px solid rgba(255, 255, 255, 0.12)",
            overflow: "hidden",
            whiteSpace: "nowrap",
          }}
        >
          <div style={{ display: "flex", alignItems: "flex-end", gap: "2px", height: "12px", flexShrink: 0 }}>
            <span style={{ width: "2.5px", height: "60%", background: "#f43f5e", animation: "equalizerBar 0.8s ease-in-out infinite alternate" }} />
            <span style={{ width: "2.5px", height: "100%", background: "#a855f7", animation: "equalizerBar 0.5s ease-in-out infinite alternate-reverse" }} />
            <span style={{ width: "2.5px", height: "40%", background: "#06b6d4", animation: "equalizerBar 0.9s ease-in-out infinite alternate" }} />
            <span style={{ width: "2.5px", height: "80%", background: "#10b981", animation: "equalizerBar 0.6s ease-in-out infinite alternate-reverse" }} />
          </div>
          <span style={{ fontSize: "0.68rem", color: "#e2e8f0", textOverflow: "ellipsis", overflow: "hidden" }}>{currentScene.soundText}</span>
        </div>

        {/* Overlay Content */}
        <div className="reel-overlay-content">
          <div
            style={{
              alignSelf: "flex-start",
              background: currentScene.badgeColor,
              color: "#fff",
              fontSize: "0.72rem",
              fontWeight: 800,
              padding: "0.25rem 0.65rem",
              borderRadius: "var(--radius-full)",
              boxShadow: `0 0 16px ${currentScene.badgeColor}80`,
              transition: "all 0.3s ease",
            }}
          >
            {currentScene.badge}
          </div>

          <div>
            <div
              style={{
                fontSize: "0.72rem",
                fontWeight: 800,
                color: "#38bdf8",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                marginBottom: "0.2rem",
              }}
            >
              {currentScene.tag}
            </div>
            <p
              style={{
                fontSize: "0.95rem",
                fontWeight: 800,
                color: "#ffffff",
                lineHeight: 1.35,
                textShadow: "0 2px 8px rgba(0,0,0,0.8)",
                marginBottom: "0.6rem",
              }}
            >
              {currentScene.title}
            </p>

            <div className="reel-stats-bar" style={{ fontSize: "0.76rem", flexWrap: "wrap", gap: "0.65rem" }}>
              <span>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                </svg>
                1.2M Likes
              </span>
              <span>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
                48.6k Comments
              </span>
              <span>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
                </svg>
                99.4% Upvote
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Dynamic Telemetry Row Matching Active Scene */}
      <div className="telemetry-row" style={{ marginTop: "1rem" }}>
        <div className="telemetry-box">
          <div className="metric-label">{currentScene.metric1Label}</div>
          <div className="metric-value" style={{ color: "#fff" }}>
            {currentScene.metric1Val}
          </div>
          <div className="metric-sub" style={{ color: "#34d399" }}>
            +342% vs organic benchmark
          </div>
        </div>
        <div className="telemetry-box">
          <div className="metric-label">{currentScene.metric2Label}</div>
          <div className="metric-value" style={{ color: "#38bdf8" }}>
            {currentScene.metric2Val}
          </div>
          <div className="metric-sub" style={{ color: "#a855f7" }}>
            Direct algorithmic pickup
          </div>
        </div>
      </div>

      {/* Scene Progress Indicator Line */}
      <div
        style={{
          width: "100%",
          height: "2px",
          background: "rgba(255, 255, 255, 0.08)",
          borderRadius: "2px",
          marginTop: "1rem",
          overflow: "hidden",
        }}
      >
        <div
          key={currentScene.id}
          style={{
            height: "100%",
            background: "linear-gradient(90deg, #f43f5e, #a855f7)",
            animation: isPlaying ? "sceneProgress 4.5s linear infinite" : "none",
            width: isPlaying ? "100%" : "33%",
          }}
        />
      </div>

    </div>
  );
}
