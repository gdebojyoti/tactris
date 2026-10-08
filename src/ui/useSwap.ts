import { useEffect, useState } from "react";
import { readCookie, writeCookie } from "./cookie";

const SWAP_COOKIE = "tactris-swap";

/**
 * Swap controls, from the mobile settings: when on, the rotate buttons trade places. `toggle` turns it on
 * or off; the choice is kept in a cookie.
 */
export default function useSwap() {
  const [swapped, setSwapped] = useState(() => readCookie(SWAP_COOKIE) === "on");
  useEffect(() => writeCookie(SWAP_COOKIE, swapped ? "on" : "off"), [swapped]);
  const toggle = () => setSwapped((on) => !on);
  return { swapped, toggle };
}
