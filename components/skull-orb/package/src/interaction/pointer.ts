import { clamp } from "../core/state";
import type { PointerSignal } from "../core/types";
export type RawPointer = {
  x: number;
  y: number;
  speed: number;
  present: boolean;
  pressed: boolean;
  stamp: number;
};
export const emptyPointer: RawPointer = {
  x: 0,
  y: 0,
  speed: 0,
  present: false,
  pressed: false,
  stamp: 0,
};
export function normalizePointer(
  raw: RawPointer,
  rect: { left: number; top: number; width: number; height: number },
  now: number,
): PointerSignal {
  const radius = Math.max(20, Math.min(rect.width, rect.height) * 0.33);
  const dx = raw.x - rect.left - rect.width / 2,
    dy = raw.y - rect.top - rect.height / 2;
  const distance = raw.present ? Math.hypot(dx, dy) : Infinity;
  return {
    x: raw.x,
    y: raw.y,
    normalizedX: raw.present ? clamp(dx / (radius * 2), -1, 1) : 0,
    normalizedY: raw.present ? clamp(dy / (radius * 2), -1, 1) : 0,
    distance,
    speed: now - raw.stamp < 100 ? raw.speed : 0,
    isNear: distance < radius * 2.8,
    isInside: distance < radius,
    isPressed: raw.pressed && distance < radius,
  };
}
