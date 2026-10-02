import type { PointerSignal } from "../core/types";
export type RawPointer = {
    x: number;
    y: number;
    speed: number;
    present: boolean;
    pressed: boolean;
    stamp: number;
};
export declare const emptyPointer: RawPointer;
export declare function normalizePointer(raw: RawPointer, rect: {
    left: number;
    top: number;
    width: number;
    height: number;
}, now: number): PointerSignal;
