/** Covers the game when a phone or tablet is held sideways: the mobile layout is portrait only. */
export default function PortraitOnly() {
  return (
    <div className="fixed inset-0 z-10 hidden flex-col items-center justify-center gap-3 bg-backlight p-6 text-center landscape:flex">
      <span className="text-[22px] font-bold tracking-[0.04em] text-shadow-hard-sm">TURN TO PORTRAIT</span>
      <span className="text-[15px]">TACTRIS PLAYS UPRIGHT</span>
    </div>
  );
}
