// DEV ONLY. Fixtures for the token sheet at /dev/tokens.
//
// Every class string here is literal: `cn build` and Tailwind's scanner only
// see classes written in the source, so a computed one would paint nothing and
// the sheet would quietly report a token that never rendered.
//
// The rows are `as const` and unannotated on purpose — each sub-component
// declares its own Props and structural typing does the rest, so no shared
// shape has to be named or exported for a folder that gets deleted.

// The surfaces from DESIGN.md §2, each paired with the text colour that sits
// on it. `white` is Tailwind's own and is listed because the design names it.
export const DEV_SURFACES = [
  { token: 'ink', bgClass: 'bg-ink', fgClass: 'text-cream', use: 'Text, every border, every offset shadow' },
  { token: 'cream', bgClass: 'bg-cream', fgClass: 'text-ink', use: 'Page background' },
  { token: 'white', bgClass: 'bg-white', fgClass: 'text-ink', use: 'Windows, cards, inputs, secondary buttons' },
  { token: 'accent', bgClass: 'bg-accent', fgClass: 'text-white', use: 'Window title bars, CTA band, active axis label' },
  { token: 'page-top', bgClass: 'bg-page-top', fgClass: 'text-ink', use: 'Top of Welcome, share bar' },
  { token: 'selection', bgClass: 'bg-selection', fgClass: 'text-ink', use: 'Your own Selection, primary buttons' },
  { token: 'danger', bgClass: 'bg-danger', fgClass: 'text-ink', use: 'End session & reveal' },
  { token: 'copied', bgClass: 'bg-copied', fgClass: 'text-ink', use: '"Copied!" state, live status chip' },
] as const

// The colours that only ever appear as text, each on the surface it sits on.
export const DEV_TEXT_COLOURS = [
  { token: 'text-muted', bgClass: 'bg-cream', fgClass: 'text-text-muted', use: 'Body copy on cream/white' },
  { token: 'text-subtle', bgClass: 'bg-white', fgClass: 'text-text-subtle', use: 'Secondary labels, Abstained chip border' },
  { token: 'abstained', bgClass: 'bg-white', fgClass: 'text-abstained', use: 'The word "Abstained"' },
  { token: 'on-ink-muted', bgClass: 'bg-ink', fgClass: 'text-on-ink-muted', use: 'Secondary text on ink (notice, popover)' },
] as const

// What each step of the ramp means. Paired by index with CROWD_CLASS, so the
// sheet renders the constant the grid will use rather than a copy of it.
export const DEV_CROWD_MEANING = [
  'Idle / nobody',
  '1 person',
  '2 people',
  '3 people',
  '4 or more',
] as const

// DESIGN.md §3, mobile-first: the bare size is the 390 artboard. Where the
// table gives a range, one representative size renders and the range prints
// beside it.
export const DEV_TYPE_SCALE = [
  {
    role: 'Welcome hero',
    fontClass: 'font-display',
    sizeClass: 'text-[36px] tablet:text-[58px] desktop:text-[78px]',
    sizes: '36 / 58 / 78',
  },
  {
    role: 'Section heading (h2)',
    fontClass: 'font-display',
    sizeClass: 'text-[27px] tablet:text-[36px] desktop:text-[44px]',
    sizes: '27 / 36 / 44',
  },
  {
    role: 'CTA band heading',
    fontClass: 'font-display',
    sizeClass: 'text-[23px] tablet:text-[31px] desktop:text-[41px]',
    sizes: '23 / 31 / 41',
  },
  {
    role: 'Screen heading (Join)',
    fontClass: 'font-display',
    sizeClass: 'text-[22px] tablet:text-[30px] desktop:text-[30px]',
    sizes: '22 / 30 / 30',
  },
  {
    role: 'Screen heading (Create)',
    fontClass: 'font-display',
    sizeClass: 'text-[20px] tablet:text-[28px] desktop:text-[28px]',
    sizes: '20 / 28 / 28',
  },
  {
    role: 'Screen heading (Active, Reveal)',
    fontClass: 'font-display',
    sizeClass: 'text-[20px] tablet:text-[27px] desktop:text-[27px]',
    sizes: '20 / 27 / 27',
  },
  {
    role: 'Wordmark in header',
    fontClass: 'font-display',
    sizeClass: 'text-[13px] tablet:text-[19px] desktop:text-[19px]',
    sizes: '12–13 / 16–19 / 16–19',
  },
  {
    role: 'Card / sub heading (h3)',
    fontClass: 'font-body font-bold',
    sizeClass: 'text-[17px] tablet:text-[19px] desktop:text-[20px]',
    sizes: '17 / 19 / 20',
  },
  {
    role: 'Body',
    fontClass: 'font-body',
    sizeClass: 'text-[16px] tablet:text-[17px] desktop:text-[18px]',
    sizes: '15–18 / 16–18 / 16–21',
  },
  {
    role: 'Silkscreen label',
    fontClass: 'font-label',
    sizeClass: 'text-[11px] tablet:text-[12px] desktop:text-[12px]',
    sizes: '10–12 / 11–13 / 11–13',
  },
] as const

// Figtree's four weights (§3), so the variable axis is visibly loading.
export const DEV_BODY_WEIGHTS = [
  { label: '400 regular', class: 'font-body font-normal' },
  { label: '500 medium', class: 'font-body font-medium' },
  { label: '700 bold', class: 'font-body font-bold' },
  { label: '800 extrabold', class: 'font-body font-extrabold' },
] as const

// The offset shadows from §4, each named for the thing it belongs to.
export const DEV_SHADOWS = [
  { token: 'shadow-px', class: 'shadow-px', use: 'Button, input, icon button' },
  { token: 'shadow-px-card', class: 'shadow-px-card', use: 'Card' },
  { token: 'shadow-px-window', class: 'shadow-px-window', use: 'Window' },
  { token: 'shadow-px-accent', class: 'shadow-px-accent', use: 'Dark notice, popover' },
] as const
