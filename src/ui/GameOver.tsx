import Button from "./Button";
import Dialog from "./Dialog";
import Sparkle from "./Sparkle";

type Props = {
  score: number;
  best: number;
  newBest: boolean;
  onPlayAgain: () => void;
  /** Mobile: the whole screen is dimmed, not just the Board. */
  fullScreen?: boolean;
};

/** Over the dimmed Board: the final score and best, NEW BEST! when it was beaten, and PLAY AGAIN. */
export default function GameOver({ score, best, newBest, onPlayAgain, fullScreen }: Props) {
  return (
    <Dialog label="Game over" fullScreen={fullScreen}>
      <div className="flex flex-col items-center gap-2.5">
        <span className="text-[30px] font-bold tracking-[0.04em] text-shadow-hard">GAME OVER</span>
        {newBest && (
          <div className="flex items-center gap-2.5">
            <Sparkle />
            <span className="text-[17px] tracking-[0.06em]">NEW BEST</span>
            <Sparkle />
          </div>
        )}
      </div>
      <div className="flex flex-col gap-2.5 border-y-[3px] border-dashed border-dark py-3.5">
        <div className="flex items-baseline justify-between gap-3">
          <span className="text-[13px]">SCORE</span>
          <span className="font-numbers text-[44px] leading-none">{score}</span>
        </div>
        <div className="flex items-baseline justify-between gap-3">
          <span className="text-[13px]">BEST</span>
          <span className="font-numbers text-[26px] leading-none">{best}</span>
        </div>
      </div>
      <Button variant="primary-large" onClick={onPlayAgain} autoFocus>
        PLAY AGAIN
      </Button>
    </Dialog>
  );
}
