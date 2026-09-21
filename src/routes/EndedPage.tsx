import { useLoaderData } from 'react-router'
import { RevealView } from '@/components/RevealView'
import type { EndedLoaderData } from '@/types'

// The Reveal, straight from REST. No socket — endedLoader already has it all,
// including what this tab still knows about who is looking.
// Default export so router.tsx can lazy() it directly.
export default function EndedPage() {
  const { session, viewer } = useLoaderData() as EndedLoaderData

  return <RevealView session={session} viewer={viewer} />
}
