"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { gsap, registerGsap } from "@/lib/animations/gsap";
import { useUIStore } from "@/store/useUIStore";
import { useReducedMotion } from "@/hooks/useReducedMotion";

// Stepped "real loading" progress — each step rolls the odometer and decodes a status line.
const STEPS = [
  { value: 12, label: "Loading weights" },
  { value: 37, label: "Indexing research" },
  { value: 58, label: "Compiling projects" },
  { value: 84, label: "Fine-tuning" },
  { value: 100, label: "Ready" },
];
// Seconds per progress step (roll) and the pause between steps.
const STEP = 0.32;
const HOLD = 0.06;
const COLS = 5;
// Each odometer column holds 0–9 twice so a digit can always roll forward (8 → 4 wraps via 14).
const REEL = Array.from({ length: 20 }, (_, i) => i % 10);
const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789/#_<>";

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * Split the name into masked characters so each one can rise out of its own
 * slot. Words stack on phones and share a line from `sm` up.
 */
function NameChars({ name, layer }: { name: string; layer: "outline" | "fill" }) {
  return name.split(" ").map((word, w) => (
    <span key={w} className="block sm:inline">
      {w > 0 && <span className="hidden sm:inline-block sm:w-[0.27em]" />}
      {word.split("").map((char, i) => (
        <span key={i} className="inline-block overflow-hidden align-bottom">
          <span data-ldr={`char-${layer}`} className="inline-block">
            {char}
          </span>
        </span>
      ))}
    </span>
  ));
}

/**
 * Cinematic startup sequence. The name sits as a hollow outline and fills
 * left-to-right behind a volt scanline as progress steps through a rolling
 * odometer and a decoding status line. The exit splits the screen into
 * columns: dark panels lift to expose volt panels, which lift to reveal the
 * cream hero — the same dark → volt → cream order the page itself scrolls
 * through. Plays once per session, on the home page only; reduced motion
 * skips straight to content.
 */
export function Loader({ name }: { name: string }) {
  const setLoaderComplete = useUIStore((s) => s.setLoaderComplete);
  const reduced = useReducedMotion();
  const isHome = usePathname() === "/";
  const rootRef = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLDivElement>(null);
  const scanRef = useRef<HTMLDivElement>(null);
  const statusRef = useRef<HTMLSpanElement>(null);
  const stepRef = useRef<HTMLSpanElement>(null);
  const reelRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    if (!isHome) return;
    // Only show on first load of the session.
    const seen = sessionStorage.getItem("loader-seen");
    if (reduced || seen) {
      setLoaderComplete(true);
      setHidden(true);
      return;
    }

    registerGsap();
    let fallback = 0;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ paused: true, onComplete: () => setHidden(true) });

      const progress = { value: 0 };
      const renderProgress = () => {
        const p = progress.value;
        gsap.set(fillRef.current, { clipPath: `inset(-20% ${100 - p}% -20% 0)` });
        gsap.set(scanRef.current, { xPercent: p });
      };

      // Decode `text` into the status line, left to right, from random glyphs.
      const scramble = (text: string) => {
        const proxy = { p: 0 };
        return gsap.to(proxy, {
          p: 1,
          duration: STEP + HOLD,
          ease: "none",
          onUpdate: () => {
            const shown = Math.floor(proxy.p * text.length);
            let out = text.slice(0, shown);
            for (let i = shown; i < text.length; i++) {
              out += text[i] === " " ? " " : GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
            }
            if (statusRef.current) statusRef.current.textContent = out;
          },
        });
      };

      // ── Intro ──────────────────────────────────────────────────────────
      tl.set("[data-ldr=stage]", { autoAlpha: 1 })
        .fromTo(
          "[data-ldr=hair]",
          { scaleY: 0 },
          { scaleY: 1, duration: 0.9, ease: "expo.inOut", stagger: 0.05 },
          0,
        )
        .fromTo(
          "[data-ldr=meta]",
          { autoAlpha: 0, y: 12 },
          { autoAlpha: 1, y: 0, duration: 0.6, ease: "expo.out", stagger: 0.06 },
          0.1,
        );
      // Both name layers rise in lockstep so the fill stays registered to the outline.
      (["outline", "fill"] as const).forEach((layer) => {
        tl.fromTo(
          `[data-ldr=char-${layer}]`,
          { yPercent: 115, rotate: 6 },
          { yPercent: 0, rotate: 0, duration: 0.8, ease: "expo.out", stagger: 0.03 },
          0.15,
        );
      });

      // ── Progress steps ─────────────────────────────────────────────────
      const reelIdx = [0, 0, 0];
      STEPS.forEach((step, i) => {
        const at = 0.35 + i * (STEP + HOLD);

        tl.to(progress, { value: step.value, duration: STEP, ease: "expo.out", onUpdate: renderProgress }, at)
          .add(scramble(step.label), at)
          .call(() => {
            if (stepRef.current) stepRef.current.textContent = pad(i + 1);
          }, undefined, at);

        // Odometer: roll each column forward to its next digit.
        String(step.value)
          .padStart(3, "0")
          .split("")
          .forEach((d, c) => {
            const reel = reelRefs.current[c];
            if (!reel) return;
            let from = reelIdx[c] ?? 0;
            // Silently rewind a wrapped reel to the identical digit in the first lap.
            if (from >= 10) {
              from -= 10;
              tl.set(reel, { yPercent: -from * 5 }, at - 0.01);
            }
            const to = Number(d) >= from ? Number(d) : Number(d) + 10;
            reelIdx[c] = to;
            if (to !== from) {
              tl.to(reel, { yPercent: -to * 5, duration: STEP + 0.1, ease: "expo.out" }, at);
            }
          });
      });

      const done = 0.35 + STEPS.length * (STEP + HOLD);
      tl.to(scanRef.current, { autoAlpha: 0, duration: 0.3 }, done)
        .to("[data-ldr=dot]", { scale: 2.2, autoAlpha: 0, duration: 0.5, ease: "expo.out" }, done);

      // ── Exit: name drops out, then the column split ─────────────────────
      const exit = done + 0.15;
      (["outline", "fill"] as const).forEach((layer) => {
        tl.to(
          `[data-ldr=char-${layer}]`,
          { yPercent: -115, duration: 0.45, ease: "expo.in", stagger: 0.015 },
          exit,
        );
      });
      tl.to("[data-ldr=meta]", { autoAlpha: 0, y: -12, duration: 0.35, ease: "power2.in" }, exit + 0.05)
        .set("[data-ldr=base]", { autoAlpha: 0 }, exit + 0.5)
        // Release the hero as the panels start lifting so its entrance plays through the wipe.
        .call(
          () => {
            sessionStorage.setItem("loader-seen", "1");
            setLoaderComplete(true);
          },
          undefined,
          exit + 0.5,
        )
        .to("[data-ldr=col]", { yPercent: -100, duration: 0.8, ease: "expo.inOut", stagger: 0.06 }, exit + 0.5)
        .to("[data-ldr=volt]", { yPercent: -100, duration: 0.8, ease: "expo.inOut", stagger: 0.06 }, exit + 0.62);

      // Hold the sequence until the display face is ready so the name never swaps mid-reveal.
      let started = false;
      const start = () => {
        if (started) return;
        started = true;
        tl.play();
      };
      document.fonts?.ready.then(start, start);
      fallback = window.setTimeout(start, 800);
    }, rootRef);

    return () => {
      window.clearTimeout(fallback);
      ctx.revert();
    };
  }, [isHome, reduced, setLoaderComplete]);

  if (hidden || !isHome) return null;

  const cols = Array.from({ length: COLS }, (_, i) => i);

  return (
    <div ref={rootRef} role="status" className="fixed inset-0 z-[90] overflow-hidden">
      <span className="sr-only">Loading portfolio</span>

      {/* Solid base hides sub-pixel seams between columns until the exit. */}
      <div aria-hidden data-ldr="base" className="absolute inset-0 bg-background" />

      {/* Volt panels — revealed when the dark panels lift. */}
      <div aria-hidden className="absolute inset-0 flex">
        {cols.map((i) => (
          <div key={i} data-ldr="volt" className="h-full flex-1 bg-accent" />
        ))}
      </div>

      {/* Dark panels, with hairlines that foreshadow where the screen splits. */}
      <div aria-hidden className="absolute inset-0 flex">
        {cols.map((i) => (
          <div key={i} data-ldr="col" className="relative h-full flex-1 bg-background">
            {i < COLS - 1 && (
              <span
                data-ldr="hair"
                className="absolute right-0 top-0 h-full w-px origin-top scale-y-0 bg-white/[0.06]"
              />
            )}
          </div>
        ))}
      </div>

      {/* Stage — hidden until fonts are ready and the timeline starts. */}
      <div aria-hidden data-ldr="stage" className="invisible absolute inset-0 flex flex-col">
        {/* Top row — monogram sits exactly where the navbar's does, so it "stays" through the wipe. */}
        <div className="mt-4 flex h-11 items-center justify-between px-gutter md:mt-5">
          <span data-ldr="meta" className="font-display text-2xl uppercase leading-none text-foreground">
            SH<span className="text-accent">—</span>
          </span>
          <span
            data-ldr="meta"
            className="text-right font-grotesk text-[10px] uppercase leading-relaxed tracking-[0.3em] text-muted"
          >
            Dhaka, BD
            <span className="hidden sm:inline"> — 23.81°N 90.41°E</span>
          </span>
        </div>

        {/* Center — hollow name that fills behind a volt scanline. */}
        <div className="flex flex-1 items-center justify-center px-gutter">
          <div className="relative grid font-display text-[clamp(3.5rem,21vw,10rem)] sm:text-[clamp(2.25rem,10.5vw,10rem)] uppercase leading-[0.85]">
            <div
              className="col-start-1 row-start-1 whitespace-nowrap text-transparent"
              style={{ WebkitTextStroke: "1px rgb(245 245 243 / 0.28)" }}
            >
              <NameChars name={name} layer="outline" />
            </div>
            <div
              ref={fillRef}
              className="col-start-1 row-start-1 whitespace-nowrap text-foreground"
              style={{ clipPath: "inset(-20% 100% -20% 0)" }}
            >
              <NameChars name={name} layer="fill" />
            </div>
            <div ref={scanRef} className="pointer-events-none absolute -inset-y-[12%] inset-x-0">
              <span className="absolute inset-y-0 left-0 w-0.5 -translate-x-1/2 bg-accent shadow-[0_0_24px_4px_rgba(198,241,53,0.45)]" />
            </div>
          </div>
        </div>

        {/* Bottom row — decoding status line and a rolling odometer. */}
        <div className="flex items-end justify-between gap-6 px-gutter pb-6 md:pb-8">
          <div data-ldr="meta" className="pb-2 font-grotesk text-[10px] uppercase tracking-[0.3em] text-muted md:pb-4">
            <p className="flex items-center gap-2.5 text-foreground">
              <span className="relative flex h-1.5 w-1.5">
                <span data-ldr="dot" className="absolute inset-0 rounded-full bg-accent" />
                <span className="h-1.5 w-1.5 rounded-full bg-accent" />
              </span>
              <span ref={statusRef}>Initializing</span>
            </p>
            <p className="mt-2 pl-4">
              <span ref={stepRef}>00</span> / {pad(STEPS.length)} — Portfolio &rsquo;26
            </p>
          </div>

          <p
            data-ldr="meta"
            className="flex items-start font-display text-[clamp(4rem,13vw,11rem)] uppercase leading-none text-foreground"
          >
            <span className="flex h-[1em] overflow-hidden">
              {[0, 1, 2].map((c) => (
                <span
                  key={c}
                  ref={(el) => {
                    reelRefs.current[c] = el;
                  }}
                  className="flex flex-col self-start"
                >
                  {REEL.map((d, i) => (
                    <span key={i} className="block h-[1em] shrink-0 text-center">
                      {d}
                    </span>
                  ))}
                </span>
              ))}
            </span>
            <span className="ml-1 text-[0.35em] leading-none text-accent">%</span>
          </p>
        </div>
      </div>
    </div>
  );
}
