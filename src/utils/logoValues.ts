import { LOGO_CARD_VALUES } from '@/constants'

// The next number the logo card flips to (DESIGN.md §1). Drawn from the other
// values, never the current one: two identical flips in a row read as the
// animation having stalled rather than as a coincidence.
export function nextLogoValue(current: number) {
  const others = LOGO_CARD_VALUES.filter((value) => value !== current)

  return others[Math.floor(Math.random() * others.length)]
}

/** The value the card starts on, so the first flip isn't always to the same face. */
export function firstLogoValue() {
  return LOGO_CARD_VALUES[Math.floor(Math.random() * LOGO_CARD_VALUES.length)]
}
