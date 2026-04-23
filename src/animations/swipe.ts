import { clamp, radialDistance } from "../core/math_utils";

export type SwipeDirection = "left_to_right" | "right_to_left" | "top_to_bottom" | "bottom_to_top" | "radial";
export type SwipeAction = "reveal" | "conceal";

export type SwipeParams = {
  direction: SwipeDirection;
  action: SwipeAction;
  speed: number;
  edgeDecay: boolean;
};

export function computeSwipeDensity(
  x: number,
  y: number,
  frame: number,
  width: number,
  height: number,
  params: SwipeParams
): number {
  const progress = frame * params.speed;
  let boundaryDistance = 0;

  switch (params.direction) {
    case "left_to_right":
      boundaryDistance = x - progress;
      break;
    case "right_to_left":
      boundaryDistance = width - x - progress;
      break;
    case "top_to_bottom":
      boundaryDistance = y - progress;
      break;
    case "bottom_to_top":
      boundaryDistance = height - y - progress;
      break;
    case "radial": {
      const maxRadius = Math.sqrt((width * width) / 4 + (height * height) / 4);
      boundaryDistance = radialDistance({ x, y }, { x: width / 2, y: height / 2 }) - Math.min(progress, maxRadius);
      break;
    }
  }

  const visible = params.action === "reveal" ? boundaryDistance <= 0 : boundaryDistance > 0;

  if (!params.edgeDecay) {
    return visible ? 1 : 0;
  }

  const decayLength = 3;
  const soft = clamp(1 - Math.abs(boundaryDistance) / decayLength, 0, 1);
  if (params.action === "reveal") {
    return visible ? 1 : soft;
  }
  return visible ? 1 : soft;
}
