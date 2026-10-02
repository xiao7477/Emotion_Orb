# Pointer 与生命周期

`motion/scheduler.ts` 按需建立唯一全局 pointermove / pointerdown / pointerup / pointercancel、blur 与 visibilitychange 监听；多个实例共用原始信号和一条帧调度。最后订阅者卸载时取消 RAF 并移除监听。

实例通过自己的 DOMRect 将指针映射到中心坐标，clamp 到 [-1, 1]。速度单位 px/s；停止 100 ms 后归零。距离由角色半径判断 inside / near。视线经过弹簧，投射到很小的面部偏移；不是 1:1 拖拽。

身体按压只在角色圆形命中区触发，捕获指针防止丢失释放；取消、失焦、离屏与关闭交互均清理按压。Space / Enter 提供同等短反应。

IntersectionObserver 取消离屏实例的调度订阅；页面 hidden 暂停全局帧调度。dt 限制到 50 ms 并按最大 1/120 秒子步积分，避免后台恢复后数值爆炸。React 不在每帧 setState，SVG 值交给 MotionValue 更新，调试回调独立限频。
