import switchSpade from '@/assets/sprites/switch-spade.svg'
import switchSlash from '@/assets/sprites/work/switch-slash.svg'
import { Sprite } from '@/components/Sprite'
import { Theme } from '@/constants'
import { useContent, useTheme } from '@/hooks'

// The header's Play/Work switch (docs/plans/themes.md). On means Work.
//
// Each theme draws its own pill: Play's is S10-Toggle (lavender track, ink
// edge, a spade knob on the left, Silkscreen "Play"), Work's is the Round 14
// header (petrol track, the knob on the right carrying the logo's yellow
// slash). Colours and fonts come from the switch roles; size, edge width and
// which side the knob sits on are the `work:` classes. The pill and the round
// knob are fixed shapes in both, not radius tokens.
export function ThemeSwitch() {
  const { theme, toggleTheme } = useTheme()
  const content = useContent()
  const isWorkTheme = theme === Theme.WORK
  const knobGlyph = isWorkTheme ? switchSlash : switchSpade

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isWorkTheme}
      aria-label={content.themeSwitch.ariaLabel}
      className="relative flex h-[34px] w-[92px] shrink-0 cursor-pointer items-center justify-end rounded-full border-[3px] border-switch-border bg-switch-track pr-3.5 font-label text-[12px] leading-none text-switch-foreground outline-none transition-colors duration-160 hover:bg-switch-track-hover focus-visible:outline-[3px] focus-visible:outline-offset-4 focus-visible:outline-ring work:h-[30px] work:w-[76px] work:justify-start work:border work:pr-0 work:pl-[11px] work:text-[13px] work:font-semibold"
      onClick={toggleTheme}
    >
      {content.themeSwitch.label}
      <span className="absolute top-1/2 left-0.5 flex size-6 -translate-y-1/2 items-center justify-center rounded-full border-2 border-switch-border bg-switch-knob shadow-knob work:right-[3px] work:left-auto work:size-[22px] work:border-0">
        <Sprite source={knobGlyph} />
      </span>
    </button>
  )
}
