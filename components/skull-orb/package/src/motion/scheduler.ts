import { emptyPointer, type RawPointer } from "../interaction/pointer";
type Subscriber = (dt: number, now: number, pointer: RawPointer) => void;
const subscribers = new Set<Subscriber>();
let pointer = { ...emptyPointer },
  raf = 0,
  last = 0;
function tick(now: number) {
  raf = 0;
  const dt = last ? Math.min((now - last) / 1000, 0.05) : 1 / 60;
  last = now;
  for (const fn of subscribers) fn(dt, now, pointer);
  if (subscribers.size && !document.hidden) raf = requestAnimationFrame(tick);
}
function start() {
  if (!raf && !document.hidden) {
    last = 0;
    raf = requestAnimationFrame(tick);
  }
}
function move(e: PointerEvent) {
  if (!e.isPrimary) return;
  const now = performance.now(),
    dt = (now - pointer.stamp) / 1000;
  const speed =
    pointer.present && dt > 0.004 && dt < 0.15
      ? Math.hypot(e.clientX - pointer.x, e.clientY - pointer.y) / dt
      : 0;
  pointer = {
    x: e.clientX,
    y: e.clientY,
    speed: Math.min(speed, 6000),
    present: true,
    pressed: (e.buttons & 1) > 0,
    stamp: now,
  };
}
function leave() {
  pointer = { ...emptyPointer };
}
function up() {
  pointer.pressed = false;
}
function visibility() {
  leave();
  if (document.hidden) {
    cancelAnimationFrame(raf);
    raf = 0;
    last = 0;
  } else start();
}
export function subscribeFrame(fn: Subscriber) {
  subscribers.add(fn);
  if (subscribers.size === 1) {
    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerdown", move, { passive: true });
    window.addEventListener("pointerup", up, { passive: true });
    window.addEventListener("pointercancel", leave, { passive: true });
    window.addEventListener("blur", leave);
    document.addEventListener("pointerleave", leave);
    document.addEventListener("visibilitychange", visibility);
  }
  start();
  return () => {
    subscribers.delete(fn);
    if (!subscribers.size) {
      cancelAnimationFrame(raf);
      raf = 0;
      last = 0;
      pointer = { ...emptyPointer };
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerdown", move);
      window.removeEventListener("pointerup", up);
      window.removeEventListener("pointercancel", leave);
      window.removeEventListener("blur", leave);
      document.removeEventListener("pointerleave", leave);
      document.removeEventListener("visibilitychange", visibility);
    }
  };
}
