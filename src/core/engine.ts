import { computeSheenIntensity, type SheenParams } from "../animations/sheen";
import { computeSwipeDensity, type SwipeParams } from "../animations/swipe";
import { computeWaveOffset, type WaveParams } from "../animations/wave";
import type { ShapeGrid } from "./grid_mapper";

export type Preset = "sheen" | "wave" | "swipe";

export type GlyphPalette = {
  id: string;
  glyphs: string[];
};

export type EngineConfig = {
  fps?: number;
  preset: Preset;
  sheen?: SheenParams;
  wave?: WaveParams;
  swipe?: SwipeParams;
  palette: GlyphPalette;
};

export type FrameListener = (rows: string[]) => void;

export class AnimationEngine {
  private readonly width: number;
  private readonly height: number;
  private readonly front: Float32Array;
  private readonly back: Float32Array;
  private readonly baseShape: Float32Array;
  private frame = 0;
  private timer: ReturnType<typeof setInterval> | undefined;

  constructor(private readonly shape: ShapeGrid, private config: EngineConfig) {
    this.width = shape.width;
    this.height = shape.height;
    this.baseShape = new Float32Array(shape.cells);
    this.front = new Float32Array(shape.cells.length);
    this.back = new Float32Array(shape.cells.length);
  }

  start(listener: FrameListener): void {
    const fps = Math.max(1, Math.round(this.config.fps ?? 60));
    const interval = Math.round(1000 / fps);
    this.stop();
    this.timer = setInterval(() => {
      this.tick();
      listener(this.renderRows());
    }, interval);
  }

  stop(): void {
    if (this.timer !== undefined) {
      clearInterval(this.timer);
      this.timer = undefined;
    }
  }

  updateConfig(config: Partial<EngineConfig>): void {
    this.config = { ...this.config, ...config };
  }

  requestRender(): string[] {
    this.tick();
    return this.renderRows();
  }

  private tick(): void {
    for (let i = 0; i < this.baseShape.length; i += 1) {
      this.back[i] = this.baseShape[i];
    }

    for (let y = 0; y < this.height; y += 1) {
      for (let x = 0; x < this.width; x += 1) {
        const idx = y * this.width + x;
        if (this.baseShape[idx] === 0) {
          continue;
        }

        if (this.config.preset === "sheen" && this.config.sheen) {
          const intensity = computeSheenIntensity(x, y, this.frame, this.width, this.height, this.config.sheen);
          this.back[idx] = Math.max(this.back[idx], intensity);
        }

        if (this.config.preset === "swipe" && this.config.swipe) {
          this.back[idx] *= computeSwipeDensity(x, y, this.frame, this.width, this.height, this.config.swipe);
        }

        if (this.config.preset === "wave" && this.config.wave) {
          const offset = Math.round(computeWaveOffset(x, this.frame / (this.config.fps ?? 60), this.config.wave));
          const targetY = y + offset;
          if (targetY >= 0 && targetY < this.height) {
            this.back[targetY * this.width + x] = Math.max(this.back[targetY * this.width + x], this.baseShape[idx]);
            this.back[idx] = 0;
          }
        }
      }
    }

    this.front.set(this.back);
    this.frame += 1;
  }

  private renderRows(): string[] {
    const output: string[] = [];
    for (let y = 0; y < this.height; y += 1) {
      let row = "";
      for (let x = 0; x < this.width; x += 1) {
        const density = this.front[y * this.width + x];
        row += this.pickGlyph(density);
      }
      output.push(row);
    }
    return output;
  }

  private pickGlyph(density: number): string {
    if (density <= 0) {
      return " ";
    }
    if (this.config.palette.glyphs.length === 0) {
      return " ";
    }
    const index = Math.min(
      this.config.palette.glyphs.length - 1,
      Math.floor(density * (this.config.palette.glyphs.length - 1))
    );
    return this.config.palette.glyphs[index] ?? " ";
  }
}
