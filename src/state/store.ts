export type Preset = "sheen" | "wave" | "swipe";

export interface AnimatorState {
  text: string;
  font: string;
  glyphSet: string;
  preset: Preset;
  parameters: Record<string, string | number | boolean>;
}

export const defaultState: AnimatorState = {
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
