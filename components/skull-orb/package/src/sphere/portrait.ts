import { project, type Point, type Vec3 } from "./geometry";
import { rotatePoint } from "./volume";

// Coordinates follow the supplied upper-body reference, then become projected SVG points.
// The drawing stays vector-only; the face is still the existing rotating mask geometry.
type Command =
  | ["M" | "L", number, number]
  | ["Q", number, number, number, number]
  | ["C", number, number, number, number, number, number]
  | ["Z"];
const body: Command[] = [
  ["M", 155, 342],
  ["L", 225, 321],
  ["L", 387, 323],
  ["L", 352, 352],
  ["L", 383, 369],
  ["Q", 351, 391, 363, 446],
  ["C", 372, 540, 417, 695, 452, 782],
  ["L", 570, 739],
  ["C", 535, 810, 458, 900, 421, 928],
  ["L", 185, 932],
  ["C", 136, 902, 95, 856, 60, 837],
  ["L", 181, 822],
  ["Q", 174, 657, 172, 522],
  ["L", 155, 342],
  ["Z"],
];
// Trace the whole bolt as one serpentine silhouette. Separate touching polygons
// left antialiased gaps at the turns, especially when the character rotated.
const lightning: Command[] = [
  ["M", 500, 74],
  ["L", 280, 174],
  ["L", 399, 231],
  ["L", 221, 241],
  ["L", 319, 331],
  ["L", 229, 339],
  ["L", 153, 234],
  ["L", 322, 229],
  ["L", 174, 163],
  ["Z"],
];
const sourceToWorld = (x: number, y: number, z: number): Vec3 => {
  const screenX = 160 + (x - 305) * 0.54;
  const compressedY = y < 558 ? 558 + (y - 558) * 0.7 : y;
  const screenY = 73 + (compressedY - 558) * 0.54;
  const projectedScale = (128 * Math.sqrt(24)) / 5.2;
  return [
    (screenX - 160) / projectedScale,
    (screenY - 160) / projectedScale,
    z,
  ];
};
function draw(commands: Command[], yaw: number, pitch: number, z: number) {
  const point = (x: number, y: number): Point =>
    project(rotatePoint(sourceToWorld(x, y, z), yaw * 0.22, pitch * 0.16));
  return commands
    .map((command) => {
      if (command[0] === "Z") return "Z";
      const pairs = command.slice(1) as number[];
      const coordinates: string[] = [];
      for (let i = 0; i < pairs.length; i += 2) {
        const p = point(pairs[i], pairs[i + 1]);
        coordinates.push(`${p[0].toFixed(3)} ${p[1].toFixed(3)}`);
      }
      return command[0] + coordinates.join(" ");
    })
    .join(" ");
}
export const skullHoodGeometry = (yaw = 0, pitch = 0) =>
  draw(body, yaw, pitch, -0.2);
export const skullPortraitLightning = (yaw = 0, pitch = 0) =>
  draw(lightning, yaw, pitch, -0.2);
export const skullPortraitViewBox = (amount: number) => {
  const top = -44 - 86 * amount;
  return `-24 ${top.toFixed(3)} 368 ${(380 - top).toFixed(3)}`;
};
export const skullPortraitFaceTransform = (amount: number) => {
  const scale = 1 - 0.25 * amount;
  return `translate(160 160) scale(${scale.toFixed(5)}) translate(-160 -160)`;
};
