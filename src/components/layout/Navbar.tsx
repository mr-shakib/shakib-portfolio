"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useUIStore } from "@/store/useUIStore";
import { cn } from "@/lib/utils/cn";

/**
 * Minimal header: a volt Resume pill and the hamburger menu card, pinned to the
 * top-right. The wordmark/monogram live in the hero and footer instead.
 */
export function Navbar() {
  const toggleMenu = useUIStore((s) => s.toggleMenu);
  const menuOpen = useUIStore((s) => s.menuOpen);

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
      className="fixed inset-x-0 top-0 z-50"
    >
      <nav
        className="relative flex items-start justify-end px-gutter pt-4 md:pt-5"
        aria-label="Primary"
      >
        <div className="flex items-center gap-2.5">
          <Link
            href="/resume"
            className="hidden h-11 items-center gap-2 rounded-xl bg-accent px-5 font-grotesk text-[11px] font-bold uppercase tracking-[0.18em] text-[#16170f] shadow-sm transition-transform duration-300 hover:-translate-y-0.5 hover:scale-[1.03] sm:flex"
          >
            <span aria-hidden>↓</span> Resume
          </Link>
          <button
            type="button"
            onClick={toggleMenu}
            aria-expanded={menuOpen}
            aria-label="Toggle menu"
            className="flex h-11 w-11 flex-col items-center justify-center gap-[5px] rounded-xl bg-white shadow-sm transition-transform duration-300 hover:scale-[1.06]"
          >
            <span
              className={cn(
                "h-[2px] w-5 rounded-full bg-[#16170f] transition-all duration-300",
                menuOpen ? "translate-y-[3.5px] rotate-45" : "translate-x-[3px]",
              )}
            />
            <span
              className={cn(
                "h-[2px] w-5 rounded-full bg-[#16170f] transition-all duration-300",
                menuOpen ? "-translate-y-[3.5px] -rotate-45" : "-translate-x-[3px]",
              )}
            />
          </button>
        </div>
      </nav>
    </motion.header>
  );
}
