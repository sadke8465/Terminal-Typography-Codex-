export type GlyphBitmap = string[];

export type FontDefinition = {
  name: string;
  spacing: number;
  glyphs: Record<string, GlyphBitmap>;
  fallback: GlyphBitmap;
};

export type ShapeGrid = {
  width: number;
  height: number;
  cells: Float32Array;
  text: string;
  font: string;
  bounds: {
    minX: number;
    minY: number;
    maxX: number;
    maxY: number;
  };
  columnOwners: Int16Array;
};

function writeGlyph(
  target: Float32Array,
  targetWidth: number,
  offsetX: number,
  offsetY: number,
  glyph: GlyphBitmap
): void {
  for (let y = 0; y < glyph.length; y += 1) {
    const row = glyph[y];
    for (let x = 0; x < row.length; x += 1) {
      if (row[x] === "1") {
        const idx = (offsetY + y) * targetWidth + offsetX + x;
        target[idx] = 1;
      }
    }
  }
}

export function mapTextToGrid(text: string, font: FontDefinition): ShapeGrid {
  const chars = text.toUpperCase().split("");
  const glyphs = chars.map((char) => font.glyphs[char] ?? font.fallback);
  const glyphHeight = glyphs[0]?.length ?? 0;
  const glyphWidths = glyphs.map((glyph) => glyph[0]?.length ?? 0);
  const width = glyphWidths.reduce((sum, w) => sum + w, 0) + Math.max(0, chars.length - 1) * font.spacing;
  const height = glyphHeight;

  const cells = new Float32Array(width * height);
  const columnOwners = new Int16Array(width);
  columnOwners.fill(-1);
  let cursorX = 0;

  glyphs.forEach((glyph, i) => {
    writeGlyph(cells, width, cursorX, 0, glyph);
    for (let x = 0; x < glyphWidths[i]; x += 1) {
      columnOwners[cursorX + x] = i;
    }
    cursorX += glyphWidths[i] + font.spacing;
  });

  let minX = width;
  let minY = height;
  let maxX = -1;
  let maxY = -1;
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      if (cells[y * width + x] <= 0) {
        continue;
      }
      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;
    }
  }

  const hasPixels = maxX >= minX && maxY >= minY;

  return {
    width,
    height,
    cells,
    text,
    font: font.name,
    bounds: hasPixels
      ? { minX, minY, maxX, maxY }
      : { minX: 0, minY: 0, maxX: Math.max(0, width - 1), maxY: Math.max(0, height - 1) },
    columnOwners,
  };
}

export function copyGrid(grid: ShapeGrid): ShapeGrid {
  return {
    ...grid,
    cells: new Float32Array(grid.cells),
    columnOwners: new Int16Array(grid.columnOwners),
  };
}
