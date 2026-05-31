import { cn } from "@/lib/utils/cn";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  interactive?: boolean;
}

export function Card({ className, interactive = false, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border border-border bg-surface p-6",
        interactive &&
          "transition-colors duration-300 ease-out-expo hover:border-accent/40 hover:bg-surface-elevated",
        className,
      )}
      {...props}
    />
  );
}
