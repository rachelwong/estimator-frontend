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
  await admin.getByLabel('Your name').fill('Ada')
  await admin.getByRole('slider').focus()
  await admin.keyboard.press('End')
  await admin.getByRole('button', { name: 'Create session' }).click()
  await admin.waitForURL(/\/ready$/)
  await admin.getByRole('link', { name: 'Go to the session →' }).click()
  await admin.waitForURL(/\/start$/)
  await cells(admin).first().waitFor()

  const sessionId = new URL(admin.url()).pathname.split('/')[1]
  check('Admin lands on /start', true, sessionId)
  check('Admin sees End session', await admin.getByRole('button', { name: 'End session & reveal' }).isVisible())
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
  await fay.getByRole('button', { name: 'Join session' }).click()
  await fay.waitForURL(/\/start$/)
  await cells(fay).first().waitFor()
  check('Participant lands on /start', true)
  check('Participant has no End session', (await fay.getByRole('button', { name: 'End session & reveal' }).count()) === 0)
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
  await admin.getByRole('button', { name: 'End session & reveal' }).click()
  await admin.getByRole('alertdialog').waitFor()
  await admin.getByRole('button', { name: 'Cancel' }).click()
  await admin.waitForTimeout(300)
  check('Cancel keeps Session open', admin.url().endsWith('/start'))
  await admin.screenshot({ path: `${SHOTS}/admin-start.png` })

  await admin.getByRole('button', { name: 'End session & reveal' }).click()
  await admin.getByRole('alertdialog').getByRole('button', { name: 'End session & reveal' }).click()

  for (const [label, page] of [['Admin', admin], ['Admin tab 2', adminTab2], ['Participant', fay]]) {
    check(`${label} moved to /ended`, await landsOn(page, /\/ended$/))
  }
  check('No error banner after ending', (await admin.getByRole('alert').count()) === 0)
  await fay.getByRole('heading', { name: 'The Reveal' }).waitFor()
  check('Live Participant sees own name in Reveal', (await squareAriaLabel(fay, 4, 1)).includes('Fay'))

  // "Your Square": the tab that watched the Session end still knows its
  // Selection. The Admin cleared theirs, so has none to mark.
  check('Your Square is marked for Fay',
    (await squareAriaLabel(fay, 4, 1)) === 'Time 4, resources 1, Fay, your Selection')
  check('Your Square wears the ring', (await squareClasses(fay, 4, 1)).includes('outline-selection'))
  check('Only one Square is yours', (await fay.locator('main [data-square][class*="outline-selection"]').count()) === 1)
  check('Admin with no Selection has no Square',
    (await admin.locator('main [data-square][class*="outline-selection"]').count()) === 0)
  check('Participant chip on the Reveal', await fay.getByText('Participant', { exact: true }).isVisible())
  check('Admin chip on the Reveal', await admin.getByText('Admin', { exact: true }).isVisible())
  check('Admin keeps the share link', await admin.getByLabel('Session link').isVisible())
  check('Participant has no share link on the Reveal', (await fay.getByLabel('Session link').count()) === 0)

  await fay.reload()
  await fay.getByRole('heading', { name: 'The Reveal' }).waitFor()
  check('A refresh forgets Your Square',
    (await fay.locator('main [data-square][class*="outline-selection"]').count()) === 0)

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
  await fresh.getByRole('heading', { name: 'The Reveal' }).waitFor()
  await fresh.waitForTimeout(500)

  check('Fresh visitor redirected to /ended', fresh.url().endsWith(`/${sessionId}/ended`))
  check('No name prompt', (await fresh.locator('input[name="name"]').count()) === 0)
  check('No socket opened', socketTraffic.length === 0, socketTraffic.join(', '))
  check('Window reads revealed', await fresh.getByText('revealed', { exact: true }).isVisible())
  check('Notice says Voting is closed', await fresh.getByText('Voting is closed').isVisible())
  check('A fresh visitor has no role chip',
    (await fresh.getByText(/^(Admin|Participant)$/).count()) === 0)
  check('A fresh visitor has no Square', !(await squareAriaLabel(fresh, 4, 1)).includes('your Selection'))
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

  // --- Who landed where ------------------------------------------------------
  const chips = fresh.getByRole('list').last().getByRole('listitem')
  const landed = await fresh.getByRole('list').last().getByRole('button').allInnerTexts()
  check('Every picker has a chip', landed.sort().join() === 'Bob,Cat,Dan,Eli,Fay', landed.join())

  // Ada cleared hers, Zed never picked.
  const abstained = await chips.filter({ hasText: 'Abstained' }).allInnerTexts()
  const abstainedNames = abstained.map((text) => text.replace('Abstained', '').trim()).sort()
  check('Ada (cleared) and Zed (never picked) are Abstained', abstainedNames.join() === 'Ada,Zed', abstainedNames.join())

  await fresh.getByRole('button', { name: 'Bob', exact: true }).hover()
  const chipTooltip = await fresh.getByRole('tooltip').innerText()
  check('Hovering a chip previews its Square', chipTooltip === 'T2 · R3 · 4 people · click for names', chipTooltip)
  check('The previewed Square lifts', (await squareClasses(fresh, 2, 3)).includes('shadow-px'))

  const fayChip = fresh.getByRole('button', { name: 'Fay', exact: true })
  await fayChip.click()
  const pinnedNames = await fresh.getByRole('dialog').locator('li').allInnerTexts()
  check('Clicking a chip pins its popover', pinnedNames.join() === 'Fay', pinnedNames.join())
  check('The chip says it is expanded', (await fayChip.getAttribute('aria-expanded')) === 'true')
  await fayChip.click()
  await fresh.getByRole('dialog').waitFor({ state: 'detached' })
  check('Clicking it again closes the popover', true)

  // --- Area never appears, and the wave plays once ---------------------------
  await hoverCell(fresh, 3, 3)
  check('No Area preview in the Reveal',
    (await fresh.locator('main [data-square][class*="shadow-area-preview"]').count()) === 0)

  const delays = await cells(fresh).evaluateAll((elements) => elements.map((el) => el.style.animationDelay))
  check('Every Square is part of the wave', delays.every((delay) => delay.endsWith('ms')))
  check('The wave starts at the origin', (await cell0Delay(fresh)) === '0ms')
  // A 21×21 wave runs about 3.5s. Let it land, then hover and pin: neither
  // may start it again.
  await cells(fresh).evaluateAll((elements) =>
    Promise.all(elements.flatMap((el) => el.getAnimations().map((animation) => animation.finished))),
  )
  await hoverCell(fresh, 2, 3)
  await openSquarePopover(fresh, 4, 1)
  const replayed = await cells(fresh).evaluateAll(
    (elements) => elements.filter((el) => el.getAnimations().some((a) => a.animationName === 'ffRevealIn')).length,
  )
  check('Hover and pin do not replay the wave', replayed === 0, `${replayed} replaying`)

  await fresh.mouse.move(0, 0)
  await fresh.screenshot({ path: `${SHOTS}/reveal.png`, fullPage: true })

  await fresh.getByRole('link', { name: 'Start a new session' }).click()
  await fresh.waitForURL(`${APP}/new`)
  check('Start a new session goes to /new', true)
  check('Create form starts empty', (await fresh.getByLabel('Your name').inputValue()) === '')
}

// The Square at the origin — bottom-left, so the last row's first.
async function cell0Delay(page) {
  return cells(page).evaluateAll((elements) => {
    const length = Math.sqrt(elements.length)
    return elements[(length - 1) * length].style.animationDelay
  })
}
