"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { submitContact } from "@/lib/actions/contact";
import type { ContactState } from "@/lib/validations/contact";
import { Input, Textarea } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

const initialState: ContactState = { status: "idle" };

export function ContactForm() {
  const [state, formAction, pending] = useActionState(submitContact, initialState);
  const mountedAt = useRef<number>(Date.now());
  const [elapsed, setElapsed] = useState("0");
  const formRef = useRef<HTMLFormElement>(null);

  // Capture time-on-form for the spam time-trap, set just before submit.
  const handleSubmit = () => {
    setElapsed(String(Date.now() - mountedAt.current));
  };

  useEffect(() => {
    if (state.status === "success") {
      formRef.current?.reset();
      mountedAt.current = Date.now();
    }
  }, [state.status]);

  return (
    <form ref={formRef} action={formAction} onSubmit={handleSubmit} className="flex flex-col gap-5">
      {/* Honeypot — visually hidden, off the a11y tree */}
      <div aria-hidden className="absolute left-[-9999px]" tabIndex={-1}>
        <label htmlFor="company">Company</label>
        <input id="company" name="company" type="text" tabIndex={-1} autoComplete="off" />
      </div>
      <input type="hidden" name="elapsedMs" value={elapsed} />

      <div className="grid gap-5 sm:grid-cols-2">
        <Input
          name="name"
          label="Name"
          placeholder="Your name"
          required
          autoComplete="name"
          error={state.errors?.name?.[0]}
        />
        <Input
          name="email"
          type="email"
          label="Email"
          placeholder="you@example.com"
          required
          autoComplete="email"
          error={state.errors?.email?.[0]}
        />
      </div>
      <Input
        name="subject"
        label="Subject"
        placeholder="What’s this about?"
        required
        error={state.errors?.subject?.[0]}
      />
      <Textarea
        name="message"
        label="Message"
        placeholder="Tell me about your project, research or opportunity…"
        required
        error={state.errors?.message?.[0]}
      />

      <div className="flex items-center gap-4">
        <Button type="submit" size="lg" disabled={pending}>
          {pending ? "Sending…" : "Send message"}
        </Button>

        <AnimatePresence mode="wait">
          {state.status !== "idle" && state.message && (
            <motion.p
              key={state.message}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              role="status"
              className={
                state.status === "success" ? "text-sm text-success" : "text-sm text-error"
              }
            >
              {state.message}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </form>
  );
}
