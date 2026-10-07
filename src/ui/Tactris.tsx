import { useState, type ReactNode } from "react";
import { deal } from "../engine/dealer";
import { newGame, type Settings } from "../engine/engine";
import "./tactris.css";

const SETTINGS: Settings = { allowRotation: true, width: 10, height: 10 };

const startGame = () => newGame(SETTINGS, deal(SETTINGS), deal(SETTINGS));

export default function Tactris() {
  const [game, setGame] = useState(startGame);

  return (
    <div className="tactris flex min-h-screen flex-col font-pixel-body text-ink">
      <header className="flex flex-wrap items-center justify-between gap-4 border-b-4 border-ink px-11 py-[18px]">
        <span className="wordmark">TACTRIS</span>
        <button className="btn" onClick={() => setGame(startGame())}>
          NEW GAME
        </button>
      </header>

      <main className="flex flex-1 flex-wrap items-center justify-center gap-11 px-6 py-7">
        <section aria-label="Board" className="board-column flex flex-col gap-3">
          <div className="board" style={{ gridTemplateColumns: `repeat(${SETTINGS.width}, minmax(0, 1fr))` }}>
            {game.cells.flatMap((row, r) => row.map((_, c) => <div key={`${r},${c}`} className="cell cell-empty" />))}
          </div>
          <div className="flex min-h-[22px] items-center font-pixel text-[15px]" />
        </section>

        <aside aria-label="Game info" className="flex w-[250px] flex-col gap-4">
          <Box label="SCORE">
            <span className="text-right text-[44px] leading-none font-bold">{game.score}</span>
          </Box>
          <div className="flex gap-4">
            <Box label="LINES" half>
              <span className="text-right text-[28px] leading-none font-bold">{game.lines}</span>
            </Box>
            <Box label="BEST" half>
              <span className="text-right text-[28px] leading-none font-bold">0</span>
            </Box>
          </div>
          <div className="flex gap-4">
            <Box label="NOW" half>
              <div className="h-[46px]" />
            </Box>
            <Box label="NEXT" half>
              <div className="h-[46px]" />
            </Box>
          </div>
          {SETTINGS.allowRotation && (
            <Box label="CONTROLS">
              {[
                ["CLICK", "PLACE"],
                ["WHEEL UP / E", "TURN CW"],
                ["WHEEL DOWN / Q", "TURN CCW"],
              ].map(([input, effect]) => (
                <div key={input} className="flex justify-between gap-3 text-[15px]">
                  <span>{input}</span>
                  <span>{effect}</span>
                </div>
              ))}
            </Box>
          )}
        </aside>
      </main>
    </div>
  );
}

function Box({ label, half, children }: { label: string; half?: boolean; children: ReactNode }) {
  return (
    <div className={half ? "box flex-1 px-3" : "box"}>
      <span className="box-label">{label}</span>
      {children}
    </div>
  );
}
