import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { Theme } from '@/constants'
import { ThemeContext } from '@/lib/themeContext'
import { getInitialTheme, setStoredTheme } from '@/lib/themeStorage'
import type { Theme as ThemeValue } from '@/types'
import { loadWorkFonts } from '@/utils'

interface ThemeProviderProps {
  children: ReactNode
}

// Holds the theme the header switch flips (docs/plans/themes.md). A load starts
// on a share link's ?theme=, else the theme this browser last used, else Play
// (themeStorage.ts). Whichever it starts on, and every flip after, is stored.
//
// While Work is on, <html> carries data-theme="work", so CSS can swap its
// tokens and reach portalled content (popovers, dialogs) too. Play is the
// stylesheet's default, so a Work load shows Play until the bundle runs.
export function ThemeProvider({ children }: ThemeProviderProps) {
  const [theme, setTheme] = useState<ThemeValue>(getInitialTheme)

  useEffect(() => {
    const root = document.documentElement
    setStoredTheme(theme)

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
