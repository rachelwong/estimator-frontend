import { Link } from 'react-router'
import { Button } from '@/components/ui/button'
import { RoutePath } from '@/constants'

export function NotFoundPage() {
  return (
    <main className="mx-auto grid max-w-md gap-4 px-6 py-10 text-center">
      <h2 className="text-xl font-semibold">Session not found</h2>

      <Button asChild>
        <Link to={RoutePath.NEW}>Create new session</Link>
      </Button>
    </main>
  )
}
