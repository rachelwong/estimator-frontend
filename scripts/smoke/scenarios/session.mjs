// One Session, creation to Reveal — PLAN.md Phases 10–12.
//
//   Admin (browser) ── creates, selects, refreshes, second tab, ends via dialog
//   Fay   (browser) ── joins by share link, selects, sees the live Reveal
//   Bob…Eli, Zed (raw sockets) ── crowd one Square / never pick
//   Fresh visitor (browser) ── opens the ended Session cold
import {
  APP,
  SHOTS,
  cellText,
  cells,
  chosen,
  clickCell,
  createSocketPool,
  hoverCell,
  landsOn,
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
  // Backend only — Vite's HMR socket on :5173 is dev noise.
  fresh.on('websocket', (ws) => ws.url().startsWith('ws://localhost:3001') && socketTraffic.push(ws.url()))
  fresh.on('request', (request) => request.url().includes('/socket.io') && socketTraffic.push(request.url()))

  await fresh.goto(`${APP}/${sessionId}`)
  await fresh.waitForURL(/\/ended$/)
  await fresh.getByText('Ended', { exact: true }).waitFor()
  await fresh.waitForTimeout(500)

  check('Fresh visitor redirected to /ended', fresh.url().endsWith(`/${sessionId}/ended`))
  check('No name prompt', (await fresh.locator('input[name="name"]').count()) === 0)
  check('No socket opened', socketTraffic.length === 0, socketTraffic.join(', '))
  check('Status badge reads Ended', await fresh.getByText('Ended', { exact: true }).isVisible())
  check('Grid is readonly', (await fresh.locator('main button.aspect-square').count()) === 0)

  const crowded = await cellText(fresh, 2, 3)
  check('Crowded Square shows first three', ['Bob', 'Cat', 'Dan'].every((n) => crowded.includes(n)))
  check('Crowded Square caps with +1 more', crowded.includes('+1 more') && !crowded.includes('Eli'))
  check('Fay in her Square', (await cellText(fresh, 4, 1)).includes('Fay'))
  check('Cleared Squares are empty', (await cellText(fresh, 0, 0)) + (await cellText(fresh, 1, 0)) === '')
  check('Only chosen Squares are green', sameSquares(await chosen(fresh), [[2, 3], [4, 1]]))

  await hoverCell(fresh, 2, 3)
  const tooltip = fresh.getByRole('tooltip')
  await tooltip.waitFor({ timeout: 3000 }).catch(() => {})
  const tooltipText = (await tooltip.count()) ? await tooltip.innerText() : ''
  check('Tooltip lists all four', ['Bob', 'Cat', 'Dan', 'Eli'].every((n) => tooltipText.includes(n)))

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
