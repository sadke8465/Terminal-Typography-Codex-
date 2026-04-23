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
const font = fontMap[state.font] ?? fallbackFont;
const palette = paletteMap[state.glyphSet] ?? fallbackPalette;

const safeParams = sanitizePresetParams(state.preset, state.parameters);

const shape = mapTextToGrid(state.text, font);

const engine = new AnimationEngine(shape, {
  preset: state.preset,
  palette: { id: state.glyphSet, glyphs: palette?.glyphs ?? [" "] },
  swipe: state.preset === "swipe" ? (safeParams as SwipeParams) : undefined,
  wave: state.preset === "wave" ? (safeParams as WaveParams) : undefined,
  sheen: state.preset === "sheen" ? (safeParams as SheenParams) : undefined,
});

export function renderSingleFrame(): string[] {
  return engine.requestRender();
}

export function getAnimationJson(): string {
  return exportAnimationJson(animatorStore.getState());
}
