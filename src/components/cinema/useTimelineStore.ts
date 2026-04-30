import { create } from "zustand";

export type Act = "I" | "II" | "III" | "IV";

type State = {
  currentTime: number;
  running: boolean;
  ended: boolean;
  setTime: (t: number) => void;
  setRunning: (r: boolean) => void;
  setEnded: (e: boolean) => void;
  reset: () => void;
};

export const TOTAL_MS = 180_000;
export const ACT_BOUNDS: Record<Act, [number, number]> = {
  I: [0, 60_000],
  II: [60_000, 120_000],
  III: [120_000, 170_000],
  IV: [170_000, 180_000],
};

export const useTimelineStore = create<State>((set) => ({
  currentTime: 0,
  running: false,
  ended: false,
  setTime: (t) => set({ currentTime: t }),
  setRunning: (r) => set({ running: r }),
  setEnded: (e) => set({ ended: e }),
  reset: () => set({ currentTime: 0, running: false, ended: false }),
}));

export function actAt(t: number): Act {
  if (t < ACT_BOUNDS.I[1]) return "I";
  if (t < ACT_BOUNDS.II[1]) return "II";
  if (t < ACT_BOUNDS.III[1]) return "III";
  return "IV";
}
