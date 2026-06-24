import React, { useRef, useMemo, useEffect, useState, Suspense } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

// Individual Particle System inside the Canvas context with scroll-bound 3D travel & DoF bokeh simulator
function MeshParticles({ isMobile, theme }: { isMobile: boolean; theme: "dark" | "light" }) {
  const pointsRef = useRef<THREE.Points>(null);
  const linesRef = useRef<THREE.LineSegments>(null);
  const bokehRef = useRef<THREE.Points>(null);
  
  const count = isMobile ? 550 : 1200; // Optimal count to guarantee 120 FPS
  const bokehCount = isMobile ? 120 : 300; // Defocused bokeh points

  // Generate random particles in a sphere shell
  const [positions, originalPositions] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const orig = new Float32Array(count * 3);
    
    for (let i = 0; i < count; i++) {
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);
      
      const r = 1.8 + Math.random() * 1.2;
      
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi);
      
      pos[i * 3] = x;
      pos[i * 3 + 1] = y;
      pos[i * 3 + 2] = z;
      
      orig[i * 3] = x;
      orig[i * 3 + 1] = y;
      orig[i * 3 + 2] = z;
    }
    return [pos, orig];
  }, [count]);

  // Generate random defocused bokeh particles representing the background blur plane (DoF)
  const [bokehPositions, originalBokehPositions] = useMemo(() => {
    const pos = new Float32Array(bokehCount * 3);
    const orig = new Float32Array(bokehCount * 3);
    
    for (let i = 0; i < bokehCount; i++) {
      const theta = Math.random() * 2.0 * Math.PI;
      const phi = Math.acos(Math.random() * 2.0 - 1.0);
      const r = 2.5 + Math.random() * 2.5; // Larger and deeper shell
      
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi);
      
      pos[i * 3] = x;
      pos[i * 3 + 1] = y;
      pos[i * 3 + 2] = z;
      
      orig[i * 3] = x;
      orig[i * 3 + 1] = y;
      orig[i * 3 + 2] = z;
    }
    return [pos, orig];
  }, [bokehCount]);

  // Create connections between particles
  const lineIndices = useMemo(() => {
    const indices: number[] = [];
    for (let i = 0; i < count; i += 3) {
      const n1 = i;
      const n2 = (i + 1) % count;
      const n3 = (i + 2) % count;
      
      indices.push(n1, n2);
      indices.push(n2, n3);
      indices.push(n3, n1);
    }
    return new Uint16Array(indices);
  }, [count]);

  const { pointer, viewport } = useThree();
  const mouseRef = useRef(new THREE.Vector3());
  const scrollRef = useRef(0);

  // Track page scroll position for reactive camera travel
  useEffect(() => {
    const handleScroll = () => {
      scrollRef.current = window.scrollY;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    
    // Smoothly interpolate the cursor coordinates mapped to R3F viewport size
    const targetX = (pointer.x * viewport.width) / 2;
    const targetY = (pointer.y * viewport.height) / 2;
    
    mouseRef.current.x = THREE.MathUtils.lerp(mouseRef.current.x, targetX, 0.08);
    mouseRef.current.y = THREE.MathUtils.lerp(mouseRef.current.y, targetY, 0.08);
    mouseRef.current.z = 0;

    // Scroll metrics calculations
    const maxScroll = typeof document !== "undefined" ? document.documentElement.scrollHeight - window.innerHeight : 1000;
    const scrollPct = maxScroll > 0 ? scrollRef.current / maxScroll : 0;

    // Reactively drive camera rotation & position based on scroll to "travel" through the 3D grid
    const targetZ = 4.5 - scrollPct * 2.2; // Move camera closer through the mesh
    const targetYOffset = scrollPct * -1.2;
    const targetRoll = scrollPct * 0.55; // Cinematic Z-roll rotation as you descend
    const targetYaw = scrollPct * 0.35; // Pan horizontal space based on scroll
    
    state.camera.position.z = THREE.MathUtils.lerp(state.camera.position.z, targetZ, 0.06);
    state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, targetYOffset, 0.06);
    state.camera.rotation.z = THREE.MathUtils.lerp(state.camera.rotation.z, targetRoll, 0.06);
    state.camera.rotation.y = THREE.MathUtils.lerp(state.camera.rotation.y, targetYaw, 0.06);

    // Subtle continuous drifting rotation for the entire agentic neural mesh
    if (pointsRef.current) {
      pointsRef.current.rotation.y = time * 0.025 + scrollPct * 0.45;
      pointsRef.current.rotation.x = time * 0.012 + scrollPct * 0.15;

      if (linesRef.current) {
        linesRef.current.rotation.y = pointsRef.current.rotation.y;
        linesRef.current.rotation.x = pointsRef.current.rotation.x;
      }

      const inverseWorldMatrix = new THREE.Matrix4().copy(pointsRef.current.matrixWorld).invert();
      const localMouse = mouseRef.current.clone().applyMatrix4(inverseWorldMatrix);
      const posArray = pointsRef.current.geometry.attributes.position.array as Float32Array;
      const maxDist = isMobile ? 1.0 : 1.6;

      for (let i = 0; i < count; i++) {
        const px = originalPositions[i * 3];
        const py = originalPositions[i * 3 + 1];
        const pz = originalPositions[i * 3 + 2];
        
        const driftX = Math.sin(time * 0.3 + py * 2.0) * 0.08;
        const driftY = Math.cos(time * 0.3 + px * 2.0) * 0.08;
        const driftZ = Math.sin(time * 0.2 + pz * 2.0) * 0.08;
        
        const curX = px + driftX;
        const curY = py + driftY;
        const curZ = pz + driftZ;

        const dx = curX - localMouse.x;
        const dy = curY - localMouse.y;
        const dz = curZ - localMouse.z;
        const distSq = dx * dx + dy * dy + dz * dz;
        const dist = Math.sqrt(distSq);

        if (dist < maxDist) {
          const force = (maxDist - dist) / maxDist;
          const pushX = (dx / (dist || 0.001)) * force * 0.6;
          const pushY = (dy / (dist || 0.001)) * force * 0.6;
          const pushZ = (dz / (dist || 0.001)) * force * 0.6;
          
          posArray[i * 3] = curX + pushX;
          posArray[i * 3 + 1] = curY + pushY;
          posArray[i * 3 + 2] = curZ + pushZ;
        } else {
          posArray[i * 3] = THREE.MathUtils.lerp(posArray[i * 3], curX, 0.1);
          posArray[i * 3 + 1] = THREE.MathUtils.lerp(posArray[i * 3 + 1], curY, 0.1);
          posArray[i * 3 + 2] = THREE.MathUtils.lerp(posArray[i * 3 + 2], curZ, 0.1);
        }
      }
      pointsRef.current.geometry.attributes.position.needsUpdate = true;
      
      if (linesRef.current) {
        const linePosArray = linesRef.current.geometry.attributes.position.array as Float32Array;
        for (let k = 0; k < lineIndices.length; k++) {
          const ptIdx = lineIndices[k];
          linePosArray[k * 3] = posArray[ptIdx * 3];
          linePosArray[k * 3 + 1] = posArray[ptIdx * 3 + 1];
          linePosArray[k * 3 + 2] = posArray[ptIdx * 3 + 2];
        }
        linesRef.current.geometry.attributes.position.needsUpdate = true;
      }
    }

    // Dynamic Depth of Field - bokeh blur plane behavior
    if (bokehRef.current) {
      bokehRef.current.rotation.y = time * -0.015 - scrollPct * 0.15;
      bokehRef.current.rotation.x = time * -0.008;

      const bokehArray = bokehRef.current.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < bokehCount; i++) {
        const px = originalBokehPositions[i * 3];
        const py = originalBokehPositions[i * 3 + 1];
        const pz = originalBokehPositions[i * 3 + 2];

        // Animate bokeh float drift
        bokehArray[i * 3] = px + Math.sin(time * 0.15 + py) * 0.15;
        bokehArray[i * 3 + 1] = py + Math.cos(time * 0.1 + px) * 0.15;
        bokehArray[i * 3 + 2] = pz + Math.sin(time * 0.12 + px * 0.5) * 0.15;
      }
      bokehRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <group>
      {/* 1. Sharp Foreground Neural Points */}
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[positions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={isMobile ? 0.045 : 0.035}
          color={theme === "dark" ? "#ffffff" : "#6366f1"}
          transparent
          opacity={theme === "dark" ? (isMobile ? 0.35 : 0.55) : (isMobile ? 0.5 : 0.65)}
          sizeAttenuation={true}
          depthWrite={false}
          blending={theme === "dark" ? THREE.AdditiveBlending : THREE.NormalBlending}
        />
      </points>

      {/* 2. Network Connectivity Edges */}
      <lineSegments ref={linesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[new Float32Array(lineIndices.length * 3), 3]}
          />
        </bufferGeometry>
        <lineBasicMaterial
          color={theme === "dark" ? "#a855f7" : "#818cf8"}
          transparent
          opacity={theme === "dark" ? (isMobile ? 0.04 : 0.07) : (isMobile ? 0.1 : 0.16)}
          depthWrite={false}
          blending={theme === "dark" ? THREE.AdditiveBlending : THREE.NormalBlending}
        />
      </lineSegments>

      {/* 3. Deep Cinematic Bokeh Particles (Simulated Depth-of-Field Blur Plane) */}
      <points ref={bokehRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[bokehPositions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={isMobile ? 0.25 : 0.38} // Very large size to simulate camera lens blurring
          color={theme === "dark" ? "#ec4899" : "#06b6d4"} // Magenta/Cyan bokeh hues
          transparent
          opacity={theme === "dark" ? 0.08 : 0.05} // Soft and translucent
          sizeAttenuation={true}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  );
}

// Main background canvas with safety feature detections & graceful state degradation
export default function AgenticMesh({ theme }: { theme: "dark" | "light" }) {
  const [webglSupported, setWebglSupported] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // 1. Detect WebGL support
    try {
      const canvas = document.createElement("canvas");
      const supported = !!(
        window.WebGLRenderingContext &&
        (canvas.getContext("webgl") || canvas.getContext("experimental-webgl"))
      );
      setWebglSupported(supported);
    } catch {
      setWebglSupported(false);
    }

    // 2. Detect mobile screens for resource optimizations
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // WebGL Degradation Fallback - Luxury CSS Radial Gradients & Soft Atmospheric Glows
  if (!webglSupported) {
    return (
      <div className={`fixed inset-0 overflow-hidden -z-10 transition-colors duration-500 ${theme === "dark" ? "bg-[#050508]" : "bg-[#fafafc]"}`} id="fallback-canvas">
        <div className={`absolute top-1/4 left-1/3 w-96 h-96 rounded-full blur-3xl opacity-60 animate-pulse-neural-1 ${theme === "dark" ? "bg-purple-900/10" : "bg-purple-300/15"}`} />
        <div className={`absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full blur-3xl opacity-50 animate-pulse-neural-2 ${theme === "dark" ? "bg-cyan-950/15" : "bg-cyan-200/15"}`} />
        <div className="absolute inset-0 bg-radial-gradient-mask" />
      </div>
    );
  }

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10" id="three-canvas-container">
      {/* Background Glows overlaying R3F */}
      <div className={`absolute top-0 left-0 w-full h-full -z-20 transition-colors duration-500 ${theme === "dark" ? "bg-[#050508]" : "bg-[#fafafc]"}`} />
      
      {/* Ambient Radial Mesh Gradient */}
      <div className={`absolute top-[-20%] left-[-20%] w-[140%] h-[140%] pointer-events-none transition-all duration-500 ${
        theme === "dark" 
          ? "bg-[radial-gradient(circle_at_center,rgba(168,85,247,0.04)_0%,rgba(6,182,212,0.02)_40%,transparent_70%)]" 
          : "bg-[radial-gradient(circle_at_center,rgba(124,58,237,0.05)_0%,rgba(6,182,212,0.03)_40%,transparent_70%)]"
      }`} />

      {/* R3F Canvas */}
      <Suspense fallback={
        <div className={`absolute inset-0 flex items-center justify-center backdrop-blur-sm ${theme === "dark" ? "bg-black/40" : "bg-white/40"}`}>
          <div className="w-8 h-8 border border-purple-500 border-t-transparent rounded-full animate-spin" />
        </div>
      }>
        <Canvas
          camera={{ position: [0, 0, 4.5], fov: 60 }}
          dpr={[1, isMobile ? 1.5 : 2]} // Dynamic DPR scale for crisp render
          gl={{ antialias: true, alpha: true }}
          style={{ width: "100%", height: "100%" }}
        >
          <MeshParticles isMobile={isMobile} theme={theme} />
        </Canvas>
      </Suspense>

      {/* Screen Mask Gradient (Darker on bottom/top to enhance text readability) */}
      <div className={`absolute inset-0 pointer-events-none transition-all duration-500 ${
        theme === "dark"
          ? "bg-gradient-to-b from-[#050508]/60 via-transparent to-[#050508]"
          : "bg-gradient-to-b from-[#fafafc]/60 via-transparent to-[#fafafc]"
      }`} />
    </div>
  );
}
