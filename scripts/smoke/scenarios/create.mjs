// The create form — PLAN.md Phase 3, fold-and-flip.md Stage 7.
import {
  API,
  APP,
  cells,
  descriptionBlock,
  landsOn,
  opensSafelyInNewTab,
  pageHeadings,
} from "../lib.mjs";

const NAME_RULE = "Use 1-20 letters, numbers or spaces, with no symbols.";
const DESCRIPTION_RULE = "Keep description to 300 characters or fewer.";
const DESCRIPTION = "PROJ-12 https://example.com/ticket/12.";
const FIBONACCI_AT_55 = ["0", "1", "2", "3", "5", "8", "13", "21", "34", "55"];
const DRAG_MOVES = 60;

export async function create({ browser, reporter }) {
  const { check, openPage } = reporter;
  const context = await browser.newContext();
  const page = await openPage(context);
  const submit = page.getByRole("button", { name: "Create session" });
  const name = page.getByLabel("Name");
  const fibonacci = page.getByRole("button", { name: "Fibonacci" });

  // Home is the welcome page. Its Start a session buttons open the form.
  await page.goto(APP);
  check("/ → /welcome", await landsOn(page, `${APP}/welcome`));
  await page.getByRole("link", { name: "Start a session" }).first().click();
  check("Welcome button → /new", await landsOn(page, `${APP}/new`));
  await page.getByRole("heading", { name: "New session" }).waitFor();
  check(
    "New session is the one h1",
    (await pageHeadings(page)).join() === "New session",
  );

  check("Create disabled with no name", await submit.isDisabled());
  check(
    "Numerical pressed by default",
    (await page
      .getByRole("button", { name: "Numerical" })
      .getAttribute("aria-pressed")) === "true",
  );

  // Validated on blur, before any request.
  await name.fill("Jim@Bob");
  await name.blur();
  check(
    "Symbol in name shows rule",
    await page.getByText(NAME_RULE).isVisible(),
  );
  check("Create disabled for bad name", await submit.isDisabled());

  // A space is a name, not a symbol.
  await name.fill("Jim Bob");
  await name.blur();
  check(
    "Rule clears for a spaced name",
    (await page.getByText(NAME_RULE).count()) === 0,
  );

  await name.fill("Ada");
  check(
    "Rule clears for good name",
    (await page.getByText(NAME_RULE).count()) === 0,
  );
  check("Create disabled while max is 0", await submit.isDisabled());

  // Numerical ceiling is 20. Switching system resets the max to 0.
  await page.getByRole("slider").focus();
  await page.keyboard.press("End");
  check("Numerical slider tops out at 20", (await sliderValue(page)) === "20");
  check("Create enabled with a name and a max", await submit.isEnabled());

  await fibonacci.click();
  check(
    "Fibonacci pressed once picked",
    (await fibonacci.getAttribute("aria-pressed")) === "true",
  );
  check("Switching system resets max to 0", (await sliderValue(page)) === "0");
  check("Create disabled again after the reset", await submit.isDisabled());

  await page.getByRole("slider").focus();
  await page.keyboard.press("End");
  check("Fibonacci slider tops out at 55", (await sliderValue(page)) === "55");

  // Every stop is a Fibonacci number, so arrowing up from 0 walks the sequence
  // rather than counting 1, 2, 3, 4.
  await page.keyboard.press("Home");
  const stops = [];
  for (let press = 0; press < 4; press += 1) {
    await page.keyboard.press("ArrowRight");
    stops.push(await sliderValue(page));
  }
  check(
    "Fibonacci slider steps 1 2 3 5",
    stops.join() === "1,2,3,5",
    stops.join(),
  );

  // A drag rests on every value in turn and never doubles back.
  const dragged = await dragAcross(page);
  check(
    "Dragging walks the sequence",
    dragged.join() === FIBONACCI_AT_55.join(),
    dragged.join(),
  );

  // A tick under every Fibonacci value, spaced evenly.
  // The tick row is the div straight after the one holding the slider.
  const ticks = await page
    .locator('div:has(> input[type="range"]) + div[aria-hidden="true"] > span')
    .allTextContents();
  check(
    "A tick under every value",
    ticks.join() === FIBONACCI_AT_55.join(),
    ticks.join(),
  );

  // --- Ticket or task ---------------------------------------------------------
  await page.getByRole("slider").focus();
  await page.keyboard.press("End");
  const description = page.getByLabel("Ticket or task");
  const counter = page.locator("#description-count");
  check("Create enabled with no description", await submit.isEnabled());
  check(
    "Counter starts at 0/300",
    (await counter.innerText()) === "0/300",
    await counter.innerText(),
  );

  // Counted after the clean-up, as the server counts it.
  await description.fill("  PROJ  12 ");
  check(
    "Counter counts the cleaned-up text",
    (await counter.innerText()) === "7/300",
    await counter.innerText(),
  );

  await description.fill("a".repeat(301));
  check(
    "301 characters shows the rule",
    await page.getByText(DESCRIPTION_RULE).isVisible(),
  );
  check("Create disabled over 300", await submit.isDisabled());

  await description.fill(DESCRIPTION);
  check(
    "Rule clears at a good length",
    (await page.getByText(DESCRIPTION_RULE).count()) === 0,
  );

  // --- Created ----------------------------------------------------------------
  await submit.click();
  check("Create → /start", await landsOn(page, /\/start$/));
  await descriptionBlock(page).waitFor();
  check(
    "Active shows the description",
    (await descriptionBlock(page).innerText()) === DESCRIPTION,
  );
  check(
    "Link drops the trailing dot, opens in a new tab",
    await opensSafelyInNewTab(page, "https://example.com/ticket/12"),
  );
  const sessionId = new URL(page.url()).pathname.split("/")[1];
  const link = await page.getByLabel("Session link").inputValue();
  check(
    "Share link points at /join",
    link === `${APP}/${sessionId}/join`,
    link,
  );
  await cells(page).first().waitFor();
  check("Fibonacci grid is 10×10", (await cells(page).count()) === 100);

  // The row under the Squares, inside the scroller, holds the Time values.
  const timeValues = await page
    .locator("main .overflow-x-auto > div:last-child > span")
    .evaluateAll((spans) => spans.map((s) => s.textContent.trim()));
  check(
    "Fibonacci axis stops at 55",
    timeValues.join() === FIBONACCI_AT_55.join(),
    timeValues.join(),
  );

  // A sleeping backend fails in place, keeping the filled-in form.
  const offline = await openPage(context, { expectErrors: true });
  await offline.route(`${API}/sessions`, (route) => route.abort());
  await offline.goto(`${APP}/new`);
  await offline.getByLabel("Name").fill("Ada");
  await offline.getByRole("slider").focus();
  await offline.keyboard.press("End");
  await offline.getByRole("button", { name: "Create session" }).click();
  const unreachable = offline.getByText(
    "Could not reach the server. Try again.",
  );
  await unreachable.waitFor({ timeout: 5000 }).catch(() => {});
  check("Unreachable server reported inline", await unreachable.isVisible());
  check(
    "Form keeps its name",
    (await offline.getByLabel("Name").inputValue()) === "Ada",
  );
}

// The axis value, not the slider's own index.
async function sliderValue(page) {
  return (await page.getByRole("slider").getAttribute("aria-valuetext")) ?? "";
}

// Holds the thumb and crosses the whole track in small moves, collecting each
// value it comes to rest on. Enough moves that no value can be stepped over.
async function dragAcross(page) {
  const track = await page.getByRole("slider").boundingBox();
  const middle = track.y + track.height / 2;
  const seen = [];

  await page.mouse.move(track.x, middle);
  await page.mouse.down();

  for (let step = 0; step <= DRAG_MOVES; step += 1) {
    await page.mouse.move(track.x + (track.width * step) / DRAG_MOVES, middle);
    const value = await sliderValue(page);

    if (seen.at(-1) !== value) {
      seen.push(value);
    }
  }

  await page.mouse.up();

  return seen;
}
