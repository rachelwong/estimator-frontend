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

### Stage 5 — Active screen

Window `live`, role chip, heading that changes once there's a Selection, the
share bar (default of the three designed options), and **End session & reveal**
in `danger` — full width under the grid on mobile.

### Stage 6 — Reveal screen

Window `revealed`, the dark notice, the pinning popover, "who landed where"
chips, the Abstained list, and the `ffRevealIn` diagonal wave — declared so that
hover and popover re-renders don't replay it (§8).

*Done when:* the wave plays once on entry, names are complete in the popover with
no truncation to a count, and Area never appears here.

### Stage 7 — Create and Join

- **Create:** segmented Numerical/Fibonacci buttons replacing the RadioGroup, the
  pixel slider, the value in Bungee accent, and the ready state — spade mark,
  summary line, link in a `crowd-0` box with Copy link.
- **Join:** heading, one input, button, and the privacy note. Nothing else.

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
  | `scenarios/session.mjs:44,84,99,106,107` | `End session` → `End session & reveal` | Stage 5 renames the button; repair it there |
  | `lib.mjs:142,175` | Square fill is now the crowd ramp, not a per-person colour | Stage 4 changes the fill; repair it there |

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
