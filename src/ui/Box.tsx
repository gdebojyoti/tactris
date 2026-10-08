import type { ReactNode } from "react";

// Each variant is a full set of classes, not an override: two conflicting utilities resolve by Tailwind's
// stylesheet order, not by their order in className.
const VARIANTS = {
  /** Half the sidebar's width: NOW and NEXT side by side. */
  half: { box: "flex-1 gap-2 border-4 px-3 py-3.5 shadow-box", label: "text-[13px]" },
  /** Mobile, thinner and centred: NOW and NEXT between the rotate buttons. */
  piece: { box: "min-w-0 items-center gap-1.5 border-3 px-2.5 py-2 shadow-box-sm", label: "text-[11px]" },
};

type Props = {
  label: string;
  variant: keyof typeof VARIANTS;
  /** Red border: the NOW box at Game over, when its Piece is blocked everywhere. */
  blocked?: boolean;
  /** Half opacity: the NEXT box, so it doesn't compete with NOW. */
  dim?: boolean;
  children: ReactNode;
};

/** A box for NOW or NEXT: ink border, double inset ring, label on top. */
export default function Box({ label, variant, blocked, dim, children }: Props) {
  const { box, label: labelSize } = VARIANTS[variant];
  return (
    <div className={`flex flex-col bg-backlight ${box} ${blocked ? "border-error" : "border-ink"} ${dim ? "opacity-50" : ""}`}>
      <span className={labelSize}>{label}</span>
      {children}
    </div>
  );
}
