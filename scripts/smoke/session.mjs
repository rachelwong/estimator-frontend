// Browser smoke checks for one Session, creation to Reveal — PLAN.md's
// done-when lists for Phases 11 and 12. Not a test suite: automated tests are
// out of scope. Needs both dev servers running.
// Run: npm run smoke
//
//   Admin (browser) ── creates, selects, refreshes, second tab, ends via dialog
//   Fay   (browser) ── joins by share link, selects, sees the live Reveal
//   Bob…Eli, Zed (raw sockets) ── crowd one Square / never pick
//   Fresh visitor (browser) ── opens the ended Session cold

import { chromium } from 'playwright'
import { io } from 'socket.io-client'

const APP = 'http://localhost:5173'
const API = 'http://localhost:3001'
const SHOTS = new URL('./screenshots', import.meta.url).pathname
const GREEN = 'bg-green-500'

const results = []
const errors = []

const browser = await chromium.launch()

// --- Admin creates the Session through the UI --------------------------------
const adminContext = await browser.newContext({ permissions: ['clipboard-read', 'clipboard-write'] })
const admin = await openPage(adminContext)
await admin.goto(APP)
await admin.getByLabel('Provide your name').fill('Ada')
await admin.getByRole('slider').focus()
await admin.keyboard.press('End')
await admin.getByRole('button', { name: 'Start Session' }).click()
await admin.waitForURL(/\/start$/)
await cells(admin).first().waitFor()

const sessionId = new URL(admin.url()).pathname.split('/')[1]
// Numerical, so each axis value equals its index. The grid is square.
const axisLength = Math.sqrt(await cells(admin).count())

check('Admin lands on /start', true, sessionId)
check('Admin sees End session', await admin.getByRole('button', { name: 'End session' }).isVisible())
check('Admin sees share link', await admin.getByLabel('Session link').isVisible())

const shareUrl = await admin.getByLabel('Session link').inputValue()
check('Share link points at /join', shareUrl === `${APP}/${sessionId}/join`, shareUrl)
await admin.getByRole('button', { name: 'Copy link' }).click()
const clipboard = await admin.evaluate(() => navigator.clipboard.readText())
check('Copy puts link on clipboard', clipboard === shareUrl)

// --- Admin Selection survives refresh; a second tab does not live-sync -------
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
await cells(admin).nth(cellIndex(1, 0)).click()
await waitForChosen(admin, [])
check('Same Square clears Selection', true)

// --- Participants ------------------------------------------------------------
const fayContext = await browser.newContext()
const fay = await openPage(fayContext)
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
const sockets = []
for (const name of ['Bob', 'Cat', 'Dan', 'Eli']) {
  const socket = await joinBySocket(name)
  socket.emit('select-square', { time: 2, resource: 3 })
}
await joinBySocket('Zed')
await admin.waitForTimeout(300)

// --- Admin ends the Session through the dialog -------------------------------
await admin.getByRole('button', { name: 'End session' }).click()
await admin.getByRole('alertdialog').waitFor()
await admin.getByRole('button', { name: 'Cancel' }).click()
await admin.waitForTimeout(300)
check('Cancel keeps Session open', admin.url().endsWith('/start'))
await admin.screenshot({ path: `${SHOTS}/admin-start.png` })

await admin.getByRole('button', { name: 'End session' }).click()
await admin.getByRole('alertdialog').getByRole('button', { name: 'End session' }).click()

for (const [label, page] of [['Admin', admin], ['Admin tab 2', adminTab2], ['Participant', fay]]) {
  const moved = await page.waitForURL(/\/ended$/, { timeout: 5000 }).then(() => true, () => false)
  check(`${label} moved to /ended`, moved)
}
check('No error banner after ending', (await admin.getByRole('alert').count()) === 0)
await fay.getByText('Ended', { exact: true }).waitFor()
check('Live Participant sees own name in Reveal', (await cellText(fay, 4, 1)).includes('Fay'))

sockets.forEach((socket) => socket.close())

// --- A brand-new visitor to the ended Session --------------------------------
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

await fresh.locator('main .aspect-square').nth(cellIndex(2, 3)).hover()
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
await fresh.waitForURL(`${APP}/`)
check('Create new session goes to /', true)
check('Create form starts empty', (await fresh.getByLabel('Provide your name').inputValue()) === '')

check('No page or console errors', errors.length === 0, errors.join(' | '))

await browser.close()
const failed = results.filter((result) => !result.ok).length
console.log(`\n${results.length - failed}/${results.length} passed`)
process.exit(failed ? 1 : 0)

// --- Helpers -------------------------------------------------------------------

function check(name, ok, detail = '') {
  results.push({ name, ok })
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${detail ? `  (${detail})` : ''}`)
}

async function openPage(context) {
  const page = await context.newPage()
  page.on('pageerror', (error) => errors.push(error.message))
  page.on('console', (message) => message.type() === 'error' && errors.push(message.text()))
  return page
}

function cells(page) {
  return page.locator('main .aspect-square')
}

// Rows are reversed (highest Resources on top), so map a Square to DOM order.
function cellIndex(time, resource) {
  return (axisLength - 1 - resource) * axisLength + time
}

async function cellText(page, time, resource) {
  return (await cells(page).nth(cellIndex(time, resource)).innerText()).trim()
}

// Green Squares as [time, resource] pairs.
async function chosen(page) {
  const indexes = await cells(page).evaluateAll(
    (elements, green) => elements.flatMap((el, i) => (el.className.includes(green) ? [i] : [])),
    GREEN,
  )
  return indexes.map((i) => [i % axisLength, axisLength - 1 - Math.floor(i / axisLength)])
}

function sameSquares(actual, expected) {
  const key = (squares) => squares.map((s) => s.join(':')).sort().join()
  return key(actual) === key(expected)
}

async function waitForChosen(page, expected) {
  for (let attempt = 0; attempt < 50; attempt++) {
    if (sameSquares(await chosen(page), expected)) {
      return
    }
    await page.waitForTimeout(100)
  }
  throw new Error(`Expected ${JSON.stringify(expected)}, got ${JSON.stringify(await chosen(page))}`)
}

async function selectSquare(page, time, resource) {
  await cells(page).nth(cellIndex(time, resource)).click()
  await waitForChosen(page, [[time, resource]])
}

function joinBySocket(name) {
  return new Promise((resolve) => {
    const socket = io(API, { reconnection: false, query: { sessionId } })
    sockets.push(socket)
    socket.on('session-info', () => socket.emit('join', name))
    socket.on('joined', () => resolve(socket))
  })
}
