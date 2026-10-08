import { pieceCells, type Piece } from "../engine/engine";

// Mini-cells are 18px, or 15px on mobile; the area is tall enough for any Orientation (4 cells + 3 gaps).
const SIZES = {
  normal: { cell: "size-4.5", area: "h-19.5" },
  small: { cell: "size-3.75", area: "h-16.5" },
};

/** A Piece in mini-cells, centred in an area tall and wide enough for any Orientation. */
export default function MiniPiece({ piece, blocked, small }: { piece: Piece | null; blocked?: boolean; small?: boolean }) {
  const { cell, area } = SIZES[small ? "small" : "normal"];
  const filled = blocked ? `${cell} cell-filled cell-ghost-blocked` : `${cell} cell-filled`;
  const rows = piece ? pieceCells(piece) : [];
  return (
    <div className={`flex ${area} items-center justify-center`}>
      {/* Each column is as wide as its mini-cells. */}
      <div className="grid gap-0.5" style={{ gridTemplateColumns: `repeat(${rows[0]?.length ?? 0}, max-content)` }}>
        {rows.flatMap((line, r) =>
          [...line].map((mark, c) => <div key={`${r},${c}`} className={mark === "#" ? filled : cell} />),
        )}
      </div>
    </div>
  );
}
