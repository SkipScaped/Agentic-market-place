import React, { useState } from "react";
import { motion } from "motion/react";
import { Scale, Percent, Orbit, CircleDollarSign } from "lucide-react";
import Card3DCanvas from "./Card3DCanvas";

interface MarketplaceEconomicsProps {
  theme: "dark" | "light";
}

export default function MarketplaceEconomics({ theme }: MarketplaceEconomicsProps) {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const columns = [
    {
      id: "pricing-freedom",
      badge: "Flexible Billing",
      icon: Scale,
      type: "pricing" as const,
      title: "Complete Pricing Freedom",
      description: "Developers retain total control over how they value their agents. Build natively with monthly subscriptions, per-task execution models, usage-based fees, or custom hybrid billing."
    },
    {
      id: "flat-fees",
      badge: "Maximum Return",
      icon: Percent,
      type: "fees" as const,
      title: "The 1% Standard",
      description: "Keep what you earn. The marketplace takes flat, industry-disrupting 1% transaction fees on sales and interactions. Pure infrastructure, no predatory platform margins."
    },
    {
      id: "mesh-showrooms",
      badge: "Mesh Protocol",
      icon: Orbit,
      type: "mesh" as const,
      title: "The Intelligent Mesh",
      description: "Beyond a storefront. Features will include hyper-clean agent showrooms, smart discovery algorithms, programmatic versioning, effortless cloud deployment, and tools for native agent-to-agent interactions."
    }
  ];

  return (
    <section 
      id="economics-section"
      className={`relative w-full max-w-7xl mx-auto px-6 md:px-12 py-16 md:py-24 z-40 border-t transition-colors duration-500 ${
        theme === "dark" ? "border-white/[0.04]" : "border-black/[0.05]"
      }`}
    >
      {/* Title / Header of section */}
      <div className="mb-12 md:mb-16 text-left">
        <span className="text-[10px] font-mono tracking-widest text-purple-500 uppercase font-bold">
          Ecosystem Economics
        </span>
        <h2 className={`font-display text-3xl md:text-4xl font-light tracking-tight mt-2 ${
          theme === "dark" ? "text-white" : "text-black"
        }`}>
          Designed for Sovereign Builders.
        </h2>
      </div>

      {/* 3-Column Layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
        {columns.map((col, idx) => {
          const IconComponent = col.icon;
          const isHovered = hoveredIdx === idx;
          return (
            <motion.div
              key={col.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ amount: 0.15, once: true }}
              transition={{ duration: 0.8, delay: idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
              onMouseEnter={() => setHoveredIdx(idx)}
              onMouseLeave={() => setHoveredIdx(null)}
              whileHover={{ y: -4, borderColor: theme === "dark" ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.12)" }}
              className={`group relative p-6 md:p-8 rounded-2xl border backdrop-blur-md transition-all duration-300 overflow-hidden flex flex-col justify-between ${
                theme === "dark"
                  ? "bg-white/[0.01] border-white/[0.04]"
                  : "bg-black/[0.015] border-black/[0.06] shadow-[0_4px_24px_rgba(0,0,0,0.01)]"
              }`}
            >
              {/* Top border ambient highlight */}
              <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div>
                {/* Icon & Small tag */}
                <div className="flex items-center justify-between mb-6">
                  <div className={`p-2.5 rounded-xl border transition-all duration-300 ${
                    theme === "dark"
                      ? "bg-white/[0.02] border-white/[0.06] group-hover:bg-purple-500/10 group-hover:border-purple-500/20 text-white/80 group-hover:text-purple-400"
                      : "bg-black/[0.02] border-black/[0.06] group-hover:bg-purple-500/5 group-hover:border-purple-500/15 text-black/80 group-hover:text-purple-600"
                  }`}>
                    <IconComponent className="w-5 h-5" />
                  </div>
                  <span className={`text-[9px] font-mono tracking-wider uppercase transition-colors ${
                    theme === "dark" ? "text-gray-500 group-hover:text-purple-300/60" : "text-gray-400 group-hover:text-purple-600/70"
                  }`}>
                    {col.badge}
                  </span>
                </div>

                <h3 className={`font-display text-xl font-normal tracking-tight ${
                  theme === "dark" ? "text-white" : "text-black"
                }`}>
                  {col.title}
                </h3>

                <p className={`mt-3.5 text-xs sm:text-sm font-normal leading-relaxed transition-colors duration-500 ${
                  theme === "dark" ? "text-gray-400 group-hover:text-gray-300" : "text-gray-600 group-hover:text-gray-800"
                }`}>
                  {col.description}
                </p>
              </div>

              {/* 3D Visual Asset Canvas representation */}
              <div className="mt-5 mb-1">
                <Card3DCanvas type={col.type} isHovered={isHovered} theme={theme} />
              </div>

              {/* Little bottom structural signifier */}
              <div className="mt-4 pt-4 border-t border-white/[0.02] flex items-center justify-between font-mono text-[9px] text-gray-500">
                <span>SECTION 0{idx + 1}</span>
                <span className="text-gray-400/30 font-bold group-hover:text-purple-500/40 transition-colors">///</span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
