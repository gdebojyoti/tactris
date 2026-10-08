import type { ComponentProps } from "react";

// Each variant is a full set of classes, not an override: two conflicting utilities resolve by Tailwind's
// stylesheet order, not by their order in className.
const VARIANTS = {
  /** NEW GAME on desktop. */
  primary: "h-11 bg-ink px-4.5 text-[14px] text-backlight shadow-button hover:bg-dark active:translate-x-1 active:translate-y-1",
  /** NEW GAME on mobile: smaller, with a thinner shadow. */
  "primary-small": "h-11 bg-ink px-3.5 text-[12px] text-backlight shadow-button-sm hover:bg-dark active:translate-x-0.75 active:translate-y-0.75",
  /** Tap in the settings menu: styled like NEW GAME on mobile, and the same size as the switches under it. */
  setting: "h-8 w-14 bg-ink text-[12px] text-backlight shadow-button-sm hover:bg-dark active:translate-x-0.75 active:translate-y-0.75",
  /** PLAY AGAIN. */
  "primary-large": "h-13 w-full bg-ink text-[18px] text-backlight shadow-button hover:bg-dark active:translate-x-1 active:translate-y-1",
  /** The square mobile rotate buttons: light, with an ink shadow. */
  rotate: "grid size-16 place-items-center self-center bg-light text-ink shadow-rotate active:translate-x-1 active:translate-y-1",
};

/**
 * A button with a hard shadow, which in this design always means "clickable". Pressed, it moves down-right
 * into its shadow and the shadow goes. Hover only applies on devices that can hover (Tailwind's default),
 * so after a tap a touch screen goes straight back to normal.
 */
export default function Button({ variant = "primary", ...props }: ComponentProps<"button"> & { variant?: keyof typeof VARIANTS }) {
  return (
    <button
      type="button"
      className={`${VARIANTS[variant]} cursor-pointer [-webkit-tap-highlight-color:transparent] active:shadow-none focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-ink`}
      {...props}
    />
  );
}
