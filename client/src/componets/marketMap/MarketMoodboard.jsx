import React, { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import Card from "../ui/Card.jsx";
// 1. Import our new custom hook
import { useDashboard } from "../../context/DashboardContext.jsx";

// --- PARTICLE SYSTEM (No changes here, it just receives props) ---
const ParticleSystem = ({ sentiment }) => {
  const pointsRef = useRef();

  const particles = useMemo(() => {
    const count = 5000;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < positions.length; i += 3) {
      positions[i] = (Math.random() - 0.5) * 10;
      positions[i + 1] = (Math.random() - 0.5) * 10;
      positions[i + 2] = (Math.random() - 0.5) * 10;
    }
    return positions;
  }, []);

  useFrame((state, delta) => {
    if (pointsRef.current) {
      const positions = pointsRef.current.geometry.attributes.position.array;
      const driftSpeed = sentiment * 2; // Controlled by the prop

      for (let i = 0; i < positions.length; i += 3) {
        positions[i + 1] += delta * driftSpeed;
        if (driftSpeed > 0 && positions[i + 1] > 5) {
          positions[i + 1] = -5;
        } else if (driftSpeed < 0 && positions[i + 1] < -5) {
          positions[i + 1] = 5;
        }
      }
      pointsRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particles.length / 3}
          array={particles}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        color={sentiment > 0 ? "#4ade80" : "#f87171"} // Controlled by the prop
        sizeAttenuation={true}
        transparent={true}
        opacity={0.8}
      />
    </points>
  );
};
// --- END OF PARTICLE SYSTEM ---

// This is the main component
export default function MarketMoodboard ({ className, items = [] }) {
  // 2. Get the active stock from the context
  const { activeStock } = useDashboard();

  // 3. Use the active stock's sentiment.
  // We use `|| 0` as a fallback in case activeStock is null.
  const currentSentiment = activeStock?.sentiment || 0;

  return (
    <Card
      title="Market Moodboard"
      subtitle=""
      className={className}
    >
    
    <div className="w-full h-[310px] rounded-xl overflow-hidden bg-black">
      <Canvas camera={{ position: [0, 0, 7] }}>
        <fog attach="fog" args={["#000000", 5, 15]} />

        {/* 4. Pass the real sentiment to the particle system */}
        <ParticleSystem sentiment={currentSentiment} />

        <OrbitControls
          autoRotate={true}
          autoRotateSpeed={0.5}
          enableZoom={false}
        />
      </Canvas>
    </div>
    </Card>
  );
};


