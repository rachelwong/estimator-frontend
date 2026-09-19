import { createBrowserRouter, RouterProvider } from 'react-router'
import { CreateSessionPage } from '@/routes/CreateSessionPage'
import { createSessionAction } from '@/routes/loaders'

// Phase 4 builds the real table. For now "/" is real and /:sessionId/start is
// a stub, just enough to prove the create flow lands somewhere.
const router = createBrowserRouter([
  {
    path: '/',
    element: <CreateSessionPage />,
    action: createSessionAction,
  },
  {
    path: '/:sessionId/start',
    element: <main className="p-10 text-center">Session started.</main>,
  },
])

export default function App() {
  return <RouterProvider router={router} />
}
