# Fold and Flip — Design

The visual design for estimator-frontend. Read alongside `estimator-plan.md`
(what the product is and its resolved decisions) and `CONTEXT.md` (the binding
language).

Source of truth for layouts: the "Round 6 · Fold and Flip" page of the design
canvas — https://claude.ai/artifact/B8xUuTAY1pmHCQcMD5FKRc

**Two themes.** This document is the **Play** theme, the default. **Work** (Round 14 · Night Ledger) is
switched on from the header; its spec lives in [`docs/plans/themes.md`](docs/plans/themes.md) until that plan's
last phase folds it in here. Colours are two-tier tokens (primitives → roles); see the plan's Tokens section.

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

Colours are two tiers. **Primitives** are named by hue (`plum-950`, `grape-500`) and live only in `src/index.css`'s
`:root`; no utility exists for them. **Roles** are named by job and are the only colour classes a component writes
(`bg-card`, `text-muted-foreground`). Each role does one job, so roles that share a Play value here stay separate:
Work gives them different ones. The full role list, with Work values, is in
[`docs/plans/themes.md`](docs/plans/themes.md#roles--colour).

### Primitives

| Primitive   | Hex       | Primitive   | Hex       |
| ----------- | --------- | ----------- | --------- |
| `plum-950`  | `#1E1B2E` | `grape-600` | `#5A3FD6` |
| `plum-800`  | `#3E3852` | `grape-900` | `#2A1F5C` |
| `plum-700`  | `#5B5570` | `cream`     | `#FFF6E5` |
| `plum-300`  | `#C9C3DA` | `butter`    | `#FFE8A8` |
| `grape-50`  | `#F2EDFF` | `mint-100`  | `#D7F2E4` |
| `grape-100` | `#DCD3FB` | `mint-400`  | `#4CC38A` |
| `grape-200` | `#C9BCF7` | `sun-400`   | `#FFC53D` |
| `grape-400` | `#8E77F2` | `coral-400` | `#FF5A5F` |
| `grape-500` | `#6A4FF0` | `brick-700` | `#B42318` |
|             |           | `white`     | `#FFFFFF` |

### Core roles

| Role                                    | Play        | Use                                                                   |
| --------------------------------------- | ----------- | --------------------------------------------------------------------- |
| `background`                            | `cream`     | Page background                                                       |
| `foreground`                            | `plum-950`  | Text                                                                  |
| `muted-foreground`                      | `plum-800`  | Body copy on cream/white                                              |
| `subtle-foreground`                     | `plum-700`  | Secondary labels                                                      |
| `card` · `input` · `header`             | `white`     | Windows and cards · fields · header and footer                        |
| `border` · `border-subtle`              | `plum-950`  | Fields, chips, dialog, notices · Windows, cards, Squares, dividers    |
| `header-border` · `ghost-border`        | `plum-950`  | Header and footer rules · secondary and icon buttons                  |
| `absent-border`                         | `plum-700`  | Abstained chip, missing Squares on the error grid                     |
| `ring`                                  | `plum-950`  | Focus outline                                                         |
| `primary` · `primary-foreground`        | `grape-500` · `white` | Window title bars, "ship together", active axis value, CTA band |
| `action` · `action-foreground`          | `sun-400` · `plum-950` | Primary buttons                                              |
| `emphasis` · `emphasis-foreground`      | `coral-400` · `plum-950` | End session & reveal                                       |
| `new-session` · `new-session-foreground` | `sun-400` · `plum-950` | Start a new session (Reveal)                              |
| `secondary`                             | `white`     | Secondary and icon buttons                                            |
| `selection` · `selection-foreground`    | `sun-400` · `plum-950` | The Participant's own Selection                              |
| `area`                                  | `grape-200` | The Area during Active                                                |
| `page-top` · `share-bar`                | `grape-100` | Top of the Welcome page · share bar                                   |
| `note` · `row-hover`                    | `grape-50`  | The Join note · hovered Reveal chip                                   |
| `inverse` · `inverse-foreground`        | `plum-950` · `cream` | Dark notice, tooltips, step badges                             |
| `inverse-muted`                         | `plum-300`  | Secondary text on `inverse`                                           |
| `popover` · `popover-foreground`        | `plum-950` · `cream` | The Reveal popover                                             |
| `success`                               | `mint-100`  | "Copied!" state, live status chip                                     |
| `error-surface` · `error-foreground`    | `coral-400` · `brick-700` | Error banner fill · field error messages                  |
| `destructive`                           | `coral-400` | Invalid field border                                                  |
| `abstained`                             | `brick-700` | The word "Abstained"                                                  |
| `link`                                  | `grape-500` | Inline links                                                          |
| `scrim`                                 | `plum-950` at 45% | Behind the dialog and mobile menu                               |

### Square ramp (crowd size, Reveal only)

| Step      | Play        | Text role                      | Meaning                     |
| --------- | ----------- | ------------------------------ | --------------------------- |
| `crowd-0` | `grape-50`  | `crowd-foreground` (`plum-950`) | Idle Square / nobody landed |
| `crowd-1` | `grape-200` | `crowd-foreground`             | 1 person                    |
| `crowd-2` | `grape-400` | `crowd-foreground`             | 2 people                    |
| `crowd-3` | `grape-600` | `crowd-3-foreground` (`white`) | 3 people                    |
| `crowd-4` | `grape-900` | `crowd-4-foreground` (`white`) | 4 or more                   |

The ramp reflects how many people landed on a Square, never Time or Resources:
the two axes are never collapsed into one colour (Product principle 3).

### Decorative

- Window chrome dots: `selection`, `chrome-dot` (`mint-400`), `emphasis`.
- "How to use" card tints: `tint-plain`, `tint-butter`, `tint-mint`, `tint-lavender`.
- The change-flash rainbow and the Feedback confetti read primitives directly: they're decoration with no job, and
  Work switches them off rather than recolouring them. Pixel sprites carry primitive hex in the SVG.

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
| Screen heading (Active)         | 27      | 27     | 20     |
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

Shadows and radii are role tokens too (`shadow-control`, `rounded-control`), so Work can swap them without new classes.

| Thing                                       | Border                                        | Shadow role (Play value)                  |
| ------------------------------------------- | --------------------------------------------- | ----------------------------------------- |
| Window (Active, Reveal, Create, Join, hero) | 3px `border-subtle`                           | `shadow-window` (`8px 8px 0 plum-950`)    |
| Card (How to use, House rules, source bar)  | 3px `border-subtle`                           | `shadow-card` (`6px 6px 0 plum-950`)      |
| Button                                      | 3px `action-border` / `secondary-border` / `emphasis-border` / `new-session-border` | `shadow-control` (`4px 4px 0 plum-950`)   |
| Icon button                                 | 3px `ghost-border`                            | `shadow-icon` (`3px 3px 0 plum-950`)      |
| Input                                       | 3px `border`                                  | none                                      |
| Square                                      | 2px `border-subtle`                           | none; lifted: `shadow-lift`; see §6       |
| Chip                                        | 2px `border` (Abstained: 2px dashed `absent-border`) | none                               |
| Notices, loader                             | 3px `border` (error: `error-border`)          | `shadow-notice` (`4px 4px 0 plum-950`)    |
| Dialog                                      | 3px `border`                                  | `shadow-dialog` (`8px 8px 0 plum-950`)    |
| Dark notice & popover                       | none                                          | `shadow-float` (`4px 4px 0 grape-500`)    |

Every radius role (`control`, `panel`, `bar`, `card`, `strip`, `track`) is `0` in Play: square corners everywhere.

**Window chrome:** 44px title bar in `primary`, `primary-foreground` Silkscreen 12px title on
the left, a status chip and the three chrome dots on the right, 3px `border-subtle` rule
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
- The hovered Square's row and column values turn `primary`.

### States

| State          | When                        | Look                                                                                     |
| -------------- | --------------------------- | ---------------------------------------------------------------------------------------- |
| Idle           | always                      | `crowd-0`, 2px `border-subtle`                                                               |
| Hover          | mouse over / keyboard focus | `translate(-3px, -3px)` + `4px 4px 0 ink`, raised z-index. Kept in Active **and** Reveal |
| Area preview   | Active, mouse only          | Squares from origin to the hovered Square get a `primary` 15% overlay (`#6A4FF026`)      |
| Selection      | Active                      | `selection` fill, "You" (★ on small Squares)                                             |
| Selection Area | Active                      | Squares from origin to the Selection use `area`                                          |
| Revealed       | Reveal                      | fill from the crowd ramp                                                                 |
| Your Square    | Reveal                      | 3px `selection` outline inset 7px                                                        |
| Pinned         | Reveal, popover open        | stays lifted                                                                             |
| Changed        | Reveal, someone just moved here | border turns rainbow, rolls once then fades back to ink (§8). Never on your own change |

Area never shows in the Reveal. Touch gets no hover-dependent affordance.

### Interaction

- Click/tap a Square → it becomes the Selection. Another Square moves it; the
  same Square again clears it.
- Arrow keys move focus (roving `tabIndex`: 0 on the current Square, −1 on the
  rest). Enter/Space selects. Tab leaves the grid in one stop.
- Every Square has an `aria-label`: "Time 5, resources 3", plus ", your
  Selection", and in the Reveal the names or ", nobody". On a Reveal you can
  vote on, also ", click to change your Estimate".
- **Voting on the Reveal.** Anyone who joined before the end, and the Admin,
  can still change their estimate there. A click votes, exactly as on Active:
  another Square moves it, your own Square clears it. Names move to hover:
  hovering (or keyboard focus on) a Square with people opens its popover, and
  leaving closes it. "Your team" chips still pin it. Touch has no hover, so a
  voter on a phone reads names in the Squares and the chips. Someone who can't
  vote (a latecomer, or a Participant who reloaded) clicks to pin, as before.

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
- Reveal: `T5 · R3 · Mia` / `T5 · R3 · 4 people · click for names` ("tap" on
  touch). Names in the tooltip cut at 14 characters. An empty Square gets no
  tooltip, by mouse or keyboard.
- Reveal you can vote on: no tooltip at all. A Square with people opens its
  popover on hover instead, so the two never overlap. Never "click for names":
  any prompt says "hover".

### Popover (click, Reveal)

Opens on any Square with at least one person. On a Reveal you can vote on, it
opens on hover or focus instead of click (§6 Interaction).

- Ink box, `4px 4px 0 accent`, 210px wide (190 mobile), above the Square,
  clamped inside the grid.
- Title: `Time 5 · Resources 3` (Silkscreen 11px).
- **Every** name listed, one per row: 8px square bullet (alternating
  `selection` / `crowd-2`), Figtree 14/600, ellipsis at 160px (140 mobile). No
  "+ N more".
- No close button. Click the same Square again, or press Esc, to close.

### "Your team" chips (Reveal)

Under a 2px dashed ink rule, Silkscreen label "your team" (an h2 on the Reveal
screen, h3 in the Welcome demo), then wrapping chips: Figtree 14/700, 36px
tall, names only (no Time/Resources values). Hovering a chip previews its
Square; clicking pins its popover. Abstained Participants follow with a dashed
chip and "Abstained" in `abstained` red. When someone moves, their chip's
border flashes with their new Square's (§8).

### Session description (Join, Active, Reveal)

The ticket or task the Admin typed on Create, shown under the screen heading
(under the dark notice on the Reveal). Figtree 15/500 (16 from tablet), `foreground`,
centred. Any URL in it becomes a bold `link` underlined link that opens in a
new tab. Rendered as text, never HTML. Nothing at all when the Admin left it
blank.

---

## 7. Screens

### Welcome (`/welcome`)

1. Header — logo, "How to use", GitHub (desktop only, jumps to Why I made
   this), the Feedback tile, "Start a session". Mobile: logo + an icon-only
   menu button.
2. Hero on `page-top` — Silkscreen badge "Planning poker for agile product
   teams", Bungee hero "Teams who / estimate together / ship together" (last
   line in `primary`), paragraph, Start a session + How to use.
3. Hero demo — the real Reveal window (notice, a sample description, grid with
   a lifted Square and open popover, "your team" chips), 780px max.
4. Pixel-dither glow — `page-top` breaks into 2px pixels (Bayer 4×4 ordered
   dither) that glow down into cream: 160px deep at the centre, shallower
   towards the sides along a half-ellipse 120% of the page wide, just before
   How to use.
5. How to use — an intro paragraph, then four cards LV.1–LV.4: Start a
   session / Cards down / The Flip / Talk it through. 4 → 2 → 1 columns.
6. Why I made this — centred heading, then "Frontend on GitHub" (yellow) +
   "Backend on GitHub" (white) buttons: one row on desktop, side by side on
   tablet, stacked on mobile. Below, three notes (the experience / the idea /
   the build), each a Silkscreen label over a paragraph, split by 2px ink
   rules: 3 columns on desktop; the first two side by side with the build
   across the bottom on tablet; stacked on mobile.
7. House rules — six feature cards: Live, but private / No sign-up / Unique
   link / Change your mind / Two axes, one grid / Nothing is kept.
   3 → 2 → 1 columns.
8. CTA band in `primary` — "Flip the points / Align the team" + Start a
   session, with pixel characters.
9. Footer.

**Mobile menu:** the 44px icon-only menu button (3-bar icon) turns yellow,
drops its shadow and shows a pixel cross while open; its accessible name is
"Open menu" / "Close menu". An ink 45% backdrop covers the page below the
header; a window titled "menu" drops in 12px from the edges with 60px rows
(sprite + label + →) separated by 2px dashed ink: How to use · Why I made this
· GitHub ("Frontend & backend repositories") · Feedback (new tab), then a
full-width Start a session. Tapping the backdrop or a row, or pressing Esc,
closes it.

### Header (every screen but Welcome)

Logo on the left; on the right the Feedback tile, then the screen's own
actions. The Feedback tile is a 44px white tile with the pixel bug that opens
LinkedIn in a new tab; on hover or focus the bug bursts into confetti and a
Silkscreen "Feedback" label appears beneath.

### Create (`/new`)

Window "new-session", chip "Admin".

- "New session" + one line explaining the Admin role (14px).
- Name (input, placeholder "e.g. Rachel").
- Ticket or task description (input, optional, placeholder "Optional, e.g.
  PROJ-12 https://…"). A Silkscreen 12px `subtle-foreground` counter sits opposite
  the label, `n/300`, counted after trimming and collapsing whitespace. Past 300
  it shows "Keep description to 300 characters or fewer." and Create session
  waits.
- Point system: two-up segmented buttons, Numerical / Fibonacci; the active one
  fills `option-selected` with a 4px shadow.
- Highest axis value: value in Bungee `primary` beside the label; pixel slider
  (10px track filled `range-fill`, 28px square `range-thumb` thumb with a 3px shadow);
  Silkscreen ticks beneath.
- Create session (`selection`, full width). Success goes straight to the
  Session, where the Admin's share bar holds the link. No ready screen.

No grid preview.

### Join (`/:id/join`)

Window "join", chip "Participant". Only: "Join session" heading, the Session
description (if any), one input labelled "Name" (placeholder "e.g. Rachel"),
Join session button, and a `note`: "Your estimate stays private until
the Admin ends the session and the Reveal shows everyone’s estimates."

### Active (`/:id/start`)

- Header: logo · Feedback · End session & reveal (Admin, `emphasis`). On mobile
  the End button moves to full width under the grid.
- Share bar under the header, Admin only (option below).
- Window title "live", chip "Admin" / "Participant".
- Heading "Make your Estimate", with a 14px hint: "Time runs across, Resources
  go up. Your estimate stays private until the Reveal."
- The Session description, if any.
- The grid.
- No Participant count, no footer hint line.

### Reveal (`/:id/ended`)

- Header offers "Start a new session" to everyone (tablet up; full width at the
  bottom of the window on mobile). No share bar.
- Window title "the reveal".
- Dark notice (ink, 4px accent shadow, cream spade): **All estimates are now
  revealed!** — "Explore the grid to see how everyone estimated, click anywhere
  on the grid to change your estimate again. Latecomers to this session can see
  the estimates but they can't add their vote." One wording for everyone,
  latecomers included. Welcome's demo can't vote, so its notice reads "Hover
  over the grid to see how everyone estimated."
- The Session description, if any.
- The grid, then "your team". No legend.
- No visible heading and no h1: the window title and notice carry the screen.
- **Live.** Estimates keep changing after the end, and every open Reveal shows
  each change without a reload. Who can vote: §6 Interaction.
- **Change flash.** The Square someone just moved to, and their chip, get a
  rainbow border (§8).
  - A move flashes the Square joined, not the one left. A vote from Abstained
    flashes the Square joined. A clear flashes nothing.
  - Not on the voter's own screen, in any of their tabs. A latecomer has no
    name, so sees every change.
  - The Square and the mover's chip flash together. Nothing flashes on load or
    reload.
  - A Square or chip that changes again mid-flash starts over.
  - Sits with "Your Square" and the hover lift without hiding them: the
    rainbow takes over the 2px ink border, "Your Square" is 7px in.
- **Live updates stopped.** If the connection drops, the last Reveal stays. A
  white 3px-bordered note pinned bottom right (full width along the bottom on
  mobile): "Live updates have stopped. Reload to see the latest estimates."
  with Try again.

### Share session link (Active, Admin only)

Three designed options; **bar** is the default.

- **bar** — full-width `share-bar` strip under the header: link icon +
  Silkscreen "Share session link", the full URL in a white 3px-bordered box, and a
  `selection` Copy link button. Stacks on mobile.
- **header** — a `selection` "Share session link" button in the header
  ("Share" on mobile). The URL isn't visible.
- **window** — the same row as the bar, inside the window above the heading.

Copy feedback: the button fills `success` and reads "Copied!" for 1.6s.

### Error (not found, connection lost, something went wrong)

Option C, "Broken grid" (canvas: Error · C). One layout for all three errors;
only the copy changes.

- Header: logo and the Feedback tile.
- A window (900 / 740 / 366 wide) titled with the error in Silkscreen
  ("session not found", "connection lost", "something went wrong"), chip
  "error".
- Left (above on mobile): a 5×5 Square illustration with five Squares fallen
  out. They lie tilted below the grid with the hover lift shadow, one in
  `selection` yellow; dashed `absent-border` outlines mark where they were.
  Squares are 50 / 44 / 30px. Decorative, `aria-hidden`.
- Right (below on mobile): Silkscreen label, Bungee heading, one paragraph,
  primary (`selection`) and secondary (white) buttons. Buttons go full width
  and stack on mobile.
- Pixel characters float around it on desktop and peek over the window on
  tablet and mobile, as on the other screens.

| Error                | Heading              | Body                                                                                                                                       | Primary         | Secondary       |
| -------------------- | -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ | --------------- | --------------- |
| Not found            | Session not found    | This link doesn't match a live session. Sessions live in memory, so a server restart or a mistyped link lands you here. Nothing was saved. | Start a session | Back to Home    |
| Connection lost      | Connection lost      | We can't reach the session right now. When you reconnect you'll join as a new Participant, so Make your Estimate again.                    | Try again       | Back to Home    |
| Something went wrong | Something went wrong | The session hit an error we didn't expect. Try again, or start a fresh session.                                                            | Try again       | Start a session |

### Loader

Option C, "Pixel progress bar" (canvas: Spec · Loader options).

- A bar with a 3px ink border, white fill and a `4px 4px 0 ink` shadow. An
  `progress` fill steps across it in whole blocks, then starts again: large is
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

Everything in this section is **Play only**. Work has no motion besides the theme switch itself, and its loader
is a plain bar.

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

- **Change flash** (Reveal): the Square's 2px ink border, and the mover's
  chip's, turn to a conic gradient of `coral-400`, `sun-400`, `mint-400`,
  `grape-500` and back to `coral-400`. It rolls one full turn, holds, then fades
  back to ink over its last 20%: 1.4s in all. No second border: the rainbow
  lies over the ink one. The reveal wave never replays on a change.

  ```css
  @keyframes ffChangeFlash {
    0% { --flash-angle: 0deg; opacity: 1; }
    80% { opacity: 1; }
    100% { --flash-angle: 360deg; opacity: 0; }
  }
  ```

  With reduced motion the same rainbow shows still, for the same 1.4s, then goes.

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
  Selection, Estimate, Area, Reveal, Abstained.
- Estimate and Selection are the same thing. **Estimate is the display term**
  — prefer it in copy the Participant reads; Selection stays for the mechanics
  of holding and clearing a Square, and for code.
- Never: vote/voting, player, dealer, host, results, tally, cell, choice.
  Crowds are "3 people", not "3 estimates".
- Time and Resources are labels, not units — no hours or days anywhere.
- Poker is metaphor for headlines only ("Cards down", "The Flip", "Flip the
  points"); functional labels use the CONTEXT terms.

Welcome copy, the "Why I made this" notes and both repo links are written and
live in the code; none is a placeholder any more.

---

## 11. Implementation notes

- Tailwind class strings must be literal in source (`cn build` scans
  `src/**/*.{ts,tsx}`). Anything computed at runtime — Square size, crowd step,
  tooltip position — goes in a `style` attribute or picks from a literal lookup
  (`const CROWD = ['bg-crowd-0', …, 'bg-crowd-4'] as const`).
- Put tokens, font names and domain numbers (7s logo cycle, 1.6s copied state,
  4px gap, logo values) in `src/constants.ts` per the repo rules.
- Every word the UI says, aria-labels included, lives in `src/content.ts` with a
  `play` and a `work` version, read through `useContent()`. The copy quoted in
  this document is the Play version.

Tokens live in `src/index.css`, in two tiers:

```css
:root {
  /* tier 1: primitives, never in @theme, so no utility can name them */
  --plum-950: #1e1b2e;
  --grape-500: #6a4ff0;
  /* … */

  /* tier 2: roles, Play values */
  --background: var(--cream);
  --card: var(--white);
  --shadow-control: 4px 4px 0 var(--plum-950);
  --radius-control: 0;
  --font-display: "Bungee", sans-serif;
  /* … */
}

@theme inline {
  --color-*: initial; /* Tailwind's palette off: only roles generate utilities */
  --color-background: var(--background);
  --shadow-control: var(--shadow-control);
  --radius-control: var(--radius-control);
  /* … */
}
```

Shadows go through `@theme inline` rather than `@theme` because Tailwind bakes a `@theme` shadow's value into the
utility, which a theme override couldn't reach.

---

## 12. Open before implementing

The build sequence is [`docs/plans/fold-and-flip.md`](docs/plans/fold-and-flip.md).

### Still open

Nothing. The copy that was open here is now written (§10).

### Settled

| Question                        | Answer                                                                                                                                   |
| ------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| Session name                    | Dropped from window titles — they read `live`, `the reveal`, `join`, `new-session`. The backend has no name field and gains none           |
| Large Numerical grids on mobile | Minimum Square size plus horizontal scroll. No per-device cap, so the grid never depends on the device                                   |
| Duplicate names                 | Already handled — `estimator-backend/src/sessionStore.ts:35` does `Jim-1`, `Jim-2`                                                       |
| Breakpoint ranges               | `≤767` mobile · `768–1199` tablet · `≥1200` desktop                                                                                      |
| "Two visual modes"              | Reopened as Play / Work themes — see [`docs/plans/themes.md`](docs/plans/themes.md)                                                     |
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
