import { Link, useLoaderData } from 'react-router'
import { AbstainedList } from '@/components/AbstainedList'
import { EstimationGrid } from '@/components/EstimationGrid'
import { SessionStatusHeader } from '@/components/SessionStatusHeader'
import { Button } from '@/components/ui/button'
import { GridMode, RoutePath } from '@/constants'
import type { GetSessionResponse } from '@/types'

// The Reveal, straight from REST. No socket — endedLoader already has it all.
// Default export so router.tsx can lazy() it directly.
export default function EndedPage() {
  const session = useLoaderData() as GetSessionResponse

  return (
    <main className="mx-auto grid max-w-3xl gap-6 px-6 py-10">
      <SessionStatusHeader label="Ended" />

      <EstimationGrid
        axisValues={session.pointSystem.axisValues}
        mode={GridMode.READONLY}
        reveal={session.reveal}
      />

      <AbstainedList names={session.reveal?.abstained ?? []} />

      {/* A plain link: the new session carries nothing over. */}
      <Button asChild>
        <Link to={RoutePath.NEW}>Create new session</Link>
      </Button>
    </main>
  )
}
