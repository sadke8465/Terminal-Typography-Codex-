import { mapTextToGrid } from "./grid_mapper";

export type Frame = Uint16Array;

export interface EngineConfig {
  width: number;
  height: number;
  text: string;
}

export class Engine {
  private front: Frame;
  private back: Frame;
  private tick = 0;

  constructor(private readonly config: EngineConfig) {
    const size = config.width * config.height;
    this.front = new Uint16Array(size);
    this.back = new Uint16Array(size);
  }

  update(): void {
    this.back.fill(0);
    const glyphGrid = mapTextToGrid(this.config.text);

    glyphGrid.forEach((row, y) => {
      row.forEach((value, x) => {
        if (!value || y >= this.config.height || x >= this.config.width) {
          return;
        }
        const idx = y * this.config.width + x;
        this.back[idx] = 1;
      });
    });

    [this.front, this.back] = [this.back, this.front];
    this.tick += 1;
  }

  frame(): Frame {
    return this.front;
  }

  frameCount(): number {
    return this.tick;
  }
}
