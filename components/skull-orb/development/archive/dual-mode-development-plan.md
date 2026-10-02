# Dual-Mode Emotion Orb 独立项目开发计划
## 极简 Bot Orb × 3D Emoji 情绪态 × 可复用组件

> **项目定位**：先作为完全独立的实验项目开发和验证，不接入 AIGC-Workbench。  
> 验证通过后，再抽出稳定的 React 组件 / Runtime，供 AIGC-Workbench 画布、Agent UI 或其他项目复用。
>
> **核心原则**：不要从零造轮子。Codex 在正式开发前必须先研究、运行、拆解本文列出的现成项目和官方资源，能复用的复用，不能直接复用的只借鉴架构、交互和动画方法。

---

# 1. 最终目标

开发一个具有“同一角色、两种表现层级”的动态情绪角色。

平时表现为：

- 极简
- 克制
- 有 Bot / AI 感
- 主要依靠眼睛、轻微形变、呼吸和鼠标注视表达状态
- 不抢 UI 注意力

关键时刻表现为：

- 更接近动态 Emoji
- Soft 3D / Jelly / Glass 等立体质感增强
- 嘴巴、眉毛、腮红、汗滴、泪滴等细节按需要显现
- 动作更加明确
- 但仍然必须让用户感觉它是“同一个角色”

目标不是：

```text
Bot 图标 -> 突然换成一个普通黄色 Emoji
```

而是：

```text
Calm Bot
    ↓
Awaken
    ↓
Expressive Emoji
    ↓
Awaken
    ↓
Calm Bot
```

整个变化必须是连续的“情绪显形 / 情绪释放”，而不是换角色。

---

# 2. 独立项目原则

第一阶段严禁直接依赖 AIGC-Workbench。

项目只负责：

1. 角色渲染
2. 表情系统
3. 状态切换
4. 鼠标 / Pointer 交互
5. 动画
6. 材质表现
7. Demo / 调试实验台
8. 对外 API
9. 性能与 Reduce Motion
10. 可复用打包

不要在第一阶段加入：

- 画布节点
- Agent Runtime
- 项目资产系统
- MCP
- 画布消息协议
- AIGC-Workbench 特有 store
- 业务数据库
- 业务 UI

后续画布只应该像使用普通 UI Component 一样使用它。

---

# 3. 先研究再开发：必须检查的网上资源

Codex 开工后的第一项任务不是写正式组件，而是建立：

```text
/docs/reference-audit.md
```

逐项运行 / 阅读 / 对比下面资源，记录：

- 哪些能力可直接复用
- 哪些代码可借鉴
- 哪些视觉不能复制
- 哪些授权有限制
- 哪种实现最适合本项目
- 最终选择理由

---

## 3.1 Emotion Ball — 非常值得研究

GitHub：

https://github.com/sam70361/emotion-ball

重点研究：

- 32 种状态表情
- `emotionId` 配置驱动
- SVG 实时驱动
- 鼠标注视
- 帧率无关指数平滑
- 眼神微漂移
- 眼环 / 表情池
- 弹簧插值
- 球面投影
- 自旋
- 粒子 / 撒花
- 生命周期状态
- Agent 工作状态

它和本项目要做的“Bot 表情引擎”非常接近，不要重新发明这些基础概念。

### 但必须注意许可

Emotion Ball 的球形角色视觉形象仅允许学习研究，不能直接拿来作为未来产品角色。

其表情引擎和数据也不是普通 MIT 开源：

- 非商业研究可使用
- 商业使用需要授权
- 球形角色视觉本身明确不提供商业授权

因此：

### 可以做
- 运行研究
- 拆解状态系统
- 学习 gaze 算法
- 学习弹簧动画
- 学习配置驱动设计
- 学习 Agent → `emotionId` 的接口思路

### 不要做
- 直接复制它的角色外形
- 直接复制它的完整表情数据进入最终组件
- 将其受限视觉作为正式产品角色

我们的最终角色几何、表情参数和材质必须自己设计。

---

# 3.2 Grok Bot Orb Expo Recreation

GitHub：

https://github.com/ngocdevv/grok-bot-emoji

这是一个非常直接的 Grok Bot Orb 技术复刻。

重点研究：

- React Native Skia
- Reanimated
- SVG / Path Morph
- expression picker
- 受控 / 非受控组件 API
- Web 与 Native 的差异处理
- CanvasKit 加载
- `Reduce Motion`
- 眼睛 Path Morph
- Orb trail

仓库本身是 MIT License。

但它的部分几何、动画节奏来自对 x.ai 前端 SVG 的分析，因此本项目不要把 Grok 的具体轮廓、路径数据、品牌识别元素直接搬入正式角色。

### 用法

它主要作为：

> **“怎么组织 Orb 动画组件”的代码架构参考**

而不是作为：

> “直接复制一个 Grok Bot”。

---

# 3.3 Morph Bot / Grokbot Animation Lab

GitHub：

https://github.com/iduu/grokbot-animation

这是本项目非常重要的技术参考。

重点研究：

- 39 个状态
- 18 种身体轮廓
- 25 个表情环
- 14 种 Morph
- 状态 Timeline
- Web Component 封装
- Pointer gaze
- Pointer speed
- 快速掠过触发 curiosity
- Press surprise
- 面部姿态
- 材质 preset
- 柔焦多光团渐变
- 玻璃材质
- Aurora Orb WebGL 实验
- 2 点惯性 cursor wake
- 离屏暂停
- 生命周期清理
- 减少 React 依赖的 Runtime 设计

尤其研究：

```text
pointer signal
  ↓
gaze
face pose
press
cursor speed
curiosity
material reaction
```

也就是说，鼠标输入不要让每个动画模块自己监听，而是应该产生一个统一的 `PointerSignal`。

### 授权注意

该项目明确说明其中存在从公开 xAI 前端整理得到的参考几何 / 行为数据，第三方参考素材没有因此获得开源许可。

所以：

- **可研究其架构**
- **可学习状态组织方式**
- **可学习 Pointer Signal**
- **可学习材质系统结构**
- **不要直接复制 reference-derived geometry**

最终必须拥有我们自己的角色几何。

---

# 3.4 Google Noto Animated Emoji

官方：

https://googlefonts.github.io/noto-emoji-files/?view=docs

GitHub：

https://github.com/googlefonts/noto-emoji

这是最值得直接拿来做 **Emoji 动作研究和 Demo 对照** 的资源。

官方目前提供：

### 2D 动画
- SVG
- `lottie.json`
- WebP
- GIF

### 3D
- PNG

官方文档明确说明：

> Animated Noto Emoji 采用 CC BY 4.0。

所以可以在满足署名要求的情况下用于 App / 商业等场景。

### 本项目用途

不要直接让最终角色变成 Google Emoji。

而是建立：

```text
Reference Motion Gallery
```

挑选典型表情，例如：

- happy
- laugh
- surprised
- sad
- thinking
- sleepy
- angry
- relieved
- rolling-eyes

研究：

- 眼睛先动还是嘴先动
- squash/stretch 幅度
- 表情进入速度
- 表情 Hold 时间
- 回到 rest 的节奏
- 辅助元素何时出现
- 动态 Emoji 怎么避免僵硬

Noto 的 Lottie 还有一个优势：

动态属性可由程序修改，非常适合用来研究：

- opacity
- scale
- rotation
- gradient
- stroke

---

# 3.5 Microsoft Fluent Emoji Animated

GitHub：

https://github.com/microsoft/fluentui-emoji-animated

特点：

- 官方 Microsoft Fluent Emoji 动态资源
- Animated PNG
- 256 × 256
- 整体约数 GB 级，不要整库拉进正式项目

仓库 LICENSE 为 MIT。

### 本项目用途

主要研究：

- Soft 3D Emoji 质感
- 体积光
- 高光
- 面部元素厚度
- 开心 / 惊讶 / 哭 / 生气等情绪的夸张程度
- 如何让 3D Emoji 看起来软而不是塑料玩具

第一阶段只挑少量典型表情作为视觉对照即可。

**不要把整个 Fluent Emoji 库加入项目。**

---

# 3.6 Rive React

GitHub：

https://github.com/rive-app/rive-react

官方 Runtime：

https://rive.app/docs/runtimes/react/react

Rive React Runtime 是 MIT。

它原生支持：

- State Machines
- Inputs
- Events
- Mouse Tracking
- React Runtime
- WASM Renderer
- Interactive animation

官方仓库本身就提供 Mouse Tracking 示例。

### 本项目策略

Rive **可以研究和做备选 Prototype**，但 V1 不建议强制依赖 Rive Editor。

原因：

- Codex 对纯代码 SVG / React 修改更直接
- 如果所有核心表情必须回 Rive Editor 改，会增加 AI 自动开发成本
- 后续我们的角色可能需要程序化材质和 Pointer Signal

因此：

### 建议
做一个小型 Rive Spike：

```text
/spikes/rive-pointer-demo
```

验证：

- state machine
- mouse tracking
- expression transition

如果明显优于纯 SVG Runtime，再考虑引入。

否则 Rive 保持为参考方案。

---

# 3.7 Motion for React

官网：

https://motion.dev/

GitHub：

https://github.com/motiondivision/motion

MIT。

推荐 V1 直接使用。

重点能力：

- `useMotionValue`
- `useSpring`
- transform
- SVG attribute animation
- gesture
- transition

鼠标输入不要直接写死：

```ts
eyeX = mouseX * 0.1
```

建议：

```text
Pointer raw value
      ↓
normalize
      ↓
clamp
      ↓
MotionValue
      ↓
Spring
      ↓
Eyes / Face / Body / Highlight
```

这样角色会有生命感，而不是机械跟随。

---

# 3.8 dotLottie Web

GitHub：

https://github.com/LottieFiles/dotlottie-web

MIT。

用途：

- 在 Reference Gallery 中加载 Noto Lottie
- 做动态 Emoji 对照
- 如果后面部分特效适合 Lottie，也可以作为 asset renderer

不要让 Lottie 成为整个角色 Runtime 的唯一核心。

---

# 3.9 XState

GitHub：

https://github.com/statelyai/xstate

MIT。

本项目可以选择性采用。

如果状态开始出现：

```text
idle
thinking
success
error
+
calm
awaken
expressive
+
hover
pointerNear
pressed
fastPass
+
temporary morph
+
auto restore
```

继续用大量 `useState + setTimeout` 会很快失控。

因此建议在状态开始复杂时采用 XState，至少明确：

- persistent state
- temporary reaction
- priority
- interrupt
- restore
- timeout

但不要为了“架构漂亮”一开始写巨大状态机。

---

# 3.10 Three.js / React Three Fiber

Three.js：

https://github.com/mrdoob/three.js

React Three Fiber：

https://github.com/pmndrs/react-three-fiber

两者均是 MIT。

### 不作为第一阶段默认方案

只有在 SVG / CSS 无法达到：

- Jelly
- Glass
- 真实折射
- 液态扰动
- 体积感

时，再开启：

```text
/spikes/webgl-material
```

进行验证。

不要第一天就把整个项目做成 WebGL。

---

# 4. 推荐技术路线

## V1 主路线

```text
React
+
TypeScript
+
Vite
+
SVG
+
Motion
```

可选：

```text
XState
```

Reference Player：

```text
dotLottie
```

后续高级材质：

```text
Three.js / React Three Fiber
```

备选互动动画 Runtime：

```text
Rive
```

---

# 5. 项目目录建议

```text
dual-mode-emotion-orb/
│
├── apps/
│   └── lab/
│       ├── src/
│       └── ...
│
├── packages/
│   └── emotion-orb/
│       ├── src/
│       │   ├── core/
│       │   ├── expressions/
│       │   ├── interaction/
│       │   ├── materials/
│       │   ├── motion/
│       │   ├── renderers/
│       │   ├── effects/
│       │   └── index.ts
│       └── package.json
│
├── references/
│   ├── README.md
│   └── selected-assets/
│
├── spikes/
│   ├── rive-pointer-demo/
│   └── webgl-material/
│
├── docs/
│   ├── reference-audit.md
│   ├── expression-system.md
│   ├── material-system.md
│   ├── pointer-system.md
│   ├── api.md
│   └── integration.md
│
└── README.md
```

---

# 6. 核心模型：不要把 Emotion 和 Material 写死在一起

必须拆成：

```text
Character
├── Geometry
├── Expression
├── Motion
├── Material
├── Effects
└── Interaction
```

而不是：

```text
happy3d.svg
happyFlat.svg
sad3d.svg
sadFlat.svg
...
```

否则两种模式永远无法自然转换。

---

# 7. 三层表现状态

不是简单两档。

---

## Stage 1 — Calm

默认 Bot 状态。

视觉：

- 极简
- 低高光
- 低饱和
- 嘴巴隐藏 / 极弱
- 主要靠眼睛
- 轻呼吸
- 微漂浮

适用于：

- idle
- waiting
- listening
- observing

---

## Stage 2 — Awaken

Bot 与 Emoji 之间的桥。

视觉：

- 球体体积感增强
- 高光出现
- 眼睛更有神
- 嘴巴允许显现
- 材质轻微增强
- 动作幅度提升

触发：

- hover
- pointer near
- curious
- thinking
- preparing
- processing

---

## Stage 3 — Expressive

完整情绪释放。

视觉：

- Soft 3D / Jelly / Glass
- 嘴巴完整
- 眉毛可显现
- 腮红 / 汗滴 / 泪滴等辅助元素
- 明确的 squash/stretch
- 更明显的弹跳 / 摇晃 / 表情动作

适用于：

- happy
- success
- surprised
- excited
- sad
- error
- angry
- love

---

# 8. 双模式统一的硬性要求

以下项目必须始终保持一致。

## 8.1 外轮廓一致

不能：

```text
Calm = Orb
Expressive = 传统黄色圆 Emoji
```

需要：

```text
同一个基础 Orb
↓
体积、光泽、表情层逐步增加
```

---

## 8.2 Facial Rig 一致

定义固定 Facial Anchors：

```ts
type FaceRig = {
  leftEyeAnchor: Vec2
  rightEyeAnchor: Vec2
  mouthAnchor: Vec2
  browLeftAnchor: Vec2
  browRightAnchor: Vec2
}
```

所有表情都从相同 Rig 出发。

---

## 8.3 动作语言一致

例如：

### happy
Calm：

```text
弯眼 + 轻弹
```

Expressive：

```text
弯眼 + 嘴巴 + 腮红 + 更明显弹性
```

动作语义不变，只提高 intensity。

---

## 8.4 色彩体系一致

不要：

```text
灰白 Bot -> 黄色 Emoji
```

建议：

```text
Calm
低饱和珍珠 / 冰蓝 / 淡紫

↓ awaken

同色系亮度 + 饱和度提高

↓ expressive

同色系 Soft 3D / Jelly / Glass
```

---

# 9. Expression 数据结构

建议配置驱动：

```ts
type EmotionName =
  | "idle"
  | "curious"
  | "thinking"
  | "happy"
  | "success"
  | "surprised"
  | "sad"
  | "error"

type ExpressionDefinition = {
  id: EmotionName

  eyes: {
    shape: string
    openness: number
    gazeBias?: Vec2
    blinkRate?: number
  }

  mouth?: {
    shape: string
    openness?: number
  }

  brows?: {
    left: number
    right: number
  }

  body: {
    scaleX?: number
    scaleY?: number
    tilt?: number
  }

  effects?: Array<
    "blush" |
    "tear" |
    "sweat" |
    "sparkle" |
    "question" |
    "confetti"
  >

  motion: {
    preset: string
    intensity: number
  }

  preferredStage: "calm" | "awaken" | "expressive"
}
```

注意：

**Expression 不负责具体颜色 / 玻璃参数。**

---

# 10. Material 数据结构

```ts
type MaterialPreset = {
  id: string

  surface:
    | "flat"
    | "soft"
    | "jelly"
    | "glass"

  baseColor: string
  secondaryColor?: string

  highlight: number
  shadow: number
  translucency: number
  saturation: number
  glow: number

  blur?: number
  distortion?: number
}
```

第一版至少做：

1. `minimal`
2. `soft-3d`
3. `jelly-lite`

Glass 可以作为第二阶段。

---

# 11. 核心技术：Material Blend

两种视觉不能切换图片。

需要有连续参数：

```ts
visualIntensity: 0 → 1
```

例如：

```text
0.00
Minimal Bot

0.25
轻微高光

0.50
Awaken

0.75
嘴部 / 表情细节明显

1.00
Expressive Emoji
```

由同一个参数控制：

- saturation
- highlight
- glow
- shadow
- mouth opacity
- brow opacity
- blush opacity
- material depth
- squash amplitude
- particle intensity

这会成为整个项目最核心的统一机制。

---

# 12. Pointer Signal 系统

借鉴 Emotion Ball、Morph Bot、Rive Mouse Tracking 的思路。

全项目只建立一个 Pointer Engine。

```ts
type PointerSignal = {
  x: number
  y: number

  normalizedX: number
  normalizedY: number

  distance: number

  velocityX: number
  velocityY: number
  speed: number

  isInside: boolean
  isNear: boolean
  isHovering: boolean
  isPressed: boolean
}
```

所有角色响应共用它。

---

# 13. 第一版 Pointer 交互

必须实现：

## 13.1 Gaze

眼睛看向鼠标。

要求：

- clamp
- spring
- 非 1:1 跟随
- 鼠标离开缓慢回中
- 保留微小 idle gaze noise

---

## 13.2 Face Follow

脸部整体仅做非常小的：

- tilt
- translate
- rotation

不能像 UI 元素拖着鼠标跑。

---

## 13.3 Pointer Near

鼠标进入附近范围：

```text
Calm -> Awaken
```

角色开始注意用户。

---

## 13.4 Hover

进入角色区域：

- 视觉 intensity 小幅提高
- 角色表现 curious
- 可以轻微放大

---

## 13.5 Press

鼠标按下：

- squash

松开：

- spring back
- 可触发 surprised / happy 的短 reaction

---

## 13.6 Fast Pass

根据 pointer speed 判断快速掠过。

短暂：

```text
curious / surprised
```

然后自动恢复。

这个功能直接参考 Morph Bot 的行为设计，但算法自行实现。

---

# 14. 第一版表情

只做 8 个。

```text
idle
curious
thinking
happy
success
surprised
sad
error
```

不要第一版做 30+。

---

# 15. 表情触发优先级

必须定义 Priority。

建议：

```text
1. error / explicit external state
2. success / explicit reaction
3. pressed reaction
4. fast-pass reaction
5. hover / curious
6. pointer-near
7. idle
```

短暂 reaction 完成后恢复之前的 Persistent State。

例如：

```text
thinking
  ↓
mouse click
  ↓
surprised 450ms
  ↓
thinking
```

而不是直接丢失 thinking 状态。

---

# 16. Demo Lab 必须具备的控制面板

独立项目不是只展示一颗球。

需要做成实验台。

左侧 / 右侧提供：

## Expression
- idle
- curious
- thinking
- happy
- success
- surprised
- sad
- error

## Stage
- Calm
- Awaken
- Expressive
- Auto

## Material
- Minimal
- Soft 3D
- Jelly Lite
- 自定义颜色

## Interaction
- Gaze on/off
- Hover on/off
- Press on/off
- Fast Pass on/off

## Motion
- intensity
- spring stiffness
- damping
- idle amount

## Debug
- FPS
- pointer coordinates
- pointer speed
- current state
- temporary reaction
- visualIntensity
- current material

---

# 17. Reference Gallery

Lab 内新增独立页面：

```text
/reference
```

不要把参考内容混在正式角色里。

建议对照：

### Google Noto
挑选约 8–12 个 Animated Emoji。

### Microsoft Fluent
挑选约 8–12 个 Soft 3D 表情作为视觉参考。

### 自己的 Orb
显示相同语义状态。

形成：

```text
Happy
Noto | Fluent | Our Calm | Our Expressive

Surprised
Noto | Fluent | Our Calm | Our Expressive
```

目的不是复制，而是不断校准：

- 动作是否太僵
- 情绪是否读得出来
- 3D 是否太俗
- Bot -> Emoji 是否断层

---

# 18. V1 渲染方式

优先：

```text
SVG
```

原因：

- Facial Rig 最容易控制
- Path Morph 容易
- DOM Debug 方便
- Codex 易修改
- 性能足够
- 后续可以嵌进 React Component

材质先通过：

- SVG gradient
- radial gradient
- blur
- filter
- highlight layers
- mask
- opacity
- blend mode

尝试完成“Soft 3D”。

如果 V1 已经足够好：

**不要为了技术炫技强上 WebGL。**

---

# 19. WebGL Spike 的进入条件

只有以下情况才启用：

```text
spikes/webgl-material
```

条件：

1. SVG Jelly 明显不够自然
2. 玻璃折射需要真实动态
3. 鼠标扰动希望影响球体内部
4. 高光需要真正跟随法线
5. SVG filter 性能出现问题

此时使用：

```text
Three.js
+
React Three Fiber
```

先做一个独立 Material Spike。

不要立即重写 Facial Rig。

最理想状态：

```text
Expression Engine
       ↓
Render Adapter
   ↙       ↘
 SVG      WebGL
```

即表情数据和交互逻辑不绑定 Renderer。

---

# 20. Rive Spike 的进入条件

Rive 用于验证：

- State Machine
- Mouse Tracking
- Designer-friendly workflow
- 是否能够更容易做 Facial Rig

只有当它明显降低维护成本，才引入正式 Runtime。

否则保持 SVG + Motion。

---

# 21. 对外 React API

最终组件目标：

```tsx
<EmotionOrb
  emotion="thinking"
  stage="auto"
  material="soft-3d"
  interaction
/>
```

推荐 API：

```ts
type EmotionOrbProps = {
  emotion?: EmotionName

  stage?:
    | "calm"
    | "awaken"
    | "expressive"
    | "auto"

  material?: MaterialName

  color?: string

  size?: number | string

  interaction?: boolean

  gaze?: boolean

  reducedMotion?: boolean

  intensity?: number

  onEmotionChange?: (
    emotion: EmotionName
  ) => void
}
```

---

# 22. Imperative API

后续 Agent 很适合直接触发一次性 reaction。

需要支持：

```ts
orb.setEmotion("thinking")

orb.react("surprised", {
  duration: 600
})

orb.setStage("expressive")

orb.reset()

orb.setPointerEnabled(false)
```

---

# 23. AI / Agent 接口先预留，但不接 Agent

可以预留：

```ts
type EmotionCommand = {
  emotion: EmotionName
  intensity?: number
  duration?: number
}
```

例如：

```json
{
  "emotion": "success",
  "intensity": 0.9,
  "duration": 1500
}
```

独立项目只接受命令。

**不要让这个项目自己调用 LLM。**

---

# 24. Reduced Motion

必须从第一版支持：

```css
prefers-reduced-motion
```

至少提供：

- disable floating
- disable fast squash
- disable particle burst
- slow gaze
- simple fade transition

参考 Grok Bot Expo recreation 对 Reduce Motion 的处理。

---

# 25. 性能要求

普通页面只有一个 Orb 时：

目标：

```text
60 FPS
```

同时展示多个实例时：

- 不得每个实例单独挂全局 pointer listener
- Pointer Engine 尽可能共享
- 离屏时暂停
- document hidden 时暂停
- `requestAnimationFrame` 统一调度

后续 AIGC-Workbench 如果出现多个 Agent / 卡片，这一点很重要。

---

# 26. 第一阶段开发流程

## Phase 0 — Reference Audit

Codex 必须先：

1. 阅读本文所有核心参考
2. 至少实际运行：
   - Emotion Ball
   - grok-bot-emoji
   - Morph Bot
3. 浏览：
   - Noto Animated Emoji
   - Fluent Animated Emoji
   - Rive Mouse Tracking
4. 产出：
   - `docs/reference-audit.md`
5. 确定 V1 最终技术选型

**没有完成 Audit，不进入正式开发。**

---

## Phase 1 — Pointer + Minimal Bot

先完成：

- 基础 Orb
- 自有原创几何
- 两眼
- blink
- idle breathing
- gaze
- face follow
- hover
- press
- fast pass

此阶段不要做 3D Emoji。

验收重点：

> Bot 本身是否已经“活起来”。

---

## Phase 2 — Expression Rig

完成 8 个基础表情。

必须做到：

- 同一个 Rig
- 配置驱动
- 连续 Morph
- 临时 Reaction 可恢复 Persistent State

---

## Phase 3 — Dual Mode

加入：

```text
Calm
Awaken
Expressive
```

实现：

```ts
visualIntensity: 0 → 1
```

重点验证：

> 从极简 Bot 到 Emoji 感增强，是否像同一个角色。

这是整个项目最重要的阶段。

---

## Phase 4 — Soft 3D Material

参考：

- Fluent Emoji
- Noto Emoji motion
- Morph Bot material architecture

先用 SVG 实现：

- gradient
- highlight
- shadow
- soft volume
- jelly-lite

---

## Phase 5 — Emoji Motion Polish

针对：

- happy
- success
- surprised
- sad
- error

研究 Noto / Fluent 的动作节奏。

优化：

- anticipation
- overshoot
- settle
- hold
- recovery

目标不是增加功能，而是提高“表演质量”。

---

## Phase 6 — Optional Spikes

根据 V1 结果决定：

### A
Rive Spike

### B
WebGL / R3F Material Spike

不需要两个都进入正式架构。

---

## Phase 7 — Componentization

视觉与交互满意之后：

抽出：

```text
packages/emotion-orb
```

要求：

- 不依赖 Lab UI
- 不依赖业务 store
- 可独立 npm build
- 有 TypeScript 类型
- 有 README
- 有最小使用示例

---

# 27. 第一版完成标准

必须同时满足以下条件。

## 视觉

- [ ] 默认状态足够简约
- [ ] 有明显 Bot / AI 感
- [ ] Emoji 状态明显更有情绪
- [ ] 不依赖传统黄色 Emoji 才能识别情绪
- [ ] Calm 与 Expressive 明显是同一个角色
- [ ] 转换过程中没有“换皮 / 换角色”感

## 动画

- [ ] gaze 自然
- [ ] blink 自然
- [ ] hover 自然
- [ ] fast pass 可用
- [ ] press 有弹性
- [ ] 表情可以连续 Morph
- [ ] reaction 可恢复原状态

## 材质

- [ ] Minimal
- [ ] Soft 3D
- [ ] Jelly Lite
- [ ] 材质切换可连续 Blend

## 工程

- [ ] React + TS Component
- [ ] 无 AIGC-Workbench 依赖
- [ ] TypeScript 类型完整
- [ ] Reduced Motion
- [ ] 离屏暂停
- [ ] Demo Lab
- [ ] Reference Gallery
- [ ] README
- [ ] API 文档

---

# 28. 暂时不要做的东西

第一版明确不做：

- 30+ 表情
- 完整 Emoji Unicode 库
- 桌宠
- 语音
- TTS
- Agent
- LLM 自动判断情绪
- MCP
- 画布接入
- 复杂粒子系统
- 完整 3D 角色
- 多角色系统
- 角色皮肤商城
- 大量主题

先证明：

> **极简 Bot → 自然 Awakening → 3D Emoji 情绪释放**

这一件事情成立。

---

# 29. 最终可复用边界

验证成功后，AIGC-Workbench 不复制 Lab。

只引入：

```text
@emotion-orb/core
```

或：

```text
@emotion-orb/react
```

画布只负责传入：

```ts
emotion
stage
intensity
theme
```

例如：

```tsx
<EmotionOrb
  emotion={agentEmotion}
  stage="auto"
  intensity={0.8}
/>
```

未来：

```text
Codex Runtime
       ↓
Agent State
       ↓
Emotion Mapper
       ↓
Emotion Orb

Custom Agent Runtime
       ↓
Agent State
       ↓
Emotion Mapper
       ↓
Emotion Orb
```

两个 Runtime 共用同一个视觉组件，不把任何 Agent 实现写进 Emotion Orb 内部。

---

# 30. 给 Codex 的执行要求

请不要把本文仅当成“建议”。

执行时按以下原则：

1. **先研究现成实现，再写代码。**
2. 能合法直接复用的基础库优先复用。
3. 有授权风险的项目只做技术研究，不复制受限视觉资产。
4. Grok 只是交互方向参考，不制作 Grok 克隆。
5. Noto / Fluent 用于 Emoji 动作与材质研究。
6. 我们最终必须形成原创角色几何和统一视觉语言。
7. V1 优先 SVG + Motion。
8. 不要一开始上复杂 WebGL。
9. Rive / WebGL 都先做 Spike，再决定是否进入正式架构。
10. 先把 8 个表情和三阶段转换做精，不追求数量。
11. 所有状态必须数据驱动。
12. Interaction、Expression、Material、Renderer 必须解耦。
13. 不与 AIGC-Workbench 耦合。
14. 独立项目验收后，再抽包给画布复用。
15. 避免在开发中频繁做全量 E2E；阶段性完成核心模块后再做完整回归。

---

# 31. 推荐的第一条执行指令

Codex 拿到本文后，先执行：

```text
先不要实现正式组件。

第一步建立独立项目骨架，并完成 Reference Audit：

1. 检查本文列出的在线项目和官方资源；
2. 实际运行 Emotion Ball、grok-bot-emoji、Morph Bot；
3. 对 Noto Animated Emoji、Fluent Animated Emoji、Rive Mouse Tracking 做技术拆解；
4. 重点提取：
   - 状态模型
   - Pointer / Gaze
   - Spring
   - SVG Morph
   - Material
   - Emoji Motion
   - Component API
   - Reduce Motion
   - License 限制
5. 输出 docs/reference-audit.md；
6. 基于研究结果确认 V1 技术栈；
7. 再开始 Phase 1。

禁止直接复制 Grok 或其他项目的角色视觉；
最终角色几何与视觉需要原创。
```

---

# 32. 参考资源总表

| 资源 | 主要价值 | 使用策略 |
|---|---|---|
| Emotion Ball | AI 表情状态、鼠标 gaze、弹簧、配置驱动 | 深度研究；受限内容不直接进正式产品 |
| grok-bot-emoji | Skia、Path Morph、组件结构、Reduce Motion | 代码架构参考；角色视觉重新设计 |
| Morph Bot | Pointer Signal、Morph、Timeline、材质、Web Component | 深度研究；reference-derived geometry 不复制 |
| Google Noto Animated Emoji | Lottie/SVG 动态 Emoji、动作节奏 | Reference Gallery；CC BY 4.0 条件下可使用 |
| Microsoft Fluent Emoji Animated | Soft 3D Emoji 视觉、动态表情 | 视觉 / 动作参考，少量实验 |
| Rive React | State Machine、Mouse Tracking、互动动画 | 做 Spike，不默认成为硬依赖 |
| Motion | Spring、MotionValue、SVG/React 动画 | V1 推荐直接使用 |
| dotLottie Web | Lottie Runtime | Reference Gallery / 可选局部动画 |
| XState | 状态机 | 状态复杂后引入 |
| Three.js / R3F | Jelly / Glass / WebGL | 只有 SVG 不够时再进入 |

---

## 一句话目标

> **先借鉴现成成熟方案做出一个“活的极简 Bot”，再让同一个角色在关键时刻自然释放出 3D Emoji 的情绪和质感；成功后把这套能力抽成独立组件，供 AIGC-Workbench 复用。**
