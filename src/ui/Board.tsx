import { useEffect, useRef } from "react";
import type { ghost as ghostOf, Game } from "../engine/engine";

// About half a mouse-wheel click (100px in most browsers), so every click turns once.
const WHEEL_STEP = 50;
const WHEEL_COOLDOWN_MS = 150;

type Props = {
  game: Game;
  /** The Ghost to draw, or null when there's none (pointer off the Board or not moved since placing, rows clearing, Game over). */
  ghost: ReturnType<typeof ghostOf> | null;
  onPointer: (cell: [number, number] | null) => void;
  /** Where the mouse is, in client coordinates, every time it moves over the Board. */
  onMove: (at: { x: number; y: number }) => void;
  onPlace: (row: number, col: number, at: { x: number; y: number }) => void;
  /** Must keep the same identity across renders, or the wheel listener resets its distance and cooldown. */
  onRotate: (direction: "cw" | "ccw") => void;
};

/** The rectangular playing area made of Cells, with the Ghost, row preview and flash drawn over them. */
export default function Board({ game, ghost, onPointer, onMove, onPlace, onRotate }: Props) {
  // The wheel over the Board turns the Piece instead of scrolling the page: down is clockwise. Attached
  // directly so it can call preventDefault, which React's passive wheel handler can't. A trackpad sends
  // many small deltas, so they add up to about one wheel click, with at most one turn per cooldown.
  const boardRef = useRef<HTMLDivElement>(null);
  const { allowRotation, width } = game.settings;
  useEffect(() => {
    const board = boardRef.current;
    if (!board || !allowRotation) return;
    let distance = 0;
    let lastTurn = -Infinity;
    const onWheel = (event: WheelEvent) => {
      event.preventDefault();
      if (event.timeStamp - lastTurn < WHEEL_COOLDOWN_MS) return void (distance = 0);
      distance += event.deltaMode === WheelEvent.DOM_DELTA_LINE ? event.deltaY * 40 : event.deltaY;
      if (Math.abs(distance) < WHEEL_STEP) return;
      onRotate(distance > 0 ? "cw" : "ccw");
      distance = 0;
      lastTurn = event.timeStamp;
    };
    board.addEventListener("wheel", onWheel, { passive: false });
    return () => board.removeEventListener("wheel", onWheel);
  }, [allowRotation, onRotate]);

  const inGhost = new Set(ghost?.cells.map(([r, c]) => `${r},${c}`));
  const cellClass = (r: number, c: number) => {
    const classes = ["aspect-square", game.cells[r][c] ? "cell-filled" : "cell-empty"];
    if (inGhost.has(`${r},${c}`)) classes.push(ghost!.blocked ? "cell-ghost-blocked" : "cell-ghost");
    if (ghost?.completes.includes(r)) classes.push("cell-preview");
    if (game.clearing.includes(r)) classes.push("cell-flash");
    return classes.join(" ");
  };

  return (
    <div
      ref={boardRef}
      className="grid gap-0.5 border-[6px] border-ink bg-light p-2.5 shadow-board"
      style={{ gridTemplateColumns: `repeat(${width}, minmax(0, 1fr))` }}
      onMouseLeave={() => onPointer(null)}
      onMouseMove={(event) => onMove({ x: event.clientX, y: event.clientY })}
    >
      {game.cells.flatMap((row, r) =>
        row.map((_, c) => (
          <div
            key={`${r},${c}`}
            className={cellClass(r, c)}
            onMouseEnter={() => onPointer([r, c])}
            onClick={(event) => onPlace(r, c, { x: event.clientX, y: event.clientY })}
          />
        )),
      )}
    </div>
  );
}
