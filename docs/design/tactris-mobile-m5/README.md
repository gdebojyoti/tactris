# Tactris — mobile main screen (M5): design handoff

Layout **M5** — M1's top half (header, stats row, board) with M3's controls underneath. Theme: **Pocket LCD classic**, same as desktop.
Target: V2, portrait phones, touch input. Drawn at 390×844.
This complements the desktop package (`tactris-in-game/`). Colour roles, cell rules and status messages are the same; only sizes and the input model change. Anything not covered here follows the desktop README.

## What's in this folder

| Path | What it is |
|---|---|
| `README.md` | This document. |
| `tokens.css` | Colour tokens — identical to the desktop package (classic + five future themes). |
| `artboards/MobCombo.dc.html` | Source of the M5 artboard. |

**About the artboard:** it is written in the design tool's own format, so it will **not** open in a browser. Read it for exact values. It has two Tweaks: `ghost` (valid / blocked) and `showFinger` (off by default — a marker showing where the finger sits during a drag; kept for reference only, not part of the UI).

---

## Input model (V2): drag to aim, lift to place

This was chosen for fast play (option C from the design discussion).

- **Drag on the board** — the Ghost follows the finger. In the M3 exploration the Ghost floats about **2 rows above the finger** so the finger doesn't hide it; keep that offset (the `showFinger` Tweak shows the finger position relative to the Ghost).
- **Lift the finger** — places the Piece where the Ghost is, if the Ghost is valid.
- **Rotate buttons** — rotate the current Piece anticlockwise / clockwise, around the Ghost's centre (matches desktop story 20).
- The **row preview** and the **status line** work exactly as on desktop while dragging.
- Pointer-centre and edge push-back rules are the same as desktop, applied to the Ghost's (offset) position.

### Still to decide (not designed yet)

- **Lifting while blocked** — suggested: nothing is placed and the Ghost disappears until the next touch.
- **Cancelling a drag** — suggested: dragging off the board and lifting there cancels.
- **A plain tap** (no movement) — with lift-to-place, a tap would place the Piece immediately, 2 rows above the tap. Decide whether a tap should place, only show the Ghost, or be ignored.
- **Haptics** (where supported) — suggested: light tick when the Ghost moves to a new cell, short buzz on a blocked lift, stronger pulse on a line clear.
- **Line-clear flash and game over on mobile** — not drawn yet; reuse the desktop rules scaled down.
- **New user stories** — touch was out of scope in issue #2, so V2 needs stories for the above.

---

## Layout

```
┌ header ──────────────────────────────┐
│ TACTRIS            [NEW GAME] [≡]    │
├──────────────────────────────────────┤
│ ┌ SCORE ────┐┌ LINES ┐┌ BEST ─┐      │
│ └───────────┘└───────┘└───────┘      │
│ ┌──────────── board 10×10 ─────────┐ │
│ │                                  │ │
│ └──────────────────────────────────┘ │
│ > status line                        │
│ [↺] ┌ NOW ┐ ┌ NEXT ┐ [↻]             │
│                                      │
│      DRAG ON THE BOARD TO AIM        │
│      LIFT YOUR FINGER TO PLACE       │
└──────────────────────────────────────┘
```

Drawn at a fixed 390×844, but build it fluid: full width with 16px side padding, full height (`100dvh`), and respect safe areas (`env(safe-area-inset-*)`). The board takes the full content width; the hint text is pinned to the bottom (`margin-top: auto`), so extra height collects above it. Don't draw a fake status bar.

### Header
- Padding 14px 16px; bottom border 3px `ink`.
- Wordmark "TACTRIS": Silkscreen 700, 22px, letter-spacing 0.04em, text-shadow `2px 2px 0 light`.
- **NEW GAME**: primary button — `ink` fill, `backlight` text, Silkscreen 12px, height 44px, padding 0 14px, shadow `3px 3px 0 dark`.
- **Options**: 44×44 icon button — `light` fill, `ink` icon, shadow `3px 3px 0 ink`, `aria-label="Options"`. Icon: three 14×3px bars (pixel "hamburger", `shape-rendering: crispEdges`).
- 10px gap between the two buttons.

### Main area
- Padding 14px 16px 20px; 12px vertical gap between blocks.

### Stats row
- Grid `1.5fr 1fr 1fr`, 10px gap.
- Box: 3px `ink` border, inner rings `inset 0 0 0 2px backlight, inset 0 0 0 4px dark`, `backlight` fill, padding 10px 12px, 6px gap.
- Label: Silkscreen 11px. Value right-aligned, Pixelify Sans 700: SCORE 30px, LINES and BEST 22px.

### Board
- 10-column grid, 2px gap, 7px padding, `light` well, 5px `ink` border, hard shadow `6px 6px 0 dark`.
- At 390px wide the board is about 358px, so each cell is about 31px.

Cell states — same as desktop, with thinner lines for the smaller cells:

| State | Mobile values |
|---|---|
| Empty | `backlight` fill, 1px inset line `ink` @ 12% |
| Placed | 2px `ink` border, `dark` fill, `inset 2px 2px 0 light` |
| Ghost (valid) | `backlight` fill, 2px **dashed** `ink` border, rings `2px backlight / 5px dark` |
| Ghost blocked — over empty | 2px `error` border, `error` cross-hatch (2px lines, ±45°, 4px period) over `backlight` |
| Ghost blocked — over placed | 2px `error` border, `error` fill with 2px `backlight` stripes at 45° (5px period) |
| Row preview | `light` fill, 2px `ink` border, `inset 0 0 0 3px ink`; Ghost cells in that row keep the dashed border with rings `3px ink / 6px light / 8px dark` |

### Status line
- Directly under the board. Silkscreen 13px, min-height 20px (always reserved). Messages as on desktop: `> 1 LINE CLEAR`, `> n LINES CLEAR`, `> BLOCKED`, or empty.

### Controls row
- Grid `64px 1fr 1fr 64px`, 10px gap, items stretch to the same height.
- **Rotate buttons** (left = anticlockwise, right = clockwise): `light` fill, `ink` icon, shadow `4px 4px 0 ink`, full row height, `aria-label`s "Rotate counter-clockwise" / "Rotate clockwise". Icon: 26px circular arrow, stroke 3px, square caps (copy from the artboard).
- **NOW / NEXT** boxes: same border and rings as the stats boxes, padding 8px 10px, content centred. Label Silkscreen 11px. Preview area 32px tall; mini cells 15px with 2px gap, in the placed-piece style (2px `ink` border, `dark` fill, `inset 2px 2px 0 light`).
  - The artboard uses a fixed 3-column mini grid (T and S). In code, size the columns from the Shape, as on desktop, so the 4-wide I fits. It does: 4×15px + 3×2px = 66px, inside about 74px of box width.

### Hint
- Pixelify Sans 15px, line-height 1.4, centred, pinned to the bottom of the screen:
  `DRAG ON THE BOARD TO AIM` / `LIFT YOUR FINGER TO PLACE`.
- Consider showing it only for the first few games.

---

## Differences from desktop

- No CONTROLS box. Its role is taken by the rotate buttons and the bottom hint.
- NEW GAME and Options live in the header; Options is an icon button.
- LINES and BEST sit beside SCORE in one row, not under it.
- NOW / NEXT sit between the rotate buttons, under the board.

## Open questions

- The "Still to decide" items under the input model.
- Small phones (e.g. 360×640): the layout fits on paper, but the hint may need to hide. Check on a device.
- Landscape: not designed for M5. Lock to portrait, or fall back to the desktop layout.
