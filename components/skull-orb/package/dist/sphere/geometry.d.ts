/** Face patches live on a unit sphere. Camera is at (0,0,5). */
export type Point = [number, number];
export type Vec3 = [number, number, number];
export declare const sphereEmotions: readonly ["idle", "smile", "laugh", "surprised", "curious", "thinking"];
export type SphereEmotion = (typeof sphereEmotions)[number] | "sad" | "serious" | "stalled" | "crashed" | "raise";
export declare const sphereLabels: Record<SphereEmotion, string>;
export type FacePose = {
    eyeLength: number;
    eyeBend: number;
    eyeRadius: number;
    leftY: number;
    rightY: number;
    mouthWidth: number;
    mouthCurve: number;
    mouthOpen: number;
    mouthRound: number;
    mouthTilt: number;
    brow: number;
    browTilt: number;
    hand: number;
    shrug: number;
    raise: number;
    sad: number;
    serious: number;
    stalled: number;
    crashed: number;
    hood: number;
};
export declare const spherePoses: Record<SphereEmotion, FacePose>;
export declare function rotateSurface([x, y]: Point, yaw: number, pitch: number, radius?: number): Vec3;
export declare function project([x, y, z]: Vec3): Point;
/** Clip against the visible spherical cap before projection, including horizon intersections. */
export declare function projectPatch(points: Point[], yaw: number, pitch: number, radius?: number): string;
export declare function circle(cx: number, cy: number, rx: number, ry?: number): Point[];
/** Expand rounded strokes into filled ribbons BEFORE projection so their width foreshortens too. */
export declare function ribbon(points: Point[], radius: number): Point[];
export declare function faceGeometry(p: FacePose, yaw?: number, pitch?: number, blink?: number): {
    left: string;
    right: string;
    leftPupil: string;
    rightPupil: string;
    mouth: string;
    leftBrow: string;
    rightBrow: string;
    hand: string;
};
