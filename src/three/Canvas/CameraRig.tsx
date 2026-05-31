"use client";

import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useUIStore } from "@/store/useUIStore";

/**
 * Gentle scroll-coupled camera. It orbits/dollies slightly with scroll progress
 * and eases toward the pointer, keeping the morphing particle form centered and
 * cinematic without ever throwing it off-screen.
 */
export function CameraRig() {
  const { camera } = useThree();
  const target = useRef(new THREE.Vector3());

  useFrame(() => {
    const { scrollProgress, pointer } = useUIStore.getState();

    const targetZ = 13 - scrollProgress * 3; // 13 → 10
    const targetX = pointer.x * 1.2 + Math.sin(scrollProgress * Math.PI * 2) * 1.4;
    const targetY = -pointer.y * 0.9 + Math.cos(scrollProgress * Math.PI) * 0.8;

    camera.position.x = THREE.MathUtils.lerp(camera.position.x, targetX, 0.04);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, targetY, 0.04);
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetZ, 0.04);

    target.current.set(0, 0, 0);
    camera.lookAt(target.current);
  });

  return null;
}
