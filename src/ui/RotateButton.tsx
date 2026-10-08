// Circular arrows from the mobile design: anticlockwise points left, clockwise right.
const ARROWS = {
  ccw: ["M4 12a8 8 0 1 0 2.4-5.7", "M4 3v6h6"],
  cw: ["M20 12a8 8 0 1 1-2.4-5.7", "M20 3v6h-6"],
};

/** A mobile button that turns the current Piece; pressed, it moves into its ink shadow like NEW GAME. */
export default function RotateButton({ direction, onRotate }: { direction: "cw" | "ccw"; onRotate: (direction: "cw" | "ccw") => void }) {
  return (
    <button
      type="button"
      aria-label={direction === "cw" ? "Rotate clockwise" : "Rotate counter-clockwise"}
      onClick={() => onRotate(direction)}
      className="grid cursor-pointer place-items-center bg-light text-ink shadow-rotate [-webkit-tap-highlight-color:transparent] active:translate-x-1 active:translate-y-1 active:shadow-none focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-ink"
    >
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="square" aria-hidden="true">
        {ARROWS[direction].map((d) => (
          <path key={d} d={d} />
        ))}
      </svg>
    </button>
  );
}
