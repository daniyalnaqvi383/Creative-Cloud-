import React from "react";

export default function Marquee() {
  const items = [
    "✦ TIKTOK VIRAL CREATIVE",
    "✦ INSTAGRAM REELS PRODUCTION",
    "✦ YOUTUBE SHORTS PACING",
    "✦ HIGH-ROAS META & TIKTOK ADS",
    "✦ AESTHETIC FEED CURATION",
    "✦ PODCAST & INTERVIEW CLIPPING",
    "✦ INFLUENCER & CREATOR SEEDING",
    "✦ 4K STUDIO CINEMATOGRAPHY",
  ];

  return (
    <div className="marquee-section" aria-label="Platforms and Channels">
      <div className="marquee-label">Dominating every high-attention social algorithm</div>
      <div className="marquee-mask">
        <div className="marquee-track">
          {items.map((item, idx) => (
            <div key={`m1-${idx}`} className="marquee-item">
              <span>{item}</span>
            </div>
          ))}
          {/* Duplicate set for infinite loop */}
          {items.map((item, idx) => (
            <div key={`m2-${idx}`} className="marquee-item">
              <span>{item}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
