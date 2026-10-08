import Button from "./Button";
import Dialog from "./Dialog";
import Switch from "./Switch";
import type useTheme from "./useTheme";

type Props = {
  theme: ReturnType<typeof useTheme>;
  /** The rotate buttons trade places. */
  swapped: boolean;
  onSwap: () => void;
  onClose: () => void;
};

/** Mobile only, from the header's settings button: theme, dark mode and swapped rotate buttons, then CLOSE. */
export default function SettingsMenu({ theme, swapped, onSwap, onClose }: Props) {
  return (
    <Dialog label="Settings" fullScreen>
      <span className="text-center text-[30px] font-bold tracking-[0.04em] text-shadow-hard">SETTINGS</span>
      <div className="flex flex-col gap-3.5 border-y-3 border-dashed border-dark py-3.5 text-[15px]">
        <div className="flex items-center justify-between gap-3">
          THEME
          <Button variant="setting" aria-label={`Change theme, now ${theme.name}`} onClick={theme.next}>
            Tap
          </Button>
        </div>
        <div className="flex items-center justify-between gap-3">
          DARK MODE
          <Switch label="Dark mode" on={theme.mode === "dark"} onToggle={theme.toggleMode} />
        </div>
        <div className="flex items-center justify-between gap-3">
          SWAP CONTROLS
          <Switch label="Swap controls" on={swapped} onToggle={onSwap} />
        </div>
      </div>
      <Button variant="primary-large" onClick={onClose} autoFocus>
        CLOSE
      </Button>
    </Dialog>
  );
}
