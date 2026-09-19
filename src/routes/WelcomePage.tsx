import { Link } from 'react-router'
import { Button } from '@/components/ui/button'
import { RoutePath } from '@/constants'

// Home for creators. Joiners arrive on /:id/join and never see it.
export function WelcomePage() {
  return (
    <main className="mx-auto grid max-w-md gap-6 px-6 py-10">
      <h2 className="text-xl font-semibold">Estimate together on two axes.</h2>

      <ol className="grid list-decimal gap-2 pl-5">
        <li>Pick a Square for Time × Resources — privately.</li>
        <li>The Admin ends the Session.</li>
        <li>The Reveal shows where everyone landed. Talk it over.</li>
      </ol>

      <Button asChild>
        <Link to={RoutePath.NEW}>Create a new session</Link>
      </Button>
    </main>
  )
}
