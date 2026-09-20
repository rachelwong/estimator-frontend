// One Session, creation to Reveal — PLAN.md Phases 10–12.
//
//   Admin (browser) ── creates, selects, refreshes, second tab, ends via dialog
//   Fay   (browser) ── joins by share link, selects, sees the live Reveal
//   Bob…Eli, Zed (raw sockets) ── crowd one Square / never pick
//   Fresh visitor (browser) ── opens the ended Session cold
import {
  APP,
  SHOTS,
  SOCKET_HOST,
  cellText,
  cells,
  chosen,
  clickCell,
  createSocketPool,
  hoverCell,
  landsOn,
  openSquarePopover,
  revealed,
  squareAriaLabel,
  squareClasses,
  sameSquares,
  selectSquare,
  waitForChosen,
} from '../lib.mjs'

export async function session({ browser, reporter }) {
  const { check, openPage } = reporter

  // --- Admin creates the Session through the UI ------------------------------
  const adminContext = await browser.newContext({
    permissions: ['clipboard-read', 'clipboard-write'],
  })
  const admin = await openPage(adminContext)
  await admin.goto(`${APP}/new`)
  await admin.getByLabel('Provide your name').fill('Ada')
  await admin.getByRole('slider').focus()
  await admin.keyboard.press('End')
  await admin.getByRole('button', { name: 'Start Session' }).click()
  await admin.waitForURL(/\/start$/)
  await cells(admin).first().waitFor()

  const sessionId = new URL(admin.url()).pathname.split('/')[1]
  check('Admin lands on /start', true, sessionId)
  check('Admin sees End session', await admin.getByRole('button', { name: 'End session' }).isVisible())
  check('Admin sees share link', await admin.getByLabel('Session link').isVisible())

  const shareUrl = await admin.getByLabel('Session link').inputValue()
  check('Share link points at /join', shareUrl === `${APP}/${sessionId}/join`, shareUrl)
  await admin.getByRole('button', { name: 'Copy link' }).click()
  const clipboard = await admin.evaluate(() => navigator.clipboard.readText())
  check('Copy puts link on clipboard', clipboard === shareUrl)

  // --- Admin Selection survives refresh; a second tab does not live-sync -----
  await selectSquare(admin, 0, 0)
  check('Admin selection shows', sameSquares(await chosen(admin), [[0, 0]]))

  await admin.reload()
  await waitForChosen(admin, [[0, 0]])
  check('Admin refresh keeps Selection', true)

  const adminTab2 = await openPage(adminContext)
  await adminTab2.goto(`${APP}/${sessionId}`)
  await adminTab2.waitForURL(/\/start$/)
  await waitForChosen(adminTab2, [[0, 0]])
  check('Second Admin tab shows Selection', true)

  await selectSquare(admin, 1, 0)
  await adminTab2.waitForTimeout(500)
  check('Second Admin tab does not live-sync', sameSquares(await chosen(adminTab2), [[0, 0]]))

  // Clicking the same Square clears it, so Ada ends up Abstained.
  await clickCell(admin, 1, 0)
  await waitForChosen(admin, [])
  check('Same Square clears Selection', true)

  // --- Keyboard: one Tab stop, arrows move, Enter selects ---------------------
  check('Grid is one Tab stop', (await admin.locator('main [data-square][tabindex="0"]').count()) === 1)
  await admin.locator('[data-square="1:0"]').focus()
  await admin.keyboard.press('ArrowLeft')
  const focused = await admin.evaluate(() => document.activeElement?.getAttribute('aria-label'))
  check('ArrowLeft moves focus', focused === 'Time 0, resources 0', focused)
  await admin.keyboard.press('Enter')
  await waitForChosen(admin, [[0, 0]])
  await admin.keyboard.press('Enter')
  await waitForChosen(admin, [])
  check('Enter selects and clears', true)

  // --- Participants ----------------------------------------------------------
  const fay = await openPage(await browser.newContext())
  await fay.goto(shareUrl)
  await fay.locator('input[name="name"]').fill('Fay')
  await fay.getByRole('button', { name: 'Enter Session' }).click()
  await fay.waitForURL(/\/start$/)
  await cells(fay).first().waitFor()
  check('Participant lands on /start', true)
  check('Participant has no End session', (await fay.getByRole('button', { name: 'End session' }).count()) === 0)
  check('Participant has no share link', (await fay.getByLabel('Session link').count()) === 0)
  check('Participant sees nobody else', (await chosen(fay)).length === 0)
  await selectSquare(fay, 4, 1)

  // Four names on one Square: three shown, then "+1 more". Zed never picks.
  const sockets = createSocketPool(sessionId)
  for (const name of ['Bob', 'Cat', 'Dan', 'Eli']) {
    const socket = await sockets.join(name)
    socket.emit('select-square', { time: 2, resource: 3 })
  }
  await sockets.join('Zed')
  await admin.waitForTimeout(300)

  // --- Admin ends the Session through the dialog -----------------------------
  await admin.getByRole('button', { name: 'End session' }).click()
  await admin.getByRole('alertdialog').waitFor()
  await admin.getByRole('button', { name: 'Cancel' }).click()
  await admin.waitForTimeout(300)
  check('Cancel keeps Session open', admin.url().endsWith('/start'))
  await admin.screenshot({ path: `${SHOTS}/admin-start.png` })

  await admin.getByRole('button', { name: 'End session' }).click()
  await admin.getByRole('alertdialog').getByRole('button', { name: 'End session' }).click()

  for (const [label, page] of [['Admin', admin], ['Admin tab 2', adminTab2], ['Participant', fay]]) {
    check(`${label} moved to /ended`, await landsOn(page, /\/ended$/))
  }
  check('No error banner after ending', (await admin.getByRole('alert').count()) === 0)
  await fay.getByText('Ended', { exact: true }).waitFor()
  check('Live Participant sees own name in Reveal', (await squareAriaLabel(fay, 4, 1)).includes('Fay'))

  sockets.close()

  // --- A brand-new visitor to the ended Session ------------------------------
  const fresh = await openPage(await browser.newContext())
  const socketTraffic = []
  // Backend only — Vite's HMR socket on :5173 is dev noise. Matching on the
  // host covers ws:// locally and wss:// in production.
  fresh.on('websocket', (ws) => ws.url().includes(SOCKET_HOST) && socketTraffic.push(ws.url()))
  fresh.on('request', (request) => request.url().includes('/socket.io') && socketTraffic.push(request.url()))

  await fresh.goto(`${APP}/${sessionId}`)
  await fresh.waitForURL(/\/ended$/)
  await fresh.getByText('Ended', { exact: true }).waitFor()
  await fresh.waitForTimeout(500)

  check('Fresh visitor redirected to /ended', fresh.url().endsWith(`/${sessionId}/ended`))
  check('No name prompt', (await fresh.locator('input[name="name"]').count()) === 0)
  check('No socket opened', socketTraffic.length === 0, socketTraffic.join(', '))
  check('Status badge reads Ended', await fresh.getByText('Ended', { exact: true }).isVisible())
  // 21×21 at desktop width floors every Square at SQUARE_MIN_PX, so faces
  // are compact: initials and "×N". The aria-label carries the full story.
  check('Crowded Square counts the people', (await cellText(fresh, 2, 3)) === '×4')
  check('Fay in her Square', (await cellText(fresh, 4, 1)) === 'Fa')
  check('Crowded Square names everyone to a screen reader',
    (await squareAriaLabel(fresh, 2, 3)) === 'Time 2, resources 3, Bob, Cat, Dan, Eli')
  check('Empty Square says nobody', (await squareAriaLabel(fresh, 0, 0)) === 'Time 0, resources 0, nobody')
  check('Cleared Squares are empty', (await cellText(fresh, 0, 0)) + (await cellText(fresh, 1, 0)) === '')
  check('Only chosen Squares are revealed', sameSquares(await revealed(fresh), [[2, 3], [4, 1]]))
  check('No Square is pressed on the Reveal', (await chosen(fresh)).length === 0)

  // The crowd ramp: headcount, not who.
  const fill = async (time, resource) =>
    (await squareClasses(fresh, time, resource)).split(' ').find((c) => c.startsWith('bg-'))
  const fills = [await fill(0, 0), await fill(4, 1), await fill(2, 3)]
  check('Fill follows headcount', fills.join() === 'bg-crowd-0,bg-crowd-1,bg-crowd-4', fills.join())

  await hoverCell(fresh, 2, 3)
  const tooltip = await fresh.getByRole('tooltip').innerText()
  check('Hover tooltip counts and points at the popover',
    tooltip === 'T2 · R3 · 4 people · click for names', tooltip)

  const crowd = await openSquarePopover(fresh, 2, 3)
  check('Popover lists all four', crowd.sort().join() === 'Bob,Cat,Dan,Eli', crowd.join())

  const alone = await openSquarePopover(fresh, 4, 1)
  check('A one-person Square opens too', alone.join() === 'Fay', alone.join())

  await clickCell(fresh, 2, 3)
  await fresh.getByRole('dialog').waitFor()
  await fresh.keyboard.press('Escape')
  await fresh.getByRole('dialog').waitFor({ state: 'detached' })
  check('Esc closes the popover', true)

  await clickCell(fresh, 0, 0)
  await fresh.waitForTimeout(200)
  check('An empty Square opens nothing', (await fresh.getByRole('dialog').count()) === 0)

  // Ada cleared hers, Zed never picked.
  const abstained = await fresh.locator('section', { hasText: 'Abstained' }).innerText()
  check('Ada (cleared) is Abstained', abstained.includes('Ada'))
  check('Zed (never picked) is Abstained', abstained.includes('Zed'))
  check('Pickers are not Abstained', !['Bob', 'Fay'].some((n) => abstained.includes(n)))

  await fresh.mouse.move(0, 0)
  await fresh.screenshot({ path: `${SHOTS}/reveal.png`, fullPage: true })

  await fresh.getByRole('link', { name: 'Create new session' }).click()
  await fresh.waitForURL(`${APP}/new`)
  check('Create new session goes to /new', true)
  check('Create form starts empty', (await fresh.getByLabel('Provide your name').inputValue()) === '')
}
