export type Grid = number[][];

const glyphFromCode = (code: number): number[][] => {
  const rows = 7;
  const cols = 5;
  const grid: number[][] = Array.from({ length: rows }, () => Array(cols).fill(0));

  for (let y = 0; y < rows; y += 1) {
    for (let x = 0; x < cols; x += 1) {
      const bit = (code + x + y * 3) % 2;
      grid[y][x] = bit;
    }
  }

  return grid;
};

export const mapTextToGrid = (text: string): Grid => {
  const letters = text.toUpperCase().split("");
  const rows = 7;
  const letterWidth = 5;
  const spacing = 1;
  const cols = letters.length * (letterWidth + spacing);

  const grid: Grid = Array.from({ length: rows }, () => Array(cols).fill(0));

  letters.forEach((char, index) => {
    const glyph = glyphFromCode(char.charCodeAt(0));
    const xStart = index * (letterWidth + spacing);

    for (let y = 0; y < rows; y += 1) {
      for (let x = 0; x < letterWidth; x += 1) {
        grid[y][xStart + x] = glyph[y][x];
      }
    }
  });

  return grid;
};
