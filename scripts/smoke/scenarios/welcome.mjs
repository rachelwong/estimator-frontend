// The Welcome page — fold-and-flip.md Stage 9. No backend involved: the demos
// run on a sample Session the page carries itself.
import { APP, landsOn } from '../lib.mjs'

const DEMO_CROWD = ['Mia', 'Jim-1', 'Noor']
const SIZES = { desktop: 1440, tablet: 834, mobile: 390 }
const FRONTEND_REPO = 'https://github.com/rachelwong/estimator-frontend'
const BACKEND_REPO = 'https://github.com/rachelwong/estimator-backend'

export async function welcome({ browser, reporter }) {
  const { check, openPage } = reporter

  // --- Desktop ---------------------------------------------------------------
  const desktop = await openPage(await browser.newContext({ viewport: { width: SIZES.desktop, height: 900 } }))
  await desktop.goto(`${APP}/welcome`)

  const hero = desktop.getByRole('heading', { name: /ship together/ })
  await hero.waitFor()
  check('Hero heading shows', await hero.isVisible())

  // The hero's Reveal opens on its crowded Square, popover pinned.
  const popover = desktop.getByRole('dialog')
  await popover.waitFor()
  check(
    'Demo popover open on arrival, every name',
    JSON.stringify(await popover.locator('li').allInnerTexts()) === JSON.stringify(DEMO_CROWD),
  )
  check('Demo is the real Reveal window', await desktop.getByText('Voting is closed').isVisible())
  check('Arriving pinned does not scroll the page', (await desktop.evaluate(() => window.scrollY)) === 0)

  await desktop.keyboard.press('Escape')
  await popover.waitFor({ state: 'detached' })
  check('Esc closes the demo popover', (await popover.count()) === 0)

  // Header link lands its section below the sticky header, not under it.
  await desktop.getByRole('navigation', { name: 'Main' }).getByRole('link', { name: 'How to play' }).click()
  check('How to play link sets the hash', await landsOn(desktop, `${APP}/welcome#how-to-play`))
  const headingTop = await desktop
    .getByRole('heading', { name: 'How to play', level: 2 })
    .evaluate((el) => el.getBoundingClientRect().top)
  const headerBottom = await desktop.locator('header').evaluate((el) => el.getBoundingClientRect().bottom)
  check('How to play lands below the header', headingTop >= headerBottom, `heading ${headingTop}, header ${headerBottom}`)

  // "While you pick" takes clicks like a running Session: move, then clear.
  const yours = desktop.getByRole('button', { name: /, your Selection$/ })
  check('Selection demo starts with one Selection', (await yours.count()) === 1)
  await desktop.getByRole('button', { name: 'Time 2, resources 1', exact: true }).click()
  check(
    'Clicking another Square moves the Selection',
    (await yours.getAttribute('aria-label')) === 'Time 2, resources 1, your Selection',
  )
  await yours.click()
  check('Clicking it again clears it', (await yours.count()) === 0)

  check(
    'Repo cards link to both repos',
    (await desktop.getByRole('link', { name: 'View estimator-frontend on GitHub' }).getAttribute('href')) === FRONTEND_REPO &&
      (await desktop.getByRole('link', { name: 'View estimator-backend on GitHub' }).getAttribute('href')) === BACKEND_REPO,
  )
  check('Placeholder copy is marked', await desktop.getByText(/^\[Placeholder:/).first().isVisible())

  // --- No sideways scroll at any size ----------------------------------------
  for (const [name, width] of Object.entries(SIZES)) {
    await desktop.setViewportSize({ width, height: 900 })
    await desktop.goto(`${APP}/welcome`)
    await hero.waitFor()
    const overflow = await desktop.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)
    check(`No page overflow at ${name}`, overflow <= 0, `${overflow}px`)
  }

  // --- Mobile menu -------------------------------------------------------------
  const mobile = await openPage(await browser.newContext({ viewport: { width: SIZES.mobile, height: 844 } }))
  await mobile.goto(`${APP}/welcome`)
  const menuButton = mobile.getByRole('button', { name: 'Menu' })
  const menu = mobile.getByRole('navigation', { name: 'Menu' })

  // The page is its own chunk; isVisible() doesn't wait for it to arrive.
  await menuButton.waitFor()
  check('Mobile header shows the Menu button', await menuButton.isVisible())
  check('Desktop nav hidden on a phone', !(await mobile.getByRole('navigation', { name: 'Main' }).isVisible()))

  await menuButton.click()
  const closeButton = mobile.getByRole('button', { name: 'Close' })
  check('Menu opens', await menu.isVisible())
  check('Button reads Close, expanded', (await closeButton.getAttribute('aria-expanded')) === 'true')

  await menu.getByRole('link', { name: 'Why keep Selections private?' }).click()
  check('A row closes the menu', (await menu.count()) === 0)
  check('A row follows its link', await landsOn(mobile, `${APP}/welcome#why-private`))

  await menuButton.click()
  await mobile.keyboard.press('Escape')
  check('Esc closes the menu', (await menu.count()) === 0)

  await menuButton.click()
  await mobile.mouse.click(SIZES.mobile / 2, 830)
  check('Tapping the backdrop closes the menu', (await menu.count()) === 0)

  await menuButton.click()
  await menu.getByRole('link', { name: 'Start a session' }).click()
  check('Menu Start a session → /new', await landsOn(mobile, `${APP}/new`))
}
