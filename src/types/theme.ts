import type { Theme } from './constants'

// What ThemeProvider shares: the current theme, and the switch's one action.
export interface ThemeContextValue {
  theme: Theme
  toggleTheme: () => void
}
