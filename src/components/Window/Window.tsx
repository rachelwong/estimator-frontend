import type { ReactNode } from 'react'
import { Chip } from '@/components/Chip'
import { WINDOW_VARIANT_CLASS } from '@/constants'
import { cn } from '@/lib/utils'
import type { WindowVariant } from '@/types'
import { WindowChrome } from './WindowChrome'

interface WindowProps {
  /** Silkscreen, lower case, one or two words: `live`, `revealed`, `new-session`. */
  title: string
  /** Which screen this is framing — it settles the width and the body padding. */
  variant: WindowVariant
  /** The status chip beside the chrome — "Admin", "Participant", "error". */
  chip?: string
  children: ReactNode
}

// The frame around every working surface (DESIGN.md §4): 3px ink edge, an 8px
// offset shadow, a 44px accent title bar with a white Silkscreen title, and a
// 3px ink rule under the bar.
//
// A plain <section>, not a dialog or a region: it is the page's own content in
// a costume, and announcing a landmark on every screen would add a level to
// navigate through for a decoration. The heading inside it is what a screen
// reader has always had to go on.
//
// The design gives each screen its own width and body padding (§5), so the
// window is told which screen it is framing and reads both off WINDOW_VARIANT_CLASS.
// No caller passes classes in: none of them varies what it would pass.
export function Window({ title, variant, chip, children }: WindowProps) {
  const variantClass = WINDOW_VARIANT_CLASS[variant]

  return (
    <section
      className={cn('border-[3px] border-ink bg-white shadow-px-window', variantClass.window)}
    >
      <div className="flex h-11 items-center justify-between gap-2.5 border-b-[3px] border-ink bg-accent px-3.5 font-label text-[12px] text-white">
        <span className="truncate">{title}</span>

        <span className="flex shrink-0 items-center gap-2.5">
          {chip && <Chip>{chip}</Chip>}
          <WindowChrome />
        </span>
      </div>

      {/* One set of paddings by default. The artboards vary them by a few pixels
          per screen — 28/36/36 on Active against 32/40/36 on Join — with nothing
          in §5 to reconcile them, so the wider pair wins. A screen whose content
          doesn't fit that says so in its WINDOW_VARIANT_CLASS body. */}
      <div
        className={cn(
          'flex flex-col gap-5 px-4 pt-[18px] pb-5 tablet:gap-[18px] tablet:px-7 tablet:pt-5 tablet:pb-7 desktop:px-10 desktop:pt-8 desktop:pb-9',
          variantClass.body,
        )}
      >
        {children}
      </div>
    </section>
  )
}
