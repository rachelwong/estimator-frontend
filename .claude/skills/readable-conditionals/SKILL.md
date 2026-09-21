---
name: readable-conditionals
description: Conditional expressions in this repo read in one pass. No nested ternaries (oxlint's no-nested-ternary enforces it). A ternary or ?? chain gets simple parts only — a compound condition, a negated group, or an inline object literal gets pulled into a named const first — and a choice among three or more outcomes becomes an if/return helper in src/utils/. Use when writing or reviewing any line that packs a ternary, a && / || / ?? chain, or a `!(...)` into a single expression, or when a one-liner "works" but needs a second read.
---

A conditional expression should read in one pass. If you have to hold part of it in your head to parse the rest, split it.

## Rules

1. **No nested ternaries.** `a ? x : b ? y : z` becomes a helper with early returns. `eslint/no-nested-ternary` in `.oxlintrc.json` fails the lint on it.
2. **A ternary's condition is one idea.** A compound condition (`a && !(b && c(d))`) goes into a named boolean first. The name says *what* the condition means, so the ternary reads as a sentence.
3. **No `!(...)` around a group.** Name the group (`isHoveringPinned`) and negate the name, or flip the ternary's branches.
4. **`??` / `||` chains take names, not literals.** An inline object or computed fallback at the end of a chain gets its own const (`originSquare`).
5. **Three or more outcomes means a function.** It goes in `src/utils/` (see `one-component-per-file`), using `if` + `return`, one outcome per branch.

Two-outcome ternaries with a plain condition are fine and preferred over `if`/`let`: `isInteractive ? undefined : revealDelay(...)`.

## Examples

Compound condition and a negated group:

```ts
// Before
const tooltipSquare = hovered && !(pinned && isSameSquare(pinned, hovered.square)) ? hovered.square : null

// After
const hoveredSquare = hovered?.square ?? null
const isHoveringPinned = hoveredSquare !== null && pinned !== null && isSameSquare(pinned, hoveredSquare)
const tooltipSquare = isHoveringPinned ? null : hoveredSquare
```

A fallback literal buried in a chain:

```ts
// Before
const tabStop = cursor ?? selection ?? { time: axisValues[0], resource: axisValues[0] }

// After
const originSquare = { time: axisValues[0], resource: axisValues[0] }
const tabStop = cursor ?? selection ?? originSquare
```

Nested ternary, three outcomes:

```ts
// Before
const chip = viewer.isAdmin ? 'Admin' : viewer.hasJoined ? 'Participant' : undefined

// After: src/utils/viewer.ts
export function revealChip(viewer: RevealViewer): string | undefined {
  if (viewer.isAdmin) {
    return 'Admin'
  }

  if (viewer.hasJoined) {
    return 'Participant'
  }

  return undefined
}
```

## Why

A one-liner saves vertical space and costs a reread every time someone opens the file. A named intermediate records the reason for a condition, and a reviewer checks the name against the expression once instead of re-deriving it each time.
