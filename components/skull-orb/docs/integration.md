# 画布接入

组件仅接收角色形态、表情、尺寸和交互参数，不读取画布数据或 Agent 状态。宿主负责把业务状态映射到 `skullEmotions`，再将结果传入 `emotion`。

```tsx
import { SkullOrb, type SkullOrbForm } from "@emotion-orb/skull-orb";

<SkullOrb form="orb" emotion="thinking" size={96} />
```

在当前工作区运行 `npm run build` 后构建组件，或执行 `npm pack -w @emotion-orb/skull-orb` 生成本地包。
