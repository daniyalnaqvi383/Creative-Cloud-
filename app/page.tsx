"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import Navbar from "@/components/Navbar";
import MobileNavDrawer from "@/components/MobileNavDrawer";
import HeroSection from "@/components/HeroSection";
import Marquee from "@/components/Marquee";
import ServicesSection from "@/components/ServicesSection";
import PortfolioSection from "@/components/PortfolioSection";
import ProcessSection from "@/components/ProcessSection";
import ScheduleSection from "@/components/ScheduleSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";

const SmoothScroll = dynamic(() => import("@/components/SmoothScroll"), { ssr: false });
const CustomCursor = dynamic(() => import("@/components/CustomCursor"), { ssr: false });
const InteractiveEffects = dynamic(() => import("@/components/InteractiveEffects"), { ssr: false });
const AmbientBackground = dynamic(() => import("@/components/AmbientBackground"), { ssr: false });
const ScrollProgressBar = dynamic(() => import("@/components/ScrollProgressBar"), { ssr: false });

export default function HomePage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      {/* Inertial Kinetic Smooth Scrolling */}
      <SmoothScroll />

      {/* Ambient background lighting and grid texture */}
      <AmbientBackground />

      {/* Top scroll progress indicator */}
      <ScrollProgressBar />

      {/* Custom Spring Cursor (Desktop) */}
      <CustomCursor />

      {/* DOM Micro-Interactions: Spotlights, 3D Tilt, Magnetic Pull, Reveals, KPI Counters */}
      <InteractiveEffects />

      {/* Header Navigation */}
      <Navbar onOpenMobileMenu={() => setMobileMenuOpen(true)} />

      {/* Mobile Drawer */}
      <MobileNavDrawer
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />

      <main id="main-content">
        {/* Hero Section */}
        <HeroSection />

        {/* Marquee Platform Channels */}
        <Marquee />

        {/* Capabilities / Services */}
        <ServicesSection />

        {/* Campaign Portfolio & Case Studies */}
        <PortfolioSection />

        {/* The Viral Formula 4-Step Process */}
        <ProcessSection />

        {/* Schedule Strategy Meeting & Direct Phone Call */}
        <ScheduleSection />

        {/* Client Testimonials */}
        <TestimonialsSection />

        {/* Direct Contact & Inquiries */}
        <ContactSection />
      </main>

      {/* Footer */}
      <Footer />
    </>
  );
}
