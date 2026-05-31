"use client";

import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useUIStore } from "@/store/useUIStore";

/**
 * Gentle scroll-coupled camera. It dollies in slightly and drifts with scroll
 * progress while easing toward the pointer, keeping the active particle form
 * centered and cinematic without ever throwing it off-screen.
 */
export function CameraRig() {
  const { camera } = useThree();
  const target = useRef(new THREE.Vector3());

  useFrame(() => {
    const { scrollProgress, pointer } = useUIStore.getState();

    const targetZ = 13 - scrollProgress * 2; // 13 → 11
    const targetX = pointer.x * 1.1;
    const targetY = -pointer.y * 0.8;

    camera.position.x = THREE.MathUtils.lerp(camera.position.x, targetX, 0.04);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, targetY, 0.04);
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetZ, 0.04);

    target.current.set(0, 0, 0);
    camera.lookAt(target.current);
  });

  return null;
}
