# Emotion Orb · 角色组件实验室

当前工作区用于开发和预览可复用的 React 三维角色组件。

## 项目目录

- [`components/skull-orb/`](components/skull-orb/README.md)：骷髅小球与角色造型，两种显示形态共用同一套表情和动作。
- [`components/sun-creature/`](components/sun-creature/README.md)：原创太阳怪兽组件，支持三维鼠标跟随、眼球追视和多种表情。
- [`pets/skull-orb/`](pets/skull-orb/README.md)：Skull Orb 最新淡灰白微弱高光动画图集、九种动作、十六方向与使用说明。
- [`pets/longbeak-gentleman/`](pets/longbeak-gentleman/README.md)：长嘴礼帽先生最终纯侧面动画图集、设计原图、预览与使用说明。

`components/` 是可交互的程序化 React/SVG 组件；`pets/` 是独立的透明 PNG 动画素材，两者不能互相替代。图集的公共布局、校验与无损拆帧工具见 [`pets/README.md`](pets/README.md)。

太阳怪兽以球体为主体，圆锥均匀分布在球面，其中一个圆锥作为鼻子；眼睛与嘴部采用向内凹陷的球面结构。

## 本地开发

```sh
npm install
npm run dev
```

打开 `http://127.0.0.1:5173/` 查看骷髅小球，`/portrait` 查看骷髅角色，或 `/sun-creature` 查看太阳怪兽组件。

## 验证和构建

```sh
npm test
npm run build
npm pack -w @emotion-orb/skull-orb
```
