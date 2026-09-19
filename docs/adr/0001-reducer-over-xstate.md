# A plain reducer, not XState

The session connection is a state machine — named states, a fixed set of
transitions — and XState was the obvious fit. We built it that way, then
replaced the library with a plain reducer in a small subscribable store. The
state-machine thinking stayed. Only the library went.

## Why

An XState actor is built to live and die with a component. This app needs the
connection to survive the navigation from `/:sessionId/join` to
`/:sessionId/start`, because re-joining on that navigation would create a second
Participant.

Working around that meant adding pieces that existed only to satisfy the
library: `provide()`-wired navigation actions, and an actor registry keyed for
exactly this purpose.

The tell was in the file itself. `sessionMachine.ts` was supposed to be pure
domain logic, and it ended up with states named after routes and an entry action
called `navigateToJoin`. A reader could no longer tell what the file was for.
That is the same blurring the `separate-views-from-routing` skill exists to
prevent.

A plain function makes no assumption about lifetime, so putting it in a store to
outlive a route change is an ordinary thing to do rather than a workaround. Each
piece keeps one obvious job — the reducer computes the next state, the store
holds it and tells subscribers.

## What this is not about

Not code size. The reducer version is smaller, but that is incidental. A smaller
solution that is vague about what each piece is for would not have won. The
reason is that every piece's job is now obvious from its name.

## Consequences

- The store is hand-written: subscribe, notify, and a `whenSettled()` promise
  for the join action. About 60 lines we own rather than a dependency.
- No XState devtools or visualiser. The Mermaid diagram in `PLAN.md` is kept by
  hand and can drift from the code.
- Route `loader`s absorbed the one-time entry checks — does this Session exist,
  has it ended, is there an Admin token. Those never needed live tracking, so
  the reducer only covers what is still live after a page settles.

Revisit if a second machine of real complexity appears. One machine this size
does not pay for a library.
