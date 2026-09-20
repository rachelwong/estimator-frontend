// The create form — PLAN.md Phase 3.
import { API, APP, cells, landsOn } from '../lib.mjs'

const NAME_RULE = 'Use 1-20 letters, numbers or spaces, with no symbols.'
const FIBONACCI_AT_55 = ['0', '1', '2', '3', '5', '8', '13', '21', '34', '55']
const DRAG_MOVES = 60

export async function create({ browser, reporter }) {
  const { check, openPage } = reporter
  const context = await browser.newContext()
  const page = await openPage(context)
  const start = page.getByRole('button', { name: 'Start Session' })
  const name = page.getByLabel('Provide your name')

  // Home is the welcome page. Its button opens the form.
  await page.goto(APP)
  check('/ → /welcome', await landsOn(page, `${APP}/welcome`))
  await page.getByRole('link', { name: 'Create a new session' }).click()
  check('Welcome button → /new', await landsOn(page, `${APP}/new`))

  check('Start disabled with no name', await start.isDisabled())

  // Validated on blur, before any request.
  await name.fill('Jim@Bob')
  await name.blur()
  check('Symbol in name shows rule', await page.getByText(NAME_RULE).isVisible())
  check('Start disabled for bad name', await start.isDisabled())

  // A space is a name, not a symbol.
  await name.fill('Jim Bob')
  await name.blur()
  check('Rule clears for a spaced name', (await page.getByText(NAME_RULE).count()) === 0)

  await name.fill('Ada')
  check('Rule clears for good name', (await page.getByText(NAME_RULE).count()) === 0)
  check('Start disabled while max is 0', await start.isDisabled())

  // Numerical ceiling is 20. Switching system resets the max to 0.
  await page.getByRole('slider').focus()
  await page.keyboard.press('End')
  check('Numerical slider tops out at 20', (await sliderValue(page)) === '20')
  check('Start enabled with a name and a max', await start.isEnabled())

  await page.getByLabel('Fibonacci sequence').click()
  check('Switching system resets max to 0', (await sliderValue(page)) === '0')
  check('Start disabled again after the reset', await start.isDisabled())

  await page.getByRole('slider').focus()
  await page.keyboard.press('End')
  check('Fibonacci slider tops out at 55', (await sliderValue(page)) === '55')

  // Every stop is a Fibonacci number, so arrowing up from 0 walks the sequence
  // rather than counting 1, 2, 3, 4.
  await page.keyboard.press('Home')
  const stops = []
  for (let press = 0; press < 4; press += 1) {
    await page.keyboard.press('ArrowRight')
    stops.push(await sliderValue(page))
  }
  check('Fibonacci slider steps 1 2 3 5', stops.join() === '1,2,3,5', stops.join())

  // A drag rests on every value in turn and never doubles back — snapping that
  // looks at the direction of travel flaps between two values around every
  // midpoint, and only a drag shows it.
  const dragged = await dragAcross(page)
  check('Dragging walks the sequence', dragged.join() === FIBONACCI_AT_55.join(), dragged.join())

  await page.keyboard.press('End')
  await start.click()
  await page.waitForURL(/\/start$/)
  await cells(page).first().waitFor()
  check('Fibonacci grid is 10×10', (await cells(page).count()) === 100)

  // The bottom row holds the Time values, left to right.
  const timeValues = await page
    .locator('main .grid.gap-1 > span')
    .evaluateAll((spans) => spans.slice(-10).map((s) => s.textContent.trim()))
  check('Fibonacci axis stops at 55', timeValues.join() === FIBONACCI_AT_55.join(), timeValues.join())

  // A sleeping backend fails in place, keeping the filled-in form.
  const offline = await openPage(context, { expectErrors: true })
  await offline.route(`${API}/sessions`, (route) => route.abort())
  await offline.goto(`${APP}/new`)
  await offline.getByLabel('Provide your name').fill('Ada')
  await offline.getByRole('slider').focus()
  await offline.keyboard.press('End')
  await offline.getByRole('button', { name: 'Start Session' }).click()
  const unreachable = offline.getByText('Could not reach the server. Try again.')
  await unreachable.waitFor({ timeout: 5000 }).catch(() => {})
  check('Unreachable server reported inline', await unreachable.isVisible())
  check('Form keeps its name', (await offline.getByLabel('Provide your name').inputValue()) === 'Ada')
}

async function sliderValue(page) {
  return (await page.getByRole('slider').getAttribute('aria-valuenow')) ?? ''
}

// Holds the thumb and crosses the whole track in small moves, collecting each
// value it comes to rest on. Enough moves that no value can be stepped over.
async function dragAcross(page) {
  const track = await page.locator('[data-slot="slider-track"]').boundingBox()
  const middle = track.y + track.height / 2
  const seen = []

  await page.mouse.move(track.x, middle)
  await page.mouse.down()

  for (let step = 0; step <= DRAG_MOVES; step += 1) {
    await page.mouse.move(track.x + (track.width * step) / DRAG_MOVES, middle)
    const value = await sliderValue(page)

    if (seen.at(-1) !== value) {
      seen.push(value)
    }
  }

  await page.mouse.up()

  return seen
}
