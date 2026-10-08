import PixelIcon from "./PixelIcon";

/** A square mobile button that turns the current Piece; pressed, it moves into its ink shadow like NEW GAME. */
export default function RotateButton({ direction, onRotate }: { direction: "cw" | "ccw"; onRotate: (direction: "cw" | "ccw") => void }) {
  return (
    <button
      type="button"
      aria-label={direction === "cw" ? "Rotate clockwise" : "Rotate counter-clockwise"}
      onClick={() => onRotate(direction)}
      className="grid size-16 cursor-pointer place-items-center self-center bg-light text-ink shadow-rotate [-webkit-tap-highlight-color:transparent] active:translate-x-1 active:translate-y-1 active:shadow-none focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-ink"
    >
      <PixelIcon name={direction === "cw" ? "rotateCw" : "rotateCcw"} />
    </button>
  );
}
