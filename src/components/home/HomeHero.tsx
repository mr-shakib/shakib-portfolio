"use client";

import { useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useMotionValueEvent,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { useUIStore } from "@/store/useUIStore";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { scrollToId } from "@/lib/animations/lenis";
import type { SectionContent } from "@/lib/sections/registry";
import { PortraitReveal } from "@/components/shared/PortraitReveal";
import { HeroPour } from "@/components/home/HeroPour";
import { TrailSmear } from "@/components/shared/TrailSmear";
import { createLiquidTrail, type LiquidTrail } from "@/lib/animations/liquidTrail";
import { cn } from "@/lib/utils/cn";

const EASE = [0.16, 1, 0.3, 1] as const;
const VOLT = "#c6f135";
const INK = "#16170f";

/** Pointer offset (-0.5…0.5) → pixels of travel. */
const travel = (px: number) => (v: number) => v * px;
/** Map progress `v` from [a, b] to 0…1, clamped. */
const span = (v: number, a: number, b: number) => Math.min(1, Math.max(0, (v - a) / (b - a)));

/** Vertically-rolling role swapper. */
function RoleRotator({ roles, reduced }: { roles: string[]; reduced: boolean }) {
  const [i, setI] = useState(0);
  useEffect(() => {
    if (reduced || roles.length < 2) return;
    const id = window.setInterval(() => setI((p) => (p + 1) % roles.length), 2200);
    return () => window.clearInterval(id);
  }, [reduced, roles.length]);

  if (reduced || roles.length < 2) return <span>{roles[0]}</span>;

  return (
    <span className="relative inline-grid overflow-hidden align-bottom">
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={i}
          className="col-start-1 row-start-1 whitespace-nowrap"
          initial={{ y: "110%", opacity: 0 }}
          animate={{ y: "0%", opacity: 1 }}
          exit={{ y: "-110%", opacity: 0 }}
          transition={{ duration: 0.6, ease: EASE }}
        >
          {roles[i % roles.length]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

/** Split text into `n` lines of roughly equal word count (quote marks dropped). */
function toLines(text: string, n: number) {
  const words = text.replace(/[“”"]/g, "").trim().split(/\s+/);
  const per = Math.ceil(words.length / n);
  return Array.from({ length: n }, (_, i) => words.slice(i * per, (i + 1) * per).join(" ")).filter(
    Boolean,
  );
}

/** One giant line of the note sliding sideways behind the card. */
function SlidingLine({
  text,
  serif,
  x,
  opacity,
}: {
  text: string;
  serif?: boolean;
  x: MotionValue<string>;
  opacity: MotionValue<number>;
}) {
  return (
    <motion.p
      aria-hidden
      style={{ x, opacity }}
      className={cn(
        "whitespace-nowrap uppercase",
        serif
          ? "font-serif text-[1.18em] leading-[0.95] text-volt"
          : "font-display leading-[0.92] text-[#f5f5f3]",
      )}
    >
      {text}
    </motion.p>
  );
}

/**
 * Opening poster with a pinned scroll sequence, after Lando Norris's.
 *
 * At rest: a white panel in a volt frame holding one huge portrait with the
 * liquid hover reveal (the name lives in the header), plus a "now" card and
 * the rotating role in the corners.
 *
 * On scroll the stage pins and the panel recedes into a card with a slight 3D
 * tilt while the frame darkens to ink; the note's quote slides past in giant
 * mixed type behind it, its label appears above, and the signature draws
 * itself across the card. Then the pin releases. Reduced motion keeps the
 * static poster (the note then plays in its own section instead).
 *
 * On the first load the poster pours in through a volt pool (HeroPour)
 * while the portrait rises through it; client navigations back skip that.
 */
export function HomeHero({
  content,
  note,
}: {
  content: SectionContent<"hero">;
  note: SectionContent<"about">;
}) {
  const reduced = useReducedMotion();
  const sequence = !reduced;

  // ── First-load pour ───────────────────────────────────────────────────
  const setIntroPlayed = useUIStore((s) => s.setIntroPlayed);
  const [pouring, setPouring] = useState(() => !useUIStore.getState().introPlayed);
  // Fixed at mount: the portrait waits for the first drop to open.
  const [lead] = useState(() => (pouring ? 0.3 : 0));
  useEffect(() => setIntroPlayed(true), [setIntroPlayed]);

  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  // ── Liquid trail over the whole panel ───────────────────────────────
  const [trail, setTrail] = useState<LiquidTrail | null>(null);
  useEffect(() => {
    if (reduced || !panelRef.current) return;
    const t = createLiquidTrail(panelRef.current);
    setTrail(t);
    return () => {
      t.destroy();
      setTrail(null);
    };
  }, [reduced]);

  // ── Mouse parallax (subtle — the portrait is the whole stage) ─────────
  const mx = useMotionValue(0);
  const smx = useSpring(mx, { stiffness: 110, damping: 18, mass: 0.4 });
  const portraitX = useTransform(smx, travel(16));
  const handleMouse = (e: React.MouseEvent) => {
    if (reduced) return;
    const r = sectionRef.current?.getBoundingClientRect();
    if (!r) return;
    mx.set((e.clientX - r.left) / r.width - 0.5);
  };

  // ── The card the panel recedes into, sized from the viewport ─────────
  const geometry = useRef({ scale: 0.45, cardHalfH: 180, cardW: 600, centerY: 400, sigW: 720 });
  const [layout, setLayout] = useState(geometry.current);
  useEffect(() => {
    const update = () => {
      const panel = panelRef.current;
      if (!panel) return;
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const target = Math.min(640, vw * (vw < 768 ? 0.55 : 0.44));
      const scale = Math.min(0.85, Math.max(0.34, target / panel.offsetWidth));
      // The frame scales about the stage centre; the panel sits 20px above it.
      const g = {
        scale,
        cardHalfH: (panel.offsetHeight * scale) / 2,
        cardW: panel.offsetWidth * scale,
        centerY: vh / 2 - 20 * scale,
        // The signature overhangs the card, but never the viewport.
        sigW: Math.min(panel.offsetWidth * scale * 1.25, vw * 0.92),
      };
      geometry.current = g;
      setLayout(g);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  // ── Scroll sequence (progress 0 → 1 across the pinned distance) ───────
  const { scrollYProgress: p } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });
  const frameScale = useTransform(
    p,
    (v) => 1 - (1 - geometry.current.scale) * easeInOut(span(v, 0, 0.45)),
  );
  const frameTilt = useTransform(p, [0, 0.22, 0.45], [0, 9, 0]);
  const stageBg = useTransform(p, [0.02, 0.24], [VOLT, INK]);
  const furniture = useTransform(p, [0, 0.1], [1, 0]);
  const portraitZoom = useTransform(p, [0, 0.7], [1, 1.1]);
  const linesOpacity = useTransform(p, [0.12, 0.3], [0, 1]);
  const lineX0 = useTransform(p, [0.1, 1], ["14vw", "-36vw"]);
  const lineX1 = useTransform(p, [0.1, 1], ["-40vw", "10vw"]);
  const lineX2 = useTransform(p, [0.1, 1], ["20vw", "-30vw"]);
  const labelOpacity = useTransform(p, [0.36, 0.46], [0, 1]);
  const labelY = useTransform(p, [0.36, 0.46], [12, 0]);
  const sigOpacity = useTransform(p, [0.44, 0.5], [0, 1]);
  const sigClip = useTransform(
    p,
    (v) => `inset(-10% ${(100 * (1 - span(v, 0.46, 0.82))).toFixed(2)}% -10% 0)`,
  );

  // The header reads the stage: volt frame at rest, ink once it darkens.
  // Scrolling cuts the pour short — the pool can't follow the receding card.
  useMotionValueEvent(p, "change", (v) => {
    stageRef.current?.setAttribute("data-nav", v < 0.12 ? "volt" : "dark");
    if (v > 0.01) setPouring(false);
  });

  const name = `${content.firstName} ${content.lastName}`;
  const card = content.card;
  const lines = toLines(note.quote, 3);
  const lineXs = [lineX0, lineX1, lineX2];
  const fadeIn = (delay: number) => ({
    initial: reduced ? false : ({ opacity: 0, y: 14 } as const),
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8, delay: delay + lead, ease: EASE },
  });

  const poster = (
    <div className="relative">
      <div
        ref={panelRef}
        data-nav="light"
        className="relative min-h-[calc(100svh-3.5rem)] overflow-hidden rounded-[1.75rem] bg-cream md:min-h-[calc(100svh-4.5rem)] md:rounded-[2.5rem]"
      >
        {/* The name is the header wordmark; this keeps it the page's h1. */}
        <h1 className="sr-only">{name}</h1>

        {/* Drifting topographic lines — the only texture. */}
        <motion.div
          aria-hidden
          className="bg-topo-light absolute inset-0 animate-topo-drift"
          style={sequence ? { opacity: furniture } : undefined}
        />

        {/* The cursor's liquid trail over the background (below the portrait). */}
        <TrailSmear trail={trail} />

        {/* ── The portrait: from under the header, off the panel's foot ── */}
        {content.portrait && (
          <motion.div
            className="absolute inset-x-0 bottom-0 top-[4.75rem] mx-auto w-[min(100%,34rem)] md:top-[5.25rem] md:w-[min(82%,46rem)] lg:w-[min(60%,56rem)]"
            initial={reduced ? false : { opacity: 0, y: 70 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.3, delay: 0.25 + lead, ease: EASE }}
            style={
              sequence
                ? { x: portraitX, scale: portraitZoom, transformOrigin: "50% 30%" }
                : undefined
            }
          >
            <PortraitReveal
              src={content.portrait}
              revealSrc={content.portraitReveal}
              alt={name}
              priority
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 46rem, 56rem"
              hint={!reduced}
              trail={trail}
              fade="sides"
              className="absolute inset-0"
            />
          </motion.div>
        )}

        {/* Role — bottom-right corner, wide screens only (it would sit on the shoulders below 1280px). */}
        <motion.div
          style={sequence ? { opacity: furniture } : undefined}
          className="absolute bottom-10 right-10 z-20 hidden xl:block"
        >
          <motion.p
            {...fadeIn(1.1)}
            className="text-right font-display text-[1.9rem] uppercase leading-none text-ink"
          >
            {content.rolePrefix && (
              <span className="mb-1.5 block font-grotesk text-[10px] tracking-[0.35em] text-ink/55">
                {content.rolePrefix}
              </span>
            )}
            <RoleRotator roles={content.roles} reduced={reduced} />
          </motion.p>
        </motion.div>

        {/* "Now" card — bottom-left corner, wide screens only. */}
        {card.title && (
          <motion.div
            style={sequence ? { opacity: furniture } : undefined}
            className="absolute bottom-10 left-10 z-20 hidden xl:block"
          >
            <motion.div
              {...fadeIn(1.3)}
              className="w-60 rounded-2xl border border-ink/15 bg-cream-raised/70 p-4 backdrop-blur-sm"
            >
              {card.label && (
                <p className="flex items-center gap-2 font-grotesk text-[9px] font-bold uppercase tracking-[0.3em] text-ink/60">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-volt opacity-60" />
                    <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-volt ring-1 ring-ink/50" />
                  </span>
                  {card.label}
                </p>
              )}
              <p className="mt-3 font-display text-[1.6rem] uppercase leading-none text-ink">
                {card.title}
              </p>
              {card.sub && (
                <p className="mt-2 font-grotesk text-[10px] uppercase tracking-[0.18em] text-ink/60">
                  {card.sub}
                </p>
              )}
            </motion.div>
          </motion.div>
        )}
      </div>

      {/* ── Notched tab hanging into the frame — the scroll cue ──────── */}
      <motion.div
        style={sequence ? { opacity: furniture } : undefined}
        className="absolute left-1/2 top-full z-20 -mt-px h-10 w-[220px] -translate-x-1/2 md:h-11 md:w-[300px]"
      >
        <svg
          aria-hidden
          viewBox="0 0 360 44"
          preserveAspectRatio="none"
          className="absolute inset-0 h-full w-full text-cream"
        >
          <path d="M0 0 C46 0 56 44 104 44 L256 44 C304 44 314 0 360 0 Z" fill="currentColor" />
        </svg>
        <motion.button
          type="button"
          onClick={() => scrollToId("about")}
          initial={reduced ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 2 + lead, ease: EASE }}
          className="group relative flex h-full w-full items-center justify-center gap-2.5 pt-0.5 font-grotesk text-[10px] uppercase tracking-[0.3em] text-ink/70 transition-colors hover:text-ink"
        >
          Scroll
          <span className="relative inline-flex h-5 w-3 items-start justify-center rounded-full border border-ink/30 pt-1 transition-colors group-hover:border-ink">
            <span className="h-1.5 w-px animate-bounce bg-ink" />
          </span>
        </motion.button>
      </motion.div>
    </div>
  );

  // Reduced motion: the static poster in its volt frame.
  if (!sequence) {
    return (
      <section
        ref={sectionRef}
        id="hero"
        data-nav="volt"
        className="relative bg-volt px-2 pb-12 pt-2 sm:px-3 sm:pt-3 md:px-4 md:pb-14 md:pt-4"
      >
        {poster}
      </section>
    );
  }

  return (
    <section
      ref={sectionRef}
      id="hero"
      onMouseMove={handleMouse}
      onMouseLeave={() => mx.set(0)}
      className="relative h-[240vh]"
    >
      <div
        ref={stageRef}
        data-nav="volt"
        className="sticky top-0 h-svh overflow-hidden [perspective:1400px]"
      >
        {/* Stage colour: the volt frame darkening to ink as the card recedes. */}
        <motion.div aria-hidden className="absolute inset-0" style={{ backgroundColor: stageBg }} />

        {/* The note, in giant mixed type, sliding past behind the card (spread above/behind/below it on phones). */}
        <div className="absolute inset-0 flex flex-col items-center justify-between pb-[7svh] pt-[10svh] md:justify-center md:gap-[1.5vw] md:py-0 text-[clamp(3.25rem,9vw,9rem)]">
          {lines.map((line, i) => (
            <SlidingLine
              key={i}
              text={line}
              serif={i === 1}
              x={lineXs[i]!}
              opacity={linesOpacity}
            />
          ))}
        </div>

        {/* The poster, receding into a card with a slight 3D tilt. */}
        <motion.div
          className="absolute inset-0 z-10 px-2 pb-12 pt-2 sm:px-3 sm:pt-3 md:px-4 md:pb-14 md:pt-4"
          style={{ scale: frameScale, rotateX: frameTilt, transformOrigin: "50% 50%" }}
        >
          {poster}
        </motion.div>

        {/* First load: the volt pool the poster pours in through. */}
        {pouring && <HeroPour onDone={() => setPouring(false)} />}

        {/* Label above the card. */}
        <motion.p
          style={{ opacity: labelOpacity, y: labelY, top: layout.centerY - layout.cardHalfH - 44 }}
          className="pointer-events-none absolute inset-x-0 z-20 text-center font-grotesk text-[10px] uppercase tracking-[0.35em] text-volt"
        >
          {note.eyebrow}
        </motion.p>

        {/* The signature, drawing itself across the card. */}
        <motion.div
          aria-hidden
          style={{
            opacity: sigOpacity,
            clipPath: sigClip,
            top: layout.centerY,
            width: layout.sigW,
          }}
          className="pointer-events-none absolute left-1/2 z-30 -translate-x-1/2 -translate-y-1/2 -rotate-6"
        >
          {note.signatureImage ? (
            // eslint-disable-next-line @next/next/no-img-element -- plain img keeps the clip-path draw crisp
            <img
              src={note.signatureImage}
              alt=""
              className="h-auto w-full drop-shadow-[0_4px_24px_rgba(0,0,0,0.35)]"
            />
          ) : (
            <span className="block text-center font-signature text-[clamp(4rem,10vw,9rem)] leading-none text-volt">
              {note.signature}
            </span>
          )}
        </motion.div>
      </div>
    </section>
  );
}

/** Smooth in-out curve for the recede, so it starts and settles gently. */
function easeInOut(t: number) {
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
}
