import React from "react";
import { motion } from "motion/react";
import { Quote, RefreshCw, Layers, Users } from "lucide-react";

interface FounderVisionProps {
  theme: "dark" | "light";
}

export default function FounderVision({ theme }: FounderVisionProps) {
  return (
    <section 
      id="vision-section"
      className={`relative w-full max-w-7xl mx-auto px-6 md:px-12 py-16 md:py-24 z-40 border-t transition-colors duration-500 ${
        theme === "dark" ? "border-white/[0.04]" : "border-black/[0.05]"
      }`}
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 relative z-10">
        
        {/* Left Box: Why We're Building This (Founder Quote) */}
        <motion.div
          id="founder-quote-box"
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ amount: 0.25, once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          whileHover={{ y: -4, borderColor: theme === "dark" ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.12)" }}
          className={`group relative p-8 md:p-10 rounded-3xl border backdrop-blur-md transition-all duration-300 flex flex-col justify-between ${
            theme === "dark"
              ? "bg-white/[0.01] border-white/[0.04]"
              : "bg-black/[0.01] border-black/[0.06] shadow-[0_4px_24px_rgba(0,0,0,0.015)]"
          }`}
        >
          {/* Subtle upper light line */}
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-purple-500/10 via-transparent to-transparent" />
          
          <div>
            {/* Quote Icon decorative */}
            <div className={`mb-6 transition-colors duration-500 ${
              theme === "dark" ? "text-purple-400/40 group-hover:text-purple-400/80" : "text-purple-600/30 group-hover:text-purple-600/70"
            }`}>
              <Quote className="w-8 h-8 md:w-10 md:h-10 transform -scale-x-100" />
            </div>

            <blockquote className={`font-display text-lg md:text-xl font-light leading-relaxed tracking-wide transition-colors duration-500 ${
              theme === "dark" ? "text-gray-200" : "text-gray-800"
            }`}>
              "I started this project because there isn't a dedicated marketplace for AI agents like there is for other software products. We're building a space where creators can effortlessly share and monetize custom agents, helping architect how humanity trades specialized AI."
            </blockquote>
          </div>

          <div className="mt-8 pt-6 border-t border-white/[0.03] flex items-center justify-between">
            <div>
              <cite className={`not-italic font-display text-sm font-medium block ${
                theme === "dark" ? "text-white" : "text-black"
              }`}>
                Skipscape
              </cite>
              <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest mt-0.5 block">
                Frontend Developer • Agentic Marketplace
              </span>
            </div>
            
            <span className="font-mono text-[11px] text-gray-500">
              INIT_STAGE_V0
            </span>
          </div>
        </motion.div>

        {/* Right Box: How Community Grows (The Collective Flywheel) */}
        <motion.div
          id="collective-flywheel-box"
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ amount: 0.25, once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          whileHover={{ y: -4, borderColor: theme === "dark" ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.12)" }}
          className={`group relative p-8 md:p-10 rounded-3xl border backdrop-blur-md transition-all duration-300 flex flex-col justify-between overflow-hidden ${
            theme === "dark"
              ? "bg-white/[0.01] border-white/[0.04]"
              : "bg-black/[0.01] border-black/[0.06] shadow-[0_4px_24px_rgba(0,0,0,0.015)]"
          }`}
        >
          {/* Floating interactive flywheel design back-element */}
          <div className="absolute right-[-40px] top-[-40px] w-48 h-48 rounded-full border border-white/[0.02] group-hover:border-purple-500/[0.08] flex items-center justify-center transition-all duration-700">
            <div className="w-36 h-36 rounded-full border border-dashed border-white/[0.03] group-hover:border-purple-500/[0.12] animate-spin [animation-duration:40s]" />
          </div>

          <div>
            {/* Header / Badge */}
            <div className="flex items-center gap-2 mb-6">
              <div className="p-2 bg-cyan-500/10 rounded-lg border border-cyan-500/20 text-cyan-500">
                <RefreshCw className="w-5 h-5 animate-spin [animation-duration:15s] group-hover:text-purple-500 transition-colors" />
              </div>
              <span className={`text-[10px] font-mono tracking-widest uppercase font-bold transition-colors ${
                theme === "dark" ? "text-cyan-400 group-hover:text-purple-400" : "text-cyan-600 group-hover:text-purple-600"
              }`}>
                The Network Effect
              </span>
            </div>

            <h3 className={`font-display text-2xl md:text-3xl font-light tracking-tight transition-colors ${
              theme === "dark" ? "text-white" : "text-black"
            }`}>
              The Collective Flywheel
            </h3>

            <p className={`mt-4 text-sm md:text-base font-normal leading-relaxed transition-colors duration-500 ${
              theme === "dark" ? "text-gray-400" : "text-gray-600"
            }`}>
              On this platform, users and creators are often the same people. As more creators join, everyone benefits—each developer's buyers inherently discover other agents, building a vibrant, collaborative, self-sustaining ecosystem.
            </p>
          </div>

          {/* Dynamic Interactive representation */}
          <div className="mt-8 pt-6 border-t border-white/[0.03] flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="flex -space-x-2">
                <div className="w-6 h-6 rounded-full bg-purple-500/20 border border-purple-500/40 flex items-center justify-center font-mono text-[9px] text-purple-400 font-bold">C</div>
                <div className="w-6 h-6 rounded-full bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center font-mono text-[9px] text-cyan-400 font-bold">U</div>
                <div className="w-6 h-6 rounded-full bg-gray-500/20 border border-gray-500/40 flex items-center justify-center font-mono text-[9px] text-gray-300 font-bold">N</div>
              </div>
              <span className="text-xs font-mono text-gray-500 group-hover:text-gray-400 transition-colors">
                Unified Ecosystem Loop
              </span>
            </div>

            <span className="font-mono text-[10px] text-cyan-500 font-bold tracking-widest uppercase flex items-center gap-1">
              <span className="inline-block w-1.5 h-1.5 bg-cyan-400 rounded-full animate-ping" />
              ACTIVE
            </span>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
