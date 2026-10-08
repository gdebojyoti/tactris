import type { ComponentProps } from "react";

/**
 * The primary button: solid ink with a hard shadow, which in this design always means "clickable".
 * Pressed, it moves down-right into its shadow and the shadow goes, keeping its colour. Hover only applies
 * on devices that can hover (Tailwind's default), so after a tap a touch screen goes straight back to normal.
 * Each size is a full set of classes, not an override: two conflicting utilities resolve by Tailwind's
 * stylesheet order, not by their order in className.
 */
export default function Button({ large, small, ...props }: ComponentProps<"button"> & { large?: boolean; small?: boolean }) {
  const size = large
    ? "h-13 w-full text-[18px] shadow-button active:translate-x-1 active:translate-y-1"
    : small
      ? "h-11 px-3.5 text-[12px] shadow-button-sm active:translate-x-0.75 active:translate-y-0.75"
      : "h-11 px-4.5 text-[14px] shadow-button active:translate-x-1 active:translate-y-1";
  return (
    <button
      className={`${size} cursor-pointer bg-ink font-pixel text-backlight [-webkit-tap-highlight-color:transparent] hover:bg-dark active:shadow-none focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-ink`}
      {...props}
    />
  );
}
