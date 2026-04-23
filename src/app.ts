import fonts from "./assets/fonts.json";
import glyphPalettes from "./assets/glyph_palettes.json";
import { AnimationEngine } from "./core/engine";
import { mapTextToGrid, type FontDefinition } from "./core/grid_mapper";
import { exportAnimationJson } from "./state/exporter";
import { animatorStore } from "./state/store";

const state = animatorStore.getState();
const font = (fonts as Record<string, FontDefinition>)[state.font];
const palette = (glyphPalettes as Record<string, { glyphs: string[] }>)[state.glyphSet];

const shape = mapTextToGrid(state.text, font);

const engine = new AnimationEngine(shape, {
  preset: state.preset,
  palette: { id: state.glyphSet, glyphs: palette.glyphs },
  swipe: state.preset === "swipe" ? state.parameters : undefined,
  wave: state.preset === "wave" ? state.parameters : undefined,
  sheen: state.preset === "sheen" ? state.parameters : undefined,
});

export function renderSingleFrame(): string[] {
  return engine.requestRender();
}

export function getAnimationJson(): string {
  return exportAnimationJson(animatorStore.getState());
}
