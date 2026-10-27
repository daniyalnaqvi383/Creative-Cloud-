"use client";

import React, { useEffect } from "react";

interface MobileNavDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileNavDrawer({ isOpen, onClose }: MobileNavDrawerProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <div
      className={`mobile-nav-drawer ${isOpen ? "open" : ""}`}
      id="mobileNavDrawer"
      aria-hidden={!isOpen}
    >
      <button
        className="modal-close-btn"
        id="mobileDrawerClose"
        style={{ color: "#fff", fontSize: "1.5rem" }}
        onClick={onClose}
        aria-label="Close menu"
      >
        ✕
      </button>

      <ul className="mobile-nav-links">
        <li>
          <a href="#home" onClick={onClose}>
            Home
          </a>
        </li>
        <li>
          <a href="#services" onClick={onClose}>
            What We Do
          </a>
        </li>
        <li>
          <a href="#work" onClick={onClose}>
            Campaign Portfolio
          </a>
        </li>
        <li>
          <a href="#process" onClick={onClose}>
            The Viral Formula
          </a>
        </li>
        <li>
          <a href="#schedule" onClick={onClose}>
            Schedule Meeting
          </a>
        </li>
        <li>
          <a href="#testimonials" onClick={onClose}>
            Client Reviews
          </a>
        </li>
        <li>
          <a href="#contact" onClick={onClose}>
            Direct Contact
          </a>
        </li>
      </ul>

      <a
        href="tel:+18022650207"
        className="magnetic-btn btn-glow-phone"
        style={{ width: "100%", textAlign: "center", marginBottom: "0.75rem" }}
        onClick={onClose}
      >
        📞 Call +1 (802) 265-0207
      </a>
      <a
        href="#schedule"
        className="magnetic-btn btn-primary"
        style={{ width: "100%", textAlign: "center" }}
        onClick={onClose}
      >
        📹 Book 1-on-1 Zoom Call
      </a>
    </div>
  );
}
