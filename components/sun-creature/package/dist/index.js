import { jsx as f, jsxs as $ } from "react/jsx-runtime";
import { useId as I, useState as R, useRef as D, useEffect as P } from "react";
import { useReducedMotion as G } from "motion/react";
const w = 5, q = 128 * Math.sqrt(w * w - 1) / w;
function T([o, r], a, t) {
  const n = Math.sqrt(Math.max(1e-4, 1 - o * o - r * r)), l = o * Math.cos(a) + n * Math.sin(a), e = n * Math.cos(a) - o * Math.sin(a);
  return [
    l,
    r * Math.cos(t) + e * Math.sin(t),
    e * Math.cos(t) - r * Math.sin(t)
  ];
}
function W([o, r, a], t, n) {
  const l = o * Math.cos(t) + a * Math.sin(t), e = a * Math.cos(t) - o * Math.sin(t);
  return [
    l,
    r * Math.cos(n) + e * Math.sin(n),
    e * Math.cos(n) - r * Math.sin(n)
  ];
}
function E([o, r, a]) {
  const t = q * w / (w - a);
  return [160 + o * t, 160 + r * t];
}
function j(o, r, a) {
  return o.map((n) => E(W(n, r, a))).map(([n, l], e) => `${e ? "L" : "M"}${n.toFixed(2)} ${l.toFixed(2)}`).join(" ") + "Z";
}
function N(o, r, a) {
  const t = o.map((s) => T(s, r, a)), n = [], l = 1 / w;
  for (let s = 0; s < t.length; s++) {
    const u = t[s], c = t[(s + 1) % t.length];
    if (u[2] >= l && n.push(u), u[2] >= l != c[2] >= l) {
      const h = (l - u[2]) / (c[2] - u[2]);
      n.push([
        u[0] + (c[0] - u[0]) * h,
        u[1] + (c[1] - u[1]) * h,
        l
      ]);
    }
  }
  return n.reduce((s, u, c) => {
    const h = n[(c + 1) % n.length];
    return s + u[0] * h[1] - h[0] * u[1];
  }, 0) < 0 && n.reverse(), n.length ? n.map((s, u) => {
    const [c, h] = E(s);
    return `${u ? "L" : "M"}${c.toFixed(2)} ${h.toFixed(2)}`;
  }).join(" ") + "Z" : "";
}
function V(o) {
  const r = Math.PI * (3 - Math.sqrt(5)), a = Array.from({ length: o }, (c, h) => {
    const m = 1 - 2 * (h + 0.5) / o, d = Math.sqrt(1 - m * m), i = h * r;
    return [Math.cos(i) * d, Math.sin(i) * d, m];
  }), t = a.reduce(
    (c, h, m) => h[2] > a[c][2] ? m : c,
    0
  ), n = a[t], l = Math.hypot(n[0], n[1]);
  if (l < 1e-8) return a;
  const e = [n[1] / l, -n[0] / l, 0], s = n[2], u = l;
  return a.map((c) => {
    const h = [
      e[1] * c[2] - e[2] * c[1],
      e[2] * c[0] - e[0] * c[2],
      e[0] * c[1] - e[1] * c[0]
    ], d = (e[0] * c[0] + e[1] * c[1] + e[2] * c[2]) * (1 - s);
    return [
      c[0] * s + h[0] * u + e[0] * d,
      c[1] * s + h[1] * u + e[1] * d,
      c[2] * s + h[2] * u + e[2] * d
    ];
  });
}
function v(o, r, a, t = 8, n = o) {
  const l = Math.abs(o[1]) > 0.94 ? [1, 0, 0] : [0, 1, 0], e = [
    o[1] * l[2] - o[2] * l[1],
    o[2] * l[0] - o[0] * l[2],
    o[0] * l[1] - o[1] * l[0]
  ], s = Math.hypot(...e), u = [e[0] / s, e[1] / s, e[2] / s], c = [
    o[1] * u[2] - o[2] * u[1],
    o[2] * u[0] - o[0] * u[2],
    o[0] * u[1] - o[1] * u[0]
  ], h = Array.from({ length: t }, (p, y) => {
    const x = y / t * Math.PI * 2, B = [
      u[0] * Math.cos(x) + c[0] * Math.sin(x),
      u[1] * Math.cos(x) + c[1] * Math.sin(x),
      u[2] * Math.cos(x) + c[2] * Math.sin(x)
    ];
    return [
      o[0] * Math.cos(r) + B[0] * Math.sin(r),
      o[1] * Math.cos(r) + B[1] * Math.sin(r),
      o[2] * Math.cos(r) + B[2] * Math.sin(r)
    ];
  }), m = Math.hypot(...n), d = [n[0] / m, n[1] / m, n[2] / m], i = [
    o[0] * Math.cos(r) + d[0] * a,
    o[1] * Math.cos(r) + d[1] * a,
    o[2] * Math.cos(r) + d[2] * a
  ];
  return {
    ring: h,
    triangles: h.map((p, y) => [p, h[(y + 1) % t], i])
  };
}
function C(o, r, a, t = a, n = 56) {
  return Array.from({ length: n }, (l, e) => {
    const s = e / n * Math.PI * 2;
    return [o + Math.cos(s) * a, r + Math.sin(s) * t];
  });
}
function Y(o, r, a, t, n = 0) {
  return Array.from({ length: 33 }, (l, e) => {
    const s = Math.PI / 3, u = (e / 32 * 2 - 1) * s, c = Math.sin(u) / Math.sin(s), h = (Math.cos(u) - Math.cos(s)) / (1 - Math.cos(s));
    return [o + c * a, r + h * t + c * n];
  });
}
function k(o, r) {
  const a = o.map((e, s) => {
    const u = o[Math.max(0, s - 1)], c = o[Math.min(o.length - 1, s + 1)];
    return Math.atan2(c[1] - u[1], c[0] - u[0]);
  }), t = (e, s) => [
    o[e][0] - Math.sin(a[e]) * r * s,
    o[e][1] + Math.cos(a[e]) * r * s
  ], n = o.map((e, s) => t(s, 1)), l = o.at(-1);
  for (let e = 1; e <= 10; e++) {
    const s = a.at(-1) + Math.PI / 2 - e * Math.PI / 10;
    n.push([
      l[0] + Math.cos(s) * r,
      l[1] + Math.sin(s) * r
    ]);
  }
  for (let e = o.length - 1; e >= 0; e--)
    n.push(t(e, -1));
  for (let e = 1; e <= 10; e++) {
    const s = a[0] - Math.PI / 2 - e * Math.PI / 10;
    n.push([
      o[0][0] + Math.cos(s) * r,
      o[0][1] + Math.sin(s) * r
    ]);
  }
  return n;
}
function X(o, r, a, t) {
  return o.map(([n, l]) => [r + (n - r) * t, a + (l - a) * t]);
}
const at = [
  "idle",
  "happy",
  "curious",
  "surprised",
  "sleepy",
  "grumpy",
  "sad"
], H = {
  idle: "开心",
  happy: "大笑",
  curious: "好奇",
  surprised: "惊讶",
  sleepy: "困倦",
  grumpy: "不满",
  sad: "难过"
}, S = { yaw: 0, pitch: 0, gazeX: 0, gazeY: 0 }, J = V(14), K = {
  idle: { eyeStyle: "open", eyeScale: 1, mouthStyle: "grin", mouthWidth: 0.37, mouthY: 0.23, mouthOpen: 0.31, mouthBend: 0.045 },
  happy: { eyeStyle: "smile", eyeScale: 1.02, mouthStyle: "grin", mouthWidth: 0.43, mouthY: 0.22, mouthOpen: 0.36, mouthBend: 0.055 },
  curious: { eyeStyle: "open", eyeScale: 1.05, mouthStyle: "round", mouthWidth: 0.13, mouthY: 0.27, mouthOpen: 0.19, mouthBend: 0 },
  surprised: { eyeStyle: "open", eyeScale: 1.18, mouthStyle: "round", mouthWidth: 0.15, mouthY: 0.28, mouthOpen: 0.23, mouthBend: 0 },
  sleepy: { eyeStyle: "sleepy", eyeScale: 0.98, mouthStyle: "line", mouthWidth: 0.17, mouthY: 0.31, mouthOpen: 0.02, mouthBend: 0.012 },
  grumpy: { eyeStyle: "narrow", eyeScale: 0.92, mouthStyle: "frown", mouthWidth: 0.25, mouthY: 0.31, mouthOpen: 0.035, mouthBend: -0.055 },
  sad: { eyeStyle: "open", eyeScale: 0.92, mouthStyle: "frown", mouthWidth: 0.22, mouthY: 0.34, mouthOpen: 0.045, mouthBend: -0.07 }
};
function Q(o, r, a) {
  return o.reduce((t, n) => t + W(n, r, a)[2], 0) / o.length;
}
function U(o, r, a) {
  return o.map((n) => E(W(n, r, a))).map(([n, l], e) => `${e ? "L" : "M"}${n.toFixed(2)} ${l.toFixed(2)}`).join(" ") + "Z";
}
function tt(o) {
  const r = o.yaw, a = o.pitch, t = J.map((n, l) => {
    const e = l === 0, s = e ? 0.17 : 0.145, c = v(
      n,
      s,
      e ? 0.46 : 0.31,
      8,
      e ? [0, -0.42, 0.91] : n
    ), h = W(n, r, a), m = v(n, s * 1.26, 0.01, 8), d = c.triangles.map((i, p) => {
      const y = ["#FFD568", "#FFC454", "#F4A42B", "#E88A1D", "#D87517", "#CF6713", "#DE7B17", "#F0A02A"], x = ["#B77A47", "#A26A3D", "#865633", "#70472C", "#5E3B27", "#553823", "#6E482D", "#92623B"];
      return {
        key: `${l}-${p}`,
        d: U(i, r, a),
        z: Q(i, r, a),
        fill: (e ? x : y)[p]
      };
    });
    return {
      index: l,
      nose: e,
      viewZ: h[2],
      base: j(c.ring, r, a),
      halo: j(m.ring, r, a),
      faces: d
    };
  });
  return {
    behind: t.filter((n) => n.viewZ < 0.08).sort((n, l) => n.viewZ - l.viewZ),
    ahead: t.filter((n) => n.viewZ >= 0.08).sort((n, l) => n.viewZ - l.viewZ)
  };
}
function et(o, r, a) {
  const t = K[o], n = r.yaw, l = r.pitch, e = (h) => N(h, n, l), s = [];
  for (const [h, m] of [["left", -0.42], ["right", 0.42]]) {
    const i = t.eyeScale * (o === "curious" && h === "left" ? 1.12 : 1);
    if (s.push({
      key: `${h}-socket-shadow`,
      d: e(C(m, -0.1 + 0.012, 0.19 * i, 0.145 * i)),
      fill: "#9A4313",
      opacity: 0.78
    }), s.push({
      key: `${h}-socket`,
      d: e(C(m, -0.1, 0.17 * i, 0.128 * i)),
      fill: `url(#${a}-socket)`
    }), s.push({
      key: `${h}-socket-rim`,
      d: e(k(Y(m, -0.1 - 0.026, 0.143 * i, -8e-3), 0.011)),
      fill: "#FFD06A",
      opacity: 0.86
    }), t.eyeStyle === "open")
      s.push({
        key: `${h}-eye-white`,
        d: e(C(m, -0.1 + 0.019, 0.102 * i, 0.079 * i)),
        fill: `url(#${a}-eye)`
      }), s.push({
        key: `${h}-pupil`,
        d: e(C(m + r.gazeX, -0.1 + 0.023 + r.gazeY, 0.045 * i, 0.052 * i)),
        fill: "#261711"
      }), s.push({
        key: `${h}-glint`,
        d: e(C(m + r.gazeX - 0.014, -0.1 + r.gazeY + 4e-3, 0.014, 0.018)),
        fill: "#FFF8E4",
        opacity: 0.94
      });
    else {
      const x = t.eyeStyle === "smile" ? 0.052 : t.eyeStyle === "sleepy" ? 0.012 : -4e-3;
      s.push({
        key: `${h}-closed-eye`,
        d: e(k(Y(m, -0.1 + 0.012, 0.112 * i, x), 0.021)),
        fill: "#2B1710"
      });
    }
    const p = o === "grumpy" ? 0.032 : o === "sad" ? -0.044 : -0.018, y = o === "curious" && h === "left" ? -0.035 : 0;
    s.push({
      key: `${h}-brow`,
      d: e(k(Y(m, -0.1 - 0.148, 0.13, p, y), 0.022)),
      fill: "#74320F"
    });
  }
  if (t.mouthStyle === "smile" || t.mouthStyle === "line" || t.mouthOpen < 0.07) {
    const h = (t.mouthStyle === "frown", t.mouthBend);
    return s.push({
      key: "mouth-groove-shadow",
      d: e(k(Y(0, t.mouthY, t.mouthWidth + 0.025, h), 0.035)),
      fill: "#A64C16",
      opacity: 0.72
    }), s.push({
      key: "mouth-groove",
      d: e(k(Y(0, t.mouthY - 6e-3, t.mouthWidth, h), 0.021)),
      fill: "#35170E"
    }), s;
  }
  let u;
  if (t.mouthStyle === "round")
    u = C(0, t.mouthY, t.mouthWidth, t.mouthOpen * 0.72);
  else {
    const h = [], m = [];
    for (let d = 0; d <= 32; d++) {
      const i = d / 16 - 1, p = Math.max(0, 1 - i * i), y = i * t.mouthWidth;
      h.push([y, t.mouthY - t.mouthBend * p]), m.push([y, t.mouthY + t.mouthOpen * Math.pow(p, 0.7)]);
    }
    u = [...h, ...m.reverse()];
  }
  const c = t.mouthY + t.mouthOpen * 0.25;
  if (s.push({
    key: "mouth-shadow",
    d: e(X(u, 0, c, 1.16)),
    fill: "#8F3C13",
    opacity: 0.78
  }), s.push({
    key: "mouth-bevel",
    d: e(X(u, 0, c, 1.075)),
    fill: `url(#${a}-bevel)`
  }), s.push({
    key: "mouth-cavity",
    d: e(u),
    fill: `url(#${a}-cavity)`
  }), t.mouthStyle === "grin") {
    const h = t.mouthY - Math.max(0, t.mouthBend) + 0.018, m = t.mouthY + t.mouthOpen * 0.37, d = t.mouthWidth * 0.78, i = [];
    for (let p = 0; p <= 28; p++) {
      const y = (p / 14 - 1) * d, x = y / d;
      i.push([y, h + Math.abs(x) * 0.025]);
    }
    for (let p = 28; p >= 0; p--) {
      const y = (p / 14 - 1) * d, x = y / d;
      i.push([y, m + Math.abs(x) * 0.025]);
    }
    s.push({ key: "teeth", d: e(i), fill: `url(#${a}-teeth)` });
    for (const p of [-0.22, -0.15, -0.075, 0, 0.075, 0.15, 0.22]) {
      const y = k(
        [[p, h + Math.abs(p) * 0.05], [p, m + Math.abs(p) * 0.05]],
        23e-4
      );
      s.push({ key: `tooth-${p}`, d: e(y), fill: "#BD9A62", opacity: 0.8 });
    }
    s.push({
      key: "tongue",
      d: e(C(0, t.mouthY + t.mouthOpen * 0.77, t.mouthWidth * 0.28, t.mouthOpen * 0.19)),
      fill: `url(#${a}-tongue)`
    });
  }
  return s;
}
function ct({
  emotion: o = "idle",
  size: r = 240,
  followPointer: a = !0,
  reducedMotion: t,
  decorative: n = !1,
  className: l,
  style: e
}) {
  const s = G(), u = t ?? !!s, c = `sun-${I().replace(/[^a-zA-Z0-9]/g, "")}`, [h, m] = R(S), d = D(S), i = D(S), p = D(null), y = D(0), x = typeof r == "number" ? `${r}px` : r, B = () => {
    if (p.current !== null || u) return;
    const M = (g) => {
      const F = d.current, z = y.current ? Math.min(48, g - y.current) : 16;
      y.current = g;
      const A = 1 - Math.exp(-z / 76), b = {
        yaw: F.yaw + (i.current.yaw - F.yaw) * A,
        pitch: F.pitch + (i.current.pitch - F.pitch) * A,
        gazeX: F.gazeX + (i.current.gazeX - F.gazeX) * A,
        gazeY: F.gazeY + (i.current.gazeY - F.gazeY) * A
      };
      d.current = b, m(b), Math.max(
        Math.abs(i.current.yaw - b.yaw),
        Math.abs(i.current.pitch - b.pitch),
        Math.abs(i.current.gazeX - b.gazeX),
        Math.abs(i.current.gazeY - b.gazeY)
      ) > 5e-4 ? p.current = requestAnimationFrame(M) : (p.current = null, y.current = 0);
    };
    p.current = requestAnimationFrame(M);
  };
  P(() => () => {
    p.current !== null && cancelAnimationFrame(p.current);
  }, []), P(() => {
    a && !u && !n || (i.current = S, d.current = S, m(S), p.current !== null && cancelAnimationFrame(p.current), p.current = null, y.current = 0);
  }, [a, u, n]);
  const Z = (M) => {
    if (!a || u || n || M.pointerType === "touch") return;
    const g = M.currentTarget.getBoundingClientRect();
    if (!g.width || !g.height) return;
    const F = Math.max(-1, Math.min(1, (M.clientX - g.left - g.width / 2) / (g.width / 2))), z = Math.max(-1, Math.min(1, (M.clientY - g.top - g.height / 2) / (g.height / 2)));
    i.current = {
      yaw: F * 0.48,
      pitch: z * -0.34,
      gazeX: F * 0.032,
      gazeY: z * 0.026
    }, B();
  }, L = () => {
    i.current = S, B();
  }, O = tt(h), _ = et(o, h, c);
  return /* @__PURE__ */ f(
    "div",
    {
      className: ["sun-creature", l].filter(Boolean).join(" "),
      style: { width: x, height: x, ...e },
      "data-emotion": o,
      "data-follow-pointer": a,
      "data-reduced-motion": u,
      role: n ? void 0 : "img",
      "aria-hidden": n || void 0,
      "aria-label": n ? void 0 : `太阳角色：${H[o]}`,
      onPointerMove: Z,
      onPointerLeave: L,
      children: /* @__PURE__ */ f("div", { className: "sun-creature__float", children: /* @__PURE__ */ $("svg", { className: "sun-creature__art", viewBox: "0 0 320 320", role: "presentation", focusable: "false", children: [
        /* @__PURE__ */ $("defs", { children: [
          /* @__PURE__ */ $("radialGradient", { id: `${c}-shell`, cx: "31%", cy: "23%", r: "82%", children: [
            /* @__PURE__ */ f("stop", { offset: "0", stopColor: "#FFE888" }),
            /* @__PURE__ */ f("stop", { offset: ".39", stopColor: "#FFC64A" }),
            /* @__PURE__ */ f("stop", { offset: ".75", stopColor: "#F29A24" }),
            /* @__PURE__ */ f("stop", { offset: "1", stopColor: "#C75B13" })
          ] }),
          /* @__PURE__ */ $("radialGradient", { id: `${c}-socket`, cx: "42%", cy: "28%", r: "80%", children: [
            /* @__PURE__ */ f("stop", { offset: "0", stopColor: "#713817" }),
            /* @__PURE__ */ f("stop", { offset: ".5", stopColor: "#432315" }),
            /* @__PURE__ */ f("stop", { offset: "1", stopColor: "#21120D" })
          ] }),
          /* @__PURE__ */ $("radialGradient", { id: `${c}-eye`, cx: "37%", cy: "24%", r: "80%", children: [
            /* @__PURE__ */ f("stop", { offset: "0", stopColor: "#FFF8E4" }),
            /* @__PURE__ */ f("stop", { offset: ".7", stopColor: "#E8D3A6" }),
            /* @__PURE__ */ f("stop", { offset: "1", stopColor: "#B99C6B" })
          ] }),
          /* @__PURE__ */ $("radialGradient", { id: `${c}-bevel`, cx: "40%", cy: "18%", r: "92%", children: [
            /* @__PURE__ */ f("stop", { offset: "0", stopColor: "#D77A27" }),
            /* @__PURE__ */ f("stop", { offset: ".65", stopColor: "#71320F" }),
            /* @__PURE__ */ f("stop", { offset: "1", stopColor: "#35170E" })
          ] }),
          /* @__PURE__ */ $("radialGradient", { id: `${c}-cavity`, cx: "48%", cy: "28%", r: "86%", children: [
            /* @__PURE__ */ f("stop", { offset: "0", stopColor: "#100B09" }),
            /* @__PURE__ */ f("stop", { offset: ".65", stopColor: "#27120D" }),
            /* @__PURE__ */ f("stop", { offset: "1", stopColor: "#4B210F" })
          ] }),
          /* @__PURE__ */ $("linearGradient", { id: `${c}-teeth`, x1: "0", y1: "0", x2: "0", y2: "1", children: [
            /* @__PURE__ */ f("stop", { offset: "0", stopColor: "#FFF3D1" }),
            /* @__PURE__ */ f("stop", { offset: "1", stopColor: "#D8BB84" })
          ] }),
          /* @__PURE__ */ $("linearGradient", { id: `${c}-tongue`, x1: "0", y1: "0", x2: "0", y2: "1", children: [
            /* @__PURE__ */ f("stop", { offset: "0", stopColor: "#F18777" }),
            /* @__PURE__ */ f("stop", { offset: "1", stopColor: "#BB4542" })
          ] })
        ] }),
        /* @__PURE__ */ f("ellipse", { cx: "160", cy: "304", rx: "84", ry: "8", fill: "#48230D", opacity: ".19" }),
        /* @__PURE__ */ f("g", { "aria-hidden": "true", children: O.behind.map((M) => /* @__PURE__ */ f("g", { children: M.faces.map((g) => /* @__PURE__ */ f("path", { d: g.d, fill: g.fill }, g.key)) }, `rear-${M.index}`)) }),
        /* @__PURE__ */ f("circle", { cx: "160", cy: "160", r: "128", fill: "#87370C", opacity: ".48", transform: "translate(3 6)" }),
        /* @__PURE__ */ f("circle", { cx: "160", cy: "158", r: "128", fill: `url(#${c}-shell)`, stroke: "#9A4310", strokeWidth: "3" }),
        /* @__PURE__ */ f("ellipse", { cx: "112", cy: "100", rx: "47", ry: "25", fill: "#FFF5B8", opacity: ".12", transform: "rotate(-29 112 100)" }),
        O.ahead.map((M) => /* @__PURE__ */ $("g", { children: [
          /* @__PURE__ */ f("path", { d: M.halo, fill: M.nose ? "#572812" : "#8E3E12", opacity: M.nose ? 0.6 : 0.43 }),
          /* @__PURE__ */ f("path", { d: M.base, fill: "none", stroke: M.nose ? "#593018" : "#A34C14", strokeWidth: M.nose ? 1.8 : 1.2, opacity: ".84" }),
          M.faces.map((g) => /* @__PURE__ */ f("path", { d: g.d, fill: g.fill }, g.key))
        ] }, `front-${M.index}`)),
        /* @__PURE__ */ f("g", { children: _.map((M) => /* @__PURE__ */ f("path", { d: M.d, fill: M.fill, opacity: M.opacity }, M.key)) })
      ] }) })
    }
  );
}
export {
  ct as SunCreature,
  at as sunCreatureEmotions,
  H as sunCreatureLabels
};
