import { expect, test } from "vitest";
import { apply, ghost, newGame, pieceCells, type Action, type Game, type Piece, type Settings } from "./engine";

const settings = (overrides: Partial<Settings> = {}): Settings => ({
  allowRotation: true,
  width: 10,
  height: 10,
  ...overrides,
});

const piece = (shape: Piece["shape"], orientation = 0): Piece => ({ shape, orientation });

/** The Board as rows of "#" (filled) and "." (empty). */
const board = (game: Game) => game.cells.map((row) => row.map((filled) => (filled ? "#" : ".")).join(""));

const play = (game: Game, ...actions: Action[]) => actions.reduce(apply, game);

test("a new game has an empty Board, the given current and Next piece, and no score", () => {
  const game = newGame(settings({ width: 4, height: 3 }), piece("T"), piece("O"));
  expect(board(game)).toEqual(["....", "....", "...."]);
  expect(game.current).toEqual(piece("T"));
  expect(game.next).toEqual(piece("O"));
  expect(game.score).toBe(0);
  expect(game.gameOver).toBe(false);
});

test("placing a Piece fills its Cells, centred on the pointer", () => {
  const game = play(newGame(settings({ width: 5, height: 4 }), piece("T"), piece("O")), {
    type: "place",
    row: 1,
    col: 2,
  });
  expect(board(game)).toEqual([".....", "..#..", ".###.", "....."]);
});

test("for an even size, the pointer is on the Cell just above and to the left of the centre", () => {
  const game = play(newGame(settings({ width: 5, height: 4 }), piece("O"), piece("T")), {
    type: "place",
    row: 1,
    col: 1,
  });
  expect(board(game)).toEqual([".....", ".##..", ".##..", "....."]);
});

test("a Piece that would hang over an edge is pushed back inside the Board", () => {
  const game = play(newGame(settings({ width: 5, height: 4 }), piece("T"), piece("O")), {
    type: "place",
    row: 3,
    col: 4,
  });
  expect(board(game)).toEqual([".....", ".....", "...#.", "..###"]);
});

test("after a placement, the Next piece becomes the current Piece", () => {
  const game = play(newGame(settings(), piece("T"), piece("O")), { type: "place", row: 5, col: 5 });
  expect(game.current).toEqual(piece("O"));
  expect(game.next).toBeNull();
});

test("a received Piece becomes the Next piece", () => {
  const game = play(
    newGame(settings(), piece("T"), piece("O")),
    { type: "place", row: 5, col: 5 },
    { type: "receive", piece: piece("L") },
  );
  expect(game.next).toEqual(piece("L"));
});

test("a Piece can't be placed until the Next piece has been received", () => {
  const placed = play(newGame(settings({ width: 5, height: 4 }), piece("T"), piece("O")), {
    type: "place",
    row: 1,
    col: 2,
  });
  expect(play(placed, { type: "place", row: 3, col: 0 })).toEqual(placed);
});

test("placing where the Ghost overlaps filled Cells does nothing", () => {
  const game = play(
    newGame(settings({ width: 5, height: 4 }), piece("O"), piece("T")),
    { type: "place", row: 0, col: 0 },
    { type: "receive", piece: piece("L") },
  );
  expect(play(game, { type: "place", row: 0, col: 1 })).toEqual(game);
});

test("the Ghost lists the Cells the Piece would fill, and is blocked when any is filled", () => {
  const game = play(
    newGame(settings({ width: 5, height: 4 }), piece("O"), piece("T")),
    { type: "place", row: 0, col: 0 },
    { type: "receive", piece: piece("L") },
  );
  expect(ghost(game, 0, 1)).toEqual({ cells: [[0, 1], [1, 0], [1, 1], [1, 2]], blocked: true });
  expect(ghost(game, 2, 3)).toEqual({ cells: [[2, 3], [3, 2], [3, 3], [3, 4]], blocked: false });
});

test("each placement scores 4 points", () => {
  const game = play(
    newGame(settings(), piece("T"), piece("O")),
    { type: "place", row: 0, col: 1 },
    { type: "receive", piece: piece("L") },
    { type: "place", row: 5, col: 5 },
  );
  expect(game.score).toBe(8);
});

test("a full row is reported as clearing and stays on the Board until the clear", () => {
  const game = play(newGame(settings({ width: 4, height: 3 }), piece("I"), piece("O")), {
    type: "place",
    row: 2,
    col: 1,
  });
  expect(game.clearing).toEqual([2]);
  expect(board(game)).toEqual(["....", "....", "####"]);
});

test("a clear removes the full row and drops the rows above by one, leaving gaps as gaps", () => {
  const game = play(
    newGame(settings({ width: 3, height: 5 }), piece("S"), piece("J")),
    { type: "place", row: 3, col: 1 },
    { type: "receive", piece: piece("O") },
    { type: "place", row: 1, col: 1 },
  );
  expect(board(game)).toEqual(["...", "#..", "###", ".##", "##."]);

  const cleared = play(game, { type: "clear" });
  expect(board(cleared)).toEqual(["...", "...", "#..", ".##", "##."]);
  expect(cleared.clearing).toEqual([]);
});

test.each([
  { rows: 1, size: { width: 4, height: 3 }, moves: [[piece("I"), 2, 1]], score: 4 + 100 },
  { rows: 2, size: { width: 2, height: 3 }, moves: [[piece("O"), 1, 0]], score: 4 + 300 },
  { rows: 3, size: { width: 2, height: 5 }, moves: [[piece("I", 1), 2, 1], [piece("J", 1), 0, 0]], score: 8 + 500 },
  { rows: 4, size: { width: 1, height: 4 }, moves: [[piece("I", 1), 0, 0]], score: 4 + 800 },
] as const)("clearing $rows row(s) at once scores $score in total", ({ size, moves, score }) => {
  const pieces = moves.map(([p]) => p);
  let game = newGame(settings(size), pieces[0], pieces[1] ?? piece("O"));
  moves.forEach(([, row, col], i) => {
    game = play(game, { type: "place", row, col }, { type: "receive", piece: pieces[i + 2] ?? piece("O") });
  });
  expect(play(game, { type: "clear" }).score).toBe(score);
});

test("a Piece can't be placed while rows are waiting to clear", () => {
  const game = play(
    newGame(settings({ width: 4, height: 3 }), piece("I"), piece("O")),
    { type: "place", row: 2, col: 1 },
    { type: "receive", piece: piece("T") },
  );
  expect(play(game, { type: "place", row: 0, col: 0 })).toEqual(game);
});

test("with rotation on, the current Piece turns clockwise and counter-clockwise", () => {
  const game = newGame(settings(), piece("T"), piece("O"));
  const shape = (g: Game) => pieceCells(g.current).join("/");
  expect(shape(play(game, { type: "rotate", direction: "cw" }))).toBe("#./##/#.");
  expect(shape(play(game, { type: "rotate", direction: "ccw" }))).toBe(".#/##/.#");
  expect(shape(play(game, ...Array(4).fill({ type: "rotate", direction: "cw" })))).toBe(".#./###");
});

test("with rotation off, rotating does nothing", () => {
  const game = newGame(settings({ allowRotation: false }), piece("T", 2), piece("O"));
  expect(play(game, { type: "rotate", direction: "cw" })).toEqual(game);
});

test("the game is over when the new current Piece fits nowhere on the Board", () => {
  const game = play(newGame(settings({ width: 4, height: 3 }), piece("T"), piece("O")), {
    type: "place",
    row: 0,
    col: 1,
  });
  expect(board(game)).toEqual([".#..", "###.", "...."]);
  expect(game.gameOver).toBe(true);
});

test.each([
  { allowRotation: true, gameOver: false },
  { allowRotation: false, gameOver: true },
])("when only a rotated Orientation fits, with rotation allowed: $allowRotation, the game is over: $gameOver", ({ allowRotation, gameOver }) => {
  // A vertical I is taller than the Board; only the horizontal one fits, along the bottom row.
  const game = play(newGame(settings({ width: 4, height: 3, allowRotation }), piece("T"), piece("I", 1)), {
    type: "place",
    row: 0,
    col: 1,
  });
  expect(game.gameOver).toBe(gameOver);
});

test("a Piece that only fits once the full rows are cleared doesn't end the game", () => {
  // Before the clear only the top row is free, too short for an O.
  const game = play(
    newGame(settings({ width: 4, height: 2 }), piece("I"), piece("O")),
    { type: "place", row: 1, col: 1 },
    { type: "receive", piece: piece("T") },
    { type: "clear" },
  );
  expect(game.gameOver).toBe(false);
});

test("a Piece taller than the Board gives a blocked Ghost, clipped to the Board, and can't be placed", () => {
  const game = newGame(settings({ width: 4, height: 3 }), piece("I", 1), piece("O"));
  expect(ghost(game, 1, 1)).toEqual({ cells: [[0, 1], [1, 1], [2, 1]], blocked: true });
  expect(play(game, { type: "place", row: 1, col: 1 })).toEqual(game);
});

test("a Piece wider than the Board gives a blocked Ghost, clipped to the Board, and can't be placed", () => {
  const game = newGame(settings({ width: 3, height: 10 }), piece("I"), piece("O"));
  expect(ghost(game, 0, 1)).toEqual({ cells: [[0, 0], [0, 1], [0, 2]], blocked: true });
  expect(play(game, { type: "place", row: 0, col: 1 })).toEqual(game);
});

test("a new game is already over when its first Piece fits nowhere", () => {
  const game = newGame(settings({ width: 3, height: 10, allowRotation: false }), piece("I"), piece("O"));
  expect(game.gameOver).toBe(true);
});

test("receiving a Piece while a Next piece is already waiting keeps the waiting one", () => {
  const game = play(
    newGame(settings(), piece("T"), piece("O")),
    { type: "place", row: 5, col: 5 },
    { type: "receive", piece: piece("L") },
    { type: "receive", piece: piece("S") },
  );
  expect(game.next).toEqual(piece("L"));
});

test("after Game over, no action changes the game", () => {
  const over = play(newGame(settings({ width: 4, height: 3 }), piece("T"), piece("O")), {
    type: "place",
    row: 0,
    col: 1,
  });
  expect(over.gameOver).toBe(true);
  const actions: Action[] = [
    { type: "receive", piece: piece("I") },
    { type: "rotate", direction: "cw" },
    { type: "clear" },
    { type: "place", row: 2, col: 1 },
  ];
  for (const action of actions) expect(play(over, action)).toEqual(over);
});

test("a Piece rotated next to an edge is pushed back inside the Board", () => {
  const game = play(
    newGame(settings({ width: 5, height: 4 }), piece("T"), piece("O")),
    { type: "rotate", direction: "cw" },
    { type: "place", row: 0, col: 4 },
  );
  expect(board(game)).toEqual(["...#.", "...##", "...#.", "....."]);
});
