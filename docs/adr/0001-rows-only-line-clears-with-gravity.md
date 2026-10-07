# Rows-only line clears with Tetris-style gravity

Tactris clears only full **rows**, and every row above a clear drops down by exactly one row as a rigid whole (classic Tetris gravity; gaps are never filled by falling cells). This deliberately departs from the rest of the place-anywhere block-puzzle genre (1010!, Blockudoku, Nesque's Tactris), which clears rows **and** columns with no gravity. We chose it because it is the game's distinguishing twist — the board behaves like a Tetris well you can fill from any position — so column clears must not be added as a "fix".

## Considered Options

- **Rows and columns, no gravity**: the genre standard; rejected because it makes Tactris indistinguishable from 1010!-style games.
- **Rows and columns, gravity toward the cleared line**: rejected as harder to read and reason about.
- **Cascade gravity** (each cell falls until supported, enabling chain clears): rejected because it makes the board's future hard to predict, which undermines a planning-focused game.
