import { MOBILE } from "./mobile";

type Data = Record<string, string | number | boolean>;

// Set by the Umami script in index.html.
declare global {
  interface Window {
    umami?: { track: (event: string, data?: Data) => Promise<void> };
  }
}

/**
 * Sends an event to Umami, with the layout: Umami files iPads under desktop, by their user agent. Does nothing
 * when the script hasn't loaded or is blocked, or off tablehop.games.
 *
 * The name gets a `tactris_` prefix: every TableHop game shares one Umami website, and Goals and Funnels pick
 * events by name, so each game's events need names of their own.
 */
export const track = (event: string, data?: Data) =>
  void window.umami?.track(`tactris_${event}`, { layout: MOBILE ? "mobile" : "desktop", ...data });
