"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useUIStore } from "@/store/useUIStore";
import { getForm, center } from "@/three/forms";

interface MorphingParticlesProps {
  count?: number;
  color?: string;
  pointer?: { x: number; y: number };
}

/**
 * A single particle system that morphs into a *meaningful* shape for whichever
 * page section is in view (globe, leaf, DNA helix, bar chart, lattice, atom,
 * growth curve, envelope…). The target form is set via the UI store's `bgShape`
 * by each section as it scrolls into view; particles continuously ease toward
 * their position in that form, so the background "draws" the current topic.
 */
export function MorphingParticles({
  count = 4000,
  color = "#c6f135",
  pointer = { x: 0, y: 0 },
}: MorphingParticlesProps) {
  const pointsRef = useRef<THREE.Points>(null);
  const group = useRef<THREE.Group>(null);

  // Live position buffer (eased every frame) + scratch target buffer.
  const current = useMemo(() => new Float32Array(count * 3), [count]);
  const target = useMemo(() => new Float32Array(count * 3), [count]);

  // Initialize from the starting shape so there's no first-frame snap.
  useEffect(() => {
    const start = center(getForm(useUIStore.getState().bgShape, count));
    current.set(start);
    target.set(start);
  }, [count, current, target]);

  // When bgShape changes, recompute the target form.
  useEffect(() => {
    const unsub = useUIStore.subscribe((state, prev) => {
      if (state.bgShape !== prev.bgShape) {
        target.set(center(getForm(state.bgShape, count)));
      }
    });
    return unsub;
  }, [count, target]);

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.05);
    // Frame-rate independent damping toward the active form.
    const ease = 1 - Math.pow(0.004, dt);
    for (let i = 0; i < current.length; i++) {
      current[i] = current[i]! + (target[i]! - current[i]!) * ease;
    }

    if (pointsRef.current) {
      const attr = pointsRef.current.geometry.getAttribute("position") as THREE.BufferAttribute;
      attr.needsUpdate = true;
    }

    if (group.current) {
      const t = state.clock.elapsedTime;
      // The forms are flat front-facing silhouettes, so we only gently SWAY
      // (never full-spin, which would turn them edge-on into a line). A small
      // oscillation + pointer parallax gives life and a hint of depth.
      const swayY = Math.sin(t * 0.4) * 0.18 + pointer.x * 0.25;
      const swayX = Math.cos(t * 0.3) * 0.08 - pointer.y * 0.18;
      group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, swayY, 0.05);
      group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, swayX, 0.05);
    }
  });

  return (
    <group ref={group}>
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[current, 3]} />
        </bufferGeometry>
        <pointsMaterial
          size={0.05}
          color={color}
          transparent
          opacity={0.55}
          sizeAttenuation
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  );
}
