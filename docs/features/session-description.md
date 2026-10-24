# Feature — Session description

> **Status: pending.** Nothing below is built yet. Remove this note once it ships
> on both branches and the doc has been re-checked against the code.

The admin can add an optional description when creating a session: the ticket
or task being estimated. It shows on the Join, Active and Reveal screens, and
any `http://` or `https://` link in it can be clicked.

Backend side: `estimator-backend/docs/features/session-description.md`. The
backend ships first.

## Decisions taken

Don't re-open these while implementing.

- **Optional.** Create works without one. When there is none, no empty box is
  shown on any screen.
- **One line of plain text and links.** It's a single-line input, not a
  textarea. The ends are trimmed and whitespace runs collapse to one space,
  mirroring the server.
- **Up to 300 characters**, counted after that clean-up, the same way the
  server counts.
- **Shown to everyone**, Admin and Participant, on Join, Active and Reveal.
- **Fixed at creation.** It can't be edited.
- **Comes from REST.** The Join, Start and Ended loaders already call
  `GET /sessions/:id`. No socket change.
- **Links:**
  - Only `http://` and `https://` URLs become links. Anything else, including
    `javascript:`, stays plain text.
  - A link opens in a new tab, with `target="_blank"` and
    `rel="noopener noreferrer"`.
  - Trailing `.,;:!?)]` are left out of the link, so a URL at the end of a
    sentence works.
- **No HTML rendering.** The text is split on `URL_PATTERN` with
  `String.split` and rendered as React elements. Never `dangerouslySetInnerHTML`, and never
  `html-react-parser` for this.
- **Branches:** build on `master` first and verify it, then make the same edit
  on `release/design`. Each branch gets its own smoke run.
- **The Welcome hero gets a demo description**, so the demo Reveal looks like a
  real one. It includes a link to
  `https://github.com/rachelwong/estimator-frontend`. The Welcome page exists
  only on `release/design`, so this part is done on that branch alone.

## Screens

| Screen | What changes |
| ------ | ------------ |
| Create (`/new`) | New optional field, "Ticket or task", between the name and the point system. It's a single-line `Input` with a live `n/300` counter. Over 300 shows the rule and disables Create. |
| Join (`/:id/join`) | The description shows under "Join session", so people know what they're estimating before they give a name. |
| Active (`/:id/start`) | The description shows under "Make your Estimate". |
| Reveal (`/:id/ended`) | The description shows under "The Reveal". |
| Welcome hero (`/welcome`, `release/design` only) | The demo Reveal shows `WELCOME_DEMO_DESCRIPTION`, with a working GitHub link. |

Styling follows `DESIGN.md` tokens. Links are underlined with a visible focus
ring. Long URLs wrap (`break-words`) instead of pushing the window wider.

## Changes

Follow the repo skills: `centralized-types`, `no-magic-strings`,
`one-component-per-file`, `page-behaviour-lives-in-page`,
`separate-views-from-routing`.

| File | Change |
| ---- | ------ |
| `src/types/protocol.ts` | Mirror the backend. `CreateSessionRequest.description?: string`. `description: string \| null` on `CreateSessionResponse` and `GetSessionResponse`. |
| `src/constants.ts` + `src/types/constants.ts` | Add `INVALID_DESCRIPTION` to `ErrorCode`. |
| `src/types/routes.ts` | Add `JoinLoaderData { description: string \| null }`. |
| `src/lib/patterns.ts` | `URL_PATTERN = /(https?:\/\/[^\s<>"]*[^\s<>".,;:!?)\]])/` (a capturing group, and the last character can't be trailing punctuation) and `WHITESPACE_RUN_PATTERN = /\s+/g` (mirrors the backend). All regexes live in this file. |
| `src/lib/validation.ts` | Mirror `MAX_DESCRIPTION_LENGTH = 300` and `normalizeDescription`. Add `descriptionError(text): string \| null`. The server's `INVALID_DESCRIPTION` stays the backstop. |
| `src/components/SessionDescription.tsx` (new) | Takes `description: string \| null` and renders nothing when it's null. Renders `description.split(URL_PATTERN)` in a `break-words` block: even indexes are text, odd indexes are links. |
| `src/routes/CreateSessionPage.tsx` | Description state, the existing `Input` component, the counter and the error. `canSubmit` also requires `descriptionError(description) === null`. |
| `src/routes/loaders.ts` | `createSessionAction` reads `formData.get('description')` and passes it through. `joinLoader` returns `{ description: session.description }` instead of `null`. Its redirects stay the same. |
| `src/routes/JoinSessionPage.tsx` | `useLoaderData() as JoinLoaderData`, then render `<SessionDescription>`. |
| `src/routes/ActiveSessionPage.tsx` | `useLoaderData()` (`startLoader` already returns the session), then pass `description` to the view. |
| `src/components/ActiveSessionView.tsx` | New `description` prop, rendered under the heading. The view never reads the loader itself. |
| `src/components/RevealWindow/RevealWindow.tsx` | New optional `description?: string \| null` prop, rendered under the heading. |
| `src/routes/EndedPage.tsx` | Pass `session.description` to `RevealWindow`. |
| `src/constants.ts` (`release/design` only) | Add `WELCOME_DEMO_DESCRIPTION` next to the other `WELCOME_DEMO_*` values. Draft copy, yours to edit: `Fold & Flip is open source: https://github.com/rachelwong/estimator-frontend`. One line, under 300 characters. |
| `src/routes/WelcomePage/HeroSection.tsx` (`release/design` only) | Pass `description={WELCOME_DEMO_DESCRIPTION}` to the hero's `RevealWindow`. |

## Content-Security-Policy

Defence in depth. The description is user text shown to everyone, and today
`vercel.json` sends no security headers. A CSP means that even if a future
change rendered HTML by mistake, an injected script still wouldn't run.

Add a `headers` block to `vercel.json`. It applies to every Vercel deploy,
so both branches get it. Local dev (`vite`) is unaffected.

```
default-src 'self';
script-src 'self';
style-src 'self' 'unsafe-inline';
img-src 'self' data:;
font-src 'self' data:;
connect-src 'self' https://estimator-backend-1nf2.onrender.com wss://estimator-backend-1nf2.onrender.com;
object-src 'none';
base-uri 'self';
form-action 'self';
frame-ancestors 'none'
```

Why each part:

- `script-src 'self'`: only the built bundle runs. No inline or remote
  scripts. This is the line that stops XSS.
- `style-src 'unsafe-inline'`: Radix (the alert dialog) injects a `<style>`
  tag. Inline styles are low risk next to scripts.
- `img-src` / `font-src data:`: Vite inlines small assets as `data:` URIs.
- `connect-src`: the Render backend, for REST (`https`) and the socket
  (`wss`). If the backend URL ever changes, this has to change with the Vercel
  `VITE_*` vars.
- `frame-ancestors 'none'`: no other site can frame the app (clickjacking).
- `form-action 'self'`: the Create and Join forms only post to the app's own
  routes.

Rollout:

1. Ship it as `Content-Security-Policy-Report-Only` first.
2. On a Vercel preview, open every screen (Welcome, Create, Join, Active, the
   end dialog, Reveal, not-found) and check the console for violations.
3. Fix any violations, then rename the header to `Content-Security-Policy`.

## Tests

The frontend has no unit test runner yet (see `docs/plans/testing.md`), so the
checks go in the Playwright smoke suite (`npm run smoke`).

`scripts/smoke/lib.mjs`

- `createSessionByApi(type, max, description)` takes a third, optional
  argument.

`scenarios/create.mjs`

- Create is enabled with no description.
- The counter updates as you type.
- 301 characters shows the rule and disables Create.
- Creating with `PROJ-12 https://example.com/ticket/12.` lands on `/start` and
  shows the description.
- The link's `href` is `https://example.com/ticket/12` (trailing dot dropped).
  It has `target="_blank"` and `rel="noopener noreferrer"`.

`scenarios/welcome.mjs` (`release/design` only)

- The demo Reveal shows the demo description.
- Its link has `href="https://github.com/rachelwong/estimator-frontend"`,
  `target="_blank"` and `rel="noopener noreferrer"`.

`scenarios/join.mjs`

- The Join screen shows the description and link for a session created by the
  API with one.
- No description block for a session created without one.

`scenarios/session.mjs`

- A participant sees the description on Active.
- After the admin ends the session, the Reveal shows it for both the admin and
  the participant, and the link is still clickable.
- Injection check: `<b>x</b> javascript:alert(1)` shows as literal text. There
  is no `<a>` and no `<b>` element.

## Docs to update when it ships

- `estimator-plan.md`: add the field to the API section.
- `DESIGN.md` §7: add the description to the Create, Join, Active and Reveal
  screen notes.
- Remove the "pending" note at the top of this file.

## Verification

- `npm run lint` and `npm run build` (`tsc -b`) pass.
- `npm run smoke` passes with both dev servers running, on `master` and then on
  `release/design`.
- CSP, on a Vercel preview: `curl -I <preview-url>` shows the header, and no
  screen logs a CSP violation in the console. Smoke runs against local `vite`,
  so it can't check the CSP.
- By hand, with two browsers:
  - Create with a description that includes a link.
  - Join from the second browser. The description shows on Join and Active.
  - End the session. Both browsers show it on the Reveal.
  - Clicking the link opens a new tab.
  - Create without a description. No empty box shows on any screen.
  - On `release/design`, `/welcome` shows the demo description. Its GitHub
    link opens in a new tab.
