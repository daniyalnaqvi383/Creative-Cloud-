"use client";

import React, { useState } from "react";
import Image from "next/image";
import CaseStudyModal, { CaseStudyData } from "./CaseStudyModal";

export default function PortfolioSection() {
  const [activeFilter, setActiveFilter] = useState("all");
  const [selectedProject, setSelectedProject] = useState<CaseStudyData | null>(null);

  const campaigns: CaseStudyData[] = [
    // --- 1. CORE CONTENT & CREATIVE CAMPAIGNS (START / FIRST) ---
    {
      id: "1",
      title: "LuxeAura Skincare &bull; Viral TikTok & Reels Launch",
      category: "shortform",
      categoryTag: "Short-Form &bull; TikTok Shop",
      badge: "+42.8M Organic Views",
      badgeIcon: (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
        </svg>
      ),
      summary: "Aesthetic ASMR textures and direct routine hook storytelling that drove an 8.4x return on ad spend and sold out inventory in 3 weeks.",
      image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=900&auto=format&fit=crop&q=80",
      modalDesc: "Engineered a 60-day short-form video sprint focusing on aesthetic ASMR textures, direct skincare routine hooks, and organic micro-influencer product seedings. Generated over 42M organic views with zero initial ad spend.",
      metrics: "42.8M Organic Views &bull; 8.4x ROAS on TikTok Shop &bull; 140k New Instagram Followers",
      stack: ["TikTok Algorithm Pacing", "4K Macro Production", "ASMR Audio Design", "Influencer Seeding", "UGC Ads"],
    },
    {
      id: "2",
      title: "Volt Energy Drink &bull; Complete Social Brand Rebrand",
      category: "creative",
      categoryTag: "Brand Makeover &bull; Streetwear Skits",
      badge: "0 to 180k Followers",
      badgeIcon: (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ),
      summary: "Turned a quiet beverage company into an energetic internet culture staple with dopamine-fueled comedy skits and vibrant aesthetics.",
      image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=900&auto=format&fit=crop&q=80",
      modalDesc: "Took an emerging beverage brand from stale graphics to an electric, dopamine-fueled social media presence. Created a 30-day continuous skit series featuring creator talent and streetwear aesthetic.",
      metrics: "0 to 180k Followers in 60 Days &bull; 18.2M Impressions &bull; Sold Out 3 Batches",
      stack: ["Brand Direction", "Scriptwriting", "Comedy Skits", "Visual Identity", "Instagram Grids"],
    },
    {
      id: "3",
      title: "Kinetix Fitness App &bull; Paid UGC Creative Sprint",
      category: "paid",
      categoryTag: "Performance UGC &bull; Meta & TikTok",
      badge: "-54% Customer CAC",
      badgeIcon: (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      ),
      summary: "Engineered 45 modular UGC variations with high-friction problem hooks, scaling client ad spend profitably from $5k/day to $35k/day.",
      image: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=900&auto=format&fit=crop&q=80",
      modalDesc: "Produced 45 modular UGC video creatives with 15 unique hooks testing emotional pain points and fitness gamification. Identified 3 winning creative angles that scaled ad spend from $5k/day to $35k/day profitably.",
      metrics: "-54% Customer Acquisition Cost (CAC) &bull; $1.4M App Installs &bull; 4.8★ Rating",
      stack: ["Meta Ads Creative", "TikTok Spark Ads", "Direct Response Scripting", "A/B Hook Testing"],
    },
    {
      id: "4",
      title: "Founders Pod &bull; High-Retention Shorts Strategy",
      category: "shortform",
      categoryTag: "Podcast Repurposing &bull; YouTube",
      badge: "14.5M Shorts Views",
      badgeIcon: (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ),
      summary: "High-energy sound effects, kinetic subtitles, and micro-edits generated +85,000 new YouTube subscribers in 90 days.",
      image: "https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=900&auto=format&fit=crop&q=80",
      modalDesc: "Transformed 2-hour longform podcast discussions into hyper-retention 45-second vertical clips with dynamic captions, audio sound effects, and kinetic zoom transitions.",
      metrics: "14.5M Shorts Views &bull; +85k YouTube Subscribers &bull; Featured by TechCrunch",
      stack: ["Dynamic Subtitles", "Sound FX Design", "Pacing Optimization", "Multi-Platform Distribution"],
    },

    // --- 2. TECH, AI & AUTOMATION CAMPAIGNS (END / LAST) ---
    {
      id: "ai-1",
      title: "Nexus Swarm &bull; Autonomous Agentic AI Workflow Platform",
      category: "ai-auto",
      categoryTag: "Agentic AI &bull; LLM Swarms",
      badge: "94% Ops Automated",
      badgeIcon: (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
        </svg>
      ),
      summary: "Autonomous multi-agent swarms that plan, research, and execute complex workflows without human bottlenecks, saving 40+ hours per week.",
      image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=900&auto=format&fit=crop&q=80",
      modalDesc: "Architected an autonomous multi-agent AI matrix coordinating specialized agents for market intelligence, CRM routing, document synthesis, and automated execution with sub-second feedback loops.",
      metrics: "1.2M+ Automated Executions &bull; 99.8% Precision &bull; 14 Coordinated Agents",
      stack: ["LangGraph", "Multi-Agent Orchestration", "FastAPI", "Vector Embeddings", "Next.js"],
    },
    {
      id: "ai-2",
      title: "OmniFlow &bull; WhatsApp & Social Omnichannel Automation",
      category: "ai-auto",
      categoryTag: "WhatsApp &bull; Social Automation",
      badge: "8.5x Lead Velocity",
      badgeIcon: (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ),
      summary: "Integrated WhatsApp Cloud API bot and social media automation matrix that auto-qualifies leads, schedules appointments, and auto-syncs CRM.",
      image: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=900&auto=format&fit=crop&q=80",
      modalDesc: "Built an omnichannel customer conversational funnel. Incoming WhatsApp messages and social media DMs are processed with semantic AI, converting casual inquiries into confirmed calendar bookings 24/7.",
      metrics: "450k+ Messages Handled &bull; 24/7 Zero Latency &bull; $820k Pipeline Generated",
      stack: ["Meta Cloud API", "WhatsApp Business", "Social Webhooks", "CRM Two-Way Sync", "Node.js"],
    },
    {
      id: "web3-1",
      title: "EtherVault &bull; Web3 DeFi Protocol & Smart Contract Suite",
      category: "dev-web3",
      categoryTag: "Blockchain &bull; Smart Contracts",
      badge: "$140M TVL Secured",
      badgeIcon: (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      ),
      summary: "High-security EVM and Solana smart contracts with liquid yield protocols and an ultra-responsive Web3 dApp interface.",
      image: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=900&auto=format&fit=crop&q=80",
      modalDesc: "Engineered battle-tested smart contracts audited by top security firms. Paired with a sleek, reactive Web3 dashboard enabling frictionless wallet connections and cross-chain bridging.",
      metrics: "$140M Total Value Locked &bull; Audited by CertiK &bull; 62k Unique Wallets",
      stack: ["Solidity", "Rust", "Hardhat", "Wagmi / Viem", "Next.js 15"],
    },
    {
      id: "dev-1",
      title: "Apex Cloud &bull; Enterprise SaaS & Microservices Architecture",
      category: "dev-web3",
      categoryTag: "Software Dev &bull; Cloud SaaS",
      badge: "<12ms API Latency",
      badgeIcon: (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
        </svg>
      ),
      summary: "Custom full-stack web and mobile application suite processing millions of event-driven transactions with enterprise security and speed.",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=900&auto=format&fit=crop&q=80",
      modalDesc: "Full-stack product build from scratch: modern React/Next.js frontend, typed GraphQL/REST backend, embedded SQLite/PostgreSQL clustering, and cloud automation.",
      metrics: "10M+ Monthly API Requests &bull; 99.99% Uptime &bull; Global Multi-Region",
      stack: ["TypeScript", "Next.js", "SQLite", "Docker & Kubernetes", "TailwindCSS"],
    },
  ];

  const filteredCampaigns =
    activeFilter === "all"
      ? campaigns
      : campaigns.filter((c) => c.category === activeFilter);

  return (
    <section className="section" id="work" style={{ background: "rgba(10, 14, 23, 0.45)" }}>
      <div className="container">
        <div className="section-header">
          <span className="section-pill-tag reveal">Our Portfolio &amp; Case Studies</span>
          <h2 className="section-title reveal">
            Work That Performs. <span className="gradient-title">Results That Scale.</span>
          </h2>
          <p className="section-desc reveal">
            A curated showcase of our viral short-form series, transformative brand reboots, high-converting paid social ad campaigns, alongside next-gen AI automation and software platforms.
          </p>
        </div>

        {/* Filter Tabs: Content first, AI & Software at the end */}
        <div className="portfolio-tabs">
          <button
            type="button"
            className={`tab-btn ${activeFilter === "all" ? "active" : ""}`}
            onClick={() => setActiveFilter("all")}
          >
            All Work
          </button>
          <button
            type="button"
            className={`tab-btn ${activeFilter === "shortform" ? "active" : ""}`}
            onClick={() => setActiveFilter("shortform")}
          >
            Reels &amp; Shorts
          </button>
          <button
            type="button"
            className={`tab-btn ${activeFilter === "creative" ? "active" : ""}`}
            onClick={() => setActiveFilter("creative")}
          >
            Brand &amp; Content
          </button>
          <button
            type="button"
            className={`tab-btn ${activeFilter === "paid" ? "active" : ""}`}
            onClick={() => setActiveFilter("paid")}
          >
            Paid Social UGC
          </button>
          <button
            type="button"
            className={`tab-btn ${activeFilter === "ai-auto" ? "active" : ""}`}
            onClick={() => setActiveFilter("ai-auto")}
          >
            AI &amp; Automation
          </button>
          <button
            type="button"
            className={`tab-btn ${activeFilter === "dev-web3" ? "active" : ""}`}
            onClick={() => setActiveFilter("dev-web3")}
          >
            Software &amp; Blockchain
          </button>
        </div>

        {/* Projects Grid */}
        <div className="portfolio-grid">
          {filteredCampaigns.map((camp) => (
            <div
              key={camp.id}
              className="project-card portfolio-card-animate"
              data-category={camp.category}
              data-project-id={camp.id}
              onClick={() => setSelectedProject(camp)}
            >
              <div className="project-thumbnail">
                <Image
                  src={camp.image}
                  alt={camp.title.replace(/&bull;/g, "•")}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  style={{ objectFit: "cover" }}
                  priority={camp.id === "1"}
                />
                <div className="project-overlay">
                  <span className="view-case-study">Explore Case Study &rarr;</span>
                </div>
              </div>
              <div className="project-content">
                <div className="project-meta">
                  <span
                    className="project-category"
                    dangerouslySetInnerHTML={{ __html: camp.categoryTag }}
                  />
                  <span className="project-badge">
                    {camp.badgeIcon}
                    <span>{camp.badge}</span>
                  </span>
                </div>
                <h3
                  className="project-title"
                  dangerouslySetInnerHTML={{ __html: camp.title }}
                />
                <p className="project-desc">{camp.summary}</p>
                <div className="project-tags">
                  {camp.stack.slice(0, 3).map((tech, idx) => (
                    <span key={idx} className="project-tag">
                      {tech}
                    </span>
                  ))}
                  {camp.stack.length > 3 && (
                    <span className="project-tag">+{camp.stack.length - 3} more</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Case Study Detailed Modal */}
      <CaseStudyModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />
    </section>
  );
}
