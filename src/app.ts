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

const state = animatorStore.getState();
const fontMap = fonts as Record<string, FontDefinition>;
const paletteMap = glyphPalettes as Record<string, { glyphs: string[] }>;

const fallbackFont = fontMap[Object.keys(fontMap)[0]];
const fallbackPalette = paletteMap[Object.keys(paletteMap)[0]];

function resolveFont(fontId: string): FontDefinition {
  return fontMap[fontId] ?? fallbackFont;
}

function resolvePalette(glyphSetId: string): { glyphs: string[] } {
  return paletteMap[glyphSetId] ?? fallbackPalette;
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
