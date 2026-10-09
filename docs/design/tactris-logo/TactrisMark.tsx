import { useId } from "react";

/**
 * Tactris logo mark — the "Block T".
 * Five cells on a 3×3 grid: a 3-cell bar, a stem cell, and a dashed ghost cell at the bottom.
 * Drawn on a 38×38 unit grid (12-unit cells, 1-unit gaps) so it stays crisp at whole multiples.
 *
 * variant "light": for light (backlight #9bbc0f) backgrounds — the default in-game header.
 * variant "dark":  for dark (ink #0f380f) backgrounds — app icon, inverted lockups.
 */
type Props = {
  /** Rendered size in px. 38, 76, 114… stay pixel-crisp; anything else is fine but may soften. */
  size?: number;
  variant?: "light" | "dark";
  /** Accessible name. Pass "" when a visible "TACTRIS" wordmark sits right next to the mark. */
  title?: string;
  className?: string;
};

const PALETTE = {
  light: { edge: "#0f380f", fill: "#306230", hi: "#8bac0f", ring: "#306230" },
  dark: { edge: "#9bbc0f", fill: "#8bac0f", hi: "#9bbc0f", ring: "#8bac0f" },
} as const;

const BLOCKS: Array<[number, number]> = [
  [0, 0],
  [13, 0],
  [26, 0],
  [13, 13],
];
const GHOST: [number, number] = [13, 26];

export function TactrisMark({ size = 38, variant = "light", title = "Tactris", className }: Props) {
  // useId's format differs across React versions (":r0:", "«r0»", "_r_0_"); keep only id-safe characters.
  const id = "tm" + useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const c = PALETTE[variant];
  const decorative = title === "";

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 38 38"
      width={size}
      height={size}
      shapeRendering="crispEdges"
      className={className}
      role={decorative ? undefined : "img"}
      aria-hidden={decorative ? true : undefined}
      aria-label={decorative ? undefined : title}
    >
      <defs>
        <g id={`${id}-block`}>
          <rect width="12" height="12" fill={c.edge} />
          <rect x="2" y="2" width="8" height="8" fill={c.fill} />
          <rect x="2" y="2" width="8" height="1" fill={c.hi} />
          <rect x="2" y="2" width="1" height="8" fill={c.hi} />
        </g>
      </defs>
      {BLOCKS.map(([x, y]) => (
        <use key={`${x}-${y}`} href={`#${id}-block`} x={x} y={y} />
      ))}
      <g transform={`translate(${GHOST[0]} ${GHOST[1]})`}>
        <rect x="0.5" y="0.5" width="11" height="11" fill="none" stroke={c.edge} strokeWidth="1" strokeDasharray="2 1" />
        <rect x="3" y="3" width="6" height="6" fill="none" stroke={c.ring} strokeWidth="2" />
      </g>
    </svg>
  );
}
