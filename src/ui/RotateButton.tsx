import type { Direction } from "../engine/engine";
import Button from "./Button";
import PixelIcon from "./PixelIcon";

/** A square mobile button that turns the current Piece. */
export default function RotateButton({ direction, onRotate }: { direction: Direction; onRotate: (direction: Direction) => void }) {
  return (
    <Button
      variant="rotate"
      aria-label={direction === "cw" ? "Rotate clockwise" : "Rotate counter-clockwise"}
      onClick={() => onRotate(direction)}
    >
      <PixelIcon name={direction === "cw" ? "rotateCw" : "rotateCcw"} />
    </Button>
  );
}
