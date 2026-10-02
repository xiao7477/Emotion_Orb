import { jsx as y, jsxs as V } from "react/jsx-runtime";
import { useId as gt, useRef as N, useEffect as x0 } from "react";
import { useReducedMotion as bt } from "motion/react";
function Mt(t, e, r, i, a) {
  const c = Math.max(1, Math.ceil(r / 0.008333333333333333)), o = r / c;
  for (let n = 0; n < c; n++)
    t.velocity += (i * (e - t.value) - a * t.velocity) * o, t.value += t.velocity * o;
  return Number.isFinite(t.value) || (t.value = e, t.velocity = 0), t.value;
}
const E0 = {
  x: 0,
  y: 0,
  speed: 0,
  present: !1,
  pressed: !1,
  stamp: 0
}, i0 = /* @__PURE__ */ new Set();
let D = { ...E0 }, U = 0, c0 = 0;
function D0(t) {
  U = 0;
  const e = c0 ? Math.min((t - c0) / 1e3, 0.05) : 1 / 60;
  c0 = t;
  for (const r of i0) r(e, t, D);
  i0.size && !document.hidden && (U = requestAnimationFrame(D0));
}
function V0() {
  !U && !document.hidden && (c0 = 0, U = requestAnimationFrame(D0));
}
function M0(t) {
  if (!t.isPrimary) return;
  const e = performance.now(), r = (e - D.stamp) / 1e3, i = D.present && r > 4e-3 && r < 0.15 ? Math.hypot(t.clientX - D.x, t.clientY - D.y) / r : 0;
  D = {
    x: t.clientX,
    y: t.clientY,
    speed: Math.min(i, 6e3),
    present: !0,
    pressed: (t.buttons & 1) > 0,
    stamp: e
  };
}
function n0() {
  D = { ...E0 };
}
function z0() {
  D.pressed = !1;
}
function B0() {
  n0(), document.hidden ? (cancelAnimationFrame(U), U = 0, c0 = 0) : V0();
}
function yt(t) {
  return i0.add(t), i0.size === 1 && (window.addEventListener("pointermove", M0, { passive: !0 }), window.addEventListener("pointerdown", M0, { passive: !0 }), window.addEventListener("pointerup", z0, { passive: !0 }), window.addEventListener("pointercancel", n0, { passive: !0 }), window.addEventListener("blur", n0), document.addEventListener("pointerleave", n0), document.addEventListener("visibilitychange", B0)), V0(), () => {
    i0.delete(t), i0.size || (cancelAnimationFrame(U), U = 0, c0 = 0, D = { ...E0 }, window.removeEventListener("pointermove", M0), window.removeEventListener("pointerdown", M0), window.removeEventListener("pointerup", z0), window.removeEventListener("pointercancel", n0), window.removeEventListener("blur", n0), document.removeEventListener("pointerleave", n0), document.removeEventListener("visibilitychange", B0));
  };
}
const vt = {
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
  raise: "举手示意"
}, _ = {
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
  hood: 0
}, U0 = {
  idle: _,
  raise: _,
  stalled: _,
  crashed: _,
  sad: { ..._, mouthCurve: -0.06 },
  serious: { ..._, eyeRadius: 0.1, mouthWidth: 0.09 },
  smile: {
    ..._,
    eyeLength: 0.14,
    eyeBend: -0.07,
    eyeRadius: 0.06,
    mouthWidth: 0.175,
    mouthCurve: 0.095
  },
  laugh: {
    ..._,
    eyeLength: 0.145,
    eyeBend: -0.08,
    eyeRadius: 0.06,
    mouthWidth: 0.185,
    mouthCurve: 0,
    mouthOpen: 0.18
  },
  surprised: {
    ..._,
    eyeRadius: 0.15,
    leftY: -0.2,
    rightY: -0.2,
    mouthWidth: 0.063,
    mouthRound: 1,
    mouthOpen: 0.14,
    brow: 1
  },
  curious: {
    ..._,
    rightY: -0.22,
    mouthWidth: 0.1,
    mouthTilt: -0.045,
    brow: 1,
    browTilt: -0.085
  },
  thinking: {
    ..._,
    eyeRadius: 0.115,
    leftY: -0.16,
    rightY: -0.19,
    mouthWidth: 0.095,
    mouthCurve: -0.05,
    mouthTilt: -0.025,
    brow: 1,
    browTilt: -0.025,
    hand: 1
  }
}, l0 = 5, kt = 128 * Math.sqrt(l0 * l0 - 1) / l0;
function wt([t, e], r, i, a = 1) {
  const c = Math.sqrt(Math.max(1e-4, 1 - t * t - e * e)), o = t * Math.cos(r) + c * Math.sin(r), n = c * Math.cos(r) - t * Math.sin(r);
  return [
    o * a,
    (e * Math.cos(i) + n * Math.sin(i)) * a,
    (n * Math.cos(i) - e * Math.sin(i)) * a
  ];
}
function y0([t, e, r]) {
  const i = kt * l0 / (l0 - r);
  return [160 + t * i, 160 + e * i];
}
function Lt(t, e, r, i = 1) {
  const a = t.map((l) => wt(l, e, r, i)), c = [], o = i * i / l0;
  for (let l = 0; l < a.length; l++) {
    const s = a[l], u = a[(l + 1) % a.length];
    if (s[2] >= o && c.push(s), s[2] >= o != u[2] >= o) {
      const f = (o - s[2]) / (u[2] - s[2]);
      c.push([s[0] + (u[0] - s[0]) * f, s[1] + (u[1] - s[1]) * f, o]);
    }
  }
  return c.reduce((l, s, u) => {
    const f = c[(u + 1) % c.length];
    return l + s[0] * f[1] - f[0] * s[1];
  }, 0) < 0 && c.reverse(), c.length ? c.map(
    (l, s) => `${s ? "L" : "M"}${y0(l).map((u) => u.toFixed(3)).join(" ")}`
  ).join(" ") + "Z" : "";
}
function r0(t, e, r, i = r) {
  return Array.from({ length: 64 }, (a, c) => {
    const o = c / 64 * Math.PI * 2;
    return [t + Math.cos(o) * r, e + Math.sin(o) * i];
  });
}
function Z(t, e) {
  const r = t.map((o, n) => {
    const l = t[Math.max(0, n - 1)], s = t[Math.min(t.length - 1, n + 1)];
    return Math.atan2(s[1] - l[1], s[0] - l[0]);
  }), i = (o, n) => [
    t[o][0] - Math.sin(r[o]) * e * n,
    t[o][1] + Math.cos(r[o]) * e * n
  ], a = t.map((o, n) => i(n, 1)), c = t.at(-1);
  for (let o = 1; o <= 12; o++) {
    const n = r.at(-1) + Math.PI / 2 - o * Math.PI / 12;
    a.push([c[0] + Math.cos(n) * e, c[1] + Math.sin(n) * e]);
  }
  for (let o = t.length - 1; o >= 0; o--) a.push(i(o, -1));
  for (let o = 1; o <= 12; o++) {
    const n = r[0] - Math.PI / 2 - o * Math.PI / 12;
    a.push([
      t[0][0] + Math.cos(n) * e,
      t[0][1] + Math.sin(n) * e
    ]);
  }
  return a;
}
function u0(t, e, r, i, a = 0) {
  return Array.from({ length: 33 }, (c, o) => {
    const n = Math.PI / 3, l = (o / 32 * 2 - 1) * n, s = Math.sin(l) / Math.sin(n), u = (Math.cos(l) - Math.cos(n)) / (1 - Math.cos(n));
    return [t + s * r, e + u * i + s * a];
  });
}
function xt(t, e = 0, r = 0, i = 1) {
  const a = (k, b = 1) => Lt(k, e, r, b), c = (k, b) => {
    const w = Math.sqrt(3), R = t.eyeLength < 1e-3 ? r0(k, b, t.eyeRadius, t.eyeRadius * i) : Z(u0(k, b, t.eyeLength, t.eyeBend), t.eyeRadius);
    return a(
      R.map(([W, C]) => [
        k + (W - k) * w,
        b + (C - b) * w * (t.eyeLength < 1e-3 ? 1 : i)
      ])
    );
  }, o = (k, b) => {
    const w = Math.max(0, 1 - t.eyeLength / 0.075);
    if (w < 1e-3) return "";
    const R = t.eyeRadius * Math.sqrt(3) * 0.32 * w;
    return a(r0(k, b + t.eyeBend, R, R * i));
  }, n = u0(0, 0.22, t.mouthWidth, t.mouthCurve, t.mouthTilt), l = n.map(([k, b]) => {
    const w = Math.max(-1, Math.min(1, k / t.mouthWidth));
    return [
      k,
      b + t.mouthOpen * Math.sqrt(Math.max(0, 1 - w * w))
    ];
  }).reverse(), s = [...n, ...l], u = s.map((k, b) => {
    const w = b / (s.length - 1) * Math.PI * 2;
    return [
      -Math.cos(w) * t.mouthWidth,
      0.25 - Math.sin(w) * (t.mouthOpen * 0.6)
    ];
  }), f = s.map(
    ([k, b], w) => [
      k + (u[w][0] - k) * t.mouthRound,
      b + (u[w][1] - b) * t.mouthRound
    ]
  ), g = a(f) + a(Z(f.slice(0, 33), 0.044)) + a(Z(f.slice(33), 0.044)), v = (1 - t.hand) * 0.35;
  return {
    left: c(-0.39, t.leftY),
    right: c(0.39, t.rightY),
    leftPupil: o(-0.39, t.leftY),
    rightPupil: o(0.39, t.rightY),
    mouth: g,
    leftBrow: a(
      Z(u0(-0.39, -0.54, 0.105, -0.028, t.browTilt), 0.04)
    ),
    rightBrow: a(
      Z(u0(0.39, -0.54, 0.105, -0.028, -t.browTilt * 0.3), 0.04)
    ),
    hand: a(r0(0.31, 0.53 + v, 0.115, 0.12), 1.035) + a(
      Z(
        [
          [0.28, 0.49 + v],
          [0.24, 0.42 + v],
          [0.19, 0.36 + v],
          [0.145, 0.32 + v]
        ],
        0.044
      ),
      1.035
    ) + a(
      Z(u0(0.26, 0.5 + v, 0.115, 0.025, -0.012), 0.046),
      1.045
    )
  };
}
function s0([t, e, r], i, a) {
  const c = t * Math.cos(i) + r * Math.sin(i), o = r * Math.cos(i) - t * Math.sin(i);
  return [
    c,
    e * Math.cos(a) + o * Math.sin(a),
    o * Math.cos(a) - e * Math.sin(a)
  ];
}
function A0([t, e, r]) {
  const i = r - 5, a = t * t + e * e + i * i, c = 10 * i, n = c * c - 4 * a * 24;
  return n <= 0 ? 0.01 : (-c - Math.sqrt(n)) / (2 * a) - 1;
}
function d0(t, e, r, i = !0) {
  const a = t.map((o) => s0(o, e, r)), c = [];
  for (let o = 0; o < a.length; o++) {
    const n = a[o], l = a[(o + 1) % a.length], s = !i || A0(n) >= -1e-5, u = !i || A0(l) >= -1e-5;
    if (s && c.push(n), s !== u) {
      let f = 0, g = 1;
      for (let k = 0; k < 18; k++) {
        const b = (f + g) / 2, w = [
          n[0] + (l[0] - n[0]) * b,
          n[1] + (l[1] - n[1]) * b,
          n[2] + (l[2] - n[2]) * b
        ];
        A0(w) >= -1e-5 === s ? f = b : g = b;
      }
      const v = (f + g) / 2;
      c.push([
        n[0] + (l[0] - n[0]) * v,
        n[1] + (l[1] - n[1]) * v,
        n[2] + (l[2] - n[2]) * v
      ]);
    }
  }
  return c.length >= 3 ? c.map(
    (o, n) => `${n ? "L" : "M"}${y0(o).map((l) => l.toFixed(3)).join(" ")}`
  ).join(" ") + "Z" : "";
}
function At(t, e) {
  const r = Math.min(e, 0.28);
  return Math.sqrt(Math.max(0.12, 1 - t * t - r * r)) + 0.11 + Math.max(0, e - 0.28) * 0.24;
}
function S0([t, e], r = 0) {
  return [t, e, At(t, e) + r];
}
const St = [
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
  ["Z"]
], Yt = [
  ["M", 500, 74],
  ["L", 280, 174],
  ["L", 399, 231],
  ["L", 221, 241],
  ["L", 319, 331],
  ["L", 229, 339],
  ["L", 153, 234],
  ["L", 322, 229],
  ["L", 174, 163],
  ["Z"]
], Pt = (t, e, r) => {
  const i = 160 + (t - 305) * 0.54, c = 73 + ((e < 558 ? 558 + (e - 558) * 0.7 : e) - 558) * 0.54, o = 128 * Math.sqrt(24) / 5.2;
  return [
    (i - 160) / o,
    (c - 160) / o,
    r
  ];
};
function K0(t, e, r, i) {
  const a = (c, o) => y0(s0(Pt(c, o, i), e * 0.22, r * 0.16));
  return t.map((c) => {
    if (c[0] === "Z") return "Z";
    const o = c.slice(1), n = [];
    for (let l = 0; l < o.length; l += 2) {
      const s = a(o[l], o[l + 1]);
      n.push(`${s[0].toFixed(3)} ${s[1].toFixed(3)}`);
    }
    return c[0] + n.join(" ");
  }).join(" ");
}
const J0 = (t = 0, e = 0) => K0(St, t, e, -0.2), tt = (t = 0, e = 0) => K0(Yt, t, e, -0.2), et = (t) => {
  const e = -44 - 86 * t;
  return `-24 ${e.toFixed(3)} 368 ${(380 - e).toFixed(3)}`;
}, ot = (t) => `translate(160 160) scale(${(1 - 0.25 * t).toFixed(5)}) translate(-160 -160)`, ee = [
  "idle",
  "curious",
  "raise",
  "thinking",
  "surprised",
  "sad",
  "serious",
  "stalled",
  "crashed"
];
function F0(t) {
  const e = [[0, -0.79]];
  for (const [r, i, a] of t) {
    const c = e.at(-1);
    for (let o = 1; o <= 12; o++) {
      const n = o / 12, l = 1 - n;
      e.push([
        l ** 3 * c[0] + 3 * l * l * n * r[0] + 3 * l * n * n * i[0] + n ** 3 * a[0],
        l ** 3 * c[1] + 3 * l * l * n * r[1] + 3 * l * n * n * i[1] + n ** 3 * a[1]
      ]);
    }
  }
  return e;
}
const $t = F0([
  [
    [0.41, -0.79],
    [0.7, -0.49],
    [0.7, -0.1]
  ],
  [
    [0.7, 0.14],
    [0.55, 0.32],
    [0.39, 0.4]
  ],
  [
    [0.36, 0.57],
    [0.33, 0.84],
    [0.3, 0.97]
  ],
  [
    [0.292, 1.005],
    [0.278, 1.005],
    [0.27, 0.965]
  ],
  [
    [0.23, 0.77],
    [0.21, 0.54],
    [0.19, 0.44]
  ],
  [
    [0.13, 0.65],
    [0.06, 0.98],
    [0.024, 1.09]
  ],
  [
    [9e-3, 1.125],
    [-9e-3, 1.125],
    [-0.024, 1.09]
  ],
  [
    [-0.06, 0.98],
    [-0.13, 0.65],
    [-0.19, 0.44]
  ],
  [
    [-0.21, 0.54],
    [-0.23, 0.77],
    [-0.27, 0.965]
  ],
  [
    [-0.278, 1.005],
    [-0.292, 1.005],
    [-0.3, 0.97]
  ],
  [
    [-0.33, 0.84],
    [-0.36, 0.57],
    [-0.39, 0.4]
  ],
  [
    [-0.55, 0.32],
    [-0.7, 0.14],
    [-0.7, -0.1]
  ],
  [
    [-0.7, -0.49],
    [-0.41, -0.79],
    [0, -0.79]
  ]
]), Rt = F0([
  [
    [0.44, -0.79],
    [0.73, -0.61],
    [0.72, -0.22]
  ],
  [
    [0.72, -0.01],
    [0.63, 0.15],
    [0.66, 0.27]
  ],
  [
    [0.69, 0.3],
    [0.69, 0.34],
    [0.64, 0.355]
  ],
  [
    [0.635, 0.41],
    [0.59, 0.405],
    [0.575, 0.44]
  ],
  [
    [0.535, 0.46],
    [0.5, 0.395],
    [0.455, 0.415]
  ],
  [
    [0.345, 0.405],
    [0.315, 0.495],
    [0.355, 0.6]
  ],
  [
    [0.365, 0.625],
    [0.38, 0.65],
    [0.37, 0.665]
  ],
  [
    [0.22, 0.74],
    [0.11, 0.785],
    [0, 0.795]
  ],
  [
    [-0.11, 0.785],
    [-0.22, 0.74],
    [-0.37, 0.665]
  ],
  [
    [-0.38, 0.65],
    [-0.365, 0.625],
    [-0.355, 0.6]
  ],
  [
    [-0.315, 0.495],
    [-0.345, 0.405],
    [-0.455, 0.415]
  ],
  [
    [-0.5, 0.395],
    [-0.535, 0.46],
    [-0.575, 0.44]
  ],
  [
    [-0.59, 0.405],
    [-0.635, 0.41],
    [-0.64, 0.355]
  ],
  [
    [-0.69, 0.34],
    [-0.69, 0.3],
    [-0.66, 0.27]
  ],
  [
    [-0.63, 0.15],
    [-0.72, -0.01],
    [-0.72, -0.22]
  ],
  [
    [-0.73, -0.61],
    [-0.44, -0.79],
    [0, -0.79]
  ]
]), Et = [
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
  [-0.4, -0.76]
], T0 = F0([
  [
    [0.39, -0.79],
    [0.68, -0.49],
    [0.72, -0.12]
  ],
  [
    [0.76, 0.09],
    [0.64, 0.25],
    [0.5, 0.3]
  ]
]), Ft = [
  ...T0,
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
  ...T0.slice(0, -1).reverse().map(([t, e]) => [-t, e])
], jt = 320, Y0 = [$t, Rt, Et, Ft].map(
  (t) => v0(t, jt)
);
function Ot(t, e = 0, r = 0) {
  const i = [
    Math.max(0, 1 - t - e - r),
    t,
    e,
    r
  ];
  return Y0[0].map(
    (a, c) => i.reduce(
      (o, n, l) => [o[0] + Y0[l][c][0] * n, o[1] + Y0[l][c][1] * n],
      [0, 0]
    )
  );
}
const X = {
  ...U0.idle,
  eyeRadius: 0.175,
  leftY: -0.19,
  rightY: -0.19,
  mouthWidth: 0.105,
  mouthRound: 1,
  mouthOpen: 0.17,
  hand: 0
}, nt = {
  idle: X,
  smile: X,
  laugh: X,
  surprised: {
    ...X,
    eyeRadius: 0.2,
    leftY: -0.22,
    rightY: -0.22,
    mouthWidth: 0.125,
    mouthOpen: 0.245
  },
  curious: {
    ...X,
    shrug: 1,
    sad: 0.88,
    eyeRadius: 0.195,
    leftY: -0.17,
    rightY: -0.17,
    mouthWidth: 0.1,
    mouthOpen: 0.045
  },
  raise: {
    ...X,
    raise: 1,
    eyeRadius: 0.18,
    mouthWidth: 0.075,
    mouthOpen: 0.12
  },
  thinking: {
    ...X,
    eyeRadius: 0.155,
    leftY: -0.19,
    rightY: -0.19,
    browTilt: 0,
    mouthWidth: 0.082,
    mouthOpen: 0.11
  },
  sad: {
    ...X,
    sad: 1,
    brow: 1,
    eyeRadius: 0.195,
    leftY: -0.17,
    rightY: -0.17,
    mouthWidth: 0.073,
    mouthOpen: 0.155
  },
  stalled: {
    ...X,
    stalled: 1,
    leftY: -0.055,
    rightY: -0.055,
    eyeRadius: 0.18
  },
  crashed: {
    ...X,
    crashed: 1,
    leftY: -0.035,
    rightY: -0.035,
    eyeRadius: 0.185
  },
  serious: {
    ...X,
    serious: 1,
    eyeRadius: 0.195,
    leftY: 0.055,
    rightY: 0.055,
    mouthWidth: 0.085,
    mouthOpen: 0.16
  }
}, Wt = [
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
  [0.065, -0.93]
];
function v0(t, e) {
  const r = t.map(
    (a, c) => Math.hypot(
      a[0] - t[(c + 1) % t.length][0],
      a[1] - t[(c + 1) % t.length][1]
    )
  ), i = r.reduce((a, c) => a + c, 0);
  return Array.from({ length: e }, (a, c) => {
    let o = c / e * i, n = 0;
    for (; o > r[n] && n < t.length - 1; ) o -= r[n++];
    const l = o / r[n], s = t[n], u = t[(n + 1) % t.length];
    return [s[0] + (u[0] - s[0]) * l, s[1] + (u[1] - s[1]) * l];
  });
}
function rt(t, e, r = 64) {
  const i = [t];
  for (const [a, c, o] of e) {
    const n = i.at(-1);
    for (let l = 1; l <= 14; l++) {
      const s = l / 14, u = 1 - s;
      i.push([
        u ** 3 * n[0] + 3 * u * u * s * a[0] + 3 * u * s * s * c[0] + s ** 3 * o[0],
        u ** 3 * n[1] + 3 * u * u * s * a[1] + 3 * u * s * s * c[1] + s ** 3 * o[1]
      ]);
    }
  }
  return v0(i, r);
}
const Ct = rt(
  [0.235, -0.065],
  [
    [
      [0.17, 0.025],
      [0.13, 0.115],
      [-0.04, 0.155]
    ],
    [
      [-0.15, 0.195],
      [-0.235, 0.16],
      [-0.245, 0.095]
    ],
    [
      [-0.27, -0.06],
      [-0.235, -0.17],
      [-0.13, -0.17]
    ],
    [
      [-0.025, -0.17],
      [0.095, -0.07],
      [0.15, -0.055]
    ],
    [
      [0.195, -0.035],
      [0.225, -0.07],
      [0.235, -0.12]
    ],
    [
      [0.247, -0.11],
      [0.247, -0.085],
      [0.235, -0.065]
    ]
  ]
), I0 = rt(
  [0.018, 0.14],
  [
    [
      [0.035, 0.175],
      [0.105, 0.27],
      [0.094, 0.315]
    ],
    [
      [0.085, 0.365],
      [0.025, 0.365],
      [0.023, 0.318]
    ],
    [
      [0.018, 0.285],
      [-0.018, 0.285],
      [-0.023, 0.318]
    ],
    [
      [-0.025, 0.365],
      [-0.085, 0.365],
      [-0.094, 0.315]
    ],
    [
      [-0.105, 0.27],
      [-0.035, 0.175],
      [-0.018, 0.14]
    ],
    [
      [-0.01, 0.115],
      [0.01, 0.115],
      [0.018, 0.14]
    ]
  ]
), Qt = v0(
  [
    [0.185, -0.19],
    [0.185, 0.115],
    [0.075, 0.115],
    [0.075, 0.245],
    [-0.205, 0.245],
    [-0.205, -0.19]
  ],
  64
), _0 = v0(
  [
    [0.105, 0.285],
    [0.105, 0.395],
    [-0.105, 0.395],
    [-0.105, 0.285],
    [0, 0.16]
  ],
  64
);
function st(t) {
  return Array.from({ length: 64 }, (e, r) => {
    const i = r / 64 * Math.PI * 2, a = [Math.cos(i), Math.sin(i)];
    let c = 0;
    for (let o = 0; o < t.length; o++) {
      const n = t[o], l = t[(o + 1) % t.length], s = [l[0] - n[0], l[1] - n[1]], u = a[0] * s[1] - a[1] * s[0];
      if (Math.abs(u) < 1e-8) continue;
      const f = (n[0] * s[1] - n[1] * s[0]) / u, g = (n[0] * a[1] - n[1] * a[0]) / u;
      f >= 0 && g >= 0 && g <= 1 && (c = Math.max(c, f));
    }
    return [a[0] * c, a[1] * c];
  });
}
const X0 = st(Ct), Z0 = st(Qt);
function qt(t, e, r, i, a = !1) {
  if (a) return [t, e];
  const c = Math.max(0, Math.min(1, r.stalled)), o = 0.055, n = i % 2.1, l = n < 0.24 ? [0, 0.023, -0.018, 0][Math.min(3, Math.floor(n / 0.06))] : 0;
  return [
    t + (Math.round(t / o) * o - t + l) * c,
    e + (Math.round(e / o) * o - e) * c
  ];
}
function zt(t, e = 0, r = 0, i = 1, a = 0, c = 0, o = 0, n = 1, l = 1) {
  const s = Math.max(0, Math.min(1, t.serious)), u = Math.max(0, Math.min(1, t.sad)), f = Math.max(0, Math.min(1, t.stalled)), g = Math.max(0, Math.min(1, t.crashed)), v = (h, d = 0) => d0(
    h.map((m) => S0(m, d)),
    e,
    r
  ), k = Ot(s, f, g), b = k.map((h) => S0(h)), w = k.map((h) => S0(h, -0.105));
  let R = "", W = "";
  for (let h = 0; h < b.length; h++) {
    const d = b[h], m = b[(h + 1) % b.length], p = [m[1] - d[1], d[0] - m[0], 0], x = s0(p, e, r), S = s0(d, e, r);
    if (x[0] * -S[0] + x[1] * -S[1] + x[2] * (5 - S[2]) <= 0)
      continue;
    const P = d0(
      [d, m, w[(h + 1) % b.length], w[h]],
      e,
      r
    );
    x[0] * -0.5 + x[1] * -0.7 + x[2] * 0.3 > 0 ? W += P : R += P;
  }
  const C = (h, d, m, p = 1) => {
    const x = r0(
      0,
      0,
      t.eyeRadius * p * (1 + m * t.browTilt * 2),
      t.eyeRadius * p
    ).map(([S, P], E) => {
      const O = t.eyeRadius * p, $ = -0.02 - m * S * 0.45 + 0.025 * (1 - (S / O) ** 2), F = P + (Math.max(P, $) - P) * u, q = m === 1 ? E : (32 - E + 64) % 64, a0 = m * X0[q][0], J = X0[q][1], k0 = m * Z0[q][0], m0 = Z0[q][1], w0 = 1 - (1 - i) * (1 - s * 0.8) * (1 - f) * (1 - g);
      return [
        h + S + (a0 - S) * s + (k0 - S) * f,
        d + (F + (J - F) * s + (m0 - F) * f) * w0
      ];
    });
    return v(x);
  }, K = r0(0, 0.22, t.mouthWidth, t.mouthOpen * 0.65).map(
    ([h, d], m) => [
      (h + (I0[m][0] - h) * s + (_0[m][0] - h) * f) * (1 - g),
      0.24 + (d + (I0[m][1] - d) * s + (_0[m][1] - d) * f - 0.24) * (1 - g)
    ]
  );
  let T = "";
  if (s > 1e-3)
    for (const h of [-0.3, -0.21, -0.11, 0.11, 0.21, 0.3]) {
      const d = 0.78 - Math.abs(h) * 0.31;
      T += v(
        Z(
          [
            [h * 0.82, 0.555 + Math.abs(h) * 0.13],
            [h, d]
          ],
          0.012 * s
        )
      );
    }
  const Q = (h) => {
    if (s < 1e-3) return "";
    const d = [[h * 0.635, -0.44]], m = [
      [
        [0.59, -0.29],
        [0.55, -0.27],
        [0.58, -0.215]
      ],
      [
        [0.65, -0.15],
        [0.615, -0.065],
        [0.59, -0.02]
      ],
      [
        [0.56, 0.04],
        [0.59, 0.12],
        [0.6, 0.17]
      ]
    ];
    for (const [p, x, S] of m) {
      const P = d.at(-1);
      for (let E = 1; E <= 14; E++) {
        const O = E / 14, $ = 1 - O;
        d.push([
          $ ** 3 * P[0] + 3 * $ * $ * O * p[0] * h + 3 * $ * O * O * x[0] * h + O ** 3 * S[0] * h,
          $ ** 3 * P[1] + 3 * $ * $ * O * p[1] + 3 * $ * O * O * x[1] + O ** 3 * S[1]
        ]);
      }
    }
    return v(Z(d, 9e-3 * s));
  }, z = (h) => {
    const d = Math.max(0, Math.min(1, t.brow));
    if (d < 1e-3) return "";
    const m = h * 0.285;
    return v(
      Z(
        [
          [m - h * 0.07, -0.405],
          [m, -0.425],
          [m + h * 0.055, -0.39]
        ],
        0.018 * d
      )
    );
  };
  return {
    crest: f + g > 0.999 ? "" : d0(
      Wt.map(
        ([h, d]) => [
          h * (1 - 0.28 * t.hood) * (1 - f - g),
          -0.93 - 0.07 * t.hood + (d + 0.93) * (1 - 0.3 * t.hood) * (1 - f - g),
          0.09
        ]
      ),
      e,
      r,
      !1
    ),
    maskEdge: d0(w, e, r),
    maskSide: R,
    maskSideLight: W,
    mask: d0(b, e, r),
    left: C(-0.285 + a + c, t.leftY, 1, n),
    right: C(0.285 + a + o, t.rightY, -1, l),
    leftPupil: g > 1e-3 ? v(r0(-0.285 + a, t.leftY, t.eyeRadius * 0.63 * g)) : "",
    rightPupil: g > 1e-3 ? v(r0(0.285 + a, t.rightY, t.eyeRadius * 0.63 * g)) : "",
    mouth: g > 0.999 ? "" : v(K),
    temple: Q(-1) + Q(1),
    teeth: T,
    leftBrow: z(-1),
    rightBrow: z(1),
    hand: ""
  };
}
const B = {
  front: "#f5f5f6",
  highlight: "#ffffff",
  midtone: "#f4f4f5",
  shadow: "#c9cbd0",
  side: "#969ba5",
  sideLight: "#c5c9d1",
  edge: "#96999f",
  crease: "#777d89"
};
function at(t, e, r) {
  return t === "mask" ? r ? `url(#${e}-mask)` : B.front : t;
}
const Bt = "M 151 441 Q 140 421 132 393 Q 110 323 101 253 L 94 184 Q 94 181 98 179 Q 119 167 141 163 L 140 146 Q 140 143 144 142 Q 170 132 201 129 L 200 115 Q 200 112 204 112 Q 235 107 268 110 Q 271 110 271 114 L 271 125 Q 302 124 329 132 Q 332 133 331 137 L 311 265 L 340 276 Q 344 278 343 282 L 326 420 Q 326 425 321 426 L 155 443 Q 152 443 151 441 Z", Tt = [
  "M141 163 Q148 208 150 250",
  "M201 129 Q207 185 205 241",
  "M271 125 Q269 183 260 241",
  "M311 265 L281 254 Q277 252 275 257 L263 296 Q262 300 267 300 Q285 300 297 307",
  "M297 307 Q262 316 238 347"
];
function it(t) {
  const e = t.match(/[MLQZ]|-?\d+(?:\.\d+)?/g);
  let r = 0, i = [0, 0];
  const a = [], c = () => [+e[r++], +e[r++]];
  for (; r < e.length; ) {
    const o = e[r++];
    if (o === "M" || o === "L") {
      const n = c(), l = o === "M" ? 1 : Math.max(
        1,
        Math.ceil(Math.hypot(n[0] - i[0], n[1] - i[1]) / 10)
      ), s = i;
      for (let u = 1; u <= l; u++)
        a.push([
          s[0] + (n[0] - s[0]) * u / l,
          s[1] + (n[1] - s[1]) * u / l
        ]);
      i = n;
    } else if (o === "Q") {
      const n = i, l = c(), s = c();
      for (let u = 1; u <= 10; u++) {
        const f = u / 10, g = 1 - f;
        a.push([
          g * g * n[0] + 2 * g * f * l[0] + f * f * s[0],
          g * g * n[1] + 2 * g * f * l[1] + f * f * s[1]
        ]);
      }
      i = s;
    }
  }
  return a.map(([o, n]) => [(o - 230) / 190, (n - 275) / 190]);
}
const G0 = it(Bt), It = Tt.map((t) => Z(it(t), 8e-3)), _t = 5;
function P0(t, e, r, i, a = "shrug", c = 0) {
  const o = (a === "raise" ? 0.48 : 0.4) * (0.32 + 0.68 * e), n = -t, l = [-0.242, t * 0.461, t * 0.854], s = [-t * 0.97, -0.115, -0.213], u = [0, -0.88, 0.475];
  function f([h, d], m) {
    const p = h * n;
    if (a === "raise") {
      const F = s0([p, d, m], t * 0.24, -0.08), q = t * 0.1 + c * 0.24, a0 = Math.cos(q), J = Math.sin(q);
      return s0(
        [
          t * 0.91 + o * (F[0] * a0 - F[1] * J),
          -0.38 - c * 0.035 + (1 - e) * 1.05 + o * (F[0] * J + F[1] * a0),
          0.96 + o * F[2]
        ],
        r * 0.32,
        i * 0.32
      );
    }
    const x = m + 0.1 * Math.max(0, -d - 0.15) ** 2, S = o * (p * l[0] + d * s[0] + x * u[0]), P = o * (p * l[1] + d * s[1] + x * u[1]), E = -t * c * 0.13, O = Math.cos(E), $ = Math.sin(E);
    return s0(
      [
        t * 0.86 + S * O - P * $,
        0.34 - c * 0.018 + (1 - e) * 0.48 + S * $ + P * O,
        1.04 + o * (p * l[2] + d * s[2] + x * u[2])
      ],
      r * 0.42,
      i * 0.42
    );
  }
  function g(h) {
    return e < 1e-4 || h.length < 3 ? "" : h.map(
      (d, m) => `${m ? "L" : "M"}${y0(d).map((p) => p.toFixed(3)).join(" ")}`
    ).join(" ") + "Z";
  }
  const v = G0.map((h) => f(h, 0.1)), k = G0.map((h) => f(h, -0.1));
  let b = "", w = "";
  for (let h = 0; h < v.length; h++) {
    const d = (h + 1) % v.length, m = v[h], p = v[d], x = k[d], S = p.map((F, q) => F - m[q]), P = x.map((F, q) => F - m[q]), E = [
      S[1] * P[2] - S[2] * P[1],
      S[2] * P[0] - S[0] * P[2],
      S[0] * P[1] - S[1] * P[0]
    ].map((F) => -F * n);
    if (E[0] * -m[0] + E[1] * -m[1] + E[2] * (5 - m[2]) <= 0) continue;
    const $ = g([m, p, x, k[h]]);
    -E[0] - 0.8 * E[1] + 0.2 * E[2] > 0 ? w += $ : b += $;
  }
  const R = f([0, 0], 0.1), W = f([1, 0], 0.1).map((h, d) => h - R[d]), C = f([0, 1], 0.1).map((h, d) => h - R[d]), K = [
    W[1] * C[2] - W[2] * C[1],
    W[2] * C[0] - W[0] * C[2],
    W[0] * C[1] - W[1] * C[0]
  ].map((h) => h * n), T = K[0] * -R[0] + K[1] * -R[1] + K[2] * (5 - R[2]) > 0, Q = v.reduce((h, d) => h + d[2], 0) / v.length, z = (h, d, m) => ({
    d: h,
    fill: d,
    depth: Q + m * 1e-5,
    opacity: e,
    stroke: "none"
  });
  return [
    z(g(k), T ? B.edge : "mask", 0),
    z(b, B.side, 1),
    z(w, B.sideLight, 2),
    z(T ? g(v) : "", "mask", 3),
    z(
      (T ? It : []).map((h) => g(h.map((d) => f(d, 0.101)))).join(""),
      B.crease,
      4
    )
  ];
}
const f0 = (t) => Math.max(0, Math.min(1, t)), Xt = 3 * _t, Zt = Array.from({ length: Xt }, () => ({
  d: "",
  fill: "mask",
  opacity: 0,
  depth: 0,
  stroke: "none"
}));
function ct(t) {
  const e = f0(t.shrug), r = f0(t.raise), i = 1 - 0.25 * e - 0.18 * r;
  return `translate(${(160 + 8 * r).toFixed(5)} ${(160 - 20 * e).toFixed(5)}) scale(${i.toFixed(5)}) translate(-160 -160)`;
}
function lt(t, e = 0, r = 0, i = 0, a = 0) {
  return t.shrug < 1e-4 && t.raise < 1e-4 ? Zt : [
    ...P0(-1, f0(t.shrug), e, r, "shrug", a),
    ...P0(1, f0(t.shrug), e, r, "shrug", a),
    ...P0(-1, f0(t.raise), e, r, "raise", i)
  ].sort((c, o) => c.depth - o.depth);
}
const $0 = {
  yaw: 0,
  pitch: 0,
  bob: 0,
  roll: 0,
  scale: 0,
  gazeX: 0,
  gazeY: 0,
  leftX: 0,
  rightX: 0,
  leftY: 0,
  rightY: 0,
  leftEye: 1,
  rightEye: 1,
  eyeScale: 1,
  mouthScale: 1,
  blink: 1,
  handAmount: 1,
  raiseAmount: 1,
  palmSway: 0,
  wave: 0,
  alert: 0
}, ht = 2.7, R0 = ht, Gt = (t) => t * t * (3 - 2 * t);
function Nt(t, e) {
  if (e) {
    if (t <= e[0][0]) return e[0][1];
    for (let r = 1; r < e.length; r++) {
      const [i, a] = e[r], [c, o] = e[r - 1];
      if (t <= i) return o + (a - o) * Gt((t - c) / (i - c));
    }
    return e.at(-1)[1];
  }
}
const Ht = {
  idle: {
    bob: [
      [0, 0],
      [0.35, 5],
      [0.85, -5],
      [1.4, 0],
      [2.4, 0]
    ],
    gazeX: [
      [0, 0],
      [0.5, -0.045],
      [1.15, 0.04],
      [1.9, 0]
    ],
    blink: [
      [0, 1],
      [0.7, 1],
      [0.78, 0.08],
      [0.92, 1]
    ]
  },
  curious: {
    roll: [
      [0, 0],
      [0.48, -0.8],
      [1.16, 0.8],
      [1.95, 0]
    ],
    palmSway: [
      [0, 0],
      [0.48, 0.7],
      [0.82, -0.65],
      [1.16, 0.7],
      [1.5, -0.65],
      [1.95, 0]
    ],
    bob: [
      [0, 0],
      [0.45, -1.5],
      [1.05, 1.5],
      [2.1, 0]
    ]
  },
  raise: {
    pitch: [
      [0, 0],
      [0.42, -5],
      [1.05, 4],
      [1.85, 0]
    ],
    gazeX: [
      [0, 0],
      [0.55, -0.055],
      [1.4, -0.035],
      [2.1, 0]
    ],
    bob: [
      [0, 0],
      [0.45, 6],
      [0.95, -5],
      [1.5, 0]
    ],
    wave: [
      [0, 0],
      [0.8, 0],
      [1.08, -0.85],
      [1.36, 0.85],
      [1.64, -0.75],
      [1.92, 0.7],
      [2.16, 0]
    ],
    raiseAmount: [
      [0, 0],
      [0.18, 0.08],
      [0.78, 1],
      [1.94, 1],
      [2.5, 0],
      [2.7, 0]
    ]
  },
  thinking: {
    yaw: [
      [0, 0],
      [0.38, 0],
      [0.78, -10],
      [1.1, -10],
      [1.62, 10],
      [1.92, 10],
      [2.48, 0]
    ],
    pitch: [
      [0, 0],
      [0.38, -7],
      [0.78, -9],
      [1.92, -9],
      [2.48, 0]
    ],
    gazeX: [
      [0, 0],
      [0.38, 0],
      [0.78, -0.065],
      [1.1, -0.065],
      [1.62, 0.065],
      [1.92, 0.065],
      [2.48, 0]
    ],
    gazeY: [
      [0, 0],
      [0.38, -0.075],
      [1.92, -0.075],
      [2.48, 0]
    ],
    mouthScale: [
      [0, 1],
      [0.42, 0.8],
      [1.92, 0.8],
      [2.48, 1]
    ],
    bob: [
      [0, 0],
      [0.42, 2],
      [1.15, -1],
      [2.48, 0]
    ]
  },
  surprised: {
    scale: [
      [0, 0],
      [0.24, -0.075],
      [0.55, 0.12],
      [1.05, -0.025],
      [1.65, 0]
    ],
    eyeScale: [
      [0, 1],
      [0.24, 0.75],
      [0.58, 1.34],
      [1.3, 1.07],
      [1.9, 1]
    ],
    mouthScale: [
      [0, 1],
      [0.24, 0.7],
      [0.6, 1.4],
      [1.55, 1]
    ],
    bob: [
      [0, 0],
      [0.22, 7],
      [0.58, -13],
      [1.2, 3],
      [1.85, 0]
    ],
    pitch: [
      [0, 0],
      [0.55, -8],
      [1.5, 0]
    ]
  },
  sad: {
    pitch: [
      [0, 0],
      [0.55, 10],
      [1.35, 15],
      [2.3, 0]
    ],
    gazeY: [
      [0, 0],
      [0.55, 0.045],
      [1.35, 0.065],
      [2.3, 0]
    ],
    eyeScale: [
      [0, 1],
      [0.65, 0.82],
      [1.35, 0.8],
      [2.3, 1]
    ],
    bob: [
      [0, 0],
      [0.55, 8],
      [1.35, 12],
      [2.3, 0]
    ],
    roll: [
      [0, 0],
      [1.1, -3],
      [2.3, 0]
    ]
  },
  serious: {
    pitch: [
      [0, 0],
      [0.35, 6],
      [1.1, -6],
      [2.1, 0]
    ],
    eyeScale: [
      [0, 1],
      [0.35, 0.82],
      [1.1, 0.89],
      [2.1, 1]
    ],
    gazeX: [
      [0, 0],
      [1.1, -0.035],
      [2.1, 0]
    ],
    scale: [
      [0, 0],
      [1.1, 0.055],
      [2.1, 0]
    ],
    bob: [
      [0, 0],
      [0.35, 4],
      [1.1, -5],
      [2.1, 0]
    ]
  },
  stalled: {
    yaw: [
      [0, 0],
      [0.32, -7],
      [0.58, -7],
      [0.66, 6],
      [1.12, 6],
      [1.22, -3],
      [1.72, -3],
      [2.1, 0]
    ],
    gazeX: [
      [0, 0],
      [0.32, -0.06],
      [0.58, -0.06],
      [0.66, 0.055],
      [1.12, 0.055],
      [1.22, -0.03],
      [1.72, -0.03],
      [2.1, 0]
    ],
    bob: [
      [0, 0],
      [0.32, 5],
      [0.58, 5],
      [0.66, -4],
      [1.12, -4],
      [1.22, 3],
      [1.72, 3],
      [2.1, 0]
    ],
    eyeScale: [
      [0, 1],
      [0.58, 1],
      [0.64, 0.55],
      [0.72, 1],
      [1.18, 1],
      [1.24, 0.65],
      [1.32, 1]
    ]
  },
  crashed: {
    roll: [
      [0, 0],
      [0.24, -9],
      [0.47, 10],
      [0.72, -5],
      [1.05, 0]
    ],
    bob: [
      [0, 0],
      [0.24, -5],
      [0.47, 7],
      [0.72, 12],
      [1.55, 4],
      [2.25, 0]
    ],
    eyeScale: [
      [0, 1],
      [0.35, 0.55],
      [0.65, 0.85],
      [1.3, 1]
    ],
    pitch: [
      [0, 0],
      [0.7, 12],
      [2.25, 0]
    ],
    alert: [
      [0, 0],
      [0.22, 0],
      [0.48, 1],
      [1.32, 1],
      [1.75, 0],
      [2.7, 0]
    ]
  },
  smile: {},
  laugh: {}
};
function N0(t, e) {
  if (!Number.isFinite(e) || e >= ht)
    return t === "raise" ? { ...$0, raiseAmount: 0 } : $0;
  const r = Ht[t], i = { ...$0 };
  for (const a of Object.keys(i)) {
    const c = Nt(Math.max(0, e), r[a]);
    c !== void 0 && (i[a] = c);
  }
  return i;
}
const Dt = Object.fromEntries(
  Object.entries(nt).map(([t, e]) => [
    t,
    { ...e, hood: 1 }
  ])
), H0 = (t, e = !1) => t === "skull" ? e ? Dt : nt : U0, ut = (t, e, r, i, a, c = 0, o = 0, n = 0, l = 1, s = 1) => a === "skull" ? zt(
  t,
  e,
  r,
  i,
  c,
  o,
  n,
  l,
  s
) : {
  crest: "",
  maskEdge: "",
  maskSide: "",
  maskSideLight: "",
  mask: "",
  teeth: "",
  temple: "",
  ...xt(t, e, r, i)
}, H = Math.PI / 180;
function Vt({
  pose: t,
  yaw: e = 0,
  pitch: r = 0,
  shading: i = !0,
  id: a = "sphere",
  decorative: c = !1,
  appearance: o = "sphere"
}) {
  const n = ut(
    t,
    e * H,
    r * H,
    1,
    o
  ), l = o === "skull" ? lt(t, e * H, r * H) : [];
  return /* @__PURE__ */ V(
    "svg",
    {
      "data-skull-svg": "",
      xmlns: "http://www.w3.org/2000/svg",
      viewBox: o === "skull" ? et(t.hood) : "0 0 320 320",
      width: "100%",
      height: "100%",
      "aria-hidden": c || void 0,
      style: { display: "block", overflow: "visible" },
      children: [
        /* @__PURE__ */ V("defs", { children: [
          /* @__PURE__ */ V("radialGradient", { id: `${a}-body`, cx: "33%", cy: "22%", r: "79%", children: [
            /* @__PURE__ */ y("stop", { offset: "0", stopColor: "#414145" }),
            /* @__PURE__ */ y("stop", { offset: ".42", stopColor: "#252528" }),
            /* @__PURE__ */ y("stop", { offset: ".8", stopColor: "#131315" }),
            /* @__PURE__ */ y("stop", { offset: "1", stopColor: "#080809" })
          ] }),
          /* @__PURE__ */ V("radialGradient", { id: `${a}-mask`, cx: "30%", cy: "18%", r: "95%", children: [
            /* @__PURE__ */ y("stop", { offset: "0", stopColor: B.highlight }),
            /* @__PURE__ */ y("stop", { offset: ".55", stopColor: B.midtone }),
            /* @__PURE__ */ y("stop", { offset: "1", stopColor: B.shadow })
          ] }),
          /* @__PURE__ */ y("clipPath", { id: `${a}-clip`, children: /* @__PURE__ */ y("circle", { cx: "160", cy: "160", r: "128" }) }),
          /* @__PURE__ */ y("clipPath", { id: `${a}-mask-face`, children: /* @__PURE__ */ y("path", { "data-eye-clip": "mask", d: n.mask }) }),
          /* @__PURE__ */ y("clipPath", { id: `${a}-left-eye`, children: /* @__PURE__ */ y("path", { "data-eye-clip": "left", d: n.left }) }),
          /* @__PURE__ */ y("clipPath", { id: `${a}-right-eye`, children: /* @__PURE__ */ y("path", { "data-eye-clip": "right", d: n.right }) })
        ] }),
        /* @__PURE__ */ V("g", { "data-character-motion": "", children: [
          /* @__PURE__ */ V(
            "g",
            {
              "data-skull-head": "",
              transform: o === "skull" ? ct(t) : void 0,
              children: [
                /* @__PURE__ */ y(
                  "path",
                  {
                    "data-part": "crest",
                    d: n.crest,
                    fill: "#151518",
                    opacity: 1 - t.hood
                  }
                ),
                /* @__PURE__ */ y(
                  "circle",
                  {
                    "data-body-sphere": "",
                    cx: "160",
                    cy: "160",
                    r: "128",
                    fill: i ? `url(#${a}-body)` : "#121214",
                    opacity: o === "skull" ? 1 - t.hood : 1
                  }
                ),
                o === "skull" && /* @__PURE__ */ y(
                  "path",
                  {
                    "data-hood": "",
                    d: J0(e * H, r * H),
                    fill: "#101012",
                    stroke: "#101012",
                    strokeWidth: "0.8",
                    opacity: t.hood
                  }
                ),
                o === "skull" && /* @__PURE__ */ y(
                  "path",
                  {
                    "data-portrait-lightning": "",
                    d: tt(e * H, r * H),
                    fill: "#101012",
                    stroke: "#101012",
                    strokeWidth: "0.8",
                    opacity: t.hood
                  }
                ),
                o === "skull" && /* @__PURE__ */ y(
                  "g",
                  {
                    "data-loading-dots": "",
                    opacity: t.stalled,
                    transform: `translate(0 ${-6 * t.hood})`,
                    children: [139, 160, 181].map((s, u) => /* @__PURE__ */ y(
                      "circle",
                      {
                        "data-loading-dot": "",
                        cx: s,
                        cy: u === 1 ? 13 : 28,
                        r: "7.5",
                        fill: t.hood > 0.5 ? "#fff" : "#202024",
                        opacity: [0.35, 0.7, 1][u]
                      },
                      s
                    ))
                  }
                ),
                /* @__PURE__ */ V(
                  "g",
                  {
                    "data-skull-face": "",
                    transform: o === "skull" ? ot(t.hood) : void 0,
                    children: [
                      /* @__PURE__ */ y(
                        "g",
                        {
                          fill: "#fff",
                          clipPath: o === "skull" ? void 0 : `url(#${a}-clip)`,
                          children: Object.keys(n).filter((s) => s !== "hand" && s !== "crest").map((s) => /* @__PURE__ */ y(
                            "path",
                            {
                              "data-part": s,
                              d: n[s],
                              fill: s === "maskSide" ? B.side : s === "maskSideLight" ? B.sideLight : s === "maskEdge" ? B.edge : s === "mask" ? i ? `url(#${a}-mask)` : B.front : s.endsWith("Pupil") && o === "skull" ? "#4b4752" : o === "skull" ? "#101012" : s.endsWith("Pupil") ? "#111113" : void 0,
                              clipPath: o === "skull" && !s.startsWith("mask") ? `url(#${a}-mask-face)` : s.endsWith("Pupil") ? `url(#${a}-${s === "leftPupil" ? "left" : "right"}-eye)` : void 0,
                              opacity: s.endsWith("Brow") ? t.brow : 1
                            },
                            s
                          ))
                        }
                      ),
                      /* @__PURE__ */ y(
                        "path",
                        {
                          fill: "#fff",
                          "data-part": "hand",
                          d: n.hand,
                          opacity: t.hand
                        }
                      )
                    ]
                  }
                ),
                o === "skull" && /* @__PURE__ */ V(
                  "g",
                  {
                    "data-crash-alert": "",
                    opacity: "0",
                    transform: "translate(260 52) scale(.3) translate(-260 -52)",
                    children: [
                      /* @__PURE__ */ y(
                        "path",
                        {
                          d: "M260 16 L259 47",
                          fill: "none",
                          stroke: "#e5484d",
                          strokeWidth: "12",
                          strokeLinecap: "round"
                        }
                      ),
                      /* @__PURE__ */ y("circle", { cx: "259", cy: "67", r: "7", fill: "#e5484d" })
                    ]
                  }
                )
              ]
            }
          ),
          /* @__PURE__ */ y(
            "g",
            {
              "data-skull-hands": "",
              stroke: "#565861",
              strokeWidth: "0.8",
              strokeLinejoin: "round",
              children: l.map((s, u) => /* @__PURE__ */ y(
                "path",
                {
                  "data-hand-face": "",
                  d: s.d,
                  fill: at(s.fill, a, i),
                  stroke: s.stroke ?? "#565861",
                  opacity: s.opacity
                },
                u
              ))
            }
          )
        ] })
      ]
    }
  );
}
function Ut({
  emotion: t = "idle",
  appearance: e = "sphere",
  portrait: r = !1,
  size: i = 256,
  followPointer: a = !0,
  reducedMotion: c,
  paused: o = !1,
  playKey: n = 0,
  shading: l = !0,
  yaw: s,
  pitch: u,
  decorative: f = !1,
  className: g,
  style: v
}) {
  const k = "sphere-" + gt().replace(/[^a-zA-Z0-9]/g, ""), b = bt(), w = c ?? !!b, R = N(null), W = N({
    pose: { ...H0(e, r)[t] },
    yaw: s ?? 0,
    pitch: u ?? 0
  }), C = N({
    emotion: t,
    followPointer: a,
    paused: o,
    yaw: s,
    pitch: u,
    appearance: e,
    portrait: r,
    shading: l,
    playKey: n
  });
  C.current = {
    emotion: t,
    followPointer: a,
    paused: o,
    yaw: s,
    pitch: u,
    appearance: e,
    portrait: r,
    shading: l,
    playKey: n
  };
  const K = N({}), T = N(0), Q = N({
    emotion: t,
    appearance: e,
    playKey: n,
    elapsed: R0
  }), z = N(() => {
  }), h = N(!0), d = N({}), m = N([]);
  return x0(() => {
    if (!R.current || typeof IntersectionObserver > "u") return;
    const p = new IntersectionObserver(([x]) => {
      h.current = x.isIntersecting;
    });
    return p.observe(R.current), () => p.disconnect();
  }, []), x0(() => {
    const p = R.current;
    if (!p) return;
    const x = Object.fromEntries(
      Array.from(p.querySelectorAll("[data-part]")).map(
        (I) => [I.dataset.part, I]
      )
    ), S = Object.fromEntries(
      Array.from(p.querySelectorAll("[data-eye-clip]")).map(
        (I) => [I.dataset.eyeClip, I]
      )
    ), P = p.querySelector("[data-skull-head]"), E = p.querySelector("[data-skull-svg]"), O = p.querySelector("[data-skull-face]"), $ = p.querySelector("[data-portrait-lightning]"), F = p.querySelector("[data-hood]"), q = p.querySelector("[data-body-sphere]"), a0 = p.querySelector("[data-character-motion]"), J = p.querySelector("[data-loading-dots]"), k0 = Array.from(p.querySelectorAll("[data-loading-dot]")), m0 = p.querySelector("[data-crash-alert]"), w0 = Array.from(p.querySelectorAll("[data-hand-face]"));
    m.current = [];
    const j0 = (I, p0, G = !1) => {
      const M = C.current;
      if (!G && (M.paused || !h.current)) return;
      (Q.current.emotion !== M.emotion || Q.current.appearance !== M.appearance || Q.current.playKey !== M.playKey) && (Q.current = {
        emotion: M.emotion,
        appearance: M.appearance,
        playKey: M.playKey,
        elapsed: 0
      }), G || (Q.current.elapsed = Math.min(
        R0,
        Q.current.elapsed + I
      ));
      const L0 = (L, j, t0, e0 = 145) => {
        const o0 = K.current[L] ??= { value: t0, velocity: 0 };
        return G ? (o0.value = j, o0.velocity = 0, j) : Mt(o0, j, I, e0, 24);
      }, A = {
        ...H0(M.appearance, M.portrait)[M.emotion]
      };
      for (const L of Object.keys(A))
        A[L] = L0(L, A[L], W.current.pose[L]);
      const Y = M.appearance === "skull" && !G ? N0(M.emotion, Q.current.elapsed) : N0("idle", R0);
      M.appearance === "skull" && (A.eyeRadius *= Y.eyeScale, A.leftY += Y.gazeY + Y.leftY, A.rightY += Y.gazeY + Y.rightY, A.mouthOpen *= Y.mouthScale, A.shrug *= Y.handAmount, A.raise *= Y.raiseAmount);
      let O0 = M.yaw ?? 0, W0 = M.pitch ?? 0;
      if (M.followPointer && p0?.present) {
        const L = p.getBoundingClientRect(), j = M.appearance === "skull" && M.emotion === "thinking" ? Math.min(1, Math.max(0, (Q.current.elapsed - 2.15) / 0.55)) : 1;
        M.yaw === void 0 && (O0 = Math.tanh(
          (p0.x - L.left - L.width / 2) / Math.max(180, L.width)
        ) * (M.portrait ? 50 : 32) * j), M.pitch === void 0 && (W0 = Math.tanh(
          (p0.y - L.top - L.height / 2) / Math.max(200, L.height)
        ) * (M.portrait ? 34 : 23) * j);
      }
      const C0 = (L0("yaw", O0, W.current.yaw, 100) + Y.yaw) * H, Q0 = (L0("pitch", W0, W.current.pitch, 100) + Y.pitch) * H;
      T.current += I;
      const dt = T.current % 4.7, ft = G ? 1 : Math.min(
        Y.blink,
        1 - 0.92 * Math.exp(-Math.pow((dt - 4.35) / 0.07, 2))
      ), [g0, b0] = M.appearance === "skull" ? qt(
        C0,
        Q0,
        A,
        Q.current.elapsed,
        G || !M.followPointer
      ) : [C0, Q0], h0 = ut(
        A,
        g0,
        b0,
        ft,
        M.appearance,
        Y.gazeX,
        Y.leftX,
        Y.rightX,
        Y.leftEye,
        Y.rightEye
      );
      M.appearance === "skull" && (E?.setAttribute("viewBox", et(A.hood)), O?.setAttribute(
        "transform",
        ot(A.hood)
      ), $?.setAttribute(
        "d",
        tt(g0, b0)
      ), $?.setAttribute("opacity", String(A.hood)), x.crest?.setAttribute("opacity", String(1 - A.hood)), F?.setAttribute("d", J0(g0, b0)), F?.setAttribute("opacity", String(A.hood)), q?.setAttribute("opacity", String(1 - A.hood)), J?.setAttribute("opacity", String(A.stalled)), J?.setAttribute(
        "transform",
        `translate(0 ${(-6 * A.hood).toFixed(3)})`
      ), k0.forEach((L, j) => {
        const t0 = G ? [0, 0.5, 1][j] : (1 + Math.sin(T.current * 8 - j * Math.PI * 2 / 3)) / 2;
        L.setAttribute("cy", String([28, 13, 28][j] - t0 * 5)), L.setAttribute("opacity", String(0.3 + t0 * 0.7)), L.setAttribute("fill", A.hood > 0.5 ? "#fff" : "#202024");
      }), m0?.setAttribute(
        "opacity",
        String(A.crashed * Y.alert)
      ), m0?.setAttribute(
        "transform",
        `translate(260 ${52 + 8 * (1 - Y.alert)}) scale(${(0.3 + 0.7 * Y.alert).toFixed(4)}) translate(-260 -52)`
      ));
      const mt = M.appearance === "skull" && !G && M.emotion !== "crashed" ? Math.sin(T.current * 1.5) * 1.2 : 0, pt = Y.bob + mt;
      a0?.setAttribute(
        "transform",
        M.appearance === "skull" ? `translate(160 160) translate(0 ${pt.toFixed(3)}) rotate(${Y.roll.toFixed(3)}) scale(${(1 + Y.scale).toFixed(5)}) translate(-160 -160)` : ""
      );
      for (const L of Object.keys(h0))
        h0[L] !== d.current[L] && (x[L]?.setAttribute("d", h0[L]), S[L]?.setAttribute("d", h0[L]));
      if (d.current = h0, P?.setAttribute(
        "transform",
        M.appearance === "skull" ? ct(A) : ""
      ), M.appearance === "skull") {
        const L = lt(
          A,
          g0,
          b0,
          Y.wave,
          Y.palmSway
        );
        L.forEach((j, t0) => {
          const e0 = w0[t0], o0 = m.current[t0];
          j.d !== o0?.d && e0?.setAttribute("d", j.d);
          const q0 = at(j.fill, k, M.shading);
          e0?.getAttribute("fill") !== q0 && e0?.setAttribute("fill", q0), j.stroke !== o0?.stroke && e0?.setAttribute("stroke", j.stroke ?? "#565861"), j.opacity !== o0?.opacity && e0?.setAttribute("opacity", String(j.opacity));
        }), m.current = L;
      }
      x.leftBrow?.setAttribute("opacity", String(A.brow)), x.rightBrow?.setAttribute("opacity", String(A.brow)), x.hand?.setAttribute("opacity", String(A.hand));
    };
    if (z.current = () => j0(0, void 0, !0), w) {
      z.current();
      return;
    }
    return yt((I, p0, G) => j0(I, G));
  }, [w, e, r]), x0(() => {
    w && z.current();
  }, [w, t, s, u, e, r, l, n]), /* @__PURE__ */ y(
    "span",
    {
      ref: R,
      className: g,
      "data-sphere-emoji": "",
      "data-appearance": e,
      role: f ? void 0 : "img",
      "aria-hidden": f || void 0,
      "aria-label": f ? void 0 : `${e === "skull" && t === "curious" ? "无语摊手" : vt[t]}表情`,
      style: {
        display: "inline-block",
        width: i,
        height: i,
        flexShrink: 0,
        ...v
      },
      children: /* @__PURE__ */ y(
        Vt,
        {
          ...W.current,
          id: k,
          appearance: e,
          shading: l,
          decorative: !0
        }
      )
    }
  );
}
function oe({ form: t = "orb", ...e }) {
  return /* @__PURE__ */ y(
    Ut,
    {
      ...e,
      appearance: "skull",
      portrait: t === "character"
    }
  );
}
export {
  oe as SkullOrb,
  ee as skullEmotions
};
