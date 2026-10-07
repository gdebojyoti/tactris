# Tactris

A single-player puzzle game: the player places Tetris pieces anywhere on a fixed board, and full rows clear with Tetris-style gravity.

## Board

**Board**:
The rectangular playing area made of cells, onto which pieces are placed.
_Avoid_: Grid, well, field

**Cell**:
One square of the board, either **empty** or **filled**.
_Avoid_: Selected cell, block, tile

**Line clear**:
The removal of a fully filled row, after which every row above it drops down by exactly one row as a rigid whole; gaps are never filled by falling cells.
_Avoid_: Burn, cleared row, cascade

**Clearing row**:
A fully filled row after the piece is placed and before the line clear removes it, shown flashing for a moment.
_Avoid_: Flashing row, burning row

## Pieces

**Shape**:
One of the seven tetromino shapes: I, O, T, S, Z, J, L.
_Avoid_: Tetromino type, figure

**Orientation**:
One of the distinct rotations of a shape (one for O, two for I/S/Z, four for T/J/L).
_Avoid_: Variant, set

**Starting orientation**:
The orientation a shape is dealt in when the player is allowed to rotate: the standard Tetris one, flat side down.
_Avoid_: Spawn rotation, default orientation

**Piece**:
A shape in a particular orientation, which the player places on the board next.
_Avoid_: Tetromino, block, set

**Next piece**:
The piece that will be dealt after the current one is placed, shown to the player in advance.
_Avoid_: Preview, queue

**Ghost**:
The preview of the cells the current piece would fill if placed at the pointer's position. A ghost that overlaps filled cells is **blocked**, and the piece cannot be placed there.
_Avoid_: Highlight, hover, gridset

**Row preview**:
The rows the ghost would fill completely, highlighted so the player can see a line clear coming.
_Avoid_: Completed rows

## Game

**Game over**:
The end of a game, reached when the current piece fits nowhere on the board in any orientation available to the player.
_Avoid_: Loss, stuck
