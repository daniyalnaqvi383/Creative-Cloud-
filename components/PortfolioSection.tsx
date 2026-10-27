"use client";

import React, { useState } from "react";
import CaseStudyModal, { CaseStudyData } from "./CaseStudyModal";

export default function PortfolioSection() {
  const [activeFilter, setActiveFilter] = useState("all");
  const [selectedProject, setSelectedProject] = useState<CaseStudyData | null>(null);

  const campaigns: CaseStudyData[] = [
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
      category: "rebrand",
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
  ];

  const filteredCampaigns =
    activeFilter === "all"
      ? campaigns
      : campaigns.filter((c) => c.category === activeFilter);

  return (
    <section className="section" id="work" style={{ background: "rgba(10, 14, 23, 0.45)" }}>
      <div className="container">
        <div className="section-header">
          <span className="section-pill-tag reveal">Our Creative Portfolio</span>
          <h2 className="section-title reveal">
            Campaigns Launched. <span className="gradient-title">Audiences Captivated.</span>
          </h2>
          <p className="section-desc reveal">
            A curated showcase of our recent viral short-form series, transformative brand reboots, and high-converting paid social ad campaigns.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="portfolio-tabs">
          <button
            type="button"
            className={`tab-btn ${activeFilter === "all" ? "active" : ""}`}
            onClick={() => setActiveFilter("all")}
          >
            All Campaigns
          </button>
          <button
            type="button"
            className={`tab-btn ${activeFilter === "shortform" ? "active" : ""}`}
            onClick={() => setActiveFilter("shortform")}
          >
            Reels &amp; TikTok
          </button>
          <button
            type="button"
            className={`tab-btn ${activeFilter === "rebrand" ? "active" : ""}`}
            onClick={() => setActiveFilter("rebrand")}
          >
            Brand Makeovers
          </button>
          <button
            type="button"
            className={`tab-btn ${activeFilter === "paid" ? "active" : ""}`}
            onClick={() => setActiveFilter("paid")}
          >
            Paid Social UGC
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
              <div className="project-image-wrap">
                <img className="project-img" src={camp.image} alt={camp.title.replace(/&bull;/g, "•")} />
                <div className="project-overlay">
                  <div className="project-metric-badge">
                    {camp.badgeIcon}
                    <span>{camp.badge}</span>
                  </div>
                  <div className="project-tags">
                    <span
                      className="project-category-tag"
                      style={{
                        color: "#fb7185",
                        fontSize: "0.75rem",
                        fontWeight: 800,
                        textTransform: "uppercase",
                      }}
                      dangerouslySetInnerHTML={{ __html: camp.categoryTag }}
                    />
                  </div>
                  <h3 className="project-name">{camp.title.split("&bull;")[0].trim()}</h3>
                  <p className="project-summary">{camp.summary}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Case Study Detail Modal */}
      <CaseStudyModal project={selectedProject} onClose={() => setSelectedProject(null)} />
    </section>
  );
}
