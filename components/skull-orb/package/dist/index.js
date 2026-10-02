import { jsxs as W, Fragment as k0, jsx as u } from "react/jsx-runtime";
import { useId as v0, useRef as V, useEffect as At } from "react";
import { useReducedMotion as w0 } from "motion/react";
function x0(t, e, n, a, s) {
  const l = Math.max(1, Math.ceil(n / 0.008333333333333333)), o = n / l;
  for (let r = 0; r < l; r++)
    t.velocity += (a * (e - t.value) - s * t.velocity) * o, t.value += t.velocity * o;
  return Number.isFinite(t.value) || (t.value = e, t.velocity = 0), t.value;
}
const Et = {
  x: 0,
  y: 0,
  speed: 0,
  present: !1,
  pressed: !1,
  stamp: 0
}, lt = /* @__PURE__ */ new Set();
let K = { ...Et }, tt = 0, ct = 0;
function t0(t) {
  tt = 0;
  const e = ct ? Math.min((t - ct) / 1e3, 0.05) : 1 / 60;
  ct = t;
  for (const n of lt) n(e, t, K);
  lt.size && !document.hidden && (tt = requestAnimationFrame(t0));
}
function e0() {
  !tt && !document.hidden && (ct = 0, tt = requestAnimationFrame(t0));
}
function Mt(t) {
  if (!t.isPrimary) return;
  const e = performance.now(), n = (e - K.stamp) / 1e3, a = K.present && n > 4e-3 && n < 0.15 ? Math.hypot(t.clientX - K.x, t.clientY - K.y) / n : 0;
  K = {
    x: t.clientX,
    y: t.clientY,
    speed: Math.min(a, 6e3),
    present: !0,
    pressed: (t.buttons & 1) > 0,
    stamp: e
  };
}
function ot() {
  K = { ...Et };
}
function _t() {
  K.pressed = !1;
}
function Xt() {
  ot(), document.hidden ? (cancelAnimationFrame(tt), tt = 0, ct = 0) : e0();
}
function S0(t) {
  return lt.add(t), lt.size === 1 && (window.addEventListener("pointermove", Mt, { passive: !0 }), window.addEventListener("pointerdown", Mt, { passive: !0 }), window.addEventListener("pointerup", _t, { passive: !0 }), window.addEventListener("pointercancel", ot, { passive: !0 }), window.addEventListener("blur", ot), document.addEventListener("pointerleave", ot), document.addEventListener("visibilitychange", Xt)), e0(), () => {
    lt.delete(t), lt.size || (cancelAnimationFrame(tt), tt = 0, ct = 0, K = { ...Et }, window.removeEventListener("pointermove", Mt), window.removeEventListener("pointerdown", Mt), window.removeEventListener("pointerup", _t), window.removeEventListener("pointercancel", ot), window.removeEventListener("blur", ot), document.removeEventListener("pointerleave", ot), document.removeEventListener("visibilitychange", Xt));
  };
}
const A0 = {
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
}, Z = {
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
}, o0 = {
  idle: Z,
  raise: Z,
  stalled: Z,
  crashed: Z,
  sad: { ...Z, mouthCurve: -0.06 },
  serious: { ...Z, eyeRadius: 0.1, mouthWidth: 0.09 },
  smile: {
    ...Z,
    eyeLength: 0.14,
    eyeBend: -0.07,
    eyeRadius: 0.06,
    mouthWidth: 0.175,
    mouthCurve: 0.095
  },
  laugh: {
    ...Z,
    eyeLength: 0.145,
    eyeBend: -0.08,
    eyeRadius: 0.06,
    mouthWidth: 0.185,
    mouthCurve: 0,
    mouthOpen: 0.18
  },
  surprised: {
    ...Z,
    eyeRadius: 0.15,
    leftY: -0.2,
    rightY: -0.2,
    mouthWidth: 0.063,
    mouthRound: 1,
    mouthOpen: 0.14,
    brow: 1
  },
  curious: {
    ...Z,
    rightY: -0.22,
    mouthWidth: 0.1,
    mouthTilt: -0.045,
    brow: 1,
    browTilt: -0.085
  },
  thinking: {
    ...Z,
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
}, ht = 5, L0 = 128 * Math.sqrt(ht * ht - 1) / ht;
function $0([t, e], n, a, s = 1) {
  const l = Math.sqrt(Math.max(1e-4, 1 - t * t - e * e)), o = t * Math.cos(n) + l * Math.sin(n), r = l * Math.cos(n) - t * Math.sin(n);
  return [
    o * s,
    (e * Math.cos(a) + r * Math.sin(a)) * s,
    (r * Math.cos(a) - e * Math.sin(a)) * s
  ];
}
function kt([t, e, n]) {
  const a = L0 * ht / (ht - n);
  return [160 + t * a, 160 + e * a];
}
function Y0(t, e, n, a = 1) {
  const s = t.map((c) => $0(c, e, n, a)), l = [], o = a * a / ht;
  for (let c = 0; c < s.length; c++) {
    const i = s[c], d = s[(c + 1) % s.length];
    if (i[2] >= o && l.push(i), i[2] >= o != d[2] >= o) {
      const m = (o - i[2]) / (d[2] - i[2]);
      l.push([i[0] + (d[0] - i[0]) * m, i[1] + (d[1] - i[1]) * m, o]);
    }
  }
  return l.reduce((c, i, d) => {
    const m = l[(d + 1) % l.length];
    return c + i[0] * m[1] - m[0] * i[1];
  }, 0) < 0 && l.reverse(), l.length ? l.map(
    (c, i) => `${i ? "L" : "M"}${kt(c).map((d) => d.toFixed(3)).join(" ")}`
  ).join(" ") + "Z" : "";
}
function rt(t, e, n, a = n) {
  return Array.from({ length: 64 }, (s, l) => {
    const o = l / 64 * Math.PI * 2;
    return [t + Math.cos(o) * n, e + Math.sin(o) * a];
  });
}
function U(t, e) {
  const n = t.map((o, r) => {
    const c = t[Math.max(0, r - 1)], i = t[Math.min(t.length - 1, r + 1)];
    return Math.atan2(i[1] - c[1], i[0] - c[0]);
  }), a = (o, r) => [
    t[o][0] - Math.sin(n[o]) * e * r,
    t[o][1] + Math.cos(n[o]) * e * r
  ], s = t.map((o, r) => a(r, 1)), l = t.at(-1);
  for (let o = 1; o <= 12; o++) {
    const r = n.at(-1) + Math.PI / 2 - o * Math.PI / 12;
    s.push([l[0] + Math.cos(r) * e, l[1] + Math.sin(r) * e]);
  }
  for (let o = t.length - 1; o >= 0; o--) s.push(a(o, -1));
  for (let o = 1; o <= 12; o++) {
    const r = n[0] - Math.PI / 2 - o * Math.PI / 12;
    s.push([
      t[0][0] + Math.cos(r) * e,
      t[0][1] + Math.sin(r) * e
    ]);
  }
  return s;
}
function dt(t, e, n, a, s = 0) {
  return Array.from({ length: 33 }, (l, o) => {
    const r = Math.PI / 3, c = (o / 32 * 2 - 1) * r, i = Math.sin(c) / Math.sin(r), d = (Math.cos(c) - Math.cos(r)) / (1 - Math.cos(r));
    return [t + i * n, e + d * a + i * s];
  });
}
function P0(t, e = 0, n = 0, a = 1) {
  const s = (k, M = 1) => Y0(k, e, n, M), l = (k, M) => {
    const w = Math.sqrt(3), F = t.eyeLength < 1e-3 ? rt(k, M, t.eyeRadius, t.eyeRadius * a) : U(dt(k, M, t.eyeLength, t.eyeBend), t.eyeRadius);
    return s(
      F.map(([j, q]) => [
        k + (j - k) * w,
        M + (q - M) * w * (t.eyeLength < 1e-3 ? 1 : a)
      ])
    );
  }, o = (k, M) => {
    const w = Math.max(0, 1 - t.eyeLength / 0.075);
    if (w < 1e-3) return "";
    const F = t.eyeRadius * Math.sqrt(3) * 0.32 * w;
    return s(rt(k, M + t.eyeBend, F, F * a));
  }, r = dt(0, 0.22, t.mouthWidth, t.mouthCurve, t.mouthTilt), c = r.map(([k, M]) => {
    const w = Math.max(-1, Math.min(1, k / t.mouthWidth));
    return [
      k,
      M + t.mouthOpen * Math.sqrt(Math.max(0, 1 - w * w))
    ];
  }).reverse(), i = [...r, ...c], d = i.map((k, M) => {
    const w = M / (i.length - 1) * Math.PI * 2;
    return [
      -Math.cos(w) * t.mouthWidth,
      0.25 - Math.sin(w) * (t.mouthOpen * 0.6)
    ];
  }), m = i.map(
    ([k, M], w) => [
      k + (d[w][0] - k) * t.mouthRound,
      M + (d[w][1] - M) * t.mouthRound
    ]
  ), b = s(m) + s(U(m.slice(0, 33), 0.044)) + s(U(m.slice(33), 0.044)), v = (1 - t.hand) * 0.35;
  return {
    left: l(-0.39, t.leftY),
    right: l(0.39, t.rightY),
    leftPupil: o(-0.39, t.leftY),
    rightPupil: o(0.39, t.rightY),
    mouth: b,
    leftBrow: s(
      U(dt(-0.39, -0.54, 0.105, -0.028, t.browTilt), 0.04)
    ),
    rightBrow: s(
      U(dt(0.39, -0.54, 0.105, -0.028, -t.browTilt * 0.3), 0.04)
    ),
    hand: s(rt(0.31, 0.53 + v, 0.115, 0.12), 1.035) + s(
      U(
        [
          [0.28, 0.49 + v],
          [0.24, 0.42 + v],
          [0.19, 0.36 + v],
          [0.145, 0.32 + v]
        ],
        0.044
      ),
      1.035
    ) + s(
      U(dt(0.26, 0.5 + v, 0.115, 0.025, -0.012), 0.046),
      1.045
    )
  };
}
function nt([t, e, n], a, s) {
  const l = t * Math.cos(a) + n * Math.sin(a), o = n * Math.cos(a) - t * Math.sin(a);
  return [
    l,
    e * Math.cos(s) + o * Math.sin(s),
    o * Math.cos(s) - e * Math.sin(s)
  ];
}
function Lt([t, e, n]) {
  const a = n - 5, s = t * t + e * e + a * a, l = 10 * a, r = l * l - 4 * s * 24;
  return r <= 0 ? 0.01 : (-l - Math.sqrt(r)) / (2 * s) - 1;
}
function ft(t, e, n, a = !0) {
  const s = t.map((o) => nt(o, e, n)), l = [];
  for (let o = 0; o < s.length; o++) {
    const r = s[o], c = s[(o + 1) % s.length], i = !a || Lt(r) >= -1e-5, d = !a || Lt(c) >= -1e-5;
    if (i && l.push(r), i !== d) {
      let m = 0, b = 1;
      for (let k = 0; k < 18; k++) {
        const M = (m + b) / 2, w = [
          r[0] + (c[0] - r[0]) * M,
          r[1] + (c[1] - r[1]) * M,
          r[2] + (c[2] - r[2]) * M
        ];
        Lt(w) >= -1e-5 === i ? m = M : b = M;
      }
      const v = (m + b) / 2;
      l.push([
        r[0] + (c[0] - r[0]) * v,
        r[1] + (c[1] - r[1]) * v,
        r[2] + (c[2] - r[2]) * v
      ]);
    }
  }
  return l.length >= 3 ? l.map(
    (o, r) => `${r ? "L" : "M"}${kt(o).map((c) => c.toFixed(3)).join(" ")}`
  ).join(" ") + "Z" : "";
}
function C0(t, e) {
  const n = Math.min(e, 0.28);
  return Math.sqrt(Math.max(0.12, 1 - t * t - n * n)) + 0.11 + Math.max(0, e - 0.28) * 0.24;
}
function $t([t, e], n = 0) {
  return [t, e, C0(t, e) + n];
}
const F0 = [
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
], R0 = [
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
], O0 = (t, e, n) => {
  const a = 160 + (t - 305) * 0.54, l = 73 + ((e < 558 ? 558 + (e - 558) * 0.7 : e) - 558) * 0.54, o = 128 * Math.sqrt(24) / 5.2;
  return [
    (a - 160) / o,
    (l - 160) / o,
    n
  ];
};
function r0(t, e, n, a) {
  const s = (l, o) => kt(nt(O0(l, o, a), e * 0.22, n * 0.16));
  return t.map((l) => {
    if (l[0] === "Z") return "Z";
    const o = l.slice(1), r = [];
    for (let c = 0; c < o.length; c += 2) {
      const i = s(o[c], o[c + 1]);
      r.push(`${i[0].toFixed(3)} ${i[1].toFixed(3)}`);
    }
    return l[0] + r.join(" ");
  }).join(" ");
}
const Rt = (t = 0, e = 0) => r0(F0, t, e, -0.2), Ot = (t = 0, e = 0) => r0(R0, t, e, -0.2), n0 = (t) => {
  const e = -44 - 86 * t;
  return `-24 ${e.toFixed(3)} 368 ${(380 - e).toFixed(3)}`;
}, s0 = (t) => `translate(160 160) scale(${(1 - 0.25 * t).toFixed(5)}) translate(-160 -160)`, le = [
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
function jt(t) {
  const e = [[0, -0.79]];
  for (const [n, a, s] of t) {
    const l = e.at(-1);
    for (let o = 1; o <= 12; o++) {
      const r = o / 12, c = 1 - r;
      e.push([
        c ** 3 * l[0] + 3 * c * c * r * n[0] + 3 * c * r * r * a[0] + r ** 3 * s[0],
        c ** 3 * l[1] + 3 * c * c * r * n[1] + 3 * c * r * r * a[1] + r ** 3 * s[1]
      ]);
    }
  }
  return e;
}
const E0 = jt([
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
]), j0 = jt([
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
]), W0 = [
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
], Zt = jt([
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
]), q0 = [
  ...Zt,
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
  ...Zt.slice(0, -1).reverse().map(([t, e]) => [-t, e])
], Q0 = 320, Yt = [E0, j0, W0, q0].map(
  (t) => vt(t, Q0)
);
function B0(t, e = 0, n = 0) {
  const a = [
    Math.max(0, 1 - t - e - n),
    t,
    e,
    n
  ];
  return Yt[0].map(
    (s, l) => a.reduce(
      (o, r, c) => [o[0] + Yt[c][l][0] * r, o[1] + Yt[c][l][1] * r],
      [0, 0]
    )
  );
}
const D = {
  ...o0.idle,
  eyeRadius: 0.175,
  leftY: -0.19,
  rightY: -0.19,
  mouthWidth: 0.105,
  mouthRound: 1,
  mouthOpen: 0.17,
  hand: 0
}, i0 = {
  idle: D,
  smile: D,
  laugh: D,
  surprised: {
    ...D,
    eyeRadius: 0.2,
    leftY: -0.22,
    rightY: -0.22,
    mouthWidth: 0.125,
    mouthOpen: 0.245
  },
  curious: {
    ...D,
    shrug: 1,
    sad: 0.88,
    eyeRadius: 0.195,
    leftY: -0.17,
    rightY: -0.17,
    mouthWidth: 0.1,
    mouthOpen: 0.045
  },
  raise: {
    ...D,
    raise: 1,
    eyeRadius: 0.18,
    mouthWidth: 0.075,
    mouthOpen: 0.12
  },
  thinking: {
    ...D,
    eyeRadius: 0.155,
    leftY: -0.19,
    rightY: -0.19,
    browTilt: 0,
    mouthWidth: 0.082,
    mouthOpen: 0.11
  },
  sad: {
    ...D,
    sad: 1,
    brow: 1,
    eyeRadius: 0.195,
    leftY: -0.17,
    rightY: -0.17,
    mouthWidth: 0.073,
    mouthOpen: 0.155
  },
  stalled: {
    ...D,
    stalled: 1,
    leftY: -0.055,
    rightY: -0.055,
    eyeRadius: 0.18
  },
  crashed: {
    ...D,
    crashed: 1,
    leftY: -0.035,
    rightY: -0.035,
    eyeRadius: 0.185
  },
  serious: {
    ...D,
    serious: 1,
    eyeRadius: 0.195,
    leftY: 0.055,
    rightY: 0.055,
    mouthWidth: 0.085,
    mouthOpen: 0.16
  }
}, z0 = [
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
function vt(t, e) {
  const n = t.map(
    (s, l) => Math.hypot(
      s[0] - t[(l + 1) % t.length][0],
      s[1] - t[(l + 1) % t.length][1]
    )
  ), a = n.reduce((s, l) => s + l, 0);
  return Array.from({ length: e }, (s, l) => {
    let o = l / e * a, r = 0;
    for (; o > n[r] && r < t.length - 1; ) o -= n[r++];
    const c = o / n[r], i = t[r], d = t[(r + 1) % t.length];
    return [i[0] + (d[0] - i[0]) * c, i[1] + (d[1] - i[1]) * c];
  });
}
function a0(t, e, n = 64) {
  const a = [t];
  for (const [s, l, o] of e) {
    const r = a.at(-1);
    for (let c = 1; c <= 14; c++) {
      const i = c / 14, d = 1 - i;
      a.push([
        d ** 3 * r[0] + 3 * d * d * i * s[0] + 3 * d * i * i * l[0] + i ** 3 * o[0],
        d ** 3 * r[1] + 3 * d * d * i * s[1] + 3 * d * i * i * l[1] + i ** 3 * o[1]
      ]);
    }
  }
  return vt(a, n);
}
const I0 = a0(
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
), Dt = a0(
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
), T0 = vt(
  [
    [0.185, -0.19],
    [0.185, 0.115],
    [0.075, 0.115],
    [0.075, 0.245],
    [-0.205, 0.245],
    [-0.205, -0.19]
  ],
  64
), Ut = vt(
  [
    [0.105, 0.285],
    [0.105, 0.395],
    [-0.105, 0.395],
    [-0.105, 0.285],
    [0, 0.16]
  ],
  64
);
function l0(t) {
  return Array.from({ length: 64 }, (e, n) => {
    const a = n / 64 * Math.PI * 2, s = [Math.cos(a), Math.sin(a)];
    let l = 0;
    for (let o = 0; o < t.length; o++) {
      const r = t[o], c = t[(o + 1) % t.length], i = [c[0] - r[0], c[1] - r[1]], d = s[0] * i[1] - s[1] * i[0];
      if (Math.abs(d) < 1e-8) continue;
      const m = (r[0] * i[1] - r[1] * i[0]) / d, b = (r[0] * s[1] - r[1] * s[0]) / d;
      m >= 0 && b >= 0 && b <= 1 && (l = Math.max(l, m));
    }
    return [s[0] * l, s[1] * l];
  });
}
const Nt = l0(I0), Ht = l0(T0);
function G0(t, e, n, a, s = !1) {
  if (s) return [t, e];
  const l = Math.max(0, Math.min(1, n.stalled)), o = 0.055, r = a % 2.1, c = r < 0.24 ? [0, 0.023, -0.018, 0][Math.min(3, Math.floor(r / 0.06))] : 0;
  return [
    t + (Math.round(t / o) * o - t + c) * l,
    e + (Math.round(e / o) * o - e) * l
  ];
}
function _0(t, e = 0, n = 0, a = 1, s = 0, l = 0, o = 0, r = 1, c = 1) {
  const i = Math.max(0, Math.min(1, t.serious)), d = Math.max(0, Math.min(1, t.sad)), m = Math.max(0, Math.min(1, t.stalled)), b = Math.max(0, Math.min(1, t.crashed)), v = (h, f = 0) => ft(
    h.map((p) => $t(p, f)),
    e,
    n
  ), k = B0(i, m, b), M = k.map((h) => $t(h)), w = k.map((h) => $t(h, -0.105));
  let F = "", j = "";
  for (let h = 0; h < M.length; h++) {
    const f = M[h], p = M[(h + 1) % M.length], g = [p[1] - f[1], f[0] - p[0], 0], S = nt(g, e, n), L = nt(f, e, n);
    if (S[0] * -L[0] + S[1] * -L[1] + S[2] * (5 - L[2]) <= 0)
      continue;
    const Y = ft(
      [f, p, w[(h + 1) % M.length], w[h]],
      e,
      n
    );
    S[0] * -0.5 + S[1] * -0.7 + S[2] * 0.3 > 0 ? j += Y : F += Y;
  }
  const q = (h, f, p, g = 1) => {
    const S = rt(
      0,
      0,
      t.eyeRadius * g * (1 + p * t.browTilt * 2),
      t.eyeRadius * g
    ).map(([L, Y], R) => {
      const O = t.eyeRadius * g, P = -0.02 - p * L * 0.45 + 0.025 * (1 - (L / O) ** 2), C = Y + (Math.max(Y, P) - Y) * d, z = p === 1 ? R : (32 - R + 64) % 64, st = p * Nt[z][0], it = Nt[z][1], wt = p * Ht[z][0], pt = Ht[z][1], xt = 1 - (1 - a) * (1 - i * 0.8) * (1 - m) * (1 - b);
      return [
        h + L + (st - L) * i + (wt - L) * m,
        f + (C + (it - C) * i + (pt - C) * m) * xt
      ];
    });
    return v(S);
  }, et = rt(0, 0.22, t.mouthWidth, t.mouthOpen * 0.65).map(
    ([h, f], p) => [
      (h + (Dt[p][0] - h) * i + (Ut[p][0] - h) * m) * (1 - b),
      0.24 + (f + (Dt[p][1] - f) * i + (Ut[p][1] - f) * m - 0.24) * (1 - b)
    ]
  );
  let G = "";
  if (i > 1e-3)
    for (const h of [-0.3, -0.21, -0.11, 0.11, 0.21, 0.3]) {
      const f = 0.78 - Math.abs(h) * 0.31;
      G += v(
        U(
          [
            [h * 0.82, 0.555 + Math.abs(h) * 0.13],
            [h, f]
          ],
          0.012 * i
        )
      );
    }
  const Q = (h) => {
    if (i < 1e-3) return "";
    const f = [[h * 0.635, -0.44]], p = [
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
    for (const [g, S, L] of p) {
      const Y = f.at(-1);
      for (let R = 1; R <= 14; R++) {
        const O = R / 14, P = 1 - O;
        f.push([
          P ** 3 * Y[0] + 3 * P * P * O * g[0] * h + 3 * P * O * O * S[0] * h + O ** 3 * L[0] * h,
          P ** 3 * Y[1] + 3 * P * P * O * g[1] + 3 * P * O * O * S[1] + O ** 3 * L[1]
        ]);
      }
    }
    return v(U(f, 9e-3 * i));
  }, I = (h) => {
    const f = Math.max(0, Math.min(1, t.brow));
    if (f < 1e-3) return "";
    const p = h * 0.285;
    return v(
      U(
        [
          [p - h * 0.07, -0.405],
          [p, -0.425],
          [p + h * 0.055, -0.39]
        ],
        0.018 * f
      )
    );
  };
  return {
    crest: m + b > 0.999 ? "" : ft(
      z0.map(
        ([h, f]) => [
          h * (1 - 0.28 * t.hood) * (1 - m - b),
          -0.93 - 0.07 * t.hood + (f + 0.93) * (1 - 0.3 * t.hood) * (1 - m - b),
          0.09
        ]
      ),
      e,
      n,
      !1
    ),
    maskEdge: ft(w, e, n),
    maskSide: F,
    maskSideLight: j,
    mask: ft(M, e, n),
    left: q(-0.285 + s + l, t.leftY, 1, r),
    right: q(0.285 + s + o, t.rightY, -1, c),
    leftPupil: b > 1e-3 ? v(rt(-0.285 + s, t.leftY, t.eyeRadius * 0.63 * b)) : "",
    rightPupil: b > 1e-3 ? v(rt(0.285 + s, t.rightY, t.eyeRadius * 0.63 * b)) : "",
    mouth: b > 0.999 ? "" : v(et),
    temple: Q(-1) + Q(1),
    teeth: G,
    leftBrow: I(-1),
    rightBrow: I(1),
    hand: ""
  };
}
const T = {
  front: "#f5f5f6",
  highlight: "#ffffff",
  midtone: "#f4f4f5",
  shadow: "#c9cbd0",
  side: "#969ba5",
  sideLight: "#c5c9d1",
  edge: "#96999f",
  crease: "#777d89"
};
function c0(t, e, n) {
  return t === "mask" ? n ? `url(#${e}-mask)` : T.front : t;
}
const X0 = "M 151 441 Q 140 421 132 393 Q 110 323 101 253 L 94 184 Q 94 181 98 179 Q 119 167 141 163 L 140 146 Q 140 143 144 142 Q 170 132 201 129 L 200 115 Q 200 112 204 112 Q 235 107 268 110 Q 271 110 271 114 L 271 125 Q 302 124 329 132 Q 332 133 331 137 L 311 265 L 340 276 Q 344 278 343 282 L 326 420 Q 326 425 321 426 L 155 443 Q 152 443 151 441 Z", Z0 = [
  "M141 163 Q148 208 150 250",
  "M201 129 Q207 185 205 241",
  "M271 125 Q269 183 260 241",
  "M311 265 L281 254 Q277 252 275 257 L263 296 Q262 300 267 300 Q285 300 297 307",
  "M297 307 Q262 316 238 347"
];
function h0(t) {
  const e = t.match(/[MLQZ]|-?\d+(?:\.\d+)?/g);
  let n = 0, a = [0, 0];
  const s = [], l = () => [+e[n++], +e[n++]];
  for (; n < e.length; ) {
    const o = e[n++];
    if (o === "M" || o === "L") {
      const r = l(), c = o === "M" ? 1 : Math.max(
        1,
        Math.ceil(Math.hypot(r[0] - a[0], r[1] - a[1]) / 10)
      ), i = a;
      for (let d = 1; d <= c; d++)
        s.push([
          i[0] + (r[0] - i[0]) * d / c,
          i[1] + (r[1] - i[1]) * d / c
        ]);
      a = r;
    } else if (o === "Q") {
      const r = a, c = l(), i = l();
      for (let d = 1; d <= 10; d++) {
        const m = d / 10, b = 1 - m;
        s.push([
          b * b * r[0] + 2 * b * m * c[0] + m * m * i[0],
          b * b * r[1] + 2 * b * m * c[1] + m * m * i[1]
        ]);
      }
      a = i;
    }
  }
  return s.map(([o, r]) => [(o - 230) / 190, (r - 275) / 190]);
}
const Vt = h0(X0), D0 = Z0.map((t) => U(h0(t), 8e-3)), U0 = 5;
function Pt(t, e, n, a, s = "shrug", l = 0) {
  const o = (s === "raise" ? 0.48 : 0.4) * (0.32 + 0.68 * e), r = -t, c = [-0.242, t * 0.461, t * 0.854], i = [-t * 0.97, -0.115, -0.213], d = [0, -0.88, 0.475];
  function m([h, f], p) {
    const g = h * r;
    if (s === "raise") {
      const C = nt([g, f, p], t * 0.24, -0.08), z = t * 0.1 + l * 0.24, st = Math.cos(z), it = Math.sin(z);
      return nt(
        [
          t * 0.91 + o * (C[0] * st - C[1] * it),
          -0.38 - l * 0.035 + (1 - e) * 1.05 + o * (C[0] * it + C[1] * st),
          0.96 + o * C[2]
        ],
        n * 0.32,
        a * 0.32
      );
    }
    const S = p + 0.1 * Math.max(0, -f - 0.15) ** 2, L = o * (g * c[0] + f * i[0] + S * d[0]), Y = o * (g * c[1] + f * i[1] + S * d[1]), R = -t * l * 0.13, O = Math.cos(R), P = Math.sin(R);
    return nt(
      [
        t * 0.86 + L * O - Y * P,
        0.34 - l * 0.018 + (1 - e) * 0.48 + L * P + Y * O,
        1.04 + o * (g * c[2] + f * i[2] + S * d[2])
      ],
      n * 0.42,
      a * 0.42
    );
  }
  function b(h) {
    return e < 1e-4 || h.length < 3 ? "" : h.map(
      (f, p) => `${p ? "L" : "M"}${kt(f).map((g) => g.toFixed(3)).join(" ")}`
    ).join(" ") + "Z";
  }
  const v = Vt.map((h) => m(h, 0.1)), k = Vt.map((h) => m(h, -0.1));
  let M = "", w = "";
  for (let h = 0; h < v.length; h++) {
    const f = (h + 1) % v.length, p = v[h], g = v[f], S = k[f], L = g.map((C, z) => C - p[z]), Y = S.map((C, z) => C - p[z]), R = [
      L[1] * Y[2] - L[2] * Y[1],
      L[2] * Y[0] - L[0] * Y[2],
      L[0] * Y[1] - L[1] * Y[0]
    ].map((C) => -C * r);
    if (R[0] * -p[0] + R[1] * -p[1] + R[2] * (5 - p[2]) <= 0) continue;
    const P = b([p, g, S, k[h]]);
    -R[0] - 0.8 * R[1] + 0.2 * R[2] > 0 ? w += P : M += P;
  }
  const F = m([0, 0], 0.1), j = m([1, 0], 0.1).map((h, f) => h - F[f]), q = m([0, 1], 0.1).map((h, f) => h - F[f]), et = [
    j[1] * q[2] - j[2] * q[1],
    j[2] * q[0] - j[0] * q[2],
    j[0] * q[1] - j[1] * q[0]
  ].map((h) => h * r), G = et[0] * -F[0] + et[1] * -F[1] + et[2] * (5 - F[2]) > 0, Q = v.reduce((h, f) => h + f[2], 0) / v.length, I = (h, f, p) => ({
    d: h,
    fill: f,
    depth: Q + p * 1e-5,
    opacity: e,
    stroke: "none"
  });
  return [
    I(b(k), G ? T.edge : "mask", 0),
    I(M, T.side, 1),
    I(w, T.sideLight, 2),
    I(G ? b(v) : "", "mask", 3),
    I(
      (G ? D0 : []).map((h) => b(h.map((f) => m(f, 0.101)))).join(""),
      T.crease,
      4
    )
  ];
}
const mt = (t) => Math.max(0, Math.min(1, t)), N0 = 3 * U0, H0 = Array.from({ length: N0 }, () => ({
  d: "",
  fill: "mask",
  opacity: 0,
  depth: 0,
  stroke: "none"
}));
function u0(t) {
  const e = mt(t.shrug), n = mt(t.raise), a = 1 - 0.25 * e - 0.18 * n;
  return `translate(${(160 + 8 * n).toFixed(5)} ${(160 - 20 * e).toFixed(5)}) scale(${a.toFixed(5)}) translate(-160 -160)`;
}
function d0(t, e = 0, n = 0, a = 0, s = 0) {
  return t.shrug < 1e-4 && t.raise < 1e-4 ? H0 : [
    ...Pt(-1, mt(t.shrug), e, n, "shrug", s),
    ...Pt(1, mt(t.shrug), e, n, "shrug", s),
    ...Pt(-1, mt(t.raise), e, n, "raise", a)
  ].sort((l, o) => l.depth - o.depth);
}
const Ct = {
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
}, f0 = 2.7, Ft = f0, V0 = (t) => t * t * (3 - 2 * t);
function K0(t, e) {
  if (e) {
    if (t <= e[0][0]) return e[0][1];
    for (let n = 1; n < e.length; n++) {
      const [a, s] = e[n], [l, o] = e[n - 1];
      if (t <= a) return o + (s - o) * V0((t - l) / (a - l));
    }
    return e.at(-1)[1];
  }
}
const J0 = {
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
function Kt(t, e) {
  if (!Number.isFinite(e) || e >= f0)
    return t === "raise" ? { ...Ct, raiseAmount: 0 } : Ct;
  const n = J0[t], a = { ...Ct };
  for (const s of Object.keys(a)) {
    const l = K0(Math.max(0, e), n[s]);
    l !== void 0 && (a[s] = l);
  }
  return a;
}
function te({ id: t, silhouette: e }) {
  return /* @__PURE__ */ W(k0, { children: [
    /* @__PURE__ */ u("path", { id: `${t}-hood-silhouette`, "data-portrait-light-shape": "", d: e }),
    /* @__PURE__ */ W("radialGradient", { id: `${t}-hood-material`, gradientUnits: "userSpaceOnUse", cx: "80", cy: "-60", r: "380", children: [
      /* @__PURE__ */ u("stop", { offset: "0", stopColor: "#24262d" }),
      /* @__PURE__ */ u("stop", { offset: ".44", stopColor: "#141519" }),
      /* @__PURE__ */ u("stop", { offset: "1", stopColor: "#0c0c0e" })
    ] }),
    /* @__PURE__ */ W("linearGradient", { id: `${t}-key-falloff`, gradientUnits: "userSpaceOnUse", x1: "70", y1: "-100", x2: "250", y2: "315", children: [
      /* @__PURE__ */ u("stop", { offset: "0", stopColor: "white" }),
      /* @__PURE__ */ u("stop", { offset: ".42", stopColor: "#d4d4d4" }),
      /* @__PURE__ */ u("stop", { offset: ".78", stopColor: "#565656" }),
      /* @__PURE__ */ u("stop", { offset: "1", stopColor: "#181818" })
    ] }),
    /* @__PURE__ */ u("mask", { id: `${t}-key-mask`, maskUnits: "userSpaceOnUse", x: "-24", y: "-160", width: "368", height: "570", children: /* @__PURE__ */ u("rect", { x: "-24", y: "-160", width: "368", height: "570", fill: `url(#${t}-key-falloff)` }) }),
    /* @__PURE__ */ W("filter", { id: `${t}-key-soft`, x: "-10%", y: "-10%", width: "120%", height: "120%", colorInterpolationFilters: "sRGB", children: [
      /* @__PURE__ */ u("feGaussianBlur", { in: "SourceAlpha", stdDeviation: "4.5", result: "soft" }),
      /* @__PURE__ */ u("feOffset", { in: "soft", dx: "7", dy: "3", result: "inset" }),
      /* @__PURE__ */ u("feComposite", { in: "SourceAlpha", in2: "inset", operator: "out", result: "edge" }),
      /* @__PURE__ */ u("feFlood", { floodColor: "#b3c5dc", floodOpacity: ".64", result: "light" }),
      /* @__PURE__ */ u("feComposite", { in: "light", in2: "edge", operator: "in" })
    ] }),
    /* @__PURE__ */ W("filter", { id: `${t}-key-glint`, x: "-10%", y: "-10%", width: "120%", height: "120%", colorInterpolationFilters: "sRGB", children: [
      /* @__PURE__ */ u("feGaussianBlur", { in: "SourceAlpha", stdDeviation: ".8", result: "soft" }),
      /* @__PURE__ */ u("feOffset", { in: "soft", dx: "1.4", dy: ".7", result: "inset" }),
      /* @__PURE__ */ u("feComposite", { in: "SourceAlpha", in2: "inset", operator: "out", result: "edge" }),
      /* @__PURE__ */ u("feFlood", { floodColor: "#d8e2ed", floodOpacity: ".3", result: "light" }),
      /* @__PURE__ */ u("feComposite", { in: "light", in2: "edge", operator: "in" })
    ] }),
    /* @__PURE__ */ W("filter", { id: `${t}-bounce-soft`, x: "-10%", y: "-10%", width: "120%", height: "120%", colorInterpolationFilters: "sRGB", children: [
      /* @__PURE__ */ u("feGaussianBlur", { in: "SourceAlpha", stdDeviation: "3", result: "soft" }),
      /* @__PURE__ */ u("feOffset", { in: "soft", dx: "-3", dy: "-1.5", result: "inset" }),
      /* @__PURE__ */ u("feComposite", { in: "SourceAlpha", in2: "inset", operator: "out", result: "edge" }),
      /* @__PURE__ */ u("feFlood", { floodColor: "#8d9cb0", floodOpacity: ".22", result: "light" }),
      /* @__PURE__ */ u("feComposite", { in: "light", in2: "edge", operator: "in" })
    ] })
  ] });
}
function ee({ id: t, opacity: e }) {
  return /* @__PURE__ */ W("g", { "data-portrait-lighting": "", opacity: e, pointerEvents: "none", "aria-hidden": "true", children: [
    /* @__PURE__ */ W("g", { mask: `url(#${t}-key-mask)`, children: [
      /* @__PURE__ */ u("use", { href: `#${t}-hood-silhouette`, fill: "white", filter: `url(#${t}-key-soft)` }),
      /* @__PURE__ */ u("use", { href: `#${t}-hood-silhouette`, fill: "white", filter: `url(#${t}-key-glint)` })
    ] }),
    /* @__PURE__ */ u("use", { href: `#${t}-hood-silhouette`, fill: "white", filter: `url(#${t}-bounce-soft)` })
  ] });
}
const oe = Object.fromEntries(
  Object.entries(i0).map(([t, e]) => [
    t,
    { ...e, hood: 1 }
  ])
), Jt = (t, e = !1) => t === "skull" ? e ? oe : i0 : o0, m0 = (t, e, n, a, s, l = 0, o = 0, r = 0, c = 1, i = 1) => s === "skull" ? _0(
  t,
  e,
  n,
  a,
  l,
  o,
  r,
  c,
  i
) : {
  crest: "",
  maskEdge: "",
  maskSide: "",
  maskSideLight: "",
  mask: "",
  teeth: "",
  temple: "",
  ...P0(t, e, n, a)
}, B = Math.PI / 180;
function re({
  pose: t,
  yaw: e = 0,
  pitch: n = 0,
  shading: a = !0,
  id: s = "sphere",
  decorative: l = !1,
  appearance: o = "sphere"
}) {
  const r = m0(
    t,
    e * B,
    n * B,
    1,
    o
  ), c = o === "skull" ? d0(t, e * B, n * B) : [];
  return /* @__PURE__ */ W(
    "svg",
    {
      "data-skull-svg": "",
      xmlns: "http://www.w3.org/2000/svg",
      viewBox: o === "skull" ? n0(t.hood) : "0 0 320 320",
      width: "100%",
      height: "100%",
      "aria-hidden": l || void 0,
      style: { display: "block", overflow: "visible" },
      children: [
        /* @__PURE__ */ W("defs", { children: [
          o === "skull" && /* @__PURE__ */ u(
            te,
            {
              id: s,
              silhouette: `${Rt(e * B, n * B)} ${Ot(e * B, n * B)}`
            }
          ),
          /* @__PURE__ */ W("radialGradient", { id: `${s}-body`, cx: "33%", cy: "22%", r: "79%", children: [
            /* @__PURE__ */ u("stop", { offset: "0", stopColor: "#414145" }),
            /* @__PURE__ */ u("stop", { offset: ".42", stopColor: "#252528" }),
            /* @__PURE__ */ u("stop", { offset: ".8", stopColor: "#131315" }),
            /* @__PURE__ */ u("stop", { offset: "1", stopColor: "#080809" })
          ] }),
          /* @__PURE__ */ W("radialGradient", { id: `${s}-mask`, cx: "30%", cy: "18%", r: "95%", children: [
            /* @__PURE__ */ u("stop", { offset: "0", stopColor: T.highlight }),
            /* @__PURE__ */ u("stop", { offset: ".55", stopColor: T.midtone }),
            /* @__PURE__ */ u("stop", { offset: "1", stopColor: T.shadow })
          ] }),
          /* @__PURE__ */ u("clipPath", { id: `${s}-clip`, children: /* @__PURE__ */ u("circle", { cx: "160", cy: "160", r: "128" }) }),
          /* @__PURE__ */ u("clipPath", { id: `${s}-mask-face`, children: /* @__PURE__ */ u("path", { "data-eye-clip": "mask", d: r.mask }) }),
          /* @__PURE__ */ u("clipPath", { id: `${s}-left-eye`, children: /* @__PURE__ */ u("path", { "data-eye-clip": "left", d: r.left }) }),
          /* @__PURE__ */ u("clipPath", { id: `${s}-right-eye`, children: /* @__PURE__ */ u("path", { "data-eye-clip": "right", d: r.right }) })
        ] }),
        /* @__PURE__ */ W("g", { "data-character-motion": "", children: [
          /* @__PURE__ */ W(
            "g",
            {
              "data-skull-head": "",
              transform: o === "skull" ? u0(t) : void 0,
              children: [
                /* @__PURE__ */ u(
                  "path",
                  {
                    "data-part": "crest",
                    d: r.crest,
                    fill: "#151518",
                    opacity: 1 - t.hood
                  }
                ),
                /* @__PURE__ */ u(
                  "circle",
                  {
                    "data-body-sphere": "",
                    cx: "160",
                    cy: "160",
                    r: "128",
                    fill: a ? `url(#${s}-body)` : "#121214",
                    opacity: o === "skull" ? 1 - t.hood : 1
                  }
                ),
                o === "skull" && /* @__PURE__ */ u(
                  "path",
                  {
                    "data-hood": "",
                    d: Rt(e * B, n * B),
                    fill: a ? `url(#${s}-hood-material)` : "#101012",
                    opacity: t.hood
                  }
                ),
                o === "skull" && /* @__PURE__ */ u(
                  "path",
                  {
                    "data-portrait-lightning": "",
                    d: Ot(e * B, n * B),
                    fill: a ? `url(#${s}-hood-material)` : "#101012",
                    opacity: t.hood
                  }
                ),
                o === "skull" && /* @__PURE__ */ u(ee, { id: s, opacity: a ? t.hood : 0 }),
                o === "skull" && /* @__PURE__ */ u(
                  "g",
                  {
                    "data-loading-dots": "",
                    opacity: t.stalled,
                    transform: `translate(0 ${-6 * t.hood})`,
                    children: [139, 160, 181].map((i, d) => /* @__PURE__ */ u(
                      "circle",
                      {
                        "data-loading-dot": "",
                        cx: i,
                        cy: d === 1 ? 13 : 28,
                        r: "7.5",
                        fill: t.hood > 0.5 ? "#fff" : "#202024",
                        opacity: [0.35, 0.7, 1][d]
                      },
                      i
                    ))
                  }
                ),
                /* @__PURE__ */ W(
                  "g",
                  {
                    "data-skull-face": "",
                    transform: o === "skull" ? s0(t.hood) : void 0,
                    children: [
                      /* @__PURE__ */ u(
                        "g",
                        {
                          fill: "#fff",
                          clipPath: o === "skull" ? void 0 : `url(#${s}-clip)`,
                          children: Object.keys(r).filter((i) => i !== "hand" && i !== "crest").map((i) => /* @__PURE__ */ u(
                            "path",
                            {
                              "data-part": i,
                              d: r[i],
                              fill: i === "maskSide" ? T.side : i === "maskSideLight" ? T.sideLight : i === "maskEdge" ? T.edge : i === "mask" ? a ? `url(#${s}-mask)` : T.front : i.endsWith("Pupil") && o === "skull" ? "#4b4752" : o === "skull" ? "#101012" : i.endsWith("Pupil") ? "#111113" : void 0,
                              clipPath: o === "skull" && !i.startsWith("mask") ? `url(#${s}-mask-face)` : i.endsWith("Pupil") ? `url(#${s}-${i === "leftPupil" ? "left" : "right"}-eye)` : void 0,
                              opacity: i.endsWith("Brow") ? t.brow : 1
                            },
                            i
                          ))
                        }
                      ),
                      /* @__PURE__ */ u(
                        "path",
                        {
                          fill: "#fff",
                          "data-part": "hand",
                          d: r.hand,
                          opacity: t.hand
                        }
                      )
                    ]
                  }
                ),
                o === "skull" && /* @__PURE__ */ W(
                  "g",
                  {
                    "data-crash-alert": "",
                    opacity: "0",
                    transform: "translate(260 52) scale(.3) translate(-260 -52)",
                    children: [
                      /* @__PURE__ */ u(
                        "path",
                        {
                          d: "M260 16 L259 47",
                          fill: "none",
                          stroke: "#e5484d",
                          strokeWidth: "12",
                          strokeLinecap: "round"
                        }
                      ),
                      /* @__PURE__ */ u("circle", { cx: "259", cy: "67", r: "7", fill: "#e5484d" })
                    ]
                  }
                )
              ]
            }
          ),
          /* @__PURE__ */ u(
            "g",
            {
              "data-skull-hands": "",
              stroke: "#565861",
              strokeWidth: "0.8",
              strokeLinejoin: "round",
              children: c.map((i, d) => /* @__PURE__ */ u(
                "path",
                {
                  "data-hand-face": "",
                  d: i.d,
                  fill: c0(i.fill, s, a),
                  stroke: i.stroke ?? "#565861",
                  opacity: i.opacity
                },
                d
              ))
            }
          )
        ] })
      ]
    }
  );
}
function ne({
  emotion: t = "idle",
  appearance: e = "sphere",
  portrait: n = !1,
  size: a = 256,
  followPointer: s = !0,
  reducedMotion: l,
  paused: o = !1,
  playKey: r = 0,
  shading: c = !0,
  yaw: i,
  pitch: d,
  decorative: m = !1,
  className: b,
  style: v
}) {
  const k = "sphere-" + v0().replace(/[^a-zA-Z0-9]/g, ""), M = w0(), w = l ?? !!M, F = V(null), j = V({
    pose: { ...Jt(e, n)[t] },
    yaw: i ?? 0,
    pitch: d ?? 0
  }), q = V({
    emotion: t,
    followPointer: s,
    paused: o,
    yaw: i,
    pitch: d,
    appearance: e,
    portrait: n,
    shading: c,
    playKey: r
  });
  q.current = {
    emotion: t,
    followPointer: s,
    paused: o,
    yaw: i,
    pitch: d,
    appearance: e,
    portrait: n,
    shading: c,
    playKey: r
  };
  const et = V({}), G = V(0), Q = V({
    emotion: t,
    appearance: e,
    playKey: r,
    elapsed: Ft
  }), I = V(() => {
  }), h = V(!0), f = V({}), p = V([]);
  return At(() => {
    if (!F.current || typeof IntersectionObserver > "u") return;
    const g = new IntersectionObserver(([S]) => {
      h.current = S.isIntersecting;
    });
    return g.observe(F.current), () => g.disconnect();
  }, []), At(() => {
    const g = F.current;
    if (!g) return;
    const S = Object.fromEntries(
      Array.from(g.querySelectorAll("[data-part]")).map(
        (_) => [_.dataset.part, _]
      )
    ), L = Object.fromEntries(
      Array.from(g.querySelectorAll("[data-eye-clip]")).map(
        (_) => [_.dataset.eyeClip, _]
      )
    ), Y = g.querySelector("[data-skull-head]"), R = g.querySelector("[data-skull-svg]"), O = g.querySelector("[data-skull-face]"), P = g.querySelector("[data-portrait-lightning]"), C = g.querySelector("[data-hood]"), z = g.querySelector("[data-portrait-light-shape]"), st = g.querySelector("[data-portrait-lighting]"), it = g.querySelector("[data-body-sphere]"), wt = g.querySelector("[data-character-motion]"), pt = g.querySelector("[data-loading-dots]"), xt = Array.from(g.querySelectorAll("[data-loading-dot]")), Wt = g.querySelector("[data-crash-alert]"), p0 = Array.from(g.querySelectorAll("[data-hand-face]"));
    let qt = "";
    p.current = [];
    const Qt = (_, gt, N = !1) => {
      const y = q.current;
      if (!N && (y.paused || !h.current)) return;
      (Q.current.emotion !== y.emotion || Q.current.appearance !== y.appearance || Q.current.playKey !== y.playKey) && (Q.current = {
        emotion: y.emotion,
        appearance: y.appearance,
        playKey: y.playKey,
        elapsed: 0
      }), N || (Q.current.elapsed = Math.min(
        Ft,
        Q.current.elapsed + _
      ));
      const St = (A, E, J, H = 145) => {
        const X = et.current[A] ??= { value: J, velocity: 0 };
        return N ? (X.value = E, X.velocity = 0, E) : x0(X, E, _, H, 24);
      }, x = {
        ...Jt(y.appearance, y.portrait)[y.emotion]
      };
      for (const A of Object.keys(x))
        x[A] = St(A, x[A], j.current.pose[A]);
      const $ = y.appearance === "skull" && !N ? Kt(y.emotion, Q.current.elapsed) : Kt("idle", Ft);
      y.appearance === "skull" && (x.eyeRadius *= $.eyeScale, x.leftY += $.gazeY + $.leftY, x.rightY += $.gazeY + $.rightY, x.mouthOpen *= $.mouthScale, x.shrug *= $.handAmount, x.raise *= $.raiseAmount);
      let Bt = y.yaw ?? 0, zt = y.pitch ?? 0;
      if (y.followPointer && gt?.present) {
        const A = g.getBoundingClientRect(), E = y.appearance === "skull" && y.emotion === "thinking" ? Math.min(1, Math.max(0, (Q.current.elapsed - 2.15) / 0.55)) : 1;
        y.yaw === void 0 && (Bt = Math.tanh(
          (gt.x - A.left - A.width / 2) / Math.max(180, A.width)
        ) * (y.portrait ? 50 : 32) * E), y.pitch === void 0 && (zt = Math.tanh(
          (gt.y - A.top - A.height / 2) / Math.max(200, A.height)
        ) * (y.portrait ? 34 : 23) * E);
      }
      const It = (St("yaw", Bt, j.current.yaw, 100) + $.yaw) * B, Tt = (St("pitch", zt, j.current.pitch, 100) + $.pitch) * B;
      G.current += _;
      const g0 = G.current % 4.7, b0 = N ? 1 : Math.min(
        $.blink,
        1 - 0.92 * Math.exp(-Math.pow((g0 - 4.35) / 0.07, 2))
      ), [bt, yt] = y.appearance === "skull" ? G0(
        It,
        Tt,
        x,
        Q.current.elapsed,
        N || !y.followPointer
      ) : [It, Tt], ut = m0(
        x,
        bt,
        yt,
        b0,
        y.appearance,
        $.gazeX,
        $.leftX,
        $.rightX,
        $.leftEye,
        $.rightEye
      );
      if (y.appearance === "skull") {
        R?.setAttribute("viewBox", n0(x.hood)), O?.setAttribute(
          "transform",
          s0(x.hood)
        );
        const A = Rt(bt, yt), E = Ot(bt, yt), J = `${A} ${E}`;
        J !== qt && (P?.setAttribute("d", E), C?.setAttribute("d", A), z?.setAttribute("d", J), qt = J), P?.setAttribute("opacity", String(x.hood)), S.crest?.setAttribute("opacity", String(1 - x.hood)), C?.setAttribute("opacity", String(x.hood));
        const H = y.shading ? `url(#${k}-hood-material)` : "#101012";
        C?.setAttribute("fill", H), P?.setAttribute("fill", H), st?.setAttribute("opacity", String(y.shading ? x.hood : 0)), it?.setAttribute("opacity", String(1 - x.hood)), pt?.setAttribute("opacity", String(x.stalled)), pt?.setAttribute(
          "transform",
          `translate(0 ${(-6 * x.hood).toFixed(3)})`
        ), xt.forEach((X, at) => {
          const Gt = N ? [0, 0.5, 1][at] : (1 + Math.sin(G.current * 8 - at * Math.PI * 2 / 3)) / 2;
          X.setAttribute("cy", String([28, 13, 28][at] - Gt * 5)), X.setAttribute("opacity", String(0.3 + Gt * 0.7)), X.setAttribute("fill", x.hood > 0.5 ? "#fff" : "#202024");
        }), Wt?.setAttribute(
          "opacity",
          String(x.crashed * $.alert)
        ), Wt?.setAttribute(
          "transform",
          `translate(260 ${52 + 8 * (1 - $.alert)}) scale(${(0.3 + 0.7 * $.alert).toFixed(4)}) translate(-260 -52)`
        );
      }
      const y0 = y.appearance === "skull" && !N && y.emotion !== "crashed" ? Math.sin(G.current * 1.5) * 1.2 : 0, M0 = $.bob + y0;
      wt?.setAttribute(
        "transform",
        y.appearance === "skull" ? `translate(160 160) translate(0 ${M0.toFixed(3)}) rotate(${$.roll.toFixed(3)}) scale(${(1 + $.scale).toFixed(5)}) translate(-160 -160)` : ""
      );
      for (const A of Object.keys(ut))
        ut[A] !== f.current[A] && (S[A]?.setAttribute("d", ut[A]), L[A]?.setAttribute("d", ut[A]));
      if (f.current = ut, Y?.setAttribute(
        "transform",
        y.appearance === "skull" ? u0(x) : ""
      ), y.appearance === "skull") {
        const A = d0(
          x,
          bt,
          yt,
          $.wave,
          $.palmSway
        );
        A.forEach((E, J) => {
          const H = p0[J], X = p.current[J];
          E.d !== X?.d && H?.setAttribute("d", E.d);
          const at = c0(E.fill, k, y.shading);
          H?.getAttribute("fill") !== at && H?.setAttribute("fill", at), E.stroke !== X?.stroke && H?.setAttribute("stroke", E.stroke ?? "#565861"), E.opacity !== X?.opacity && H?.setAttribute("opacity", String(E.opacity));
        }), p.current = A;
      }
      S.leftBrow?.setAttribute("opacity", String(x.brow)), S.rightBrow?.setAttribute("opacity", String(x.brow)), S.hand?.setAttribute("opacity", String(x.hand));
    };
    if (I.current = () => Qt(0, void 0, !0), w) {
      I.current();
      return;
    }
    return S0((_, gt, N) => Qt(_, N));
  }, [w, e, n]), At(() => {
    w && I.current();
  }, [w, t, i, d, e, n, c, r]), /* @__PURE__ */ u(
    "span",
    {
      ref: F,
      className: b,
      "data-sphere-emoji": "",
      "data-appearance": e,
      role: m ? void 0 : "img",
      "aria-hidden": m || void 0,
      "aria-label": m ? void 0 : `${e === "skull" && t === "curious" ? "无语摊手" : A0[t]}表情`,
      style: {
        display: "inline-block",
        width: a,
        height: a,
        flexShrink: 0,
        ...v
      },
      children: /* @__PURE__ */ u(
        re,
        {
          ...j.current,
          id: k,
          appearance: e,
          shading: c,
          decorative: !0
        }
      )
    }
  );
}
function ce({ form: t = "orb", ...e }) {
  return /* @__PURE__ */ u(
    ne,
    {
      ...e,
      appearance: "skull",
      portrait: t === "character"
    }
  );
}
export {
  ce as SkullOrb,
  le as skullEmotions
};
