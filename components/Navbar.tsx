"use client";

import React, { useEffect, useState } from "react";

interface NavbarProps {
  onOpenMobileMenu: () => void;
}

export default function Navbar({ onOpenMobileMenu }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("home");

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);

      // Simple active link highlight based on scroll position
      const sections = ["home", "services", "work", "process", "schedule", "testimonials", "contact"];
      const scrollPos = window.scrollY + 200;

      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className={`navbar ${scrolled ? "scrolled" : ""}`} id="navbar">
      <div className="container nav-container">
        {/* Brand Logo */}
        <a href="#home" className="brand-logo" aria-label="Creative Cloud Home">
          <div className="logo-icon-wrap">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z" />
            </svg>
          </div>
          <div className="logo-text">
            <span className="bold">Creative</span>
            <span className="accent">Cloud</span>
          </div>
        </a>

        {/* Desktop Nav Menu */}
        <nav aria-label="Main Navigation">
          <ul className="nav-menu">
            <li>
              <a
                href="#home"
                className={`nav-link ${activeSection === "home" ? "active" : ""}`}
              >
                Home
              </a>
            </li>
            <li>
              <a
                href="#services"
                className={`nav-link ${activeSection === "services" ? "active" : ""}`}
              >
                Services
              </a>
            </li>
            <li>
              <a
                href="#work"
                className={`nav-link ${activeSection === "work" ? "active" : ""}`}
              >
                Portfolio
              </a>
            </li>
            <li>
              <a
                href="#process"
                className={`nav-link ${activeSection === "process" ? "active" : ""}`}
              >
                Viral Formula
              </a>
            </li>
            <li>
              <a
                href="#schedule"
                className={`nav-link ${activeSection === "schedule" ? "active" : ""}`}
              >
                Book a Call
              </a>
            </li>
            <li>
              <a
                href="#testimonials"
                className={`nav-link ${activeSection === "testimonials" ? "active" : ""}`}
              >
                Reviews
              </a>
            </li>
            <li>
              <a
                href="#contact"
                className={`nav-link ${activeSection === "contact" ? "active" : ""}`}
              >
                Contact
              </a>
            </li>
          </ul>
        </nav>

        {/* Nav Direct Phone & Action CTA */}
        <div className="nav-actions">
          <a
            href="tel:+18022650207"
            className="phone-quick-link"
            title="Call directly at +1 (802) 265-0207"
          >
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
            </svg>
            <span>(802) 265-0207</span>
          </a>
          <a href="#schedule" className="magnetic-btn btn-primary">
            Zoom Call
          </a>

          <button
            className="mobile-toggle"
            id="mobileMenuToggle"
            aria-label="Toggle navigation menu"
            onClick={onOpenMobileMenu}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}
