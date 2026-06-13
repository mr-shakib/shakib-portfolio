"use client";

import { useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { useUIStore } from "@/store/useUIStore";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { scrollToId } from "@/lib/animations/lenis";

const EASE = [0.16, 1, 0.3, 1] as const;
const INK = "#16170f";
const ROLES = ["Researcher", "Engineer", "AI Builder", "Problem Solver"];

// ── Constellation graph (viewBox 1200×620) — the "AI/research" backdrop ──
const NODES = [
  { x: 120, y: 150 },
  { x: 320, y: 90 },
  { x: 520, y: 210 },
  { x: 700, y: 110 },
  { x: 890, y: 230 },
  { x: 1080, y: 140 },
  { x: 210, y: 380 },
  { x: 430, y: 470 },
  { x: 650, y: 390 },
  { x: 860, y: 490 },
  { x: 1050, y: 380 },
];
const EDGES: [number, number][] = [
  [0, 1], [1, 2], [2, 3], [3, 4], [4, 5],
  [0, 6], [6, 7], [7, 8], [8, 9], [9, 10],
  [2, 7], [3, 8], [4, 9], [1, 6], [5, 10],
];
const ACCENT_NODES = new Set([2, 4, 8]);

/** Giant display word whose characters rise out of individual masks on load. */
function HeroWord({
  text,
  outline,
  animate,
  reduced,
  baseDelay,
  className,
}: {
  text: string;
  outline?: boolean;
  animate: boolean;
  reduced: boolean;
  baseDelay: number;
  className?: string;
}) {
  return (
    <span
      className={`block font-display uppercase leading-[0.82] ${className ?? ""}`}
      style={outline ? { WebkitTextStroke: `2px ${INK}`, color: "transparent" } : { color: INK }}
      aria-hidden
    >
      {text.split("").map((char, i) => (
        <span key={i} className="inline-block overflow-hidden align-bottom">
          <motion.span
            className="inline-block will-change-transform transition-colors duration-300 hover:text-accent"
            initial={reduced ? false : { y: "115%", rotate: 8 }}
            animate={animate || reduced ? { y: "0%", rotate: 0 } : {}}
            transition={{ duration: 1, delay: baseDelay + i * 0.05, ease: EASE }}
          >
            {char}
          </motion.span>
        </span>
      ))}
    </span>
  );
}

/** Vertically-rolling role swapper. */
function RoleRotator({ reduced }: { reduced: boolean }) {
  const [i, setI] = useState(0);
  useEffect(() => {
    if (reduced) return;
    const id = window.setInterval(() => setI((p) => (p + 1) % ROLES.length), 2200);
    return () => window.clearInterval(id);
  }, [reduced]);

  if (reduced) {
    return <span className="text-accent">{ROLES[0]}</span>;
  }

  return (
    <span className="relative inline-grid overflow-hidden align-bottom">
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={i}
          className="col-start-1 row-start-1 whitespace-nowrap text-accent"
          initial={{ y: "110%", opacity: 0 }}
          animate={{ y: "0%", opacity: 1 }}
          exit={{ y: "-110%", opacity: 0 }}
          transition={{ duration: 0.6, ease: EASE }}
        >
          {ROLES[i]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

/** Floating stat pill that bobs and parallaxes. */
function StatChip({
  label,
  sub,
  className,
  delay,
  floatDelay,
  animate,
  reduced,
  px,
  py,
}: {
  label: string;
  sub: string;
  className?: string;
  delay: number;
  floatDelay: number;
  animate: boolean;
  reduced: boolean;
  px: MotionValue<number>;
  py: MotionValue<number>;
}) {
  return (
    <motion.div
      className={`pointer-events-none absolute z-30 hidden md:block ${className ?? ""}`}
      style={reduced ? undefined : { x: px, y: py }}
      initial={reduced ? false : { opacity: 0, scale: 0.8, y: 20 }}
      animate={animate || reduced ? { opacity: 1, scale: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: EASE }}
    >
      <div
        className="animate-float-y rounded-2xl border border-[#16170f]/15 bg-[#f3f0e6]/55 px-4 py-3 shadow-[0_8px_30px_rgba(22,23,15,0.06)] backdrop-blur-sm"
        style={{ animationDelay: `${floatDelay}s` }}
      >
        <p className="flex items-center gap-2 font-grotesk text-[11px] font-bold uppercase tracking-[0.12em] text-[#16170f]">
          <span className="h-1.5 w-1.5 rounded-full bg-accent" />
          {label}
        </p>
        <p className="mt-0.5 pl-3.5 font-grotesk text-[9px] uppercase tracking-[0.18em] text-[#16170f]/55">
          {sub}
        </p>
      </div>
    </motion.div>
  );
}

/**
 * Image-free, animation-heavy landing. The name is the hero: giant kinetic
 * type over a self-drawing neural-constellation graphic, drifting topographic
 * field, morphing blobs and counter-rotating rings. A role-rotator cycles
 * underneath, stat chips float, and every layer responds to the cursor with
 * spring-smoothed parallax before the whole scene peels away on scroll.
 */
export function HomeHero() {
  const loaderComplete = useUIStore((s) => s.loaderComplete);
  const reduced = useReducedMotion();
  const animate = loaderComplete && !reduced;
  const ref = useRef<HTMLElement>(null);

  // ── Mouse parallax ────────────────────────────────────────────────────
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const smx = useSpring(mx, { stiffness: 110, damping: 18, mass: 0.4 });
  const smy = useSpring(my, { stiffness: 110, damping: 18, mass: 0.4 });

  const nameTopX = useTransform(smx, (v) => v * -45);
  const nameBottomX = useTransform(smx, (v) => v * 45);
  const nameY = useTransform(smy, (v) => v * 18);
  const constX = useTransform(smx, (v) => v * 70);
  const constY = useTransform(smy, (v) => v * 70);
  const blobX = useTransform(smx, (v) => v * 60);
  const blobY = useTransform(smy, (v) => v * 60);
  const chipLX = useTransform(smx, (v) => v * -28);
  const chipLY = useTransform(smy, (v) => v * -28);
  const chipRX = useTransform(smx, (v) => v * 28);
  const chipRY = useTransform(smy, (v) => v * 28);

  const handleMouse = (e: React.MouseEvent) => {
    if (reduced) return;
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  };
  const resetMouse = () => {
    mx.set(0);
    my.set(0);
  };

  // ── Scroll exit ───────────────────────────────────────────────────────
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const nameTopScrollX = useTransform(scrollYProgress, [0, 1], ["0%", "-24%"]);
  const nameBottomScrollX = useTransform(scrollYProgress, [0, 1], ["0%", "24%"]);
  const centerScale = useTransform(scrollYProgress, [0, 1], [1, 0.86]);
  const centerOpacity = useTransform(scrollYProgress, [0, 0.85], [1, 0]);
  const furnitureOpacity = useTransform(scrollYProgress, [0, 0.4], [1, 0]);
  const fieldY = useTransform(scrollYProgress, [0, 1], ["0%", "-12%"]);

  return (
    <section
      ref={ref}
      id="hero"
      onMouseMove={handleMouse}
      onMouseLeave={resetMouse}
      className="relative flex min-h-svh flex-col overflow-hidden bg-[#e7e2d4]"
    >
      {/* ── Animated topographic field ─────────────────────────────────── */}
      <motion.div
        aria-hidden
        className="bg-topo-light absolute inset-0 animate-topo-drift"
        style={reduced ? undefined : { y: fieldY }}
      />

      {/* Morphing blobs */}
      <motion.svg
        viewBox="0 0 600 600"
        className="absolute -right-[14%] top-[12%] w-[46vw] min-w-[300px]"
        aria-hidden
        style={reduced ? undefined : { x: blobX, y: blobY }}
        initial={reduced ? false : { opacity: 0, scale: 0.8 }}
        animate={animate || reduced ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 1.6, delay: 0.5, ease: EASE }}
      >
        <path
          className="animate-blob origin-center"
          d="M170 220 C240 90 460 70 530 190 C600 310 540 470 410 520 C280 570 140 520 100 400 C70 310 110 280 170 220 Z"
          fill="#ddd8c6"
        />
      </motion.svg>
      <motion.svg
        viewBox="0 0 400 400"
        className="absolute -left-[10%] bottom-[6%] w-[30vw] min-w-[220px]"
        aria-hidden
        style={reduced ? undefined : { x: blobY, y: blobX }}
        initial={reduced ? false : { opacity: 0, scale: 0.8 }}
        animate={animate || reduced ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 1.6, delay: 0.7, ease: EASE }}
      >
        <path
          className="animate-blob origin-center"
          style={{ animationDelay: "-6s" }}
          d="M120 140 C170 70 300 60 340 140 C380 220 340 320 250 340 C170 360 90 320 80 240 C72 190 90 180 120 140 Z"
          fill="#e1ddce"
        />
      </motion.svg>

      {/* Counter-rotating dashed rings, centered behind the type */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 z-[4] -translate-x-1/2 -translate-y-1/2">
        <motion.span
          aria-hidden
          className="absolute left-1/2 top-1/2 block h-[80vmin] w-[80vmin] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-[#16170f]/10"
          initial={reduced ? false : { opacity: 0 }}
          animate={animate || reduced ? { opacity: 1, rotate: reduced ? 0 : 360 } : {}}
          transition={{
            opacity: { duration: 1.4, delay: 0.6 },
            rotate: { duration: 90, repeat: Infinity, ease: "linear" },
          }}
        />
        <motion.span
          aria-hidden
          className="absolute left-1/2 top-1/2 block h-[55vmin] w-[55vmin] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#16170f]/[0.08]"
          initial={reduced ? false : { opacity: 0 }}
          animate={animate || reduced ? { opacity: 1, rotate: reduced ? 0 : -360 } : {}}
          transition={{
            opacity: { duration: 1.4, delay: 0.7 },
            rotate: { duration: 70, repeat: Infinity, ease: "linear" },
          }}
        />
      </div>

      {/* ── Self-drawing neural constellation ──────────────────────────── */}
      <motion.svg
        viewBox="0 0 1200 620"
        preserveAspectRatio="xMidYMid slice"
        className="absolute left-1/2 top-1/2 z-[5] h-[60vh] w-[120vw] -translate-x-1/2 -translate-y-1/2 md:w-[88vw]"
        aria-hidden
        style={reduced ? undefined : { x: constX, y: constY }}
      >
        {EDGES.map(([a, b], i) => {
          const na = NODES[a];
          const nb = NODES[b];
          if (!na || !nb) return null;
          return (
            <motion.line
              key={`e-${i}`}
              x1={na.x}
              y1={na.y}
              x2={nb.x}
              y2={nb.y}
              stroke={INK}
              strokeOpacity={0.14}
              strokeWidth={1.1}
              initial={reduced ? false : { pathLength: 0, opacity: 0 }}
              animate={animate || reduced ? { pathLength: 1, opacity: 1 } : {}}
              transition={{ duration: 1, delay: 0.6 + i * 0.06, ease: EASE }}
            />
          );
        })}
        {NODES.map((n, i) => {
          const accent = ACCENT_NODES.has(i);
          return (
            <motion.circle
              key={`n-${i}`}
              cx={n.x}
              cy={n.y}
              r={accent ? 6 : 4}
              fill={accent ? "var(--color-accent)" : INK}
              fillOpacity={accent ? 1 : 0.4}
              initial={reduced ? false : { scale: 0, opacity: 0 }}
              animate={
                animate
                  ? { scale: 1, opacity: [0.4, 1, 0.4] }
                  : reduced
                    ? { scale: 1, opacity: 1 }
                    : {}
              }
              transition={{
                scale: { duration: 0.5, delay: 0.8 + i * 0.05, ease: EASE },
                opacity: {
                  duration: 2.4 + (i % 4) * 0.6,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: i * 0.2,
                },
              }}
              style={{ transformBox: "fill-box", transformOrigin: "center" }}
            />
          );
        })}
      </motion.svg>

      {/* Subtitle under the header monogram */}
      <motion.p
        initial={reduced ? false : { opacity: 0, y: -10 }}
        animate={animate || reduced ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, delay: 1.2, ease: EASE }}
        style={reduced ? undefined : { opacity: furnitureOpacity }}
        className="relative z-30 mx-auto mt-[4.5rem] px-gutter text-center font-grotesk text-[10px] uppercase tracking-[0.4em] text-[#16170f]/60 md:mt-24"
      >
        AI Researcher <span className="text-[#16170f]">×</span> Engineer — Portfolio &rsquo;26
      </motion.p>

      {/* ── Center stage: giant kinetic name + role rotator ────────────── */}
      <motion.div
        className="relative z-20 flex flex-1 flex-col items-center justify-center px-gutter text-center"
        style={reduced ? undefined : { scale: centerScale, opacity: centerOpacity, y: nameY }}
      >
        {/* Signature flourish above the name */}
        <motion.span
          initial={reduced ? false : { opacity: 0, clipPath: "inset(0 100% 0 0)" }}
          animate={animate || reduced ? { opacity: 1, clipPath: "inset(0 0% 0 0)" } : {}}
          transition={{ duration: 1.2, delay: 1.6, ease: EASE }}
          className="mb-1 -rotate-6 font-signature text-4xl text-accent md:text-5xl"
          aria-hidden
        >
          Hi, I&rsquo;m
        </motion.span>

        <h1 className="font-display uppercase leading-[0.8]" aria-label="Shakib Howlader">
          <motion.span className="block" style={reduced ? undefined : { x: nameTopScrollX }}>
            <motion.span className="block" style={reduced ? undefined : { x: nameTopX }}>
              <HeroWord
                text="Shakib"
                animate={animate}
                reduced={reduced}
                baseDelay={0.15}
                className="text-[clamp(4rem,18vw,16rem)]"
              />
            </motion.span>
          </motion.span>
          <motion.span className="block" style={reduced ? undefined : { x: nameBottomScrollX }}>
            <motion.span className="block" style={reduced ? undefined : { x: nameBottomX }}>
              <HeroWord
                text="Howlader"
                outline
                animate={animate}
                reduced={reduced}
                baseDelay={0.4}
                className="text-[clamp(3.25rem,15vw,13.5rem)]"
              />
            </motion.span>
          </motion.span>
        </h1>

        {/* Role rotator */}
        <motion.p
          initial={reduced ? false : { opacity: 0, y: 18 }}
          animate={animate || reduced ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 1.1, ease: EASE }}
          className="mt-6 font-display text-2xl uppercase tracking-wide text-[#16170f] md:mt-8 md:text-4xl"
        >
          <span className="text-[#16170f]/50">I&rsquo;m a </span>
          <RoleRotator reduced={reduced} />
        </motion.p>
      </motion.div>

      {/* ── Floating stat chips ────────────────────────────────────────── */}
      <StatChip
        label="Published 2025"
        sub="Elsevier · Data in Brief"
        className="left-[6%] top-[26%]"
        delay={1.5}
        floatDelay={0}
        animate={animate}
        reduced={reduced}
        px={chipLX}
        py={chipLY}
      />
      <StatChip
        label="3.92 CGPA"
        sub="CSE · Daffodil Int’l"
        className="right-[7%] top-[30%]"
        delay={1.65}
        floatDelay={1}
        animate={animate}
        reduced={reduced}
        px={chipRX}
        py={chipRY}
      />
      <StatChip
        label="5+ Projects Shipped"
        sub="Adopted by a campus"
        className="left-[9%] bottom-[20%]"
        delay={1.8}
        floatDelay={1.8}
        animate={animate}
        reduced={reduced}
        px={chipLX}
        py={chipLY}
      />

      {/* ── Bottom-center scroll cue ───────────────────────────────────── */}
      <motion.button
        type="button"
        onClick={() => scrollToId("about")}
        initial={reduced ? false : { opacity: 0 }}
        animate={animate || reduced ? { opacity: 1 } : {}}
        transition={{ duration: 0.8, delay: 2, ease: EASE }}
        style={reduced ? undefined : { opacity: furnitureOpacity }}
        className="group absolute bottom-8 left-1/2 z-30 flex -translate-x-1/2 items-center gap-3 font-grotesk text-[10px] uppercase tracking-[0.3em] text-[#16170f]/70 transition-colors hover:text-[#16170f]"
      >
        Scroll
        <span className="relative inline-flex h-9 w-5 items-start justify-center rounded-full border border-[#16170f]/30 pt-1.5 transition-colors group-hover:border-accent">
          <span className="h-2 w-px animate-bounce bg-[#16170f] group-hover:bg-accent" />
        </span>
      </motion.button>
    </section>
  );
}
