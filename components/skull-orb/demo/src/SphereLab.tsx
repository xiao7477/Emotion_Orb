import { useEffect, useState } from "react";
import { EditionSwitcher } from "./EditionSwitcher";
import { SkullOrb } from "../../package/src/SkullOrb";
import {
  sphereLabels,
  type SphereEmotion,
} from "../../package/src/sphere/geometry";

import { skullEmotions } from "../../package/src/sphere/skull";

export function SphereLab() {
  const [emotion, setEmotion] = useState<SphereEmotion>("idle");
  const [playKey, setPlayKey] = useState(0);
  const [follow, setFollow] = useState(true),
    [shading, setShading] = useState(true),
    [auto, setAuto] = useState(false);
  const [yaw, setYaw] = useState(0),
    [pitch, setPitch] = useState(0);
  const [reduced, setReduced] = useState(
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  const emotions: readonly SphereEmotion[] = skullEmotions;
  const labelFor = (e: SphereEmotion) =>
    e === "curious" ? "无语摊手" : sphereLabels[e];
  useEffect(() => {
    if (!auto || reduced) return;
    const timer = window.setInterval(
      () =>
        setEmotion(
          (e) => emotions[(emotions.indexOf(e) + 1) % emotions.length],
        ),
      3200,
    );
    return () => clearInterval(timer);
  }, [auto, reduced]);
  return (
    <div className="sp-app">
      <header className="sp-header">
        <a className="sp-brand" href="/sphere">
          <span className="sp-brand-face">••</span> Emotion Orb
        </a>
        <EditionSwitcher active="sphere" />
      </header>
      <main className="sp-main">
        <div className="sp-title">
          <div>
            <h1>一点表情。</h1>
            <p>一颗戴着骷髅面罩、会看向你的球。</p>
          </div>
          <span>纯 SVG 实验版</span>
        </div>
        <section className="sp-workspace" aria-label="球体表情预览">
          <div className="sp-stage">
            <div className="sp-stage-top">
              <span>{labelFor(emotion)}</span>
              <button
                onClick={() => {
                  setEmotion("idle");
                  setYaw(0);
                  setPitch(0);
                  setFollow(true);
                  setAuto(false);
                  setPlayKey((n) => n + 1);
                }}
              >
                重置
              </button>
            </div>
            <div
              className="sp-character"
              role="button"
              tabIndex={0}
              aria-label="重播当前表情动作"
              onClick={() => setPlayKey((n) => n + 1)}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  setPlayKey((n) => n + 1);
                }
              }}
            >
              <SkullOrb
                form="orb"
                size="100%"
                emotion={emotion}
                playKey={playKey}
                followPointer={follow}
                shading={shading}
                yaw={follow ? undefined : yaw}
                pitch={follow ? undefined : pitch}
                reducedMotion={reduced}
              />
              <div className="sp-ground" />
            </div>
            <p className="sp-hint">
              {reduced
                ? "静态预览"
                : follow
                  ? "点击角色重播动作，移动鼠标观察转头"
                  : "拖动右侧角度，观察球面透视"}
            </p>
          </div>
          <aside className="sp-controls">
            <h2>让它换个表情</h2>
            <div className="sp-emotions" data-count={emotions.length}>
              {emotions.map((e) => (
                <button
                  key={e}
                  aria-pressed={emotion === e}
                  onClick={() => {
                    setEmotion(e);
                    setPlayKey((n) => n + 1);
                    setAuto(false);
                  }}
                >
                  <SkullOrb
                    form="orb"
                    size={66}
                    emotion={e}
                    followPointer={false}
                    reducedMotion
                    decorative
                    shading={shading}
                  />
                  <span>{labelFor(e)}</span>
                </button>
              ))}
            </div>
            <div className="sp-options">
              {[
                {
                  label: "鼠标跟随",
                  hint: "五官随球面转动",
                  value: follow,
                  set: setFollow,
                },
                {
                  label: "微渐变",
                  hint: "保留轻微的球体明暗",
                  value: shading,
                  set: setShading,
                },
                {
                  label: "自动演示",
                  hint: `连续变化 ${emotions.length} 种表情`,
                  value: auto,
                  set: setAuto,
                },
                {
                  label: "减少动态",
                  hint: "静态显示当前表情",
                  value: reduced,
                  set: setReduced,
                },
              ].map((option) => (
                <button
                  className="sp-switch-row"
                  key={option.label}
                  role="switch"
                  aria-checked={option.value}
                  onClick={() => option.set(!option.value)}
                >
                  <span>
                    <strong>{option.label}</strong>
                    <small>{option.hint}</small>
                  </span>
                  <i className="sp-switch">
                    <b />
                  </i>
                </button>
              ))}
            </div>
            {!follow && (
              <div className="sp-angles">
                <label>
                  左右 <output>{yaw}°</output>
                  <input
                    aria-label="左右角度"
                    type="range"
                    min="-65"
                    max="65"
                    value={yaw}
                    onChange={(e) => setYaw(+e.target.value)}
                  />
                </label>
                <label>
                  上下 <output>{pitch}°</output>
                  <input
                    aria-label="上下角度"
                    type="range"
                    min="-40"
                    max="40"
                    value={pitch}
                    onChange={(e) => setPitch(+e.target.value)}
                  />
                </label>
              </div>
            )}
          </aside>
        </section>
        <footer className="sp-footer">
          <span>
            立体面罩与表情动作，可用于 Agent 状态展示。
          </span>
          <span>点击表情或角色，播放完整动作。</span>
        </footer>
      </main>
    </div>
  );
}
