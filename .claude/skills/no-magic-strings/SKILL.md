---
name: no-magic-strings
description: Production-code convention for this repo — a fixed set of string literals used as a discriminant (===, a `switch`/discriminated-union tag, or a parameter restricted to a known set) must be defined once as a const object, with the union type derived from it living separately in src/types/constants.ts (see the centralized-types skill) — never retyped as a literal at a call site, and never declared as a const/type pair in the same file. Keys are ALL_CAPS, and every one of these const objects lives in one dedicated `src/constants.ts`, exported from there — never declared locally in whichever file happens to need it first. Use when writing or reviewing any src/ file that introduces a new type/status/kind field, or that compares a value against one of a known set of strings.
---

Four rules, one pattern — the const-object shape mirrors the same convention in the sibling `estimator-backend` repo (`src/types.ts`'s `PointSystemType`, `src/errors.ts`'s `ErrorCode`); the key casing, single-file grouping, and const/type file split below are frontend-only preferences on top of that shape, not something being retrofitted onto the already-shipped backend.

## Define the constant once, derive the type in a separate file, use the accessor everywhere

Don't declare a string union and then retype its members as literals at every comparison/branch site (`type === 'numerical'`, `{ status: 'admin' }`). Define a `const` object first, in `src/constants.ts`:

```ts
// src/constants.ts
export const SessionConnectionStatus = {
  CONNECTING: 'connecting',
  ACTIVE: 'active',
  ENDED: 'ended',
} as const;
```

...and derive its union type in `src/types/constants.ts`, not the same file — a const's runtime value and its derived compile-time type are different things, and types are centralized the same as every other non-prop type (see `centralized-types`):

```ts
// src/types/constants.ts
import { SessionConnectionStatus } from '../constants';
export type SessionConnectionStatus = (typeof SessionConnectionStatus)[keyof typeof SessionConnectionStatus];
```

(The value import and the type declaration don't collide despite the identical name — values and types occupy separate namespaces in TypeScript.) Then reference `SessionConnectionStatus.ACTIVE`, never `'active'`, in application code — as a discriminated-union tag, in comparisons (`state.status === SessionConnectionStatus.ACTIVE`), and as arguments; import the value from `constants.ts` where you need the runtime value, and the type from `types/constants.ts` where you only need it as a type annotation.

**Why the const/type split specifically**: it's the same reasoning as `centralized-types` generally, applied to this one recurring case — a file that only needs `SessionConnectionStatus` as a type annotation shouldn't have to pull in the runtime object too, and vice versa. Keeping them in one file "because they're related" is the same instinct `centralized-types` already rejects for prop types living apart from shared ones — relatedness isn't the deciding factor, what a given consumer actually needs is.

**Why the const-object pattern at all**: a literal retyped at N call sites has N chances to typo, and even when TypeScript catches the typo (because the parameter is already narrowed to the union), the literal still isn't rename-safe or autocomplete-discoverable the way `Thing.MEMBER` is. The const object is the single source of truth; the type and every call site derive from it.

This applies even when the literal already looks constant-ish (`'notFound'`) — the same drift risk exists.

## Keys are ALL_CAPS

`PointSystemType`'s members are `NUMERICAL`/`FIBONACCI`, not `Numerical`/`Fibonacci` — a deliberate frontend preference, chosen even though it means this repo's key casing no longer matches the backend's own `PointSystemType`/`ErrorCode` (which use `PascalCase` keys). The *shape* (const object + derived type) still mirrors the backend; only the casing of the keys differs. Don't "fix" this by matching the backend's casing, and don't go change the backend's already-shipped code to match this repo either — the two are independently-versioned repos with no shared import path (see below), so there's no requirement that their casing agree, only that each repo is internally consistent.

## One dedicated file per half, not one const-object-and-type pair per consumer

Every const object in this codebase lives in `src/constants.ts`; every type derived from one lives in `src/types/constants.ts` — `PointSystemType`, `SessionConnectionStatus`, `GridMode`, and any future one, split the same way each time. A file that needs the value `import`s it from `./constants` (or `../constants`, depending on depth); a file that only needs the type imports it from `./types/constants`. Neither ever gets redeclared locally next to whatever component/hook/type first needed it, even if that file is the only current consumer. This keeps every discriminant's full set of values discoverable in one place, rather than requiring a repo-wide search to find out how many of these exist.

## `PointSystemType` must match the backend's shape, not just its values

`src/types.ts` is hand-duplicated from `estimator-backend/src/types.ts` (see `PLAN.md`, Phase 2) — that duplication has to include the backend's `PointSystemType` const object itself, not just a `'numerical' | 'fibonacci'` literal union that happens to accept the same values. A bare union re-expresses the backend's constant as a second, independent literal — exactly the drift this skill exists to prevent, just moved to the boundary between the two repos instead of within one file.

## Centralizing doesn't help when the duplicate is outside the module graph

This skill's fix (const object, single import) only works within one module graph. `estimator-backend` and `estimator-frontend` are separate repos with no shared import path — the frontend's `PointSystemType`/`SessionConnectionStatus`-style constants can mirror the backend's shape, but nothing in TypeScript enforces that the two repos' values stay in sync. If backend's `PointSystemType` ever gains a third member, that has to be caught by eye (or a cross-repo test reading both files at runtime), not by the compiler.

## Does not apply to `tests/`

If/when this repo adds a `test-conventions` skill (as the backend has), tests should hand-type raw literals (`'admin'`, `'ended'`) as expected values, independent of the implementation's constants — that independence is what makes the assertion a real check rather than the same claim written twice. Don't "fix" test literals by swapping in the production constant.
