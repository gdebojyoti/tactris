import type { ReactNode } from "react";

type Props = {
  label: string;
  /** Mobile: the Board is too small to hold the panel, so the whole screen is dimmed instead. */
  fullScreen: boolean;
  children: ReactNode;
};

/**
 * A panel over a dimmed Board, or the whole dimmed screen: Game over and the mobile settings. Tapping the
 * dim does nothing; each panel has its own button to leave it.
 */
export default function Dialog({ label, fullScreen, children }: Props) {
  return (
    <div className={`dialog-dim flex items-center justify-center ${fullScreen ? "fixed inset-0 z-10 p-4" : "absolute inset-1.5 p-6"}`}>
      <div
        role="dialog"
        aria-label={label}
        className="flex w-[min(320px,100%)] flex-col gap-4.5 border-[6px] border-ink bg-backlight px-6.5 pt-6.5 pb-6 shadow-panel"
      >
        {children}
      </div>
    </div>
  );
}
