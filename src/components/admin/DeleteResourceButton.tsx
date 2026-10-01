"use client";

import { useTransition } from "react";
import { deleteResource } from "@/lib/admin/actions";

export function DeleteResourceButton({ resource, id, label }: { resource: string; id: string; label: string }) {
  const [pending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => {
        if (!confirm(`Delete this ${label}? This can’t be undone.`)) return;
        startTransition(() => deleteResource(resource, id));
      }}
      className="rounded-lg border border-white/15 px-3 py-2 text-xs text-muted transition-colors hover:border-error hover:text-error disabled:opacity-50"
    >
      {pending ? "Deleting…" : "Delete"}
    </button>
  );
}
