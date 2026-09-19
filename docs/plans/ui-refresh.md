# UI Refresh — Plan

Frontend only. No protocol or backend change.

Three features, each specced separately:

| # | Feature | Spec |
| --- | --- | --- |
| 1 | Area highlighting on the grid | [grid-area.md](../features/grid-area.md) |
| 2 | Tooltips on the axis titles | [axis-tooltips.md](../features/axis-tooltips.md) |
| 3 | Welcome page and `/new` | [intro-page.md](../features/intro-page.md) |

Terms follow [CONTEXT.md](../../CONTEXT.md). **Area** was added for this work.

## Decisions

| Topic | Decision |
| --- | --- |
| Area shape | Filled rectangle from the origin to the Square: Time ≤ x **and** Resources ≤ y |
| Hover + Selection | Both shown at once |
| Picked Square | Unchanged, `green-500` |
| Selection's Area | `neutral-400` fill, after the server acks the Selection |
| Hovered Area | `ring-2 ring-neutral-500`, no fill. Overlap = fill + ring |
| Touch | No hover, Selection's Area only |
| Reveal | Unchanged. No Areas |
| Axis tooltips | "Time" and "Resources" titles only, with ⓘ icon. Active grid and Reveal |
| Home | `/` → `/welcome`. Create form moves to `/new` |
| Joiners | Never see `/welcome`. Share link stays `/:sessionId/join` |
| Welcome CTA | "Create a new session" → `/new` |
| Header title | Links to `/welcome` |

No ADR: every decision is cheap to reverse.

## Sequencing

```
1 grid-area ──┐
2 axis-tooltips ├─► update PLAN.md ─► smoke run
3 intro-page ──┘
```

Independent. Any order, one commit each. Suggested order: 3, 1, 2. The route
change touches the smoke tests the most, so doing it first keeps later runs green.

## Cross-cutting

- **PLAN.md drift.** Update the "Routes" table and "Cell states" section when done.
- **Constants.** New strings (tooltip copy, route paths, tints) go in
  `src/constants.ts`, per `agent.md`.
- **Smoke tests.** `create.mjs`, `routing.mjs` and `session.mjs` assume `/` is
  the create form. See [intro-page.md](../features/intro-page.md).

## Verification

1. `npm run build` and lint pass.
2. Smoke suite passes against a local backend.
3. Manual pass: hover and click on a 0–8 Numerical grid and a Fibonacci grid.
   Check the Areas, the tooltips on both grids, and every route in the intro spec.
