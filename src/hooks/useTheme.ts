import { useContext } from 'react'
import { ThemeContext } from '@/lib/themeContext'
import type { ThemeContextValue } from '@/types'

// The current theme and the switch's toggle. Only works under ThemeProvider,
// which App puts around everything.
export function useTheme(): ThemeContextValue {
  const value = useContext(ThemeContext)

  if (!value) {
    throw new Error('useTheme needs a ThemeProvider above it')
  }

  return value
}
