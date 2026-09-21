import type { Ref } from 'react'
import { Link } from 'react-router'
import { LogoLockup } from '@/components/LogoLockup'
import { RoutePath } from '@/constants'

interface AppHeaderProps {
  /** The right-hand slot, which pages portal their controls into (see lib/headerSlot). */
  actionsRef?: Ref<HTMLDivElement>
}

// The white bar across the top of every screen (DESIGN.md §5, §7): the lockup on
// the left, the screen's own controls on the right, a 3px ink rule beneath.
//
// Rendered once by RootLayout, so it stays mounted across pages and the logo's
// 7s cycle never restarts. The right side is an empty element the current page
// fills through a portal — a page can't hand children up through <Outlet>.
export function AppHeader({ actionsRef }: AppHeaderProps) {
  return (
    <header className="relative z-10 flex h-[60px] shrink-0 items-center justify-between gap-4 border-b-[3px] border-ink bg-white px-4 tablet:h-[72px] tablet:px-10">
      <h1>
        <Link to={RoutePath.WELCOME} aria-label="Fold and Flip home">
          <LogoLockup />
        </Link>
      </h1>

      <div ref={actionsRef} className="flex items-center gap-3.5" />
    </header>
  )
}
