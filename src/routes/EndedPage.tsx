import { useLoaderData } from 'react-router'
import { PageLayout } from '@/components/PageLayout'
import { RevealWindow } from '@/components/RevealWindow'
import { SpriteScatter } from '@/components/SpriteScatter'
import { StartSessionLink } from '@/components/StartSessionLink'
import type { EndedLoaderData } from '@/types'
import { revealChip } from '@/utils'

// The Reveal screen (DESIGN.md §7), straight from REST. No socket — endedLoader
// already has it all, including what this tab still knows about who is looking.
//
// "Start a new session" sits in the header from tablet up and full width at
// the bottom on mobile, as End does on Active. Everyone gets it — the artboard
// draws it for either role, and the Session it would start is a fresh one.
// Default export so router.tsx can lazy() it directly.
export default function EndedPage() {
  const { session, viewer } = useLoaderData() as EndedLoaderData

  return (
    <PageLayout actions={<StartSessionLink className="hidden text-[12px] tablet:inline-flex" />}>
      <div className="relative isolate flex justify-center px-3 pt-8 pb-16 tablet:px-10 tablet:pt-10">
        <SpriteScatter />

        <RevealWindow
          axisValues={session.pointSystem.axisValues}
          reveal={session.reveal}
          selection={viewer.selection}
          chip={revealChip(viewer)}
          isScreenHeading
        >
          <StartSessionLink className="h-[52px] w-full text-[14px] tablet:hidden" />
        </RevealWindow>
      </div>
    </PageLayout>
  )
}
