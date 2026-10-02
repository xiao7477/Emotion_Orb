/** Face patches live on a unit sphere. Camera is at (0,0,5). */
export type Point = [number, number];
export type Vec3 = [number, number, number];
export const sphereEmotions = [
  "idle",
  "smile",
  "laugh",
  "surprised",
  "curious",
  "thinking",
] as const;
export type SphereEmotion =
  | (typeof sphereEmotions)[number]
  | "sad"
  | "serious"
  | "stalled"
  | "crashed"
  | "raise";
export const sphereLabels: Record<SphereEmotion, string> = {
  idle: "平静",
  smile: "微笑",
  laugh: "大笑",
  surprised: "惊讶",
  curious: "疑惑",
  thinking: "思考",
  sad: "低落",
  serious: "严肃",
  stalled: "卡顿",
  crashed: "死机",
  raise: "举手示意",
};
export type FacePose = {
  eyeLength: number;
  eyeBend: number;
  eyeRadius: number;
  leftY: number;
  rightY: number;
  mouthWidth: number;
  mouthCurve: number;
  mouthOpen: number;
  mouthRound: number;
  mouthTilt: number;
  brow: number;
  browTilt: number;
  hand: number;
  shrug: number;
  raise: number;
  sad: number;
  serious: number;
  stalled: number;
  crashed: number;
  hood: number;
};
const neutral: FacePose = {
  eyeLength: 0,
  eyeBend: 0,
  eyeRadius: 0.13,
  leftY: -0.17,
  rightY: -0.17,
  mouthWidth: 0.11,
  mouthCurve: 0,
  mouthOpen: 0,
  mouthRound: 0,
  mouthTilt: 0,
  brow: 0,
  browTilt: 0,
  hand: 0,
  shrug: 0,
  raise: 0,
  sad: 0,
  serious: 0,
  stalled: 0,
  crashed: 0,
  hood: 0,
};
export const spherePoses: Record<SphereEmotion, FacePose> = {
  idle: neutral,
  raise: neutral,
  stalled: neutral,
  crashed: neutral,
  sad: { ...neutral, mouthCurve: -0.06 },
  serious: { ...neutral, eyeRadius: 0.1, mouthWidth: 0.09 },
  smile: {
    ...neutral,
    eyeLength: 0.14,
    eyeBend: -0.07,
    eyeRadius: 0.06,
    mouthWidth: 0.175,
    mouthCurve: 0.095,
  },
  laugh: {
    ...neutral,
    eyeLength: 0.145,
    eyeBend: -0.08,
    eyeRadius: 0.06,
    mouthWidth: 0.185,
    mouthCurve: 0,
    mouthOpen: 0.18,
  },
  surprised: {
    ...neutral,
    eyeRadius: 0.15,
    leftY: -0.2,
    rightY: -0.2,
    mouthWidth: 0.063,
    mouthRound: 1,
    mouthOpen: 0.14,
    brow: 1,
  },
  curious: {
    ...neutral,
    rightY: -0.22,
    mouthWidth: 0.1,
    mouthTilt: -0.045,
    brow: 1,
    browTilt: -0.085,
  },
  thinking: {
    ...neutral,
    eyeRadius: 0.115,
    leftY: -0.16,
    rightY: -0.19,
    mouthWidth: 0.095,
    mouthCurve: -0.05,
    mouthTilt: -0.025,
    brow: 1,
    browTilt: -0.025,
    hand: 1,
  },
};
const camera = 5;
const scale = (128 * Math.sqrt(camera * camera - 1)) / camera;
export function rotateSurface(
  [x, y]: Point,
  yaw: number,
  pitch: number,
  radius = 1,
): Vec3 {
  const z = Math.sqrt(Math.max(0.0001, 1 - x * x - y * y));
  const xx = x * Math.cos(yaw) + z * Math.sin(yaw);
  const zz = z * Math.cos(yaw) - x * Math.sin(yaw);
  return [
    xx * radius,
    (y * Math.cos(pitch) + zz * Math.sin(pitch)) * radius,
    (zz * Math.cos(pitch) - y * Math.sin(pitch)) * radius,
  ];
}
export function project([x, y, z]: Vec3): Point {
  const k = (scale * camera) / (camera - z);
  return [160 + x * k, 160 + y * k];
}
/** Clip against the visible spherical cap before projection, including horizon intersections. */
export function projectPatch(
  points: Point[],
  yaw: number,
  pitch: number,
  radius = 1,
): string {
  const vertices = points.map((p) => rotateSurface(p, yaw, pitch, radius));
  const near: Vec3[] = [];
  const horizon = (radius * radius) / camera;
  for (let i = 0; i < vertices.length; i++) {
    const a = vertices[i],
      b = vertices[(i + 1) % vertices.length];
    if (a[2] >= horizon) near.push(a);
    if (a[2] >= horizon !== b[2] >= horizon) {
      const t = (horizon - a[2]) / (b[2] - a[2]);
      near.push([a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, horizon]);
    }
  }
  const area = near.reduce((sum, a, i) => {
    const b = near[(i + 1) % near.length];
    return sum + a[0] * b[1] - b[0] * a[1];
  }, 0);
  if (area < 0) near.reverse();
  return near.length
    ? near
        .map(
          (p, i) =>
            `${i ? "L" : "M"}${project(p)
              .map((n) => n.toFixed(3))
              .join(" ")}`,
        )
        .join(" ") + "Z"
    : "";
}
export function circle(cx: number, cy: number, rx: number, ry = rx): Point[] {
  return Array.from({ length: 64 }, (_, i) => {
    const a = (i / 64) * Math.PI * 2;
    return [cx + Math.cos(a) * rx, cy + Math.sin(a) * ry];
  });
}
/** Expand rounded strokes into filled ribbons BEFORE projection so their width foreshortens too. */
export function ribbon(points: Point[], radius: number): Point[] {
  const normals = points.map((_, i) => {
    const a = points[Math.max(0, i - 1)],
      b = points[Math.min(points.length - 1, i + 1)];
    const angle = Math.atan2(b[1] - a[1], b[0] - a[0]);
    return angle;
  });
  const side = (i: number, sign: number): Point => [
    points[i][0] - Math.sin(normals[i]) * radius * sign,
    points[i][1] + Math.cos(normals[i]) * radius * sign,
  ];
  const out = points.map((_, i) => side(i, 1));
  const end = points.at(-1)!;
  for (let j = 1; j <= 12; j++) {
    const a = normals.at(-1)! + Math.PI / 2 - (j * Math.PI) / 12;
    out.push([end[0] + Math.cos(a) * radius, end[1] + Math.sin(a) * radius]);
  }
  for (let i = points.length - 1; i >= 0; i--) out.push(side(i, -1));
  for (let j = 1; j <= 12; j++) {
    const a = normals[0] - Math.PI / 2 - (j * Math.PI) / 12;
    out.push([
      points[0][0] + Math.cos(a) * radius,
      points[0][1] + Math.sin(a) * radius,
    ]);
  }
  return out;
}
function curve(
  cx: number,
  cy: number,
  w: number,
  bend: number,
  tilt = 0,
): Point[] {
  return Array.from({ length: 33 }, (_, i) => {
    // A 120-degree slice of an ellipse: circular when height/half-width
    // equals tan(30deg). This keeps broad crowns and round, predictable arcs.
    const sweep = Math.PI / 3;
    const angle = ((i / 32) * 2 - 1) * sweep;
    const x = Math.sin(angle) / Math.sin(sweep);
    const y = (Math.cos(angle) - Math.cos(sweep)) / (1 - Math.cos(sweep));
    return [cx + x * w, cy + y * bend + x * tilt];
  });
}
export function faceGeometry(p: FacePose, yaw = 0, pitch = 0, blink = 1) {
  const patch = (v: Point[], r = 1) => projectPatch(v, yaw, pitch, r);
  const eye = (x: number, y: number) => {
    const eyeScale = Math.sqrt(3);
    const shape =
      p.eyeLength < 0.001
        ? circle(x, y, p.eyeRadius, p.eyeRadius * blink)
        : ribbon(curve(x, y, p.eyeLength, p.eyeBend), p.eyeRadius);
    return patch(
      shape.map(([xx, yy]) => [
        x + (xx - x) * eyeScale,
        y + (yy - y) * eyeScale * (p.eyeLength < 0.001 ? 1 : blink),
      ]),
    );
  };
  const pupil = (x: number, y: number) => {
    const openness = Math.max(0, 1 - p.eyeLength / 0.075);
    if (openness < 0.001) return "";
    const radius = p.eyeRadius * Math.sqrt(3) * 0.32 * openness;
    return patch(circle(x, y + p.eyeBend, radius, radius * blink));
  };
  const top = curve(0, 0.22, p.mouthWidth, p.mouthCurve, p.mouthTilt);
  const bottom = top
    .map(([x, y]) => {
      const nx = Math.max(-1, Math.min(1, x / p.mouthWidth));
      return [
        x,
        y + p.mouthOpen * Math.sqrt(Math.max(0, 1 - nx * nx)),
      ] as Point;
    })
    .reverse();
  const lens = [...top, ...bottom];
  // The same contour turns into an O; no sprite or opacity crossfade.
  const oval = lens.map((_, i) => {
    const t = (i / (lens.length - 1)) * Math.PI * 2;
    return [
      -Math.cos(t) * p.mouthWidth,
      0.25 - Math.sin(t) * (p.mouthOpen * 0.6),
    ] as Point;
  });
  const contour = lens.map(
    ([x, y], i) =>
      [
        x + (oval[i][0] - x) * p.mouthRound,
        y + (oval[i][1] - y) * p.mouthRound,
      ] as Point,
  );
  const mouth =
    patch(contour) +
    patch(ribbon(contour.slice(0, 33), 0.044)) +
    patch(ribbon(contour.slice(33), 0.044));
  const handShift = (1 - p.hand) * 0.35;
  return {
    left: eye(-0.39, p.leftY),
    right: eye(0.39, p.rightY),
    leftPupil: pupil(-0.39, p.leftY),
    rightPupil: pupil(0.39, p.rightY),
    mouth,
    leftBrow: patch(
      ribbon(curve(-0.39, -0.54, 0.105, -0.028, p.browTilt), 0.04),
    ),
    rightBrow: patch(
      ribbon(curve(0.39, -0.54, 0.105, -0.028, -p.browTilt * 0.3), 0.04),
    ),
    hand:
      patch(circle(0.31, 0.53 + handShift, 0.115, 0.12), 1.035) +
      patch(
        ribbon(
          [
            [0.28, 0.49 + handShift],
            [0.24, 0.42 + handShift],
            [0.19, 0.36 + handShift],
            [0.145, 0.32 + handShift],
          ],
          0.044,
        ),
        1.035,
      ) +
      patch(
        ribbon(curve(0.26, 0.5 + handShift, 0.115, 0.025, -0.012), 0.046),
        1.045,
      ),
  };
}
