import { cn } from "@/lib/utils/cn";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "accent" | "outline";
  className?: string;
}

export function Badge({ children, variant = "default", className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium tracking-wide",
        variant === "default" && "bg-surface-elevated text-muted",
        variant === "accent" && "bg-accent-soft text-accent",
        variant === "outline" && "border border-border text-muted",
        className,
      )}
    >
      {children}
    </span>
  );
}
