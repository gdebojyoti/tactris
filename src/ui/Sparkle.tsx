const CORNERS = [
  [1, 1],
  [5, 1],
  [1, 5],
  [5, 5],
];

/** The 7×7 pixel sparkle beside NEW BEST!, from the design. */
export default function Sparkle() {
  return (
    <svg width="21" height="21" viewBox="0 0 7 7" shapeRendering="crispEdges" aria-hidden="true">
      <rect x="3" y="0" width="1" height="7" fill="var(--ink)" />
      <rect x="0" y="3" width="7" height="1" fill="var(--ink)" />
      {CORNERS.map(([x, y]) => (
        <rect key={`${x},${y}`} x={x} y={y} width="1" height="1" fill="var(--dark)" />
      ))}
    </svg>
  );
}
