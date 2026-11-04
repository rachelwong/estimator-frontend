# Testing — Plan

Frontend only. No protocol or backend change.

The backend has a Vitest suite (`estimator-backend/tests/`, about 2,200 lines).
The frontend has none. [PLAN.md](../../PLAN.md) scoped automated tests out
("Verification is by hand, per phase"), and decision #17 in
`estimator-plan.md` has no CI gate. This plan reverses the first, not the
second: tests run locally, nothing blocks a deploy.

**Record the reversal.** Update the "Also out of scope" line in `PLAN.md` and
the Vitest row in its tooling table when phase 0 lands, or the two documents
contradict each other.

## The model: the Testing Trophy

Shaped by Kent C. Dodds,
[The Testing Trophy and Testing Classifications](https://kentcdodds.com/blog/the-testing-trophy-and-testing-classifications).
Four layers, and the width of each is where the effort goes:

| Layer | Dodds's definition | Here | Share |
| --- | --- | --- | --- |
| End-to-end | The full system, minimal mocking | `npm run smoke` (exists) | few |
| **Integration** | Several units working together | Routes rendered with the real router, loaders, reducer and registry | **most** |
| Unit | One function or object, dependencies mocked | Pure functions with real branching | some |
| Static | Linting and type checking | `oxlint` and `tsc -b` (exist) | already done |

His rule, from Guillermo Rauch: **"Write tests. Not too many. Mostly
integration."** Its justification is the line this plan uses to pick every test:
**"The more your tests resemble the way your software is used, the more
confidence they can give you."**

An earlier draft of this plan was a pyramid: a wide base of unit tests on
`grid.ts`, a thin middle. That is the shape the trophy argues against. Unit
tests of helpers that a screen already calls prove the helper, not that the
screen works, and break on every refactor of the internals. This version
inverts it.

### How each layer applies

**Static — already paid for.** `oxlint` and `tsc -b` run on `npm run lint` and
`npm run build`. The repo's conventions (no magic strings, centralised types,
one component per file) are the same idea. Nothing to add. Phase 0 only checks
that test files are covered by both.

**End-to-end — exists, stays.** `scripts/smoke/` is about 1,000 lines of
Playwright against the real dev servers: welcome, create, routing, join, and a
full multi-participant session. It is not a test runner (no isolated cases, no
assertions library, needs both servers). It stays as it is and is not ported.
Dodds's point that E2E is slow and costly is why this plan adds few of them and
leans on it for the two-browsers-one-session check that nothing cheaper can do.

**Integration — the bulk.** A test renders a route inside a memory router, with
the real loaders, the real `sessionConnectionReducer`, the real
`sessionConnectionRegistry`, the real components. It drives the screen the way
a person does (type a name, click a Square) and asserts on what they would see
(the grid, the banner, the URL). Mocking happens only at the two edges of the
app, where the network begins:

| Edge | File | Fake |
| --- | --- | --- |
| HTTP | `fetch`, used by `lib/api.ts` | A stubbed `fetch` returning `Response`s |
| WebSocket | `lib/socket.ts`, the only file importing `socket.io-client` | A fake `AppSocket`: an event emitter that records `emit`s and lets the test push server events |

`lib/socket.ts` already being a single seam is what makes this cheap. Nothing
inside the app is mocked. `@/lib/api`, `@/lib/adminToken` and the registry run
for real. (An earlier draft mocked those. That tests the mock.)

**Unit — only where a function earns it.** A pure function gets its own test
when it has branching a screen test would reach only awkwardly: boundaries,
thresholds, string formats. A function that is just glue gets none, and is
covered by the integration tests that call it. That cuts `grid.ts` from every
export to the handful with real logic (phase 3).

**Classification.** Dodds notes terminology is not standardised, so the line
used here: a test is *unit* if it imports one module and no module it depends
on is real and stateful. It is *integration* if it goes through a route and the
registry. A test file's name says which: `*.test.ts` beside the module for
units, `*.integration.test.tsx` under `src/routes/` for integration.

## What already covers the top

See End-to-end above. No new E2E scenarios in this plan, except one candidate
under Open questions.

## Decisions

| Topic | Decision |
| --- | --- |
| Runner | Vitest, reusing `vite.config.ts` so the `@` alias and plugins match the app |
| Component testing | `@testing-library/react` + `jsdom`, querying by role and label, never by class name or test id where a role exists |
| Environment | `node` by default. `jsdom` per file for integration tests |
| Mock boundary | `fetch` and `lib/socket.ts` only. Nothing in between |
| What is asserted | What a user sees or where they land. Never reducer state, registry internals or call counts of internal functions |
| Location | Beside the code. `*.test.ts` for units, `*.integration.test.tsx` for routes |
| Fixtures | One `src/test/` folder: the fake socket, a `fetch` stub, session response builders. Three real consumers (integration files) justify it |
| Coverage | No threshold. A number to chase is not the goal |
| CI | None. `npm test` runs locally before a push (decision #17) |

## Phase 0 — Setup

1. `npm i -D vitest jsdom @testing-library/react @testing-library/user-event`.
2. Add `"test": "vitest run"` and `"test:watch": "vitest"` to `package.json`,
   matching the backend's script names.
3. Add a `test` block to `vite.config.ts`: `include: ['src/**/*.test.{ts,tsx}']`,
   default environment `node`.
4. Check `*.test.*` files are covered by `oxlint` and `tsc`, and are **not**
   in the production bundle (`npm run build`).
5. **Make the router testable.** `routes/router.tsx` calls
   `createBrowserRouter` and exports the singleton, so a test cannot make a
   router with its own URL. Export the route-object array, and build the
   browser router from it. One small refactor, no behaviour change. Tests call
   `createMemoryRouter(routes, { initialEntries })`.
6. Build `src/test/`: `createFakeSocket()`, `stubFetch(routes)` and a
   `buildSession()` builder.
7. One throwaway test to prove the runner, the alias and `jsdom` resolve.
   Delete it once phase 1 lands.

**Verify:** `npm test`, `npm run lint` and `npm run build` pass, and the app
still runs (`npm run dev`).

## Phase 1 — The routing integration tests

The highest-value tests, and what the trophy says to write first. They cover
the logic that decides where a person lands, which is the likeliest thing to
regress. They replace what an earlier draft called "loader unit tests",
because a loader on its own is never how the app is used.

File: `src/routes/routing.integration.test.tsx`. Each test builds a memory
router at a URL, stubs `fetch` with a session response, and asserts the
**resulting screen and URL**.

| Scenario | Arrange | Assert |
| --- | --- | --- |
| Unknown session | `GET /sessions/:id` returns 404 | Not-found page shown |
| Share link, open session, no identity | Open session | Join form shown |
| Share link, ended session | Ended session | Ended page shown |
| Admin with a stored token | Token in storage, open session | Lands on the active session |
| Stale admin token, restarted server | Token in storage, 404 | Not-found page. REST runs before the token check (`loaders.ts:30`) |
| Back from active to `/join` | A live connection already exists | Stays on the active session. No second Participant |
| Network failure | `fetch` rejects | The error page with retry. Not a redirect |
| Ended session visited at `/start` | Ended session | Ended page |

## Phase 2 — The session flow integration tests

File: `src/routes/session.integration.test.tsx`. These render the whole
session, with the fake socket standing in for the server.

| Scenario | Drive | Assert |
| --- | --- | --- |
| Join, then estimate | Type a name, submit. Fake server sends `session-info` and `joined`. Click a Square | The Square shows as selected. The socket received one `select-square` with that Square's time and resource |
| Change vote | Click another Square | Highlight moves. One selection on screen |
| Deselect | Click the selected Square again | Selection cleared |
| Name validation | Submit an empty name, then a name with illegal characters | An inline error, and no `join` was emitted |
| Server error | Fake server sends `error` | The banner appears and can be dismissed |
| Session ends | Fake server sends `session-ended` with a Reveal | Ended view, with each name on its Square |
| Dropped connection | Fake server disconnects | The person is re-prompted for a name (`reconnection: false` is deliberate) |
| Admin ends the session | Open the confirm dialog, confirm | `end-session` emitted once, and a double-click does not emit twice |
| Create form | Submit with valid input. Then with `fetch` failing | Redirected to the new session. Then an in-place error, not a thrown page (`loaders.ts:171`) |

The contract with the backend is the **event names and payload shapes in
`types/protocol.ts`**. The fake socket is typed by `AppSocket`, so a protocol
change breaks these tests at compile time, and not by luck.

**Verify (both phases):** Break one thing on purpose in app code, for example
swap two `redirect` targets in `startLoader`, then drop the `select-square`
emit. Confirm a test fails each time. Revert.

## Phase 3 — Unit tests, only where earned

Pure functions with branching a screen test would reach only awkwardly.
Everything else in `grid.ts` is exercised through phase 2.

| Module | Test |
| --- | --- |
| `utils/grid.ts` `inArea` | The origin, the corner (inclusive), one past it on each axis (exclusive) |
| `utils/grid.ts` `stepSquare` | Each direction. Stops at every edge, never wraps. A 1×1 grid. **Only if a keyboard handler uses it** (open question 1) |
| `utils/grid.ts` `squareSize`, `labelSize` | Both sides of each threshold, per breakpoint |
| `utils/grid.ts` `nextPinned` | Pin, unpin, switch Square |
| `utils/grid.ts` `squareAriaLabel`, `tooltipText` | Zero, one and many names. These strings are read by screen readers |
| `utils/pointSystems.ts` | `pointSystemValues` per type. `sliderTickIndexes` where the tick count does not divide evenly |
| `lib/validation.ts` | `normalizeName`, `nameError`: empty, too long, bad characters, valid |
| `lib/sessionConnectionReducer.ts` | An unrelated action returns the **same reference** (the store's `getSnapshot` relies on it). Transitions are already covered by phase 2, so only this invariant gets a unit test |

Skipped on purpose: `squareFillClass`, `squareHighlight`, `axisEmphasis`,
`revealDelay`, `squareLabel`, `groupNames`, `landedPeople`, `popoverTitle`,
`squareKey`, `squareSelector`, `isSameSquare`. They are glue or one-liners, and
the grid screen in phase 2 exercises them. If a regression slips through one,
add a unit test then. A test written after the bug is worth more than one
written to be thorough.

**Contract fixtures.** `validation.ts` mirrors the backend's name regex, and
`pointSystems.ts` mirrors its `computeAxisValues`. The frontend test cannot
import the backend. Copy a short table of accepted and rejected names, and of
point-system values, into both repos' tests with a comment naming the other. If
one changes, the other test is the reminder.

## Not tested

Dodds's argument is partly about what to leave out.

- **Hooks on their own.** `useEscapeKey`, `useDelayedVisibility` and
  `useBreakpoint` are exercised by the screens that use them. A hook test
  restates the hook. `useCrowdChatter` and `useFullyInView` are timing and
  IntersectionObserver wiring, so a test would restate the code.
- **Welcome page markup.** Static, and the smoke suite already loads it.
- **Snapshot tests.** They assert on the markup, not on what a person sees.
- **The real socket.** `socket.io-client` is third-party. The smoke suite
  checks the real connection.
- **Replacing `scripts/smoke`.**
- **A GitHub Actions workflow** (decision #17).

## Order and size

| Phase | Adds | Layer |
| --- | --- | --- |
| 0 | Runner, `jsdom`, router export, `src/test/` | setup |
| 1 | Routing integration | integration |
| 2 | Session flow integration | integration |
| 3 | About 6 small files | unit |

Each phase ends with its checks and a run of `npm test`. After phase 2, run
`npm run smoke` once with both servers up. The router export in phase 0 is the
only change to app code, so a smoke failure means that refactor changed
something.

**Expected shape:** a few dozen integration cases, a smaller set of unit cases,
the existing smoke suite. Not the other way round.

## Open questions

1. Is `stepSquare` live? `estimator-plan.md` decision #18 says click and tap
   only, no keyboard navigation, yet `grid.ts` has a stepping function. Confirm
   a keyboard handler uses it before testing it, or the decision is stale.
2. Does the grid render lazily? `router.tsx` code-splits Active and Ended with
   `lazy()`. Integration tests will need `await findBy…` for the first render.
   Check it is not flaky under `jsdom` before phase 1.
3. Does a fake `AppSocket` need to model the server's ack order (`joined`
   before `selection-acknowledged`)? If a test would pass with events out of
   order, give the fake a small script of the real handshake. Otherwise it
   asserts on a sequence the backend never produces.
4. One E2E candidate for `scripts/smoke`: two browser contexts, one session,
   confirm each sees the other's name at Reveal. Check `session.mjs` already
   does it before adding.
