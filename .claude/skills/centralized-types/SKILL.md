---
name: centralized-types
description: Every non-prop TypeScript type in this repo lives in src/types/, not declared locally next to whichever module first needed it. Component prop interfaces (e.g. EstimationGridProps) are the one deliberate exception — those stay local to the component file they describe. Use when adding a new interface/type, or when deciding where a type you're about to write should live.
---

## The rule

`src/types/` is the one place non-prop types live — split by what they describe, not by which file first needed them: `src/types/protocol.ts` for anything hand-duplicated from the backend's wire protocol (`PointSystem`, `Selection`, `RevealPayload`), `src/types/session.ts` for frontend-only concepts like `SessionConnectionState`, and `src/types/constants.ts` for the type derived from each const object in `src/constants.ts` (see `no-magic-strings` — the const itself stays in `constants.ts`, only its derived type lives here). A file that needs one of these imports it; it never redeclares its own local copy, even when it's currently the only consumer.

**Component prop types are the exception.** `EstimationGridProps`, and any other `XyzProps` interface, stays declared in the component file it belongs to, not moved into `src/types/`. A prop type is part of that component's own public surface, not a shared domain concept — centralizing it would separate a component's signature from its implementation for no benefit, since nothing else is meant to import a prop type directly.

## Why the split, not "centralize everything"

This mirrors the same reasoning as the `no-magic-strings` skill's `src/constants.ts`: discoverability for things genuinely shared across the codebase (any file might need `PointSystem`) is worth one dedicated home. But a prop interface has exactly one legitimate reader — the component it describes — so there's no discoverability problem to solve by moving it, only indirection to add. Don't over-apply "centralize types" to the case this skill explicitly carves out.

## How to apply it

Before writing a new `interface`/`type`, ask: is this describing a component's own props (stays local), or a concept another file might need to import (goes in `src/types/`, split alongside whichever existing file — `protocol.ts` or `session.ts` — it belongs with, or a new file if neither fits)? Don't declare a shared type inline next to its first use "for now" — put it in `src/types/` from the start, the same way a magic string goes straight into `src/constants.ts` rather than being promoted there later.
