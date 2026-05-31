import Link from "next/link";
import { navLinks, socialLinks, siteConfig } from "@/config/site";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="relative border-t border-border bg-surface">
      <div className="container-content grid gap-12 py-16 md:grid-cols-[2fr_1fr_1fr]">
        <div className="flex flex-col gap-4">
          <Link href="/" className="font-display text-2xl font-semibold">
            {siteConfig.name}
            <span className="text-accent">.</span>
          </Link>
          <p className="max-w-sm text-sm leading-relaxed text-muted">{siteConfig.description}</p>
        </div>

        <nav aria-label="Footer" className="flex flex-col gap-3">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted">Explore</h2>
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-muted transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex flex-col gap-3">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted">Connect</h2>
          {socialLinks.map((s) => (
            <a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-muted transition-colors hover:text-accent"
            >
              {s.label}
            </a>
          ))}
        </div>
      </div>

      <div className="container-content flex flex-col items-center justify-between gap-2 border-t border-border py-6 text-xs text-muted sm:flex-row">
        <p>
          © {year} {siteConfig.name}. All rights reserved.
        </p>
        <p>Designed &amp; built with Next.js, Three.js &amp; GSAP.</p>
      </div>
    </footer>
  );
}
