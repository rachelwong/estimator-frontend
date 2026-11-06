import { Theme } from '@/constants'
import { CONTENT } from '@/content'
import type { Content, Theme as ThemeValue } from '@/types'
import { resolveContent } from '@/utils'
import { useTheme } from './useTheme'

// Each theme's copy, resolved once when the module loads rather than on every
// render.
const CONTENT_BY_THEME: Record<ThemeValue, Content> = {
  [Theme.PLAY]: resolveContent(CONTENT, Theme.PLAY),
  [Theme.WORK]: resolveContent(CONTENT, Theme.WORK),
}

// Everything the UI says, in the current theme (src/content.ts). Flipping the
// switch re-renders every component that reads it.
export function useContent(): Content {
  return CONTENT_BY_THEME[useTheme().theme]
}
