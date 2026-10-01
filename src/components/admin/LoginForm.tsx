"use client";

import { useActionState } from "react";
import { login, type LoginState } from "@/lib/admin/login";
import { inputClass } from "@/components/admin/form/controls";

export function LoginForm({ next }: { next?: string }) {
  const [state, action, pending] = useActionState<LoginState, FormData>(login, {});

  return (
    <form action={action} className="mt-8 flex flex-col gap-4">
      {next && <input type="hidden" name="next" value={next} />}
      <label className="flex flex-col gap-1.5">
        <span className="font-grotesk text-[11px] uppercase tracking-[0.16em] text-white/80">Email</span>
        <input
          name="email"
          type="email"
          autoComplete="username"
          defaultValue={state.email}
          required
          className={inputClass}
        />
      </label>
      <label className="flex flex-col gap-1.5">
        <span className="font-grotesk text-[11px] uppercase tracking-[0.16em] text-white/80">Password</span>
        <input name="password" type="password" autoComplete="current-password" required className={inputClass} />
      </label>
      {state.error && (
        <p role="alert" data-login-error className="text-sm text-error">
          {state.error}
        </p>
      )}
      <button
        type="submit"
        disabled={pending}
        className="mt-2 rounded-lg bg-accent py-3 font-grotesk text-xs font-bold uppercase tracking-[0.2em] text-background transition-opacity hover:opacity-90 disabled:opacity-50"
      >
        {pending ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
