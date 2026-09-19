# Feature — Grid Area

Show the **Area** of a Square: every Square from the origin up to and including
it. Makes the Time × Resources of a Selection visible at a glance.

## Behaviour

Active Session only (`GridMode.INTERACTIVE`). The Reveal is unchanged.

Hovering (5, 4) while holding a Selection at (2, 2):

```
Resources
    8 │ ·  ·  ·  ·  ·
    5 │ ·  ·  ·  ·  ·
    4 │ ○  ○  ○  ○  ◎      ○ hovered Area — ring
    2 │ ●  ◉  ○  ○  ○      ● Selection's Area — neutral-400 fill
    0 │ ●  ●  ○  ○  ○      ◉ picked Square — green-500 (unchanged)
      └───────────────     ◎ hovered Square
        0  2  4  5  8  Time
```

| Condition | Look |
| --- | --- |
| Picked Square | `green-500`, as today |
| In Selection's Area | `neutral-400` fill |
| In hovered Area | `ring-2 ring-neutral-500` |
| Both | fill + ring |
| Neither | `neutral-200`, as today |

- The Selection's Area appears only after `selection-acknowledged`, since the
  grid already applies Selections that way (PLAN.md "Applying an acknowledged
  Selection").
- Clearing the Selection (clicking the picked Square again) removes its Area.
- The hovered Area clears when the pointer leaves the grid, not between cells,
  so there's no flicker across the `gap-1` gutters.
- Touch devices get no hover. Only the Selection's Area shows.
- Values are axis values, not indices. For Fibonacci `0 1 2 3 5`, the Area of
  (3, 2) covers Time `0 1 2 3` × Resources `0 1 2`.

## Changes

| File | Change |
| --- | --- |
| `src/utils/grid.ts` | `inArea(square, corner)`: `time <= corner.time && resource <= corner.resource`. Extend `cellState` to return the Area state |
| `src/constants.ts` | `CellState.AREA` → `bg-neutral-400` in `CELL_CLASS`. `PREVIEW_CLASS = 'ring-2 ring-neutral-500'` |
| `src/types/constants.ts` | Nothing. `CellState` type derives automatically |
| `EstimationGrid.tsx` | `hovered: Selection \| null` state. `onMouseEnter` per cell (interactive only), `onMouseLeave` on the grid container. Pass the preview flag to `GridCell` |
| `GridCell.tsx` | Accept the preview marker and append `PREVIEW_CLASS`. Use an enum, not a boolean (`agent.md`) |

`cellState` precedence in interactive mode: picked → `CHOSEN`, inside the
Selection's Area → `AREA`, else `EMPTY`. Readonly logic is untouched.

## Acceptance

- [ ] Hover shows a ring on every Square with Time ≤ x and Resources ≤ y.
- [ ] After a click is acked, the picked Square is green and its Area is `neutral-400`.
- [ ] Hovering elsewhere shows both Areas, and the overlap has fill + ring.
- [ ] Re-clicking the picked Square clears it and its Area.
- [ ] Moving the pointer off the grid clears the ring.
- [ ] Ended page: only Squares with names are green, and there are no fills or rings.
- [ ] Works the same for the Admin and for Participants.
