import { project, type Point, type Vec3 } from "./geometry";
export function rotatePoint([x, y, z]: Vec3, yaw: number, pitch: number): Vec3 {
  const xx = x * Math.cos(yaw) + z * Math.sin(yaw),
    zz = z * Math.cos(yaw) - x * Math.sin(yaw);
  return [
    xx,
    y * Math.cos(pitch) + zz * Math.sin(pitch),
    zz * Math.cos(pitch) - y * Math.sin(pitch),
  ];
}
// Positive when the point is in front of the first intersection with the black sphere.
export function sphereClearance([x, y, z]: Vec3): number {
  const dz = z - 5,
    a = x * x + y * y + dz * dz,
    b = 10 * dz,
    c = 24;
  const discriminant = b * b - 4 * a * c;
  if (discriminant <= 0) return 0.01;
  const near = (-b - Math.sqrt(discriminant)) / (2 * a);
  return near - 1;
}
export function volumePath(
  points: Vec3[],
  yaw: number,
  pitch: number,
  occlude = true,
): string {
  const vertices = points.map((p) => rotatePoint(p, yaw, pitch));
  const visible: Vec3[] = [];
  for (let i = 0; i < vertices.length; i++) {
    const a = vertices[i],
      b = vertices[(i + 1) % vertices.length];
    const av = !occlude || sphereClearance(a) >= -0.00001,
      bv = !occlude || sphereClearance(b) >= -0.00001;
    if (av) visible.push(a);
    if (av !== bv) {
      let lo = 0,
        hi = 1;
      for (let j = 0; j < 18; j++) {
        const t = (lo + hi) / 2;
        const p: Vec3 = [
          a[0] + (b[0] - a[0]) * t,
          a[1] + (b[1] - a[1]) * t,
          a[2] + (b[2] - a[2]) * t,
        ];
        if (sphereClearance(p) >= -0.00001 === av) lo = t;
        else hi = t;
      }
      const t = (lo + hi) / 2;
      visible.push([
        a[0] + (b[0] - a[0]) * t,
        a[1] + (b[1] - a[1]) * t,
        a[2] + (b[2] - a[2]) * t,
      ]);
    }
  }
  return visible.length >= 3
    ? visible
        .map(
          (p, i) =>
            `${i ? "L" : "M"}${project(p)
              .map((n) => n.toFixed(3))
              .join(" ")}`,
        )
        .join(" ") + "Z"
    : "";
}
export function maskDepth(x: number, y: number): number {
  // The lower shell departs from the sphere: the fangs extend downward AND forward.
  const surfaceY = Math.min(y, 0.28);
  return (
    Math.sqrt(Math.max(0.12, 1 - x * x - surfaceY * surfaceY)) +
    0.11 +
    Math.max(0, y - 0.28) * 0.24
  );
}
export function maskPoint([x, y]: Point, depth = 0): Vec3 {
  return [x, y, maskDepth(x, y) + depth];
}
