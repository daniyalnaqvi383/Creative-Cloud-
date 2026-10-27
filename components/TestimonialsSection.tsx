import React from "react";

export default function TestimonialsSection() {
  const testimonials = [
    {
      quote:
        '"Before Creative Cloud, we spent thousands on ads with zero traction. Within our first 30 days of short-form videos with them, one Reel hit 3.4M views and generated $82k in direct revenue."',
      author: "Chloe Davenport",
      role: "Founder, LuxeAura Beauty",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80",
      stagger: "stagger-1",
    },
    {
      quote:
        '"Their script hooks are ridiculously effective. They completely revamped our TikTok channel and took us from 2,000 views per post to consistently averaging 300k+ views per video."',
      author: "Jason Miller",
      role: "Head of Growth, Volt Beverages",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80",
      stagger: "stagger-2",
    },
    {
      quote:
        '"Creative Cloud understands internet culture better than any agency on the planet. They produce at blistering speed, never miss a deadline, and our DMs have been blowing up with inbound leads."',
      author: "Amanda Cole",
      role: "CMO, Kinetix App",
      avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=120&auto=format&fit=crop&q=80",
      stagger: "stagger-3",
    },
  ];

  return (
    <section className="section" id="testimonials" style={{ background: "rgba(10, 14, 23, 0.4)" }}>
      <div className="container">
        <div className="section-header">
          <span className="section-pill-tag reveal">Client Praise</span>
          <h2 className="section-title reveal">
            What Founders Say About <span className="gradient-title">Our Content</span>
          </h2>
          <p className="section-desc reveal">
            Real brand results from founders, CMOs, and creators who scaled their attention with Creative Cloud.
          </p>
        </div>

        <div className="testimonials-grid">
          {testimonials.map((t, idx) => (
            <div key={idx} className={`testimonial-card spotlight-card reveal ${t.stagger}`}>
              <div>
                <div className="stars-row">★★★★★</div>
                <p className="testimonial-quote">{t.quote}</p>
              </div>
              <div className="testimonial-author-box">
                <img className="author-avatar" src={t.avatar} alt={t.author} />
                <div>
                  <div className="author-name">{t.author}</div>
                  <div className="author-role">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
