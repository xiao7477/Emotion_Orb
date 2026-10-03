# 宠物动画素材

这里保存两个最终可用的独立动画素材包：

- [Skull Orb](skull-orb/README.md)：近黑身体、淡灰白微弱边缘高光。
- [长嘴礼帽先生](longbeak-gentleman/README.md)：黑白手绘、长嘴、高礼帽，始终保持侧面。

每个目录包含原始编码的最终透明 PNG 图集、`manifest.json`、代表帧、运动视频、设计参考、注册后行源图和公开验证摘要。图集中的角色像素来自已完成的图像素材；本仓库不包含图像生成模型。`../components/` 的程序化 SVG 组件也不会生成这些图集。

## 布局

两者均为 v2：1536 × 2288，8 列 × 11 行，每格 192 × 208，RGBA 透明背景。下表使用零起始行号；各行剩余格必须保持全透明。

| 行 | 状态 | 有效帧数 |
| --- | --- | --- |
| 0 | idle | 6 |
| 1 | running-right | 8 |
| 2 | running-left | 8 |
| 3 | waving | 4 |
| 4 | jumping | 5 |
| 5 | failed | 8 |
| 6 | waiting | 6 |
| 7 | running | 6 |
| 8 | review | 6 |
| 9 | look-row-9 | 8 |
| 10 | look-row-10 | 8 |

前九行为 57 个动作帧，后两行为 16 个朝向，共 73 个有效格。`running` 是工作/处理任务，`running-left/right` 是左右移动。

方向按屏幕坐标顺时针排列：第 9 行为 0°、22.5°、45°、67.5°、90°、112.5°、135°、157.5°；第 10 行为 180°、202.5°、225°、247.5°、270°、292.5°、315°、337.5°。0°向上，90°向右，180°向下，270°向左；不是角色原地旋转的十六面转台。

## 使用

支持该布局的宠物宿主应读取 `spritesheet.png`。自建播放器按 `manifest.json` 的帧序读取 `(column × 192, row × 208, 192, 208)`，保留整格透明边距，不要逐帧裁紧或自动居中，否则动作会跳位。清单中的时长是预览用毫秒数；宿主可以自行调度状态。

查看各目录中的 PNG/MP4 即可预览。MP4 的背景是演示画布，不是图集背景。PNG 图集必须保留 alpha，不能用截图或视频替换。

## 校验与无损拆帧

需要 Python 3 和 Pillow。工具只裁取、组装已有像素，不绘制或修改角色。

```sh
python -m pip install Pillow
python pets/tools/atlas.py verify pets/skull-orb
python pets/tools/atlas.py verify pets/longbeak-gentleman
python pets/tools/atlas.py extract pets/skull-orb /tmp/skull-frames
python pets/tools/atlas.py assemble pets/skull-orb /tmp/skull-frames /tmp/skull-roundtrip.png
python -m unittest discover -s pets/tools -p 'test_*.py'
```

拆帧再组装保证 RGBA 像素一致；PNG 编码字节可能因压缩器不同而变化。发布用原图的 SHA-256 固定在清单中。`source/registered-rows/` 已保留最终注册后的 11 条行源图，未来修改时应保留其画布和基线。

`validation.json` 是针对精确发布哈希的验证摘要，包含已接受的小幅视觉差异；不代表不存在任何逐像素差异。素材不含账户信息、访问凭据或未采用的试稿。
