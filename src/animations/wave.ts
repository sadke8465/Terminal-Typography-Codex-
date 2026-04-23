import { sineOffset } from "../core/math_utils";

export type WaveParams = {
  amplitude: number;
  speed: number;
  stagger: number;
  easing?: number;
};

export function computeWaveOffset(indexX: number, time: number, params: WaveParams): number {
  const phase = indexX * params.stagger;
  const base = sineOffset(time, params.amplitude, params.speed, phase);
  if (params.easing === undefined) {
    return base;
  }
  return base * Math.exp(-Math.abs(params.easing) * time * 0.01);
}
