import { useSyncExternalStore } from 'react'
import { BREAKPOINT_PX, Breakpoint } from '@/constants'
import type { Breakpoint as BreakpointValue } from '@/types'

const TABLET_QUERY = `(min-width: ${BREAKPOINT_PX.TABLET}px)`
const DESKTOP_QUERY = `(min-width: ${BREAKPOINT_PX.DESKTOP}px)`

// Which of the three artboards the viewport is in. For code that has to
// measure, like Square size — layout itself uses the `tablet:` / `desktop:`
// variants.
export function useBreakpoint(): BreakpointValue {
  return useSyncExternalStore(subscribe, current)
}

function current(): BreakpointValue {
  if (window.matchMedia(DESKTOP_QUERY).matches) {
    return Breakpoint.DESKTOP
  }

  return window.matchMedia(TABLET_QUERY).matches ? Breakpoint.TABLET : Breakpoint.MOBILE
}

function subscribe(onChange: () => void) {
  const queries = [TABLET_QUERY, DESKTOP_QUERY].map((query) => window.matchMedia(query))
  queries.forEach((query) => query.addEventListener('change', onChange))

  return () => queries.forEach((query) => query.removeEventListener('change', onChange))
}
