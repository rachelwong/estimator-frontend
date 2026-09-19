---
name: one-component-per-file
description: Every .tsx file in this repo holds exactly one React component and its own XyzProps interface — nothing else at module level. Sub-components get their own file in a folder named after the parent; helpers go to src/utils/, shared types to src/types/, constants and lookup tables to src/constants.ts, each folder with a barrel. Use when writing or reviewing any .tsx file, or when a component grows a helper function, a module-level constant, or a second component.
---

A `.tsx` file is the component, its `XyzProps` interface, and imports. Every other module-level declaration has a home elsewhere:

| Declaration | Home | Import from |
| --- | --- | --- |
| Pure helper function | `src/utils/<domain>.ts` (`grid.ts`, `errors.ts`) | `@/utils` |
| Shared type | `src/types/<domain>.ts` — see `centralized-types` | `@/types` |
| Constant, lookup table, option list | `src/constants.ts` — see `no-magic-strings` | `@/constants` |
| Sub-component | its own file in the parent's folder (below) | `./Child` |
| Non-component JSX config (e.g. the router) | its own `.tsx` beside its consumers (`src/routes/router.tsx`) | its path |

A component-scoped constant (`MAX_VISIBLE_NAMES`, `CELL_CLASS`) still goes in `src/constants.ts`, with a comment naming what it's for. Closures inside the component body (`handleSelect`) are part of the component and stay put.

## Sub-components get a folder

When a component needs a child that nothing else uses, the parent becomes a folder:

```
src/components/EstimationGrid/
├── index.ts            export { EstimationGrid } from './EstimationGrid'
├── EstimationGrid.tsx
├── GridCell.tsx
├── CellNames.tsx
└── AxisValue.tsx
```

`index.ts` exports only the parent, so the children stay private and `@/components/EstimationGrid` keeps resolving. Siblings import each other relatively (`./CellNames`). Each child names its props interface (`CellNamesProps`) rather than typing them inline.

## Barrels

`src/utils/index.ts` and `src/types/index.ts` re-export every file in their folder. Add a line when you add a file. The types barrel uses `export type *`, since `src/types/` holds types only. Consumers import from the barrel (`@/types`, `@/utils`), not from the file inside it.

## `src/utils/` vs `src/lib/`

`src/utils/` holds pure domain helpers: data in, data out (`cellState`, `groupNames`, `describeError`). `src/lib/` holds modules that talk to the outside world or a framework: the API client, `localStorage` access, validation schemas, and shadcn's `cn` in `lib/utils.ts`, which stays there because `components.json` points at it.

## Why

Fast refresh only preserves state for a module that exports components alone — the same reason `src/routes/loaders.ts` sits apart from the pages. And a file that is only its component reads as one thing: its props, then its markup.
