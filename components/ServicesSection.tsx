import React from "react";

export default function ServicesSection() {
  const services = [
    {
      title: "Short-Form Video Production",
      desc: "End-to-end production of TikToks, Reels, and YouTube Shorts. Cinematic 4K cameras, kinetic typography, viral sound design, and sub-second cut pacing.",
      tags: ["TikTok & Reels", "Kinetic Subs", "4K Cameras"],
      stagger: "stagger-1",
      icon: (
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
          <polygon points="23 7 16 12 23 17 23 7" />
          <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
        </svg>
      ),
    },
    {
      title: "Viral Scriptwriting & Hooks",
      desc: "The first 3 seconds dictate everything. We write psychological hooks, storytelling arcs, and trending angle scripts tested across millions of impressions.",
      tags: ["3-Sec Hooks", "Story Arcs", "Algorithm Pacing"],
      stagger: "stagger-2",
      icon: (
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
          <path d="M12 20h9" />
          <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
        </svg>
      ),
    },
    {
      title: "Aesthetic Feed & Brand Identity",
      desc: "Transform your Instagram into a luxury storefront. Cohesive color grading, typography standards, carousel decks, and custom story highlights.",
      tags: ["Grid Curation", "Carousel Decks", "Color Grading"],
      stagger: "stagger-3",
      icon: (
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
          <rect x="3" y="3" width="7" height="7" />
          <rect x="14" y="3" width="7" height="7" />
          <rect x="14" y="14" width="7" height="7" />
          <rect x="3" y="14" width="7" height="7" />
        </svg>
      ),
    },
    {
      title: "Paid Social UGC Ad Creatives",
      desc: "Direct-response user generated content designed specifically to crush ROAS on Meta and TikTok Spark Ads. Authentic, native-looking, and high-converting.",
      tags: ["High ROAS", "Native UGC", "A/B Testing"],
      stagger: "stagger-4",
      icon: (
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
          <circle cx="12" cy="12" r="10" />
          <path d="m4.93 4.93 4.24 4.24" />
          <path d="m14.83 9.17 4.24-4.24" />
          <path d="m14.83 14.83 4.24 4.24" />
          <path d="m9.17 14.83-4.24 4.24" />
        </svg>
      ),
    },
    {
      title: "Podcast & Longform Repurposing",
      desc: "Turn your webinars, founder interviews, or podcasts into 20+ viral short-form micro-clips per episode with captions, b-roll overlays, and zoom-cuts.",
      tags: ["Multi-Platform", "B-Roll Cutaways", "Auto-Captions"],
      stagger: "stagger-5",
      icon: (
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
          <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
          <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
          <line x1="12" y1="19" x2="12" y2="23" />
          <line x1="8" y1="23" x2="16" y2="23" />
        </svg>
      ),
    },
    {
      title: "Creator & Influencer Seeding",
      desc: "We source, vet, brief, and manage micro and macro creators who genuinely align with your brand, orchestrating synchronized multi-creator viral launches.",
      tags: ["Talent Outreach", "Seeding Kits", "Brand Deals"],
      stagger: "stagger-6",
      icon: (
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      ),
    },
  ];

  return (
    <section className="section" id="services">
      <div className="container">
        <div className="section-header">
          <span className="section-pill-tag reveal">What We Deliver</span>
          <h2 className="section-title reveal">
            Built for Attention. <span className="gradient-title">Optimized for Revenue.</span>
          </h2>
          <p className="section-desc reveal">
            We don&apos;t post generic stock graphics. Every script, hook, visual asset, and sound effect is engineered to stop thumbs and build cult-like brand loyalty.
          </p>
        </div>

        <div className="services-grid">
          {services.map((s, idx) => (
            <div key={idx} className={`service-card spotlight-card reveal ${s.stagger}`}>
              <div>
                <div className="service-icon-box">{s.icon}</div>
                <h3 className="service-title">{s.title}</h3>
                <p className="service-text">{s.desc}</p>
              </div>
              <div className="service-tags">
                {s.tags.map((tag, tIdx) => (
                  <span key={tIdx} className="service-tag">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
