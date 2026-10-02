import type { FacePose } from "./geometry";
export interface HandFace {
    d: string;
    fill: string;
    opacity: number;
    depth: number;
    stroke?: string;
}
export declare const HAND_FACE_COUNT: number;
export declare function skullHeadTransform(pose: FacePose): string;
/** Every gesture uses the same continuous hand shell and mask material. */
export declare function skullHandGeometry(pose: FacePose, yaw?: number, pitch?: number, wave?: number, palmSway?: number): HandFace[];
