import { type CSSProperties } from "react";
import { type SunCreatureEmotion } from "./expressions";
import "./sun-creature.css";
export type { SunCreatureEmotion } from "./expressions";
export interface SunCreatureProps {
    emotion?: SunCreatureEmotion;
    size?: number | string;
    followPointer?: boolean;
    reducedMotion?: boolean;
    decorative?: boolean;
    className?: string;
    style?: CSSProperties;
}
/** A spherical sun character: evenly spaced raised cones, a cone nose, and carved facial features. */
export declare function SunCreature({ emotion, size, followPointer, reducedMotion, decorative, className, style, }: SunCreatureProps): import("react").JSX.Element;
