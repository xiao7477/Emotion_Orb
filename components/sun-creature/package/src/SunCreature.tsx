import { useEffect, useId, useRef, useState, type CSSProperties, type PointerEvent } from "react";
import { useReducedMotion } from "motion/react";
import {
  curve,
  ellipse,
  makeCone,
  pathFrom3D,
  projectPatch,
  projectPoint,
  ribbon,
  rotatePoint,
  scaleAround,
  uniformSphereDirections,
  type Point,
  type Vec3,
} from "./surface";
import {
  sunCreatureLabels,
  type SunCreatureEmotion,
} from "./expressions";
import "./sun-creature.css";

export type { SunCreatureEmotion } from "./expressions";

export interface SunCreatureProps {
  emotion?: SunCreatureEmotion;
  size?: number | string;
  followPointer?: boolean;
  reducedMotion?: boolean;
  decorative?: boolean;
  className?: string;
  style?: CSSProperties;
}

type View = { yaw: number; pitch: number; gazeX: number; gazeY: number };
type PathLayer = { key: string; d: string; fill: string; opacity?: number };
type ConeFace = { key: string; d: string; z: number; fill: string };
type ConeMesh = {
  index: number;
  nose: boolean;
  viewZ: number;
  base: string;
  halo: string;
  faces: ConeFace[];
};

const initialView: View = { yaw: 0, pitch: 0, gazeX: 0, gazeY: 0 };
const coneDirections = uniformSphereDirections(14);

const expressions: Record<SunCreatureEmotion, {
  eyeStyle: "open" | "smile" | "sleepy" | "narrow";
  eyeScale: number;
  mouthStyle: "grin" | "round" | "smile" | "frown" | "line";
  mouthWidth: number;
  mouthY: number;
  mouthOpen: number;
  mouthBend: number;
}> = {
  idle: { eyeStyle: "open", eyeScale: 1, mouthStyle: "grin", mouthWidth: .37, mouthY: .23, mouthOpen: .31, mouthBend: .045 },
  happy: { eyeStyle: "smile", eyeScale: 1.02, mouthStyle: "grin", mouthWidth: .43, mouthY: .22, mouthOpen: .36, mouthBend: .055 },
  curious: { eyeStyle: "open", eyeScale: 1.05, mouthStyle: "round", mouthWidth: .13, mouthY: .27, mouthOpen: .19, mouthBend: 0 },
  surprised: { eyeStyle: "open", eyeScale: 1.18, mouthStyle: "round", mouthWidth: .15, mouthY: .28, mouthOpen: .23, mouthBend: 0 },
  sleepy: { eyeStyle: "sleepy", eyeScale: .98, mouthStyle: "line", mouthWidth: .17, mouthY: .31, mouthOpen: .02, mouthBend: .012 },
  grumpy: { eyeStyle: "narrow", eyeScale: .92, mouthStyle: "frown", mouthWidth: .25, mouthY: .31, mouthOpen: .035, mouthBend: -.055 },
  sad: { eyeStyle: "open", eyeScale: .92, mouthStyle: "frown", mouthWidth: .22, mouthY: .34, mouthOpen: .045, mouthBend: -.07 },
};

function averageDepth(points: Vec3[], yaw: number, pitch: number) {
  return points.reduce((sum, point) => sum + rotatePoint(point, yaw, pitch)[2], 0) / points.length;
}

function trianglePath(points: Vec3[], yaw: number, pitch: number) {
  const projected = points.map((point) => projectPoint(rotatePoint(point, yaw, pitch)));
  return projected.map(([x, y], index) => `${index ? "L" : "M"}${x.toFixed(2)} ${y.toFixed(2)}`).join(" ") + "Z";
}

function coneMeshes(view: View): { behind: ConeMesh[]; ahead: ConeMesh[] } {
  const yaw = view.yaw;
  const pitch = view.pitch;
  const meshes = coneDirections.map((direction, index): ConeMesh => {
    const nose = index === 0;
    const halfAngle = nose ? .17 : .145;
    const height = nose ? .46 : .31;
    const cone = makeCone(
      direction,
      halfAngle,
      height,
      8,
      nose ? [0, -.42, .91] : direction,
    );
    const viewDirection = rotatePoint(direction, yaw, pitch);
    const haloCone = makeCone(direction, halfAngle * 1.26, .01, 8);
    const faces = cone.triangles.map((triangle, faceIndex) => {
      const light = ["#FFD568", "#FFC454", "#F4A42B", "#E88A1D", "#D87517", "#CF6713", "#DE7B17", "#F0A02A"];
      const horn = ["#B77A47", "#A26A3D", "#865633", "#70472C", "#5E3B27", "#553823", "#6E482D", "#92623B"];
      return {
        key: `${index}-${faceIndex}`,
        d: trianglePath(triangle, yaw, pitch),
        z: averageDepth(triangle, yaw, pitch),
        fill: (nose ? horn : light)[faceIndex],
      };
    });
    return {
      index,
      nose,
      viewZ: viewDirection[2],
      base: pathFrom3D(cone.ring, yaw, pitch),
      halo: pathFrom3D(haloCone.ring, yaw, pitch),
      faces,
    };
  });
  return {
    behind: meshes.filter((mesh) => mesh.viewZ < .08).sort((a, b) => a.viewZ - b.viewZ),
    ahead: meshes.filter((mesh) => mesh.viewZ >= .08).sort((a, b) => a.viewZ - b.viewZ),
  };
}

function faceLayers(emotion: SunCreatureEmotion, view: View, id: string) {
  const pose = expressions[emotion];
  const yaw = view.yaw;
  const pitch = view.pitch;
  const patch = (points: Point[]) => projectPatch(points, yaw, pitch);
  const layers: PathLayer[] = [];

  for (const [side, cx] of [["left", -.42], ["right", .42]] as const) {
    const cy = -.10;
    const eyeScale = pose.eyeScale * (emotion === "curious" && side === "left" ? 1.12 : 1);
    layers.push({
      key: `${side}-socket-shadow`,
      d: patch(ellipse(cx, cy + .012, .19 * eyeScale, .145 * eyeScale)),
      fill: "#9A4313",
      opacity: .78,
    });
    layers.push({
      key: `${side}-socket`,
      d: patch(ellipse(cx, cy, .17 * eyeScale, .128 * eyeScale)),
      fill: `url(#${id}-socket)`,
    });
    layers.push({
      key: `${side}-socket-rim`,
      d: patch(ribbon(curve(cx, cy - .026, .143 * eyeScale, -.008), .011)),
      fill: "#FFD06A",
      opacity: .86,
    });

    if (pose.eyeStyle === "open") {
      layers.push({
        key: `${side}-eye-white`,
        d: patch(ellipse(cx, cy + .019, .102 * eyeScale, .079 * eyeScale)),
        fill: `url(#${id}-eye)`,
      });
      layers.push({
        key: `${side}-pupil`,
        d: patch(ellipse(cx + view.gazeX, cy + .023 + view.gazeY, .045 * eyeScale, .052 * eyeScale)),
        fill: "#261711",
      });
      layers.push({
        key: `${side}-glint`,
        d: patch(ellipse(cx + view.gazeX - .014, cy + view.gazeY + .004, .014, .018)),
        fill: "#FFF8E4",
        opacity: .94,
      });
    } else {
      const bend = pose.eyeStyle === "smile" ? .052 : pose.eyeStyle === "sleepy" ? .012 : -.004;
      layers.push({
        key: `${side}-closed-eye`,
        d: patch(ribbon(curve(cx, cy + .012, .112 * eyeScale, bend), .021)),
        fill: "#2B1710",
      });
    }

    const browBend = emotion === "grumpy" ? .032 : emotion === "sad" ? -.044 : -.018;
    const browTilt = emotion === "curious" && side === "left" ? -.035 : 0;
    layers.push({
      key: `${side}-brow`,
      d: patch(ribbon(curve(cx, cy - .148, .13, browBend, browTilt), .022)),
      fill: "#74320F",
    });
  }

  if (pose.mouthStyle === "smile" || pose.mouthStyle === "line" || pose.mouthOpen < .07) {
    const bend = pose.mouthStyle === "frown" ? pose.mouthBend : pose.mouthBend;
    layers.push({
      key: "mouth-groove-shadow",
      d: patch(ribbon(curve(0, pose.mouthY, pose.mouthWidth + .025, bend), .035)),
      fill: "#A64C16",
      opacity: .72,
    });
    layers.push({
      key: "mouth-groove",
      d: patch(ribbon(curve(0, pose.mouthY - .006, pose.mouthWidth, bend), .021)),
      fill: "#35170E",
    });
    return layers;
  }

  let mouth: Point[];
  if (pose.mouthStyle === "round") {
    mouth = ellipse(0, pose.mouthY, pose.mouthWidth, pose.mouthOpen * .72);
  } else {
    const top: Point[] = [];
    const bottom: Point[] = [];
    for (let index = 0; index <= 32; index++) {
      const normalized = (index / 16) - 1;
      const curveAmount = Math.max(0, 1 - normalized * normalized);
      const x = normalized * pose.mouthWidth;
      top.push([x, pose.mouthY - pose.mouthBend * curveAmount]);
      bottom.push([x, pose.mouthY + pose.mouthOpen * Math.pow(curveAmount, .7)]);
    }
    mouth = [...top, ...bottom.reverse()];
  }
  const mouthCenterY = pose.mouthY + (pose.mouthOpen * .25);
  layers.push({
    key: "mouth-shadow",
    d: patch(scaleAround(mouth, 0, mouthCenterY, 1.16)),
    fill: "#8F3C13",
    opacity: .78,
  });
  layers.push({
    key: "mouth-bevel",
    d: patch(scaleAround(mouth, 0, mouthCenterY, 1.075)),
    fill: `url(#${id}-bevel)`,
  });
  layers.push({
    key: "mouth-cavity",
    d: patch(mouth),
    fill: `url(#${id}-cavity)`,
  });

  if (pose.mouthStyle === "grin") {
    const toothTop = pose.mouthY - Math.max(0, pose.mouthBend) + .018;
    const toothBottom = pose.mouthY + pose.mouthOpen * .37;
    const width = pose.mouthWidth * .78;
    const toothArch: Point[] = [];
    for (let index = 0; index <= 28; index++) {
      const x = (index / 14 - 1) * width;
      const t = x / width;
      toothArch.push([x, toothTop + Math.abs(t) * .025]);
    }
    for (let index = 28; index >= 0; index--) {
      const x = (index / 14 - 1) * width;
      const t = x / width;
      toothArch.push([x, toothBottom + Math.abs(t) * .025]);
    }
    layers.push({ key: "teeth", d: patch(toothArch), fill: `url(#${id}-teeth)` });
    for (const toothX of [-.22, -.15, -.075, 0, .075, .15, .22]) {
      const divider = ribbon(
        [[toothX, toothTop + Math.abs(toothX) * .05], [toothX, toothBottom + Math.abs(toothX) * .05]],
        .0023,
      );
      layers.push({ key: `tooth-${toothX}`, d: patch(divider), fill: "#BD9A62", opacity: .8 });
    }
    layers.push({
      key: "tongue",
      d: patch(ellipse(0, pose.mouthY + pose.mouthOpen * .77, pose.mouthWidth * .28, pose.mouthOpen * .19)),
      fill: `url(#${id}-tongue)`,
    });
  }
  return layers;
}

/** A spherical sun character: evenly spaced raised cones, a cone nose, and carved facial features. */
export function SunCreature({
  emotion = "idle",
  size = 240,
  followPointer = true,
  reducedMotion,
  decorative = false,
  className,
  style,
}: SunCreatureProps) {
  const systemReducedMotion = useReducedMotion();
  const shouldReduceMotion = reducedMotion ?? Boolean(systemReducedMotion);
  const uid = `sun-${useId().replace(/[^a-zA-Z0-9]/g, "")}`;
  const [view, setView] = useState<View>(initialView);
  const viewRef = useRef<View>(initialView);
  const targetRef = useRef<View>(initialView);
  const frameRef = useRef<number | null>(null);
  const lastFrameRef = useRef(0);
  const dimension = typeof size === "number" ? `${size}px` : size;

  const animateTowardTarget = () => {
    if (frameRef.current !== null || shouldReduceMotion) return;
    const tick = (time: number) => {
      const previous = viewRef.current;
      const dt = lastFrameRef.current ? Math.min(48, time - lastFrameRef.current) : 16;
      lastFrameRef.current = time;
      const amount = 1 - Math.exp(-dt / 76);
      const next: View = {
        yaw: previous.yaw + (targetRef.current.yaw - previous.yaw) * amount,
        pitch: previous.pitch + (targetRef.current.pitch - previous.pitch) * amount,
        gazeX: previous.gazeX + (targetRef.current.gazeX - previous.gazeX) * amount,
        gazeY: previous.gazeY + (targetRef.current.gazeY - previous.gazeY) * amount,
      };
      viewRef.current = next;
      setView(next);
      const distance = Math.max(
        Math.abs(targetRef.current.yaw - next.yaw),
        Math.abs(targetRef.current.pitch - next.pitch),
        Math.abs(targetRef.current.gazeX - next.gazeX),
        Math.abs(targetRef.current.gazeY - next.gazeY),
      );
      if (distance > .0005) {
        frameRef.current = requestAnimationFrame(tick);
      } else {
        frameRef.current = null;
        lastFrameRef.current = 0;
      }
    };
    frameRef.current = requestAnimationFrame(tick);
  };

  useEffect(() => () => {
    if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
  }, []);

  useEffect(() => {
    if (followPointer && !shouldReduceMotion && !decorative) return;
    targetRef.current = initialView;
    viewRef.current = initialView;
    setView(initialView);
    if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    frameRef.current = null;
    lastFrameRef.current = 0;
  }, [followPointer, shouldReduceMotion, decorative]);

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (!followPointer || shouldReduceMotion || decorative || event.pointerType === "touch") return;
    const bounds = event.currentTarget.getBoundingClientRect();
    if (!bounds.width || !bounds.height) return;
    const x = Math.max(-1, Math.min(1, (event.clientX - bounds.left - bounds.width / 2) / (bounds.width / 2)));
    const y = Math.max(-1, Math.min(1, (event.clientY - bounds.top - bounds.height / 2) / (bounds.height / 2)));
    targetRef.current = {
      yaw: x * .48,
      pitch: y * -.34,
      gazeX: x * .032,
      gazeY: y * .026,
    };
    animateTowardTarget();
  };

  const handlePointerLeave = () => {
    targetRef.current = initialView;
    animateTowardTarget();
  };

  const meshes = coneMeshes(view);
  const facialLayers = faceLayers(emotion, view, uid);

  return (
    <div
      className={["sun-creature", className].filter(Boolean).join(" ")}
      style={{ width: dimension, height: dimension, ...style }}
      data-emotion={emotion}
      data-follow-pointer={followPointer}
      data-reduced-motion={shouldReduceMotion}
      role={decorative ? undefined : "img"}
      aria-hidden={decorative || undefined}
      aria-label={decorative ? undefined : `太阳角色：${sunCreatureLabels[emotion]}`}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
    >
      <div className="sun-creature__float">
        <svg className="sun-creature__art" viewBox="0 0 320 320" role="presentation" focusable="false">
          <defs>
            <radialGradient id={`${uid}-shell`} cx="31%" cy="23%" r="82%">
              <stop offset="0" stopColor="#FFE888" />
              <stop offset=".39" stopColor="#FFC64A" />
              <stop offset=".75" stopColor="#F29A24" />
              <stop offset="1" stopColor="#C75B13" />
            </radialGradient>
            <radialGradient id={`${uid}-socket`} cx="42%" cy="28%" r="80%">
              <stop offset="0" stopColor="#713817" />
              <stop offset=".5" stopColor="#432315" />
              <stop offset="1" stopColor="#21120D" />
            </radialGradient>
            <radialGradient id={`${uid}-eye`} cx="37%" cy="24%" r="80%">
              <stop offset="0" stopColor="#FFF8E4" />
              <stop offset=".7" stopColor="#E8D3A6" />
              <stop offset="1" stopColor="#B99C6B" />
            </radialGradient>
            <radialGradient id={`${uid}-bevel`} cx="40%" cy="18%" r="92%">
              <stop offset="0" stopColor="#D77A27" />
              <stop offset=".65" stopColor="#71320F" />
              <stop offset="1" stopColor="#35170E" />
            </radialGradient>
            <radialGradient id={`${uid}-cavity`} cx="48%" cy="28%" r="86%">
              <stop offset="0" stopColor="#100B09" />
              <stop offset=".65" stopColor="#27120D" />
              <stop offset="1" stopColor="#4B210F" />
            </radialGradient>
            <linearGradient id={`${uid}-teeth`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#FFF3D1" />
              <stop offset="1" stopColor="#D8BB84" />
            </linearGradient>
            <linearGradient id={`${uid}-tongue`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#F18777" />
              <stop offset="1" stopColor="#BB4542" />
            </linearGradient>
          </defs>

          <ellipse cx="160" cy="304" rx="84" ry="8" fill="#48230D" opacity=".19" />

          <g aria-hidden="true">
            {meshes.behind.map((mesh) => (
              <g key={`rear-${mesh.index}`}>
                {mesh.faces.map((face) => <path key={face.key} d={face.d} fill={face.fill} />)}
              </g>
            ))}
          </g>

          <circle cx="160" cy="160" r="128" fill="#87370C" opacity=".48" transform="translate(3 6)" />
          <circle cx="160" cy="158" r="128" fill={`url(#${uid}-shell)`} stroke="#9A4310" strokeWidth="3" />
          <ellipse cx="112" cy="100" rx="47" ry="25" fill="#FFF5B8" opacity=".12" transform="rotate(-29 112 100)" />

          {meshes.ahead.map((mesh) => (
            <g key={`front-${mesh.index}`}>
              <path d={mesh.halo} fill={mesh.nose ? "#572812" : "#8E3E12"} opacity={mesh.nose ? .6 : .43} />
              <path d={mesh.base} fill="none" stroke={mesh.nose ? "#593018" : "#A34C14"} strokeWidth={mesh.nose ? 1.8 : 1.2} opacity=".84" />
              {mesh.faces.map((face) => <path key={face.key} d={face.d} fill={face.fill} />)}
            </g>
          ))}

          <g>
            {facialLayers.map((layer) => (
              <path key={layer.key} d={layer.d} fill={layer.fill} opacity={layer.opacity} />
            ))}
          </g>
        </svg>
      </div>
    </div>
  );
}
