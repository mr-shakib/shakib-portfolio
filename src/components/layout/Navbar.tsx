"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { useUIStore } from "@/store/useUIStore";
import { HoverRoll } from "@/components/shared/HoverRoll";
import { cn } from "@/lib/utils/cn";

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * Surfaces declare what's behind the header: `data-nav="light"|"volt"|"dark"`,
 * or a `data-theme`. The nearest one to the point under the wordmark wins, so a
 * dark panel inside a volt field reads as dark.
 */
const SURFACE = "[data-nav], [data-theme]";

type Tone = "dark" | "light" | "volt";

function toneUnder(): Tone {
  const under = document.elementsFromPoint(80, 36).find((el) => !el.closest("header"));
  const surface = under?.closest<HTMLElement>(SURFACE);
  const nav = surface?.dataset.nav;
  if (nav === "light" || nav === "volt" || nav === "dark") return nav;
  return surface?.dataset.theme === "cream" ? "light" : "dark";
}

/** Below this, the header always shows; past it, scrolling down tucks it away. */
const REVEAL_ZONE = 120;
/** Ignore scroll jitter smaller than this when deciding direction. */
const SCROLL_SLOP = 6;
/** Minimum gap between surface checks while scrolling. */
const TONE_MS = 100;

/**
 * Header: a two-line wordmark (Anton over the accent serif, echoing the
 * section headings), the Resume pill and one outlined menu square. Colors
 * follow the surface underneath — ink over light and volt surfaces, light over
 * dark ones, with the pill inverting over volt so it never disappears. It
 * tucks away while scrolling down and returns on any scroll up, so it never
 * sits on top of what you're reading.
 */
export function Navbar({ firstName, lastName }: { firstName: string; lastName: string }) {
  const toggleMenu = useUIStore((s) => s.toggleMenu);
  const menuOpen = useUIStore((s) => s.menuOpen);
  const pathname = usePathname();
  const [surfaceTone, setSurfaceTone] = useState<Tone>("dark");
  const [hidden, setHidden] = useState(false);
  const lastY = useRef(0);

  useEffect(() => {
    let frame = 0;
    let lastTone = 0;
    let toneTimer = 0;
    const checkTone = () => {
      lastTone = performance.now();
      setSurfaceTone(toneUnder());
    };
    const update = () => {
      frame = 0;
      // Hit-testing is the costly part, and a color change doesn't need every
      // frame: check ~10×/s while scrolling, plus once after it stops.
      const since = performance.now() - lastTone;
      if (since >= TONE_MS) checkTone();
      else if (!toneTimer)
        toneTimer = window.setTimeout(() => {
          toneTimer = 0;
          checkTone();
        }, TONE_MS - since);

      const y = window.scrollY;
      if (y < REVEAL_ZONE) setHidden(false);
      else if (y > lastY.current + SCROLL_SLOP) setHidden(true);
      else if (y < lastY.current - SCROLL_SLOP) setHidden(false);
      if (Math.abs(y - lastY.current) > SCROLL_SLOP) lastY.current = y;
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    lastY.current = window.scrollY;
    update();
    setHidden(false);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    // Surfaces also change without scrolling (the hero's pour, route
    // changes, sections revealing), so re-check on a slow interval too.
    const poll = window.setInterval(onScroll, 400);
    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(toneTimer);
      window.clearInterval(poll);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [pathname]);

  const tone: Tone = menuOpen ? "dark" : surfaceTone;
  const ink = tone !== "dark";

  return (
    <motion.header
      className="fixed inset-x-0 top-0 z-50"
      animate={{ y: hidden && !menuOpen ? "-110%" : "0%" }}
      transition={{ duration: 0.45, ease: EASE }}
      onFocusCapture={() => setHidden(false)}
    >
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2, ease: EASE }}
        className="relative flex items-center justify-between px-gutter pt-4 md:pt-5"
        aria-label="Primary"
      >
        <Link
          href="/"
          aria-label={`${firstName} ${lastName} — home`}
          className={cn(
            "group flex flex-col uppercase leading-[0.84] transition-colors duration-300",
            ink ? "text-ink" : "text-foreground",
          )}
        >
          <span className="font-display text-[1.15rem] tracking-[0.01em] md:text-[1.4rem]">
            {firstName}
          </span>
          <span
            className={cn(
              "font-serif text-[1.2rem] transition-colors duration-300 md:text-[1.45rem]",
              tone === "dark" ? "text-volt" : "text-ink",
            )}
          >
            {lastName}
          </span>
        </Link>

        <div className="flex items-center gap-2.5">
          {/* Inverts on hover: the opposite color sweeps up from below while
              the label rolls over to match; the border, in the resting color,
              stays as an outline so the pill keeps its shape on any surface. */}
          <Link
            href="/resume"
            className={cn(
              "btn-sweep group hidden h-11 items-center rounded-xl border px-5 font-grotesk text-[11px] font-bold uppercase tracking-[0.18em] transition-colors duration-300 focus-visible:outline-none sm:flex",
              tone === "volt"
                ? "border-ink bg-ink text-volt [--sweep:rgb(198_241_53)]"
                : "border-volt bg-volt text-ink [--sweep:rgb(22_23_15)]",
            )}
          >
            <HoverRoll incomingClassName={tone === "volt" ? "text-ink" : "text-volt"}>
              Resume
            </HoverRoll>
          </Link>
          <button
            type="button"
            onClick={toggleMenu}
            aria-expanded={menuOpen}
            aria-label="Toggle menu"
            className={cn(
              "flex h-11 w-11 flex-col items-center justify-center gap-[5px] rounded-xl border transition-colors duration-300",
              ink
                ? "border-ink/30 hover:border-ink"
                : "border-foreground/25 hover:border-foreground/70",
            )}
          >
            <span
              className={cn(
                "h-[2px] w-5 rounded-full transition-all duration-300",
                ink ? "bg-ink" : "bg-foreground",
                menuOpen ? "translate-y-[3.5px] rotate-45" : "translate-x-[3px]",
              )}
            />
            <span
              className={cn(
                "h-[2px] w-5 rounded-full transition-all duration-300",
                ink ? "bg-ink" : "bg-foreground",
                menuOpen ? "-translate-y-[3.5px] -rotate-45" : "-translate-x-[3px]",
              )}
            />
          </button>
        </div>
      </motion.nav>
    </motion.header>
  );
}
