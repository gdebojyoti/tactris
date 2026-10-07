export type Shape = "I" | "O" | "T" | "S" | "Z" | "J" | "L";
export type Piece = { shape: Shape; orientation: number };
export type Settings = { allowRotation: boolean; width: number; height: number };

export const SHAPES: Shape[] = ["I", "O", "T", "S", "Z", "J", "L"];

// Starting orientations: the standard Tetris ones, flat side down.
const STARTING: Record<Shape, string[]> = {
  I: ["####"],
  O: ["##", "##"],
  T: [".#.", "###"],
  S: [".##", "##."],
  Z: ["##.", ".##"],
  J: ["#..", "###"],
  L: ["..#", "###"],
};

const rotateClockwise = (rows: string[]) =>
  [...rows[0]].map((_, c) => rows.map((row) => row[c]).reverse().join(""));

// Orientation i is the starting orientation turned clockwise i times, without duplicates.
const ORIENTATIONS = Object.fromEntries(
  SHAPES.map((shape) => {
    const all = [STARTING[shape]];
    for (let next = rotateClockwise(all[0]); next.join() !== all[0].join(); next = rotateClockwise(next)) {
      all.push(next);
    }
    return [shape, all];
  }),
) as Record<Shape, string[][]>;

export const orientationCount = (shape: Shape) => ORIENTATIONS[shape].length;

/** The Piece's rows, top to bottom, with "#" for a filled Cell and "." for an empty one. */
export const pieceCells = (piece: Piece) => ORIENTATIONS[piece.shape][piece.orientation];

export type Game = {
  settings: Settings;
  /** Rows of the Board, top to bottom; true is a filled Cell. */
  cells: boolean[][];
  current: Piece;
  next: Piece | null;
  score: number;
  /** Lines cleared so far in this game. */
  lines: number;
  /** Full rows waiting to be removed by a "clear" action, so they can be flashed first. */
  clearing: number[];
  gameOver: boolean;
};

/** Points for clearing 0, 1, 2, 3 or 4 rows with one placement. */
const CLEAR_POINTS = [0, 100, 300, 500, 800];

export type Action =
  | { type: "place"; row: number; col: number }
  | { type: "receive"; piece: Piece }
  | { type: "clear" }
  | { type: "rotate"; direction: "cw" | "ccw" };

export function newGame(settings: Settings, current: Piece, next: Piece): Game {
  const cells = Array.from({ length: settings.height }, () => Array<boolean>(settings.width).fill(false));
  const game = { settings, cells, current, next, score: 0, lines: 0, clearing: [], gameOver: false };
  return { ...game, gameOver: !fitsAnywhere(game) };
}

/** The Cells a Piece's rows cover with their top-left corner on (top, left). */
const cellsAt = (rows: string[], top: number, left: number): [number, number][] =>
  rows.flatMap((line, r) =>
    [...line].flatMap((mark, c): [number, number][] => (mark === "#" ? [[top + r, left + c]] : [])),
  );

/** Whether every Cell is on the Board and empty. */
const isFree = (game: Game, cells: [number, number][]) =>
  cells.every(([r, c]) => r < game.settings.height && c < game.settings.width && !game.cells[r][c]);

/**
 * The Ghost with the pointer on (row, col): the Board Cells the current Piece would fill, and whether
 * it's blocked. A Piece bigger than the Board is always blocked, and its Ghost is clipped to the Board.
 */
export function ghost(game: Game, row: number, col: number) {
  const rows = pieceCells(game.current);
  const { width, height } = game.settings;
  const clamp = (value: number, max: number) => Math.max(0, Math.min(value, max));
  const top = clamp(row - Math.floor((rows.length - 1) / 2), height - rows.length);
  const left = clamp(col - Math.floor((rows[0].length - 1) / 2), width - rows[0].length);
  const cells = cellsAt(rows, top, left);
  const blocked = !isFree(game, cells);
  // Rows this placement would complete, for the row preview.
  const completes = blocked
    ? []
    : game.cells.flatMap((line, r) =>
        line.every((filled, c) => filled || cells.some(([gr, gc]) => gr === r && gc === c)) ? [r] : [],
      );
  return { cells: cells.filter(([r, c]) => r < height && c < width), blocked, completes };
}

export function apply(game: Game, action: Action): Game {
  if (game.gameOver) return game;
  // A waiting Next piece is never replaced, so a repeated delivery can't drop a Piece the player has seen.
  if (action.type === "receive") return game.next ? game : { ...game, next: action.piece };
  if (action.type === "rotate") {
    if (!game.settings.allowRotation) return game;
    const { shape, orientation } = game.current;
    const count = orientationCount(shape);
    const turned = (orientation + (action.direction === "cw" ? 1 : count - 1)) % count;
    return { ...game, current: { shape, orientation: turned } };
  }
  if (action.type === "clear") {
    // Classic Tetris gravity: rows above drop rigidly, one row per cleared row below them.
    const kept = game.cells.filter((_, r) => !game.clearing.includes(r));
    const empty = Array.from({ length: game.clearing.length }, () => Array<boolean>(game.settings.width).fill(false));
    const cleared = { ...game, cells: [...empty, ...kept], clearing: [] };
    return { ...cleared, gameOver: !fitsAnywhere(cleared) };
  }
  if (!game.next || game.clearing.length) return game;
  const { cells: filling, blocked } = ghost(game, action.row, action.col);
  if (blocked) return game;
  const cells = game.cells.map((row) => [...row]);
  for (const [r, c] of filling) cells[r][c] = true;
  const clearing = cells.flatMap((row, r) => (row.every(Boolean) ? [r] : []));
  const score = game.score + 4 + CLEAR_POINTS[clearing.length];
  const lines = game.lines + clearing.length;
  const placed = { ...game, cells, current: game.next, next: null, score, lines, clearing };
  // With rows waiting to clear, Game over is decided after the clear.
  return { ...placed, gameOver: !clearing.length && !fitsAnywhere(placed) };
}

/** Whether the current Piece can be placed somewhere, in any Orientation the player may rotate to. */
function fitsAnywhere(game: Game): boolean {
  const { shape, orientation } = game.current;
  const orientations = game.settings.allowRotation
    ? Array.from({ length: orientationCount(shape) }, (_, i) => i)
    : [orientation];
  return orientations.some((o) => fits(game, pieceCells({ shape, orientation: o })));
}

function fits(game: Game, rows: string[]): boolean {
  for (let top = 0; top + rows.length <= game.settings.height; top++) {
    for (let left = 0; left + rows[0].length <= game.settings.width; left++) {
      if (isFree(game, cellsAt(rows, top, left))) return true;
    }
  }
  return false;
}
