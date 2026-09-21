import { LoadingWindow } from "@/components/LoadingWindow";
import { RoutePath } from "@/constants";
import { AppError } from "@/routes/AppError";
import { JoinSessionPage } from "@/routes/JoinSessionPage";
import {
  createSessionAction,
  endedLoader,
  joinAction,
  joinLoader,
  startLoader,
} from "@/routes/loaders";
import { NotFoundPage } from "@/routes/NotFoundPage";
import { RootLayout } from "@/routes/RootLayout";
import { lazy } from "react";
import { createBrowserRouter, redirect } from "react-router";

// only-export-components wants the lazy() handles below in their own files, so
// fast refresh can keep their state. There is none to keep here: this module
// builds the router singleton, so editing it full-reloads either way.
/* oxlint-disable react/only-export-components */

// Code-split: each of these is a chunk the entry no longer carries. Create
// is the Admin's path in, which nobody else walks; Active and
// Ended share the estimation grid. Welcome carries a sample Reveal and some
// twenty sprites that no other screen draws.
// RootLayout's Suspense boundary covers them all while a chunk loads.
//
// Join and NotFound stay eager above — both are cold-start landings, and
// neither pulls anything the entry chunk doesn't already have.
const WelcomePage = lazy(() => import("@/routes/WelcomePage"));
const CreateSessionPage = lazy(() => import("@/routes/CreateSessionPage"));
const ActiveSessionPage = lazy(() => import("@/routes/ActiveSessionPage"));
const EndedPage = lazy(() => import("@/routes/EndedPage"));

// One route per session status. Loaders redirect a wrong-status visit, so no
// page ever maps a status to a screen. See PLAN.md "Routes".
export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    // First load has no navigation to track, and is usually the cold start.
    hydrateFallbackElement: <LoadingWindow />,
    // Replaces RootLayout, which is only loading states — AppError brings its
    // own PageLayout, as every page does.
    errorElement: <AppError />,
    children: [
      {
        path: RoutePath.HOME,
        element: null,
        loader: () => redirect(RoutePath.WELCOME),
      },
      { path: RoutePath.WELCOME, element: <WelcomePage /> },
      {
        path: RoutePath.NEW,
        element: <CreateSessionPage />,
        action: createSessionAction,
      },
      { path: "/not-found", element: <NotFoundPage /> },
      // Redirect-only. element: null, not omitted — this route renders while
      // /join's loader runs, and an undefined element warns.
      {
        path: "/:sessionId",
        element: null,
        loader: ({ params }) => redirect(`/${params.sessionId}/join`),
      },
      {
        path: "/:sessionId/join",
        element: <JoinSessionPage />,
        loader: joinLoader,
        action: joinAction,
      },
      {
        path: "/:sessionId/start",
        element: <ActiveSessionPage />,
        loader: startLoader,
      },
      {
        path: "/:sessionId/ended",
        element: <EndedPage />,
        loader: endedLoader,
      },
      { path: "*", element: null, loader: () => redirect("/not-found") },
    ],
  },
]);
