export type Point = { x: number; y: number };

export const clamp = (value: number, min: number, max: number): number =>
  Math.max(min, Math.min(max, value));

export const distanceToLine = (
  point: Point,
  line: { A: number; B: number; C: number },
): number => {
  const numerator = Math.abs(line.A * point.x + line.B * point.y + line.C);
  const denominator = Math.sqrt(line.A ** 2 + line.B ** 2) || 1;
  return numerator / denominator;
};

export const sineOffset = (
  t: number,
  index: number,
  amplitude: number,
  frequency: number,
  stagger: number,
): number => amplitude * Math.sin(frequency * t + stagger * index);

export const linearMask = (
  value: number,
  min: number,
  max: number,
): 0 | 1 => (value >= min && value <= max ? 1 : 0);
