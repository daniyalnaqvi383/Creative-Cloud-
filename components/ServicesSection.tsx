"use client";

import React, { useState } from "react";

export default function ServicesSection() {
  const [activeCategory, setActiveCategory] = useState<string>("all");

  const categories = [
    { key: "all", label: "All Services (11)" },
    { key: "creative", label: "Creative & Content (6)" },
    { key: "ai-auto", label: "AI & Automation (3)" },
    { key: "dev-web3", label: "Software & Blockchain (2)" },
  ];

  // --- 1. ORIGINAL SERVICES (Top / Pehle Wali Services) ---
  const originalServices = [
    {
      category: "creative",
      categoryName: "Video Production",
      title: "Short-Form Video Production",
      desc: "End-to-end production of TikToks, Reels, and YouTube Shorts. Cinematic 4K cameras, kinetic typography, viral sound design, and sub-second cut pacing.",
      tags: ["TikTok & Reels", "Kinetic Subs", "4K Cameras"],
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
          <polygon points="23 7 16 12 23 17 23 7" />
          <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
        </svg>
      ),
    },
    {
      category: "creative",
      categoryName: "Script & Hooks",
      title: "Viral Scriptwriting & Hooks",
      desc: "The first 3 seconds dictate everything. We write psychological hooks, storytelling arcs, and trending angle scripts tested across millions of impressions.",
      tags: ["3-Sec Hooks", "Story Arcs", "Algorithm Pacing"],
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
          <path d="M12 20h9" />
          <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
        </svg>
      ),
    },
    {
      category: "creative",
      categoryName: "Brand Aesthetics",
      title: "Aesthetic Feed & Brand Identity",
      desc: "Transform your Instagram and socials into a luxury storefront. Cohesive color grading, typography standards, carousel decks, and custom story highlights.",
      tags: ["Grid Curation", "Carousel Decks", "Color Grading"],
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
          <rect x="3" y="3" width="7" height="7" />
          <rect x="14" y="3" width="7" height="7" />
          <rect x="14" y="14" width="7" height="7" />
          <rect x="3" y="14" width="7" height="7" />
        </svg>
      ),
    },
    {
      category: "creative",
      categoryName: "Performance Ads",
      title: "Paid Social UGC Ad Creatives",
      desc: "Direct-response user generated content designed specifically to crush ROAS on Meta and TikTok Spark Ads. Authentic, native-looking, and high-converting.",
      tags: ["High ROAS", "Native UGC", "A/B Testing"],
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
          <circle cx="12" cy="12" r="10" />
          <path d="m4.93 4.93 4.24 4.24" />
          <path d="m14.83 9.17 4.24-4.24" />
          <path d="m14.83 14.83 4.24 4.24" />
          <path d="m9.17 14.83-4.24 4.24" />
        </svg>
      ),
    },
    {
      category: "creative",
      categoryName: "Micro-Clips",
      title: "Podcast & Longform Repurposing",
      desc: "Turn your webinars, founder interviews, or podcasts into 20+ viral short-form micro-clips per episode with captions, b-roll overlays, and zoom-cuts.",
      tags: ["Multi-Platform", "B-Roll Cutaways", "Auto-Captions"],
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
          <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
          <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
          <line x1="12" y1="19" x2="12" y2="23" />
          <line x1="8" y1="23" x2="16" y2="23" />
        </svg>
      ),
    },
    {
      category: "creative",
      categoryName: "Creator Network",
      title: "Creator & Influencer Seeding",
      desc: "We source, vet, brief, and manage micro and macro creators who genuinely align with your brand, orchestrating synchronized multi-creator viral launches.",
      tags: ["Talent Outreach", "Seeding Kits", "Brand Deals"],
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      ),
    },
  ];

  // --- 2. NEW SERVICES (Bottom / Nayi Add Ki Gayi Services) ---
  const newServices = [
    {
      category: "dev-web3",
      categoryName: "Software Dev",
      title: "Full-Stack Software Development",
      desc: "Custom high-performance web applications, cross-platform mobile apps, bespoke SaaS architectures, and resilient REST & GraphQL APIs engineered for speed, security, and scale.",
      tags: ["Full-Stack SaaS", "Next.js & React", "High-Scale APIs", "Cloud Infrastructure"],
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
          <polyline points="16 18 22 12 16 6" />
          <polyline points="8 6 2 12 8 18" />
          <line x1="14" y1="4" x2="10" y2="20" />
        </svg>
      ),
    },
    {
      category: "dev-web3",
      categoryName: "Blockchain & Web3",
      title: "Blockchain & Smart Contract Solutions",
      desc: "Enterprise-grade decentralized applications (dApps), secure smart contracts, tokenomics, DeFi protocols, and Web3 integrations across Ethereum, Solana, and EVM architectures.",
      tags: ["Smart Contracts", "Web3 dApps", "Solana & EVM", "Security Auditing"],
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
          <polygon points="12 2 2 7 12 12 22 7 12 2" />
          <polyline points="2 17 12 22 22 17" />
          <polyline points="2 12 12 17 22 12" />
        </svg>
      ),
    },
    {
      category: "ai-auto",
      categoryName: "WhatsApp Automation",
      title: "WhatsApp Automation & CRM Bots",
      desc: "Turn WhatsApp into a 24/7 autonomous sales and customer retention machine. Meta Cloud API integration, automated lead qualification, booking triggers, and two-way CRM sync.",
      tags: ["WhatsApp Cloud API", "AI Sales Bots", "Lead Routing", "24/7 Bookings"],
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
          <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
          <path d="M9.5 9.5c.3-.3.8-.3 1.1 0l1 1c.3.3.3.8 0 1.1l-.6.6c.5 1 1.4 1.9 2.4 2.4l.6-.6c.3-.3.8-.3 1.1 0l1 1c.3.3.3.8 0 1.1l-.8.8c-.8.8-2 .8-3.3-.2a13.5 13.5 0 0 1-4.7-4.7c-1-1.3-1-2.5-.2-3.3l.8-.8z" />
        </svg>
      ),
    },
    {
      category: "ai-auto",
      categoryName: "Social Automation",
      title: "Social Media Automation & Growth Engines",
      desc: "Scale your reach without manual headcount. Automated multi-platform publishing, AI content repurposing pipelines, smart auto-DM sequences, and audience sentiment analytics.",
      tags: ["Omnichannel Auto-Post", "Smart Auto-DMs", "Growth Scraping", "Analytics Engines"],
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
          <circle cx="18" cy="5" r="3" />
          <circle cx="6" cy="12" r="3" />
          <circle cx="18" cy="19" r="3" />
          <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
          <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
        </svg>
      ),
    },
    {
      category: "ai-auto",
      categoryName: "Agentic AI",
      title: "Agentic AI & Multi-Agent Systems",
      desc: "Autonomous AI agents and swarms that plan, reason, and execute complex workflows without manual bottlenecks. Built with LangGraph, CrewAI, AutoGen, and custom LLM tool calling.",
      tags: ["Autonomous Agents", "Multi-Agent Swarms", "LLM Reasoning", "Custom Tools"],
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
          <path d="M12 2a4 4 0 0 1 4 4v1a4 4 0 0 1-8 0V6a4 4 0 0 1 4-4Z" />
          <path d="M18 10a6 6 0 0 1 6 6v2a2 2 0 0 1-2 2h-4v-4" />
          <path d="M6 10a6 6 0 0 0-6 6v2a2 2 0 0 0 2 2h4v-4" />
          <circle cx="12" cy="14" r="3" />
          <path d="M12 17v5" />
          <path d="M9 22h6" />
        </svg>
      ),
    },
  ];

  const renderServiceCard = (s: typeof originalServices[0], idx: number) => (
    <div
      key={`${s.title}-${idx}`}
      className="service-card spotlight-card portfolio-card-animate"
      style={{
        opacity: 1,
        visibility: "visible",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "1.25rem",
          }}
        >
          <div className="service-icon-box" style={{ margin: 0 }}>
            {s.icon}
          </div>
          <span
            style={{
              fontSize: "0.72rem",
              fontWeight: 800,
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              padding: "0.3rem 0.75rem",
              borderRadius: "9999px",
              background: "rgba(255, 255, 255, 0.05)",
              border: "1px solid rgba(255, 255, 255, 0.12)",
              color: "var(--primary, #f43f5e)",
            }}
          >
            {s.categoryName}
          </span>
        </div>
        <h3 className="service-title">{s.title}</h3>
        <p className="service-text">{s.desc}</p>
      </div>

      <div>
        <div className="service-tags" style={{ marginBottom: "1.25rem" }}>
          {s.tags.map((tag, tIdx) => (
            <span key={tIdx} className="service-tag">
              {tag}
            </span>
          ))}
        </div>

        <div
          style={{
            paddingTop: "0.9rem",
            borderTop: "1px solid rgba(255, 255, 255, 0.07)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <a
            href="#schedule"
            style={{
              fontSize: "0.82rem",
              fontWeight: 700,
              color: "#fff",
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
              gap: "0.4rem",
              transition: "color 0.2s ease, gap 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "var(--primary, #f43f5e)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "#fff";
            }}
          >
            <span>Inquire / Book Strategy Call</span>
            <span style={{ fontSize: "1rem" }}>&rarr;</span>
          </a>
        </div>
      </div>
    </div>
  );

  return (
    <section className="section" id="services">
      <div className="container">
        <div className="section-header">
          <span className="section-pill-tag">What We Deliver</span>
          <h2 className="section-title">
            Built for Attention. <span className="gradient-title">Powered by Code &amp; AI.</span>
          </h2>
          <p className="section-desc">
            Explore our core social media &amp; viral production services above, paired with cutting-edge software development, Web3, WhatsApp automation, and Agentic AI systems below.
          </p>
        </div>

        {/* Category Tabs */}
        <div className="portfolio-tabs">
          {categories.map((cat) => (
            <button
              key={cat.key}
              type="button"
              className={`tab-btn ${activeCategory === cat.key ? "active" : ""}`}
              onClick={() => setActiveCategory(cat.key)}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* --- VIEW 1: ALL SERVICES (Original on Top, New at Bottom) --- */}
        {activeCategory === "all" && (
          <div>
            {/* 1. TOP SECTION: Original Creative & Media Services */}
            <div style={{ marginBottom: "1.75rem" }}>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  fontSize: "0.8rem",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  color: "var(--text-muted)",
                  marginBottom: "1rem",
                }}
              >
                <span
                  style={{
                    width: "8px",
                    height: "8px",
                    borderRadius: "50%",
                    background: "#f43f5e",
                  }}
                />
                <span>Core Social Media &amp; Viral Content Production</span>
              </div>
            </div>

            <div className="services-grid" style={{ marginBottom: "4.5rem" }}>
              {originalServices.map((s, idx) => renderServiceCard(s, idx))}
            </div>

            {/* 2. SECTION DIVIDER & SUBHEADING FOR NEW SERVICES */}
            <div
              style={{
                position: "relative",
                padding: "2.5rem 1.5rem",
                borderRadius: "var(--radius-lg, 24px)",
                background:
                  "linear-gradient(180deg, rgba(255,255,255,0.02) 0%, rgba(244,63,94,0.04) 100%)",
                border: "1px solid rgba(255,255,255,0.08)",
                marginBottom: "2.5rem",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  padding: "0.4rem 1rem",
                  borderRadius: "9999px",
                  background: "rgba(244, 63, 94, 0.12)",
                  border: "1px solid rgba(244, 63, 94, 0.3)",
                  color: "#f43f5e",
                  fontSize: "0.78rem",
                  fontWeight: 800,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  marginBottom: "0.85rem",
                }}
              >
                <span>⚡ New Engineering &amp; Automation Suite</span>
              </div>

              <h3
                style={{
                  fontSize: "clamp(1.5rem, 3vw, 2.1rem)",
                  fontWeight: 800,
                  color: "#fff",
                  letterSpacing: "-0.02em",
                  marginBottom: "0.5rem",
                }}
              >
                Software Development, Blockchain &amp;{" "}
                <span className="gradient-title">Agentic AI</span>
              </h3>

              <p
                style={{
                  color: "var(--text-muted)",
                  fontSize: "0.95rem",
                  maxWidth: "680px",
                  margin: "0 auto",
                  lineHeight: "1.6",
                }}
              >
                Custom full-stack web and SaaS applications, secure Web3 smart contracts, 24/7 WhatsApp CRM bots, automated social growth engines, and autonomous AI agents.
              </p>
            </div>

            {/* 3. BOTTOM SECTION: Newly Added Services */}
            <div className="services-grid">
              {newServices.map((s, idx) => renderServiceCard(s, idx + 6))}
            </div>
          </div>
        )}

        {/* --- VIEW 2: FILTERED BY CREATIVE (Original Only) --- */}
        {activeCategory === "creative" && (
          <div className="services-grid">
            {originalServices.map((s, idx) => renderServiceCard(s, idx))}
          </div>
        )}

        {/* --- VIEW 3: FILTERED BY SOFTWARE & BLOCKCHAIN --- */}
        {activeCategory === "dev-web3" && (
          <div className="services-grid">
            {newServices
              .filter((s) => s.category === "dev-web3")
              .map((s, idx) => renderServiceCard(s, idx))}
          </div>
        )}

        {/* --- VIEW 4: FILTERED BY AI & AUTOMATION --- */}
        {activeCategory === "ai-auto" && (
          <div className="services-grid">
            {newServices
              .filter((s) => s.category === "ai-auto")
              .map((s, idx) => renderServiceCard(s, idx))}
          </div>
        )}
      </div>
    </section>
  );
}
