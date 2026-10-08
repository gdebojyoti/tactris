import type { ReactNode } from "react";
import type { Direction, Game } from "../engine/engine";
import Box from "./Box";
import MiniPiece from "./MiniPiece";
import RotateButton from "./RotateButton";
import Stat from "./Stat";

type Props = {
  game: Game;
  best: number;
  /** The Board, with Game over over it; the status line goes under it. */
  board: ReactNode;
  status: string;
  onRotate: (direction: Direction) => void;
  /** A finger is down on the Board. */
  touching: boolean;
  /** Swap controls is on: clockwise on the left, counter-clockwise on the right. */
  swapped: boolean;
};

/**
 * The mobile layout under the header (design M5): score, lines and best in a row, the Board, the status line,
 * NOW and NEXT between the rotate buttons, and the hint pinned to the bottom.
 */
export default function MobileMain({ game, best, board, status, onRotate, touching, swapped }: Props) {
  // The Board is as wide as the column, unless that's too tall for the screen: then it narrows, centred,
  // until everything fits. 383px is the height of everything but the Board and the bottom padding (--bottom-gap:
  // 20px up to 390px wide, 40px on wider screens). On very short phones it stops at 240px, to stay playable,
  // and the page scrolls. Tablets get a narrower column.
  const boardWidth =
    "min(100%, max(240px, 100dvh - 383px - var(--bottom-gap) - env(safe-area-inset-top) - env(safe-area-inset-bottom)))";
  return (
    <main className="mx-auto flex w-full max-w-xl flex-1 flex-col gap-3 px-4 pt-3.5 pb-(--bottom-gap) [--bottom-gap:20px] min-[391px]:[--bottom-gap:40px]">
      <div className="flex items-start justify-between">
        <Stat label="SCORE" value={game.score} variant="score-small" />
        <div className="flex gap-6">
          <Stat label="LINES" value={game.lines} variant="minor-small" />
          <Stat label="BEST" value={best} variant="minor-small" />
        </div>
      </div>
      <section aria-label="Board" className="mx-auto flex flex-col gap-3" style={{ width: boardWidth }}>
        {board}
        <div className="flex min-h-5 items-center text-[13px] leading-none">{status}</div>
      </section>
      <div className="grid grid-cols-[64px_1fr_1fr_64px] gap-2.5">
        <RotateButton direction={swapped ? "cw" : "ccw"} onRotate={onRotate} />
        <Box label="NOW" variant="piece" blocked={game.gameOver}>
          <MiniPiece piece={game.current} blocked={game.gameOver} small />
        </Box>
        <Box label="NEXT" variant="piece" dim>
          <MiniPiece piece={game.next} small />
        </Box>
        <RotateButton direction={swapped ? "ccw" : "cw"} onRotate={onRotate} />
      </div>
      {/* The hint shows the step to take next: drag while no finger is down, lift while one is. */}
      <p className="mt-auto text-center text-[15px] leading-[1.4]">
        <span className={`block ${touching ? "opacity-50" : ""}`}>
          <b>DRAG</b> on the board to <b>AIM</b>
        </span>
        <span className={`block ${touching ? "" : "opacity-50"}`}>
          <b>LIFT</b> your finger to <b>PLACE</b>
        </span>
      </p>
    </main>
  );
}
