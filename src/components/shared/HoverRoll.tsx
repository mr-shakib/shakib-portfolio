import { cn } from "@/lib/utils/cn";

interface HoverRollProps {
  children: string;
  className?: string;
  /** Class for the incoming (rolled-in) copy — defaults to volt. */
  incomingClassName?: string;
}

/**
 * Rolling link label: on hover of the nearest `group` ancestor, the label
 * slides up out of view while a second copy (volt by default) rolls in from
 * below. Pure CSS — attach `group` to the wrapping link.
 */
export function HoverRoll({
  children,
  className,
  incomingClassName = "text-accent",
}: HoverRollProps) {
  return (
    <span className={cn("relative inline-flex overflow-hidden", className)}>
      <span className="transition-transform duration-500 ease-out-expo group-hover:-translate-y-[110%]">
        {children}
      </span>
      <span
        aria-hidden
        className={cn(
          "absolute inset-0 translate-y-[110%] transition-transform duration-500 ease-out-expo group-hover:translate-y-0",
          incomingClassName,
        )}
      >
        {children}
      </span>
    </span>
  );
}
