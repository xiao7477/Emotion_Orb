# @emotion-orb/sun-creature

一个独立的 React 球形角色组件：球面均匀长出圆锥，一枚朝前的圆锥作为鼻子；凹陷眼窝和嘴巴围绕鼻子分布。支持鼠标转向、瞳孔追视和七种表情。

```tsx
import { SunCreature } from "@emotion-orb/sun-creature";
import "@emotion-orb/sun-creature/style.css";

<SunCreature emotion="curious" size={280} followPointer />
```

`emotion` 可选 `idle`、`happy`、`curious`、`surprised`、`sleepy`、`grumpy`、`sad`；`followPointer` 默认开启。组件会尊重系统减少动态设置，也可以通过 `reducedMotion` 显式控制。

球面坐标、背面裁切和透视投影借鉴工作区 `SkullOrb` 的 SVG 球面模型，细节见 [`../docs/surface-model.md`](../docs/surface-model.md)。
