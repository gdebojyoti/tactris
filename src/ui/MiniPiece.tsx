import { pieceCells, type Piece } from "../engine/engine";

/**
 * A Piece in mini-cells, centred in an area tall and wide enough for any Orientation (4 cells + 3 gaps):
 * 18px cells, or 15px on mobile (small).
 */
export default function MiniPiece({ piece, blocked, small }: { piece: Piece | null; blocked?: boolean; small?: boolean }) {
  const [size, area, px] = small ? ["size-3.75", "h-16.5", 15] : ["size-4.5", "h-19.5", 18];
  const filled = blocked ? `${size} cell-filled cell-ghost-blocked` : `${size} cell-filled`;
  const rows = piece ? pieceCells(piece) : [];
  return (
    <div className={`flex ${area} items-center justify-center`}>
      <div className="grid gap-0.5" style={{ gridTemplateColumns: `repeat(${rows[0]?.length ?? 0}, ${px}px)` }}>
        {rows.flatMap((line, r) =>
          [...line].map((mark, c) => <div key={`${r},${c}`} className={mark === "#" ? filled : size} />),
        )}
      </div>
    </div>
  );
}
