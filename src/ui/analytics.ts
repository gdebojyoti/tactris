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
 */
export const track = (event: string, data?: Data) =>
  void window.umami?.track(event, { layout: MOBILE ? "mobile" : "desktop", ...data });
