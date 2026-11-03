import { Suspense } from 'react'
import { Outlet, useNavigation } from 'react-router'
import { Analytics } from '@vercel/analytics/react'
import { LoadingNotice } from '@/components/LoadingNotice'
import { LoadingWindow } from '@/components/LoadingWindow'
import { redactSessionId } from '@/utils'

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

      {/* Here, not in App, so the first page view lands after any loader
          redirect (docs/plans/analytics.md, decision #5). */}
      <Analytics beforeSend={redactSessionId} />

      {/* A navigation, on the other hand, still has the page it left on screen
          — so the pending state is a strip over it, not a replacement for it. */}
      {navigation.state !== 'idle' && <LoadingNotice />}
    </>
  )
}
