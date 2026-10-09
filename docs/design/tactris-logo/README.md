# Tactris — logo handoff ("Block T")

The chosen logo is **L2 · Block T**, used as a **standalone mark next to** the TACTRIS wordmark. It is not the first letter of the word.

This package adds the logo to the earlier handoffs (`tactris-in-game/`, `tactris-mobile-m5/`, `tactris-main-screen/`). Nothing else in those packages changes except the headers, described below.

## What's in this folder

| Path | What it is |
|---|---|
| `README.md` | This document. |
| `TactrisMark.tsx` | Drop-in React component for the mark (inline SVG, `light` / `dark` variants). |
| `svg/tactris-mark.svg` | Mark for light backgrounds (38×38). |
| `svg/tactris-mark-inverted.svg` | Mark for dark backgrounds (38×38). |
| `svg/app-icon.svg` | Square app icon: inverted mark on ink, with padding (512px, scalable). |
| `svg/favicon.svg` | Simplified 32px favicon (see "Small sizes"). |
| `artboards/LogoBlockT.dc.html` | Logo exploration board, for reference only. It shows the mark as part of the word, which was **not** chosen. |
| `artboards/HeaderDesktop.dc.html` | Desktop header with the chosen treatment. |
| `artboards/HeaderMobile.dc.html` | Mobile header with the chosen treatment. |

The `.dc.html` artboards are in the design tool's own format and won't open in a browser; read them for values. The SVGs and the TSX are ready to use.

---

## The mark

Five cells on a 3×3 grid, forming a "T":

```
■ ■ ■     row 1: three placed blocks
  ■       row 2: one placed block (the stem)
  ⬚       row 3: one ghost block (dashed), the piece "being placed"
```

- **Construction:** 12-unit cells with 1-unit gaps on a **38×38** grid.
- **Crisp sizes:** whole multiples of 38px (38, 76, 114…) render pixel-crisp. Other sizes work but may soften slightly.
- **Same visual language as the game:**
  - Placed cells: ink border, dark-green fill, light-green top-left bevel.
  - Ghost cell: dashed ink border, then a background-coloured ring, then a dark-green ring.
  - Proportions match the NOW/NEXT previews, not the larger board cells.
- **Two deliberate liberties**, accepted in design review:
  - The 5-cell T isn't one of the game's seven 4-cell shapes.
  - In the game a Ghost is never mixed with placed cells. Here it is, as a metaphor for "the last block going in".

### Geometry (in 38-unit space)

| Part | Value |
|---|---|
| Placed cells at | (0,0), (13,0), (26,0), (13,13) |
| Ghost cell at | (13,26) |
| Placed cell | 12×12 `edge` square; inner 8×8 `fill` at (2,2); 1-unit `hi` bevel along the top and left of the fill |
| Ghost cell | 1-unit dashed `edge` outline (dash 2, gap 1), inset 0.5; 2-unit `ring` stroke around a 6×6 square at (3,3) |

### Colours

| Role | Light variant (on `#9bbc0f`) | Dark variant (on `#0f380f`) |
|---|---|---|
| edge | `#0f380f` ink | `#9bbc0f` backlight |
| fill | `#306230` dark | `#8bac0f` light |
| hi (bevel) | `#8bac0f` light | `#9bbc0f` backlight |
| ring (ghost) | `#306230` dark | `#8bac0f` light |

These are the classic-theme values. The SVG files hard-code them. For future themes, use `TactrisMark.tsx` and swap the hex values for the CSS variables in `tokens.css` (`var(--ink)` and so on); the role mapping above stays the same.

### Small sizes (favicon)

Below about 24px, the dashes and bevel turn to mush. `favicon.svg` is a simplified version:
- no bevel
- a solid ghost outline instead of a dashed one
- thicker strokes

Use it for 16px and 32px favicons only.

### Clear space and minimum size
- **Clear space:** at least one cell (12 units, about ⅓ of the mark's width) on every side.
- **Minimum size:** 24px for the full mark; below that, use the favicon version.

---

## Headers

### Desktop
The **mark followed by the full "TACTRIS" wordmark** on the left; NEW GAME and OPTIONS on the right. Everything else in the header is unchanged.

- **Mark:** 38px (cells drawn at 12px with a 1px gap), vertically centred with the wordmark.
- **Gap between mark and wordmark:** 14px.
- **Wordmark:** unchanged — Silkscreen 700, 32px, letter-spacing 0.04em, text-shadow `3px 3px 0 #8bac0f`.
- **Header:** padding `18px 44px`, bottom border `4px solid #0f380f`, as before.
- **Accessibility:** since the word is visible, the mark can be decorative (`title=""` in `TactrisMark`).

```tsx
<div className="flex items-center gap-[14px]">
  <TactrisMark size={38} title="" />
  <span className="font-pixel font-bold text-[32px] tracking-[0.04em] [text-shadow:3px_3px_0_#8bac0f]">TACTRIS</span>
</div>
```

### Mobile
The **mark alone**, with no wordmark; then NEW GAME and the Options menu button on the right.

- **Mark:** 38px. It replaces the 22px "TACTRIS" text.
- **Header:** padding `14px 16px`, bottom border `3px solid #0f380f`; buttons unchanged.
- **Accessibility:** the mark is the only brand element here, so keep its accessible name (`title="Tactris"`, the default). If it links home, put the label on the link.

---

## Other uses

| Use | File |
|---|---|
| Light surfaces (in-game header) | `tactris-mark.svg` / `<TactrisMark variant="light" />` |
| Dark surfaces | `tactris-mark-inverted.svg` / `<TactrisMark variant="dark" />` |
| PWA / home-screen icon | `app-icon.svg` (export PNGs at 192 and 512 if your manifest needs them) |
| Browser tab | `favicon.svg` |

## Not yet updated

- The **game over screens** show the old text-only header. Apply the header change there too.
- The **name**: per issue #2, "Tactris" is a placeholder because the name is taken. The mark doesn't depend on the name; only the wordmark text and the accessible labels would change.
