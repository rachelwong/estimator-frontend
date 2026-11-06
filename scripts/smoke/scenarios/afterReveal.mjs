// Changing an estimate after the reveal (estimator-backend
// docs/features/change-estimate-after-reveal.md): who can vote on the Reveal,
// what everyone else sees, and the change flash.
import {
  APP,
  cellText,
  cells,
  chosen,
  clickCell,
  createSessionByApi,
  createSocketPool,
  flashCount,
  hoverCell,
  isChipFlashing,
  isFlashing,
  joinInBrowser,
  landsOn,
  sameSquares,
  selectSquare,
  waitForChosen,
} from '../lib.mjs'

// A Square's aria-pressed: "true"/"false" where a click votes, null where it doesn't.
async function squarePressed(page, time, resource) {
  const length = Math.sqrt(await cells(page).count())
  return cells(page).nth((length - 1 - resource) * length + time).getAttribute('aria-pressed')
}

// Long enough for the wave to land on a 5×5 grid.
const WAVE_MS = 2000
// The ring's 1.4s, plus slack.
const FLASH_GONE_MS = 1700
// Long enough for a reveal-updated to reach every tab.
const SETTLE_MS = 400

export async function afterReveal({ browser, reporter }) {
  const { check, openPage } = reporter
  const { sessionId, adminToken } = await createSessionByApi('numerical', 4)
  const settle = (page, ms = SETTLE_MS) => page.waitForTimeout(ms)
  const totalFlashes = async (...pages) => {
    let total = 0
    for (const page of pages) {
      total += await flashCount(page)
    }
    return total
  }

  // --- Ada (Admin) and Fay vote, then Ada ends the Session ---------------------
  const adminContext = await browser.newContext()
  await adminContext.addInitScript(
    ([key, token]) => localStorage.setItem(key, token),
    [`estimator:adminToken:${sessionId}`, adminToken],
  )
  const admin = await openPage(adminContext)
  await admin.goto(`${APP}/${sessionId}/start`)
  await cells(admin).first().waitFor()
  await selectSquare(admin, 2, 2)

  const fay = await openPage(await browser.newContext())
  await joinInBrowser(fay, sessionId, 'Fay')
  await selectSquare(fay, 1, 1)

  const sockets = createSocketPool(sessionId)
  const ender = await sockets.admin(adminToken)
  ender.emit('end-session', adminToken)
  check('Fay moved to /ended', await landsOn(fay, /\/ended$/))
  check('Ada moved to /ended', await landsOn(admin, /\/ended$/))
  sockets.close()

  const fresh = await openPage(await browser.newContext())
  await fresh.goto(`${APP}/${sessionId}`)
  await fresh.waitForURL(/\/ended$/)
  await settle(fresh, WAVE_MS)

  check('Fay holds her Square on the Reveal', sameSquares(await chosen(fay), [[1, 1]]))
  // A Square that votes is a toggle (aria-pressed); a watcher's only opens names.
  check('Fay’s Squares vote', (await squarePressed(fay, 3, 1)) !== null)
  check('Fresh visitor’s do not', (await squarePressed(fresh, 3, 1)) === null)
  check('Nothing flashes on arrival', (await totalFlashes(admin, fay, fresh)) === 0)

  // --- Fay moves: everyone else sees it, and its new Square flashes -----------
  await clickCell(fay, 3, 1)
  await waitForChosen(fay, [[3, 1]])
  await settle(admin)

  check('Ada sees Fay move without a reload', (await cellText(admin, 3, 1)) === 'Fay')
  check('Fresh visitor sees it too', (await cellText(fresh, 3, 1)) === 'Fay')
  check('Fay left her old Square', (await cellText(fresh, 1, 1)) === '')
  check('New Square flashes for Ada', await isFlashing(admin, 3, 1))
  check('New Square flashes for the fresh visitor', await isFlashing(fresh, 3, 1))
  check('Old Square does not flash', !(await isFlashing(admin, 1, 1)) && !(await isFlashing(fresh, 1, 1)))
  check("No flash on Fay's own tab", (await flashCount(fay)) === 0)
  check("Fay's chip flashes for Ada", await isChipFlashing(admin, 'Fay'))
  check("Ada's chip does not", !(await isChipFlashing(admin, 'Ada')))
  check("Fay's chip does not flash on her own tab", !(await isChipFlashing(fay, 'Fay')))

  await settle(admin, FLASH_GONE_MS)
  check('The flash stops, leaving nothing marked', (await totalFlashes(admin, fresh)) === 0)
  check("Fay's chip stops too", !(await isChipFlashing(admin, 'Fay')))

  // --- Ada moves: Fay and the fresh visitor see the flash, Ada doesn't --------
  await clickCell(admin, 0, 0)
  await waitForChosen(admin, [[0, 0]])
  await settle(fay)

  check("Ada's move flashes for Fay", await isFlashing(fay, 0, 0))
  check("Ada's move flashes for the fresh visitor", await isFlashing(fresh, 0, 0))
  check("No flash on Ada's own tab", (await flashCount(admin)) === 0)
  await settle(admin, FLASH_GONE_MS)

  // --- Fay clears: she moves to Abstained, nothing flashes --------------------
  await clickCell(fay, 3, 1)
  await waitForChosen(fay, [])
  await settle(fresh)

  check('Clearing moves Fay to Abstained', /Fay\s*abstained/i.test(await fresh.locator('main').innerText()))
  check('Clearing flashes nothing', (await totalFlashes(admin, fresh)) === 0)

  // --- Fay hovers: names, no vote --------------------------------------------
  await hoverCell(fay, 0, 0)
  const names = fay.getByRole('dialog')
  await names.waitFor({ timeout: 2000 }).catch(() => {})
  check('Hover shows the names on a Square', (await names.count()) === 1 && (await names.innerText()).includes('Ada'))
  check('Hover sends no vote', (await chosen(fay)).length === 0)
  await fay.mouse.move(0, 0)

  // --- An empty Square: nothing on hover, for a voter or a latecomer ---------
  for (const [who, page] of [['Fay', fay], ['Fresh visitor', fresh]]) {
    await hoverCell(page, 4, 3)
    await settle(page, 200)
    check(`${who}: no tooltip on an empty Square`, (await page.getByRole('tooltip').count()) === 0)
    await page.mouse.move(0, 0)
  }

  // --- The fresh visitor clicks: the names pin, no vote -----------------------
  await clickCell(fresh, 0, 0)
  await settle(fresh)
  check('Fresh visitor click pins the names', (await fresh.getByRole('dialog').count()) === 1)
  check('Fresh visitor click sends no vote', (await cellText(admin, 0, 0)) === 'Ada')

  // --- Ada reloads: still votes, nothing flashes on load ----------------------
  await admin.reload()
  await settle(admin, WAVE_MS)
  check('Ada after a reload: no flash on load', (await flashCount(admin)) === 0)
  check('Ada after a reload: keeps her Square', sameSquares(await chosen(admin), [[0, 0]]))
  await clickCell(admin, 4, 4)
  const adminVoted = await waitForChosen(admin, [[4, 4]]).then(() => true, () => false)
  check('Ada after a reload: can still vote', adminVoted)

  // --- Fay reloads: she sees the Reveal, but can no longer vote ---------------
  await fay.reload()
  await settle(fay, WAVE_MS)
  check('Fay after a reload: sees the Reveal', (await cellText(fay, 4, 4)) === 'Ada')
  await clickCell(fay, 1, 1)
  await settle(fresh)
  check('Fay after a reload: clicks do not vote', (await cellText(fresh, 1, 1)) === '')
}
