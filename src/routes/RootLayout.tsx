import { Suspense, useState } from 'react'
import { Outlet, useNavigation } from 'react-router'
import { AppHeader } from '@/components/AppHeader'
import { LoadingNotice } from '@/components/LoadingNotice'
import { LoadingWindow } from '@/components/LoadingWindow'
import { HeaderSlotContext } from '@/lib/headerSlot'

// Pathless root: hosts the header and the pending notice for every page and
// navigation. Holds no session state — each page still owns its own route, and
// portals any header controls it has into the header's slot.
export function RootLayout() {
  const navigation = useNavigation()
  // State, not a ref: pages need a re-render once the slot exists.
  const [headerSlot, setHeaderSlot] = useState<HTMLElement | null>(null)

  return (
    <HeaderSlotContext value={headerSlot}>
      <AppHeader actionsRef={setHeaderSlot} />

      {/* One boundary for every code-split page under @/routes/lazy. A missing
          chunk leaves no page at all, so this one takes the whole page area. */}
      <Suspense fallback={<LoadingWindow />}>
        <Outlet />
      </Suspense>

      {/* A navigation, on the other hand, still has the page it left on screen
          — so the pending state is a strip over it, not a replacement for it. */}
      {navigation.state !== 'idle' && <LoadingNotice />}
    </HeaderSlotContext>
  )
}
