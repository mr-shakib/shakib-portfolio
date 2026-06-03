"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { navLinks, siteConfig } from "@/config/site";
import { cn } from "@/lib/utils/cn";
import { useUIStore } from "@/store/useUIStore";
import { scrollToId } from "@/lib/animations/lenis";
import { MotionToggle } from "./MotionToggle";

export function Navbar() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");
  const toggleMenu = useUIStore((s) => s.toggleMenu);
  const menuOpen = useUIStore((s) => s.menuOpen);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Scroll-spy: track which home section is in view to highlight the nav.
  useEffect(() => {
    if (!isHome) return;
    const ids = navLinks.map((l) => l.section).filter((s): s is NonNullable<typeof s> => Boolean(s));
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActiveSection(visible[0].target.id);
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 },
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [isHome]);

  const handleNav = useCallback(
    (e: React.MouseEvent, link: (typeof navLinks)[number]) => {
      // On the home page, intercept and smooth-scroll to the section.
      if (isHome && link.section) {
        e.preventDefault();
        scrollToId(link.section);
        history.replaceState(null, "", link.section === "hero" ? "/" : `/#${link.section}`);
      }
      // Otherwise let the <Link> navigate to the dedicated page normally.
    },
    [isHome],
  );

  const isActive = (link: (typeof navLinks)[number]) => {
    if (isHome) {
      return link.section ? activeSection === link.section : false;
    }
    return link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
  };

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-colors duration-300",
        scrolled ? "glass" : "bg-transparent",
      )}
    >
      <nav className="container-content flex h-16 items-center justify-between" aria-label="Primary">
        <Link
          href="/"
          onClick={(e) => {
            if (isHome) {
              e.preventDefault();
              scrollToId("hero");
              history.replaceState(null, "", "/");
            }
          }}
          className="font-display text-lg font-semibold tracking-tight text-foreground"
        >
          {siteConfig.shortName}
          <span className="text-accent">.</span>
        </Link>

        <ul className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => {
            const active = isActive(link);
            return (
              <li key={link.href + link.label}>
                <Link
                  href={link.href}
                  onClick={(e) => handleNav(e, link)}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "relative rounded-full px-4 py-2 text-sm transition-colors",
                    active ? "text-foreground" : "text-muted hover:text-foreground",
                  )}
                >
                  {active && (
                    <motion.span
                      layoutId="nav-active"
                      className="absolute inset-0 rounded-full bg-surface-elevated"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">{link.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="flex items-center gap-3">
          <MotionToggle className="hidden sm:inline-flex" />
          <button
            type="button"
            onClick={toggleMenu}
            aria-expanded={menuOpen}
            aria-label="Toggle menu"
            className="flex h-10 w-10 flex-col items-center justify-center gap-1.5 rounded-full border border-border md:hidden"
          >
            <span
              className={cn(
                "h-px w-5 bg-foreground transition-transform",
                menuOpen && "translate-y-[3px] rotate-45",
              )}
            />
            <span
              className={cn(
                "h-px w-5 bg-foreground transition-transform",
                menuOpen && "-translate-y-[3px] -rotate-45",
              )}
            />
          </button>
        </div>
      </nav>
    </motion.header>
  );
}
