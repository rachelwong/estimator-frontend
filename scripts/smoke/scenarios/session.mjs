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
  openSquareBadges,
  revealed,
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

  // --- Admin Selection survives refresh; a second tab live-syncs ------------
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
  await waitForChosen(adminTab2, [[1, 0]])
  check('Second Admin tab live-syncs', true)

  // Cleared from the tab that didn't pick it: both tabs clear, so Ada ends up
  // Abstained.
  await clickCell(adminTab2, 1, 0)
  await waitForChosen(adminTab2, [])
  await waitForChosen(admin, [])
  check('Same Square clears Selection in both tabs', true)

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
  check('Live Participant sees own name in Reveal', (await cellText(fay, 4, 1)).includes('Fay'))

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
  // Only a crowded Square opens: a Square one person picked already names them.
  check('Only the crowded Square is a button',
    (await fresh.locator('main .grid.gap-1 button.aspect-square').count()) === 1)

  check('Crowded Square counts the votes', (await cellText(fresh, 2, 3)) === '4 votes')
  check('Fay in her Square', (await cellText(fresh, 4, 1)) === 'Fay')
  check('Cleared Squares are empty', (await cellText(fresh, 0, 0)) + (await cellText(fresh, 1, 0)) === '')
  check('Only chosen Squares are revealed', sameSquares(await revealed(fresh), [[2, 3], [4, 1]]))
  check('No Square is green on the Reveal', (await chosen(fresh)).length === 0)
  check('Crowded Square wears the rainbow border',
    (await fresh.locator('main .grid.gap-1 .rainbow-border').count()) === 1)

  // Hover does nothing now: the badges are behind a click.
  await hoverCell(fresh, 2, 3)
  await fresh.waitForTimeout(400)
  check('Hover opens nothing', (await fresh.getByRole('tooltip').count()) === 0)

  // Fay's own Square opens nothing either — her name is already on it.
  await clickCell(fresh, 4, 1)
  await fresh.waitForTimeout(400)
  check('A one-person Square opens nothing', (await fresh.getByRole('tooltip').count()) === 0)

  // Every person wears their own colour, and nobody in one Square shares one.
  const crowdedBadges = await openSquareBadges(fresh, 2, 3)
  const bgOf = (classes) => classes.split(' ').find((c) => c.startsWith('bg-')) ?? ''
  const bg = (badge) => bgOf(badge.className)
  const faysSquare = bgOf(await squareClasses(fresh, 4, 1))
  check('Click lists all four', ['Bob', 'Cat', 'Dan', 'Eli']
    .every((n) => crowdedBadges.some((badge) => badge.name === n)),
    crowdedBadges.map((badge) => badge.name).join())
  check('Crowded Square colours each name differently',
    new Set(crowdedBadges.map(bg)).size === crowdedBadges.length, crowdedBadges.map(bg).join())
  check("Fay's Square is filled with her own colour",
    faysSquare !== '' && !crowdedBadges.map(bg).includes(faysSquare), faysSquare)

  const legend = await fresh.locator('section', { hasText: 'Who is who' }).innerText()
  check('Legend lists everyone', ['Ada', 'Bob', 'Cat', 'Dan', 'Eli', 'Fay', 'Zed']
    .every((n) => legend.includes(n)), legend.replace(/\n/g, ' '))

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
