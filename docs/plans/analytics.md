# Analytics — Plan

Add Vercel Web Analytics to see traffic: page views, visitors, referrers,
countries, devices. Page views only. No custom events (those need Vercel Pro),
no Speed Insights. Rachel does every dashboard step.

| #   | Do                                                   | Who    |
| --- | ---------------------------------------------------- | ------ |
| 1   | Enable Web Analytics in the Vercel dashboard (D1–D3) | Rachel |
| 2   | Code: install, mount, redact session IDs (A1–A4)     | code   |
| 3   | Local checks, full stack (A5–A7)                     | code   |
| 4   | Push, verify on production (V1–V6)                   | Rachel |

**Order matters:** enable the dashboard toggle (D2) before the code reaches
production. Until analytics is enabled, the analytics script returns 404 and
nothing is recorded. The site still works, but those visits are lost.

---

## Decisions

| #   | Decision                                         | Why                                                                                                                                                                                  |
| --- | ------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 1   | Page views only, Hobby plan                      | Custom events need Pro. Traffic is the question being asked                                                                                                                          |
| 2   | No Speed Insights                                | Separate package and toggle. Can be added later on its own                                                                                                                           |
| 3   | Session IDs are replaced before sending          | See "Session IDs" below                                                                                                                                                              |
| 4   | Production only, with no code to enforce it      | Preview builds already fail the `VITE_*` env check (`deployment.md` → Gotchas), and local dev runs the package in debug mode, which sends nothing. Nothing else would ever send data |
| 5   | `<Analytics />` lives in `RootLayout`, not `App` | RootLayout renders only after the first loaders settle, so the first page view is recorded on the final URL, not on `/:sessionId` before its redirect to `/join`                     |

### Session IDs

Every page view sends its URL. Here the URL carries the session ID
(`/k3x9q/join`), which causes two problems:

- **Unreadable data.** Every session becomes its own page in the dashboard,
  where the useful view is one row per screen.
- **The ID is the invitation.** There are no accounts, and anyone holding an ID
  can join that session. It shouldn't sit in a third-party dashboard.

`beforeSend` rewrites the URL first, so `/k3x9q/join` → `/[sessionId]/join`.

Rule: **if the path has two segments, the first is a session ID.** Every
session route is `/:sessionId/<screen>` and every static route (`/welcome`,
`/new`, `/not-found`) has one segment, so this needs no list of routes to
maintain. Bare `/:sessionId` only redirects, and decision #5 keeps it from being
recorded. The app uses no query strings, so the path is all there is to clean.

---

## Data tracked from this app

Source: Vercel's [Privacy and Compliance](https://vercel.com/docs/analytics/privacy-policy)
and [Pricing](https://vercel.com/docs/analytics/limits-and-pricing) docs, as of
November 2026. Re-check them if the package's major version changes.

### The full list

Each page view sends Vercel exactly this, and nothing else:

1. **Page**: one of these six paths:
   - `/welcome`
   - `/new`
   - `/not-found`
   - `/[sessionId]/join`
   - `/[sessionId]/start`
   - `/[sessionId]/ended`
2. **Time** of the page view.
3. **Referrer**: the site the visitor arrived from, when the browser sends one
   (e.g. Slack, Teams, email).
4. **Location**: country, region and city, worked out from the IP address. The
   IP itself isn't stored.
5. **Operating system** and version.
6. **Browser** and version.
7. **Device type**: mobile, desktop or tablet.
8. **Analytics script version.**

Vercel also derives a **visitor hash** from each request to count unique
visitors. It isn't a cookie and is discarded after 24 hours (see "How visitors
are counted").

### What causes an event

One **page view** per page load, and one per client-side navigation (React
Router's `pushState`/`replaceState`). Nothing else: no clicks, no form
submissions, no socket messages, and no custom events (decision #1).

A visitor going Welcome → New → Start sends three page views. A redirect that
completes before `<Analytics />` mounts (`/` → `/welcome`, `/:sessionId` →
`/join`) records only the final URL (decision #5).

### Fields stored with each page view

| Field                   | What this app sends                                                                                                      | Example                       |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------ | ----------------------------- |
| Timestamp               | When the page view happened                                                                                              | `2026-11-03 09:06:30`         |
| URL                     | The path, **after redaction**                                                                                            | `/[sessionId]/join`           |
| Dynamic path            | Not sent. Only framework integrations (Next, Remix, SvelteKit, Nuxt) set it, and the redacted URL does the same job here | —                             |
| Referrer                | The page the visitor came from, if the browser sends it                                                                  | `https://app.slack.com/`      |
| Query params (filtered) | None. The app uses no query strings                                                                                      | —                             |
| Geolocation             | Country, region, city, worked out from the request                                                                       | `AU, New South Wales, Sydney` |
| OS and version          | From the user agent                                                                                                      | `macOS 15`                    |
| Browser and version     | From the user agent                                                                                                      | `Chrome 140`                  |
| Device type             | Mobile, Desktop or Tablet                                                                                                | `Desktop`                     |
| Script version          | The analytics script's version                                                                                           | `2.0.0`                       |

### How visitors are counted

- **No cookies, no localStorage.** Each visitor is identified by a hash built
  from the incoming request. Vercel doesn't publish exactly which inputs go into
  it.
- **The hash expires after 24 hours.** The same person on two different days
  counts as two visitors, and visits can't be linked across days or across
  other websites.
- **IP addresses are not stored.** The IP is used to work out location, but
  Vercel states that data points aren't tied to an IP address.

### What is never sent

- Session IDs (redacted, see above).
- Anything the app holds in memory or sends over the socket: display names,
  Selections, the Reveal, the point system, the session description.
- Anything typed into a form. Only the URL is read, never the page content.
- Data from local dev (debug mode only logs to the console) or preview builds
  (they don't build, decision #4).

### What the dashboard shows, built from the above

Visitors, page views and bounce rate, broken down by page, referrer, country,
OS, browser and device type, with filters on each. UTM breakdowns need Pro with
Web Analytics Plus, so they aren't available here.

### Limits on the free Hobby plan

- **50,000 events a month, shared across every project in the Vercel account,**
  not per project.
- **Past the cap**, there's a 3-day grace period, then collection pauses. Hobby
  is never billed, and the pause loses those visits for good.
- **Reporting window: 1 month.** Only the last month is guaranteed to be
  viewable. Export anything you want to keep longer.

---

## Dashboard — before the code ships

- [x] D1. Vercel → `fold-and-flip` project → **Analytics** tab.
- [x] D2. **Enable** Web Analytics. Free on Hobby, within the limits in
      "Data tracked from this app". If any other project in your Vercel account also has
      analytics on, it shares the same 50,000-event cap.
- [x] D3. Leave **Speed Insights** off (decision #2).

---

## Code

- [x] A1. `npm install @vercel/analytics`.
- [x] A2. `src/utils/analytics.ts`, exported from the `src/utils` barrel:
      ```ts
      import type { BeforeSendEvent } from '@vercel/analytics/react'

      // `/k3x9q/join` → `/[sessionId]/join`. Every two-segment path is a
      // session route, and the ID is the invitation, so it never leaves the app.
      export function redactSessionId(event: BeforeSendEvent) {
        const url = new URL(event.url)
        url.pathname = url.pathname.replace(/^\/[^/]+(?=\/)/, '/[sessionId]')
        return { ...event, url: url.toString() }
      }
      ```
      `BeforeSendEvent` and this rewrite-the-URL pattern come from Vercel's
      redaction guide, as of v2.

- [x] A3. `src/routes/RootLayout.tsx`: render
      `<Analytics beforeSend={redactSessionId} />` beside the `Suspense`
      boundary, with a one-line comment pointing to decision #5.
- [x] A4. `vercel.json` CSP: **no change.** In v2 ("Resilient Intake"), Vercel
      serves the script and both endpoints from a random path on your own
      domain (`/<unique-path>/script.js`, `/<unique-path>/view`), generated at
      build time. They're same-origin, so `script-src 'self'` and
      `connect-src 'self'` already cover them, and the random path means the CSP
      can't name it anyway. V4 confirms this.

## Local checks

- [x] A5. `npm run build` and `npm run lint` pass.
- [x] A6. Stop any running dev servers, then start the backend and frontend
      together. In dev the package runs in debug mode: it logs each page view to
      the browser console instead of sending it. Walk Welcome → New → start, and
      join from a second profile. Every logged URL should show `[sessionId]`,
      never a real ID.
- [x] A7. `npm run smoke` passes against the local stack.

Once the testing plan's Phase 0 has added a test runner, `redactSessionId` is
worth a small unit test: two-segment path, one-segment path, root path. Until
then, A6 covers it by hand.

---

## Verify — production

- [ ] V1. Push to `master` and wait for the Vercel deploy.
- [ ] V2. Visit the production URL in a private window **with ad blockers off**
      (see Gotchas).
- [ ] V3. DevTools → Network, filtered to `script.js` and `view`: the script
      (on a random path on your domain) returns 200, and a `view` request is
      sent on load and again on each navigation. In its payload, the URL shows
      `[sessionId]`, and the other fields match "Data tracked from this app".
- [ ] V4. DevTools → Console: no `Content-Security-Policy-Report-Only`
      violations for the analytics script or its `view` request.
- [ ] V5. Create a session and join it from a second window. Within a few
      minutes, the Analytics tab shows `/welcome`, `/new`, `/[sessionId]/start`
      and `/[sessionId]/join`, and no real IDs.
- [ ] V6. Optional: add a line to `deployment.md` → Operating notes saying
      analytics is on and where to find it.

---

## Gotchas

- **Ad blockers undercount.** v2's random path makes the script harder to
  block, but some blockers still catch it. Treat the numbers as a minimum, not
  a total. Test with blockers off (V2).
- **Enable before ship.** Code that ships before D2 gets 404s for the script.
  It's harmless, but those visits aren't recorded.
- **Redeploy after enabling** if the code shipped first. Enabling doesn't
  rebuild anything.
- **Privacy notice.** No cookies means no cookie banner. If the app ever gets a
  privacy notice, list what's in "Data tracked from this app" there.

## Out of scope

- Custom events (session created, joined, revealed): needs Vercel Pro.
- Speed Insights.
- Tracking preview deployments: they don't build today (`deployment.md`).
- Any analytics on the backend.
