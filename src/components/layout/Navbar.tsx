"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { useUIStore } from "@/store/useUIStore";
import { cn } from "@/lib/utils/cn";

/**
 * Minimal header: SH— monogram top-left, a volt Resume pill and the hamburger
 * card top-right. The chrome is scroll-aware — ink-on-cream over the home
 * hero, light-on-dark (glass card) everywhere else, including the menu overlay.
 */
export function Navbar() {
  const toggleMenu = useUIStore((s) => s.toggleMenu);
  const menuOpen = useUIStore((s) => s.menuOpen);
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [pastHero, setPastHero] = useState(false);

  useEffect(() => {
    const onScroll = () => setPastHero(window.scrollY > window.innerHeight * 0.8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // The cream hero is the only light surface the chrome ever sits on.
  const onDark = menuOpen || !isHome || pastHero;

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
      className="fixed inset-x-0 top-0 z-50"
    >
      <nav
        className="relative flex items-center justify-between px-gutter pt-4 md:pt-5"
        aria-label="Primary"
      >
        <Link
          href="/"
          className={cn(
            "font-display text-2xl uppercase leading-none transition-colors duration-300",
            onDark ? "text-foreground hover:text-accent" : "text-ink hover:text-accent-ink",
          )}
        >
          SH<span className={onDark ? "text-accent" : "text-accent-ink"}>—</span>
        </Link>

        <div className="flex items-center gap-2.5">
          <Link
            href="/resume"
            className="hidden h-11 items-center gap-2 rounded-xl bg-accent px-5 font-grotesk text-[11px] font-bold uppercase tracking-[0.18em] text-ink shadow-sm transition-transform duration-300 hover:-translate-y-0.5 hover:scale-[1.03] sm:flex"
          >
            <span aria-hidden>↓</span> Resume
          </Link>
          <button
            type="button"
            onClick={toggleMenu}
            aria-expanded={menuOpen}
            aria-label="Toggle menu"
            className={cn(
              "flex h-11 w-11 flex-col items-center justify-center gap-[5px] rounded-xl transition-all duration-300 hover:scale-[1.06]",
              onDark ? "glass" : "bg-white shadow-sm",
            )}
          >
            <span
              className={cn(
                "h-[2px] w-5 rounded-full transition-all duration-300",
                onDark ? "bg-foreground" : "bg-ink",
                menuOpen ? "translate-y-[3.5px] rotate-45" : "translate-x-[3px]",
              )}
            />
            <span
              className={cn(
                "h-[2px] w-5 rounded-full transition-all duration-300",
                onDark ? "bg-foreground" : "bg-ink",
                menuOpen ? "-translate-y-[3.5px] -rotate-45" : "-translate-x-[3px]",
              )}
            />
          </button>
        </div>
      </nav>
    </motion.header>
  );
}
