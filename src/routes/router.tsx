import { lazy } from 'react'
import { createBrowserRouter, redirect } from 'react-router'
import { AppHeader } from '@/components/AppHeader'
import { LoadingNotice } from '@/components/LoadingNotice'
import { RoutePath } from '@/constants'
import { AppError } from '@/routes/AppError'
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
import { WelcomePage } from '@/routes/WelcomePage'

// only-export-components wants the lazy() handles below in their own files, so
// fast refresh can keep their state. There is none to keep here: this module
// builds the router singleton, so editing it full-reloads either way.
/* oxlint-disable react/only-export-components */

// Code-split: each of these is a chunk the entry no longer carries. Create
// pulls in the Radix slider and radio-group; Active and Ended share the
// estimation grid, and through it the Radix tooltip and floating-ui.
// RootLayout's Suspense boundary covers them all while a chunk loads.
//
// Welcome, Join and NotFound stay eager above — all three are cold-start
// landings, and none pulls anything the entry chunk doesn't already have.
const CreateSessionPage = lazy(() => import('@/routes/CreateSessionPage'))
const ActiveSessionPage = lazy(() => import('@/routes/ActiveSessionPage'))
const EndedPage = lazy(() => import('@/routes/EndedPage'))

// One route per session status. Loaders redirect a wrong-status visit, so no
// page ever maps a status to a screen. See PLAN.md "Routes".
export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    // First load has no navigation to track, and is usually the cold start. It
    // replaces RootLayout, so it brings its own header.
    hydrateFallbackElement: (
      <>
        <AppHeader />
        <LoadingNotice />
      </>
    ),
    children: [
      {
        // Pathless, so a failed page renders AppError inside RootLayout's
        // Outlet and keeps the header. On the root route it would replace it.
        errorElement: <AppError />,
        children: [
          { path: RoutePath.HOME, element: null, loader: () => redirect(RoutePath.WELCOME) },
          { path: RoutePath.WELCOME, element: <WelcomePage /> },
          { path: RoutePath.NEW, element: <CreateSessionPage />, action: createSessionAction },
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
          { path: '*', element: null, loader: () => redirect('/not-found') },
        ],
      },
    ],
  },
])
