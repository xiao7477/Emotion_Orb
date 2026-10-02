/** Light stays in view space while the shared hood silhouette turns underneath it.
 * The soft bands are carved INSIDE the silhouette, so they neither inflate it
 * nor draw a constant-width outline around the mask or the lightning joints.
 */
export declare function PortraitLightingDefs({ id, silhouette }: {
    id: string;
    silhouette: string;
}): import("react").JSX.Element;
export declare function PortraitLighting({ id, opacity }: {
    id: string;
    opacity: number;
}): import("react").JSX.Element;
