// Design: docs/design/tactris-logo/README.md. A "T" of placed cells over a Ghost, 38px square, built from the
// theme's tokens like the game's own cells (not the design's SVGs), so it follows the theme and mode.
const PLACED = "size-3 border-2 border-ink bg-dark shadow-[inset_1px_1px_0_var(--light)]";
const GHOST = "size-3 border border-dashed border-ink shadow-[inset_0_0_0_1px_var(--backlight),inset_0_0_0_3px_var(--dark)]";

// '#' is a placed Cell, 'g' the Ghost, '.' nothing.
const ROWS = ["###", ".#.", ".g."];

/** The logo mark. Decorative unless given a `label`, e.g. when no wordmark sits next to it. */
export default function Logo({ label }: { label?: string }) {
  return (
    <div
      className="grid grid-cols-[repeat(3,--spacing(3))] gap-px"
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    >
      {ROWS.flatMap((row, r) =>
        [...row].map((mark, c) => <div key={`${r},${c}`} className={mark === "#" ? PLACED : mark === "g" ? GHOST : undefined} />),
      )}
    </div>
  );
}
