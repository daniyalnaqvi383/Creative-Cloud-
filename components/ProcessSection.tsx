import React from "react";

export default function ProcessSection() {
  const steps = [
    {
      num: "STEP 01",
      tag: "AUDIT & TRENDS",
      title: "Trend Discovery",
      desc: "We analyze your niche, reverse-engineer high-retention competitor clips, and identify breakout viral audio and angles.",
      stagger: "stagger-1",
    },
    {
      num: "STEP 02",
      tag: "SCRIPT & HOOKS",
      title: "Hook Engineering",
      desc: "We craft 3-second visual and auditory patterns designed to destroy scroll inertia and hold viewer attention through to the CTA.",
      stagger: "stagger-2",
    },
    {
      num: "STEP 03",
      tag: "CINEMATIC SHOOT",
      title: "High-Res Production",
      desc: "Studio cameras, studio lighting, crisp directional audio, or authentic creator-led UGC filming matching current platform trends.",
      stagger: "stagger-3",
    },
    {
      num: "STEP 04",
      tag: "EDIT & AMPLIFY",
      title: "Pacing & Publishing",
      desc: "Kinetic typography, sound design pops, custom thumbnail creation, and optimal scheduling times for explosive algorithm pickup.",
      stagger: "stagger-4",
    },
  ];

  return (
    <section className="section" id="process">
      <div className="container">
        <div className="section-header">
          <span className="section-pill-tag reveal">The Viral Formula</span>
          <h2 className="section-title reveal">
            How We Turn Ideas Into <span className="gradient-title">Millions of Views</span>
          </h2>
          <p className="section-desc reveal">
            We don&apos;t rely on luck. Our content sprint engine applies algorithmic science, psychological triggers, and cinematic production.
          </p>
        </div>

        <div className="blueprint-grid">
          {steps.map((st, idx) => (
            <div key={idx} className={`blueprint-card reveal ${st.stagger}`}>
              <div className="blueprint-step-num">
                <span className="num-badge">{st.num}</span>
                <span>{st.tag}</span>
              </div>
              <h3 className="blueprint-step-title">{st.title}</h3>
              <p className="blueprint-step-desc">{st.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
