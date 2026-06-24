import React, { useState } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "motion/react";
import { Sun, Moon, Menu, X, Terminal, Cpu } from "lucide-react";

interface HeaderProps {
  theme: "dark" | "light";
  toggleTheme: () => void;
}

export default function Header({ theme, toggleTheme }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Motion values for 3D HUD tilt tracking
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth spring physics configuration for weight and glide
  const springConfig = { stiffness: 90, damping: 22, mass: 0.8 };
  const tiltX = useSpring(mouseY, springConfig);
  const tiltY = useSpring(mouseX, springConfig);

  // Subtle interior translation parallax
  const innerX = useTransform(tiltY, [-10, 10], [-5, 5]);
  const innerY = useTransform(tiltX, [-10, 10], [5, -5]);

  const navLinks = [
    { name: "Overview", id: "hero-section" },
    { name: "Friction", id: "friction-evolution-section" },
    { name: "Economics", id: "economics-section" },
    { name: "Vision", id: "vision-section" },
  ];

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    
    // Relative coordinate from center (-0.5 to 0.5)
    const relativeX = (e.clientX - rect.left) / width - 0.5;
    const relativeY = (e.clientY - rect.top) / height - 0.5;

    // Scale to degrees
    mouseX.set(relativeX * 14); // rotate around Y axis (horizontal mouse movement)
    mouseY.set(relativeY * -14); // rotate around X axis (vertical mouse movement)
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const handleScroll = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      const offset = 80; // height of sticky navbar
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="sticky top-0 w-full z-50 px-4 md:px-8 py-2 pointer-events-auto"
      style={{ perspective: "1200px" }}
    >
      <motion.header
        id="app-navbar"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        style={{
          rotateX: tiltX,
          rotateY: tiltY,
          transformStyle: "preserve-3d",
        }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className={`w-full rounded-2xl transition-colors duration-500 backdrop-blur-md border ${
          theme === "dark"
            ? "bg-[#050508]/70 border-white/[0.04] shadow-[0_15px_35px_-15px_rgba(168,85,247,0.1)]"
            : "bg-[#fafafc]/75 border-black/[0.06] shadow-[0_15px_35px_-15px_rgba(124,58,237,0.06)]"
        }`}
      >
        <motion.div 
          style={{ x: innerX, y: innerY, transformStyle: "preserve-3d" }}
          className="max-w-7xl mx-auto px-6 md:px-10 h-16 md:h-18 flex items-center justify-between"
        >
          
          {/* Left Side: Brand Logo */}
          <div className="flex items-center gap-8" style={{ transform: "translateZ(20px)" }}>
            <a
              href="#"
              id="logo-link"
              onClick={(e) => {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="group flex items-center gap-1 font-mono text-sm md:text-base font-bold tracking-widest hover:opacity-90 transition-opacity"
            >
              <span className={theme === "dark" ? "text-white" : "text-black"}>AGENTIC</span>
              <span className="text-purple-500 font-sans font-normal">.</span>
              <span className={`px-1.5 py-0.5 rounded text-xs font-mono transition-all duration-300 ${
                theme === "dark" 
                  ? "bg-white/10 text-white/80 group-hover:bg-purple-500/20 group-hover:text-purple-300" 
                  : "bg-black/5 text-black/70 group-hover:bg-purple-500/10 group-hover:text-purple-600"
              }`}>
                [M]
              </span>
            </a>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-6">
              {navLinks.map((link) => (
                <button
                  key={link.name}
                  onClick={() => handleScroll(link.id)}
                  className={`text-xs font-mono tracking-widest uppercase transition-colors hover:text-purple-500 cursor-pointer ${
                    theme === "dark" ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  {link.name}
                </button>
              ))}
            </nav>
          </div>

          {/* Right Side: Status Badge, Theme Toggle & CTA */}
          <div className="flex items-center gap-4" style={{ transform: "translateZ(30px)" }}>
            
            {/* Status Badge - Hidden on small mobile to avoid clutter */}
            <div
              id="navbar-status-badge"
              className={`hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all duration-300 ${
                theme === "dark"
                  ? "bg-white/[0.02] border-white/[0.06] text-white"
                  : "bg-black/[0.02] border-black/[0.06] text-black"
              }`}
            >
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
              </span>
              <span className={`text-[10px] font-mono tracking-wide ${
                theme === "dark" ? "text-white/70" : "text-black/70"
              }`}>
                Stage: <span className={theme === "dark" ? "text-white font-medium" : "text-black font-semibold"}>Building MVP</span>
              </span>
            </div>

            {/* Beautiful Custom Theme Toggle */}
            <motion.button
              onClick={toggleTheme}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`p-2 rounded-xl border cursor-pointer flex items-center justify-center transition-all duration-300 ${
                theme === "dark"
                  ? "bg-white/[0.03] border-white/[0.08] hover:bg-white/[0.08] text-purple-300"
                  : "bg-black/[0.03] border-black/[0.08] hover:bg-black/[0.06] text-purple-600"
              }`}
              title={theme === "dark" ? "Switch to Light Theme" : "Switch to Dark Theme"}
            >
              <AnimatePresence mode="wait">
                {theme === "dark" ? (
                  <motion.div
                    key="sun-icon"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Sun className="w-4.5 h-4.5" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="moon-icon"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Moon className="w-4.5 h-4.5" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>

            {/* Mobile Menu Toggle button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`p-2 rounded-xl border md:hidden cursor-pointer flex items-center justify-center transition-all ${
                theme === "dark"
                  ? "bg-white/[0.03] border-white/[0.08] text-white hover:bg-white/[0.08]"
                  : "bg-black/[0.03] border-black/[0.08] text-black hover:bg-black/[0.06]"
              }`}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </motion.div>

        {/* Mobile Sliding Drawer Navigation */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className={`md:hidden overflow-hidden w-full border-t border-dashed transition-all duration-300 ${
                theme === "dark"
                  ? "bg-[#050508]/95 border-white/[0.06]"
                  : "bg-[#fafafc]/95 border-black/[0.08]"
              }`}
            >
              <div className="px-6 py-6 flex flex-col gap-5">
                {navLinks.map((link) => (
                  <button
                    key={link.name}
                    onClick={() => handleScroll(link.id)}
                    className={`text-left text-sm font-mono tracking-widest uppercase py-1.5 border-b cursor-pointer transition-colors ${
                      theme === "dark"
                        ? "text-gray-300 border-white/[0.04] hover:text-white"
                        : "text-gray-700 border-black/[0.04] hover:text-black"
                    }`}
                  >
                    {link.name}
                  </button>
                ))}
                
                {/* Mobile Only Status Badge */}
                <div
                  className={`flex sm:hidden items-center gap-2 py-2 px-3.5 rounded-xl border max-w-max mt-2 ${
                    theme === "dark"
                      ? "bg-white/[0.02] border-white/[0.06]"
                      : "bg-black/[0.02] border-black/[0.06]"
                  }`}
                >
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  <span className={`text-xs font-mono ${theme === "dark" ? "text-white/70" : "text-black/70"}`}>
                    MVP Development Active
                  </span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>
    </div>
  );
}
