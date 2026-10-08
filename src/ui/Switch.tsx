/**
 * A blocky on/off switch: a square knob in a square track, with a hard shadow like the buttons. Off, an ink
 * knob on the left; on, the track fills with ink like NEW GAME and the knob moves right. Pressed, it moves
 * down-right into its shadow.
 */
export default function Switch({ label, on, onToggle }: { label: string; on: boolean; onToggle: () => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-label={label}
      onClick={onToggle}
      className={`flex h-8 w-14 cursor-pointer border-3 border-ink p-0.5 shadow-button-sm [-webkit-tap-highlight-color:transparent] active:translate-x-0.75 active:translate-y-0.75 active:shadow-none focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-ink ${on ? "justify-end bg-ink" : "justify-start bg-backlight"}`}
    >
      <span className={`aspect-square h-full ${on ? "bg-backlight" : "bg-ink"}`} />
    </button>
  );
}
