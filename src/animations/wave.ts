import { sineOffset } from "../core/math_utils";

export interface WaveParams {
  amplitude: number;
  speed: number;
  stagger: number;
}

export const waveOffset = (
  t: number,
  index: number,
  params: WaveParams,
): number => sineOffset(t, index, params.amplitude, params.speed, params.stagger);
