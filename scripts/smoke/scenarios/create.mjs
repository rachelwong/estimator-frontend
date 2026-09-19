// The create form — PLAN.md Phase 3.
import { API, APP, cells, landsOn } from '../lib.mjs'

const NAME_RULE = 'Use 1-20 letters or numbers, with no spaces.'
const FIBONACCI_AT_64 = ['0', '1', '2', '3', '5', '8', '13', '21', '34', '55']

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
  await name.fill('Jim Bob')
  await name.blur()
  check('Space in name shows rule', await page.getByText(NAME_RULE).isVisible())
  check('Start disabled for bad name', await start.isDisabled())

  await name.fill('Ada')
  check('Rule clears for good name', (await page.getByText(NAME_RULE).count()) === 0)
  check('Start enabled for good name', await start.isEnabled())

  // Numerical ceiling is 20. Switching system resets the max to 0.
  await page.getByRole('slider').focus()
  await page.keyboard.press('End')
  check('Numerical slider tops out at 20', (await sliderValue(page)) === '20')

  await page.getByLabel('Fibonacci sequence').click()
  check('Switching system resets max to 0', (await sliderValue(page)) === '0')

  await page.getByRole('slider').focus()
  await page.keyboard.press('End')
  check('Fibonacci slider tops out at 64', (await sliderValue(page)) === '64')

  await start.click()
  await page.waitForURL(/\/start$/)
  await cells(page).first().waitFor()
  check('Fibonacci grid is 10×10', (await cells(page).count()) === 100)

  // The bottom row holds the Time values, left to right.
  const timeValues = await page
    .locator('main .grid.gap-1 > span')
    .evaluateAll((spans) => spans.slice(-10).map((s) => s.textContent.trim()))
  check('Fibonacci axis stops at 55', timeValues.join() === FIBONACCI_AT_64.join(), timeValues.join())

  // A sleeping backend fails in place, keeping the filled-in form.
  const offline = await openPage(context, { expectErrors: true })
  await offline.route(`${API}/sessions`, (route) => route.abort())
  await offline.goto(`${APP}/new`)
  await offline.getByLabel('Provide your name').fill('Ada')
  await offline.getByRole('button', { name: 'Start Session' }).click()
  const unreachable = offline.getByText('Could not reach the server. Try again.')
  await unreachable.waitFor({ timeout: 5000 }).catch(() => {})
  check('Unreachable server reported inline', await unreachable.isVisible())
  check('Form keeps its name', (await offline.getByLabel('Provide your name').inputValue()) === 'Ada')
}

async function sliderValue(page) {
  return (await page.getByRole('slider').getAttribute('aria-valuenow')) ?? ''
}
