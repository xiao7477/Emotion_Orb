/** Shared white shell material for the mask and the continuous palms. */
export const skullMaterial = {
  front: "#f5f5f6",
  highlight: "#ffffff",
  midtone: "#f4f4f5",
  shadow: "#c9cbd0",
  side: "#969ba5",
  sideLight: "#c5c9d1",
  edge: "#96999f",
  crease: "#777d89",
} as const;
export function handFill(fill: string, id: string, shading: boolean): string {
  return fill === "mask"
    ? shading
      ? `url(#${id}-mask)`
      : skullMaterial.front
    : fill;
}
