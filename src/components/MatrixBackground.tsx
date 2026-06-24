import React, { useEffect, useRef } from "react";

interface MatrixBackgroundProps {
  theme: "dark" | "light";
}

/**
 * HIGH-PERFORMANCE NEURAL MATRIX BACKGROUND
 * 
 * ----------------- BACKEND DEVELOPER NOTES -----------------
 * 
 * TO THE BACKEND DEV:
 * If we transition this MVP to a full-fledged production platform:
 * 1. PERSISTENCE LAYER:
 *    - Configure Firestore (Firebase Skill rules in `/skills/system_skills/firebase-skill/SKILL.md`)
 *    - Collections schema:
 *      * `/users` -> { uid, email, enrolledAt, role: 'developer' | 'consumer', stripeCustomerId }
 *      * `/waitlist` -> { email, role, signupIp, countryCode, referrer, timestamp }
 *      * `/agents` -> { agentId, creatorUid, name, version, schemaEndpoint, pricingModel: 'subscription' | 'usage', pricingDetails, totalInteractions, rating }
 *      * `/transactions` -> { txId, agentId, buyerId, amount, platformFee: 1%, sellerEarnings: 99%, ledgerHash, timestamp }
 * 
 * 2. TRANSACTION PLATFORM & ESCROW ENGINE (The 1% Standard):
 *    - Integrate with Stripe Connect (using express/server routes) to support split payments.
 *    - Direct Charge or Destination Charge where 99.0% goes directly to the agent developer's Stripe account and 1.0% is retained by the platform as a flat fee.
 * 
 * 3. REAL-TIME MESH COMMUNICATIONS:
 *    - Set up a Socket.io or WebSockets daemon in the Express server to pipe Agent-to-Agent programmatic commands.
 *    - Leverage Drizzle ORM + Cloud SQL (PostgreSQL) if relational querying of agent hierarchies is required.
 * 
 * 4. SECURITY & AUTH:
 *    - Bind Firebase Auth in the frontend and use Bearer tokens validated server-side for secure API executions.
 * -----------------------------------------------------------
 */
export default function MatrixBackground({ theme }: MatrixBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Characters & Agentic mesh keywords to inject into the rain
    const charList = "0123456789ABCDEF<>[]{}+=-_@#$*&%!?".split("");
    const keywords = [
      "MESH", "NODE", "AGENT", "CONN", "SYNC", "ACK", "PORT", 
      "SSL", "WAIT", "1%", "99%", "EXEC", "API", "FLOW", "CORE"
    ];

    const fontSize = 11;
    const columns = Math.ceil(width / 18); // column spacing
    
    // Store current state of falling characters
    const drops: {
      y: number;
      speed: number;
      chars: string[];
      activeWord: string | null;
      wordIndex: number;
    }[] = [];

    // Initialize drop structures
    for (let i = 0; i < columns; i++) {
      drops[i] = {
        y: Math.random() * -100 - 10, // starts offscreen
        speed: 1 + Math.random() * 1.5,
        chars: [],
        activeWord: Math.random() < 0.15 ? keywords[Math.floor(Math.random() * keywords.length)] : null,
        wordIndex: 0
      };
    }

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    
    window.addEventListener("resize", handleResize);

    // Render loop
    const render = () => {
      // Create a trailing fade out effect
      if (theme === "dark") {
        ctx.fillStyle = "rgba(5, 5, 8, 0.075)"; // matches --bg-app in dark mode
      } else {
        ctx.fillStyle = "rgba(250, 250, 252, 0.085)"; // matches --bg-app in light mode
      }
      ctx.fillRect(0, 0, width, height);

      // Set monospaced font
      ctx.font = `${fontSize}px "JetBrains Mono", var(--font-mono), monospace`;

      for (let i = 0; i < columns; i++) {
        const drop = drops[i];
        const posX = i * 18;
        const posY = drop.y * fontSize;

        if (posY > 0 && posY < height) {
          let charToDraw = "";
          let isHighlighted = false;

          // If the drop is currently streaming an agentic keyword
          if (drop.activeWord) {
            charToDraw = drop.activeWord[drop.wordIndex];
            isHighlighted = true;
            
            // Advance character
            drop.wordIndex++;
            if (drop.wordIndex >= drop.activeWord.length) {
              drop.activeWord = null; // finished word
              drop.wordIndex = 0;
            }
          } else {
            // Render a random cypher character
            charToDraw = charList[Math.floor(Math.random() * charList.length)];
          }

          // Determine color based on active word highlight and theme
          if (theme === "dark") {
            if (isHighlighted) {
              // Neon green highlight for active words
              ctx.fillStyle = "rgba(16, 185, 129, 0.85)"; // emerald
              ctx.shadowColor = "rgba(16, 185, 129, 0.4)";
              ctx.shadowBlur = 4;
            } else {
              // Faded deep purple/indigo matrix codes
              ctx.fillStyle = i % 2 === 0 ? "rgba(168, 85, 247, 0.18)" : "rgba(99, 102, 241, 0.15)";
              ctx.shadowBlur = 0;
            }
          } else {
            if (isHighlighted) {
              // Deep cyan highlight for active words
              ctx.fillStyle = "rgba(8, 145, 178, 0.65)"; // cyan
              ctx.shadowColor = "rgba(8, 145, 178, 0.15)";
              ctx.shadowBlur = 2;
            } else {
              // Soft gray matrix codes
              ctx.fillStyle = i % 2 === 0 ? "rgba(148, 163, 184, 0.12)" : "rgba(6, 182, 212, 0.08)";
              ctx.shadowBlur = 0;
            }
          }

          ctx.fillText(charToDraw, posX, posY);
        }

        // Increment drop row position based on its individual speed
        drop.y += drop.speed;

        // Reset drop back to top once it goes past screen
        if (posY > height && Math.random() > 0.975) {
          drop.y = Math.random() * -10;
          drop.speed = 1 + Math.random() * 1.5;
          drop.activeWord = Math.random() < 0.15 ? keywords[Math.floor(Math.random() * keywords.length)] : null;
          drop.wordIndex = 0;
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [theme]);

  return (
    <canvas
      ref={canvasRef}
      id="matrix-rain-bg"
      className="fixed inset-0 w-full h-full pointer-events-none z-0 transition-opacity duration-500 opacity-60"
    />
  );
}
