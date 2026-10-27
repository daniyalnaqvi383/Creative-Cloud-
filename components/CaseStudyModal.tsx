"use client";

import React, { useEffect } from "react";

export interface CaseStudyData {
  id: string;
  title: string;
  category: string;
  categoryTag: string;
  badge: string;
  badgeIcon: React.ReactNode;
  summary: string;
  image: string;
  modalDesc: string;
  metrics: string;
  stack: string[];
}

interface CaseStudyModalProps {
  project: CaseStudyData | null;
  onClose: () => void;
}

export default function CaseStudyModal({ project, onClose }: CaseStudyModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    if (project) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [project, onClose]);

  if (!project) return null;

  return (
    <div
      className={`modal-backdrop ${project ? "active" : ""}`}
      id="projectModal"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modalTitle"
    >
      <div className="modal-content-box">
        <button className="modal-close-btn" id="modalCloseBtn" onClick={onClose} aria-label="Close modal">
          ✕
        </button>

        <div
          style={{
            fontSize: "0.78rem",
            color: "#fb7185",
            fontWeight: 800,
            textTransform: "uppercase",
            marginBottom: "0.5rem",
          }}
          id="modalCategory"
        >
          {project.categoryTag}
        </div>

        <h3
          style={{
            fontSize: "1.6rem",
            fontWeight: 800,
            color: "#fff",
            marginBottom: "1rem",
          }}
          id="modalTitle"
          dangerouslySetInnerHTML={{ __html: project.title }}
        />

        <p
          style={{
            color: "var(--text-muted)",
            fontSize: "0.95rem",
            lineHeight: 1.6,
            marginBottom: "1.5rem",
          }}
          id="modalDesc"
        >
          {project.modalDesc}
        </p>

        <div
          style={{
            background: "rgba(0,0,0,0.35)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: "var(--radius-sm)",
            padding: "0.85rem",
            marginBottom: "1.5rem",
            color: "#38bdf8",
            fontSize: "0.88rem",
          }}
          id="modalMetrics"
        >
          <strong>Campaign Results:</strong>{" "}
          <span dangerouslySetInnerHTML={{ __html: project.metrics }} />
        </div>

        <div
          style={{
            display: "flex",
            gap: "0.5rem",
            justifyContent: "center",
            flexWrap: "wrap",
            marginBottom: "2rem",
          }}
          id="modalStack"
        >
          {project.stack.map((item, idx) => (
            <span key={idx} className="service-tag">
              {item}
            </span>
          ))}
        </div>

        <a
          href="#schedule"
          className="magnetic-btn btn-primary"
          onClick={onClose}
          style={{ width: "100%" }}
        >
          Book Similar Campaign Strategy
        </a>
      </div>
    </div>
  );
}
