import { useEffect, useRef, useState, type ComponentProps, type ReactNode } from "react";
import { deal } from "../engine/dealer";
import { apply, ghost, newGame, pieceCells, type Piece, type Settings } from "../engine/engine";
import "./tactris.css";

const SETTINGS: Settings = { allowRotation: true, width: 10, height: 10 };
const FLASH_MS = 200;
// About half a mouse-wheel click (100px in most browsers), so every click turns once.
const WHEEL_STEP = 50;
const WHEEL_COOLDOWN_MS = 150;

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

  const rotate = (direction: "cw" | "ccw") => setGame((g) => apply(g, { type: "rotate", direction }));

  // E turns clockwise and Q counter-clockwise, anywhere on the page.
  useEffect(() => {
    if (!SETTINGS.allowRotation) return;
    const onKey = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();
      if (key === "e" || key === "q") rotate(key === "e" ? "cw" : "ccw");
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // The wheel over the Board turns the Piece instead of scrolling the page: up is clockwise. Attached
  // directly so it can call preventDefault, which React's passive wheel handler can't. A trackpad sends
  // many small deltas, so they add up to about one wheel click, with at most one turn per cooldown.
  const boardRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const board = boardRef.current;
    if (!board || !SETTINGS.allowRotation) return;
    let distance = 0;
    let lastTurn = -Infinity;
    const onWheel = (event: WheelEvent) => {
      event.preventDefault();
      if (event.timeStamp - lastTurn < WHEEL_COOLDOWN_MS) return void (distance = 0);
      distance += event.deltaMode === WheelEvent.DOM_DELTA_LINE ? event.deltaY * 40 : event.deltaY;
      if (Math.abs(distance) < WHEEL_STEP) return;
      rotate(distance < 0 ? "cw" : "ccw");
      distance = 0;
      lastTurn = event.timeStamp;
    };
    board.addEventListener("wheel", onWheel, { passive: false });
    return () => board.removeEventListener("wheel", onWheel);
  }, []);

  const place = (row: number, col: number) =>
    setGame((g) => {
      const placed = apply(g, { type: "place", row, col });
      return placed === g ? g : apply(placed, { type: "receive", piece: deal(SETTINGS) });
    });

  const shown = pointer && !game.clearing.length && !game.gameOver ? ghost(game, ...pointer) : null;
  const inGhost = new Set(shown?.cells.map(([r, c]) => `${r},${c}`));
  const cellClass = (r: number, c: number) => {
    const classes = ["aspect-square", game.cells[r][c] ? "cell-filled" : "cell-empty"];
    if (inGhost.has(`${r},${c}`)) classes.push(shown!.blocked ? "cell-ghost-blocked" : "cell-ghost");
    if (shown?.completes.includes(r)) classes.push("cell-preview");
    if (game.clearing.includes(r)) classes.push("cell-flash");
    return classes.join(" ");
  };
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
            <div
              ref={boardRef}
              className="grid gap-0.5 border-[6px] border-ink bg-light p-2.5 shadow-board"
              style={{ gridTemplateColumns: `repeat(${SETTINGS.width}, minmax(0, 1fr))` }}
              onMouseLeave={() => setPointer(null)}
            >
              {game.cells.flatMap((row, r) =>
                row.map((_, c) => (
                  <div
                    key={`${r},${c}`}
                    className={cellClass(r, c)}
                    onMouseEnter={() => setPointer([r, c])}
                    onClick={() => place(r, c)}
                  />
                )),
              )}
            </div>
            {game.gameOver && (
              <GameOver score={game.score} best={best} newBest={game.score > bestBefore} onPlayAgain={restart} />
            )}
          </div>
          <div className="flex h-[22px] items-center font-pixel text-[15px] leading-none">{status && `> ${status}`}</div>
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
              <span className="text-right text-[28px] leading-none font-bold">{best}</span>
            </Box>
          </div>
          <div className="flex gap-4">
            <Box label="NOW" half stuck={game.gameOver}>
              <MiniPiece piece={game.current} stuck={game.gameOver} />
            </Box>
            <Box label="NEXT" half>
              <MiniPiece piece={game.next} />
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

/** A Piece in mini-cells, centred in an area tall and wide enough for any Orientation (4 × 18px + gaps). */
function MiniPiece({ piece, stuck }: { piece: Piece | null; stuck?: boolean }) {
  const filled = stuck ? "size-[18px] cell-filled cell-ghost-blocked" : "size-[18px] cell-filled";
  const rows = piece ? pieceCells(piece) : [];
  return (
    <div className="flex h-[78px] items-center justify-center">
      <div className="grid gap-0.5" style={{ gridTemplateColumns: `repeat(${rows[0]?.length ?? 0}, 18px)` }}>
        {rows.flatMap((line, r) =>
          [...line].map((mark, c) => <div key={`${r},${c}`} className={mark === "#" ? filled : "size-[18px]"} />),
        )}
      </div>
    </div>
  );
}

function Box({ label, half, stuck, children }: { label: string; half?: boolean; stuck?: boolean; children: ReactNode }) {
  return (
    <div
      className={`flex flex-col gap-2 border-4 bg-backlight py-3.5 shadow-box ${half ? "flex-1 px-3" : "px-[18px]"} ${stuck ? "border-error" : "border-ink"}`}
    >
      <span className="font-pixel text-[13px]">{label}</span>
      {children}
    </div>
  );
}

/** Over the dimmed Board: the final score and best, NEW BEST! when it was beaten, and PLAY AGAIN. */
function GameOver(props: { score: number; best: number; newBest: boolean; onPlayAgain: () => void }) {
  return (
    <div className="game-over-dim absolute inset-1.5 flex items-center justify-center p-6">
      <div role="dialog" aria-label="Game over" className="flex w-[min(320px,100%)] flex-col gap-[18px] border-[6px] border-ink bg-backlight px-[26px] pt-[26px] pb-6 shadow-panel">
        <div className="flex flex-col items-center gap-2.5">
          <span className="font-pixel text-[30px] font-bold tracking-[0.04em] text-shadow-hard">GAME OVER</span>
          {props.newBest && (
            <div className="flex items-center gap-2.5">
              <Sparkle />
              <span className="font-pixel text-[17px] font-bold tracking-[0.06em]">NEW BEST!</span>
              <Sparkle />
            </div>
          )}
        </div>
        <div className="flex flex-col gap-2.5 border-y-[3px] border-dashed border-dark py-3.5">
          <div className="flex items-baseline justify-between gap-3">
            <span className="font-pixel text-[13px]">SCORE</span>
            <span className="text-[44px] leading-none font-bold">{props.score}</span>
          </div>
          <div className="flex items-baseline justify-between gap-3">
            <span className="font-pixel text-[13px]">BEST</span>
            <span className="text-[26px] leading-none font-bold">{props.best}</span>
          </div>
        </div>
        <Button large onClick={props.onPlayAgain} autoFocus>
          PLAY AGAIN
        </Button>
      </div>
    </div>
  );
}

/** The 7×7 pixel sparkle beside NEW BEST!, from the design. */
function Sparkle() {
  return (
    <svg width="21" height="21" viewBox="0 0 7 7" shapeRendering="crispEdges" aria-hidden="true">
      <rect x="3" y="0" width="1" height="7" fill="var(--ink)" />
      <rect x="0" y="3" width="7" height="1" fill="var(--ink)" />
      {[[1, 1], [5, 1], [1, 5], [5, 5]].map(([x, y]) => (
        <rect key={`${x},${y}`} x={x} y={y} width="1" height="1" fill="var(--dark)" />
      ))}
    </svg>
  );
}

/** The primary button: solid ink with a hard shadow, which in this design always means "clickable". */
function Button({ large, ...props }: ComponentProps<"button"> & { large?: boolean }) {
  const size = large ? "h-[52px] w-full text-[18px]" : "h-11 px-[18px] text-[14px]";
  return (
    <button
      className={`${size} cursor-pointer bg-ink font-pixel text-backlight shadow-button hover:bg-dark focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-ink`}
      {...props}
    />
  );
}
