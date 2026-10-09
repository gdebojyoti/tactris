import { useCallback, useEffect, useRef } from "react";
import type { Game } from "../engine/engine";
import { track } from "./analytics";

/** How the player turned the Piece: mouse wheel, Q/E, or the mobile rotate buttons. */
export type RotateInput = "wheel" | "keys" | "buttons";

const fresh = () => ({
  started: Date.now(),
  pieces: 0,
  rotations: { wheel: 0, keys: 0, buttons: 0 },
  /** Placements tried on a blocked Ghost. */
  blocked: 0,
  cleared: false,
  /** game_left has been sent: it goes once per game. */
  left: false,
});

const summary = (stats: ReturnType<typeof fresh>, game: Game) => ({
  score: game.score,
  lines: game.lines,
  pieces: stats.pieces,
  seconds: Math.round((Date.now() - stats.started) / 1000),
  rotations_wheel: stats.rotations.wheel,
  rotations_keys: stats.rotations.keys,
  rotations_buttons: stats.rotations.buttons,
  blocked: stats.blocked,
});

/**
 * Analytics for each game: the first placement, rotation and line clear the moment they happen, and a summary
 * when the game is over (game_over) or left mid-way (game_left): NEW GAME, or the page hidden, which is a tab
 * closed or switched, an app switched or a phone locked. A closing page doesn't always get to send, so the
 * first-time events don't wait for the end. Report the player's input with `placed`, `blocked` and `rotated`,
 * and call `newGame` before the next game starts.
 */
export default function useGameAnalytics(game: Game) {
  const stats = useRef(fresh());
  // The game as last rendered, for the listeners below.
  const current = useRef(game);
  useEffect(() => {
    current.current = game;
  });

  // Only a game in progress counts as left, once: a player who switches tabs and comes back doesn't send it again.
  const leave = useCallback((via: "new_game" | "page_hidden") => {
    if (stats.current.left || !stats.current.pieces || current.current.gameOver) return;
    stats.current.left = true;
    track("game_left", { ...summary(stats.current, current.current), via });
  }, []);

  // Hidden is the last moment a page can count on: on phones, a closing tab often never fires pagehide. Umami
  // sends with fetch keepalive, so the request outlives the page.
  useEffect(() => {
    const onVisibility = () => {
      if (document.visibilityState === "hidden") leave("page_hidden");
    };
    const onPageHide = () => leave("page_hidden");
    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("pagehide", onPageHide);
    return () => {
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("pagehide", onPageHide);
    };
  }, [leave]);

  // pieces includes the Piece that cleared.
  useEffect(() => {
    if (!game.lines || stats.current.cleared) return;
    stats.current.cleared = true;
    track("first_line_clear", { pieces: stats.current.pieces });
  }, [game.lines]);

  useEffect(() => {
    if (game.gameOver) track("game_over", summary(stats.current, game));
  }, [game.gameOver]);

  // Kept the same across renders, for the Board's wheel listener.
  const rotated = useCallback((input: RotateInput) => {
    if (current.current.gameOver) return;
    const { rotations } = stats.current;
    rotations[input]++;
    if (rotations.wheel + rotations.keys + rotations.buttons === 1) track("first_rotate", { input });
  }, []);

  return {
    placed: () => {
      if (++stats.current.pieces === 1) track("first_place");
    },
    blocked: () => void stats.current.blocked++,
    rotated,
    newGame: (via: "new_game" | "play_again") => {
      if (via === "play_again") track("play_again");
      else leave("new_game");
      stats.current = fresh();
    },
  };
}
