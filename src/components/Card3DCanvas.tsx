import React, { useRef, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface Card3DCanvasProps {
  type: "fragmentation" | "marketplace" | "pricing" | "fees" | "mesh";
  isHovered: boolean;
  theme: "dark" | "light";
}

function FloatingMesh({ type, isHovered, theme }: Card3DCanvasProps) {
  const meshRef = useRef<THREE.Group>(null);
  const crystalRef = useRef<THREE.Mesh>(null);
  const [targetScale, setTargetScale] = useState(1);

  useEffect(() => {
    setTargetScale(isHovered ? 1.25 : 1.0);
  }, [isHovered]);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    
    if (meshRef.current) {
      // Smooth scale transition
      meshRef.current.scale.x = THREE.MathUtils.lerp(meshRef.current.scale.x, targetScale, 0.1);
      meshRef.current.scale.y = THREE.MathUtils.lerp(meshRef.current.scale.y, targetScale, 0.1);
      meshRef.current.scale.z = THREE.MathUtils.lerp(meshRef.current.scale.z, targetScale, 0.1);

      // Rotations
      const speedMultiplier = isHovered ? 2.2 : 0.8;
      meshRef.current.rotation.y = time * 0.45 * speedMultiplier;
      meshRef.current.rotation.x = Math.sin(time * 0.2) * 0.25;
      meshRef.current.rotation.z = time * 0.15;
    }

    if (crystalRef.current) {
      crystalRef.current.position.y = Math.sin(time * 1.5) * 0.12;
    }
  });

  const glassMaterialProps = {
    color: theme === "dark" ? "#ffffff" : "#4f46e5",
    roughness: 0.15,
    metalness: 0.85,
    transparent: true,
    opacity: 0.75,
    side: THREE.DoubleSide
  };

  const coreMaterialProps = {
    color: theme === "dark" ? "#a855f7" : "#06b6d4",
    emissive: theme === "dark" ? "#7c3aed" : "#0891b2",
    emissiveIntensity: isHovered ? 2.5 : 1.2,
    roughness: 0.1,
    metalness: 0.8,
  };

  // 1. Fragmentation Shape: A shattered group of tiny floating crystal blocks
  if (type === "fragmentation") {
    const shardPositions = [
      [0.4, 0.3, -0.2],
      [-0.4, -0.3, 0.3],
      [0.3, -0.4, -0.3],
      [-0.3, 0.4, 0.2],
      [0.1, -0.1, 0.4],
      [-0.2, 0.1, -0.4]
    ];

    return (
      <group ref={meshRef}>
        {shardPositions.map((pos, idx) => (
          <mesh key={idx} position={new THREE.Vector3(...pos)}>
            <boxGeometry args={[0.22, 0.22, 0.22]} />
            <meshStandardMaterial {...glassMaterialProps} color={theme === "dark" ? "#f87171" : "#dc2626"} />
          </mesh>
        ))}
        {/* Core center broken seed */}
        <mesh>
          <octahedronGeometry args={[0.22]} />
          <meshStandardMaterial {...coreMaterialProps} color="#ef4444" emissive="#b91c1c" />
        </mesh>
      </group>
    );
  }

  // 2. Dedicated Marketplace: Two interlocking rings rotating smoothly (optimized geometry)
  if (type === "marketplace") {
    return (
      <group ref={meshRef}>
        <mesh rotation={[Math.PI / 4, 0, 0]}>
          <torusGeometry args={[0.65, 0.06, 8, 36]} />
          <meshStandardMaterial {...glassMaterialProps} />
        </mesh>
        <mesh rotation={[-Math.PI / 4, Math.PI / 2, 0]}>
          <torusGeometry args={[0.55, 0.06, 8, 36]} />
          <meshStandardMaterial {...glassMaterialProps} color={theme === "dark" ? "#06b6d4" : "#0284c7"} />
        </mesh>
        <mesh>
          <sphereGeometry args={[0.18, 12, 12]} />
          <meshStandardMaterial {...coreMaterialProps} />
        </mesh>
      </group>
    );
  }

  // 3. Complete Pricing Freedom: Refractive 3D glass octahedron with internal core
  if (type === "pricing") {
    return (
      <group ref={meshRef}>
        <mesh ref={crystalRef}>
          <octahedronGeometry args={[0.75]} />
          <meshStandardMaterial {...glassMaterialProps} />
        </mesh>
        <mesh position={[0, Math.sin(1) * 0.1, 0]}>
          <dodecahedronGeometry args={[0.25]} />
          <meshStandardMaterial {...coreMaterialProps} color="#06b6d4" emissive="#0891b2" />
        </mesh>
      </group>
    );
  }

  // 4. The 1% Standard: A beautiful glassy cylinder or golden ratio disk
  if (type === "fees") {
    return (
      <group ref={meshRef}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.6, 0.6, 0.15, 18, 1, true]} />
          <meshStandardMaterial {...glassMaterialProps} />
        </mesh>
        {/* Inner thin golden core wire */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.48, 0.02, 6, 24]} />
          <meshStandardMaterial {...coreMaterialProps} color="#f59e0b" emissive="#d97706" />
        </mesh>
      </group>
    );
  }

  // 5. The Intelligent Mesh: A micro neural system of connected nodes (highly optimized)
  return (
    <group ref={meshRef}>
      <mesh position={[0.45, 0.45, 0]}>
        <sphereGeometry args={[0.12, 8, 8]} />
        <meshStandardMaterial {...glassMaterialProps} />
      </mesh>
      <mesh position={[-0.45, -0.45, 0]}>
        <sphereGeometry args={[0.12, 8, 8]} />
        <meshStandardMaterial {...glassMaterialProps} />
      </mesh>
      <mesh position={[0.45, -0.45, 0.2]}>
        <sphereGeometry args={[0.12, 8, 8]} />
        <meshStandardMaterial {...glassMaterialProps} color="#06b6d4" />
      </mesh>
      <mesh position={[-0.45, 0.45, -0.2]}>
        <sphereGeometry args={[0.12, 8, 8]} />
        <meshStandardMaterial {...glassMaterialProps} color="#a855f7" />
      </mesh>
      {/* Central hub sphere */}
      <mesh>
        <sphereGeometry args={[0.22, 12, 12]} />
        <meshStandardMaterial {...coreMaterialProps} />
      </mesh>
    </group>
  );
}

export default function Card3DCanvas({ type, isHovered, theme }: Card3DCanvasProps) {
  const [webglSupported, setWebglSupported] = useState(true);

  useEffect(() => {
    try {
      const canvas = document.createElement("canvas");
      setWebglSupported(
        !!(window.WebGLRenderingContext && (canvas.getContext("webgl") || canvas.getContext("experimental-webgl")))
      );
    } catch {
      setWebglSupported(false);
    }
  }, []);

  if (!webglSupported) {
    return (
      <div className="w-full h-32 flex items-center justify-center">
        <div className="w-4 h-4 bg-purple-500 rounded-full animate-ping" />
      </div>
    );
  }

  return (
    <div className="w-full h-32 md:h-36 relative select-none">
      <Canvas
        camera={{ position: [0, 0, 2.2], fov: 45 }}
        gl={{ antialias: false, alpha: true, powerPreference: "high-performance" }}
        dpr={1}
        style={{ width: "100%", height: "100%", background: "transparent" }}
      >
        <ambientLight intensity={theme === "dark" ? 0.75 : 1.2} />
        <directionalLight position={[2, 2, 2]} intensity={theme === "dark" ? 1.5 : 2.0} />
        <pointLight position={[-2, -2, -2]} intensity={0.5} />
        <FloatingMesh type={type} isHovered={isHovered} theme={theme} />
      </Canvas>
    </div>
  );
}
