import { create } from "zustand";

export type SceneId = "hero" | "ambient" | "skills";

interface SceneState {
  /** Which scene the persistent canvas should cross-fade to. */
  activeScene: SceneId;
  setActiveScene: (scene: SceneId) => void;

  /** Index of the hovered/active skill node, or null. */
  activeSkill: number | null;
  setActiveSkill: (index: number | null) => void;

  /** Whether the WebGL canvas has reported it is ready (first frame drawn). */
  canvasReady: boolean;
  setCanvasReady: (ready: boolean) => void;
}

export const useSceneStore = create<SceneState>((set) => ({
  activeScene: "hero",
  setActiveScene: (scene) => set({ activeScene: scene }),

  activeSkill: null,
  setActiveSkill: (index) => set({ activeSkill: index }),

  canvasReady: false,
  setCanvasReady: (ready) => set({ canvasReady: ready }),
}));
