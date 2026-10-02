export const clamp = (n: number, min = 0, max = 1) =>
  Math.min(max, Math.max(min, Number.isFinite(n) ? n : min));

export type Spring = { value: number; velocity: number };

export function advanceSpring(
  spring: Spring,
  target: number,
  dt: number,
  stiffness: number,
  damping: number,
) {
  const steps = Math.max(1, Math.ceil(dt / (1 / 120)));
  const step = dt / steps;
  for (let i = 0; i < steps; i++) {
    spring.velocity +=
      (stiffness * (target - spring.value) - damping * spring.velocity) * step;
    spring.value += spring.velocity * step;
  }
  if (!Number.isFinite(spring.value)) {
    spring.value = target;
    spring.velocity = 0;
  }
  return spring.value;
}
