"use client";

import { Suspense, useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { AdaptiveDpr, AdaptiveEvents, PerformanceMonitor } from "@react-three/drei";
import { NeuralNetwork } from "@/three/objects/NeuralNetwork";
import { DepthParticles } from "@/three/objects/DepthParticles";
import { FloatingGeometry } from "@/three/objects/FloatingGeometry";
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

  const nodeCount = tier === "high" ? 70 : 36;
  const particleCount = tier === "high" ? 220 : 90;
  const particleLayers = tier === "high" ? 4 : 2;
  const shapeCount = tier === "high" ? 9 : 5;

  return (
    <>
      <AdaptiveDpr pixelated />
      <AdaptiveEvents />
      <ambientLight intensity={0.6} />
      <pointLight position={[10, 10, 10]} intensity={0.4} color="#c6f135" />
      <CameraRig />
      <Suspense fallback={null}>
        {/* Deep, scroll-parallaxing layers */}
        <DepthParticles count={particleCount} layers={particleLayers} />
        <FloatingGeometry count={shapeCount} pointer={pointer} />
        {/* Foreground signature element */}
        <NeuralNetwork nodeCount={nodeCount} pointer={pointer} />
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
      camera={{ position: [0, 0, 14], fov: 55 }}
      dpr={effectiveTier === "high" ? [1, 1.5] : 1}
      gl={{
        antialias: effectiveTier === "high",
        alpha: true,
        powerPreference: "high-performance",
      }}
      style={{ pointerEvents: "none" }}
    >
      {/* Drop to the low tier if the device can't sustain framerate. */}
      <PerformanceMonitor onDecline={() => setDegraded(true)} />
      <SceneContents tier={effectiveTier} />
    </Canvas>
  );
}
