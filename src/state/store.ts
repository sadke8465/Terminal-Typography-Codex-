import type { Preset } from "../core/engine";
import type { SheenParams } from "../animations/sheen";
import type { SwipeParams } from "../animations/swipe";
import type { WaveParams } from "../animations/wave";

export type AnimatorState = {
  version: string;
  text: string;
  font: string;
  glyphSet: string;
  preset: Preset;
  parameters: SheenParams | WaveParams | SwipeParams;
};

type Listener = (state: AnimatorState) => void;

const defaultState: AnimatorState = {
  version: "1.0.0",
  text: "STORM",
  font: "cybermedium",
  glyphSet: "solid_block",
  preset: "swipe",
  parameters: {
    direction: "left_to_right",
    action: "reveal",
    edgeDecay: true,
    speed: 2.5,
  },
};

export class Store {
  private state: AnimatorState = defaultState;
  private listeners: Set<Listener> = new Set();

  getState(): AnimatorState {
    return this.state;
  }

  setState(next: Partial<AnimatorState>): void {
    this.state = { ...this.state, ...next };
    this.listeners.forEach((listener) => listener(this.state));
  }

  subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    listener(this.state);
    return () => {
      this.listeners.delete(listener);
    };
  }
}

export const animatorStore = new Store();
