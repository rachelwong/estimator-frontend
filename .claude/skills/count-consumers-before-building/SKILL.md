---
name: count-consumers-before-building
description: Before building a general mechanism a plan asks for (a generator, a prop-driven variant, a registry, a config layer, "X becomes a component so it can Y"), grep the spec — DESIGN.md, CONTEXT.md, docs/plans/, docs/features/ — for the places that actually need it, and state the count. One or two consumers means write the specific thing, not the general one. Use when starting a phase or stage from a plan in docs/plans/, when a plan step describes a capability rather than a screen, or when about to write code whose job is to serve other code.
---

A plan that describes a capability ("sprites recolour by prop") is not evidence that anything needs that capability. The spec says what actually needs it, and checking takes one grep. Do that before writing the mechanism.

## Rules

1. **Count before you build.** When a plan step describes something general, grep `DESIGN.md`, `CONTEXT.md`, `docs/plans/` and `docs/features/` for the screens or components that actually use it.
2. **Say the count out loud.** Before writing any code, say "one confirmed consumer: the Reveal notice's spade" (or whatever the count and consumer are). If the count is zero, the step is speculative, so raise it with the user instead of building it.
3. **One or two consumers get the specific version.** Handle each case directly where it's used (an `<img>` plus one CSS rule, a prop on one component). Build the general mechanism only when there are enough real consumers that the specific versions would repeat each other.
4. **Say the plan's assumption back before following it literally.** "The plan says every sprite becomes a component so it can recolour. The spec has one recoloured sprite. Build that one case instead?" The user will ask this question anyway. Ask it first.

## Example

Stage 2 of the Fold and Flip refresh (`docs/plans/fold-and-flip.md`) said "sprites become React components, fills driven by prop so they recolour." Following that literally produced a generator script and 30 generated `.tsx` files.

Grepping `DESIGN.md` for recoloured sprites found exactly one: a cream spade on the Reveal's dark notice. The whole generated layer was deleted and replaced with direct `.svg` imports rendered by `Sprite` (an `<img>`), plus one special case for the spade.

```tsx
// Before: generated, one per sprite, all to serve a single recolour
<SpadeSprite fill="var(--color-cream)" />

// After: the asset as it is
import spade from '@/assets/sprites/spade.svg'
<Sprite source={spade} />
```

## Why

Removing a general mechanism takes more work than never writing it, and while it exists, every reader has to understand it before they can see that it serves one case. Counting consumers is cheap and settles the question before any code gets written.
