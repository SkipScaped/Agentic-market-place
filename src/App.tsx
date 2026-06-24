/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * ----------------- BACKEND ARCHITECT PLAN -----------------
 * TO THE BACKEND / FULL-STACK ENGINEER:
 * 
 * If you are preparing to elevate this high-fidelity React MVP into a production product:
 * 
 * 1. BACKEND ROUTING ENGINE (Express / NestJS):
 *    - Configure an Express server (or similar node framework) using the templates outlined in the
 *      React/Vite system guide. Add `/api/waitlist` to process signups directly to a persistent DB instead of localStorage.
 *    - Endpoint layout:
 *      * POST `/api/waitlist/join` -> Receives { email, referralToken }. Validates email syntax, checks for duplicates,
 *        hashes the source IP, updates DB, generates a custom waitlist queue number, and returns it.
 *      * GET `/api/waitlist/status?email=...` -> Fetches real-time status and referral counter.
 * 
 * 2. CHOSEN DATA PERSISTENCE LAYER:
 *    - RELATIONAL: If using PostgreSQL (via Cloud SQL as documented in the `/skills/system_skills/cloudsql-setup/SKILL.md` skill):
 *      * Spin up PostgreSQL, install Drizzle ORM, and define a relational waitlist schema with unique indices on email.
 *    - DOCUMENT-BASED: If using Google Firestore (via `/skills/system_skills/firebase-skill/SKILL.md` skill):
 *      * Bootstrap Firestore database. Set up security rules prohibiting public writes to credentials, while allowing waitlist appends.
 * 
 * 3. AGENT VALIDATION SECURE RUNTIME (Sandboxing):
 *    - Since this is an Agentic Marketplace, developers will register API execution routes.
 *    - When an Agent calls another Agent, proxy the programmatic query through a secure runtime server.
 *    - Implement API rate limiting (e.g., using Redis) and token bucket algorithms to prevent DDoS vectors.
 * -----------------------------------------------------------
 */

import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import AgenticMesh from "./components/AgenticMesh";
import MatrixBackground from "./components/MatrixBackground";
import Header from "./components/Header";
import Hero from "./components/Hero";
import ProblemSolution from "./components/ProblemSolution";
import MarketplaceEconomics from "./components/MarketplaceEconomics";
import FounderVision from "./components/FounderVision";
import Footer from "./components/Footer";

export default function App() {
  // Global theme manager, defaulting to dark mode for that premium cyberpunk vibe
  const [theme, setTheme] = useState<"dark" | "light">(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("agentic_marketplace_theme");
      if (stored === "light" || stored === "dark") {
        return stored;
      }
    }
    return "dark";
  });

  // Synchronize CSS class and store setting
  useEffect(() => {
    const root = document.documentElement;
    if (theme === "light") {
      root.classList.add("light-theme");
      root.classList.remove("dark-theme");
    } else {
      root.classList.add("dark-theme");
      root.classList.remove("light-theme");
    }
    localStorage.setItem("agentic_marketplace_theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  return (
    <div 
      id="app-root-container"
      className={`min-h-screen w-full relative transition-colors duration-500 overflow-x-hidden selection:bg-purple-500/30 selection:text-white ${
        theme === "dark" ? "bg-[#050508] text-gray-100" : "bg-[#fafafc] text-gray-900"
      }`}
    >
      {/* 1. Fixed Interactive 3D Background ("The Agentic Mesh") */}
      <AgenticMesh theme={theme} />

      {/* 1b. Matrix Rain Animated Digital Core Stream */}
      <MatrixBackground theme={theme} />

      {/* 2. Soft atmospheric background glowing lights */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-15">
        {/* Soft cyan blur on top left */}
        <div className={`absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full blur-[140px] opacity-40 animate-pulse-neural-1 transition-all duration-500 ${
          theme === "dark" ? "bg-cyan-950/10" : "bg-cyan-200/12"
        }`} />
        
        {/* Soft violet blur on bottom right */}
        <div className={`absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full blur-[160px] opacity-30 animate-pulse-neural-2 transition-all duration-500 ${
          theme === "dark" ? "bg-purple-950/10" : "bg-purple-200/12"
        }`} />
      </div>

      {/* 3. Main Landing Layout Grid */}
      <div className="relative z-10 flex flex-col min-h-screen">
        
        {/* Custom Navigation / Sticky Glassmorphic Navbar */}
        <Header theme={theme} toggleTheme={toggleTheme} />

        {/* Hero Section (Above the fold) */}
        <main className="flex-grow flex flex-col justify-center">
          <Hero theme={theme} />
          
          {/* 2-Column Problem/Solution Grid (The Friction & The Evolution) */}
          <ProblemSolution theme={theme} />
          
          {/* 3-Column Marketplace Economics & Ecosystem */}
          <MarketplaceEconomics theme={theme} />
          
          {/* Split-Screen Founder Vision & Flywheel */}
          <FounderVision theme={theme} />
        </main>

        {/* Minimalist Footer */}
        <Footer theme={theme} />
        
      </div>
    </div>
  );
}
