import { useState } from "react";
import { EditionSwitcher } from "./EditionSwitcher";
import { SkullOrb } from "../../package/src/SkullOrb";
import {
  sphereLabels,
  type SphereEmotion,
} from "../../package/src/sphere/geometry";
import { skullEmotions } from "../../package/src/sphere/skull";

export function PortraitLab() {
  const [emotion, setEmotion] = useState<SphereEmotion>("idle");
  const [follow, setFollow] = useState(true);
  const [shading, setShading] = useState(true);
  const [reduced, setReduced] = useState(
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  const [yaw, setYaw] = useState(0);
  const [pitch, setPitch] = useState(0);
  const [playKey, setPlayKey] = useState(0);
  const labelFor = (name: SphereEmotion) =>
    name === "curious" ? "无语摊手" : sphereLabels[name];

  return (
    <div className="sp-app">
      <header className="sp-header">
        <a className="sp-brand" href="/portrait">
          <span className="sp-brand-face">••</span> Emotion Orb
        </a>
        <EditionSwitcher active="portrait" />
      </header>
      <main className="sp-main">
        <div className="sp-title">
          <div>
            <h1>角色造型。</h1>
            <p>让同一副面罩和头罩演出不同表情。</p>
          </div>
          <span>独立 SVG 实验页</span>
        </div>
        <section className="sp-workspace" aria-label="骷髅角色造型预览">
          <div className="sp-stage sp-stage-portrait">
            <div className="sp-stage-top">
              <span>{labelFor(emotion)} · 角色造型</span>
              <button
                onClick={() => {
                  setYaw(0);
                  setPitch(0);
                  setFollow(true);
                  setPlayKey((value) => value + 1);
                }}
              >
                重置视角
              </button>
            </div>
            <div
              className="sp-character"
              role="button"
              tabIndex={0}
              aria-label="重播角色动作"
              onClick={() => setPlayKey((value) => value + 1)}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  setPlayKey((value) => value + 1);
                }
              }}
            >
              <SkullOrb
                form="character"
                emotion={emotion}
                size="100%"
                playKey={playKey}
                followPointer={follow}
                shading={shading}
                yaw={follow ? undefined : yaw}
                pitch={follow ? undefined : pitch}
                reducedMotion={reduced}
              />
            </div>
            <p className="sp-hint">
              {reduced
                ? "静态预览"
                : follow
                  ? "移动鼠标观察转头，点击角色重播动作"
                  : "拖动角度，检查不同视角的轮廓"}
            </p>
          </div>
          <aside className="sp-controls">
            <h2>选择表情</h2>
            <div className="sp-emotions sp-portrait-emotions">
              {skullEmotions.map((name) => (
                <button
                  key={name}
                  aria-pressed={emotion === name}
                  onClick={() => {
                    setEmotion(name);
                    setPlayKey((value) => value + 1);
                  }}
                >
                  <SkullOrb
                    form="character"
                    emotion={name}
                    size={76}
                    followPointer={false}
                    reducedMotion
                    decorative
                    shading={shading}
                  />
                  <span>{labelFor(name)}</span>
                </button>
              ))}
            </div>
            <p className="sp-portrait-note">
              点击表情播放完整动作；点击大图可重播当前动作。
            </p>
            <div className="sp-options">
              {[
                {
                  label: "鼠标跟随",
                  hint: "转动头部观察透视",
                  value: follow,
                  set: setFollow,
                },
                {
                  label: "面罩明暗",
                  hint: "显示轻微的立体渐变",
                  value: shading,
                  set: setShading,
                },
                {
                  label: "减少动态",
                  hint: "静态检查造型",
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
                    onChange={(event) => setYaw(+event.target.value)}
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
                    onChange={(event) => setPitch(+event.target.value)}
                  />
                </label>
              </div>
            )}
          </aside>
        </section>
        <footer className="sp-footer">
          <span>骷髅小球造型在“骷髅小球”页面。</span>
          <span>角色造型沿用同一套面罩表情与动作。</span>
        </footer>
      </main>
    </div>
  );
}
