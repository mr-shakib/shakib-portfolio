"use client";

import { useState } from "react";
import { cn } from "@/lib/utils/cn";

interface CopyButtonProps {
  value: string;
  label?: string;
  className?: string;
}

/** Copies text to clipboard with transient confirmation. */
export function CopyButton({ value, label = "Copy", className }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  return (
    <button
      type="button"
      onClick={copy}
      className={cn(
        "inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm text-muted transition-colors hover:border-accent hover:text-accent",
        copied && "border-success text-success",
        className,
      )}
    >
      {copied ? "Copied ✓" : label}
    </button>
  );
}
