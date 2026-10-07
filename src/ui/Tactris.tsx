import { useCallback, useEffect, useState } from "react";
import { deal } from "../engine/dealer";
import { apply, ghost, newGame, type Settings } from "../engine/engine";
import Board from "./Board";
import Button from "./Button";
import GameOver from "./GameOver";
import Sidebar from "./Sidebar";
import "./tactris.css";

const SETTINGS: Settings = { allowRotation: true, width: 10, height: 10 };
const FLASH_MS = 200;

// Storage can be missing or blocked (private windows, blocked site data), so the best score is optional.
const BEST_KEY = "tactris.best";
const loadBest = () => {
  try {
    return Number(localStorage.getItem(BEST_KEY)) || 0;
  } catch {
    return 0;
  }
};
const saveBest = (score: number) => {
  try {
    localStorage.setItem(BEST_KEY, String(score));
  } catch {
    // Not saved; the best score still shows for this visit.
  }
};

const startGame = () => newGame(SETTINGS, deal(SETTINGS), deal(SETTINGS));

export default function Tactris() {
  const [game, setGame] = useState(startGame);
  // The Cell under the pointer, or null when the pointer is off the Board.
  const [pointer, setPointer] = useState<[number, number] | null>(null);

  // Full rows flash for a moment, then clear.
  useEffect(() => {
    if (!game.clearing.length) return;
    const timer = setTimeout(() => setGame((g) => apply(g, { type: "clear" })), FLASH_MS);
    return () => clearTimeout(timer);
  }, [game]);

  // The best score updates, and is saved, the moment the score passes it.
  const [best, setBest] = useState(loadBest);
  useEffect(() => {
    if (game.score <= best) return;
    setBest(game.score);
    saveBest(game.score);
  }, [game.score, best]);
  // The best score when this game started, so Game over can tell whether it was beaten.
  const [bestBefore, setBestBefore] = useState(best);

  const restart = () => {
    setGame(startGame());
    setBestBefore(best);
  };

  const rotate = useCallback((direction: "cw" | "ccw") => setGame((g) => apply(g, { type: "rotate", direction })), []);

  // E turns clockwise and Q counter-clockwise, anywhere on the page.
  useEffect(() => {
    if (!SETTINGS.allowRotation) return;
    const onKey = (event: KeyboardEvent) => {
      // Leave browser and system shortcuts (Ctrl+E, Cmd+Q, ...) alone.
      if (event.ctrlKey || event.metaKey || event.altKey) return;
      const key = event.key.toLowerCase();
      if (key === "e" || key === "q") rotate(key === "e" ? "cw" : "ccw");
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [rotate]);

  const place = (row: number, col: number) =>
    setGame((g) => {
      const placed = apply(g, { type: "place", row, col });
      return placed === g ? g : apply(placed, { type: "receive", piece: deal(SETTINGS) });
    });

  const shown = pointer && !game.clearing.length && !game.gameOver ? ghost(game, ...pointer) : null;
  const lines = shown?.completes.length ?? 0;
  const status = game.gameOver
    ? "NO MOVES LEFT"
    : shown?.blocked
      ? "BLOCKED"
      : lines
        ? `${lines} ${lines === 1 ? "LINE" : "LINES"} CLEAR`
        : "";

  return (
    <div className="tactris flex min-h-screen flex-col font-pixel-body text-ink">
      <header className="flex flex-wrap items-center justify-between gap-4 border-b-4 border-ink px-11 py-[18px]">
        <span className="font-pixel text-[32px] font-bold tracking-[0.04em] text-shadow-hard">TACTRIS</span>
        <Button onClick={restart}>NEW GAME</Button>
      </header>

      <main className="flex flex-1 flex-wrap items-center justify-center gap-11 px-6 py-7">
        <section aria-label="Board" className="flex w-[min(560px,100%,calc(100vh_-_200px))] flex-col gap-3">
          <div className="relative">
            <Board game={game} ghost={shown} onPointer={setPointer} onPlace={place} onRotate={rotate} />
            {game.gameOver && (
              <GameOver score={game.score} best={best} newBest={game.score > bestBefore} onPlayAgain={restart} />
            )}
          </div>
          <div className="flex h-[22px] items-center font-pixel text-[15px] leading-none">{status && `> ${status}`}</div>
        </section>

        <Sidebar game={game} best={best} />
      </main>
    </div>
  );
}
