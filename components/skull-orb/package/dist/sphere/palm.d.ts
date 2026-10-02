import type { HandFace } from "./hands";
export declare const PALM_FACE_COUNT = 5;
/** One continuous shell per hand. Each point rotates in 3D before perspective. */
export declare function palmGeometry(side: -1 | 1, amount: number, yaw: number, pitch: number, gesture?: "shrug" | "raise", motion?: number): HandFace[];
