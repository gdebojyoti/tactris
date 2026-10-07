import type { Game } from "../engine/engine";
import Box from "./Box";
import MiniPiece from "./MiniPiece";

const CONTROLS = [
  ["CLICK", "PLACE"],
  ["WHEEL UP / E", "TURN CW"],
  ["WHEEL DOWN / Q", "TURN CCW"],
];

/** Score, lines and best, the current and Next pieces, and the controls when rotation is on. */
export default function Sidebar({ game, best }: { game: Game; best: number }) {
  return (
    <aside aria-label="Game info" className="flex w-[250px] flex-col gap-4">
      <Box label="SCORE">
        <span className="text-right text-[44px] leading-none font-bold">{game.score}</span>
      </Box>
      <div className="flex gap-4">
        <Box label="LINES" half>
          <span className="text-right text-[28px] leading-none font-bold">{game.lines}</span>
        </Box>
        <Box label="BEST" half>
          <span className="text-right text-[28px] leading-none font-bold">{best}</span>
        </Box>
      </div>
      <div className="flex gap-4">
        <Box label="NOW" half blocked={game.gameOver}>
          <MiniPiece piece={game.current} blocked={game.gameOver} />
        </Box>
        <Box label="NEXT" half>
          <MiniPiece piece={game.next} />
        </Box>
      </div>
      {game.settings.allowRotation && (
        <Box label="CONTROLS">
          {CONTROLS.map(([input, effect]) => (
            <div key={input} className="flex justify-between gap-3 text-[15px]">
              <span>{input}</span>
              <span>{effect}</span>
            </div>
          ))}
        </Box>
      )}
    </aside>
  );
}
