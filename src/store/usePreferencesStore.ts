import { create } from "zustand";
import { persist } from "zustand/middleware";

interface PreferencesState {
  /** User-toggled "lite mode" disables heavy 3D/motion regardless of OS setting. */
  liteMode: boolean;
  setLiteMode: (value: boolean) => void;
  toggleLiteMode: () => void;
}

export const usePreferencesStore = create<PreferencesState>()(
  persist(
    (set) => ({
      liteMode: false,
      setLiteMode: (value) => set({ liteMode: value }),
      toggleLiteMode: () => set((s) => ({ liteMode: !s.liteMode })),
    }),
    { name: "portfolio-preferences" },
  ),
);
