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
  let cursorX = 0;

  glyphs.forEach((glyph, i) => {
    writeGlyph(cells, width, cursorX, 0, glyph);
    cursorX += glyphWidths[i] + font.spacing;
  });

  return {
    width,
    height,
    cells,
    text,
    font: font.name,
  };
}

export function copyGrid(grid: ShapeGrid): ShapeGrid {
  return {
    ...grid,
    cells: new Float32Array(grid.cells),
  };
}
