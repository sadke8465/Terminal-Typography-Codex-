import type { Preset } from "../core/engine";
import type { SheenParams } from "../animations/sheen";
import type { SwipeParams, SwipeAction, SwipeDirection } from "../animations/swipe";
import type { WaveParams } from "../animations/wave";

export type AnimatorState = {
  version: string;
  text: string;
  font: string;
  glyphSet: string;
  preset: Preset;
  parameters: SheenParams | WaveParams | SwipeParams;
};

const PRESET_VALUES: Preset[] = ["sheen", "wave", "swipe"];

const DEFAULT_TEXT = "STORM";
const DEFAULT_VERSION = "1.0.0";

const DEFAULT_SHEEN: SheenParams = {
  angle: 35,
  speed: 1.5,
  thickness: 4,
  glyphOverride: false,
};

const DEFAULT_WAVE: WaveParams = {
  amplitude: 2,
  speed: 1,
  stagger: 0.5,
  easing: 0,
};

const DEFAULT_SWIPE: SwipeParams = {
  direction: "left_to_right",
  action: "reveal",
  edgeDecay: true,
  speed: 2.5,
};

export const DEFAULT_PRESET_PARAMS: Record<Preset, SheenParams | WaveParams | SwipeParams> = {
  sheen: DEFAULT_SHEEN,
  wave: DEFAULT_WAVE,
  swipe: DEFAULT_SWIPE,
};

export const DEFAULT_STATE: AnimatorState = {
  version: DEFAULT_VERSION,
  text: DEFAULT_TEXT,
  font: "cybermedium",
  glyphSet: "solid_block",
  preset: "swipe",
  parameters: { ...DEFAULT_SWIPE },
};

function isPreset(value: unknown): value is Preset {
  return PRESET_VALUES.includes(value as Preset);
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function toFiniteNumber(value: unknown, fallback: number): number {
  if (typeof value !== "number") {
    return fallback;
  }
  return Number.isFinite(value) ? value : fallback;
}

function normalizeVersion(value: unknown, fallback: string): string {
  if (typeof value !== "string") {
    return fallback;
  }
  const trimmed = value.trim();
  if (!trimmed) {
    return fallback;
  }
  return /^\d+\.\d+\.\d+$/.test(trimmed) ? trimmed : fallback;
}

function normalizeText(value: unknown, fallback: string): string {
  if (typeof value !== "string") {
    return fallback;
  }
  const normalized = value.replace(/\s+/g, " ").trim().slice(0, 64);
  return normalized || fallback;
}

function normalizeAssetId(value: unknown, fallback: string): string {
  if (typeof value !== "string") {
    return fallback;
  }
  const trimmed = value.trim();
  return trimmed || fallback;
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function asDirection(value: unknown, fallback: SwipeDirection): SwipeDirection {
  const directions: SwipeDirection[] = ["left_to_right", "right_to_left", "top_to_bottom", "bottom_to_top", "radial"];
  return directions.includes(value as SwipeDirection) ? (value as SwipeDirection) : fallback;
}

function asAction(value: unknown, fallback: SwipeAction): SwipeAction {
  return value === "reveal" || value === "conceal" ? value : fallback;
}

export function sanitizePresetParams(preset: Preset, input: unknown): SheenParams | WaveParams | SwipeParams {
  const params = isObject(input) ? input : {};

  if (preset === "sheen") {
    return {
      angle: clamp(toFiniteNumber(params.angle, DEFAULT_SHEEN.angle), 0, 360),
      speed: clamp(toFiniteNumber(params.speed, DEFAULT_SHEEN.speed), 0.05, 20),
      thickness: clamp(toFiniteNumber(params.thickness, DEFAULT_SHEEN.thickness), 0.5, 50),
      glyphOverride: typeof params.glyphOverride === "boolean" ? params.glyphOverride : DEFAULT_SHEEN.glyphOverride,
      highlightColor: typeof params.highlightColor === "string" ? params.highlightColor : undefined,
    };
  }

  if (preset === "wave") {
    return {
      amplitude: clamp(toFiniteNumber(params.amplitude, DEFAULT_WAVE.amplitude), 0, 20),
      speed: clamp(toFiniteNumber(params.speed, DEFAULT_WAVE.speed), 0.05, 20),
      stagger: clamp(toFiniteNumber(params.stagger, DEFAULT_WAVE.stagger), 0, 8),
      easing: clamp(toFiniteNumber(params.easing, DEFAULT_WAVE.easing ?? 0), 0, 8),
    };
  }

  return {
    direction: asDirection(params.direction, DEFAULT_SWIPE.direction),
    action: asAction(params.action, DEFAULT_SWIPE.action),
    speed: clamp(toFiniteNumber(params.speed, DEFAULT_SWIPE.speed), 0.05, 20),
    edgeDecay: typeof params.edgeDecay === "boolean" ? params.edgeDecay : DEFAULT_SWIPE.edgeDecay,
  };
}

export function normalizeState(next: Partial<AnimatorState>, previous: AnimatorState): AnimatorState {
  const presetCandidate = next.preset ?? previous.preset;
  const preset = isPreset(presetCandidate) ? presetCandidate : previous.preset;
  const resolvedParameters =
    next.parameters !== undefined
      ? sanitizePresetParams(preset, next.parameters)
      : next.preset !== undefined
        ? sanitizePresetParams(preset, DEFAULT_PRESET_PARAMS[preset])
        : sanitizePresetParams(preset, previous.parameters);

  return {
    version: normalizeVersion(next.version ?? previous.version, DEFAULT_VERSION),
    text: normalizeText(next.text ?? previous.text, DEFAULT_TEXT),
    font: normalizeAssetId(next.font ?? previous.font, previous.font),
    glyphSet: normalizeAssetId(next.glyphSet ?? previous.glyphSet, previous.glyphSet),
    preset,
    parameters: resolvedParameters,
  };
}
