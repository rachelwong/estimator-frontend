import { Suspense } from 'react'
import { Outlet, useNavigation } from 'react-router'
import { AppHeader } from '@/components/AppHeader'
import { LoadingNotice } from '@/components/LoadingNotice'
import { LoadingWindow } from '@/components/LoadingWindow'

// Pathless root: hosts the header and the pending notice for every page and
// navigation. Holds no session state — each page still owns its own route.
export function RootLayout() {
  const navigation = useNavigation()

  return (
    <>
      <AppHeader />
      {/* One boundary for every code-split page under @/routes/lazy. A missing
          chunk leaves no page at all, so this one takes the whole page area. */}
      <Suspense fallback={<LoadingWindow />}>
        <Outlet />
      </Suspense>

      {/* A navigation, on the other hand, still has the page it left on screen
          — so the pending state is a strip over it, not a replacement for it. */}
      {navigation.state !== 'idle' && <LoadingNotice />}
    </>
  )
}
