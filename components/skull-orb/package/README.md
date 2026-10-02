# @emotion-orb/skull-orb

只包含一名角色的两种造型：圆球骷髅面罩和上半身骷髅角色。两种造型共用 SVG 面罩、鼠标视线、表情过渡、手势和减少动态支持。

## 使用

```tsx
import { SkullOrb } from "@emotion-orb/skull-orb";

<SkullOrb form="orb" emotion="idle" size={160} followPointer />
<SkullOrb form="character" emotion="thinking" size={240} followPointer />
```

表情状态从 `skullEmotions` 导出。`form` 只接受 `orb` 或 `character`；两者始终使用骷髅面罩造型。

在工作区根目录运行 `npm run build` 生成 ESM 和 TypeScript 声明。
