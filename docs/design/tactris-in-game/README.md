# Tactris — in-game screens: design handoff

Design direction: **F · Pocket LCD (classic)** — a four-shade green handheld-LCD look, with red reserved for errors.
Target: desktop, designed at 1440×900, intended to fit 1280×720 without scrolling (not yet verified in a browser).
Spec: [gdebojyoti/tactris#2](https://github.com/gdebojyoti/tactris/issues/2). The spec wins wherever this doc and the spec disagree, except for the deliberate additions listed in [Beyond the spec](#beyond-the-spec).

## What's in this folder

| Path | What it is |
|---|---|
| `README.md` | This document: tokens, components, states and rules. |
| `tokens.css` | Colour tokens for the classic theme plus five future themes. |
| `artboards/*.dc.html` | Source of the 8 in-game artboards from the design canvas. |

**About the artboards:** they are written in the design tool's own format (`<x-dc>`, `<sc-for>`, `{{holes}}`, a `DCLogic` class, `support.js`), so they will **not** open in a browser. Treat them as a reference for exact CSS values. The `cfgs` object near the bottom of each file holds the mock board for every state; all 8 files share the same logic and differ only in which state they show by default.

| Artboard | State shown |
|---|---|
| `GameStart.dc.html` | 1 · New game — empty board, pointer off the board, no Ghost |
| `GamePlay.dc.html` | 2 · Playing — valid Ghost completes 1 row (row preview) |
| `GameMulti.dc.html` | 3 · Playing — valid Ghost completes 2 rows |
| `GameBlocked.dc.html` | 4 · Blocked Ghost |
| `GameFlash.dc.html` | 5 · Line-clear flash, just after placing |
| `GameNoRotate.dc.html` | 6 · Rotation off — no controls box |
| `GameOver.dc.html` | 7 · Game over |
| `GameOverBest.dc.html` | 8 · Game over — new best |

---

## Tokens

### Colour roles (classic theme)

| Role | Hex | Used for |
|---|---|---|
| `ink` | `#0f380f` | Text, all borders, placed-piece outline, flash fill, primary button fill |
| `dark` | `#306230` | Placed-piece fill, inner rings, hard drop shadows |
| `light` | `#8bac0f` | Board well, row-preview fill, top-left highlight on placed cells, secondary button |
| `backlight` | `#9bbc0f` | Page background, empty cells, Ghost fill, panels |
| `error` | `#c4302b` | Blocked Ghost; the piece that caused Game over |

Derived values used in the artboards:

- Empty-cell grid line: `ink` at 12% (`rgba(15,56,15,.12)`).
- Page "LCD pixel" texture: `ink` at 5%, 1px lines every 4px, horizontal and vertical.
- Game over dimming: `backlight` at 78% / 62% alternating 2px scanlines over the board.

**Rule:** red (`error`) appears only for "this can't go here" — the blocked Ghost on the board, and the stuck piece in the NOW box at Game over. Red is never used for text: red on the green background is below 4.5:1 contrast.

### Tailwind 4

`tokens.css` defines the roles as CSS custom properties so themes can switch at runtime. To use them as Tailwind colours (e.g. `bg-ink`, `border-dark`), map them in your CSS entry point. Check this against your Tailwind version; this is the v4 `@theme inline` form:

```css
@import "tailwindcss";
@import "./tokens.css";

@theme inline {
  --color-ink: var(--ink);
  --color-dark: var(--dark);
  --color-light: var(--light);
  --color-backlight: var(--backlight);
  --color-error: var(--error);
  --font-pixel: "Silkscreen", ui-monospace, monospace;
  --font-pixel-body: "Pixelify Sans", ui-monospace, monospace;
}
```

### Type

Both fonts are on Google Fonts (`Silkscreen` 400/700, `Pixelify Sans` 500/700). Self-host them if you'd rather not load from Google.

| Use | Font | Size / weight |
|---|---|---|
| Wordmark "TACTRIS" | Silkscreen | 32px / 700, letter-spacing 0.04em, text-shadow `3px 3px 0 light` |
| Buttons | Silkscreen | 14px (header), 18px (Play again) |
| Box labels (SCORE, LINES, BEST, NOW, NEXT, CONTROLS) | Silkscreen | 13px |
| Status line | Silkscreen | 15px |
| Score (sidebar) | Pixelify Sans | 44px / 700 |
| Lines, Best (sidebar) | Pixelify Sans | 28px / 700 |
| Control hint lines | Pixelify Sans | 15px |
| Game over title | Silkscreen | 30px / 700, text-shadow `3px 3px 0 light` |
| "NEW BEST!" | Silkscreen | 17px / 700, letter-spacing 0.06em |

No rounded corners anywhere. Shadows are always hard (no blur), offset down-right.

---

## Layout

```
┌ header ─────────────────────────────────────────────────────┐
│ TACTRIS                                [NEW GAME] [OPTIONS] │
├─────────────────────────────────────────────────────────────┤
│              ┌──────── board ────────┐   ┌ SCORE ────────┐  │
│              │ 10 × 10               │   ├ LINES ┬ BEST ─┤  │
│              │                       │   ├ NOW   ┬ NEXT ─┤  │
│              │                       │   ├ CONTROLS ─────┤  │
│              └───────────────────────┘   └───────────────┘  │
│              > status line                                  │
└─────────────────────────────────────────────────────────────┘
```

- **Page:** full viewport height, flex column; main area centres board + sidebar with a 44px gap and wraps on narrow widths.
- **Header:** padding 18px 44px, bottom border 4px `ink`.
- **Board width:** `min(560px, 100%, calc(100vh - 200px))` — shrinks with window height so the whole screen fits short laptop screens.
- **Board frame:** 10-column grid, 2px gap, 10px padding, `light` well, 6px `ink` border, hard shadow `8px 8px 0 dark`. Cells are square (`aspect-ratio: 1`).
- **Sidebar:** 250px wide, 16px gap between boxes.

### Buttons

| Button | Fill | Text | Shadow | Height |
|---|---|---|---|---|
| Primary (NEW GAME, PLAY AGAIN) | `ink` | `backlight` | `4px 4px 0 dark` | 44px (52px for Play again, full width) |
| Secondary (OPTIONS) | `light` | `ink` | `4px 4px 0 ink` | 44px |

Hover: primary → `dark` fill; secondary → `backlight` fill.

**Rule:** a solid dark fill + hard offset shadow means "clickable". Don't use that combination on anything that isn't a button (this is why "NEW BEST!" is plain text).

### Sidebar boxes

Every box: 4px `ink` border, inner rings `inset 0 0 0 3px backlight, inset 0 0 0 5px dark`, `backlight` fill, padding 14px 18px (14px 12px for the half-width boxes), label on top, value right-aligned.

| Box | Content |
|---|---|
| SCORE | Full width, current score. |
| LINES · BEST | Side by side, equal width. Lines cleared this game; best score (from `localStorage`). |
| NOW · NEXT | Side by side, **identical size**. Current Piece and Next piece, drawn with 18px mini-cells in the placed-piece style, centred in a fixed 38px-tall preview area so every Shape (including the 4-wide I) fits without resizing the box. |
| CONTROLS | Only when rotation is on. Rows: `CLICK — PLACE`, `WHEEL UP / E — TURN CW`, `WHEEL DOWN / Q — TURN CCW`. |

---

## Board cell states

All cells are square, `box-sizing: border-box`.

| State | Look |
|---|---|
| **Empty** | `backlight` fill, 1px inset line in `ink` @ 12%. |
| **Placed** | 3px `ink` border, `dark` fill, `inset 3px 3px 0 light` highlight (top-left bevel). Every Shape looks the same — no per-Shape colours. |
| **Ghost (valid)** | `backlight` fill, 3px **dashed** `ink` border, inner rings `3px backlight` + `7px dark`. |
| **Ghost blocked — over an empty cell** | 3px `error` border; `error` cross-hatch (2px lines at ±45°, 4px period) over `backlight`. |
| **Ghost blocked — over a placed cell** | 3px `error` border; `error` fill with 2px `backlight` stripes at 45° (5px period). |
| **Row preview** (hovering; this row would complete) | Every cell in the row: `light` fill, 3px `ink` border, `inset 0 0 0 4px ink`. Ghost cells in that row keep the dashed border and add rings `4px ink / 8px light / 11px dark`. |
| **Flash** (~200 ms after placing; row is clearing) | `ink` fill, 3px `ink` border, concentric rings `3px backlight / 6px ink / 9px backlight` — reads as "lit up". |

Preview and flash are deliberately opposite: preview = light cells with a dark ring; flash = dark cells with light rings.

When a Ghost is blocked, **no** row preview is shown.

### Status line

Directly under the board, Silkscreen 15px, prefixed with `> `. Its height (22px) is always reserved so the layout never jumps.

| Situation | Text |
|---|---|
| Pointer off the board, or Ghost completes no row | *(empty)* |
| Valid Ghost completes 1 row | `> 1 LINE CLEAR` |
| Valid Ghost completes n rows | `> n LINES CLEAR` |
| Ghost blocked | `> BLOCKED` |
| During the line-clear flash | *(empty)* |
| Game over | `> NO MOVES LEFT` |

---

## Screens and states

1. **New game** — empty board, score 0, lines 0, best from storage, NOW = first Piece, NEXT = second. No Ghost until the pointer enters the board.
2. **Playing, 1 line** — valid Ghost under the pointer; the row it would complete shows the row preview; status `> 1 LINE CLEAR`.
3. **Playing, several lines** — same, every completed row previewed; status `> 2 LINES CLEAR` etc.
4. **Blocked** — Ghost in the error style; status `> BLOCKED`; clicking does nothing (story 6).
5. **Line-clear flash** — full rows in the flash style for ~200 ms; no Ghost; status empty; clicks ignored (stories 12–13). Score already includes +4 for the placement and the line bonus. Then rows drop and the Ghost reappears with the new Piece (story 25).
6. **Rotation off** — the CONTROLS box is not rendered (story 29); everything else unchanged.
7. **Game over** — board dimmed by `backlight` scanlines; panel centred over the board (story 32):
   - Panel: `min(320px, 100%)` wide, 6px `ink` border, rings `4px backlight / 7px dark`, hard shadow `10px 10px 0 ink`.
   - Contents: `GAME OVER`, then SCORE (44px) and BEST (26px) between 3px dashed `dark` dividers, then a full-width PLAY AGAIN primary button.
   - The NOW box gets a 4px `error` border and its mini-cells use the blocked-over-placed style, showing which Piece fit nowhere.
   - Status `> NO MOVES LEFT`.
8. **Game over — new best** — same as 7, plus a `NEW BEST!` line under the title: plain bold Silkscreen flanked by two 7×7 pixel sparkles (inline SVG, `shape-rendering="crispEdges"`, `ink` cross with `dark` corner dots — copy from `GameOverBest.dc.html`). Score and Best show the same number; the sidebar BEST updates too.

The mouse pointer drawn in artboards 2–4 only shows where the pointer sits relative to the Ghost (the centre rule from the spec). The real game should use the normal system cursor.

---

## Beyond the spec

These were agreed during design but are **not** in issue #2. Update the spec, or treat them as follow-ups:

- **LINES** box — lines cleared in the current game.
- **NOW** box — the current Piece shown in the sidebar (the spec only shows it via the Ghost).
- **NEW GAME** and **OPTIONS** header buttons. What Options contains is not designed yet.
- **Row preview** while hovering.
- **Status line** messages, including `> NO MOVES LEFT`.
- **New best** marker on the Game over panel.
- **Stuck-piece marking** in the NOW box at Game over.

---

## Themes (future)

The classic green is the launch theme. The plan is to let players pick from more colour themes later. Because every colour in the UI goes through the five roles above, a theme is just a different set of five values — switch it by setting `data-theme` on the root element (see `tokens.css`).

| Theme | ink | dark | light | backlight | error |
|---|---|---|---|---|---|
| Classic (default) | `#0f380f` | `#306230` | `#8bac0f` | `#9bbc0f` | `#c4302b` |
| Amber | `#3a1c00` | `#8a4b08` | `#e09a2a` | `#f5b748` | TBD |
| Ice Blue | `#0b1e3a` | `#2c5a8c` | `#8ec3e8` | `#a9d6f2` | TBD |
| Greyscale | `#1f1f1f` | `#5b5b5b` | `#a8a8a0` | `#c6c7bc` | TBD |
| Night (inverted) | `#a6f08e` | `#3f8a4a` | `#1d3322` | `#0f1a12` | TBD |
| Berry | `#3d1030` | `#9b3b78` | `#e8a0c8` | `#f7c6df` | TBD |

Notes for building themes:

- **Error colour is undecided for the five new themes.** They were explored before the red-error rule was settled, so on the canvas their blocked state was pattern-only (`error` = `ink`). Each needs a red picked and checked so it stays distinct from that theme's other four colours — for example, red is weak on Berry's pink and on Amber's orange.
- **Night is inverted:** `ink` is the light colour and `backlight` the dark one. Roles keep their meaning, so no component code changes, but check text contrast and shadows there.
- Hard-coded `rgba(15,56,15,…)` values in the artboards (grid lines, page texture) are `ink` at low alpha. In code, derive them from `--ink` (for example with `color-mix(in srgb, var(--ink) 12%, transparent)`) so they follow the theme.
- A theme picker would naturally live under OPTIONS, which is not designed yet.

---

## Open questions

- 1280×720 fit is by calculation only; check it in a real browser.
- What OPTIONS opens (theme picker, rotation toggle, sound?).
- Error colours for the five future themes.
