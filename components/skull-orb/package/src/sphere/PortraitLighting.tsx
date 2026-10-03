/** Light stays in view space while the shared hood silhouette turns underneath it.
 * The soft bands are carved INSIDE the silhouette, so they neither inflate it
 * nor draw a constant-width outline around the mask or the lightning joints.
 */
export function PortraitLightingDefs({ id, silhouette }: { id: string; silhouette: string }) {
  return (
    <>
      <path id={`${id}-hood-silhouette`} data-portrait-light-shape="" d={silhouette} />
      <radialGradient id={`${id}-hood-material`} gradientUnits="userSpaceOnUse" cx="80" cy="-60" r="380">
        <stop offset="0" stopColor="#1c1c1c" />
        <stop offset=".44" stopColor="#121212" />
        <stop offset="1" stopColor="#0b0b0b" />
      </radialGradient>
      <linearGradient id={`${id}-key-falloff`} gradientUnits="userSpaceOnUse" x1="70" y1="-100" x2="250" y2="315">
        <stop offset="0" stopColor="white" />
        <stop offset=".42" stopColor="#d4d4d4" />
        <stop offset=".78" stopColor="#565656" />
        <stop offset="1" stopColor="#181818" />
      </linearGradient>
      <mask id={`${id}-key-mask`} maskUnits="userSpaceOnUse" x="-24" y="-160" width="368" height="570">
        <rect x="-24" y="-160" width="368" height="570" fill={`url(#${id}-key-falloff)`} />
      </mask>
      <filter id={`${id}-key-soft`} x="-10%" y="-10%" width="120%" height="120%" colorInterpolationFilters="sRGB">
        <feGaussianBlur in="SourceAlpha" stdDeviation="4.5" result="soft" />
        <feOffset in="soft" dx="7" dy="3" result="inset" />
        <feComposite in="SourceAlpha" in2="inset" operator="out" result="edge" />
        <feFlood floodColor="#bcbcbc" floodOpacity=".24" result="light" />
        <feComposite in="light" in2="edge" operator="in" />
      </filter>
      <filter id={`${id}-key-glint`} x="-10%" y="-10%" width="120%" height="120%" colorInterpolationFilters="sRGB">
        <feGaussianBlur in="SourceAlpha" stdDeviation=".8" result="soft" />
        <feOffset in="soft" dx="1.4" dy=".7" result="inset" />
        <feComposite in="SourceAlpha" in2="inset" operator="out" result="edge" />
        <feFlood floodColor="#e5e5e5" floodOpacity=".1" result="light" />
        <feComposite in="light" in2="edge" operator="in" />
      </filter>
      <filter id={`${id}-bounce-soft`} x="-10%" y="-10%" width="120%" height="120%" colorInterpolationFilters="sRGB">
        <feGaussianBlur in="SourceAlpha" stdDeviation="3" result="soft" />
        <feOffset in="soft" dx="-3" dy="-1.5" result="inset" />
        <feComposite in="SourceAlpha" in2="inset" operator="out" result="edge" />
        <feFlood floodColor="#999999" floodOpacity=".07" result="light" />
        <feComposite in="light" in2="edge" operator="in" />
      </filter>
    </>
  );
}

export function PortraitLighting({ id, opacity }: { id: string; opacity: number }) {
  return (
    <g data-portrait-lighting="" opacity={opacity} pointerEvents="none" aria-hidden="true">
      <g mask={`url(#${id}-key-mask)`}>
        <use href={`#${id}-hood-silhouette`} fill="white" filter={`url(#${id}-key-soft)`} />
        <use href={`#${id}-hood-silhouette`} fill="white" filter={`url(#${id}-key-glint)`} />
      </g>
      <use href={`#${id}-hood-silhouette`} fill="white" filter={`url(#${id}-bounce-soft)`} />
    </g>
  );
}
