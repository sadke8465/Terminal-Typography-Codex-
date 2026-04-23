import fonts from "./assets/fonts.json";
import glyphPalettes from "./assets/glyph_palettes.json";
import { AnimationEngine } from "./core/engine";
import { mapTextToGrid, type FontDefinition } from "./core/grid_mapper";
import type { SheenParams } from "./animations/sheen";
import type { SwipeParams } from "./animations/swipe";
import type { WaveParams } from "./animations/wave";
import { exportAnimationJson } from "./state/exporter";
import { animatorStore } from "./state/store";
import { sanitizePresetParams } from "./state/schema";

const fontMap = fonts as Record<string, FontDefinition>;
const paletteMap = glyphPalettes as Record<string, { glyphs: string[] }>;

const fallbackFont = pickFallbackFont(fontMap);
const fallbackPalette = pickFallbackPalette(paletteMap);

function pickFallbackFont(map: Record<string, FontDefinition>): FontDefinition {
  const [firstId] = Object.keys(map);
  const first = map[firstId];
  if (!first) {
    return {
      name: "fallback",
      spacing: 1,
      fallback: ["111", "101", "111"],
      glyphs: {},
    };
  }
  return first;
}

function pickFallbackPalette(map: Record<string, { glyphs: string[] }>): { glyphs: string[] } {
  const [firstId] = Object.keys(map);
  const first = map[firstId];
  if (!first?.glyphs?.length) {
    return { glyphs: [" "] };
  }
  return first;
}

function resolveFont(fontId: string): FontDefinition {
  const candidate = fontMap[fontId] ?? fallbackFont;
  if (!candidate.fallback?.length) {
    return fallbackFont;
  }
  return candidate;
}

function resolvePalette(glyphSetId: string): { glyphs: string[] } {
  const resolved = paletteMap[glyphSetId] ?? fallbackPalette;
  if (!resolved || !Array.isArray(resolved.glyphs) || resolved.glyphs.length === 0) {
    return { glyphs: [" "] };
  }
  return resolved;
}

function buildEngine() {
  const currentState = animatorStore.getState();
  const font = resolveFont(currentState.font);
  const palette = resolvePalette(currentState.glyphSet);
  const safeParams = sanitizePresetParams(currentState.preset, currentState.parameters);
  const shape = mapTextToGrid(currentState.text, font);
  return new AnimationEngine(shape, {
    preset: currentState.preset,
    palette: { id: currentState.glyphSet, glyphs: palette?.glyphs ?? [" "] },
    swipe: currentState.preset === "swipe" ? (safeParams as SwipeParams) : undefined,
    wave: currentState.preset === "wave" ? (safeParams as WaveParams) : undefined,
    sheen: currentState.preset === "sheen" ? (safeParams as SheenParams) : undefined,
  });
}

let engine = buildEngine();

animatorStore.subscribe(() => {
  engine.stop();
  engine = buildEngine();
});

export function renderSingleFrame(): string[] {
  return engine.requestRender();
}

export function getAnimationJson(): string {
  return exportAnimationJson(animatorStore.getState());
}

export function getStateSnapshot() {
  return animatorStore.getState();
}
