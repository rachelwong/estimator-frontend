import type { ReactNode } from 'react'
import { Link } from 'react-router'
import { LogoLockup } from '@/components/LogoLockup'
import { RoutePath } from '@/constants'

interface PageLayoutProps {
  /** The screen's own controls, on the right of the header. */
  actions?: ReactNode
  children: ReactNode
  /** Under the page's content. Every screen outside a session has one (§7 item 9). */
  footer?: ReactNode
}

// Every screen's frame (DESIGN.md §5, §7): the white bar stuck to the top — the
// lockup on the left, the screen's own controls on the right, a 3px ink rule
// beneath — over the page's content, which fills at least the rest of the screen.
// The lockup is a link, not a heading: each screen's own heading is its h1.
//
// One height and one side padding on every screen (§5), so the lockup never
// jumps between pages. The padding is Welcome's page gutter.
//
// Each page renders its own, so its controls are a plain prop. The header
// remounts on a page change as a result, and the logo's 7s cycle starts over.
//
// z-20 keeps the header above what scrolls under it: the share bar at z-10, and
// the grid's tooltip and popover, which stay inside their page's stacking context.
export function PageLayout({ actions, children, footer }: PageLayoutProps) {
  return (
    <div className="flex min-h-dvh flex-col">
      <header className="sticky top-0 z-20 flex h-16 shrink-0 items-center justify-between gap-4 border-b-[3px] border-ink bg-white px-5 tablet:h-[72px] tablet:px-10 desktop:h-[84px] desktop:px-20">
        <Link to={RoutePath.WELCOME} aria-label="Fold and Flip home">
          <LogoLockup />
        </Link>

        <div className="flex items-center gap-3.5">{actions}</div>
      </header>

      <main className="flex flex-1 flex-col">{children}</main>

      {footer}
    </div>
  )
}
