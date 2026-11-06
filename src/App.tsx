import { RouterProvider } from 'react-router'
import { ThemeProvider } from '@/components/ThemeProvider'
import { router } from '@/routes/router'

// The theme wraps the router so the switch's choice survives every navigation.
export default function App() {
  return (
    <ThemeProvider>
      <RouterProvider router={router} />
    </ThemeProvider>
  )
}
