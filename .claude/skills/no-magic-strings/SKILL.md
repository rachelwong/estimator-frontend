---
name: no-magic-strings
description: Production-code convention for this repo — a fixed set of string literals used as a discriminant (===, a `switch`/discriminated-union tag, or a parameter restricted to a known set) must be defined once as a const object, with the union type derived from it living separately in src/types/constants.ts (see the centralized-types skill) — never retyped as a literal at a call site, and never declared as a const/type pair in the same file. Keys are ALL_CAPS, and every one of these const objects lives in one dedicated `src/constants.ts`, exported from there — never declared locally in whichever file happens to need it first. Use when writing or reviewing any src/ file that introduces a new type/status/kind field, or that compares a value against one of a known set of strings. The same convention covers **number** literals that state a domain rule — a threshold, limit or boundary, such as the headcount at which a Square counts as crowded — which get a plain ALL_CAPS const in `src/constants.ts` (no derived type, since there's no union), plus a sweep for the rule's other spellings, because the same boundary is usually also written as an off-by-one somewhere else (`=== 1` where the rule is `< 2`). Use this skill whenever a bare number in a comparison, an index expression or a slice turns out to encode a decision rather than arithmetic — including when someone asks whether a number "should be a constant somewhere", or calls a literal important.
---

One idea — a literal that states a decision gets named once and referenced everywhere — in two shapes: the const object below for a set of string discriminants, and a plain named const for a single number. The const-object shape mirrors the same convention in the sibling `estimator-backend` repo (`src/types.ts`'s `PointSystemType`, `src/errors.ts`'s `ErrorCode`); the key casing, single-file grouping, and const/type file split below are frontend-only preferences on top of that shape, not something being retrofitted onto the already-shipped backend.

## Define the constant once, derive the type in a separate file, use the accessor everywhere

Don't declare a string union and then retype its members as literals at every comparison/branch site (`type === 'numerical'`, `{ status: 'admin' }`). Define a `const` object first, in `src/constants.ts`:

```ts
// src/constants.ts
export const SessionConnectionStatus = {
  CONNECTING: "connecting",
  ACTIVE: "active",
  ENDED: "ended",
} as const;
```

...and derive its union type in `src/types/constants.ts`, not the same file — a const's runtime value and its derived compile-time type are different things, and types are centralized the same as every other non-prop type (see `centralized-types`):

```ts
// src/types/constants.ts
import { SessionConnectionStatus } from "../constants";
export type SessionConnectionStatus =
  (typeof SessionConnectionStatus)[keyof typeof SessionConnectionStatus];
```

(The value import and the type declaration don't collide despite the identical name — values and types occupy separate namespaces in TypeScript.) Then reference `SessionConnectionStatus.ACTIVE`, never `'active'`, in application code — as a discriminated-union tag, in comparisons (`state.status === SessionConnectionStatus.ACTIVE`), and as arguments; import the value from `constants.ts` where you need the runtime value, and the type from `types/constants.ts` where you only need it as a type annotation.

**Why the const/type split specifically**: it's the same reasoning as `centralized-types` generally, applied to this one recurring case — a file that only needs `SessionConnectionStatus` as a type annotation shouldn't have to pull in the runtime object too, and vice versa. Keeping them in one file "because they're related" is the same instinct `centralized-types` already rejects for prop types living apart from shared ones — relatedness isn't the deciding factor, what a given consumer actually needs is.

**Why the const-object pattern at all**: a literal retyped at N call sites has N chances to typo, and even when TypeScript catches the typo (because the parameter is already narrowed to the union), the literal still isn't rename-safe or autocomplete-discoverable the way `Thing.MEMBER` is. The const object is the single source of truth; the type and every call site derive from it.

This applies even when the literal already looks constant-ish (`'notFound'`) — the same drift risk exists.

## Keys are ALL_CAPS

`PointSystemType`'s members are `NUMERICAL`/`FIBONACCI`, not `Numerical`/`Fibonacci` — a deliberate frontend preference, chosen even though it means this repo's key casing no longer matches the backend's own `PointSystemType`/`ErrorCode` (which use `PascalCase` keys). The _shape_ (const object + derived type) still mirrors the backend; only the casing of the keys differs. Don't "fix" this by matching the backend's casing, and don't go change the backend's already-shipped code to match this repo either — the two are independently-versioned repos with no shared import path (see below), so there's no requirement that their casing agree, only that each repo is internally consistent.

## One dedicated file per half, not one const-object-and-type pair per consumer

Every const object in this codebase lives in `src/constants.ts`; every type derived from one lives in `src/types/constants.ts` — `PointSystemType`, `SessionConnectionStatus`, `GridMode`, and any future one, split the same way each time. A file that needs the value `import`s it from `./constants` (or `../constants`, depending on depth); a file that only needs the type imports it from `./types/constants`. Neither ever gets redeclared locally next to whatever component/hook/type first needed it, even if that file is the only current consumer. This keeps every discriminant's full set of values discoverable in one place, rather than requiring a repo-wide search to find out how many of these exist.

## Numbers that state a rule are magic literals too

A number that encodes a domain decision — a threshold, a limit, a boundary — belongs in `src/constants.ts` under an ALL_CAPS name, same as the strings above. What doesn't carry over is the machinery: a threshold is one value, not a set of members, so there's no union to derive and nothing goes in `src/types/constants.ts`. A plain export is the whole pattern:

```ts
// src/constants.ts
export const CROWDED_SQUARE_MINIMUM = 2;
```

**Why, given a number can't be typo'd**: the argument for the string constants is partly typo-safety, and that argument doesn't transfer — `2` is hard to get wrong. The reason to name a number is different and worse: one rule tends to get written several _different ways_, and nothing connects them. When `CROWDED_SQUARE_MINIMUM` was introduced, that single rule — the headcount at which a Square stops being one person's and becomes a crowd — was already spelled four times in three forms:

| Spelling             | Where             | What it decides           |
| -------------------- | ----------------- | ------------------------- |
| `names.length === 1` | `utils/grid.ts`   | someone's colour, or grey |
| `names.length - 2`   | `utils/grid.ts`   | _which_ grey              |
| `names.length === 1` | `SquareLabel.tsx` | a name, or "N estimates"  |
| `names.length < 2`   | `GridCell.tsx`    | whether the Square opens  |

Changing the rule meant finding all four by eye, and two of them don't contain the digit at all.

**So search for the behaviour, not the digit.** The off-by-one restatements (`=== 1` where the rule is `< 2`, `> 0` where the rule is `>= 1`) are the ones that hide from grep, and they're usually in a different file from the arithmetic that made you notice the number. Before you finish, ask what _else_ changes at this boundary — the label, the affordance, the styling — and check those call sites too. A constant that only replaces the literal you happened to be looking at has done the cosmetic half of the job.

**What stays inline**: arithmetic that follows from the data rather than from a decision. `array.length - 1` for the last index, a `/ 2` that means "half", `0` and `1` as identity values — naming those adds indirection and explains nothing. The test is whether the number could be revisited: if someone could reasonably decide a Square is crowded at three people, that's a rule; if the number is forced by the maths, it's arithmetic.

**When the constant does two jobs, say so in its comment.** `CROWDED_SQUARE_MINIMUM` is both the threshold and the origin `CROWDED_SQUARE_CLASS` counts from (`names.length - CROWDED_SQUARE_MINIMUM` indexes the greys). Keep such a constant next to the table it indexes, and note the coupling — raising it moves the threshold correctly everywhere but silently re-maps the table's entries onto different crowd sizes, which no compiler will catch.

## `PointSystemType` must match the backend's shape, not just its values

`src/types.ts` is hand-duplicated from `estimator-backend/src/types.ts` (see `PLAN.md`, Phase 2) — that duplication has to include the backend's `PointSystemType` const object itself, not just a `'numerical' | 'fibonacci'` literal union that happens to accept the same values. A bare union re-expresses the backend's constant as a second, independent literal — exactly the drift this skill exists to prevent, just moved to the boundary between the two repos instead of within one file.

## Centralizing doesn't help when the duplicate is outside the module graph

This skill's fix (const object, single import) only works within one module graph. `estimator-backend` and `estimator-frontend` are separate repos with no shared import path — the frontend's `PointSystemType`/`SessionConnectionStatus`-style constants can mirror the backend's shape, but nothing in TypeScript enforces that the two repos' values stay in sync. If backend's `PointSystemType` ever gains a third member, that has to be caught by eye (or a cross-repo test reading both files at runtime), not by the compiler.

## Does not apply to `tests/`

If/when this repo adds a `test-conventions` skill (as the backend has), tests should hand-type raw literals (`'admin'`, `'ended'`, and numbers like `2`) as expected values, independent of the implementation's constants — that independence is what makes the assertion a real check rather than the same claim written twice. Don't "fix" test literals by swapping in the production constant.
