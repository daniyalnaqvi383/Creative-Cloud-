"use client";

import React, { useEffect, useRef, useState } from "react";

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const followerRef = useRef<HTMLDivElement>(null);
  const [badgeText, setBadgeText] = useState("WATCH");
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    // Only enable on desktop pointer devices
    if (
      typeof window === "undefined" ||
      "ontouchstart" in window ||
      navigator.maxTouchPoints > 0 ||
      window.innerWidth < 768
    ) {
      return;
    }

    setEnabled(true);

    const dot = dotRef.current;
    const follower = followerRef.current;
    if (!dot || !follower) return;

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let followerX = mouseX;
    let followerY = mouseY;
    let isVisible = false;
    let animId: number;
    let isMoving = false;

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      if (!isVisible) {
        dot.style.opacity = "1";
        follower.style.opacity = "1";
        isVisible = true;
      }

      // Hardware accelerated transform instead of top/left layout thrash
      dot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;
      isMoving = true;
    };

    const renderFollower = () => {
      const dx = mouseX - followerX;
      const dy = mouseY - followerY;

      // Only calculate if there's noticeable movement
      if (Math.abs(dx) > 0.1 || Math.abs(dy) > 0.1 || isMoving) {
        followerX += dx * 0.2;
        followerY += dy * 0.2;
        follower.style.transform = `translate3d(${followerX}px, ${followerY}px, 0) translate(-50%, -50%)`;
        isMoving = false;
      }

      animId = requestAnimationFrame(renderFollower);
    };

    animId = requestAnimationFrame(renderFollower);

    const onMouseLeave = () => {
      dot.style.opacity = "0";
      follower.style.opacity = "0";
      isVisible = false;
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    document.addEventListener("mouseleave", onMouseLeave, { passive: true });

    // Dynamic hover listeners
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const projectCard = target.closest(".project-card");
      if (projectCard) {
        follower.classList.add("hovering-project");
        setBadgeText("EXPLORE");
        return;
      } else {
        follower.classList.remove("hovering-project");
      }

      const interactive = target.closest(
        "a, button, .date-pill-btn, .time-pill-btn, .tab-btn, input, textarea, .spotlight-card"
      );
      if (interactive) {
        follower.classList.add("hovering-link");
      } else {
        follower.classList.remove("hovering-link");
      }
    };

    document.addEventListener("mouseover", handleMouseOver, { passive: true });

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseleave", onMouseLeave);
      document.removeEventListener("mouseover", handleMouseOver);
    };
  }, []);

  if (!enabled) return null;

  return (
    <>
      <div
        ref={dotRef}
        id="cursor-dot"
        className="custom-cursor-dot"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          opacity: 0,
          willChange: "transform",
          pointerEvents: "none",
        }}
      />
      <div
        ref={followerRef}
        id="cursor-follower"
        className="custom-cursor-follower"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          opacity: 0,
          willChange: "transform",
          pointerEvents: "none",
        }}
      >
        <span className="cursor-badge">{badgeText}</span>
      </div>
    </>
  );
}
