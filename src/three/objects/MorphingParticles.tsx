"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useUIStore } from "@/store/useUIStore";
import { getForm, center, NETWORK_NODES, NETWORK_EDGES } from "@/three/forms";

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
  const linesRef = useRef<THREE.LineSegments>(null);
  const group = useRef<THREE.Group>(null);

  // Live position buffer (eased every frame) + scratch target buffer.
  const current = useMemo(() => new Float32Array(count * 3), [count]);
  const target = useMemo(() => new Float32Array(count * 3), [count]);

  // Static line geometry for the network's connecting edges (recentred to match
  // the centered network form). Only shown while the network shape is active.
  const linePositions = useMemo(() => {
    // centroid of nodes (network form is centered the same way)
    let cx = 0,
      cy = 0,
      cz = 0;
    for (const n of NETWORK_NODES) {
      cx += n[0];
      cy += n[1];
      cz += n[2];
    }
    cx /= NETWORK_NODES.length;
    cy /= NETWORK_NODES.length;
    cz /= NETWORK_NODES.length;
    const arr = new Float32Array(NETWORK_EDGES.length * 2 * 3);
    NETWORK_EDGES.forEach((e, i) => {
      const a = NETWORK_NODES[e[0]]!;
      const b = NETWORK_NODES[e[1]]!;
      arr[i * 6] = a[0] - cx;
      arr[i * 6 + 1] = a[1] - cy;
      arr[i * 6 + 2] = a[2] - cz;
      arr[i * 6 + 3] = b[0] - cx;
      arr[i * 6 + 4] = b[1] - cy;
      arr[i * 6 + 5] = b[2] - cz;
    });
    return arr;
  }, []);

  // Initialize from the starting shape so there's no first-frame snap.
  useEffect(() => {
    const start = center(getForm(useUIStore.getState().bgShape, count));
    current.set(start);
    target.set(start);
  }, [count, current, target]);

  // Track the active shape so we can give volumetric forms (globe, helix) a
  // real 3D spin while flat silhouettes only sway.
  const shapeRef = useRef<string>(useUIStore.getState().bgShape);

  // When bgShape changes, recompute the target form.
  useEffect(() => {
    const unsub = useUIStore.subscribe((state, prev) => {
      if (state.bgShape !== prev.bgShape) {
        shapeRef.current = state.bgShape;
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
      const shape = shapeRef.current;
      const volumetric = shape === "globe" || shape === "helix";

      if (volumetric) {
        // Real, continuous 3D rotation so the sphere/helix reads as a solid.
        group.current.rotation.y += dt * 0.5 + pointer.x * 0.004;
        group.current.rotation.x = THREE.MathUtils.lerp(
          group.current.rotation.x,
          -pointer.y * 0.2,
          0.05,
        );
      } else {
        // Flat silhouettes: gentle sway only (a full spin would go edge-on).
        const swayY = Math.sin(t * 0.4) * 0.18 + pointer.x * 0.25;
        const swayX = Math.cos(t * 0.3) * 0.08 - pointer.y * 0.18;
        group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, swayY, 0.05);
        group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, swayX, 0.05);
      }

      // The network "breathes" — a slow, calm pulse in scale.
      if (shape === "globe") {
        // gentle double-thump every ~2.2s (≈27 bpm feel), subtle amplitude
        const cycle = (t * 0.45) % 1;
        const thump =
          Math.exp(-Math.pow((cycle - 0.0) * 7, 2)) +
          0.6 * Math.exp(-Math.pow((cycle - 0.18) * 7, 2));
        const beat = 1 + thump * 0.045;
        group.current.scale.setScalar(THREE.MathUtils.lerp(group.current.scale.x, beat, 0.12));
      } else {
        group.current.scale.setScalar(THREE.MathUtils.lerp(group.current.scale.x, 1, 0.1));
      }

      // Fade the network's connecting lines in/out with the active shape.
      if (linesRef.current) {
        const mat = linesRef.current.material as THREE.LineBasicMaterial;
        const targetOpacity = shape === "globe" ? 0.22 : 0;
        mat.opacity = THREE.MathUtils.lerp(mat.opacity, targetOpacity, 0.08);
        linesRef.current.visible = mat.opacity > 0.01;
      }
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

      {/* Network connecting lines — fade in only while the network is active. */}
      <lineSegments ref={linesRef} visible={false}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[linePositions, 3]} />
        </bufferGeometry>
        <lineBasicMaterial
          color={color}
          transparent
          opacity={0}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </lineSegments>
    </group>
  );
}
