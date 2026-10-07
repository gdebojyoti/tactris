import { useEffect, useState } from "react";

// Storage can be missing or blocked (private windows, blocked site data), so the best score is optional.
const KEY = "tactris.best";
const load = () => {
  try {
    return Number(localStorage.getItem(KEY)) || 0;
  } catch {
    return 0;
  }
};
const save = (score: number) => {
  try {
    localStorage.setItem(KEY, String(score));
  } catch {
    // Not saved; the best score still shows for this visit.
  }
};

/**
 * The best score, which updates, and is saved, the moment the game's score passes it. `newBest` says
 * whether this game has beaten the best score it started with; call `newGame` when a game starts.
 */
export default function useBest(score: number) {
  const [best, setBest] = useState(load);
  useEffect(() => {
    if (score <= best) return;
    setBest(score);
    save(score);
  }, [score, best]);

  const [bestBefore, setBestBefore] = useState(best);
  return { score: best, newBest: score > bestBefore, newGame: () => setBestBefore(best) };
}
