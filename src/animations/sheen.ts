import { degToRad, lineDistance } from "../core/math_utils";

export type SheenParams = {
  angle: number;
  speed: number;
  thickness: number;
  glyphOverride?: boolean;
  highlightColor?: string;
};

export function computeSheenIntensity(
  x: number,
  y: number,
  frame: number,
  width: number,
  height: number,
  params: SheenParams
): number {
  const radians = degToRad(params.angle);
  const A = Math.cos(radians);
  const B = Math.sin(radians);
  const sweep = frame * params.speed;
  const C = -sweep + (A * width + B * height) * -0.5;
  const distance = lineDistance(A, B, C, { x, y });
  if (distance > params.thickness / 2) {
    return 0;
  }
  return 1 - distance / (params.thickness / 2 || 1);
}
