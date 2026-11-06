import type { ReactNode } from 'react'
import { Chip } from '@/components/Chip'
import { Sprite } from '@/components/Sprite'
import { WINDOW_VARIANT_CLASS } from '@/constants'
import { cn } from '@/lib/utils'
import type { WindowVariant } from '@/types'
import { WindowChrome } from './WindowChrome'

interface WindowProps {
  /** Silkscreen, lower case, one or two words: `live`, `the reveal`, `new-session`. */
  title: string
  /** Which screen this is framing — it settles the width and the body padding. */
  variant: WindowVariant
  /** The status chip beside the chrome — "Admin", "Participant", "error". */
  chip?: string
  /** Work only: the line icon before the chip's word (`work/person.svg`, `work/shield.svg`). */
  chipIcon?: string
  children: ReactNode
}

// The frame around every working surface (DESIGN.md §4): 3px edge, an 8px
// offset shadow, a 44px `primary` title bar with a Silkscreen title, and a 3px
// rule under the bar.
//
// A plain <section>, not a dialog or a region: it is the page's own content in
// a costume, and announcing a landmark on every screen would add a level to
// navigate through for a decoration. The heading inside it is what a screen
// reader has always had to go on.
//
// The design gives each screen its own width and body padding (§5), so the
// window is told which screen it is framing and reads both off WINDOW_VARIANT_CLASS.
// No caller passes classes in: none of them varies what it would pass.
//
// Work has no window costume (NL-* boards): the frame is a plain card, 1px
// edge and 12px corners, with no title bar. The title goes with the bar — the
// h1 inside already names the screen — and the chip turns into a quiet role
// label in the card's top-right corner, level with the heading. A role label
// leads with its icon there (NL-Join-*, NL-Reveal-*): a person or a shield.
export function Window({ title, variant, chip, chipIcon, children }: WindowProps) {
  const variantClass = WINDOW_VARIANT_CLASS[variant]

  return (
    <section
      className={cn(
        'relative rounded-card border-[3px] border-border-subtle bg-card shadow-window work:border',
        variantClass.window,
      )}
    >
      {/* In Work the bar dissolves (`contents`): the title and the dots go, and
          the chip, still one element, moves to the card's corner as plain text. */}
      <div className="flex h-11 items-center justify-between gap-2.5 border-b-[3px] border-border-subtle bg-primary px-3.5 font-label text-[12px] text-primary-foreground work:contents">
        <span className="truncate work:hidden">{title}</span>

        <span className="flex shrink-0 items-center gap-2.5 work:absolute work:top-4 work:right-4 work:tablet:top-8 work:tablet:right-8">
          {chip && (
            <Chip className="work:gap-2 work:border-0 work:bg-transparent work:p-0 work:font-body work:text-[13px] work:leading-4 work:font-medium work:text-muted-foreground">
              {chipIcon && <Sprite source={chipIcon} className="hidden size-3.5 opacity-80 work:block" />}
              {chip}
            </Chip>
          )}
          <span className="contents work:hidden">
            <WindowChrome />
          </span>
        </span>
      </div>

      {/* One set of paddings by default. The artboards vary them by a few pixels
          per screen — 28/36/36 on Active against 32/40/36 on Join — with nothing
          in §5 to reconcile them, so the wider pair wins. A screen whose content
          doesn't fit that says so in its WINDOW_VARIANT_CLASS body. */}
      <div
        className={cn(
          'flex flex-col gap-5 px-4 pt-[18px] pb-5 tablet:gap-[18px] tablet:px-7 tablet:pt-5 tablet:pb-7 desktop:px-10 desktop:pt-8 desktop:pb-9 work:p-4 work:tablet:gap-6 work:tablet:p-8',
          variantClass.body,
        )}
      >
        {children}
      </div>
    </section>
  )
}
