// Every loader's redirect, the error screen, and the loading notice —
// PLAN.md "Routes" and "Cold starts", Phases 4 and 10.
import { API, APP, createSessionByApi, createSocketPool, landsOn } from '../lib.mjs'

const UNKNOWN_ID = 'noSuchSession000'
const TOKEN_KEY = (sessionId) => `estimator:adminToken:${sessionId}`

export async function routing({ browser, reporter }) {
  const { check, openPage } = reporter
  const page = await openPage(await browser.newContext())

  // --- Unknown Sessions and paths --------------------------------------------
  for (const path of ['', '/join', '/start', '/ended']) {
    await page.goto(`${APP}/${UNKNOWN_ID}${path}`)
    check(`Unknown /:id${path} → /not-found`, await landsOn(page, /\/not-found$/))
  }

  await page.goto(`${APP}/a/b/c`)
  check('Unmatched path → /not-found', await landsOn(page, /\/not-found$/))
  check('Not-found says so', await page.getByText('Session not found').isVisible())
  await page.getByRole('link', { name: 'Create new session' }).click()
  check('Not-found links to /new', await landsOn(page, `${APP}/new`))

  // --- Static routes and the header link --------------------------------------
  for (const path of ['/welcome', '/new']) {
    await page.goto(`${APP}${path}`)
    check(`${path} is a known route`, !(await landsOn(page, /\/not-found$/, 1000)))
  }

  await page.getByRole('link', { name: 'Fold and Flip' }).click()
  check('Header title → /welcome', await landsOn(page, `${APP}/welcome`))

  // --- An open Session, no identity ------------------------------------------
  const open = await createSessionByApi()
  for (const path of ['', '/start', '/ended']) {
    await page.goto(`${APP}/${open.sessionId}${path}`)
    check(`Open, no identity: /:id${path} → /join`, await landsOn(page, /\/join$/))
  }

  // --- An Admin token ---------------------------------------------------------
  const adminPage = await openPage(await browser.newContext())
  await adminPage.goto(`${APP}/new`)
  await adminPage.evaluate(
    ([key, token]) => localStorage.setItem(key, token),
    [TOKEN_KEY(open.sessionId), open.adminToken],
  )
  await adminPage.goto(`${APP}/${open.sessionId}/join`)
  check('Admin token: /join → /start', await landsOn(adminPage, /\/start$/))

  // A token outliving a server restart must still reach /not-found, not /start.
  await adminPage.evaluate(([key]) => localStorage.setItem(key, 'stale'), [TOKEN_KEY(UNKNOWN_ID)])
  await adminPage.goto(`${APP}/${UNKNOWN_ID}/start`)
  check('Stale Admin token → /not-found', await landsOn(adminPage, /\/not-found$/))

  // --- An ended Session -------------------------------------------------------
  const ended = await createSessionByApi()
  const sockets = createSocketPool(ended.sessionId)
  const adminSocket = await sockets.admin(ended.adminToken)
  adminSocket.emit('end-session', ended.adminToken)
  await page.waitForTimeout(300)
  sockets.close()

  for (const path of ['', '/join', '/start']) {
    await page.goto(`${APP}/${ended.sessionId}${path}`)
    check(`Ended: /:id${path} → /ended`, await landsOn(page, /\/ended$/))
  }

  // --- Cold start: loading notice, then the page ------------------------------
  const slow = await openPage(await browser.newContext())
  await slow.route(`${API}/sessions/*`, async (route) => {
    await new Promise((resolve) => setTimeout(resolve, 1500))
    await route.continue()
  })
  await slow.goto(`${APP}/${open.sessionId}/join`, { waitUntil: 'commit' })
  const notice = slow.getByRole('status')
  await notice.waitFor({ timeout: 1400 }).catch(() => {})
  check('Slow first load shows loading notice', await notice.isVisible())
  check('Header shows while loading', await slow.getByText('Fold and Flip').isVisible())
  await slow.getByRole('heading', { name: 'Join session' }).waitFor()
  check('Notice gone once loaded', (await slow.getByRole('status').count()) === 0)

  // --- Unreachable backend: error screen, then Retry recovers -----------------
  const down = await openPage(await browser.newContext(), { expectErrors: true })
  await down.route(`${API}/sessions/*`, (route) => route.abort())
  await down.goto(`${APP}/${open.sessionId}/join`)
  const title = down.getByText('Could not reach the server')
  await title.waitFor({ timeout: 5000 }).catch(() => {})
  check('Unreachable: error screen says so', await title.isVisible())
  check('Error screen keeps header', await down.getByText('Fold and Flip').isVisible())

  await down.unroute(`${API}/sessions/*`)
  await down.getByRole('button', { name: 'Retry' }).click()
  const recovered = down.getByRole('heading', { name: 'Join session' })
  await recovered.waitFor({ timeout: 5000 }).catch(() => {})
  check('Retry recovers once reachable', await recovered.isVisible())
}
