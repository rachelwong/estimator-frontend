# Feature — Reveal colours, names with spaces, create gating

Three UI changes shipped as one round. The first two are frontend only; the
name rule is mirrored in `estimator-backend`, which enforces it.

| # | Change | Scope |
| --- | --- | --- |
| 1 | `Start Session` stays disabled until the form is answered | `/new` |
| 2 | A name may contain spaces, not symbols | `/new`, `/:sessionId/join`, backend |
| 3 | Every person gets their own colour on the Reveal | `/:sessionId/ended` |

## 1 — Create gating

`Start Session` enables only when all three hold:

| Condition | Rule |
| --- | --- |
| Name | `nameError(adminName) === null` |
| Point system | One of `PointSystemType` — the radio defaults to Numerical, so this is a guard, not a click the Admin has to make |
| Maximum | `sliderMax > 0`. A grid of one Square is no grid |

The slider starts at 0 and switching point system resets it to 0
(`handlePointSystemChange`), so the button re-disables on a switch. No extra
copy explains the disabled state: `RangeSlider` already shows the live value
next to its label.

## 2 — Names with spaces

Same rule on both sides of the wire, and it stays hand-mirrored:

- Normalize first — `name.trim().replace(/ +/g, ' ')`. A stray double space
  collapses rather than erroring.
- Then `/^[A-Za-z0-9]+( [A-Za-z0-9]+)*$/`, with the normalized name capped at
  20 characters.
- Message: *Use 1-20 letters, numbers or spaces, with no symbols.*

| Input | Result |
| --- | --- |
| `Jim Bob` | Accepted, stored as `Jim Bob` |
| `jim  bob` | Accepted, collapsed and capitalized to `Jim Bob` |
| `  Jim  ` | Accepted, stored as `Jim` |
| `Jim@Bob` | Rejected, `INVALID_NAME` |
| 21 characters | Rejected, `INVALID_NAME` |

The backend's `formatName` now capitalizes **per word**, not per name — before
this round it lowercased everything after the first character, which would have
stored `Jim Bob` as `Jim bob`. Uniqueness is unchanged: `isNameTaken` compares
whole lowercased names, so a second `Jim Bob` still becomes `Jim Bob-1`.

## 3 — A colour per person on the Reveal

Ended screen only. The live grid is untouched — green still means *your own
Selection*, and it never has a roster to colour. Nothing on the Reveal responds
to hover: a Square either says everything it has to say, or opens on a click.

```
Resources
    5 │ ·    ·    ·    ·  [Jonathan]      a Square one person picked is
    4 │ ·    ·    ·    ·    ·             theirs entirely, in their colour
    3 │ ·    ·    ·  ╔═══════════╗
      │              ║  2 votes  ║        crowded: grey, deeper the bigger
    2 │ ·  [Rachel]  ╚═══════════╝        the crowd, inside a rainbow border
    1 │ ·    ·    ·    ·    ·             that rolls — click for the names
      └────────────────────────────
        0    1    2    3    4   Time

click a crowded Square ──►  ┌──────────┐
                            │ [Jennifer] │   each name a badge
                            │ [Susan]    │   in its owner's colour
                            └──────────┘
```

| Square | Look |
| --- | --- |
| Nobody picked it | `neutral-200`, as before |
| One person | filled with that person's colour, carrying their name |
| Two people | `neutral-400` + rainbow border, reading `2 votes` |
| Three | `neutral-500` |
| Four | `neutral-600` |
| Five or more | `neutral-700` |
| Legend | "Who is who", a swatch per person, under the grid |
| Abstained | unchanged, plain outline badges |

A crowded Square never lists names on its face — three names in a 28px Square
is unreadable at any size the grid actually reaches — so it carries the count
and opens the badges on a click. Only a crowded Square opens: a Square one
person picked already names them on their own colour, so there is nothing
behind it to reveal, and it stays inert. A name too long for its Square is
read from the legend. The rainbow border is a masked pseudo-element in
`src/index.css`, animated through an `@property` angle, and it holds still
under `prefers-reduced-motion`.

**Assignment.** `participantColours(reveal, sessionId)` collects every name in
`reveal.squares[].names` plus `reveal.abstained`, sorts them, and hands out a
palette that has been **shuffled** first — nothing about a person's name
decides their colour. The shuffle is seeded with the Session id, so it is
random across Sessions but identical on every screen looking at this one, and
a refresh doesn't reshuffle it: a colour someone calls out across the room
means the same thing on everybody's screen. Names are the key because they're
unique per Session — the backend's `makeUniqueName` suffixes a duplicate to
`Ada-1` before storing.

**The palette.** Sixteen Tailwind hues at the 300/400 shades, no greys (grey
belongs to the crowd), each with its own hue at 950 for text. Order doesn't
matter — it is shuffled — and past sixteen people it cycles.

The classes are whole literal strings in `src/constants.ts`. Tailwind's scanner
and `cn build` only see classes that appear in the source, so a fill class can
never be assembled at runtime.

## Changes

| File | Change |
| --- | --- |
| `src/lib/patterns.ts` | New. Every production regex in one place, mirroring the backend's `utils/patterns.ts` |
| `src/lib/validation.ts` | `normalizeName`, the new message, `isPointSystemType` |
| `src/routes/CreateSessionPage.tsx` | `canSubmit` from the three conditions |
| `src/constants.ts` | `CellState.REVEALED`, `CROWDED_SQUARE_CLASS`, `CROWDED_SQUARE_BORDER_CLASS`, `PARTICIPANT_COLOUR_CLASS`. `MAX_VISIBLE_NAMES` is gone |
| `src/index.css` | The `rainbow-border` utility, its `@property` angle and keyframes |
| `src/types/session.ts` | `ParticipantColours = ReadonlyMap<string, string>` |
| `src/utils/participantColours.ts` | New. Seeded shuffle, roster → colour map |
| `src/utils/grid.ts` | Readonly `cellState` returns `REVEALED`; `revealedSquareClass` picks the fill |
| `SquareLabel.tsx` | Was `CellNames.tsx`. A name, or `N votes` |
| `GridCell.tsx` | Fills the Square, and opens the badges on a click |
| `EstimationGrid.tsx` | Optional `colours` prop, unset on the live grid |
| `src/components/ParticipantLegend.tsx` | New. "Who is who" |
| `src/routes/EndedPage.tsx` | Builds the map once from the Session id, feeds grid and legend |
| `estimator-backend` | `utils/validation.ts`, `sessionStore.ts` `formatName`, three tests |

`GridCell` padding is `p-0.5`, not `p-1`: measured against the largest grid
(max 20 → 21 columns → 28px Squares), where the wider padding truncated a name
as short as "Bob".

## Acceptance

- [x] `Start Session` is disabled with no name, with a bad name, and while the max is 0.
- [x] It enables with a valid name and a max above 0, and re-disables when switching point system resets the max.
- [x] `Jim Bob` is accepted on `/new` and on `/join`; `Jim@Bob` shows the rule and opens no socket.
- [x] `jim  bob` is stored and displayed as `Jim Bob`.
- [x] On `/ended`, a Square one person picked is filled with their colour and carries their name.
- [x] A crowded Square is grey, deeper the more votes, inside a rolling rainbow border, and reads `N votes`.
- [x] Clicking a crowded Square opens every name as a badge in its owner's colour; clicking again, clicking away, or Escape closes it.
- [x] A one-person Square is not a button and opens nothing.
- [x] Hovering anything on the Reveal opens nothing.
- [x] The same Session shows the same colours after a refresh, and two different Sessions don't match.
- [x] Three-letter names are not truncated on a 20-max grid.
- [x] The live grid is unchanged: green Selection, `neutral-400` Area, no colours.
- [x] `npm run smoke` passes 100/100; `npm run build` and `npm run lint` are clean; backend `npm test` passes.
