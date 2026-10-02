import { type Point, type Vec3 } from "./geometry";
export declare function rotatePoint([x, y, z]: Vec3, yaw: number, pitch: number): Vec3;
export declare function sphereClearance([x, y, z]: Vec3): number;
export declare function volumePath(points: Vec3[], yaw: number, pitch: number, occlude?: boolean): string;
export declare function maskDepth(x: number, y: number): number;
export declare function maskPoint([x, y]: Point, depth?: number): Vec3;
