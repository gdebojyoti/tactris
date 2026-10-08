import type { ReactNode } from "react";
import type { Game } from "../engine/engine";
import Sidebar from "./Sidebar";

type Props = {
  game: Game;
  best: number;
  /** The Board, with Game over over it; the status line goes under it. */
  board: ReactNode;
  status: string;
};

/** The desktop layout under the header: the Board with the status line, and the Sidebar beside it. */
export default function DesktopMain({ game, best, board, status }: Props) {
  return (
    <main className="flex flex-1 flex-wrap items-center justify-center gap-11 px-6 py-7">
      {/* The status line hangs below the Board, out of the flow, so the Sidebar centres on the Board alone. */}
      <section aria-label="Board" className="relative w-[min(560px,100%,calc(100vh-200px))]">
        {board}
        <div className="absolute top-full left-0 mt-3 flex h-5.5 items-center font-pixel text-[15px] leading-none">{status}</div>
      </section>

      <Sidebar game={game} best={best} />
    </main>
  );
}
