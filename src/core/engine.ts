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

type Rgb = { r: number; g: number; b: number };

export class AnimationEngine {
  private readonly width: number;
  private readonly height: number;
  private readonly front: Float32Array;
  private readonly back: Float32Array;
  private readonly baseShape: Float32Array;
  private readonly sheenMask: Uint8Array;
  private frame = 0;
  private elapsedSeconds = 0;
  private timer: ReturnType<typeof setInterval> | undefined;

  constructor(private readonly shape: ShapeGrid, private config: EngineConfig) {
    this.width = shape.width;
    this.height = shape.height;
    this.baseShape = new Float32Array(shape.cells);
    this.front = new Float32Array(shape.cells.length);
    this.back = new Float32Array(shape.cells.length);
    this.sheenMask = new Uint8Array(shape.cells.length);
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
    const fps = Math.max(1, this.config.fps ?? 60);
    const dt = 1 / fps;
    this.elapsedSeconds += dt;

    for (let i = 0; i < this.baseShape.length; i += 1) {
      this.back[i] = this.baseShape[i];
      this.sheenMask[i] = 0;
    }

    for (let y = 0; y < this.height; y += 1) {
      for (let x = 0; x < this.width; x += 1) {
        const idx = y * this.width + x;
        if (this.baseShape[idx] === 0) {
          continue;
        }

        if (this.config.preset === "sheen" && this.config.sheen) {
          const intensity = computeSheenIntensity(x, y, this.frame, this.width, this.height, this.config.sheen);
          if (intensity > 0) {
            this.sheenMask[idx] = 1;
          }
          if (this.config.sheen.glyphOverride) {
            this.back[idx] = Math.max(this.back[idx], intensity > 0 ? 1 : this.back[idx]);
          } else {
            this.back[idx] = Math.max(this.back[idx], intensity);
          }
        }

        if (this.config.preset === "swipe" && this.config.swipe) {
          this.back[idx] *= computeSwipeDensity(x, y, this.frame, this.width, this.height, this.config.swipe);
        }

        if (this.config.preset === "wave" && this.config.wave) {
          const ownerIndex = this.shape.columnOwners[x] >= 0 ? this.shape.columnOwners[x] : x;
          const offset = Math.round(computeWaveOffset(ownerIndex, this.elapsedSeconds, this.config.wave));
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
    const sheenColor = this.config.preset === "sheen" ? parseHexColor(this.config.sheen?.highlightColor) : undefined;

    for (let y = 0; y < this.height; y += 1) {
      let row = "";
      for (let x = 0; x < this.width; x += 1) {
        const idx = y * this.width + x;
        const density = this.front[idx];
        const glyph = this.pickGlyph(density);
        if (!sheenColor || this.sheenMask[idx] === 0 || glyph === " ") {
          row += glyph;
          continue;
        }
        row += colorizeGlyph(glyph, sheenColor);
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
    const normalizedDensity = Math.max(0, Math.min(1, density));
    const index = Math.min(this.config.palette.glyphs.length - 1, Math.floor(normalizedDensity * (this.config.palette.glyphs.length - 1)));
    return this.config.palette.glyphs[index] ?? " ";
  }
}

function parseHexColor(hex?: string): Rgb | undefined {
  if (!hex) {
    return undefined;
  }
  const normalized = hex.trim().replace("#", "");
  if (!/^([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(normalized)) {
    return undefined;
  }

  if (normalized.length === 3) {
    return {
      r: Number.parseInt(normalized[0] + normalized[0], 16),
      g: Number.parseInt(normalized[1] + normalized[1], 16),
      b: Number.parseInt(normalized[2] + normalized[2], 16),
    };
  }

  return {
    r: Number.parseInt(normalized.slice(0, 2), 16),
    g: Number.parseInt(normalized.slice(2, 4), 16),
    b: Number.parseInt(normalized.slice(4, 6), 16),
  };
}

function colorizeGlyph(glyph: string, color: Rgb): string {
  return `\u001b[38;2;${color.r};${color.g};${color.b}m${glyph}\u001b[0m`;
}
