// A clockwise circular arrow, as in the mobile design: the head is a bracket at the top right, its corner
// the tip, with a two-pixel gap before the tail below it.
const ROTATE_CW = [
  ".........#.",
  "...#####.#.",
  "..#.....##.",
  ".#....####.",
  ".#.........",
  ".#.........",
  ".#.......#.",
  ".#.......#.",
  "..#.....#..",
  "...#####...",
  "...........",
];

// Each icon is an 11×11 grid, "#" for a filled pixel, drawn at 3px a pixel like the Sparkle.
const ICONS = {
  rotateCw: ROTATE_CW,
  rotateCcw: ROTATE_CW.map((row) => [...row].reverse().join("")),
  palette: [
    "....###....",
    "..##...##..",
    ".#.......#.",
    ".#...#...#.",
    "#..#...#..#",
    "#.......###",
    "#......#...",
    ".#.#..#....",
    ".#....#....",
    "..##..#....",
    "....###....",
  ],
  sun: [
    ".....#.....",
    ".#...#...#.",
    "..#.....#..",
    "....###....",
    "...#####...",
    "##.#####.##",
    "...#####...",
    "....###....",
    "..#.....#..",
    ".#...#...#.",
    ".....#.....",
  ],
  moon: [
    "....#......",
    "..###......",
    ".###.......",
    ".###.......",
    "####.......",
    "#####......",
    "#####......",
    ".######....",
    ".#########.",
    "..#######..",
    "....###....",
  ],
};

/** A pixel icon for the header and rotate buttons, one rect per run of filled pixels, in the text colour. */
export default function PixelIcon({ name }: { name: keyof typeof ICONS }) {
  return (
    <svg width="33" height="33" viewBox="0 0 11 11" shapeRendering="crispEdges" fill="currentColor" aria-hidden="true">
      {ICONS[name].flatMap((row, y) =>
        [...row.matchAll(/#+/g)].map((run) => (
          <rect key={`${run.index},${y}`} x={run.index} y={y} width={run[0].length} height="1" />
        )),
      )}
    </svg>
  );
}
