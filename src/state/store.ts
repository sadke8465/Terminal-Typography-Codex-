import { DEFAULT_STATE, normalizeState, type AnimatorState } from "./schema";

type Listener = (state: AnimatorState) => void;

export class Store {
  private state: AnimatorState = DEFAULT_STATE;
  private listeners: Set<Listener> = new Set();

  getState(): AnimatorState {
    return this.state;
  }

  setState(next: Partial<AnimatorState>): void {
    this.state = normalizeState(next, this.state);
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
