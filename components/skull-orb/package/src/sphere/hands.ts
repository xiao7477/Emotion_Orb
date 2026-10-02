import type { FacePose } from "./geometry";
import { palmGeometry, PALM_FACE_COUNT } from "./palm";

export interface HandFace {
  d: string;
  fill: string;
  opacity: number;
  depth: number;
  stroke?: string;
}
const clamp = (n: number) => Math.max(0, Math.min(1, n));
export const HAND_FACE_COUNT = 3 * PALM_FACE_COUNT;
const emptyFaces: HandFace[] = Array.from({ length: HAND_FACE_COUNT }, () => ({
  d: "",
  fill: "mask",
  opacity: 0,
  depth: 0,
  stroke: "none",
}));

export function skullHeadTransform(pose: FacePose): string {
  const shrug = clamp(pose.shrug),
    raise = clamp(pose.raise);
  const scale = 1 - 0.25 * shrug - 0.18 * raise;
  return `translate(${(160 + 8 * raise).toFixed(5)} ${(160 - 20 * shrug).toFixed(5)}) scale(${scale.toFixed(5)}) translate(-160 -160)`;
}

/** Every gesture uses the same continuous hand shell and mask material. */
export function skullHandGeometry(
  pose: FacePose,
  yaw = 0,
  pitch = 0,
  wave = 0,
  palmSway = 0,
): HandFace[] {
  if (pose.shrug < 0.0001 && pose.raise < 0.0001) return emptyFaces;
  return [
    ...palmGeometry(-1, clamp(pose.shrug), yaw, pitch, "shrug", palmSway),
    ...palmGeometry(1, clamp(pose.shrug), yaw, pitch, "shrug", palmSway),
    ...palmGeometry(-1, clamp(pose.raise), yaw, pitch, "raise", wave),
  ].sort((a, b) => a.depth - b.depth);
}
