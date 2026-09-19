import { Link } from 'react-router'
import { RoutePath } from '@/constants'

// Rendered once by RootLayout, above every page. The wireframe centres the title above a
// centred grid, so the whole app shares one centred column.
export function AppHeader() {
  return (
    <header className="border-b border-border">
      <div className="mx-auto max-w-3xl px-6 py-5">
        <h1 className="text-center font-heading text-3xl font-semibold tracking-tight">
          <Link to={RoutePath.WELCOME}>Product Poker</Link>
        </h1>
      </div>
    </header>
  )
}
