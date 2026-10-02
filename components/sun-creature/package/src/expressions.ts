export const sunCreatureEmotions = [
  "idle",
  "happy",
  "curious",
  "surprised",
  "sleepy",
  "grumpy",
  "sad",
] as const;

export type SunCreatureEmotion = (typeof sunCreatureEmotions)[number];

export const sunCreatureLabels: Record<SunCreatureEmotion, string> = {
  idle: "开心",
  happy: "大笑",
  curious: "好奇",
  surprised: "惊讶",
  sleepy: "困倦",
  grumpy: "不满",
  sad: "难过",
};
