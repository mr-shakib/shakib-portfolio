"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { logout } from "@/lib/admin/actions";
import { cn } from "@/lib/utils/cn";

const GROUPS: { title?: string; links: { href: string; label: string }[] }[] = [
  { links: [{ href: "/admin", label: "Dashboard" }] },
  {
    title: "Site",
    links: [
      { href: "/admin/sections", label: "Sections" },
      { href: "/admin/sections/travelMap", label: "Travel map" },
    ],
  },
  {
    title: "Content",
    links: [
      { href: "/admin/projects", label: "Projects" },
      { href: "/admin/publications", label: "Publications" },
      { href: "/admin/research-areas", label: "Research areas" },
      { href: "/admin/research-entries", label: "Research entries" },
      { href: "/admin/skills", label: "Skills" },
    ],
  },
  {
    title: "Inbox",
    links: [{ href: "/admin/messages", label: "Messages" }],
  },
];

export function AdminNav({ email, unread }: { email: string; unread: number }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  // The most specific matching link wins, so a shortcut into a section
  // doesn't also light up "Sections".
  const matches = (href: string) =>
    href === "/admin" ? pathname === "/admin" : pathname === href || pathname.startsWith(`${href}/`);
  const active = GROUPS.flatMap((g) => g.links.map((l) => l.href))
    .filter(matches)
    .sort((a, b) => b.length - a.length)[0];
  const isActive = (href: string) => href === active;

  return (
    <aside className="border-b border-white/10 bg-surface lg:sticky lg:top-0 lg:flex lg:h-svh lg:w-60 lg:shrink-0 lg:flex-col lg:border-b-0 lg:border-r">
      <div className="flex items-center justify-between px-5 py-4 lg:py-6">
        <Link href="/admin" className="font-display text-2xl uppercase leading-none text-foreground">
          SH<span className="text-accent">—</span>
          <span className="ml-2 align-middle font-grotesk text-[10px] tracking-[0.3em] text-muted">Admin</span>
        </Link>
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          className="rounded-lg border border-white/10 px-3 py-1.5 text-xs text-foreground lg:hidden"
        >
          {open ? "Close" : "Menu"}
        </button>
      </div>

      <nav
        aria-label="Admin"
        className={cn("flex-1 overflow-y-auto px-3 pb-4 lg:block", open ? "block" : "hidden")}
      >
        {GROUPS.map((group, i) => (
          <div key={i} className="mb-4">
            {group.title && (
              <p className="mb-1 px-3 font-grotesk text-[10px] uppercase tracking-[0.25em] text-muted">
                {group.title}
              </p>
            )}
            {group.links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                aria-current={isActive(link.href) ? "page" : undefined}
                className={cn(
                  "flex items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors",
                  isActive(link.href)
                    ? "bg-volt/10 text-accent"
                    : "text-white/75 hover:bg-white/[0.04] hover:text-foreground",
                )}
              >
                {link.label}
                {link.href === "/admin/messages" && unread > 0 && (
                  <span className="rounded-full bg-accent px-1.5 text-[10px] font-bold leading-4 text-background">
                    {unread}
                  </span>
                )}
              </Link>
            ))}
          </div>
        ))}

        <div className="mt-6 border-t border-white/10 pt-4 lg:hidden">
          <AccountLinks email={email} pathname={pathname} />
        </div>
      </nav>

      <div className="hidden border-t border-white/10 px-3 py-4 lg:block">
        <AccountLinks email={email} pathname={pathname} />
      </div>
    </aside>
  );
}

function AccountLinks({ email, pathname }: { email: string; pathname: string }) {
  return (
    <div className="flex flex-col gap-1 text-sm">
      <p className="truncate px-3 pb-1 text-xs text-muted" title={email}>
        {email}
      </p>
      <Link
        href="/admin/settings"
        aria-current={pathname === "/admin/settings" ? "page" : undefined}
        className={cn(
          "rounded-lg px-3 py-2 transition-colors",
          pathname === "/admin/settings" ? "bg-volt/10 text-accent" : "text-white/75 hover:bg-white/[0.04] hover:text-foreground",
        )}
      >
        Settings
      </Link>
      <a
        href="/"
        target="_blank"
        rel="noreferrer"
        className="rounded-lg px-3 py-2 text-white/75 transition-colors hover:bg-white/[0.04] hover:text-foreground"
      >
        View site ↗
      </a>
      <form action={logout}>
        <button
          type="submit"
          className="w-full rounded-lg px-3 py-2 text-left text-white/75 transition-colors hover:bg-white/[0.04] hover:text-error"
        >
          Sign out
        </button>
      </form>
    </div>
  );
}
