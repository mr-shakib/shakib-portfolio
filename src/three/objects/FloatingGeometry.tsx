"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useUIStore } from "@/store/useUIStore";

interface ShapeDef {
  kind: "icosahedron" | "octahedron" | "torus" | "dodecahedron";
  position: [number, number, number];
  scale: number;
  rotationSpeed: [number, number];
  floatAmp: number;
  floatSpeed: number;
}

/** Pre-defined, depth-staggered shapes. Z spans a wide range so the camera
 *  dolly produces strong parallax separation between near and far shapes. */
function buildShapes(count: number): ShapeDef[] {
  const kinds: ShapeDef["kind"][] = ["icosahedron", "octahedron", "torus", "dodecahedron"];
  const shapes: ShapeDef[] = [];
  for (let i = 0; i < count; i++) {
    const t = i / count;
    shapes.push({
      kind: kinds[i % kinds.length]!,
      position: [
        (Math.sin(i * 12.9898) * 0.5 + (i % 2 === 0 ? -1 : 1)) * (5 + t * 6),
        (Math.cos(i * 78.233) * 0.5) * (4 + t * 5),
        -2 - t * 22, // depth: near (-2) to far (-24)
      ],
      scale: 0.5 + (1 - t) * 1.6,
      rotationSpeed: [0.05 + t * 0.1, 0.08 + t * 0.12],
      floatAmp: 0.3 + t * 0.6,
      floatSpeed: 0.3 + t * 0.5,
    });
  }
  return shapes;
}

function Geometry({ kind }: { kind: ShapeDef["kind"] }) {
  switch (kind) {
    case "torus":
      return <torusGeometry args={[0.7, 0.22, 16, 48]} />;
    case "octahedron":
      return <octahedronGeometry args={[0.9, 0]} />;
    case "dodecahedron":
      return <dodecahedronGeometry args={[0.85, 0]} />;
    default:
      return <icosahedronGeometry args={[0.9, 0]} />;
  }
}

interface FloatingGeometryProps {
  count?: number;
  pointer?: { x: number; y: number };
  color?: string;
}

/**
 * Wireframe geometric shapes scattered across a deep Z range. Each gently
 * floats and rotates; the whole group parallaxes toward the pointer. Combined
 * with the scroll-driven camera dolly, the depth spread reads as rich 3D
 * parallax. Rendered as lightweight wireframes for an elegant, technical feel.
 */
export function FloatingGeometry({
  count = 9,
  pointer = { x: 0, y: 0 },
  color = "#c6f135",
}: FloatingGeometryProps) {
  const group = useRef<THREE.Group>(null);
  const shapes = useMemo(() => buildShapes(count), [count]);
  const mat = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: new THREE.Color(color),
        wireframe: true,
        transparent: true,
        opacity: 0.22,
      }),
    [color],
  );
  const refs = useRef<(THREE.Mesh | null)[]>([]);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    const dt = Math.min(delta, 0.05);
    const progress = useUIStore.getState().scrollProgress;
    shapes.forEach((s, i) => {
      const mesh = refs.current[i];
      if (!mesh) return;
      mesh.rotation.x += s.rotationSpeed[0] * dt;
      mesh.rotation.y += s.rotationSpeed[1] * dt;
      mesh.position.y = s.position[1] + Math.sin(t * s.floatSpeed + i) * s.floatAmp;

      // Reveal: each shape scales up from near-zero and brightens as you scroll,
      // staggered by depth so they materialize one wave at a time.
      const stagger = i / shapes.length;
      const local = THREE.MathUtils.clamp((progress - stagger * 0.4) / 0.5, 0, 1);
      const targetScale = s.scale * (0.05 + local * 0.95);
      mesh.scale.setScalar(THREE.MathUtils.lerp(mesh.scale.x, targetScale, 0.07));
      const mMat = mesh.material as THREE.MeshBasicMaterial;
      mMat.opacity = THREE.MathUtils.lerp(mMat.opacity, 0.05 + local * 0.25, 0.07);
    });
    if (group.current) {
      group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, pointer.x * 0.15, 0.04);
      group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, -pointer.y * 0.1, 0.04);
    }
  });

  return (
    <group ref={group}>
      {shapes.map((s, i) => (
        <mesh
          key={i}
          ref={(el) => {
            refs.current[i] = el;
          }}
          position={s.position}
          scale={s.scale}
          material={mat}
        >
          <Geometry kind={s.kind} />
        </mesh>
      ))}
    </group>
  );
}
