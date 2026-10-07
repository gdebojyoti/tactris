import { pieceCells, type Piece } from "../engine/engine";

/** A Piece in mini-cells, centred in an area tall and wide enough for any Orientation (4 × 18px + gaps). */
export default function MiniPiece({ piece, blocked }: { piece: Piece | null; blocked?: boolean }) {
  const filled = blocked ? "size-4.5 cell-filled cell-ghost-blocked" : "size-4.5 cell-filled";
  const rows = piece ? pieceCells(piece) : [];
  return (
    <div className="flex h-19.5 items-center justify-center">
      <div className="grid gap-0.5" style={{ gridTemplateColumns: `repeat(${rows[0]?.length ?? 0}, 18px)` }}>
        {rows.flatMap((line, r) =>
          [...line].map((mark, c) => <div key={`${r},${c}`} className={mark === "#" ? filled : "size-4.5"} />),
        )}
      </div>
    </div>
  );
}
