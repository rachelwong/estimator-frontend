# Fold and Flip — Implementation Plan

Building the design in [`DESIGN.md`](../../DESIGN.md) into the existing app.
Frontend only. No protocol or backend change.

Terms follow [`CONTEXT.md`](../../CONTEXT.md). Sequencing convention follows
[`ui-refresh.md`](./ui-refresh.md).

**Reference material** (already in the repo, not shipped to users):

| Path | What it is |
| --- | --- |
| `public/screens/*.html` | 26 design-canvas artboards, one per screen per size |
| `src/assets/sprites/*.svg` | 30 pixel-art sprites, 8px per art pixel. Moved out of `public/` in Stage 2 so they are imported and bundled rather than fetched by path |

The screens are **reference source, not runnable pages**. They carry inline
styles only, `{{…}}` placeholders resolved from a `<script type="text/x-dc">`
block at the bottom of each file, and `<sc-if>` variant branches. Resolve them
against palette `grape`, hero font `bungee`, logo mark `card` — the other
branches are unchosen alternatives and get dropped.

---

## Decisions

Settled before this plan was written. `DESIGN.md` §12 is superseded on these
points.

| Topic | Decision | Consequence |
| --- | --- | --- |
| Session name | **Dropped from window titles.** Titles read `live`, `revealed`, `join`, `new-session` | No backend change. `SessionState` never had a name field ([`types.ts:25`](../../../estimator-backend/src/types.ts)) |
| shadcn layer | **One token system.** The Fold and Flip palette holds every value; shadcn's role names become `var()` aliases onto it. Keep `src/components/ui/*` | No collisions, every colour defined once — see "One token system" below |
| Welcome copy | **Build with placeholders**, marked in source. Final copy is its own phase | Welcome ships structurally complete, textually provisional |
| Assets | Sprites become React components under `src/components/sprites/`. `public/screens` stays as committed reference | Sprites recolour by prop, per `DESIGN.md` §9 |
| Duplicate names | **Already handled.** `sessionStore.ts:35` does `Jim-1`, `Jim-2` | No work. `DESIGN.md` §12 question closed |
| Large Numerical grids on mobile | **Minimum Square size + horizontal scroll.** No per-device cap | A session looks like the same grid to everyone who opens it. A cap would make the grid depend on the device |
| Breakpoints | `≤767` mobile · `768–1199` tablet · `≥1200` desktop | The three artboard sizes (390 / 834 / 1440) sit inside these |

### One token system

Two layers, one set of values. The palette is authored once; shadcn's role names
are pointed at it and introduce no values of their own.

```css
@theme {
  /* the only place a hex ever appears */
  --color-ink: #1E1B2E;
  --color-cream: #FFF6E5;
  --color-accent: #6A4FF0;
  /* …the 14 from DESIGN.md §11 */
}

@theme inline {
  /* shadcn role names aliased onto the palette — var() only */
  --color-background: var(--color-cream);
  --color-foreground: var(--color-ink);
  --color-primary:    var(--color-selection);
  --color-destructive: var(--color-danger);
  --color-border:     var(--color-ink);
  /* …the 14 that src/ actually references */
}
```

`bg-ink` and `bg-background` then resolve to the same custom property. The
primitives keep working untouched, while the design's vocabulary is the one we
author in.

**The 14 role names in use**, as of this plan — `background`, `border`,
`destructive`, `foreground`, `input`, `muted`, `muted-foreground`, `popover`,
`popover-foreground`, `primary`, `primary-foreground`, `ring`, `secondary`,
`secondary-foreground`. Of the 31 declared, 17 are referenced nowhere.

**Why not restyle on top.** Keeping both token sets puts `--color-accent` in
each, meaning opposite things — shadcn's is a near-white hover grey
(`oklch(0.97 0 0)`), Fold and Flip's is the purple window chrome. Whichever is
declared last silently wins, with no error either way.

The collision is **latent today and bites in Stage 3**: shadcn's `accent` is
itself unused in `src/`, so nothing is wrong right now. It breaks the moment the
design's accent is authored — `bg-accent` on a window title bar would resolve to
the near-white grey instead of the purple. Aliasing resolves it by deletion:
there is only ever one `--color-accent`.

**Deleted in Stage 1**, all verified unreachable from `src/`:

| What | Count | Why it can go |
| --- | --- | --- |
| `--color-sidebar-*`, `--color-chart-*` | 13 of 31 | No sidebar, no charts |
| `--color-accent`, `-accent-foreground`, `-card`, `-card-foreground` | 4 | Declared but never referenced. `accent` is re-authored as the Fold and Flip purple |
| The `.dark` block and every `dark:` variant | ~31 declarations | Nothing in `src/` ever sets the class. The design has no dark mode — its "dark notice" is a component, not a theme |
| `--radius` and its 7 derived sizes | 8 | `border-radius: 0` everywhere (§4) |

The cost: a shadcn primitive added later that expects an un-aliased role token
renders unstyled until the alias is added. That is a visible failure rather than
a silent drift, which is the better of the two.

### Primitives that need replacing regardless

Independent of the token decision, three need replacing outright, because the
design asks for behaviour Radix doesn't have:

- **Tooltip** — no arrow, clamped inside the grid width, positioned 12px above
  the Square (`DESIGN.md` §6).
- **Popover** — opens on click, *pins* open, lists every name with no "+N more",
  closes only on the same Square again or Esc (§6).
- **Slider** — 10px track, 28px square thumb, Silkscreen ticks, and it already
  steps by axis value rather than by point ([`RangeSlider.tsx`](../../src/components/RangeSlider.tsx)).

These are noted here so the phases below don't read as a surprise.

### Resolved decisions this design reverses

`estimator-plan.md` is the product spec and reads as a list of settled
decisions. Two of them are reversed here. `PLAN.md` already keeps a
"Deviations from `estimator-plan.md`" table for exactly this; these belong in it.

| # | It says | This design | Why it matters |
| --- | --- | --- | --- |
| 16 | "Mobile/responsive support: out of scope. Desktop-only… no responsive breakpoints planned" | Three breakpoints, every screen drawn at 390 / 834 / 1440 (§5) | Responsive work is no longer out of scope — it is most of Stages 5–9 |
| 18 | "Grid accessibility: click/tap only. `EstimationGrid` gets no keyboard navigation (no `tabIndex`, arrow-key handling, or ARIA roles)" | Roving `tabIndex`, arrow keys, Enter/Space, an `aria-label` per Square (§6) | Directly contradicted. Stage 4 builds what #18 rules out |

Both reversals are the design's call and stand. They are recorded because
`DESIGN.md:3` now points readers at `estimator-plan.md`, so an unmarked
contradiction would read as a mistake in one of the two.

### Doc hygiene carried in Stage 0

- Annotate — do **not** retire — [`grid-area.md`](../features/grid-area.md) and
  [`reveal-colours-and-create-gating.md`](../features/reveal-colours-and-create-gating.md).
  Both are superseded on colour only:
  - Area survives intact as a concept (`DESIGN.md` §6 keeps Area preview,
    Selection Area, and "never in the Reveal"). Only its fills change.
  - Of that file's three changes, only #3 (a colour per person) is replaced by
    the crowd ramp. #1 create gating and #2 names-with-spaces are live
    behaviour, and #2 is mirrored in the backend.
- `DESIGN.md` §12 — strike the items settled in the table above.
- Add the two reversed decisions above as rows in `PLAN.md`'s existing
  "Deviations from `estimator-plan.md`" table (`PLAN.md:17`).
- Link this document from `PLAN.md` and `README.md`. Today only `DESIGN.md` and
  `public/README.md` point at it, so someone starting from `PLAN.md` — the
  repo's build doc — would never find it.

---

## What does not move

The plumbing is stable and stays untouched: `lib/socket.ts`,
`lib/sessionConnectionReducer.ts`, `lib/sessionConnectionRegistry.ts`,
`hooks/useSessionConnection.ts`, `lib/api.ts`, `lib/adminToken.ts`,
`routes/loaders.ts` and the route table in [`router.tsx`](../../src/routes/router.tsx).

This is a visual-layer replacement on working machinery, not a rewrite.

---

## Constraints that bind every phase

- **Literal Tailwind classes only.** `cn build` scans `src/**/*.{ts,tsx}`, so a
  class string can never be assembled at runtime. Anything computed — Square
  size, crowd step, tooltip position — goes in a `style` attribute or picks from
  a literal lookup in `src/constants.ts`. The existing `PARTICIPANT_COLOUR_CLASS`
  and `CROWDED_SQUARE_CLASS` arrays are the pattern.
- **One component per file** with its own `XyzProps`, sub-components in a folder
  named for the parent, constants in `src/constants.ts`, non-prop types in
  `src/types/`.
- **No magic strings or domain numbers** inline — the 7s logo cycle, 1.6s copied
  state, 4px Square gap and the breakpoint pixel values all belong in
  `src/constants.ts` as ALL_CAPS consts.
- **Three artboards collapse into one component.** Never build per-breakpoint
  components; reconcile the desktop/tablet/mobile files into responsive classes
  using the §3 type scale and §5 layout table.
- **`prefers-reduced-motion: reduce` switches off every animation** added in any
  phase (§8). Not a final pass — part of each phase's definition of done.

---

## Stages

**Stages, not phases.** [`PLAN.md`](../../PLAN.md) already numbers Phases 0–12,
and `scripts/smoke/scenarios/*.mjs` cite them by number in their header comments
("PLAN.md Phases 10–12"). A second 0–10 sequence called "Phase" would make every
future commit message and code comment ambiguous. This document counts Stages.

Each phase ends with the app running and verifiable by hand. Per the standing
rule: kill existing servers first, run frontend and backend together, smoke-test
the affected screens, surface errors rather than reporting a clean pass.

### Stage 0 — Decisions and doc hygiene

No code. Record the decisions above in `DESIGN.md` §12 and annotate the two
partly-superseded feature specs.

**Done.** `DESIGN.md` §12 now carries one open item (copy), a settled table and
a scheduled list. Both feature specs carry a superseding note scoped to colour.
`PLAN.md` gained a "Reversed by the Fold and Flip design" section for decisions
16 and 18, and links to this document from `PLAN.md` and `README.md`.

### Stage 1 — Tokens and type

The foundation every later phase composes against.

- The `DESIGN.md` §11 palette into `src/index.css` as the single `@theme` value
  layer (Tailwind v4 is already in use).
- The 14 live shadcn role names into `@theme inline` as `var()` aliases onto it.
- Delete the four groups in the table above: the 17 unreferenced tokens, the
  `.dark` block with its `@custom-variant`, and `--radius` with its derived
  sizes. Strip the now-dead `dark:` variants from `src/components/ui/*`.
- Three fonts via Fontsource packages — matches the existing
  `@fontsource-variable/geist` pattern and self-hosts, which closes the
  flash-of-fallback-text question in §12. Geist comes out.
- Crowd ramp, shadow scale, breakpoint values and motion timings into
  `src/constants.ts`.

*Done when:* a dev fixture screen under `src/routes/dev/` renders the full
palette, the crowd ramp and the type scale at all three sizes; the ramp's
contrast holds at every step; and `grep -r "dark:\|--radius\|sidebar\|chart-" src/`
comes back empty.

**Done.** The sheet is `src/routes/dev/TokensPage/`, served at `/dev/tokens` in
dev builds only and tree-shaken out of the production bundle. It reads contrast
and font size back off the painted nodes rather than off a second copy of the
hex, so a token that never reached the stylesheet reads as a failure. Every pair
in §2 clears WCAG AA at normal size — the ramp's tightest step is crowd-2 on ink
at 4.85:1. The grep gate is empty and `npm run smoke` is 102/102.

Five choices the stage above did not spell out:

| Choice | Why |
| --- | --- |
| Tailwind's `sm`/`md`/`lg`/`xl` scale cleared; `tablet` (768px) and `desktop` (1200px) are the only breakpoint variants | One breakpoint vocabulary, and it is the design's three artboards. `lg:` at 1024px sits inside the tablet range and would have read as desktop. The seven `sm:`/`md:` uses in `alert-dialog.tsx` and `input.tsx` became `tablet:` |
| `on-ink-muted` (`#C9C3DA`) authored as a 15th palette token | `DESIGN.md` §2 names it; only §11's abbreviated block omits it. Without it the dark notice and the Reveal popover would hardcode the hex in Stage 6 |
| Shadow scale lives in `@theme` as `shadow-px*` utilities, not in `src/constants.ts` | Nothing computes a shadow at runtime, so there is no lookup to feed. The literal-class constraint doesn't bite |
| Motion timings land with their consumers, stage by stage | A const with no caller is dead code today, and each stage adds its own to the same file under the same convention. The one exception is `COPIED_FEEDBACK_MS`, retuned 2000 → 1600 to match §7 |
| `rounded-[min(var(--radius-md),Npx)]` stripped from `button.tsx` alongside `--radius` | Deleting the token without the references would have left an invalid `min()` on four button sizes. The remaining `rounded-*` classes resolve to Tailwind's own scale and are squared in Stage 3 |

The decorative colours in §2 — the two chrome dots and the card tints that
aren't already tokens — were left out. They belong to the one component each
and arrive with it.

### Stage 2 — Sprites and the logo

- 30 SVGs in `src/assets/sprites/`, imported directly and rendered through one
  `<Sprite>` wrapper as `<img alt="" aria-hidden>`.

  **Changed from the original plan**, which called for 30 generated React
  components with fills driven by a prop. The prop existed to serve recolouring,
  and the design recolours exactly one sprite: the cream spade on the Reveal's
  dark notice (§7), where an ink spade on ink would be invisible. Thirty
  generated files and a generator script for one cream spade was machinery the
  feature did not earn.

  That one case is a CSS mask instead — the SVG's alpha supplies the shape and
  `background-color` paints it, so the colour is a real palette token rather
  than a filter chain's approximation, which keeps Stage 1's one-token-system
  decision intact. `<SpriteMask>` carries it. The technique only works on a
  single-colour mark: masking a character flattens its skin tone and outfit into
  one silhouette, which is why nothing else uses it.

  Cost of the change: an `<img>` is opaque to CSS, so any *future* sprite
  needing selective fill replacement has to be redrawn as a second SVG or move
  to a mask. Given one known consumer, that is the cheaper bet.
- The logo: shake and flip on the shared 7s timeline, next value picked on the
  inner element's `animationiteration` so the number never swaps mid-flip (§8).
- A placement component for the floating characters — around the edges on
  desktop, peeking over the window on tablet and mobile, always behind the
  window (§9).
- Rename to **Fold and Flip**. It is the display name; "Product Poker", "Jira
  Poker" and "Estimator" were working titles. The whole surface is four places:

  | Where | Now | Becomes |
  | --- | --- | --- |
  | [`AppHeader.tsx:11`](../../src/components/AppHeader.tsx) | `<Link>Product Poker</Link>` | The lockup — mark + "Fold and Flip" in Bungee, 10–12px gap (§1) |
  | [`index.html:7`](../../index.html) | `<title>Product Poker</title>` | `<title>Fold and Flip</title>` |
  | `index.html` `<head>` | *no description or og tags at all* | Added, not edited |
  | [`public/favicon.svg`](../../public/favicon.svg) | A generic purple gradient bolt | The pixel card (§12) |

  **Do not rename** `KEY_PREFIX` in
  [`adminToken.ts:6`](../../src/lib/adminToken.ts) (`'estimator:adminToken:'`).
  It is a `localStorage` key, not a display string — changing it orphans every
  stored token and silently demotes every current Admin to a Participant.

  Repo names stay `estimator-frontend` / `estimator-backend`. They are
  infrastructure, and the Welcome repo cards (§7 item 7) name them literally.

  `scripts/smoke/scenarios/routing.mjs` asserts on the old name in three places;
  that repair is listed in Stage 10.

  `PLAN.md:34`, `:577` and `:697` describe the header as rendering "Product
  Poker". Line 34 is a historical deviations row and stays true; the other two
  describe current code and go stale the moment this lands — update them.

*Done when:* the logo cycles correctly, holds still under reduced motion, and no
sprite is reachable by a screen reader.

**Done.** The sheet is `src/routes/dev/SpritesPage/`, served at `/dev/sprites`
in dev builds only. All 30 sprites are `<img>` with an empty `alt`, every one
inlined as a data URI, so the production bundle carries the two logo cards the
header needs and nothing else — the other 28 tree-shake out. The logo's shake
and flip share one 7s timeline; under reduced motion the card holds at −8° and
is pixel-identical over 3s. The scatter thins 13 → 5 → 2 across desktop, tablet
and mobile. `npm run smoke` is 102/102.

Two things this stage did that the plan put elsewhere:

| What | Why |
| --- | --- |
| Repaired `scenarios/routing.mjs:30,78,89` now, not in Stage 10 | The rename lands here, so deferring the assertions would have left the suite red for eight stages and made every intervening stage's verification meaningless |
| `prefers-reduced-motion` handled once, globally, in `@layer base` | Named per animation it would have to be remembered each stage. A blanket rule covers an animation the day it lands. Resting transforms are untouched, which is how the logo stays tilted |

Sprite filenames expand to full names at the import site — `p1.svg` becomes
`personOne`. `b1`–`b3` read as more head-and-shoulders avatars and are named
`avatarFive`–`avatarSeven`; if that grouping is wrong the rename is one line
each. The scatter positions are invented: the artboards place characters per
screen and there is no shared placement table to reconcile them against.

### Stage 3 — Shape primitives

What every screen is built out of.

- `Window` — 44px accent title bar, white Silkscreen title, status chip, three
  chrome dots, 3px ink rule beneath, `8px 8px 0` shadow.
- `Card`, `Chip`, and the restyled `button` / `input` / `badge`.
- The pixel progress-bar loader (§7, option C) in both sizes, replacing
  [`LoadingNotice`](../../src/components/LoadingNotice.tsx). `role="status"`,
  holds still under reduced motion.

*Done when:* each primitive renders in the dev fixture at all three sizes, and
the existing screens still work wearing the restyled primitives.

**Done.** The sheet is `src/routes/dev/PrimitivesPage/`, served at
`/dev/primitives` in dev builds only. It carries the four §5 window widths,
every chip shape, the cards, buttons, inputs and both loader sizes, with no
horizontal overflow at 390 / 834 / 1440. Under reduced motion the bar holds
full and still (220px over 1s, unchanged). `npm run smoke` is 102/102.

Where this stage went past or against the letter above:

| Choice | Why |
| --- | --- |
| **Badge deleted, not restyled.** `SessionStatusHeader` and `AbstainedList` wear `Chip` | §4 has one small-label shape, the chip. Restyling Badge as well would have left two components for one design element |
| Button keeps three variants (`default` / `secondary` / `destructive`) and three sizes (`default` 44px, `lg` 56px Bungee, `icon`) | `ghost`, `link`, `outline` and the other five sizes had no caller. `ShareLink` and `AlertDialogCancel` moved from `outline` to `secondary`, which is the same white button |
| `--color-secondary` and its foreground removed from the alias block | The button restyle was their last reference. Stage 1's rule keeps only role names `src/` uses; the count is now 12 |
| `--color-chrome-green` authored as a palette token | The middle window dot. Its neighbours are `selection` and `danger`; keeping the hex in `index.css` keeps Stage 1's one-place-for-hexes rule |
| One body padding for every Window | The artboards differ by a few pixels per screen (28/36/36 Active, 32/40/36 Join) with nothing in §5 to reconcile them. The wider set wins. A per-screen override lands with the first screen that needs it — likely Active's tighter mobile padding in Stage 5 |
| Two loaders: `LoadingWindow` (large, full page) and `LoadingNotice` (inline, a strip at the bottom) | First load, a chunk loading and a session connecting have no page to show, so they get the window. A navigation still has the old page on screen, so it gets the strip. Both share the 400ms delay through `useDelayedVisibility` |
| The loader's fill rests at `w-full` | The global reduced-motion rule collapses the animation rather than pausing it, so the fill falls back to its resting width. Without one it rested at 0 — an empty track, which reads as nothing happening |

`Card` has no production caller yet. It is four classes and the plan lists it
here; Welcome (Stage 9) is its first real consumer.

### Stage 4 — The grid

The centrepiece, and shared by Active and Reveal — so it lands before either.

- Square sizing from the §5 formula, in a `style` attribute.
- The crowd ramp, hover lift, Area preview, Selection and Selection Area states
  (§6), each picking from a literal class lookup.
- Keyboard: roving `tabIndex`, arrow keys move focus, Enter/Space selects, Tab
  leaves in one stop. `aria-label` per Square.
- The replacement tooltip — no arrow, clamped, 12px above.
- Minimum Square size plus horizontal scroll on mobile, per the decision above.

*Done when:* an 11×11 Numerical grid is usable at 390px, the grid is fully
keyboard-operable, and touch gets no hover-dependent affordance.

**Done.** Squares measure 70 / 64 / 39 for Fibonacci 7×7. An 11×11 Numerical
grid at 390px floors at 28px and scrolls inside itself, with no page overflow.
Arrows move a single Tab stop, Enter selects, and Tab leaves the grid. After a
tap there is no lift, tooltip or preview. `npm run smoke` is 105/105.

Where this stage went past or against the letter above:

| Choice | Why |
| --- | --- |
| **Popover pulled forward from Stage 6** | The crowd ramp removes per-person colours, which left the old click-badges meaningless, and the new tooltip says "click for names". The popover uses the tooltip's positioning. Keeping a restyled Radix box for two stages would have meant throwaway work and repairing the smoke tests twice |
| Participant colours, the "Who is who" legend and the rainbow border deleted | The ramp replaces them, and §7 says "No legend" |
| **Axis ⓘ hints dropped** — plain "resources ↑" / "time →" | §6 anatomy has no hints. Radix Tooltip and `ui/tooltip.tsx` go with them. [`axis-tooltips.md`](../features/axis-tooltips.md) is marked superseded |
| `SQUARE_MIN_PX` = 28 | §5's formula shrinks 21×21 to 10px on a phone. At 28 a Square is still a fingertip target, and the grid scrolls sideways past that |
| Only keyboard focus counts as hover (`:focus-visible`) | A tap focuses the button too, so otherwise touch would get a stuck lift and tooltip |
| Keyboard focus lifts and shows the tooltip, but gives no Area preview | §6 limits the preview to the mouse |
| The tooltip never says "tap for names" | Touch never shows a tooltip, so that variant had nowhere to appear |
| Tooltip and popover sit outside the scroller and are measured after layout | `overflow-x: auto` also clips vertically, which would cut off a popover above the top row |

**Not built: "Your Square" in the Reveal** (§6, 3px `selection` outline). The
ended page is REST-only and doesn't know who is viewing. The connection state
goes to `ENDED` without the Selection. It belongs to Stage 6, which also has to
work out where that identity comes from.

### Stage 5 — Active screen

Window `live`, role chip, heading that changes once there's a Selection, the
share bar (default of the three designed options), and **End session & reveal**
in `danger` — full width under the grid on mobile.

**Done.** Windows measure 366 / 740 / 780 with the header at 60 / 72, and a
Fibonacci 7×7 keeps its 39 / 64 / 70 Squares inside them without scrolling. An
11×11 Numerical grid at 390px floors at 28px and scrolls inside the window, with
no page overflow. One End button shows per size. Copy fills `copied` and reads
"Copied!" for 1.6s. `npm run smoke` is 105/105.

Where this stage went past or against the letter above:

| Choice | Why |
| --- | --- |
| ~~Header controls are portalled into `RootLayout`'s header through a slot~~ **Superseded after Stage 7** | Every page now renders its own `PageLayout` (sticky header, `<main>` at least a screen tall) and passes its controls as an `actions` prop. The slot, its context, `useHeaderSlot` and both portals are gone, and so is the pathless `errorElement` route that existed to keep the header. The cost is that the header remounts on a page change and the logo's 7s cycle restarts, which was judged not to matter |
| Welcome's header variant waits for Stage 9 | Its taller header with nav and a menu (§5, §7), and the footer (§7 item 10), have no other consumer. `PageLayout` gets them then |
| End is rendered twice, header and under the grid, and CSS shows one | Each owns its own confirm dialog, so whichever the viewport draws is the one that opens |
| Share bar stays **Admin only** | The artboard draws it regardless of role, but `PLAN.md` Phase 11 settled it as Admin-only ("a Participant has nobody to invite") and the smoke suite asserts that. Reversing it is a one-line change in `ActiveSessionView` if the design's reading is the one wanted |
| The link sits in a readonly `Input`, not the artboard's plain text box | It stays selectable by hand where the clipboard is blocked, and keeps the `Session link` label screen readers and the smoke tests use |
| `ShareLink` keeps its name | `estimator-plan.md` and two feature specs refer to it; the bar is a restyle, not a new component |
| Window gains `bodyClassName`; Active's mobile body is 12px, not the artboard's 14px | Stage 3's anticipated override. Our grid adds a 4px scroll gutter the artboard doesn't have, so a 7×7 at 39px needs 335px and 14px padding leaves 332 |
| Confirm dialog and error banner restyled with no artboard to follow | The design draws neither. The dialog is a window without its title bar over the ink 45% backdrop the mobile menu uses (§7); the banner borrows End's `danger` fill and the button edge. `AlertDialogMedia` went with the restyle, having no caller |
| `--color-popover` and its foreground removed from the alias block | The dialog restyle was their last reference. The count is now 10 |
| The screen heading stays an `h2` | The header's lockup is the page's `h1` on every screen. Swapping that belongs to one pass across all screens, in Stage 10 |

### Stage 6 — Reveal screen

Window `revealed`, the dark notice, "who landed where" chips, the Abstained
list, and the `ffRevealIn` diagonal wave — declared so that hover and popover
re-renders don't replay it (§8). The popover itself landed in Stage 4; this
stage lifts `hovered`/`pinned` out of the grid so chips can preview and pin a
Square, and adds "Your Square" (see Stage 4).

*Done when:* the wave plays once on entry, a chip previews and pins its
Square, and Area never appears here.

**Done.** Windows measure 366 / 740 / 780 with Fibonacci 7×7 Squares at
39 / 64 / 70, and an 11×11 Numerical grid floors at 28 on a phone and scrolls
inside the window, with no page overflow. The wave starts at the origin and
does not replay on hover or pin. Under reduced motion every Square has its
final fill within 100ms. On a phone, a chip whose Square is off-screen scrolls
it into view before opening the popover. `npm run smoke` is 125/125.

Where this stage went past or against the letter above:

| Choice | Why |
| --- | --- |
| **"Your Square" comes from the connection that watched the Session end.** `ENDED` now carries the Selection held at that moment, and `endedLoader` reads it off the registry | It's the only place in the client that knows who you were. The server never says, and adding that would mean a protocol change. So a refresh on `/ended` or a fresh visitor gets no ring. That's why `lib/sessionConnectionReducer.ts` has one more field, despite "What does not move" |
| The window chip reads Admin (token held), Participant (this tab joined) or nothing | A fresh visitor from a shared link is neither, and calling them a Participant would be wrong |
| **The Abstained list is part of "who landed where"**, not its own section | The artboard puts the dashed chips at the end of the same row. `AbstainedList` and `SessionStatusHeader` (the "Ended" chip) are deleted; the window title `revealed` says it now |
| **"Start a new session" is shown to everyone**, not only the Admin | §7 says "Admin header offers", but the artboard draws it for both roles, and the old page gave it to everyone. The new Session is a fresh one either way. Header from tablet up, full width at the bottom on mobile, the same as End |
| Share bar on the Reveal, **Admin only** | §7 draws the share option on Active and Reveal. Stage 5's Admin-only rule carries over. The link lands on `/join`, which forwards to `/ended` |
| Clicking a chip again closes the popover | It matches the Square's own toggle, and `aria-expanded` on the chip stays truthful |
| Pinning scrolls its Square into view | A chip can pin a Square scrolled sideways out of a phone's grid, or far up the page. A no-op for a Square clicked in place |
| Reduced motion zeroes animation and transition **delays** too, globally | The wave staggers every Square by up to 2.8s on a 21×21. With only the durations collapsed, each Square sat blank through its delay and then snapped in, which is still a wave |
| The notice has no `role="status"` | The artboard gives it one, but it is static content present on arrival, so there is nothing to announce |
| Active and Reveal share `SESSION_WINDOW_CLASS` | One size in §5, one grid inside. Two copies of the class string would drift |

### Stage 7 — Create and Join

- **Create:** segmented Numerical/Fibonacci buttons replacing the RadioGroup, the
  pixel slider, the value in Bungee accent, and the ready state — spade mark,
  summary line, link in a `crowd-0` box with Copy link.
- **Join:** heading, one input, button, and the privacy note. Nothing else.

**Done.** Windows measure 366 / 600 / 640 for Create and 366 / 560 / 560 for
Join, with headings at 20 / 28 / 28 and 22 / 30 / 30 and no page overflow. The
slider's ticks sit under the thumb's own value on a phone. Create lands on
`/:sessionId/ready`, which survives a refresh and sends anyone without the
admin token to `/join`. "Change settings" reopens the form on the same point
system and maximum. `npm run smoke` is 137/137.

Where this stage went past or against the letter above:

| Choice | Why |
| --- | --- |
| **Slider values evenly spaced, reversing `estimator-plan.md` #3** | The artboard puts a tick under every value, which magnitude placement can't fit: Fibonacci's 0–8 crowd into the first 15% of the track. The track now steps by index, so a key or drag can only land on a real value, and `nearestValue`, `stepValue` and `SLIDER_STEP_DIRECTION` are gone. Recorded in `PLAN.md`'s reversed table |
| **Native range input, not the Radix Slider.** `ui/slider.tsx` and `ui/radio-group.tsx` deleted | The browser supplies keys, drag and ARIA for an index slider. The input's value is the index, so `aria-valuetext` gives the axis value to screen readers and a hidden input submits it. The segmented buttons are `aria-pressed` toggles in a labelled group, as the artboard marks them up |
| **The ready state is its own route, `/:sessionId/ready`**, not a branch of the Create page | It holds a Session id and a link the Admin may refresh into, which is the routing skill's test for a route. `readyLoader` lets in only a browser holding the admin token |
| "Change settings" carries the point system and maximum back, **not the name** | Carried as location state. The ready screen gets the Session over REST, which has no Admin name, and holding the name somewhere else would need storage for one field. The Session it leaves stays in server memory until the next restart; there is no delete endpoint |
| Numerical ticks every fifth value | Twenty-one labels don't fit on a phone. The artboard labels 1, 5, 10, 15, 20; ours starts at 0 because 0 is still the unpicked start (create gating) |
| Form errors in `abstained` red, and the `destructive` alias removed | `danger` on white is about 3:1, below AA for 14px text. `abstained` is the palette's AA red. That was the alias's last reference |
| `CopyLinkButton` and `sessionJoinUrl` pulled out of `ShareLink` | The ready screen is their second consumer. The copy button there is white (`secondary`), in the share bar yellow |
| Pressed submit buttons show the inline loader at full opacity | §7 puts the loader "inside the pressed button". A disabled button dims to 50%, which washed the bar out |
| Join's window title reads `join`, not `join · <session>` | The Stage 0 decision drops the Session name from titles |

**Bundle.** Join now draws the sprite scatter, and Join is eager, so the
sprites' chunk (45 kB gzipped) is modulepreloaded on every cold start instead of
loading with Create or Active. The entry itself shrank 91.7 → 89.6 kB gzipped
with Radix's slider and radio group gone. Join's visitors need the sprites
anyway. Welcome and Not Found pay for sprites they don't draw yet, until Stages
8 and 9 give them characters of their own.

### Stage 8 — Error and loading screens

One "broken grid" layout for all three errors, copy varying by kind (§7 table).
Unifies [`NotFoundPage`](../../src/routes/NotFoundPage.tsx),
[`ConnectionLost`](../../src/components/ConnectionLost.tsx) and
[`AppError`](../../src/routes/AppError.tsx). Illustration is decorative and
`aria-hidden`.

### Stage 9 — Welcome

The largest phase, and last because section 3 embeds a **real Reveal window** —
it can't be built before Stage 6.

Ten sections (§7), the Bayer 4×4 pixel-dither band, the four How-to-play cards,
the side-by-side Active/Reveal comparison, six House rules cards, the CTA band,
and the mobile menu with its backdrop and dashed-rule rows.

All copy is placeholder, marked as such in source.

**Move `WelcomePage` behind `lazy()` in this stage.** It is eager in
[`router.tsx`](../../src/routes/router.tsx) today, which was right while it was
a small page. Once it carries the section-3 Reveal window and roughly twenty
sprites, everything it imports lands in the entry chunk, so Join, Active and
Reveal would each pay for decoration they never render.

Sprites stay imported from `src/assets/sprites/` rather than moving to
`public/`. Measured on the Stage 2 build: 28 extra sprites cost +4.65 kB gzipped
inlined, against 12.71 kB as separate files plus a request each — the pixel
path data is repetitive enough that one gzip stream compresses it far better
than thirty do. A smaller bundle number there would mean more bytes on the wire.

### Stage 10 — Copy, smoke tests, and a full pass

- Final Welcome copy, "Why I made this", and the GitHub handle for both repo
  cards.
- Repair the smoke assertions the rename breaks:

  | File | Breaks on | Status |
  | --- | --- | --- |
  | `scenarios/routing.mjs:30,78,89` | `Product Poker` → `Fold and Flip` | **Done in Stage 2**, with the rename that broke it |
  | `scenarios/session.mjs:45,97,112,119,120` | `End session` → `End session & reveal` | **Done in Stage 5**, with the rename |
  | `lib.mjs`, `session.mjs`, `join.mjs`, `create.mjs` | Crowd ramp fill, popover, new grid DOM | **Done in Stage 4** |
  | `session.mjs`, `join.mjs` | The "Ended" chip, the Abstained section, `Create new session` → `Start a new session` | **Done in Stage 6** |
  | `create.mjs`, `session.mjs`, `join.mjs`, `routing.mjs`, `lib.mjs` | Form labels and buttons, the native slider, Create landing on `/ready` | **Done in Stage 7** |

  The rule the first row establishes: repair a smoke assertion in the stage that
  breaks it, not here. A suite left red across stages makes every intervening
  stage's verification meaningless.

- One pass across all three sizes, with reduced motion on and off, and a keyboard
  -only run through create → join → select → reveal.

---

## Sequencing

```
0 decisions
   │
   ▼
1 tokens ─► 2 sprites ─► 3 primitives ─► 4 grid ─┬─► 5 active ──┐
                                                  └─► 6 reveal ──┤
                                                                 ├─► 9 welcome ─► 10 copy + smoke
                              3 primitives ─► 7 create/join ─────┤
                              3 primitives ─► 8 errors ──────────┘
```

Stages 5 and 6 can run in either order once 4 lands. Stages 7 and 8 need only
the primitives, so they can run alongside the grid work. Stage 9 needs 6.

---

## Risks

- **Reconciling three artboards per screen.** The files hardcode sizes per
  breakpoint with no shared vocabulary; the §3 type scale and §5 layout table are
  the reconciliation tool, and where they disagree with an artboard, `DESIGN.md`
  wins.
- **`cn build` and the crowd ramp.** Every ramp step, shadow and tint has to
  exist as a literal string somewhere in `src/`. A runtime-built class silently
  produces an unstyled Square rather than an error.
- **An un-aliased role token.** Adding a shadcn primitive after Stage 1 that
  reads a role name the alias block doesn't cover renders it unstyled until the
  alias is added. Visible rather than silent, which is why this is the residual
  risk and not the "two token systems" one it replaced.
