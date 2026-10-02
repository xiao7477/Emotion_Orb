/**
 * Lightweight spherical projection adapted from the SkullOrb surface model.
 * Facial paths are built on a unit sphere before they are rotated and projected.
 */
export type Point = [number, number];
export type Vec3 = [number, number, number];
export declare function rotateSurface([x, y]: Point, yaw: number, pitch: number): Vec3;
export declare function rotatePoint([x, y, z]: Vec3, yaw: number, pitch: number): Vec3;
export declare function projectPoint([x, y, z]: Vec3): Point;
export declare function pathFrom3D(points: Vec3[], yaw: number, pitch: number): string;
export declare function projectPatch(points: Point[], yaw: number, pitch: number): string;
export declare function uniformSphereDirections(count: number): Vec3[];
export declare function makeCone(direction: Vec3, halfAngle: number, height: number, segments?: number, tipAxis?: Vec3): {
    ring: Vec3[];
    triangles: Vec3[][];
};
export declare function ellipse(cx: number, cy: number, rx: number, ry?: number, count?: number): Point[];
export declare function curve(cx: number, cy: number, width: number, bend: number, tilt?: number): Point[];
/** Expand a line into a rounded surface patch before projection. */
export declare function ribbon(points: Point[], radius: number): Point[];
export declare function scaleAround(points: Point[], cx: number, cy: number, amount: number): Point[];
