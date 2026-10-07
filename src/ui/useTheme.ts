import { useEffect, useState, type RefObject } from "react";

// The colour themes, in the order the theme button cycles through them. The colours are in tactris.css.
const THEMES = [
  { id: "classic", name: "Classic" },
  { id: "amber", name: "Amber" },
  { id: "ice-blue", name: "Ice Blue" },
  { id: "greyscale", name: "Greyscale" },
  { id: "berry", name: "Berry" },
] as const;
type Theme = (typeof THEMES)[number];

// The chosen theme is kept in a cookie for a year. Cookies can be blocked too (sandboxed frames), and an
// unknown value falls back to Classic.
const COOKIE = "tactris-theme";
const load = (): Theme => {
  try {
    const saved = document.cookie
      .split("; ")
      .find((cookie) => cookie.startsWith(`${COOKIE}=`))
      ?.slice(COOKIE.length + 1);
    return THEMES.find((theme) => theme.id === saved) ?? THEMES[0];
  } catch {
    return THEMES[0];
  }
};
const save = (theme: Theme) => {
  try {
    document.cookie = `${COOKIE}=${theme.id}; path=/; max-age=31536000; SameSite=Lax`;
  } catch {
    // Not saved; the theme still applies for this visit.
  }
};

/**
 * The current colour theme, for data-theme on the game's root, and `next` to switch to the following one.
 * The browser's address bar takes the theme's page colour, read from the root's CSS so it's defined once.
 */
export default function useTheme(root: RefObject<HTMLElement | null>) {
  const [theme, setTheme] = useState(load);
  useEffect(() => {
    const backlight = getComputedStyle(root.current!).getPropertyValue("--backlight").trim();
    document.querySelector('meta[name="theme-color"]')?.setAttribute("content", backlight);
  }, [root, theme]);

  const next = () => {
    const following = THEMES[(THEMES.indexOf(theme) + 1) % THEMES.length];
    setTheme(following);
    save(following);
  };
  return { id: theme.id, name: theme.name, next };
}
