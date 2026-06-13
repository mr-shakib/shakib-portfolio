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

/**
 * Lightweight 2D-canvas constellation field: volt particles drift, links draw
 * between nearby pairs, and the cloud eases toward the cursor for parallax.
 * DPR-aware, pauses when scrolled out of view, and renders a single static
 * frame under reduced motion. Self-contained — no global state or WebGL.
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
    let dpr = 1;
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
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = parent.clientWidth;
      h = parent.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      seed();
    };

    const LINK = 130;

    const draw = (animateMotion: boolean) => {
      ctx.clearRect(0, 0, w, h);

      // Ease pointer for smooth parallax push.
      pointer.x += (pointer.tx - pointer.x) * 0.06;
      pointer.y += (pointer.ty - pointer.y) * 0.06;
      const pushX = (pointer.x - 0.5) * 26;
      const pushY = (pointer.y - 0.5) * 26;

      for (const p of particles) {
        if (animateMotion) {
          p.x += p.vx;
          p.y += p.vy;
          if (p.x < -20) p.x = w + 20;
          else if (p.x > w + 20) p.x = -20;
          if (p.y < -20) p.y = h + 20;
          else if (p.y > h + 20) p.y = -20;
        }
        const dx = p.x + pushX;
        const dy = p.y + pushY;
        ctx.beginPath();
        ctx.arc(dx, dy, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${color}, 0.7)`;
        ctx.fill();
      }

      // Proximity links.
      for (let i = 0; i < particles.length; i++) {
        const a = particles[i]!;
        for (let j = i + 1; j < particles.length; j++) {
          const b = particles[j]!;
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.hypot(dx, dy);
          if (dist < LINK) {
            const o = (1 - dist / LINK) * 0.35;
            ctx.beginPath();
            ctx.moveTo(a.x + pushX, a.y + pushY);
            ctx.lineTo(b.x + pushX, b.y + pushY);
            ctx.strokeStyle = `rgba(${color}, ${o})`;
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }
      }
    };

    const loop = () => {
      draw(true);
      raf = requestAnimationFrame(loop);
    };

    const start = () => {
      if (running || reduced) return;
      running = true;
      loop();
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
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
      draw(false); // single static frame
    } else {
      window.addEventListener("pointermove", onPointer, { passive: true });
    }

    return () => {
      stop();
      ro.disconnect();
      io.disconnect();
      window.removeEventListener("pointermove", onPointer);
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
