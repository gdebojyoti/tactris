import { useEffect, useRef, useState, type ReactNode } from "react";
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
    const classes = ["cell", game.cells[r][c] ? "cell-filled" : "cell-empty"];
    if (inGhost.has(`${r},${c}`)) classes.push(shown!.blocked ? "cell-ghost-blocked" : "cell-ghost");
    if (shown?.completes.includes(r)) classes.push("cell-preview");
    if (game.clearing.includes(r)) classes.push("cell-flash");
    return classes.join(" ");
  };
  const lines = shown?.completes.length ?? 0;
  const status = shown?.blocked ? "BLOCKED" : lines ? `${lines} ${lines === 1 ? "LINE" : "LINES"} CLEAR` : "";

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
          <div
            ref={boardRef}
            className="board"
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
            <Box label="NOW" half>
              <MiniPiece piece={game.current} />
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
function MiniPiece({ piece }: { piece: Piece | null }) {
  const rows = piece ? pieceCells(piece) : [];
  return (
    <div className="flex h-[78px] items-center justify-center">
      <div className="grid gap-0.5" style={{ gridTemplateColumns: `repeat(${rows[0]?.length ?? 0}, 18px)` }}>
        {rows.flatMap((line, r) =>
          [...line].map((mark, c) => <div key={`${r},${c}`} className={mark === "#" ? "size-[18px] cell-filled" : "size-[18px]"} />),
        )}
      </div>
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
