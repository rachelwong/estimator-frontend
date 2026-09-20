# Fold and Flip — design reference

Reference material for the design build. Not shipped to users, and not imported
by the app.

The spec is [`DESIGN.md`](../DESIGN.md) at the repo root. The build sequence is
[`docs/plans/fold-and-flip.md`](../docs/plans/fold-and-flip.md). Everything in
here is reference for those two.

## screens/

The final design-canvas artboards, one file per screen and size. They are
**reference source, not runnable pages**: they were written for the design
canvas runtime, so opening one directly shows raw `{{…}}` placeholders and
`<sc-if>` / `<sc-for>` tags. Read them for exact markup, inline styles, colours,
spacing, copy and pixel-art SVG. The `<script>` block at the bottom of each file
holds the interaction logic: grid states, Area, Selection toggle, Reveal
popover, share-link copy, mobile menu and logo flip.

| File | Route / role |
| --- | --- |
| `Pixel-Landing(-Tablet/-Mobile)` | `/welcome` |
| `Pixel-Landing-Mobile-Menu` | `/welcome`, mobile menu open |
| `Pixel-Create(-Tablet/-Mobile)` | `/new` |
| `Pixel-Join(-Tablet/-Mobile)` | `/:id/join` |
| `Pixel-Session(-Tablet/-Mobile)` | `/:id/start` (Admin; `share` prop picks bar/header/window) |
| `Pixel-Session-Ended(-Tablet/-Mobile)` | `/:id/ended` (Reveal) |
| `FF-Error-C(-Tablet/-Mobile)` | not found / connection lost / error (`kind` prop) |
| `FF-Loaders` | loader spec (option C chosen) |
| `FF-Tooltips`, `FF-Palettes`, `FF-Logo`, `FF-Spotlight(-Mobile)`, `Pixel-HeroFonts` | spec boards |

Values inside `{{…}}` resolve from the script block. Resolve them against
palette `grape`, hero font `bungee`, logo mark `card` — the other branches are
unchosen alternatives and get dropped.

## sprites/

Every pixel-art sprite as a standalone SVG, 8px per art pixel, with the white
sticker outline baked in. They use `shape-rendering="crispEdges"`, so scale them
by whole multiples. The floating drop shadow is applied in CSS
(`filter: drop-shadow(3px 3px 0 rgba(30,27,46,.18))`).

Logo files: `logo-card.svg` is the chosen mark, `logo-card-back-blank.svg` is
the back face for the flip.

These SVGs are the source for the React components in `src/components/sprites/`
(plan Phase 2) — the app imports those, never these files.

## The live canvas

https://claude.ai/artifact/B8xUuTAY1pmHCQcMD5FKRc (page "Round 6 · Fold and
Flip"). It's private to the owner's claude.ai account, so Claude Code can't open
it; take screenshots from it for visual reference.
