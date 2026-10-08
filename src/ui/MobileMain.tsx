import type { ReactNode } from "react";
import type { Game } from "../engine/engine";
import Box from "./Box";
import MiniPiece from "./MiniPiece";
import RotateButton from "./RotateButton";

type Props = {
  game: Game;
  best: number;
  /** The Board, with Game over over it; the status line goes under it. */
  board: ReactNode;
  status: string;
  onRotate: (direction: "cw" | "ccw") => void;
};

/**
 * The mobile layout under the header (design M5): score, lines and best in a row, the Board, the status line,
 * NOW and NEXT between the rotate buttons, and the hint pinned to the bottom.
 */
export default function MobileMain({ game, best, board, status, onRotate }: Props) {
  // The Board is as wide as the column, unless that's too tall for the screen: then it narrows, centred,
  // until everything fits. 388px is the height of everything but the Board and the bottom padding (--pb:
  // 20px up to 390px wide, 40px on wider screens). On very short phones it stops at 240px, to stay playable,
  // and the page scrolls. Tablets get a narrower column.
  const boardWidth =
    "min(100%, max(240px, 100dvh - 388px - var(--pb) - env(safe-area-inset-top) - env(safe-area-inset-bottom)))";
  return (
    <main className="mx-auto flex w-full max-w-xl flex-1 flex-col gap-3 px-4 pt-3.5 pb-(--pb) [--pb:20px] min-[391px]:[--pb:40px]">
      <div className="grid grid-cols-[1.5fr_1fr_1fr] gap-2.5">
        <Box label="SCORE" variant="stat">
          <span className="text-right text-[30px] leading-none font-bold">{game.score}</span>
        </Box>
        <Box label="LINES" variant="stat">
          <span className="text-right text-[22px] leading-none font-bold">{game.lines}</span>
        </Box>
        <Box label="BEST" variant="stat">
          <span className="text-right text-[22px] leading-none font-bold">{best}</span>
        </Box>
      </div>
      <section aria-label="Board" className="mx-auto flex flex-col gap-3" style={{ width: boardWidth }}>
        {board}
        <div className="flex min-h-5 items-center font-pixel text-[13px] leading-none">{status && `> ${status}`}</div>
      </section>
      <div className="grid grid-cols-[64px_1fr_1fr_64px] gap-2.5">
        <RotateButton direction="ccw" onRotate={onRotate} />
        <Box label="NOW" variant="piece" blocked={game.gameOver}>
          <MiniPiece piece={game.current} blocked={game.gameOver} small />
        </Box>
        <Box label="NEXT" variant="piece" dim>
          <MiniPiece piece={game.next} small />
        </Box>
        <RotateButton direction="cw" onRotate={onRotate} />
      </div>
      <p className="mt-auto text-center text-[15px] leading-[1.4]">
        <b>DRAG</b> ON THE BOARD TO <b>AIM</b>
        <br />
        <b>LIFT</b> YOUR FINGER TO <b>PLACE</b>
      </p>
    </main>
  );
}
