import { useCallback, useEffect, useRef, useState } from "react";
import { deal } from "../engine/dealer";
import { apply, ghost, newGame, type Settings } from "../engine/engine";
import Board from "./Board";
import Button from "./Button";
import GameOver from "./GameOver";
import Sidebar from "./Sidebar";
import RoundButton from "./RoundButton";
import useBest from "./useBest";
import useTheme from "./useTheme";
import "./tactris.css";

const SETTINGS: Settings = { allowRotation: true, width: 10, height: 10 };
const FLASH_MS = 200;

const startGame = () => newGame(SETTINGS, deal(SETTINGS), deal(SETTINGS));

export default function Tactris() {
  const [game, setGame] = useState(startGame);
  const best = useBest(game.score);
  const rootRef = useRef<HTMLDivElement>(null);
  const theme = useTheme(rootRef);

  // The Cell under the pointer, or null when the pointer is off the Board.
  const [pointer, setPointer] = useState<[number, number] | null>(null);
  // Where the mouse was when the last Piece was placed. Until it moves from there, or the player turns
  // the Piece, the Ghost is hidden and clicks don't place: otherwise the new Piece shows blocked on top
  // of the one just placed. Compared by position, since browsers also fire mousemove when the page
  // changes under a still mouse (a line clear).
  const [placedAt, setPlacedAt] = useState<{ x: number; y: number } | null>(null);
  const onMove = useCallback(
    (at: { x: number; y: number }) => setPlacedAt((p) => (p && (p.x !== at.x || p.y !== at.y) ? null : p)),
    [],
  );

  // Full rows flash for a moment, then clear.
  useEffect(() => {
    if (!game.clearing.length) return;
    const timer = setTimeout(() => setGame((g) => apply(g, { type: "clear" })), FLASH_MS);
    return () => clearTimeout(timer);
  }, [game]);

  const restart = () => {
    setGame(startGame());
    best.newGame();
  };

  const rotate = useCallback((direction: "cw" | "ccw") => {
    setGame((g) => apply(g, { type: "rotate", direction }));
    setPlacedAt(null);
  }, []);

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

  const place = (row: number, col: number, at: { x: number; y: number }) => {
    if (placedAt) return;
    const placed = apply(game, { type: "place", row, col });
    if (placed === game) return;
    setGame(apply(placed, { type: "receive", piece: deal(SETTINGS) }));
    setPlacedAt(at);
  };

  const shown = pointer && !placedAt && !game.clearing.length && !game.gameOver ? ghost(game, ...pointer) : null;
  const lines = shown?.completes.length ?? 0;
  const status = game.gameOver
    ? "NO MOVES LEFT"
    : shown?.blocked
      ? "BLOCKED"
      : lines
        ? `${lines} ${lines === 1 ? "LINE" : "LINES"} CLEAR`
        : "";

  return (
    <div ref={rootRef} data-theme={theme.id} data-mode={theme.mode} className="tactris flex min-h-screen flex-col font-pixel-body text-ink">
      <header className="flex flex-wrap items-center justify-between gap-4 border-b-4 border-ink px-11 py-4.5">
        <span className="font-pixel text-[32px] font-bold tracking-[0.04em] text-shadow-hard">TACTRIS</span>
        <div className="flex items-center gap-4">
          <RoundButton label={`Change theme, now ${theme.name}`} onClick={theme.next} />
          <RoundButton label={`Switch to ${theme.mode === "dark" ? "light" : "dark"} mode`} onClick={theme.toggleMode} />
          <Button onClick={restart}>NEW GAME</Button>
        </div>
      </header>

      <main className="flex flex-1 flex-wrap items-center justify-center gap-11 px-6 py-7">
        {/* The status line hangs below the Board, out of the flow, so the Sidebar centres on the Board alone. */}
        <section aria-label="Board" className="relative w-[min(560px,100%,calc(100vh-200px))]">
          <div className="relative">
            <Board game={game} ghost={shown} onPointer={setPointer} onMove={onMove} onPlace={place} onRotate={rotate} />
            {game.gameOver && (
              <GameOver score={game.score} best={best.score} newBest={best.newBest} onPlayAgain={restart} />
            )}
          </div>
          <div className="absolute top-full left-0 mt-3 flex h-5.5 items-center font-pixel text-[15px] leading-none">{status && `> ${status}`}</div>
        </section>

        <Sidebar game={game} best={best.score} />
      </main>
    </div>
  );
}
