// Shared helpers for the smoke scenarios. See run.mjs.
import { io } from 'socket.io-client'

export const APP = 'http://localhost:5173'
export const API = 'http://localhost:3001'
export const SHOTS = new URL('./screenshots', import.meta.url).pathname

const GREEN = 'bg-green-500'

// Chrome logs every 404 as a console error. GET /sessions/:id answering 404
// is expected — the loaders turn it into /not-found — so it isn't a failure.
const EXPECTED_404 = 'Failed to load resource: the server responded with a status of 404'

// One reporter per run. Scenarios record into it; run.mjs prints the total.
export function createReporter() {
  const results = []
  const errors = []

  return {
    results,
    errors,

    section(title) {
      console.log(`\n── ${title}`)
    },

    check(name, ok, detail = '') {
      results.push({ name, ok })
      console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${detail ? `  (${detail})` : ''}`)
    },

    // A page whose uncaught errors and console errors fail the run.
    // `expectErrors` for pages that deliberately break the network.
    async openPage(context, { expectErrors = false } = {}) {
      const page = await context.newPage()
      if (expectErrors) {
        return page
      }

      page.on('pageerror', (error) => errors.push(error.message))
      page.on('console', (message) => {
        if (message.type() === 'error' && !message.text().startsWith(EXPECTED_404)) {
          errors.push(message.text())
        }
      })
      return page
    },
  }
}

// --- Backend, bypassing the UI ------------------------------------------------

export async function createSessionByApi(pointSystemType = 'numerical', sliderMax = 4) {
  const response = await fetch(`${API}/sessions`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ adminName: 'Ada', pointSystemType, sliderMax }),
  })

  return response.json()
}

// Raw sockets for crowd Participants and a headless Admin. close() drops all.
export function createSocketPool(sessionId) {
  const sockets = []

  function open(identify, ackEvent) {
    return new Promise((resolve) => {
      const socket = io(API, { reconnection: false, query: { sessionId } })
      sockets.push(socket)
      socket.on('session-info', () => identify(socket))
      socket.on(ackEvent, () => resolve(socket))
    })
  }

  return {
    join: (name) => open((s) => s.emit('join', name), 'joined'),
    admin: (adminToken) => open((s) => s.emit('admin-auth', adminToken), 'admin-acknowledged'),
    close: () => sockets.forEach((socket) => socket.close()),
  }
}

// --- The grid -----------------------------------------------------------------
// Squares are addressed by axis index, not value. Rows are reversed on screen
// (highest Resources on top), so these map an index pair to DOM order.

export function cells(page) {
  return page.locator('main .aspect-square')
}

async function axisLength(page) {
  return Math.sqrt(await cells(page).count())
}

async function cell(page, time, resource) {
  const length = await axisLength(page)
  return cells(page).nth((length - 1 - resource) * length + time)
}

export async function cellText(page, time, resource) {
  return (await (await cell(page, time, resource)).innerText()).trim()
}

export async function hoverCell(page, time, resource) {
  await (await cell(page, time, resource)).hover()
}

export async function clickCell(page, time, resource) {
  await (await cell(page, time, resource)).click()
}

// Green Squares as [time, resource] index pairs.
export async function chosen(page) {
  const length = await axisLength(page)
  const indexes = await cells(page).evaluateAll(
    (elements, green) => elements.flatMap((el, i) => (el.className.includes(green) ? [i] : [])),
    GREEN,
  )

  return indexes.map((i) => [i % length, length - 1 - Math.floor(i / length)])
}

export function sameSquares(actual, expected) {
  const key = (squares) => squares.map((s) => s.join(':')).sort().join()
  return key(actual) === key(expected)
}

export async function waitForChosen(page, expected) {
  for (let attempt = 0; attempt < 50; attempt++) {
    if (sameSquares(await chosen(page), expected)) {
      return
    }
    await page.waitForTimeout(100)
  }

  throw new Error(`Expected ${JSON.stringify(expected)}, got ${JSON.stringify(await chosen(page))}`)
}

export async function selectSquare(page, time, resource) {
  await clickCell(page, time, resource)
  await waitForChosen(page, [[time, resource]])
}

// --- Flows --------------------------------------------------------------------

export async function joinInBrowser(page, sessionId, name) {
  await page.goto(`${APP}/${sessionId}/join`)
  await page.locator('input[name="name"]').fill(name)
  await page.getByRole('button', { name: 'Enter Session' }).click()
  await page.waitForURL(/\/start$/)
  await cells(page).first().waitFor()
}

// Resolves true once the page lands on `pattern`, false after the timeout.
export function landsOn(page, pattern, timeout = 5000) {
  return page.waitForURL(pattern, { timeout }).then(
    () => true,
    () => false,
  )
}
