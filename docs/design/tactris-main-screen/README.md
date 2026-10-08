# Tactris — main screen (desktop & mobile): design update

This package updates the two earlier handoffs:

- `tactris-in-game/` — desktop in-game screens
- `tactris-mobile-m5/` — mobile main screen (M5)

**It lists only what changed.** Everything not mentioned below — colours, the board and its cell states, the status line, the header, the NOW/NEXT boxes, the input models — is unchanged; follow the earlier READMEs for those.

## What's in this folder

| Path | What it is |
|---|---|
| `README.md` | This document — the changes since the last two exports. |
| `tokens.css` | Colour tokens. **Unchanged**, included for convenience. |
| `artboards/Desktop.dc.html` | Updated desktop main screen (replaces `GamePlay.dc.html` as the reference). |
| `artboards/Mobile.dc.html` | Updated mobile main screen (replaces `MobCombo.dc.html` as the reference). |

As before, the artboards are in the design tool's own format and won't open in a browser — read them for exact values. `Desktop.dc.html` still has the `state` Tweak (new game, playing, multi-line, blocked, flash, rotation off); all of those states share the new sidebar.

---

## 1. Fonts (both screens)

- **Pixelify Sans is removed entirely.**
- The stat numbers (score, lines, best) now use **VT323**. VT323 has only one weight, so the numbers are regular (400), never bold.
- VT323 is also the page's default font (the root element's `font-family`), replacing Pixelify Sans.
- Everything else is **Silkscreen**, including the desktop control lines and the mobile hint, which used Pixelify Sans before.
- Google Fonts request: `family=Silkscreen:wght@400;700&family=VT323`.

The screens now use exactly two fonts:

| Font | Used for |
|---|---|
| Silkscreen | Wordmark, buttons, labels, status line, desktop control lines, mobile hint |
| VT323 | Score, lines and best numbers only |

If you used the Tailwind snippet from the desktop README, change `--font-pixel-body` from `"Pixelify Sans"` to `"VT323"`, or rename it to something like `--font-numbers`.

---

## 2. Desktop changes

### Stats — no longer boxed
SCORE, LINES and BEST are plain text now: no borders, inner rings or background, and no divider line.

- **Layout:** two rows, 14px apart.
  - Row 1: **SCORE** alone.
  - Row 2: **LINES** and **BEST** side by side, 40px apart.
- **Each stat:** label on top (Silkscreen 13px), value below, with a 4px gap.
- **Values (VT323, 400):**
  - Score: 78px, line-height 0.8.
  - Lines and Best: 32px, line-height 1.

### CONTROLS — no longer boxed
- The box's border, inner rings and background are removed.
- The `CONTROLS` label stays (Silkscreen 13px).
- The three control lines are now **Silkscreen 15px**; they were Pixelify Sans. Layout is unchanged: key on the left, action on the right, 10px between lines.

### NOW / NEXT spacing
The boxes themselves are unchanged. The row now has a margin of `14px 0 44px`. Combined with the sidebar's 16px gap, that gives:
- 30px above NOW/NEXT
- 60px below it

### Sidebar width
**250px → 270px.** This gives the control lines more space between key and action. NOW/NEXT stretch with it, so their edges stay aligned with the control lines.

### Not yet updated to match
- The **Game over** screens (`GameOver` / `GameOverBest` in the first package) still show the old boxed sidebar.
- Apply the same sidebar changes there; the game over panel itself is unchanged.

---

## 3. Mobile changes

### Stats — no longer boxed, top-aligned
SCORE, LINES and BEST are plain text now: no borders, rings or background, and no divider line.

- **Layout:** one row, `justify-content: space-between`, **top-aligned** (`align-items: flex-start`), so the three labels sit on the same line.
  - Left: **SCORE**.
  - Right: **LINES** and **BEST** side by side, 24px apart.
- **Each stat:** label on top (Silkscreen 11px), value below, with a 2px gap.
- **Values (VT323, 400):**
  - Score: 68px, line-height 0.8.
  - Lines and Best: 28px, line-height 1.

### Hint
- Now **Silkscreen 15px**; it was Pixelify Sans. Same text, centred, pinned to the bottom.
- **DRAG**, **AIM**, **LIFT** and **PLACE** are bold (700); the rest is regular (400):
  `**DRAG** ON THE BOARD TO **AIM**` / `**LIFT** YOUR FINGER TO **PLACE**`

---

## Please check in a browser

These weren't rendered during design, and Silkscreen is wider than the font it replaced:

- **Desktop:** the longest control line, `WHEEL DOWN / Q — TURN CCW`, inside the 270px sidebar. If it wraps, drop the control lines to 13px.
- **Mobile:** the first hint line, `DRAG ON THE BOARD TO AIM` (with two bold words), inside about 358px of width. If it wraps, drop the hint to 13px.
- **Desktop:** a 5-digit score (10,000+) at 78px VT323 should fit easily, since VT323 is narrow, but it's worth a glance.
