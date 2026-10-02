export function EditionSwitcher({
  active,
}: {
  active: "sphere" | "portrait" | "sun";
}) {
  return (
    <nav className="edition-switcher" aria-label="组件演示">
      <a href="/sphere" aria-current={active === "sphere" ? "page" : undefined}>
        骷髅小球
      </a>
      <a
        href="/portrait"
        aria-current={active === "portrait" ? "page" : undefined}
      >
        角色造型
      </a>
      <a href="/sun-creature" aria-current={active === "sun" ? "page" : undefined}>
        太阳怪兽
      </a>
    </nav>
  );
}
