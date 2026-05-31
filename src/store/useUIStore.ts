import { create } from "zustand";

interface UIState {
  menuOpen: boolean;
  setMenuOpen: (open: boolean) => void;
  toggleMenu: () => void;

  loaderComplete: boolean;
  setLoaderComplete: (done: boolean) => void;

  /** Normalized pointer position (-1..1) shared with the 3D scene. */
  pointer: { x: number; y: number };
  setPointer: (x: number, y: number) => void;

  /** Normalized scroll progress (0..1) shared with the 3D scene for depth parallax. */
  scrollProgress: number;
  setScrollProgress: (value: number) => void;
}

export const useUIStore = create<UIState>((set) => ({
  menuOpen: false,
  setMenuOpen: (open) => set({ menuOpen: open }),
  toggleMenu: () => set((s) => ({ menuOpen: !s.menuOpen })),

  loaderComplete: false,
  setLoaderComplete: (done) => set({ loaderComplete: done }),

  pointer: { x: 0, y: 0 },
  setPointer: (x, y) => set({ pointer: { x, y } }),

  scrollProgress: 0,
  setScrollProgress: (value) => set({ scrollProgress: value }),
}));
