import { distanceToLine } from "../core/math_utils";

export interface SheenParams {
  angle: number;
  speed: number;
  thickness: number;
}

export const sheenIntensity = (
  x: number,
  y: number,
  frame: number,
  { angle, speed, thickness }: SheenParams,
): number => {
  const radians = (angle * Math.PI) / 180;
  const A = Math.cos(radians);
  const B = Math.sin(radians);
  const C = -(frame * speed);
  const distance = distanceToLine({ x, y }, { A, B, C });

  return distance <= thickness ? 1 - distance / Math.max(thickness, 1) : 0;
};
