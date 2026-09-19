# Feature — Entry Bundle Trim

Cut the entry chunk by taking two things out of it that cold start never needs:
the full Tailwind merge tables, and the Radix tooltip.

## Why

A sourcemap attribution of the entry chunk showed the app's own code was 16 KB
of 449 KB. Almost everything else was framework, but two entries were avoidable:

| | Before | Note |
| --- | --- | --- |
| `react-dom` | 202.4 KB | Floor for React 19. Not addressable |
| `react-router` | 91.0 KB | `createBrowserRouter` pulls `dom/ssr/*` into an SPA. No flag for it |
| `cn` | 24.7 KB | Ships every Tailwind class group at runtime |
| Radix tooltip + floating-ui | ~49 KB | Reached the entry via a root-level provider |
| socket.io + engine.io | 40.4 KB | Eager via `loaders.ts`. Left alone, see Not done |
| **app code** | **16.1 KB** | |

## Changes

### 1. Compile the `cn` merge tables

`cn` resolves Tailwind class conflicts from tables covering every class group in
Tailwind, loaded at runtime. Its `cn/vite` plugin compiles a table subset fitted
to the classes this project actually uses, and `cn/engine`'s `createCn` binds
the engine to it.

| File | Change |
| --- | --- |
| `vite.config.ts` | Add the `cn` plugin, scanning `src/**/*.{ts,tsx}` into `src/lib/cnTables.ts` |
| `src/lib/utils.ts` | Was `export { cn } from "cn"`. Now `createCn(tables)` from `cn/engine` |
| `src/components/ui/*.tsx` (7 files) | `import { cn } from "cn"` → `from "@/lib/utils"`. Importing `"cn"` anywhere re-adds the full tables |
| `package.json` | `build` runs `cn build` before `tsc -b` |
| `.gitignore` | `src/lib/cnTables.ts` is generated |

The `cn build` step in `build` is not redundant with the plugin: the plugin runs
at Vite's `buildStart`, which is after `tsc -b` in the script, so on a fresh
clone the typecheck would fail on a missing module. `npm run dev` needs no such
step — the plugin generates the file when the dev server boots.

`cnTables.ts` is inside the globs it is compiled from. That is deliberate and
harmless: it holds class group names, not class names, so it contributes no
candidate tokens and the output is stable across rebuilds. Scoping the globs to
`*.tsx` instead would silently miss `src/constants.ts`, which does hold classes.

### 2. Move `TooltipProvider` to the grid

Every tooltip in the app is inside `EstimationGrid` (`AxisTitle` and
`GridCell`). The provider sat in `App.tsx`, so the entry chunk carried the Radix
tooltip, popper, dismissable-layer, presence and all of floating-ui — none of
which Welcome or Join renders.

| File | Change |
| --- | --- |
| `src/App.tsx` | Drop `TooltipProvider`. Now just `RouterProvider` |
| `EstimationGrid/EstimationGrid.tsx` | Wrap the root in `TooltipProvider` |

Behaviour is unchanged. The provider's `delayDuration = 0` default and its
skip-delay coordination only ever applied to tooltips in this subtree.

The grid, not the view, is the right owner because tooltips are a grid feature:
`AxisTitle` and `GridCell` are the only consumers and both are `EstimationGrid`'s
own sub-components, so the provider sits at the root of a closed unit. The
alternative — one provider per view, in `ActiveSessionView` and `EndedPage` —
costs the same in bundle size (both are already lazy) and would be the better
placement if a tooltip ever appeared outside the grid, on `ShareLink` or
`AdminControls` say. Worth knowing if that day comes: `Tooltip` throws without a
provider ancestor, so the failure is a runtime error inside a lazy chunk, not a
type error.

One latent caveat: a provider per grid means two grids on a page would form two
skip-delay groups rather than one. Inert while `delayDuration` is 0 and no view
renders two grids.

The code-split comment in `router.tsx` claimed the tooltip already rode along
with the Active/Ended chunks. It did not, because of the root provider. It does
now.

## Result

| | Before | After | |
| --- | --- | --- | --- |
| entry chunk, raw | 449.6 KB | 392.5 KB | −57.1 KB |
| entry chunk, gzip | 145.8 KB | 126.0 KB | −19.8 KB |

Split by change: the tooltip move is ~50 KB of it, relocated into the lazy
`SessionStatusHeader` chunk (7.3 → 48.9 KB), which only `/start` and `/ended`
load. The `cn` change is ~7 KB net — less than the 24.7 KB the package occupied,
because the merge engine is ~13 KB whatever the tables hold, and the compiled
tables are themselves ~5 KB. Only the table subsetting was ever winnable.

CSS is byte-identical; no other chunk grew.

## Not done

- **`socket.io` (40.4 KB) in the entry.** `router.tsx` imports all loaders
  eagerly, and `loaders.ts` reaches `lib/socket.ts` through the connection
  registry, so `engine.io-client` ships every transport to Welcome, which never
  opens a socket. Fixable with react-router's `lazy` route property, but that
  restructures the route config rather than moving an import.
- **`react-router` (91 KB).** Would mean a different router.
- **`react-dom` (202 KB).** Would mean Preact.

## Acceptance

- [x] `npm run lint` clean (two pre-existing `only-export-components` warnings
      in shadcn files, untouched)
- [x] `npm run build` from a fresh tree, with `cnTables.ts` absent
- [x] `npm run smoke` 89/89, including the axis tooltip and Reveal tooltip checks
- [x] No `import ... from "cn"` left in `src/`
