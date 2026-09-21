import { Suspense } from 'react'
import { Outlet, useNavigation } from 'react-router'
import { LoadingNotice } from '@/components/LoadingNotice'
import { LoadingWindow } from '@/components/LoadingWindow'

// Pathless root: the loading states every page shares. Holds no session state,
// and draws no chrome — each page brings its own PageLayout.
export function RootLayout() {
  const navigation = useNavigation()

  return (
    <>
      {/* One boundary for every code-split page in router.tsx. A missing chunk
          leaves no page at all, so this one stands in for the whole page. */}
      <Suspense fallback={<LoadingWindow />}>
        <Outlet />
      </Suspense>

      {/* A navigation, on the other hand, still has the page it left on screen
          — so the pending state is a strip over it, not a replacement for it. */}
      {navigation.state !== 'idle' && <LoadingNotice />}
    </>
  )
}
