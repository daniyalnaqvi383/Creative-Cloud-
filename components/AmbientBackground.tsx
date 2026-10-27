"use client";

import React, { useEffect, useRef } from "react";

export default function AmbientBackground() {
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined" || window.innerWidth < 768) return;

    const glow = glowRef.current;
    if (!glow) return;

    let glowX = window.innerWidth / 2;
    let glowY = window.innerHeight / 2;
    let targetX = glowX;
    let targetY = glowY;
    let animId: number;

    const onMouseMove = (e: MouseEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;
    };

    const updateGlow = () => {
      glowX += (targetX - glowX) * 0.1;
      glowY += (targetY - glowY) * 0.1;

      if (glow) {
        glow.style.transform = `translate(${glowX - 300}px, ${glowY - 300}px)`;
      }
      animId = requestAnimationFrame(updateGlow);
    };

    window.addEventListener("mousemove", onMouseMove);
    animId = requestAnimationFrame(updateGlow);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <>
      {/* Ambient Mesh Orbs with Soft Animated Gradients */}
      <div className="ambient-mesh" aria-hidden="true">
        <div className="mesh-orb mesh-orb-1" />
        <div className="mesh-orb mesh-orb-2" />
        <div className="mesh-orb mesh-orb-3" />
      </div>

      {/* Dynamic Ambient Mouse Spotlight Glow */}
      <div ref={glowRef} className="global-mouse-glow" aria-hidden="true" />

      {/* Background Grid Pattern Overlay */}
      <div className="bg-grid-overlay" aria-hidden="true" />
    </>
  );
}
