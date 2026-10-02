export declare const clamp: (n: number, min?: number, max?: number) => number;
export type Spring = {
    value: number;
    velocity: number;
};
export declare function advanceSpring(spring: Spring, target: number, dt: number, stiffness: number, damping: number): number;
