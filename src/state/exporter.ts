import type { AnimatorState } from "./schema";
import { sanitizePresetParams } from "./schema";

export type AnimationJson = {
  version: string;
  text: string;
  font: string;
  glyphSet: string;
  preset: string;
  parameters: Record<string, string | number | boolean>;
};

export function toAnimationJson(state: AnimatorState): AnimationJson {
  const parameters = sanitizePresetParams(state.preset, state.parameters) as Record<string, string | number | boolean>;
  return {
    version: state.version,
    text: state.text,
    font: state.font,
    glyphSet: state.glyphSet,
    preset: state.preset,
    parameters,
  };
}

export function exportAnimationJson(state: AnimatorState): string {
  return JSON.stringify(toAnimationJson(state), null, 2);
}
