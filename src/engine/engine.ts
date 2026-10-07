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
  return { settings, cells, current, next, score: 0, clearing: [], gameOver: false };
}

/** The Ghost with the pointer on (row, col): the Cells the current Piece would fill, and whether any is already filled. */
export function ghost(game: Game, row: number, col: number) {
  const cells = ghostCells(game, row, col);
  return { cells, blocked: cells.some(([r, c]) => game.cells[r][c]) };
}

function ghostCells(game: Game, row: number, col: number): [number, number][] {
  const rows = pieceCells(game.current);
  const { width, height } = game.settings;
  const clamp = (value: number, max: number) => Math.max(0, Math.min(value, max));
  const top = clamp(row - Math.floor((rows.length - 1) / 2), height - rows.length);
  const left = clamp(col - Math.floor((rows[0].length - 1) / 2), width - rows[0].length);
  return rows.flatMap((line, r) =>
    [...line].flatMap((mark, c): [number, number][] => (mark === "#" ? [[top + r, left + c]] : [])),
  );
}

export function apply(game: Game, action: Action): Game {
  if (action.type === "receive") return { ...game, next: action.piece };
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
  const placed = { ...game, cells, current: game.next, next: null, score, clearing };
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
      const free = rows.every((line, r) => [...line].every((mark, c) => mark !== "#" || !game.cells[top + r][left + c]));
      if (free) return true;
    }
  }
  return false;
}
