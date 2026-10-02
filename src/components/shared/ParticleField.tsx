"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { cn } from "@/lib/utils/cn";

interface ParticleFieldProps {
  className?: string;
  /** Particles per ~100k px² of canvas area (auto-scales to size). */
  density?: number;
  /** Dot + line color (volt by default). */
  color?: string;
  /** Max particles, as a safety clamp on large viewports. */
  max?: number;
}

/** Draw at most this often — the drift is slow enough that 30fps reads as smooth. */
const FRAME_MS = 1000 / 30;
/** Hold still until scrolling has paused this long, leaving each scroll frame to the page. */
const SCROLL_REST_MS = 160;
/** Link opacity is quantized into this many steps, so each step is one stroke. */
const LINK_STEPS = 4;

/**
 * Lightweight 2D-canvas constellation field: volt particles drift, links draw
 * between nearby pairs, and the cloud eases toward the cursor for parallax.
 *
 * Kept cheap because it runs behind every page: 30fps, batched into a handful
 * of draw calls per frame, drawn at 1× pixel density (it's a faint, masked
 * backdrop), paused while the page scrolls and while out of view. Reduced
 * motion renders a single static frame. Self-contained — no global state or WebGL.
 */
export function ParticleField({
  className,
  density = 0.9,
  color = "198, 241, 53",
  max = 90,
}: ParticleFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    const parent = canvas?.parentElement;
    if (!canvas || !parent) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let running = false;
    let w = 0;
    let h = 0;
    let lastDraw = 0;
    let lastScroll = 0;
    const pointer = { x: 0.5, y: 0.5, tx: 0.5, ty: 0.5 };

    type P = { x: number; y: number; vx: number; vy: number; r: number };
    let particles: P[] = [];

    const seed = () => {
      const area = w * h;
      const count = Math.min(max, Math.round((area / 100000) * density * 10));
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.22,
        vy: (Math.random() - 0.5) * 0.22,
        r: Math.random() * 1.6 + 0.6,
      }));
    };

    const resize = () => {
      w = parent.clientWidth;
      h = parent.clientHeight;
      canvas.width = w;
      canvas.height = h;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      seed();
    };

    const LINK = 130;

    // `steps`: how many 60fps frames of motion to advance (0 = static frame).
    const draw = (steps: number) => {
      ctx.clearRect(0, 0, w, h);

      // Ease pointer for smooth parallax push.
      const ease = 1 - Math.pow(1 - 0.06, Math.max(steps, 1));
      pointer.x += (pointer.tx - pointer.x) * ease;
      pointer.y += (pointer.ty - pointer.y) * ease;
      const pushX = (pointer.x - 0.5) * 26;
      const pushY = (pointer.y - 0.5) * 26;

      ctx.beginPath();
      for (const p of particles) {
        p.x += p.vx * steps;
        p.y += p.vy * steps;
        if (p.x < -20) p.x = w + 20;
        else if (p.x > w + 20) p.x = -20;
        if (p.y < -20) p.y = h + 20;
        else if (p.y > h + 20) p.y = -20;
        const dx = p.x + pushX;
        const dy = p.y + pushY;
        ctx.moveTo(dx + p.r, dy);
        ctx.arc(dx, dy, p.r, 0, Math.PI * 2);
      }
      ctx.fillStyle = `rgba(${color}, 0.7)`;
      ctx.fill();

      // Proximity links, one path per opacity step.
      const paths = Array.from({ length: LINK_STEPS }, () => new Path2D());
      for (let i = 0; i < particles.length; i++) {
        const a = particles[i]!;
        for (let j = i + 1; j < particles.length; j++) {
          const b = particles[j]!;
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < LINK * LINK) {
            const step = Math.min(
              LINK_STEPS - 1,
              Math.floor((1 - Math.sqrt(d2) / LINK) * LINK_STEPS),
            );
            paths[step]!.moveTo(a.x + pushX, a.y + pushY);
            paths[step]!.lineTo(b.x + pushX, b.y + pushY);
          }
        }
      }
      ctx.lineWidth = 0.6;
      paths.forEach((path, step) => {
        ctx.strokeStyle = `rgba(${color}, ${(((step + 0.5) / LINK_STEPS) * 0.35).toFixed(3)})`;
        ctx.stroke(path);
      });
    };

    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      const elapsed = now - lastDraw;
      if (elapsed < FRAME_MS || now - lastScroll < SCROLL_REST_MS) return;
      // Advance by elapsed time (capped, so a pause doesn't jump).
      draw(Math.min(elapsed, 100) / (1000 / 60));
      lastDraw = now;
    };

    const start = () => {
      if (running || reduced) return;
      running = true;
      raf = requestAnimationFrame(loop);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    const onScroll = () => {
      lastScroll = performance.now();
    };

    const onPointer = (e: PointerEvent) => {
      const rect = parent.getBoundingClientRect();
      pointer.tx = (e.clientX - rect.left) / rect.width;
      pointer.ty = (e.clientY - rect.top) / rect.height;
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(parent);

    // Only animate while visible.
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) start();
        else stop();
      },
      { threshold: 0 },
    );
    io.observe(parent);

    if (reduced) {
      draw(0); // single static frame
    } else {
      window.addEventListener("pointermove", onPointer, { passive: true });
      window.addEventListener("scroll", onScroll, { passive: true });
    }

    return () => {
      stop();
      ro.disconnect();
      io.disconnect();
      window.removeEventListener("pointermove", onPointer);
      window.removeEventListener("scroll", onScroll);
    };
  }, [reduced, density, color, max]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className={cn("pointer-events-none absolute inset-0 h-full w-full", className)}
    />
  );
}
