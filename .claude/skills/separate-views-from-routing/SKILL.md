---
name: separate-views-from-routing
description: A view's job is to render the data it's given; a router's job is to decide which view applies. Neither does the other's job — a view must never contain a switch/lookup that picks between several sibling screens based on a status value (that's a routing decision hiding in a view), and a router/route config must never itself compute display content. Violating this costs three things at once: separation of concerns, reusability, and clarity of where decisions live. Use when designing or reviewing any component that conditionally renders one of several sibling screens/views based on a status value, or when deciding whether a given application state deserves its own route.
---

**The rule**: a view renders data it's handed; it does not decide which of several screens applies. A router decides which screen applies; it does not itself render content. The moment one component does both — picks a screen *and* is nominally "the" screen — separation of concerns, reusability, and clarity of decision-making all break at once, not just one of them. Treat this as one rule with three visible symptoms, not three separate concerns to weigh independently.

## Separation of concerns

**The violation**: `SessionPage.tsx` in this repo started as a `switch` over a status union (`loading`/`not-found`/`ended`/`name-gate`/`participant`/`admin`), picking a component per case. That's two unrelated jobs in one file: decide *which* screen applies, and *be* a screen. The first fix attempt — moving the identical `switch` into a new file, `SessionStateView.tsx`, with `SessionPage` just rendering it — didn't fix anything, because the new file still did both jobs too. It was called out directly: "all you have seemed to have done is moving the switch (router) from `SessionPage` into a child component." Renaming the file changed its address, not its job.

**The actual fix**: recognize that the statuses being switched on weren't incidental rendering variants — they were distinct application states (an ended session, a join prompt, an active vote) that a user might bookmark, refresh into, or receive a link to independently of the others. States like that belong in the URL as separate routes, not behind any component's conditional. Once `/:sessionId/join`, `/:sessionId/start`, and `/:sessionId/ended` existed as real routes, no file needed to contain the full "status → screen" mapping ever again — the router's own path matching did that job.

**The test to apply**: before writing (or defending) a switch/if-chain that picks between sibling screens, ask — would a user ever want to bookmark, refresh into, or be sent a link to this exact screen independent of the others? If yes, it's a routing decision and belongs as a separate route. If no (a loading flicker, an inline validation message — genuinely transient, nothing to bookmark), it's fine to handle inline within whichever route is already active.

## Reusability

A real view — given data, returns markup — can be reused anywhere the right data exists, with zero knowledge of where that data came from or what else the app can render. A status-dispatching component can't be reused that way: pulling it into a new context means dragging along every sibling case it knows how to pick between, because picking between them *is* its job. Merging `ActiveSessionView`'s participant/admin cases into one component (justified because the product itself treats admin as "a participant plus one capability") is the kind of reuse this rule is trying to protect — a dispatcher merge would instead be gluing two unrelated decisions together, not the same thing.

## Clarity of decision-making

The decision of "which screen for which status" should exist as one explicit, first-class artifact — a route table, readable top to bottom — not be reconstructable only by finding wherever some dispatcher component happens to be imported. `useRequireStatus`, the one hook every session route calls, is what keeps the *mismatch* half of this decision (wrong route for the current status → redirect to the right one) equally explicit and equally singular, rather than letting each page invent its own ad hoc redirect logic.

**The tell**: if a component can't be described in one sentence without the word "or" ("renders the ended view *or* the join form *or* the active grid, depending on...") — it's a dispatcher, not a view, no matter what it's named or where it lives.

## Practical consequence: shared state doesn't survive a route change unless you make it

Separating states into real routes can break an assumption that some piece of state (a live socket connection, an in-flight async machine) persists across a navigation between them — it won't, by default, if a component that unmounts on route change owns it. This repo resolved it by keeping the routes fully flat (no shared parent/layout route) and moving the persistent piece into a plain module-level registry (an object outside the React tree, keyed by `sessionId`, created lazily and read via a selector) rather than assuming React would carry it across the navigation. Don't assume continuity across a route change; if something must survive it, name explicitly where it lives and why.
