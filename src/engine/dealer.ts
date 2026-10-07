import { orientationCount, SHAPES, type Piece, type Settings } from "./engine";

/** Deals a random Piece: each Shape 1 in 7, in its Starting orientation when rotation is allowed. */
export function deal(settings: Settings, random: () => number = Math.random): Piece {
  const shape = SHAPES[Math.floor(random() * SHAPES.length)];
  const orientation = settings.allowRotation ? 0 : Math.floor(random() * orientationCount(shape));
  return { shape, orientation };
}
