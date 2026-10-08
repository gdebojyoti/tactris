import type { ReactNode } from "react";

// Each variant is a full set of classes, not an override: two conflicting utilities resolve by Tailwind's
// stylesheet order, not by their order in className.
const VARIANTS = {
  full: "gap-2 border-4 px-4.5 py-3.5 shadow-box",
  /** Half width, side by side with another Box. */
  half: "flex-1 gap-2 border-4 px-3 py-3.5 shadow-box",
  /** Mobile, thinner: SCORE, LINES and BEST in one row. */
  stat: "min-w-0 gap-1.5 border-3 px-3 py-2.5 shadow-box-sm",
  /** Mobile, thinner and centred: NOW and NEXT between the rotate buttons. */
  piece: "min-w-0 items-center gap-1.5 border-3 px-2.5 py-2 shadow-box-sm",
};

type Props = {
  label: string;
  variant?: keyof typeof VARIANTS;
  /** Red border: the NOW box at Game over, when its Piece is blocked everywhere. */
  blocked?: boolean;
  children: ReactNode;
};

/** A sidebar box: ink border, double inset ring, label on top. */
export default function Box({ label, variant = "full", blocked, children }: Props) {
  const mobile = variant === "stat" || variant === "piece";
  return (
    <div className={`flex flex-col bg-backlight ${VARIANTS[variant]} ${blocked ? "border-error" : "border-ink"}`}>
      <span className={`font-pixel ${mobile ? "text-[11px]" : "text-[13px]"}`}>{label}</span>
      {children}
    </div>
  );
}
