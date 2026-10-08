import Button from "./Button";
import Sparkle from "./Sparkle";

type Props = {
  score: number;
  best: number;
  newBest: boolean;
  onPlayAgain: () => void;
  /** Mobile: the Board is too small to hold the panel, so the whole screen is dimmed instead. */
  fullScreen?: boolean;
};

/** Over the dimmed Board: the final score and best, NEW BEST! when it was beaten, and PLAY AGAIN. */
export default function GameOver({ score, best, newBest, onPlayAgain, fullScreen }: Props) {
  return (
    <div className={`game-over-dim flex items-center justify-center ${fullScreen ? "fixed inset-0 z-10 p-4" : "absolute inset-1.5 p-6"}`}>
      <div
        role="dialog"
        aria-label="Game over"
        className="flex w-[min(320px,100%)] flex-col gap-4.5 border-[6px] border-ink bg-backlight px-6.5 pt-6.5 pb-6 shadow-panel"
      >
        <div className="flex flex-col items-center gap-2.5">
          <span className="font-pixel text-[30px] font-bold tracking-[0.04em] text-shadow-hard">GAME OVER</span>
          {newBest && (
            <div className="flex items-center gap-2.5">
              <Sparkle />
              <span className="font-pixel text-[17px] font-bold tracking-[0.06em]">NEW BEST!</span>
              <Sparkle />
            </div>
          )}
        </div>
        <div className="flex flex-col gap-2.5 border-y-[3px] border-dashed border-dark py-3.5">
          <div className="flex items-baseline justify-between gap-3">
            <span className="font-pixel text-[13px]">SCORE</span>
            <span className="text-[44px] leading-none font-bold">{score}</span>
          </div>
          <div className="flex items-baseline justify-between gap-3">
            <span className="font-pixel text-[13px]">BEST</span>
            <span className="text-[26px] leading-none font-bold">{best}</span>
          </div>
        </div>
        <Button large onClick={onPlayAgain} autoFocus>
          PLAY AGAIN
        </Button>
      </div>
    </div>
  );
}
