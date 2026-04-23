export type Vec2 = { x: number; y: number };

export const TWO_PI = Math.PI * 2;

export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

export function degToRad(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

export function lineDistance(A: number, B: number, C: number, point: Vec2): number {
  const denom = Math.sqrt(A * A + B * B) || 1;
  return Math.abs(A * point.x + B * point.y + C) / denom;
}

export function smoothstep(edge0: number, edge1: number, x: number): number {
  const t = clamp((x - edge0) / (edge1 - edge0 || 1), 0, 1);
  return t * t * (3 - 2 * t);
}

export function radialDistance(point: Vec2, center: Vec2): number {
  const dx = point.x - center.x;
  const dy = point.y - center.y;
  return Math.sqrt(dx * dx + dy * dy);
}

export function sineOffset(time: number, amplitude: number, frequency: number, phase: number): number {
  return amplitude * Math.sin(TWO_PI * frequency * time + phase);
}

export function clipToBounds(x: number, y: number, width: number, height: number): boolean {
  return x >= 0 && y >= 0 && x < width && y < height;
}
