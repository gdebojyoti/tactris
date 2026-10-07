/**
 * A round button in the header: an empty ring in the page colour, with the NEW GAME button's ink and hard
 * shadow, and the same press into the shadow (see Button). On hover the ring takes the shadow's colour.
 * The label is for screen readers and shows as a tooltip, since the ring itself says nothing.
 */
export default function RoundButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      className="size-11 cursor-pointer rounded-full border-3 border-ink bg-backlight shadow-button hover:border-dark [-webkit-tap-highlight-color:transparent] active:translate-x-1 active:translate-y-1 active:shadow-none focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-ink"
    />
  );
}
