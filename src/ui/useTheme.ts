import { useEffect, useState, type RefObject } from "react";
import { track } from "./analytics";
import { readCookie, writeCookie } from "./cookie";

// The colour themes, in the order the theme button cycles through them. Each has a light and a dark mode;
// the colours are in tactris.css.
const THEMES = [
  { id: "classic", name: "Classic" },
  { id: "amber", name: "Amber" },
  { id: "ice-blue", name: "Ice Blue" },
  { id: "greyscale", name: "Greyscale" },
  { id: "berry", name: "Berry" },
] as const;
type Theme = (typeof THEMES)[number];
type Mode = "light" | "dark";

// The theme and mode are each kept in a cookie; a missing or unknown value is ignored.
const THEME_COOKIE = "tactris-theme";
const MODE_COOKIE = "tactris-mode";
const loadTheme = (): Theme => THEMES.find((theme) => theme.id === readCookie(THEME_COOKIE)) ?? THEMES[0];
// Light until the player picks dark, whatever the device's own light or dark setting.
const loadMode = (): Mode => (readCookie(MODE_COOKIE) === "dark" ? "dark" : "light");

/**
 * The current colour theme and mode, for data-theme and data-mode on the game's root, with `next` to
 * switch to the following theme and `toggleMode` to swap light and dark. The browser's address bar takes
 * the page colour, read from the root's CSS so it's defined once.
 */
export default function useTheme(root: RefObject<HTMLElement | null>) {
  const [theme, setTheme] = useState(loadTheme);
  const [mode, setMode] = useState(loadMode);

  useEffect(() => {
    const backlight = getComputedStyle(root.current!).getPropertyValue("--backlight").trim();
    document.querySelector('meta[name="theme-color"]')?.setAttribute("content", backlight);
  }, [root, theme, mode]);

  const next = () => {
    const following = THEMES[(THEMES.indexOf(theme) + 1) % THEMES.length];
    setTheme(following);
    writeCookie(THEME_COOKIE, following.id);
    track("theme_change", { theme: following.id });
  };
  const toggleMode = () => {
    const other = mode === "dark" ? "light" : "dark";
    setMode(other);
    writeCookie(MODE_COOKIE, other);
    track("mode_change", { mode: other });
  };
  return { id: theme.id, name: theme.name, next, mode, toggleMode };
}
