import { pieceCells, type Piece } from "../engine/engine";

/** A Piece in mini-cells, centred in an area tall and wide enough for any Orientation (4 × 18px + gaps). */
export default function MiniPiece({ piece, stuck }: { piece: Piece | null; stuck?: boolean }) {
  const filled = stuck ? "size-[18px] cell-filled cell-ghost-blocked" : "size-[18px] cell-filled";
  const rows = piece ? pieceCells(piece) : [];
  return (
    <div className="flex h-[78px] items-center justify-center">
      <div className="grid gap-0.5" style={{ gridTemplateColumns: `repeat(${rows[0]?.length ?? 0}, 18px)` }}>
        {rows.flatMap((line, r) =>
          [...line].map((mark, c) => <div key={`${r},${c}`} className={mark === "#" ? filled : "size-[18px]"} />),
        )}
      </div>
    </div>
  );
}
