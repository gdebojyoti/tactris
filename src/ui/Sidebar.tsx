import type { Game } from "../engine/engine";
import Box from "./Box";
import MiniPiece from "./MiniPiece";
import Stat from "./Stat";

const CONTROLS = [
  ["CLICK", "PLACE"],
  ["WHEEL DOWN / E", "TURN CW"],
  ["WHEEL UP / Q", "TURN CCW"],
];

/** Score, lines and best, the current and Next pieces, and the controls when rotation is on. */
export default function Sidebar({ game, best }: { game: Game; best: number }) {
  return (
    <aside aria-label="Game info" className="flex w-67.5 flex-col gap-4">
      <div className="flex flex-col gap-3.5">
        <Stat label="SCORE" value={game.score} variant="score" />
        <div className="flex gap-10">
          <Stat label="LINES" value={game.lines} variant="minor" />
          <Stat label="BEST" value={best} variant="minor" />
        </div>
      </div>
      <div className="mt-3.5 mb-11 flex gap-4">
        <Box label="NOW" variant="half" blocked={game.gameOver}>
          <MiniPiece piece={game.current} blocked={game.gameOver} />
        </Box>
        <Box label="NEXT" variant="half" dim>
          <MiniPiece piece={game.next} />
        </Box>
      </div>
      {game.settings.allowRotation && (
        <div className="flex flex-col gap-2.5">
          <span className="text-[13px]">CONTROLS</span>
          {CONTROLS.map(([input, effect]) => (
            <div key={input} className="flex justify-between gap-3 text-[15px]">
              <span>{input}</span>
              <span>{effect}</span>
            </div>
          ))}
        </div>
      )}
    </aside>
  );
}
