import React, { useRef, useMemo, useEffect, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import Card from "../ui/Card.jsx";
import { useDashboard } from "../../context/DashboardContext.jsx";
import BACKEND_URL from "../../config.js";

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

  useFrame((_, delta) => {
    if (pointsRef.current) {
      const positions = pointsRef.current.geometry.attributes.position.array;
      const driftSpeed = sentiment * 2;
      for (let i = 0; i < positions.length; i += 3) {
        positions[i + 1] += delta * driftSpeed;
        if (driftSpeed > 0 && positions[i + 1] > 5) positions[i + 1] = -5;
        else if (driftSpeed < 0 && positions[i + 1] < -5) positions[i + 1] = 5;
      }
      pointsRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

// --- END OF PARTICLE SYSTEM ---

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
        color={sentiment > 0 ? "#4ade80" : "#f87171"}
        sizeAttenuation
        transparent
        opacity={0.8}
      />
    </points>
  );
};

export default function MarketMoodboard({ className }) {
  const { activeStock } = useDashboard();
  const [sentiment, setSentiment] = useState(0);

  // 🔥 Fetch latest sentiment when user clicks a ticker
  useEffect(() => {
    const fetchSentiment = async () => {
      if (!activeStock?.symbol) return;

      try {
        const res = await fetch(`${BACKEND_URL}/history/${activeStock.symbol}`);
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          const latest = data[data.length - 1];
          setSentiment(parseFloat(latest.score) || 0);
        } else {
          setSentiment(0);
        }
      } catch (err) {
        console.error("⚠️ Error fetching sentiment:", err);
        setSentiment(0);
      }
    };

    fetchSentiment();
  }, [activeStock?.symbol]);

  return (
    <Card title="Market Moodboard" subtitle="" className={className}>
      <div className="w-full h-[310px] rounded-xl overflow-hidden bg-black">
        <Canvas camera={{ position: [0, 0, 7] }}>
          <fog attach="fog" args={["#000000", 5, 15]} />
          <ParticleSystem sentiment={sentiment} />
          <OrbitControls autoRotate autoRotateSpeed={0.5} enableZoom={false} />
        </Canvas>
      </div>
    </Card>
  );
}
