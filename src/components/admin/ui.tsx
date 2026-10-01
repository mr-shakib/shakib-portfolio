import Link from "next/link";
import { cn } from "@/lib/utils/cn";

/** Page heading used by every admin screen. */
export function AdminHeader({
  eyebrow,
  title,
  description,
  actions,
  back,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: React.ReactNode;
  back?: { href: string; label: string };
}) {
  return (
    <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div className="min-w-0">
        {back && (
          <Link href={back.href} className="mb-3 inline-block text-sm text-muted hover:text-accent">
            ← {back.label}
          </Link>
        )}
        {eyebrow && (
          <p className="font-grotesk text-[10px] uppercase tracking-[0.3em] text-accent">{eyebrow}</p>
        )}
        <h1 className="mt-1 text-2xl font-semibold tracking-tight text-foreground md:text-3xl">{title}</h1>
        {description && <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </header>
  );
}

export function Panel({ className, children }: { className?: string; children: React.ReactNode }) {
  return <section className={cn("rounded-2xl border border-white/10 bg-surface p-5 md:p-6", className)}>{children}</section>;
}

export function ButtonLink({
  href,
  children,
  variant = "primary",
  external,
}: {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "ghost";
  external?: boolean;
}) {
  return (
    <Link
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noreferrer" : undefined}
      className={cn(
        "inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm transition-colors",
        variant === "primary"
          ? "bg-accent font-semibold text-background hover:opacity-90"
          : "border border-white/15 text-foreground hover:border-accent hover:text-accent",
      )}
    >
      {children}
    </Link>
  );
}

export function Badge({ children, tone = "muted" }: { children: React.ReactNode; tone?: "muted" | "accent" | "warn" }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md px-1.5 py-0.5 font-grotesk text-[10px] uppercase tracking-[0.12em]",
        tone === "accent" && "bg-volt/15 text-accent",
        tone === "warn" && "bg-[#ffd000]/15 text-warning",
        tone === "muted" && "bg-white/[0.06] text-muted",
      )}
    >
      {children}
    </span>
  );
}

const compact = new Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 1 });
const full = new Intl.NumberFormat("en");

/** 1,284 below 10k, then 12.9K. */
export function formatCount(n: number) {
  return n < 10_000 ? full.format(n) : compact.format(n);
}
