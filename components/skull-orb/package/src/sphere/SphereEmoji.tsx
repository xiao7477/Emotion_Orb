import { useEffect, useId, useRef, type CSSProperties } from "react";
import { useReducedMotion } from "motion/react";
import { subscribeFrame } from "../motion/scheduler";
import { advanceSpring, type Spring } from "../core/state";
import {
  faceGeometry,
  spherePoses,
  sphereLabels,
  type SphereEmotion,
  type FacePose,
} from "./geometry";

import { skullGeometry, skullPoses, skullViewAngles } from "./skull";
import {
  skullHoodGeometry,
  skullPortraitLightning,
  skullPortraitViewBox,
  skullPortraitFaceTransform,
} from "./portrait";

import { skullHandGeometry, skullHeadTransform, type HandFace } from "./hands";

import { skullMaterial, handFill } from "./material";
import { expressionDuration, expressionMotion } from "./expressionMotion";
import { PortraitLighting, PortraitLightingDefs } from "./PortraitLighting";

export type SphereAppearance = "sphere" | "skull";
const portraitSkullPoses = Object.fromEntries(
  Object.entries(skullPoses).map(([emotion, pose]) => [
    emotion,
    { ...pose, hood: 1 },
  ]),
) as Record<SphereEmotion, FacePose>;
const posesFor = (appearance: SphereAppearance, portrait = false) =>
  appearance === "skull"
    ? portrait
      ? portraitSkullPoses
      : skullPoses
    : spherePoses;
const geometryFor = (
  pose: FacePose,
  yaw: number,
  pitch: number,
  blink: number,
  appearance: SphereAppearance,
  gazeX = 0,
  leftX = 0,
  rightX = 0,
  leftScale = 1,
  rightScale = 1,
) =>
  appearance === "skull"
    ? skullGeometry(
        pose,
        yaw,
        pitch,
        blink,
        gazeX,
        leftX,
        rightX,
        leftScale,
        rightScale,
      )
    : {
        crest: "",
        maskEdge: "",
        maskSide: "",
        maskSideLight: "",
        mask: "",
        teeth: "",
        temple: "",
        ...faceGeometry(pose, yaw, pitch, blink),
      };

export interface SphereEmojiProps {
  appearance?: SphereAppearance;
  /** Show the dedicated upper-body skull silhouette across its expressions. */
  portrait?: boolean;
  emotion?: SphereEmotion;
  size?: number | string;
  followPointer?: boolean;
  reducedMotion?: boolean;
  paused?: boolean;
  /** Increment to replay the current emotion's full action, including on repeated clicks. */
  playKey?: number;
  shading?: boolean;
  /** Optional manual viewing angles, in degrees. */
  yaw?: number;
  pitch?: number;
  decorative?: boolean;
  className?: string;
  style?: CSSProperties;
}
const radians = Math.PI / 180;
type Geometry = ReturnType<typeof geometryFor>;
/** Pure SVG artwork. No bitmap textures or filter-based facial warping. */
export function SphereArtwork({
  pose,
  yaw = 0,
  pitch = 0,
  shading = true,
  id = "sphere",
  decorative = false,
  appearance = "sphere",
}: {
  pose: FacePose;
  appearance?: SphereAppearance;
  yaw?: number;
  pitch?: number;
  shading?: boolean;
  id?: string;
  decorative?: boolean;
}) {
  const paths = geometryFor(
    pose,
    yaw * radians,
    pitch * radians,
    1,
    appearance,
  );
  const hands =
    appearance === "skull"
      ? skullHandGeometry(pose, yaw * radians, pitch * radians)
      : [];
  return (
    <svg
      data-skull-svg=""
      xmlns="http://www.w3.org/2000/svg"
      viewBox={
        appearance === "skull" ? skullPortraitViewBox(pose.hood) : "0 0 320 320"
      }
      width="100%"
      height="100%"
      aria-hidden={decorative || undefined}
      style={{ display: "block", overflow: "visible" }}
    >
      <defs>
        {appearance === "skull" && (
          <PortraitLightingDefs
            id={id}
            silhouette={`${skullHoodGeometry(yaw * radians, pitch * radians)} ${skullPortraitLightning(yaw * radians, pitch * radians)}`}
          />
        )}
        <radialGradient id={`${id}-body`} cx="33%" cy="22%" r="79%">
          <stop offset="0" stopColor="#414145" />
          <stop offset=".42" stopColor="#252528" />
          <stop offset=".8" stopColor="#131315" />
          <stop offset="1" stopColor="#080809" />
        </radialGradient>
        <radialGradient id={`${id}-mask`} cx="30%" cy="18%" r="95%">
          <stop offset="0" stopColor={skullMaterial.highlight} />
          <stop offset=".55" stopColor={skullMaterial.midtone} />
          <stop offset="1" stopColor={skullMaterial.shadow} />
        </radialGradient>
        <clipPath id={`${id}-clip`}>
          <circle cx="160" cy="160" r="128" />
        </clipPath>
        <clipPath id={`${id}-mask-face`}>
          <path data-eye-clip="mask" d={paths.mask} />
        </clipPath>
        <clipPath id={`${id}-left-eye`}>
          <path data-eye-clip="left" d={paths.left} />
        </clipPath>
        <clipPath id={`${id}-right-eye`}>
          <path data-eye-clip="right" d={paths.right} />
        </clipPath>
      </defs>
      <g data-character-motion="">
        <g
          data-skull-head=""
          transform={
            appearance === "skull" ? skullHeadTransform(pose) : undefined
          }
        >
          <path
            data-part="crest"
            d={paths.crest}
            fill="#151518"
            opacity={1 - pose.hood}
          />
          <circle
            data-body-sphere=""
            cx="160"
            cy="160"
            r="128"
            fill={shading ? `url(#${id}-body)` : "#121214"}
            opacity={appearance === "skull" ? 1 - pose.hood : 1}
          />
          {appearance === "skull" && (
            <path
              data-hood=""
              d={skullHoodGeometry(yaw * radians, pitch * radians)}
              fill={shading ? `url(#${id}-hood-material)` : "#101012"}
              opacity={pose.hood}
            />
          )}
          {appearance === "skull" && (
            <path
              data-portrait-lightning=""
              d={skullPortraitLightning(yaw * radians, pitch * radians)}
              fill={shading ? `url(#${id}-hood-material)` : "#101012"}
              opacity={pose.hood}
            />
          )}
          {appearance === "skull" && (
            <PortraitLighting id={id} opacity={shading ? pose.hood : 0} />
          )}
          {appearance === "skull" && (
            <g
              data-loading-dots=""
              opacity={pose.stalled}
              transform={`translate(0 ${-6 * pose.hood})`}
            >
              {[139, 160, 181].map((cx, i) => (
                <circle
                  key={cx}
                  data-loading-dot=""
                  cx={cx}
                  cy={i === 1 ? 13 : 28}
                  r="7.5"
                  fill={pose.hood > 0.5 ? "#fff" : "#202024"}
                  opacity={[0.35, 0.7, 1][i]}
                />
              ))}
            </g>
          )}
          <g
            data-skull-face=""
            transform={
              appearance === "skull"
                ? skullPortraitFaceTransform(pose.hood)
                : undefined
            }
          >
            <g
              fill="#fff"
              clipPath={appearance === "skull" ? undefined : `url(#${id}-clip)`}
            >
              {(Object.keys(paths) as (keyof Geometry)[])
                .filter((key) => key !== "hand" && key !== "crest")
                .map((key) => (
                  <path
                    key={key}
                    data-part={key}
                    d={paths[key]}
                    fill={
                      key === "maskSide"
                        ? skullMaterial.side
                        : key === "maskSideLight"
                          ? skullMaterial.sideLight
                          : key === "maskEdge"
                            ? skullMaterial.edge
                            : key === "mask"
                              ? shading
                                ? `url(#${id}-mask)`
                                : skullMaterial.front
                              : key.endsWith("Pupil") && appearance === "skull"
                                ? "#4b4752"
                                : appearance === "skull"
                                  ? "#101012"
                                  : key.endsWith("Pupil")
                                    ? "#111113"
                                    : undefined
                    }
                    clipPath={
                      appearance === "skull" && !key.startsWith("mask")
                        ? `url(#${id}-mask-face)`
                        : key.endsWith("Pupil")
                          ? `url(#${id}-${key === "leftPupil" ? "left" : "right"}-eye)`
                          : undefined
                    }
                    opacity={key.endsWith("Brow") ? pose.brow : 1}
                  />
                ))}
            </g>
            <path
              fill="#fff"
              data-part="hand"
              d={paths.hand}
              opacity={pose.hand}
            />
          </g>
          {appearance === "skull" && (
            <g
              data-crash-alert=""
              opacity="0"
              transform="translate(260 52) scale(.3) translate(-260 -52)"
            >
              <path
                d="M260 16 L259 47"
                fill="none"
                stroke="#e5484d"
                strokeWidth="12"
                strokeLinecap="round"
              />
              <circle cx="259" cy="67" r="7" fill="#e5484d" />
            </g>
          )}
        </g>
        <g
          data-skull-hands=""
          stroke="#565861"
          strokeWidth="0.8"
          strokeLinejoin="round"
        >
          {hands.map((face, i) => (
            <path
              key={i}
              data-hand-face=""
              d={face.d}
              fill={handFill(face.fill, id, shading)}
              stroke={face.stroke ?? "#565861"}
              opacity={face.opacity}
            />
          ))}
        </g>
      </g>
    </svg>
  );
}
export function SphereEmoji({
  emotion = "idle",
  appearance = "sphere",
  portrait = false,
  size = 256,
  followPointer = true,
  reducedMotion,
  paused = false,
  playKey = 0,
  shading = true,
  yaw,
  pitch,
  decorative = false,
  className,
  style,
}: SphereEmojiProps) {
  const id = "sphere-" + useId().replace(/[^a-zA-Z0-9]/g, "");
  const systemReduced = useReducedMotion();
  const reduced = reducedMotion ?? Boolean(systemReduced);
  const root = useRef<HTMLSpanElement>(null);
  const initial = useRef({
    pose: { ...posesFor(appearance, portrait)[emotion] },
    yaw: yaw ?? 0,
    pitch: pitch ?? 0,
  });
  const latest = useRef({
    emotion,
    followPointer,
    paused,
    yaw,
    pitch,
    appearance,
    portrait,
    shading,
    playKey,
  });
  latest.current = {
    emotion,
    followPointer,
    paused,
    yaw,
    pitch,
    appearance,
    portrait,
    shading,
    playKey,
  };
  const springs = useRef<Record<string, Spring>>({});
  const phase = useRef(0);
  const sequence = useRef({
    emotion,
    appearance,
    playKey,
    elapsed: expressionDuration,
  });
  const settlePose = useRef<() => void>(() => {});
  const visible = useRef(true);
  const lastPaths = useRef<Partial<Geometry>>({});
  const lastHands = useRef<HandFace[]>([]);
  useEffect(() => {
    if (!root.current || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(([entry]) => {
      visible.current = entry.isIntersecting;
    });
    observer.observe(root.current);
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    const host = root.current;
    if (!host) return;
    const elements = Object.fromEntries(
      Array.from(host.querySelectorAll<SVGPathElement>("[data-part]")).map(
        (el) => [el.dataset.part, el],
      ),
    );
    const eyeClips = Object.fromEntries(
      Array.from(host.querySelectorAll<SVGPathElement>("[data-eye-clip]")).map(
        (el) => [el.dataset.eyeClip, el],
      ),
    );
    const head = host.querySelector("[data-skull-head]");
    const svg = host.querySelector("[data-skull-svg]");
    const portraitFace = host.querySelector("[data-skull-face]");
    const portraitLightning = host.querySelector("[data-portrait-lightning]");
    const hood = host.querySelector("[data-hood]");
    const portraitLightShape = host.querySelector("[data-portrait-light-shape]");
    const portraitLighting = host.querySelector("[data-portrait-lighting]");
    const bodySphere = host.querySelector("[data-body-sphere]");
    const character = host.querySelector("[data-character-motion]");
    const loadingDots = host.querySelector("[data-loading-dots]");
    const dots = Array.from(host.querySelectorAll("[data-loading-dot]"));
    const crashAlert = host.querySelector("[data-crash-alert]");
    const handFaces = Array.from(host.querySelectorAll("[data-hand-face]"));
    let lastPortraitSilhouette = "";
    lastHands.current = [];
    const step = (
      dt: number,
      raw?: { x: number; y: number; present: boolean },
      settle = false,
    ) => {
      const props = latest.current;
      if (!settle && (props.paused || !visible.current)) return;
      if (
        sequence.current.emotion !== props.emotion ||
        sequence.current.appearance !== props.appearance ||
        sequence.current.playKey !== props.playKey
      ) {
        sequence.current = {
          emotion: props.emotion,
          appearance: props.appearance,
          playKey: props.playKey,
          elapsed: 0,
        };
      }
      if (!settle)
        sequence.current.elapsed = Math.min(
          expressionDuration,
          sequence.current.elapsed + dt,
        );
      const spring = (
        key: string,
        target: number,
        start: number,
        stiffness = 145,
      ) => {
        const s = (springs.current[key] ??= { value: start, velocity: 0 });
        if (settle) {
          s.value = target;
          s.velocity = 0;
          return target;
        }
        return advanceSpring(s, target, dt, stiffness, 24);
      };
      const pose = {
        ...posesFor(props.appearance, props.portrait)[props.emotion],
      };
      for (const key of Object.keys(pose) as (keyof FacePose)[])
        pose[key] = spring(key, pose[key], initial.current.pose[key]);
      const action =
        props.appearance === "skull" && !settle
          ? expressionMotion(props.emotion, sequence.current.elapsed)
          : expressionMotion("idle", expressionDuration);
      if (props.appearance === "skull") {
        pose.eyeRadius *= action.eyeScale;
        pose.leftY += action.gazeY + action.leftY;
        pose.rightY += action.gazeY + action.rightY;
        pose.mouthOpen *= action.mouthScale;
        pose.shrug *= action.handAmount;
        pose.raise *= action.raiseAmount;
      }
      let targetYaw = props.yaw ?? 0,
        targetPitch = props.pitch ?? 0;
      if (props.followPointer && raw?.present) {
        const box = host.getBoundingClientRect();
        const followWeight =
          props.appearance === "skull" && props.emotion === "thinking"
            ? Math.min(1, Math.max(0, (sequence.current.elapsed - 2.15) / 0.55))
            : 1;
        if (props.yaw === undefined)
          targetYaw =
            Math.tanh(
              (raw.x - box.left - box.width / 2) / Math.max(180, box.width),
            ) *
            (props.portrait ? 50 : 32) *
            followWeight;
        if (props.pitch === undefined)
          targetPitch =
            Math.tanh(
              (raw.y - box.top - box.height / 2) / Math.max(200, box.height),
            ) *
            (props.portrait ? 34 : 23) *
            followWeight;
      }
      const yy =
        (spring("yaw", targetYaw, initial.current.yaw, 100) + action.yaw) *
        radians;
      const pp =
        (spring("pitch", targetPitch, initial.current.pitch, 100) +
          action.pitch) *
        radians;
      phase.current += dt;
      const time = phase.current % 4.7;
      const blink = settle
        ? 1
        : Math.min(
            action.blink,
            1 - 0.92 * Math.exp(-Math.pow((time - 4.35) / 0.07, 2)),
          );
      const [viewYaw, viewPitch] =
        props.appearance === "skull"
          ? skullViewAngles(
              yy,
              pp,
              pose,
              sequence.current.elapsed,
              settle || !props.followPointer,
            )
          : [yy, pp];
      const paths = geometryFor(
        pose,
        viewYaw,
        viewPitch,
        blink,
        props.appearance,
        action.gazeX,
        action.leftX,
        action.rightX,
        action.leftEye,
        action.rightEye,
      );
      if (props.appearance === "skull") {
        svg?.setAttribute("viewBox", skullPortraitViewBox(pose.hood));
        portraitFace?.setAttribute(
          "transform",
          skullPortraitFaceTransform(pose.hood),
        );
        const hoodPath = skullHoodGeometry(viewYaw, viewPitch);
        const lightningPath = skullPortraitLightning(viewYaw, viewPitch);
        const silhouette = `${hoodPath} ${lightningPath}`;
        // Do not invalidate the three lighting filters during a settled pose.
        if (silhouette !== lastPortraitSilhouette) {
          portraitLightning?.setAttribute("d", lightningPath);
          hood?.setAttribute("d", hoodPath);
          portraitLightShape?.setAttribute("d", silhouette);
          lastPortraitSilhouette = silhouette;
        }
        portraitLightning?.setAttribute("opacity", String(pose.hood));
        elements.crest?.setAttribute("opacity", String(1 - pose.hood));
        hood?.setAttribute("opacity", String(pose.hood));
        const hoodFill = props.shading ? `url(#${id}-hood-material)` : "#101012";
        hood?.setAttribute("fill", hoodFill);
        portraitLightning?.setAttribute("fill", hoodFill);
        portraitLighting?.setAttribute("opacity", String(props.shading ? pose.hood : 0));
        bodySphere?.setAttribute("opacity", String(1 - pose.hood));
        loadingDots?.setAttribute("opacity", String(pose.stalled));
        loadingDots?.setAttribute(
          "transform",
          `translate(0 ${(-6 * pose.hood).toFixed(3)})`,
        );
        dots.forEach((dot, i) => {
          const rise = settle
            ? [0, 0.5, 1][i]
            : (1 + Math.sin(phase.current * 8 - (i * Math.PI * 2) / 3)) / 2;
          dot.setAttribute("cy", String([28, 13, 28][i] - rise * 5));
          dot.setAttribute("opacity", String(0.3 + rise * 0.7));
          dot.setAttribute("fill", pose.hood > 0.5 ? "#fff" : "#202024");
        });
        crashAlert?.setAttribute(
          "opacity",
          String(pose.crashed * action.alert),
        );
        crashAlert?.setAttribute(
          "transform",
          `translate(260 ${52 + 8 * (1 - action.alert)}) scale(${(0.3 + 0.7 * action.alert).toFixed(4)}) translate(-260 -52)`,
        );
      }
      const ambientBob =
        props.appearance === "skull" && !settle && props.emotion !== "crashed"
          ? Math.sin(phase.current * 1.5) * 1.2
          : 0;
      const bob = action.bob + ambientBob;
      character?.setAttribute(
        "transform",
        props.appearance === "skull"
          ? `translate(160 160) translate(0 ${bob.toFixed(3)}) rotate(${action.roll.toFixed(3)}) scale(${(1 + action.scale).toFixed(5)}) translate(-160 -160)`
          : "",
      );
      for (const key of Object.keys(paths) as (keyof Geometry)[]) {
        if (paths[key] !== lastPaths.current[key]) {
          elements[key]?.setAttribute("d", paths[key]);
          eyeClips[key]?.setAttribute("d", paths[key]);
        }
      }
      lastPaths.current = paths;
      head?.setAttribute(
        "transform",
        props.appearance === "skull" ? skullHeadTransform(pose) : "",
      );
      if (props.appearance === "skull") {
        const faces = skullHandGeometry(
          pose,
          viewYaw,
          viewPitch,
          action.wave,
          action.palmSway,
        );
        faces.forEach((face, i) => {
          const el = handFaces[i],
            last = lastHands.current[i];
          if (face.d !== last?.d) el?.setAttribute("d", face.d);
          const fill = handFill(face.fill, id, props.shading);
          if (el?.getAttribute("fill") !== fill) el?.setAttribute("fill", fill);
          if (face.stroke !== last?.stroke)
            el?.setAttribute("stroke", face.stroke ?? "#565861");
          if (face.opacity !== last?.opacity)
            el?.setAttribute("opacity", String(face.opacity));
        });
        lastHands.current = faces;
      }
      elements.leftBrow?.setAttribute("opacity", String(pose.brow));
      elements.rightBrow?.setAttribute("opacity", String(pose.brow));
      elements.hand?.setAttribute("opacity", String(pose.hand));
    };
    settlePose.current = () => step(0, undefined, true);
    if (reduced) {
      settlePose.current();
      return;
    }
    return subscribeFrame((dt, _now, raw) => step(dt, raw));
  }, [reduced, appearance, portrait]);
  useEffect(() => {
    if (reduced) settlePose.current();
  }, [reduced, emotion, yaw, pitch, appearance, portrait, shading, playKey]);
  return (
    <span
      ref={root}
      className={className}
      data-sphere-emoji=""
      data-appearance={appearance}
      role={decorative ? undefined : "img"}
      aria-hidden={decorative || undefined}
      aria-label={
        decorative
          ? undefined
          : `${appearance === "skull" && emotion === "curious" ? "无语摊手" : sphereLabels[emotion]}表情`
      }
      style={{
        display: "inline-block",
        width: size,
        height: size,
        flexShrink: 0,
        ...style,
      }}
    >
      <SphereArtwork
        {...initial.current}
        id={id}
        appearance={appearance}
        shading={shading}
        decorative
      />
    </span>
  );
}
