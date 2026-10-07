import type { ReactNode } from "react";

/**
 * A round icon button in the header: just the icon, in ink, on a 44px target as tall as NEW GAME. On hover
 * the icon takes the shadow's colour, and pressed it moves 4px down-right like NEW GAME. The label is for screen readers and shows as a tooltip, since the
 * icon has no text. Round so the keyboard focus ring is a circle.
 */
export default function RoundButton({ label, onClick, children }: { label: string; onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      className="grid size-11 cursor-pointer place-items-center rounded-full text-ink hover:text-dark [-webkit-tap-highlight-color:transparent] active:translate-x-1 active:translate-y-1 focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-ink"
    >
      {children}
    </button>
  );
}
