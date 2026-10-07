import type { ComponentProps } from "react";

/**
 * The primary button: solid ink with a hard shadow, which in this design always means "clickable".
 * Each size is a full set of classes, not an override: two conflicting utilities resolve by Tailwind's
 * stylesheet order, not by their order in className.
 */
export default function Button({ large, ...props }: ComponentProps<"button"> & { large?: boolean }) {
  const size = large ? "h-13 w-full text-[18px]" : "h-11 px-4.5 text-[14px]";
  return (
    <button
      className={`${size} cursor-pointer bg-ink font-pixel text-backlight shadow-button hover:bg-dark focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-ink`}
      {...props}
    />
  );
}
