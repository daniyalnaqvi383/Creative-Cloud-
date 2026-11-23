import React from "react";

export default function Marquee() {
  const items = [
    "✦ AGENTIC AI & MULTI-AGENT SWARMS",
    "✦ FULL-STACK SOFTWARE & SAAS",
    "✦ BLOCKCHAIN & SMART CONTRACTS",
    "✦ WHATSAPP CRM AUTOMATION",
    "✦ SOCIAL MEDIA GROWTH ENGINES",
    "✦ TIKTOK & REELS VIRAL CREATIVE",
    "✦ HIGH-ROAS META & TIKTOK ADS",
    "✦ AESTHETIC BRAND IDENTITIES",
  ];

  return (
    <div className="marquee-section" aria-label="Capabilities and Services">
      <div className="marquee-label">Powering Next-Gen Brands with AI, Code &amp; High-Retention Media</div>
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
