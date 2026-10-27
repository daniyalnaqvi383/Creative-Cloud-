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

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      if (!isVisible) {
        dot.style.opacity = "1";
        follower.style.opacity = "1";
        isVisible = true;
      }

      dot.style.left = `${mouseX}px`;
      dot.style.top = `${mouseY}px`;
    };

    const renderFollower = () => {
      followerX += (mouseX - followerX) * 0.18;
      followerY += (mouseY - followerY) * 0.18;

      follower.style.left = `${followerX}px`;
      follower.style.top = `${followerY}px`;

      animId = requestAnimationFrame(renderFollower);
    };

    animId = requestAnimationFrame(renderFollower);

    const onMouseLeave = () => {
      dot.style.opacity = "0";
      follower.style.opacity = "0";
      isVisible = false;
    };

    window.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseleave", onMouseLeave);

    // Dynamic hover listeners
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const projectCard = target.closest(".project-card");
      if (projectCard) {
        follower.classList.add("hovering-project");
        setBadgeText("WATCH");
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

    document.addEventListener("mouseover", handleMouseOver);

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
      <div ref={dotRef} className="custom-cursor-dot" />
      <div ref={followerRef} className="custom-cursor-follower">
        <span className="cursor-badge">{badgeText}</span>
      </div>
    </>
  );
}
