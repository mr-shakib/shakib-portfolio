"use client";

import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useUIStore } from "@/store/useUIStore";

/**
 * The heart of the "stunning parallax": the camera smoothly dollies forward
 * along Z and pans with scroll progress, while also easing toward the pointer.
 * Objects placed at different depths therefore separate dramatically as you
 * scroll — near shapes sweep past, far ones glide. All motion is damped (lerp)
 * for a cinematic, weighty feel.
 */
export function CameraRig() {
  const { camera } = useThree();
  const target = useRef(new THREE.Vector3());

  useFrame(() => {
    const { scrollProgress, pointer } = useUIStore.getState();

    // Dolly through the scene + drift sideways/down as the page scrolls.
    const targetZ = 14 - scrollProgress * 10; // 14 → 4
    const targetX = pointer.x * 1.6 + Math.sin(scrollProgress * Math.PI) * 1.2;
    const targetY = -pointer.y * 1.2 - scrollProgress * 2.5;

    camera.position.x = THREE.MathUtils.lerp(camera.position.x, targetX, 0.045);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, targetY, 0.045);
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetZ, 0.045);

    // Always look slightly ahead toward the scene center for stable framing.
    target.current.set(targetX * 0.3, targetY * 0.3, -6);
    camera.lookAt(target.current);
  });

  return null;
}
