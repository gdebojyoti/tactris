import type { ReactNode } from "react";

/**
 * A round icon button in the header: a ring in the page colour, with the NEW GAME button's ink and hard
 * shadow, and the same press into the shadow (see Button). On hover the ring takes the shadow's colour.
 * The label is for screen readers and shows as a tooltip, since the icon has no text.
 */
export default function RoundButton({ label, onClick, children }: { label: string; onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      className="grid size-11 cursor-pointer place-items-center rounded-full border-3 border-ink bg-backlight text-ink shadow-button hover:border-dark [-webkit-tap-highlight-color:transparent] active:translate-x-1 active:translate-y-1 active:shadow-none focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-ink"
    >
      {children}
    </button>
  );
}
