import { useLoaderData, useParams } from 'react-router'
import { ErrorBanner } from '@/components/ErrorBanner'
import { LiveUpdatesStopped } from '@/components/LiveUpdatesStopped'
import { PageLayout } from '@/components/PageLayout'
import { RevealWindow } from '@/components/RevealWindow'
import { SpriteScatter } from '@/components/SpriteScatter'
import { StartSessionLink } from '@/components/StartSessionLink'
import { useChangeFlash, useContent, useSessionConnection } from '@/hooks'
import type { EndedLoaderData } from '@/types'
import { endedView, revealChip } from '@/utils'

// The Reveal screen (DESIGN.md §7). endedLoader's REST read draws it first;
// the live connection endedLoader opened takes over once it sends a Reveal of
// its own, since votes keep changing after the end. Whoever can still vote
// does it on the grid, and every change flashes on everyone else's screen.
//
// "Start a new session" sits in the header from tablet up and full width at
// the bottom on mobile, as End does on Active. Everyone gets it — the artboard
// draws it for either role, and the Session it would start is a fresh one.
// Default export so router.tsx can lazy() it directly.
export default function EndedPage() {
  const sessionId = useParams().sessionId!
  const { session, viewer } = useLoaderData() as EndedLoaderData
  const { state, select, dismissError } = useSessionConnection(sessionId)
  const live = endedView(state)
  const reveal = live.reveal ?? session.reveal
  const flashes = useChangeFlash(reveal, live.name)
  const content = useContent()

  return (
    <PageLayout actions={<StartSessionLink className="hidden text-[12px] tablet:inline-flex work:h-9 work:px-4 work:text-[14px] work:font-semibold" />}>
      <div className="relative isolate flex justify-center px-3 pt-8 pb-16 tablet:px-10 tablet:pt-10 work:pt-4 work:pb-10 work:tablet:pt-8 work:tablet:pb-14 work:desktop:pt-10 work:desktop:pb-16">
        <SpriteScatter />

        <RevealWindow
          axisValues={session.pointSystem.axisValues}
          reveal={reveal}
          selection={live.selection}
          onSelect={live.canVote ? ({ time, resource }) => select(time, resource) : undefined}
          flashes={flashes}
          description={session.description}
          chip={revealChip(viewer, content.role)}
          isScreenHeading
        >
          {live.error && <ErrorBanner error={live.error} onDismiss={dismissError} />}

          <StartSessionLink className="h-[52px] w-full text-[14px] tablet:hidden work:h-12 work:text-[15px] work:font-semibold" />
        </RevealWindow>
      </div>

      {!live.isLive && <LiveUpdatesStopped />}
    </PageLayout>
  )
}
