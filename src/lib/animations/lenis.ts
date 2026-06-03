import type Lenis from "lenis";

/**
 * Module-level handle to the single Lenis instance created in
 * SmoothScrollProvider, so other components (e.g. the navbar) can drive smooth
 * scrolling without prop-drilling or context.
 */
let instance: Lenis | null = null;

export function setLenis(l: Lenis | null) {
  instance = l;
}

export function getLenis(): Lenis | null {
  return instance;
}

/** Smooth-scroll to an element id, accounting for the fixed navbar height. */
export function scrollToId(id: string, offset = -80) {
  const el = document.getElementById(id);
  if (!el) return;
  const lenis = getLenis();
  if (lenis) {
    lenis.scrollTo(el, { offset });
  } else {
    const top = el.getBoundingClientRect().top + window.scrollY + offset;
    window.scrollTo({ top, behavior: "smooth" });
  }
}
