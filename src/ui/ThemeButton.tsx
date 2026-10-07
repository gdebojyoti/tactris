/**
 * The round button that switches to the next colour theme: an empty ring in the page colour, with the
 * NEW GAME button's ink and hard shadow, and the same press into the shadow (see Button). On hover the
 * ring takes the shadow's colour.
 */
export default function ThemeButton({ theme, onClick }: { theme: string; onClick: () => void }) {
  const label = `Change theme, now ${theme}`;
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
