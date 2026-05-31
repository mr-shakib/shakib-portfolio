import { cn } from "@/lib/utils/cn";

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
  as?: "h1" | "h2" | "h3";
}

/** Consistent section header with eyebrow label, title and optional description. */
export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  className,
  as: Heading = "h2",
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "flex max-w-prose flex-col gap-4",
        align === "center" && "mx-auto items-center text-center",
        className,
      )}
    >
      {eyebrow && (
        <span className="flex items-center gap-3 text-sm font-medium uppercase tracking-[0.2em] text-accent">
          <span className="h-px w-8 bg-accent/50" aria-hidden />
          {eyebrow}
        </span>
      )}
      <Heading className="font-display text-display-md text-gradient">{title}</Heading>
      {description && <p className="text-lg leading-relaxed text-muted">{description}</p>}
    </div>
  );
}
