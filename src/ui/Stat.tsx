// Each variant is a full set of classes, not an override: two conflicting utilities resolve by Tailwind's
// stylesheet order, not by their order in className.
const VARIANTS = {
  /** The score in the desktop sidebar. */
  score: { stat: "gap-1", label: "text-[13px]", value: "text-[78px] leading-[0.8]" },
  /** Lines and best in the desktop sidebar. */
  minor: { stat: "gap-1", label: "text-[13px]", value: "text-[32px] leading-none" },
  /** The score on mobile. */
  "score-small": { stat: "gap-0.5", label: "text-[11px]", value: "text-[68px] leading-[0.8]" },
  /** Lines and best on mobile. */
  "minor-small": { stat: "gap-0.5", label: "text-[11px]", value: "text-[28px] leading-none" },
};

/** A number with its label on top, unboxed: score, lines or best. */
export default function Stat({ label, value, variant }: { label: string; value: number; variant: keyof typeof VARIANTS }) {
  const classes = VARIANTS[variant];
  return (
    <div className={`flex flex-col ${classes.stat}`}>
      <span className={classes.label}>{label}</span>
      <span className={`font-numbers ${classes.value}`}>{value}</span>
    </div>
  );
}
