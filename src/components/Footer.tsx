import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Twitter, Disc, Github, Sparkles, Orbit, Terminal, Power } from "lucide-react";

interface FooterProps {
  theme: "dark" | "light";
}

export default function Footer({ theme }: FooterProps) {
  const [expanded, setExpanded] = useState(false);

  const socialLinks = [
    { name: "X / Twitter", url: "https://twitter.com", icon: Twitter, desc: "Broadcast feeds" },
    { name: "Discord Server", url: "https://discord.com", icon: Disc, desc: "Community core" },
    { name: "GitHub Repo", url: "https://github.com", icon: Github, desc: "Open-source codebase" },
  ];

  return (
    <footer 
      id="app-footer"
      className={`relative w-full max-w-7xl mx-auto px-6 md:px-12 py-16 mt-16 border-t z-40 transition-colors duration-500 ${
        theme === "dark" ? "border-white/[0.04]" : "border-black/[0.05]"
      }`}
    >
      <div className="flex flex-col md:flex-row items-center justify-between gap-10 relative z-10">
        
        {/* Left Side: Copyright Stamp & Architectural Signifier */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left gap-1">
          <p className="text-xs font-mono text-gray-500 tracking-wide">
            &copy; 2026 Agentic Marketplace. All rights reserved.
          </p>
          <p className="text-[10px] font-mono text-gray-600 uppercase tracking-widest mt-0.5">
            Architecture for the Agentic Economy. Developed by Skipscape.
          </p>
        </div>

        {/* Central / Right: Centralized Singular 3D Interaction Gateway */}
        <div className="relative flex flex-col items-center md:items-end">
          
          <div className="flex items-center gap-4">
            <span className="text-[10px] font-mono text-gray-500 tracking-widest uppercase hidden sm:inline">
              {expanded ? "GATEWAY_ESTABLISHED" : "LINK_TERMINAL"}
            </span>

            {/* Centralized 3D Interaction Point */}
            <motion.button
              onClick={() => setExpanded(!expanded)}
              onMouseEnter={() => setExpanded(true)}
              className={`relative h-12 w-12 rounded-full border flex items-center justify-center cursor-pointer transition-all duration-500 ${
                theme === "dark"
                  ? "bg-white/[0.01] border-purple-500/30 hover:border-purple-400 shadow-[0_0_20px_rgba(168,85,247,0.15)]"
                  : "bg-black/[0.01] border-purple-600/30 hover:border-purple-600 shadow-[0_0_15px_rgba(124,58,237,0.1)]"
              }`}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
            >
              {/* Outer rotating neon orbits */}
              <div className="absolute inset-0.5 rounded-full border border-dashed border-purple-500/20 animate-spin" style={{ animationDuration: "12s" }} />
              <div className="absolute inset-1.5 rounded-full border border-dotted border-cyan-500/30 animate-spin" style={{ animationDuration: "7s", animationDirection: "reverse" }} />
              
              {/* Interactive Core */}
              <motion.div
                animate={{
                  scale: expanded ? [1, 1.15, 1] : [1, 1.08, 1],
                  rotate: expanded ? 45 : 0
                }}
                transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                className="text-purple-500"
              >
                <Orbit className="w-5 h-5" />
              </motion.div>

              {/* Status node beacon */}
              <span className="absolute -top-1 -right-1 flex h-2 w-2">
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${expanded ? "bg-cyan-400" : "bg-purple-400"}`}></span>
                <span className={`relative inline-flex rounded-full h-2 w-2 ${expanded ? "bg-cyan-500" : "bg-purple-500"}`}></span>
              </span>
            </motion.button>
          </div>

          {/* Interactive Expanded Navigation Hub */}
          <AnimatePresence>
            {expanded && (
              <motion.div
                initial={{ opacity: 0, y: 15, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 15, scale: 0.96 }}
                onMouseLeave={() => setExpanded(false)}
                transition={{ type: "spring", stiffness: 140, damping: 18 }}
                className={`absolute bottom-16 right-1/2 translate-x-1/2 md:translate-x-0 md:right-0 w-72 p-5 rounded-2xl border backdrop-blur-xl shadow-2xl z-50 flex flex-col gap-3 transition-all duration-300 ${
                  theme === "dark"
                    ? "bg-[#09090e]/95 border-white/[0.08] text-white"
                    : "bg-[#f5f5fa]/95 border-black/[0.08] text-black"
                }`}
              >
                <div className="flex items-center justify-between pb-2 border-b border-white/[0.03] text-gray-500">
                  <span className="text-[9px] font-mono tracking-widest flex items-center gap-1.5">
                    <Power className="w-3 h-3 text-cyan-400" /> SYSTEM.HUB // DEPLOYED
                  </span>
                  <span className="text-[8px] font-mono bg-purple-500/10 px-1.5 py-0.5 rounded text-purple-400 font-bold">SECURE_SSL</span>
                </div>

                <div className="flex flex-col gap-1.5">
                  {socialLinks.map((link) => {
                    const Icon = link.icon;
                    return (
                      <a
                        key={link.name}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`flex items-center gap-3 p-2.5 rounded-xl border transition-all duration-300 group hover:translate-x-1 ${
                          theme === "dark"
                            ? "border-white/[0.02] bg-white/[0.01] hover:bg-white/[0.04] hover:border-purple-500/30"
                            : "border-black/[0.02] bg-black/[0.01] hover:bg-black/[0.03] hover:border-purple-600/30"
                        }`}
                      >
                        <div className={`p-2 rounded-lg border transition-colors ${
                          theme === "dark"
                            ? "bg-white/[0.02] border-white/[0.05] group-hover:bg-purple-500/10 group-hover:border-purple-500/20 text-gray-400 group-hover:text-purple-400"
                            : "bg-black/[0.02] border-black/[0.05] group-hover:bg-purple-500/5 group-hover:border-purple-500/15 text-gray-600 group-hover:text-purple-600"
                        }`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="flex flex-col text-left">
                          <span className="text-xs font-mono font-bold tracking-wide group-hover:text-purple-500 transition-colors">
                            {link.name}
                          </span>
                          <span className="text-[10px] text-gray-500 font-normal">
                            {link.desc}
                          </span>
                        </div>
                      </a>
                    );
                  })}
                </div>

                <div className="text-[9px] font-mono text-center text-gray-500 border-t border-white/[0.03] pt-2.5 flex items-center justify-between">
                  <span>DISCOVERY: AUTO_ON</span>
                  <span className="text-[11px] font-bold tracking-widest text-purple-500/60 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 animate-pulse" /> [M] MESH
                  </span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </div>
    </footer>
  );
}
