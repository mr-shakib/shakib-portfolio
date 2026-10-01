"use client";

import { useTransition } from "react";
import { deleteMessage } from "@/lib/admin/actions";

export function DeleteMessageButton({ id }: { id: string }) {
  const [pending, startTransition] = useTransition();
  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => {
        if (confirm("Delete this message permanently?")) startTransition(() => deleteMessage(id));
      }}
      className="ml-auto rounded-lg px-3 py-1.5 text-xs text-muted transition-colors hover:text-error disabled:opacity-50"
    >
      {pending ? "Deleting…" : "Delete"}
    </button>
  );
}
