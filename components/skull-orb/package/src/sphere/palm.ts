import { project, ribbon, type Point, type Vec3 } from "./geometry";
import { rotatePoint } from "./volume";
import { skullMaterial } from "./material";
import type { HandFace } from "./hands";

// The approved one-piece drawing is sampled once and extruded in local 3D space.
const outlinePath =
  "M 151 441 Q 140 421 132 393 Q 110 323 101 253 L 94 184 Q 94 181 98 179 Q 119 167 141 163 L 140 146 Q 140 143 144 142 Q 170 132 201 129 L 200 115 Q 200 112 204 112 Q 235 107 268 110 Q 271 110 271 114 L 271 125 Q 302 124 329 132 Q 332 133 331 137 L 311 265 L 340 276 Q 344 278 343 282 L 326 420 Q 326 425 321 426 L 155 443 Q 152 443 151 441 Z";
const foldPaths = [
  "M141 163 Q148 208 150 250",
  "M201 129 Q207 185 205 241",
  "M271 125 Q269 183 260 241",
  "M311 265 L281 254 Q277 252 275 257 L263 296 Q262 300 267 300 Q285 300 297 307",
  "M297 307 Q262 316 238 347",
];
function sample(d: string): Point[] {
  const tokens = d.match(/[MLQZ]|-?\d+(?:\.\d+)?/g)!;
  let i = 0,
    p: Point = [0, 0];
  const out: Point[] = [];
  const pair = (): Point => [+tokens[i++], +tokens[i++]];
  while (i < tokens.length) {
    const c = tokens[i++];
    if (c === "M" || c === "L") {
      const end = pair();
      const steps =
        c === "M"
          ? 1
          : Math.max(
              1,
              Math.ceil(Math.hypot(end[0] - p[0], end[1] - p[1]) / 10),
            );
      const start = p;
      for (let j = 1; j <= steps; j++)
        out.push([
          start[0] + ((end[0] - start[0]) * j) / steps,
          start[1] + ((end[1] - start[1]) * j) / steps,
        ]);
      p = end;
    } else if (c === "Q") {
      const a = p,
        b = pair(),
        e = pair();
      for (let j = 1; j <= 10; j++) {
        const t = j / 10,
          u = 1 - t;
        out.push([
          u * u * a[0] + 2 * u * t * b[0] + t * t * e[0],
          u * u * a[1] + 2 * u * t * b[1] + t * t * e[1],
        ]);
      }
      p = e;
    }
  }
  return out.map(([x, y]) => [(x - 230) / 190, (y - 275) / 190]);
}
const outline = sample(outlinePath);
const folds = foldPaths.map((d) => ribbon(sample(d), 0.008));
export const PALM_FACE_COUNT = 5;

/** One continuous shell per hand. Each point rotates in 3D before perspective. */
export function palmGeometry(
  side: -1 | 1,
  amount: number,
  yaw: number,
  pitch: number,
  gesture: "shrug" | "raise" = "shrug",
  motion = 0,
): HandFace[] {
  const size = (gesture === "raise" ? 0.48 : 0.4) * (0.32 + 0.68 * amount),
    mirror = -side;
  // A palm-up frame: fingers extend to the sides, the normal faces up/toward camera.
  // The thumb sits on the upper edge, and the fingertips curl upward slightly.
  const across: Vec3 = [-0.242, side * 0.461, side * 0.854];
  const wrist: Vec3 = [-side * 0.97, -0.115, -0.213];
  const palmNormal: Vec3 = [0, -0.88, 0.475];
  function world([x, y]: Point, z: number): Vec3 {
    const xx = x * mirror;
    if (gesture === "raise") {
      const tilted = rotatePoint([xx, y, z], side * 0.24, -0.08);
      const roll = side * 0.1 + motion * 0.24,
        c = Math.cos(roll),
        s = Math.sin(roll);
      return rotatePoint(
        [
          side * 0.91 + size * (tilted[0] * c - tilted[1] * s),
          -0.38 -
            motion * 0.035 +
            (1 - amount) * 1.05 +
            size * (tilted[0] * s + tilted[1] * c),
          0.96 + size * tilted[2],
        ],
        yaw * 0.32,
        pitch * 0.32,
      );
    }
    const curvedZ = z + 0.1 * Math.max(0, -y - 0.15) ** 2;
    const dx = size * (xx * across[0] + y * wrist[0] + curvedZ * palmNormal[0]);
    const dy = size * (xx * across[1] + y * wrist[1] + curvedZ * palmNormal[1]);
    const angle = -side * motion * 0.13;
    const c = Math.cos(angle),
      s = Math.sin(angle);
    return rotatePoint(
      [
        side * 0.86 + dx * c - dy * s,
        0.34 - motion * 0.018 + (1 - amount) * 0.48 + dx * s + dy * c,
        1.04 + size * (xx * across[2] + y * wrist[2] + curvedZ * palmNormal[2]),
      ],
      yaw * 0.42,
      pitch * 0.42,
    );
  }
  function path(vertices: Vec3[]): string {
    return amount < 0.0001 || vertices.length < 3
      ? ""
      : vertices
          .map(
            (v, i) =>
              `${i ? "L" : "M"}${project(v)
                .map((n) => n.toFixed(3))
                .join(" ")}`,
          )
          .join(" ") + "Z";
  }
  const front = outline.map((p) => world(p, 0.1)),
    back = outline.map((p) => world(p, -0.1));
  let dark = "",
    light = "";
  for (let i = 0; i < front.length; i++) {
    const j = (i + 1) % front.length,
      a = front[i],
      b = front[j],
      c = back[j];
    const u = b.map((n, k) => n - a[k]),
      v = c.map((n, k) => n - a[k]);
    const normal = [
      u[1] * v[2] - u[2] * v[1],
      u[2] * v[0] - u[0] * v[2],
      u[0] * v[1] - u[1] * v[0],
    ].map((n) => -n * mirror);
    const facing =
      normal[0] * -a[0] + normal[1] * -a[1] + normal[2] * (5 - a[2]);
    if (facing <= 0) continue;
    const d = path([a, b, c, back[i]]);
    // The same upper-left light direction and gray side tones as the mask.
    if (-normal[0] - 0.8 * normal[1] + 0.2 * normal[2] > 0) light += d;
    else dark += d;
  }
  const origin = world([0, 0], 0.1),
    xAxis = world([1, 0], 0.1).map((n, i) => n - origin[i]),
    yAxis = world([0, 1], 0.1).map((n, i) => n - origin[i]);
  const normal = [
    xAxis[1] * yAxis[2] - xAxis[2] * yAxis[1],
    xAxis[2] * yAxis[0] - xAxis[0] * yAxis[2],
    xAxis[0] * yAxis[1] - xAxis[1] * yAxis[0],
  ].map((n) => n * mirror);
  const frontVisible =
    normal[0] * -origin[0] +
      normal[1] * -origin[1] +
      normal[2] * (5 - origin[2]) >
    0;
  const depth = front.reduce((sum, p) => sum + p[2], 0) / front.length;
  const face = (d: string, fill: string, layer: number): HandFace => ({
    d,
    fill,
    depth: depth + layer * 0.00001,
    opacity: amount,
    stroke: "none",
  });
  return [
    face(path(back), frontVisible ? skullMaterial.edge : "mask", 0),
    face(dark, skullMaterial.side, 1),
    face(light, skullMaterial.sideLight, 2),
    face(frontVisible ? path(front) : "", "mask", 3),
    face(
      (frontVisible ? folds : [])
        .map((points) => path(points.map((p) => world(p, 0.101))))
        .join(""),
      skullMaterial.crease,
      4,
    ),
  ];
}
