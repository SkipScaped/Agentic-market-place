import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowRight, CheckCircle2, Sparkles, ShieldCheck } from "lucide-react";

interface HeroProps {
  theme: "dark" | "light";
}

export default function Hero({ theme }: HeroProps) {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [queueNumber, setQueueNumber] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Magnetic CTA Button physics
  const ctaRef = useRef<HTMLButtonElement>(null);
  const [magneticOffset, setMagneticOffset] = useState({ x: 0, y: 0 });
  const [isCtaHovered, setIsCtaHovered] = useState(false);

  useEffect(() => {
    // Check if user is already on the waitlist
    const stored = localStorage.getItem("agentic_waitlist_email");
    const storedQueue = localStorage.getItem("agentic_waitlist_queue");
    if (stored && storedQueue) {
      setEmail(stored);
      setQueueNumber(parseInt(storedQueue, 10));
      setIsSubmitted(true);
    }
  }, []);

  const handleCtaMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!ctaRef.current) return;
    const rect = ctaRef.current.getBoundingClientRect();
    // Center point of the button
    const btnX = rect.left + rect.width / 2;
    const btnY = rect.top + rect.height / 2;
    
    // Relative distance from center
    const x = e.clientX - btnX;
    const y = e.clientY - btnY;
    
    // Smooth 28% magnetic pull
    setMagneticOffset({ x: x * 0.28, y: y * 0.28 });
  };

  const handleCtaMouseLeave = () => {
    setIsCtaHovered(false);
    setMagneticOffset({ x: 0, y: 0 });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email) {
      setError("Please specify a valid email address.");
      return;
    }

    // Basic email pattern check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please double-check your email syntax.");
      return;
    }

    setIsSubmitting(true);

    // Simulate luxury blockchain / neural node confirmation
    setTimeout(() => {
      // Generate unique queue starting around 3,420 + randomized increment
      const randomQueue = Math.floor(3420 + Math.random() * 128);
      
      localStorage.setItem("agentic_waitlist_email", email);
      localStorage.setItem("agentic_waitlist_queue", randomQueue.toString());
      
      setQueueNumber(randomQueue);
      setIsSubmitted(true);
      setIsSubmitting(false);
    }, 1200);
  };

  const handleReset = () => {
    localStorage.removeItem("agentic_waitlist_email");
    localStorage.removeItem("agentic_waitlist_queue");
    setEmail("");
    setQueueNumber(null);
    setIsSubmitted(false);
  };

  return (
    <section 
      id="hero-section"
      className="relative w-full max-w-5xl mx-auto px-6 md:px-12 pt-12 pb-20 md:pt-20 md:pb-28 text-center z-40"
    >
      {/* Decorative top small badge */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        className={`inline-flex items-center gap-1.5 px-3 py-1 mb-8 rounded-full border backdrop-blur-md transition-colors duration-500 ${
          theme === "dark"
            ? "bg-purple-500/10 border-purple-500/20 text-purple-300"
            : "bg-purple-500/8 text-purple-700 border-purple-500/15"
        }`}
      >
        <Sparkles className={`w-3.5 h-3.5 ${theme === "dark" ? "text-purple-400" : "text-purple-600"}`} />
        <span className="text-[10px] md:text-[11px] font-mono font-medium tracking-widest uppercase">
          Autonomous Agent Infrastructure
        </span>
      </motion.div>

      {/* Main Headline with high-end text layout */}
      <motion.h1
        id="hero-headline"
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-light tracking-tight leading-[1.1] md:leading-[1.05] max-w-4xl mx-auto"
      >
        <span className={theme === "dark" ? "text-white" : "text-black"}>
          The Central Infrastructure <br />
        </span>
        <span className={`font-normal bg-gradient-to-r bg-clip-text text-transparent ${
          theme === "dark"
            ? "from-white via-white to-purple-400/80"
            : "from-black via-gray-900 to-purple-700/90"
        }`}>
          of the Agentic Economy.
        </span>
      </motion.h1>

      {/* Supporting Subheadline */}
      <motion.p
        id="hero-subheadline"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className={`mt-6 text-base sm:text-lg md:text-xl font-normal max-w-2xl mx-auto leading-relaxed transition-colors duration-500 ${
          theme === "dark" ? "text-gray-400" : "text-gray-600"
        }`}
      >
        AI agents are currently scattered across countless disconnected platforms, repositories, and tools. We are building the single, unified hub to discover, deploy, and monetize specialized intelligence seamlessly.
      </motion.p>

      {/* Waitlist Subscription container */}
      <motion.div
        id="waitlist-container"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="mt-12 max-w-lg mx-auto"
      >
        <AnimatePresence mode="wait">
          {!isSubmitted ? (
            <motion.form
              key="waitlist-form"
              onSubmit={handleSubmit}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.4 }}
              className="space-y-4"
            >
              {/* Glassmorphic input block */}
              <div className={`relative flex flex-col sm:flex-row items-stretch gap-2.5 p-1.5 rounded-2xl border backdrop-blur-xl transition-all duration-500 ${
                theme === "dark"
                  ? "bg-white/[0.02] border-white/[0.06] shadow-[0_0_50px_-12px_rgba(168,85,247,0.15)] focus-within:border-purple-500/45 focus-within:shadow-[0_0_50px_-8px_rgba(168,85,247,0.25)]"
                  : "bg-black/[0.015] border-black/[0.08] shadow-[0_4px_30px_rgba(124,58,237,0.04)] focus-within:border-purple-500/60 focus-within:shadow-[0_0_50px_-8px_rgba(124,58,237,0.12)]"
              }`}>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (error) setError("");
                  }}
                  placeholder="Enter your professional email"
                  required
                  disabled={isSubmitting}
                  className={`flex-1 px-5 py-4 bg-transparent outline-none border-none text-sm md:text-base font-normal rounded-xl ${
                    theme === "dark" 
                      ? "text-white placeholder-gray-500/80" 
                      : "text-black placeholder-gray-400"
                  }`}
                />

                {/* Magnetic CTA Button with Framer Motion hover mechanics */}
                <motion.button
                  ref={ctaRef}
                  type="submit"
                  disabled={isSubmitting}
                  onMouseMove={handleCtaMouseMove}
                  onMouseEnter={() => setIsCtaHovered(true)}
                  onMouseLeave={handleCtaMouseLeave}
                  animate={{ 
                    x: magneticOffset.x, 
                    y: magneticOffset.y,
                    boxShadow: isCtaHovered 
                      ? (theme === "dark" 
                          ? "0 0 25px 4px rgba(168, 85, 247, 0.4)" 
                          : "0 4px 20px 0px rgba(124, 58, 237, 0.25)")
                      : "0 0 0px 0px rgba(0,0,0,0)"
                  }}
                  transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
                  className={`px-6 py-4 rounded-xl font-semibold text-xs md:text-sm tracking-wide uppercase flex items-center justify-center gap-2 cursor-pointer transition-colors disabled:opacity-50 select-none shrink-0 ${
                    theme === "dark"
                      ? "bg-white text-black hover:bg-purple-100"
                      : "bg-black text-white hover:bg-purple-950"
                  }`}
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-1.5">
                      <svg className={`animate-spin h-4 w-4 ${theme === "dark" ? "text-black" : "text-white"}`} fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Verifying...
                    </span>
                  ) : (
                    <>
                      Request Early Access
                      <ArrowRight className={`w-4 h-4 ${theme === "dark" ? "text-black" : "text-white"}`} />
                    </>
                  )}
                </motion.button>
              </div>

              {/* Error messages */}
              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-500 font-mono text-xs text-left px-4"
                >
                  {error}
                </motion.p>
              )}
            </motion.form>
          ) : (
            // Success glass card with neural confirmation
            <motion.div
              key="success-card"
              initial={{ opacity: 0, scale: 0.96, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className={`p-6 md:p-8 rounded-3xl border backdrop-blur-xl relative overflow-hidden text-left shadow-2xl transition-all duration-500 ${
                theme === "dark"
                  ? "bg-white/[0.02] border-white/[0.08]"
                  : "bg-black/[0.015] border-black/[0.08]"
              }`}
            >
              {/* Soft purple backlight inside card */}
              <div className="absolute top-0 right-0 w-36 h-36 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

              <div className="flex items-start gap-4 relative z-10">
                <div className="p-3 bg-purple-500/10 rounded-2xl border border-purple-500/20 text-purple-500 shrink-0">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                
                <div className="flex-1">
                  <span className="text-[10px] font-mono tracking-widest text-purple-500 uppercase font-bold">
                    Verification Complete
                  </span>
                  <h3 className={`text-xl md:text-2xl font-display font-medium mt-1 ${
                    theme === "dark" ? "text-white" : "text-black"
                  }`}>
                    You're on the list.
                  </h3>
                  <p className={`text-sm mt-2 leading-relaxed ${
                    theme === "dark" ? "text-gray-400" : "text-gray-600"
                  }`}>
                    We've registered your secure address <span className={`underline decoration-purple-500/50 ${theme === "dark" ? "text-white" : "text-black"}`}>{email}</span>. A node keys invite will be transmitted as soon as the MVP stage scales.
                  </p>

                  {/* Access Queue Metric */}
                  <div className="mt-6 pt-5 border-t border-white/[0.06] flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-mono text-gray-500 uppercase tracking-wider block">
                        Waitlist Position
                      </span>
                      <span className={`font-mono text-2xl font-bold tracking-tight ${
                        theme === "dark" ? "text-white" : "text-black"
                      }`}>
                        #{queueNumber?.toLocaleString()}
                      </span>
                    </div>
                    <button
                      onClick={handleReset}
                      className="text-xs font-mono text-gray-500 hover:text-purple-500 underline cursor-pointer transition-colors"
                    >
                      Use another email
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Trust micro-copy under form */}
        <p className="mt-5 text-xs text-gray-500 font-mono tracking-wide flex items-center justify-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-gray-400 shrink-0" />
          Join pioneering creators shaping the future of autonomous work.
        </p>
      </motion.div>
    </section>
  );
}
