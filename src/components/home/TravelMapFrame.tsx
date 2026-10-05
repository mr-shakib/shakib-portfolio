"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { cn } from "@/lib/utils/cn";

/**
 * Wraps the server-rendered travel map: a cursor tooltip for whichever
 * district (`[data-name]`) is under the pointer, and the fill-in when the map
 * scrolls into view (`data-reveal`, styled in globals.css). Without JS, or
 * under reduced motion, the map is simply shown lit.
 */
export function TravelMapFrame({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const tipRef = useRef<HTMLDivElement>(null);
  const [tip, setTip] = useState<{ name: string; state: string } | null>(null);
  const [tipVisible, setTipVisible] = useState(false);
  const [reveal, setReveal] = useState<"armed" | "play">();
  const reduced = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el || reduced) {
      setReveal(undefined);
      return;
    }
    // Only stage the fill-in while the map is still below the fold.
    if (el.getBoundingClientRect().top < window.innerHeight) return;
    setReveal("armed");
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        setReveal("play");
        io.disconnect();
      },
      { threshold: 0.35 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [reduced]);

  const track = (e: React.PointerEvent) => {
    const district = (e.target as Element).closest<SVGElement>("[data-name]");
    if (!district) {
      setTipVisible(false);
      return;
    }
    const name = district.dataset.name ?? "";
    const state = district.dataset.state ?? "";
    setTip((prev) => (prev?.name === name ? prev : { name, state }));
    setTipVisible(true);
    const box = ref.current!.getBoundingClientRect();
    tipRef.current?.style.setProperty(
      "transform",
      `translate(${e.clientX - box.left}px, ${e.clientY - box.top}px)`,
    );
  };

  return (
    <div
      ref={ref}
      data-reveal={reveal}
      onPointerMove={track}
      onPointerDown={track}
      onPointerLeave={() => setTipVisible(false)}
      className={cn("relative", className)}
    >
      {children}
      <div
        ref={tipRef}
        aria-hidden
        className={cn(
          "pointer-events-none absolute left-0 top-0 z-10 transition-opacity duration-150",
          tipVisible ? "opacity-100" : "opacity-0",
        )}
      >
        <div className="-translate-x-1/2 -translate-y-[calc(100%+14px)] whitespace-nowrap bg-foreground px-3 py-1.5 font-grotesk text-[11px] uppercase tracking-[0.2em] text-background">
          {tip?.name}
          <span className="text-background/55"> · {tip?.state}</span>
        </div>
      </div>
    </div>
  );
}
