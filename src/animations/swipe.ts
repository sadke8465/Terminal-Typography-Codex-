import { clamp } from "../core/math_utils";

export interface SwipeParams {
  progress: number;
  edgeDecay: boolean;
}

export const swipeMask = (
  x: number,
  width: number,
  { progress, edgeDecay }: SwipeParams,
): number => {
  const boundary = clamp(progress, 0, 1) * width;
  if (x <= boundary) return 1;
  if (!edgeDecay) return 0;

  const decayDistance = 3;
  const delta = x - boundary;
  return clamp(1 - delta / decayDistance, 0, 1);
};
