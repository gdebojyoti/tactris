import Button from "./Button";
import PixelIcon from "./PixelIcon";
import RoundButton from "./RoundButton";
import type useTheme from "./useTheme";

// Each layout is a full set of classes, not an override: two conflicting utilities resolve by Tailwind's
// stylesheet order, not by their order in className.
const LAYOUTS = {
  desktop: {
    header: "flex flex-wrap items-center justify-between gap-4 border-b-4 border-ink px-11 py-4.5",
    title: "text-[32px] font-bold tracking-[0.04em] text-shadow-hard",
    buttons: "flex items-center gap-4",
    newGame: "primary",
  },
  mobile: {
    header: "flex items-center justify-between gap-3 border-b-3 border-ink px-4 py-3.5",
    title: "text-[22px] font-bold tracking-[0.04em] text-shadow-hard-sm",
    buttons: "flex items-center gap-2.5",
    newGame: "primary-small",
  },
} as const;

type Props = {
  theme: ReturnType<typeof useTheme>;
  onNewGame: () => void;
  /**
   * Mobile: the settings button opens the settings menu, in place of the theme and mode buttons. Always given
   * with `mobile`, and only then, hence `onSettings!` below.
   */
  onSettings?: () => void;
  mobile?: boolean;
};

/** The wordmark, then the theme and mode buttons (settings on mobile) and NEW GAME; smaller on mobile. */
export default function Header({ theme, onNewGame, onSettings, mobile }: Props) {
  const layout = LAYOUTS[mobile ? "mobile" : "desktop"];
  return (
    <header className={layout.header}>
      <span className={layout.title}>TACTRIS</span>
      <div className={layout.buttons}>
        {mobile ? (
          <RoundButton label="Settings" onClick={onSettings!}>
            <PixelIcon name="gear" />
          </RoundButton>
        ) : (
          <>
            <RoundButton label={`Change theme, now ${theme.name}`} onClick={theme.next}>
              <PixelIcon name="palette" />
            </RoundButton>
            {/* The icon shows the mode a click switches to, like the label. */}
            <RoundButton label={`Switch to ${theme.mode === "dark" ? "light" : "dark"} mode`} onClick={theme.toggleMode}>
              <PixelIcon name={theme.mode === "dark" ? "sun" : "moon"} />
            </RoundButton>
          </>
        )}
        <Button variant={layout.newGame} onClick={onNewGame}>
          NEW GAME
        </Button>
      </div>
    </header>
  );
}
