// @vitest-environment jsdom
import React, { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { beforeEach, afterEach, it, expect, vi } from "vitest";
import { SphereEmoji } from "../src/sphere/SphereEmoji";
import {
  circle,
  faceGeometry,
  projectPatch,
  spherePoses,
} from "../src/sphere/geometry";
import {
  skullEmotions,
  skullGeometry,
  skullHoodGeometry,
  skullOutlineFor,
  skullPoses,
  skullViewAngles,
} from "../src/sphere/skull";
import { palmGeometry } from "../src/sphere/palm";
import { skullMaterial } from "../src/sphere/material";
import { skullHandGeometry, HAND_FACE_COUNT } from "../src/sphere/hands";
import { skullPortraitLightning } from "../src/sphere/portrait";
import {
  expressionDuration,
  expressionMotion,
} from "../src/sphere/expressionMotion";
import { maskPoint, sphereClearance } from "../src/sphere/volume";
import { emptyPointer, type RawPointer } from "../src/interaction/pointer";
const frames = vi.hoisted(
  () => new Set<(dt: number, now: number, p: RawPointer) => void>(),
);
vi.mock("../src/motion/scheduler", () => ({
  subscribeFrame: (fn: (dt: number, now: number, p: RawPointer) => void) => {
    frames.add(fn);
    return () => frames.delete(fn);
  },
}));
let root: Root, container: HTMLDivElement;
beforeEach(() => {
  Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true });
  window.matchMedia = vi.fn().mockReturnValue({
    matches: false,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  });
  container = document.createElement("div");
  document.body.append(container);
  root = createRoot(container);
});
afterEach(() => {
  act(() => root.unmount());
  container.remove();
  frames.clear();
  vi.restoreAllMocks();
});
const path = (key = "mouth") =>
  container.querySelector(`[data-part=${key}]`)!.getAttribute("d");
const tick = (n = 1, p = emptyPointer) =>
  act(() => {
    for (let i = 0; i < n; i++) for (const fn of frames) fn(0.016, 0, p);
  });
it("表情插值可中断，从当前几何继续，最终收敛", () => {
  act(() => root.render(<SphereEmoji emotion="idle" />));
  const start = path();
  const subscription = [...frames][0];
  act(() => root.render(<SphereEmoji emotion="laugh" />));
  expect(path()).toBe(start);
  expect([...frames][0]).toBe(subscription);
  tick(10);
  const middle = path();
  expect(middle).not.toBe(start);
  expect(middle).not.toBe(faceGeometry(spherePoses.laugh).mouth);
  act(() => root.render(<SphereEmoji emotion="surprised" />));
  expect(path()).toBe(middle);
  tick(160);
  expect(path()).toBe(faceGeometry(spherePoses.surprised).mouth);
});
it("减少动态立即更新且不订阅动画，完全由矢量组成", () => {
  act(() => root.render(<SphereEmoji emotion="idle" reducedMotion />));
  act(() => root.render(<SphereEmoji emotion="laugh" reducedMotion />));
  expect(path()).toBe(faceGeometry(spherePoses.laugh).mouth);
  expect(frames.size).toBe(0);
  expect(container.querySelector("image,canvas,img,filter")).toBeNull();
});
it("鼠标改变球面投影，关闭跟随后回正，暂停保留位置", () => {
  act(() => root.render(<SphereEmoji emotion="idle" />));
  const front = path("mouth");
  tick(100, { ...emptyPointer, present: true, x: 600, y: 0 });
  expect(path("mouth")).not.toBe(front);
  act(() => root.render(<SphereEmoji emotion="idle" paused />));
  const frozen = path("mouth");
  tick(30);
  expect(path("mouth")).toBe(frozen);
  act(() => root.render(<SphereEmoji emotion="idle" followPointer={false} />));
  tick(160);
  const coordinates = (d: string | null) =>
    (d?.match(/-?\d+(?:\.\d+)?/g) ?? []).map(Number);
  const target = coordinates(front);
  expect(
    Math.max(
      ...coordinates(path("mouth")).map((n, i) => Math.abs(n - target[i])),
    ),
  ).toBeLessThan(0.01);
});
it("远侧眼变窄，背面表情被隐藏", () => {
  const bounds = (d: string) => {
    const values = [...d.matchAll(/[ML]([\d.-]+) ([\d.-]+)/g)].map(
      (m) => +m[1],
    );
    return Math.max(...values) - Math.min(...values);
  };
  const front = projectPatch(circle(0.255, -0.17, 0.065), 0, 0);
  const side = projectPatch(circle(0.255, -0.17, 0.065), 0.7, 0);
  expect(bounds(side)).toBeLessThan(bounds(front) * 0.65);
  expect(projectPatch(circle(0.255, -0.17, 0.065), Math.PI, 0)).toBe("");
});
it("所有表情及中间态在极限视角保持有限坐标", () => {
  for (const a of Object.values(spherePoses))
    for (const b of Object.values(spherePoses)) {
      const pose = { ...a };
      for (const k of Object.keys(pose) as (keyof typeof pose)[])
        pose[k] = (a[k] + b[k]) / 2;
      for (const yaw of [-1.13, 0, 1.13])
        for (const pitch of [-0.7, 0, 0.7])
          for (const d of Object.values(faceGeometry(pose, yaw, pitch)))
            expect(d).not.toMatch(/NaN|Infinity/);
    }
});
it("各实例的渐变与裁切 ID 独立", () => {
  act(() =>
    root.render(
      <>
        <SphereEmoji reducedMotion />
        <SphereEmoji reducedMotion />
      </>,
    ),
  );
  const ids = [...container.querySelectorAll("[id]")].map((el) => el.id);
  expect(new Set(ids).size).toBe(ids.length);
});

it("小黑眼球随眼睛投影和裁切，笑眼时收起", () => {
  act(() => root.render(<SphereEmoji emotion="idle" reducedMotion />));
  const pupil = container.querySelector('[data-part="leftPupil"]')!;
  expect(pupil.getAttribute("fill")).toBe("#111113");
  expect(pupil.getAttribute("d")).not.toBe("");
  const front = pupil.getAttribute("d");
  act(() => root.render(<SphereEmoji emotion="idle" yaw={35} reducedMotion />));
  expect(pupil.getAttribute("d")).not.toBe(front);
  expect(
    container.querySelector('[data-eye-clip="left"]')!.getAttribute("d"),
  ).toBe(path("left"));
  act(() => root.render(<SphereEmoji emotion="laugh" reducedMotion />));
  expect(pupil.getAttribute("d")).toBe("");
});

it("骷髅面罩与孔洞一起转动，死机具有暗色眼芯，保留原球体手势边界", () => {
  act(() =>
    root.render(
      <SphereEmoji appearance="skull" emotion="idle" reducedMotion />,
    ),
  );
  const face = path("mask");
  expect(face).not.toBe("");
  expect(path("leftPupil")).toBe("");
  act(() =>
    root.render(
      <SphereEmoji appearance="skull" emotion="idle" yaw={45} reducedMotion />,
    ),
  );
  expect(path("mask")).not.toBe(face);
  for (const emotion of skullEmotions) {
    act(() =>
      root.render(
        <SphereEmoji appearance="skull" emotion={emotion} reducedMotion />,
      ),
    );
    expect(path("hand")).toBe("");
    if (emotion === "crashed") {
      expect(path("leftPupil")).not.toBe("");
      expect(path("rightPupil")).not.toBe("");
    } else {
      expect(path("leftPupil")).toBe("");
      expect(path("rightPupil")).toBe("");
    }
    expect(path("mask")).not.toMatch(/NaN|Infinity/);
  }
});
it("圆球页的平静保持圆球，独立造型页显示肩部与闪电并随视角转动", () => {
  act(() =>
    root.render(
      <SphereEmoji appearance="skull" emotion="idle" reducedMotion />,
    ),
  );
  const hood = container.querySelector("[data-hood]")!;
  const lightning = container.querySelector("[data-portrait-lightning]")!;
  const face = container.querySelector("[data-skull-face]")!;
  const svg = container.querySelector("[data-skull-svg]")!;
  const sphere = container.querySelector("[data-body-sphere]")!;
  expect(hood.getAttribute("opacity")).toBe("0");
  expect(sphere.getAttribute("opacity")).toBe("1");
  expect(lightning.getAttribute("opacity")).toBe("0");
  act(() =>
    root.render(
      <SphereEmoji appearance="skull" portrait emotion="idle" reducedMotion />,
    ),
  );
  expect(hood.getAttribute("opacity")).toBe("1");
  expect(sphere.getAttribute("opacity")).toBe("0");
  expect(lightning.getAttribute("opacity")).toBe("1");
  expect(svg.getAttribute("viewBox")).toContain("-130");
  expect(face.getAttribute("transform")).toContain("scale(0.75000)");
  expect(hood.getAttribute("d")).toBe(skullHoodGeometry());
  act(() =>
    root.render(
      <SphereEmoji
        appearance="skull"
        portrait
        emotion="idle"
        yaw={35}
        reducedMotion
      />,
    ),
  );
  expect(hood.getAttribute("d")).not.toBe(skullHoodGeometry());
  for (const yaw of [-65, 65])
    for (const pitch of [-40, 40])
      expect(
        skullHoodGeometry((yaw * Math.PI) / 180, (pitch * Math.PI) / 180),
      ).not.toMatch(/NaN|Infinity/);
  act(() =>
    root.render(
      <SphereEmoji appearance="skull" emotion="curious" reducedMotion />,
    ),
  );
  expect(hood.getAttribute("opacity")).toBe("0");
  expect(lightning.getAttribute("opacity")).toBe("0");
  expect(sphere.getAttribute("opacity")).toBe("1");
});
it("头顶闪电在正面与转头时保持单条闭合轮廓", () => {
  for (const yaw of [-45, 0, 45])
    for (const pitch of [-20, 0, 20]) {
      const d = skullPortraitLightning(
        (yaw * Math.PI) / 180,
        (pitch * Math.PI) / 180,
      );
      expect(d.match(/\bM/g)).toHaveLength(1);
      expect(d.match(/\bZ/g)).toHaveLength(1);
      expect(d).not.toMatch(/NaN|Infinity/);
    }
});
it("角色逆光共用完整剪影，转头后与头罩和闪电同步", () => {
  act(() => root.render(<SphereEmoji appearance="skull" portrait reducedMotion />));
  const silhouette = container.querySelector("[data-portrait-light-shape]")!;
  const light = container.querySelector("[data-portrait-lighting]")!;
  const combined = () => `${container.querySelector("[data-hood]")!.getAttribute("d")} ${container.querySelector("[data-portrait-lightning]")!.getAttribute("d")}`;
  expect(silhouette.getAttribute("d")).toBe(combined());
  expect(light.getAttribute("opacity")).toBe("1");
  const front = silhouette.getAttribute("d");
  act(() => root.render(<SphereEmoji appearance="skull" portrait yaw={45} pitch={-20} reducedMotion />));
  expect(silhouette.getAttribute("d")).not.toBe(front);
  expect(silhouette.getAttribute("d")).toBe(combined());
  expect(light.querySelectorAll("use")).toHaveLength(3);
  expect(light.querySelector("[stroke], image")).toBeNull();
});

it("关闭材质明暗立即恢复纯黑，圆球形态不残留角色逆光", () => {
  act(() => root.render(<SphereEmoji appearance="skull" portrait shading reducedMotion />));
  const hood = container.querySelector("[data-hood]")!;
  const light = container.querySelector("[data-portrait-lighting]")!;
  expect(hood.getAttribute("fill")).toContain("hood-material");
  act(() => root.render(<SphereEmoji appearance="skull" portrait shading={false} reducedMotion />));
  expect(hood.getAttribute("fill")).toBe("#101012");
  expect(light.getAttribute("opacity")).toBe("0");
  act(() => root.render(<SphereEmoji appearance="skull" portrait shading reducedMotion />));
  expect(light.getAttribute("opacity")).toBe("1");
  expect(hood.getAttribute("fill")).toContain("hood-material");
  act(() => root.render(<SphereEmoji appearance="skull" reducedMotion />));
  expect(light.getAttribute("opacity")).toBe("0");
});

it("闪电与头罩接合处共用画面材质，不描画内部接缝", () => {
  for (const yaw of [-65, 0, 65]) {
    act(() => root.render(<SphereEmoji appearance="skull" portrait yaw={yaw} reducedMotion />));
    const hood = container.querySelector("[data-hood]")!;
    const lightning = container.querySelector("[data-portrait-lightning]")!;
    expect(hood.getAttribute("fill")).toBe(lightning.getAttribute("fill"));
    for (const shape of [hood, lightning]) {
      expect(shape.getAttribute("stroke")).toBeNull();
      expect(shape.getAttribute("stroke-width")).toBeNull();
    }
    const materialId = hood.getAttribute("fill")!.slice(5, -1);
    expect(container.querySelector(`[id="${materialId}"]`)!.getAttribute("gradientUnits")).toBe("userSpaceOnUse");
  }
});

it("动态与暂停时逆光几何跟随角色，九种表情保持有限坐标", () => {
  const silhouette = () => container.querySelector("[data-portrait-light-shape]")!.getAttribute("d");
  act(() => root.render(<SphereEmoji appearance="skull" portrait />));
  const front = silhouette();
  tick(100, { ...emptyPointer, present: true, x: 600, y: 0 });
  expect(silhouette()).not.toBe(front);
  act(() => root.render(<SphereEmoji appearance="skull" portrait paused />));
  const frozen = silhouette();
  tick(30);
  expect(silhouette()).toBe(frozen);
  for (const emotion of skullEmotions) {
    act(() => root.render(<SphereEmoji appearance="skull" portrait emotion={emotion} yaw={-65} pitch={40} reducedMotion />));
    expect(silhouette()).not.toMatch(/NaN|Infinity/);
    expect(container.querySelector("[data-portrait-lighting]")!.getAttribute("opacity")).toBe("1");
  }
});

it("多个角色的光照定义互不串用，所有光照均裁在原剪影之内", () => {
  act(() => root.render(<><SphereEmoji appearance="skull" portrait reducedMotion /><SphereEmoji appearance="skull" portrait reducedMotion /></>));
  const ids = [...container.querySelectorAll("[id]")].map((el) => el.id);
  expect(new Set(ids).size).toBe(ids.length);
  for (const filter of container.querySelectorAll("filter")) {
    const carve = filter.querySelector('feComposite[operator="out"]')!;
    expect(carve.getAttribute("in")).toBe("SourceAlpha");
    expect(filter.lastElementChild!.getAttribute("operator")).toBe("in");
  }
  act(() => root.render(<SphereEmoji reducedMotion />));
  expect(container.querySelector("filter, [data-portrait-lighting]")).toBeNull();
});
it("角色造型的九种表情始终保留头罩，并能切换面罩与手势", () => {
  for (const emotion of skullEmotions) {
    act(() =>
      root.render(
        <SphereEmoji
          appearance="skull"
          portrait
          emotion={emotion}
          reducedMotion
        />,
      ),
    );
    expect(
      container.querySelector("[data-hood]")!.getAttribute("opacity"),
    ).toBe("1");
    expect(
      container.querySelector("[data-body-sphere]")!.getAttribute("opacity"),
    ).toBe("0");
    expect(path("mask")).not.toMatch(/NaN|Infinity/);
    if (emotion === "stalled") {
      expect(
        container
          .querySelector("[data-loading-dots]")!
          .getAttribute("transform"),
      ).toBe("translate(0 -6.000)");
      expect(
        container.querySelector("[data-loading-dot]")!.getAttribute("fill"),
      ).toBe("#fff");
    }
    if (emotion === "curious" || emotion === "raise")
      expect(
        [...container.querySelectorAll("[data-hand-face]")].some((face) =>
          Boolean(face.getAttribute("d")),
        ),
      ).toBe(true);
  }
});
it("面罩表情连续变形，切回圆球恢复白眼与黑眼球", () => {
  act(() => root.render(<SphereEmoji appearance="skull" emotion="idle" />));
  const start = path("mouth");
  act(() => root.render(<SphereEmoji appearance="skull" emotion="serious" />));
  expect(path("mouth")).toBe(start);
  tick(10);
  expect(path("mouth")).not.toBe(start);
  act(() =>
    root.render(
      <SphereEmoji appearance="sphere" emotion="idle" reducedMotion />,
    ),
  );
  expect(path("mask")).toBe("");
  expect(path("leftPupil")).not.toBe("");
});

it("尖牙在球体之外有深度，侧面与额顶冠保留独立几何", () => {
  const tooth = maskPoint([0, 1.1]);
  expect(tooth[2]).toBeGreaterThan(1);
  expect(sphereClearance(tooth)).toBeGreaterThanOrEqual(0);
  const front = skullGeometry(skullPoses.idle);
  const side = skullGeometry(skullPoses.idle, 0.7, 0.1);
  expect(side.maskSide + side.maskSideLight).not.toBe("");
  expect(side.crest).not.toBe(front.crest);
  const ys = [...front.mask.matchAll(/[ML][\d.-]+ ([\d.-]+)/g)].map(
    (m) => +m[1],
  );
  expect(Math.max(...ys)).toBeGreaterThan(288);
});
it("严肃状态从当前轮廓连续变化，出现鼻腔和齿缝", () => {
  act(() => root.render(<SphereEmoji appearance="skull" emotion="idle" />));
  const start = path("mask");
  act(() => root.render(<SphereEmoji appearance="skull" emotion="serious" />));
  expect(path("mask")).toBe(start);
  tick(12);
  const middle = path("mask");
  expect(middle).not.toBe(start);
  expect(middle).not.toBe(skullGeometry(skullPoses.serious).mask);
  tick(180);
  expect(path("mask")).toBe(skullGeometry(skullPoses.serious).mask);
  expect(path("teeth")).not.toBe("");
  expect(
    container.querySelector('[data-eye-clip="mask"]')!.getAttribute("d"),
  ).toBe(path("mask"));
  act(() => root.render(<SphereEmoji appearance="skull" emotion="sad" />));
  expect(path("mask")).toBe(skullGeometry(skullPoses.serious).mask);
  tick(200);
  expect(path("mask")).toBe(start);
});
it("骷髅状态集中无笑脸；中间轮廓和极限视角坐标有效", () => {
  expect(skullEmotions).not.toContain("smile");
  expect(skullEmotions).not.toContain("laugh");
  expect(skullOutlineFor(0).length).toBe(skullOutlineFor(1).length);
  for (const t of [0, 0.25, 0.5, 0.75, 1])
    for (const yaw of [-1.13, 0, 1.13])
      for (const pitch of [-0.7, 0, 0.7]) {
        const pose = { ...skullPoses.sad, serious: t, sad: 1 - t };
        for (const path of Object.values(skullGeometry(pose, yaw, pitch)))
          expect(path).not.toMatch(/NaN|Infinity/);
      }
});

it("卡顿与死机有独立轮廓、鼻腔和眼芯，死机不眨眼", () => {
  const pixel = skullGeometry(skullPoses.stalled),
    dead = skullGeometry(skullPoses.crashed);
  expect(pixel.mask).not.toBe(dead.mask);
  expect(pixel.mouth).not.toBe("");
  expect(dead.mouth).toBe("");
  expect(dead.leftPupil).not.toBe("");
  expect(skullGeometry(skullPoses.crashed, 0, 0, 0.08).left).toBe(dead.left);
  expect(pixel.crest).toBe("");
  expect(dead.crest).toBe("");
  expect(skullEmotions).toHaveLength(9);
});
it("卡顿角度呈离散小步，静态模式与其他状态不受影响", () => {
  const a = skullViewAngles(0.143, 0.092, skullPoses.stalled, 0.5);
  const b = skullViewAngles(0.145, 0.094, skullPoses.stalled, 0.5);
  expect(a).toEqual(b);
  expect(skullViewAngles(0.143, 0.092, skullPoses.stalled, 0.5, true)).toEqual([
    0.143, 0.092,
  ]);
  expect(skullViewAngles(0.143, 0.092, skullPoses.idle, 0.5)).toEqual([
    0.143, 0.092,
  ]);
});
it("四种轮廓之间可连续变化，不产生无效坐标", () => {
  const names = ["idle", "serious", "stalled", "crashed"] as const;
  for (const a of names)
    for (const b of names) {
      const p = { ...skullPoses[a] };
      for (const key of Object.keys(p) as (keyof typeof p)[])
        p[key] = (p[key] + skullPoses[b][key]) / 2;
      for (const yaw of [-0.8, 0, 0.8])
        for (const d of Object.values(skullGeometry(p, yaw, 0.2)))
          expect(d).not.toMatch(/NaN|Infinity/);
    }
});

it("摊手与举手可中断；思考不生成手", () => {
  const handPaths = () =>
    [...container.querySelectorAll("[data-hand-face]")]
      .map((el) => el.getAttribute("d"))
      .join("");
  const transform = () =>
    container.querySelector("[data-skull-head]")!.getAttribute("transform");
  act(() => root.render(<SphereEmoji appearance="skull" emotion="idle" />));
  const idleTransform = transform();
  expect(handPaths()).toBe("");
  act(() => root.render(<SphereEmoji appearance="skull" emotion="curious" />));
  expect(handPaths()).toBe("");
  tick(10);
  const opening = handPaths();
  expect(opening).not.toBe("");
  expect(transform()).not.toBe(idleTransform);
  act(() => root.render(<SphereEmoji appearance="skull" emotion="thinking" />));
  expect(handPaths()).toBe(opening);
  tick(180);
  expect(handPaths()).toBe("");
  expect(
    container.querySelector("[data-skull-hands]")!.closest("[clip-path]"),
  ).toBeNull();
  act(() => root.render(<SphereEmoji appearance="skull" emotion="serious" />));
  tick(180);
  expect(handPaths()).toBe("");
  expect(transform()).toBe(idleTransform);
});

it("手势在静态模式立即切换，暂停保留几何", () => {
  const hands = () =>
    [...container.querySelectorAll("[data-hand-face]")]
      .map((el) => el.getAttribute("d"))
      .join("");
  act(() =>
    root.render(
      <SphereEmoji appearance="skull" emotion="curious" reducedMotion />,
    ),
  );
  const front = hands();
  expect(front).not.toBe("");
  expect(frames.size).toBe(0);
  act(() =>
    root.render(
      <SphereEmoji
        appearance="skull"
        emotion="thinking"
        yaw={32}
        reducedMotion
      />,
    ),
  );
  expect(hands()).not.toBe(front);
  act(() =>
    root.render(<SphereEmoji appearance="skull" emotion="thinking" paused />),
  );
  const frozen = hands();
  tick(20, { ...emptyPointer, present: true, x: 600, y: 0 });
  expect(hands()).toBe(frozen);
});

it("手部厚度与透视在极限视角有效，所有过渡保持固定面数", () => {
  for (const t of [0, 0.25, 0.5, 0.75, 1])
    for (const yaw of [-1.13, 0, 1.13])
      for (const pitch of [-0.7, 0, 0.7]) {
        const faces = skullHandGeometry(
          { ...skullPoses.idle, shrug: t, raise: 1 - t },
          yaw,
          pitch,
        );
        expect(faces).toHaveLength(HAND_FACE_COUNT);
        for (const face of faces) {
          expect(face.d).not.toMatch(/NaN|Infinity/);
          expect(Number.isFinite(face.depth)).toBe(true);
          expect(face.opacity).toBeGreaterThanOrEqual(0);
          expect(face.opacity).toBeLessThanOrEqual(1);
        }
      }
  const front = skullHandGeometry(skullPoses.curious);
  const side = skullHandGeometry(skullPoses.curious, 0.55, 0.2);
  expect(side.map((f) => f.d)).not.toEqual(front.map((f) => f.d));
  expect(side.some((f) => f.d && f.fill === skullMaterial.side)).toBe(true);
  expect(skullHandGeometry(skullPoses.idle).every((f) => !f.d)).toBe(true);
});

it("摊手用完整掌面和面罩同一材质；动态与静态开关都同步", () => {
  const palms = () =>
    [...container.querySelectorAll("[data-hand-face]")].filter(
      (el) => el.getAttribute("d") && el.getAttribute("fill") === pathFill(),
    );
  const pathFill = () =>
    container.querySelector('[data-part="mask"]')!.getAttribute("fill");
  act(() =>
    root.render(
      <SphereEmoji appearance="skull" emotion="curious" reducedMotion />,
    ),
  );
  expect(palms()).toHaveLength(2);
  for (const el of palms()) {
    expect(el.getAttribute("stroke")).toBe("none");
    expect(el.getAttribute("d")!.match(/M/g)).toHaveLength(1);
  }
  act(() =>
    root.render(
      <SphereEmoji
        appearance="skull"
        emotion="curious"
        shading={false}
        reducedMotion
      />,
    ),
  );
  expect(pathFill()).toBe(skullMaterial.front);
  expect(palms()).toHaveLength(2);
  act(() =>
    root.render(<SphereEmoji appearance="skull" emotion="curious" shading />),
  );
  tick();
  expect(pathFill()).toMatch(/^url/);
  expect(palms()).toHaveLength(2);
  expect(container.querySelector("image,canvas,img")).toBeNull();
});

it("手掌背对镜头时隐藏掌纹，前后表面仍有体积", () => {
  let backs = 0;
  for (const side of [-1, 1] as const)
    for (const [yaw, pitch] of [
      [-3, 0],
      [0, -2],
      [0, 0],
      [0, 2],
      [3, 0],
    ]) {
      const faces = palmGeometry(side, 1, yaw, pitch);
      if (!faces[3].d) {
        backs++;
        expect(faces[4].d).toBe("");
        expect(faces[0].d).not.toBe("");
        expect(faces[0].fill).toBe("mask");
      }
    }
  expect(backs).toBeGreaterThan(0);
});

it("摊手位于脸的两侧，掌心朝上且横向展开", () => {
  for (const side of [-1, 1] as const) {
    const front = palmGeometry(side, 1, 0, 0)[3].d;
    const points = [...front.matchAll(/[ML]([\d.-]+) ([\d.-]+)/g)].map((m) => [
      +m[1],
      +m[2],
    ]);
    const xs = points.map((p) => p[0]),
      ys = points.map((p) => p[1]);
    const minX = Math.min(...xs),
      maxX = Math.max(...xs),
      minY = Math.min(...ys),
      maxY = Math.max(...ys);
    expect(maxY - minY).toBeLessThan((maxX - minX) * 0.8);
    expect((minY + maxY) / 2).toBeGreaterThan(170);
    expect((minY + maxY) / 2).toBeLessThan(220);
    if (side < 0) expect(maxX).toBeLessThan(115);
    else expect(minX).toBeGreaterThan(205);
  }
});

it("举手示意只有一只竖掌，连续切换后可以完整收回", () => {
  const fronts = () =>
    [...container.querySelectorAll("[data-hand-face]")].filter(
      (el) =>
        el.getAttribute("d") && el.getAttribute("fill")?.startsWith("url("),
    );
  act(() => root.render(<SphereEmoji appearance="skull" emotion="idle" />));
  act(() => root.render(<SphereEmoji appearance="skull" emotion="raise" />));
  expect(fronts()).toHaveLength(0);
  tick(82);
  expect(fronts()).toHaveLength(1);
  const d = fronts()[0].getAttribute("d")!;
  const points = [...d.matchAll(/[ML]([\d.-]+) ([\d.-]+)/g)].map((m) => [
    +m[1],
    +m[2],
  ]);
  const xs = points.map((p) => p[0]),
    ys = points.map((p) => p[1]);
  expect(Math.max(...ys) - Math.min(...ys)).toBeGreaterThan(
    Math.max(...xs) - Math.min(...xs),
  );
  tick(100);
  expect(fronts()).toHaveLength(0);
  act(() => root.render(<SphereEmoji appearance="skull" emotion="curious" />));
  tick(10);
  act(() => root.render(<SphereEmoji appearance="skull" emotion="raise" />));
  tick(82);
  expect(fronts()).toHaveLength(1);
  act(() => root.render(<SphereEmoji appearance="skull" emotion="idle" />));
  tick(180);
  expect(fronts()).toHaveLength(0);
});
it("举手在静态模式和极限视角保持材质与有效几何", () => {
  act(() =>
    root.render(
      <SphereEmoji appearance="skull" emotion="raise" reducedMotion />,
    ),
  );
  expect(frames.size).toBe(0);
  expect(container.querySelector('[aria-label="举手示意表情"]')).not.toBeNull();
  for (const yaw of [-1.13, 0, 1.13])
    for (const pitch of [-0.7, 0, 0.7]) {
      const faces = skullHandGeometry(skullPoses.raise, yaw, pitch);
      expect(faces).toHaveLength(HAND_FACE_COUNT);
      expect(faces.filter((f) => f.d && f.fill === "mask")).toHaveLength(1);
      for (const face of faces) expect(face.d).not.toMatch(/NaN|Infinity/);
    }
});

it("九种骷髅状态都有完整动作，结束回到稳定姿态", () => {
  for (const emotion of skullEmotions) {
    const beginning = expressionMotion(emotion, 0);
    const middle = expressionMotion(emotion, 0.55);
    const end = expressionMotion(emotion, expressionDuration);
    expect(Object.values(middle).every(Number.isFinite)).toBe(true);
    expect(middle).not.toEqual(beginning);
    expect(end).toEqual(expressionMotion(emotion, expressionDuration + 1));
    expect(end.raiseAmount).toBe(emotion === "raise" ? 0 : 1);
  }
});

it("思考不用手；重复触发会重播，暂停与减少动态会冻结动作", () => {
  const draw = () =>
    container.querySelector('[data-part="left"]')!.getAttribute("d");
  const hands = () =>
    [...container.querySelectorAll("[data-hand-face]")]
      .map((el) => el.getAttribute("d"))
      .join("");
  act(() =>
    root.render(
      <SphereEmoji
        appearance="skull"
        emotion="thinking"
        followPointer={false}
      />,
    ),
  );
  expect(container.querySelector('[aria-label="思考表情"]')).not.toBeNull();
  expect(hands()).toBe("");
  const initial = draw();
  act(() =>
    root.render(
      <SphereEmoji
        appearance="skull"
        emotion="thinking"
        followPointer={false}
        playKey={1}
      />,
    ),
  );
  tick(25);
  expect(draw()).not.toBe(initial);
  expect(hands()).toBe("");
  const moved = draw();
  act(() =>
    root.render(
      <SphereEmoji
        appearance="skull"
        emotion="thinking"
        followPointer={false}
        playKey={1}
        paused
      />,
    ),
  );
  tick(30);
  expect(draw()).toBe(moved);
  act(() =>
    root.render(
      <SphereEmoji
        appearance="skull"
        emotion="thinking"
        followPointer={false}
        playKey={1}
      />,
    ),
  );
  tick(160);
  const settled = draw();
  act(() =>
    root.render(
      <SphereEmoji
        appearance="skull"
        emotion="thinking"
        followPointer={false}
        playKey={2}
      />,
    ),
  );
  tick(25);
  expect(draw()).not.toBe(settled);
  act(() =>
    root.render(
      <SphereEmoji
        appearance="skull"
        emotion="thinking"
        playKey={2}
        reducedMotion
      />,
    ),
  );
  const still = draw();
  tick(30);
  expect(draw()).toBe(still);
  expect(frames.size).toBe(0);
});

it("举手动作确实改变手的三维轮廓", () => {
  const wave = expressionMotion("raise", 0.93).wave;
  expect(wave).not.toBe(0);
  expect(
    skullHandGeometry(skullPoses.raise, 0, 0, wave).map((face) => face.d),
  ).not.toEqual(skullHandGeometry(skullPoses.raise).map((face) => face.d));
});

it("无语时两只手同步绕掌心微摆，眼窝等大半闭", () => {
  const first = expressionMotion("curious", 0.48);
  const second = expressionMotion("curious", 0.82);
  expect(first.palmSway).toBeGreaterThan(0);
  expect(second.palmSway).toBeLessThan(0);
  expect(skullPoses.curious.leftY).toBe(skullPoses.curious.rightY);
  expect(skullPoses.curious.browTilt).toBe(0);
  expect(skullPoses.curious.sad).toBeGreaterThan(0.8);
  expect(skullPoses.curious.mouthOpen).toBeLessThan(0.05);
  for (const side of [-1, 1] as const) {
    const up = palmGeometry(side, 1, 0, 0, "shrug", first.palmSway);
    const down = palmGeometry(side, 1, 0, 0, "shrug", second.palmSway);
    expect(up.map((face) => face.d)).not.toEqual(down.map((face) => face.d));
    const center = (faces: typeof up) => {
      const points = faces[3].d.match(/-?\d+(?:\.\d+)?/g)!.map(Number);
      return [
        points.filter((_, i) => i % 2 === 0).reduce((a, b) => a + b) /
          (points.length / 2),
        points.filter((_, i) => i % 2 === 1).reduce((a, b) => a + b) /
          (points.length / 2),
      ];
    };
    const a = center(up),
      b = center(down);
    expect(Math.hypot(a[0] - b[0], a[1] - b[1])).toBeLessThan(10);
  }
});

it("思考时两眼先一起上看，再一起看向左上和右上，头随视线转动", () => {
  const up = expressionMotion("thinking", 0.38);
  const left = expressionMotion("thinking", 0.9);
  const right = expressionMotion("thinking", 1.75);
  expect(up.gazeY).toBeLessThan(0);
  expect(up.gazeX).toBe(0);
  expect(up.yaw).toBe(0);
  expect(up.pitch).toBeLessThan(0);
  expect(left.gazeY).toBeLessThan(0);
  expect(right.gazeY).toBeLessThan(0);
  expect(left.gazeX).toBeLessThan(0);
  expect(right.gazeX).toBeGreaterThan(0);
  expect(left.yaw).toBeLessThan(0);
  expect(right.yaw).toBeGreaterThan(0);
  expect(left.leftX).toBe(0);
  expect(left.rightX).toBe(0);
  expect(left.leftEye).toBe(left.rightEye);
  expect(right.leftEye).toBe(right.rightEye);
  const before = skullGeometry(skullPoses.thinking);
  const looking = skullGeometry(
    {
      ...skullPoses.thinking,
      leftY: skullPoses.thinking.leftY + left.gazeY,
      rightY: skullPoses.thinking.rightY + left.gazeY,
    },
    0,
    0,
    1,
    left.gazeX,
  );
  expect(looking.left).not.toBe(before.left);
  expect(looking.right).not.toBe(before.right);
  expect(expressionMotion("thinking", expressionDuration).gazeX).toBe(0);
});

it("卡顿头顶三点循环，减少动态时显示静止三点", () => {
  act(() =>
    root.render(
      <SphereEmoji appearance="skull" emotion="stalled" reducedMotion />,
    ),
  );
  const dots = [...container.querySelectorAll("[data-loading-dot]")];
  const group = container.querySelector("[data-loading-dots]")!;
  expect(dots).toHaveLength(3);
  expect(dots.map((dot) => dot.getAttribute("r"))).toEqual([
    "7.5",
    "7.5",
    "7.5",
  ]);
  expect(group.getAttribute("opacity")).toBe("1");
  expect(frames.size).toBe(0);
  const still = dots.map((dot) => dot.getAttribute("cy"));
  act(() =>
    root.render(
      <SphereEmoji
        appearance="skull"
        emotion="stalled"
        reducedMotion={false}
        playKey={1}
      />,
    ),
  );
  tick(20);
  expect(dots.map((dot) => dot.getAttribute("cy"))).not.toEqual(still);
  const moving = dots.map((dot) => dot.getAttribute("cy"));
  tick(20);
  expect(dots.map((dot) => dot.getAttribute("cy"))).not.toEqual(moving);
});

it("死机右上角红色感叹号弹出后收回", () => {
  act(() => root.render(<SphereEmoji appearance="skull" emotion="crashed" />));
  const alert = container.querySelector("[data-crash-alert]")!;
  expect(alert.querySelector("path")?.getAttribute("stroke")).toBe("#e5484d");
  expect(alert.querySelector("path")?.getAttribute("stroke-width")).toBe("12");
  expect(alert.querySelector("circle")?.getAttribute("r")).toBe("7");
  expect(alert.getAttribute("opacity")).toBe("0");
  act(() =>
    root.render(
      <SphereEmoji appearance="skull" emotion="crashed" playKey={1} />,
    ),
  );
  tick(34);
  expect(Number(alert.getAttribute("opacity"))).toBeGreaterThan(0.3);
  tick(140);
  expect(alert.getAttribute("opacity")).toBe("0");
});
