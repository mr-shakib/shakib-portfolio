import { cn } from "@/lib/utils/cn";

interface EyebrowProps {
  /** Chapter index, e.g. "01" — rendered as "01 — Label". */
  number?: string;
  children: React.ReactNode;
  className?: string;
}

/** Standard section kicker: numbered, letterspaced, volt by default. */
export function Eyebrow({ number, children, className }: EyebrowProps) {
  return (
    <p
      className={cn(
        "font-grotesk text-[11px] uppercase tracking-[0.35em] text-accent",
        className,
      )}
    >
      {number ? `${number} — ` : null}
      {children}
    </p>
  );
}
