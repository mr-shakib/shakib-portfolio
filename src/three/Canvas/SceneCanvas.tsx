"use client";

import { Suspense, useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { AdaptiveDpr, AdaptiveEvents, PerformanceMonitor } from "@react-three/drei";
import { MorphingParticles } from "@/three/objects/MorphingParticles";
import { CameraRig } from "@/three/Canvas/CameraRig";
import { useCapability } from "@/three/hooks/useCapability";
import { useUIStore } from "@/store/useUIStore";
import { useSceneStore } from "@/store/useSceneStore";

function SceneContents({ tier }: { tier: "high" | "low" }) {
  const pointer = useUIStore((s) => s.pointer);
  const setCanvasReady = useSceneStore((s) => s.setCanvasReady);

  useEffect(() => {
    setCanvasReady(true);
    return () => setCanvasReady(false);
  }, [setCanvasReady]);

  const particleCount = tier === "high" ? 4000 : 1500;

  return (
    <>
      <AdaptiveDpr pixelated />
      <AdaptiveEvents />
      <ambientLight intensity={0.6} />
      <pointLight position={[10, 10, 10]} intensity={0.4} color="#c6f135" />
      <CameraRig />
      <Suspense fallback={null}>
        <MorphingParticles count={particleCount} pointer={pointer} />
      </Suspense>
    </>
  );
}

export default function SceneCanvas() {
  const { tier, ready } = useCapability();
  const [degraded, setDegraded] = useState(false);

  if (!ready || tier === "none") return null;

  const effectiveTier: "high" | "low" = degraded ? "low" : tier === "high" ? "high" : "low";

  return (
    <Canvas
      className="!fixed inset-0 -z-10"
      camera={{ position: [0, 0, 13], fov: 55 }}
      dpr={effectiveTier === "high" ? [1, 1.5] : 1}
      gl={{
        antialias: effectiveTier === "high",
        alpha: true,
        powerPreference: "high-performance",
      }}
      style={{ pointerEvents: "none" }}
    >
      <PerformanceMonitor onDecline={() => setDegraded(true)} />
      <SceneContents tier={effectiveTier} />
    </Canvas>
  );
}
