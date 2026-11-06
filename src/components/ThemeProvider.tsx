import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { Theme } from '@/constants'
import { ThemeContext } from '@/lib/themeContext'
import type { Theme as ThemeValue } from '@/types'
import { loadWorkFonts } from '@/utils'

interface ThemeProviderProps {
  children: ReactNode
}

// Holds the theme the header switch flips (docs/plans/themes.md). Every load
// starts on Play and nothing is stored, so there is no first-paint flash: Play
// is the stylesheet's default.
//
// While Work is on, <html> carries data-theme="work", so CSS can swap its
// tokens and reach portalled content (popovers, dialogs) too.
export function ThemeProvider({ children }: ThemeProviderProps) {
  const [theme, setTheme] = useState<ThemeValue>(Theme.PLAY)

  useEffect(() => {
    const root = document.documentElement

    if (theme === Theme.WORK) {
      // Text shows in the fallback face until the fonts land (font-display: swap).
      loadWorkFonts()
      root.dataset.theme = Theme.WORK
    } else {
      delete root.dataset.theme
    }
  }, [theme])

  function toggleTheme() {
    setTheme((current) => (current === Theme.WORK ? Theme.PLAY : Theme.WORK))
  }

  return <ThemeContext value={{ theme, toggleTheme }}>{children}</ThemeContext>
}
