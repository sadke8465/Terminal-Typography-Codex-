import type { SheenParams } from "../animations/sheen";
import type { SwipeParams } from "../animations/swipe";
import type { WaveParams } from "../animations/wave";
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

function toPresetParameters(state: AnimatorState): Record<string, string | number | boolean> {
  const sanitized = sanitizePresetParams(state.preset, state.parameters);

  if (state.preset === "sheen") {
    const p = sanitized as SheenParams;
    return {
      angle: p.angle,
      speed: p.speed,
      thickness: p.thickness,
      glyphOverride: Boolean(p.glyphOverride),
      ...(p.highlightColor ? { highlightColor: p.highlightColor } : {}),
    };
  }

  if (state.preset === "wave") {
    const p = sanitized as WaveParams;
    return {
      amplitude: p.amplitude,
      speed: p.speed,
      stagger: p.stagger,
      easing: p.easing ?? 0,
    };
  }

  const p = sanitized as SwipeParams;
  return {
    direction: p.direction,
    action: p.action,
    speed: p.speed,
    edgeDecay: p.edgeDecay,
    edgeDecayDistance: p.edgeDecayDistance ?? 3,
  };
}

export function toAnimationJson(state: AnimatorState): AnimationJson {
  return {
    version: state.version,
    text: state.text,
    font: state.font,
    glyphSet: state.glyphSet,
    preset: state.preset,
    parameters: toPresetParameters(state),
  };
}

export function exportAnimationJson(state: AnimatorState): string {
  return JSON.stringify(toAnimationJson(state), null, 2);
}
