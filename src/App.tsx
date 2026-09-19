import { createBrowserRouter, RouterProvider } from 'react-router'
import { AppHeader } from '@/components/AppHeader'
import { Button } from '@/components/ui/button'

// Placeholder until Phase 4 builds the real route table. It renders the header
// and one shadcn primitive, which is all Phase 1 needs to prove out.
function PlaceholderPage() {
  return (
    <>
      <AppHeader />
      <main className="mx-auto max-w-3xl px-6 py-10 text-center">
        <p className="mb-6 text-muted-foreground">
          Create a session to start estimating.
        </p>
        <Button>Start Session</Button>
      </main>
    </>
  )
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <PlaceholderPage />,
  },
])

export default function App() {
  return <RouterProvider router={router} />
}
