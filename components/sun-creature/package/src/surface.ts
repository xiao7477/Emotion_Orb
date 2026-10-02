/**
 * Lightweight spherical projection adapted from the SkullOrb surface model.
 * Facial paths are built on a unit sphere before they are rotated and projected.
 */
export type Point = [number, number];
export type Vec3 = [number, number, number];

const camera = 5;
const scale = (128 * Math.sqrt(camera * camera - 1)) / camera;

export function rotateSurface([x, y]: Point, yaw: number, pitch: number): Vec3 {
  const z = Math.sqrt(Math.max(0.0001, 1 - x * x - y * y));
  const xx = x * Math.cos(yaw) + z * Math.sin(yaw);
  const zz = z * Math.cos(yaw) - x * Math.sin(yaw);
  return [
    xx,
    y * Math.cos(pitch) + zz * Math.sin(pitch),
    zz * Math.cos(pitch) - y * Math.sin(pitch),
  ];
}

export function rotatePoint([x, y, z]: Vec3, yaw: number, pitch: number): Vec3 {
  const xx = x * Math.cos(yaw) + z * Math.sin(yaw);
  const zz = z * Math.cos(yaw) - x * Math.sin(yaw);
  return [
    xx,
    y * Math.cos(pitch) + zz * Math.sin(pitch),
    zz * Math.cos(pitch) - y * Math.sin(pitch),
  ];
}

export function projectPoint([x, y, z]: Vec3): Point {
  const k = (scale * camera) / (camera - z);
  return [160 + x * k, 160 + y * k];
}

export function pathFrom3D(points: Vec3[], yaw: number, pitch: number): string {
  const projected = points.map((point) => projectPoint(rotatePoint(point, yaw, pitch)));
  return projected
    .map(([x, y], index) => `${index ? "L" : "M"}${x.toFixed(2)} ${y.toFixed(2)}`)
    .join(" ") + "Z";
}

export function projectPatch(points: Point[], yaw: number, pitch: number): string {
  const vertices = points.map((point) => rotateSurface(point, yaw, pitch));
  const near: Vec3[] = [];
  const horizon = 1 / camera;
  for (let i = 0; i < vertices.length; i++) {
    const a = vertices[i];
    const b = vertices[(i + 1) % vertices.length];
    if (a[2] >= horizon) near.push(a);
    if ((a[2] >= horizon) !== (b[2] >= horizon)) {
      const t = (horizon - a[2]) / (b[2] - a[2]);
      near.push([
        a[0] + (b[0] - a[0]) * t,
        a[1] + (b[1] - a[1]) * t,
        horizon,
      ]);
    }
  }
  const area = near.reduce((sum, a, i) => {
    const b = near[(i + 1) % near.length];
    return sum + a[0] * b[1] - b[0] * a[1];
  }, 0);
  if (area < 0) near.reverse();
  return near.length
    ? near
        .map((point, index) => {
          const [x, y] = projectPoint(point);
          return `${index ? "L" : "M"}${x.toFixed(2)} ${y.toFixed(2)}`;
        })
        .join(" ") + "Z"
    : "";
}

export function uniformSphereDirections(count: number): Vec3[] {
  const goldenAngle = Math.PI * (3 - Math.sqrt(5));
  const directions = Array.from({ length: count }, (_, index): Vec3 => {
    const z = 1 - (2 * (index + 0.5)) / count;
    const radius = Math.sqrt(1 - z * z);
    const angle = index * goldenAngle;
    return [Math.cos(angle) * radius, Math.sin(angle) * radius, z];
  });
  const frontIndex = directions.reduce(
    (best, direction, index) => (direction[2] > directions[best][2] ? index : best),
    0,
  );
  const source = directions[frontIndex];
  const axisLength = Math.hypot(source[0], source[1]);
  if (axisLength < 1e-8) return directions;
  const axis: Vec3 = [source[1] / axisLength, -source[0] / axisLength, 0];
  const cosine = source[2];
  const sine = axisLength;
  return directions.map((vector) => {
    const cross: Vec3 = [
      axis[1] * vector[2] - axis[2] * vector[1],
      axis[2] * vector[0] - axis[0] * vector[2],
      axis[0] * vector[1] - axis[1] * vector[0],
    ];
    const dot = axis[0] * vector[0] + axis[1] * vector[1] + axis[2] * vector[2];
    const amount = dot * (1 - cosine);
    return [
      vector[0] * cosine + cross[0] * sine + axis[0] * amount,
      vector[1] * cosine + cross[1] * sine + axis[1] * amount,
      vector[2] * cosine + cross[2] * sine + axis[2] * amount,
    ];
  });
}

export function makeCone(
  direction: Vec3,
  halfAngle: number,
  height: number,
  segments = 8,
  tipAxis: Vec3 = direction,
): { ring: Vec3[]; triangles: Vec3[][] } {
  const up: Vec3 = Math.abs(direction[1]) > 0.94 ? [1, 0, 0] : [0, 1, 0];
  const cross: Vec3 = [
    direction[1] * up[2] - direction[2] * up[1],
    direction[2] * up[0] - direction[0] * up[2],
    direction[0] * up[1] - direction[1] * up[0],
  ];
  const length = Math.hypot(...cross);
  const tangent: Vec3 = [cross[0] / length, cross[1] / length, cross[2] / length];
  const bitangent: Vec3 = [
    direction[1] * tangent[2] - direction[2] * tangent[1],
    direction[2] * tangent[0] - direction[0] * tangent[2],
    direction[0] * tangent[1] - direction[1] * tangent[0],
  ];
  const ring = Array.from({ length: segments }, (_, index): Vec3 => {
    const angle = (index / segments) * Math.PI * 2;
    const along: Vec3 = [
      tangent[0] * Math.cos(angle) + bitangent[0] * Math.sin(angle),
      tangent[1] * Math.cos(angle) + bitangent[1] * Math.sin(angle),
      tangent[2] * Math.cos(angle) + bitangent[2] * Math.sin(angle),
    ];
    return [
      direction[0] * Math.cos(halfAngle) + along[0] * Math.sin(halfAngle),
      direction[1] * Math.cos(halfAngle) + along[1] * Math.sin(halfAngle),
      direction[2] * Math.cos(halfAngle) + along[2] * Math.sin(halfAngle),
    ];
  });
  const axisLength = Math.hypot(...tipAxis);
  const axis: Vec3 = [tipAxis[0] / axisLength, tipAxis[1] / axisLength, tipAxis[2] / axisLength];
  const tip: Vec3 = [
    direction[0] * Math.cos(halfAngle) + axis[0] * height,
    direction[1] * Math.cos(halfAngle) + axis[1] * height,
    direction[2] * Math.cos(halfAngle) + axis[2] * height,
  ];
  return {
    ring,
    triangles: ring.map((point, index) => [point, ring[(index + 1) % segments], tip]),
  };
}

export function ellipse(
  cx: number,
  cy: number,
  rx: number,
  ry = rx,
  count = 56,
): Point[] {
  return Array.from({ length: count }, (_, index) => {
    const angle = (index / count) * Math.PI * 2;
    return [cx + Math.cos(angle) * rx, cy + Math.sin(angle) * ry];
  });
}

export function curve(
  cx: number,
  cy: number,
  width: number,
  bend: number,
  tilt = 0,
): Point[] {
  return Array.from({ length: 33 }, (_, index) => {
    const sweep = Math.PI / 3;
    const angle = ((index / 32) * 2 - 1) * sweep;
    const x = Math.sin(angle) / Math.sin(sweep);
    const y = (Math.cos(angle) - Math.cos(sweep)) / (1 - Math.cos(sweep));
    return [cx + x * width, cy + y * bend + x * tilt];
  });
}

/** Expand a line into a rounded surface patch before projection. */
export function ribbon(points: Point[], radius: number): Point[] {
  const angles = points.map((_, index) => {
    const a = points[Math.max(0, index - 1)];
    const b = points[Math.min(points.length - 1, index + 1)];
    return Math.atan2(b[1] - a[1], b[0] - a[0]);
  });
  const side = (index: number, sign: number): Point => [
    points[index][0] - Math.sin(angles[index]) * radius * sign,
    points[index][1] + Math.cos(angles[index]) * radius * sign,
  ];
  const outline = points.map((_, index) => side(index, 1));
  const end = points.at(-1)!;
  for (let index = 1; index <= 10; index++) {
    const angle = angles.at(-1)! + Math.PI / 2 - (index * Math.PI) / 10;
    outline.push([
      end[0] + Math.cos(angle) * radius,
      end[1] + Math.sin(angle) * radius,
    ]);
  }
  for (let index = points.length - 1; index >= 0; index--) {
    outline.push(side(index, -1));
  }
  for (let index = 1; index <= 10; index++) {
    const angle = angles[0] - Math.PI / 2 - (index * Math.PI) / 10;
    outline.push([
      points[0][0] + Math.cos(angle) * radius,
      points[0][1] + Math.sin(angle) * radius,
    ]);
  }
  return outline;
}

export function scaleAround(points: Point[], cx: number, cy: number, amount: number): Point[] {
  return points.map(([x, y]) => [cx + (x - cx) * amount, cy + (y - cy) * amount]);
}
