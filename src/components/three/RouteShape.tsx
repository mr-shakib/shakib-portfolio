"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useUIStore } from "@/store/useUIStore";

/**
 * Sets a sensible default background shape per route. On the home page the
 * per-section <SectionShape /> markers take over as you scroll; routed content
 * pages get one fitting form for their topic.
 */
const ROUTE_SHAPES: { match: (p: string) => boolean; shape: string }[] = [
  { match: (p) => p.startsWith("/research"), shape: "helix" },
  { match: (p) => p.startsWith("/publications"), shape: "leaf" },
  { match: (p) => p.startsWith("/projects"), shape: "lattice" },
  { match: (p) => p.startsWith("/resume"), shape: "figure" },
  { match: (p) => p.startsWith("/contact"), shape: "envelope" },
];

export function RouteShape() {
  const pathname = usePathname();

  useEffect(() => {
    const setBgShape = useUIStore.getState().setBgShape;
    if (pathname === "/") {
      setBgShape("globe");
      return;
    }
    const match = ROUTE_SHAPES.find((r) => r.match(pathname));
    setBgShape(match ? match.shape : "globe");
  }, [pathname]);

  return null;
}
