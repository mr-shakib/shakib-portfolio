"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface NeuralNetworkProps {
  nodeCount?: number;
  connectionDistance?: number;
  pointer?: { x: number; y: number };
}

interface NodeData {
  base: THREE.Vector3;
  velocity: THREE.Vector3;
}

/**
 * Interactive neural network: nodes drift autonomously, connect to nearby nodes
 * with lines whose opacity fades with distance, and the whole graph parallaxes
 * toward the pointer. Geometry is rebuilt per-frame into pre-allocated buffers
 * to avoid per-frame allocations.
 */
export function NeuralNetwork({
  nodeCount = 90,
  connectionDistance = 3.2,
  pointer = { x: 0, y: 0 },
}: NeuralNetworkProps) {
  const group = useRef<THREE.Group>(null);
  const pointsRef = useRef<THREE.Points>(null);
  const linesRef = useRef<THREE.LineSegments>(null);

  const { nodes, pointPositions, linePositions, lineColors, maxLineVerts } = useMemo(() => {
    const spread = 11;
    const n: NodeData[] = Array.from({ length: nodeCount }, () => ({
      base: new THREE.Vector3(
        (Math.random() - 0.5) * spread,
        (Math.random() - 0.5) * spread,
        (Math.random() - 0.5) * spread * 0.6,
      ),
      velocity: new THREE.Vector3(
        (Math.random() - 0.5) * 0.15,
        (Math.random() - 0.5) * 0.15,
        (Math.random() - 0.5) * 0.1,
      ),
    }));
    const pp = new Float32Array(nodeCount * 3);
    // Each node could connect to several others; cap line buffer generously.
    const maxLines = nodeCount * 6;
    const lp = new Float32Array(maxLines * 2 * 3);
    const lc = new Float32Array(maxLines * 2 * 3);
    return {
      nodes: n,
      pointPositions: pp,
      linePositions: lp,
      lineColors: lc,
      maxLineVerts: maxLines * 2,
    };
  }, [nodeCount]);

  const accent = useMemo(() => new THREE.Color("#c6f135"), []);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    const dt = Math.min(delta, 0.05);

    // Update node positions (drift + gentle bounds).
    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i]!;
      node.base.addScaledVector(node.velocity, dt);
      (["x", "y", "z"] as const).forEach((axis) => {
        const limit = axis === "z" ? 3.5 : 6;
        if (node.base[axis] > limit || node.base[axis] < -limit) {
          node.velocity[axis] *= -1;
        }
      });
      const wobble = Math.sin(t * 0.5 + i) * 0.15;
      pointPositions[i * 3] = node.base.x;
      pointPositions[i * 3 + 1] = node.base.y + wobble;
      pointPositions[i * 3 + 2] = node.base.z;
    }

    // Build connection lines.
    let v = 0;
    const maxDistSq = connectionDistance * connectionDistance;
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        if (v >= maxLineVerts) break;
        const dx = pointPositions[i * 3]! - pointPositions[j * 3]!;
        const dy = pointPositions[i * 3 + 1]! - pointPositions[j * 3 + 1]!;
        const dz = pointPositions[i * 3 + 2]! - pointPositions[j * 3 + 2]!;
        const dSq = dx * dx + dy * dy + dz * dz;
        if (dSq < maxDistSq) {
          const alpha = 1 - Math.sqrt(dSq) / connectionDistance;
          for (const idx of [i, j]) {
            linePositions[v * 3] = pointPositions[idx * 3]!;
            linePositions[v * 3 + 1] = pointPositions[idx * 3 + 1]!;
            linePositions[v * 3 + 2] = pointPositions[idx * 3 + 2]!;
            lineColors[v * 3] = accent.r * alpha;
            lineColors[v * 3 + 1] = accent.g * alpha;
            lineColors[v * 3 + 2] = accent.b * alpha;
            v++;
          }
        }
      }
    }

    if (pointsRef.current) {
      const attr = pointsRef.current.geometry.getAttribute("position");
      (attr as THREE.BufferAttribute).needsUpdate = true;
    }
    if (linesRef.current) {
      const geo = linesRef.current.geometry;
      geo.setDrawRange(0, v);
      (geo.getAttribute("position") as THREE.BufferAttribute).needsUpdate = true;
      (geo.getAttribute("color") as THREE.BufferAttribute).needsUpdate = true;
    }

    // Pointer parallax.
    if (group.current) {
      group.current.rotation.y = THREE.MathUtils.lerp(
        group.current.rotation.y,
        pointer.x * 0.3,
        0.05,
      );
      group.current.rotation.x = THREE.MathUtils.lerp(
        group.current.rotation.x,
        -pointer.y * 0.2,
        0.05,
      );
    }
  });

  return (
    <group ref={group}>
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[pointPositions, 3]} />
        </bufferGeometry>
        <pointsMaterial
          size={0.085}
          color={accent}
          transparent
          opacity={0.5}
          sizeAttenuation
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>

      <lineSegments ref={linesRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[linePositions, 3]} />
          <bufferAttribute attach="attributes-color" args={[lineColors, 3]} />
        </bufferGeometry>
        <lineBasicMaterial
          vertexColors
          transparent
          opacity={0.18}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </lineSegments>
    </group>
  );
}
