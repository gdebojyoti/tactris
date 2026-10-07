import { expect, test } from "vitest";
import { deal } from "./dealer";
import { pieceCells } from "./engine";

const rotationOn = { allowRotation: true, width: 10, height: 10 };
const rotationOff = { allowRotation: false, width: 10, height: 10 };

/** A fake random source that returns the given numbers in order. */
const randoms = (...values: number[]) => () => values.shift()!;

// Copied from the prototype's app.js (commit 95f7531): [width, height] and row-major bits.
const PROTOTYPE_PIECES: [[number, number], number[]][] = [
  [[4, 1], [1, 1, 1, 1]],
  [[1, 4], [1, 1, 1, 1]],
  [[3, 2], [1, 1, 1, 1, 0, 0]],
  [[3, 2], [1, 1, 1, 0, 1, 0]],
  [[3, 2], [1, 1, 1, 0, 0, 1]],
  [[3, 2], [1, 1, 0, 0, 1, 1]],
  [[3, 2], [0, 1, 1, 1, 1, 0]],
  [[3, 2], [1, 0, 0, 1, 1, 1]],
  [[3, 2], [0, 1, 0, 1, 1, 1]],
  [[3, 2], [0, 0, 1, 1, 1, 1]],
  [[2, 3], [1, 1, 1, 0, 1, 0]],
  [[2, 3], [1, 0, 1, 1, 1, 0]],
  [[2, 3], [1, 0, 1, 0, 1, 1]],
  [[2, 3], [1, 1, 0, 1, 0, 1]],
  [[2, 3], [0, 1, 1, 1, 0, 1]],
  [[2, 3], [0, 1, 0, 1, 1, 1]],
  [[2, 3], [1, 0, 1, 1, 0, 1]],
  [[2, 3], [0, 1, 1, 1, 1, 0]],
  [[2, 2], [1, 1, 1, 1]],
];

const toRows = ([[width, height], bits]: [[number, number], number[]]) =>
  Array.from({ length: height }, (_, r) =>
    bits.slice(r * width, (r + 1) * width).map((b) => (b ? "#" : ".")).join(""),
  ).join("/");

test("with rotation off, every Orientation of every Shape can be dealt, matching the prototype's 19 pieces", () => {
  const dealt = new Set<string>();
  for (let shape = 0; shape < 7; shape++) {
    for (let orientation = 0; orientation < 4; orientation++) {
      const piece = deal(rotationOff, randoms((shape + 0.5) / 7, (orientation + 0.5) / 4));
      dealt.add(pieceCells(piece).join("/"));
    }
  }
  expect([...dealt].sort()).toEqual(PROTOTYPE_PIECES.map(toRows).sort());
});

test("with rotation on, each Shape is dealt in its Starting orientation, flat side down", () => {
  const dealt = [0, 1, 2, 3, 4, 5, 6].map((shape) =>
    pieceCells(deal(rotationOn, randoms((shape + 0.5) / 7, 0.99))).join("/"),
  );
  expect(dealt).toEqual(["####", "##/##", ".#./###", ".##/##.", "##./.##", "#../###", "..#/###"]);
});
