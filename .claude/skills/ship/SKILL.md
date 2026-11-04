---
name: ship
description: Rachel's end-to-end workflow for a fix or feature on Estimator (estimator-backend + estimator-frontend) — plan, build, user-level tests, every check in both repos, docs updated in place, feedback saved, no commits. Run only when Rachel types /ship.
argument-hint: <describe the fix or feature>
disable-model-invocation: true
hooks:
  PreToolUse:
    - matcher: "Bash"
      hooks:
        - type: command
          command: '"$CLAUDE_PROJECT_DIR"/.claude/skills/ship/hooks/block-commit.sh'
  Stop:
    - hooks:
        - type: command
          command: '"$CLAUDE_PROJECT_DIR"/.claude/skills/ship/hooks/check-before-stop.sh'
          timeout: 300
---

The change: $ARGUMENTS

Work through every step, in order.

This file is mirrored in both repos. Edit one, copy it to the other.

## The project

- One fullstack app in two sibling repos: `../estimator-backend` and `../estimator-frontend`.
- The frontend deploys two branches. `release/design` is production, the one real users use. `master` is the other deployed branch.
- `estimator-plan.md` is the high-level source of truth. It must be identical in both repos.

## 1. Understand and plan

- Run `git branch --show-current` in the frontend. Frontend work goes on `release/design`. If it's on another branch, ask before editing.
- Restate the change in one or two sentences.
- Read the decisions in `estimator-plan.md` that the change touches. If it reverses one, stop and ask before going further.
- Note if the change alters the REST or socket contract (`src/ws/events.ts`, `src/ws/schemas.ts`, `src/routes/`, the frontend's `src/types`). A contract change needs both repos updated.
- Write a short plan: what changes, in which repo, and which user-facing behaviour it affects.

## 2. Build

- Follow `CLAUDE.md` and every skill in `.claude/skills/` of the repo being edited. The frontend also has `agent.md`.
- Keep domain logic out of routes and socket handlers (see `CLAUDE.md`).

## 3. Tests, from a user's point of view

- Write each test as something a person does and sees. Name it that way: "a participant who joins after the reveal can't vote", not "selectSquare throws SESSION_ENDED".
- Prefer end-to-end and integration tests:
  - Backend: drive the real HTTP server (`supertest`) and real socket clients, like `tests/sessions.test.ts` and `tests/handlers.test.ts`.
  - Frontend: add or extend a Playwright scenario in `scripts/smoke/scenarios/`.
- Don't test internals: no checks on private helpers, state shape, or which function was called.
- List the edge cases a real user could hit, then cover each one. Start with:
  - admin and participant in different browsers; the same person in two tabs
  - joining, voting or refreshing before, during and after the reveal
  - an expired or unknown session link
  - empty, too-long, duplicate or odd input (spaces, emoji, case)
  - slow or dropped connection, Render cold start
- If the change affects a flow in `docs/testing/testrigor-e2e-test-cases.md`, update that case or add one.

## 4. Run every check

- Backend: `npm run typecheck`, `npm run lint`, `npm test`, `npx prettier --check` on changed files.
- Frontend: `npx tsc -b`, `npm run lint`.
- Start both dev servers (backend on :3001, frontend on :5173, on `release/design`), then run `npm run smoke` in the frontend. Stop any server you started when you're done.
- The stop hook re-runs the fast checks when you try to finish, and blocks until they pass.
- Report results as they are. If something fails and you can't fix it, say so with the output.

## 5. Update the docs in place

- The two repos' docs drift. Check both repos, even if the code change is in only one: `CLAUDE.md`, `README.md`, `PLAN.md`, `DEPLOYMENT.md`, `docs/`, the frontend's `CONTEXT.md` and `DESIGN.md`.
- Fix every doc the change makes out of date, including drift you find on the topic.
- `estimator-plan.md`:
  - Any behaviour that touches both frontend and backend means a change to it.
  - Edit one copy, then copy it over the other so both are identical. The stop hook checks this.
  - Keep it high level. Detail goes in `docs/features/`.
- Write the docs as if things always worked this way. No "updated on", "previously", "now changed", or changelog sections.
- Short plain sentences or bullets.
- Add a `docs/features/<name>.md` for a new feature, matching the existing ones.

## 6. Save feedback

- If Rachel corrects code quality during this change, save the rule so it applies next time:
  - a rule about the code → add it to the matching skill in `.claude/skills/` of the repo it applies to, or create a new skill
  - a personal preference about how to work → save it to memory
- Say what you saved and where.

## 7. Hand over

- Never commit or push. The hook blocks it.
- Summarise, per repo:
  - what changed
  - the tests added, in plain words
  - the checks run and their results
  - the docs updated
  - feedback saved, if any
- Suggest a commit message per repo, in the style of `git log`. Name the frontend branch.
