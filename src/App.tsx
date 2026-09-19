import { createBrowserRouter, RouterProvider } from 'react-router'

// The real route table lands in Phase 4. One placeholder route for now, so the
// router has something to match on "/" — an empty array logs a "no routes
// matched" error on every load.
const router = createBrowserRouter([
  {
    path: '/',
    element: <main>Product Poker</main>,
  },
])

export default function App() {
  return <RouterProvider router={router} />
}
