import { useEffect, useState } from "react";
import { track } from "./analytics";
import { readCookie, writeCookie } from "./cookie";

const SWAP_COOKIE = "tactris-swap";

/**
 * Swap controls, from the mobile settings: when on, the rotate buttons trade places. `toggle` turns it on
 * or off; the choice is kept in a cookie.
 */
export default function useSwap() {
  const [swapped, setSwapped] = useState(() => readCookie(SWAP_COOKIE) === "on");
  useEffect(() => writeCookie(SWAP_COOKIE, swapped ? "on" : "off"), [swapped]);
  // Not an updater function: StrictMode runs those twice, which would track twice.
  const toggle = () => {
    const on = !swapped;
    setSwapped(on);
    track("swap_change", { swapped: on });
  };
  return { swapped, toggle };
}
