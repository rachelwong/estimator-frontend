// Browser smoke checks for the whole app, against the running dev servers.
// Not a test suite — automated tests are out of scope (PLAN.md).
//
// Run:  npm run smoke              every scenario
//       npm run smoke -- join      only the named ones
//
// Needs both dev servers up: backend on :3001, frontend on :5173.
import { chromium } from 'playwright'
import { API, APP, createReporter } from './lib.mjs'
import { create } from './scenarios/create.mjs'
import { join } from './scenarios/join.mjs'
import { routing } from './scenarios/routing.mjs'
import { session } from './scenarios/session.mjs'

const SCENARIOS = { create, routing, join, session }

const requested = process.argv.slice(2)
const unknown = requested.filter((name) => !(name in SCENARIOS))
if (unknown.length > 0) {
  console.error(`Unknown scenario: ${unknown.join(', ')}. Pick from: ${Object.keys(SCENARIOS).join(', ')}`)
  process.exit(1)
}

// Fail fast with a clear message rather than a Playwright timeout.
for (const url of [APP, `${API}/sessions/ping`]) {
  try {
    await fetch(url)
  } catch {
    console.error(`${url} is not reachable. Start both dev servers first.`)
    process.exit(1)
  }
}

const reporter = createReporter()
const browser = await chromium.launch()

for (const name of requested.length > 0 ? requested : Object.keys(SCENARIOS)) {
  reporter.section(name)
  const context = { browser, reporter }

  // One scenario crashing still lets the others run.
  try {
    await SCENARIOS[name](context)
  } catch (error) {
    reporter.check(`${name} ran to completion`, false, error.message.split('\n')[0])
  }

  for (const browserContext of browser.contexts()) {
    await browserContext.close()
  }
}

reporter.section('console')
reporter.check('No page or console errors', reporter.errors.length === 0, reporter.errors.join(' | '))

await browser.close()

const failed = reporter.results.filter((result) => !result.ok).length
console.log(`\n${reporter.results.length - failed}/${reporter.results.length} passed`)
process.exit(failed ? 1 : 0)
