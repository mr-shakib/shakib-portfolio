"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * Central GSAP registration. Importing from here guarantees plugins are
 * registered exactly once (registration is idempotent but centralizing avoids
 * SSR pitfalls and scattered imports).
 */
let registered = false;

export function registerGsap() {
  if (registered || typeof window === "undefined") return;
  gsap.registerPlugin(ScrollTrigger);
  // Smooth out RAF lag spikes when the tab regains focus.
  gsap.ticker.lagSmoothing(1000, 16);
  registered = true;
}

export { gsap, ScrollTrigger };

/** Shared easing tokens mirroring the CSS custom properties. */
export const ease = {
  outExpo: "expo.out",
  inOutExpo: "expo.inOut",
  power3: "power3.out",
} as const;
