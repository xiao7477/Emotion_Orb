import { type CSSProperties } from "react";
import { type SphereEmotion, type FacePose } from "./geometry";
export type SphereAppearance = "sphere" | "skull";
export interface SphereEmojiProps {
    appearance?: SphereAppearance;
    /** Show the dedicated upper-body skull silhouette across its expressions. */
    portrait?: boolean;
    emotion?: SphereEmotion;
    size?: number | string;
    followPointer?: boolean;
    reducedMotion?: boolean;
    paused?: boolean;
    /** Increment to replay the current emotion's full action, including on repeated clicks. */
    playKey?: number;
    shading?: boolean;
    /** Optional manual viewing angles, in degrees. */
    yaw?: number;
    pitch?: number;
    decorative?: boolean;
    className?: string;
    style?: CSSProperties;
}
/** Pure SVG artwork. No bitmap textures or filter-based facial warping. */
export declare function SphereArtwork({ pose, yaw, pitch, shading, id, decorative, appearance, }: {
    pose: FacePose;
    appearance?: SphereAppearance;
    yaw?: number;
    pitch?: number;
    shading?: boolean;
    id?: string;
    decorative?: boolean;
}): import("react").JSX.Element;
export declare function SphereEmoji({ emotion, appearance, portrait, size, followPointer, reducedMotion, paused, playKey, shading, yaw, pitch, decorative, className, style, }: SphereEmojiProps): import("react").JSX.Element;
