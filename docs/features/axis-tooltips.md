# Feature — Axis Tooltips

> **Superseded by [`DESIGN.md`](../../DESIGN.md) §6** (Fold and Flip, Stage 4).
> The axis titles are plain Silkscreen labels, "resources ↑" and "time →", with
> no ⓘ and no hint. Kept for the record.

Explain the axis titles so Participants pick with the same meaning in mind.

## Behaviour

- Applies to the "Time" and "Resources" titles only. Axis values get no tooltip.
- Each title is followed by a small ⓘ icon (`lucide-react` `Info`, `size-3.5`,
  muted). The title and the icon together form the trigger.
- Shown on both the active grid and the Reveal, since they share one component.
- Uses the existing shadcn `Tooltip` (`src/components/ui/tooltip.tsx`).

The copy must not name a unit. Time and Resources are labels, not units
(CONTEXT.md).

| Title | Copy (draft, user to edit) |
| --- | --- |
| Time | Duration, not effort. Go higher for dependencies or unknowns. |
| Resources | Anything the task needs, such as effort, people or dependencies. Your team decides. |

## Changes

| File | Change |
| --- | --- |
| `src/constants.ts` | `AXIS_HINT = { TIME: '…', RESOURCES: '…' }` |
| `EstimationGrid/AxisTitle.tsx` (new) | `label` + `hint` props. Renders the trigger (label + icon) and the tooltip. One component per file |
| `EstimationGrid.tsx` | Replace the two title `<span>`s with `AxisTitle`. The Resources title keeps its vertical writing mode and rotation. The icon must sit correctly in both orientations |

Make the trigger a `<button type="button">` so it's focusable. That doesn't
contradict decision #18, which covers keyboard navigation of Squares only.

## Acceptance

- [x] Hovering or focusing "Time" or its ⓘ shows the Time copy. Same for Resources.
- [x] Works on `/:sessionId/start` and `/:sessionId/ended`.
- [x] The vertical Resources title still reads bottom-to-top, with the icon aligned.
- [x] No axis value has a tooltip.
