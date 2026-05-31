"use client";

import { useEffect, useState } from "react";

/** Guards client-only rendering (e.g. portals, canvas) to avoid hydration mismatch. */
export function useIsClient(): boolean {
  const [isClient, setIsClient] = useState(false);
  useEffect(() => setIsClient(true), []);
  return isClient;
}
