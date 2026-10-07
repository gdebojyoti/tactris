import type { ReactNode } from "react";

type Props = {
  label: string;
  /** Half width, side by side with another Box. */
  half?: boolean;
  /** Red border: the NOW box at Game over, when its Piece is blocked everywhere. */
  blocked?: boolean;
  children: ReactNode;
};

/** A sidebar box: ink border, double inset ring, label on top. */
export default function Box({ label, half, blocked, children }: Props) {
  return (
    <div
      className={`flex flex-col gap-2 border-4 bg-backlight py-3.5 shadow-box ${half ? "flex-1 px-3" : "px-[18px]"} ${blocked ? "border-error" : "border-ink"}`}
    >
      <span className="font-pixel text-[13px]">{label}</span>
      {children}
    </div>
  );
}
