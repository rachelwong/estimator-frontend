// Joining and choosing Squares as a Participant — PLAN.md Phases 9 and 10.
import {
  APP,
  SOCKET_IO,
  cellText,
  chosen,
  clickCell,
  createSessionByApi,
  createSocketPool,
  joinInBrowser,
  landsOn,
  openSquarePopover,
  sameSquares,
  selectSquare,
  waitForChosen,
} from '../lib.mjs'

const NAME_RULE = 'Use 1-20 letters, numbers or spaces, with no symbols.'

export async function join({ browser, reporter }) {
  const { check, openPage } = reporter
  const { sessionId, adminToken } = await createSessionByApi()

  // --- A bad name never reaches the wire --------------------------------------
  const page = await openPage(await browser.newContext())
  const socketTraffic = []
  page.on('request', (request) => request.url().includes('/socket.io') && socketTraffic.push(request.url()))

  await page.goto(`${APP}/${sessionId}/join`)
  const name = page.locator('input[name="name"]')
  await name.fill('Jim@Bob')
  await name.blur()
  check('Symbol in name shows rule', await page.getByText(NAME_RULE).isVisible())
  check('Enter disabled for bad name', await page.getByRole('button', { name: 'Enter Session' }).isDisabled())
  check('Bad name opens no socket', socketTraffic.length === 0)

  // A space is a name, not a symbol.
  await name.fill('Jim Bob')
  await name.blur()
  check('Space in name clears the rule', (await page.getByText(NAME_RULE).count()) === 0)

  // --- Join, then Back must not create a second Participant ------------------
  await forgeNextSelection(page)
  await joinInBrowser(page, sessionId, 'Jim')
  check('Good name lands on /start', true)

  await page.goBack()
  await page.waitForTimeout(500)
  check('Back from /start returns to /start', await landsOn(page, /\/start$/))

  // --- Choose, move, clear ------------------------------------------------------
  await selectSquare(page, 1, 1)
  check('Click chooses a Square', true)

  await selectSquare(page, 3, 2)
  check('Another Square moves the Selection', true)

  await clickCell(page, 3, 2)
  await waitForChosen(page, [])
  check('Same Square clears it', true)

  await selectSquare(page, 1, 1)

  // --- A forged out-of-range Selection shows the banner, changes nothing -----
  page.forgeNext = true
  await clickCell(page, 4, 4)
  const banner = page.getByRole('alert')
  await banner.waitFor({ timeout: 3000 }).catch(() => {})
  check('Forged Selection shows error banner', await banner.isVisible())
  check('Forged Selection changes nothing', sameSquares(await chosen(page), [[1, 1]]))

  await page.getByRole('button', { name: 'Dismiss' }).click()
  check('Dismiss hides the banner', (await page.getByRole('alert').count()) === 0)

  // --- Duplicate names get suffixed ----------------------------------------------
  const sockets = createSocketPool(sessionId)
  for (let i = 0; i < 2; i++) {
    const socket = await sockets.join('Jim')
    socket.emit('select-square', { time: 1, resource: 1 })
  }
  const adminSocket = await sockets.admin(adminToken)
  adminSocket.emit('end-session', adminToken)

  check('Participant moves to /ended', await landsOn(page, /\/ended$/))
  sockets.close()

  await page.getByRole('heading', { name: 'The Reveal' }).waitFor()
  await page.mouse.move(0, 0)
  check('Crowded Square counts the people', ['3\npeople', '×3'].includes(await cellText(page, 1, 1)))
  const names = (await openSquarePopover(page, 1, 1)).sort()
  check('Three "Jim" joins → Jim, Jim-1, Jim-2', names.join() === 'Jim,Jim-1,Jim-2', names.join())
  check('Back created no extra Participant', !(await page.locator('main').innerText()).includes('Jim-3'))
}

// Rewrites the next select-square this page sends to an out-of-range Square,
// the way a devtools user would. Armed by setting page.forgeNext = true.
// Covers both Socket.IO transports: the WebSocket and the long-polling POST.
async function forgeNextSelection(page) {
  const forge = (text) => {
    if (!page.forgeNext || !text.includes('select-square')) {
      return text
    }

    page.forgeNext = false
    return text.replace(/\{"time":\d+,"resource":\d+\}/, '{"time":999,"resource":999}')
  }

  await page.routeWebSocket(SOCKET_IO, (ws) => {
    const server = ws.connectToServer()
    ws.onMessage((message) => server.send(typeof message === 'string' ? forge(message) : message))
  })

  await page.route(SOCKET_IO, (route) => {
    const body = route.request().postData()
    if (route.request().method() !== 'POST' || !body) {
      return route.continue()
    }

    return route.continue({ postData: forge(body) })
  })
}
