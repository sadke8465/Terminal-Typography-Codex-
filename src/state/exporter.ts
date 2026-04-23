import type { AnimatorState } from "./store";

export interface ExportedAnimation {
  version: string;
  text: string;
  font: string;
  glyphSet: string;
  preset: string;
  parameters: Record<string, string | number | boolean>;
}

export const exportAnimation = (state: AnimatorState): ExportedAnimation => ({
  version: "1.0.0",
  text: state.text,
  font: state.font,
  glyphSet: state.glyphSet,
  preset: state.preset,
  parameters: state.parameters,
});
