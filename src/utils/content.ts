import { Theme } from '@/constants'
import type { ContentTree, ResolvedContent, Theme as ThemeValue, ThemeVariants } from '@/types'

// A content tree with every leaf narrowed to one theme's version:
// { title: { play: 'A', work: 'B' } } → { title: 'A' } for Play.
export function resolveContent<T extends ContentTree>(tree: T, theme: ThemeValue): ResolvedContent<T> {
  const entries = Object.entries(tree).map(([key, value]) => {
    const resolved = isThemeVariants(value) ? value[theme] : resolveContent(value, theme)
    return [key, resolved] as const
  })

  return Object.fromEntries(entries) as ResolvedContent<T>
}

// A leaf holds a version for every theme; a branch holds more entries.
function isThemeVariants(value: ThemeVariants<unknown> | ContentTree): value is ThemeVariants<unknown> {
  return Object.values(Theme).every((theme) => theme in value)
}
