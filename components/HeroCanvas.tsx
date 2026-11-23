"use client";

import React, { useEffect, useRef } from "react";

export default function HeroCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let animId: number;
    let isVisible = true;
    let width = 0;
    let height = 0;

    const dpr = Math.min(typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1, 2);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.offsetWidth || window.innerWidth;
      height = canvas.offsetHeight || 600;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
    };

    handleResize();
    window.addEventListener("resize", handleResize, { passive: true });

    // Pause canvas when out of viewport to preserve 100% CPU/GPU speed
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          isVisible = entry.isIntersecting;
          if (isVisible && !animId) {
            animId = requestAnimationFrame(animateCanvas);
          }
        });
      },
      { threshold: 0.05 }
    );
    observer.observe(canvas);

    const particleCount = Math.min(width > 768 ? 42 : 20, 50);
    const mouse: { x: number | null; y: number | null; radius: number } = {
      x: null,
      y: null,
      radius: 140,
    };

    let mouseActive = false;
    let mouseTimeout: ReturnType<typeof setTimeout>;

    const handleMouseMove = (e: MouseEvent) => {
      const heroRect = canvas.getBoundingClientRect();
      if (e.clientY <= heroRect.bottom && e.clientY >= heroRect.top) {
        mouse.x = e.clientX - heroRect.left;
        mouse.y = e.clientY - heroRect.top;
        mouseActive = true;
        clearTimeout(mouseTimeout);
        mouseTimeout = setTimeout(() => {
          mouseActive = false;
          mouse.x = null;
          mouse.y = null;
        }, 2000);
      } else {
        mouse.x = null;
        mouse.y = null;
        mouseActive = false;
      }
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    class Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      color: string;
      alpha: number;

      constructor() {
        this.x = Math.random() * (width || window.innerWidth);
        this.y = Math.random() * (height || 600);
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.radius = Math.random() * 2 + 1;
        this.color = Math.random() > 0.4 ? "rgba(244, 63, 94, " : "rgba(168, 85, 247, ";
        this.alpha = Math.random() * 0.45 + 0.25;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;

        if (mouseActive && mouse.x !== null && mouse.y !== null) {
          const dx = mouse.x - this.x;
          const dy = mouse.y - this.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < mouse.radius && dist > 0) {
            const force = (mouse.radius - dist) / mouse.radius;
            this.x -= (dx / dist) * force * 1.8;
            this.y -= (dy / dist) * force * 1.8;
          }
        }
      }

      draw(c: CanvasRenderingContext2D) {
        c.beginPath();
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        c.fillStyle = `${this.color}${this.alpha})`;
        c.fill();
      }
    }

    const particles: Particle[] = [];
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    const animateCanvas = () => {
      if (!isVisible) {
        animId = 0;
        return;
      }

      ctx.clearRect(0, 0, width, height);

      const pLen = particles.length;
      for (let i = 0; i < pLen; i++) {
        const p1 = particles[i];
        p1.update();
        p1.draw(ctx);

        for (let j = i + 1; j < pLen; j++) {
          const p2 = particles[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const distSq = dx * dx + dy * dy;

          if (distSq < 12100) { // 110 * 110
            const dist = Math.sqrt(distSq);
            ctx.beginPath();
            ctx.strokeStyle = `rgba(244, 63, 94, ${(1 - dist / 110) * 0.18})`;
            ctx.lineWidth = 0.75;
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      }

      animId = requestAnimationFrame(animateCanvas);
    };

    animId = requestAnimationFrame(animateCanvas);

    return () => {
      cancelAnimationFrame(animId);
      clearTimeout(mouseTimeout);
      observer.disconnect();
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      id="heroCanvas"
      aria-hidden="true"
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 1,
      }}
    />
  );
}
