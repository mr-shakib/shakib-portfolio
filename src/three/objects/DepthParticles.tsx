"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useUIStore } from "@/store/useUIStore";

interface DepthParticlesProps {
  /** Particles per layer. */
  count?: number;
  /** Number of depth layers — more layers = richer parallax separation. */
  layers?: number;
  color?: string;
}

/**
 * Multiple particle planes at increasing depth. Because they sit at different Z,
 * the scroll-driven camera dolly moves near layers faster than far ones — depth
 * parallax. Additionally, each layer fades/spreads IN as you scroll, so the
 * field is revealed rather than just present.
 */
export function DepthParticles({ count = 220, layers = 4, color = "#c6f135" }: DepthParticlesProps) {
  const groupRefs = useRef<Array<THREE.Points | null>>([]);

  const layerData = useMemo(() => {
    return Array.from({ length: layers }, (_, layer) => {
      const depth = -2 - layer * 6; // -2, -8, -14, -20
      const spread = 16 + layer * 5;
      const positions = new Float32Array(count * 3);
      for (let i = 0; i < count; i++) {
        positions[i * 3] = (Math.random() - 0.5) * spread * 1.6;
        positions[i * 3 + 1] = (Math.random() - 0.5) * spread;
        positions[i * 3 + 2] = depth + (Math.random() - 0.5) * 2;
      }
      return {
        positions,
        size: 0.06 - layer * 0.01,
        opacity: 0.45 - layer * 0.08,
        drift: 0.01 + layer * 0.004,
      };
    });
  }, [count, layers]);

  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.05);
    const progress = useUIStore.getState().scrollProgress;
    layerData.forEach((l, i) => {
      const pts = groupRefs.current[i];
      if (!pts) return;
      pts.rotation.z += l.drift * dt;
      // Reveal: particles spread out + brighten as the page is scrolled.
      const reveal = 0.6 + progress * 0.6;
      pts.scale.setScalar(THREE.MathUtils.lerp(pts.scale.x, reveal, 0.06));
      const mat = pts.material as THREE.PointsMaterial;
      mat.opacity = THREE.MathUtils.lerp(mat.opacity, l.opacity * (0.4 + progress * 0.9), 0.06);
    });
  });

  return (
    <group>
      {layerData.map((l, i) => (
        <points
          key={i}
          ref={(el: THREE.Points | null) => {
            groupRefs.current[i] = el;
          }}
        >
          <bufferGeometry>
            <bufferAttribute attach="attributes-position" args={[l.positions, 3]} />
          </bufferGeometry>
          <pointsMaterial
            size={l.size}
            color={color}
            transparent
            opacity={l.opacity}
            sizeAttenuation
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </points>
      ))}
    </group>
  );
}
