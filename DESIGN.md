# Fold and Flip — Design

The visual design for estimator-frontend. Read alongside `estimator-plan.md`
(what the product is and its resolved decisions) and `CONTEXT.md` (the binding
language).

Source of truth for layouts: the "Round 6 · Fold and Flip" page of the design
canvas — https://claude.ai/artifact/B8xUuTAY1pmHCQcMD5FKRc

Direction in one line: a cream-and-lavender pixel office. Chunky ink outlines,
hard offset shadows, square corners, pixel-art characters, and a purple
"window" that frames every working surface.

---

## 1. Brand

**Name:** Fold and Flip. This is the display name — the one the UI, `<title>`,
meta tags and favicon carry. "Product Poker", "Jira Poker" and "Estimator" were
working titles during development and appear nowhere in the shipped product.
The repos keep their `estimator-*` names.

**Logo mark:** a blank playing card with a single pixel spade and a 1-cell ink
offset shadow (canvas: Spec · Logo marks, option B). No "A", no corner pips.

- Rests rotated **−8°**.
- Every **7s**: a quick side-to-side shake, a 3D flip to a random value, a
  hold, then a flip back to the spade. See [Motion](#8-motion).
- Values shown on the back: `0, 1, 2, 3, 5, 8, 13, 21` (never the same twice
  in a row), set in the display font.
- Lockup: mark + "Fold and Flip" in Bungee, 10–12px gap.
- Alternative mark (not chosen): the spade alone with a 1-cell offset shadow in
  the accent colour.

---

## 2. Colour — "Grape"

All corners are square. Text on every fill below meets WCAG AA for its size.

### Core

| Token          | Hex       | Use                                                                                |
| -------------- | --------- | ---------------------------------------------------------------------------------- |
| `ink`          | `#1E1B2E` | Text, every border, every offset shadow                                            |
| `cream`        | `#FFF6E5` | Page background                                                                    |
| `white`        | `#FFFFFF` | Windows, cards, inputs, secondary buttons                                          |
| `text-muted`   | `#3E3852` | Body copy on cream/white                                                           |
| `text-subtle`  | `#5B5570` | Secondary labels, Abstained chip border                                            |
| `accent`       | `#6A4FF0` | Window title bars, "Nobody peeks.", active axis label, CTA band (white text on it) |
| `page-top`     | `#DCD3FB` | Top of the Welcome page, share bar                                                 |
| `selection`    | `#FFC53D` | The Participant's own Selection, primary buttons (ink text)                        |
| `danger`       | `#FF5A5F` | End session & reveal (ink text)                                                    |
| `copied`       | `#D7F2E4` | "Copied!" state, live status chip                                                  |
| `abstained`    | `#B42318` | The word "Abstained"                                                               |
| `on-ink-muted` | `#C9C3DA` | Secondary text on ink (notice, popover)                                            |

### Square ramp (crowd size, Reveal only)

| Step      | Hex       | Text  | Meaning                                         |
| --------- | --------- | ----- | ----------------------------------------------- |
| `crowd-0` | `#F2EDFF` | ink   | Idle Square / nobody landed                     |
| `crowd-1` | `#C9BCF7` | ink   | 1 person — also the **Area** tint during Active |
| `crowd-2` | `#8E77F2` | ink   | 2 people                                        |
| `crowd-3` | `#5A3FD6` | white | 3 people                                        |
| `crowd-4` | `#2A1F5C` | white | 4 or more                                       |

The ramp reflects how many people landed on a Square, never Time or Resources:
the two axes are never collapsed into one colour (Product principle 3).

### Decorative

- Window chrome dots: `#FFC53D`, `#4CC38A`, `#FF5A5F`.
- "How to use" card tints: `#FFFFFF`, `#FFE8A8`, `#D7F2E4`, `#F2EDFF`.

---

## 3. Type

| Role    | Family         | Weights            | Notes                                                          |
| ------- | -------------- | ------------------ | -------------------------------------------------------------- |
| Display | **Bungee**     | 400                | Headlines, wordmark, big buttons                               |
| Body    | **Figtree**    | 400, 500, 700, 800 | Anything read as a sentence; form labels; chips; popover names |
| Label   | **Silkscreen** | 400                | Short interface labels only                                    |

All three are free on Google Fonts.

### Scale (px)

| Element                         | Desktop | Tablet | Mobile |
| ------------------------------- | ------- | ------ | ------ |
| Welcome hero                    | 78      | 58     | 36     |
| Section heading (h2)            | 44      | 36     | 27     |
| Card / sub heading (h3)         | 20      | 19     | 17     |
| CTA band heading                | 41      | 31     | 23     |
| Screen heading (Active, Reveal) | 27      | 27     | 20     |
| Screen heading (Create)         | 28      | 28     | 20     |
| Screen heading (Join)           | 30      | 30     | 22     |
| Wordmark in header              | 16–19   | 16–19  | 12–13  |
| Body                            | 16–21   | 16–18  | 15–18  |
| Silkscreen labels               | 11–13   | 11–13  | 10–12  |

### Silkscreen rules

- One word or a short phrase: axis values, "resources ↑", "Abstained",
  status chips, tooltip text, window titles. Never paragraphs.
- Minimum 10px; 11px wherever space allows. Check crispness in the browser at
  12 vs 16px — bitmap-style faces are sharpest on their pixel grid.
- Bungee and Silkscreen both read as capitals; let size and weight separate
  them and use Figtree in between.

---

## 4. Shape, borders, shadows

| Thing                                       | Border                                        | Shadow                         |
| ------------------------------------------- | --------------------------------------------- | ------------------------------ |
| Window (Active, Reveal, Create, Join, hero) | 3px ink                                       | `8px 8px 0 ink`                |
| Card (How to use, House rules, source bar)  | 3px ink                                       | `6px 6px 0 ink`                |
| Button / input / icon button                | 3px ink                                       | `4px 4px 0 ink` (inputs: none) |
| Square                                      | 2px ink                                       | none; hover: see §6            |
| Chip                                        | 2px ink (Abstained: 2px dashed `text-subtle`) | none                           |
| Dark notice & popover                       | none                                          | `4px 4px 0 accent`             |

`border-radius: 0` everywhere.

**Window chrome:** 44px title bar in `accent`, white Silkscreen 12px title on
the left, a status chip and the three chrome dots on the right, 3px ink rule
beneath.

---

## 5. Layout

|                        | Desktop | Tablet | Mobile |
| ---------------------- | ------- | ------ | ------ |
| Canvas width           | 1440    | 834    | 390    |
| Page padding (Welcome) | 80      | 40     | 20     |
| Header height          | 84      | 72     | 64     |
| Header padding         | 80      | 40     | 20     |
| Active / Reveal window | 780     | 740    | 366    |
| Create window          | 640     | 600    | 366    |
| Join window            | 560     | 560    | 366    |
| Error window           | 900     | 740    | 366    |
| Square (Fibonacci 7×7) | 70      | 64     | 39     |
| Square gap             | 4       | 4      | 4      |

Square size for any Point system:
`min(max, floor((available − (n − 1) × 4) / n))`, where `available` is 630 /
580 / 298 and `max` is 70 / 64 / 39. Numerical to 10 gives 11×11 and smaller
Squares.

---

## 6. The grid

The centrepiece component. Time runs left→right, Resources bottom→top, both
axes share the same Axis values (`CONTEXT.md`).

### Anatomy

- Y axis values right-aligned in a 22px column; X values centred under each
  column; Silkscreen 11px.
- "resources ↑" rotated vertically to the left (desktop, tablet) or above the
  grid (mobile); "time →" under the bottom-right.
- The hovered Square's row and column values turn `accent`.

### States

| State          | When                        | Look                                                                                     |
| -------------- | --------------------------- | ---------------------------------------------------------------------------------------- |
| Idle           | always                      | `crowd-0`, 2px ink border                                                                |
| Hover          | mouse over / keyboard focus | `translate(-3px, -3px)` + `4px 4px 0 ink`, raised z-index. Kept in Active **and** Reveal |
| Area preview   | Active, mouse only          | Squares from origin to the hovered Square get an `accent` 15% overlay (`#6A4FF026`)      |
| Selection      | Active                      | `selection` fill, "You" (★ on small Squares)                                             |
| Selection Area | Active                      | Squares from origin to the Selection use `crowd-1`                                       |
| Revealed       | Reveal                      | fill from the crowd ramp                                                                 |
| Your Square    | Reveal                      | 3px `selection` outline inset 7px                                                        |
| Pinned         | Reveal, popover open        | stays lifted                                                                             |

Area never shows in the Reveal. Touch gets no hover-dependent affordance.

### Interaction

- Click/tap a Square → it becomes the Selection. Another Square moves it; the
  same Square again clears it.
- Arrow keys move focus (roving `tabIndex`: 0 on the current Square, −1 on the
  rest). Enter/Space selects. Tab leaves the grid in one stop.
- Every Square has an `aria-label`: "Time 5, resources 3", plus ", your
  Selection", and in the Reveal the names or ", nobody".

### Labels in the Reveal

| People on the Square | ≥56px Square                                 | Small Square    |
| -------------------- | -------------------------------------------- | --------------- |
| 0                    | —                                            | —               |
| 1                    | the name, cut to the Square's width with "…" | first 2 letters |
| 2+                   | "3" / "people" on two lines                  | "×3"            |

Silkscreen 11px (10px on small Squares).

### Tooltip (hover)

Ink box, cream Silkscreen 11px, 8×11px padding, 12px above the Square, clamped
inside the grid width. No arrow.

- Active: `Time 5 · Resources 3`
- Reveal: `T5 · R3 · nobody` / `T5 · R3 · Mia` / `T5 · R3 · 4 people · click for names`
  ("tap" on touch). Names in the tooltip cut at 14 characters.

### Popover (click, Reveal)

Opens on any Square with at least one person.

- Ink box, `4px 4px 0 accent`, 210px wide (190 mobile), above the Square,
  clamped inside the grid.
- Title: `Time 5 · Resources 3` (Silkscreen 11px).
- **Every** name listed, one per row: 8px square bullet (alternating
  `selection` / `crowd-2`), Figtree 14/600, ellipsis at 160px (140 mobile). No
  "+ N more".
- No close button. Click the same Square again, or press Esc, to close.

### "Who landed where" (Reveal)

Under a 2px dashed ink rule, Silkscreen label "who landed where", then wrapping
chips: Figtree 14/700, 36px tall, names only (no Time/Resources values).
Hovering a chip previews its Square; clicking pins its popover. Abstained
Participants follow with a dashed chip and "Abstained" in `abstained` red.

---

## 7. Screens

### Welcome (`/welcome`)

1. Header — logo, "How to use", GitHub,
   "Start a session" (mobile: logo + Menu button).
2. Hero on `page-top` — Silkscreen badge "Planning poker, without the poker
   face", Bungee hero "Everyone plays a hand. / Nobody peeks." (second line in
   `accent`), paragraph, Start a session + How to use.
3. Hero demo — the real Reveal window (notice, heading, grid with a lifted
   Square and open popover, "who landed where" chips), 780px max.
4. Pixel-dither band — `page-top` breaks into 8px pixels over 12 rows (Bayer
   4×4 ordered dither) into cream, just before How to use.
5. How to use — four cards LV.1–LV.4: Start a session / Pull up a chair /
   Hands down / The Reveal. 4 → 2 → 1 columns.
6. Why I made this — a zine spread. Heading on a 3px ink rule with the
   Silkscreen caption "notes from the maker" opposite. Three placeholder notes
   (the problem / the idea / the build), each a Silkscreen label on a 3px
   `accent` rule over a paragraph, split by 2px ink rules: 3 columns on desktop;
   problem and idea side by side with the build across the bottom on tablet;
   stacked on mobile. Below, a white "read the source" bar (Card border and
   shadow) with the sign-off and "Frontend on GitHub" (yellow) + "Backend on
   GitHub" (white): one row on desktop; buttons side by side under the text on
   tablet; stacked on mobile.
7. House rules — six feature cards. 3 → 2 → 1 columns.
8. CTA band in `accent` — "Round up the team." + Start a session, with pixel
   characters.
9. Footer.

**Mobile menu:** the Menu button (3-bar icon) becomes a yellow "Close" button.
An ink 45% backdrop covers the page below the header; a window titled "menu"
drops in 12px from the edges with 60px rows (sprite + label + →) separated by
2px dashed ink: How to use · Why I made this ·
Frontend on GitHub · Backend on GitHub, then a full-width Start a session.
Tapping the backdrop closes it.

### Create (`/new`)

Window "new-session", chip "Admin".

- "New session" + one line explaining the Admin role.
- Your name (input).
- Point system: two-up segmented buttons, Numerical / Fibonacci; the active one
  fills `accent` with a 4px shadow.
- Highest axis value: value in Bungee `accent` beside the label; pixel slider
  (10px track filled `accent`, 28px square white thumb with a 3px shadow);
  Silkscreen ticks beneath.
- Create session (`selection`, full width). Success goes straight to the
  Session, where the Admin's share bar holds the link. No ready screen.

No grid preview.

### Join (`/:id/join`)

Window "join · <session>", chip "Participant". Only: "Join session" heading,
one input labelled "Your name" (placeholder "e.g. Rachel"), Join session button, and
a `crowd-0` note: "Your Selection stays private until the Admin ends the
session and the Reveal shows everyone's Square."

### Active (`/:id/start`)

- Header: logo · Share control (per option below) · End session & reveal
  (Admin, `danger`). On mobile the End button moves to full width under the grid.
- Window title "<session> · live", chip "Admin" / "Participant".
- Heading "Make your Vote" → "Hand's down." once there's a Selection, with a
  one-line hint.
- The grid.
- No Participant count, no footer hint line.

### Reveal (`/:id/ended`)

- Admin header offers "Start a new session".
- Window title "<session> · revealed".
- Dark notice (ink, 4px accent shadow, cream spade): **Selections are closed** —
  "The Admin ended this session, so every Selection is locked in. Pick a Square
  to see who landed there."
- Heading "The Reveal", hint "Darker Squares are where more people landed."
- The grid, then "who landed where". No legend.

### Share session link (Active and Reveal)

Three designed options; **bar** is the default.

- **bar** — full-width `page-top` strip under the header: link icon +
  Silkscreen "Share session link", the full URL in a white 3px-bordered box, and a
  `selection` Copy link button. Stacks on mobile.
- **header** — a `selection` "Share session link" button in the header
  ("Share" on mobile). The URL isn't visible.
- **window** — the same row as the bar, inside the window above the heading.

Copy feedback: the button fills `copied` and reads "Copied!" for 1.6s.

### Error (not found, connection lost, something went wrong)

Option C, "Broken grid" (canvas: Error · C). One layout for all three errors;
only the copy changes.

- Header: logo only.
- A window (900 / 740 / 366 wide) titled with the error in Silkscreen
  ("session not found", "connection lost", "something went wrong"), chip
  "error".
- Left (above on mobile): a 5×5 Square illustration with five Squares fallen
  out. They lie tilted below the grid with the hover lift shadow, one in
  `selection` yellow; dashed `text-subtle` outlines mark where they were.
  Squares are 50 / 44 / 30px. Decorative, `aria-hidden`.
- Right (below on mobile): Silkscreen label, Bungee heading, one paragraph,
  primary (`selection`) and secondary (white) buttons. Buttons go full width
  and stack on mobile.
- Pixel characters float around it on desktop and peek over the window on
  tablet and mobile, as on the other screens.

| Error                | Heading              | Body                                                                                                                                       | Primary         | Secondary       |
| -------------------- | -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ | --------------- | --------------- |
| Not found            | Session not found    | This link doesn't match a live session. Sessions live in memory, so a server restart or a mistyped link lands you here. Nothing was saved. | Start a session | Back to Home    |
| Connection lost      | Connection lost      | We can't reach the session right now. When you reconnect you'll join as a new Participant, so Make your Vote again.                        | Try again       | Back to Home    |
| Something went wrong | Something went wrong | The session hit an error we didn't expect. Try again, or start a fresh session.                                                            | Try again       | Start a session |

### Loader

Option C, "Pixel progress bar" (canvas: Spec · Loader options).

- A bar with a 3px ink border, white fill and a `4px 4px 0 ink` shadow. An
  `accent` fill steps across it in whole blocks, then starts again: large is
  220×18px in 8 blocks, inline is 40×6px in 5 blocks. White 3px gaps between
  blocks come from a repeating gradient laid over the fill.
- Animation: `width 0 → 100%`, `1.6s steps(8) infinite` (`steps(5)` inline).
- Large: centred in a window above a Silkscreen line ("loading session…").
  Inline: inside the pressed button ("Creating session…") or before a line of
  text ("Joining checkout-redesign…").
- The container has `role="status"` (polite) so the text is announced.
  Under reduced motion the bar holds still.

---

## 8. Motion

```css
@keyframes ffShake {
  0%,
  58% {
    transform: rotate(-8deg);
  }
  60% {
    transform: rotate(-2deg);
  }
  62% {
    transform: rotate(-14deg);
  }
  64% {
    transform: rotate(-4deg);
  }
  66%,
  100% {
    transform: rotate(-8deg);
  }
}
@keyframes ffFlip {
  0%,
  66% {
    transform: rotateY(0deg);
  }
  72%,
  90% {
    transform: rotateY(180deg);
  }
  96%,
  100% {
    transform: rotateY(360deg);
  }
}
```

- Logo: outer element runs `ffShake 7s ease-in-out infinite` with
  `perspective: 240px`; inner element runs `ffFlip` on the same timeline with
  `transform-style: preserve-3d`. Front and back faces use
  `backface-visibility: hidden`; the back is pre-rotated 180°.
- Pick the next number on the inner element's `animationiteration` event — it
  fires while the spade faces out, so the number never swaps mid-flip.
- **Reveal intro:** when the Reveal grid first appears (on load, or when the
  Admin ends the session), the Squares play a diagonal wave from the origin.
  Each starts as `crowd-0` with its label hidden, peaks lifted in `crowd-2`,
  then settles into its real crowd colour and label.

  ```css
  @keyframes ffRevealIn {
    0% {
      background: #f2edff;
      color: transparent;
      transform: none;
      box-shadow: none;
    }
    45% {
      background: #8e77f2;
      color: transparent;
      transform: translate(-2px, -2px);
      box-shadow: 3px 3px 0 #1e1b2e;
    }
  }
  /* per Square: animation: ffRevealIn 700ms ease-out <(time index + resources index) × 70ms> backwards; */
  ```

  The keyframes have no `100%`, so each Square animates to its own final
  styles. The animation declaration stays identical afterwards, so hover and
  popover re-renders don't replay it. The whole wave takes about 1.5s on a 7×7
  grid.

- Square hover lift: `transform` and `box-shadow` 90ms; fills 120ms.
- `prefers-reduced-motion: reduce` switches off all animation and transitions;
  the logo stays tilted and still.

---

## 9. Pixel art

- Every sprite is an SVG of 1×1 `path` runs on a pixel grid with
  `shape-rendering="crispEdges"`, so it stays sharp at any size and recolours
  by editing fills.
- Stickers get a 1-cell white outline plus
  `drop-shadow(3px 3px 0 rgba(30, 27, 46, 0.18))`.
- Cast: six standing office characters (varied skin tones and outfits, one
  waving), head-and-shoulders avatars, speech bubbles (face-down card, "?"),
  face-down and face-up cards, mug, plant, laptop, server, coins, sticky note,
  hourglass, water cooler. All decorative: `aria-hidden="true"`.
- Placement:
  - **Desktop:** floating around the edges, rotated ±3–8°.
  - **Tablet:** peeking over the top edge of the main window, and leaning out
    of its left and right sides.
  - **Mobile:** peeking over the top edge only.
  - Characters always sit behind the window (lower z-index).

---

## 10. Language

`CONTEXT.md` is binding. In the UI:

- Use: Session, Participant, Admin, Point system, Axis values, Square,
  Selection, Area, Reveal, Abstained.
- Never: vote/voting, player, dealer, host, results, tally, cell, choice.
  Crowds are "3 people", not "3 votes".
- Time and Resources are labels, not units — no hours or days anywhere.
- Poker is metaphor for headlines only ("Everyone plays a hand", "Hands
  down"); functional labels use the CONTEXT terms.

### Placeholders still to fill

- All Welcome copy is provisional until you supply it (only
  `docs/features/intro-page.md` is sanctioned text today).
- "Why I made this" — three paragraphs and a sign-off, marked as placeholders.
- Repo links — `github.com/[you]/estimator-frontend` and `…/estimator-backend`.

---

## 11. Implementation notes

- Tailwind class strings must be literal in source (`cn build` scans
  `src/**/*.{ts,tsx}`). Anything computed at runtime — Square size, crowd step,
  tooltip position — goes in a `style` attribute or picks from a literal lookup
  (`const CROWD = ['bg-crowd-0', …, 'bg-crowd-4'] as const`).
- Put tokens, font names and domain numbers (7s logo cycle, 1.6s copied state,
  4px gap, logo values) in `src/constants.ts` per the repo rules.

Tokens as CSS custom properties (map into `@theme` on Tailwind v4, or
`theme.extend` on v3):

```css
:root {
  --color-ink: #1e1b2e;
  --color-cream: #fff6e5;
  --color-accent: #6a4ff0;
  --color-page-top: #dcd3fb;
  --color-selection: #ffc53d;
  --color-danger: #ff5a5f;
  --color-copied: #d7f2e4;
  --color-abstained: #b42318;
  --color-text-muted: #3e3852;
  --color-text-subtle: #5b5570;
  --color-crowd-0: #f2edff;
  --color-crowd-1: #c9bcf7;
  --color-crowd-2: #8e77f2;
  --color-crowd-3: #5a3fd6;
  --color-crowd-4: #2a1f5c;

  --font-display: "Bungee", sans-serif;
  --font-body: "Figtree", system-ui, sans-serif;
  --font-label: "Silkscreen", monospace;

  --shadow-px: 4px 4px 0 var(--color-ink);
  --shadow-px-card: 6px 6px 0 var(--color-ink);
  --shadow-px-window: 8px 8px 0 var(--color-ink);
  --shadow-px-accent: 4px 4px 0 var(--color-accent);
}
```

---

## 12. Open before implementing

The build sequence is [`docs/plans/fold-and-flip.md`](docs/plans/fold-and-flip.md).

### Still open

- **Copy.** Welcome copy is placeholder until supplied (only
  `docs/features/intro-page.md` is sanctioned). "Why I made this" text and the
  GitHub handle for both repo links are still needed.

That is the only one.

### Settled

| Question                        | Answer                                                                                                                                   |
| ------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| Session name                    | Dropped from window titles — they read `live`, `revealed`, `join`, `new-session`. The backend has no name field and gains none           |
| Large Numerical grids on mobile | Minimum Square size plus horizontal scroll. No per-device cap, so the grid never depends on the device                                   |
| Duplicate names                 | Already handled — `estimator-backend/src/sessionStore.ts:35` does `Jim-1`, `Jim-2`                                                       |
| Breakpoint ranges               | `≤767` mobile · `768–1199` tablet · `≥1200` desktop                                                                                      |
| "Two visual modes"              | Dropped                                                                                                                                  |
| Fonts                           | Self-hosted via Fontsource, matching the existing package pattern                                                                        |
| Sprites                         | In `src/assets/sprites/` as SVG, imported directly and rendered as `<img>` (Stage 2). Not React components — see the plan's Stage 2 note |

### Scheduled, not open

- **Rename everywhere** — header, `<title>`, meta tags, favicon. Plan Stage 2,
  which lists the exact four places.
- **Smoke tests** — `scripts/smoke/` asserts on text this design changes. Plan
  Phase 10 lists the exact files and lines.
- **Feature specs** — [`grid-area.md`](docs/features/grid-area.md) and
  [`reveal-colours-and-create-gating.md`](docs/features/reveal-colours-and-create-gating.md)
  are superseded on colour only; both carry a note saying so. Their behaviour
  rules still hold.
