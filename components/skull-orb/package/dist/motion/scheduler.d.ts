import { type RawPointer } from "../interaction/pointer";
type Subscriber = (dt: number, now: number, pointer: RawPointer) => void;
export declare function subscribeFrame(fn: Subscriber): () => void;
export {};
