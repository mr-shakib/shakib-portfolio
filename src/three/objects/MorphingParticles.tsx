"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useUIStore } from "@/store/useUIStore";

interface MorphingParticlesProps {
  count?: number;
  color?: string;
  pointer?: { x: number; y: number };
}

/* ---- Form generators: each fills a Float32Array(count*3) with a shape ---- */

function cloudForm(count: number): Float32Array {
  const a = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    a[i * 3] = (Math.random() - 0.5) * 22;
    a[i * 3 + 1] = (Math.random() - 0.5) * 14;
    a[i * 3 + 2] = (Math.random() - 0.5) * 22;
  }
  return a;
}

function sphereForm(count: number, r = 5): Float32Array {
  const a = new Float32Array(count * 3);
  const golden = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < count; i++) {
    const y = 1 - (i / (count - 1)) * 2;
    const radius = Math.sqrt(1 - y * y);
    const theta = golden * i;
    a[i * 3] = Math.cos(theta) * radius * r;
    a[i * 3 + 1] = y * r;
    a[i * 3 + 2] = Math.sin(theta) * radius * r;
  }
  return a;
}

function torusKnotForm(count: number, R = 3.4, r = 1.3, p = 2, q = 3): Float32Array {
  const a = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const u = (i / count) * Math.PI * 2 * q;
    const cu = Math.cos(u);
    const su = Math.sin(u);
    const qpu = (p / q) * u;
    const cpu = Math.cos(qpu);
    const ring = R + r * Math.cos(qpu);
    // jitter so it reads as a volume, not a thin wire
    const j = () => (Math.random() - 0.5) * 0.5;
    a[i * 3] = ring * cu * 0.6 + j();
    a[i * 3 + 1] = r * Math.sin(qpu) * 1.2 + j();
    a[i * 3 + 2] = ring * su * 0.6 + j();
    void cpu;
  }
  return a;
}

function galaxyForm(count: number, arms = 4, radius = 7): Float32Array {
  const a = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const t = Math.pow(Math.random(), 0.6);
    const r = t * radius;
    const arm = (i % arms) / arms;
    const angle = arm * Math.PI * 2 + t * 4.5;
    const spread = (1 - t) * 0.6;
    a[i * 3] = Math.cos(angle) * r + (Math.random() - 0.5) * spread;
    a[i * 3 + 1] = (Math.random() - 0.5) * (0.6 + (1 - t) * 1.5);
    a[i * 3 + 2] = Math.sin(angle) * r + (Math.random() - 0.5) * spread;
  }
  return a;
}

/**
 * A single particle system that morphs between distinct forms as the page is
 * scrolled — cloud → sphere → torus-knot → galaxy. Each particle continuously
 * eases toward its position in the currently-active form, so scrolling literally
 * "forms" a recognizable shape (a reveal), and each section shows a new one.
 */
export function MorphingParticles({
  count = 4000,
  color = "#c6f135",
  pointer = { x: 0, y: 0 },
}: MorphingParticlesProps) {
  const pointsRef = useRef<THREE.Points>(null);
  const group = useRef<THREE.Group>(null);

  const { current, forms } = useMemo(() => {
    const formList = [
      cloudForm(count),
      sphereForm(count),
      torusKnotForm(count),
      galaxyForm(count),
    ];
    // start at the cloud
    const cur = new Float32Array(formList[0]!);
    return { current: cur, forms: formList };
  }, [count]);

  // scratch target reused each frame (no per-frame allocation)
  const target = useMemo(() => new Float32Array(count * 3), [count]);

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.05);
    const p = useUIStore.getState().scrollProgress;

    // Map scroll to a position along the form sequence.
    const segs = forms.length - 1;
    const f = THREE.MathUtils.clamp(p, 0, 1) * segs;
    const base = Math.min(Math.floor(f), segs - 1);
    const frac = f - base;
    const from = forms[base]!;
    const to = forms[base + 1]!;

    // Build the interpolated target, then ease current toward it.
    const ease = 1 - Math.pow(0.0015, dt); // frame-rate independent damping
    for (let i = 0; i < target.length; i++) {
      const tv = from[i]! + (to[i]! - from[i]!) * frac;
      current[i] = current[i]! + (tv - current[i]!) * ease;
    }

    if (pointsRef.current) {
      const attr = pointsRef.current.geometry.getAttribute("position") as THREE.BufferAttribute;
      attr.needsUpdate = true;
      const mat = pointsRef.current.material as THREE.PointsMaterial;
      // brighten as the first form resolves
      mat.opacity = THREE.MathUtils.lerp(mat.opacity, 0.35 + Math.min(p * 2, 1) * 0.35, 0.05);
    }

    if (group.current) {
      const t = state.clock.elapsedTime;
      group.current.rotation.y = THREE.MathUtils.lerp(
        group.current.rotation.y,
        pointer.x * 0.4 + t * 0.04,
        0.04,
      );
      group.current.rotation.x = THREE.MathUtils.lerp(
        group.current.rotation.x,
        -pointer.y * 0.3,
        0.04,
      );
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
          opacity={0.35}
          sizeAttenuation
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  );
}
