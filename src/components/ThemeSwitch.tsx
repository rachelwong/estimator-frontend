import { Theme } from '@/constants'
import { useContent, useTheme } from '@/hooks'

// The header's Play/Work switch (docs/plans/themes.md). On means Work.
//
// Plain for now: phase 3 of the plan gives it each theme's pill, track and knob.
export function ThemeSwitch() {
  const { theme, toggleTheme } = useTheme()
  const content = useContent()
  const isWorkTheme = theme === Theme.WORK

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isWorkTheme}
      aria-label={content.themeSwitch.ariaLabel}
      className="inline-flex h-9 cursor-pointer items-center border-2 border-ghost-border bg-secondary px-2.5 font-label text-[11px] text-nav-foreground outline-none focus-visible:outline-[3px] focus-visible:outline-offset-4 focus-visible:outline-ring"
      onClick={toggleTheme}
    >
      {content.themeSwitch.label}
    </button>
  )
}
