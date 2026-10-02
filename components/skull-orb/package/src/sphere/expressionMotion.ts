import type { SphereEmotion } from "./geometry";

type Key = readonly [time: number, value: number];
type Channel = readonly Key[];
export interface ExpressionMotion {
  yaw: number;
  pitch: number;
  bob: number;
  roll: number;
  scale: number;
  gazeX: number;
  gazeY: number;
  leftX: number;
  rightX: number;
  leftY: number;
  rightY: number;
  leftEye: number;
  rightEye: number;
  eyeScale: number;
  mouthScale: number;
  blink: number;
  handAmount: number;
  raiseAmount: number;
  palmSway: number;
  wave: number;
  alert: number;
}
const neutral: ExpressionMotion = {
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
  alert: 0,
};
const seconds = 2.7;
export const expressionDuration = seconds;
const smooth = (n: number) => n * n * (3 - 2 * n);
function sample(t: number, keys?: Channel): number | undefined {
  if (!keys) return undefined;
  if (t <= keys[0][0]) return keys[0][1];
  for (let i = 1; i < keys.length; i++) {
    const [end, b] = keys[i],
      [start, a] = keys[i - 1];
    if (t <= end) return a + (b - a) * smooth((t - start) / (end - start));
  }
  return keys.at(-1)![1];
}
type Score = Partial<Record<keyof ExpressionMotion, Channel>>;
// Each score starts and ends at the settled expression. Clicks replay it from zero.
const scores: Record<SphereEmotion, Score> = {
  idle: {
    bob: [
      [0, 0],
      [0.35, 5],
      [0.85, -5],
      [1.4, 0],
      [2.4, 0],
    ],
    gazeX: [
      [0, 0],
      [0.5, -0.045],
      [1.15, 0.04],
      [1.9, 0],
    ],
    blink: [
      [0, 1],
      [0.7, 1],
      [0.78, 0.08],
      [0.92, 1],
    ],
  },
  curious: {
    roll: [
      [0, 0],
      [0.48, -0.8],
      [1.16, 0.8],
      [1.95, 0],
    ],
    palmSway: [
      [0, 0],
      [0.48, 0.7],
      [0.82, -0.65],
      [1.16, 0.7],
      [1.5, -0.65],
      [1.95, 0],
    ],
    bob: [
      [0, 0],
      [0.45, -1.5],
      [1.05, 1.5],
      [2.1, 0],
    ],
  },
  raise: {
    pitch: [
      [0, 0],
      [0.42, -5],
      [1.05, 4],
      [1.85, 0],
    ],
    gazeX: [
      [0, 0],
      [0.55, -0.055],
      [1.4, -0.035],
      [2.1, 0],
    ],
    bob: [
      [0, 0],
      [0.45, 6],
      [0.95, -5],
      [1.5, 0],
    ],
    wave: [
      [0, 0],
      [0.8, 0],
      [1.08, -0.85],
      [1.36, 0.85],
      [1.64, -0.75],
      [1.92, 0.7],
      [2.16, 0],
    ],
    raiseAmount: [
      [0, 0],
      [0.18, 0.08],
      [0.78, 1],
      [1.94, 1],
      [2.5, 0],
      [2.7, 0],
    ],
  },
  thinking: {
    yaw: [
      [0, 0],
      [0.38, 0],
      [0.78, -10],
      [1.1, -10],
      [1.62, 10],
      [1.92, 10],
      [2.48, 0],
    ],
    pitch: [
      [0, 0],
      [0.38, -7],
      [0.78, -9],
      [1.92, -9],
      [2.48, 0],
    ],
    gazeX: [
      [0, 0],
      [0.38, 0],
      [0.78, -0.065],
      [1.1, -0.065],
      [1.62, 0.065],
      [1.92, 0.065],
      [2.48, 0],
    ],
    gazeY: [
      [0, 0],
      [0.38, -0.075],
      [1.92, -0.075],
      [2.48, 0],
    ],
    mouthScale: [
      [0, 1],
      [0.42, 0.8],
      [1.92, 0.8],
      [2.48, 1],
    ],
    bob: [
      [0, 0],
      [0.42, 2],
      [1.15, -1],
      [2.48, 0],
    ],
  },
  surprised: {
    scale: [
      [0, 0],
      [0.24, -0.075],
      [0.55, 0.12],
      [1.05, -0.025],
      [1.65, 0],
    ],
    eyeScale: [
      [0, 1],
      [0.24, 0.75],
      [0.58, 1.34],
      [1.3, 1.07],
      [1.9, 1],
    ],
    mouthScale: [
      [0, 1],
      [0.24, 0.7],
      [0.6, 1.4],
      [1.55, 1],
    ],
    bob: [
      [0, 0],
      [0.22, 7],
      [0.58, -13],
      [1.2, 3],
      [1.85, 0],
    ],
    pitch: [
      [0, 0],
      [0.55, -8],
      [1.5, 0],
    ],
  },
  sad: {
    pitch: [
      [0, 0],
      [0.55, 10],
      [1.35, 15],
      [2.3, 0],
    ],
    gazeY: [
      [0, 0],
      [0.55, 0.045],
      [1.35, 0.065],
      [2.3, 0],
    ],
    eyeScale: [
      [0, 1],
      [0.65, 0.82],
      [1.35, 0.8],
      [2.3, 1],
    ],
    bob: [
      [0, 0],
      [0.55, 8],
      [1.35, 12],
      [2.3, 0],
    ],
    roll: [
      [0, 0],
      [1.1, -3],
      [2.3, 0],
    ],
  },
  serious: {
    pitch: [
      [0, 0],
      [0.35, 6],
      [1.1, -6],
      [2.1, 0],
    ],
    eyeScale: [
      [0, 1],
      [0.35, 0.82],
      [1.1, 0.89],
      [2.1, 1],
    ],
    gazeX: [
      [0, 0],
      [1.1, -0.035],
      [2.1, 0],
    ],
    scale: [
      [0, 0],
      [1.1, 0.055],
      [2.1, 0],
    ],
    bob: [
      [0, 0],
      [0.35, 4],
      [1.1, -5],
      [2.1, 0],
    ],
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
      [2.1, 0],
    ],
    gazeX: [
      [0, 0],
      [0.32, -0.06],
      [0.58, -0.06],
      [0.66, 0.055],
      [1.12, 0.055],
      [1.22, -0.03],
      [1.72, -0.03],
      [2.1, 0],
    ],
    bob: [
      [0, 0],
      [0.32, 5],
      [0.58, 5],
      [0.66, -4],
      [1.12, -4],
      [1.22, 3],
      [1.72, 3],
      [2.1, 0],
    ],
    eyeScale: [
      [0, 1],
      [0.58, 1],
      [0.64, 0.55],
      [0.72, 1],
      [1.18, 1],
      [1.24, 0.65],
      [1.32, 1],
    ],
  },
  crashed: {
    roll: [
      [0, 0],
      [0.24, -9],
      [0.47, 10],
      [0.72, -5],
      [1.05, 0],
    ],
    bob: [
      [0, 0],
      [0.24, -5],
      [0.47, 7],
      [0.72, 12],
      [1.55, 4],
      [2.25, 0],
    ],
    eyeScale: [
      [0, 1],
      [0.35, 0.55],
      [0.65, 0.85],
      [1.3, 1],
    ],
    pitch: [
      [0, 0],
      [0.7, 12],
      [2.25, 0],
    ],
    alert: [
      [0, 0],
      [0.22, 0],
      [0.48, 1],
      [1.32, 1],
      [1.75, 0],
      [2.7, 0],
    ],
  },
  smile: {},
  laugh: {},
};

export function expressionMotion(
  emotion: SphereEmotion,
  elapsed: number,
): ExpressionMotion {
  if (!Number.isFinite(elapsed) || elapsed >= seconds)
    return emotion === "raise" ? { ...neutral, raiseAmount: 0 } : neutral;
  const score = scores[emotion];
  const result = { ...neutral };
  for (const key of Object.keys(result) as (keyof ExpressionMotion)[]) {
    const value = sample(Math.max(0, elapsed), score[key]);
    if (value !== undefined) result[key] = value;
  }
  return result;
}
