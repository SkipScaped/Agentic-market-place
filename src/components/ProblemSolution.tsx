import React, { useState } from "react";
import { motion } from "motion/react";
import { Sliders, Cpu, Terminal, ShieldAlert } from "lucide-react";
import Card3DCanvas from "./Card3DCanvas";

interface ProblemSolutionProps {
  theme: "dark" | "light";
}

export default function ProblemSolution({ theme }: ProblemSolutionProps) {
  const [hoverProblem, setHoverProblem] = useState(false);
  const [hoverSolution, setHoverSolution] = useState(false);

  return (
    <section 
      id="friction-evolution-section"
      className={`relative w-full max-w-7xl mx-auto px-6 md:px-12 py-16 md:py-24 z-40 border-t transition-colors duration-500 ${
        theme === "dark" ? "border-white/[0.04]" : "border-black/[0.05]"
      }`}
    >
      {/* Background radial soft light */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[120%] bg-[radial-gradient(circle_at_center,rgba(168,85,247,0.015)_0%,transparent_60%)] pointer-events-none" />

      {/* Grid wrapper */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 relative z-10">
        
        {/* Card 1: THE FRAGMENTATION (Problem) */}
        <motion.div
          id="problem-card"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ amount: 0.25, once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          onMouseEnter={() => setHoverProblem(true)}
          onMouseLeave={() => setHoverProblem(false)}
          whileHover={{ y: -4, borderColor: theme === "dark" ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.15)" }}
          className={`group relative p-8 md:p-10 rounded-3xl border backdrop-blur-md transition-all duration-300 overflow-hidden flex flex-col justify-between ${
            theme === "dark"
              ? "bg-white/[0.01] border-white/[0.04]"
              : "bg-black/[0.01] border-black/[0.06] shadow-[0_8px_30px_rgba(0,0,0,0.015)]"
          }`}
        >
          {/* Subtle gradient flash */}
          <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-red-500/20 via-orange-500/10 to-transparent opacity-40 group-hover:opacity-100 transition-opacity duration-500" />
          
          <div>
            {/* Header Badge */}
            <div className="flex items-center gap-2 mb-6">
              <div className="p-2 bg-red-500/10 rounded-lg border border-red-500/20 text-red-500">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-mono tracking-widest text-red-500 uppercase font-bold">
                The Fragmentation
              </span>
            </div>

            <h3 className={`font-display text-2xl md:text-3xl font-light tracking-tight transition-colors ${
              theme === "dark" ? "text-white" : "text-black"
            }`}>
              Scattered Intelligence
            </h3>

            <p className={`mt-4 text-sm md:text-base font-normal leading-relaxed transition-colors duration-500 ${
              theme === "dark" ? "text-gray-400" : "text-gray-600"
            }`}>
              AI agent creators lack a central platform to monetize their work, making it incredibly hard to reach targeted buyers and scale sustainable income. Right now, both creators and users waste massive amounts of time searching, comparing, and trusting random sources.
            </p>
          </div>

          {/* Interactive Volumetric 3D Shards mesh */}
          <div className="mt-6 mb-2">
            <Card3DCanvas type="fragmentation" isHovered={hoverProblem} theme={theme} />
          </div>

          {/* Graphic layout indicator */}
          <div className="mt-4 pt-6 border-t border-white/[0.03] flex items-center justify-between font-mono text-[11px] text-gray-500">
            <span>DISCONNECTED REPOSITORIES</span>
            <span>SYSTEM STATE: UNBOUND</span>
          </div>
        </motion.div>

        {/* Card 2: THE UNIFIED HUB (Solution) */}
        <motion.div
          id="solution-card"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ amount: 0.25, once: true }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          onMouseEnter={() => setHoverSolution(true)}
          onMouseLeave={() => setHoverSolution(false)}
          whileHover={{ y: -4, borderColor: theme === "dark" ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.15)" }}
          className={`group relative p-8 md:p-10 rounded-3xl border backdrop-blur-md transition-all duration-300 overflow-hidden flex flex-col justify-between ${
            theme === "dark"
              ? "bg-white/[0.01] border-white/[0.04]"
              : "bg-black/[0.01] border-black/[0.06] shadow-[0_8px_30px_rgba(0,0,0,0.015)]"
          }`}
        >
          {/* Subtle gradient flash */}
          <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-purple-500/20 via-cyan-500/10 to-transparent opacity-40 group-hover:opacity-100 transition-opacity duration-500" />

          <div>
            {/* Header Badge */}
            <div className="flex items-center gap-2 mb-6">
              <div className="p-2 bg-purple-500/10 rounded-lg border border-purple-500/20 text-purple-500">
                <Cpu className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-mono tracking-widest text-purple-500 uppercase font-bold">
                The Evolution
              </span>
            </div>

            <h3 className={`font-display text-2xl md:text-3xl font-light tracking-tight transition-colors ${
              theme === "dark" ? "text-white" : "text-black"
            }`}>
              A Dedicated Marketplace
            </h3>

            <p className={`mt-4 text-sm md:text-base font-normal leading-relaxed transition-colors duration-500 ${
              theme === "dark" ? "text-gray-400" : "text-gray-600"
            }`}>
              We’re building a dedicated ecosystem where creators can easily list, distribute, and sell custom-built AI agents. Gain absolute sovereign control over your work with flexible monetization and a framework built for developer independence.
            </p>
          </div>

          {/* Interactive Volumetric 3D Rings mesh */}
          <div className="mt-6 mb-2">
            <Card3DCanvas type="marketplace" isHovered={hoverSolution} theme={theme} />
          </div>

          {/* Graphic layout indicator */}
          <div className={`mt-4 pt-6 border-t flex items-center justify-between font-mono text-[11px] ${
            theme === "dark" ? "border-white/[0.03] text-purple-400/60" : "border-black/[0.03] text-purple-600/70"
          }`}>
            <span className="flex items-center gap-1">
              <Terminal className="w-3.5 h-3.5" />
              COHESIVE DEPLOYMENT ENGINE
            </span>
            <span className="font-bold tracking-widest">INTELLIGENT.MESH</span>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
