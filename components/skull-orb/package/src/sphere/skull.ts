import {
  circle,
  ribbon,
  spherePoses,
  type FacePose,
  type Point,
  type Vec3,
  type SphereEmotion,
} from "./geometry";
import { maskPoint, rotatePoint, volumePath } from "./volume";
export const skullEmotions = [
  "idle",
  "curious",
  "raise",
  "thinking",
  "surprised",
  "sad",
  "serious",
  "stalled",
  "crashed",
] as const;

type Segment = [Point, Point, Point];
function outline(segments: Segment[]): Point[] {
  const points: Point[] = [[0, -0.79]];
  for (const [c1, c2, end] of segments) {
    const start = points.at(-1)!;
    for (let i = 1; i <= 12; i++) {
      const t = i / 12,
        u = 1 - t;
      points.push([
        u ** 3 * start[0] +
          3 * u * u * t * c1[0] +
          3 * u * t * t * c2[0] +
          t ** 3 * end[0],
        u ** 3 * start[1] +
          3 * u * u * t * c1[1] +
          3 * u * t * t * c2[1] +
          t ** 3 * end[1],
      ]);
    }
  }
  return points;
}
const calmOutline = outline([
  [
    [0.41, -0.79],
    [0.7, -0.49],
    [0.7, -0.1],
  ],
  [
    [0.7, 0.14],
    [0.55, 0.32],
    [0.39, 0.4],
  ],
  [
    [0.36, 0.57],
    [0.33, 0.84],
    [0.3, 0.97],
  ],
  [
    [0.292, 1.005],
    [0.278, 1.005],
    [0.27, 0.965],
  ],
  [
    [0.23, 0.77],
    [0.21, 0.54],
    [0.19, 0.44],
  ],
  [
    [0.13, 0.65],
    [0.06, 0.98],
    [0.024, 1.09],
  ],
  [
    [0.009, 1.125],
    [-0.009, 1.125],
    [-0.024, 1.09],
  ],
  [
    [-0.06, 0.98],
    [-0.13, 0.65],
    [-0.19, 0.44],
  ],
  [
    [-0.21, 0.54],
    [-0.23, 0.77],
    [-0.27, 0.965],
  ],
  [
    [-0.278, 1.005],
    [-0.292, 1.005],
    [-0.3, 0.97],
  ],
  [
    [-0.33, 0.84],
    [-0.36, 0.57],
    [-0.39, 0.4],
  ],
  [
    [-0.55, 0.32],
    [-0.7, 0.14],
    [-0.7, -0.1],
  ],
  [
    [-0.7, -0.49],
    [-0.41, -0.79],
    [0, -0.79],
  ],
]);
// Broad cranium, inward temples, projecting cheekbones and a tapered maxilla.
const sternRaw = outline([
  [
    [0.44, -0.79],
    [0.73, -0.61],
    [0.72, -0.22],
  ],
  [
    [0.72, -0.01],
    [0.63, 0.15],
    [0.66, 0.27],
  ],
  [
    [0.69, 0.3],
    [0.69, 0.34],
    [0.64, 0.355],
  ],
  [
    [0.635, 0.41],
    [0.59, 0.405],
    [0.575, 0.44],
  ],
  [
    [0.535, 0.46],
    [0.5, 0.395],
    [0.455, 0.415],
  ],
  [
    [0.345, 0.405],
    [0.315, 0.495],
    [0.355, 0.6],
  ],
  [
    [0.365, 0.625],
    [0.38, 0.65],
    [0.37, 0.665],
  ],
  [
    [0.22, 0.74],
    [0.11, 0.785],
    [0, 0.795],
  ],
  [
    [-0.11, 0.785],
    [-0.22, 0.74],
    [-0.37, 0.665],
  ],
  [
    [-0.38, 0.65],
    [-0.365, 0.625],
    [-0.355, 0.6],
  ],
  [
    [-0.315, 0.495],
    [-0.345, 0.405],
    [-0.455, 0.415],
  ],
  [
    [-0.5, 0.395],
    [-0.535, 0.46],
    [-0.575, 0.44],
  ],
  [
    [-0.59, 0.405],
    [-0.635, 0.41],
    [-0.64, 0.355],
  ],
  [
    [-0.69, 0.34],
    [-0.69, 0.3],
    [-0.66, 0.27],
  ],
  [
    [-0.63, 0.15],
    [-0.72, -0.01],
    [-0.72, -0.22],
  ],
  [
    [-0.73, -0.61],
    [-0.44, -0.79],
    [0, -0.79],
  ],
]);
const pixelRaw: Point[] = [
  [0, -0.76],
  [0.4, -0.76],
  [0.4, -0.61],
  [0.61, -0.61],
  [0.61, -0.36],
  [0.77, -0.36],
  [0.77, 0.19],
  [0.65, 0.19],
  [0.65, 0.47],
  [0.36, 0.47],
  [0.36, 0.74],
  [0.15, 0.74],
  [0.15, 0.57],
  [0.06, 0.57],
  [0.06, 0.74],
  [-0.06, 0.74],
  [-0.06, 0.57],
  [-0.15, 0.57],
  [-0.15, 0.74],
  [-0.36, 0.74],
  [-0.36, 0.47],
  [-0.65, 0.47],
  [-0.65, 0.19],
  [-0.77, 0.19],
  [-0.77, -0.36],
  [-0.61, -0.36],
  [-0.61, -0.61],
  [-0.4, -0.61],
  [-0.4, -0.76],
];
const roundTop = outline([
  [
    [0.39, -0.79],
    [0.68, -0.49],
    [0.72, -0.12],
  ],
  [
    [0.76, 0.09],
    [0.64, 0.25],
    [0.5, 0.3],
  ],
]);
const roundRaw: Point[] = [
  ...roundTop,
  [0.5, 0.51],
  [0.47, 0.56],
  [0.39, 0.56],
  [0.39, 0.77],
  [0.23, 0.77],
  [0.23, 0.56],
  [0.11, 0.56],
  [0.11, 0.77],
  [-0.11, 0.77],
  [-0.11, 0.56],
  [-0.23, 0.56],
  [-0.23, 0.77],
  [-0.39, 0.77],
  [-0.39, 0.56],
  [-0.47, 0.56],
  [-0.5, 0.51],
  [-0.5, 0.3],
  ...roundTop
    .slice(0, -1)
    .reverse()
    .map(([x, y]) => [-x, y] as Point),
];
const outlineCount = 320;
const outlines = [calmOutline, sternRaw, pixelRaw, roundRaw].map((points) =>
  polygonSample(points, outlineCount),
);
export function skullOutlineFor(
  serious: number,
  stalled = 0,
  crashed = 0,
): Point[] {
  const weights = [
    Math.max(0, 1 - serious - stalled - crashed),
    serious,
    stalled,
    crashed,
  ];
  return outlines[0].map((_, i) =>
    weights.reduce<Point>(
      (p, w, j) => [p[0] + outlines[j][i][0] * w, p[1] + outlines[j][i][1] * w],
      [0, 0],
    ),
  );
}
export const skullOutline = calmOutline;
export { skullHoodGeometry } from "./portrait";
const base: FacePose = {
  ...spherePoses.idle,
  eyeRadius: 0.175,
  leftY: -0.19,
  rightY: -0.19,
  mouthWidth: 0.105,
  mouthRound: 1,
  mouthOpen: 0.17,
  hand: 0,
};
export const skullPoses: Record<SphereEmotion, FacePose> = {
  idle: base,
  smile: base,
  laugh: base,
  surprised: {
    ...base,
    eyeRadius: 0.2,
    leftY: -0.22,
    rightY: -0.22,
    mouthWidth: 0.125,
    mouthOpen: 0.245,
  },
  curious: {
    ...base,
    shrug: 1,
    sad: 0.88,
    eyeRadius: 0.195,
    leftY: -0.17,
    rightY: -0.17,
    mouthWidth: 0.1,
    mouthOpen: 0.045,
  },
  raise: {
    ...base,
    raise: 1,
    eyeRadius: 0.18,
    mouthWidth: 0.075,
    mouthOpen: 0.12,
  },
  thinking: {
    ...base,
    eyeRadius: 0.155,
    leftY: -0.19,
    rightY: -0.19,
    browTilt: 0,
    mouthWidth: 0.082,
    mouthOpen: 0.11,
  },
  sad: {
    ...base,
    sad: 1,
    brow: 1,
    eyeRadius: 0.195,
    leftY: -0.17,
    rightY: -0.17,
    mouthWidth: 0.073,
    mouthOpen: 0.155,
  },
  stalled: {
    ...base,
    stalled: 1,
    leftY: -0.055,
    rightY: -0.055,
    eyeRadius: 0.18,
  },
  crashed: {
    ...base,
    crashed: 1,
    leftY: -0.035,
    rightY: -0.035,
    eyeRadius: 0.185,
  },
  serious: {
    ...base,
    serious: 1,
    eyeRadius: 0.195,
    leftY: 0.055,
    rightY: 0.055,
    mouthWidth: 0.085,
    mouthOpen: 0.16,
  },
};
const crest: Point[] = [
  [-0.09, -0.93],
  [-0.025, -1.08],
  [-0.15, -1.23],
  [0.125, -1.19],
  [0.025, -1.46],
  [0.42, -1.27],
  [0.21, -1.3],
  [0.28, -1.09],
  [0.055, -1.13],
  [0.105, -1.01],
  [0.065, -0.93],
];
function polygonSample(points: Point[], count: number): Point[] {
  const lengths = points.map((p, i) =>
    Math.hypot(
      p[0] - points[(i + 1) % points.length][0],
      p[1] - points[(i + 1) % points.length][1],
    ),
  );
  const total = lengths.reduce((a, b) => a + b, 0);
  return Array.from({ length: count }, (_, i) => {
    let d = (i / count) * total,
      j = 0;
    while (d > lengths[j] && j < points.length - 1) d -= lengths[j++];
    const t = d / lengths[j],
      a = points[j],
      b = points[(j + 1) % points.length];
    return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
  });
}
function closedCurves(start: Point, segments: Segment[], count = 64): Point[] {
  const points: Point[] = [start];
  for (const [c1, c2, end] of segments) {
    const a = points.at(-1)!;
    for (let i = 1; i <= 14; i++) {
      const t = i / 14,
        u = 1 - t;
      points.push([
        u ** 3 * a[0] +
          3 * u * u * t * c1[0] +
          3 * u * t * t * c2[0] +
          t ** 3 * end[0],
        u ** 3 * a[1] +
          3 * u * u * t * c1[1] +
          3 * u * t * t * c2[1] +
          t ** 3 * end[1],
      ]);
    }
  }
  return polygonSample(points, count);
}
// Left orbital cavity: broad outer bowl, pinched inner corner and brow hook.
const orbit = closedCurves(
  [0.235, -0.065],
  [
    [
      [0.17, 0.025],
      [0.13, 0.115],
      [-0.04, 0.155],
    ],
    [
      [-0.15, 0.195],
      [-0.235, 0.16],
      [-0.245, 0.095],
    ],
    [
      [-0.27, -0.06],
      [-0.235, -0.17],
      [-0.13, -0.17],
    ],
    [
      [-0.025, -0.17],
      [0.095, -0.07],
      [0.15, -0.055],
    ],
    [
      [0.195, -0.035],
      [0.225, -0.07],
      [0.235, -0.12],
    ],
    [
      [0.247, -0.11],
      [0.247, -0.085],
      [0.235, -0.065],
    ],
  ],
);
const nose = closedCurves(
  [0.018, 0.14],
  [
    [
      [0.035, 0.175],
      [0.105, 0.27],
      [0.094, 0.315],
    ],
    [
      [0.085, 0.365],
      [0.025, 0.365],
      [0.023, 0.318],
    ],
    [
      [0.018, 0.285],
      [-0.018, 0.285],
      [-0.023, 0.318],
    ],
    [
      [-0.025, 0.365],
      [-0.085, 0.365],
      [-0.094, 0.315],
    ],
    [
      [-0.105, 0.27],
      [-0.035, 0.175],
      [-0.018, 0.14],
    ],
    [
      [-0.01, 0.115],
      [0.01, 0.115],
      [0.018, 0.14],
    ],
  ],
);
const pixelEye = polygonSample(
  [
    [0.185, -0.19],
    [0.185, 0.115],
    [0.075, 0.115],
    [0.075, 0.245],
    [-0.205, 0.245],
    [-0.205, -0.19],
  ],
  64,
);
const pixelNose = polygonSample(
  [
    [0.105, 0.285],
    [0.105, 0.395],
    [-0.105, 0.395],
    [-0.105, 0.285],
    [0, 0.16],
  ],
  64,
);
function radialSample(points: Point[]): Point[] {
  return Array.from({ length: 64 }, (_, i) => {
    const angle = (i / 64) * Math.PI * 2,
      d: Point = [Math.cos(angle), Math.sin(angle)];
    let radius = 0;
    for (let j = 0; j < points.length; j++) {
      const a = points[j],
        b = points[(j + 1) % points.length],
        v: Point = [b[0] - a[0], b[1] - a[1]];
      const cross = d[0] * v[1] - d[1] * v[0];
      if (Math.abs(cross) < 1e-8) continue;
      const t = (a[0] * v[1] - a[1] * v[0]) / cross,
        u = (a[0] * d[1] - a[1] * d[0]) / cross;
      if (t >= 0 && u >= 0 && u <= 1) radius = Math.max(radius, t);
    }
    return [d[0] * radius, d[1] * radius];
  });
}
const alignedOrbit = radialSample(orbit),
  alignedPixelEye = radialSample(pixelEye);
export function skullViewAngles(
  yaw: number,
  pitch: number,
  pose: FacePose,
  time: number,
  still = false,
): Point {
  if (still) return [yaw, pitch];
  const amount = Math.max(0, Math.min(1, pose.stalled));
  const step = 0.055,
    cycle = time % 2.1;
  const twitch =
    cycle < 0.24
      ? [0, 0.023, -0.018, 0][Math.min(3, Math.floor(cycle / 0.06))]
      : 0;
  return [
    yaw + (Math.round(yaw / step) * step - yaw + twitch) * amount,
    pitch + (Math.round(pitch / step) * step - pitch) * amount,
  ];
}
export function skullGeometry(
  p: FacePose,
  yaw = 0,
  pitch = 0,
  blink = 1,
  gazeX = 0,
  leftX = 0,
  rightX = 0,
  leftScale = 1,
  rightScale = 1,
) {
  const stern = Math.max(0, Math.min(1, p.serious)),
    sad = Math.max(0, Math.min(1, p.sad)),
    stalled = Math.max(0, Math.min(1, p.stalled)),
    crashed = Math.max(0, Math.min(1, p.crashed));
  const patch = (points: Point[], depth = 0) =>
    volumePath(
      points.map((q) => maskPoint(q, depth)),
      yaw,
      pitch,
    );
  const edge = skullOutlineFor(stern, stalled, crashed);
  const front = edge.map((q) => maskPoint(q));
  const back = edge.map((q) => maskPoint(q, -0.105));
  let sides = "",
    sidesLight = "";
  for (let i = 0; i < front.length; i++) {
    const a = front[i],
      b = front[(i + 1) % front.length];
    const normal: Vec3 = [b[1] - a[1], a[0] - b[0], 0];
    const n = rotatePoint(normal, yaw, pitch),
      center = rotatePoint(a, yaw, pitch);
    if (n[0] * -center[0] + n[1] * -center[1] + n[2] * (5 - center[2]) <= 0)
      continue;
    const face = volumePath(
      [a, b, back[(i + 1) % front.length], back[i]],
      yaw,
      pitch,
    );
    if (n[0] * -0.5 + n[1] * -0.7 + n[2] * 0.3 > 0) sidesLight += face;
    else sides += face;
  }
  const eye = (cx: number, cy: number, side: number, scale = 1) => {
    const points = circle(
      0,
      0,
      p.eyeRadius * scale * (1 + side * p.browTilt * 2),
      p.eyeRadius * scale,
    ).map(([x, y], i) => {
      const r = p.eyeRadius * scale;
      const lid = -0.02 - side * x * 0.45 + 0.025 * (1 - (x / r) ** 2);
      const tiredY = y + (Math.max(y, lid) - y) * sad;
      const index = side === 1 ? i : (32 - i + 64) % 64;
      const sx = side * alignedOrbit[index][0],
        sy = alignedOrbit[index][1];
      const bx = side * alignedPixelEye[index][0],
        by = alignedPixelEye[index][1];
      const open =
        1 - (1 - blink) * (1 - stern * 0.8) * (1 - stalled) * (1 - crashed);
      return [
        cx + x + (sx - x) * stern + (bx - x) * stalled,
        cy + (tiredY + (sy - tiredY) * stern + (by - tiredY) * stalled) * open,
      ] as Point;
    });
    return patch(points);
  };
  const mouth = circle(0, 0.22, p.mouthWidth, p.mouthOpen * 0.65).map(
    ([x, y], i) =>
      [
        (x + (nose[i][0] - x) * stern + (pixelNose[i][0] - x) * stalled) *
          (1 - crashed),
        0.24 +
          (y +
            (nose[i][1] - y) * stern +
            (pixelNose[i][1] - y) * stalled -
            0.24) *
            (1 - crashed),
      ] as Point,
  );
  let teeth = "";
  if (stern > 0.001) {
    // Short radial fissures open at the jaw edge; no horizontal grin bar.
    for (const x of [-0.3, -0.21, -0.11, 0.11, 0.21, 0.3]) {
      const bottom = 0.78 - Math.abs(x) * 0.31;
      teeth += patch(
        ribbon(
          [
            [x * 0.82, 0.555 + Math.abs(x) * 0.13],
            [x, bottom],
          ],
          0.012 * stern,
        ),
      );
    }
  }
  const temple = (side: number) => {
    if (stern < 0.001) return "";
    const points: Point[] = [[side * 0.635, -0.44]];
    const segments: Segment[] = [
      [
        [0.59, -0.29],
        [0.55, -0.27],
        [0.58, -0.215],
      ],
      [
        [0.65, -0.15],
        [0.615, -0.065],
        [0.59, -0.02],
      ],
      [
        [0.56, 0.04],
        [0.59, 0.12],
        [0.6, 0.17],
      ],
    ];
    for (const [a, b, c] of segments) {
      const start = points.at(-1)!;
      for (let i = 1; i <= 14; i++) {
        const t = i / 14,
          u = 1 - t;
        points.push([
          u ** 3 * start[0] +
            3 * u * u * t * a[0] * side +
            3 * u * t * t * b[0] * side +
            t ** 3 * c[0] * side,
          u ** 3 * start[1] +
            3 * u * u * t * a[1] +
            3 * u * t * t * b[1] +
            t ** 3 * c[1],
        ]);
      }
    }
    return patch(ribbon(points, 0.009 * stern));
  };
  const brows = (side: number) => {
    const brow = Math.max(0, Math.min(1, p.brow));
    if (brow < 0.001) return "";
    const x = side * 0.285;
    return patch(
      ribbon(
        [
          [x - side * 0.07, -0.405],
          [x, -0.425],
          [x + side * 0.055, -0.39],
        ],
        0.018 * brow,
      ),
    );
  };
  return {
    crest:
      stalled + crashed > 0.999
        ? ""
        : volumePath(
            crest.map(
              ([x, y]) =>
                [
                  x * (1 - 0.28 * p.hood) * (1 - stalled - crashed),
                  -0.93 -
                    0.07 * p.hood +
                    (y + 0.93) * (1 - 0.3 * p.hood) * (1 - stalled - crashed),
                  0.09,
                ] as Vec3,
            ),
            yaw,
            pitch,
            false,
          ),
    maskEdge: volumePath(back, yaw, pitch),
    maskSide: sides,
    maskSideLight: sidesLight,
    mask: volumePath(front, yaw, pitch),
    left: eye(-0.285 + gazeX + leftX, p.leftY, 1, leftScale),
    right: eye(0.285 + gazeX + rightX, p.rightY, -1, rightScale),
    leftPupil:
      crashed > 0.001
        ? patch(circle(-0.285 + gazeX, p.leftY, p.eyeRadius * 0.63 * crashed))
        : "",
    rightPupil:
      crashed > 0.001
        ? patch(circle(0.285 + gazeX, p.rightY, p.eyeRadius * 0.63 * crashed))
        : "",
    mouth: crashed > 0.999 ? "" : patch(mouth),
    temple: temple(-1) + temple(1),
    teeth,
    leftBrow: brows(-1),
    rightBrow: brows(1),
    hand: "",
  };
}
