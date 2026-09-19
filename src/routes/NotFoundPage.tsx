import { Link } from 'react-router'
import { Button } from '@/components/ui/button'

export function NotFoundPage() {
  return (
    <main className="mx-auto grid max-w-md gap-4 px-6 py-10 text-center">
      <h2 className="text-xl font-semibold">Session not found</h2>

      <Button asChild>
        <Link to="/">Create new session</Link>
      </Button>
    </main>
  )
}
