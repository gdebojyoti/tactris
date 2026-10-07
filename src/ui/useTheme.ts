import { useEffect, useState, type RefObject } from "react";

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

// The theme and mode are each kept in a cookie for a year. Cookies can be blocked too (sandboxed frames),
// and a missing or unknown value is ignored.
const readCookie = (name: string) => {
  try {
    return document.cookie
      .split("; ")
      .find((cookie) => cookie.startsWith(`${name}=`))
      ?.slice(name.length + 1);
  } catch {
    return undefined;
  }
};
const writeCookie = (name: string, value: string) => {
  try {
    document.cookie = `${name}=${value}; path=/; max-age=31536000; SameSite=Lax`;
  } catch {
    // Not saved; the choice still applies for this visit.
  }
};
const THEME_COOKIE = "tactris-theme";
const MODE_COOKIE = "tactris-mode";
const loadTheme = (): Theme => THEMES.find((theme) => theme.id === readCookie(THEME_COOKIE)) ?? THEMES[0];
const loadMode = (): Mode | null => {
  const saved = readCookie(MODE_COOKIE);
  return saved === "light" || saved === "dark" ? saved : null;
};

// Until the player picks a mode, the game follows the device's light or dark setting, even as it changes.
const DARK_QUERY = "(prefers-color-scheme: dark)";
const deviceMode = (): Mode => (window.matchMedia?.(DARK_QUERY).matches ? "dark" : "light");

/**
 * The current colour theme and mode, for data-theme and data-mode on the game's root, with `next` to
 * switch to the following theme and `toggleMode` to swap light and dark. The browser's address bar takes
 * the page colour, read from the root's CSS so it's defined once.
 */
export default function useTheme(root: RefObject<HTMLElement | null>) {
  const [theme, setTheme] = useState(loadTheme);
  const [chosenMode, setChosenMode] = useState(loadMode);
  const [device, setDevice] = useState(deviceMode);
  useEffect(() => {
    const query = window.matchMedia?.(DARK_QUERY);
    const onChange = () => setDevice(deviceMode());
    query?.addEventListener("change", onChange);
    return () => query?.removeEventListener("change", onChange);
  }, []);
  const mode = chosenMode ?? device;

  useEffect(() => {
    const backlight = getComputedStyle(root.current!).getPropertyValue("--backlight").trim();
    document.querySelector('meta[name="theme-color"]')?.setAttribute("content", backlight);
  }, [root, theme, mode]);

  const next = () => {
    const following = THEMES[(THEMES.indexOf(theme) + 1) % THEMES.length];
    setTheme(following);
    writeCookie(THEME_COOKIE, following.id);
  };
  const toggleMode = () => {
    const other = mode === "dark" ? "light" : "dark";
    setChosenMode(other);
    writeCookie(MODE_COOKIE, other);
  };
  return { id: theme.id, name: theme.name, next, mode, toggleMode };
}
