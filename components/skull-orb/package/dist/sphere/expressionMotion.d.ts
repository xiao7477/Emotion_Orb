import type { SphereEmotion } from "./geometry";
export interface ExpressionMotion {
    yaw: number;
    pitch: number;
    bob: number;
    roll: number;
    scale: number;
    gazeX: number;
    gazeY: number;
    leftX: number;
    rightX: number;
    leftY: number;
    rightY: number;
    leftEye: number;
    rightEye: number;
    eyeScale: number;
    mouthScale: number;
    blink: number;
    handAmount: number;
    raiseAmount: number;
    palmSway: number;
    wave: number;
    alert: number;
}
export declare const expressionDuration = 2.7;
export declare function expressionMotion(emotion: SphereEmotion, elapsed: number): ExpressionMotion;
