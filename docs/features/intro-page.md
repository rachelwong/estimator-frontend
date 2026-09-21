# Feature — Welcome Page

An introductory home page for creators. Joiners never see it.

## Routes

| Path                              | Before              | After                                       |
| --------------------------------- | ------------------- | ------------------------------------------- |
| `/`                               | `CreateSessionPage` | Redirects to `/welcome`                     |
| `/welcome`                        | —                   | `WelcomePage` (static, no loader)           |
| `/new`                            | —                   | `CreateSessionPage` + `createSessionAction` |
| `/:sessionId`, `/:sessionId/join` | unchanged           | unchanged                                   |

- Declare `/welcome` and `/new` before `/:sessionId`. React Router ranks static
  segments above dynamic ones anyway, but keeping them adjacent to `/` reads clearly.
- `welcome` and `new` can't collide with a Session id. The backend generates
  16-character ids (`estimator-backend/src/utils/id.ts`).
- The share link stays `${origin}/${sessionId}/join`. No change to `ShareLink`.

## Page content

Draft, to edit:

```
Estimate together on two axes.

1. Pick a Square for Time × Resources — privately.
2. The Admin ends the Session.
3. The Reveal shows where everyone landed. Talk it over.

[ Create a new session ]  → /new
```

Terms match CONTEXT.md: Square, Session, Admin, Reveal. Avoid "estimate".

## Other links

| Where                               | Before            | After                                    |
| ----------------------------------- | ----------------- | ---------------------------------------- |
| `AppHeader` title                   | plain `<h1>` text | `<Link to="/welcome">` inside the `<h1>` |
| `EndedPage` "Create new session"    | `/`               | `/new`. The user already knows the app   |
| `NotFoundPage` "Create new session" | `/`               | `/new`                                   |

The header link can take someone out of an active Session. That's already
handled: the connection registry and Back-button handling (PLAN.md "Keeping the
connection across a navigation") cover leaving and returning.

## Changes

| File                                           | Change                                                         |
| ---------------------------------------------- | -------------------------------------------------------------- |
| `src/constants.ts`                             | `RoutePath = { WELCOME: '/welcome', NEW: '/new' }`             |
| `src/routes/WelcomePage.tsx` (new)             | Static page. Button uses `Button asChild` + `Link`             |
| `src/routes/router.tsx`                        | `/` → `redirect(RoutePath.WELCOME)`. Add `/welcome` and `/new` |
| `src/components/AppHeader.tsx`                 | Title links to `/welcome`                                      |
| `src/routes/EndedPage.tsx`, `NotFoundPage.tsx` | Link to `/new`                                                 |
| `PLAN.md`                                      | Update the Routes table                                        |

## Smoke tests

| Scenario      | Change                                                                                            |
| ------------- | ------------------------------------------------------------------------------------------------- |
| `create.mjs`  | `goto(APP + '/new')`. Add a check that `/` lands on `/welcome` and that its button reaches `/new` |
| `routing.mjs` | `adminPage.goto(APP)` → `/new`. Add `/welcome` and `/new` to the known-route checks               |
| `session.mjs` | `admin.goto(APP)` → `/new`                                                                        |

## Acceptance

- [x] `/` lands on `/welcome`.
- [x] "Create a new session" opens the create form at `/new`. Creating still reaches `/:id/start`.
- [x] The share link opens `/:id/join` directly, with no welcome page.
- [x] The header title goes to `/welcome` from any page.
- [x] Ended and Not Found pages link to `/new`.
- [x] Smoke suite passes.
