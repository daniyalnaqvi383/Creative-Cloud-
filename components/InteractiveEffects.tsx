"use client";

import React, { useEffect } from "react";

export default function InteractiveEffects() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    // 1. Dynamic Card Spotlights
    const handleCardMouseMove = (e: MouseEvent) => {
      const target = (e.target as HTMLElement)?.closest(".spotlight-card") as HTMLElement | null;
      if (!target) return;
      const rect = target.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      target.style.setProperty("--mouse-x", `${x}px`);
      target.style.setProperty("--mouse-y", `${y}px`);
    };

    document.addEventListener("mousemove", handleCardMouseMove);

    // 2. 3D Tilt Effect
    const tiltElements = document.querySelectorAll<HTMLElement>("[data-tilt]");
    const cleanups: (() => void)[] = [];

    if (window.innerWidth >= 1024) {
      tiltElements.forEach((el) => {
        const maxTilt = parseFloat(el.getAttribute("data-tilt-max") || "14");

        const onMouseMove = (e: MouseEvent) => {
          const rect = el.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;
          const centerX = rect.width / 2;
          const centerY = rect.height / 2;
          const rotateX = ((y - centerY) / centerY) * -maxTilt;
          const rotateY = ((x - centerX) / centerX) * maxTilt;
          el.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.025, 1.025, 1.025)`;
        };

        const onMouseLeave = () => {
          el.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)";
        };

        el.addEventListener("mousemove", onMouseMove);
        el.addEventListener("mouseleave", onMouseLeave);

        cleanups.push(() => {
          el.removeEventListener("mousemove", onMouseMove);
          el.removeEventListener("mouseleave", onMouseLeave);
        });
      });
    }

    // 3. Magnetic Buttons Elastic Pull
    const magneticButtons = document.querySelectorAll<HTMLElement>(".magnetic-btn");
    if (window.innerWidth >= 768) {
      magneticButtons.forEach((btn) => {
        const onMouseMove = (e: MouseEvent) => {
          const rect = btn.getBoundingClientRect();
          const x = e.clientX - rect.left - rect.width / 2;
          const y = e.clientY - rect.top - rect.height / 2;
          btn.style.transform = `translate(${x * 0.35}px, ${y * 0.35}px)`;
        };

        const onMouseLeave = () => {
          btn.style.transform = "translate(0px, 0px)";
        };

        btn.addEventListener("mousemove", onMouseMove);
        btn.addEventListener("mouseleave", onMouseLeave);

        cleanups.push(() => {
          btn.removeEventListener("mousemove", onMouseMove);
          btn.removeEventListener("mouseleave", onMouseLeave);
        });
      });
    }

    // 4. Parallax Floating Elements on Scroll
    const parallaxItems = document.querySelectorAll<HTMLElement>(".parallax-float");
    const onScrollParallax = () => {
      if (window.innerWidth < 1024) return;
      const scrollY = window.scrollY;
      parallaxItems.forEach((item) => {
        const speed = parseFloat(item.getAttribute("data-speed") || "0.12");
        item.style.transform = `translateY(${-(scrollY * speed)}px)`;
      });
    };
    window.addEventListener("scroll", onScrollParallax, { passive: true });

    // 5. Scroll Reveals with Progressive Blur
    const reveals = document.querySelectorAll<HTMLElement>(".reveal");
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("active");
          }
        });
      },
      { threshold: 0.05, rootMargin: "0px 0px -20px 0px" }
    );
    reveals.forEach((el) => {
      // Auto-activate on mobile or if already in viewport
      if (window.innerWidth < 768) {
        el.classList.add("active");
      } else {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
          el.classList.add("active");
        }
      }
      revealObserver.observe(el);
    });

    // 6. Live KPI Animated Numerical Counters
    const counters = document.querySelectorAll<HTMLElement>("[data-counter-target]");
    const countObserver = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target as HTMLElement;
            const target = parseFloat(el.getAttribute("data-counter-target") || "0");
            const prefix = el.getAttribute("data-counter-prefix") || "";
            const suffix = el.getAttribute("data-counter-suffix") || "";
            const isDecimal = target % 1 !== 0;

            let current = 0;
            const duration = 2000;
            const startTime = performance.now();

            const updateCounter = (currentTime: number) => {
              const elapsed = currentTime - startTime;
              const progress = Math.min(elapsed / duration, 1);
              const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);

              current = target * easeProgress;
              el.textContent = `${prefix}${isDecimal ? current.toFixed(1) : Math.round(current)}${suffix}`;

              if (progress < 1) {
                requestAnimationFrame(updateCounter);
              } else {
                el.textContent = `${prefix}${isDecimal ? target.toFixed(1) : target}${suffix}`;
              }
            };

            requestAnimationFrame(updateCounter);
            obs.unobserve(el);
          }
        });
      },
      { threshold: 0.4 }
    );
    counters.forEach((c) => countObserver.observe(c));

    return () => {
      document.removeEventListener("mousemove", handleCardMouseMove);
      window.removeEventListener("scroll", onScrollParallax);
      cleanups.forEach((fn) => fn());
      revealObserver.disconnect();
      countObserver.disconnect();
    };
  }, []);

  return null;
}
