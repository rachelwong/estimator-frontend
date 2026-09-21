import type { ReactNode } from 'react'
import { Chip } from '@/components/Chip'
import { cn } from '@/lib/utils'
import { WindowChrome } from './WindowChrome'

interface WindowProps {
  /** Silkscreen, lower case, one or two words: `live`, `revealed`, `new-session`. */
  title: string
  /** The status chip beside the chrome — "Admin", "Participant", "error". */
  chip?: string
  children: ReactNode
  /** Width, and anything else about where the window sits on its page. */
  className?: string
  /** Overrides the body's padding and gap, for a screen whose artboard differs. */
  bodyClassName?: string
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
// Width belongs to the caller — the design gives each screen its own (§5), and
// a window that chose its own would have to know which screen it was on.
export function Window({ title, chip, children, className, bodyClassName }: WindowProps) {
  return (
    <section className={cn('border-[3px] border-ink bg-white shadow-px-window', className)}>
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
          doesn't fit that overrides it through bodyClassName. */}
      <div
        className={cn(
          'flex flex-col gap-5 px-4 pt-[18px] pb-5 tablet:gap-[18px] tablet:px-7 tablet:pt-5 tablet:pb-7 desktop:px-10 desktop:pt-8 desktop:pb-9',
          bodyClassName,
        )}
      >
        {children}
      </div>
    </section>
  )
}
