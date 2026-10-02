import { useState } from "react";
import { EditionSwitcher } from "../../../skull-orb/demo/src/EditionSwitcher";
import { SunCreature } from "../../package/src/SunCreature";
import {
  sunCreatureEmotions,
  sunCreatureLabels,
  type SunCreatureEmotion,
} from "../../package/src/expressions";

export function SunCreatureLab() {
  const [emotion, setEmotion] = useState<SunCreatureEmotion>("idle");
  const [follow, setFollow] = useState(true);
  const [reduced, setReduced] = useState(
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );

  return (
    <div className="sc-app">
      <header className="sp-header sc-header">
        <a className="sp-brand" href="/sun-creature">
          <span className="sc-brand-sun" aria-hidden="true">✦</span>
          Emotion Orb
        </a>
        <EditionSwitcher active="sun" />
      </header>
      <main className="sc-main">
        <div className="sc-title">
          <div>
            <h1>太阳，正在看你。</h1>
            <p>头部随鼠标转向，瞳孔会继续追着你看。</p>
          </div>
          <span>独立 React 组件</span>
        </div>

        <section className="sc-workspace" aria-label="太阳怪兽组件预览">
          <div className="sc-stage">
            <div className="sc-stage-top">
              <span><i className="sc-status-dot" />{sunCreatureLabels[emotion]}</span>
              <button
                onClick={() => {
                  setEmotion("idle");
                  setFollow(true);
                  setReduced(false);
                }}
              >
                重置
              </button>
            </div>
            <div className="sc-character">
              <SunCreature
                emotion={emotion}
                size="100%"
                followPointer={follow}
                reducedMotion={reduced}
              />
            </div>
            <p className="sc-hint">
              {reduced
                ? "减少动态已开启"
                : follow
                  ? "在角色范围内移动鼠标，观察转头和眼球追视"
                  : "开启鼠标跟随，试试让它看向你"}
            </p>
          </div>

          <aside className="sc-controls">
            <h2>它现在的心情</h2>
            <div className="sc-emotions">
              {sunCreatureEmotions.map((name) => (
                <button
                  key={name}
                  aria-pressed={emotion === name}
                  onClick={() => setEmotion(name)}
                >
                  <SunCreature
                    emotion={name}
                    size={62}
                    followPointer={false}
                    reducedMotion
                    decorative
                  />
                  <span>{sunCreatureLabels[name]}</span>
                </button>
              ))}
            </div>

            <div className="sc-options">
              {[
                {
                  label: "鼠标跟随",
                  hint: "头部转向，瞳孔单独追视",
                  value: follow,
                  set: setFollow,
                },
                {
                  label: "减少动态",
                  hint: "停用浮动和指针转向",
                  value: reduced,
                  set: setReduced,
                },
              ].map((option) => (
                <button
                  className="sc-switch-row"
                  key={option.label}
                  role="switch"
                  aria-checked={option.value}
                  onClick={() => option.set(!option.value)}
                >
                  <span>
                    <strong>{option.label}</strong>
                    <small>{option.hint}</small>
                  </span>
                  <i className="sc-switch"><b /></i>
                </button>
              ))}
            </div>
          </aside>
        </section>

        <footer className="sc-footer">
          <div>
            <strong>在你的界面中使用</strong>
            <code>{'<SunCreature emotion="curious" size={280} followPointer />'}</code>
          </div>
          <span>SVG 分层绘制 · React 属性驱动</span>
        </footer>
      </main>
    </div>
  );
}
