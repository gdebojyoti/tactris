import { useCallback, useEffect, useRef, useState } from "react";
import { deal } from "../engine/dealer";
import { apply, ghost, newGame, type Direction, type Settings } from "../engine/engine";
import Board from "./Board";
import DesktopMain from "./DesktopMain";
import GameOver from "./GameOver";
import Header from "./Header";
import MobileMain from "./MobileMain";
import PortraitOnly from "./PortraitOnly";
import useBest from "./useBest";
import useTheme from "./useTheme";
import "./tactris.css";

const SETTINGS: Settings = { allowRotation: true, width: 10, height: 10 };
const FLASH_MS = 200;

// Phones and tablets get the mobile layout and touch input, by user agent. iPadOS Safari says it's a Mac,
// so a Mac with a touch screen counts as a tablet.
const MOBILE =
  /Mobi|Android|iPhone|iPad|iPod/.test(navigator.userAgent) ||
  (/Macintosh/.test(navigator.userAgent) && navigator.maxTouchPoints > 1);

const startGame = () => newGame(SETTINGS, deal(SETTINGS), deal(SETTINGS));

export default function Tactris() {
  const [game, setGame] = useState(startGame);
  const best = useBest(game.score);
  const rootRef = useRef<HTMLDivElement>(null);
  const theme = useTheme(rootRef);

  // The Cell under the pointer, or null when the pointer is off the Board.
  const [pointer, setPointer] = useState<[number, number] | null>(null);
  // Touch: a finger is down on the Board, even if it has since moved off it.
  const [touching, setTouching] = useState(false);
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

  const rotate = useCallback((direction: Direction) => {
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

  // A touch has no position to wait on: the Ghost goes when the finger lifts.
  const place = (row: number, col: number, at?: { x: number; y: number }) => {
    if (placedAt) return;
    const placed = apply(game, { type: "place", row, col });
    if (placed === game) return;
    setGame(apply(placed, { type: "receive", piece: deal(SETTINGS) }));
    if (at) setPlacedAt(at);
  };

  const shown = pointer && !placedAt && !game.clearing.length && !game.gameOver ? ghost(game, ...pointer) : null;
  const lines = shown?.completes.length ?? 0;
  const message = game.gameOver
    ? "NO MOVES LEFT"
    : shown?.blocked
      ? "BLOCKED"
      : lines
        ? `${lines} ${lines === 1 ? "LINE" : "LINES"} CLEAR`
        : "";
  // The status line, shown like a terminal prompt.
  const status = message && `> ${message}`;

  const board = (
    <div className="relative">
      <Board
        game={game}
        ghost={shown}
        onPointer={setPointer}
        onMove={onMove}
        onPlace={place}
        onRotate={rotate}
        onTouch={MOBILE ? setTouching : undefined}
      />
      {game.gameOver && (
        <GameOver score={game.score} best={best.score} newBest={best.newBest} onPlayAgain={restart} fullScreen={MOBILE} />
      )}
    </div>
  );

  // Mobile fills the screen inside the notch and home bar, and a long press doesn't select text.
  return (
    <div
      ref={rootRef}
      data-theme={theme.id}
      data-mode={theme.mode}
      data-layout={MOBILE ? "mobile" : "desktop"}
      className={
        MOBILE
          ? "tactris flex min-h-dvh touch-manipulation flex-col pt-[env(safe-area-inset-top)] pr-[env(safe-area-inset-right)] pb-[env(safe-area-inset-bottom)] pl-[env(safe-area-inset-left)] font-pixel text-ink select-none"
          : "tactris flex min-h-screen flex-col font-pixel text-ink"
      }
    >
      <Header theme={theme} onNewGame={restart} mobile={MOBILE} />
      {MOBILE ? (
        <MobileMain game={game} best={best.score} board={board} status={status} onRotate={rotate} touching={touching} />
      ) : (
        <DesktopMain game={game} best={best.score} board={board} status={status} />
      )}
      {MOBILE && <PortraitOnly />}
    </div>
  );
}
