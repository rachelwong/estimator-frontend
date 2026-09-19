import { createBrowserRouter, redirect } from 'react-router'
import { AppHeader } from '@/components/AppHeader'
import { LoadingNotice } from '@/components/LoadingNotice'
import { ActiveSessionPage } from '@/routes/ActiveSessionPage'
import { AppError } from '@/routes/AppError'
import { CreateSessionPage } from '@/routes/CreateSessionPage'
import { EndedPage } from '@/routes/EndedPage'
import { GridPreviewPage } from '@/routes/dev/GridPreviewPage'
import { JoinSessionPage } from '@/routes/JoinSessionPage'
import {
  createSessionAction,
  endedLoader,
  joinAction,
  joinLoader,
  startLoader,
} from '@/routes/loaders'
import { NotFoundPage } from '@/routes/NotFoundPage'
import { RootLayout } from '@/routes/RootLayout'

// One route per session status. Loaders redirect a wrong-status visit, so no
// page ever maps a status to a screen. See PLAN.md "Routes".
export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    errorElement: <AppError />,
    // First load has no navigation to track, and is usually the cold start.
    hydrateFallbackElement: (
      <>
        <AppHeader />
        <LoadingNotice />
      </>
    ),
    children: [
      { path: '/', element: <CreateSessionPage />, action: createSessionAction },
      { path: '/not-found', element: <NotFoundPage /> },
      // Redirect-only. element: null, not omitted — this route renders while
      // /join's loader runs, and an undefined element warns.
      {
        path: '/:sessionId',
        element: null,
        loader: ({ params }) => redirect(`/${params.sessionId}/join`),
      },
      {
        path: '/:sessionId/join',
        element: <JoinSessionPage />,
        loader: joinLoader,
        action: joinAction,
      },
      { path: '/:sessionId/start', element: <ActiveSessionPage />, loader: startLoader },
      { path: '/:sessionId/ended', element: <EndedPage />, loader: endedLoader },
      // Temporary grid preview, dev builds only. Removed in Phase 12.
      ...(import.meta.env.DEV ? [{ path: '/dev/grid', element: <GridPreviewPage /> }] : []),
      { path: '*', element: null, loader: () => redirect('/not-found') },
    ],
  },
])
