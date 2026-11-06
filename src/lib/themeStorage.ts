// The theme's place in localStorage, and its place in a share link.
//
// Plain functions, like adminToken.ts: ThemeProvider reads once at mount and
// writes on every change, so there is nothing to subscribe to.
import { Theme } from '@/constants'
import type { Theme as ThemeValue } from '@/types'

const STORAGE_KEY = 'estimator:theme'
const QUERY_PARAM = 'theme'

function isTheme(value: string | null): value is ThemeValue {
  return value === Theme.PLAY || value === Theme.WORK
}

// Read as the module loads, not at first render: route loaders redirect (/ to
// /welcome, /join to /start) before React renders, and a redirect drops the
// query. Loaders are async, so this synchronous read always beats them.
const fromLink = new URLSearchParams(window.location.search).get(QUERY_PARAM)

// A share link's ?theme= wins over what this browser last stored, so a teammate
// opens the session in the theme the Admin is using. Without either, Play.
export function getInitialTheme(): ThemeValue {
  if (isTheme(fromLink)) {
    return fromLink
  }

  const stored = localStorage.getItem(STORAGE_KEY)

  return isTheme(stored) ? stored : Theme.PLAY
}

export function setStoredTheme(theme: ThemeValue): void {
  localStorage.setItem(STORAGE_KEY, theme)
}

// Play is the default for a link with no param, so only Work needs to say so.
export function withThemeParam(url: string, theme: ThemeValue): string {
  return theme === Theme.WORK ? `${url}?${QUERY_PARAM}=${theme}` : url
}
